#!/usr/bin/env node
/** Backfill only tungsten, preserving every other metal in the daily store. */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchCTIATungstenSeries, mergeCTIATungstenSeries } from './lib/sources/ctia-tungsten.mjs';
import { readDaily, writeDaily, todayStr, dateMinusDays, DEFAULT_WINDOW_DAYS } from './lib/daily-store.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const yearlyFile = process.env.DATA_FILE || path.join(dir, '../public/data/metals-prices.json');
const dailyFile = process.env.DAILY_FILE || path.join(path.dirname(yearlyFile), 'metals-daily.json');
const end = todayStr();
const start = dateMinusDays(DEFAULT_WINDOW_DAYS);

try {
  const series = await fetchCTIATungstenSeries({
    start, end,
    onProgress: ({ page, pages, observations }) => console.log(`CTIA archive ${page}/${pages}: ${observations} observations`),
  });
  // Read immediately before writing, after the slow archive request.
  const daily = readDaily(dailyFile);
  const node = mergeCTIATungstenSeries(daily, series);
  node.data = node.data.filter((point) => point.date >= start);
  writeDaily(dailyFile, daily);
  console.log(`Wrote ${node.data.length} European APT quotes to ${dailyFile}; latest ${node.data.at(-1).date}`);
} catch (error) {
  console.error(`Tungsten backfill failed; existing file preserved: ${error.message}`);
  process.exitCode = 1;
}
