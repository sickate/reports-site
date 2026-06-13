/**
 * FRED (St. Louis Fed) free CSV adapter.
 *
 * The graph CSV endpoint needs no API key:
 *   https://fred.stlouisfed.org/graph/fredgraph.csv?id=<series>&cosd=<YYYY-MM-DD>
 *
 * Returns [{ date: 'YYYY-MM-DD', price: <number> }] sorted ascending.
 * Missing observations (value '.') are skipped. Throws on network failure so
 * callers can degrade per-metal.
 */

import https from 'https';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

function get(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { 'User-Agent': USER_AGENT, Accept: 'text/csv,text/plain,*/*' } },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const ct = res.headers['content-type'] || '';
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          // FRED occasionally serves an HTML bot-challenge instead of CSV.
          if (ct.includes('text/html') || body.trimStart().startsWith('<')) {
            reject(new Error('non-CSV response (bot challenge?)'));
          } else {
            resolve(body);
          }
        });
        res.on('error', reject);
      },
    );
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`timeout after ${timeoutMs}ms`)));
    req.on('error', reject);
  });
}

async function getWithRetry(url, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await get(url);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/**
 * Fetch a FRED series.
 * @param {string} seriesId  e.g. 'PCOPPUSDM'
 * @param {object} opts
 * @param {string} [opts.cosd]   start date 'YYYY-MM-DD'
 * @param {number} [opts.factor] multiply each value (unit conversion), default 1
 */
export async function fetchFredSeries(seriesId, { cosd, factor = 1 } = {}) {
  const params = new URLSearchParams({ id: seriesId });
  if (cosd) params.set('cosd', cosd);
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?${params.toString()}`;
  const csv = await getWithRetry(url);

  const out = [];
  const lines = csv.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    // ^header
    const line = lines[i].trim();
    if (!line) continue;
    const comma = line.indexOf(',');
    if (comma < 0) continue;
    const date = line.slice(0, comma).trim();
    const raw = line.slice(comma + 1).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    if (raw === '.' || raw === '') continue;
    const val = parseFloat(raw);
    if (!isFinite(val)) continue;
    out.push({ date, price: val * factor });
  }
  out.sort((a, b) => (a.date < b.date ? -1 : 1));
  return out;
}
