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

// Sankey model supplied with the research workbook. Values are global market value
// allocated to suppliers, not necessarily the suppliers' reported accounting revenue.
const sankeyEdgeRows = [
  [2026, '下游-NVIDIA平台', '品类-HBM', 45.6, 'M', '低'],
  [2026, '下游-NVIDIA平台', '品类-DRAM（不含HBM）', 69.24, 'M', '低'],
  [2026, '下游-NVIDIA平台', '品类-NAND', 15, 'M', '低'],
  [2026, '下游-ASIC平台', '品类-HBM', 19, 'M', '低'],
  [2026, '下游-ASIC平台', '品类-DRAM（不含HBM）', 46.16, 'M', '低'],
  [2026, '下游-ASIC平台', '品类-NAND', 12, 'M', '低'],
  [2026, '下游-其他门类', '品类-HBM', 11.4, 'M', '低'],
  [2026, '下游-其他门类', '品类-DRAM（不含HBM）', 461.6, 'M', '低'],
  [2026, '下游-其他门类', '品类-NAND', 123, 'M', '低'],
  [2026, '品类-HBM', '供应商-三星', 16.72, 'E', '中'],
  [2026, '品类-HBM', '供应商-SK海力士', 43.32, 'E', '中'],
  [2026, '品类-HBM', '供应商-美光', 15.96, 'E', '中'],
  [2026, '品类-DRAM（不含HBM）', '供应商-三星', 230.8, 'M', '低'],
  [2026, '品类-DRAM（不含HBM）', '供应商-SK海力士', 144.25, 'M', '低'],
  [2026, '品类-DRAM（不含HBM）', '供应商-美光', 126.94, 'M', '低'],
  [2026, '品类-DRAM（不含HBM）', '供应商-长鑫存储', 34.62, 'M', '中低'],
  [2026, '品类-DRAM（不含HBM）', '供应商-其他供应商', 40.39, 'M', '低'],
  [2026, '品类-NAND', '供应商-三星', 45, 'E/M', '中低'],
  [2026, '品类-NAND', '供应商-SK海力士', 30, 'E/M', '中低'],
  [2026, '品类-NAND', '供应商-美光', 19.5, 'E/M', '中低'],
  [2026, '品类-NAND', '供应商-Kioxia', 21, 'E/M', '中低'],
  [2026, '品类-NAND', '供应商-SanDisk', 16.5, 'E/M', '中低'],
  [2026, '品类-NAND', '供应商-其他供应商', 18, 'M', '低'],
  [2026, '供应商-三星', '归属净利-三星', 152.1104, 'M', '低'],
  [2026, '供应商-三星', '成本税费-三星', 140.4096, 'M', '低'],
  [2026, '供应商-SK海力士', '归属净利-SK海力士', 130.542, 'M', '中低'],
  [2026, '供应商-SK海力士', '成本税费-SK海力士', 87.028, 'M', '中低'],
  [2026, '供应商-美光', '归属净利-美光', 94.192, 'M', '低'],
  [2026, '供应商-美光', '成本税费-美光', 68.208, 'M', '低'],
  [2026, '供应商-长鑫存储', '归属净利-长鑫存储', 15.579, 'M', '中'],
  [2026, '供应商-长鑫存储', '成本税费-长鑫存储', 19.041, 'M', '中'],
  [2026, '供应商-Kioxia', '归属净利-Kioxia', 7.98, 'M', '低'],
  [2026, '供应商-Kioxia', '成本税费-Kioxia', 13.02, 'M', '低'],
  [2026, '供应商-SanDisk', '归属净利-SanDisk', 6.6, 'M', '中低'],
  [2026, '供应商-SanDisk', '成本税费-SanDisk', 9.9, 'M', '中低'],
  [2026, '供应商-其他供应商', '归属净利-其他供应商', 17.517, 'M', '很低'],
  [2026, '供应商-其他供应商', '成本税费-其他供应商', 40.873, 'M', '很低'],
  [2027, '下游-NVIDIA平台', '品类-HBM', 78, 'M', '低'],
  [2027, '下游-NVIDIA平台', '品类-DRAM（不含HBM）', 110.1, 'M', '低'],
  [2027, '下游-NVIDIA平台', '品类-NAND', 33, 'M', '低'],
  [2027, '下游-ASIC平台', '品类-HBM', 54.6, 'M', '低'],
  [2027, '下游-ASIC平台', '品类-DRAM（不含HBM）', 102.76, 'M', '低'],
  [2027, '下游-ASIC平台', '品类-NAND', 33, 'M', '低'],
  [2027, '下游-其他门类', '品类-HBM', 23.4, 'M', '低'],
  [2027, '下游-其他门类', '品类-DRAM（不含HBM）', 521.14, 'M', '低'],
  [2027, '下游-其他门类', '品类-NAND', 154, 'M', '低'],
  [2027, '品类-HBM', '供应商-三星', 43.68, 'M', '低'],
  [2027, '品类-HBM', '供应商-SK海力士', 78, 'M', '低'],
  [2027, '品类-HBM', '供应商-美光', 34.32, 'M', '低'],
  [2027, '品类-DRAM（不含HBM）', '供应商-三星', 278.92, 'M', '很低'],
  [2027, '品类-DRAM（不含HBM）', '供应商-SK海力士', 176.16, 'M', '很低'],
  [2027, '品类-DRAM（不含HBM）', '供应商-美光', 154.14, 'M', '很低'],
  [2027, '品类-DRAM（不含HBM）', '供应商-长鑫存储', 58.72, 'M', '低'],
  [2027, '品类-DRAM（不含HBM）', '供应商-其他供应商', 66.06, 'M', '很低'],
  [2027, '品类-NAND', '供应商-三星', 63.8, 'M', '低'],
  [2027, '品类-NAND', '供应商-SK海力士', 44, 'M', '低'],
  [2027, '品类-NAND', '供应商-美光', 30.8, 'M', '低'],
  [2027, '品类-NAND', '供应商-Kioxia', 30.8, 'M', '低'],
  [2027, '品类-NAND', '供应商-SanDisk', 24.2, 'M', '低'],
  [2027, '品类-NAND', '供应商-其他供应商', 26.4, 'M', '低'],
  [2027, '供应商-三星', '归属净利-三星', 193.2, 'M', '很低'],
  [2027, '供应商-三星', '成本税费-三星', 193.2, 'M', '很低'],
  [2027, '供应商-SK海力士', '归属净利-SK海力士', 166.9696, 'M', '很低'],
  [2027, '供应商-SK海力士', '成本税费-SK海力士', 131.1904, 'M', '很低'],
  [2027, '供应商-美光', '归属净利-美光', 120.593, 'M', '很低'],
  [2027, '供应商-美光', '成本税费-美光', 98.667, 'M', '很低'],
  [2027, '供应商-长鑫存储', '归属净利-长鑫存储', 24.6624, 'M', '低'],
  [2027, '供应商-长鑫存储', '成本税费-长鑫存储', 34.0576, 'M', '低'],
  [2027, '供应商-Kioxia', '归属净利-Kioxia', 11.396, 'M', '很低'],
  [2027, '供应商-Kioxia', '成本税费-Kioxia', 19.404, 'M', '很低'],
  [2027, '供应商-SanDisk', '归属净利-SanDisk', 9.196, 'M', '很低'],
  [2027, '供应商-SanDisk', '成本税费-SanDisk', 15.004, 'M', '很低'],
  [2027, '供应商-其他供应商', '归属净利-其他供应商', 25.8888, 'M', '很低'],
  [2027, '供应商-其他供应商', '成本税费-其他供应商', 66.5712, 'M', '很低'],
];

const sankeyNodeOrder = [
  '下游-NVIDIA平台', '下游-ASIC平台', '下游-其他门类',
  '品类-HBM', '品类-DRAM（不含HBM）', '品类-NAND',
  '供应商-三星', '供应商-SK海力士', '供应商-美光', '供应商-长鑫存储',
  '供应商-Kioxia', '供应商-SanDisk', '供应商-其他供应商',
  '归属净利-三星', '成本税费-三星', '归属净利-SK海力士', '成本税费-SK海力士',
  '归属净利-美光', '成本税费-美光', '归属净利-长鑫存储', '成本税费-长鑫存储',
  '归属净利-Kioxia', '成本税费-Kioxia', '归属净利-SanDisk', '成本税费-SanDisk',
  '归属净利-其他供应商', '成本税费-其他供应商',
];

const sankeyNodeStage = (name) => {
  if (name.startsWith('下游-')) return 0;
  if (name.startsWith('品类-')) return 1;
  if (name.startsWith('供应商-')) return 2;
  return 3;
};

const sankeyNodeLabel = (name) => name
  .replace(/^下游-/, '')
  .replace(/^品类-/, '')
  .replace(/^供应商-/, '')
  .replace(/^归属净利-/, '归属净利 · ')
  .replace(/^成本税费-/, '成本税费 · ');

export const sankeyNodeColor = (name) => {
  if (name.includes('NVIDIA')) return '#76b7ff';
  if (name.includes('ASIC')) return '#a78bfa';
  if (name === '下游-其他门类') return '#718096';
  if (name === '品类-HBM') return '#e9c46a';
  if (name.includes('DRAM')) return '#62c5e3';
  if (name === '品类-NAND') return '#70d6a4';
  if (name.startsWith('归属净利')) return '#34d399';
  if (name.startsWith('成本税费')) return '#64748b';
  if (name.includes('三星')) return '#f0bc72';
  if (name.includes('SK海力士')) return '#f28e8e';
  if (name.includes('美光')) return '#89d6ae';
  if (name.includes('长鑫')) return '#c79af5';
  if (name.includes('Kioxia')) return '#61c6d7';
  if (name.includes('SanDisk')) return '#fb9e76';
  if (name.includes('其他供应商')) return '#9aa7b5';
  return '#64748b';
};

export const buildMemorySankey = (year) => {
  const edges = sankeyEdgeRows
    .filter(([edgeYear]) => edgeYear === year)
    .map(([, source, target, value, status, confidence]) => ({ source, target, value, status, confidence }));
  const names = sankeyNodeOrder.filter((name) => edges.some((edge) => edge.source === name || edge.target === name));
  const indexByName = new Map(names.map((name, index) => [name, index]));

  return {
    nodes: names.map((name) => ({
      name,
      label: sankeyNodeLabel(name),
      stage: sankeyNodeStage(name),
      color: sankeyNodeColor(name),
    })),
    links: edges.map((edge) => ({
      ...edge,
      sourceName: edge.source,
      targetName: edge.target,
      source: indexByName.get(edge.source),
      target: indexByName.get(edge.target),
    })),
  };
};

export const memorySankeySummary = {
  2026: { market: 803, netProfit: 427.12, netMargin: 53.2, status: 'E / M', confidence: '中低' },
  2027: { market: 1110, netProfit: 557.04, netMargin: 50.2, status: 'M', confidence: '很低' },
};

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
