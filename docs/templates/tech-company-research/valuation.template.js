// <COMPANY_NAME> (<TICKER>) 估值与一致预期数据
// 数据来源：Yahoo Finance / Morningstar / WallStreetZen / sell-side 研报
// 截止日期：YYYY-MM-DD 收盘
// 注：精确数字以 Bloomberg / Visible Alpha 终端为准

// ---------------------------------------------------------------------------
// SOTP（Sum-of-the-Parts）分部估值表
// ---------------------------------------------------------------------------
// 按业务分部拆分 TTM 营收 / 经营利润, 并给出可比公司倍数参考与隐含估值
// 公司差异化：仅适用于多分部公司（Alphabet / Meta / MSFT 等）
//   - 单业务公司（NVDA Datacenter 主导）可省略 SOTP, 仅保留 valuationSnapshot
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
      '待补：主业分部名称',
      '待补', // TTM 营收, 字符串（如 "~355"）
      '待补', // TTM 经营利润
      '待补：可比公司 + 倍数（如 "Meta（EV/Sales 8-10x）；广告业务"）',
      '待补：隐含估值（如 "~3,000"）',
    ],
    [
      '待补：云分部名称',
      '待补',
      '待补',
      '待补',
      '待补',
    ],
    [
      '待补：战略孵化分部名称',
      '待补',
      '待补', // 通常为亏损, 用括号表示（如 "(8.4)"）
      '待补',
      '待补',
    ],
    [
      '净现金 + MS + 非流动股权',
      '—',
      '—',
      '加回市值',
      '待补',
    ],
  ],
  notes:
    '待补：SOTP 估值的核心叙事（TTM 数据口径 / 隐形资产 / 倍数选择依据 / 与同业对比）',
};

// ---------------------------------------------------------------------------
// 估值快照 - 截止 YYYY-MM-DD 收盘
// ---------------------------------------------------------------------------
// 涵盖股价、市值、TTM 财务指标、估值倍数、收益率
// 表格结构：headers + rows（每行 ['指标', '数值', '备注']）
export const valuationSnapshot = {
  headers: ['指标', '数值', '备注'],
  rows: [
    [
      '股价（<TICKER>）',
      '待补：$XXX.XX',
      '待补：股价时点说明（如 "历史新高（YYYY-MM-DD）"）',
    ],
    [
      '市值',
      '待补：$X.XXT',
      '待补：市值排名 / 同业位置',
    ],
    [
      '52 周区间',
      '待补：$XXX.XX – $XXX.XX',
      '待补：1Y 涨跌幅',
    ],
    [
      '月度涨幅',
      '待补：~+XX%',
      '待补：月度表现的历史定位',
    ],
    [
      '流通股本',
      '待补：XX,XXXM',
      '待补：Diluted ~XX,XXXM',
    ],
    [
      'TTM 营收',
      '待补：$XXX.XB',
      '待补：TTM 区间（如 "Q-3 + Q-2 + Q-1 + Q0"）',
    ],
    [
      'TTM Net Income (GAAP)',
      '待补：$XXX.XB',
      '待补：是否含一次性影响（如 "含 Q0 $XX.XB 未实现股权增值税后净额"）',
    ],
    [
      'TTM Net Income (核心, 剔除一次性)',
      '待补：~$XXXB',
      '待补：粗算说明',
    ],
    [
      'TTM EPS (GAAP)',
      '待补：~$XX.XX',
      '—',
    ],
    [
      'TTM EPS (核心)',
      '待补：~$XX.XX',
      '待补：剔除项说明',
    ],
    [
      'P/E (GAAP TTM)',
      '待补：~XX.Xx',
      '—',
    ],
    [
      'P/E (核心 TTM)',
      '待补：~XX.Xx',
      '—',
    ],
    [
      'P/S (TTM)',
      '待补：~XX.Xx',
      '—',
    ],
    [
      'FCF Yield (TTM)',
      '待补：X.XX%',
      '待补：FCF / 市值, 与历史均值对比',
    ],
    [
      '分红收益率',
      '待补：X.XX%',
      '待补：每股年化股利 / 股价',
    ],
  ],
  caveat:
    '估值数据来自 Yahoo Finance / Morningstar / WallStreetZen 横向交叉验证；精确数字需以 Bloomberg / Visible Alpha 终端为准。',
};

// ---------------------------------------------------------------------------
// 卖方分析师目标价（sell-side consensus）
// ---------------------------------------------------------------------------
// tone 取值：positive / neutral / negative, 用于前端着色
// 建议至少包含 4 行：2 个看多大行 + 1 个看空机构 + 1 个 X 家机构平均
export const analystTargets = {
  headers: ['机构', '目标价 ($)', '动作', 'Tone'],
  rows: [
    {
      firm: '待补：看多机构 1（如 "Goldman Sachs (analyst name)"）',
      target: null,
      action: '待补：动作描述（如 "Q4 2025 财报后从 $375 上调至 $400"）',
      tone: 'positive',
    },
    {
      firm: '待补：看多机构 2',
      target: null,
      action: '待补',
      tone: 'positive',
    },
    {
      firm: '待补：看空机构（如 "Morningstar (Fair Value)"）',
      target: null,
      action: '待补：看空理由',
      tone: 'negative',
    },
    {
      firm: '待补：X 家机构平均',
      target: null,
      action: '待补：12 个月平均目标价（vs 现价的偏离度）',
      tone: 'neutral',
    },
  ],
  caveat:
    '目标价数据来自第三方汇总, 精确数字需以 Bloomberg / Visible Alpha 终端为准。',
};

// ---------------------------------------------------------------------------
// 公司前瞻指引对比表（上一季度 vs 当季）
// ---------------------------------------------------------------------------
// tone 取值：safe（利好）/ fair（中性偏关注）/ risk（风险）/ neutral（无变化）
// 关注 6 项关键指引的逐季变化
export const forwardGuidanceTable = {
  headers: [
    '项目',
    '上一季度财报口径',
    '当季财报口径（最新）',
    '变化',
  ],
  rows: [
    [
      '本年全年 Capex',
      '待补：上季指引',
      '待补：当季指引',
      { tone: 'risk', text: '待补：变化标签' },
    ],
    [
      '次年全年 Capex',
      '待补',
      '待补',
      { tone: 'risk', text: '待补' },
    ],
    [
      'Cloud / 主业产能约束',
      '待补',
      '待补',
      { tone: 'fair', text: '待补' },
    ],
    [
      'Cloud / 主业利润率',
      '待补',
      '待补',
      { tone: 'safe', text: '待补' },
    ],
    [
      '服务器折旧年限假设',
      '待补',
      '待补',
      { tone: 'neutral', text: '待补' },
    ],
    [
      '营收 / EPS 数字指引',
      '待补',
      '待补',
      { tone: 'neutral', text: '待补' },
    ],
  ],
  notes:
    '待补：三个最关键的指引变化总结（用 ★ 标记）',
};
