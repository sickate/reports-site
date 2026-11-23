/** Mysteel China battery-grade Li2CO3 >=99.5% AM spot, converted from CNY/t. */
import https from 'node:https';

export const LITHIUM_CODE = 'ID01551919';
export const LITHIUM_BENCHMARK = 'mysteel-china-battery-carbonate-am-usd';
export const LITHIUM_SOURCE_URL = 'https://www.mysteel.com/mmlc/';
export const LITHIUM_FX_SOURCE_URL = 'https://frankfurter.dev/providers/ecb/';
export const LITHIUM_META = {
  name: 'Lithium', unit: 'USD/ton', color: '#9b59b6', frequency: 'daily',
  frequencyLabel: 'Daily spot', source: 'Mysteel China battery-grade carbonate AM spot + ECB FX',
  sourceUrl: LITHIUM_SOURCE_URL, benchmark: LITHIUM_BENCHMARK,
  benchmarkLabel: 'China Li₂CO₃ ≥99.5% · AM spot', baselineSource: 'observations-only',
  quoteDateLabel: 'As of', sourceLinkLabel: 'Source prices', chartType: 'linear',
};

const DAY = 86400000;
function validDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`))
    && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
}

/** Do not consume a same-day AM quote before its 10:20 China publication slot. */
export function lithiumQuoteEnd(now = new Date()) {
  const china = new Date(now.getTime() + 8 * 3600000);
  const date = china.toISOString().slice(0, 10);
  return china.getUTCHours() * 60 + china.getUTCMinutes() >= 620
    ? date : new Date(Date.parse(`${date}T00:00:00Z`) - DAY).toISOString().slice(0, 10);
}

/** Parse JSON/JSONP as data only. Callback names and executable tails are rejected. */
export function parseMysteelLithium(body) {
  const text = String(body).trim();
  const wrapper = text.match(/^instap\(([\s\S]*)\)\s*;?$/);
  const outer = JSON.parse(wrapper ? wrapper[1] : text);
  if (outer.isValid !== true || String(outer.status) !== '200') throw new Error('Mysteel rejected the price request');
  const rows = typeof outer.response === 'string' ? JSON.parse(outer.response) : outer.response;
  if (!Array.isArray(rows)) throw new Error('Invalid Mysteel response');
  const selected = rows.filter((row) => row.indexCode === LITHIUM_CODE);
  if (selected.length !== 1) throw new Error('Missing or ambiguous battery-grade AM series');
  const row = selected[0];
  if (row.unitName !== '元/吨' || !/^碳酸锂：电池级：/.test(row.indexName)
    || !/Li2CO3≥99\.5%/.test(row.indexName) || !/早盘市场价格/.test(row.indexName)
    || !/中华人民共和国/.test(row.indexName)) throw new Error('Lithium benchmark specification changed');
  const lines = row.datas?.filter((line) => line.indexCode === LITHIUM_CODE);
  if (!Array.isArray(row.xAxis) || lines?.length !== 1 || !Array.isArray(lines[0].yAxis)
    || row.xAxis.length !== lines[0].yAxis.length) throw new Error('Misaligned lithium dates and prices');
  const byDate = new Map();
  row.xAxis.forEach((date, index) => {
    const value = lines[0].yAxis[index];
    if (!validDate(date)) throw new Error('Invalid lithium quote date');
    // Unpublished observations are absent, not zero and not a prior-day fill.
    if (value == null || value === '' || value === '--' || value === '-') return;
    if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+(?:\.\d+)?$/.test(value))) {
      throw new Error('Invalid lithium price format');
    }
    const nativePrice = Number(value);
    if (!Number.isFinite(nativePrice) || nativePrice <= 0) throw new Error('Invalid lithium price');
    if (byDate.has(date) && byDate.get(date).nativePrice !== nativePrice) throw new Error('Conflicting lithium quotes');
    byDate.set(date, { date, nativePrice, nativeUnit: 'CNY/ton', sourceUrl: LITHIUM_SOURCE_URL });
  });
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Use same-day or preceding ECB FX, never a future rate, bounded to seven days. */
export function convertLithiumToUsd(points, rates) {
  if (!Array.isArray(rates) || rates.some((rate) => !validDate(rate.date)
    || rate.base !== 'USD' || rate.quote !== 'CNY' || !Number.isFinite(rate.rate) || rate.rate <= 0)) {
    throw new Error('Invalid USD/CNY exchange-rate history');
  }
  const sortedRates = [...rates].sort((a, b) => a.date.localeCompare(b.date));
  return points.map((point) => {
    const fx = sortedRates.filter((rate) => rate.date <= point.date).at(-1);
    if (!fx || Date.parse(point.date) - Date.parse(fx.date) > 7 * DAY) {
      throw new Error(`No sufficiently recent historical FX for ${point.date}`);
    }
    return {
      ...point, price: Math.round(point.nativePrice / fx.rate * 100) / 100,
      usdCny: fx.rate, fxDate: fx.date, fxSourceUrl: LITHIUM_FX_SOURCE_URL,
    };
  });
}

function getText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      family: 4, headers: { 'User-Agent': 'InstapResearch/1.0', Referer: LITHIUM_SOURCE_URL, Accept: 'application/json,*/*' },
    }, (res) => {
      if (res.statusCode !== 200) { res.resume(); reject(new Error(`Lithium source HTTP ${res.statusCode}`)); return; }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
        if (body.length > 2 * 1024 * 1024) req.destroy(new Error('Lithium response too large'));
      });
      res.on('end', () => resolve(body));
      res.on('error', reject);
    });
    req.setTimeout(20000, () => req.destroy(new Error('Lithium source timeout')));
    req.on('error', reject);
  });
}

export async function fetchMysteelLithiumSeries({ start, end, request = getText } = {}) {
  if (!validDate(start) || !validDate(end) || start > end) throw new Error('Invalid lithium date window');
  const priceQuery = new URLSearchParams({ indexCodes: LITHIUM_CODE, startTime: start, endTime: end, callback: 'instap' });
  // Include FX before the first Chinese trading day (different holiday calendars).
  const fxStart = new Date(Date.parse(`${start}T00:00:00Z`) - 7 * DAY).toISOString().slice(0, 10);
  const fxQuery = new URLSearchParams({ from: fxStart, to: end, base: 'USD', quotes: 'CNY', providers: 'ECB' });
  const results = await Promise.allSettled([
    request(`https://openapi.mysteel.com/publishd/index/chart/dateData?${priceQuery}`),
    request(`https://api.frankfurter.dev/v2/rates?${fxQuery}`),
  ]);
  const failed = results.find((result) => result.status === 'rejected');
  if (failed) throw failed.reason;
  const points = parseMysteelLithium(results[0].value).filter((point) => point.date >= start && point.date <= end);
  if (!points.length) throw new Error('No battery-grade lithium spot observations in requested window');
  return convertLithiumToUsd(points, JSON.parse(results[1].value));
}

/** New benchmark uses only sourced dates and historical FX, never manual anchors. */
export function mergeMysteelLithiumSeries(daily, series) {
  if (!Array.isArray(series) || !series.length || series.some((point) =>
    !validDate(point.date) || !Number.isFinite(point.nativePrice) || point.nativePrice <= 0
    || point.nativeUnit !== 'CNY/ton' || !validDate(point.fxDate) || point.fxDate > point.date
    || Date.parse(point.date) - Date.parse(point.fxDate) > 7 * DAY
    || !Number.isFinite(point.usdCny) || point.usdCny <= 0
    || point.price !== Math.round(point.nativePrice / point.usdCny * 100) / 100
    || point.sourceUrl !== LITHIUM_SOURCE_URL || point.fxSourceUrl !== LITHIUM_FX_SOURCE_URL)) {
    throw new Error('Invalid lithium observations; previous data preserved');
  }
  const previous = daily.metals.lithium;
  const byDate = new Map(previous?.benchmark === LITHIUM_BENCHMARK
    ? previous.data.map((point) => [point.date, point]) : []);
  series.forEach((point) => byDate.set(point.date, { ...point }));
  daily.metals.lithium = { ...LITHIUM_META, data: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)) };
  return daily.metals.lithium;
}
