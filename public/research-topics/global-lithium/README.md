# 全球锂资源项目地图与数据库（2026）

报告页：https://reports.instap.net/reports/2026-04-global-lithium
独立打开：https://reports.instap.net/research-topics/global-lithium/

原生 ES 模块 + Leaflet，无打包器；由 `src/reports/2026-04-global-lithium/index.jsx`
以 iframe 嵌入。结构参照同目录下的 `../semiconductor-upstream/`。

## 我要改 X，去哪个文件

| 想改的东西 | 文件 |
|---|---|
| 项目数据（44 个项目/集群） | `public/data/global-lithium-database-2026.csv`（**不在本目录**） |
| **核心判断、更新日志、研报更新卡、关键指标** | `public/data/global-lithium-market.json`（**不在本目录**） |
| 公司财务表（国内 10 / 国际 5 / 资源矩阵） | `data/company-research.js` |
| 静态页面文案（标签、表头、方法说明） | `data/copy.js`（`locales.zh`） |
| Metric 信封契约、新鲜度阈值 | `data/market-schema.js` |
| Metric 渲染（唯一入口） | `components/metric.js` |
| 项目 → 上市公司归属 | `data/listed-owners.js` |
| 国家/状态/矿床类型等枚举中译 | `data/dictionaries.js` |
| 储量/品位/成本/风险等长文本中译 | `data/field-translations.js` |
| 状态枚举、分组派生、CSV 列契约 | `data/schema.js` |
| 颜色 | `data/palette.js` |
| 版本号（三个时钟） | `core/version.js` |
| 数据路径 | `data/config.js` |
| 渲染逻辑、地图、筛选、表格 | `app.js` |
| 样式、页面骨架 | `index.html`（CSS 内联） |

## 四个必须知道的坑

**1. 三个版本号是独立的时钟，别合并**（全部在 `core/version.js`）

| 常量 | 含义 | 什么时候 bump | 必须等于 |
|---|---|---|---|
| `CODE_VERSION` | 代码缓存键 | 每次代码发布 | `index.html` 的 `app.js?v=`、wrapper 里的 `REPORT_VERSION` |
| `DATA_CACHE_KEY` | `/data/*` 的 `?v=` | `public/data/` 下任何文件变化，**包括纯结构变化** | — （只要求 ≥ `UPDATE_MARKER`） |
| `UPDATE_MARKER` | 「本次更新」高亮标记（`item.updated === UPDATE_MARKER`） | 只在项目事实变化时 | `src/reports/index.js` 里的 `date` |

前两者原本是同一个常量。合并的代价很具体：纯代码或纯结构改动必须 bump 缓存键
（否则浏览器拿着旧 CSV 解析不出 `lifecycle` 列，全部项目塌进同一个分组），但一旦
顺手 bump 了标记，所有「本次更新」高亮会同时消失，读者只会看到「这周什么都没变」。

不一致会让 `npm run build` 失败（见下）。

**2. `status` 是散文，`lifecycle`/`structure`/`activity` 才是机器可读的声明**

筛选、KPI、地图配色全部读三个正交列，`status` 只用于表格里的文字气泡和搜索。
所以改 `status` 措辞是安全的；改它的**含义**而不同步改 `lifecycle` 会让构建失败
（`STATUS_LIFECYCLE_EXPECTATION` 交叉校验）。历史教训见 `data/schema.js` 顶部。

**3. 周更内容在 JSON 里，不在 .js 里**

`public/data/global-lithium-market.json` 装的是每周都会变的东西：核心判断、更新
日志、研报更新卡、关键指标。放在数据文件而不是代码模块里，是因为一个笔误的代价
不同——`.js` 里的语法错误会白屏整页，JSON 里的只会让对应区块显示「加载失败」，
其余部分照常工作（这条降级路径有测试覆盖）。

`keyMetrics` 里每个数字都是 **Metric 信封**：`value` + `unit` + `asOf` + `basis`
（口径）+ `source` + `kind` + `confidence`。契约与校验在 `data/market-schema.js`，
挂在 prebuild。渲染**只经** `components/metric.js` 一条路径——出处不可能被漏写，
因为不存在「只渲染数值不渲染出处」的代码路径。

`value: null` 是合法状态，表示取不到，必须配 `note` 且以「未披露」（免费源确实
不提供）或「数据缺口」（应当可得但未采集）开头。**永远不要用估算填 null。**
null 的 metric 不带 `source`/`kind`/`confidence`——那些是「数字的属性」，给一个
不存在的数字标注「观测值 · 置信度 低」比不说更糟。

新鲜度徽章以 `market.meta.asOf` 为基准，**不是**读者的时钟：否则同一个页面对不同
时间打开的人显示不同结论，且所有数字都会仅因为没人访问而漂成「过期」。以数据整理
日为锚点，徽章回答的是一个稳定的问题——*这次更新里，哪些数字比这次更新本身更旧*。

**4. 公司数字有一条构建期回流管道**

```
data/company-research.js  →  scripts/generate-company-financials-jsonl.mjs (npm prebuild)
                          →  public/data/company-financials.jsonl
                          →  运行时 fetch 回来，覆盖表格里的内联值
```

所以：**改完公司数字必须重跑 `npm run prebuild`**，否则页面显示的仍是上一次生成的
JSONL。运行时以 JSONL 为权威、模块为兜底——这个方向不能反过来（正是这条性质让
`data/company-research.js` 即使被浏览器缓存一年也不会显示过期数字）。

`companyResearchContent.en.domesticRows` / `.globalRows` **不是死代码**：语言切换
虽然已移除，但生成器要读英文行来产出 `aliases` 和 `finance.notes.en`。删掉会让
`npm run build` 挂掉。每行必须**恰好 11 格**，生成器按位置解构。

## 校验

```bash
node scripts/check-lithium-consistency.mjs
```

已挂在 `npm run prebuild`，会在下列情况**让构建失败**：

- CSV 表头漂移、行宽不对（通常是中文字段里有没加引号的逗号）
- `lifecycle`/`structure`/`activity` 取值超出枚举
- `status` 与 `lifecycle` 互相矛盾（改了一个忘了另一个）
- 有项目落进渲染不出来的状态分组（历史上 `Uyuni cluster` 就是这样从表格和地图里
  静默消失，同时仍被算进 KPI）
- `lat`/`lon` 或 `port_lat`/`port_lon` 只有一半
- `listed-owners.js` 里的项目名在 CSV 中不存在（改名没同步）
- 公司行不是 11 格
- 版本号不一致，或 `DATA_CACHE_KEY` 早于 `UPDATE_MARKER`
- `market.json` 解析失败、Metric 信封字段缺失/取值非法、metric id 重复
- 更新日志不是按日期倒序（页头会把旧日期当成「最近更新」显示）
- 研报更新卡缺 `impact`/`tone`/`horizon`（渲染出来没有徽章，读起来像「没有观点」）

## 运行时不变量

`app.js` 的 `assertViewConsistency()` 每次渲染后比对 KPI 数 / 表格行数 / 地图点数，
不一致就 `console.error`。地图点只与**有坐标的**行比较，差额通过 `#unmappedNote`
显式写出来。

## nginx

`/research-topics/` 下的 `.js`/`.css` 必须走 `no-cache`（配置见
`nginx/reports.instap.net.conf`）。通用静态资源块给所有 js/css 设了
`expires 1y; immutable`，那对 Vite 的哈希文件名是安全的，但对这里手写的固定文件名
会把回访用户锁在旧代码上一整年且毫无症状。部署后可验证：

```bash
curl -sI https://reports.instap.net/research-topics/global-lithium/app.js | grep -i cache
```

注意 `scripts/deploy.sh` 只 rsync `dist/`，**不推送 nginx 配置**，服务器改动需手工同步。
