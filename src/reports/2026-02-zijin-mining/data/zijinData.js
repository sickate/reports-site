// 紫金矿业深度分析数据

// 核心指标
export const keyMetrics = [
  {
    label: '2025净利润',
    value: '510-520',
    unit: '亿RMB',
    change: '+59%~62%',
    trend: 'up',
    color: '#22c55e'
  },
  {
    label: '矿产铜产量 2026E',
    value: '120',
    unit: '万吨',
    subtext: '全球前五',
    color: '#B87333'
  },
  {
    label: '矿产金产量 2026E',
    value: '105',
    unit: '吨',
    subtext: '中国第一',
    color: '#FFD700'
  },
  {
    label: '巨龙铜矿日处理量',
    value: '35',
    unit: '万吨/天',
    subtext: '全球最大单体',
    color: '#B87333'
  },
  {
    label: 'AI数据中心铜耗CAGR',
    value: '>20',
    unit: '%',
    subtext: '2024-2030',
    color: '#3b82f6'
  },
  {
    label: '全球铜供需缺口',
    value: '-15~-33',
    unit: '万吨',
    subtext: '2025E',
    color: '#ef4444'
  },
  {
    label: '当前估值 PE',
    value: '~21',
    unit: 'x',
    subtext: '历史中枢偏低',
    color: '#9b59b6'
  },
];

// 铜用量对比数据（传统 vs AI数据中心）
export const copperUsageComparison = [
  { category: '传统数据中心\n(5-15MW)', usage: 5000, range: '5,000-15,000', color: '#64748b' },
  { category: 'AI超大规模\n数据中心', usage: 50000, range: '~50,000', color: '#B87333' },
];

// 数据中心铜消耗预测 2024-2030
export const datacenterCopperForecast = [
  { year: 2024, consumption: 85, growth: null },
  { year: 2025, consumption: 102, growth: 20 },
  { year: 2026, consumption: 125, growth: 22 },
  { year: 2027, consumption: 155, growth: 24 },
  { year: 2028, consumption: 190, growth: 23 },
  { year: 2029, consumption: 230, growth: 21 },
  { year: 2030, consumption: 280, growth: 22 },
];

// 金价历史与预测
export const goldPriceData = [
  { year: '2020', price: 1770, event: null },
  { year: '2021', price: 1799, event: null },
  { year: '2022', price: 1800, event: '央行购金加速' },
  { year: '2023', price: 1940, event: null },
  { year: '2024', price: 2400, event: '突破历史高点' },
  { year: '2025E', price: 2800, event: '预测中枢' },
  { year: '2026E', price: 3200, event: '乐观情景' },
];

// 全球主要金企产量对比
export const goldProducerComparison = [
  { company: '紫金矿业', production2024: 73, production2026E: 105, growth: 43.8, color: '#FFD700' },
  { company: 'Newmont', production2024: 172, production2026E: 180, growth: 4.7, color: '#94a3b8' },
  { company: 'Barrick Gold', production2024: 125, production2026E: 130, growth: 4.0, color: '#94a3b8' },
  { company: 'Agnico Eagle', production2024: 105, production2026E: 112, growth: 6.7, color: '#94a3b8' },
];

// 三大金属战略定位雷达图数据
export const strategicRadar = [
  { subject: '产量增长', copper: 95, gold: 85, lithium: 70, fullMark: 100 },
  { subject: '成本优势', copper: 80, gold: 90, lithium: 65, fullMark: 100 },
  { subject: '资源储备', copper: 90, gold: 85, lithium: 95, fullMark: 100 },
  { subject: '价格弹性', copper: 85, gold: 80, lithium: 90, fullMark: 100 },
  { subject: '运营风险', copper: 70, gold: 85, lithium: 60, fullMark: 100 },
  { subject: '政策支持', copper: 75, gold: 80, lithium: 85, fullMark: 100 },
];

// 敏感性分析矩阵
export const sensitivityMatrix = [
  {
    scenario: '悲观',
    copperPrice: 9500,
    goldPrice: 2400,
    netProfit: 450,
    impliedPE: 19,
    color: '#ef4444'
  },
  {
    scenario: '中性',
    copperPrice: 11000,
    goldPrice: 2800,
    netProfit: 580,
    impliedPE: 15,
    color: '#3b82f6'
  },
  {
    scenario: '乐观',
    copperPrice: 12500,
    goldPrice: 3200,
    netProfit: 720,
    impliedPE: 12,
    color: '#22c55e'
  },
];

// 铜板块资产清单
export const copperAssets = [
  {
    name: '西藏巨龙铜矿',
    location: '中国西藏',
    production2026: '30-35万吨',
    status: '二期2026.1.23投产',
    significance: '中国最大、全球海拔最高',
    grade: '0.41%',
    ownership: '50.1%',
    highlight: true
  },
  {
    name: 'Kamoa-Kakula',
    location: '刚果(金)',
    production2026: '38-42万吨',
    status: '三期产能爬坡中',
    significance: '全球最高品位铜矿',
    grade: '5.22%',
    ownership: '45%',
    highlight: true
  },
  {
    name: '塞尔维亚佩吉铜金矿',
    location: '塞尔维亚',
    production2026: '~10万吨',
    status: '稳定运营',
    significance: '欧洲稀缺铜矿资产',
    grade: '0.46%',
    ownership: '100%',
    highlight: false
  },
  {
    name: '科卢韦齐铜矿',
    location: '刚果(金)',
    production2026: '~8万吨',
    status: '稳定运营',
    significance: '高品位氧化铜',
    grade: '3.5%',
    ownership: '72%',
    highlight: false
  },
  {
    name: '秘鲁白河铜钼矿',
    location: '秘鲁',
    production2026: '~6万吨',
    status: '扩建中',
    significance: '南美战略支点',
    grade: '0.53%',
    ownership: '100%',
    highlight: false
  },
];

// 金板块资产清单
export const goldAssets = [
  {
    name: '陇南紫金',
    location: '中国甘肃',
    production2026: '~15吨',
    cost: '~180美元/oz',
    significance: '国内核心资产'
  },
  {
    name: '贵州紫金',
    location: '中国贵州',
    production2026: '~12吨',
    cost: '~200美元/oz',
    significance: '高品位卡林型'
  },
  {
    name: '塞尔维亚博尔',
    location: '塞尔维亚',
    production2026: '~18吨',
    cost: '~350美元/oz',
    significance: '副产金稳定来源'
  },
  {
    name: '诺顿金田',
    location: '澳大利亚',
    production2026: '~10吨',
    cost: '~1200美元/oz',
    significance: '待优化资产'
  },
  {
    name: 'Buriticá金矿',
    location: '哥伦比亚',
    production2026: '~8吨',
    cost: '~650美元/oz',
    significance: '高风险高回报'
  },
];

// 锂板块资产清单
export const lithiumAssets = [
  {
    name: '3Q锂业',
    location: '阿根廷',
    production2026: '3万吨LCE',
    status: '满产运营',
    significance: '盐湖提锂先锋'
  },
  {
    name: '西藏拉果错',
    location: '中国西藏',
    production2026: '2万吨LCE',
    status: '2026年投产',
    significance: '国内战略储备'
  },
  {
    name: 'Manono锂矿',
    location: '刚果(金)',
    production2026: '待开发',
    status: '可行性研究中',
    significance: '全球最大硬岩锂矿',
    highlight: true
  },
];

// 2026极值情景数据（来自第二篇研报）
export const extremeScenario2026 = {
  assumptions: {
    copperPrice: 12987,
    goldPrice: 4773,
    lithiumPrice: 140000 // 碳酸锂 RMB/吨
  },
  segments: [
    {
      metal: '矿产铜',
      production: '122万吨',
      revenue: 1140,
      grossMargin: 63.6,
      marginContrib: 43.6,
      color: '#B87333'
    },
    {
      metal: '矿产金',
      production: '105吨',
      revenue: 1155,
      grossMargin: 62.7,
      marginContrib: 43.5,
      color: '#FFD700'
    },
    {
      metal: '矿产锂',
      production: '12万吨LCE',
      revenue: 168,
      grossMargin: 60.7,
      marginContrib: 6.1,
      color: '#9b59b6'
    },
    {
      metal: '矿产锌铅',
      production: '45万吨',
      revenue: 99,
      grossMargin: 45.5,
      marginContrib: 2.7,
      color: '#64748b'
    },
  ],
  totalRevenue: 2562,
  totalGrossProfit: 1663,
  netProfit: '910-950亿',
  grossMarginAvg: 64.9
};

// 业绩弹性对比 2025 vs 2026
export const profitElasticity = [
  { year: '2025E', baseProfit: 320, actualProfit: 520, upside: 62.5, scenario: '基础→实际' },
  { year: '2026E 中性', baseProfit: 520, actualProfit: 580, upside: 11.5, scenario: '基础→中性' },
  { year: '2026E 乐观', baseProfit: 520, actualProfit: 720, upside: 38.5, scenario: '基础→乐观' },
  { year: '2026E 极值', baseProfit: 520, actualProfit: 930, upside: 78.8, scenario: '基础→极值' },
];

// Bear vs Bull 论点对比
export const bearVsBull = [
  {
    topic: '地缘政治风险',
    bear: {
      title: '刚果金超额利润税、政局不稳',
      detail: '刚果(金)于2023年实施超额利润税机制：铜价超过9,500美元/吨时征收25%超额利润税，超过11,000美元/吨时上升至35%。2024年大选后政局仍存不确定性，矿业法规可能进一步收紧。Kamoa-Kakula虽品位全球最高，但政治风险溢价不可忽视。'
    },
    bull: {
      title: '已充分计价 + 巨龙增量完全对冲',
      detail: '1) 紫金股价已包含刚果金风险折价，当前PE仅21x远低于历史中枢25x；2) 西藏巨龙二期投产后新增30-35万吨铜产能，足以覆盖任何刚果金减产情景；3) 紫金刚果金资产仅占总收入约15%，多元化布局使单一国家风险敞口可控；4) 与艾芬豪合资模式下，紫金已优化运营成本至C1 $1.45/lb，即使征税后仍有可观利润空间。'
    }
  },
  {
    topic: '巨龙技术难度',
    bear: {
      title: '海拔4,500米，极端环境运营挑战',
      detail: '西藏巨龙铜矿位于海拔4,500米以上的高寒地区，年平均气温-3°C，氧气含量仅为海平面的60%。极端环境对设备可靠性、员工健康、物流运输均构成重大挑战。二期项目35万吨/日处理量的大规模运营在全球无先例可循。'
    },
    bull: {
      title: '工程奇迹已验证，二期复制成熟经验',
      detail: '1) 一期项目已成功运营3年，累计处理矿石超过1亿吨，证明高海拔大规模采选完全可行；2) 紫金在西藏拥有20年运营经验，已建立完整的高原作业体系；3) 二期设备采用一期验证过的国产化方案，设备到货率已达95%；4) 2026年1月23日二期投产仪式已圆满举行，产能爬坡按计划推进。'
    }
  },
  {
    topic: '关税/贸易战',
    bear: {
      title: '中美贸易摩擦可能影响铜需求',
      detail: '若中美贸易战升级，美国可能对中国制造的电动车、电子产品加征关税，间接影响中国铜消费需求。特朗普政府"美国优先"政策可能重塑全球铜供应链，对紫金海外销售渠道构成威胁。'
    },
    bull: {
      title: '铜是全球定价商品，贸易战影响有限',
      detail: '1) 铜在LME全球定价，不存在"中国价格"，贸易战无法改变全球供需基本面；2) 紫金60%产量在中国境内销售，不受关税直接影响；3) AI数据中心建设是全球性趋势，美国自身铜需求反而会因再工业化而上升；4) 铜库存处于历史低位（<4天全球消费量），任何需求扰动都会被供应短缺所主导。'
    }
  },
  {
    topic: '铜价回调风险',
    bear: {
      title: '铜价已处历史高位，回调空间大',
      detail: '铜价已从2020年低点上涨超过80%，投机性多头持仓处于高位。若全球经济衰退，铜价可能回调至$8,000/吨以下，紫金净利润将大幅下滑。'
    },
    bull: {
      title: '结构性供应短缺支撑铜价中枢上移',
      detail: '1) 全球铜矿品位持续下降，过去20年平均品位从1.0%降至0.6%；2) ESG约束使新矿开发周期延长至10年以上，2024-2030年几乎无大型新项目投产；3) AI数据中心、电动车、电网投资三重需求叠加，2025年全球铜缺口预计15-33万吨；4) 即使铜价回调至$9,500，紫金C1成本仍有40%毛利空间。'
    }
  },
  {
    topic: '金价见顶论',
    bear: {
      title: '金价已创历史新高，上行空间有限',
      detail: '黄金价格已突破$2,800/oz历史高位，实际利率若反弹，黄金作为零息资产将承压。央行购金可能已接近饱和，边际买盘减弱。'
    },
    bull: {
      title: '央行购金范式转移，金价中枢仍将上移',
      detail: '1) 全球央行已连续3年净购金超过1,000吨，这是1971年布雷顿森林体系解体后首次出现的"去美元化"趋势；2) 中国央行黄金储备占外汇储备比例仅4.9%，远低于全球平均15%和美国75%，潜在增持空间巨大；3) 紫金黄金生产成本<$1,200/oz，即使金价回调至$2,400仍有100%毛利；4) 地缘政治不确定性（俄乌、中东）支撑避险需求。'
    }
  },
];

// 项目投产时间线
export const projectTimeline = [
  {
    year: 2024,
    quarter: 'Q4',
    project: 'Kamoa三期投产',
    metal: 'copper',
    capacity: '+20万吨',
    status: 'completed'
  },
  {
    year: 2025,
    quarter: 'Q1',
    project: '3Q锂业满产',
    metal: 'lithium',
    capacity: '3万吨LCE',
    status: 'completed'
  },
  {
    year: 2026,
    quarter: 'Q1',
    project: '巨龙二期投产',
    metal: 'copper',
    capacity: '+30万吨',
    status: 'completed'
  },
  {
    year: 2026,
    quarter: 'Q2',
    project: '巨龙二期满产',
    metal: 'copper',
    capacity: '35万吨/日',
    status: 'in-progress'
  },
  {
    year: 2026,
    quarter: 'Q3',
    project: '拉果错锂矿投产',
    metal: 'lithium',
    capacity: '2万吨LCE',
    status: 'planned'
  },
  {
    year: 2027,
    quarter: 'Q1',
    project: 'Manono可研完成',
    metal: 'lithium',
    capacity: '待定',
    status: 'planned'
  },
];

// 交易指引
export const tradeGuidance = {
  targetPrices: {
    hShare: { current: 18.5, target: 52, upside: 181 },
    aShare: { current: 17.2, target: 25, upside: 45 }
  },
  entryStrategy: [
    { price: '港股 17-19 HKD', action: '首次建仓', position: '30%' },
    { price: '港股 15-17 HKD', action: '加仓', position: '+30%' },
    { price: '港股 <15 HKD', action: '重仓', position: '+40%' },
  ],
  invalidationTriggers: [
    '巨龙二期产能爬坡连续2个季度低于预期',
    '刚果金政府单方面修改Kamoa合资协议',
    '铜价跌破$8,500/吨且持续3个月以上',
    '紫金管理层发生重大人事变动',
  ]
};

// 风险因素详情
export const riskFactors = [
  {
    category: '政治风险',
    level: 'high',
    title: '刚果金超额利润税',
    detail: '刚果(金)2023年实施的超额利润税机制对Kamoa-Kakula的影响：铜价>$9,500征收25%，>$11,000征收35%。按当前铜价$10,500计算，约影响净利润3-5%。若铜价持续高位，税负将进一步上升。'
  },
  {
    category: '运营风险',
    level: 'medium',
    title: '西藏巨龙高寒挑战',
    detail: '海拔4,500米的极端环境对设备可靠性、员工健康、电力供应均构成挑战。冬季（11月-次年3月）施工和运营效率下降约20%。但一期运营经验已证明风险可控。'
  },
  {
    category: '市场风险',
    level: 'medium',
    title: '商品价格波动',
    detail: '紫金净利润对铜、金价格高度敏感。铜价每下跌$1,000/吨，净利润下降约50亿元；金价每下跌$100/oz，净利润下降约30亿元。但多金属组合提供一定对冲。'
  },
  {
    category: '地缘风险',
    level: 'low',
    title: '哥伦比亚Buriticá安全',
    detail: '哥伦比亚Buriticá金矿面临非法采矿和社区冲突风险。2024年发生过安保事件导致短暂停产。紫金已加强安保投入，但该资产占总收入仅2%，影响有限。'
  },
];

// Buriticá红队测试数据
export const buriticaRedTeam = {
  summary: '哥伦比亚Buriticá金矿是紫金收购的高品位黄金资产，年产约8吨黄金。但该项目面临独特的运营和安全挑战。',
  challenges: [
    {
      title: '非法采矿问题',
      detail: '矿区周边存在大量非法小型采矿活动（barequeros），估计有超过5,000人在周边从事非法开采。这些活动不仅造成资源流失，还带来环境和社会治理压力。紫金已与当地政府合作打击非法采矿，但问题难以根除。'
    },
    {
      title: '社区关系紧张',
      detail: '当地社区对大型采矿企业存在复杂情绪。部分居民依赖非法采矿谋生，对紫金的正规化运营持抵触态度。2024年曾发生社区抗议导致矿山道路被封堵的事件。'
    },
    {
      title: '安保成本高企',
      detail: '哥伦比亚部分地区仍存在武装组织活动，Buriticá所在的安蒂奥基亚省安全形势复杂。紫金每年在该矿的安保支出约$15-20百万，占运营成本的5%以上。'
    },
    {
      title: '品位下降风险',
      detail: '初期开采的高品位矿体（>10 g/t）已进入中后期，未来品位可能逐步下降至5-7 g/t，影响单位产出。'
    },
  ],
  mitigations: [
    '紫金已将Buriticá定位为"观察类资产"，不再追加大额资本开支',
    '已建立社区利益共享机制，每年投入$5百万用于当地基础设施',
    '与哥伦比亚国家警察签署联合安保协议',
    '该资产仅占紫金总收入的2%，即使全额减值也影响有限'
  ],
  conclusion: '综合评估，Buriticá是紫金资产组合中风险最高的单一项目，但其规模较小使得整体影响可控。我们建议将其视为"期权价值"而非核心利润来源。'
};

// 行业颜色配置
export const metalColors = {
  copper: '#B87333',
  gold: '#FFD700',
  lithium: '#9b59b6',
  zinc: '#64748b',
  bullish: '#22c55e',
  bearish: '#ef4444',
  neutral: '#3b82f6',
};
