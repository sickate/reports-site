/** Public Chinatungsten market reports; indicative European APT, USD/mtu. */
import https from 'node:https';

export const TUNGSTEN_BENCHMARK = 'ctia-european-apt-usd-mtu';
export const TUNGSTEN_META = {
  name: 'Tungsten', unit: 'USD/mtu', color: '#e74c3c', frequency: 'daily',
  source: 'Chinatungsten market reports (European APT, range midpoint)',
  sourceUrl: 'https://www.ctia.com.cn/en/news/tungsten-news',
  benchmark: TUNGSTEN_BENCHMARK,
  benchmarkLabel: 'European APT · indicative range midpoint',
  frequencyLabel: 'Daily reports',
  baselineSource: 'observations-only',
};

function validDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date)
    && !Number.isNaN(Date.parse(`${date}T00:00:00Z`))
    && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
}

function plainText(html) {
  return String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, value) => String.fromCodePoint(
      value[0].toLowerCase() === 'x' ? parseInt(value.slice(1), 16) : Number(value),
    ))
    .replace(/&(?:nbsp|ensp|emsp);/g, ' ')
    .replace(/&(?:ndash|mdash);/g, '–').replace(/&dollar;/g, '$')
    .replace(/\s+/g, ' ').trim();
}

/** Only explicit European APT USD/mtu ranges qualify; unit typos are rejected. */
export function parseCTIATungstenPost(post) {
  const date = String(post.date || '').slice(0, 10); // publisher's local publication date
  if (!validDate(date)) return null;
  const sourceUrl = String(post.link || '');
  if (!/^https:\/\/www\.ctia\.com\.cn\/en\/news\/\d+\.html$/.test(sourceUrl)) return null;
  const text = plainText(post.content?.rendered || '');
  const pattern = /European\s+(?:(?:price(?:s)?\s+of\s+)?APT|ammonium\s+paratungstate(?:\s*\(APT\))?)[^.;!?]{0,140}?(?:USD|US\$|\$)\s*([\d,]+(?:\.\d+)?)\s*(?:[-–—−]|to)\s*([\d,]+(?:\.\d+)?)\s*(?:\/\s*|per\s+)mtu\b/gi;
  const ranges = [...text.matchAll(pattern)].map((match) => ({
    low: Number(match[1].replace(/,/g, '')),
    high: Number(match[2].replace(/,/g, '')),
  }));
  if (!ranges.length || ranges.some(({ low, high }) => !Number.isFinite(low)
    || !Number.isFinite(high) || low <= 0 || high < low)) return null;
  // Multiple conflicting European ranges in one article need manual review.
  if (ranges.some(({ low, high }) => low !== ranges[0].low || high !== ranges[0].high)) return null;
  const { low, high } = ranges[0];
  return { date, price: Math.round((low + high) * 50) / 100, low, high, sourceUrl };
}

function requestJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      family: 4, headers: { 'User-Agent': 'InstapResearch/1.0', Accept: 'application/json' },
    }, (res) => {
      if (res.statusCode !== 200) {
        res.resume(); reject(new Error(`CTIA HTTP ${res.statusCode}`)); return;
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
        if (body.length > 4 * 1024 * 1024) req.destroy(new Error('CTIA response too large'));
      });
      res.on('end', () => {
        try { resolve({ posts: JSON.parse(body), pages: Number(res.headers['x-wp-totalpages']) }); }
        catch (error) { reject(error); }
      });
      res.on('error', reject);
    });
    req.setTimeout(20000, () => req.destroy(new Error('CTIA request timeout')));
    req.on('error', reject);
  });
}

/** Read a bounded public archive. A partial/failed crawl must not replace data. */
export async function fetchCTIATungstenSeries({ start, end, request = requestJSON, onProgress } = {}) {
  if (!validDate(start) || !validDate(end) || start > end) throw new Error('Invalid CTIA date window');
  const byDate = new Map();
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page += 1) {
    const query = new URLSearchParams({
      categories: '17', per_page: '100', page: String(page),
      after: `${start}T00:00:00`, before: `${end}T23:59:59`,
      order: 'desc', _fields: 'id,date,link,content',
    });
    const result = await request(`https://www.ctia.com.cn/en/wp-json/wp/v2/posts?${query}`);
    if (!Array.isArray(result.posts) || !Number.isInteger(result.pages)
      || result.pages < 0 || result.pages > 20) throw new Error('Invalid CTIA archive response');
    totalPages = Math.max(result.pages, 1);
    for (const post of result.posts) {
      const point = parseCTIATungstenPost(post);
      if (point && point.date >= start && point.date <= end && !byDate.has(point.date)) {
        byDate.set(point.date, point); // latest post wins if a date has several reports
      }
    }
    onProgress?.({ page, pages: totalPages, observations: byDate.size });
    if (page < totalPages && request === requestJSON) await new Promise((resolve) => setTimeout(resolve, 300));
  }
  const series = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (!series.length) throw new Error('No explicit European APT USD/mtu quotes in CTIA archive');
  return series;
}

/** Migrate legacy manual points only after a successful, validated source crawl. */
export function mergeCTIATungstenSeries(daily, series) {
  if (!Array.isArray(series) || !series.length || series.some((point) =>
    !validDate(point.date) || !Number.isFinite(point.low) || !Number.isFinite(point.high)
    || point.low <= 0 || point.high < point.low
    || point.price !== Math.round((point.low + point.high) * 50) / 100
    || !/^https:\/\/www\.ctia\.com\.cn\/en\/news\/\d+\.html$/.test(point.sourceUrl))) {
    throw new Error('Invalid tungsten observations; existing data preserved');
  }
  const previous = daily.metals.tungsten;
  const byDate = new Map(previous?.benchmark === TUNGSTEN_BENCHMARK
    ? previous.data.map((point) => [point.date, point]) : []);
  for (const point of series) byDate.set(point.date, { ...point });
  daily.metals.tungsten = {
    ...TUNGSTEN_META,
    data: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
  return daily.metals.tungsten;
}
