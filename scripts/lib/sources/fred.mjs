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

import { execFile } from 'node:child_process';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

function validateCsv(body, contentType = '') {
  if (contentType.includes('text/html') || body.trimStart().startsWith('<')) {
    throw new Error('non-CSV response (bot challenge?)');
  }
  return body;
}

async function get(url, timeoutMs = 8000) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/csv,text/plain,*/*' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  const body = await response.text();
  return validateCsv(body, contentType);
}

function getWithCurl(url, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    execFile(
      'curl',
      ['-4', '-sS', '--fail', '--max-time', String(Math.ceil(timeoutMs / 1000)), url],
      { maxBuffer: 5 * 1024 * 1024 },
      (error, stdout) => {
        if (error) reject(error);
        else {
          try { resolve(validateCsv(stdout)); } catch (validationError) { reject(validationError); }
        }
      },
    );
  });
}

async function getWithRetry(url, attempts = 2) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await get(url);
    } catch (e) {
      lastErr = e;
    }
  }
  try {
    return await getWithCurl(url);
  } catch (curlError) {
    throw new Error(`${lastErr?.message || 'fetch failed'}; curl fallback failed: ${curlError.message}`);
  }
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
