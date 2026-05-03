// Google / Alphabet 分部、Capex、资本配置、KPI 数据
// 数据口径：Q1 2026 10-Q / Q4 2025 10-K / 历次电话会管理层口径

// ============================================================
// 1. 分部深度卡：Services / Cloud / Other Bets
// ============================================================
export const segmentDeepDive = [
  {
    key: 'services',
    name: 'Google Services',
    color: '#fbbf24',
    q1Rev: 89637,
    q1RevDisplay: '$89.6B',
    yoy: '+16%',
    opIncOrLoss: 40589,
    opIncDisplay: '+$40.6B',
    opMargin: 45.3,
    narrative:
      'Search & other +19% 是结构性反驳"AI 颠覆 Search"的核心证据。利润率创纪录 45.3%，强劲搜索增长与成本纪律共振。YouTube 合并营收（广告 + 订阅）FY25 全年突破 $60B。',
    kpis: [
      { label: 'Search & other YoY', value: '+19%', tone: 'positive' },
      { label: 'YouTube ads YoY', value: '+11%', tone: 'positive' },
      { label: 'Network YoY', value: '−4%', tone: 'negative' },
      { label: 'TAC ratio', value: '19.7%', tone: 'positive' },
      { label: '订阅业务', value: '350M', tone: 'positive' },
    ],
  },
  {
    key: 'cloud',
    name: 'Google Cloud',
    color: '#22d3ee',
    q1Rev: 20028,
    q1RevDisplay: '$20.0B',
    yoy: '+63%',
    opIncOrLoss: 6598,
    opIncDisplay: '+$6.6B',
    opMargin: 32.9,
    narrative:
      'RPO Q1 26 单季增量 $228B，年化运行率 $80B。Cloud 利润率从 Q1 25 17.8% 跃迁到 32.9%（+15.1pp），验证规模经济与运营杠杆。CFO/CEO 双双确认产能仍受限。',
    kpis: [
      { label: 'Cloud RPO', value: '$467.6B', tone: 'positive' },
      { label: 'RPO QoQ', value: '+95%', tone: 'positive' },
      { label: 'AI Solutions YoY', value: '+800%', tone: 'positive' },
      { label: '年化运行率', value: '$80B', tone: 'positive' },
      { label: '利润率扩张', value: '+15.1pp YoY', tone: 'positive' },
    ],
  },
  {
    key: 'otherBets',
    name: 'Other Bets',
    color: '#a78bfa',
    q1Rev: 411,
    q1RevDisplay: '$411M',
    yoy: '−9%',
    opIncOrLoss: -2100,
    opIncDisplay: '−$2.1B',
    opMargin: null,
    narrative:
      'Waymo 是核心：Q1 26 每周完全无人驾驶订单 >500K（vs 2024 年中 ~150K，~3.3x 增长），新增 6 个城市。2026 年 2 月获 Alphabet 主导 $16B 投资轮。Q4 25 含 $2.1B Waymo 员工股权重估补偿。',
    kpis: [
      { label: 'Waymo 周订单', value: '>500K', tone: 'positive' },
      { label: '新增城市 Q1', value: '6', tone: 'positive' },
      { label: 'Waymo 投资轮', value: '$16B', tone: 'neutral' },
    ],
  },
];

// ============================================================
// 2. CapEx 指引演变（叙事拐点关键证据）
// 从 $75B 到 $180-190B，5 个季度内 ~2.5x
// ============================================================
export const capexGuidanceTimeline = [
  {
    id: 'g0',
    date: '2025-02',
    label: 'Q4 2024 财报',
    value: '$75B',
    valueLow: 75,
    valueHigh: 75,
    delta: 'Initial',
    deltaTone: 'neutral',
  },
  {
    id: 'g1',
    date: '2025-07',
    label: 'Q2 2025 财报',
    value: '$85B',
    valueLow: 85,
    valueHigh: 85,
    delta: '+$10B',
    deltaTone: 'warning',
  },
  {
    id: 'g2',
    date: '2025-10',
    label: 'Q3 2025 财报',
    value: '$91-93B',
    valueLow: 91,
    valueHigh: 93,
    delta: '+$7B',
    deltaTone: 'warning',
  },
  {
    id: 'g3',
    date: '2026-02',
    label: 'Q4 2025 财报',
    value: '$175-185B',
    valueLow: 175,
    valueHigh: 185,
    delta: '~2x',
    deltaTone: 'risk',
  },
  {
    id: 'g4',
    date: '2026-04',
    label: 'Q1 2026 财报',
    value: '$180-190B',
    valueLow: 180,
    valueHigh: 190,
    delta: '+$5B + 2027 显著增加',
    deltaTone: 'risk',
  },
];

// ============================================================
// 3. CapEx 构成（管理层口径）
// ============================================================
export const capexComposition = {
  asOf: 'Q4 2025 电话会管理层口径',
  items: [
    { label: '服务器 (TPU/GPU/CPU)', pct: 60, color: '#22d3ee' },
    { label: '数据中心 + 网络', pct: 40, color: '#a78bfa' },
  ],
};

// ============================================================
// 4. CapEx 算力约束关键引述（Pichai Q1 26 电话会）
// ============================================================
export const capexConstraintQuote = {
  speaker: 'Sundar Pichai (CEO)',
  occasion: 'Q1 2026 电话会',
  quote:
    'We are compute constrained in the near term. Our cloud revenue would have been higher if we were able to meet the demand.',
  zh: '我们在近期受算力约束。如果能够满足需求，云业务收入本会更高。',
  context:
    '这是 Capex 周期最重要的需求验证信号 — 当前不是过度投资，而是被需求拖着走。是否过度投资的关键观察窗口。',
};

// ============================================================
// 5. 资本配置叙事（Q1 2026 重大转向）
// ============================================================
export const capitalAllocationCommentary = {
  headline: 'Q1 2026 资本配置重大转向',
  bullets: [
    'Q1 2026 回购为零，是 2024 年开始系统性回购以来首次完全暂停',
    '净回购 = 回购 − SBC = $0 − $6.75B = −$6.75B（首次转负）',
    '股本数从 12,228M 升至 12,238M（+10M），SBC 稀释开始压过回购',
    '分红连续上调到 $0.22/季度（+5%），但年化收益率仅 0.23%',
    'Wiz 收购 $32B 现金对价 + Q1 2026 新发 $31.1B 长期债务，把 capex 周期成本部分转移到资产负债表',
  ],
};

// ============================================================
// 6. Wiz 收购详情（2026-03-11 完成）
// ============================================================
export const wizAcquisition = {
  closingDate: '2026-03-11',
  cashConsideration: '$32B',
  segment: '并入 Google Cloud',
  goodwillIncrement: 24.4, // $B
  intangiblesIncrement: 8.1, // $B
  cashFlowImpact:
    '−$33.6B（Q1 2026 现金流量表 Acquisitions, net of cash acquired）',
  notes:
    'Goodwill Q4 2025 末 $33.4B → Q1 2026 末 $57.8B；Intangibles $1.3B → $9.4B（主要为 Wiz 客户关系/技术资产）。',
};

// ============================================================
// 7. 资产负债表关键演进（5 个季度）
// ============================================================
export const balanceSheet = {
  headers: [
    '项目 ($M)',
    '2024-12-31',
    '2025-06-30',
    '2025-09-30',
    '2025-12-31',
    '2026-03-31',
  ],
  rows: [
    ['现金及等价物 (Cash & equivalents)', 23466, 21036, 23090, 30708, 38063],
    [
      '短期可交易证券 (Marketable securities)',
      72191,
      74112,
      75406,
      96135,
      88777,
    ],
    ['现金 + 可交易证券小计', 95657, 95148, 98496, 126843, 126840],
    [
      '非流动股权证券 (Non-marketable securities)',
      37982,
      52574,
      63800,
      68687,
      106946,
    ],
    ['PP&E 净值', 171036, 203231, 223787, 246597, 281020],
    ['Goodwill', 31885, 32335, 33269, 33380, 57774],
    ['Intangibles, net', null, null, null, 1283, 9444],
    ['Total assets', 450256, 502053, 536469, 595281, 703919],
    ['Long-term debt', 10883, 23607, 21607, 46547, 77501],
    ["Total stockholders' equity", 325084, 362916, 386867, 415265, 478746],
  ],
  netCashHistory: [
    {
      time: '2024-12-31',
      cashAndMs: 95657,
      ltDebt: 10883,
      netCash: 84774,
    },
    {
      time: '2025-12-31',
      cashAndMs: 126843,
      ltDebt: 46547,
      netCash: 80296,
    },
    {
      time: '2026-03-31',
      cashAndMs: 126840,
      ltDebt: 77501,
      netCash: 49339,
    },
  ],
  insights: [
    '净现金从 2024 年底 $85B 收缩到 2026 Q1 末 $49B，单季减少 $31B（capex + Wiz）',
    'Q1 2026 发行 $31.1B 新增高级无担保票据，长期债务从 $46.5B 推到 $77.5B（YoY 7 倍）',
    'Alphabet 已开始系统性使用债务融资覆盖 AI capex 周期',
    '非流动性股权证券 $107B（Q1 2026 末）含 Anthropic、SpaceX、CoreWeave 等私募 stake — SOTP 估值的"隐形资产"',
    'PP&E TTM +50.8%，季度增量与 capex − D&A 大致匹配，验证财务报表内部一致性',
  ],
};

// ============================================================
// 8. 运营 KPI：订阅 / YouTube / Cloud RPO / Waymo
// ============================================================
export const operatingKpis = {
  subscriptions: {
    title: '订阅业务规模（含 YouTube Premium / Google One / Gemini App）',
    rows: [
      { time: 'Q3 2025', value: '>300M' },
      { time: 'Q4 2025', value: '>325M' },
      { time: 'Q1 2026', value: '350M', highlight: true },
    ],
    note: 'Pichai 表示 Q1 2026 是消费 AI 订阅（Gemini App）增长最强的季度，但未单独披露 Gemini 付费用户数。',
  },
  youtubeFy25: {
    title: 'YouTube 全年总收入（广告 + 订阅）',
    value: '>$60B',
    period: 'FY2025 全年',
    source: 'Pichai 在 Q4 2025 财报披露',
  },
  cloudRpo: {
    title: 'Cloud Revenue Backlog (RPO) — 模板第一前瞻指标',
    headers: ['时点', 'RPO ($B)', '环比/同比', '备注'],
    rows: [
      ['2025-03-31', 92.4, '—', '首次披露，Q1 2025 10-Q'],
      ['2025-06-30', 108.2, '+17% QoQ', 'Q2 2025 10-Q'],
      ['2025-09-30', 155.0, '+43% QoQ', '管理层电话会披露'],
      ['2025-12-31', 240.0, '+55% QoQ', '管理层 Q4 电话会'],
      ['2026-03-31', 467.6, '+95% QoQ · 5x YoY', 'Q1 2026 10-Q'],
    ],
    insights: [
      'Q1 2026 单季 RPO 增量 $228B 是 Q1 2026 营收 $20B 的 11 倍以上，锁定多年产能',
      '管理层口径：约 50%+ RPO 将在未来 24 个月内确认收入',
      'TPU 硬件协议（被纳入 RPO）小部分 2026 年内确认收入，大部分在 2027 — 给 2027 Cloud 收入强可见度',
      'RPO 倍数（RPO / 当前年化 Cloud Rev）= 467.6 ÷ 80.1 ≈ 5.8x，远超 AWS/Azure 同类指标 3-4x',
    ],
  },
  waymo: {
    title: 'Waymo（Other Bets 主要业务）',
    rows: [
      {
        time: '2024 年中（参考）',
        value: '~150,000',
        metric: '每周完全无人驾驶订单数',
      },
      {
        time: 'Q1 2026',
        value: '超过 500,000',
        metric: '每周完全无人驾驶订单数',
        highlight: true,
      },
    ],
    note: 'Waymo Q1 2026 进入新增 6 个城市；2026 年 2 月获 Alphabet 主导 $16B 投资轮。',
  },
};

// ============================================================
// 9. AI 关键运营指标（token / Gemini / Cloud AI）
// ============================================================
export const aiMetrics = {
  tokenRate: {
    title: 'AI 模型 token 处理量（API 调用规模）',
    headers: ['时点', 'Token/分钟', 'QoQ'],
    rows: [
      ['Q3 2025', '7B', '—'],
      ['Q4 2025', '10B', '+43%'],
      ['Q1 2026', '>16B', '+60%'],
    ],
  },
  geminiApp: {
    title: 'Gemini App MAU',
    rows: [
      { time: 'Q3 2025', value: '>650M' },
      { time: 'Q4 2025', value: '>750M' },
      {
        time: 'Q1 2026',
        value: '未单独披露',
        note: '管理层口径"消费 AI 订阅最强季度"',
      },
    ],
  },
  geminiEnterprise: {
    title: 'Gemini Enterprise（B 端付费 MAU）',
    value: 'Q1 2026 环比 +40%',
    note: '管理层数字，绝对值未披露',
  },
  cloudAi: {
    title: 'Cloud AI 收入贡献（管理层定性表述）',
    items: [
      { period: 'Q4 2025', metric: 'GenAI 产品季度同比 +400%' },
      { period: 'Q1 2026', metric: 'Cloud AI Solutions 同比 +800%' },
    ],
  },
};

// ============================================================
// 10. Cloud Run-Rate 演进（季度营收 × 4）
// ============================================================
export const cloudRunRate = {
  title: 'Cloud Run-Rate 演进（季度营收 × 4）',
  headers: ['时点', '年化收入'],
  rows: [
    ['Q1 2025', '$49B'],
    ['Q2 2025', '$54B'],
    ['Q3 2025', '$61B'],
    ['Q4 2025', '$71B（管理层口径"年化超过 $70B"）'],
    ['Q1 2026', '$80B'],
  ],
  insight: '年化运行率从 Q1 25 到 Q1 26 增长 +63%，与 RPO 跃迁趋势一致。',
};
