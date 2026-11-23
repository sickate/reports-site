import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readDaily } from '../lib/daily-store.mjs';
import {
  parseCTIATungstenPost, fetchCTIATungstenSeries, mergeCTIATungstenSeries,
  TUNGSTEN_BENCHMARK,
} from '../lib/sources/ctia-tungsten.mjs';

const post = (content, date = '2026-10-12T13:54:36', id = 53543) => ({
  date, link: `https://www.ctia.com.cn/en/news/${id}.html`, content: { rendered: content },
});
const quote = post('<p>Domestic APT: RMB 490,000–520,000/ton.</p><p>European APT prices: USD 2,500–2,900/mtu.</p>');

test('extracts the European USD range and derived midpoint, with the publication date', () => {
  assert.deepEqual(parseCTIATungstenPost(quote), {
    date: '2026-10-12', price: 2700, low: 2500, high: 2900,
    sourceUrl: 'https://www.ctia.com.cn/en/news/53543.html',
  });
});

test('domestic APT, ferrotungsten and incorrect units cannot enter this benchmark', () => {
  for (const text of [
    'Domestic APT: RMB 490,000–520,000/ton.',
    'European ferrotungsten: USD 158–165/kg W.',
    'European APT: USD 2,700–2,900/ton.', // observed publisher unit typo
    'China FOB APT: USD 2,500–2,900/mtu.',
  ]) assert.equal(parseCTIATungstenPost(post(text)), null);
});

test('decodes editorial HTML entities and accepts decimal range bounds', () => {
  const parsed = parseCTIATungstenPost(post('European price of APT: US$&nbsp;825.5&#8211;900.5/mtu.'));
  assert.equal(parsed.price, 863);
  const fractional = parseCTIATungstenPost(post('European APT: USD 673.75–705/mtu.'));
  assert.equal(fractional.price, 689.38); // source range gives a fractional-cent midpoint
});

test('rejects ambiguous ranges, invalid publication dates, links and reversed bounds', () => {
  for (const p of [
    post('European APT: USD 900–825/mtu.'),
    post('European APT: USD 825–900/mtu. European APT: USD 900–945/mtu.'),
    post('European APT: USD 825–900/mtu.', '2026-02-30T12:00:00'),
    { ...quote, link: 'https://unrelated.example/news/53543.html' },
  ]) assert.equal(parseCTIATungstenPost(p), null);
});

test('paged collection filters dates, deduplicates and leaves missing quote days absent', async () => {
  const calls = [];
  const series = await fetchCTIATungstenSeries({
    start: '2026-10-01', end: '2026-10-13',
    request: async (url) => {
      calls.push(url);
      return calls.length === 1 ? { pages: 2, posts: [
        post('Domestic APT: RMB 480,000/ton.', '2026-10-13T12:00:00', 53561),
        quote,
        post('European APT: USD 2,600–2,900/mtu.', '2026-10-12T10:00:00', 53500),
      ] } : { pages: 2, posts: [
        post('European APT: USD 2,700–2,900/mtu.', '2026-10-09T12:00:00', 53476),
        post('European APT: USD 2,700–2,900/mtu.', '2026-09-30T12:00:00', 53200),
      ] };
    },
  });
  assert.equal(calls.length, 2);
  assert.equal(new URL(calls[0]).searchParams.get('categories'), '17');
  assert.deepEqual(series.map(({ date, price }) => ({ date, price })), [
    { date: '2026-10-09', price: 2800 }, { date: '2026-10-12', price: 2700 },
  ]);
});

test('an empty or interrupted archive fails instead of returning partial observations', async () => {
  await assert.rejects(fetchCTIATungstenSeries({
    start: '2026-10-01', end: '2026-10-13', request: async () => ({ pages: 0, posts: [] }),
  }), /No explicit/);
  let calls = 0;
  await assert.rejects(fetchCTIATungstenSeries({
    start: '2026-10-01', end: '2026-10-13', request: async () => {
      if (++calls === 2) throw new Error('network failure');
      return { pages: 2, posts: [quote] };
    },
  }), /network failure/);
});

test('benchmark migration drops legacy manual anchors and preserves all other metals', () => {
  const gold = { data: [{ date: '2026-10-12', price: 4000 }] };
  const daily = { metals: { gold, tungsten: { data: [{ date: '2025-12-31', price: 1050 }] } } };
  const point = parseCTIATungstenPost(quote);
  mergeCTIATungstenSeries(daily, [point]);
  assert.equal(daily.metals.gold, gold);
  assert.equal(daily.metals.tungsten.benchmark, TUNGSTEN_BENCHMARK);
  assert.equal(daily.metals.tungsten.baselineSource, 'observations-only');
  assert.deepEqual(daily.metals.tungsten.data, [point]);
});

test('same-benchmark updates keep genuinely repeated quotes dated and are idempotent', () => {
  const first = parseCTIATungstenPost(quote);
  const next = { ...first, date: '2026-10-13', sourceUrl: 'https://www.ctia.com.cn/en/news/53561.html' };
  const daily = { metals: {} };
  mergeCTIATungstenSeries(daily, [first]);
  mergeCTIATungstenSeries(daily, [next]);
  mergeCTIATungstenSeries(daily, [next]);
  assert.equal(daily.metals.tungsten.data.length, 2);
  assert.deepEqual(daily.metals.tungsten.data.map((p) => p.date), ['2026-10-12', '2026-10-13']);
});

test('an invalid migration preserves the legacy series without relabeling it', () => {
  const daily = { metals: { tungsten: { frequency: 'manual', data: [{ date: '2025-12-31', price: 1050 }] } } };
  const original = structuredClone(daily);
  assert.throws(() => mergeCTIATungstenSeries(daily, [{ ...parseCTIATungstenPost(quote), price: 1200 }]), /Invalid tungsten/);
  assert.deepEqual(daily, original);
});

test('a corrupt existing store is not treated as a missing file and erased', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tungsten-store-'));
  const file = path.join(dir, 'daily.json');
  try {
    assert.deepEqual(readDaily(file).metals, {});
    fs.writeFileSync(file, '{"metals":');
    assert.throws(() => readDaily(file), SyntaxError);
    assert.equal(fs.readFileSync(file, 'utf8'), '{"metals":');
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
