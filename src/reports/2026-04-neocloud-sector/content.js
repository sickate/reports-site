// Neocloud 板块反推估值全景: 7 家公司隐含预期与安全边际
// 静态文案 / 表格 / 方法论 / 红队 / 排序数据集中存放
// 数据基准: 2026-04-10 ~ 2026-04-13

export const reportMeta = {
  title: 'Neocloud 板块反推估值全景',
  subtitle: '7 家公司隐含预期与安全边际 · NBIS / CRWV / WULF / APLD / IREN / CIFR / CLSK',
  updatedAt: '2026-04-25',
  asOfDate: '2026-04-10 ~ 2026-04-13',
  scope: '7 家 Neocloud 公司',
  rating: '反驳为主 · NBIS 有 ~20-30% 安全边际',
  confidence: '中等 (consensus 覆盖较薄的公司置信度更低)',
  timeframe: '当前估值 + 12 个月内催化',
  revisionNote:
    '本报告以反推估值框架横向比较 7 家公司的隐含增长要求与 Backlog 质量, 重点检验"NBIS $146 无安全边际"论断, 并对用户原始持仓框架(NBIS/WULF 核心 · CIFR/APLD 战术 · CLSK/IREN 回避)做最终验证。',
};

// ---- BLUF: 底线先行 ----
export const bluf = {
  headline: '"NBIS 在 $146 无安全边际"这一论断的核心数字基础存在严重错误',
  body: `实际 EV/2026E Revenue 约为 11.5x 而非所称的 3.5x; 但扣除 ~$7.2B 非核心资产后, 核心 AI Cloud 业务的 EV/2027E Revenue 约 3.2x — 这可能是该论断的真实计算基础, 只是标注年份有误。经过系统性的 reverse valuation 分析, NBIS 在 $145 的隐含增长要求 (CAGR ~105-119%) 显著低于 consensus CAGR (~204%), 存在可量化的安全边际。在 7 家公司横向比较中, NBIS 的 EV/Risk-Adjusted Backlog 倍数最低 (1.5x), 结合净现金、非核心资产缓冲和 backlog 质量, 其 risk-reward 在板块内最优。CLSK 因无 AI 合同而安全边际最低, IREN 估值最为激进。`,
};

// ---- 第一章: 7 家公司估值基础数据总览 ----
export const baseDataTable = {
  headers: ['指标', 'NBIS', 'CRWV', 'WULF', 'APLD', 'IREN', 'CIFR', 'CLSK'],
  rows: [
    ['股价', '$145', '$102', '$19', '$26', '$40', '$15', '$10'],
    ['市值', '$36.7B', '$53.6B', '$8.0B', '$7.5B', '$13.8B', '$6.0B', '$2.6B'],
    ['基本股本', '253M', '526M', '424M', '280M', '332M', '405M', '256M'],
    [
      '完全稀释股本(含 converts/warrants)',
      '~315M',
      '~580M',
      '~450M',
      '~310M',
      '~360M',
      '~430M',
      '~280M',
    ],
    ['Pro Forma 总债务', '$8.4B', '~$24B', '$5.7B', '~$5.4B', '~$5B+', '$3.2B', '$1.8B'],
    [
      '现金及等价物',
      '~$8.0B¹',
      '~$3.1B',
      '$3.7B²',
      '$2.1B',
      '$3.3B',
      '$754M',
      '$458M+$1B BTC',
    ],
    ['Net Debt/(Cash)', '~$0.4B', '~$21B', '$2.0B', '~$3.3B', '~$1.7B', '$2.5B', '~$0.3B'],
    ['Enterprise Value', '~$37.1B', '~$74.6B', '~$10.0B', '~$10.8B³', '~$15.5B', '~$8.5B', '~$2.9B'],
    ['最新年收入(2025A/FY2025)', '$530M', '$5,130M', '$169M', '~$342M⁴', '$501M⁵', '$224M', '$766M⁵'],
    [
      '最新 Adj. EBITDA',
      '($65M) FY',
      '$3,090M',
      '($23M)',
      '$44M Q3',
      '$270M FY',
      '~$30M TTM',
      '$225M TTM',
    ],
    ['Contracted Backlog', '~$46B', '$66.8B', '$12.8B', '$16B', '~$10.7B', '$9.3B', '$0'],
    ['已运营 MW', '~170', '~850', '~39 HPC', '100 HPC', '~200 AI', '0 HPC', '0 AI'],
    ['已签约 MW', '>2 GW', '3.1 GW', '522 MW', '600 MW', '~800 MW', '600 MW', '0'],
  ],
  notes:
    '注: ¹含 Feb 2026 convertible 净收及 NVIDIA $2B 投入; ²含 restricted cash; ³含 Macquarie preferred $900M; ⁴FY2026E (截至 2026 年 5 月); ⁵财年结束月与日历年不同, IREN/CLSK 为 Jun 30 FY。市场价格取自 Yahoo Finance 与 Robinhood, 财务数据取自最新季报 (SEC EDGAR), 截至 2026 年 4 月 10-13 日交易日。',
};

// ---- 第二章: 综合多倍数估值矩阵 ----
export const revenueMultiples = {
  title: '收入类倍数',
  headers: ['倍数', 'NBIS', 'CRWV', 'WULF', 'APLD', 'IREN', 'CIFR', 'CLSK'],
  rows: [
    ['EV/2026E Revenue', '11.3x', '6.0x', '~25x⁶', '~20x⁷', '15.3x⁸', '极高⁹', '2.8x'],
    ['EV/2027E Revenue', '3.8x', '~3.0x', '~6x', '~20x', '5.3x', '~8.5x', '~3.5x'],
    ['EV/Contracted Revenue (全量)', '0.81x', '1.12x', '0.78x', '0.68x', '1.45x', '0.91x', 'N/A'],
    ['Core EV/2026E Revenue¹⁰', '9.3x', '6.0x', '~25x', '~20x', '15.3x', '极高', '2.8x'],
  ],
  notes:
    '注: ⁶WULF 2026 HPC 收入预计 ~$300-400M 区间, 总收入含 BTC mining 约 ~$390M; ⁷APLD FY2027E (截至 May 2027) ~$553M; ⁸IREN FY2026E (截至 Jun 2026) $1.01B; ⁹CIFR HPC 收入 2H 2026 才开始, 2026 全年 BTC + 初始 HPC 估计 ~$350-400M; ¹⁰NBIS Core EV = $37.1B - $7.2B 非核心 = $29.9B。',
};

export const earningsMultiples = {
  title: '盈利类倍数',
  headers: ['倍数', 'NBIS', 'CRWV', 'WULF', 'APLD', 'IREN', 'CIFR', 'CLSK'],
  rows: [
    ['EV/2026E EBITDA', '~28x¹¹', '~10.5x', 'NM', 'NM', '~20x', 'NM', '~13x'],
    ['EV/2027E EBITDA', '~7.5x¹²', '~5.5x', '~15x', '~40x', '~7x', '~12.7x', '~13x'],
    ['EV/2028E EBITDA (稳态)', '~4.0x', '~4.0x', '~8x', '~15x', '~4.5x', '~8x', '~10x'],
  ],
  notes:
    '注: ¹¹以管理层 40% EBITDA margin 指引 × $3.2B 收入 = $1.28B; ¹²2027E Revenue $9.73B × 假设 50% margin = $4.87B; NM = 负 EBITDA。',
};

export const capacityMultiples = {
  title: '产能类倍数',
  headers: ['倍数', 'NBIS', 'CRWV', 'WULF', 'APLD', 'IREN', 'CIFR', 'CLSK'],
  rows: [
    ['EV/已运营 MW', '$218M', '$88M', '$256M', '$108M', '$78M', 'N/A', 'N/A'],
    ['EV/已签约 MW', '$18.6M', '$24.1M', '$19.2M', '$18.0M', '$19.4M', '$14.2M', 'N/A'],
  ],
};

export const multiplesKeyFinding = `在 EV/已签约 MW 这一资产层面的倍数上, 7 家公司相对收敛于 $14-24M/MW 区间, CIFR 最便宜 ($14.2M/MW), CRWV 最贵 ($24.1M/MW)。NBIS 居中偏上 ($18.6M/MW), 但其已签约容量 >2GW 的规模意味着单位成本有摊薄空间。`;

// ---- 第三章: Backlog 风险调整方法论 + 结果 ----
export const backlogMethodology = [
  {
    dim: '维度 1',
    title: 'Take-or-Pay 结构质量 (0-100 分)',
    body: '评估标准: MAC 条款严格度、信用增级安排 (母公司担保 / LC / 预付款)、客户信用等级。',
  },
  {
    dim: '维度 2',
    title: '客户集中度折扣',
    body: '单一客户 >50% 施加 15-25% 折价; Top 2 >80% 额外 10% 折价。',
  },
  {
    dim: '维度 3',
    title: '合同期限 PV 折扣',
    body: '按各公司 WARL 做年金 PV, 贴现率 = 加权债务成本 + 400bp equity risk premium (约 8-10%)。5 年合同 PV 因子 ~0.86, 10 年 ~0.67, 15 年 ~0.57。',
  },
  {
    dim: '维度 4',
    title: '执行风险折扣',
    body: '未交付容量按上线概率打折 (construction delay、permitting、GPU supply 风险)。',
  },
];

export const raBacklogTable = {
  headers: [
    '公司',
    'Gross Backlog',
    'ToP 质量(×)',
    '集中度(×)',
    'PV 期限(×)',
    '执行风险(×)',
    'RA-Backlog',
    'EV/RA-Backlog',
  ],
  rows: [
    ['NBIS', '$46B', '0.85', '0.85', '0.86', '0.88', '$24.7B', '1.50x'],
    ['CRWV', '$66.8B', '0.82', '0.80', '0.78', '0.88', '$30.1B', '2.48x'],
    ['WULF', '$12.8B', '0.78', '0.82', '0.67', '0.82', '$4.5B', '2.22x'],
    ['APLD', '$16B', '0.72', '0.72', '0.57', '0.88', '$3.7B', '2.92x'],
    ['IREN', '$10.7B', '0.82', '0.72', '0.86', '0.78', '$4.0B', '3.88x'],
    ['CIFR', '$9.3B', '0.85', '0.82', '0.62', '0.82', '$3.1B', '2.74x'],
    ['CLSK', '$0', '—', '—', '—', '—', '$0', 'N/A'],
  ],
};

export const raBacklogFindings = [
  {
    heading: '核心结论',
    body: 'NBIS 的 EV/RA-Backlog 仅 1.50x, 为 7 家中最低。这意味着市场为每 $1 经风险调整的合同价值仅支付 $1.50 的企业价值, 而 IREN 需支付 $3.88、CRWV 需 $2.48。NBIS backlog 质量评分高的原因: Microsoft 和 Meta 均为 investment grade 客户, 已有 $1.58B deferred revenue (客户预付款) 在账上, 合同平均期限 5 年 (PV 折扣较小)。',
  },
  {
    heading: 'APLD 的特殊风险',
    body: '其 $16B backlog 中 CoreWeave 占 ~$11B。尽管 CoreWeave 通过 A3 评级 SPV 和 springing guarantee 提升了信用质量, 但 APLD 本质上是 "对 CoreWeave 的杠杆赌注" — 若 CRWV 陷入困境, APLD 首当其冲。这导致其 ToP 质量和集中度双重折价。',
    tone: 'warning',
  },
];

// ---- 第四章: Implied Growth 反推 ----
export const impliedGrowthMethodology = [
  {
    label: '稳态假设 (2030E)',
    body: 'FCF yield 8-10%, EBITDA margin 按各公司业务模式差异化 (GPU cloud 45-55%, powered shell/colo 65-80%, BTC mining 30-40%)。',
  },
  {
    label: '终端 EV/EBITDA',
    body: '12-15x (AI infra 优质资产 15x, 杠杆较重的 12x)。',
  },
  {
    label: 'WACC',
    body: '12-15% (成长期高 beta 科技基础设施)。',
  },
  {
    label: '反推路径',
    body: '当前 EV → 终端所需 EBITDA → 对应收入水平 → 从 2025A 基数计算隐含 CAGR。',
  },
];

export const impliedGrowthTable = {
  headers: [
    '公司',
    '当前 EV',
    '终端 EV/EBITDA',
    '隐含 2028E EBITDA',
    '稳态 Margin',
    '隐含 2028E Rev',
    '2025A Rev',
    '隐含 CAGR',
    'Consensus CAGR',
    'Gap',
  ],
  rows: [
    {
      verdict: 'safe',
      label: 'NBIS¹',
      cells: ['$29.9B²', '15x', '$2.0B', '45%', '$4.4B', '$530M', '105%', '204%', '+99pp ✅'],
    },
    {
      verdict: 'fair',
      label: 'CRWV',
      cells: ['$74.6B', '12x', '$6.2B', '55%', '$11.3B', '$5,130M', '30%', '35%', '+5pp ⚖️'],
    },
    {
      verdict: 'safe',
      label: 'WULF',
      cells: ['$10.0B', '15x', '$667M', '75%', '$889M', '$169M', '74%', '~95%', '+21pp ✅'],
    },
    {
      verdict: 'fair',
      label: 'APLD',
      cells: ['$10.8B', '15x', '$720M', '65%', '$1,108M', '$342M³', '80%⁴', '~80%', '0pp ⚖️'],
    },
    {
      verdict: 'safe',
      label: 'IREN',
      cells: ['$15.5B', '14x', '$1,107M', '55%', '$2,013M', '$501M', '59%', '108%', '+49pp ✅'],
    },
    {
      verdict: 'safe',
      label: 'CIFR',
      cells: ['$8.5B', '15x', '$567M', '70%', '$810M', '$224M', '53%', '~90%', '+37pp ✅'],
    },
    {
      verdict: 'fair',
      label: 'CLSK',
      cells: ['$2.9B', '10x', '$290M', '35%', '$829M', '$766M', '3%', '~12%', '+9pp ⚖️'],
    },
  ],
  notes:
    '注: ¹NBIS 使用 Core EV (扣除 $7.2B 非核心资产); ²若用全 EV $37.1B, 隐含 CAGR 升至 ~119%, 仍远低于 consensus; ³APLD 使用 FY2026E $342M 作为基数; ⁴APLD CAGR 为 FY2026 → FY2028 两年期。',
};

export const safetyMarginRules = [
  {
    verdict: 'safe',
    icon: '✅',
    label: '存在安全边际',
    criterion: 'Implied CAGR ≤ Consensus CAGR × 80%',
    companies: 'NBIS, WULF, IREN, CIFR',
  },
  {
    verdict: 'fair',
    icon: '⚖️',
    label: '合理定价',
    criterion: 'Gap 在 ±20pp 以内',
    companies: 'CRWV, APLD, CLSK',
  },
  {
    verdict: 'risk',
    icon: '❌',
    label: '无安全边际',
    criterion: 'Implied CAGR > Consensus CAGR',
    companies: '无',
  },
];

export const impliedGrowthKeyFinding = `在使用 Core EV (扣除非核心资产) 后, NBIS 的隐含 CAGR (105%) 仅需达到 consensus 的约 51% 即可证明当前估值。换言之, 即使 NBIS 的实际增速只达到 consensus 的一半, 当前股价仍然可以被合理化。这构成了显著的安全边际。`;

// ---- 第五章: NBIS $146 红队专项 ----
export const nbisNumberCheck = {
  intro: '"3.5x EV/2026E Revenue"到底对不对? 结论: 这个倍数标注有严重误导性。',
  table: {
    headers: ['计算方式', 'EV 口径', '收入口径', '实际倍数', '与 3.5x 差距'],
    rows: [
      ['表观 EV / 2026E Revenue', '$37.1B', '$3.29B', '11.3x', '3.2x 偏差'],
      ['表观 EV / 2027E Revenue', '$37.1B', '$9.73B', '3.8x', '接近'],
      ['Core EV / 2027E Revenue', '$29.9B', '$9.73B', '3.1x', '非常接近'],
      ['Core EV / 2026E ARR (Dec)', '$29.9B', '$8.0B⁵', '3.7x', '接近'],
    ],
    notes: '注: ⁵管理层指引 2026 年底 ARR $7-9B, 取中值 $8B。',
  },
  conclusion: `最可能的还原: 原论断者很可能使用了 Core EV (扣除非核心资产) / 2027E Revenue 或 Core EV / 2026 年底 ARR, 得出 ~3.1-3.7x。但将其标注为 "EV/2026E Revenue = 3.5x" 存在三重错误: 一是 EV 口径未注明扣除非核心资产, 二是收入年份标错 (2027E 非 2026E), 三是 ARR run-rate 与 recognized revenue 混淆。`,
};

export const nbisGrowthCheck = {
  intro: '"500% 增速"验证。',
  table: {
    headers: ['增速口径', '基数', '目标', '实际增速', '判断'],
    rows: [
      ['2024 → 2025 YoY', '$117.5M', '$530M', '+351%', '低于 500%'],
      ['2025 → 2026E YoY', '$530M', '$3,290M', '+521%', '约 500%, 基本准确'],
      ['2024 → 2026E 2yr CAGR', '$117.5M', '$3,290M', '+429% CAGR', '超过 500% 累计'],
    ],
  },
  analysis: `"500% 增速"指的是 2025 → 2026E, 这个数字基本准确 (~521%) — 但关键问题是: 这个增速不是"市场幻想", 而是管理层主动 guide 的 $3.0-3.4B 区间的直接结果。Management guidance 本身就隐含 ~466-542% 增速, consensus 仅略高于 guidance 上限。对标参照: CoreWeave 在 2023 → 2024 实现了 ~8x (700%+) 的收入增长 (从 ~$200M 到 $1.92B), 而 NBIS 的 ~5x 增长在 AI infra 行业并非天方夜谭。`,
};

export const nbisNonCoreAssets = {
  intro:
    'NBIS 独特估值 offset: 非核心资产 SOTP — 这是驳斥"无安全边际"论断的最有力武器。',
  table: {
    headers: ['非核心资产', 'NBIS 持股', '最新估值事件', 'NBIS 持有价值', '置信度'],
    rows: [
      [
        'ClickHouse',
        '~28% (fully diluted)',
        'Series D $15B (Jan 2026, Dragoneer 领投)',
        '$4.2B',
        '高 (第三方定价)',
      ],
      [
        'Avride',
        '~83%',
        'Uber/Nebius $375M 轮 (Oct 2025) 估值 ~$2.8B',
        '$2.3B',
        '中高 (已有外部投资人)',
      ],
      ['Toloka', '多数经济利益', '2024 收入增长 140%, 对标 Scale AI', '$400M', '中 (无外部定价)'],
      ['TripleTen', '100%', '2024 收入增长 251%, 估计 $40-60M', '$100M', '低 (无外部定价)'],
      ['合计', '', '', '~$7.0B', ''],
    ],
  },
  totalNote: `$7.0B 非核心资产相当于 NBIS 当前市值的 19%, 或每股 ~$28。这意味着: 如果你买入 NBIS, $145 中有 $28 的隐含"免费期权"来自一个 ARR $160M+ 且服务 Tesla / OpenAI / Anthropic 的数据库公司 (ClickHouse) 和一个已在达拉斯运营 robotaxi 的自动驾驶公司 (Avride)。`,
  clickhouseNote: `ClickHouse 的流动化潜力: 管理层在 earnings call 中明确表示, 若 ClickHouse 在未来数年以"显著更高估值"进行流动性事件 (可能 2027 年 IPO), NBIS 可能获得"数十亿美元"的资金来源, 用以减少未来融资需求和稀释压力。`,
};

export const nbisSpotCapacity = {
  intro: 'Spot capacity 的期权价值。',
  body: `与 CoreWeave 将 96%+ 容量锁入长期合同不同, NBIS 保留了一个 self-service / on-demand 云服务层, 面向 AI-native 创业公司和企业客户。尽管当前容量已"全部售罄"(管理层在 Q3 / Q4 2025 earnings call 中反复确认), 这一结构意味着:`,
  bullets: [
    '上行期权: 若 GPU spot 价格继续高企 (SemiAnalysis 数据显示 H100 一年期租赁价格从 2025 年 10 月的 $1.70/hr 涨至 2026 年 3 月的 $2.35/hr, 涨幅 40%), NBIS 的非长期锁定容量可以捕获价格上行。',
    '负凸性规避: 长期 take-or-pay 合同在锁定收入的同时, 也锁定了 GPU 定价权 — 如果未来 spot 价格远高于合同价, 公司放弃了上行空间。NBIS 通过保留 spot 层部分规避了这一"负凸性陷阱"。',
    '量化估计: 若 NBIS 保留 ~10-15% 产能在 spot / on-demand 模式, 按当前 spot premium 约 30% 高于合同价计算, 这对 2026E 收入的增量贡献约 $100-150M, 对估值的增量约 $1-2B。',
  ],
};

export const nbisBearArguments = [
  {
    n: 1,
    title: '资本消耗惊人',
    body: '2026E CapEx $16-20B, 是收入的 5-6x。约 40% 资金来源尚未落实, 未来进一步稀释几乎确定。Morningstar 公允价值估计仅 $91/股, 暗示 38% 下行空间。',
  },
  {
    n: 2,
    title: 'NVIDIA 股权稀释',
    body: 'NVIDIA $2B 投资对应 ~21M 股 warrants ($94.94 行权价), 若加上 $8.4B convertible notes 的潜在转换 (~24M 股), 完全稀释股本可达 ~315M, 使每股收益被摊薄 ~25%。',
  },
  {
    n: 3,
    title: '客户集中度极端',
    body: 'Microsoft + Meta 占 backlog 60%+。若任一方缩减支出或推迟交付, 影响是灾难性的。Meta 的 $27B 合同要到 2027 年才开始交付 — 中间有 execution gap。',
  },
  {
    n: 4,
    title: 'Hyperscaler 自研替代',
    body: 'Google (TPU)、Amazon (Trainium)、Meta (MTIA) 均在加速自研芯片, 长期可能削弱对第三方 GPU cloud 的需求。',
  },
  {
    n: 5,
    title: '前 Yandex 资产的感知折价',
    body: '尽管已完全剥离俄罗斯业务 (2024 年 7 月以 $5.4B 完成), 部分 ESG 基金和机构配置者仍存在顾虑, 可能限制投资者基础和倍数扩张空间。',
  },
];

export const nbisBullArguments = [
  {
    n: 1,
    title: '非核心资产提供 $7B 下行缓冲',
    body: '相当于每股 $28 的"免费"期权, 仅 ClickHouse 一项 (Series D $15B 估值) 就价值 $4.2B。',
  },
  {
    n: 2,
    title: '净现金头寸接近平衡',
    body: 'Pro forma 现金约 $8-10B vs 债务 $8.4B, 且 convertible notes 利率极低 (blended ~1.8%), 利息负担远低于 CRWV (~11%)。',
  },
  {
    n: 3,
    title: 'Backlog 质量板块最优',
    body: 'EV/RA-Backlog 1.50x 为 7 家最低; $1.58B deferred revenue (客户预付款) 已在资产负债表上, 提供了硬性的现金流能见度。',
  },
  {
    n: 4,
    title: 'Consensus 持续上修',
    body: '过去 3 个月收入预期上调 9.36%; 17 位分析师中 10 位给出 Buy / Strong Buy, 均价目标 $162-168, 高端 $291。',
  },
  {
    n: 5,
    title: '欧洲主权云结构性优势',
    body: 'EU AI Act 数据驻留要求下, NBIS 是唯一在欧洲拥有大规模自有基础设施的 neocloud (芬兰 Mäntsälä 75MW 运营 + Lappeenranta 310MW 在建), AWS / Azure 面临更大的监管摩擦。',
  },
];

export const nbisFinalVerdict = {
  intro: '红队终局判定: "$146 NBIS 无安全边际"这一论断 — 部分正确, 但核心数字基础错误, 整体结论偏误导。',
  table: {
    headers: ['维度', '判定', '说明'],
    rows: [
      [
        '"3.5x EV/2026E Revenue"',
        { tone: 'risk', text: '❌ 错误' },
        '实际 ~11.3x; 可能是 Core EV/2027E 的误标',
      ],
      [
        '"Price in 500% 增速"',
        { tone: 'safe', text: '✅ 基本正确' },
        '2025 → 2026E ~521%; 但这是管理层 guidance 本身隐含的增速, 不是市场幻想',
      ],
      [
        '"无安全边际"',
        { tone: 'fair', text: '⚠️ 过于绝对' },
        '在 Core EV 口径下, 隐含 CAGR (105%) 显著低于 consensus (204%); 非核心资产和净现金提供 $7-8B 缓冲; 但 capital intensity 和客户集中度确实压缩了安全边际',
      ],
      [
        '综合判断',
        { tone: 'fair', text: '反驳为主, 部分认同' },
        'NBIS 在 $145 具有 moderate margin of safety (约 20-30%), 并非"零安全边际"。但也不是深度低估 — 公允价值区间估计 $120-180 (Base ~$135, Bull ~$175), 当前价格处于合理偏上位置',
      ],
    ],
  },
  advice: `操作建议: 以 $145 持有是合理的; 若回调至 $120 以下可加仓; $100 以下属于深度低估 (此时 Core EV/2027E Revenue <2.5x, 非核心资产覆盖 EV 的 25%+)。上方 $170+ 需要 2026 guidance beat 的催化剂。`,
};

// ---- 第六章: 7 公司安全边际综合排序 ----
export const growthScorecard = {
  headers: ['排名', '公司', '隐含 CAGR', 'Consensus CAGR', 'Gap', '信号'],
  rows: [
    { tone: 'safe', cells: ['1', 'NBIS', '105%', '204%', '+99pp', '🟢 强安全边际'] },
    { tone: 'safe', cells: ['2', 'IREN', '59%', '108%', '+49pp', '🟢 安全边际'] },
    { tone: 'safe', cells: ['3', 'CIFR', '53%', '~90%', '+37pp', '🟢 安全边际'] },
    { tone: 'safe', cells: ['4', 'WULF', '74%', '~95%', '+21pp', '🟢 安全边际(边缘)'] },
    { tone: 'fair', cells: ['5', 'CLSK', '3%', '~12%', '+9pp', '🟡 合理定价'] },
    { tone: 'fair', cells: ['6', 'CRWV', '30%', '35%', '+5pp', '🟡 合理定价'] },
    { tone: 'fair', cells: ['7', 'APLD', '80%', '~80%', '~0pp', '🟡 合理定价(无安全边际)'] },
  ],
};

export const backlogRanking = {
  headers: ['排名', '公司', 'RA-Backlog', 'EV/RA-Backlog', '关键优势', '关键风险'],
  rows: [
    [
      '1',
      'NBIS',
      '$24.7B',
      '1.50x',
      'IG 客户、预付款、低 WARL',
      'Meta 交付始于 2027',
    ],
    [
      '2',
      'CRWV',
      '$30.1B',
      '2.48x',
      '规模最大、客户多元化改善',
      '债务 $21B+、利息 ~11%',
    ],
    [
      '3',
      'CIFR',
      '$3.1B',
      '2.74x',
      'AWS + Google 双 IG、非追索权债务',
      'HPC 收入 2H26 才开始',
    ],
    ['4', 'WULF', '$4.5B', '2.22x', 'Google 信用增级、核能电力', '施工进度风险'],
    [
      '5',
      'APLD',
      '$3.7B',
      '2.92x',
      '15 年长期租赁、固定利率债务',
      'CoreWeave 集中度极高',
    ],
    [
      '6',
      'IREN',
      '$4.0B',
      '3.88x',
      'MSFT $9.7B 大单、GPU 布局',
      'GPU 技术过时风险、高杠杆',
    ],
    [
      '7',
      'CLSK',
      '$0',
      'N/A',
      '1.8GW 电力资产、BTC 储备',
      '零 AI 合同、纯 BTC 风险',
    ],
  ],
};

export const finalRanking = [
  {
    rank: 1,
    ticker: 'NBIS',
    stars: 5,
    position: '核心持仓',
    logic:
      '隐含增速远低于 consensus、板块最优 backlog 质量、$7B 非核心资产缓冲、净现金平衡、NVIDIA 战略背书。$145 处于合理偏上但有安全边际。',
  },
  {
    rank: 2,
    ticker: 'WULF',
    stars: 4,
    position: '核心持仓',
    logic:
      '$12.8B 签约 backlog 已锁定 HPC 转型路径、Google 信用增级、核能电力成本优势、主动退出 BTC mining。风险在 $5.7B 债务和施工时间表。',
  },
  {
    rank: 3,
    ticker: 'CIFR',
    stars: 4,
    position: '战术仓 (可升级)',
    logic:
      'AWS + Google 双 IG 客户、$9.3B 合同、powered shell 模式 (零 GPU 风险)、非追索权固定利率项目债。短板: HPC 收入尚未启动, 2026 可能无催化剂。',
  },
  {
    rank: 4,
    ticker: 'CRWV',
    stars: 3,
    position: '战术仓 (谨慎)',
    logic:
      '规模之王 ($66.8B backlog)、业务已验证 ($5.1B 收入), 但 $21B+ 债务、~11% 利息成本和 $30-35B 2026 CapEx 构成巨大的资产负债表风险。按 EBITDA 合理, 按 FCF 极不友好。',
  },
  {
    rank: 5,
    ticker: 'APLD',
    stars: 3,
    position: '战术仓 (对冲 CRWV)',
    logic:
      'Data center lessor 模式 (无 GPU 风险) 在概念上有吸引力, 但本质上是"CoreWeave 的房东" — CRWV 信用风险直接传导。$16B backlog 对 ~$10.8B EV 看似便宜, 但 15 年期限的 PV 折扣后吸引力下降。',
  },
  {
    rank: 6,
    ticker: 'IREN',
    stars: 2,
    position: '回避 / 小仓',
    logic:
      'MSFT $9.7B 大单和 GPU 规模 (23K → 140K) 令人印象深刻, 但 EV/RA-Backlog 板块最高 (3.88x)、GPU 模式承担技术过时风险、BTC mining 业务仍占收入 95%+。$3.4B ARR by year-end 2026 的目标激进。',
  },
  {
    rank: 7,
    ticker: 'CLSK',
    stars: 1,
    position: '回避',
    logic:
      '纯 BTC miner, 零 AI 合同, 在 neocloud 板块中属于"概念股"而非"执行股"。1.8GW 电力资产有价值, 但货币化路径不明确。最适合作为 BTC 周期的杠杆工具, 而非 AI infra 仓位。',
  },
];

export const frameworkValidation = {
  intro:
    '用户原始框架: NBIS / WULF 核心持仓、CIFR / APLD 战术仓、CLSK / IREN 回避。验证结论: 框架基本成立, 但有两处微调建议。',
  adjustments: [
    {
      heading: 'CIFR 可考虑升级至准核心',
      body: '其 AWS + Google 双 IG 客户组合、non-recourse 固定利率项目债和 powered shell 模式在 downside protection 上可能优于 WULF (后者有 $5.7B 债务压力)。若 CIFR 在 2026 下半年如期开始 HPC 交租, 估值重评空间较大。',
    },
    {
      heading: 'CRWV 需纳入战术仓考量',
      body: '尽管债务风险突出, 但 $66.8B backlog 和 $5.1B 已实现收入使其成为板块不可忽视的 beta。建议作为 NBIS 核心仓的 pair trade 对冲 (long NBIS / monitor CRWV), 而非完全忽略。',
    },
  ],
};

// ---- 第七章: 风险提示与未决问题 ----
export const systemicRisks = [
  {
    title: 'Hyperscaler CapEx 周期拐点',
    body: '若 MSFT / META / GOOG 在 2027 年削减 AI CapEx 预算, 所有 neocloud 公司同时受压。Goldman Sachs 估计 US 数据中心供需缺口 2026 年为 9GW, 但 2027-2028 可能快速收窄。',
  },
  {
    title: 'GPU 价格崩跌风险',
    body: '当前 H100 spot 价格处于历史高位 ($2.35/hr), 一旦 NVIDIA Blackwell / Vera Rubin 大规模交付且需求不及预期, spot 价格下行将压缩所有 GPU cloud 运营商的利润率。',
  },
  {
    title: '利率环境',
    body: '尽管多数公司已锁定固定利率或低利率 convertible 融资, 但未来再融资需求 (特别是 CRWV 的 ~$21B 债务栈) 在高利率环境下构成尾部风险。',
  },
];

export const companyOpenQuestions = [
  {
    ticker: 'NBIS',
    questions:
      '2026 CapEx 40% 资金缺口如何填补? ClickHouse 是否在 2027 年 IPO? Meta $27B 合同的具体交付节奏?',
  },
  {
    ticker: 'CRWV',
    questions:
      'Microsoft 是否真如其 CEO 所述"一次性"交易? $6.1B convertible 转股对股价的稀释冲击何时到来?',
  },
  {
    ticker: 'WULF',
    questions: 'Lake Mariner CB2-CB5 建设是否按时上线? Google credit enhancement 的具体条款?',
  },
  {
    ticker: 'APLD',
    questions:
      'ChronoScale (Cloud Services 分拆) 是否影响估值? Macquarie $5B facility 的实际提取节奏?',
  },
  {
    ticker: 'IREN',
    questions:
      '140K GPU 部署到 year-end 2026 是否现实? GPU financing 的 <6% 利率是否持续可用?',
  },
  {
    ticker: 'CIFR',
    questions: 'AWS Black Pearl (300MW) 7 月 1 日如期交租? Colchis 1GW 开发的电力接入时间表?',
  },
  {
    ticker: 'CLSK',
    questions: '何时签下首个 AI / HPC 合同? BTC halving 后的挖矿经济性 (当前 all-in cost vs BTC 价格)?',
  },
];

export const disclaimer = `数据质量声明: 本报告中 consensus 数据主要来源为 TIKR (15 位分析师覆盖 NBIS)、StockAnalysis、Yahoo Finance, 数据抓取日期为 2026 年 4 月 10-13 日。部分公司 (WULF、CIFR) 的远期 consensus 覆盖较薄 (5 位以下分析师), 预测置信度相应降低。所有 backlog 风险调整系数为作者基于公开信息的判断性赋值, 非精算模型输出, 应视为方向性框架而非精确估值。本报告仅供研究参考, 不构成任何投资建议。`;
