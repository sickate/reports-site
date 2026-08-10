// Map quick-zoom regions.
//
// Country LISTS, not lat/lon boxes. Bounds are computed at runtime from the projects that
// are actually visible, which matters twice over: a hardcoded box would silently exclude a
// new project in a new country, and it would ignore the active filter — zooming to "South
// America" while a filter hides most of it should frame what is left, not what used to be
// there.
//
// scripts/check-lithium-consistency.mjs asserts that every country named here exists in the
// CSV and that every CSV country belongs to at least one region, so adding a project in a
// new country fails the build rather than quietly creating a project no region can reach.
//
// `countries: null` means "everything currently visible".

export const MAP_REGIONS = [
  { id: 'all', label: '全球', countries: null },
  { id: 'south-america', label: '南美锂三角', countries: ['Argentina', 'Chile', 'Bolivia'] },
  { id: 'australia', label: '澳洲', countries: ['Australia'] },
  { id: 'north-america', label: '北美', countries: ['Canada', 'USA', 'Mexico'] },
  { id: 'africa', label: '非洲', countries: ['Mali', 'Zimbabwe', 'DRC', 'Ghana'] },
  { id: 'china', label: '中国', countries: ['China'] },
  { id: 'europe', label: '欧洲', countries: ['Serbia', 'Czech Republic', 'Finland', 'Portugal'] },
  { id: 'brazil', label: '巴西', countries: ['Brazil'] },
];

/** Every country named across all regions, for the build check. */
export const REGION_COUNTRIES = [
  ...new Set(MAP_REGIONS.flatMap((r) => r.countries || [])),
];

/** Visible+mappable rows belonging to a region. `all` passes everything through. */
export function projectsInRegion(region, mappable) {
  if (!region || !region.countries) return mappable;
  return mappable.filter((p) => region.countries.includes(p.country));
}
