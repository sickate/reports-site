// The single declaration of the project table's columns.
//
// Before this file, a column was declared in THREE parallel positional places that had to
// be kept in the same order by hand:
//   - 14 header strings in data/copy.js
//   - 14 inline widths in an array literal *inside* the .map() callback in app.js
//   - 14 <td> expressions in renderTable()
// Nothing checked that they agreed. Inserting a column in two of the three shifted every
// header one cell to the left of its data, which reads as plausible garbage rather than as
// a crash. That is the defect this file removes: order, label, width and renderer for a
// column now live on one object, and everything else derives from it.
//
// Must stay DOM-free and side-effect-free — scripts/check-lithium-consistency.mjs imports
// it in Node to assert that every `key` really exists in the CSV, so a renamed CSV column
// fails the build instead of rendering an em dash forever.

/**
 * Renderer names, NOT functions.
 *
 * The actual renderers need currentLang, localizeValue(), renderCountryPill(),
 * renderStatusPill(), listedOwnerLabel() and UPDATE_MARKER — all of which live in app.js
 * and drag DOM and locale concerns with them. Keeping this module a pure data table means
 * Node can import it; app.js holds a CELL_RENDERERS map keyed by these same names and
 * falls back to `text` for anything unrecognised, so the worst failure is a plain cell.
 */
export const RENDER_KINDS = ['projectName', 'countryPill', 'statusPill', 'listedOwner', 'text', 'number'];

/**
 * Column groups.
 *
 * Every group opens with the same anchor trio (项目 / 国家 / 状态) so switching groups never
 * costs the reader their place, and the status cell keeps its lifecycle/structure/activity
 * badges in every group. `full` is the escape hatch; the three focused groups exist so the
 * default view fits on screen without horizontal scrolling at all.
 */
export const COLUMN_GROUPS = [
  { id: 'overview', label: '概览', hint: '归属、产能与成本' },
  { id: 'geology', label: '地质与资源', hint: '地区、类型、储量与品位' },
  { id: 'logistics', label: '物流与风险', hint: '地址、路线与扰动因素' },
  { id: 'full', label: '全部列', hint: '15 列，需横向滚动' },
];

export const DEFAULT_COLUMN_GROUP = 'overview';

/**
 * The row count above which the full-rebuild renderer stops being obviously fine.
 *
 * At 44 rows renderTable() rebuilds 616 cells as one innerHTML string on every commit and
 * that is not the expensive part of the frame. Deliberately NOT pagination-triggering: if
 * this budget is ever exceeded, the first lever is debouncing the search `input` commit,
 * and the second is a windowed renderer that still emits one <tr> per visible project.
 * Pagination proper is only justified once `assertViewConsistency` can be restated in
 * terms of a total that the KPI tiles also publish — because the invariant it would
 * otherwise weaken (tableRows === visible.length) is the check that exists specifically to
 * stop "hero says 44, table shows 43" from shipping again.
 */
export const TABLE_ROW_BUDGET = 250;

const ALL = '*';

/**
 * Ordered. `columnsForGroup` filters and preserves this order, so there is no per-group
 * ordering to maintain — the price is that `full` is a re-ordering of the historical
 * 14-column table (status moves up into the anchor trio, and `region` finally appears).
 */
export const COLUMNS = [
  { key: 'project', label: '项目', width: 200, groups: ALL, render: 'projectName', frozen: true },
  { key: 'country', label: '国家', width: 110, groups: ALL, render: 'countryPill' },
  { key: 'status', label: '状态', width: 150, groups: ALL, render: 'statusPill' },

  { key: 'listed_owner', label: '所属上市公司', width: 210, groups: ['overview', 'full'], render: 'listedOwner', derived: true },
  { key: 'current_kta_lce', label: '当前产能', width: 96, groups: ['overview', 'full'], render: 'number', align: 'right' },
  { key: 'planned_kta_lce', label: '规划产能', width: 96, groups: ['overview', 'full'], render: 'number', align: 'right' },
  { key: 'cost', label: '成本', width: 230, groups: ['overview', 'full'], render: 'text' },

  { key: 'region', label: '地区', width: 140, groups: ['geology', 'full'], render: 'text' },
  { key: 'deposit_type', label: '类型', width: 130, groups: ['geology', 'full'], render: 'text' },
  { key: 'reserve_resource', label: '储量/资源', width: 230, groups: ['geology', 'full'], render: 'text' },
  { key: 'grade', label: '品位', width: 110, groups: ['overview', 'geology', 'full'], render: 'text' },

  { key: 'address', label: '地址', width: 200, groups: ['logistics', 'full'], render: 'text' },
  { key: 'route', label: '运输/出口路线', width: 210, groups: ['logistics', 'full'], render: 'text' },
  { key: 'risks', label: '产能扰动因素', width: 250, groups: ['logistics', 'full'], render: 'text' },
  { key: 'source_note', label: '数据来源摘要', width: 190, groups: ['full'], render: 'text' },
];

/** Columns of one group, in COLUMNS order. Unknown ids fall back to the default group. */
export function columnsForGroup(groupId) {
  const id = COLUMN_GROUPS.some((g) => g.id === groupId) ? groupId : DEFAULT_COLUMN_GROUP;
  return COLUMNS.filter((c) => c.groups === ALL || c.groups.includes(id));
}

/**
 * Declared px width of a group.
 *
 * Feeds `table.style.minWidth`. With `table-layout: fixed; width: 100%` that gives the
 * right behaviour in both directions: a narrow group on a wide viewport stretches
 * proportionally and never scrolls, while a wide group or a narrow viewport pins the
 * declared widths and scrolls horizontally. That is what keeps "never squeeze the column
 * widths" true for every group automatically — squeezing them at 375px is what once blew
 * the table's height out to 41,478px.
 */
export function groupWidth(groupId) {
  return columnsForGroup(groupId).reduce((sum, c) => sum + c.width, 0);
}

/** Valid group ids, for the URL whitelist. */
export const COLUMN_GROUP_IDS = COLUMN_GROUPS.map((g) => g.id);
