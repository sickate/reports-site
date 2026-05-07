// Fetch forward PE + gross margin for the 48 photonics tickers from stockanalysis.com.
// Notes:
//   - stockanalysis.com /api/symbol/s/{ticker}/statistics returns trailing PE, forward PE,
//     gross margin (TTM), and other ratios. Only US-listed tickers (incl. ADRs on NYSE/NASDAQ).
//   - 8 non-US-only tickers are skipped (marked overseas) and reported separately.
//   - Output: tmp/photonics-pe.json (consumed by hand by the next step).

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'tmp/photonics-pe.json');

// Source-of-truth maps. `sa` is the stockanalysis.com slug; null = no US listing.
const TICKERS = [
  { id: 'axt', layer: 'materials', display: 'AXTI', sa: 'axti' },
  { id: 'aeluma', layer: 'materials', display: 'ALMU', sa: 'almu' },
  { id: 'teck', layer: 'materials', display: 'TECK', sa: 'teck' },
  { id: 'iqe', layer: 'materials', display: 'IQE', sa: null, overseas: 'IQE.L (London)' },
  { id: 'lightwave-logic', layer: 'materials', display: 'LWLG', sa: 'lwlg' },
  { id: 'soitec', layer: 'materials', display: 'SOI', sa: null, overseas: 'SOI.PA (Soitec, Paris)' },
  { id: 'wolfspeed', layer: 'materials', display: 'WOLF', sa: 'wolf' },
  { id: 'aixtron', layer: 'tools', display: 'AIXA', sa: null, overseas: 'AIXA.DE (Frankfurt)' },
  { id: 'riber', layer: 'tools', display: 'ALRIB', sa: null, overseas: 'ALRIB.PA (Paris)' },
  { id: 'veeco', layer: 'tools', display: 'VECO', sa: 'veco' },
  { id: 'lam-research-tools', layer: 'tools', display: 'LRCX', sa: 'lrcx' },
  { id: 'applied-materials-tools', layer: 'tools', display: 'AMAT', sa: 'amat' },
  { id: 'onto-innovation', layer: 'tools', display: 'ONTO', sa: 'onto' },
  { id: 'hamamatsu-photonics', layer: 'tools', display: '6965 / HPHTY', sa: null, overseas: '6965.T (Tokyo) / HPHTY (OTC ADR)' },
  { id: 'sivers-semiconductors', layer: 'lasers', display: 'SIVE', sa: null, overseas: 'SIVE.ST (Stockholm)' },
  { id: 'macom', layer: 'lasers', display: 'MTSI', sa: 'mtsi' },
  { id: 'himax', layer: 'lasers', display: 'HIMX', sa: 'himx' },
  { id: 'stmicroelectronics', layer: 'lasers', display: 'STM', sa: 'stm' },
  { id: 'nlight', layer: 'lasers', display: 'LASR', sa: 'lasr' },
  { id: 'tower-semiconductor', layer: 'foundries', display: 'TSEM', sa: 'tsem' },
  { id: 'fabrinet', layer: 'foundries', display: 'FN', sa: 'fn' },
  { id: 'xfab', layer: 'foundries', display: 'XFAB', sa: null, overseas: 'XFAB.PA (Paris)' },
  { id: 'sanmina', layer: 'foundries', display: 'SANM', sa: 'sanm' },
  { id: 'umc', layer: 'foundries', display: 'UMC', sa: 'umc' },
  { id: 'globalfoundries', layer: 'foundries', display: 'GFS', sa: 'gfs' },
  { id: 'aehr-test-systems', layer: 'testing', display: 'AEHR', sa: 'aehr' },
  { id: 'formfactor-testing', layer: 'testing', display: 'FORM', sa: 'form' },
  { id: 'cohu-testing', layer: 'testing', display: 'COHU', sa: 'cohu' },
  { id: 'teradyne-testing', layer: 'testing', display: 'TER', sa: 'ter' },
  { id: 'viavi-solutions', layer: 'testing', display: 'VIAV', sa: 'viav' },
  { id: 'ase-technology-holding', layer: 'testing', display: 'ASX', sa: 'asx' },
  { id: 'amkor', layer: 'testing', display: 'AMKR', sa: 'amkr' },
  { id: 'lumentum', layer: 'optics', display: 'LITE', sa: 'lite' },
  { id: 'coherent-optics', layer: 'optics', display: 'COHR', sa: 'cohr' },
  { id: 'poet-technologies', layer: 'optics', display: 'POET', sa: 'poet' },
  { id: 'memscap', layer: 'optics', display: 'MEMS', sa: null, overseas: 'MEMS.PA (MEMSCAP, Paris)' },
  { id: 'applied-optoelectronics', layer: 'optics', display: 'AAOI', sa: 'aaoi' },
  { id: 'syntec-optics', layer: 'optics', display: 'OPTX', sa: 'optx' },
  { id: 'lightpath-technologies', layer: 'optics', display: 'LPTH', sa: 'lpth' },
  { id: 'credo', layer: 'networking', display: 'CRDO', sa: 'crdo' },
  { id: 'marvell', layer: 'networking', display: 'MRVL', sa: 'mrvl' },
  { id: 'semtech', layer: 'networking', display: 'SMTC', sa: 'smtc' },
  { id: 'ciena', layer: 'networking', display: 'CIEN', sa: 'cien' },
  { id: 'nokia', layer: 'networking', display: 'NOK', sa: 'nok' },
  { id: 'corning', layer: 'networking', display: 'GLW', sa: 'glw' },
  { id: 'astera-labs', layer: 'networking', display: 'ALAB', sa: 'alab' },
  { id: 'arista', layer: 'networking', display: 'ANET', sa: 'anet' },
  { id: 'broadcom-networking', layer: 'networking', display: 'AVGO', sa: 'avgo' },
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

function findValue(arr, id) {
  return arr.find((x) => x.id === id) ?? null;
}

function parsePercent(value) {
  if (value == null) return null;
  const m = String(value).match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

function parseNumber(value) {
  if (value == null) return null;
  // Forward PE often comes as "31.59" or "n/a"; reject if non-numeric
  const m = String(value).match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

async function fetchOne(t) {
  if (!t.sa) {
    return { ...t, skipped: 'overseas', overseas: t.overseas };
  }
  const url = `https://stockanalysis.com/api/symbol/s/${t.sa}/statistics`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return { ...t, error: `HTTP ${res.status}` };
    const j = await res.json();
    if (j.status !== 200) return { ...t, error: `api status ${j.status}` };
    const d = j.data ?? {};
    const ratios = d.ratios?.data ?? [];
    const margins = d.margins?.data ?? [];
    const valuation = d.valuation?.data ?? [];

    const trailingPE = parseNumber(findValue(ratios, 'pe')?.value);
    const forwardPE = parseNumber(findValue(ratios, 'peForward')?.value);
    const peg = parseNumber(findValue(ratios, 'pegRatio')?.value);
    const grossMargin = parsePercent(findValue(margins, 'grossMargin')?.value);
    const operatingMargin = parsePercent(findValue(margins, 'operatingMargin')?.value);
    const profitMargin = parsePercent(findValue(margins, 'profitMargin')?.value);
    const marketCap = findValue(valuation, 'marketcap')?.value ?? null;

    return {
      ...t,
      trailingPE,
      forwardPE,
      peg,
      grossMargin,
      operatingMargin,
      profitMargin,
      marketCap,
    };
  } catch (e) {
    return { ...t, error: String(e?.message ?? e) };
  }
}

async function main() {
  const out = [];
  for (const t of TICKERS) {
    const r = await fetchOne(t);
    out.push(r);
    if (r.skipped) {
      console.log(`${t.layer.padEnd(11)} ${t.display.padEnd(15)}  SKIP overseas: ${r.overseas}`);
    } else if (r.error) {
      console.log(`${t.layer.padEnd(11)} ${t.display.padEnd(15)}  ERR ${r.error}`);
    } else {
      const fmt = (x, suffix = '') => (x != null ? x.toFixed(1) + suffix : '—');
      console.log(
        `${t.layer.padEnd(11)} ${t.display.padEnd(15)}  ttmPE=${fmt(r.trailingPE)}  fwdPE=${fmt(r.forwardPE)}  gm=${fmt(r.grossMargin, '%')}  cap=${r.marketCap}`,
      );
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(out, null, 2), 'utf8');
  console.log(`\nWrote ${OUTPUT_PATH}`);
  const ok = out.filter((r) => r.forwardPE != null).length;
  const skipped = out.filter((r) => r.skipped).length;
  const errored = out.filter((r) => r.error).length;
  console.log(`forwardPE coverage: ${ok}/${out.length}  (skipped ${skipped} overseas, ${errored} errors)`);
}

main();
