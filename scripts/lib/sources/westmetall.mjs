/**
 * Westmetall historical table adapter.
 *
 * The public table endpoint exposes one calendar year of daily observations:
 *   https://www.westmetall.com/en/markdaten.php?action=table&field=<field>&year=<year>
 *
 * Returns [{ date: 'YYYY-MM-DD', price: <number> }] sorted ascending.
 */

import https from 'https';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

const MONTHS = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};
const TROY_OUNCES_PER_KG = 32.1507465686;

function get(url, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { family: 4, headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,*/*' } },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve(body));
        res.on('error', reject);
      },
    );
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`timeout after ${timeoutMs}ms`)));
    req.on('error', reject);
  });
}

async function getWithRetry(url, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await get(url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

/** Parse the first numeric value from each dated table row. */
export function parseWestmetallTable(html, { field } = {}) {
  const copper = field === 'LME_Cu_cash';
  if (copper && !/<th[^>]*>\s*date\s*<\/th>\s*<th[^>]*>\s*LME Copper Cash-Settlement\s*<\/th>\s*<th[^>]*>\s*LME Copper 3-month\s*<\/th>/i.test(html)) {
    throw new Error('Expected LME copper cash-settlement columns; refusing another copper benchmark');
  }
  const points = [];
  const rowPattern = /<tr[^>]*>\s*<td[^>]*>\s*(\d{1,2})\.\s+([A-Za-z]+)\s+(\d{4})\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>(?:\s*<td[^>]*>\s*([^<]+)\s*<\/td>)?/gi;
  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const month = MONTHS[match[2]];
    const firstNumber = match[4].match(/[\d,.]+/i)?.[0];
    const price = firstNumber ? Number(firstNumber.replace(/,/g, '')) : NaN;
    if (!month || !Number.isFinite(price) || price <= 0) continue;
    const date = `${match[3]}-${String(month).padStart(2, '0')}-${String(match[1]).padStart(2, '0')}`;
    if (Number.isNaN(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
      if (copper) throw new Error('Invalid LME copper quote date');
      continue;
    }
    if (copper) {
      const number = /^(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?$/;
      const cash = match[4].trim();
      const threeMonth = (match[5] || '').trim();
      if (!number.test(cash) || !number.test(threeMonth)) throw new Error('Invalid LME copper numeric columns');
      const future = Number(threeMonth.replace(/,/g, ''));
      if (future <= 0 || price / future < 0.5 || price / future > 2) {
        throw new Error('LME copper cash/3-month prices disagree in scale; refusing possible unit error');
      }
    }
    points.push({ date, price });
  }
  return points;
}

/** Fetch all Westmetall observations between inclusive ISO dates. */
export async function fetchWestmetallSeries(field, { start, end } = {}) {
  const from = start || `${new Date().getUTCFullYear()}-01-01`;
  const to = end || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    throw new Error('start/end must be YYYY-MM-DD');
  }

  const fromYear = Number(from.slice(0, 4));
  const toYear = Number(to.slice(0, 4));
  const byDate = new Map();

  for (let year = fromYear; year <= toYear; year += 1) {
    const params = new URLSearchParams({ action: 'table', field, year: String(year) });
    const html = await getWithRetry(`https://www.westmetall.com/en/markdaten.php?${params.toString()}`);
    for (const point of parseWestmetallTable(html, { field })) {
      if (point.date >= from && point.date <= to) byDate.set(point.date, point);
    }
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Westmetall quotes fine silver in EUR/kg. Convert its lower daily quote to
 * USD/oz using Westmetall's same-day EUR/USD LME fixing.
 */
export async function fetchWestmetallSilverUsdSeries({ start, end } = {}) {
  const [silverEurPerKg, eurUsd] = await Promise.all([
    fetchWestmetallSeries('Ag', { start, end }),
    fetchWestmetallSeries('Euro_MTLE', { start, end }),
  ]);
  const fxByDate = new Map(eurUsd.map((point) => [point.date, point.price]));
  return silverEurPerKg.flatMap((point) => {
    const fx = fxByDate.get(point.date);
    if (!fx) return [];
    return [{ date: point.date, price: (point.price * fx) / TROY_OUNCES_PER_KG }];
  });
}
