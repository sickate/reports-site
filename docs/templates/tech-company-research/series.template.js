// ============================================================
// <COMPANY_NAME> (<TICKER>) 季度财务时间序列与拆分明细
// 数据范围：5 个连续季度（最早 → 最新）
// 数据来源：公司 10-Q / 10-K 披露与季度业绩发布会
// 单位约定：除明确标注外, 金额一律为百万美元 ($M)
//          百分比为以小数点 1 位呈现的百分比数值（如 33.9 = 33.9%）
//          员工人数为期末口径（绝对值, 无单位）
// 季度顺序：所有 quarters 字段按 5 个季度由旧到新排列
//          所有数组长度严格为 5, 缺失值用 null 占位
// ============================================================

// ============================================================
// Export 1: 季度核心指标时间序列
// 用途：驱动 5 季度趋势图（营收、分部、利润率、Capex、FCF、回购等）
// 包含模块：
//   1) 总营收
//   2) 分部营收（公司差异化, 默认按 Services / Cloud / Other 三段）
//   3) 利润率（集团 + 各分部）
//   4) 现金流（Capex / OCF / FCF）
//   5) 资本配置（SBC / 回购 / 股利 / 净回购）
//   6) 运营前瞻（Cloud RPO / 员工数 / 摊薄股本）
//   7) 折旧与 TAC
// ============================================================
export const quarterlySeries = {
  quarters: ['Q-4', 'Q-3', 'Q-2', 'Q-1', 'Q0'], // 5 季度标签, 替换为如 ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26']

  // —— 总营收 ——
  // revenue：合并报表口径总营收（已扣除 hedging gains/losses）
  // revenueYoy：同比增速, 单位为百分点（绝对值）
  revenue: [null, null, null, null, null],
  revenueYoy: [null, null, null, null, null],

  // —— 分部营收 ——
  // 公司差异化提示：
  //   - Alphabet: Services / Cloud / Other Bets / Hedging
  //   - Meta:     FamilyOfApps / RealityLabs
  //   - MSFT:     Productivity / IntelligentCloud / MorePersonalComputing
  //   - NVDA:     Datacenter / Gaming / ProViz / Auto / OEM
  // 各分部相加 ≈ 总营收（含 hedging 调整）
  segmentServices: [null, null, null, null, null], // 主业 / 现金牛分部
  segmentCloud: [null, null, null, null, null], // 云 / 增长引擎分部
  segmentOtherBets: [null, null, null, null, null], // 战略孵化 / 长期布局分部
  segmentHedging: [null, null, null, null, null], // 外汇套保（可选, 无套保则全部 null）

  // —— 利润率 ——
  // 集团整体经营利润与利润率（GAAP, 含 SBC）
  opIncome: [null, null, null, null, null],
  opMargin: [null, null, null, null, null],
  // 主业（Services 等）分部利润与利润率
  servicesOpInc: [null, null, null, null, null],
  servicesOpMargin: [null, null, null, null, null],
  // 云分部利润与利润率
  // 持续扩张通常是核心叙事
  cloudOpInc: [null, null, null, null, null],
  cloudOpMargin: [null, null, null, null, null],

  // —— 现金流 ——
  // capex：资本开支, AI 数据中心建设是当下主要驱动
  // capexPctRevenue：Capex 强度（资本密度）, 反映长期结构性压力
  capex: [null, null, null, null, null],
  capexPctRevenue: [null, null, null, null, null],
  // ocf：经营现金流；fcf = ocf − capex
  // fcfMargin = fcf / revenue（衡量真实自由现金流转化率）
  ocf: [null, null, null, null, null],
  fcf: [null, null, null, null, null],
  fcfMargin: [null, null, null, null, null],

  // —— 资本配置 ——
  // sbc：股权激励费用；sbcPctRevenue 反映稀释强度趋势
  sbc: [null, null, null, null, null],
  sbcPctRevenue: [null, null, null, null, null],
  // buyback：当期股票回购金额
  buyback: [null, null, null, null, null],
  // dividend：现金股利
  dividend: [null, null, null, null, null],
  // 净回购 = 回购 − SBC（衡量真实股本回报）
  // 出现负值意味着回购未能完全抵消 SBC 稀释, 是关注信号
  netBuyback: [null, null, null, null, null],

  // —— 运营 / 前瞻 ——
  // cloudRpoBn：Cloud 剩余履约义务（Remaining Performance Obligation）
  // 反映在手订单储备, 单位为十亿美元（公司差异化, 仅适用有云业务的公司）
  cloudRpoBn: [null, null, null, null, null],
  // headcount：期末员工人数
  headcount: [null, null, null, null, null],
  // dilutedShares：摊薄后流通股数（百万股）, 反映净稀释/回购效果
  dilutedShares: [null, null, null, null, null],

  // —— 折旧 / TAC ——
  // da：折旧与摊销（D&A）, 是 Capex 上行向利润表传导的滞后指标
  da: [null, null, null, null, null],
  // tac：流量获取成本（Traffic Acquisition Cost）
  // 公司差异化：仅适用广告业务公司（Alphabet/Meta）, 其他公司可全部 null
  // tacPctAdRev：TAC 占广告收入比例, 反映分发议价权
  tac: [null, null, null, null, null],
  tacPctAdRev: [null, null, null, null, null],
};

// ============================================================
// Export 2: 主业分部业务线营收明细
// 用途：拆解主业（Services / FamilyOfApps / Productivity 等）内部业务线季度趋势
// 表格结构：headers + rows（rows 末列为 YoY 字符串）
// 公司差异化提示：
//   - Alphabet: Search / YouTube ads / Network / Subscriptions
//   - Meta:     Ads / Reality Labs / Other
//   - MSFT:     M365 Commercial / M365 Consumer / LinkedIn / Dynamics
// ============================================================
export const servicesBreakdown = {
  headers: [
    '业务线 ($M)',
    'Q-4', // 替换为实际季度标签
    'Q-3',
    'Q-2',
    'Q-1',
    'Q0',
    'YoY (Q0)',
  ],
  rows: [
    ['待补：业务线 1', null, null, null, null, null, '待补'],
    ['待补：业务线 2', null, null, null, null, null, '待补'],
    ['待补：业务线 3', null, null, null, null, null, '待补'],
    ['待补：广告/主业小计', null, null, null, null, null, '待补'],
    ['待补：业务线 4', null, null, null, null, null, '待补'],
    ['待补：主业合计', null, null, null, null, null, '待补'],
  ],
  notes: '待补：业务线明细的核心叙事说明（如加速 / 减速 / 内部份额转移）',
};

// ============================================================
// Export 3: 地区营收明细（最旧季度 vs 最新季度同比对比）
// 用途：地区维度的同比对比, 含报告增速与常数汇率（FX-neutral）增速
// 注意：合计行已扣除 hedging 影响, 不等于四地区简单求和
// 地区口径（默认）：United States / EMEA / APAC / Other Americas
// 公司差异化：可按公司披露口径调整（如部分公司只披露 US vs International）
// ============================================================
export const geoRevenueTable = {
  headers: ['地区 ($M)', 'Q-4', 'Q0', 'YoY 报告', 'YoY 常数汇率'],
  rows: [
    ['United States', null, null, '待补', '待补'],
    ['EMEA', null, null, '待补', '待补'],
    ['APAC', null, null, '待补', '待补'],
    ['Other Americas', null, null, '待补', '待补'],
    ['合计（扣除 hedging）', null, null, '待补', '待补'],
  ],
  notes: '待补：地区结构变化的核心叙事（FX 影响 / 海外份额 / 区域监管）',
};

// ============================================================
// Export 4: TAC（流量获取成本）时间序列
// 用途：单独跟踪 TAC 趋势, 验证默认搜索协议续约成本控制力
// 公司差异化：仅适用广告业务公司, 其他公司可整体省略此 export
// 字段说明：
//   - tac：当期 TAC 金额, 单位 $M
//   - pctAdRev：TAC 占广告收入的比例（%）
// 投研意义：TAC 比率下行 = 自身分发议价能力提升 → 利润率扩张
// ============================================================
export const tacSeries = {
  quarters: ['Q-4', 'Q-3', 'Q-2', 'Q-1', 'Q0'],
  tac: [null, null, null, null, null],
  pctAdRev: [null, null, null, null, null],
  insight: '待补：TAC 比率走势的投研判断（议价权 / 协议续约风险）',
};

// ============================================================
// Export 5: 成本结构季度时序
// 用途：拆解四大费用项, 关注费用增速 vs 营收增速的剪刀差
// 费用项：
//   - Cost of revenues：销货成本（含 TAC + 数据中心运营 + 内容成本）
//   - R&D：研发投入（AI 人才薪酬 + 折旧大头）
//   - Sales & Marketing：销售与营销
//   - G&A：管理费用（含法务/合规/罚款）
//   - Total OpEx：总运营开支 = 上述四项之和
// ============================================================
export const costStructure = {
  headers: [
    '费用项 ($M)',
    'Q-4',
    'Q-3',
    'Q-2',
    'Q-1',
    'Q0',
    'YoY (Q0)',
  ],
  rows: [
    ['Cost of revenues', null, null, null, null, null, '待补'],
    ['R&D', null, null, null, null, null, '待补'],
    ['Sales & Marketing', null, null, null, null, null, '待补'],
    ['G&A', null, null, null, null, null, '待补'],
    ['Total OpEx', null, null, null, null, null, '待补'],
  ],
  insights: [
    '待补：R&D 增速对比营收增速的判断',
    '待补：COGS 与运营杠杆的判断',
    '待补：G&A 中是否含一次性罚款 / 法律费用',
  ],
};

// ============================================================
// Export 6: 员工人数季度时序与人均产出
// 用途：跟踪人效改善节奏（运营杠杆的核心证据之一）
// 字段说明：
//   - headcount：期末员工总数（绝对值）
//   - yoy：同比增速字符串（首位为 null, 因为没有 Q-8 基数）
//   - revenuePerEmployee：人均年化营收, 单位 $M
//     仅在期初/期末两点（Q-4 与 Q0）展示, 中间季度留 null
//     计算口径：当季营收 × 4 ÷ 期末员工数
// ============================================================
export const headcountSeries = {
  quarters: ['Q-4', 'Q-3', 'Q-2', 'Q-1', 'Q0'],
  headcount: [null, null, null, null, null],
  yoy: [null, '待补', '待补', '待补', '待补'],
  revenuePerEmployee: [null, null, null, null, null],
  insight: '待补：人效与运营杠杆判断（如 "人均年化营收 YoY +X%"）',
};

// ============================================================
// Export 7: 折旧与摊销（D&A）季度时序
// 用途：跟踪 Capex 上行周期向利润表的传导节奏
// 字段说明：
//   - da：当期 D&A 金额
//   - yoy：同比增速字符串（首位 null）
// 投研意义：
//   D&A 加速 = Capex 滞后 4-6 季度后的利润表压力
//   关注 D&A YoY 大幅跳升 = Capex 周期开始消化的关键拐点信号
// ============================================================
export const daSeries = {
  quarters: ['Q-4', 'Q-3', 'Q-2', 'Q-1', 'Q0'],
  da: [null, null, null, null, null],
  yoy: [null, '待补', '待补', '待补', '待补'],
  insight: '待补：D&A 节奏与 Capex 周期传导判断',
};

// ============================================================
// Export 8: 股权激励（SBC）季度时序与利润率对比
// 用途：评估 SBC 真实稀释影响与 GAAP/Non-GAAP 利润率差异
// 字段说明：
//   - sbc：当期股权激励费用
//   - pctRevenue：SBC 占营收比例（衡量稀释强度趋势）
//   - opMarginGaap：GAAP 经营利润率（含 SBC, 与 quarterlySeries 一致）
//   - opMarginExSbc：剔除 SBC 后的经营利润率
//     计算口径：(opIncome + sbc) / revenue × 100
// ============================================================
export const sbcSeries = {
  quarters: ['Q-4', 'Q-3', 'Q-2', 'Q-1', 'Q0'],
  sbc: [null, null, null, null, null],
  pctRevenue: [null, null, null, null, null],
  opMarginGaap: [null, null, null, null, null],
  opMarginExSbc: [null, null, null, null, null],
  notes: [
    '待补：是否含一次性大额股权补偿（如收购员工股权重估）',
    '待补：FY 全年 SBC 数据 + YoY 对比',
    '待补：SBC/Revenue 比率的结构性趋势判断',
  ],
};
