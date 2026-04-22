import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { companyFinanceData } from '../public/research-topics/semiconductor-upstream/data/company-finance.js';
import { sections as semiconductorSections } from '../public/research-topics/semiconductor-upstream/data/sections.js';
import { keyMetrics, sensitivityMatrix } from '../src/reports/2026-02-zijin-mining/data/zijinData.js';
import { opticalCompanyFinanceRecords } from '../src/reports/2026-04-optical-value-chain/data/company-finance.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_PATH = path.join(ROOT, 'public/data/company-financials.jsonl');
const SEMICONDUCTOR_SUBSEGMENTS_OUTPUT_PATH = path.join(ROOT, 'public/data/semiconductor-upstream-subsegments.jsonl');
const SEMICONDUCTOR_EXPOSURES_OUTPUT_PATH = path.join(ROOT, 'public/data/semiconductor-upstream-company-exposures.jsonl');
const SEMICONDUCTOR_RESEARCH_DRAFT_DIR = path.join(ROOT, 'researches/semiconductor-upstream');
const GLOBAL_LITHIUM_PATH = path.join(ROOT, 'public/research-topics/global-lithium-projects-2026.html');

function normalizeId(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function splitPeriodLabels(periodLabel) {
  return String(periodLabel ?? '')
    .split('/')
    .map((label) => label.trim())
    .filter(Boolean);
}

function writeJsonlFile(outputPath, records) {
  return writeFile(outputPath, `${records.map((record) => JSON.stringify(record)).join('\n')}\n`, 'utf8');
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatMaybeNumber(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  let maxDigits = 2;

  if (Math.abs(value - Math.round(value)) < 0.005) {
    maxDigits = 0;
  } else if (Math.abs(value * 10 - Math.round(value * 10)) < 0.05) {
    maxDigits = 1;
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  });
}

function formatMaybePercent(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatMaybeMultiple(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `${value.toFixed(1)}x`;
}

function parseApproxNumber(rawValue) {
  const raw = String(rawValue ?? '').trim();

  if (!raw || raw === 'N.A.' || raw === 'N.M.') {
    return { value: null, approx: false, raw };
  }

  const approx = raw.includes('~');
  const value = Number.parseFloat(
    raw
      .replace(/~/g, '')
      .replace(/x$/i, '')
      .replace(/,/g, '')
  );

  return {
    value: Number.isFinite(value) ? value : null,
    approx,
    raw,
  };
}

function extractObjectLiteral(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);

  if (start === -1 || end === -1) {
    throw new Error(`Unable to locate object literal between ${startMarker} and ${endMarker}`);
  }

  const expression = source
    .slice(start + startMarker.length, end)
    .trim()
    .replace(/;\s*$/, '');

  return Function(`"use strict"; return (${expression});`)();
}

function buildSemiconductorSubsegmentRecords() {
  return semiconductorSections.flatMap((section) => section.items.map((item) => ({
    id: `semiconductor-upstream/subsegment/${item.slug}`,
    recordType: 'subsegment',
    topic: 'semiconductor-upstream',
    section: item.section,
    subsegmentSlug: item.slug,
    subsegmentName: item.name,
    flowTo: item.flowTo,
    summary: item.summary,
    market: item.market,
    snapshot: item.snapshot,
    research: item.detail
      ? {
        title: item.detail.title,
        intro: item.detail.intro,
        sections: item.detail.sections || [],
        updateNote: item.detail.updateNote || '',
        badges: item.detail.badges || [],
      }
      : null,
    sources: [],
    sourcePath: '/public/research-topics/semiconductor-upstream/data/sections.js',
  })));
}

function buildSemiconductorExposureRecords() {
  return semiconductorSections.flatMap((section) => section.items.flatMap((item) => (
    (item.detail?.groups || []).flatMap((group) => (
      group.companies.map((company) => ({
        id: `semiconductor-upstream/company-exposure/${item.slug}/${normalizeId(company.name)}`,
        recordType: 'company-exposure',
        topic: 'semiconductor-upstream',
        section: item.section,
        subsegmentSlug: item.slug,
        subsegmentName: item.name,
        groupTitle: group.title,
        groupDesc: group.desc,
        companyName: company.name,
        market: company.market,
        cap: company.cap || '',
        summary: company.summary || '',
        tags: company.tags || [],
        note: company.note || '',
        segmentExposure: company.segmentExposure || null,
        sources: [],
        sourcePath: '/public/research-topics/semiconductor-upstream/data/sections.js',
      }))
    ))
  )));
}

async function loadDraftResearchRecords() {
  let filenames = [];

  try {
    filenames = await readdir(SEMICONDUCTOR_RESEARCH_DRAFT_DIR);
  } catch {
    return [];
  }

  const records = [];

  for (const filename of filenames.filter((entry) => entry.endsWith('.jsonl'))) {
    const filePath = path.join(SEMICONDUCTOR_RESEARCH_DRAFT_DIR, filename);
    const text = await readFile(filePath, 'utf8');

    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const record = JSON.parse(line);
        const normalizedRecord = (
          record.recordType === 'subsegment' && !record.snapshot && Array.isArray(record.market?.metrics)
            ? {
              ...record,
              snapshot: record.market,
            }
            : record
        );

        if (normalizedRecord !== record) {
          delete normalizedRecord.market;
        }

        records.push({
          ...normalizedRecord,
          sourcePath: normalizedRecord.sourcePath || `/researches/semiconductor-upstream/${filename}`,
        });
      });
  }

  return records;
}

function mergeRecords(baseRecords, draftRecords, getKey) {
  const merged = new Map(baseRecords.map((record) => [getKey(record), record]));

  draftRecords.forEach((record) => {
    const key = getKey(record);
    merged.set(key, {
      ...merged.get(key),
      ...record,
    });
  });

  return [...merged.values()];
}

function buildSemiconductorRecords() {
  return Object.entries(companyFinanceData).map(([companyName, finance]) => ({
    id: `semiconductor-upstream/${normalizeId(companyName)}`,
    companyName,
    aliases: [],
    reportSlugs: ['2026-04-semiconductor-upstream'],
    topics: ['semiconductor-upstream'],
    finance: {
      schemaVersion: 1,
      datasetKind: 'annual',
      periodLabel: finance.periodLabel,
      periods: splitPeriodLabels(finance.periodLabel),
      unit: finance.unit,
      series: {
        revenue: finance.revenue,
        netProfit: finance.profit,
        grossMargin: [null, finance.gross25 ?? null, finance.gross26 ?? null],
        forwardPE: [null, finance.pe25 ?? null, finance.pe26 ?? null],
      },
      display: {
        revenue: finance.revenue.map(formatMaybeNumber),
        netProfit: finance.profit.map(formatMaybeNumber),
        grossMargin: [null, finance.gross25 ?? null, finance.gross26 ?? null].map(formatMaybePercent),
        forwardPE: [null, finance.pe25 ?? null, finance.pe26 ?? null].map(formatMaybeMultiple),
      },
      flags: {
        pe26Approx: Boolean(finance.pe26Approx),
      },
      note: finance.note,
      sourcePath: '/public/research-topics/semiconductor-upstream/data/company-finance.js',
    },
  }));
}

function buildGlobalLithiumRecord(row, options) {
  const {
    market,
    unit,
    aliases = [],
    englishRow = [],
  } = options;
  const [companyName, np24, np25, np26, np27, pe24, pe25, pe26, pe27, note] = row;
  const englishNote = englishRow[9];
  const profits = [np24, np25, np26, np27].map(parseApproxNumber);
  const pe = [pe24, pe25, pe26, pe27].map(parseApproxNumber);

  return {
    id: `global-lithium/${normalizeId(companyName)}`,
    companyName,
    aliases,
    reportSlugs: ['2026-04-global-lithium'],
    topics: ['global-lithium'],
    market,
    finance: {
      schemaVersion: 1,
      datasetKind: 'annual',
      periodLabel: '2024A / 2025A / 2026E / 2027E',
      periods: ['2024A', '2025A', '2026E', '2027E'],
      unit,
      series: {
        revenue: [null, null, null, null],
        netProfit: profits.map((entry) => entry.value),
        grossMargin: [null, null, null, null],
        forwardPE: pe.map((entry) => entry.value),
      },
      display: {
        revenue: ['待补', '待补', '待补', '待补'],
        netProfit: profits.map((entry) => entry.raw || '待补'),
        grossMargin: ['待补', '待补', '待补', '待补'],
        forwardPE: pe.map((entry) => entry.raw || '待补'),
      },
      flags: {
        approximateNetProfit: profits.map((entry) => entry.approx),
        approximateForwardPE: pe.map((entry) => entry.approx),
      },
      note,
      notes: {
        zh: note,
        en: englishNote || note,
      },
      sourcePath: '/public/research-topics/global-lithium-projects-2026.html',
    },
  };
}

async function buildGlobalLithiumRecords() {
  const source = await readFile(GLOBAL_LITHIUM_PATH, 'utf8');
  const companyResearchContent = extractObjectLiteral(
    source,
    'const companyResearchContent =',
    'const dictionaries ='
  );
  const zhDomesticRows = companyResearchContent.zh.domesticRows;
  const zhGlobalRows = companyResearchContent.zh.globalRows;
  const enDomesticRows = companyResearchContent.en.domesticRows;
  const enGlobalRows = companyResearchContent.en.globalRows;

  return [
    ...zhDomesticRows.map((row, index) => buildGlobalLithiumRecord(row, {
      market: 'cn',
      unit: 'RMB mn',
      aliases: enDomesticRows[index]?.[0] ? [enDomesticRows[index][0]] : [],
      englishRow: enDomesticRows[index],
    })),
    ...zhGlobalRows.map((row, index) => buildGlobalLithiumRecord(row, {
      market: 'global',
      unit: 'USD mn / AUD mn',
      aliases: enGlobalRows[index]?.[0] && enGlobalRows[index][0] !== row[0] ? [enGlobalRows[index][0]] : [],
      englishRow: enGlobalRows[index],
    })),
  ];
}

function buildZijinRecord() {
  const profitMetric = keyMetrics.find((metric) => metric.label === '2025净利润');
  const currentPeMetric = keyMetrics.find((metric) => metric.label === '当前估值 PE');
  const currentNetProfit = profitMetric ? 520 : null;
  const currentPe = currentPeMetric ? 21 : null;

  return {
    id: 'zijin-mining/zijin-mining',
    companyName: '紫金矿业',
    aliases: ['Zijin Mining'],
    reportSlugs: ['2026-02-zijin-mining'],
    topics: ['zijin-mining'],
    finance: {
      schemaVersion: 1,
      datasetKind: 'scenario',
      periodLabel: '2025E / 2026悲观 / 2026中性 / 2026乐观',
      periods: ['2025E', '2026悲观', '2026中性', '2026乐观'],
      unit: '亿元人民币',
      series: {
        revenue: [null, null, null, null],
        netProfit: [
          currentNetProfit,
          sensitivityMatrix[0]?.netProfit ?? null,
          sensitivityMatrix[1]?.netProfit ?? null,
          sensitivityMatrix[2]?.netProfit ?? null,
        ],
        grossMargin: [null, null, null, null],
        forwardPE: [
          currentPe,
          sensitivityMatrix[0]?.impliedPE ?? null,
          sensitivityMatrix[1]?.impliedPE ?? null,
          sensitivityMatrix[2]?.impliedPE ?? null,
        ],
      },
      display: {
        revenue: ['待补', '待补', '待补', '待补'],
        netProfit: [
          currentNetProfit ? `${currentNetProfit}` : '待补',
          `${sensitivityMatrix[0]?.netProfit ?? '待补'}`,
          `${sensitivityMatrix[1]?.netProfit ?? '待补'}`,
          `${sensitivityMatrix[2]?.netProfit ?? '待补'}`,
        ],
        grossMargin: ['待补', '待补', '待补', '待补'],
        forwardPE: [
          currentPe ? `${currentPe}x` : '待补',
          `${sensitivityMatrix[0]?.impliedPE ?? '待补'}x`,
          `${sensitivityMatrix[1]?.impliedPE ?? '待补'}x`,
          `${sensitivityMatrix[2]?.impliedPE ?? '待补'}x`,
        ],
      },
      note: '2025E 取页面主指标中枢，2026 各期为情景测算口径，便于跨报告复用利润弹性假设。',
      sourcePath: '/src/reports/2026-02-zijin-mining/data/zijinData.js',
    },
  };
}

async function main() {
  const draftResearchRecords = await loadDraftResearchRecords();
  const records = [
    ...buildSemiconductorRecords(),
    ...opticalCompanyFinanceRecords,
    ...(await buildGlobalLithiumRecords()),
    buildZijinRecord(),
  ];
  const semiconductorSubsegmentRecords = mergeRecords(
    buildSemiconductorSubsegmentRecords(),
    draftResearchRecords.filter((record) => record.recordType === 'subsegment'),
    (record) => `${record.recordType}:${record.subsegmentSlug}`
  );
  const semiconductorExposureRecords = mergeRecords(
    buildSemiconductorExposureRecords(),
    draftResearchRecords.filter((record) => record.recordType === 'company-exposure'),
    (record) => `${record.recordType}:${record.subsegmentSlug}:${normalizeId(record.companyName)}`
  );

  await writeJsonlFile(OUTPUT_PATH, records);
  await writeJsonlFile(SEMICONDUCTOR_SUBSEGMENTS_OUTPUT_PATH, semiconductorSubsegmentRecords);
  await writeJsonlFile(SEMICONDUCTOR_EXPOSURES_OUTPUT_PATH, semiconductorExposureRecords);

  console.log(`Generated ${records.length} company finance records -> ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(`Generated ${semiconductorSubsegmentRecords.length} subsegment research records -> ${path.relative(ROOT, SEMICONDUCTOR_SUBSEGMENTS_OUTPUT_PATH)}`);
  console.log(`Generated ${semiconductorExposureRecords.length} company exposure records -> ${path.relative(ROOT, SEMICONDUCTOR_EXPOSURES_OUTPUT_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
