import { j } from './legacy/three-vendor-CNr_E1Y_.js';

const DAY = 86400000;
const dayNumber = (date) => Math.round(Date.parse(`${date}T00:00:00Z`) / DAY);
const dateString = (day) => new Date(day * DAY).toISOString().slice(0, 10);

// Month-only announcements represent an interval, not an invented exact day.
export function matchesDateRange(date, from, until) {
  if (!from && !until) return true;
  if (!date) return false;
  const first = date.length === 7 ? `${date}-01` : date;
  const last = date.length === 7
    ? new Date(Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)), 0)).toISOString().slice(0, 10)
    : date;
  return (!from || last >= from) && (!until || first <= until);
}

export default function RelationshipTimeline({ relations, from, until, onChange, visibleCount }) {
  const dates = relations.map((relation) => relation.announcedAt).filter(Boolean).sort();
  if (!dates.length) return null;
  const first = dates[0].length === 7 ? `${dates[0]}-01` : dates[0];
  const lastDate = dates[dates.length - 1];
  const last = lastDate.length === 7
    ? new Date(Date.UTC(Number(lastDate.slice(0, 4)), Number(lastDate.slice(5, 7)), 0)).toISOString().slice(0, 10)
    : lastDate;
  // Include restored URL/sidebar bounds even when outside the announcement span.
  const lower = [first, from, until].filter(Boolean).sort()[0];
  const upper = [last, from, until].filter(Boolean).sort().at(-1);
  const start = from || lower;
  const end = until || upper;
  const change = (key, value) => {
    const nextFrom = key === 'from' ? value : from;
    const nextUntil = key === 'until' ? value : until;
    onChange(nextFrom && nextUntil && nextFrom > nextUntil
      ? { from: value, until: value }
      : { from: nextFrom, until: nextUntil });
  };
  const field = (key, label, value, effective) => j.jsxs('label', {
    className: 'ml-timeline-field',
    children: [j.jsx('span', { children: label }), j.jsx('input', {
      type: 'date', value, min: lower, max: upper,
      onChange: (event) => change(key, event.target.value),
    }), j.jsx('input', {
      type: 'range', min: dayNumber(lower), max: dayNumber(upper), step: 1,
      value: dayNumber(effective), 'aria-label': `${label} on timeline`,
      'aria-valuetext': effective,
      onChange: (event) => change(key, dateString(Number(event.target.value))),
    })],
  });
  return j.jsxs('div', {
    className: 'ml-timeline',
    children: [j.jsxs('div', { className: 'ml-timeline-heading', children: [
      j.jsx('strong', { children: 'Relationship timeline' }),
      j.jsx('span', { 'aria-live': 'polite', children: `${visibleCount} matching relationships` }),
      j.jsx('button', { type: 'button', disabled: !from && !until,
        onClick: () => onChange({ from: '', until: '' }), children: 'All dates' }),
    ] }), j.jsxs('div', { className: 'ml-timeline-controls', children: [
      field('from', 'Start date', from, start), field('until', 'End date', until, end),
    ] }), j.jsxs('div', { className: 'ml-timeline-axis', children: [
      j.jsx('span', { children: lower }), j.jsx('span', { children: upper }),
    ] }), j.jsx('small', { children: 'Filter by announcement date, including both endpoints. Month-only dates match any overlapping day. Date filters also apply to the registry and map.' })],
  });
}
