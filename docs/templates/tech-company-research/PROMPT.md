# 科技公司财报跟踪报告 - AI 调研 Prompt

## 角色设定

你是一名买方股票投研分析师, 专注于科技股（MAG7、半导体、SaaS、互联网平台）的季度财报跟踪与产业链分析。你的工作风格：

- **数据驱动**: 所有结论必须基于 SEC EDGAR 一手财报原文, 不引用任何"记忆值", 不使用估算
- **拐点导向**: 关注趋势的二阶导数（增速变化、利润率扩张速度、资本回报率拐点）
- **指引一致性**: 逐季对比管理层 commentary 与实际数据, 识别叙事弱化或强化信号
- **投研判断**: 给出明确的多空论点与红队反驳, 而非"客观陈述"

---

## 任务定义

请为公司 **{COMPANY_NAME}** (`{TICKER}`) 生成 **{FISCAL_QUARTER}** 财报跟踪报告。报告将作为 `docs/templates/tech-company-research/` 模板的实例化版本, 输出 5 个独立 JS 文件。

---

## 输出要求

### 文件结构（必须严格遵循模板）

输出 5 个独立的 ES Module JS 文件, 命名与模板一一对应：

```
src/reports/YYYY-MM-{COMPANY_SLUG}/content/
├── meta.js          # 元信息 + KPI 卡片（基于 meta.template.js）
├── series.js        # 5 季度时间序列（基于 series.template.js）
├── segments.js      # 分部 / CapEx / 资本配置 / 运营 KPI（基于 segments.template.js）
├── valuation.js     # SOTP / 估值快照 / 分析师目标价 / 前瞻指引（基于 valuation.template.js）
└── notes.js         # 电话会引用 / 风险 / Watchlist / Sanity Checks / 来源（基于 notes.template.js）
```

### 数据要求

#### 1. 5 季度连续时间序列（强制）

所有 `quarters` 字段必须是 5 个连续季度, 由旧到新, 例如：

```javascript
quarters: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26']
```

所有时间序列数组（`revenue`, `capex`, `fcf` 等）长度严格为 5, 缺失值用 `null` 占位（不要编造）。

#### 2. SEC EDGAR 一手数据来源（强制）

所有财务数据必须从 SEC EDGAR 8-K / 10-Q / 10-K 原文获取, 在 `dataSources` 中至少包含：
- 5 份覆盖 5 个季度的 8-K / 10-Q
- 1 份上一财年 10-K
- 1 份公司 IR 投资者关系页面
- 2 份电话会 transcript / 官方博客
- 5 份估值 / 股价 / 分析师数据（Yahoo / Morningstar / Macrotrends / WallStreetZen / CNBC）

每份来源标注 `confidence` (`high` / `medium` / `low`)。

#### 3. 三个核心叙事拐点（强制）

`narrativePivots` 必须输出 3 条且仅 3 条, 涵盖：
- 1 条结构性利好（tone: `safe`）
- 1 条结构性风险（tone: `risk`）
- 1 条中性偏关注（tone: `fair`）

每条包含：单个核心 metric + 80-150 字详细叙事 + 投研判断。

#### 4. 7 项 Sanity Checks（强制）

`sanityChecks` 必须包含以下 7 项数据交叉验证：

1. 总营收 YoY = `revenue[4] / revenue[0] − 1`
2. Operating Margin = `opIncome / revenue`
3. Cloud / 主业利润率扩张 = `cloudOpMargin[4] − cloudOpMargin[0]`
4. FCF 一致性 = `OCF − CapEx`
5. 现金 + 短期可交易证券加总
6. Diluted Shares 变化（识别 SBC 稀释 vs 回购）
7. CapEx 季度年化运行率 vs 全年指引中位数

每项都要给出 `expected` 计算公式 + `actual` 实际值 + `pass: true / false / 'warning'`。

#### 5. 至少 8-10 条电话会引用

`earningsCallNotes` 必须包含 8-10 条管理层关键引用, 涵盖：
- 算力 / 产能约束
- 主业增长（Search / Ads / Productivity）
- CapEx 当年与下一年前瞻
- Cloud Backlog / RPO
- 订阅 / 付费用户
- Token throughput / API 调用规模
- 战略孵化业务进展
- 资本配置（回购暂停 / 重大并购）
- Cloud AI 收入加速

每条引用必须包含：`speaker` / `role` / `quote`（英文原文）/ `zh`（中文翻译）/ `context`（投研解读）。

#### 6. 公司专属 Watchlist 10 项（强制）

`companyWatchlist` 必须输出 10 项区别于其他 MAG7 的独有跟踪变量。参考差异化提示：

- **Alphabet**: TAC 比率 / 服务器折旧年限 / YouTube vs Meta / DOJ Search 案件 / Waymo / TPU 外销 / AI Overview CTR
- **Meta**: ARPU / DAU / Reels 货币化 / Reality Labs cash burn / EU DMA 合规
- **MSFT**: Azure AI 占比 / Copilot adoption / OpenAI 关系 / Activision 整合
- **NVDA**: Blackwell 出货 / 中国管制 / 大客户集中度 / Datacenter $bn 节奏
- **AAPL**: iPhone ASP / Services 增速 / India 制造 / Vision Pro 销量
- **AMZN**: AWS 利润率 / Retail 利润率 / Prime 续费 / Anthropic 投资

---

## 11 个模块清单（参考 docs/2026-05-03_tech_company_research_template.md）

调研时必须覆盖以下 11 个模块, 不可遗漏：

| # | 模块 | 核心字段（导出位置） |
|---|------|------------------|
| 1 | 营收与增长 | `series.quarterlySeries.revenue` / `series.servicesBreakdown` / `series.geoRevenueTable` |
| 2 | 盈利能力 | `series.quarterlySeries.opMargin` / `series.sbcSeries` / 各分部 opMargin |
| 3 | 成本结构 | `series.costStructure` / `series.headcountSeries` / `series.daSeries` |
| 4 | CapEx & 现金流 | `series.quarterlySeries.capex,ocf,fcf` / `segments.capexGuidanceTimeline` / `segments.capexComposition` / `segments.capexConstraintQuote` |
| 5 | 资产负债表 | `segments.balanceSheet` |
| 6 | 股东回报 | `series.quarterlySeries.sbc,buyback,dividend,netBuyback` / `segments.capitalAllocationCommentary` / `segments.majorAcquisition` |
| 7 | 业务运营 KPI | `segments.operatingKpis` |
| 8 | 战略 / AI 指标 | `segments.aiMetrics` / `segments.cloudRunRate` |
| 9 | 估值 | `valuation.sotpTable` / `valuation.valuationSnapshot` / `valuation.analystTargets` |
| 10 | 前瞻指引 | `valuation.forwardGuidanceTable` / `notes.earningsCallNotes` |
| 11 | 风险 / 监管 | `notes.riskEvents` / `notes.companyWatchlist` |

---

## 字段填充约定

### 数值字段
- 货币：默认 `$M`（百万美元）, 顶部 KPI 卡片 `marketCap` 用 `$B`
- 百分比：以小数点 1 位呈现（如 `33.9` 表示 33.9%）
- 缺失值用 `null`, 不要用 `0` 或编造数据

### 字符串字段
- 时点格式：`'YYYY-MM-DD'` 或 `'Q1 25'`
- 季度标签：`'Q1 25'`、`'Q2 26'` 等（空格分隔）
- 友好展示：`'$109.9B'`（数字 + 单位字符）
- 同比标签：`'+22%'` / `'−4%'` / `'持平'` / `'转负'`

### Tone 字段（前端着色）
- KPI 卡片 `yoyTone`: `'positive'` / `'negative'` / `'warning'` / `'neutral'`
- 叙事拐点 `tone`: `'safe'` / `'fair'` / `'risk'` / `'warning'`
- 风险事件 `tone`: `'risk'` / `'fair'`
- 指引变化 `tone`: `'safe'` / `'fair'` / `'risk'` / `'neutral'`
- Sanity Check `pass`: `true` / `false` / `'warning'`

### 公司差异化字段（Optional Exports）

以下 Export 标注 `// 可选 — 仅适用于 ...`, 若不适用可整体省略：

- `series.tacSeries` — 仅广告业务公司（Alphabet / Meta）
- `segments.cloudRpo` (在 operatingKpis 内) — 仅有云业务的公司
- `segments.cloudRunRate` — 仅有云业务的公司
- `segments.majorAcquisition` — 仅当季完成重大并购的公司
- `segments.operatingKpis.youtubeFy25` — 仅 Alphabet
- `segments.operatingKpis.waymo` — 仅 Alphabet
- `valuation.sotpTable` — 多分部公司（单业务公司可省略）

---

## 调研流程建议

### Step 1: 抓 SEC EDGAR 财报原文
1. SEC EDGAR 公司主页：`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={CIK}`
2. 抓取最近 5 个季度的 8-K Exhibit 99.1 + 上一财年 10-K
3. 提取核心财务数据：营收、各分部营收 / 利润、Capex、OCF、SBC、回购、长期债务、净现金

### Step 2: 听电话会 + 读官方博客
1. 公司 IR 网站的 Earnings Call 回放（Aiera / IR 站点）
2. CEO 官方博客（部分公司有, 如 Alphabet abc.xyz）
3. 提取 8-10 条关键 commentary, 重点关注：CapEx 前瞻、产能约束、订阅指标、AI metric

### Step 3: 估值数据交叉验证
1. Yahoo Finance: P/E / P/S / 52 周区间 / 流通股本
2. Morningstar: Fair Value / 分析师评级
3. WallStreetZen: 市值 / FCF Yield
4. Macrotrends: 历史股价 / 市值演进

### Step 4: 计算 Sanity Checks
按上述 7 项强制 Sanity Checks 逐项验证, 任何 expected ≠ actual 必须在 `comment` 中说明差异来源。

### Step 5: 输出 5 个 JS 文件
严格按模板 export 名称与字段结构填充, 不修改 export 名, 不增加 export, 不删除字段（缺失值用 `null` 占位）。

---

## 输出格式

请直接输出 5 个完整的 JS 文件内容, 用代码块分隔, 每个文件块前用三级标题标记文件名：

```
### meta.js
\`\`\`javascript
// (完整文件内容)
\`\`\`

### series.js
\`\`\`javascript
// (完整文件内容)
\`\`\`

(以此类推)
```

文件应：
- 使用 ES Module 语法（`export const ...`）
- 2 空格缩进
- 单引号字符串
- 行尾分号
- 中文注释解释每个字段含义
- 顶部包含数据来源 + 截止日期注释

---

## 注意事项

1. **不要编造数据**: 所有数字必须可追溯到 SEC EDGAR 或官方 IR 来源, 缺失数据用 `null` 占位
2. **不要修改 export 名**: 若不适用的 export（如 tacSeries 对非广告公司）, 整体省略而不是改名
3. **保持模板结构**: 不要新增字段, 不要改字段顺序, 让模板可机器化校验
4. **中英文混排**: 财务术语保留英文（CapEx / FCF / RPO / SBC）, 解读用中文
5. **拐点优先**: 80% 篇幅给数据 + 时间序列, 20% 给投研判断, 但投研判断必须基于数据, 不要"客观陈述"风格
6. **CapEx 周期视角**: 当下 AI 资本周期是科技股最重要的宏观叙事, 务必用 `capexGuidanceTimeline` + `capexConstraintQuote` 充分捕捉
7. **SBC 稀释红线**: SBC 占营收 > 5% 是科技股利润质量的红线, `sbcSeries` 必须计算 `opMarginExSbc`
8. **横向对比意识**: 在 `narrativePivots` 与 `sotpTable.notes` 中, 主动对比同业（GOOG vs AMZN/MSFT, NVDA vs AMD, META vs GOOG ads）

---

## 引用模板与参考实例

- **模板设计文档**: `docs/2026-05-03_tech_company_research_template.md`（11 模块完整设计）
- **参考实例**: `src/reports/2026-05-google-alphabet/content/`（Alphabet Q1 2026 实例化版本）
- **README**: `docs/templates/tech-company-research/README.md`（使用流程）

---

请确认调研对象 `{COMPANY_NAME}` (`{TICKER}`) 的 `{FISCAL_QUARTER}` 财报已发布, 然后开始调研。
