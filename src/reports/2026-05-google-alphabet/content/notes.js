// Alphabet (GOOGL) Q1 2026 研究笔记
// 包含：电话会引用、风险事件、跟踪清单、数据完整性自检、来源、免责声明
// 数据基于 SEC EDGAR 8-K / 10-Q 原文披露和 Alphabet IR 官方公告

// ---------------------------------------------------------------------------
// 1. 电话会关键引用（Q1 2026 Earnings Call）
// ---------------------------------------------------------------------------
export const earningsCallNotes = [
  {
    id: 'ec1',
    speaker: 'Sundar Pichai',
    role: 'CEO',
    topic: 'Cloud 产能约束',
    topicTone: 'positive',
    quote: 'We are compute constrained in the near term. Our cloud revenue would have been higher if we were able to meet the demand.',
    zh: '我们近期受算力约束。如果能满足需求，云业务收入本会更高。',
    context: "需求验证信号 — capex 是被需求拖着走，不是过度投资。",
  },
  {
    id: 'ec2',
    speaker: 'Sundar Pichai',
    role: 'CEO',
    topic: 'Search 增长',
    topicTone: 'positive',
    quote: 'AI Overviews and AI Mode are driving record query volumes — Search & other revenue accelerated to +19% YoY this quarter.',
    zh: 'AI Overviews 和 AI Mode 推动查询量创历史新高 — Search & other 营收本季加速到 YoY +19%。',
    context: "反驳\"AI 颠覆 Search\"的最强证据。AI Overviews 不是流量杀手，而是流量推手。",
  },
  {
    id: 'ec3',
    speaker: 'Anat Ashkenazi',
    role: 'CFO',
    topic: 'CapEx 2027 前瞻',
    topicTone: 'warning',
    quote: 'Looking ahead to 2027, we expect capex will increase significantly from 2026 levels.',
    zh: '展望 2027 年，我们预计 capex 将比 2026 年显著增加。',
    context: '★ 这是首次将 capex 周期可见度延伸到 2027 — 资本周期"看不到顶"，是 FCF Yield 长期被压制的核心理由。',
  },
  {
    id: 'ec4',
    speaker: 'Anat Ashkenazi',
    role: 'CFO',
    topic: '2026 全年 Capex 上调',
    topicTone: 'warning',
    quote: 'We now expect 2026 capital expenditures to be in the range of $180 billion to $190 billion.',
    zh: '我们现在预计 2026 年资本开支区间为 $180B 到 $190B。',
    context: 'Q4 2025 财报口径为 $175-185B，本季上调 $5B。这是连续第 4 次上调（$75 → $85 → $91-93 → $175-185 → $180-190B）。',
  },
  {
    id: 'ec5',
    speaker: 'Sundar Pichai',
    role: 'CEO',
    topic: 'Cloud Backlog 锁定',
    topicTone: 'positive',
    quote: 'Cloud RPO grew to $467.6 billion, with approximately 50% expected to be recognized as revenue over the next 24 months.',
    zh: 'Cloud RPO 增长到 $467.6B，约 50% 预计在未来 24 个月内确认为收入。',
    context: 'RPO QoQ +95%，单季增量 $228B 是当前年化营收的 11 倍。给 2026-2027 Cloud 收入强可见度。',
  },
  {
    id: 'ec6',
    speaker: 'Sundar Pichai',
    role: 'CEO',
    topic: 'Subscriptions / Gemini',
    topicTone: 'positive',
    quote: 'Total paid subscriptions across YouTube, Google One, and Gemini App now exceed 350 million — this was the strongest quarter for consumer AI subscriptions.',
    zh: '跨 YouTube、Google One 和 Gemini App 的总付费订阅数现已超过 3.5 亿 — 这是消费 AI 订阅最强的一个季度。',
    context: '从 Q3 25 >300M、Q4 25 >325M 到 Q1 26 350M，订阅基本盘稳健向上。Gemini App 在用户付费转化上首次产生显著贡献。',
  },
  {
    id: 'ec7',
    speaker: 'Sundar Pichai',
    role: 'CEO',
    topic: 'Token throughput / API',
    topicTone: 'positive',
    quote: 'Our first-party models are now processing more than 16 billion tokens per minute — up from 10 billion last quarter.',
    zh: '我们的第一方模型现在每分钟处理超过 160 亿个 token — 上季度为 100 亿。',
    context: 'Token rate QoQ +60%（从 7B → 10B → >16B/分钟），是 AI 调用规模的核心 leading indicator。',
  },
  {
    id: 'ec8',
    speaker: 'Sundar Pichai',
    role: 'CEO',
    topic: 'Waymo 扩张',
    topicTone: 'positive',
    quote: 'Waymo is now providing more than 500,000 fully autonomous trips per week — more than triple our pace from a year ago, and we expanded into 6 new cities this quarter.',
    zh: 'Waymo 每周完成超过 50 万次完全无人驾驶行程 — 是一年前的 3 倍多，本季新增 6 个城市。',
    context: 'Other Bets 唯一具备规模化潜力的资产。从 ~150K 跃迁到 >500K（YoY ~3.3x），城市扩张同步加速。',
  },
  {
    id: 'ec9',
    speaker: 'Anat Ashkenazi',
    role: 'CFO',
    topic: '回购暂停',
    topicTone: 'warning',
    quote: "Our priority this quarter has been funding our compute infrastructure investments and the Wiz acquisition; we did not repurchase any shares in Q1.",
    zh: '本季的资本配置优先级是支持算力基础设施投入和 Wiz 收购；Q1 我们没有回购任何股份。',
    context: '官方确认 Q1 2026 回购为零。这是 2024 年系统回购以来首次完全暂停 — 资本配置重大转向。',
  },
  {
    id: 'ec10',
    speaker: 'Sundar Pichai',
    role: 'CEO',
    topic: 'Cloud AI 收入加速',
    topicTone: 'positive',
    quote: 'Cloud AI Solutions revenue grew approximately 800% year-over-year — though we have not disclosed the absolute dollar contribution.',
    zh: 'Cloud AI Solutions 营收同比增长约 800% — 但我们未披露绝对金额。',
    context: 'Q4 25 GenAI +400% → Q1 26 +800%，加速翻倍。但绝对值未披露是估值上的不确定性。',
  },
];

// ---------------------------------------------------------------------------
// 2. 风险事件 — 已落地 vs 持续追踪
// ---------------------------------------------------------------------------
export const riskEvents = {
  landed: {
    title: '已落地的监管 / 法律 / 一次性事件',
    headers: ['事件', '时点', '财务影响'],
    rows: [
      ['欧盟反垄断罚款（adtech 案）', '2025-09', 'Q3 2025 计提 $3.5B，影响经营利润；调整后 OpMargin 33.9%'],
      ['Waymo 员工股权重估补偿', 'Q4 2025', '$2.1B，主要进入 R&D 费用；Other Bets Op loss 调整后约 −$1.5B'],
      ['美国税法 OBBBA', '2025-07-04', '允许国内 R&E 当期费用化 + 加速折旧；OCF 影响正面'],
      ['Wiz 收购完成', '2026-03-11', '$32B 现金对价；并入 Cloud；Goodwill +$24B / Intangibles +$8B'],
      ['Q1 2026 长期债务发行', '2026-Q1', '+$31.1B 长期债券，长期债务从 $46.5B 升至 $77.5B（YoY 7x）'],
    ],
  },
  ongoing: {
    title: '持续追踪的监管 / 竞争风险',
    rows: [
      {
        title: 'DOJ Search 反垄断救济措施',
        body: '仍在司法救济阶段。潜在判决包括限制默认搜索协议（Apple、Samsung 等）、强制 Chrome 剥离。Q1 2026 财报未提及新进展。Apple 默认搜索协议每年 TAC ~$20B+，续约风险持续。',
        tone: 'risk',
      },
      {
        title: 'EU DMA 合规成本',
        body: '持续有边际产品调整成本，目前未量化。',
        tone: 'fair',
      },
      {
        title: 'AI Search 替代风险',
        body: "管理层 Q1 2026 反复强调 \"AI Overviews / AI Mode 推动查询量创新高，Search 收入加速到 +19%\" — 是对该担忧最强的反驳。但 ChatGPT Search、Perplexity、Apple Intelligence 的份额变化仍需第三方监测验证。",
        tone: 'fair',
      },
      {
        title: 'Anthropic / SpaceX 持股波动',
        body: 'Q1 2026 净利润 $62.6B 中约 $28.7B 来自非交易性股权证券公允价值增值（主要为 Anthropic）。该项受私募估值波动影响巨大，是 GAAP EPS 与"核心 EPS"差异的核心来源。',
        tone: 'fair',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 3. Alphabet 专属跟踪清单（10 项）
// ---------------------------------------------------------------------------
export const alphabetWatchlist = [
  {
    n: 1,
    item: 'TAC 比率走势',
    why: '议价权代理变量 — 当前 19.7%，结构性下行',
  },
  {
    n: 2,
    item: '服务器折旧年限假设（目前 6 年）',
    why: '是否再次调整 — 直接影响经营利润口径',
  },
  {
    n: 3,
    item: 'YouTube ads vs Meta family-of-apps ads 增速差',
    why: '数字广告 share war 关键 proxy',
  },
  {
    n: 4,
    item: 'Cloud 经营利润率 vs AWS / Azure 收敛速度',
    why: '当前 32.9%，与 AWS 28-30% 接近',
  },
  {
    n: 5,
    item: 'Other Bets 经营亏损（尤其 Waymo cash burn）',
    why: '$16B 投资轮后 cash burn 节奏',
  },
  {
    n: 6,
    item: 'AI Overview 对 Search 商业化影响',
    why: '管理层 +19% 增速口径 vs 第三方 SimilarWeb / SemRush 流量',
  },
  {
    n: 7,
    item: 'DOJ Search 反垄断救济最终判决',
    why: 'Chrome 剥离 / 默认搜索协议风险',
  },
  {
    n: 8,
    item: 'TPU 出货与外部销售',
    why: '若开始向第三方销售（如已传闻的 Anthropic / Meta 协议），是模型 upside',
  },
  {
    n: 9,
    item: 'Gemini 月活 / API 调用增速',
    why: 'OpenAI 战场 — token rate >16B/min 是 leading indicator',
  },
  {
    n: 10,
    item: 'Apple Intelligence 中 Google 集成进展',
    why: 'Search 默认协议续约信号',
  },
];

// ---------------------------------------------------------------------------
// 4. 数据完整性自检（Sanity Checks）
// ---------------------------------------------------------------------------
export const sanityChecks = [
  {
    n: 1,
    check: 'Q1 2026 总营收 YoY',
    expected: '109,896 / 90,234 − 1 = +21.8%',
    actual: '管理层口径 +22%',
    pass: true,
    comment: '一致',
  },
  {
    n: 2,
    check: 'Q1 2026 Operating Margin',
    expected: '39,696 / 109,896 = 36.1%',
    actual: '36.1%',
    pass: true,
    comment: '一致',
  },
  {
    n: 3,
    check: 'Cloud 利润率扩张验证',
    expected: 'Q1 26: 6,598 / 20,028 = 32.9% vs Q1 25: 17.8% = +1,510 bps',
    actual: '与公司口径一致',
    pass: true,
    comment: '+15.1pp YoY 是结构性 thesis 的核心证据',
  },
  {
    n: 4,
    check: 'FCF 计算一致性',
    expected: 'Q1 26 FCF = OCF − CapEx = 45,790 − 35,674 = 10,116',
    actual: '10,116',
    pass: true,
    comment: '一致',
  },
  {
    n: 5,
    check: '现金 + 短期可交易证券',
    expected: 'Q1 26 末: 38,063 + 88,777 = 126,840',
    actual: '126,840',
    pass: true,
    comment: '一致',
  },
  {
    n: 6,
    check: '股本变化（Diluted Shares）',
    expected: 'Q4 25 → Q1 26: 12,228M → 12,238M（+10M）',
    actual: '+10M',
    pass: 'warning',
    comment: '★ 净增加是因为 Q1 26 没有回购，而 SBC 持续稀释 — 核心信号，需持续追踪',
  },
  {
    n: 7,
    check: 'CapEx 季度年化运行率 vs 全年指引',
    expected: 'Q1 2026 35,674 × 4 = $142.7B，低于全年指引中位数 $185B',
    actual: '剩余三季度平均需 ~$48B/季，Q4 季节性高峰可能突破 $55B 单季',
    pass: 'warning',
    comment: '★ 隐含 Q4 2026 单季 capex 将创纪录，需要持续追踪',
  },
];

// ---------------------------------------------------------------------------
// 5. 数据来源（按可信度分级）
// ---------------------------------------------------------------------------
export const dataSources = [
  // 一手来源（SEC EDGAR）
  {
    id: 's1',
    category: 'SEC EDGAR',
    label: 'Q1 2026 8-K Earnings Release',
    url: 'https://www.sec.gov/Archives/edgar/data/0001652044/000165204426000043/googexhibit991q12026.htm',
    confidence: 'high',
  },
  {
    id: 's2',
    category: 'SEC EDGAR',
    label: 'Q4 2025 / FY2025 8-K',
    url: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204426000012/googexhibit991q42025.htm',
    confidence: 'high',
  },
  {
    id: 's3',
    category: 'SEC EDGAR',
    label: 'Q3 2025 8-K',
    url: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204425000087/googexhibit991q32025.htm',
    confidence: 'high',
  },
  {
    id: 's4',
    category: 'SEC EDGAR',
    label: 'Q2 2025 8-K',
    url: 'https://www.sec.gov/Archives/edgar/data/0001652044/000165204425000056/googexhibit991q22025.htm',
    confidence: 'high',
  },
  {
    id: 's5',
    category: 'SEC EDGAR',
    label: 'Q1 2025 10-Q',
    url: 'https://www.sec.gov/Archives/edgar/data/0001652044/000165204425000043/goog-20250331.htm',
    confidence: 'high',
  },
  {
    id: 's6',
    category: 'SEC EDGAR',
    label: 'Q2 2025 10-Q',
    url: 'https://www.sec.gov/Archives/edgar/data/0001652044/000165204425000062/goog-20250630.htm',
    confidence: 'high',
  },
  {
    id: 's7',
    category: 'Alphabet IR',
    label: 'Alphabet 投资者关系页面',
    url: 'https://abc.xyz/investor/',
    confidence: 'high',
  },
  // 二手 / 电话会
  {
    id: 's8',
    category: 'Alphabet 官方博客',
    label: 'Pichai 致辞 (Q1 2026)',
    url: 'https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q1-2026/',
    confidence: 'high',
  },
  {
    id: 's9',
    category: 'Alphabet IR',
    label: 'Q4 2025 电话会回放',
    url: 'https://abc.xyz/investor/events/event-details/2026/2025-Q4-Earnings-Call-2026-Dr_C033hS6/default.aspx',
    confidence: 'high',
  },
  {
    id: 's10',
    category: 'Motley Fool',
    label: 'Q1 2026 transcript',
    url: 'https://www.fool.com/earnings/call-transcripts/2026/04/29/alphabet-googl-q1-2026-earnings-call-transcript/',
    confidence: 'medium',
  },
  // 行业 / 市场数据
  {
    id: 's11',
    category: 'CNBC',
    label: 'Q1 2026 报道',
    url: 'https://www.cnbc.com/2026/04/29/alphabet-googl-q1-2026-earnings.html',
    confidence: 'medium',
  },
  {
    id: 's12',
    category: 'Yahoo Finance',
    label: 'GOOGL 估值数据',
    url: 'https://finance.yahoo.com/quote/GOOGL/',
    confidence: 'medium',
  },
  {
    id: 's13',
    category: 'Morningstar',
    label: '分析师评级',
    url: 'https://www.morningstar.com/stocks/xnas/googl/quote',
    confidence: 'medium',
  },
  {
    id: 's14',
    category: 'Macrotrends',
    label: '历史股价',
    url: 'https://www.macrotrends.net/stocks/charts/GOOGL/alphabet/stock-price-history',
    confidence: 'medium',
  },
  {
    id: 's15',
    category: 'WallStreetZen',
    label: '市值/比率',
    url: 'https://www.wallstreetzen.com/stocks/us/nasdaq/googl',
    confidence: 'medium',
  },
];

// ---------------------------------------------------------------------------
// 6. 免责声明
// ---------------------------------------------------------------------------
export const disclaimer = '本报告为投研模板演示用途，所有财务数据基于 SEC EDGAR 8-K / 10-Q 原文披露，运营 KPI 和 commentary 来自 Alphabet 官方电话会和 IR 公告，估值数据来自第三方汇总（Yahoo / Morningstar / WallStreetZen 横向交叉验证）。本报告不构成投资建议，仅作为科技公司跟踪模板（docs/2026-05-03_tech_company_research_template.md）的 Google/Alphabet 实例化版本。模板设计哲学：时间序列 + 拐点识别 + 指引一致性。Q1 2026 三个最关键叙事拐点 — CapEx 周期顶部、Cloud Backlog 5x 跃迁、回购首次暂停 — 都在数据中有明确证据支持，但其市场含义仍存在合理争议。';
