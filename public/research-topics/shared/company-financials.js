export const COMPANY_FINANCIALS_URL = '/data/company-financials.jsonl';

let recordsPromise;

export function normalizeCompanyKey(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

export async function loadCompanyFinancialRecords(url = COMPANY_FINANCIALS_URL) {
  if (!recordsPromise) {
    recordsPromise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load company financial records: ${response.status}`);
        }

        return response.text();
      })
      .then((text) => text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line)));
  }

  return recordsPromise;
}

export function filterCompanyFinancialRecords(records, filters = {}) {
  const { reportSlug, topic, datasetKind } = filters;

  return records.filter((record) => {
    if (reportSlug && !record.reportSlugs?.includes(reportSlug)) {
      return false;
    }

    if (topic && !record.topics?.includes(topic)) {
      return false;
    }

    if (datasetKind && record.finance?.datasetKind !== datasetKind) {
      return false;
    }

    return true;
  });
}

export function createCompanyFinanceIndex(records, filters = {}) {
  const index = new Map();

  filterCompanyFinancialRecords(records, filters).forEach((record) => {
    const keys = [record.companyName, ...(record.aliases || [])];

    keys.forEach((key) => {
      const normalized = normalizeCompanyKey(key);

      if (normalized) {
        index.set(normalized, record);
      }
    });
  });

  return index;
}

export function getCompanyFinanceRecord(index, companyName) {
  return index.get(normalizeCompanyKey(companyName)) || null;
}

export function getFinancePeriodLabels(record) {
  const periods = record?.finance?.periods;

  if (Array.isArray(periods) && periods.length > 0) {
    return periods;
  }

  return String(record?.finance?.periodLabel ?? '')
    .split('/')
    .map((label) => label.trim())
    .filter(Boolean);
}
