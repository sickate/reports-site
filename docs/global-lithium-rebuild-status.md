# 全球锂资源仪表盘重构 — 进度与交接

`src/reports/2026-04-global-lithium/` + `public/research-topics/global-lithium/`

最后更新：2026-08-11（周更已部署；Phase 6 已完成，待部署）

外部评审（2026-07-27）判定原页面「更像深度研究长页＋数据库，而不是投资驾驶舱」，
由此展开 P0+P1+P2 全量重构，分 8 个阶段逐步上线。

---

## 一、当前状态一句话

**Phase 0–6 全部完成（0–5 与周更已部署，Phase 6 待部署）。只剩 Phase 7 的无障碍部分。**

Phase 5 合并进 `main`（merge commit `1565e70`，6 个 commit，21 个文件，+2,080/−112），
2026-08-11 部署并实测：线上 `CODE_VERSION = 2026-08-10`，6 张图全部渲染、
出处齐全、无 NaN，`charts/*.js` 返回 `no-cache`。

| Phase | 内容 | 状态 |
|---|---|---|
| 0 | 样本数一致性、筛选器失效、移动端裁切 | ✅ 已部署 |
| 0.5 | nginx 让 `/research-topics/**.js\|css` 走 no-cache | ✅ 已部署 + 服务器已改 |
| 1 | 3,900 行单体 HTML 拆成模块化目录 | ✅ 已部署 |
| 2 | 单一 store + 纯选择器 + URL 状态 | ✅ 已部署 |
| 3 | 7 视图信息架构（14,418px → 3,572px） | ✅ 已部署 |
| 4 | 数据契约、正交状态字段、A 股数据刷新 | ✅ 已部署 |
| **5** | **六张图 + SeriesEnvelope 契约** | ✅ **已部署（2026-08-11）** |
| **6** | **表格与地图升级** | ✅ **已完成（2026-08-11）** |
| 7 | 无障碍 + 收尾 | 🟡 周更技能文档已重写；a11y 未开始 |

原始全量计划：`~/.claude/plans/bubbly-napping-flute.md`
Phase 5 计划：`~/.claude/plans/lithium-peppy-pancake.md`

---

## 二、TODO — 下次开工按顺序做

### ✅ 已完成（2026-08-11）

- [x] **合并并部署 Phase 5** —— `main` merge `1565e70`，线上已验证。
- [x] **重写周更技能文档** `~/.claude/skills/report-weekly-update/references/lithium-report.md`
      —— 提前从 Phase 7 拿出来做，因为它当时已经**过期到 Phase 4**（而 Phase 4 早已上线），
      会把周更引去改 `data/copy.js` 里的 changelog / priceCall——那些内容 Phase 4 就搬到
      `market.json` 了，改了能通过构建但页面纹丝不动。新版逐条与仓库核对过。

### ✅ 3. 跑一次真实周更 —— 已完成并部署（2026-08-11）

见 §九。技能文档在这一趟里被实测出**主体也是过期的**（此前只重写了 references），
已一并修好。

### ⬜ 3-旧（保留原文以备对照）

**为什么排在 Phase 6 前面：**页面数据已经旧了（`meta.asOf = 2026-07-27`，
homepage 也显示这个日期），本来就该刷；而且这一次周更同时是**对刚重写的技能文档的检验**
——照着新文档走一遍，走不通的地方就是文档还差的地方，趁记忆新鲜立刻补。

顺带白捡一个修复：推进 `meta.asOf` 后即可

```bash
node scripts/fetch-lithium-series.mjs --as-of=<新的 meta.asOf>
```

把期限结构刷到当天。新浪现在有 LC2707 的日线，所以大概率能拿到完整 12 个合约，
§5.2 那个 11/12 合约的口径差会自动消失。

清单（详见技能文档）：
- [ ] Caspian 刷 10 家 A 股市值 + ALB/SQM 报价，重算 forward PE
- [ ] 研报库找 26E/27E 有无更新（预期大部分仍保持 4 月口径，注明原因）
- [ ] 更新 `market.json`：`meta.asOf` / `priceCall` / `keyMetrics` / `researchUpdates`，
      并在 `changelog` **最前面**插入新条目
- [ ] 重跑取数脚本刷期限结构
- [ ] CSV 有项目事实变化才动 `UPDATE_MARKER` 并给改过的行写 `updated`
- [ ] 版本号：`DATA_CACHE_KEY` 必升；`src/reports/index.js` 的 `date` = 新的 `meta.asOf`
- [ ] 若新数据让某个缺口部分补齐 → 改写 `data/gaps.js` 对应条目的 `have`（**别删条目**）
- [ ] `npm run build` → `npx vite preview` 浏览器核对 → `npm run deploy`

### ✅ 4. Phase 6 — 表格与地图升级 —— 已完成（2026-08-11）

见 §六（已改写为「交付了什么」）。

### ⬜ 5. Phase 7 剩余部分 — 无障碍（**现在是唯一剩下的事**）

键盘遍历筛选/图例/表格/地图/抽屉、ARIA、focus-visible、对比度、色觉、
`prefers-reduced-motion`。放在 Phase 6 之后，因为抽屉和聚类会引入新的可聚焦元素，
先做 a11y 会返工。

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
| ~~nginx 对 `charts/` 的缓存~~ | **已解决**：2026-08-11 部署后实测 `charts/kit.js`、`charts/capacity.js`、`charts/term-structure.js`、`components/escape.js` 全部返回 `no-cache`。 |

同一个后台标签页限制也影响高度验证：`notifyParentHeight()` 走 rAF，在后台标签里
不发送。§四 的高度数据是通过**在 iframe 内注入等价的 postMessage** 测出来的，
测的是父页的应用逻辑与 `#app` 的真实高度，绕过了 rAF 那一层。

### 5.2 LC2707 的缺口 —— 预期未兑现，但口径差已用另一种方式消除

**上一版写的「刷到当天后 11/12 合约的口径差大概率自动消失」没有兑现。**
2026-08-11 周更实测：新浪对 **LC2707 与 LC2708 仍无任何日线历史**，且 LC2706 当日
无成交，覆盖面反而从 11 个**收窄到 10 个**（2608–2705）。远月合约公开日线历史的缺失
是结构性的，不是时点问题——别再指望它自愈。

口径差本身已经消除，但走的是另一条路：`gfex-term-spread` 磁贴**改用与曲线相同的
10 个合约**（此前是含 LC2707 的 12 合约口径，报 −7,240）。现在磁贴与图同源，
差额按定义为零。代价是与历史值不可直接相减，因此周更日志里给了同口径对比
（2608–2705：−6,360 → −4,100，走平）。

原则不变：**磁贴管数字，图管形状**，两者必须同源。

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

## 六、Phase 6 — 表格与地图升级（已完成 2026-08-11）

### 6.1 交付了什么

| 项 | 结果 |
|---|---|
| 项目表：冻结列 | ✅ 首列 `项目` sticky left:0 |
| 项目表：列组切换 | ✅ 四组（概览 8 / 地质 7 / 物流 6 / 全部 15），进 store 与 URL |
| 项目表：分页或虚拟滚动 | ❌ **刻意不做**，见 6.3 |
| 项目表：行 → 详情抽屉 | ✅ 覆盖全部 23 个 CSV 字段 |
| 项目表：移动端卡片视图 | ✅ 纯 CSS，保留 `<tr>` |
| 地图：尺寸图例 | ✅ `L.Control`，圆的大小由 `radius()` 求得 |
| 地图：点聚类 | ❌ **刻意不做**，见 6.3 |
| 地图：区域快捷缩放 | ✅ 8 个区域，按可见集算边界 |
| 地图：与 selection 双向联动 | ✅ 行 ↔ marker ↔ 抽屉 ↔ 相机 |

### 6.2 核心改动：`data/columns.js`

列此前声明在**三处必须手工同序**的位置（`copy.js` 的 14 个表头、`app.js` `.map()`
回调体内的宽度字面量、`renderTable()` 的 14 个 `<td>`），没有任何东西校验三者一致。
在其中两处插一列会让每个表头相对数据左移一格——读起来像「看似合理的乱码」而不是崩溃。
现在 key/label/width/groups/render 在一个对象上，其余全部派生，`copy.js` 的
`tableHeaders` 已删除。

构建检查新增 7 条断言，其中三条已**实测会 FAIL 而非静默通过**：非 `derived` 的列 key
必须存在于 CSV（重命名 CSV 列 = 构建失败）、`render` 名必须合法、冻结列必须是每个组的
首元素。另加 CSV 项目名唯一（`selection` 与 `listed-owners` 都以它为键，此前无人断言）。

### 6.3 两处刻意的范围收缩 —— **别再去实现它们**

原计划里的「分页或虚拟滚动」与「点聚类」经评估后**决定不做**。下一个人读到原计划会想去
补上，所以这里写明理由与重新启用的触发条件。

**分页 / 虚拟滚动 —— 不做。** 44 行下性能收益为零；而分页的定义就是「表格故意比 KPI
少显行」，会把 `tableRows === visible.length` 削弱成对刚写的算术的断言——而
`core/invariants.js` 当初正是为了防「英雄区 44 / 表格 43」才存在。附带成本也都是真的：
`page` 字段需要在筛选变化时钳制（正是 `store.js:37-51` 重入保护注释里点名的场景）、
URL 语义会随数据增长而漂移、选中项落在另一页时抽屉与表格会不一致。
**替代做法**：`.table-scroll` 限高滚动区（顺带修好了从未生效的 sticky 表头），
并把增长触发条件写进代码 —— `data/columns.js` 的 `TABLE_ROW_BUDGET = 250`。
**重新启用的条件**：行数超过该预算**且**不变量能用 KPI 也发布的总数重新表述。
超预算后的第一根杆是 debounce 搜索 commit，不是分页。

**markercluster —— 不引入。** 44 个点上全是成本：多一个 CDN 依赖（本页依赖面目前只有
Leaflet）、需要多钉 SRI、且它默认的簇气泡是绿/黄/橙，正好撞上 `data/palette.js` 里
Operating / Ramp-up 的同色系——一个绿泡泡会被读成「在产簇」。
（顺带更正一个常见误解：`MarkerClusterGroup.getLayers()` 返回叶子 marker 而非簇数，
所以不变量其实**不会**被聚类搞坏。拒绝理由是上面那些，不是不变量。）
**替代做法**：三条更便宜的修法覆盖了它想解决的真实问题（zoom 2 下阿根廷十个盐湖摊成
一团）——确定性 z-order（按产能降序画，小点永远在上）、区域快捷缩放、选中联动。

### 6.4 顺带修好的两个既有 bug

1. **sticky 表头从未生效。** `.tablewrap` 是 `overflow:auto` 但没有限高，于是它成了
   `th{position:sticky;top:0}` 的滚动容器却永远不滚动，sticky 偏移从未咬合——表头一直
   随页面滚走。它看起来是实现过的，其实没有。新增内层 `.table-scroll`
   （`max-height:min(72vh,820px)`）后实测 clientHeight 819 / scrollHeight 3515。
2. **`REPORT_STATE_KEYS` 漏了 `structure`。** `core/url-state.js` 一直在编码它，但
   React 包装器的镜像键表里没有，因此结构筛选从来无法通过宿主分享链接存活（双向都不行）。

### 6.5 下一个人要知道的

- **列宽绝不能压。** 375px 下 `width:auto` 曾让表高涨到 41,478px。现在这条约束由
  `--table-min-width` + `table-layout:fixed` 对**每个列组自动成立**。
- **`--table-min-width` 是自定义属性，不是 `style.minWidth`。** 内联 `min-width` 会
  压过任何样式表规则，导致 ≤640px 的卡片布局无法复位它、页面在 375px 下横向溢出到
  2,572px。这个 bug 在本阶段实际发生过一次并已修复。
- **抽屉不能用 `position: fixed`。** 父页把 iframe 撑到全内容高度并设 `scrolling="no"`，
  所以 iframe 的视口**就是**整个约 6,000px 的文档；`fixed; top:0` 会把它钉在读者已经
  滚过 4,000px 的文档顶部。桌面端用 `absolute` 于 `.mapbox`（因此不贡献页高、
  无需高度三连），≤640px 才进正常流并触发三连。
- **抽屉不要复用 `.popup-*` 类。** `.popup-value-primary` 是 `#1f2937`，为 Leaflet 的
  白色弹窗选的深色墨，放到深色卡片上近乎不可见。
- **相机不是 store 状态。** 区域缩放直接调 `map.fitBounds()`，这是「handlers 只 commit
  不 render」唯一正当的例外（相机不可分享、能自行挺过 `clearLayers()`、放进 store 会让
  每次搜索按键都重新瞄准地图）。
- **`selection` / `cols` 必须是顶层原语。** `core/store.js` 的 `valueEqual` 只有一层深，
  `filters` 已在该上限；第三层嵌套会在每次 commit 静默判不等，废掉 no-op 去重。
- **移动端卡片是纯 CSS 的，行仍是 `<tr>`。** 这样 `tbody tr:not(.is-empty-state)`
  照样能数，不变量不需要移动端分支，也不存在第二条渲染路径。
  代价：`full` 列组在 375px 下页面约 31,000px 高（默认的 `overview` 约 15,000px）——
  这是「不再隐藏任何字段」的必然结果，不是回归。

### 6.6 Phase 6 的验证结果

- 一致性检查通过；全部模块 `node --check` 通过；构建通过。
- 三条新构建断言各自故意触发过一次，确认会 FAIL：改名 CSV 列、非法 `render` 名、
  冻结列不在组首。区域断言同样实测（删掉 Ghana → 报错）。
- 四个列组：表头数 === 单元格数 === 期望列数，44 行不变，前三组无横向滚动，
  `full` 2,552px 触发横滚。
- 冻结列：右滚 400px 后首列仍固定在滚动容器 x=0。
- 抽屉：行按钮 / marker / Esc / 关闭按钮四条路径均正确开合；把选中项筛掉会在**同一次
  commit** 内清空选中并关闭抽屉；6 个分节 22 个字段。
- 尺寸图例的三个圆半径与 `radius(stop)` **逐一相等**（证明确实复用了函数而非复述公式）。
- 区域 chips 计数：全球 44 / 南美 13 / 澳洲 7 / 北美 8 / 非洲 6 / 中国 4 / 欧洲 4 / 巴西 2，
  合计与 44 一致；点击后地图确实重新取景（截图确认）。
- 375px：`overview` 与 `full` 均**无页面级横向溢出**，44 行仍在，不变量横幅静默。
- 零页面来源的控制台报错（仅浏览器扩展噪声）。

**未验证**（与 Phase 5 同一个环境限制）：iframe 高度契约。扩展驱动的标签页始终是后台态，
Chrome 在其中挂起 rAF 并节流定时器，`notifyParentHeight()` 走 rAF 因此不发送，任何
`await` rAF/`setTimeout` 的驱动脚本都会超时。本阶段没有改动高度相关代码路径
（只是把 `applyView` 里的三连提取为 `notifyHeightTriple()` 并在切列组/切选中时复用）。
**真机或前台标签页可验证。**


## 七、Phase 7 — 无障碍 + 收尾（未开始）

- 键盘遍历筛选 / 图例 / 表格 / 地图 / 抽屉；ARIA；focus-visible；对比度；
  `prefers-reduced-motion`。
- ~~重写 `~/.claude/skills/report-weekly-update/references/lithium-report.md`~~
  **✅ 已于 2026-08-11 完成**（提前从本阶段拿出来做）。当时它过期到 **Phase 4**——
  不是原计划里说的「Phase 1 之前」，这个区别很重要，因为 Phase 4 早就上线了，
  危险是**当时就存在**的：它会把周更引去改 `data/copy.js` 里的 changelog / priceCall，
  而那些内容 Phase 4 已搬进 `market.json`，改了能通过构建但页面纹丝不动。
  新版补上了三时钟、23 列 CSV、Metric/SeriesEnvelope 契约、`charts` 块、
  `fetch-lithium-series.mjs`、以及「补齐缺口时要改写 `gaps.js` 而不是删条目」。

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

## 九、2026-08-11 周更（已部署）

第一次按重写后的技能文档实跑，兼作对该文档的检验。

**结论性发现**：两周里锂价净变动约等于零（生意社电池级 14.3 万持平），而 10 家 A 股
全部上涨 6.5%–12.6%。逐条排除 ALB 财报（A 股 08-03 启动早于它）、中报（预告在窗口
之前）、beta（同期创业板指 −1.49%）与现货（到 08-06 还在跌）之后，可查证的驱动是
连续 13 周且在加速的去库 + 仓单 −37% + 08-03 储能 300GW 规划 + ALB 披露自身碳酸锂
库存不足 3 周 + 卖方集体上调。**是预期重定价，不是价格重定价。**

**两条上期论断被证伪 / 修正**（正是「给旧判断打分」这一步的价值所在）：
1. 「津巴布韦矿石 8 月起密集到港」未兑现——6 月发运仅 6 万余吨，低于禁令前月均 10 万吨以上。
2. 「枧下窝 6/29 获安全生产许可、拟四季度复产」过于乐观——财新 08-07 实地核实其**仍处
   停产检修状态**，环评 08-07 刚完成公示、待专家评审。

**一处政策口径错误已更正**：津巴布韦 2027-01-01 **不是**原矿出口禁令生效日，而是配额制
下的**本地硫酸锂厂建成期限**（禁令 2026-02-25 已实施、2026-04 有条件解除，精矿 7 月起
恢复到港）。政策时间轴、CSV 三个津巴项目的 `risks`、缺口登记均已同步。
教训：**确定生效日的政策也会被误读，条款的「性质」和日期同样需要复核。**

**一处历史数据错误已更正**：期限结构价差磁贴的口径描述写作「近月减最远月」、备注写作
「近月贴水远月」，与其自身负号的含义相反。数值一直是对的，措辞两处倒置。

### 9.1 技能文档在这一趟里被实测出的问题

`~/.claude/skills/report-weekly-update/SKILL.md` **主体也是过期的**——此前只重写了
`references/lithium-report.md`。主体仍在讲 `DATA_VERSION`（已删除的常量）、
`locales.*.researchUpdates` 与 `researchUpdateMeta`（Phase 4 已搬进 `market.json`）、
「每条 zh+en 双语同步」（语言开关已下线）。已整体修好，并补进了这一趟新学到的：

- 用 `a_share_financials` 判断中报是否真的披露（`reports[]` 里有没有该季度的定期财报），
  **不要用网络检索**——网页摘要经常把业绩预告中值写得和实际数字一模一样。
- 研报库里有语音转写的电话会纪要，其中的数字可能是转写误差；优先采信带评级/目标价的
  正式报告，不采信的要写进备注说明为什么。
- 同源可比：上期取某家的区间下沿，这期取另一家的均价，会凭空造出一个不存在的涨跌。

### 9.2 部署注意（本次踩到）

`scripts/deploy.sh` 有一批**未提交**的在途改动（金属日频存储那摊），会让
`npm run deploy` 顺手把 `scripts/lib/` 推上服务器并 **ssh 进 maru 跑 `backfill-daily.mjs`**。
本次用 `git stash push scripts/deploy.sh` 绕开了那一步再 `git stash pop`。
在那摊工作收尾之前，部署锂报告都要这么做。
