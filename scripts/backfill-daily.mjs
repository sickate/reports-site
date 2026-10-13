#!/usr/bin/env node
/**
 * One-time backfill of the daily price store (`metals-daily.json`).
 *
 * For each metal it seeds, in order (later sources win on a date collision):
 *   1. Yearly anchors from metals-prices.json (Dec-31 closes within the window)
 *      -> guarantees the YTD baseline date (prior year-end) always exists.
 *   2. Westmetall daily history (gold, silver + LME base metals), where available.
 *   3. FRED monthly history as a fallback and for iron.
 *   4. The current-year snapshot from the yearly file, dated with that file's
 *      lastUpdated value (never with the day this backfill happens to run).
 *
 * Per-metal failures are logged; the run exits non-zero if a configured history
 * source yields no observations. Re-runnable: run again from a clean network
 * (or on the server) to enrich history; the ongoing updater keeps appending.
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
import { fetchWestmetallSeries, fetchWestmetallSilverUsdSeries } from './lib/sources/westmetall.mjs';
import { fetchCTIATungstenSeries, mergeCTIATungstenSeries } from './lib/sources/ctia-tungsten.mjs';
import { fetchMysteelLithiumSeries, mergeMysteelLithiumSeries, lithiumQuoteEnd } from './lib/sources/mysteel-lithium.mjs';
import { fetchCopperSeries, mergeCopperSeries } from './lib/sources/copper.mjs';
import {
  readDaily, ensureMetal, upsertPoint, prune, writeDaily,
  todayStr, dateMinusDays, DEFAULT_WINDOW_DAYS,
} from './lib/daily-store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const YEARLY_FILE = process.env.DATA_FILE || path.join(__dirname, '../public/data/metals-prices.json');
const DAILY_FILE = process.env.DAILY_FILE || path.join(path.dirname(YEARLY_FILE), 'metals-daily.json');
const WINDOW_DAYS = Number(process.env.WINDOW_DAYS) || DEFAULT_WINDOW_DAYS;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('='.repeat(50));
  console.log('Daily store backfill');
  console.log(`Window: ${WINDOW_DAYS} days  Target: ${DAILY_FILE}`);
  console.log('='.repeat(50));

  const yearlyDoc = JSON.parse(fs.readFileSync(YEARLY_FILE, 'utf8'));
  const yearly = yearlyDoc.metals;
  const daily = readDaily(DAILY_FILE);
  const today = todayStr();
  const windowStart = dateMinusDays(WINDOW_DAYS);
  const parsedSnapshotDate = new Date(yearlyDoc.lastUpdated);
  const snapshotDate = Number.isNaN(parsedSnapshotDate.getTime())
    ? today
    : todayStr(parsedSnapshotDate) > today ? today : todayStr(parsedSnapshotDate);

  const summary = [];

  for (const metalId of METAL_ORDER) {
    const meta = METAL_META[metalId];
    if (!meta) continue;
    if (metalId === 'copper') {
      let sourcedCount = 0;
      try {
        const series = await fetchCopperSeries({ start: windowStart, end: today });
        mergeCopperSeries(daily, series, { start: windowStart, end: today });
        sourcedCount = series.length;
        console.log(`  ✓ copper: ${sourcedCount} dated LME cash quotes; latest ${series.at(-1).date}`);
      } catch (error) {
        console.log(`  ! copper: source failed (${error.message}); previous data preserved`);
      }
      summary.push({ metalId, sourcedCount, westmetallCount: 0, fredCount: 0, hasHistorySource: true });
      continue;
    }
    // New sourced benchmarks must not inherit legacy annual/manual anchors.
    if (meta.ctia || meta.mysteel) {
      let sourcedCount = 0;
      try {
        const end = meta.mysteel ? lithiumQuoteEnd() : today;
        const fetchSeries = meta.mysteel ? fetchMysteelLithiumSeries : fetchCTIATungstenSeries;
        const mergeSeries = meta.mysteel ? mergeMysteelLithiumSeries : mergeCTIATungstenSeries;
        const series = await fetchSeries({ start: windowStart, end });
        mergeSeries(daily, series);
        sourcedCount = series.length;
        console.log(`  ✓ ${metalId}: ${sourcedCount} dated source quotes; latest ${series.at(-1).date}`);
      } catch (error) {
        console.log(`  ! ${metalId}: source failed (${error.message}); previous data preserved`);
      }
      summary.push({ metalId, sourcedCount, westmetallCount: 0, fredCount: 0, hasHistorySource: true });
      continue;
    }
    const ySeries = yearly[metalId]?.data || [];
    ensureMetal(daily, metalId, meta);

    let fredCount = 0;
    let westmetallCount = 0;
    let anchorCount = 0;
    let discardedCount = 0;

    // 1. Yearly anchors (Dec-31 closes) within the window.
    for (const { year, price } of ySeries) {
      const anchorDate = `${year}-12-31`;
      if (anchorDate >= windowStart && anchorDate <= today) {
        upsertPoint(daily, metalId, anchorDate, price);
        anchorCount++;
      }
    }

    // 2. Westmetall daily history. Reject extreme source glitches relative to
    // the nearest yearly anchor; the report only covers a ~14-month window.
    if (meta.westmetall) {
      try {
        const series = meta.westmetall.silverUsd
          ? await fetchWestmetallSilverUsdSeries({ start: windowStart, end: today })
          : await fetchWestmetallSeries(meta.westmetall.field, { start: windowStart, end: today });
        const refPrice = [...ySeries].reverse().find(({ price }) => Number.isFinite(price))?.price ?? null;
        for (const { date, price } of series) {
          if (refPrice && (price < refPrice * 0.4 || price > refPrice * 2.5)) {
            discardedCount++;
            continue;
          }
          upsertPoint(daily, metalId, date, price);
          westmetallCount++;
        }
        await delay(250);
      } catch (e) {
        console.log(`  ! ${metalId}: Westmetall ${meta.westmetall.field || 'silver+FX'} failed (${e.message})`);
      }
    }

    // 3. FRED monthly history (or fallback when Westmetall is unavailable).
    if (meta.fred && (!meta.westmetall || westmetallCount === 0)) {
      try {
        const series = await fetchFredSeries(meta.fred.series, { cosd: windowStart, factor: meta.fred.factor });
        for (const { date, price } of series) {
          if (date >= windowStart && date <= today) {
            upsertPoint(daily, metalId, date, price);
            fredCount++;
          }
        }
        await delay(400);
      } catch (e) {
        console.log(`  ! ${metalId}: FRED ${meta.fred.series} failed (${e.message})`);
      }
    }

    // 4. Current point from the yearly file. Do not let a stale yearly snapshot
    // overwrite or extend newer source history under a false "today" date.
    const currentYear = new Date().getFullYear();
    const cur = ySeries.find((d) => d.year === currentYear);
    const latestHistoryDate = daily.metals[metalId].data.at(-1)?.date ?? null;
    if (cur && (!latestHistoryDate || snapshotDate > latestHistoryDate)) {
      upsertPoint(daily, metalId, snapshotDate, cur.price);
    }

    const total = daily.metals[metalId].data.length;
    summary.push({ metalId, freq: meta.frequency, fredCount, westmetallCount, anchorCount, total, hasHistorySource: Boolean(meta.westmetall || meta.fred) });
    console.log(`  ✓ ${metalId.padEnd(11)} freq=${meta.frequency.padEnd(7)} westmetall=${String(westmetallCount).padStart(3)} fred=${String(fredCount).padStart(3)} anchors=${anchorCount} discarded=${discardedCount} total=${total}`);
  }

  prune(daily, WINDOW_DAYS);
  writeDaily(DAILY_FILE, daily);

  console.log('\nWrote', DAILY_FILE);
  const withHistory = summary.filter((s) => s.westmetallCount + s.fredCount + (s.sourcedCount || 0) > 0).map((s) => s.metalId);
  const missingHistory = summary.filter((s) => s.hasHistorySource && s.westmetallCount + s.fredCount + (s.sourcedCount || 0) === 0).map((s) => s.metalId);
  console.log('Backfilled history:', withHistory.length ? withHistory.join(', ') : '(none)');
  if (missingHistory.length) {
    throw new Error(`History backfill produced zero observations for: ${missingHistory.join(', ')}`);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
