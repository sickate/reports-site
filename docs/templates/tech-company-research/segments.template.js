// <COMPANY_NAME> 分部、Capex、资本配置、KPI 数据
// 数据口径：<FISCAL_QUARTER> 10-Q / 上一财年 10-K / 历次电话会管理层口径

// ============================================================
// 1. 分部深度卡：主业 / 云 / 战略孵化
// ============================================================
// 公司差异化：默认按 Services / Cloud / Other Bets 三分部, 可按公司披露口径调整
// 每个分部一个对象, 前端按 segmentDeepDive.length 渲染对应数量的卡片
export const segmentDeepDive = [
  {
    key: 'services', // 分部 ID, 前端 React key
    name: '待补：主业分部名称（如 Google Services / Family of Apps）',
    color: '#fbbf24', // 分部主题色（hex）
    q1Rev: null, // 最新季度营收 ($M)
    q1RevDisplay: '待补', // 友好展示（如 "$89.6B"）
    yoy: '待补', // YoY 字符串
    opIncOrLoss: null, // 经营利润或亏损 ($M)
    opIncDisplay: '待补', // 友好展示
    opMargin: null, // 经营利润率 (%)
    narrative: '待补：分部叙事（核心增长驱动 / 利润率走势 / 关键 KPI 总结）。建议 80-150 字。',
    kpis: [
      // 5 个最重要的运营 KPI
      // tone: 'positive' / 'negative' / 'neutral'
      { label: '待补 KPI 1', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 2', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 3', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 4', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 5', value: '待补', tone: 'neutral' },
    ],
  },
  {
    key: 'cloud',
    name: '待补：云分部名称（如 Google Cloud / Azure / AWS）',
    color: '#22d3ee',
    q1Rev: null,
    q1RevDisplay: '待补',
    yoy: '待补',
    opIncOrLoss: null,
    opIncDisplay: '待补',
    opMargin: null,
    narrative: '待补：云分部叙事（RPO / 利润率扩张 / 算力约束 / 大单数等）',
    kpis: [
      { label: '待补 KPI 1', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 2', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 3', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 4', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 5', value: '待补', tone: 'neutral' },
    ],
  },
  {
    key: 'otherBets', // 可选 — 仅适用于有战略孵化业务的公司
    name: '待补：战略孵化分部名称（如 Other Bets / Reality Labs）',
    color: '#a78bfa',
    q1Rev: null,
    q1RevDisplay: '待补',
    yoy: '待补',
    opIncOrLoss: null, // 通常为亏损, 填负数
    opIncDisplay: '待补',
    opMargin: null, // 早期亏损分部可填 null
    narrative: '待补：战略孵化分部叙事（核心资产 / cash burn / 战略意义）',
    kpis: [
      { label: '待补 KPI 1', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 2', value: '待补', tone: 'neutral' },
      { label: '待补 KPI 3', value: '待补', tone: 'neutral' },
    ],
  },
];

// ============================================================
// 2. CapEx 指引演变（叙事拐点关键证据）
// ============================================================
// 跟踪管理层 capex 指引的逐季变化, 5 个时点
// deltaTone: 'neutral' / 'warning' / 'risk' / 'safe'
export const capexGuidanceTimeline = [
  {
    id: 'g0',
    date: '待补 YYYY-MM', // 指引发布的月份
    label: '待补：财报标签（如 "Q4 2024 财报"）',
    value: '待补：指引值（如 "$75B" 或 "$175-185B"）',
    valueLow: null, // 区间下限（用于绘图）
    valueHigh: null, // 区间上限
    delta: 'Initial', // 相比上次指引的变化（如 "+$10B" / "~2x" / "Initial"）
    deltaTone: 'neutral',
  },
  {
    id: 'g1',
    date: '待补 YYYY-MM',
    label: '待补',
    value: '待补',
    valueLow: null,
    valueHigh: null,
    delta: '待补',
    deltaTone: 'warning',
  },
  {
    id: 'g2',
    date: '待补 YYYY-MM',
    label: '待补',
    value: '待补',
    valueLow: null,
    valueHigh: null,
    delta: '待补',
    deltaTone: 'warning',
  },
  {
    id: 'g3',
    date: '待补 YYYY-MM',
    label: '待补',
    value: '待补',
    valueLow: null,
    valueHigh: null,
    delta: '待补',
    deltaTone: 'risk',
  },
  {
    id: 'g4',
    date: '待补 YYYY-MM',
    label: '待补',
    value: '待补',
    valueLow: null,
    valueHigh: null,
    delta: '待补',
    deltaTone: 'risk',
  },
];

// ============================================================
// 3. CapEx 构成（管理层口径）
// ============================================================
// 占比加总应 ≈ 100%
export const capexComposition = {
  asOf: '待补：管理层披露的口径与时点（如 "Q4 2025 电话会管理层口径"）',
  items: [
    { label: '服务器 (TPU/GPU/CPU)', pct: null, color: '#22d3ee' },
    { label: '数据中心 + 网络', pct: null, color: '#a78bfa' },
  ],
};

// ============================================================
// 4. CapEx 算力约束关键引述（管理层电话会）
// ============================================================
// 用于强化"capex 是被需求拖着走"的论点
export const capexConstraintQuote = {
  speaker: '待补：发言人姓名 (CEO/CFO)',
  occasion: '待补：发言场合（如 "Q1 2026 电话会"）',
  quote: '待补：英文原文引述',
  zh: '待补：中文翻译',
  context: '待补：投研解读（这段话为什么重要）',
};

// ============================================================
// 5. 资本配置叙事（重大转向）
// ============================================================
// 用于汇总当季资本配置的核心变化
export const capitalAllocationCommentary = {
  headline: '待补：资本配置当季叙事标题',
  bullets: [
    '待补：要点 1（如 "回购为零, 是 X 年来首次完全暂停"）',
    '待补：要点 2（如 "净回购首次转负"）',
    '待补：要点 3（如 "股本数 +X M, SBC 稀释开始压过回购"）',
    '待补：要点 4（如分红变化）',
    '待补：要点 5（如重大并购或债务发行）',
  ],
};

// ============================================================
// 6. 重大并购详情（可选 — 仅适用于本季有并购完成的公司）
// ============================================================
// 命名为 majorAcquisition (而非 wizAcquisition) 以保持模板通用
// 若本季无重大并购, 整个 export 可省略, 或全部填 null
export const majorAcquisition = {
  closingDate: '待补 YYYY-MM-DD',
  cashConsideration: '待补（如 "$32B"）',
  segment: '待补：并入哪个分部',
  goodwillIncrement: null, // $B
  intangiblesIncrement: null, // $B
  cashFlowImpact: '待补：现金流影响（如 "−$33.6B"）',
  notes: '待补：商誉 / 无形资产变动说明',
};

// ============================================================
// 7. 资产负债表关键演进（5 个季度末时点）
// ============================================================
// 时点列：5 个季度末（Q-4 末 → Q0 末）
// 注意 netCashHistory 仅用 3 个时点对照（节省横向空间）
export const balanceSheet = {
  headers: [
    '项目 ($M)',
    '待补 YYYY-MM-DD', // Q-4 末
    '待补 YYYY-MM-DD', // Q-3 末
    '待补 YYYY-MM-DD', // Q-2 末
    '待补 YYYY-MM-DD', // Q-1 末
    '待补 YYYY-MM-DD', // Q0 末
  ],
  rows: [
    ['现金及等价物 (Cash & equivalents)', null, null, null, null, null],
    ['短期可交易证券 (Marketable securities)', null, null, null, null, null],
    ['现金 + 可交易证券小计', null, null, null, null, null],
    ['非流动股权证券 (Non-marketable securities)', null, null, null, null, null],
    ['PP&E 净值', null, null, null, null, null],
    ['Goodwill', null, null, null, null, null],
    ['Intangibles, net', null, null, null, null, null],
    ['Total assets', null, null, null, null, null],
    ['Long-term debt', null, null, null, null, null],
    ["Total stockholders' equity", null, null, null, null, null],
  ],
  netCashHistory: [
    {
      time: '待补 YYYY-MM-DD',
      cashAndMs: null, // 现金 + 可交易证券
      ltDebt: null, // 长期债务
      netCash: null, // = cashAndMs − ltDebt
    },
    {
      time: '待补 YYYY-MM-DD',
      cashAndMs: null,
      ltDebt: null,
      netCash: null,
    },
    {
      time: '待补 YYYY-MM-DD',
      cashAndMs: null,
      ltDebt: null,
      netCash: null,
    },
  ],
  insights: [
    '待补：净现金变化的核心叙事',
    '待补：长期债务发行的判断',
    '待补：是否开始系统性使用债务融资覆盖 capex',
    '待补：非流动股权证券的"隐形资产"判断',
    '待补：PP&E 增量与 capex − D&A 一致性验证',
  ],
};

// ============================================================
// 8. 运营 KPI：订阅 / YouTube / Cloud RPO / 战略孵化业务
// ============================================================
// 公司差异化提示：
//   - Alphabet: subscriptions / youtubeFy25 / cloudRpo / waymo
//   - Meta:     dau / arpu / reels / orion
//   - MSFT:     m365CommercialSeats / azureRpo / dynamicsAI
//   - NVDA:     datacenterMix / blackwellShipments / autoMSU
export const operatingKpis = {
  subscriptions: {
    title: '待补：订阅业务规模标题',
    rows: [
      { time: '待补', value: '待补' },
      { time: '待补', value: '待补' },
      { time: '待补', value: '待补', highlight: true }, // 最新季度高亮
    ],
    note: '待补：订阅业务的投研判断',
  },
  youtubeFy25: {
    // 可选 — 仅适用于 Alphabet
    title: '待补：内容平台全年总收入标题',
    value: '待补',
    period: '待补',
    source: '待补：管理层披露场合',
  },
  cloudRpo: {
    // 可选 — 仅适用于有云业务的公司（Alphabet/MSFT/AMZN）
    title: 'Cloud Revenue Backlog (RPO) — 模板第一前瞻指标',
    headers: ['时点', 'RPO ($B)', '环比/同比', '备注'],
    rows: [
      ['待补 YYYY-MM-DD', null, '—', '待补'],
      ['待补 YYYY-MM-DD', null, '待补', '待补'],
      ['待补 YYYY-MM-DD', null, '待补', '待补'],
      ['待补 YYYY-MM-DD', null, '待补', '待补'],
      ['待补 YYYY-MM-DD', null, '待补', '待补'],
    ],
    insights: [
      '待补：单季 RPO 增量 vs 当季营收的倍数判断',
      '待补：RPO 确认收入的时间分布（管理层口径）',
      '待补：硬件协议 / 多年合同的可见度',
      '待补：RPO 倍数（RPO ÷ 年化云收入）vs 同业对比',
    ],
  },
  waymo: {
    // 可选 — 仅适用于 Alphabet, 其他公司可重命名为对应战略孵化业务
    title: '待补：战略孵化业务标题',
    rows: [
      {
        time: '待补：参考时点',
        value: '待补',
        metric: '待补：核心 metric',
      },
      {
        time: '待补：当季时点',
        value: '待补',
        metric: '待补：核心 metric',
        highlight: true,
      },
    ],
    note: '待补：战略孵化业务的投研判断',
  },
};

// ============================================================
// 9. AI 关键运营指标（token / 模型 MAU / Cloud AI 收入）
// ============================================================
// AI 时代的"领先指标", 不是所有公司都披露完整, 按可获得数据填充
export const aiMetrics = {
  tokenRate: {
    // AI 模型 token 处理量, 反映 API 调用规模
    title: '待补：AI 模型 token 处理量标题',
    headers: ['时点', 'Token/分钟', 'QoQ'],
    rows: [
      ['待补', '待补', '—'],
      ['待补', '待补', '待补'],
      ['待补', '待补', '待补'],
    ],
  },
  geminiApp: {
    // 公司差异化：替换为对应模型 App MAU（如 ChatGPT MAU / Copilot MAU）
    title: '待补：消费 AI App MAU 标题',
    rows: [
      { time: '待补', value: '待补' },
      { time: '待补', value: '待补' },
      {
        time: '待补',
        value: '待补',
        note: '待补',
      },
    ],
  },
  geminiEnterprise: {
    // 公司差异化：替换为对应 B 端模型付费指标
    title: '待补：企业级 AI 付费 MAU 标题',
    value: '待补',
    note: '待补：管理层口径说明',
  },
  cloudAi: {
    // Cloud AI 收入贡献的管理层定性表述
    title: 'Cloud AI 收入贡献（管理层定性表述）',
    items: [
      { period: '待补', metric: '待补：管理层引述（如 "GenAI +400%"）' },
      { period: '待补', metric: '待补' },
    ],
  },
};

// ============================================================
// 10. Cloud Run-Rate 演进（季度营收 × 4）
// ============================================================
// 公司差异化：仅适用有云业务的公司
// 用于直观展示"年化运行率"的扩张速度
export const cloudRunRate = {
  title: 'Cloud Run-Rate 演进（季度营收 × 4）',
  headers: ['时点', '年化收入'],
  rows: [
    ['待补：Q-4 时点', '待补'],
    ['待补：Q-3 时点', '待补'],
    ['待补：Q-2 时点', '待补'],
    ['待补：Q-1 时点', '待补'],
    ['待补：Q0 时点', '待补'],
  ],
  insight: '待补：年化运行率从 Q-4 到 Q0 的增速判断, 与 RPO 趋势的一致性',
};
