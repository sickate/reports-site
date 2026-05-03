# 科技公司财报跟踪报告模板

科技股（MAG7、半导体、SaaS、互联网平台）季度财报跟踪报告的标准化模板。基于 11 模块投研框架, 配合 AI Prompt 实现"一次调研 → 五份文件 → 一个交互页面"的标准化产出流程。

## 一页概览

- **目标**: 把单家科技公司当季 SEC 8-K / 10-Q 的 80+ 项数据压缩成"趋势 + 拐点 + 叙事"的仪表盘
- **设计**: 11 模块 / 5 季度时间序列 / 拐点识别 / 指引一致性
- **产物**: 5 个独立 ES Module JS 文件 + 1 个 React 报告页面
- **基准实例**: `src/reports/2026-05-google-alphabet/`（Alphabet Q1 2026）
- **设计文档**: `docs/2026-05-03_tech_company_research_template.md`

---

## 三步工作流

### Step 1: 粘贴 PROMPT 给 AI

打开 `PROMPT.md`, 把全文复制到 Claude / GPT, 替换其中三个占位符：

- `{COMPANY_NAME}` → 公司中文名（如 "英伟达"）
- `{TICKER}` → 股票代码（如 "NVDA"）
- `{FISCAL_QUARTER}` → 当前财季（如 "Q1 FY2026"）

AI 会按 11 模块、5 季度、SEC EDGAR 一手数据要求输出 5 个 JS 文件。

### Step 2: 保存 5 个 JS 文件

按以下路径保存 AI 输出的 5 个文件：

```
src/reports/YYYY-MM-{company-slug}/content/
├── meta.js          # 元信息 + KPI 卡片
├── series.js        # 5 季度时间序列
├── segments.js      # 分部 / CapEx / 资本配置 / 运营 KPI
├── valuation.js     # SOTP / 估值快照 / 分析师目标价 / 前瞻指引
└── notes.js         # 电话会引用 / 风险 / Watchlist / Sanity Checks
```

### Step 3: 复制 index.jsx 并注册

1. 复制基准实例的 React 入口：
   ```bash
   cp src/reports/2026-05-google-alphabet/index.jsx \
      src/reports/YYYY-MM-{company-slug}/index.jsx
   ```
2. `index.jsx` 直接 import 上述 5 个 content 文件, 通常无需改动逻辑（仅修改标题文本）
3. 在 `src/reports/index.js` 中注册新报告：
   ```javascript
   {
     slug: 'YYYY-MM-{company-slug}',
     title: '{COMPANY_NAME} {FISCAL_QUARTER} 财报跟踪',
     description: '简短描述',
     date: 'YYYY-MM-DD',
     type: 'visualization',
     tags: ['Tech', 'Earnings', '{TICKER}'],
     component: () => import('./YYYY-MM-{company-slug}/index.jsx'),
   }
   ```
4. `npm run dev` 本地预览, `npm run deploy` 上线

---

## 模板文件清单

| 模板文件 | 行数 | 对应输出 | 用途 |
|---------|-----|---------|------|
| `meta.template.js` | ~150 | `meta.js` | Header + KPI 卡片 |
| `series.template.js` | ~250 | `series.js` | 5 季度财务时序 |
| `segments.template.js` | ~300 | `segments.js` | 分部 / Capex / 资本配置 |
| `valuation.template.js` | ~150 | `valuation.js` | 估值 / 分析师目标价 |
| `notes.template.js` | ~250 | `notes.js` | 电话会 / 风险 / 来源 |
| `PROMPT.md` | ~300 | AI 输入 | 调研 prompt |
| `README.md` | ~150 | 本文件 | 使用说明 |

---

## 每个 Export 简明索引

### meta.js (3 个 export)

| Export | 一行说明 |
|--------|---------|
| `reportMeta` | 报告元信息：标题 / ticker / 价格快照 / P/E / 评级 |
| `narrativePivots` | 3 个核心叙事拐点（safe / fair / risk 各 1 条） |
| `kpiCards` | 8 张顶部 KPI 卡片, 含 5 季度 sparkline |

### series.js (8 个 export)

| Export | 一行说明 |
|--------|---------|
| `quarterlySeries` | 5 季度核心时序（营收 / 分部 / 利润率 / Capex / FCF / 资本配置 / RPO） |
| `servicesBreakdown` | 主业业务线明细（Search / YouTube ads / Network 等） |
| `geoRevenueTable` | 地区营收同比对比（含常数汇率） |
| `tacSeries` | TAC 比率时序（可选, 仅广告公司） |
| `costStructure` | 4 大费用项 5 季度时序 |
| `headcountSeries` | 员工人数 + 人均年化营收 |
| `daSeries` | 折旧与摊销时序（Capex 滞后传导指标） |
| `sbcSeries` | SBC 时序 + GAAP vs ex-SBC 利润率对比 |

### segments.js (10 个 export)

| Export | 一行说明 |
|--------|---------|
| `segmentDeepDive` | 3 个分部深度卡（Services / Cloud / Other Bets） |
| `capexGuidanceTimeline` | 5 个时点 CapEx 指引演变 |
| `capexComposition` | CapEx 构成（服务器 vs 数据中心） |
| `capexConstraintQuote` | 算力约束关键引述 |
| `capitalAllocationCommentary` | 资本配置当季叙事 |
| `majorAcquisition` | 重大并购详情（可选） |
| `balanceSheet` | 5 季度资产负债表关键演进 + 净现金对照 |
| `operatingKpis` | 订阅 / Cloud RPO / 战略业务 KPI |
| `aiMetrics` | Token rate / Gemini App MAU / Cloud AI 收入 |
| `cloudRunRate` | Cloud 年化运行率（可选） |

### valuation.js (4 个 export)

| Export | 一行说明 |
|--------|---------|
| `sotpTable` | SOTP 分部估值表（可选, 多分部公司） |
| `valuationSnapshot` | 估值快照（股价 / 市值 / TTM 倍数 / FCF Yield） |
| `analystTargets` | 卖方分析师目标价（至少 4 行） |
| `forwardGuidanceTable` | 上季 vs 当季前瞻指引对比（6 项关键变化） |

### notes.js (6 个 export)

| Export | 一行说明 |
|--------|---------|
| `earningsCallNotes` | 10 条电话会管理层引用（含中英 + 投研解读） |
| `riskEvents` | 风险事件分两类：已落地 / 持续追踪 |
| `companyWatchlist` | 10 项公司专属跟踪清单 |
| `sanityChecks` | 7 项数据交叉验证 |
| `dataSources` | 15+ 数据来源（high/medium/low confidence 分级） |
| `disclaimer` | 免责声明 |

---

## 通用 vs 公司差异化

### 通用模块（所有公司必填）

- `meta.js` 全部 3 个 export
- `series.js` 中 `quarterlySeries` / `costStructure` / `headcountSeries` / `daSeries` / `sbcSeries`
- `segments.js` 中 `segmentDeepDive` / `capexGuidanceTimeline` / `capexComposition` / `capexConstraintQuote` / `capitalAllocationCommentary` / `balanceSheet`
- `valuation.js` 中 `valuationSnapshot` / `analystTargets` / `forwardGuidanceTable`
- `notes.js` 全部 6 个 export

### 公司差异化（按业务模型选择）

| 字段 | 适用公司 | 不适用时处理 |
|------|---------|------------|
| `series.tacSeries` | Alphabet / Meta（广告业务） | 整体省略 |
| `segments.operatingKpis.cloudRpo` | Alphabet / MSFT / AMZN | 内部省略 cloudRpo |
| `segments.cloudRunRate` | 有云业务的公司 | 整体省略 |
| `segments.majorAcquisition` | 本季有并购完成的公司 | 整体省略 |
| `segments.operatingKpis.youtubeFy25` / `.waymo` | 仅 Alphabet | 内部替换或省略 |
| `valuation.sotpTable` | 多分部公司 | 整体省略, 用单一 EV/Sales |

### 公司专属 KPI 替换提示

| 公司 | 顶部 KPI 替换（meta.kpiCards） | operatingKpis 替换 | watchlist 替换 |
|------|-------------------------------|-------------------|----------------|
| **Meta** | `cloudRev` → `arpu` / `dau` | `subscriptions` → `dauByRegion` | Reels 货币化 / RL cash burn / EU DMA |
| **NVDA** | `cloudRev` → `datacenterRev` ($bn) | `subscriptions` → `blackwellShipments` | 中国管制 / 大客户集中度 |
| **MSFT** | `cloudRev` → `azureRev` | `subscriptions` → `m365CommercialSeats` | Azure AI 占比 / Copilot adoption |
| **AAPL** | `cloudRev` → `iPhoneRev` | `subscriptions` → `installedBase` | Services 增速 / India 制造 / Vision Pro |
| **AMZN** | `cloudRev` → `awsRev` | `subscriptions` → `primeMembers` | AWS 利润率 / Anthropic 投资 |

---

## 7 项验证清单（提交前必做）

每次新建报告前, 务必逐项核对以下 7 项, 缺一不可：

1. **季度连续性**: 所有 `quarters` 字段长度严格为 5, 由旧到新, 无跳跃
2. **null 占位**: 数据缺失统一用 `null`, 不要用 `0` 或编造
3. **来源可追溯**: `dataSources` 至少 15 项, 含 5 份 SEC EDGAR 8-K / 10-Q
4. **三个叙事拐点**: `narrativePivots` 严格 3 条, tone 覆盖 safe / risk / fair
5. **7 项 Sanity Checks**: `sanityChecks` 必须含模板规定的 7 项交叉验证
6. **10 条电话会引用**: `earningsCallNotes` 不少于 8 条, 每条含 quote / zh / context
7. **10 项 Watchlist**: `companyWatchlist` 严格 10 项, 区别于其他 MAG7 的独有变量

可以用以下命令快速校验文件语法：

```bash
node --check src/reports/YYYY-MM-{slug}/content/meta.js
node --check src/reports/YYYY-MM-{slug}/content/series.js
node --check src/reports/YYYY-MM-{slug}/content/segments.js
node --check src/reports/YYYY-MM-{slug}/content/valuation.js
node --check src/reports/YYYY-MM-{slug}/content/notes.js
```

---

## 相关文档

- **模板设计文档（11 模块完整框架）**: [`docs/2026-05-03_tech_company_research_template.md`](../../2026-05-03_tech_company_research_template.md)
- **基准实例（Alphabet Q1 2026）**: [`src/reports/2026-05-google-alphabet/`](../../../src/reports/2026-05-google-alphabet/)
- **AI 调研 Prompt**: [`PROMPT.md`](./PROMPT.md)

---

## 模板版本与维护

- **当前版本**: v1（2026-05-03 首次发布, 基于 Alphabet Q1 2026 实例提炼）
- **下次升级方向**: 加入横向比较视图（hyperscaler 同期对比表）
- **反馈渠道**: 在使用过程中如发现字段缺失或表达歧义, 请直接修改本目录文件并在 commit 中说明
