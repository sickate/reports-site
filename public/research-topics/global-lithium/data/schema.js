// CSV column contract + the orthogonal project-state taxonomy.
//
// Pure data/logic: imported by BOTH the browser app and
// scripts/check-lithium-consistency.mjs, so the build check validates exactly what the
// runtime parses. Keep free of DOM references.
//
// ---------------------------------------------------------------------------------------
// WHY THREE COLUMNS INSTEAD OF ONE `status`
// ---------------------------------------------------------------------------------------
// The database used to carry a single free-text `status` ("Operating starter plant / major
// expansion under construction") which a chain of `String.includes()` tests collapsed into
// one presentation bucket. Two failures followed directly from that design:
//
//   1. Silent drop. A status matching no branch fell through to 'Other', which the legend
//      did not render, so the row vanished from the table AND the map while still being
//      counted in the KPIs. `Uyuni cluster` sat in that hole.
//   2. Systematic miscount. The single field mixed LIFE STAGE with CAPACITY ACTIVITY and
//      RECORD SHAPE, so whichever token the heuristic matched first won. Six producing
//      assets were filed as Development / Construction / Cluster and the "在产样本" KPI
//      read 17 against a true 26.
//
// The fix is to stop deriving and start recording. Three orthogonal columns, each with a
// closed enum:
//
//   lifecycle  — is it producing, being built, being studied, stopped, or just a resource?
//   structure  — is this row ONE asset, or an aggregate of several (fragmented disclosure)?
//   activity   — what is happening to its capacity right now?
//
// `status` survives as descriptive prose for the table pill and the search haystack. It no
// longer drives filtering, KPIs or map colour, so its wording can change freely.
//
// Ramp-up is deliberately NOT a lifecycle value: an asset in ramp-up is producing. It is
// `lifecycle: operating` + `activity: ramping`, which is why "在产样本" counts it. The
// legend still shows 爬坡 as its own chip — that is a presentation grouping (see
// deriveStatusGroup), not a claim that ramping assets are not operating.

export const numericFields = new Set([
  'current_kta_lce',
  'planned_kta_lce',
  'lat',
  'lon',
  'port_lat',
  'port_lon',
  'map_capacity_kta',
]);

/** Where the asset is in its life. Closed enum — a value outside it fails the build. */
export const LIFECYCLE_VALUES = ['operating', 'construction', 'development', 'on-hold', 'resource-stage'];

/** Whether the row is a single asset or an aggregate of several. */
export const STRUCTURE_VALUES = ['single', 'cluster'];

/** What is happening to capacity. `none` = nothing beyond steady-state operation. */
export const ACTIVITY_VALUES = [
  'expanding',            // expansion under construction or formally announced
  'expansion-permitted',  // permitted, not yet started
  'expansion-optional',   // capacity headroom exists, not committed
  'ramping',              // the asset itself is not yet at nameplate
  'restart-optional',     // idled, restart is on the table
  'none',
];

export const LIFECYCLE_LABELS = {
  operating: '在产',
  construction: '建设中',
  development: '开发中',
  'on-hold': '停摆 / 搁置',
  'resource-stage': '资源阶段',
};

export const STRUCTURE_LABELS = {
  single: '单体项目',
  cluster: '项目群 / 集群',
};

export const ACTIVITY_LABELS = {
  expanding: '扩产建设中',
  'expansion-permitted': '扩产已核准',
  'expansion-optional': '具备扩产弹性',
  ramping: '产能爬坡中',
  'restart-optional': '可择机重启',
  none: '稳产 / 无增量动作',
};

/**
 * Presentation buckets for the map legend and the status dropdown.
 *
 * Every bucket here is reachable by construction (see deriveStatusGroup: the enums are
 * closed and every branch returns a member of this list), which is what removes the
 * 'Other' fallback hole rather than merely patching it.
 */
export const statusLegendItems = [
  'Operating', 'Ramp-up', 'Construction', 'Development', 'On hold / stalled', 'Resource stage',
];

/**
 * lifecycle + activity -> one legend bucket.
 *
 * Total over the closed enums: `operating` splits on whether the asset is still ramping,
 * every other lifecycle maps 1:1. `structure` is deliberately NOT folded in — clusters are
 * a separate filter dimension now, which is what stopped three producing Chinese clusters
 * from being filed as "not operating".
 */
export function deriveStatusGroup({ lifecycle, activity }) {
  switch (lifecycle) {
    case 'operating': return activity === 'ramping' ? 'Ramp-up' : 'Operating';
    case 'construction': return 'Construction';
    case 'development': return 'Development';
    case 'on-hold': return 'On hold / stalled';
    case 'resource-stage': return 'Resource stage';
    default: return 'Resource stage';
  }
}

/**
 * status prose -> the lifecycle it asserts, for the build check ONLY.
 *
 * The CSV columns are authoritative; this exists so that editing `status` without editing
 * `lifecycle` (or vice versa) is a build error rather than a page that quietly contradicts
 * its own prose. A status string absent from this map only warns — new wording is allowed,
 * it just has to be declared here before it can be cross-checked.
 */
export const STATUS_LIFECYCLE_EXPECTATION = {
  'Operating': 'operating',
  'Operating / expanding': 'operating',
  'Operating / expansion': 'operating',
  'Operating / early ramp-up': 'operating',
  'Operating / expansion optionality': 'operating',
  'Operating / expanding cluster': 'operating',
  'Operating / policy-sensitive cluster': 'operating',
  'Operating / expansion-permitted': 'operating',
  'Operating starter plant / major expansion under construction': 'operating',
  'Ramp-up': 'operating',
  'Ramp-up / integrated refining': 'operating',
  'Construction': 'construction',
  'Construction / phased ramp-up': 'construction',
  'Construction / commissioning': 'construction',
  'Construction / disputed development environment': 'construction',
  'Construction / phased build': 'construction',
  'Permitted / pre-construction': 'development',
  'Permitted / financing-backed development': 'development',
  'Development': 'development',
  'DFS-stage development': 'development',
  'On hold / politically constrained': 'on-hold',
  'Stalled / concession risk': 'on-hold',
  'Care & maintenance / optional restart': 'on-hold',
  'Resource giant / commercial scale still limited': 'resource-stage',
  'Early-stage / pilot to development': 'development',
};
