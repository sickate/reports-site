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
import { createStore } from './core/store.js';
import {
  selectFacets, selectVisibleProjects, selectKpis, selectMappable, sortProjects,
} from './core/selectors.js';
import { createUrlSync, decodeState } from './core/url-state.js';
import { assertViewConsistency } from './core/invariants.js';
import { VIEWS, DEFAULT_VIEW, isValidView } from './views/registry.js';
import { renderEmptyState, renderGapRegister } from './components/empty-state.js';
import { renderMetricGrid } from './components/metric.js';
import { GAPS, GAP_REGISTER_ORDER } from './data/gaps.js';

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
const store = createStore({
  view: DEFAULT_VIEW,
  filters: { q: '', statusGroups: null, countries: [], structures: [] },
  sort: 'capacity_desc',
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

function escapeHtml(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

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
  notifyParentHeight();
  window.requestAnimationFrame(notifyParentHeight);
  window.setTimeout(notifyParentHeight, 120);
}

// The three views whose data we could not source. Rendered once — the content is static
// until the underlying gap is filled, at which point its entry leaves data/gaps.js.
function renderGapViews() {
  document.getElementById('supplySection').innerHTML =
    `<div class="section-kicker">未来供给</div>` + renderEmptyState(GAPS.supplyBridge);

  document.getElementById('costSection').innerHTML =
    `<div class="section-kicker">成本曲线与价格敏感性</div>`
    + renderEmptyState(GAPS.costCurve)
    + renderEmptyState(GAPS.supplyDemandBalance)
    + renderEmptyState(GAPS.priceScenarios);

  document.getElementById('catalystsSection').innerHTML =
    `<div class="section-kicker">催化剂与预警</div>` + renderEmptyState(GAPS.catalystFeed);

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

  dataTableHead.innerHTML = t.tableHeaders
    .map((label, index) => {
      const widths = ['150px', '110px', '210px', '130px', '120px', '220px', '100px', '84px', '84px', '210px', '190px', '200px', '240px', '190px'];
      return `<th style="width:${widths[index]};">${escapeHtml(label)}</th>`;
    })
    .join('');

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

function renderTable(data) {
  const t = locales[currentLang];
  tbody.innerHTML = '';

  if (!data.length) {
    const tr = document.createElement('tr');
    tr.className = 'is-empty-state';
    tr.innerHTML = `<td colspan="14" class="empty-state">${escapeHtml(t.emptyState)}</td>`;
    tbody.appendChild(tr);
    return;
  }

  for (const item of data) {
    const tr = document.createElement('tr');
    const isUpdated = item.updated && item.updated === UPDATE_MARKER;
    if (isUpdated) {
      tr.className = 'row-updated';
    }
    const updatedPill = isUpdated
      ? `<span class="db-updated-pill">🔄 ${currentLang === 'zh' ? '本次更新' : 'Updated'}</span>`
      : '';
    tr.innerHTML = `
      <td>${escapeHtml(localizeValue(item.project, 'project', currentLang))}${updatedPill}</td>
      <td>${renderCountryPill(item.country)}</td>
      <td>${escapeHtml(listedOwnerLabel(item.project, currentLang))}</td>
      <td>${renderStatusPill(item)}</td>
      <td>${escapeHtml(localizeValue(item.deposit_type, 'deposit_type', currentLang))}</td>
      <td>${escapeHtml(localizeValue(item.reserve_resource, 'reserve_resource', currentLang))}</td>
      <td>${escapeHtml(localizeValue(item.grade, 'grade', currentLang))}</td>
      <td>${escapeHtml(item.current_kta_lce)}</td>
      <td>${escapeHtml(item.planned_kta_lce)}</td>
      <td>${escapeHtml(localizeValue(item.cost, 'cost', currentLang))}</td>
      <td>${escapeHtml(localizeValue(item.address, 'address', currentLang))}</td>
      <td>${escapeHtml(localizeValue(item.route, 'route', currentLang))}</td>
      <td>${escapeHtml(localizeValue(item.risks, 'risks', currentLang))}</td>
      <td>${escapeHtml(localizeValue(item.source_note, 'source_note', currentLang))}</td>
    `;
    tbody.appendChild(tr);
  }
}

function renderMap(data) {
  markerLayer.clearLayers();
  lineLayer.clearLayers();

  for (const item of data) {
    if (!Number.isFinite(item.lat) || !Number.isFinite(item.lon)) {
      continue;
    }

    const color = colorMap[item.status_group] || '#94a3b8';
    const markerRadius = radius(item.map_capacity_kta);
    const marker = L.circleMarker([item.lat, item.lon], {
      radius: markerRadius,
      color,
      weight: 1.2,
      fillColor: color,
      fillOpacity: 0.65,
    }).bindPopup(popupHtml(item));

    marker.addTo(markerLayer);

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
  renderTable(visible);
  renderMap(visible);
  updateStats(selectKpis(visible));

  resultSummary.textContent = locales[currentLang].resultSummary(visible.length, rawData.length);
  loadingNote.hidden = true;

  const { unmapped } = assertViewConsistency({
    visible,
    mappable,
    kpiCount: Number(document.getElementById('statProjectCount').textContent.replace(/[^0-9]/g, '')),
    tableRows: tbody.querySelectorAll('tr:not(.is-empty-state)').length,
    markerCount: markerLayer.getLayers().length,
  });

  unmappedNote.hidden = unmapped === 0;
  unmappedNote.textContent = unmapped === 0
    ? ''
    : `${unmapped} 个项目缺少坐标，未在地图上显示。`;

  syncUrl(state);
  notifyParentHeight();
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
    });

    // First commit triggers the first render via the subscription below.
    store.commit(restored);
    render(store.getState());

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

const commitFilters = (patch) => store.commit((state) => ({
  filters: { ...state.filters, ...patch },
}));

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

init();
