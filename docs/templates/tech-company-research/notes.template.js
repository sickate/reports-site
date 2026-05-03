// <COMPANY_NAME> (<TICKER>) <FISCAL_QUARTER> 研究笔记
// 包含：电话会引用、风险事件、跟踪清单、数据完整性自检、来源、免责声明
// 数据基于 SEC EDGAR 8-K / 10-Q 原文披露和 <COMPANY_NAME> IR 官方公告

// ---------------------------------------------------------------------------
// 1. 电话会关键引用（<FISCAL_QUARTER> Earnings Call）
// ---------------------------------------------------------------------------
// 至少 8-10 条关键引用, 覆盖以下主题：
//   - 算力 / 产能约束
//   - 主业增长 (Search / FamilyOfApps / Productivity)
//   - CapEx 前瞻
//   - Cloud Backlog / RPO
//   - 订阅 / 付费用户
//   - Token throughput / API 调用规模
//   - 战略孵化业务进展
//   - 资本配置（回购暂停 / 大额并购）
//   - Cloud AI 收入加速
// topicTone: 'positive' / 'negative' / 'warning' / 'neutral'
export const earningsCallNotes = [
  {
    id: 'ec1',
    speaker: '待补：发言人姓名',
    role: '待补：CEO / CFO',
    topic: '待补：主题（如 "Cloud 产能约束"）',
    topicTone: 'positive',
    quote: '待补：英文原文引述',
    zh: '待补：中文翻译',
    context: '待补：投研解读（这段话的市场含义）',
  },
  {
    id: 'ec2',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'positive',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
  {
    id: 'ec3',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'warning',
    quote: '待补',
    zh: '待补',
    context: '待补：用 ★ 标记最重要的引用', // 最关键引用建议加 ★
  },
  {
    id: 'ec4',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'warning',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
  {
    id: 'ec5',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'positive',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
  {
    id: 'ec6',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'positive',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
  {
    id: 'ec7',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'positive',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
  {
    id: 'ec8',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'positive',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
  {
    id: 'ec9',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'warning',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
  {
    id: 'ec10',
    speaker: '待补',
    role: '待补',
    topic: '待补',
    topicTone: 'positive',
    quote: '待补',
    zh: '待补',
    context: '待补',
  },
];

// ---------------------------------------------------------------------------
// 2. 风险事件 — 已落地 vs 持续追踪
// ---------------------------------------------------------------------------
// 已落地：本季内已确认财务影响的一次性事件
// 持续追踪：仍有不确定性的监管 / 竞争 / 技术风险
// tone: 'risk' (高风险) / 'fair' (中性偏关注)
export const riskEvents = {
  landed: {
    title: '已落地的监管 / 法律 / 一次性事件',
    headers: ['事件', '时点', '财务影响'],
    rows: [
      ['待补：事件 1（如 "欧盟反垄断罚款"）', '待补 YYYY-MM', '待补：财务影响金额与会计科目'],
      ['待补：事件 2', '待补', '待补'],
      ['待补：事件 3（如 "税法变更"）', '待补', '待补'],
      ['待补：事件 4（如 "重大并购完成"）', '待补', '待补'],
      ['待补：事件 5（如 "长期债务发行"）', '待补', '待补'],
    ],
  },
  ongoing: {
    title: '持续追踪的监管 / 竞争风险',
    rows: [
      {
        title: '待补：风险 1（如 "DOJ 反垄断救济"）',
        body: '待补：风险描述, 包含已知进展与潜在影响。建议 100-200 字。',
        tone: 'risk',
      },
      {
        title: '待补：风险 2（如 "EU DMA 合规成本"）',
        body: '待补',
        tone: 'fair',
      },
      {
        title: '待补：风险 3（如 "AI 替代风险"）',
        body: '待补',
        tone: 'fair',
      },
      {
        title: '待补：风险 4（如 "私募持股估值波动"）',
        body: '待补',
        tone: 'fair',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 3. 公司专属跟踪清单（10 项）
// ---------------------------------------------------------------------------
// 命名为 companyWatchlist （而非 alphabetWatchlist）以保持模板通用
// 每家公司独有的 10 个跟踪变量, 区别于其他 MAG7
// 公司差异化提示：
//   - Alphabet: TAC 比率 / 服务器折旧年限 / YouTube vs Meta / DOJ 案件 / Waymo / TPU 外销
//   - Meta:     ARPU / DAU / Reels 货币化 / Reality Labs cash burn / EU DMA
//   - MSFT:     Azure AI / Copilot adoption / OpenAI 关系 / Activision 整合
//   - NVDA:     Blackwell 出货 / 中国管制 / 大客户集中度 / AI capex 周期顶部
export const companyWatchlist = [
  {
    n: 1,
    item: '待补：跟踪项 1（如 "TAC 比率走势"）',
    why: '待补：为何重要（如 "议价权代理变量 — 当前 X%"）',
  },
  {
    n: 2,
    item: '待补：跟踪项 2',
    why: '待补',
  },
  {
    n: 3,
    item: '待补：跟踪项 3',
    why: '待补',
  },
  {
    n: 4,
    item: '待补：跟踪项 4',
    why: '待补',
  },
  {
    n: 5,
    item: '待补：跟踪项 5',
    why: '待补',
  },
  {
    n: 6,
    item: '待补：跟踪项 6',
    why: '待补',
  },
  {
    n: 7,
    item: '待补：跟踪项 7',
    why: '待补',
  },
  {
    n: 8,
    item: '待补：跟踪项 8',
    why: '待补',
  },
  {
    n: 9,
    item: '待补：跟踪项 9',
    why: '待补',
  },
  {
    n: 10,
    item: '待补：跟踪项 10',
    why: '待补',
  },
];

// ---------------------------------------------------------------------------
// 4. 数据完整性自检（Sanity Checks）
// ---------------------------------------------------------------------------
// 7 项必做的数据交叉验证, 每项包含：
//   - check: 验证项名称
//   - expected: 计算公式与预期值
//   - actual: 实际从财报披露的值
//   - pass: true (通过) / false (不通过) / 'warning' (通过但需关注)
//   - comment: 投研判断（pass=warning 时务必标 ★）
export const sanityChecks = [
  {
    n: 1,
    check: '<FISCAL_QUARTER> 总营收 YoY',
    expected: '待补：计算公式（如 "109,896 / 90,234 − 1 = +21.8%"）',
    actual: '待补：管理层口径（如 "管理层口径 +22%"）',
    pass: true,
    comment: '待补：一致 / 不一致, 差异来源',
  },
  {
    n: 2,
    check: '<FISCAL_QUARTER> Operating Margin',
    expected: '待补：计算公式（如 "39,696 / 109,896 = 36.1%"）',
    actual: '待补',
    pass: true,
    comment: '待补',
  },
  {
    n: 3,
    check: 'Cloud / 主业利润率扩张验证',
    expected: '待补：YoY 利润率扩张计算',
    actual: '待补',
    pass: true,
    comment: '待补：是否为结构性 thesis 的核心证据',
  },
  {
    n: 4,
    check: 'FCF 计算一致性',
    expected: '待补：FCF = OCF − CapEx 计算',
    actual: '待补',
    pass: true,
    comment: '待补',
  },
  {
    n: 5,
    check: '现金 + 短期可交易证券',
    expected: '待补：现金 + MS 加总验证',
    actual: '待补',
    pass: true,
    comment: '待补',
  },
  {
    n: 6,
    check: '股本变化（Diluted Shares）',
    expected: '待补：上季 → 当季股本变化（百万股）',
    actual: '待补',
    pass: 'warning',
    comment: '待补：★ 净增加是因为没有回购 / SBC 持续稀释 — 需持续追踪',
  },
  {
    n: 7,
    check: 'CapEx 季度年化运行率 vs 全年指引',
    expected: '待补：当季 CapEx × 4 与全年指引中位数对比',
    actual: '待补：剩余季度需要的平均 CapEx',
    pass: 'warning',
    comment: '待补：★ 隐含 Q4 单季 capex 将创纪录 / 需要持续追踪',
  },
];

// ---------------------------------------------------------------------------
// 5. 数据来源（按可信度分级）
// ---------------------------------------------------------------------------
// 按 confidence 分级：
//   - high: SEC EDGAR 一手原文 / IR 官方
//   - medium: 二手汇总（CNBC / Yahoo / Morningstar / Macrotrends）
//   - low: 第三方监测（Similarweb / SemRush 等, 需交叉验证）
// 推荐至少包含：
//   - 5 份 SEC EDGAR 8-K / 10-Q（覆盖 5 个季度）
//   - 1 份 IR 投资者关系页面
//   - 2 份电话会 transcript / 官方博客
//   - 5 份估值 / 股价 / 分析师数据
export const dataSources = [
  // 一手来源（SEC EDGAR）
  {
    id: 's1',
    category: 'SEC EDGAR',
    label: '<FISCAL_QUARTER> 8-K Earnings Release',
    url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=待补&type=8-K',
    confidence: 'high',
  },
  {
    id: 's2',
    category: 'SEC EDGAR',
    label: '上一财年 10-K',
    url: '待补 SEC EDGAR URL',
    confidence: 'high',
  },
  {
    id: 's3',
    category: 'SEC EDGAR',
    label: 'Q-2 8-K',
    url: '待补 SEC EDGAR URL',
    confidence: 'high',
  },
  {
    id: 's4',
    category: 'SEC EDGAR',
    label: 'Q-3 8-K',
    url: '待补 SEC EDGAR URL',
    confidence: 'high',
  },
  {
    id: 's5',
    category: 'SEC EDGAR',
    label: 'Q-4 10-Q',
    url: '待补 SEC EDGAR URL',
    confidence: 'high',
  },
  {
    id: 's6',
    category: 'SEC EDGAR',
    label: 'Q-3 10-Q',
    url: '待补 SEC EDGAR URL',
    confidence: 'high',
  },
  {
    id: 's7',
    category: '<COMPANY_NAME> IR',
    label: '<COMPANY_NAME> 投资者关系页面',
    url: '待补 IR URL',
    confidence: 'high',
  },
  // 二手 / 电话会
  {
    id: 's8',
    category: '<COMPANY_NAME> 官方博客',
    label: 'CEO 致辞 (<FISCAL_QUARTER>)',
    url: '待补 公司博客 URL',
    confidence: 'high',
  },
  {
    id: 's9',
    category: '<COMPANY_NAME> IR',
    label: '上一季度电话会回放',
    url: '待补 IR Events URL',
    confidence: 'high',
  },
  {
    id: 's10',
    category: 'Motley Fool',
    label: '<FISCAL_QUARTER> transcript',
    url: '待补 Motley Fool URL',
    confidence: 'medium',
  },
  // 行业 / 市场数据
  {
    id: 's11',
    category: 'CNBC',
    label: '<FISCAL_QUARTER> 报道',
    url: '待补 CNBC URL',
    confidence: 'medium',
  },
  {
    id: 's12',
    category: 'Yahoo Finance',
    label: '<TICKER> 估值数据',
    url: 'https://finance.yahoo.com/quote/<TICKER>/',
    confidence: 'medium',
  },
  {
    id: 's13',
    category: 'Morningstar',
    label: '分析师评级',
    url: '待补 Morningstar URL',
    confidence: 'medium',
  },
  {
    id: 's14',
    category: 'Macrotrends',
    label: '历史股价',
    url: 'https://www.macrotrends.net/stocks/charts/<TICKER>/<COMPANY_SLUG>/stock-price-history',
    confidence: 'medium',
  },
  {
    id: 's15',
    category: 'WallStreetZen',
    label: '市值/比率',
    url: '待补 WallStreetZen URL',
    confidence: 'medium',
  },
];

// ---------------------------------------------------------------------------
// 6. 免责声明
// ---------------------------------------------------------------------------
export const disclaimer = '本报告为投研模板演示用途, 所有财务数据基于 SEC EDGAR 8-K / 10-Q 原文披露, 运营 KPI 和 commentary 来自 <COMPANY_NAME> 官方电话会和 IR 公告, 估值数据来自第三方汇总（Yahoo / Morningstar / WallStreetZen 横向交叉验证）。本报告不构成投资建议, 仅作为科技公司跟踪模板（docs/2026-05-03_tech_company_research_template.md）的 <COMPANY_NAME> 实例化版本。模板设计哲学：时间序列 + 拐点识别 + 指引一致性。<FISCAL_QUARTER> 三个最关键叙事拐点都在数据中有明确证据支持, 但其市场含义仍存在合理争议。';
