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

function normalizeCompanyKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[（(].*?[)）]/g, '')
    .replace(/[\/&·.,:：\-\s]/g, '');
}

function buildExposureLookup(records) {
  const lookup = new Map();

  records.forEach((record) => {
    lookup.set(normalizeCompanyKey(record.companyName), record);
  });

  return lookup;
}

function mergeCompanyWithExposure(baseCompany, exposureRecord) {
  if (!exposureRecord) {
    return baseCompany;
  }

  return {
    ...baseCompany,
    market: exposureRecord.market || baseCompany.market,
    cap: exposureRecord.cap || baseCompany.cap,
    summary: exposureRecord.summary || baseCompany.summary,
    tags: exposureRecord.tags?.length ? exposureRecord.tags : (baseCompany.tags || []),
    note: exposureRecord.note || baseCompany.note,
    segmentExposure: exposureRecord.segmentExposure || baseCompany.segmentExposure || null,
  };
}

function mergeGroups(baseGroups, exposureRecords) {
  const hasBaseGroups = Array.isArray(baseGroups) && baseGroups.length > 0;
  const hasExposureRecords = Array.isArray(exposureRecords) && exposureRecords.length > 0;

  if (!hasExposureRecords) {
    return hasBaseGroups ? baseGroups : [];
  }

  if (!hasBaseGroups) {
    return buildGroupsFromExposureRecords(exposureRecords);
  }

  const exposureLookup = buildExposureLookup(exposureRecords);
  const matchedKeys = new Set();

  const mergedBaseGroups = baseGroups.map((group) => ({
    ...group,
    companies: (group.companies || []).map((company) => {
      const key = normalizeCompanyKey(company.name);
      const matchedRecord = exposureLookup.get(key);

      if (matchedRecord) {
        matchedKeys.add(key);
      }

      return mergeCompanyWithExposure(company, matchedRecord);
    }),
  }));

  const unmatchedExposureRecords = exposureRecords.filter(
    (record) => !matchedKeys.has(normalizeCompanyKey(record.companyName))
  );

  if (!unmatchedExposureRecords.length) {
    return mergedBaseGroups;
  }

  return [
    ...mergedBaseGroups,
    ...buildGroupsFromExposureRecords(unmatchedExposureRecords),
  ];
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
      groups: mergeGroups(baseItem.detail?.groups || [], exposureRecords),
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
