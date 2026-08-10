// Runtime consistency guarantee for the three surfaces.
//
// The reviewed defect was "hero says 44, map says 43/44, table shows 43 rows". The data
// bug behind it is fixed and the build check stops it recurring in the data, but a future
// refactor could reintroduce it in the RENDER path — a surface quietly filtering again on
// its own. This asserts, on every commit, that they still agree.
//
// Markers are compared against COORDINATE-BEARING rows, not all rows: a project without
// lat/lon is legitimately unmapped. That difference is reported to the user (see the
// `unmapped` return value) instead of being papered over — otherwise this check would just
// recreate the same class of silent discrepancy one level down.

const DEBUG = (() => {
  try {
    return new URLSearchParams(window.location.search).has('debug')
      || ['localhost', '127.0.0.1'].includes(window.location.hostname);
  } catch (error) {
    return false;
  }
})();

/**
 * @param {object} a
 * @param {number} a.headerCells    live <th> count
 * @param {number|null} a.bodyCells cell count of the first real row; null when empty
 * @param {number} a.expectedColumns columnsForGroup(state.cols).length
 * @returns {{ok: boolean, unmapped: number}} `unmapped` is how many visible rows have no
 *   coordinates — the caller surfaces it in the map footer.
 */
export function assertViewConsistency({
  visible, mappable, kpiCount, tableRows, markerCount,
  headerCells, bodyCells, expectedColumns,
}) {
  const unmapped = visible.length - mappable.length;

  // The column contract is checked in BOTH branches. data/columns.js removes header/body
  // drift by construction; this asserts the construction actually held, which is this
  // codebase's habit — and it is the runtime replacement for the three parallel arrays.
  const columnsOk = headerCells === expectedColumns
    && (bodyCells === null || bodyCells === expectedColumns);

  // An empty result set renders an "empty state" row, so ROW counting is not comparable.
  // Everything else still is, and used to go unchecked: an empty result with markers left
  // on the map was a bug this function returned `ok: true` for.
  if (!visible.length) {
    const emptyOk = markerCount === 0 && columnsOk;
    if (!emptyOk) {
      const detail = { kpiCount, tableRows, markerCount, visible: 0, mappable: 0, headerCells, bodyCells, expectedColumns };
      console.error('[global-lithium] view inconsistency — empty result set is not clean', detail);
      if (DEBUG) showBanner(detail);
    }
    return { ok: emptyOk, unmapped: 0 };
  }

  const ok = kpiCount === visible.length
    && tableRows === visible.length
    && markerCount === mappable.length
    && columnsOk;

  if (!ok) {
    const detail = {
      kpiCount, tableRows, markerCount, visible: visible.length, mappable: mappable.length,
      headerCells, bodyCells, expectedColumns,
    };
    console.error('[global-lithium] view inconsistency — KPI / table / map / columns disagree', detail);
    if (DEBUG) showBanner(detail);
  }

  return { ok, unmapped };
}

function showBanner(detail) {
  let el = document.getElementById('inconsistency-banner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'inconsistency-banner';
    el.style.cssText = [
      'position:fixed', 'inset-inline:0', 'top:0', 'z-index:99999',
      'background:#7f1d1d', 'color:#fee2e2', 'padding:8px 14px',
      'font:600 13px/1.5 system-ui,sans-serif', 'text-align:center',
    ].join(';');
    document.body.appendChild(el);
  }
  el.textContent = `视图不一致：KPI ${detail.kpiCount} · 表格 ${detail.tableRows} 行 · `
    + `地图 ${detail.markerCount} 点（可见 ${detail.visible}，有坐标 ${detail.mappable}）`
    + ` · 列 表头 ${detail.headerCells} / 单元格 ${detail.bodyCells} / 应为 ${detail.expectedColumns}`;
}
