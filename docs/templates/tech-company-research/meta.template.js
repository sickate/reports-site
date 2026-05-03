// {COMPANY_NAME} {FISCAL_QUARTER} 财报跟踪报告 - 元信息与顶部 KPI 数据
// 数据来源: SEC EDGAR 8-K (YYYY-MM-DD) + 管理层电话会 PR + YYYY-MM-DD 收盘价
// 模板版本: 11 模块科技公司投研模板 v1
// 使用说明: 将 {COMPANY_NAME} / {TICKER} / {FISCAL_QUARTER} 等占位符替换为实际公司信息;
//          数值字段填入数字, 文本字段填入字符串, 暂无数据用 null

// ---------------------------------------------------------------------------
// Export 1: 报告元信息（Header 区块）
// ---------------------------------------------------------------------------
// 涵盖标题、副标题、ticker、报告日期、价格快照、估值倍数等顶层信息
// 前端 Header 组件直接消费这一对象
export const reportMeta = {
  title: '<COMPANY_NAME> <FISCAL_QUARTER> 财报跟踪', // 报告主标题
  subtitle: '待补 · 待补 · 待补', // 副标题, 三个最关键叙事拐点的极简概括
  ticker: '<TICKER>', // 股票代码（如 GOOG / GOOGL, AAPL, MSFT）
  reportingDate: '待补', // 财报公告日期 YYYY-MM-DD
  fiscalQuarter: '<FISCAL_QUARTER>', // 财季标识（如 Q1 2026）
  asOfPrice: '待补', // 价格快照所参考的收盘日期 YYYY-MM-DD
  price: null, // 当前股价（美元）
  marketCap: null, // 市值, 单位 $B（十亿美元）
  marketCapLabel: '待补', // 市值的展示字符串（如 "$4.67T"）
  range52w: '待补', // 52 周价格区间字符串（如 "$147.84 – $386.76"）
  monthReturn: '待补', // 月度涨跌幅字符串（如 "+34%（4 月单月）"）
  yearReturn: '待补', // 1 年涨跌幅字符串（如 "+139%（1Y）"）
  pe: { gaap: null, core: null }, // GAAP 与剔除一次性影响的核心 P/E
  ps: null, // P/S 倍数
  fcfYield: null, // 自由现金流收益率（%）
  dividendYield: null, // 股息收益率（%）
  rating: '待补', // 投研口径评级（如 "叙事跃迁季 · 资本周期顶部观察"）
  confidence: '待补', // 数据置信度（如 "高（数据 100% 来自 SEC 8-K）"）
  timeframe: '12-24 月跟踪', // 跟踪时间窗口
  template: '11 模块科技公司投研模板 v1', // 模板版本
  updatedAt: '待补', // 报告更新日期 YYYY-MM-DD
  revisionNote: '待补', // 版本说明 / 修订记录
};

// ---------------------------------------------------------------------------
// Export 2: 三个最关键叙事拐点（Narrative Pivots）
// ---------------------------------------------------------------------------
// 投研报告的"差异化论点"区块, 仅保留 3 条最重要的叙事
// tone 取值: 'safe' (利好) / 'fair' (中性偏关注) / 'risk' (风险) / 'warning' (警示)
// icon 用 emoji 即可（如 🚀 / 🚧 / ⚠️）
export const narrativePivots = [
  {
    id: 'pivot1', // 叙事拐点 ID, 前端用于 React key
    tone: 'safe', // 情绪标签
    icon: '🚀', // emoji 图标
    headline: '待补：第一个核心叙事拐点的标题', // 一句话总结
    body: '待补：详细解读, 包含数据 + 管理层口径 + 投研判断。建议 80-150 字。', // 详细叙事
    metric: '待补', // 单个核心指标值（如 "$467.6B"）
    metricNote: '待补', // 指标的对照说明（如 "QoQ +95% · YoY 5x"）
  },
  {
    id: 'pivot2',
    tone: 'risk',
    icon: '🚧',
    headline: '待补：第二个核心叙事拐点的标题',
    body: '待补：详细解读',
    metric: '待补',
    metricNote: '待补',
  },
  {
    id: 'pivot3',
    tone: 'fair',
    icon: '⚠️',
    headline: '待补：第三个核心叙事拐点的标题',
    body: '待补：详细解读',
    metric: '待补',
    metricNote: '待补',
  },
];

// ---------------------------------------------------------------------------
// Export 3: 顶部 KPI 卡片（8 张）
// ---------------------------------------------------------------------------
// 每张卡片包含 5 季度 sparkline 数据, 季度顺序固定为最早到最新
// yoyTone 取值: 'positive' / 'negative' / 'warning' / 'neutral'
// 通用 KPI 范式（适用所有科技公司, 字段名可保持稳定）:
//   1) revenue        - 营业收入
//   2) opMargin       - 经营利润率
//   3) fcf            - 自由现金流
//   4) capex          - 资本开支
//   5) cloudRev       - 云业务收入（若公司无云业务, 替换为该公司核心业务线）
//   6) sbcPct         - SBC 占营收比
//   7) netBuyback     - 净回购
//   8) netCash        - 净现金（期末）
// 公司差异化提示:
//   - Meta: 替换 cloudRev → arpu / dau；netCash → familyOfAppsRev
//   - NVDA: 替换 cloudRev → datacenterRev；netCash → guidanceMidpoint
//   - MSFT: 替换 cloudRev → azureRev；保留其他
export const kpiCards = [
  {
    key: 'revenue',
    name: '营业收入',
    unit: '$M', // 单位（百万美元）
    latest: null, // 最新季度数值
    latestDisplay: '待补', // 友好展示字符串（如 "$109.9B"）
    yoy: '待补', // YoY 变化字符串（如 "+22%"）
    yoyTone: 'neutral', // 颜色提示
    history: [
      { q: 'Q-4', v: null }, // 5 季度 sparkline, 占位用 'Q-4' .. 'Q0', 实际填 'Q1 25' 等
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#fbbf24', // sparkline 颜色（hex）
    note: '待补：注释（如 "近 11 个连续双位数增长季度最高"）',
  },
  {
    key: 'opMargin',
    name: '经营利润率',
    unit: '%',
    latest: null,
    latestDisplay: '待补',
    yoy: '待补',
    yoyTone: 'neutral',
    history: [
      { q: 'Q-4', v: null },
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#34d399',
    note: '待补',
  },
  {
    key: 'fcf',
    name: '自由现金流',
    unit: '$M',
    latest: null,
    latestDisplay: '待补',
    yoy: '待补',
    yoyTone: 'neutral',
    history: [
      { q: 'Q-4', v: null },
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#f87171',
    note: '待补',
  },
  {
    key: 'capex',
    name: '资本开支',
    unit: '$M',
    latest: null,
    latestDisplay: '待补',
    yoy: '待补',
    yoyTone: 'neutral',
    history: [
      { q: 'Q-4', v: null },
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#fb923c',
    note: '待补',
  },
  {
    key: 'cloudRev', // 公司差异化字段：Cloud / Datacenter / FamilyOfApps 等
    name: '待补（如 Google Cloud 收入 / Azure 收入 / Datacenter 收入）',
    unit: '$M',
    latest: null,
    latestDisplay: '待补',
    yoy: '待补',
    yoyTone: 'neutral',
    history: [
      { q: 'Q-4', v: null },
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#22d3ee',
    note: '待补',
  },
  {
    key: 'sbcPct',
    name: 'SBC 占营收',
    unit: '%',
    latest: null,
    latestDisplay: '待补',
    yoy: '待补',
    yoyTone: 'neutral',
    history: [
      { q: 'Q-4', v: null },
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#a78bfa',
    note: '待补',
  },
  {
    key: 'netBuyback',
    name: '净回购',
    unit: '$M',
    latest: null,
    latestDisplay: '待补',
    yoy: '待补',
    yoyTone: 'neutral',
    history: [
      { q: 'Q-4', v: null },
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#f87171',
    note: '待补',
  },
  {
    key: 'netCash',
    name: '净现金（期末）',
    unit: '$M',
    latest: null,
    latestDisplay: '待补',
    yoy: '待补',
    yoyTone: 'neutral',
    // 净现金为期末时点数据, 无季度内连续值
    // history 用 5 个时点对照, 按季度位置对齐 sparkline
    history: [
      { q: 'Q-4', v: null },
      { q: 'Q-3', v: null },
      { q: 'Q-2', v: null },
      { q: 'Q-1', v: null },
      { q: 'Q0', v: null },
    ],
    sparkColor: '#94a3b8',
    note: '待补',
  },
];
