import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWestmetallTable } from '../lib/sources/westmetall.mjs';
import { mergeCopperSeries, COPPER_META } from '../lib/sources/copper.mjs';

const header = '<tr><th>date</th><th>LME Copper Cash-Settlement</th><th>LME Copper 3-month</th><th>LME Copper stock</th></tr>';
const row = (date, cash, future) => `<tr><td>${date}</td><td>${cash}</td><td>${future}</td><td>233,500</td></tr>`;
const point = (date, price) => ({ date, price, sourceUrl: `${COPPER_META.sourceUrl}&year=${date.slice(0, 4)}` });
const options = { start: '2026-08-28', end: '2026-09-03' };

test('old overview suffix regex reproduces the exact Wieland Copper unit error', () => {
  const overview = '<td><a>Wieland Copper </a></td><td><a>1,414.90 </a></td>';
  const old = /Copper\s*<\/a>\s*<\/td>\s*<td>\s*<a[^>]*>\s*([\d,]+\.\d{2})\s*<\/a>/i;
  assert.equal(Number(overview.match(old)[1].replace(/,/g, '')), 1414.9);
  const wrongTable = '<th>date</th><th>Wieland Copper</th>' + row('01. September 2026', '1,414.90', '');
  assert.throws(() => parseWestmetallTable(wrongTable, { field: 'LME_Cu_cash' }), /Expected LME copper/);
});

test('exact cash column yields the real September quote, not futures or stock', () => {
  assert.deepEqual(parseWestmetallTable(header + row('01. September 2026', '14,395.50', '14,215.00'), { field: 'LME_Cu_cash' }), [
    { date: '2026-09-01', price: 14395.5 },
  ]);
});

test('scale mismatches and comma-decimal formats fail before writing', () => {
  for (const [cash, future] of [['1,414.90', '14,215.00'], ['14.395,50', '14,215.00'], ['14,395.50', '']]) {
    assert.throws(() => parseWestmetallTable(header + row('01. September 2026', cash, future), { field: 'LME_Cu_cash' }));
  }
});

test('a genuine market spike remains valid and is not smoothed away', () => {
  assert.deepEqual(parseWestmetallTable(header + row('29. January 2026', '13,844.00', '13,952.00'), { field: 'LME_Cu_cash' }), [
    { date: '2026-01-29', price: 13844 },
  ]);
});

test('invalid dates and reordered cash/futures columns are rejected', () => {
  assert.throws(() => parseWestmetallTable(header + row('30. February 2026', '14,395.50', '14,215.00'), { field: 'LME_Cu_cash' }), /Invalid LME copper quote date/);
  assert.throws(() => parseWestmetallTable(header.replace('Cash-Settlement', 'other') + row('01. September 2026', '14,395.50', '14,215.00'), { field: 'LME_Cu_cash' }), /Expected LME copper/);
});

test('historical repair replaces wrong and shifted dates and removes invented weekends', () => {
  const gold = { data: [{ date: '2026-09-01', price: 4400 }] };
  const daily = { metals: { gold, copper: { data: [
    { date: '2026-08-27', price: 14490 },
    { date: '2026-08-29', price: 14535 },
    { date: '2026-08-31', price: 14535 },
    { date: '2026-09-01', price: 1414.9 },
    { date: '2026-09-02', price: 14395.5 },
  ] } } };
  const series = [point('2026-08-28', 14535), point('2026-09-01', 14395.5), point('2026-09-02', 14355)];
  mergeCopperSeries(daily, series, options);
  assert.equal(daily.metals.gold, gold);
  assert.deepEqual(daily.metals.copper.data.map(({ date, price }) => ({ date, price })), [
    { date: '2026-08-27', price: 14490 },
    { date: '2026-08-28', price: 14535 },
    { date: '2026-09-01', price: 14395.5 },
    { date: '2026-09-02', price: 14355 },
  ]);
});

test('repeat source repairs are idempotent; missing/foreign source preserves old data', () => {
  const daily = { metals: { copper: { data: [{ date: '2026-09-01', price: 1414.9 }] } } };
  const series = [point('2026-09-01', 14395.5)];
  mergeCopperSeries(daily, series, options);
  mergeCopperSeries(daily, series, options);
  assert.equal(daily.metals.copper.data.length, 1);
  const before = structuredClone(daily);
  assert.throws(() => mergeCopperSeries(daily, [], options));
  assert.throws(() => mergeCopperSeries(daily, [{ ...series[0], sourceUrl: 'https://www.westmetall.com/en/markdaten.php?action=table&field=WI_Cu&year=2026' }], options));
  assert.deepEqual(daily, before);
});

test('an update dated October 12 does not create a false October 13 observation', () => {
  const daily = { metals: { copper: { data: [{ date: '2026-10-13', price: 14822 }] } } };
  mergeCopperSeries(daily, [point('2026-10-12', 14822)], { start: '2026-10-01', end: '2026-10-13' });
  assert.deepEqual(daily.metals.copper.data.map((p) => p.date), ['2026-10-12']);
});
