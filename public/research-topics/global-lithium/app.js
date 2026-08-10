// Global lithium research topic — application entry.
//
// Split out of the former 3,900-line single-file global-lithium-projects-2026.html.
// Native ES modules, no bundler, mirroring public/research-topics/semiconductor-upstream/.
// Pure data and parsing live in ./data/*.js so scripts/ can import the same code.

import {
  HEIGHT_MESSAGE_TYPE, DATA_URL, COMPANY_FINANCIALS_URL, MARKET_URL,
} from './data/config.js';
import { DATA_CACHE_KEY, UPDATE_MARKER } from './core/version.js';
import { colorMap, countryPillColors } from './data/palette.js';
import {
  statusLegendItems, LIFECYCLE_LABELS, STRUCTURE_LABELS, ACTIVITY_LABELS,
} from './data/schema.js';
import { loadCsvData } from './data/csv.js';
import { locales } from './data/copy.js';
import { companyResearchContent } from './data/company-research.js';
import { dictionaries } from './data/dictionaries.js';
import { fieldTranslationsZh } from './data/field-translations.js';
import { listedOwners } from './data/listed-owners.js';
import { MAP_REGIONS, projectsInRegion } from './data/regions.js';
import {
  COLUMN_GROUPS, COLUMN_GROUP_IDS, DEFAULT_COLUMN_GROUP, TABLE_ROW_BUDGET,
  columnsForGroup, groupWidth,
} from './data/columns.js';
import { createStore } from './core/store.js';
import {
  selectFacets, selectVisibleProjects, selectKpis, selectMappable, sortProjects,
} from './core/selectors.js';
import { createUrlSync, decodeState } from './core/url-state.js';
import { assertViewConsistency } from './core/invariants.js';
import { VIEWS, DEFAULT_VIEW, isValidView } from './views/registry.js';
import { renderEmptyState, renderGapRegister } from './components/empty-state.js';
import { renderMetricGrid } from './components/metric.js';
import { escapeHtml, escapeRaw } from './components/escape.js';
import { GAPS, GAP_REGISTER_ORDER } from './data/gaps.js';
import { NARROW_QUERY } from './charts/kit.js';
import { renderCapacityChart } from './charts/capacity.js';
import { renderCoverageChart } from './charts/coverage.js';
import { renderTermStructureChart } from './charts/term-structure.js';
import { renderInventorySplitChart } from './charts/inventory-split.js';
import { renderConsensusBandChart } from './charts/consensus-band.js';
import { renderPolicyTimelineChart } from './charts/policy-timeline.js';

// The bilingual UI toggle was removed: the page is Chinese-only. The English strings stay
// in ./data/ because they still feed the bilingual search haystack and the build-time
// company-financials generator. A returning visitor may still carry 'en' in localStorage
// from the old build — clear it, or they land on a language the UI can no longer leave.
const LANG_STORAGE_KEY = 'instap-global-lithium-lang';
try {
  window.localStorage.removeItem(LANG_STORAGE_KEY);
} catch (error) {
  /* private mode / storage disabled: nothing to clean up */
}

const currentLang = 'zh';

const searchBox = document.getElementById('searchBox');
const statusFilter = document.getElementById('statusFilter');
const countryFilter = document.getElementById('countryFilter');
const structureFilter = document.getElementById('structureFilter');
const sortFilter = document.getElementById('sortFilter');
const tbody = document.querySelector('#dataTable tbody');
const resultSummary = document.getElementById('resultSummary');
const loadingNote = document.getElementById('loadingNote');
const errorNote = document.getElementById('errorNote');
const appRoot = document.getElementById('app');
const legend = document.getElementById('legend');
const unmappedNote = document.getElementById('unmappedNote');
const heroBadges = document.getElementById('heroBadges');
const findingsList = document.getElementById('findingsList');
const riskGrid = document.getElementById('riskGrid');
const updatesGrid = document.getElementById('updatesGrid');
const dataTableHead = document.getElementById('dataTableHead');
const dataTable = document.getElementById('dataTable');
const columnGroups = document.getElementById('columnGroups');
const projectDrawer = document.getElementById('projectDrawer');
const mapRegions = document.getElementById('mapRegions');
const tableScrollHint = document.getElementById('tableScrollHint');
const companySubnav = document.getElementById('companySubnav');
const quickTakeGrid = document.getElementById('quickTakeGrid');
const domesticTableHead = document.getElementById('domesticTableHead');
const domesticTableBody = document.getElementById('domesticTableBody');
const globalTableHead = document.getElementById('globalTableHead');
const globalTableBody = document.getElementById('globalTableBody');
const matrixTableHead = document.getElementById('matrixTableHead');
const matrixTableBody = document.getElementById('matrixTableBody');
const focusGrid = document.getElementById('focusGrid');
const rankingGrid = document.getElementById('rankingGrid');
const footnoteEl = document.getElementById('methodologySection');

const map = L.map('map', { zoomControl: true, worldCopyJump: true }).setView([18, 10], 2);

// Tile fallback chain: try OSM first, fall back to CARTO if the primary stops loading.
const tileSources = [
  {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    opts: { subdomains: 'abc', attribution: '&copy; OpenStreetMap contributors' },
  },
  {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    opts: { attribution: '&copy; OpenStreetMap contributors' },
  },
  {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    opts: { subdomains: 'abcd', attribution: '&copy; OpenStreetMap &copy; CARTO' },
  },
  {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    opts: { subdomains: 'abcd', attribution: '&copy; OpenStreetMap &copy; CARTO' },
  },
];
let activeTileLayer = null;
function applyTileSource(idx) {
  if (activeTileLayer) { activeTileLayer.remove(); }
  const src = tileSources[idx];
  let errs = 0;
  activeTileLayer = L.tileLayer(src.url, Object.assign({ maxZoom: 8 }, src.opts)).addTo(map);
  activeTileLayer.on('tileerror', () => {
    errs += 1;
    if (errs >= 4 && idx < tileSources.length - 1) {
      console.warn('[map] tile source ' + src.url + ' failing, falling back');
      applyTileSource(idx + 1);
    }
  });
}
applyTileSource(0);

const markerLayer = L.layerGroup().addTo(map);
const lineLayer = L.layerGroup().addTo(map);

// rawData is the loaded CSV; it is INPUT to the selectors, not view state, so it stays out
// of the store. Everything the user can change lives in the store.
let rawData = [];
let lastErrorMessage = '';
let companyFinanceIndex = new Map();

// Layer C. Null until /data/global-lithium-market.json arrives; every consumer checks,
// because a failed fetch must degrade to a stated "unavailable" rather than to prose that
// silently omits the core call.
let market = null;

// Single source of truth for view state.
//
// `filters.statusGroups === null` means "all". The legend chips and the status dropdown are
// two EDITORS of this one field, not two independent filters — previously the legend wrote
// a module-level Set while the dropdown's value lived in the DOM, and the render path had
// to AND them together. One field means they can never disagree.
// `cols` and `selection` are deliberately TOP-LEVEL primitives, not nested under
// `filters` or a `table: {}` object. core/store.js's valueEqual is one level deep, and
// `filters` already sits at that limit — a third level of nesting would compare unequal on
// every commit, defeat the no-op dedupe, and turn every keystroke into an unconditional
// full table + map rebuild plus a height post to the parent.
const store = createStore({
  view: DEFAULT_VIEW,
  filters: { q: '', statusGroups: null, countries: [], structures: [] },
  sort: 'capacity_desc',
  cols: DEFAULT_COLUMN_GROUP,
  selection: null,
});

const syncUrl = createUrlSync();

function notifyParentHeight() {
  if (window.parent === window || !appRoot) {
    return;
  }

  window.requestAnimationFrame(() => {
    // Measure ONLY the content root.
    //
    // This used to also max over document.body / document.documentElement scrollHeight,
    // which creates a one-way ratchet: the parent sets the iframe's height, that height
    // becomes the document's viewport height, so documentElement.scrollHeight can never
    // report less than the height already applied. The frame could grow but never shrink.
    // Harmless on a single long page; very visible once views made the content 8x shorter
    // (the 772px catalysts view was left sitting in a 6,069px frame).
    const nextHeight = Math.ceil(Math.max(appRoot.scrollHeight || 0, appRoot.offsetHeight || 0));

    window.parent.postMessage({ type: HEIGHT_MESSAGE_TYPE, height: nextHeight }, '*');
  });
}

/**
 * Post the height three times: now, after the next frame, and again after 120ms.
 *
 * One post is not enough because the caller usually just changed what is displayed, and
 * the panel's own layout is not final until after this tick; the 120ms tail covers
 * late work (web fonts, Leaflet's own reflow) that lands after the first frame.
 *
 * Every interaction that changes the document height must call this — view switching,
 * column-group switching, and the mobile drawer all do. Extracted from applyView() so
 * there is one definition rather than three copies drifting apart.
 */
function notifyHeightTriple() {
  notifyParentHeight();
  window.requestAnimationFrame(notifyParentHeight);
  window.setTimeout(notifyParentHeight, 120);
}

if ('ResizeObserver' in window) {
  const observer = new ResizeObserver(() => notifyParentHeight());
  observer.observe(appRoot);
}

window.addEventListener('load', () => {
  window.setTimeout(() => {
    map.invalidateSize();
    notifyParentHeight();
  }, 180);
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeCompanyKey(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

function formatMetric(value) {
  if (!Number.isFinite(value)) {
    return '—';
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatCount(value) {
  return Number.isFinite(value) ? value.toLocaleString('en-US') : '—';
}

function hexToRgba(hex, alpha) {
  const normalized = String(hex || '').replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return `rgba(148, 163, 184, ${alpha})`;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function translateNarrativeToZh(value, field = '') {
  if (!value) {
    return '';
  }

  const mapped = fieldTranslationsZh[field]?.[value];
  if (mapped) {
    return mapped;
  }

  return String(value);
}

function localizeValue(value, field, lang = currentLang) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (lang === 'en') {
    return String(value);
  }

  if (field === 'country') {
    return dictionaries.country[value] || String(value);
  }

  if (field === 'region') {
    return dictionaries.region[value] || translateNarrativeToZh(value);
  }

  if (field === 'status') {
    return dictionaries.status[value] || translateNarrativeToZh(value);
  }

  if (field === 'status_group') {
    return dictionaries.statusGroup[value] || translateNarrativeToZh(value);
  }

  // The orthogonal columns carry closed enums, so their labels live next to the enums in
  // schema.js rather than in the CSV-value dictionaries.
  if (field === 'lifecycle') return LIFECYCLE_LABELS[value] || String(value);
  if (field === 'structure') return STRUCTURE_LABELS[value] || String(value);
  if (field === 'activity') return ACTIVITY_LABELS[value] || String(value);

  if (field === 'deposit_type') {
    return dictionaries.depositType[value] || translateNarrativeToZh(value);
  }

  if (field === 'project') {
    return dictionaries.project[value] || String(value);
  }

  return translateNarrativeToZh(value, field);
}

function listedOwnerLabel(project, lang = currentLang) {
  const record = listedOwners[project];
  if (!record) {
    return '—';
  }

  return lang === 'zh' ? record.zh : record.en;
}

function pillMarkup(label, color) {
  return `<span class="table-pill" style="background:${hexToRgba(color, 0.14)};border-color:${hexToRgba(color, 0.32)};color:${color};">${escapeHtml(label)}</span>`;
}

function renderCountryPill(country) {
  const label = localizeValue(country, 'country', currentLang);
  const color = countryPillColors[country] || '#94a3b8';
  return pillMarkup(label, color);
}

// Status cell = the free-text prose pill (coloured by its derived legend bucket) plus the
// two orthogonal axes the prose can no longer be trusted to convey. Rendered as badges
// inside the existing column rather than as new columns: the table already declares 14
// fixed widths and adding columns is what previously blew its mobile layout up.
function renderStatusPill(item) {
  const label = localizeValue(item.status, 'status', currentLang);
  const color = colorMap[item.status_group] || '#94a3b8';
  const badges = [
    item.structure === 'cluster'
      ? `<span class="axis-badge axis-cluster">${escapeHtml(STRUCTURE_LABELS.cluster)}</span>`
      : '',
    // Suppressed when the chip would restate its own legend bucket: `ramping` is exactly
    // what puts a row in the 爬坡 bucket, so showing both reads as two facts, not one.
    item.activity && item.activity !== 'none'
      && !(item.activity === 'ramping' && item.status_group === 'Ramp-up')
      ? `<span class="axis-badge axis-activity">${escapeHtml(ACTIVITY_LABELS[item.activity] || item.activity)}</span>`
      : '',
  ].join('');

  return pillMarkup(label, color) + (badges ? `<div class="axis-badges">${badges}</div>` : '');
}

function getPairedValue(value, field) {
  const primary = localizeValue(value, field, currentLang);
  const secondary = localizeValue(value, field, currentLang === 'zh' ? 'en' : 'zh');
  return { primary, secondary };
}

// Rebuilt only when the option set or its labels actually change: renderFilters() runs on
// every commit (including every search keystroke), and rebuilding <option>s unconditionally
// would collapse an open native select mid-interaction.
let lastFacetSignature = '';

function renderFilters() {
  const t = locales[currentLang];
  const { filters, sort } = store.getState();
  const facets = selectFacets(rawData);

  const facetSignature = JSON.stringify([facets.statusGroups, facets.countries, facets.structures]);
  if (facetSignature !== lastFacetSignature) {
    lastFacetSignature = facetSignature;

    const fill = (select, defaultLabel, values, field) => {
      select.innerHTML = '';
      const first = document.createElement('option');
      first.value = 'all';
      first.textContent = defaultLabel;
      select.appendChild(first);
      for (const value of values) {
        const opt = document.createElement('option');
        opt.value = value;
        opt.textContent = localizeValue(value, field, currentLang);
        select.appendChild(opt);
      }
    };

    fill(statusFilter, t.allStatuses, facets.statusGroups, 'status_group');
    fill(countryFilter, t.allCountries, facets.countries, 'country');
    fill(structureFilter, t.allStructures, facets.structures, 'structure');

    sortFilter.innerHTML = '';
    for (const [value, label] of Object.entries(t.sortOptions)) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = label;
      sortFilter.appendChild(opt);
    }
  }

  // Controlled inputs: the DOM reflects the store, never the other way round. The status
  // dropdown can only express "all" or exactly one group, so a multi-group selection made
  // via the legend shows as "all" here — the legend chips carry the detail.
  const groups = filters.statusGroups;
  statusFilter.value = groups && groups.length === 1 ? groups[0] : 'all';
  countryFilter.value = filters.countries.length === 1 ? filters.countries[0] : 'all';
  structureFilter.value = filters.structures.length === 1 ? filters.structures[0] : 'all';
  sortFilter.value = sort;
  if (searchBox.value !== filters.q) searchBox.value = filters.q;
}

function renderLegend() {
  const t = locales[currentLang];
  const { filters } = store.getState();
  // All buckets always render. Every one is reachable by construction now that
  // deriveStatusGroup() is total over closed enums, so there is no "only render it if
  // something lands in it" case left — that conditional existed for the 'Other' fallback,
  // which was the hole rows fell into.
  const active = filters.statusGroups;
  legend.innerHTML = statusLegendItems
    .map((key) => {
      const isOn = !active || active.includes(key);
      return `<button class="legend-filter ${isOn ? '' : 'is-inactive'}" data-status-group="${escapeHtml(key)}" type="button" aria-pressed="${isOn}"><span class="dot" style="background:${colorMap[key]}"></span>${escapeHtml(t.legend[key])}</button>`;
    })
    .join('');
}

// ---- Views -----------------------------------------------------------------

const viewTabs = document.getElementById('viewTabs');
let lastRenderedView = null;

function renderTabs(activeView) {
  viewTabs.innerHTML = VIEWS.map((v) => `
    <button class="view-tab" type="button" role="tab" id="tab-${v.id}"
            data-view="${v.id}" aria-controls="view-${v.id}"
            aria-selected="${v.id === activeView}" tabindex="${v.id === activeView ? 0 : -1}">
      <span>${escapeHtml(v.label)}</span>
      <span class="view-tab-hint">${escapeHtml(v.hint)}</span>
    </button>`).join('');
}

function applyView(activeView) {
  for (const v of VIEWS) {
    const panel = document.getElementById(`view-${v.id}`);
    if (panel) panel.hidden = v.id !== activeView;
  }

  if (activeView === lastRenderedView) return;
  lastRenderedView = activeView;

  // Leaflet measures its container on creation. A map that was sized while its view was
  // display:none comes back as grey tiles, so re-measure on entry — and again after a
  // frame, because the panel's own layout is not final until after this tick.
  if (activeView === 'atlas') {
    map.invalidateSize();
    window.requestAnimationFrame(() => {
      map.invalidateSize();
      notifyParentHeight();
    });
  }

  // Switching views changes the document height dramatically. One post now and one after
  // layout settles, or the parent iframe keeps the previous view's height.
  notifyHeightTriple();
}

// Charts. Rendered ONCE, deliberately outside render().
//
// render() is the store subscriber and reruns on every search keystroke; none of these six
// charts depends on the filter state, so putting them in that path would rebuild six SVGs
// per character typed for no change in output. The capacity chart in particular is fixed to
// all 44 projects by design — see charts/capacity.js for why a chart on one tab must not
// silently follow filters set on another.
//
// Each chart degrades on its own: a missing market.json leaves the others untouched, and a
// throw inside one is caught so it cannot take the rest of the page down with it.
function renderCharts() {
  mountChart('supplyChartSlot', () => renderCapacityChart(rawData, market?.meta?.asOf));

  mountChart('coverageChartSlot', () => {
    const envelope = market?.charts?.h1Coverage;
    if (!envelope) return '';

    // FY26E comes from the company table, not from market.json, so the ratio follows any
    // sell-side revision instead of going stale in a second copy. buildFinanceTableRows
    // applies the JSONL overrides first, which are authoritative over the module.
    const rows = buildFinanceTableRows(companyResearchContent[currentLang].domesticRows);
    const fy26e = new Map(rows.map((r) => [r[0], parseMetricValue(r[3])]));
    return renderCoverageChart(envelope, fy26e, market.meta.asOf);
  });

  // Each chart is mounted separately rather than as one concatenated string, so a series
  // missing from market.json costs its own chart and nothing else.
  mountChart('costChartSlot', () => [
    seriesChart('gfexTermStructure', renderTermStructureChart),
    seriesChart('inventorySplit', renderInventorySplitChart),
    seriesChart('consensusBand', renderConsensusBandChart),
  ].join(''));

  mountChart('catalystsChartSlot', () => seriesChart('policyTimeline', renderPolicyTimelineChart));
}

/** Render a market.json-backed chart, or nothing at all if its series is absent. */
function seriesChart(key, render) {
  const envelope = market?.charts?.[key];
  return envelope ? render(envelope, market.meta.asOf) : '';
}

// Charts pick a wide or narrow viewBox from a media query (see charts/kit.js). The
// breakpoint is discrete and viewport-driven, so re-rendering on it cannot feed back into
// the height contract the way a width measurement would — but it does have to be wired up,
// or a reader who rotates a phone keeps the layout chosen for the other orientation.
if (window.matchMedia) {
  const mq = window.matchMedia(NARROW_QUERY);
  const onBreakpointChange = () => {
    renderCharts();
    notifyParentHeight();
  };
  if (mq.addEventListener) mq.addEventListener('change', onBreakpointChange);
  else if (mq.addListener) mq.addListener(onBreakpointChange);
}

function mountChart(elementId, build) {
  const el = document.getElementById(elementId);
  if (!el) return;

  try {
    const html = build();
    if (html) el.innerHTML = html;
  } catch (error) {
    console.error(`[global-lithium] chart "${elementId}" failed to render`, error);
    el.innerHTML = '<p class="market-unavailable">图表渲染失败，其余内容不受影响。</p>';
  }
}

// The three views whose data we could not source. Rendered once — the content is static
// until the underlying gap is filled, at which point its entry leaves data/gaps.js.
function renderGapViews() {
  // The kickers now live in index.html so these slots can sit alongside the chart slots.
  document.getElementById('supplyGapSlot').innerHTML = renderEmptyState(GAPS.supplyBridge);

  document.getElementById('costGapSlot').innerHTML =
    renderEmptyState(GAPS.costCurve)
    + renderEmptyState(GAPS.supplyDemandBalance)
    + renderEmptyState(GAPS.priceScenarios);

  document.getElementById('catalystsGapSlot').innerHTML = renderEmptyState(GAPS.catalystFeed);

  document.getElementById('gapRegisterSection').innerHTML =
    `<div class="section-kicker">数据缺口登记</div>`
    + `<p class="section-note">下列指标本页尚未呈现。「未披露」= 免费公开源确实不提供；`
    + `「数据缺口」= 应当可得但尚未采集。逐条列出而不是留下破折号，是为了让缺口可被复核。</p>`
    + renderGapRegister(GAP_REGISTER_ORDER.map((key) => GAPS[key]));
}

function renderJumpLinks(container, links) {
  container.innerHTML = links
    .map(
      (item) =>
        `<a class="subnav-link" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`
    )
    .join('');
}

// Parse a metric cell ("~2,795", "13.1x", "-6.9x", "N.M.", "—") to a number or null.
function parseMetricValue(value) {
  if (value == null) return null;
  const raw = String(value);
  if (/N\.?M\.?|N\.?A\.?|待补|—/.test(raw)) return null;
  const n = parseFloat(raw.replace(/[~,x×\s]/g, ''));
  return Number.isFinite(n) ? n : null;
}

// strength in [0,1] (1 = strongest) -> subtle green->amber->red cell background.
function heatBg(strength) {
  const hue = Math.max(0, Math.min(130, strength * 130)); // 0 red, 65 amber, 130 green
  return `background:hsla(${hue.toFixed(0)}, 70%, 45%, 0.22);`;
}

function renderMetricsTable(headEl, bodyEl, headers, rows) {
  headEl.innerHTML = headers.map((label) => `<th>${escapeHtml(label)}</th>`).join('');

  // Per-column strength over the 8 metric columns (row indices 1..8):
  // net-profit cols (0-3) higher = stronger; PE cols (4-7) lower positive = stronger.
  const isPE = (c) => c >= 4;
  const colRange = [];
  for (let c = 0; c < 8; c += 1) {
    const vals = rows
      .map((r) => parseMetricValue(r[c + 1]))
      .filter((v) => v !== null && (isPE(c) ? v > 0 : true));
    colRange[c] = vals.length ? { min: Math.min(...vals), max: Math.max(...vals) } : null;
  }

  bodyEl.innerHTML = rows
    .map((row) => {
      const [name, ...rest] = row;
      const metrics = rest.slice(0, 8)
        .map((value, c) => {
          const v = parseMetricValue(value);
          const range = colRange[c];
          let style = '';
          if (v !== null && range && range.max > range.min && (!isPE(c) || v > 0)) {
            const t = (v - range.min) / (range.max - range.min);
            const strength = isPE(c) ? 1 - t : t; // PE: lower = cheaper = stronger
            style = ` style="${heatBg(strength)}"`;
          }
          return `<td class="num"${style}>${escapeHtml(value)}</td>`;
        })
        .join('');
      const marketCap = rest[8];
      const note = rest[9];
      return `
        <tr>
          <td class="company-name">${escapeHtml(name)}</td>
          ${metrics}
          <td class="num mktcap">${escapeHtml(marketCap)}</td>
          <td>${escapeHtml(note)}</td>
        </tr>
      `;
    })
    .join('');
}

function createCompanyFinanceIndex(records) {
  const index = new Map();

  records
    .filter(
      (record) =>
        record.reportSlugs?.includes('2026-04-global-lithium') &&
        record.finance?.datasetKind === 'annual'
    )
    .forEach((record) => {
      [record.companyName, ...(record.aliases || [])].forEach((name) => {
        const normalized = normalizeCompanyKey(name);

        if (normalized) {
          index.set(normalized, record);
        }
      });
    });

  return index;
}

function getCompanyFinanceRecord(companyName) {
  return companyFinanceIndex.get(normalizeCompanyKey(companyName)) || null;
}

async function loadCompanyFinancials() {
  const response = await fetch(`${COMPANY_FINANCIALS_URL}?v=${DATA_CACHE_KEY}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const text = await response.text();
  const records = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  companyFinanceIndex = createCompanyFinanceIndex(records);
}

function buildFinanceTableRows(baseRows) {
  return baseRows.map((row) => {
    const companyName = row[0];
    const fallbackCap = row[9];
    const fallbackNote = row[10];
    const record = getCompanyFinanceRecord(companyName);

    if (!record?.finance) {
      return row;
    }

    const netProfit = record.finance.display?.netProfit || ['待补', '待补', '待补', '待补'];
    const forwardPE = record.finance.display?.forwardPE || ['待补', '待补', '待补', '待补'];
    const marketCap = record.finance.display?.marketCap || fallbackCap || '—';
    const note = record.finance.notes?.[currentLang] || fallbackNote || record.finance.note || '—';

    return [
      companyName,
      netProfit[0] || '待补',
      netProfit[1] || '待补',
      netProfit[2] || '待补',
      netProfit[3] || '待补',
      forwardPE[0] || '待补',
      forwardPE[1] || '待补',
      forwardPE[2] || '待补',
      forwardPE[3] || '待补',
      marketCap,
      note,
    ];
  });
}

function renderMatrixTable(headEl, bodyEl, headers, rows) {
  headEl.innerHTML = headers.map((label) => `<th>${escapeHtml(label)}</th>`).join('');
  bodyEl.innerHTML = rows
    .map(
      (row) => `
        <tr>
          ${row.map((value, index) => `<td${index === 0 ? ' class="company-name"' : ''}>${escapeHtml(value)}</td>`).join('')}
        </tr>
      `
    )
    .join('');
}

function renderCompanyResearch() {
  const t = companyResearchContent[currentLang];

  // pageNav was removed: its anchors pointed at sections that now live in different views,
  // and the tab bar supersedes it. companySubnav still works — those sections are all
  // inside the equities view.
  renderJumpLinks(companySubnav, t.subnav);

  document.getElementById('companyKicker').textContent = t.companyKicker;
  document.getElementById('companyTitle').textContent = t.companyTitle;
  document.getElementById('companySubtitle').textContent = t.companySubtitle;
  document.getElementById('quickTakeTitle').textContent = t.quickTakeTitle;
  document.getElementById('quickTakeSubtitle').textContent = t.quickTakeSubtitle;
  document.getElementById('quickTakeNote').textContent = t.quickTakeNote;
  document.getElementById('domesticTitle').textContent = t.domesticTitle;
  document.getElementById('domesticSubtitle').textContent = t.domesticSubtitle;
  document.getElementById('domesticNote').textContent = t.domesticNote;
  document.getElementById('globalTitle').textContent = t.globalTitle;
  document.getElementById('globalSubtitle').textContent = t.globalSubtitle;
  document.getElementById('globalNote').textContent = t.globalNote;
  document.getElementById('matrixTitle').textContent = t.matrixTitle;
  document.getElementById('matrixSubtitle').textContent = t.matrixSubtitle;
  document.getElementById('focusTitle').textContent = t.focusTitle;
  document.getElementById('focusSubtitle').textContent = t.focusSubtitle;
  document.getElementById('rankingTitle').textContent = t.rankingTitle;
  document.getElementById('rankingSubtitle').textContent = t.rankingSubtitle;
  document.getElementById('finalCallTitle').textContent = t.finalCallTitle;
  document.getElementById('finalCallBody').textContent = t.finalCallBody;

  quickTakeGrid.innerHTML = t.quickTakeCards
    .map(
      (item) => `
        <article class="summary-card">
          <div class="pill-inline">${escapeHtml(item.pill)}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
          <ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>
        </article>
      `
    )
    .join('');

  renderMetricsTable(domesticTableHead, domesticTableBody, t.tableHeaders, buildFinanceTableRows(t.domesticRows));
  renderMetricsTable(globalTableHead, globalTableBody, t.tableHeaders, buildFinanceTableRows(t.globalRows));
  renderMatrixTable(matrixTableHead, matrixTableBody, t.matrixHeaders, t.matrixRows);

  focusGrid.innerHTML = t.focusCards
    .map(
      (item) => `
        <article class="focus-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.body)}</p>
        </article>
      `
    )
    .join('');

  rankingGrid.innerHTML = t.rankingCards
    .map(
      (item) => `
        <article class="ranking-card">
          <div class="pill-inline">${escapeHtml(item.pill)}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <div class="ranking-list">${escapeHtml(item.companies)}</div>
          <p>${escapeHtml(item.body)}</p>
        </article>
      `
    )
    .join('');
}

function renderStaticText() {
  const t = locales[currentLang];

  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.title = t.title;

  document.getElementById('heroEyebrow').textContent = t.eyebrow;
  document.getElementById('heroTitle').textContent = t.title;
  document.getElementById('heroIntro1').innerHTML = t.heroIntro1;
  document.getElementById('heroIntro2').innerHTML = t.heroIntro2;
  document.getElementById('resourceCsvLink').innerHTML = t.resourceCsv;
  document.getElementById('resourceMdLink').innerHTML = t.resourceMd;

  document.getElementById('statProjectLabel').textContent = t.stats.project;
  document.getElementById('statCountryLabel').textContent = t.stats.country;
  document.getElementById('statOperatingLabel').textContent = t.stats.operating;
  document.getElementById('statCurrentCapacityLabel').textContent = t.stats.currentCapacity;
  document.getElementById('statPlannedCapacityLabel').textContent = t.stats.plannedCapacity;
  document.getElementById('statPipelineLabel').textContent = t.stats.pipeline;
  document.getElementById('statCurrentCapacityUnit').textContent = t.stats.unit;
  document.getElementById('statPlannedCapacityUnit').textContent = t.stats.unit;

  // Core price call: direction + confidence + rationale + comparison vs previous update.
  document.getElementById('priceCallKicker').textContent = t.priceCallKicker;
  const pc = market?.priceCall;
  const pcEl = document.getElementById('priceCall');
  if (!pc) {
    pcEl.innerHTML = `<p class="market-unavailable">${escapeHtml(t.marketUnavailable)}</p>`;
  } else {
    const L = { conf: '置信度', target: '目标', horizon: '时间', vs: '较上次' };
    pcEl.innerHTML = `
      <div class="pc-head">
        <span class="pc-dir pc-${pc.tone}">${escapeHtml(pc.directionLabel)}</span>
        <span class="pc-conf">
          <span class="pc-conf-label">${L.conf} ${pc.confidence}%</span>
          <span class="pc-meter"><span class="pc-meter-fill pc-fill-${pc.tone}" style="width:${Math.max(0, Math.min(100, pc.confidence))}%"></span></span>
        </span>
      </div>
      <div class="pc-meta">
        <span><b>${L.target}:</b> ${escapeHtml(pc.target)}</span>
        <span><b>${L.horizon}:</b> ${escapeHtml(pc.horizon)}</span>
        <span><b>口径:</b> ${escapeHtml(pc.basis)}</span>
        <span><b>as of:</b> ${escapeHtml(pc.asOf)}</span>
      </div>
      <ul class="pc-rationale">${(pc.rationale || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <div class="pc-delta">
        <b>${L.vs} (${escapeHtml(pc.previous?.date || '')}):</b>
        ${escapeHtml(pc.previous?.directionLabel || '')} · ${pc.previous?.confidence ?? ''}% →
        <b>${escapeHtml(pc.directionLabel)} · ${pc.confidence}%</b><br>${escapeHtml(pc.delta || '')}
      </div>`;
  }

  // Key metrics: the only numbers on this page that carry their own provenance envelope.
  // Rendered exclusively through components/metric.js — see that file for why.
  document.getElementById('keyMetricsKicker').textContent = market?.keyMetricsTitle || '关键指标';
  document.getElementById('keyMetricsNote').textContent = market?.keyMetricsNote || '';
  document.getElementById('keyMetricsGrid').innerHTML = market?.keyMetrics?.length
    ? renderMetricGrid(market.keyMetrics, market.meta.asOf)
    : `<p class="market-unavailable">${escapeHtml(t.marketUnavailable)}</p>`;

  document.getElementById('findingsKicker').textContent = t.findingsKicker;
  findingsList.innerHTML = t.findings.map((item) => `<li>${item}</li>`).join('');
  document.getElementById('riskKicker').textContent = t.riskKicker;
  riskGrid.innerHTML = t.risks.map((item) => `<div class="risk-pill">${escapeHtml(item)}</div>`).join('');
  // Update log (changelog) — pinned collapsible table at the top of the page.
  const changelog = market?.changelog || [];
  document.getElementById('changelogKicker').textContent = t.changelogKicker;
  document.getElementById('changelogHint').textContent = t.changelogHint;
  const latest = changelog[0];
  const changelogLatestEl = document.getElementById('changelogLatest');
  // An empty update log is indistinguishable from "nothing has ever changed". Say why.
  changelogLatestEl.innerHTML = latest
    ? `${escapeHtml(t.changelogLatestPrefix)} <b>${escapeHtml(latest.date)}</b>`
      + (latest.prevDate ? ` · ${escapeHtml(t.changelogPrevPrefix)} ${escapeHtml(latest.prevDate)}` : '')
    : '<span class="changelog-unavailable">更新日志数据不可用</span>';

  // Diff table for the latest entry: 指标 | 上次 | 本次 | 变化 (curated key metrics).
  const diffEl = document.getElementById('changelogDiff');
  if (latest && latest.diffs && latest.diffs.length) {
    const changeClass = (c) => {
      const s = String(c);
      if (/^-|下调|↓|Downgrad/.test(s)) return 'diff-down';
      if (/^\+|上调|↑|Upgrad/.test(s)) return 'diff-up';
      return '';
    };
    diffEl.innerHTML = `
      <div class="changelog-diff-title">${escapeHtml(t.changelogDiffTitle)}</div>
      <table class="changelog-diff-table">
        <thead><tr>${(t.changelogDiffHeaders || [])
          .map((h) => `<th>${escapeHtml(h)}</th>`)
          .join('')}</tr></thead>
        <tbody>${latest.diffs
          .map((d) => `<tr>
            <td>${escapeHtml(d.label)}</td>
            <td class="diff-old">${escapeHtml(d.old)}</td>
            <td class="diff-now">${escapeHtml(d.now)}</td>
            <td class="diff-change ${changeClass(d.change)}">${escapeHtml(d.change)}</td>
          </tr>`)
          .join('')}</tbody>
      </table>`;
  } else {
    diffEl.innerHTML = '';
  }

  document.getElementById('changelogHead').innerHTML = (t.changelogHeaders || [])
    .map((label) => `<th>${escapeHtml(label)}</th>`)
    .join('');
  document.getElementById('changelogBody').innerHTML = changelog
    .map(
      (entry) => `
        <tr>
          <td class="changelog-date">${escapeHtml(entry.date)}</td>
          <td class="changelog-asof">${escapeHtml(entry.asOf || '')}</td>
          <td><ul class="changelog-items">${(entry.items || [])
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join('')}</ul></td>
        </tr>
      `
    )
    .join('');

  document.getElementById('updatesKicker').textContent = t.updatesKicker;
  document.getElementById('updatesTitle').textContent = market?.updatesTitle || '';
  document.getElementById('updatesSubtitle').textContent = market?.updatesSubtitle
    ? `${market.updatesSubtitle}（数据整理于 ${market.meta.asOf}）`
    : '';
  // impact / tone / horizon are INLINE on each card. They used to live in a parallel
  // `researchUpdateMeta` array addressed by index, so inserting one card at the top
  // silently shifted every label onto the wrong story.
  updatesGrid.innerHTML = !market?.researchUpdates?.length
    ? `<p class="market-unavailable">${escapeHtml(t.marketUnavailable)}</p>`
    : market.researchUpdates
    .map(
      (item, index) => {
      const tags = item.impact
        ? `<div class="update-tags"><span class="tag tag-${item.tone}">${escapeHtml(item.impact)}</span><span class="tag tag-horizon">${escapeHtml(item.horizon)}</span></div>`
        : '';
      return `
        <article class="update-card">
          <div class="update-index">${index + 1}</div>
          ${tags}
          <h3 class="update-title">${escapeHtml(item.title)}</h3>
          <p class="update-body">${escapeHtml(item.body)}</p>
          ${
            item.bullets?.length
              ? `<ul class="update-points">${item.bullets
                  .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                  .join('')}</ul>`
              : ''
          }
          ${item.note ? `<p class="update-note">${escapeHtml(item.note)}</p>` : ''}
        </article>
      `;
    })
    .join('');

  searchBox.placeholder = t.searchPlaceholder;
  document.getElementById('tableTitle').textContent = t.tableTitle;
  document.getElementById('tableSubtitle').textContent =
    t.tableSubtitle.replace('{updateMarker}', UPDATE_MARKER);
  tableScrollHint.textContent = t.tableScrollHint;
  footnoteEl.innerHTML = t.footnote;
  loadingNote.textContent = t.loading;

  renderLegend();
  renderFilters();
  renderCompanyResearch();
}

function renderHeroBadges({ projectCount, countryCount }) {
  const t = locales[currentLang];

  heroBadges.innerHTML = [
    currentLang === 'zh'
      ? `<span class="badge"><strong>${formatCount(projectCount)}</strong> 个项目/集群</span>`
      : `<span class="badge"><strong>${formatCount(projectCount)}</strong> projects / clusters</span>`,
    currentLang === 'zh'
      ? `<span class="badge"><strong>${formatCount(countryCount)}</strong> 个国家</span>`
      : `<span class="badge"><strong>${formatCount(countryCount)}</strong> countries</span>`,
    `<span class="badge">${escapeHtml(t.badgeProfessional)}</span>`,
    `<span class="badge">${escapeHtml(t.badgeFilter)}</span>`,
  ].join('');
}

// Takes the KPI object from selectKpis(visible) — it no longer computes its own subset,
// which is what let it describe 44 projects while the table and map showed 43.
function updateStats(kpis) {
  document.getElementById('statProjectCount').textContent = formatCount(kpis.projectCount);
  document.getElementById('statCountryCount').textContent = formatCount(kpis.countryCount);
  document.getElementById('statOperatingCount').textContent = formatCount(kpis.operatingCount);
  document.getElementById('statPipelineCount').textContent = formatCount(kpis.pipelineCount);

  // These two tiles moved from a legend bucket to `lifecycle`, which changed 在产样本 from
  // 17 to 26. A number that jumps by half needs its definition visible next to it, or a
  // returning reader has no way to tell a correction from a data error.
  document.getElementById('statOperatingSub').textContent =
    `含爬坡 ${formatCount(kpis.rampingCount)} · 扩产中 ${formatCount(kpis.expandingCount)}`;
  document.getElementById('statPipelineSub').textContent = '建设中 + 开发中';
  document.getElementById('statCurrentCapacity').textContent = formatMetric(kpis.currentCapacity);
  document.getElementById('statPlannedCapacity').textContent = formatMetric(kpis.plannedCapacity);

  renderHeroBadges(kpis);
}

function radius(capacity) {
  return 4 + Math.sqrt(Math.max(Number(capacity || 0), 0)) * 1.25;
}

function popupLabel(key) {
  return escapeHtml(locales[currentLang].popupLabels[key]);
}

function popupValueMarkup(value, field, suffix = '') {
  const primary = localizeValue(value, field, currentLang);
  const primaryText = suffix && primary !== '—' ? `${primary}${suffix}` : primary;

  return `
    <div class="popup-value-primary">${escapeHtml(primaryText)}</div>
  `;
}

function popupValueMarkupFromTexts(primaryText) {
  return `
    <div class="popup-value-primary">${escapeHtml(primaryText)}</div>
  `;
}

function popupHtml(item) {
  const titlePrimary = localizeValue(item.project, 'project', currentLang);
  const countryPrimary = `${localizeValue(item.country, 'country', currentLang)} / ${localizeValue(item.region, 'region', currentLang)}`;

  return `
    <div class="popup-title">
      ${escapeHtml(titlePrimary)}
    </div>
    <div class="popup-grid">
      <div class="popup-label">${popupLabel('country')}</div><div>${popupValueMarkupFromTexts(countryPrimary)}</div>
      <div class="popup-label">${popupLabel('status')}</div><div>${popupValueMarkup(item.status, 'status')}</div>
      <div class="popup-label">${popupLabel('type')}</div><div>${popupValueMarkup(item.deposit_type, 'deposit_type')}</div>
      <div class="popup-label">${popupLabel('reserve')}</div><div>${popupValueMarkup(item.reserve_resource, 'reserve_resource')}</div>
      <div class="popup-label">${popupLabel('grade')}</div><div>${popupValueMarkup(item.grade, 'grade')}</div>
      <div class="popup-label">${popupLabel('current')}</div><div>${popupValueMarkup(item.current_kta_lce, 'plain', currentLang === 'zh' ? ' kt LCE/年' : ' kt LCE/year')}</div>
      <div class="popup-label">${popupLabel('planned')}</div><div>${popupValueMarkup(item.planned_kta_lce, 'plain', currentLang === 'zh' ? ' kt LCE/年' : ' kt LCE/year')}</div>
      <div class="popup-label">${popupLabel('cost')}</div><div>${popupValueMarkup(item.cost, 'cost')}</div>
      <div class="popup-label">${popupLabel('address')}</div><div>${popupValueMarkup(item.address, 'address')}</div>
      <div class="popup-label">${popupLabel('route')}</div><div>${popupValueMarkup(item.route, 'route')}</div>
      <div class="popup-label">${popupLabel('risks')}</div><div>${popupValueMarkup(item.risks, 'risks')}</div>
      <div class="popup-label">${popupLabel('source')}</div><div>${popupValueMarkup(item.source_note, 'source_note')}</div>
    </div>
  `;
}

function buildSearchHaystack(item) {
  const values = [
    item.project,
    localizeValue(item.project, 'project', 'zh'),
    item.country,
    localizeValue(item.country, 'country', 'zh'),
    item.region,
    localizeValue(item.region, 'region', 'zh'),
    item.status,
    localizeValue(item.status, 'status', 'zh'),
    // Orthogonal axes are searchable by their Chinese labels too, so "集群" / "扩产" /
    // "爬坡" find the right rows even though those words may not appear in the prose.
    localizeValue(item.lifecycle, 'lifecycle', 'zh'),
    localizeValue(item.structure, 'structure', 'zh'),
    localizeValue(item.activity, 'activity', 'zh'),
    item.deposit_type,
    localizeValue(item.deposit_type, 'deposit_type', 'zh'),
    item.reserve_resource,
    localizeValue(item.reserve_resource, 'reserve_resource', 'zh'),
    item.grade,
    localizeValue(item.grade, 'grade', 'zh'),
    item.cost,
    localizeValue(item.cost, 'cost', 'zh'),
    item.address,
    localizeValue(item.address, 'address', 'zh'),
    item.route,
    localizeValue(item.route, 'route', 'zh'),
    item.risks,
    localizeValue(item.risks, 'risks', 'zh'),
    item.source_note,
    localizeValue(item.source_note, 'source_note', 'zh'),
    listedOwnerLabel(item.project, 'zh'),
    listedOwnerLabel(item.project, 'en'),
  ];

  return values.join(' ').toLowerCase();
}

/**
 * Cell renderers, keyed by the `render` name in data/columns.js.
 *
 * They live here rather than in that module because they need currentLang, the localize
 * helpers and the pill builders — pulling those into a module Node imports would drag DOM
 * and locale concerns into the build check. Anything unrecognised falls back to `text`.
 */
const CELL_RENDERERS = {
  projectName: (item) => {
    const isUpdated = item.updated && item.updated === UPDATE_MARKER;
    const pill = isUpdated
      ? `<span class="db-updated-pill">🔄 ${currentLang === 'zh' ? '本次更新' : 'Updated'}</span>`
      : '';
    // A real <button>, not a clickable cell: keyboard reachable, correct semantics and a
    // focus ring for free, without inventing row-level key handling. The row-wide click
    // delegation below is only a mouse affordance on top of it.
    return `<button type="button" class="row-open">${escapeHtml(localizeValue(item.project, 'project', currentLang))}</button>${pill}`;
  },
  countryPill: (item) => renderCountryPill(item.country),
  statusPill: (item) => renderStatusPill(item),
  listedOwner: (item) => escapeHtml(listedOwnerLabel(item.project, currentLang)),
  number: (item, col) => escapeHtml(item[col.key]),
  text: (item, col) => escapeHtml(localizeValue(item[col.field || col.key], col.field || col.key, currentLang)),
};

/**
 * The <thead>.
 *
 * Latched on the column group because this moved OFF renderStaticText() and onto the
 * commit path when groups became switchable — without the latch, every search keystroke
 * would rebuild the header row and the frozen column's layout would visibly thrash.
 * Same idea as `lastFacetSignature` for the filter dropdowns.
 */
let lastRenderedColumnGroup = null;
let lastHeightNotifiedColumnGroup = null;
let lastHeightNotifiedSelection = null;

function renderTableHead(cols, groupId) {
  // A custom property, NOT `style.minWidth`. An inline min-width beats any stylesheet
  // rule, so the ≤640px card layout could not reset it and the page overflowed to the
  // group's full declared width (2,572px at 375px). Handing CSS a variable keeps both
  // rules in the cascade where the media query can win.
  dataTable.style.setProperty('--table-min-width', `${groupWidth(groupId)}px`);
  if (groupId === lastRenderedColumnGroup) return;
  lastRenderedColumnGroup = groupId;

  dataTableHead.innerHTML = cols
    .map((c) => `<th style="width:${c.width}px;" data-col="${escapeRaw(c.key)}">${escapeHtml(c.label)}</th>`)
    .join('');
}

function renderTable(data, groupId, selection) {
  const t = locales[currentLang];
  const cols = columnsForGroup(groupId);
  renderTableHead(cols, groupId);
  tbody.innerHTML = '';

  if (!data.length) {
    const tr = document.createElement('tr');
    tr.className = 'is-empty-state';
    tr.innerHTML = `<td colspan="${cols.length}" class="empty-state">${escapeHtml(t.emptyState)}</td>`;
    tbody.appendChild(tr);
    return;
  }

  for (const item of data) {
    const tr = document.createElement('tr');
    const classes = [];
    if (item.updated && item.updated === UPDATE_MARKER) classes.push('row-updated');
    if (item.project === selection) classes.push('is-selected');
    if (classes.length) tr.className = classes.join(' ');
    tr.dataset.project = item.project;
    // The row highlight is the guaranteed local feedback: a row click can happen while
    // the map is scrolled off-screen, so the marker highlight alone would be invisible.
    if (item.project === selection) tr.setAttribute('aria-selected', 'true');
    // data-label is what turns each cell into a labelled line in the ≤640px card layout,
    // so the mobile view needs no second render path and the row stays a <tr> the
    // invariant can count. escapeRaw, not escapeHtml — the latter turns '' into an em
    // dash, which would be a visible bogus label.
    tr.innerHTML = cols
      .map((c) => {
        const render = CELL_RENDERERS[c.render] || CELL_RENDERERS.text;
        const cls = c.align === 'right' ? ' class="num"' : '';
        return `<td${cls} data-label="${escapeRaw(c.label)}">${render(item, c)}</td>`;
      })
      .join('');
    tbody.appendChild(tr);
  }
}


// ---- Project detail drawer --------------------------------------------------------
//
// popupHtml()'s replacement. Covers ALL 23 CSV columns — the table shows at most 15, and
// region / lifecycle / structure / activity / coordinates / port coordinates / updated
// have never been directly visible anywhere. This is the honest answer to "the table
// renders a subset".
//
// Its own CSS classes, NOT the .popup-* ones: those were coloured for Leaflet's WHITE
// popup (.popup-value-primary is #1f2937), so reusing them on the dark card renders
// near-invisible text.
const DRAWER_SECTIONS = [
  { title: '身份', rows: [['项目', 'project'], ['国家', 'country'], ['地区', 'region'], ['所属上市公司', '@owner']] },
  { title: '状态', rows: [['状态', 'status'], ['生命周期', '@lifecycle'], ['结构', '@structure'], ['扩产活动', '@activity'], ['最近更新', 'updated']] },
  { title: '地质', rows: [['类型', 'deposit_type'], ['储量/资源', 'reserve_resource'], ['品位', 'grade']] },
  { title: '产能', rows: [['当前产能', 'current_kta_lce'], ['规划产能', 'planned_kta_lce'], ['地图口径产能', 'map_capacity_kta'], ['成本', 'cost']] },
  { title: '物流', rows: [['地址', 'address'], ['运输/出口路线', 'route'], ['矿区坐标', '@coords'], ['港口坐标', '@portCoords']] },
  { title: '风险与来源', rows: [['产能扰动因素', 'risks'], ['数据来源摘要', 'source_note']] },
];

function drawerValue(item, key) {
  switch (key) {
    case '@owner': return escapeHtml(listedOwnerLabel(item.project, currentLang));
    case '@lifecycle': return escapeHtml(LIFECYCLE_LABELS[item.lifecycle] || item.lifecycle || '');
    case '@structure': return escapeHtml(STRUCTURE_LABELS[item.structure] || item.structure || '');
    case '@activity': return escapeHtml(ACTIVITY_LABELS[item.activity] || item.activity || '');
    case '@coords': return Number.isFinite(item.lat) && Number.isFinite(item.lon)
      ? escapeHtml(`${item.lat.toFixed(4)}, ${item.lon.toFixed(4)}`) : '—';
    case '@portCoords': return Number.isFinite(item.port_lat) && Number.isFinite(item.port_lon)
      ? escapeHtml(`${item.port_lat.toFixed(4)}, ${item.port_lon.toFixed(4)}`) : '—';
    default: return escapeHtml(localizeValue(item[key], key, currentLang));
  }
}

function renderDrawer(selection, visible) {
  const item = selection ? visible.find((p) => p.project === selection) : null;
  if (!item) {
    projectDrawer.hidden = true;
    projectDrawer.innerHTML = '';
    return;
  }

  projectDrawer.hidden = false;
  projectDrawer.innerHTML = `
    <div class="drawer-head">
      <h3 id="drawerTitle">${escapeHtml(localizeValue(item.project, 'project', currentLang))}</h3>
      <button type="button" class="drawer-close" id="drawerClose" aria-label="关闭详情">×</button>
    </div>
    <div class="drawer-body">
      ${DRAWER_SECTIONS.map((sec) => `
        <section class="drawer-section">
          <h4>${escapeHtml(sec.title)}</h4>
          <dl>
            ${sec.rows.map(([label, key]) => `
              <dt>${escapeHtml(label)}</dt><dd>${drawerValue(item, key) || '—'}</dd>`).join('')}
          </dl>
        </section>`).join('')}
    </div>`;
}


// ---- Map size legend ---------------------------------------------------------------
//
// Built ONCE at init, next to radius(), deliberately outside render(): it is a function of
// the radius formula, not of the filter, exactly like the charts.
//
// The circle sizes come from calling radius() — never from restating the formula. A
// duplicated `4 + sqrt(x) * 1.25` would drift the moment either copy is tuned, and a size
// legend that disagrees with the markers is worse than none. radius() is absolute rather
// than data-scaled, so fixed stops are meaningful; these bracket the real 10–300 range.
// Neutral grey fill so it cannot be mistaken for a status colour.
const LEGEND_STOPS = [25, 100, 250];

function addSizeLegend() {
  const control = L.control({ position: 'bottomleft' });
  control.onAdd = () => {
    const box = L.DomUtil.create('div', 'map-size-legend');
    const maxR = radius(LEGEND_STOPS[LEGEND_STOPS.length - 1]);
    const w = Math.ceil(maxR * 2) + 8;
    box.innerHTML = `
      <div class="map-size-legend-title">产能（kt LCE/年）</div>
      <div class="map-size-legend-rows">
        ${LEGEND_STOPS.map((stop) => {
          const r = radius(stop);
          return `<div class="map-size-legend-row">
            <svg width="${w}" height="${Math.ceil(r * 2) + 2}" aria-hidden="true">
              <circle cx="${w / 2}" cy="${r + 1}" r="${r}" fill="#94a3b8" fill-opacity="0.5"
                      stroke="#94a3b8" stroke-width="1.2" />
            </svg>
            <span>${stop}</span>
          </div>`;
        }).join('')}
      </div>`;
    L.DomEvent.disableClickPropagation(box);
    return box;
  };
  control.addTo(map);
}

// ---- Region quick-zoom -------------------------------------------------------------
//
// The camera is NOT store state (see flyToSelection), so these handlers call fitBounds
// directly — the one justified exception to "handlers only commit, never render".
function renderMapRegions(mappable) {
  mapRegions.innerHTML = MAP_REGIONS.map((r) => {
    const n = projectsInRegion(r, mappable).length;
    return `<button type="button" class="map-region-btn" data-region="${escapeRaw(r.id)}"
                    ${n === 0 ? 'disabled' : ''} title="${n} 个可见项目">
      ${escapeHtml(r.label)}<span class="map-region-count">${n}</span>
    </button>`;
  }).join('');
}

function zoomToRegion(regionId, mappable) {
  const region = MAP_REGIONS.find((r) => r.id === regionId);
  const rows = projectsInRegion(region, mappable);
  if (!rows.length) return;
  const bounds = L.latLngBounds(rows.map((p) => [p.lat, p.lon]));
  map.fitBounds(bounds, { padding: [28, 28], maxZoom: 6, animate: !prefersReducedMotion });
}

function renderMap(data, selection) {
  markerLayer.clearLayers();
  lineLayer.clearLayers();

  // Draw biggest-first so the smallest circles land on TOP.
  //
  // `data` arrives in the TABLE's sort order, which means the paint order of the map used
  // to depend on a control that has nothing to do with the map: under sort=name_asc a
  // 300 kt circle could be drawn last and completely bury a 10 kt one. Sorting a copy by
  // capacity descending makes overlap resolution deterministic and always favours the
  // marker that would otherwise be impossible to hit. Copy, don't sort in place — `data`
  // is the shared `visible` array the table and the KPI tiles also read.
  const byCapacityDesc = [...data].sort(
    (a, b) => (Number(b.map_capacity_kta) || 0) - (Number(a.map_capacity_kta) || 0)
  );

  for (const item of byCapacityDesc) {
    if (!Number.isFinite(item.lat) || !Number.isFinite(item.lon)) {
      continue;
    }

    const color = colorMap[item.status_group] || '#94a3b8';
    const markerRadius = radius(item.map_capacity_kta);
    const isSelected = item.project === selection;
    // bindPopup is gone on purpose. A popup AND a drawer would be two editors of "the
    // detail surface" — the exact pattern core/store.js was written against, and the one
    // that would let the map show one project while the drawer showed another. The
    // tooltip keeps the hover affordance without owning any state.
    const marker = L.circleMarker([item.lat, item.lon], {
      radius: markerRadius,
      color: isSelected ? '#ffffff' : color,
      weight: isSelected ? 3 : 1.2,
      fillColor: color,
      fillOpacity: isSelected ? 0.9 : 0.65,
    }).bindTooltip(escapeHtml(localizeValue(item.project, 'project', currentLang)), { direction: 'top' });

    marker.on('click', () => store.commit((state) => ({
      selection: state.selection === item.project ? null : item.project,
    })));

    marker.addTo(markerLayer);
    if (isSelected) marker.bringToFront();

    if (Number.isFinite(item.port_lat) && Number.isFinite(item.port_lon)) {
      const line = L.polyline(
        [
          [item.lat, item.lon],
          [item.port_lat, item.port_lon],
        ],
        {
          color,
          weight: Math.max(1, Math.min(5, markerRadius / 4)),
          opacity: 0.35,
          dashArray: '5,6',
        }
      );
      line.addTo(lineLayer);
    }
  }
}

// The single render pass. Every surface derives from ONE computed `visible` list, so the
// KPI tiles, the table and the map cannot describe different sets. Subscribed to the store;
// never call it directly — commit to the store and let it fire.
function renderColumnGroups(activeId) {
  columnGroups.innerHTML = COLUMN_GROUPS.map((g) => `
    <button class="column-group-btn" type="button" role="radio"
            data-cols="${escapeRaw(g.id)}" aria-checked="${g.id === activeId}"
            tabindex="${g.id === activeId ? 0 : -1}">
      ${escapeHtml(g.label)}
      <span class="column-group-hint">${escapeHtml(g.hint)}</span>
    </button>`).join('');
}

/** Cell count of the first real row, or null when the table is showing its empty state. */
function firstBodyRowCellCount() {
  const row = tbody.querySelector('tr:not(.is-empty-state)');
  return row ? row.children.length : null;
}

function render(state) {
  const visible = sortProjects(
    selectVisibleProjects(rawData, state.filters, buildSearchHaystack),
    state.sort
  );
  const mappable = selectMappable(visible);

  renderTabs(state.view);
  applyView(state.view);

  renderFilters();
  renderLegend();
  renderColumnGroups(state.cols);
  renderTable(visible, state.cols, state.selection);
  renderMap(visible, state.selection);
  renderDrawer(state.selection, visible);
  renderMapRegions(mappable);
  flyToSelection(state, visible);
  updateStats(selectKpis(visible));

  resultSummary.textContent = locales[currentLang].resultSummary(visible.length, rawData.length);
  loadingNote.hidden = true;

  const { unmapped } = assertViewConsistency({
    visible,
    mappable,
    kpiCount: Number(document.getElementById('statProjectCount').textContent.replace(/[^0-9]/g, '')),
    tableRows: tbody.querySelectorAll('tr:not(.is-empty-state)').length,
    markerCount: markerLayer.getLayers().length,
    headerCells: dataTableHead.children.length,
    bodyCells: firstBodyRowCellCount(),
    expectedColumns: columnsForGroup(state.cols).length,
    selection: state.selection,
    drawerOpen: !projectDrawer.hidden,
  });

  unmappedNote.hidden = unmapped === 0;
  unmappedNote.textContent = unmapped === 0
    ? ''
    : `${unmapped} 个项目缺少坐标，未在地图上显示。`;

  syncUrl(state);

  // A column-group change alters every row's height, so one post is not enough — the
  // layout is not final until after this tick. Same three-shot as a view switch.
  // On ≤640px the drawer is in normal flow, so opening or closing it changes the
  // document height; on desktop it is absolutely positioned inside .mapbox and costs
  // nothing. Firing the triple on either change is cheap and covers both.
  if (state.cols !== lastHeightNotifiedColumnGroup || state.selection !== lastHeightNotifiedSelection) {
    lastHeightNotifiedColumnGroup = state.cols;
    lastHeightNotifiedSelection = state.selection;
    notifyHeightTriple();
  } else {
    notifyParentHeight();
  }
}

async function loadMarket() {
  const response = await fetch(`${MARKET_URL}?v=${DATA_CACHE_KEY}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function init() {
  // Both are independent of the CSV and of each other, so they race rather than queue —
  // and each failure is isolated: a missing market file must not cost us the project
  // database, and vice versa.
  const [financials, marketResult] = await Promise.allSettled([
    loadCompanyFinancials(),
    loadMarket(),
  ]);

  if (financials.status === 'rejected') {
    console.error('Failed to load shared company financials', financials.reason);
    companyFinanceIndex = new Map();
  }
  if (marketResult.status === 'fulfilled') {
    market = marketResult.value;
  } else {
    console.error('Failed to load market data', marketResult.reason);
  }

  renderStaticText();
  renderGapViews();

  try {
    const response = await fetch(`${DATA_URL}?v=${DATA_CACHE_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    rawData = loadCsvData(text);

    // Restore filters from the URL only AFTER the data is in: values are validated against
    // the facets that actually exist, so a stale shared link degrades to "no filter"
    // instead of silently showing zero results for a country that has since been renamed.
    const facets = selectFacets(rawData);
    const restored = decodeState(window.location.search, {
      validGroups: facets.statusGroups,
      validCountries: facets.countries,
      validStructures: facets.structures,
      validViews: VIEWS.map((v) => v.id),
      validCols: COLUMN_GROUP_IDS,
    });

    // First commit triggers the first render via the subscription below.
    store.commit(restored);
    render(store.getState());

    // After the CSV, because the capacity chart aggregates it — and after render(), so the
    // one height post that follows already accounts for the charts being in the DOM.
    renderCharts();

    errorNote.hidden = true;
    window.setTimeout(() => {
      map.invalidateSize();
      notifyParentHeight();
    }, 120);
  } catch (error) {
    lastErrorMessage = error.message;
    loadingNote.hidden = true;
    errorNote.hidden = false;
    errorNote.textContent = `${locales[currentLang].errorPrefix}${lastErrorMessage}`;
    resultSummary.textContent = '';
    notifyParentHeight();
  }
}

// ---------------------------------------------------------------------------
// Wiring: inputs commit to the store, the store drives the single render pass.
// No handler renders anything directly — that is what let surfaces drift apart.
// ---------------------------------------------------------------------------

store.subscribe(render);

// Filtering the selected project out of view must clear the selection, and it must happen
// in the SAME commit — not repaired during render. Repairing in the renderer would mean
// committing during a notify (the re-entrancy case core/store.js guards), and it would
// leave assertViewConsistency asserting a property the renderer had just patched up.
// Doing it here lets the invariant genuinely CHECK that selection ⊆ visible.
// The extra 44-row pass only runs when something is actually selected.
const commitFilters = (patch) => store.commit((state) => {
  const filters = { ...state.filters, ...patch };
  const stillVisible = state.selection
    && selectVisibleProjects(rawData, filters, buildSearchHaystack)
      .some((p) => p.project === state.selection);
  return { filters, selection: stillVisible ? state.selection : null };
});

searchBox.addEventListener('input', () => commitFilters({ q: searchBox.value }));

statusFilter.addEventListener('change', () => {
  const value = statusFilter.value;
  commitFilters({ statusGroups: value === 'all' ? null : [value] });
});

countryFilter.addEventListener('change', () => {
  const value = countryFilter.value;
  commitFilters({ countries: value === 'all' ? [] : [value] });
});

structureFilter.addEventListener('change', () => {
  const value = structureFilter.value;
  commitFilters({ structures: value === 'all' ? [] : [value] });
});

sortFilter.addEventListener('change', () => store.commit({ sort: sortFilter.value }));

viewTabs.addEventListener('click', (event) => {
  const tab = event.target.closest('.view-tab');
  if (tab?.dataset.view) store.commit({ view: tab.dataset.view });
});

// Roving tabindex: Left/Right (and Home/End) move between tabs, per the WAI-ARIA tabs
// pattern. Without it a keyboard user can reach only the one tab with tabindex=0.
viewTabs.addEventListener('keydown', (event) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(event.key)) return;

  const current = store.getState().view;
  const index = VIEWS.findIndex((v) => v.id === current);
  const next = event.key === 'Home' ? 0
    : event.key === 'End' ? VIEWS.length - 1
    : event.key === 'ArrowLeft' ? (index - 1 + VIEWS.length) % VIEWS.length
    : (index + 1) % VIEWS.length;

  event.preventDefault();
  store.commit({ view: VIEWS[next].id });
  document.getElementById(`tab-${VIEWS[next].id}`)?.focus();
});

legend.addEventListener('click', (event) => {
  const button = event.target.closest('.legend-filter');
  const statusGroup = button?.dataset.statusGroup;
  if (!statusGroup) return;

  store.commit((state) => {
    // null ("all") is materialised into the full list on first toggle, so that turning one
    // chip off means "all except this" rather than "only this".
    const current = state.filters.statusGroups ?? statusLegendItems;
    const next = current.includes(statusGroup)
      ? current.filter((key) => key !== statusGroup)
      : [...current, statusGroup];

    return {
      filters: {
        ...state.filters,
        // Back to null when everything is on again, so the URL stays clean and the
        // dropdown reads "全部" rather than an exhaustive list.
        statusGroups: next.length === statusLegendItems.length ? null : next,
      },
    };
  });
});

// Switching column groups changes every row's height (dropping 风险/来源 shortens them a
// lot), so the parent frame needs re-measuring — but only AFTER the render the commit
// triggers, which is why the triple fires from the subscriber rather than from here.
// Handlers commit; they never render.
mapRegions.addEventListener('click', (event) => {
  const id = event.target.closest('.map-region-btn')?.dataset.region;
  if (!id) return;
  // Reads the CURRENT visible set so the frame respects the active filter.
  const state = store.getState();
  const visible = sortProjects(selectVisibleProjects(rawData, state.filters, buildSearchHaystack), state.sort);
  zoomToRegion(id, selectMappable(visible));
});

columnGroups.addEventListener('click', (event) => {
  const id = event.target.closest('.column-group-btn')?.dataset.cols;
  if (id) store.commit({ cols: id });
});

// The camera is Leaflet-owned transient view state and deliberately NOT in the store: it
// is not shareable, it survives clearLayers() on its own, and putting it there would make
// render() re-aim the map on every search keystroke. The latch mirrors `lastRenderedView`
// so a re-render with an unchanged selection does not fight a user pan.
let lastFlownSelection = null;
let lastFlownView = null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function flyToSelection(state, visible) {
  const changed = state.selection !== lastFlownSelection || state.view !== lastFlownView;
  lastFlownSelection = state.selection;
  lastFlownView = state.view;
  if (!changed || !state.selection || state.view !== 'atlas') return;

  const item = visible.find((p) => p.project === state.selection);
  if (!item || !Number.isFinite(item.lat) || !Number.isFinite(item.lon)) return;
  // setView, not flyTo: a long animation can be interrupted by a user pan and leave the
  // camera somewhere neither of them chose.
  map.setView([item.lat, item.lon], Math.max(map.getZoom(), 5), { animate: !prefersReducedMotion });
}

// A DOM reference is not state: it is not serializable and would break shallowEqual, so
// the element to restore focus to lives in a module-level variable, not in the store.
let lastSelectionTrigger = null;

function selectProject(project, trigger) {
  lastSelectionTrigger = trigger || null;
  store.commit((state) => ({ selection: state.selection === project ? null : project }));
}

tbody.addEventListener('click', (event) => {
  const row = event.target.closest('tr[data-project]');
  if (!row) return;
  selectProject(row.dataset.project, event.target.closest('.row-open') || row);
});

projectDrawer.addEventListener('click', (event) => {
  if (!event.target.closest('.drawer-close')) return;
  store.commit({ selection: null });
  if (lastSelectionTrigger && lastSelectionTrigger.isConnected) lastSelectionTrigger.focus();
  lastSelectionTrigger = null;
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !store.getState().selection) return;
  store.commit({ selection: null });
  if (lastSelectionTrigger && lastSelectionTrigger.isConnected) lastSelectionTrigger.focus();
  lastSelectionTrigger = null;
});


addSizeLegend();
init();
