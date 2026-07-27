// CSV column contract + status taxonomy. Pure data/logic: imported by BOTH the browser
// app and scripts/check-lithium-consistency.mjs, so the build check validates exactly
// what the runtime parses. Keep free of DOM references.

export const numericFields = new Set([
  'current_kta_lce',
  'planned_kta_lce',
  'lat',
  'lon',
  'port_lat',
  'port_lon',
  'map_capacity_kta',
]);

export const CORE_STATUS_GROUPS = ['Operating', 'Ramp-up', 'Construction', 'Development', 'On hold / stalled', 'Cluster'];
// 'Other' is normalizeStatusGroup's fallback and MUST be a first-class legend bucket:
// it was previously absent here, so any row falling back to it failed the
// activeStatusGroups.has() test in filteredData() and was silently dropped from BOTH
// the table and the map while updateStats() still counted it (the 44 / 43 / 43 drift).
// A bucket that can hold rows must always be renderable.

export const statusLegendItems = [...CORE_STATUS_GROUPS, 'Other'];

export function normalizeStatusGroup(status) {
  const s = String(status || '').toLowerCase();
  if (s.includes('care') || s.includes('hold') || s.includes('stalled')) return 'On hold / stalled';
  if (s.includes('ramp')) return 'Ramp-up';
  if (s.includes('construction') || s.includes('commission')) return 'Construction';
  if (
    s.includes('development') ||
    s.includes('permitted') ||
    s.includes('dfs') ||
    s.includes('pre-construction')
  ) {
    return 'Development';
  }
  if (s.includes('cluster')) return 'Cluster';
  if (s.includes('operating')) return 'Operating';
  return 'Other';
}
