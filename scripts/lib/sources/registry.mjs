/**
 * Per-metal source registry.
 *
 * Maps each metalId to display metadata + where its DAILY-store data comes from:
 *   - `westmetall`: daily historical table field where available.
 *   - `fred`: monthly history fallback/source, with a unit-conversion factor so
 *             the stored value matches the yearly file's unit.
 *   - `frequency`: honest label of the best ongoing cadence we can sustain for
 *                  free ('daily' | 'monthly' | 'manual'), surfaced in the UI.
 *
 * Ongoing daily values come from scripts/update-prices.js (gold-api.com for
 * gold/silver, westmetall.com for the 5 LME base metals). Low-frequency metals
 * append only when their periodic/manual quote changes.
 *
 * KEY-LATER SEAM: `preferredSource(metalId)` returns 'metalsapi' when
 * METALS_API_KEY is set (a future scripts/lib/sources/metalsapi.mjs can then be
 * wired in for richer niche-metal history), else the free defaults below. No
 * keyed code path is built yet — only the branch point.
 */

import { TUNGSTEN_META } from './ctia-tungsten.mjs';
import { LITHIUM_META } from './mysteel-lithium.mjs';
import { COPPER_META } from './copper.mjs';

// Colors/units kept in sync with the yearly file + the React METAL_CONFIG.
export const METAL_META = {
  gold:       { name: 'Gold',       unit: 'USD/oz',  color: '#FFD700', frequency: 'daily',   westmetall: { field: 'USD_ozt_London' }, fred: null, source: 'Westmetall London Fixing + gold-api.com' },
  silver:     { name: 'Silver',     unit: 'USD/oz',  color: '#C0C0C0', frequency: 'daily',   westmetall: { silverUsd: true }, fred: null,                source: 'Westmetall fine silver + EUR/USD conversion + gold-api.com' },
  copper:     { ...COPPER_META, westmetall: { field: 'LME_Cu_cash' }, fred: null },
  aluminum:   { name: 'Aluminum',   unit: 'USD/ton', color: '#848789', frequency: 'daily',   westmetall: { field: 'LME_Al_cash' }, fred: { series: 'PALUMUSDM', factor: 1 }, source: 'Westmetall LME cash settlement' },
  nickel:     { name: 'Nickel',     unit: 'USD/ton', color: '#727472', frequency: 'daily',   westmetall: { field: 'LME_Ni_cash' }, fred: { series: 'PNICKUSDM', factor: 1 }, source: 'Westmetall LME cash settlement' },
  zinc:       { name: 'Zinc',       unit: 'USD/ton', color: '#7CB9E8', frequency: 'daily',   westmetall: { field: 'LME_Zn_cash' }, fred: { series: 'PZINCUSDM', factor: 1 }, source: 'Westmetall LME cash settlement' },
  tin:        { name: 'Tin',        unit: 'USD/ton', color: '#8B8589', frequency: 'daily',   westmetall: { field: 'LME_Sn_cash' }, fred: { series: 'PTINUSDM', factor: 1 }, source: 'Westmetall LME cash settlement' },
  iron:       { name: 'Iron',       unit: 'USD/ton', color: '#8B4513', frequency: 'monthly', fred: { series: 'PIORECRUSDM', factor: 1 },                 source: 'FRED PIORECRUSDM (62% Fe CFR China)' },
  cobalt:     { name: 'Cobalt',     unit: 'USD/lb',  color: '#0047AB', frequency: 'manual',  fred: null,                                                source: 'manual (FRED series discontinued)' },
  tungsten:   { ...TUNGSTEN_META, ctia: true, fred: null },
  molybdenum: { name: 'Molybdenum', unit: 'USD/lb',  color: '#4A4A4A', frequency: 'manual',  fred: null,                                                source: 'manual (no free feed)' },
  lithium:    { ...LITHIUM_META, mysteel: true, fred: null },
  titanium:   { name: 'Titanium',   unit: 'USD/ton', color: '#1abc9c', frequency: 'manual',  fred: null,                                                source: 'manual (no free feed)' },
};

export const METAL_ORDER = [
  'gold', 'silver', 'copper', 'aluminum', 'iron', 'nickel',
  'cobalt', 'zinc', 'tin', 'tungsten', 'molybdenum', 'lithium', 'titanium',
];

export function preferredSource(/* metalId */) {
  return process.env.METALS_API_KEY ? 'metalsapi' : 'free';
}
