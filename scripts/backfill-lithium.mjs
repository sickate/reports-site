#!/usr/bin/env node
/** Backfill only battery-grade lithium spot history, retaining all other metals. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchMysteelLithiumSeries, mergeMysteelLithiumSeries, lithiumQuoteEnd } from './lib/sources/mysteel-lithium.mjs';
import { readDaily, writeDaily, dateMinusDays, DEFAULT_WINDOW_DAYS } from './lib/daily-store.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const yearlyFile = process.env.DATA_FILE || path.join(dir, '../public/data/metals-prices.json');
const dailyFile = process.env.DAILY_FILE || path.join(path.dirname(yearlyFile), 'metals-daily.json');
const start = dateMinusDays(DEFAULT_WINDOW_DAYS);
const end = lithiumQuoteEnd();

try {
  const series = await fetchMysteelLithiumSeries({ start, end });
  const daily = readDaily(dailyFile);
  const node = mergeMysteelLithiumSeries(daily, series);
  node.data = node.data.filter((point) => point.date >= start);
  writeDaily(dailyFile, daily);
  const latest = node.data.at(-1);
  console.log(`Wrote ${node.data.length} battery-grade spot quotes; latest ${latest.date}: ${latest.nativePrice} CNY/t = ${latest.price} USD/t (FX ${latest.fxDate})`);
} catch (error) {
  console.error(`Lithium backfill failed; existing file preserved: ${error.message}`);
  process.exitCode = 1;
}
