export const reportMeta = {
  title: 'NVIDIA 与全球存储利润池',
  subtitle: 'AI / HBM 驱动的存储超级周期：利润并非只来自 HBM，而是由全品类 ASP 与高固定成本杠杆共同放大。',
  asOf: '2026-07-15',
  scope: 'NVIDIA · Samsung Electronics · SK hynix · Micron',
};

export const dataLabels = [
  { key: 'A', label: 'Actual', description: '实际披露', tone: 'emerald' },
  { key: 'P', label: 'Preliminary', description: '初步业绩', tone: 'sky' },
  { key: 'G', label: 'Guidance', description: '公司指引', tone: 'violet' },
  { key: 'C', label: 'Consensus', description: '市场一致预期', tone: 'amber' },
  { key: 'E', label: 'External forecast', description: '具名外部机构预测', tone: 'orange' },
  { key: 'M', label: 'Internal model', description: '内部模型', tone: 'rose' },
  { key: 'S', label: 'Scenario', description: '情景假设', tone: 'slate' },
];

export const profitPool2026 = [
  { name: 'NVIDIA', low: 232, high: 255, status: 'A + G + M', confidence: '中', color: '#76b7ff' },
  { name: 'Samsung 集团', low: 203, high: 271, status: 'A + P + M', confidence: '中低', color: '#e9c46a' },
  { name: 'SK hynix', low: 136, high: 169, status: 'A + E', confidence: '中低', color: '#f28e8e' },
  { name: 'Micron', low: 115, high: 145, status: 'A + G + M', confidence: '低', color: '#89d6ae' },
];

export const profitPool2027 = [
  { name: 'NVIDIA', low: 310, high: 405, status: 'M + S', confidence: '低', color: '#76b7ff' },
  { name: 'Samsung 集团', low: 271, high: 353, status: 'M + S', confidence: '很低', color: '#e9c46a' },
];

export const hbmMarket = [
  { year: 'CY2026E', hynix: 43, samsung: 17, micron: 16, total: 76 },
  { year: 'CY2027E', hynix: 89, samsung: 34, micron: 33, total: 156 },
];

export const nvidiaFinancials = [
  { period: 'FY2026', revenue: 215.938, opProfit: 130.387, opMargin: 60.4, kind: 'A' },
  { period: 'Q4 FY2026', revenue: 68.127, opProfit: 44.299, opMargin: 65.0, kind: 'A' },
  { period: 'Q1 FY2027', revenue: 81.615, opProfit: 53.536, opMargin: 65.6, kind: 'A' },
  { period: 'Q2 FY2027', revenue: 91, opProfit: null, opMargin: null, kind: 'G' },
];

export const memoryFinancials = [
  {
    company: 'Samsung Electronics',
    status: 'Q1 2026 A · Q2 2026 P',
    metric: '集团营业利润率',
    values: [42.7, 52.3],
    labels: ['Q1 2026', 'Q2 2026'],
    color: '#e9c46a',
    note: 'DS 并不等同于 Memory；Q2 分部结果尚未正式拆分。',
  },
  {
    company: 'SK hynix',
    status: 'Q1 2026 A',
    metric: '集团营业利润率',
    values: [71.5],
    labels: ['Q1 2026'],
    color: '#f28e8e',
    note: '71.5% 为公司整体营业利润率，不是 HBM 独立利润率。',
  },
  {
    company: 'Micron',
    status: 'FYQ1–3 A · FYQ4 G',
    metric: '季度收入（$B）',
    values: [13.64, 23.9, 41.46, 50],
    labels: ['FYQ1', 'FYQ2', 'FYQ3', 'FYQ4'],
    color: '#89d6ae',
    note: '财年截至 8 月附近，不能直接视为 CY2026。FYQ3：DRAM 76%、NAND 24%。',
  },
];

export const financialCalendar = [
  { company: 'Samsung Electronics', fiscal: '12 月末', alignment: '与日历年一致', marker: 'CY' },
  { company: 'SK hynix', fiscal: '12 月末', alignment: '与日历年一致', marker: 'CY' },
  { company: 'NVIDIA', fiscal: '次年 1 月下旬', alignment: 'FY2026 主体属于 CY2025', marker: 'FY ≠ CY' },
  { company: 'Micron', fiscal: '8 月末附近', alignment: '与 CY 明显错位', marker: 'FY ≠ CY' },
];

export const scenarioData = [
  {
    key: 'A',
    title: '存储超级周期强化',
    tone: 'emerald',
    conditions: ['普通 DRAM ASP +20%—35%', 'NAND / eSSD +15%—30%', 'HBM 收入 +70%—100%', '新增有效 bit 供给低于需求'],
    result: '盈利弹性：Micron ≈ SK hynix > Samsung DS > NVIDIA',
    values: [
      ['NVIDIA', '145—165'],
      ['Samsung DS', '130—165'],
      ['SK hynix', '140—180'],
      ['Micron', '140—190'],
    ],
  },
  {
    key: 'B',
    title: '价格高位平台化',
    tone: 'amber',
    conditions: ['DRAM ASP 0%—15%', 'NAND -5% 至 +10%', 'HBM 继续增长', '新增供给逐渐接近需求'],
    result: '基准情景：利润仍高，但盈利预测上修速度逐步见顶。',
    values: [
      ['NVIDIA', '125—145'],
      ['Samsung DS', '95—125'],
      ['SK hynix', '100—135'],
      ['Micron', '90—130'],
    ],
  },
  {
    key: 'C',
    title: '存储价格提前反转',
    tone: 'rose',
    conditions: ['DRAM ASP -20%—35%', 'NAND -25%—40%', 'HBM 供给与良率快速改善', 'Hyperscaler CapEx 降速'],
    result: 'NVIDIA 可能相对占优：存储采购成本下降，平台租金仍在。',
    values: [
      ['NVIDIA', '95—120'],
      ['Samsung DS', '50—80'],
      ['SK hynix', '50—80'],
      ['Micron', '40—75'],
    ],
  },
];

export const watchlist = [
  ['服务器 DRAM 合约价', '上调幅度不收窄', '连续两个季度放缓'],
  ['移动 / PC DRAM', '涨价但需求稳定', '降配与出货下滑'],
  ['NAND / eSSD 价格', '与 DRAM 同步上涨', '库存回升、价格转跌'],
  ['HBM4 认证', '供给仍集中', '多厂商快速通过'],
  ['HBM 良率', '改善缓慢', '快速进入成熟水平'],
  ['三大厂 wafer starts', '增长受控', '同步扩产'],
  ['资本开支', '主要解决瓶颈', '大规模通用 bit 扩张'],
  ['Hyperscaler CapEx', '持续上调', '项目延期或下修'],
  ['NVIDIA 毛利率', '维持约 74%—76%', '连续下降超过 2ppt'],
  ['NVIDIA 库存及应收', '与收入同步', '连续快于收入'],
];

export const withdrawnNumbers = [
  ['NVIDIA“2026 实际营业利润 $239.2B”', '实际是 CY2026 内部模型'],
  ['2027 年 HBM TAM $315B', '无可靠来源'],
  ['SK hynix 2026 HBM 收入 $75B', '接近当年全球 HBM TAM'],
  ['Micron 2026 HBM 收入 $40B', '隐含不合理市场份额'],
  ['Samsung HBM 利润率 72%', '未披露'],
  ['SK hynix 普通 DRAM 利润率 70%', '未披露'],
  ['Micron NAND 利润率 55%—58%', '未披露'],
  ['NVIDIA Compute 营业利润率 66%', '未披露'],
  ['Microsoft / OpenAI 收入 $78B / $100B', '无客户披露'],
  ['Meta 收入 $60B / $88B', '无客户披露'],
  ['NVIDIA 占 2027 HBM 需求 65%', '未经验证的情景假设'],
  ['三大存储厂 2027 利润 $622B', '由多层低置信度假设构成'],
  ['B200 精确成本 $9,300', '仅为工程估算'],
  ['非 HBM 利润精确占比 82%', '依赖低置信度预测与假设'],
];

export const qualityScores = [
  ['实际财务数据', 9, '可作事实底座'],
  ['会计期间统一', 8, '须保留财年错位'],
  ['NVIDIA CY2026 模型', 7, '运行率可校验'],
  ['Samsung CY2026 模型', 5, '集团与 Memory 不可混同'],
  ['SK hynix / Micron CY2026 模型', 4, '日历化完整度较低'],
  ['2027 绝对盈利预测', 3, '只允许情景区间'],
  ['产品收入归因', 5, 'HBM 可作数量级校验'],
  ['投资逻辑与证伪框架', 8, '适合财报和价格跟踪'],
];
