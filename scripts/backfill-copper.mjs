#!/usr/bin/env node
/** Repair only copper from dated LME cash-settlement history. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchCopperSeries, mergeCopperSeries } from './lib/sources/copper.mjs';
import { readDaily, todayStr, dateMinusDays, DEFAULT_WINDOW_DAYS } from './lib/daily-store.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const yearlyFile = process.env.DATA_FILE || path.join(dir, '../public/data/metals-prices.json');
const dailyFile = process.env.DAILY_FILE || path.join(path.dirname(yearlyFile), 'metals-daily.json');
const end = todayStr();
const start = dateMinusDays(DEFAULT_WINDOW_DAYS);

try {
  const series = await fetchCopperSeries({ start, end });
  // Existing malformed history must not be mistaken for a cold start.
  const daily = fs.existsSync(dailyFile) ? JSON.parse(fs.readFileSync(dailyFile, 'utf8')) : readDaily(dailyFile);
  const node = mergeCopperSeries(daily, series, { start, end });
  node.data = node.data.filter((point) => point.date >= start);
  daily.lastUpdated = new Date().toISOString();
  const temporary = `${dailyFile}.${process.pid}.tmp`;
  try {
    fs.writeFileSync(temporary, JSON.stringify(daily, null, 2));
    fs.renameSync(temporary, dailyFile);
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  console.log(`Copper repaired: ${node.data.length} dated cash quotes; latest ${node.data.at(-1).date}`);
} catch (error) {
  console.error(`Copper repair failed; previous history preserved: ${error.message}`);
  process.exitCode = 1;
}
