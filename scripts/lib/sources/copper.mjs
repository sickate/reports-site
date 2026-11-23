/** A single dated LME copper benchmark; never match overview labels by suffix. */
import { fetchWestmetallSeries } from './westmetall.mjs';

export const COPPER_META = {
  name: 'Copper', unit: 'USD/ton', color: '#B87333', frequency: 'daily',
  source: 'Westmetall LME cash settlement',
  sourceUrl: 'https://www.westmetall.com/en/markdaten.php?action=table&field=LME_Cu_cash',
  benchmark: 'westmetall-lme-copper-cash-usd-ton', baselineSource: 'observations-only',
};

function validDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(`${date}T00:00:00Z`))
    && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
}

export async function fetchCopperSeries({ start, end } = {}) {
  const series = await fetchWestmetallSeries('LME_Cu_cash', { start, end });
  if (!series.length) throw new Error('No dated LME copper cash-settlement observations');
  return series.map((point) => ({
    ...point,
    sourceUrl: `${COPPER_META.sourceUrl}&year=${point.date.slice(0, 4)}`,
  }));
}

/** Replace the fetched date window, removing wrong quotes and invented weekends. */
export function mergeCopperSeries(daily, series, { start, end } = {}) {
  if (!validDate(start) || !validDate(end) || start > end || !Array.isArray(series) || !series.length
    || series.some((point) => !validDate(point.date) || point.date < start || point.date > end
      || !Number.isFinite(point.price) || point.price <= 0
      || point.sourceUrl !== `${COPPER_META.sourceUrl}&year=${point.date.slice(0, 4)}`)) {
    throw new Error('Invalid copper source window; previous data preserved');
  }
  const byDate = new Map();
  for (const point of series) {
    const old = byDate.get(point.date);
    if (old && old.price !== point.price) throw new Error('Conflicting copper source observations');
    byDate.set(point.date, { ...point });
  }
  const previous = daily.metals.copper;
  for (const point of previous?.data || []) {
    if (point.date < start || point.date > end) byDate.set(point.date, { ...point });
  }
  const data = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  daily.metals.copper = { ...previous, ...COPPER_META, data };
  return daily.metals.copper;
}
