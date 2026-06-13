#!/usr/bin/env node
/**
 * One-time backfill of the daily price store (`metals-daily.json`).
 *
 * For each metal it seeds, in order (later sources win on a date collision):
 *   1. Yearly anchors from metals-prices.json (Dec-31 closes within the window)
 *      -> guarantees the YTD baseline date (prior year-end) always exists.
 *   2. FRED history (daily gold, monthly base/iron/cobalt) where available.
 *   3. A "today" point from the yearly current-year price, so the chart always
 *      reaches the present even on day 0.
 *
 * Per-metal failures (e.g. FRED throttled) are logged and skipped, never fatal.
 * Re-runnable: run again from a clean network (or on the server) to enrich
 * history; the ongoing updater (update-prices.js) keeps appending daily points.
 *
 * Usage: node scripts/backfill-daily.mjs
 * Env:   DATA_FILE  (yearly source, default ../public/data/metals-prices.json)
 *        DAILY_FILE (daily target, default ../public/data/metals-daily.json)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { METAL_META, METAL_ORDER } from './lib/sources/registry.mjs';
import { fetchFredSeries } from './lib/sources/fred.mjs';
import {
  readDaily, ensureMetal, upsertPoint, prune, writeDaily,
  todayStr, dateMinusDays, DEFAULT_WINDOW_DAYS,
} from './lib/daily-store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const YEARLY_FILE = process.env.DATA_FILE || path.join(__dirname, '../public/data/metals-prices.json');
const DAILY_FILE = process.env.DAILY_FILE || path.join(__dirname, '../public/data/metals-daily.json');
const WINDOW_DAYS = Number(process.env.WINDOW_DAYS) || DEFAULT_WINDOW_DAYS;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('='.repeat(50));
  console.log('Daily store backfill');
  console.log(`Window: ${WINDOW_DAYS} days  Target: ${DAILY_FILE}`);
  console.log('='.repeat(50));

  const yearly = JSON.parse(fs.readFileSync(YEARLY_FILE, 'utf8')).metals;
  const daily = readDaily(DAILY_FILE);
  const today = todayStr();
  const windowStart = dateMinusDays(WINDOW_DAYS);

  const summary = [];

  for (const metalId of METAL_ORDER) {
    const meta = METAL_META[metalId];
    if (!meta) continue;
    const ySeries = yearly[metalId]?.data || [];
    ensureMetal(daily, metalId, meta);

    let fredCount = 0;
    let anchorCount = 0;

    // 1. Yearly anchors (Dec-31 closes) within the window.
    for (const { year, price } of ySeries) {
      const anchorDate = `${year}-12-31`;
      if (anchorDate >= windowStart && anchorDate <= today) {
        upsertPoint(daily, metalId, anchorDate, price);
        anchorCount++;
      }
    }

    // 2. FRED history (per-metal best effort).
    if (meta.fred) {
      try {
        const series = await fetchFredSeries(meta.fred.series, {
          cosd: windowStart,
          factor: meta.fred.factor,
        });
        for (const { date, price } of series) {
          if (date >= windowStart && date <= today) {
            upsertPoint(daily, metalId, date, price);
            fredCount++;
          }
        }
        await delay(400); // be polite to FRED
      } catch (e) {
        console.log(`  ! ${metalId}: FRED ${meta.fred.series} failed (${e.message}) — using anchors only`);
      }
    }

    // 3. Current point from the yearly current-year price.
    const currentYear = new Date().getFullYear();
    const cur = ySeries.find((d) => d.year === currentYear);
    if (cur) upsertPoint(daily, metalId, today, cur.price);

    const total = daily.metals[metalId].data.length;
    summary.push({ metalId, freq: meta.frequency, fredCount, anchorCount, total });
    console.log(`  ✓ ${metalId.padEnd(11)} freq=${meta.frequency.padEnd(7)} fred=${String(fredCount).padStart(3)} anchors=${anchorCount} total=${total}`);
  }

  prune(daily, WINDOW_DAYS);
  writeDaily(DAILY_FILE, daily);

  console.log('\nWrote', DAILY_FILE);
  const withHistory = summary.filter((s) => s.fredCount > 0).map((s) => s.metalId);
  console.log('History from FRED:', withHistory.length ? withHistory.join(', ') : '(none — re-run from a clean network)');
  console.log('Done.');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
