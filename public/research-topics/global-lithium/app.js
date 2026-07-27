// Global lithium research topic — application entry.
//
// Split out of the former 3,900-line single-file global-lithium-projects-2026.html.
// Native ES modules, no bundler, mirroring public/research-topics/semiconductor-upstream/.
// Pure data and parsing live in ./data/*.js so scripts/ can import the same code.

import { HEIGHT_MESSAGE_TYPE, DATA_VERSION, DATA_URL, COMPANY_FINANCIALS_URL } from './data/config.js';
import { colorMap, countryPillColors } from './data/palette.js';
import { CORE_STATUS_GROUPS, statusLegendItems } from './data/schema.js';
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
const pageNav = document.getElementById('pageNav');
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

// Single source of truth for view state.
//
// `filters.statusGroups === null` means "all". The legend chips and the status dropdown are
// two EDITORS of this one field, not two independent filters — previously the legend wrote
// a module-level Set while the dropdown's value lived in the DOM, and the render path had
// to AND them together. One field means they can never disagree.
const store = createStore({
  filters: { q: '', statusGroups: null, countries: [] },
  sort: 'capacity_desc',
});

const syncUrl = createUrlSync();

function notifyParentHeight() {
  if (window.parent === window || !appRoot) {
    return;
  }

  window.requestAnimationFrame(() => {
    const nextHeight = Math.ceil(
      Math.max(
        appRoot.scrollHeight || 0,
        appRoot.offsetHeight || 0,
        document.body.scrollHeight || 0,
        document.documentElement.scrollHeight || 0
      )
    );

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

function renderStatusPill(item) {
  const label = localizeValue(item.status, 'status', currentLang);
  const color = colorMap[item.status_group] || '#94a3b8';
  return pillMarkup(label, color);
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

  const facetSignature = JSON.stringify([facets.statusGroups, facets.countries]);
  if (facetSignature !== lastFacetSignature) {
    lastFacetSignature = facetSignature;

    statusFilter.innerHTML = '';
    countryFilter.innerHTML = '';
    sortFilter.innerHTML = '';

    const statusDefault = document.createElement('option');
    statusDefault.value = 'all';
    statusDefault.textContent = t.allStatuses;
    statusFilter.appendChild(statusDefault);

    const countryDefault = document.createElement('option');
    countryDefault.value = 'all';
    countryDefault.textContent = t.allCountries;
    countryFilter.appendChild(countryDefault);

    for (const value of facets.statusGroups) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = localizeValue(value, 'status_group', currentLang);
      statusFilter.appendChild(opt);
    }

    for (const value of facets.countries) {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = localizeValue(value, 'country', currentLang);
      countryFilter.appendChild(opt);
    }

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
  sortFilter.value = sort;
  if (searchBox.value !== filters.q) searchBox.value = filters.q;
}

function renderLegend() {
  const t = locales[currentLang];
  const { filters } = store.getState();
  // Core buckets always render (stable legend); the 'Other' fallback only renders when
  // something actually lands in it, so a healthy dataset shows no empty chip and an
  // unmapped status becomes immediately visible instead of disappearing.
  const presentGroups = new Set(rawData.map((item) => item.status_group));
  const active = filters.statusGroups;
  legend.innerHTML = statusLegendItems
    .filter((key) => CORE_STATUS_GROUPS.includes(key) || presentGroups.has(key))
    .map((key) => {
      const isOn = !active || active.includes(key);
      return `<button class="legend-filter ${isOn ? '' : 'is-inactive'}" data-status-group="${escapeHtml(key)}" type="button" aria-pressed="${isOn}"><span class="dot" style="background:${colorMap[key]}"></span>${escapeHtml(t.legend[key])}</button>`;
    })
    .join('');
}

function renderJumpLinks(container, links) {
  container.innerHTML = links
    .map(
      (item) =>
        `<a class="${container === pageNav ? 'page-nav-link' : 'subnav-link'}" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`
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
  const response = await fetch(`${COMPANY_FINANCIALS_URL}?v=${DATA_VERSION}`);

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

  renderJumpLinks(pageNav, t.pageNav);
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
  const pc = t.priceCall;
  const pcEl = document.getElementById('priceCall');
  if (pc) {
    const L = currentLang === 'zh'
      ? { conf: '置信度', target: '目标', horizon: '时间', vs: '较上次' }
      : { conf: 'Confidence', target: 'Target', horizon: 'Horizon', vs: 'vs previous' };
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
      </div>
      <ul class="pc-rationale">${(pc.rationale || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
      <div class="pc-delta">
        <b>${L.vs} (${escapeHtml(pc.previous?.date || '')}):</b>
        ${escapeHtml(pc.previous?.directionLabel || '')} · ${pc.previous?.confidence ?? ''}% →
        <b>${escapeHtml(pc.directionLabel)} · ${pc.confidence}%</b><br>${escapeHtml(pc.delta || '')}
      </div>`;
  }

  document.getElementById('findingsKicker').textContent = t.findingsKicker;
  findingsList.innerHTML = t.findings.map((item) => `<li>${item}</li>`).join('');
  document.getElementById('riskKicker').textContent = t.riskKicker;
  riskGrid.innerHTML = t.risks.map((item) => `<div class="risk-pill">${escapeHtml(item)}</div>`).join('');
  // Update log (changelog) — pinned collapsible table at the top of the page.
  const changelog = t.changelog || [];
  document.getElementById('changelogKicker').textContent = t.changelogKicker;
  document.getElementById('changelogHint').textContent = t.changelogHint;
  const latest = changelog[0];
  const changelogLatestEl = document.getElementById('changelogLatest');
  changelogLatestEl.innerHTML = latest
    ? `${escapeHtml(t.changelogLatestPrefix)} <b>${escapeHtml(latest.date)}</b>`
      + (latest.prevDate ? ` · ${escapeHtml(t.changelogPrevPrefix)} ${escapeHtml(latest.prevDate)}` : '')
    : '';

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
  document.getElementById('updatesTitle').textContent = t.updatesTitle;
  document.getElementById('updatesSubtitle').textContent = t.updatesSubtitle;
  updatesGrid.innerHTML = t.researchUpdates
    .map(
      (item, index) => {
      const meta = (t.researchUpdateMeta && t.researchUpdateMeta[index]) || null;
      const tags = meta
        ? `<div class="update-tags"><span class="tag tag-${meta.tone}">${escapeHtml(meta.impact)}</span><span class="tag tag-horizon">${escapeHtml(meta.horizon)}</span></div>`
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
  document.getElementById('tableSubtitle').textContent = t.tableSubtitle;
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
    const isUpdated = item.updated && item.updated === DATA_VERSION;
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

async function init() {
  try {
    await loadCompanyFinancials();
  } catch (error) {
    console.error('Failed to load shared company financials', error);
    companyFinanceIndex = new Map();
  }

  renderStaticText();

  try {
    const response = await fetch(`${DATA_URL}?v=${DATA_VERSION}`);
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

sortFilter.addEventListener('change', () => store.commit({ sort: sortFilter.value }));

legend.addEventListener('click', (event) => {
  const button = event.target.closest('.legend-filter');
  const statusGroup = button?.dataset.statusGroup;
  if (!statusGroup) return;

  store.commit((state) => {
    // null ("all") is materialised into the full list on first toggle, so that turning one
    // chip off means "all except this" rather than "only this".
    const rendered = statusLegendItems.filter(
      (key) => CORE_STATUS_GROUPS.includes(key) || rawData.some((d) => d.status_group === key)
    );
    const current = state.filters.statusGroups ?? rendered;
    const next = current.includes(statusGroup)
      ? current.filter((key) => key !== statusGroup)
      : [...current, statusGroup];

    return {
      filters: {
        ...state.filters,
        // Back to null when everything is on again, so the URL stays clean and the
        // dropdown reads "全部" rather than an exhaustive list.
        statusGroups: next.length === rendered.length ? null : next,
      },
    };
  });
});

init();
