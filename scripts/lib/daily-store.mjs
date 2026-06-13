/**
 * Daily price store helpers.
 *
 * The daily store (`public/data/metals-daily.json` on local, or
 * `/var/www/reports/data/metals-daily.json` on the server) mirrors the yearly
 * `metals-prices.json` shape but keeps one point per metal per DAY, over a
 * rolling window. It is written by both:
 *   - scripts/backfill-daily.mjs  (one-time history seed)
 *   - scripts/update-prices.js    (ongoing hourly upsert of today's price)
 *
 * Point shape: { date: 'YYYY-MM-DD', price: <number> }
 */

import fs from 'fs';

export const DEFAULT_WINDOW_DAYS = 420; // ~14 months: covers trailing-365 + prior year-end YTD baseline

export function todayStr(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

/** YYYY-MM-DD that is `days` before `ref` (UTC). */
export function dateMinusDays(days, ref = new Date()) {
  const t = new Date(ref.getTime() - days * 86400000);
  return t.toISOString().slice(0, 10);
}

/** Read the daily file, or return an empty skeleton if it does not exist. */
export function readDaily(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { lastUpdated: null, windowDays: DEFAULT_WINDOW_DAYS, metals: {} };
  }
}

/** Ensure a metal node exists with metadata; never clobbers existing data points. */
export function ensureMetal(daily, metalId, meta) {
  if (!daily.metals[metalId]) {
    daily.metals[metalId] = {
      name: meta.name,
      unit: meta.unit,
      color: meta.color,
      frequency: meta.frequency,
      source: meta.source || '',
      data: [],
    };
  } else {
    // Refresh metadata (unit/frequency/source may evolve) but keep data.
    const node = daily.metals[metalId];
    node.name = meta.name ?? node.name;
    node.unit = meta.unit ?? node.unit;
    node.color = meta.color ?? node.color;
    node.frequency = meta.frequency ?? node.frequency;
    if (meta.source) node.source = meta.source;
  }
  return daily.metals[metalId];
}

/**
 * Upsert a single dated point for a metal.
 * Same date -> overwrite price. Otherwise insert keeping the array date-sorted.
 */
export function upsertPoint(daily, metalId, date, price) {
  if (price == null || !isFinite(price)) return;
  const node = daily.metals[metalId];
  if (!node) return;
  const rounded = Math.round(price * 100) / 100;
  const existing = node.data.find((p) => p.date === date);
  if (existing) {
    existing.price = rounded;
  } else {
    node.data.push({ date, price: rounded });
    node.data.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }
}

/** Drop points older than `windowDays` before `ref` across all metals. */
export function prune(daily, windowDays = DEFAULT_WINDOW_DAYS, ref = new Date()) {
  const cutoff = dateMinusDays(windowDays, ref);
  for (const node of Object.values(daily.metals)) {
    node.data = node.data.filter((p) => p.date >= cutoff);
  }
  daily.windowDays = windowDays;
}

export function writeDaily(file, daily) {
  daily.lastUpdated = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(daily, null, 2));
}
