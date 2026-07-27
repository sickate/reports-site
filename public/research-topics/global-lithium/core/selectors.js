// Pure derivations from (projects, filters). No DOM, no fetch, no mutation.
//
// The contract that keeps the three surfaces honest: KPI tiles, the map and the table are
// ALL rendered from selectVisibleProjects(). Nothing may recompute its own subset, and
// nothing may read the unfiltered project list. The 44 / 43 / 43 mismatch existed because
// updateStats() read rawData while the table and map read a filtered copy.

/** Distinct values of a key, for building filter dropdown options. */
export function selectFacets(projects) {
  const uniq = (key) => [...new Set(projects.map((p) => p[key]).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'en'));
  return {
    statusGroups: uniq('status_group'),
    countries: uniq('country'),
  };
}

/**
 * THE single truth. Every visible surface derives from this.
 *
 * `filters.statusGroups === null` means "all" — the legend and the status dropdown are two
 * editors of this one field rather than two independent filters.
 */
export function selectVisibleProjects(projects, filters, buildHaystack) {
  const q = (filters.q || '').trim().toLowerCase();
  const groups = filters.statusGroups;
  const countries = filters.countries;

  return projects.filter((item) => {
    if (groups && !groups.includes(item.status_group)) return false;
    if (countries && countries.length && !countries.includes(item.country)) return false;
    if (q && !buildHaystack(item).includes(q)) return false;
    return true;
  });
}

export function sortProjects(projects, sort) {
  const arr = [...projects];
  if (sort === 'capacity_desc') {
    arr.sort((a, b) => b.map_capacity_kta - a.map_capacity_kta);
  } else if (sort === 'capacity_asc') {
    arr.sort((a, b) => a.map_capacity_kta - b.map_capacity_kta);
  } else if (sort === 'name_asc') {
    arr.sort((a, b) => a.project.localeCompare(b.project, 'en'));
  } else if (sort === 'country_asc') {
    arr.sort((a, b) => `${a.country}${a.project}`.localeCompare(`${b.country}${b.project}`, 'en'));
  }
  return arr;
}

/** KPI tiles. Takes the ALREADY-FILTERED list — never the raw one. */
export function selectKpis(visible) {
  return {
    projectCount: visible.length,
    countryCount: new Set(visible.map((d) => d.country)).size,
    operatingCount: visible.filter((d) => d.status_group === 'Operating').length,
    pipelineCount: visible.filter(
      (d) => d.status_group === 'Construction' || d.status_group === 'Development'
    ).length,
    currentCapacity: visible.reduce((sum, d) => sum + Number(d.current_kta_lce || 0), 0),
    plannedCapacity: visible.reduce((sum, d) => sum + Number(d.planned_kta_lce || 0), 0),
  };
}

/**
 * Map markers. A project without coordinates is legitimately unmapped, so the marker count
 * is expected to be <= the row count; the difference is reported in the UI rather than
 * left as a silent discrepancy between surfaces.
 */
export function selectMappable(visible) {
  return visible.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lon));
}
