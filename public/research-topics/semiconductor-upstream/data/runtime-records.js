const SUBSEGMENT_RECORDS_URL = '/data/semiconductor-upstream-subsegments.jsonl';
const EXPOSURE_RECORDS_URL = '/data/semiconductor-upstream-company-exposures.jsonl';

let runtimeRecordsPromise;

async function loadJsonl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load JSONL records: ${url} ${response.status}`);
  }

  const text = await response.text();

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function buildSubsegmentIndex(records) {
  return new Map(records.map((record) => [record.subsegmentSlug, record]));
}

function buildExposureIndex(records) {
  const index = new Map();

  records.forEach((record) => {
    const next = index.get(record.subsegmentSlug) || [];
    next.push(record);
    index.set(record.subsegmentSlug, next);
  });

  return index;
}

function buildGroupsFromExposureRecords(records) {
  const groups = new Map();

  records.forEach((record) => {
    const key = `${record.groupTitle}:::${record.groupDesc || ''}`;
    const currentGroup = groups.get(key) || {
      title: record.groupTitle,
      desc: record.groupDesc || '',
      companies: [],
    };

    currentGroup.companies.push({
      name: record.companyName,
      market: record.market,
      cap: record.cap,
      summary: record.summary,
      tags: record.tags || [],
      note: record.note || '',
      segmentExposure: record.segmentExposure || null,
    });

    groups.set(key, currentGroup);
  });

  return [...groups.values()];
}

function resolveRuntimeSnapshot(subsegmentRecord) {
  if (subsegmentRecord?.snapshot) {
    return subsegmentRecord.snapshot;
  }

  if (Array.isArray(subsegmentRecord?.market?.metrics)) {
    return subsegmentRecord.market;
  }

  return null;
}

function resolveRuntimeMarket(baseItem, subsegmentRecord) {
  if (subsegmentRecord?.market?.v2024 !== undefined && subsegmentRecord?.market?.v2025 !== undefined) {
    return subsegmentRecord.market;
  }

  return baseItem.market;
}

function mergeSubsegment(baseItem, subsegmentRecord, exposureRecords) {
  const hasExposureRecords = Array.isArray(exposureRecords) && exposureRecords.length > 0;
  const runtimeSnapshot = resolveRuntimeSnapshot(subsegmentRecord);

  return {
    ...baseItem,
    name: subsegmentRecord?.subsegmentName || baseItem.name,
    flowTo: subsegmentRecord?.flowTo || baseItem.flowTo,
    summary: subsegmentRecord?.summary || baseItem.summary,
    market: resolveRuntimeMarket(baseItem, subsegmentRecord),
    snapshot: runtimeSnapshot || baseItem.snapshot,
    detail: {
      ...baseItem.detail,
      title: subsegmentRecord?.research?.title || baseItem.detail?.title,
      intro: subsegmentRecord?.research?.intro || baseItem.detail?.intro,
      sections: subsegmentRecord?.research?.sections || baseItem.detail?.sections || [],
      updateNote: subsegmentRecord?.research?.updateNote || baseItem.detail?.updateNote,
      badges: subsegmentRecord?.research?.badges || baseItem.detail?.badges || [],
      groups: hasExposureRecords
        ? buildGroupsFromExposureRecords(exposureRecords)
        : (baseItem.detail?.groups || []),
    },
  };
}

export async function loadSemiconductorRuntimeRecords() {
  if (!runtimeRecordsPromise) {
    runtimeRecordsPromise = Promise.all([
      loadJsonl(SUBSEGMENT_RECORDS_URL),
      loadJsonl(EXPOSURE_RECORDS_URL),
    ]).then(([subsegments, exposures]) => ({
      subsegments,
      exposures,
      subsegmentIndex: buildSubsegmentIndex(subsegments),
      exposureIndex: buildExposureIndex(exposures),
    }));
  }

  return runtimeRecordsPromise;
}

export function mergeSectionsWithRuntimeRecords(baseSections, runtimeRecords) {
  return baseSections.map((section) => ({
    ...section,
    items: section.items.map((item) => mergeSubsegment(
      item,
      runtimeRecords.subsegmentIndex.get(item.slug),
      runtimeRecords.exposureIndex.get(item.slug)
    )),
  }));
}
