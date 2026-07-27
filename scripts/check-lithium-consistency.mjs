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
  validateMetric, classifyFreshness,
} from '../public/research-topics/global-lithium/data/market-schema.js';

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

  // THREE independent clocks (see core/version.js). Each pairing below can drift silently:
  //   code  — index.html ?v= (module pin) ≡ REPORT_VERSION (iframe pin) ≡ CODE_VERSION
  //   data  — UPDATE_MARKER ≡ the registry date shown on the homepage
  //   cache — DATA_CACHE_KEY must not predate UPDATE_MARKER
  if (assetVersion && assetVersion !== CODE_VERSION) {
    fail(`code version mismatch: index.html ?v=${assetVersion} vs CODE_VERSION ${CODE_VERSION}`);
  }
  if (reportVersion && reportVersion !== CODE_VERSION) {
    fail(`code version mismatch: REPORT_VERSION ${reportVersion} vs CODE_VERSION ${CODE_VERSION}`);
  }
  if (registryDate && UPDATE_MARKER !== registryDate) {
    fail(`data version mismatch: UPDATE_MARKER ${UPDATE_MARKER} vs registry date ${registryDate}`);
  }
  if (DATA_CACHE_KEY < UPDATE_MARKER) {
    fail(`DATA_CACHE_KEY ${DATA_CACHE_KEY} predates UPDATE_MARKER ${UPDATE_MARKER} — `
      + `a data change cannot be older than the data it describes`);
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

  return market;
}

const projects = await checkCsv();
const market = await checkMarket();
checkCompanyRows();
await checkVersions();

for (const w of warnings) console.warn(`  warn  ${w}`);

if (errors.length) {
  console.error(`\n✗ global-lithium consistency: ${errors.length} error(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ global-lithium consistency: ${projects?.length ?? 0} projects, `
  + `${companyResearchContent.zh.domesticRows.length + companyResearchContent.zh.globalRows.length} company rows, `
  + `${market?.keyMetrics?.length ?? 0} metrics`
  + (warnings.length ? `, ${warnings.length} warning(s)` : '')
);
