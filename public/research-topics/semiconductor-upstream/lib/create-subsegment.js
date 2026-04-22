function normalizeExposureMetric(metric, fallbackLabel) {
  if (!metric) {
    return {
      label: fallbackLabel,
      value: '待补',
      note: '',
    };
  }

  if (typeof metric === 'string') {
    return {
      label: fallbackLabel,
      value: metric,
      note: '',
    };
  }

  return {
    label: metric.label || fallbackLabel,
    value: metric.value || '待补',
    note: metric.note || '',
  };
}

function normalizeSegmentExposure(company, subsegmentName) {
  const exposure = company.segmentExposure || company.exposure;

  if (!exposure) {
    return company;
  }

  return {
    ...company,
    segmentExposure: {
      title: exposure.title || `${subsegmentName}环节定位`,
      role: exposure.role || company.summary || '待补',
      revenueShare: normalizeExposureMetric(exposure.revenueShare, '营收占比'),
      profitShare: normalizeExposureMetric(exposure.profitShare, '利润占比'),
      source: exposure.source || exposure.basis || '',
      note: exposure.note || '',
      badges: exposure.badges || [],
    },
  };
}

const normalizeCompany = (company, context = {}) => (
  Array.isArray(company)
    ? { name: company[0], market: company[1] }
    : normalizeSegmentExposure(company, context.subsegmentName || '当前')
);

function buildSnapshot(market, snapshot = {}) {
  const previousLabel = snapshot.previousLabel || '2024';
  const currentLabel = snapshot.currentLabel || '2025';
  const yoy = market?.v2024
    ? ((market.v2025 - market.v2024) / market.v2024) * 100
    : null;
  const customMetrics = new Map((snapshot.metrics || []).map((metric) => [metric.key, metric]));
  const baseOrder = ['market-size', 'revenue', 'profit', 'growth', 'pe'];
  const defaultMetrics = {
    'market-size': {
      key: 'market-size',
      label: '市场规模',
      format: 'bn',
      previousValue: market?.v2024 ?? null,
      currentValue: market?.v2025 ?? null,
      note: market?.basis ? `口径 ${market.basis}` : '',
    },
    revenue: {
      key: 'revenue',
      label: '营收',
      previous: '待补',
      current: '待补',
      note: '后续可接入板块年度营收口径。',
    },
    profit: {
      key: 'profit',
      label: '利润',
      previous: '待补',
      current: '待补',
      note: '后续可接入板块年度利润口径。',
    },
    growth: {
      key: 'growth',
      label: '增长',
      previousLabel: '区间',
      currentLabel: '同比',
      previous: `${previousLabel} → ${currentLabel}`,
      format: 'pct',
      currentValue: yoy,
      note: '默认按当前录入的年度对比自动计算。',
    },
    pe: {
      key: 'pe',
      label: 'PE',
      previous: '待补',
      current: '待补',
      note: '后续可接入板块估值口径。',
    },
  };

  const metrics = baseOrder.map((key) => ({
    ...defaultMetrics[key],
    ...(customMetrics.get(key) || {}),
  }));
  const extraMetrics = (snapshot.metrics || []).filter((metric) => !baseOrder.includes(metric.key));

  return {
    previousLabel,
    currentLabel,
    note: snapshot.note || market?.note || '',
    metrics: [...metrics, ...extraMetrics],
  };
}

function normalizeResearchSections({ summary, detail = {} }) {
  if (Array.isArray(detail.sections) && detail.sections.length > 0) {
    return detail.sections;
  }

  const overviewContent = detail.overview || detail.intro || summary;
  const reportContent = detail.report || detail.reportContent || detail.updateNote
    || '当前先按统一模板预留“详细报告”位置，后续可直接导入更完整的板块研究。';

  return [
    {
      key: 'overview',
      title: '概述',
      content: overviewContent,
      open: true,
    },
    {
      key: 'report',
      title: '详细报告',
      content: reportContent,
      open: false,
      pending: !detail.report && !detail.reportContent,
    },
  ];
}

export function createSimpleSubsegment({
  slug,
  name,
  section,
  flowTo,
  initialOpen = false,
  summary,
  market,
  companies,
  snapshot,
  groupTitle = 'A. 核心公司',
  groupDesc,
  detailTitle,
  updateNote = '当前先提供核心公司清单；后续可沿同一组件继续补充分层、标签与财务卡。'
}) {
  const detail = {
    title: detailTitle || `${name}板块深度拆解`,
    intro: summary,
    updateNote,
    sections: normalizeResearchSections({
      summary,
      detail: {
        title: detailTitle || `${name}板块深度拆解`,
        intro: summary,
        updateNote,
      },
    }),
    groups: [
      {
          title: groupTitle,
          desc: groupDesc || summary,
          companies: companies.map((company) => normalizeCompany(company, { subsegmentName: name })),
        },
      ],
    };

  return {
    slug,
    name,
    section,
    flowTo,
    initialOpen,
    summary,
    market,
    snapshot: buildSnapshot(market, snapshot),
    detail,
  };
}

export function createDeepDiveSubsegment(config) {
  const detail = {
    ...config.detail,
    sections: normalizeResearchSections({
      summary: config.summary,
      detail: config.detail,
    }),
    groups: config.detail.groups.map((group) => ({
      ...group,
      companies: group.companies.map((company) => normalizeCompany(company, { subsegmentName: config.name })),
    })),
  };

  return {
    ...config,
    snapshot: buildSnapshot(config.market, config.snapshot),
    detail,
  };
}
