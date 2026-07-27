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
import { statusLegendItems } from '../public/research-topics/global-lithium/data/schema.js';
import { companyResearchContent } from '../public/research-topics/global-lithium/data/company-research.js';
import { listedOwners } from '../public/research-topics/global-lithium/data/listed-owners.js';
import { DATA_VERSION } from '../public/research-topics/global-lithium/data/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CSV_PATH = path.join(ROOT, 'public/data/global-lithium-database-2026.csv');
const INDEX_HTML_PATH = path.join(ROOT, 'public/research-topics/global-lithium/index.html');
const WRAPPER_PATH = path.join(ROOT, 'src/reports/2026-04-global-lithium/index.jsx');
const REGISTRY_PATH = path.join(ROOT, 'src/reports/index.js');

const EXPECTED_COLUMNS = [
  'project', 'country', 'region', 'status', 'deposit_type', 'reserve_resource', 'grade',
  'current_kta_lce', 'planned_kta_lce', 'cost', 'address', 'lat', 'lon', 'route',
  'port_lat', 'port_lon', 'risks', 'source_note', 'map_capacity_kta', 'updated',
];

/**
 * Projects whose raw `status` legitimately falls through to the 'Other' bucket.
 * Anything NOT listed here that lands in 'Other' fails the build — that is exactly how
 * `Uyuni cluster` silently vanished from the table and map before (its status,
 * "Resource giant / commercial scale still limited", matched no heuristic branch and
 * 'Other' was missing from the legend, so it was filtered out of every surface).
 * Phase 4 replaces this heuristic with explicit lifecycle/structure/activity columns.
 */
const KNOWN_OTHER_STATUS = new Set(['Uyuni cluster']);

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

  projects.forEach((p) => {
    // Every project must land in a bucket the legend actually renders, or it disappears
    // from the table AND the map while still being counted in the KPIs.
    if (!statusLegendItems.includes(p.status_group)) {
      fail(`"${p.project}" → status group "${p.status_group}" is not in statusLegendItems`);
    }
    if (p.status_group === 'Other' && !KNOWN_OTHER_STATUS.has(p.project)) {
      fail(`"${p.project}" (status: "${p.status}") fell through to 'Other'. `
        + `Add a normalizeStatusGroup() branch, or allowlist it in KNOWN_OTHER_STATUS.`);
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

  // Two INDEPENDENT clocks, deliberately:
  //   code  — REPORT_VERSION (iframe URL pin) must match index.html's ?v= (module pin)
  //   data  — DATA_VERSION (also the "本次更新" row marker) must match the registry date
  // Conflating them is how a code-only release silently clears every update pill.
  if (assetVersion && reportVersion && assetVersion !== reportVersion) {
    fail(`code version mismatch: index.html ?v=${assetVersion} vs REPORT_VERSION ${reportVersion}`);
  }
  if (registryDate && DATA_VERSION !== registryDate) {
    fail(`data version mismatch: DATA_VERSION ${DATA_VERSION} vs registry date ${registryDate}`);
  }
}

const projects = await checkCsv();
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
  + `${companyResearchContent.zh.domesticRows.length + companyResearchContent.zh.globalRows.length} company rows`
  + (warnings.length ? `, ${warnings.length} warning(s)` : '')
);
