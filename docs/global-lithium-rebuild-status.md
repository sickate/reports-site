# 全球锂资源仪表盘重构 — 进度与交接

`src/reports/2026-04-global-lithium/` + `public/research-topics/global-lithium/`

最后更新：2026-08-11（Phase 5 完成，未合并未部署）

外部评审（2026-07-27）判定原页面「更像深度研究长页＋数据库，而不是投资驾驶舱」，
由此展开 P0+P1+P2 全量重构，分 8 个阶段逐步上线。

---

## 一、当前状态一句话

**Phase 0–4 已在 `main` 上并已部署；Phase 5 在分支 `phase-5-charts` 上，5 个 commit，
尚未合并、尚未部署。Phase 6–7 未开始。**

```
main       a27129f …… Phase 0–4（已部署，2026-08-11 实测线上 CODE_VERSION = 2026-07-27）
             │
phase-5-charts
             ├─ 3d1db6e  refactor: escape() 提取为共享模块
             ├─ 9ead01d  feat: charts/kit.js — SVG 图表套件与 chart-* 样式
             ├─ 93d8903  feat: 产能构成图与 26H1 兑现率图 + SeriesEnvelope 契约
             ├─ 1ab75a8  data: 取回广期所 2026-07-24 期限结构 + 取数脚本
             └─ ca732f8  feat: 其余四张图 + 缺口措辞同步
```

21 个文件，+2,080 / −112 行。每个 commit 都能独立构建、独立回滚。

| Phase | 内容 | 状态 |
|---|---|---|
| 0 | 样本数一致性、筛选器失效、移动端裁切 | ✅ main，已部署 |
| 0.5 | nginx 让 `/research-topics/**.js\|css` 走 no-cache | ✅ main + 服务器已改 |
| 1 | 3,900 行单体 HTML 拆成模块化目录 | ✅ main，已部署 |
| 2 | 单一 store + 纯选择器 + URL 状态 | ✅ main，已部署 |
| 3 | 7 视图信息架构（14,418px → 3,572px） | ✅ main，已部署 |
| 4 | 数据契约、正交状态字段、A 股数据刷新 | ✅ main，已部署 |
| **5** | **图表** | ⏳ **分支就绪，待合并部署** |
| 6 | 表格与地图升级 | ⬜ 未开始 |
| 7 | 无障碍 + 收尾 + 重写周更技能文档 | ⬜ 未开始 |

原始全量计划：`~/.claude/plans/bubbly-napping-flute.md`
Phase 5 计划：`~/.claude/plans/lithium-peppy-pancake.md`

---

## 二、下次开工第一件事：合并并部署 Phase 5

分支已通过完整验证（见 §四），但**没有部署过一次**。建议先把它上线再开 Phase 6，
理由是分阶段上线是这个项目一开始就确认的交付方式，且 Phase 6 会大改表格与地图，
两批改动叠在一起出问题时很难二分定位。

```bash
git checkout main && git merge phase-5-charts
npm run build          # prebuild 会跑 check-lithium-consistency + 重生成 JSONL
npm run deploy
```

部署后确认一下缓存头（预期通过，见下）：

```bash
curl -sI https://reports.instap.net/research-topics/global-lithium/charts/kit.js | grep -i cache
# 期望 no-cache。
```

`charts/` 是新增的子目录，但 2026-08-11 实测线上**已有的嵌套路径**
（`core/version.js`、`data/palette.js`、`components/metric.js`）全部返回 `no-cache`，
说明 `location ~* ^/research-topics/.*\.(js|css)$` 确实匹配多级路径，`charts/` 会照样命中。
所以这一条现在是「确认一下」而不是风险项。

若真的返回 `immutable`：回到 `nginx/reports.instap.net.conf` 检查正则，
并记住 **`deploy.sh` 只 rsync `dist/`，nginx 改动要手动 SSH 到 maru**
（`sudo nginx -t && sudo systemctl reload nginx`，先备份线上 conf——它带着仓库副本
没有的 certbot SSL 块）。

---

## 三、Phase 5 交付了什么

### 3.1 六张图，不是原计划的八张

Phase 4 的取数审计（`data/gaps.js`）已确认**成本曲线**与**全球供需平衡表**在免费源里
确实不存在，**供给桥**缺兑现概率赋值。这三项保持空状态，不做。

| # | 图 | 数据源 | 落位视图 |
|---|---|---|---|
| 1 | 产能构成：已投产 vs 规划增量 | CSV 44 个项目 | supply |
| 2 | 26H1 实绩 vs FY26E 一致预期覆盖率 | 公司表 + market.json | equities |
| 3 | 广期所期限结构 | GFEX（经新浪日 K） | cost |
| 4 | 库存四分项结构 | SMM 单周 | cost |
| 5 | 一致预期区间 vs 当前现货 | 三个独立机构口径 | cost |
| 6 | 政策时间轴 | 4 条已颁布条款 | catalysts |

**信息量最高的是第 2 张**：10 家 A 股全部披露 26H1 预告，5 家半年已覆盖 4 月全年一致
预期的 70% 以上（天华 499%）。表格里这是长备注末尾的一句话，排在用「它自己已经证伪的
预期」算出的 26E PE 列后面；画在 100% 参考线上它变成读者最先看到的东西。

### 3.2 `charts/kit.js` 的核心约束

**绝不测量容器。** 两个独立理由：
- 图表渲染在 `hidden` 视图面板里，那里所有元素宽度为 0；
- `#app` 上挂着 ResizeObserver 会把新高度 post 给父页，一张由测量宽度推导高度的图
  会通过父页反馈回自己然后振荡。

每张图都是固定 `viewBox`，高度是行数的**纯函数**。

**窄屏用第二个盒子，不是把宽图缩小。** `viewBox` 会等比缩放文字：960 单位宽的图放进
315px 手机列渲染为 33%，13px 标签变成 3.9px。所以 kit 有 WIDE(960) / NARROW(420)
两套几何，用 `matchMedia` 选——它查**视口**而非元素，因此在 hidden 面板里也答得对，
且断点是离散的，不会卷进高度反馈回路。实测窄屏标签落在 9px。

**空图与实图占同一个盒子**（继承自 `components/metric.js` 的 null 磁贴先例）。

### 3.3 数据契约：`market.json` 新增 `charts` 块

每个条目是 **SeriesEnvelope**——Metric 的同构体，载荷从标量换成数组。

> ⚠️ 命名陷阱：Metric 信封内部**已经有**一个叫 `series` 的字段，含义是新鲜度档位
> （`price|inventory|demand|forecast|fact`）。所以顶层块叫 `charts` 而不是 `series`。

`data/market-schema.js` 新增 `validateSeries()`。构建检查新增并**已逐条实测会 FAIL**：

- `charts.*` 的信封形状（label/unit/asOf/basis/kind/confidence/source/points 齐全）
- 每张图各自的 `requiredPointKeys`
- **`charts.*.asOf ≤ meta.asOf`** —— 结构性锁死「不做部分刷新」这个决策
- `inventorySplit` 三个分项之和 === `inventory-spot-total` 磁贴
- `h1Coverage` 的公司名必须能在 `companyResearchContent.zh.domesticRows` 里找到
- `policyTimeline` 的 `direction` 必须是 positive|negative|neutral

### 3.4 取数脚本

`scripts/fetch-lithium-series.mjs`，**不挂 prebuild**（构建期联网 = 网络抖动时构建失败，
而 deploy.sh 是 `set -e`）。

```bash
node scripts/fetch-lithium-series.mjs --as-of=2026-07-24            # 写入
node scripts/fetch-lithium-series.mjs --as-of=2026-07-24 --dry-run  # 只打印
```

- 合约列表按 as-of 月份**生成**而非写死（每月滚动），取回后只保留当天真正有结算价的。
- 新浪响应体前缀内嵌 `location.href='//sina.com'` 反盗链脚本：只截取方括号内的数组交给
  `JSON.parse`，**从不 eval 响应体**。
- `--as-of` 晚于 `meta.asOf` 时脚本自己拒绝写入并说明该怎么办。

---

## 四、Phase 5 的验证结果（已完成，不必重跑）

- `npm run build` 通过；三条新构建检查各自故意触发过一次，确认会 FAIL 而非静默通过。
- **高度契约**：7 个视图 × 3 轮切换，每个视图每轮高度完全相同，无棘轮无振荡；
  frame 高度恒等于 `#app` 高度 + 8。
  （cockpit 4425 / supply 1451 / cost 3197 / equities 7987 / atlas 5949 /
  catalysts 1590 / method 1444）
- 6 张图全部具备 `aria-label`、单位 chip、口径、出处四件套与视觉隐藏数据表，无 NaN。
- 375px 下无横向溢出；窄屏几何生效，标签 9px。
- 控制台无页面报错，无 view-inconsistency 告警。
- 覆盖率图的 10 个计算值与公司备注里的文字逐一吻合（70/76/52/64/41/93/128/40/499 + 融捷 N.A.）。

---

## 五、留给下一个人的坑与未决事项

### 5.1 已知未验证

| 事项 | 说明 |
|---|---|
| **断点切换的重渲染** | `app.js` 监听 `matchMedia` 的 `change` 事件重渲图表，但这一条没能端到端验证：Chrome 对**后台标签页**挂起 rAF 与样式重算，media query 的 change 事件因此不触发，而扩展驱动的标签页始终是后台态（`document.visibilityState === 'hidden'`）。窄屏渲染路径本身已通过在 iframe 内手动重渲验证（420 单位盒子、标签 9px、无溢出），只有「转屏时自动切换」没跑过。**真机转屏即可验证。** |
| ~~nginx 对 `charts/` 的缓存~~ | 2026-08-11 已排除，见 §二。 |

同一个后台标签页限制也影响高度验证：`notifyParentHeight()` 走 rAF，在后台标签里
不发送。§四 的高度数据是通过**在 iframe 内注入等价的 postMessage** 测出来的，
测的是父页的应用逻辑与 `#app` 的真实高度，绕过了 rAF 那一层。

### 5.2 LC2707 的诚实缺口

已有的 `gfex-term-spread` 磁贴是 **−7,240**（12 合约口径，含 LC2707）；
新画的曲线只有 **11 个合约**（2608–2706），跨度差价 −6,880。

原因：新浪对 LC2707 返回 `null`，没有任何日线历史；Eastmoney 历史接口也取不到。
倒推可知 2707 应在 136,180 附近——**但那是推算不是观测，没有写进数据**。

因此曲线的 `note` 只声明覆盖范围与形态，**不发布第二个价差数字**。磁贴管数字，图管形状。
若将来拿到 2707 的历史，重跑脚本即可，两者会自动对齐。

### 5.3 版本时钟的当前状态

```
CODE_VERSION    2026-08-10   （= index.html ?v= = REPORT_VERSION）
DATA_CACHE_KEY  2026-08-10   （market.json 变了，必须升）
UPDATE_MARKER   2026-07-24   ← 未动，本期无项目事实变化
market.meta.asOf 2026-07-27  ← 未动
src/reports/index.js date    2026-07-27  ← 跟随 meta.asOf，未动
```

**下次周更时**：推进 `meta.asOf` 后，可以顺手把期限结构刷到当天
（`--as-of=<新的 meta.asOf>`），届时 11/12 合约的问题大概率自动消失。

### 5.4 工作区里有一批与锂无关的改动

`AGENTS.md`、`README.md`、`scripts/backfill-daily.mjs`、`scripts/update-prices.js`、
`scripts/lib/sources/{fred,registry}.mjs`、新增的 `scripts/lib/sources/westmetall.mjs`、
`src/reports/2026-06-metals-ytd/index.jsx`、`public/data/metals-daily.json`
—— 这些是**金属日频存储**的在途工作，与本次重构无关，全程未 stage 未提交。
提交锂相关改动时**不要用 `git add -A`**。

### 5.5 新增图表时必须同步改 `data/gaps.js`

缺口登记块与图表在**同一个视图**上。加了图不改对应的 `have` 措辞，页面会同时显示
一张图和一句「无法展示」。Phase 5 已改写 5 条（supplyBridge / spotHistory /
inventoryTurnover / priceScenarios / catalystFeed），`costCurve` 与
`supplyDemandBalance` 原样保留因为确实什么都没变。

原则：**部分补齐就改写措辞，不要删除条目**。
「能画出期货曲线的形状」不等于「有现货价格历史」。

---

## 六、Phase 6 — 表格与地图升级（未开始）

来自原计划 §四：

- 项目表：冻结列、列组切换、分页或虚拟滚动、行 → 详情抽屉、移动端卡片视图
- 地图：尺寸图例、点聚类、区域快捷缩放、与 `selection` 状态双向联动

**开工前要知道的：**

1. **表格宽度不能压。** 曾经在 375px 下强行 `width:auto`，14 列各被挤到 ~34px，
   每个单元格竖排折行，表格高度涨到 **41,478px**。保持声明宽度让它横向滚动。
   （`index.html` 的 640px 媒体查询块里有完整注释。）
2. **Leaflet 与懒挂载**：容器可见后必须 `invalidateSize()`。`applyView()` 里
   `if (activeView === 'atlas')` 分支就是干这个的，别删。
3. 抽屉/分页会改变页高 → 每次都要 `notifyParentHeight()`。参考 `applyView()` 里
   「一次 + 一个 rAF + 120ms」的三连。
4. 若图表要消费筛选后的 `visible`，必须扩展 `core/invariants.js` 的
   `assertViewConsistency`，否则图表会成为第四个不受校验的界面。
   （Phase 5 的六张图都**不**消费 `visible`，所以没动它。）

---

## 七、Phase 7 — 无障碍 + 收尾（未开始）

- 键盘遍历筛选 / 图例 / 表格 / 地图 / 抽屉；ARIA；focus-visible；对比度；
  `prefers-reduced-motion`。
- **重写 `~/.claude/skills/report-weekly-update/references/lithium-report.md`（最重要）。**
  它仍然逐行写死 Phase 1 之前的文件结构、内联数组位置与提取机制。不重写，下一次周更
  会去改一批**已经不驱动页面的文件**，看起来成功了但什么都没变。
  Phase 5 之后它还多欠一段：`charts` 块与 `fetch-lithium-series.mjs` 该怎么用。

Phase 5 已经补的一部分文档：`public/research-topics/global-lithium/README.md`
新增了「图表绝不测量容器」一节与 `charts/` 的文件索引。

---

## 八、快速命令参考

```bash
# 本地预览（必须用 vite preview，报告页需要 SPA fallback）
npm run build && npx vite preview --port 4173
# → http://127.0.0.1:4173/reports/2026-04-global-lithium

# 只跑数据不变量
node scripts/check-lithium-consistency.mjs

# 刷新广期所期限结构
node scripts/fetch-lithium-series.mjs --as-of=YYYY-MM-DD

# 部署（会先跑 prebuild，数据不一致时在 rsync 前中止）
npm run deploy
```
