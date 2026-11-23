# 钨价历史来源与持续采集方案

核验日期：2026 年 10 月 13 日。适用页面：`2026-06-metals-ytd`。

可以恢复钨价趋势。当前可机械采集且覆盖最近行情的公开来源，是中钨在线英文市场简报里的欧洲 APT 报价区间。项目已回填 **221 个发表日对应的报价点**，覆盖 **2025-08-25 至 2026-10-12**，并接入原来的更新流程。它是市场简报转述的指示性报价，不是独立的每日成交收盘价，也不能与原来的中国 FOB 手工价格直接拼接。[2][4]

正式评级机构的日度或周度数据也有采购路径。SMM 的中国 FOB 旧序列已停更，但新的鹿特丹序列按周发布；Fastmarkets、Asian Metal、Argus 仍提供相关 APT 基准。历史访问和对外展示许可需要分别确认。公开可读的文章和图表，不等于开放授权的完整数据库。[5][6][7][8][11][14][15][16]

## 原页面为什么没有趋势

修复前，线上钨节点只有 `2025-12-31: 1050` 与 `2026-06-13: 1200` 两个点；本地第二个点日期为 `2026-06-12`。更新脚本把 `1200 USD/mtu` 写死为人工报价，注释称“中国 FOB APT”，缺少逐次报价的原始出处。反复运行采集脚本也不会产生新的市场信息，页面至多连接两个历史点。

这与 SMM 旧 FOB 序列自身的停更是两个问题。SMM 旧页面明确列出截至 **2025-10-09**，最后区间为 **620–630 USD/mtu**，平均值 **625**；换域名或每天读取这个页面不能恢复 2026 年的走势。[5] 因此既要替换固定价格，也要选择持续维护的同口径历史来源。

## 来源对比

| 来源 | 频率与口径 | 已核实的历史或新鲜度 | 采集判断 |
| --- | --- | --- | --- |
| 中钨在线 Chinatungsten | 日度简报中出现的欧洲 APT 区间，直接 USD/mtu | 420 天窗口内提取 221 个有效日期，最近 2026-10-12 | 当前采用；保留原区间和出处，声明指示性报价。[2][3][4] |
| SMM 原中国 FOB APT | 中国 FOB、88.5% WO3、USD/mtu | 截止 2025-10-09，标记停止更新 | 排除持续更新用途。[5] |
| SMM CIF Rotterdam | ≥88.5% WO3、CIF 鹿特丹免税价、USD/mtu，周四发布 | 2025-12-01 开始；最新可见报价日期 2026-10-08 | 正式数值和历史需要登录及许可；不能把公开采集说明中的卖方报价当正式评估值。[6][7] |
| Fastmarkets | MB-W-0003 中国 FOB；MB-W-0001 鹿特丹/巴尔的摩 CIF，各为周度评估 | 公开图：中国 21 点至 2026-06-03；欧洲 22 点至 2026-05-29 | 公开图用于历史核对，持续历史与 API 走数据许可。[8][9][11][12][13] |
| Asian Metal | 中国 FOB 与鹿特丹仓库 APT，USD/dmtu；服务介绍称日度发布 | 报价表日期已到 2026-10-12，数字与历史登录后查看 | 日度采购候选，订阅和公开展示权利需要确认。[14][15] |
| Argus | 中国 FOB 与鹿特丹未完税仓库 APT，USD/mtu | 免费样刊核实了真实区间、报价变动日和月均，但样刊属于 2023 年 | 可采购的标准基准；样刊不能补出 2026 年完整历史。[16][17] |
| USGS | Argus 来源的欧洲 APT 月均 | 2025 年 12 月月均 861.88 USD/mtu，报告在 2026 年 3 月发表 | 月度交叉检查，不能生成逐日或逐周价格。[18] |
| Almonty SEC 披露 | 欧洲 Metal Bulletin APT 市场说明与期间平均价格 | 披露 2026 年 6 月末约 3075、8 月 7 日约 3087 USD/mtu | 稀疏核验点；季度均值不能改成某一天的现货价。[19] |
| DERA Preismonitor | 月度监测，区分 APT、钨铁和钨粉规格 | 2025 年 2 月方法说明可读；2026 年 8 月 PDF 未取得数值 | 可作月度参考，暂不接入生产采集。[20] |

另外筛掉了三个看似便利的来源：Metalary 的标题声称 2026 更新，但可见年表止于 2018；Trading Economics 的 `/commodity/tungsten` 返回通用页面，缺少钨基准定义；tungstenprices.com 最近可见评估仍为 2026-04-02，来源仅称“Market composite”。这些页面不足以支持持续的 APT 趋势。

**证据判断：** 中钨在线的公开历史访问、单位和发表日期已经实测；把这些报价等同于某一家评级机构的正式欧洲基准，证据不足。商业机构的 API、历史和基准产品存在，但免费匿名持续数值与对外复用权未得到验证。

## 采用序列的含义

序列名称为 **European APT · indicative range midpoint**，来源署名 **Chinatungsten Online**。`ctia.com.cn` 的运营主体是厦门中钨在线科技有限公司，不应把它标成中国钨业协会的独立定价机构。[1] 简报没有充分说明欧洲具体交货地、纯度、货量、税费口径或原始报价机构，因此也不标注“CIF Rotterdam”或推定来自 Fastmarkets。[4]

每个点保存 `date`、`price`、`low`、`high`、`sourceUrl`。`date` 是包含该有效报价的简报发表日，按发布者本地日期取值；同一区间在不同日的简报里重复出现，表示有多个发表日的观察记录，不能据此推断每天都发生了新交易或独立评估。`price` 是 `(low + high) / 2`，保留两位小数。原始区间继续保留，避免中点隐藏报价宽度。

最近有效点来自 2026-10-12：**2500–2900 USD/mtu，中点 2700**。10 月 13 日的新文章没有欧洲 APT 数值，采集器因此不会把 10 月 12 日的价格改写成“10 月 13 日报价”。[4] 这也解释了为什么页面的“数据文件更新时间”和“Report 日期”分别显示。

年末同来源基准是 **2025-12-30 的 825–900，中点 862.5 USD/mtu**；窗口中没有发现 12 月 31 日的对应欧洲报价。[3] 页面以这个实际的最后年末观察值计算 YTD，因此 2700 对应约 **+213.0%**。这个百分比是本项目从两个中点计算的结果，不引用文章自己的涨幅口径，也不拿旧的 1050 人工点作分母。

图形使用阶梯线表达最近已发表报价。数据文件不插值、不补周末、不制造缺失日的观察记录。日度简报也能支持按周观察趋势；若需要严格周度导出，应按每周最后一个已有报价日期聚合，继续保留它的真实日期。

## 采集和维护

公开 WordPress 栏目为 `tungsten-news`，类别 ID 为 `17`。接口只请求日期范围内的 ID、发表日期、原文链接和正文，单页最多 100 篇，并根据 `X-WP-TotalPages` 顺序读取。这次 420 天窗口共读 5 页；相邻请求间隔 300 毫秒，单请求超时 20 秒。没有使用登录信息或绕过访问控制。[2]

只接受明确的 **European APT + USD + 价格上下界 + /mtu**。中国国内 RMB/ton、钨铁 USD/kg W、钨粉、缺失币种以及反向区间均不入库。已发现 6 篇简报把欧洲 APT 单位写成 `/ton`，例如 2026-01-05 与 2026-10-08；采集器跳过，不能凭上下文擅自修正单位。单篇文章出现冲突区间时也跳过。语法变化可能降低覆盖率，应通过原文核对再扩展规则。

`scripts/lib/sources/ctia-tungsten.mjs` 管理提取、分页和基准迁移；`scripts/backfill-tungsten.mjs` 只回填钨；原来的全金属历史回填及小时更新流程也已接入。增量更新会重读最新有效发表日前 14 天的简报，捕获近期更正；冷启动或旧手工基准自动走完整 420 天历史。

首次迁移只有在完整采集成功、报价校验通过后，才替换旧钨节点。旧手工年末锚点和旧“当天快照”都不进入新欧洲序列。之后相同日期可修订、不同日期可保留相同价格；重复运行不增加重复点。网络失败、无有效报价或分页中断会报错，不回退到固定 1200。页面超过 14 天没有有效钨简报报价时显示 `Quote overdue`。

```bash
# 本地仅回填钨
node scripts/backfill-tungsten.mjs

# 本地仅执行钨的增量更新
METALS=tungsten node scripts/update-prices.js

# 服务器只回填钨，不覆盖其他金属
DATA_FILE=/var/www/reports/data/metals-prices.json \
DAILY_FILE=/var/www/reports/data/metals-daily.json \
node /var/www/reports/scripts/backfill-tungsten.mjs
```

线上既有小时 cron 无需新增定时任务，但须先发布新的采集模块和页面，并执行一次回填。部署脚本会同步来源模块，先执行铜、钨、锂的专用回填并核验增量更新，再发布页面；其余金属的历史和服务器年度文件继续保留。全金属回填仍可单独执行。`metals-prices.json` 的 50 年年度钨价仍保留旧序列，采集器不把欧洲日价写进那条口径不明的年度历史。

验证结果：10 项采集器测试通过，涵盖单位和地区混用、异常日期、重复和冲突报价、分页失败、基准迁移、重复运行及损坏数据文件保护；实际完整回填获得 221 点；在临时副本上执行实际增量更新，最近仍为 10 月 12 日，未生成 10 月 13 日假报价；其余 12 种金属的本地节点未改变。生产构建通过，桌面 YTD、滚动一年、手机显示和来源链接均经浏览器核对。

## 最薄弱假设和边界

**真实风险：** 当前方案最依赖简报持续发表、且欧洲报价口径保持稳定。公开网页没有承诺 API 可用性、历史不可修改或正式评估方法。如果栏目停止、单位改写或来源口径变化，应保留旧观察并标记过期，通过原文确认后再改适配器；不要用中国国内价格或另一家欧洲基准自动填洞。[1][2][4]

**部分成立：** 日度发表不等于每日独立价格发现。保留发表日期与区间、采用 `Daily reports` 标签，可以支持观察公开报价走势；若用途升级为严格可比的正式国际基准，应优先采购有明确方法、日期、低高值和完整历史的同一机构序列，并重新计算自己的基准。[9][10][14][16]

只保存数值事实及出处，不发布文章正文和图片。正式数据产品的读取许可与公开再分发许可需要分别核实；尤其 SMM、Asian Metal、Argus 明确列有使用限制。当前调研没有取得数据再分发授权，也没有开通账号、购买服务或联系供应商。[5][6][15][16] 商业迁移时，应向机构确认 `reports.instap.net` 展示权、历史导出、区域规格、评估日历、API 限速和更正机制。

## 来源登记

以下来源用于方案、口径或交叉验证；网页可读与数值可用性分别标明。共 20 个来源，9 个域名，单一域名占比最高 20%。价格数字的可信度与发行方网页身份的可信度分开评估。

1. [中钨在线运营主体](https://www.ctia.com.cn/about)，运营主体信息；来源身份高，独立定价方法未明确。
2. [中钨在线钨新闻栏目](https://www.ctia.com.cn/en/news/tungsten-news)，公开正文与日期；已实测公开 REST 栏目与分页。
3. [2025 年 12 月 30 日欧洲 APT 报价](https://www.ctia.com.cn/en/news/47039.html)，年末同来源基准。
4. [2026 年 10 月 12 日欧洲 APT 报价](https://www.ctia.com.cn/en/news/53543.html)，最新有效区间。
5. [SMM 旧中国 FOB APT](https://www-old.metal.com/Tungsten/201308090019)，明确停止更新。
6. [SMM CIF Rotterdam APT](https://www.metal.com/tungsten/202511260001)，活动序列日期可读，正式价格登录后查看。
7. [SMM 鹿特丹 APT 上线说明](https://www.metal.com/announcements/103639069-smm-announcement-announcement-on-the-launch-of-apt-cif-rotterdam-port-and-ferrotungsten-in-whs-rotterdam-price-points)，规格、起始日期、周度频率。
8. [Fastmarkets 钨价格产品](https://www.fastmarkets.com/metals-and-mining/minor-metals/tungsten-prices/)，基准代码与公开历史图。
9. [Fastmarkets 非铁金属方法与规格](https://www.fastmarkets.com/uploads/2024/02/fm-mb-non-ferrous-methodology-specifications.pdf)，2024 年 2 月版本；正式采购时重核当前日历。
10. [Fastmarkets 国内与出口 APT 市场分化](https://www.fastmarkets.com/insights/tungsten-markets-fragmenting-as-domestic-chinese-apt-market-diverges-from-exports/)，2026-06-29 发表，内含 6 月 19 日与 24 日报价。
11. [Fastmarkets API](https://www.fastmarkets.com/platform/api/)，按数据许可提供最新、均值、完整历史。
12. [官方嵌入的中国 FOB 周价图](https://flo.uri.sh/visualisation/29250144/embed?auto=1)，普通浏览器可读，止于 2026-06-03；未验证稳定下载接口。
13. [官方嵌入的欧洲 CIF 周价图](https://flo.uri.sh/visualisation/29249982/embed?auto=1)，普通浏览器可读，止于 2026-05-29；页面标题残留其他金属模板名，实际图题、数据标签和来源为 APT。
14. [Asian Metal APT 指数](https://www.asianmetal.com/Ammonium-Paratungstate-Price-Index/)，2026-10-12 更新日期可见，数字登录后查看。
15. [Asian Metal 使用条款](https://www.asianmetal.com/about/termsConditionsV2.shtml?f=)，订阅与公开复用权需分别确认。
16. [Argus 非铁市场样刊](https://view.argusmedia.com/rs/584-BUW-606/images/Argus%20Non-Ferrous%20Markets%20(2023-03-17).pdf)，2023-03-17，正式 APT 区间示例。
17. [Argus 钨月报样刊](https://view.argusmedia.com/rs/584-BUW-606/images/Argus%20Tungsten%20Monthly%20Outlook%20(2023-07-12).pdf)，2023-07-12，月均区间示例。
18. [USGS 2025 年 12 月钨月报](https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/media/files/mis-202512-tungs.pdf)，2026 年 3 月发表，欧洲 APT 月均。
19. [Almonty 2026 年中管理层讨论](https://www.sec.gov/Archives/edgar/data/1670061/000149315226037264/ex99-3.htm)，2026-08-11，区分期间平均与市场现价。
20. [DERA 2025 年 2 月价格监测](https://www.deutsche-rohstoffagentur.de/DE/Themen/Min_rohstoffe/Produkte/Preisliste/pm_25_02.pdf?__blob=publicationFile&v=2)，仅核验索引中的方法说明，不用作当前数值来源。

低分排除来源：Metalary（当前价格可信度 3/10）、Trading Economics 上述钨路径（2/10）、tungstenprices.com（2/10）；未验证的旧 ITIA 下载链接和未取到数值的 DERA 2026 年 8 月 PDF 也不进入生产数据。
