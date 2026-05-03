// Alphabet (GOOGL) 估值与一致预期数据
// 数据来源：Yahoo Finance / Morningstar / WallStreetZen / sell-side 研报
// 截止日期：2026-05-01 收盘
// 注：精确数字以 Bloomberg / Visible Alpha 终端为准

// ---------------------------------------------------------------------------
// SOTP（Sum-of-the-Parts）分部估值表
// ---------------------------------------------------------------------------
// 按业务分部拆分 TTM 营收 / 经营利润，并给出可比公司倍数参考与隐含估值
export const sotpTable = {
  headers: [
    '分部',
    'TTM 营收 ($B)',
    'TTM 经营利润 ($B)',
    '可比公司 / 倍数参考',
    '隐含估值 ($B)',
  ],
  rows: [
    [
      'Google Services',
      '~355',
      '~147',
      'Meta（EV/Sales 8-10x）；广告业务',
      '~3,000',
    ],
    [
      'Google Cloud',
      '~67',
      '~18',
      'AWS / Azure 隐含 EV/Sales 8-12x；加速增长 + 利润率扩张',
      '~700',
    ],
    [
      'Other Bets',
      '~1.5',
      '(8.4)',
      'Waymo 单独估值，可参 Cruise / Tesla Robotaxi 隐含',
      '~150-300',
    ],
    [
      '净现金 + MS + 非流动股权',
      '—',
      '—',
      '加回市值',
      '234',
    ],
  ],
  notes:
    'TTM 数据以 Q2 25 + Q3 25 + Q4 25 + Q1 26 加和；非流动股权证券 $107B（含 Anthropic / SpaceX / CoreWeave 等）是 SOTP 估值的"隐形资产"。Cloud 估值倍数与产能约束、订单簿质量直接相关 — RPO 5.8x 倍数显著高于 AWS/Azure 同类指标。',
};

// ---------------------------------------------------------------------------
// 估值快照 - 截止 2026-05-01 收盘
// ---------------------------------------------------------------------------
// 涵盖股价、市值、TTM 财务指标、估值倍数、收益率
export const valuationSnapshot = {
  headers: ['指标', '数值', '备注'],
  rows: [
    [
      '股价（GOOGL Class A）',
      '$385.69',
      '历史新高（2026-05-01）',
    ],
    [
      '市值',
      '$4.67T',
      '全球第二大上市公司（仅次于 NVDA / MSFT 之一）',
    ],
    [
      '52 周区间',
      '$147.84 – $386.76',
      '1Y +139%',
    ],
    [
      '4 月单月涨幅',
      '~+34%',
      '自 2004 年 IPO 以来最佳月度表现',
    ],
    [
      '流通股本',
      '12,116M（Class A）',
      'Diluted ~12,238M',
    ],
    [
      'TTM 营收',
      '$422.5B',
      'Q2 25 + Q3 25 + Q4 25 + Q1 26',
    ],
    [
      'TTM Net Income (GAAP)',
      '$160.2B',
      '含 Q1 26 $28.7B 未实现股权增值税后净额',
    ],
    [
      'TTM Net Income (核心，剔除股权未实现)',
      '~$130B',
      '粗算，精确需逐季回溯',
    ],
    [
      'TTM EPS (GAAP)',
      '~$13.10',
      '—',
    ],
    [
      'TTM EPS (核心)',
      '~$10.65',
      '剔除 Q1 26 $2.35 一次性影响',
    ],
    [
      'P/E (GAAP TTM)',
      '~29.4x',
      '—',
    ],
    [
      'P/E (核心 TTM)',
      '~36.2x',
      '—',
    ],
    [
      'P/S (TTM)',
      '~11.0x',
      '—',
    ],
    [
      'FCF Yield (TTM)',
      '1.38%',
      '$64.4B / $4.67T；资本周期高峰下显著低于历史',
    ],
    [
      '分红收益率',
      '0.23%',
      '$0.22 × 4 / $385',
    ],
  ],
  caveat:
    '估值数据来自 Yahoo Finance / Morningstar / WallStreetZen 横向交叉验证；精确数字需以 Bloomberg / Visible Alpha 终端为准。',
};

// ---------------------------------------------------------------------------
// 卖方分析师目标价（sell-side consensus）
// ---------------------------------------------------------------------------
// tone 取值：positive / neutral / negative，用于前端着色
export const analystTargets = {
  headers: ['机构', '目标价 ($)', '动作', 'Tone'],
  rows: [
    {
      firm: 'Goldman Sachs (Eric Sheridan)',
      target: 400,
      action: 'Q4 2025 财报后从 $375 上调至 $400',
      tone: 'positive',
    },
    {
      firm: 'JPMorgan (Doug Anmuth)',
      target: 395,
      action: '上调至 $395',
      tone: 'positive',
    },
    {
      firm: 'Morningstar (Fair Value)',
      target: 215,
      action: '显著看空：当前价存在大幅高估',
      tone: 'negative',
    },
    {
      firm: '58 家机构平均',
      target: 379,
      action: '12 个月平均目标价（略低于现价 $385.69）',
      tone: 'neutral',
    },
  ],
  caveat:
    '目标价数据来自第三方汇总，精确数字需以 Bloomberg / Visible Alpha 终端为准。当前价 $385.69 已突破多数 sell-side 12 个月目标价。',
};

// ---------------------------------------------------------------------------
// 公司前瞻指引对比表（Q4 2025 vs Q1 2026）
// ---------------------------------------------------------------------------
// tone 取值：safe（利好）/ fair（中性偏关注）/ risk（风险）/ neutral（无变化）
export const forwardGuidanceTable = {
  headers: [
    '项目',
    'Q4 2025 财报口径',
    'Q1 2026 财报口径（最新）',
    '变化',
  ],
  rows: [
    [
      '2026 全年 Capex',
      '$175-185B',
      '$180-190B（上调 $5B）',
      { tone: 'risk', text: '↑ $5B' },
    ],
    [
      '2027 全年 Capex',
      '未给出',
      '"将显著增加"（CFO 口径）',
      { tone: 'risk', text: '★ 新增前瞻' },
    ],
    [
      'Cloud 产能约束',
      '已存在',
      '"仍受算力约束"',
      { tone: 'fair', text: '持续' },
    ],
    [
      'Cloud 利润率',
      'Q4 2025 已达 30.1%',
      'Q1 2026 32.9%，趋势延续',
      { tone: 'safe', text: '+280bps' },
    ],
    [
      '服务器折旧年限假设',
      '6 年（2024 年从 4 年延长）',
      '维持 6 年（未再调整）',
      { tone: 'neutral', text: '稳定' },
    ],
    [
      '营收 / EPS 数字指引',
      '不提供',
      '不提供（Alphabet 长期惯例）',
      { tone: 'neutral', text: '一贯' },
    ],
  ],
  notes:
    '★ 三个最关键的指引变化：(1) CapEx 全年中位数从 $180B 上调到 $185B；(2) 首次明确 2027 capex 将"显著增加"；(3) Cloud 利润率从 30.1% 提到 32.9%，扩张趋势延续。',
};
