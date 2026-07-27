// Filter state <-> query string, plus a mirror up to the parent frame.
//
// THE IFRAME RULE: history.replaceState ONLY.
// This page runs inside an iframe on reports.instap.net. An iframe navigation pushes an
// entry onto the JOINT session history, so pushState (or assigning location.search /
// location.hash) would make the user's browser Back button walk backwards through filter
// states instead of leaving the report. That is the easiest way to make the host app feel
// broken, and it is invisible when testing the page standalone.

const DEFAULT_VIEW_ID = 'cockpit';

const DEFAULTS = {
  q: '',
  statusGroups: null,   // null = all
  countries: [],        // [] = all
  structures: [],       // [] = all
  sort: 'capacity_desc',
};

const STATE_MESSAGE_TYPE = 'instap-research-topic-state';

/** State -> "?q=pil&status=Operating,Ramp-up&country=Australia&sort=name_asc" */
export function encodeState({ view, filters, sort }) {
  const params = new URLSearchParams();
  if (view && view !== DEFAULT_VIEW_ID) params.set('view', view);
  if (filters.q && filters.q !== DEFAULTS.q) params.set('q', filters.q);
  if (filters.statusGroups && filters.statusGroups.length) {
    params.set('status', filters.statusGroups.join(','));
  }
  if (filters.countries && filters.countries.length) {
    params.set('country', filters.countries.join(','));
  }
  if (filters.structures && filters.structures.length) {
    params.set('structure', filters.structures.join(','));
  }
  if (sort && sort !== DEFAULTS.sort) params.set('sort', sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Decode from a query string. Unknown keys are ignored and malformed values fall back to
 * defaults, so an old shared link can never throw — it just filters less than intended.
 * `validGroups` / `validCountries` drop values that no longer exist in the data.
 */
export function decodeState(search, {
  validGroups = null, validCountries = null, validStructures = null, validViews = null,
} = {}) {
  const params = new URLSearchParams(search || '');
  const split = (key, valid) => {
    const raw = params.get(key);
    if (!raw) return null;
    let list = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (valid) list = list.filter((v) => valid.includes(v));
    return list.length ? list : null;
  };

  const sort = params.get('sort');
  const view = params.get('view');
  return {
    view: (validViews && validViews.includes(view)) ? view : DEFAULT_VIEW_ID,
    filters: {
      q: params.get('q') || DEFAULTS.q,
      statusGroups: split('status', validGroups),
      countries: split('country', validCountries) || [],
      structures: split('structure', validStructures) || [],
    },
    sort: ['capacity_desc', 'capacity_asc', 'name_asc', 'country_asc'].includes(sort)
      ? sort
      : DEFAULTS.sort,
  };
}

/**
 * Write the query string to our own URL and mirror it to the parent frame.
 *
 * Debounced and diffed: typing in the search box would otherwise issue a replaceState per
 * keystroke. Some browsers throttle high-frequency history calls and start dropping them.
 */
export function createUrlSync({ delay = 200 } = {}) {
  let timer = null;
  let last = null;

  function flush(state) {
    const search = encodeState(state);
    if (search === last) return;
    last = search;

    try {
      // replaceState, never pushState — see THE IFRAME RULE above.
      window.history.replaceState(null, '', `${window.location.pathname}${search}${window.location.hash}`);
    } catch (error) {
      /* sandboxed / opaque origin: URL sync is a nicety, never a hard dependency */
    }

    if (window.parent !== window) {
      try {
        window.parent.postMessage({ type: STATE_MESSAGE_TYPE, search }, '*');
      } catch (error) {
        /* cross-origin parent: ignore */
      }
    }
  }

  return function sync(state) {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => flush(state), delay);
  };
}
