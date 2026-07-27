// Minimal observable store — the single source of truth for view state.
//
// Why this exists: filter state used to live in three places at once — the DOM
// (`statusFilter.value`), a module-level Set (`activeStatusGroups`), and implicitly in
// whatever each renderer happened to read. Two editors of "which status groups are
// visible" is exactly how the legend and the dropdown could disagree, and how the KPI
// tiles could describe a different set than the table. One field, many editors.
//
// Deliberately tiny: no reducers, no action types, no middleware. `commit()` shallow-merges
// a patch and notifies subscribers once.

/**
 * @param {object} initialState
 * @returns {{getState: () => object, commit: (patch: object|Function, meta?: object) => void,
 *            subscribe: (fn: Function) => Function}}
 */
export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();
  let notifying = false;

  const getState = () => state;

  function commit(patch, meta = {}) {
    const next = typeof patch === 'function' ? patch(state) : patch;
    if (!next) return;

    const candidate = { ...state, ...next };

    // Skip no-op commits. Renderers are idempotent, but a no-op still costs a full
    // table + map rebuild and a height re-post to the parent frame.
    if (shallowEqual(state, candidate)) return;

    state = candidate;

    // Re-entrancy guard: a renderer that commits during a notify (e.g. clamping a page
    // index) would otherwise recurse. The outer notify picks up the newest state.
    if (notifying) return;

    notifying = true;
    try {
      let guard = 0;
      let seen = state;
      do {
        seen = state;
        for (const fn of listeners) fn(state, meta);
        guard += 1;
      } while (seen !== state && guard < 5);
    } finally {
      notifying = false;
    }
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { getState, commit, subscribe };
}

// One level deep, with array/Set awareness — enough for this state shape.
function shallowEqual(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (!valueEqual(a[k], b[k])) return false;
  }
  return true;
}

function valueEqual(x, y) {
  if (x === y) return true;
  if (Array.isArray(x) && Array.isArray(y)) {
    return x.length === y.length && x.every((v, i) => v === y[i]);
  }
  if (x && y && typeof x === 'object' && typeof y === 'object') {
    const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
    for (const k of keys) {
      const a = x[k];
      const b = y[k];
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length || !a.every((v, i) => v === b[i])) return false;
      } else if (a !== b) {
        return false;
      }
    }
    return true;
  }
  return false;
}
