import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseMysteelLithium, convertLithiumToUsd, fetchMysteelLithiumSeries,
  mergeMysteelLithiumSeries, lithiumQuoteEnd, LITHIUM_CODE, LITHIUM_BENCHMARK,
} from '../lib/sources/mysteel-lithium.mjs';

const fixture = (overrides = {}) => ({
  xAxis: ['2026-10-13', '2026-10-12'], unitName: '元/吨',
  indexName: '碳酸锂：电池级：Li2CO3≥99.5%：早盘市场价格：中华人民共和国（日度）',
  indexCode: LITHIUM_CODE,
  datas: [{ indexCode: LITHIUM_CODE, yAxis: ['107250', '114600'] }],
  ...overrides,
});
const payload = (row = fixture()) => `instap(${JSON.stringify({ isValid: true, status: '200', response: JSON.stringify([row]) })})`;
const rates = [
  { date: '2026-10-09', base: 'USD', quote: 'CNY', rate: 6.6921 },
  { date: '2026-10-12', base: 'USD', quote: 'CNY', rate: 6.6928 },
];

test('aligns reverse-ordered source dates with battery-grade AM prices', () => {
  const points = parseMysteelLithium(payload());
  assert.deepEqual(points.map(({ date, nativePrice }) => ({ date, nativePrice })), [
    { date: '2026-10-12', nativePrice: 114600 }, { date: '2026-10-13', nativePrice: 107250 },
  ]);
});

test('rejects a changed unit, grade, product, country or AM/PM session', () => {
  for (const row of [
    fixture({ unitName: '美元/吨' }),
    fixture({ indexName: '碳酸锂：工业级：Li2CO3≥99.2%：早盘市场价格：中华人民共和国（日度）' }),
    fixture({ indexName: '氢氧化锂：电池级：Li2CO3≥99.5%：早盘市场价格：中华人民共和国（日度）' }),
    fixture({ indexName: '碳酸锂：电池级：Li2CO3≥99.5%：晚盘市场价格：中华人民共和国（日度）' }),
    fixture({ indexName: '碳酸锂：电池级：Li2CO3≥99.5%：早盘市场价格：美国（日度）' }),
    fixture({ indexCode: 'ID01720085' }),
  ]) assert.throws(() => parseMysteelLithium(payload(row)));
});

test('JSONP is parsed without executing code or accepting an executable tail', () => {
  globalThis.lithiumTestExecuted = false;
  assert.throws(() => parseMysteelLithium('instap(globalThis.lithiumTestExecuted=true)'));
  assert.throws(() => parseMysteelLithium(`${payload()};globalThis.lithiumTestExecuted=true`));
  assert.equal(globalThis.lithiumTestExecuted, false);
  delete globalThis.lithiumTestExecuted;
});

test('missing observations stay absent; misaligned arrays and conflicting dates fail', () => {
  assert.equal(parseMysteelLithium(payload(fixture({ datas: [{ indexCode: LITHIUM_CODE, yAxis: ['--', '114600'] }] }))).length, 1);
  for (const row of [
    fixture({ datas: [{ indexCode: LITHIUM_CODE, yAxis: ['107250'] }] }),
    fixture({ xAxis: ['2026-10-13', '2026-10-13'] }),
    fixture({ xAxis: ['2026-02-30', '2026-10-12'] }),
    fixture({ datas: [{ indexCode: LITHIUM_CODE, yAxis: ['0', '114600'] }] }),
    fixture({ datas: [{ indexCode: LITHIUM_CODE, yAxis: [true, '114600'] }] }),
  ]) assert.throws(() => parseMysteelLithium(payload(row)));
});

test('converts by dividing by CNY per USD and records the true FX date', () => {
  const points = convertLithiumToUsd(parseMysteelLithium(payload()), rates);
  assert.equal(points.at(-1).price, 16024.68);
  assert.equal(points.at(-1).nativePrice, 107250);
  assert.equal(points.at(-1).fxDate, '2026-10-12');
});

test('future FX is never used and stale or wrong-direction FX blocks the batch', () => {
  const points = parseMysteelLithium(payload());
  assert.throws(() => convertLithiumToUsd(points, [{ ...rates[0], date: '2026-10-14' }]), /No sufficiently recent/);
  assert.throws(() => convertLithiumToUsd(points, [{ ...rates[0], date: '2026-10-01' }]), /No sufficiently recent/);
  assert.throws(() => convertLithiumToUsd(points, [{ ...rates[0], base: 'CNY', quote: 'USD' }]), /Invalid USD/);
});

test('history fetch pins the spot code, scopes ECB FX and filters out-of-window dates', async () => {
  const urls = [];
  const points = await fetchMysteelLithiumSeries({
    start: '2026-10-13', end: '2026-10-13', request: async (url) => {
      urls.push(url);
      return url.includes('mysteel') ? payload() : JSON.stringify(rates);
    },
  });
  assert.equal(points.length, 1);
  assert.equal(points[0].date, '2026-10-13');
  assert.equal(new URL(urls[0]).searchParams.get('indexCodes'), LITHIUM_CODE);
  assert.equal(new URL(urls[1]).searchParams.get('providers'), 'ECB');
  assert.equal(new URL(urls[1]).searchParams.get('from'), '2026-10-06');
});

test('price or FX failure cannot produce a partial converted series', async () => {
  await assert.rejects(fetchMysteelLithiumSeries({
    start: '2026-10-12', end: '2026-10-13', request: async (url) => {
      if (url.includes('frankfurter')) throw new Error('FX unavailable');
      return payload();
    },
  }), /FX unavailable/);
  await assert.rejects(fetchMysteelLithiumSeries({
    start: '2026-10-12', end: '2026-10-13', request: async (url) =>
      url.includes('mysteel') ? JSON.stringify({ isValid: false, status: '403' }) : JSON.stringify(rates),
  }), /Mysteel rejected/);
});

test('migration replaces only lithium and drops old manual anchors', () => {
  const tungsten = { data: [{ date: '2026-10-12', price: 2700 }] };
  const daily = { metals: { tungsten, lithium: { data: [{ date: '2025-12-31', price: 18000 }] } } };
  const points = convertLithiumToUsd(parseMysteelLithium(payload()), rates);
  mergeMysteelLithiumSeries(daily, points);
  assert.equal(daily.metals.tungsten, tungsten);
  assert.equal(daily.metals.lithium.benchmark, LITHIUM_BENCHMARK);
  assert.deepEqual(daily.metals.lithium.data, points);
});

test('repeat updates are idempotent and rejected conversions preserve previous data', () => {
  const daily = { metals: {} };
  const points = convertLithiumToUsd(parseMysteelLithium(payload()), rates);
  mergeMysteelLithiumSeries(daily, points);
  mergeMysteelLithiumSeries(daily, points);
  assert.equal(daily.metals.lithium.data.length, 2);
  const before = structuredClone(daily);
  assert.throws(() => mergeMysteelLithiumSeries(daily, [{ ...points[0], price: 22000 }]), /Invalid lithium/);
  assert.deepEqual(daily, before);
});

test('China publication cutoff excludes the current day until 10:20', () => {
  assert.equal(lithiumQuoteEnd(new Date('2026-10-13T02:19:59Z')), '2026-10-12');
  assert.equal(lithiumQuoteEnd(new Date('2026-10-13T02:20:00Z')), '2026-10-13');
  assert.equal(lithiumQuoteEnd(new Date('2026-10-13T18:00:00Z')), '2026-10-13'); // Oct 14 02:00 China
});
