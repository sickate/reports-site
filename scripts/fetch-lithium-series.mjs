#!/usr/bin/env node
/**
 * Fetch the GFEX lithium-carbonate term structure into global-lithium-market.json.
 *
 * NOT wired into prebuild, deliberately. A build that reaches the network is a build that
 * fails when the network does, and `deploy.sh` is `set -e` — one flaky DNS lookup would
 * block a deploy that has nothing to do with this data. Run it by hand (or from the weekly
 * update) and commit the result, so the committed JSON is what ships.
 *
 * ---------------------------------------------------------------------------------------
 * TWO THINGS THAT LOOK LIKE DETAILS AND ARE NOT
 * ---------------------------------------------------------------------------------------
 * 1. The response body carries an anti-hotlinking prefix:
 *
 *      /*<script>location.href='//sina.com';</script>*\/
 *      var _LC2609=([{"d":"2025-09-15",...}]);
 *
 *    We slice out the bracketed array and JSON.parse it. The response is NEVER eval'd or
 *    executed, so that injected navigation script is inert text to us.
 *
 * 2. `--as-of` pins which trading day's settlement is read. Passing it is how a curve gets
 *    reconstructed for a PAST date so it matches the file's existing meta.asOf. Without
 *    that, pulling today's quote into a file whose meta.asOf, changelog and homepage date
 *    still describe last week produces a series that scores as "fresh" by being dated in
 *    the future — which is why check-lithium-consistency.mjs rejects it.
 *
 * Usage:
 *   node scripts/fetch-lithium-series.mjs --as-of=2026-07-24
 *   node scripts/fetch-lithium-series.mjs --as-of=2026-07-24 --dry-run
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MARKET_PATH = path.join(ROOT, 'public/data/global-lithium-market.json');

const SINA_BASE = 'https://stock2.finance.sina.com.cn/futures/api/jsonp.php';
const REFERER = 'https://finance.sina.com.cn/';

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v = 'true'] = a.replace(/^--/, '').split('=');
    return [k, v];
  })
);
const AS_OF = args.get('as-of');
const DRY_RUN = args.get('dry-run') === 'true';

if (!AS_OF || !/^\d{4}-\d{2}-\d{2}$/.test(AS_OF)) {
  console.error('usage: node scripts/fetch-lithium-series.mjs --as-of=YYYY-MM-DD [--dry-run]');
  process.exit(2);
}

/**
 * Candidate contract months: the 14 months starting the month before `asOf`.
 *
 * Generated rather than hard-coded because the listed set rolls every month. We ask for a
 * generous window and keep only the contracts that actually traded on `asOf` — so the
 * curve is "the contracts that existed that day", which is what a term structure IS, rather
 * than a list someone has to remember to update.
 */
function candidateContracts(asOf) {
  const [y, m] = asOf.split('-').map(Number);
  const out = [];
  for (let i = -1; i < 13; i += 1) {
    const d = new Date(Date.UTC(y, (m - 1) + i, 1));
    const yy = String(d.getUTCFullYear()).slice(2);
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    out.push(`LC${yy}${mm}`);
  }
  return out;
}

/**
 * Strip the JSONP wrapper and parse. Never eval — see the header note.
 *
 * Sina answers `var _LC2707=(null);` for a contract it carries no history for. That is a
 * meaningful answer, not an error, and it is reported rather than skipped: a contract that
 * vanishes from the curve without a word is how a term structure silently narrows.
 */
function parseSinaKline(body, symbol) {
  const start = body.indexOf('[');
  const end = body.lastIndexOf(']');
  if (start < 0 || end <= start) {
    console.log(`  · ${symbol}: 新浪无该合约日线历史（响应为 null）`);
    return null;
  }

  try {
    const parsed = JSON.parse(body.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.warn(`  ! ${symbol}: unparseable payload (${error.message})`);
    return null;
  }
}

async function fetchContract(symbol) {
  const url = `${SINA_BASE}/var%20_${symbol}=/InnerFuturesNewService.getDailyKLine?symbol=${symbol}`;
  const response = await fetch(url, { headers: { Referer: REFERER } });
  if (!response.ok) {
    console.warn(`  ! ${symbol}: HTTP ${response.status}`);
    return null;
  }
  return parseSinaKline(await response.text(), symbol);
}

console.log(`Fetching GFEX lithium carbonate term structure as of ${AS_OF} …`);

const points = [];
const noHistory = [];
for (const symbol of candidateContracts(AS_OF)) {
  const bars = await fetchContract(symbol);
  if (!bars) {
    noHistory.push(symbol.replace(/^LC/, ''));
    continue;
  }

  const bar = bars.find((b) => b.d === AS_OF);
  if (!bar) {
    console.log(`  · ${symbol}: no bar on ${AS_OF} (not listed / not traded)`);
    continue;
  }

  const settlement = Number(bar.s);
  const close = Number(bar.c);
  const openInterest = Number(bar.p);
  if (!Number.isFinite(settlement) || settlement <= 0) {
    console.log(`  · ${symbol}: no settlement on ${AS_OF}`);
    continue;
  }

  points.push({
    contract: symbol.replace(/^LC/, ''),
    settlement,
    close: Number.isFinite(close) && close > 0 ? close : null,
    openInterest: Number.isFinite(openInterest) ? openInterest : null,
  });
  console.log(`  ✓ ${symbol}: settle ${settlement.toLocaleString('zh-CN')} · OI ${openInterest.toLocaleString('zh-CN')}`);
}

if (points.length < 3) {
  console.error(`\n✗ only ${points.length} contract(s) resolved — refusing to write a curve that thin.`);
  process.exit(1);
}

points.sort((a, b) => a.contract.localeCompare(b.contract));

const front = points[0];
const back = points[points.length - 1];
const spread = Math.round(back.settlement - front.settlement);
const spreadPct = (spread / front.settlement) * 100;
const shape = spread < 0 ? 'backwardation（近高远低）' : 'contango（近低远高）';

console.log(`\n${points.length} contracts · ${front.contract} → ${back.contract}`);
console.log(`远近价差 ${spread.toLocaleString('zh-CN')} 元/吨 (${spreadPct.toFixed(1)}%) — ${shape}`);

const envelope = {
  label: '广期所碳酸锂期限结构',
  unit: '元/吨',
  asOf: AS_OF,
  basis: `广期所碳酸锂各月合约 ${AS_OF} 结算价；远近价差 = 最远月 − 最近月`,
  kind: 'observed',
  confidence: 'high',
  series: 'price',
  source: {
    label: '广州期货交易所（经新浪财经日 K 线）',
    kind: 'exchange',
    url: 'https://finance.sina.com.cn/futures/quotes/LC0.shtml',
  },
  // The note states COVERAGE, not a spread number.
  //
  // The page already carries a `gfex-term-spread` metric tile. If this envelope also
  // published a spread it would be a second number for the same idea computed over a
  // possibly different set of contracts — and the two would disagree by exactly the
  // contracts Sina has no history for. One number, one owner; the chart shows the shape.
  note: `覆盖 ${points.length} 个有公开日线历史的合约（${front.contract}–${back.contract}）。形态：${shape}。`
    + (noHistory.length
      ? `新浪不提供 ${noHistory.join('、')} 的日线历史，未纳入本曲线——「期限价差」指标的口径可能比本图更宽。`
      : ''),
  points,
};

if (DRY_RUN) {
  console.log('\n--dry-run: not writing.\n');
  console.log(JSON.stringify({ charts: { gfexTermStructure: envelope } }, null, 2));
  process.exit(0);
}

const market = JSON.parse(await readFile(MARKET_PATH, 'utf8'));
if (market.meta?.asOf && AS_OF > market.meta.asOf) {
  console.error(`\n✗ --as-of ${AS_OF} is later than market.meta.asOf ${market.meta.asOf}.`);
  console.error('  The build check rejects this. Either refresh the whole file (meta.asOf +');
  console.error('  changelog + the registry date in src/reports/index.js) or pin --as-of back.');
  process.exit(1);
}

market.charts = market.charts || {};
market.charts.gfexTermStructure = envelope;

// Rewrite with `changelog` last, matching the file's existing convention of ordering
// blocks by volatility.
const { changelog, ...rest } = market;
await writeFile(MARKET_PATH, `${JSON.stringify({ ...rest, changelog }, null, 2)}\n`, 'utf8');

console.log(`\n✓ wrote charts.gfexTermStructure (${points.length} points) to ${path.relative(ROOT, MARKET_PATH)}`);
