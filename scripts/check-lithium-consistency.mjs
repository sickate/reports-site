#!/usr/bin/env node
/**
 * Build-time data invariants for the global-lithium research topic.
 *
 * Wired into `npm run prebuild`, so `npm run build` — and therefore `npm run deploy`
 * (`set -e`) — fails BEFORE rsync if the data is inconsistent. The point is to turn a
 * class of silent, user-visible defects into a loud build error.
 *
 * It deliberately imports the SAME csv.js / schema.js modules the browser uses, so the
 * checker can never validate something the runtime parses differently.
 *
 * Run standalone:  node scripts/check-lithium-consistency.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadCsvData, parseCsv } from '../public/research-topics/global-lithium/data/csv.js';
import {
  statusLegendItems, LIFECYCLE_VALUES, STRUCTURE_VALUES, ACTIVITY_VALUES,
  STATUS_LIFECYCLE_EXPECTATION,
} from '../public/research-topics/global-lithium/data/schema.js';
import { companyResearchContent } from '../public/research-topics/global-lithium/data/company-research.js';
import { listedOwners } from '../public/research-topics/global-lithium/data/listed-owners.js';
import {
  CODE_VERSION, DATA_CACHE_KEY, UPDATE_MARKER,
} from '../public/research-topics/global-lithium/core/version.js';
import {
  validateMetric, validateSeries, classifyFreshness,
} from '../public/research-topics/global-lithium/data/market-schema.js';
import {
  COLUMNS, COLUMN_GROUPS, RENDER_KINDS, DEFAULT_COLUMN_GROUP, columnsForGroup, groupWidth,
} from '../public/research-topics/global-lithium/data/columns.js';
import { MAP_REGIONS, REGION_COUNTRIES } from '../public/research-topics/global-lithium/data/regions.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CSV_PATH = path.join(ROOT, 'public/data/global-lithium-database-2026.csv');
const MARKET_PATH = path.join(ROOT, 'public/data/global-lithium-market.json');
const INDEX_HTML_PATH = path.join(ROOT, 'public/research-topics/global-lithium/index.html');
const WRAPPER_PATH = path.join(ROOT, 'src/reports/2026-04-global-lithium/index.jsx');
const REGISTRY_PATH = path.join(ROOT, 'src/reports/index.js');

const EXPECTED_COLUMNS = [
  'project', 'country', 'region', 'status', 'lifecycle', 'structure', 'activity',
  'deposit_type', 'reserve_resource', 'grade',
  'current_kta_lce', 'planned_kta_lce', 'cost', 'address', 'lat', 'lon', 'route',
  'port_lat', 'port_lon', 'risks', 'source_note', 'map_capacity_kta', 'updated',
];

/** Company rows are destructured POSITIONALLY by generate-company-financials-jsonl.mjs. */
const COMPANY_ROW_CELLS = 11;

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

async function checkCsv() {
  const text = await readFile(CSV_PATH, 'utf8');
  const rawRows = parseCsv(text.replace(/^﻿/, ''));
  const [header, ...dataRows] = rawRows;

  const headerNames = header.map((h) => h.replace(/^﻿/, '').trim());
  if (headerNames.join(',') !== EXPECTED_COLUMNS.join(',')) {
    fail(`CSV header drift.\n     expected: ${EXPECTED_COLUMNS.join(',')}\n     actual:   ${headerNames.join(',')}`);
    return null;
  }

  // A short row usually means an unquoted comma inside a Chinese narrative field.
  dataRows.forEach((row, i) => {
    if (row.length !== EXPECTED_COLUMNS.length) {
      fail(`CSV row ${i + 2} has ${row.length} cells, expected ${EXPECTED_COLUMNS.length} (unquoted comma?)`);
    }
  });

  const projects = loadCsvData(text);

  const enumChecks = [
    ['lifecycle', LIFECYCLE_VALUES],
    ['structure', STRUCTURE_VALUES],
    ['activity', ACTIVITY_VALUES],
  ];

  projects.forEach((p) => {
    // Closed enums. An out-of-range value would land in deriveStatusGroup's default branch
    // and quietly file the row as 'Resource stage' — the same class of silent
    // misclassification the free-text `status` heuristic used to produce.
    for (const [field, allowed] of enumChecks) {
      if (!allowed.includes(p[field])) {
        fail(`"${p.project}" has ${field}="${p[field]}", not one of: ${allowed.join(' | ')}`);
      }
    }

    // `status` is prose and `lifecycle` is the machine-readable claim. If someone edits one
    // and not the other, the pill and the filters start disagreeing with no visible error.
    const expected = STATUS_LIFECYCLE_EXPECTATION[p.status];
    if (expected === undefined) {
      warn(`"${p.project}": status "${p.status}" is not declared in `
        + `STATUS_LIFECYCLE_EXPECTATION, so its lifecycle cannot be cross-checked`);
    } else if (expected !== p.lifecycle) {
      fail(`"${p.project}": status "${p.status}" implies lifecycle "${expected}" `
        + `but the row says "${p.lifecycle}"`);
    }

    // Every project must land in a bucket the legend actually renders, or it disappears
    // from the table AND the map while still being counted in the KPIs.
    if (!statusLegendItems.includes(p.status_group)) {
      fail(`"${p.project}" → status group "${p.status_group}" is not in statusLegendItems`);
    }

    // Half a coordinate pair renders nothing but reads as "mapped" — catch it early.
    const hasLat = Number.isFinite(p.lat);
    const hasLon = Number.isFinite(p.lon);
    if (hasLat !== hasLon) fail(`"${p.project}" has only one of lat/lon`);

    const hasPortLat = Number.isFinite(p.port_lat);
    const hasPortLon = Number.isFinite(p.port_lon);
    if (hasPortLat !== hasPortLon) fail(`"${p.project}" has only one of port_lat/port_lon`);

    if (!hasLat) warn(`"${p.project}" has no coordinates (will not appear on the map)`);
  });

  // listedOwners is keyed by project name: a rename on either side silently blanks the
  // "所属上市公司" column rather than erroring.
  const csvNames = new Set(projects.map((p) => p.project));
  Object.keys(listedOwners).forEach((name) => {
    if (!csvNames.has(name)) fail(`listedOwners has "${name}", absent from the CSV (renamed?)`);
  });
  projects.forEach((p) => {
    if (!listedOwners[p.project]) warn(`"${p.project}" has no listedOwners entry`);
  });

  return projects;
}

function checkCompanyRows() {
  const { zh, en } = companyResearchContent;
  for (const [lang, content] of [['zh', zh], ['en', en]]) {
    for (const key of ['domesticRows', 'globalRows']) {
      const rows = content?.[key];
      if (!Array.isArray(rows)) {
        fail(`companyResearchContent.${lang}.${key} is missing — the JSONL generator needs it`);
        continue;
      }
      rows.forEach((row, i) => {
        if (row.length !== COMPANY_ROW_CELLS) {
          fail(`companyResearchContent.${lang}.${key}[${i}] ("${row[0]}") has ${row.length} cells, `
            + `expected ${COMPANY_ROW_CELLS}. The generator destructures positionally — an extra `
            + `column silently turns the market cap into the note.`);
        }
      });
    }
  }
  if (zh?.domesticRows?.length !== en?.domesticRows?.length) fail('zh/en domesticRows length mismatch');
  if (zh?.globalRows?.length !== en?.globalRows?.length) fail('zh/en globalRows length mismatch');
}

async function checkVersions() {
  const [indexHtml, wrapper, registry] = await Promise.all([
    readFile(INDEX_HTML_PATH, 'utf8'),
    readFile(WRAPPER_PATH, 'utf8'),
    readFile(REGISTRY_PATH, 'utf8'),
  ]);

  const assetVersion = indexHtml.match(/src="\.\/app\.js\?v=([\d-]+)"/)?.[1];
  const reportVersion = wrapper.match(/const REPORT_VERSION = '([\d-]+)'/)?.[1];
  const registryDate = registry
    .match(/slug: '2026-04-global-lithium',[\s\S]*?date: '([\d-]+)'/)?.[1];

  if (!assetVersion) fail('could not read ?v= from the app.js script tag in index.html');
  if (!reportVersion) fail('could not read REPORT_VERSION from the React wrapper');
  if (!registryDate) fail('could not read the registry `date` for 2026-04-global-lithium');

  // Clocks (see core/version.js). Each pairing below can drift silently:
  //   code  — index.html ?v= (module pin) ≡ REPORT_VERSION (iframe pin) ≡ CODE_VERSION
  //   data  — the registry date shown on the homepage ≡ market.meta.asOf
  //   pill  — UPDATE_MARKER scopes the CSV's "本次更新" highlight and may legitimately lag
  //           the report date (a company/market-only refresh leaves project rows untouched)
  //   cache — DATA_CACHE_KEY must cover the newest data it is busting
  if (assetVersion && assetVersion !== CODE_VERSION) {
    fail(`code version mismatch: index.html ?v=${assetVersion} vs CODE_VERSION ${CODE_VERSION}`);
  }
  if (reportVersion && reportVersion !== CODE_VERSION) {
    fail(`code version mismatch: REPORT_VERSION ${reportVersion} vs CODE_VERSION ${CODE_VERSION}`);
  }

  const reportAsOf = market?.meta?.asOf;
  if (registryDate && reportAsOf && registryDate !== reportAsOf) {
    fail(`report date mismatch: src/reports/index.js date ${registryDate} vs `
      + `market.meta.asOf ${reportAsOf} — the homepage would advertise a different `
      + `freshness than the page itself claims`);
  }
  if (reportAsOf && UPDATE_MARKER > reportAsOf) {
    fail(`UPDATE_MARKER ${UPDATE_MARKER} is newer than market.meta.asOf ${reportAsOf}`);
  }
  if (DATA_CACHE_KEY < UPDATE_MARKER || (reportAsOf && DATA_CACHE_KEY < reportAsOf)) {
    fail(`DATA_CACHE_KEY ${DATA_CACHE_KEY} predates the data it busts `
      + `(UPDATE_MARKER ${UPDATE_MARKER}, market.meta.asOf ${reportAsOf})`);
  }

  // The pill is opt-in per row: if no row carries the marker, the "本次更新" highlight is
  // silently absent everywhere. That is legitimate for a code-only release, but it should
  // be a deliberate state, not something noticed weeks later.
  const marked = projects?.filter((p) => p.updated === UPDATE_MARKER).length ?? 0;
  if (!marked) warn(`no CSV row has updated="${UPDATE_MARKER}" — no "本次更新" pill will render`);
}

/**
 * The market file is loaded at RUNTIME from /data/, so a malformed one is not a build
 * error in any other sense — it just makes the cockpit render "unavailable" in production.
 * Validating it here turns that into a build failure while it is still cheap to fix.
 */
async function checkMarket() {
  let market;
  try {
    market = JSON.parse(await readFile(MARKET_PATH, 'utf8'));
  } catch (error) {
    fail(`global-lithium-market.json: ${error.message}`);
    return null;
  }

  const reference = market.meta?.asOf;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reference || '')) {
    fail(`market.meta.asOf "${reference}" is not YYYY-MM-DD — every freshness badge is measured against it`);
    return market;
  }
  if (reference < UPDATE_MARKER) {
    fail(`market.meta.asOf ${reference} predates UPDATE_MARKER ${UPDATE_MARKER}`);
  }

  const metrics = market.keyMetrics || [];
  if (!metrics.length) warn('market.keyMetrics is empty — the cockpit metric grid will be blank');

  const ids = new Set();
  metrics.forEach((metric, i) => {
    for (const problem of validateMetric(metric, `keyMetrics[${i}] "${metric?.label ?? '?'}"`)) {
      fail(problem);
    }
    if (metric?.id) {
      if (ids.has(metric.id)) fail(`duplicate metric id "${metric.id}"`);
      ids.add(metric.id);
    }
    // A metric can be legitimately old (an April consensus in a July update) — that is what
    // the badge is for. Surfacing it as a warning keeps it a decision rather than a drift.
    if (metric?.asOf && metric.series
      && classifyFreshness(metric.asOf, reference, metric.series) === 'stale') {
      warn(`metric "${metric.label}" is stale (asOf ${metric.asOf} vs ${reference})`);
    }
  });

  // The changelog's newest entry is what the header renders as "最近更新". If it were
  // out of order the page would advertise an old date as the latest one.
  const dates = (market.changelog || []).map((e) => e.date);
  const sorted = [...dates].sort().reverse();
  if (dates.join() !== sorted.join()) {
    fail(`market.changelog is not newest-first: ${dates.join(' , ')}`);
  }
  if (dates.length && dates[0] !== reference) {
    warn(`newest changelog entry ${dates[0]} != market.meta.asOf ${reference}`);
  }

  // impact/tone/horizon are inline per card now. A card missing them renders with no
  // badges at all, which reads as "no view expressed" rather than as a data omission.
  (market.researchUpdates || []).forEach((u, i) => {
    if (!u.title || !u.body) fail(`researchUpdates[${i}] missing title/body`);
    if (!u.impact || !u.tone || !u.horizon) {
      fail(`researchUpdates[${i}] ("${u.title}") missing impact/tone/horizon`);
    }
  });

  checkChartSeries(market, reference);

  return market;
}

/** Per-chart required point keys. A chart module reading a key nobody validates is how a
 *  series silently renders as a flat line at zero. */
const SERIES_POINT_KEYS = {
  h1Coverage: ['company', 'low', 'high'],
  gfexTermStructure: ['contract', 'settlement'],
  inventorySplit: ['segment', 'value'],
  consensusBand: ['label', 'low', 'high'],
  policyTimeline: ['date', 'title', 'direction'],
};

function checkChartSeries(market, reference) {
  const charts = market.charts || {};

  for (const [key, envelope] of Object.entries(charts)) {
    for (const problem of validateSeries(envelope, `charts.${key}`, {
      requiredPointKeys: SERIES_POINT_KEYS[key] || [],
    })) {
      fail(problem);
    }

    // A series dated AFTER the file's own reference date is the signature of a partial
    // refresh: someone pulled a fresh quote into a file whose meta.asOf, changelog and
    // homepage date all still describe the previous week. Every freshness badge on the page
    // is measured against meta.asOf, so such a point would score as "fresh" by being in the
    // future. Refresh the whole file or pin the series to the date it belongs to.
    if (envelope?.asOf && envelope.asOf > reference) {
      fail(`charts.${key}.asOf ${envelope.asOf} is later than market.meta.asOf ${reference} — `
        + 'either advance meta.asOf (and the changelog + registry date with it) or pin the '
        + 'series to the as-of it was sourced for');
    }

    if (envelope?.asOf && envelope.series
      && classifyFreshness(envelope.asOf, reference, envelope.series) === 'stale') {
      warn(`charts.${key} is stale (asOf ${envelope.asOf} vs ${reference})`);
    }
  }

  // The coverage chart divides by the FY26E cell of the company table. A name that does not
  // match a table row silently drops that company from the chart while the table still
  // lists it — the exact "two surfaces disagree" defect the runtime invariants exist for.
  // The stacked segments must add to the total the metric tile publishes, or the chart and
  // the tile describe different inventories.
  const split = charts.inventorySplit;
  const total = (market.keyMetrics || []).find((m) => m.id === 'inventory-spot-total');
  if (split?.points && total?.value != null) {
    const sum = split.points.reduce((acc, pt) => acc + (Number(pt.value) || 0), 0);
    if (sum !== Number(total.value)) {
      fail(`charts.inventorySplit segments sum to ${sum} but metric "inventory-spot-total" is `
        + `${total.value} — the chart and the tile would describe different inventories`);
    }
  }

  // A timeline entry must carry a direction the renderer knows, or it draws unmarked.
  for (const pt of charts.policyTimeline?.points || []) {
    if (!['positive', 'negative', 'neutral'].includes(pt.direction)) {
      fail(`charts.policyTimeline: "${pt.title}" has direction "${pt.direction}" `
        + '(expected positive | negative | neutral)');
    }
  }

  for (const pt of charts.consensusBand?.points || []) {
    if (!(pt.low <= pt.high)) fail(`charts.consensusBand: "${pt.label}" has low > high`);
  }

  const h1 = charts.h1Coverage;
  if (h1?.points) {
    const tableNames = new Set(companyResearchContent.zh.domesticRows.map((r) => r[0]));
    for (const pt of h1.points) {
      if (!tableNames.has(pt.company)) {
        fail(`charts.h1Coverage: "${pt.company}" is not a row in companyResearchContent.zh.domesticRows`);
      }
      if (!(pt.low <= pt.high)) {
        fail(`charts.h1Coverage: "${pt.company}" has low ${pt.low} > high ${pt.high}`);
      }
    }
  }
}

const projects = await checkCsv();
const market = await checkMarket();
checkColumns(projects);
checkRegions(projects);
checkCompanyRows();
await checkVersions();

for (const w of warnings) console.warn(`  warn  ${w}`);

/**
 * Column config invariants.
 *
 * The load-bearing one is #1: it makes renaming a CSV column a BUILD failure rather than a
 * cell that renders an em dash forever. The rest keep the group/frozen/render contracts
 * that data/columns.js promises to app.js.
 */
function checkColumns(projects) {
  const groupIds = COLUMN_GROUPS.map((g) => g.id);

  for (const col of COLUMNS) {
    if (!col.derived && !EXPECTED_COLUMNS.includes(col.key)) {
      fail(`column "${col.key}" is not a CSV column (and is not marked derived) — rename or mark it`);
    }
    if (!RENDER_KINDS.includes(col.render)) {
      fail(`column "${col.key}" has render "${col.render}", not one of ${RENDER_KINDS.join('|')}`);
    }
    if (col.groups !== '*') {
      for (const g of col.groups) {
        if (!groupIds.includes(g)) fail(`column "${col.key}" references unknown group "${g}"`);
      }
    }
    if (!Number.isFinite(col.width) || col.width <= 0) {
      fail(`column "${col.key}" has a non-positive width`);
    }
  }

  const keys = COLUMNS.map((c) => c.key);
  const dupKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dupKeys.length) fail(`duplicate column key(s): ${[...new Set(dupKeys)].join(', ')}`);

  const dupGroups = groupIds.filter((g, i) => groupIds.indexOf(g) !== i);
  if (dupGroups.length) fail(`duplicate column group id(s): ${[...new Set(dupGroups)].join(', ')}`);

  if (!groupIds.includes(DEFAULT_COLUMN_GROUP)) {
    fail(`DEFAULT_COLUMN_GROUP "${DEFAULT_COLUMN_GROUP}" is not a declared group`);
  }

  const frozen = COLUMNS.filter((c) => c.frozen);
  if (frozen.length !== 1) {
    fail(`expected exactly 1 frozen column, found ${frozen.length}`);
  }

  for (const id of groupIds) {
    const cols = columnsForGroup(id);
    if (!cols.length) { fail(`column group "${id}" is empty`); continue; }
    // The frozen column is `position: sticky; left: 0`, which only makes sense on the
    // FIRST cell of the row — so it has to lead every group, not just exist in it.
    if (!cols[0].frozen) fail(`column group "${id}" does not start with the frozen column`);
  }

  // `project` is the key for row -> marker matching, listedOwners lookup and the URL's
  // selection param. Nothing asserted it was unique before.
  if (projects) {
    const names = projects.map((p) => p.project);
    const dupes = names.filter((n, i) => names.indexOf(n) !== i);
    if (dupes.length) fail(`duplicate project name(s) in CSV: ${[...new Set(dupes)].join(', ')}`);
  }
}

/**
 * Map regions must stay in step with the CSV in BOTH directions. A region naming a country
 * that no longer exists is a dead chip; a CSV country in no region is a project the
 * quick-zoom can never frame — the silent half, and the reason this runs at build time.
 */
function checkRegions(projects) {
  if (!projects) return;
  const csvCountries = new Set(projects.map((p) => p.country));

  for (const country of REGION_COUNTRIES) {
    if (!csvCountries.has(country)) {
      fail(`data/regions.js names country "${country}", which no CSV project uses`);
    }
  }
  for (const country of csvCountries) {
    const covered = MAP_REGIONS.some((r) => r.countries && r.countries.includes(country));
    if (!covered) fail(`CSV country "${country}" belongs to no map region — add it to data/regions.js`);
  }

  const ids = MAP_REGIONS.map((r) => r.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(`duplicate map region id(s): ${[...new Set(dupes)].join(', ')}`);
  if (!MAP_REGIONS.some((r) => r.countries === null)) {
    fail('data/regions.js has no catch-all region (countries: null)');
  }
}

if (errors.length) {
  console.error(`\n✗ global-lithium consistency: ${errors.length} error(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ global-lithium consistency: ${projects?.length ?? 0} projects, `
  + `${companyResearchContent.zh.domesticRows.length + companyResearchContent.zh.globalRows.length} company rows, `
  + `${market?.keyMetrics?.length ?? 0} metrics, `
  + `columns ${COLUMN_GROUPS.map((g) => `${g.id}=${columnsForGroup(g.id).length}@${groupWidth(g.id)}px`).join(' ')}`
  + (warnings.length ? `, ${warnings.length} warning(s)` : '')
);
