import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatUsdBn(value) {
  return isFiniteNumber(value) ? `USD ${value.toFixed(2)}bn` : '待补';
}

function build2026Metric(v2025, v2026, note = '2026E 口径见研究说明。') {
  if (!isFiniteNumber(v2025) && !isFiniteNumber(v2026)) {
    return null;
  }

  return {
    key: 'market-size-2026',
    label: '2025E / 2026E 规模',
    previousLabel: '2025E',
    currentLabel: '2026E',
    previous: formatUsdBn(v2025),
    current: formatUsdBn(v2026),
    note,
  };
}

function buildChinaMarketMetric(chinaMarket) {
  if (!chinaMarket) {
    return null;
  }

  return {
    key: 'china-market',
    label: '中国大陆市场',
    previousLabel: chinaMarket.previousLabel || '年份',
    currentLabel: chinaMarket.currentLabel || '规模',
    previous: chinaMarket.previous || chinaMarket.year || '待补',
    current: chinaMarket.current || chinaMarket.value || '待补',
    note: chinaMarket.note || '',
  };
}

function buildLocalizationMetric(localization) {
  if (!localization) {
    return null;
  }

  return {
    key: 'localization',
    label: localization.label || '国产替代率',
    previousLabel: localization.previousLabel || '口径',
    currentLabel: localization.currentLabel || '水平',
    previous: localization.previous || '待补',
    current: localization.current || '待补',
    note: localization.note || '',
  };
}

export function createMaterialSubsegment({
  slug,
  name,
  flowTo,
  initialOpen = false,
  summary,
  overview,
  report,
  basis = 'C',
  v2024 = null,
  v2025 = null,
  v2026 = null,
  marketNote,
  market26Note,
  chinaMarket,
  localization,
  snapshotNote,
  updateNote = '口径与公司映射已按当前公开资料重排。',
  detailTitle,
  groupTitle = 'A. 核心公司映射',
  groupDesc,
  companies,
}) {
  const snapshotMetrics = [
    build2026Metric(v2025, v2026, market26Note),
    buildChinaMarketMetric(chinaMarket),
    buildLocalizationMetric(localization),
  ].filter(Boolean);

  return createDeepDiveSubsegment({
    slug,
    name,
    section: '材料',
    flowTo,
    initialOpen,
    summary,
    market: {
      v2024,
      v2025,
      basis,
      note: marketNote,
    },
    snapshot: {
      note: snapshotNote || marketNote,
      metrics: snapshotMetrics,
    },
    detail: {
      title: detailTitle || `${name}板块速览`,
      intro: summary,
      updateNote,
      sections: [
        {
          key: 'overview',
          title: '概述',
          content: overview || summary,
          open: true,
        },
        {
          key: 'report',
          title: '详细报告',
          content: report || marketNote || '当前页面优先保留市场边界、规模锚点与公司映射。',
          open: false,
        },
      ],
      groups: [
        {
          title: groupTitle,
          desc: groupDesc || summary,
          companies,
        },
      ],
    },
  });
}
