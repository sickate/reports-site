/**
 * Per-metal source registry.
 *
 * Maps each metalId to display metadata + where its DAILY-store data comes from:
 *   - `fred`: history backfill series (one-time), with a unit-conversion factor
 *             so the stored value matches the yearly file's unit.
 *   - `frequency`: honest label of the best ongoing cadence we can sustain for
 *                  free ('daily' | 'monthly' | 'manual'), surfaced in the UI.
 *
 * Ongoing daily values come from scripts/update-prices.js (gold-api.com for
 * gold/silver, westmetall.com for the 5 LME base metals). The 6 "manual" metals
 * have no free feed, so they accumulate flat from their hardcoded price.
 *
 * KEY-LATER SEAM: `preferredSource(metalId)` returns 'metalsapi' when
 * METALS_API_KEY is set (a future scripts/lib/sources/metalsapi.mjs can then be
 * wired in for richer niche-metal history), else the free defaults below. No
 * keyed code path is built yet — only the branch point.
 */

const LB_PER_TON = 2204.62;

// Colors/units kept in sync with the yearly file + the React METAL_CONFIG.
export const METAL_META = {
  gold:       { name: 'Gold',       unit: 'USD/oz',  color: '#FFD700', frequency: 'daily',   fred: { series: 'GOLDPMGBD228NLBM', factor: 1 },            source: 'FRED GOLDPMGBD228NLBM + gold-api.com' },
  silver:     { name: 'Silver',     unit: 'USD/oz',  color: '#C0C0C0', frequency: 'daily',   fred: null,                                                source: 'gold-api.com (history: yearly anchors)' },
  copper:     { name: 'Copper',     unit: 'USD/ton', color: '#B87333', frequency: 'daily',   fred: { series: 'PCOPPUSDM', factor: 1 },                   source: 'FRED PCOPPUSDM + westmetall.com' },
  aluminum:   { name: 'Aluminum',   unit: 'USD/ton', color: '#848789', frequency: 'daily',   fred: { series: 'PALUMUSDM', factor: 1 },                   source: 'FRED PALUMUSDM + westmetall.com' },
  nickel:     { name: 'Nickel',     unit: 'USD/ton', color: '#727472', frequency: 'daily',   fred: { series: 'PNICKUSDM', factor: 1 },                   source: 'FRED PNICKUSDM + westmetall.com' },
  zinc:       { name: 'Zinc',       unit: 'USD/ton', color: '#7CB9E8', frequency: 'daily',   fred: { series: 'PZINCUSDM', factor: 1 },                   source: 'FRED PZINCUSDM + westmetall.com' },
  tin:        { name: 'Tin',        unit: 'USD/ton', color: '#8B8589', frequency: 'daily',   fred: { series: 'PTINUSDM', factor: 1 },                    source: 'FRED PTINUSDM + westmetall.com' },
  iron:       { name: 'Iron',       unit: 'USD/ton', color: '#8B4513', frequency: 'monthly', fred: { series: 'PIORECRUSDM', factor: 1 },                 source: 'FRED PIORECRUSDM (62% Fe CFR China)' },
  cobalt:     { name: 'Cobalt',     unit: 'USD/lb',  color: '#0047AB', frequency: 'monthly', fred: { series: 'PCOBAUSDM', factor: 1 / LB_PER_TON },      source: 'FRED PCOBAUSDM (USD/ton -> USD/lb)' },
  tungsten:   { name: 'Tungsten',   unit: 'USD/mtu', color: '#e74c3c', frequency: 'manual',  fred: null,                                                source: 'manual (no free feed)' },
  molybdenum: { name: 'Molybdenum', unit: 'USD/lb',  color: '#4A4A4A', frequency: 'manual',  fred: null,                                                source: 'manual (no free feed)' },
  lithium:    { name: 'Lithium',    unit: 'USD/ton', color: '#9b59b6', frequency: 'manual',  fred: null,                                                source: 'manual (no free feed)' },
  titanium:   { name: 'Titanium',   unit: 'USD/ton', color: '#1abc9c', frequency: 'manual',  fred: null,                                                source: 'manual (no free feed)' },
};

export const METAL_ORDER = [
  'gold', 'silver', 'copper', 'aluminum', 'iron', 'nickel',
  'cobalt', 'zinc', 'tin', 'tungsten', 'molybdenum', 'lithium', 'titanium',
];

export function preferredSource(/* metalId */) {
  return process.env.METALS_API_KEY ? 'metalsapi' : 'free';
}
