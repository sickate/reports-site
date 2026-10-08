# 全球前十大晶圆代工与 IDM 制造版图：地点、产能与时间线

Report: https://reports.instap.net/reports/2026-05-wafer-foundries
Date: 2026-05-07
Coverage: rendered-initial-view-and-existing-data

基于 Knometa/IC Insights 2024 月度产能口径，可视化前十厂商 ~55 个 fab/site 的全球分布、产能聚合与 2025–2030 关键项目时间线，覆盖 Samsung / TSMC / SK hynix / Micron / Kioxia-WD / UMC / Intel / TI / SMIC / Powerchip-Nexchip。



Foundry & IDM Footprint
全球前十大晶圆代工与 IDM 制造版图
按 Knometa / IC Insights 2024 月度装机产能口径排名 Top-10 厂商 (Samsung · TSMC · SK hynix · Micron · Kioxia/WD · UMC · Intel · TI · SMIC · Powerchip/Nexchip)， 把报告中 ~55 个 fab/site 落在地图上，并按区域、晶圆尺寸、状态、节点分层做必要聚合， 完整保留 2025–2030 项目时间线与厂址明细。
数据快照 2026-05-07。地址按官方公开信息；未披露 site-level WSPM 标 估(H/M/L)；fab-level 客户分配普遍不公开。

快速入口
独立打开专题页↗ (/research-topics/wafer-foundries-2026.html)
页面包含：公司排名条形图 · CARTO Dark 底图的 Leaflet 互动地图 · 4 张 Plotly 聚合图 · 时间线 · 厂址明细表 · 数据来源。

Foundry / IDM Map独立打开 (/research-topics/wafer-foundries-2026.html)
加载全球晶圆代工/IDM 制造版图...

## Embedded report

全球前十大晶圆代工与 IDM 制造版图（2024 月度产能）

 Foundry & IDM Footprint · 2024 capacity
 全球前十大晶圆代工与 IDM 制造版图

 口径：Knometa / IC Insights · 2024 年底全球月度晶圆制造装机产能（非 foundry-only 收入排名）。同时纳入纯晶圆代工、内存 IDM、NAND 合资体；前段 wafer fab 为统计对象，封测 / 先进封装不计入主表。

 报告原文 deep-research-report (5).md · 数据快照 2026-05-07。地址按官方公开信息，对未披露 site-level WSPM 标注 估(H/M/L)。

 公司排名：2024 月度装机产能 (k wafers/month)

 前十产能呈 “存储主导、逻辑牵引” 结构：按装机能力计，前十里有五家本质由存储/NAND 驱动 — 三星、SK hynix、美光、Kioxia/WD JV，以及力晶系部分产能；真正以先进逻辑节点为扩张主线的，仍是 TSMC、Samsung Foundry、Intel 三家。UMC、TI、SMIC、Nexchip 的核心增量则集中在 28nm–180nm 的成熟与特色工艺。前 2 家 (Samsung+TSMC) 合计占 Top-10 的 41.7%，前 5 家占 70.5%。

 互动工厂地图：~55 个 fab / site 全球分布

 点 marker 看公司、fab、地址、产能、制程、状态。同园区 (如 Hsinchu Science Park、Pyeongtaek) 的多 fab 已加微抖动避免重叠。颜色 = 公司，大小 = 产能档位，边框样式 = 状态。

 公司

 区域

 状态

 尺寸

 重置

 按区域汇总产能

 东北亚仍是绝对中心。台湾、韩国、日本、中国大陆四地合计占公开装机产能的绝大部分；美国、欧洲、东南亚虽有增量项目（TSMC AZ/Dresden、Intel Ireland、Micron Singapore 10B、TI Sherman），但到 2026 年中真正稳定供给的新增前段项目仍有限。

 按晶圆尺寸分布

 300mm 已是绝对主力，但 200mm 与 6-inch legacy 并未被淘汰：UMC、TSMC、SMIC、PSMC 均仍维持 8-inch 群组，覆盖 RFSOI、BCD、HV、eNVM、CIS、显示驱动等长尾特色。这是成熟制程在汽车/工业/电源链路上的真实基底。

 按状态汇总站点数

 绝大多数 fab 处于 Operating。处于 Construction / Planning 的项目集中在 TSMC 海外 (AZ/Dresden/Kumamoto F2)、Samsung Texas、Intel Ohio、Micron Boise+NY+Singapore 10B、TI Sherman SM2-4。这是未来两年供给斜率的核心变量。

 按节点分层汇总产能

 三层结构：先进逻辑 决定 HPC/手机 SoC/AI 加速器；AI 存储 决定 HBM/DRAM/3D NAND；成熟特色 决定汽车 / 工业 / 电源 / 显示驱动 / 射频与模拟。AI 时代资本开支并不只在逻辑上，HBM/DRAM/3D NAND 是同步放大的另一条主线。

 2025–2030 项目时间线

 仅纳入公开资料能较明确核验上线 / 量产时间的重点项目。

 厂址明细表（~55 行，原报告数据）

 公司 | 站点 / Fab | 地址 | 投产 | 
 产能 / 面积 | 晶圆 / 制程 | 状态 | 员工 / 客户 | 

 说明：产能优先写公开值；若仅有公司总量则按官方 site class 分配为区间，标 估(H/M/L)。fab-level 客户分配通常不公开，多为公司级公开点名或终端行业。

 结论与局限

 如果把问题放到 “至少交易到两年后”，这份工厂清单最重要的结论不是“谁厂最多”，而是 谁的新增 cleanroom 最可能在 2027–2028 真正转化成高价值晶圆产出。最值得跟踪的兑现链条：TSMC 海外先进逻辑良率与客户装载；Samsung Texas 2nm 与美国项目节奏；SK hynix / Micron 的 AI memory 兑现；Kioxia/WD K2 与后续 NAND 节点切换；TI / UMC / Nexchip 的成熟 300mm 稼动率。

 三个常被市场忽略的关键变量：① 成熟制程并不等于低壁垒 — TI / UMC / SMIC / Nexchip 的护城河在高良率、大规模 200/300mm 特种平台与长生命周期客户黏性；② AI 资本开支不只在逻辑，HBM / DRAM / 3D NAND 同步放大，存储制造商在未来两年的资本效率上反而更关键；③ 美国本土扩产节奏显著慢于政策叙事 — Samsung Taylor、Intel Ohio、Micron NY 都在不同程度上拉长兑现期，2026–2028 年供给格局仍偏向亚洲重心延续。

 本报告局限：site-level WSPM 与员工数在 Samsung、Intel、SMIC、SK hynix 与部分 TSMC 海外项目上不完整 → 已标 估(H/M/L) 或“未披露”。Fab-level 客户名单普遍不公开，尤其在 IDM 与存储厂。部分 campus 实际包含多栋 fab/line，本表遵循“以官方最细公开颗粒度列示”的原则。

 数据来源

 核心来源（Knometa 排名 + 各公司官网 / 年报 / 项目披露）
 
 Knometa Research / IC Insights · 2024 capacity leaders

 TSMC official manufacturing facility list (Hsinchu / Tainan / Taichung / Kaohsiung / overseas)

 TSMC GIGAFAB 分类 (>100k 300mm/月)

 JASM Kumamoto Fab 1 / Fab 2 公开披露

 TSMC ESMC Dresden 40k 300mm/月（官方）

 Samsung 半导体园区官方信息（Giheung / Hwaseong / Pyeongtaek / Xi'an / Austin / Taylor）

 Pyeongtaek 园区面积 (~2.89m㎡, 单 fab ~120k㎡, P2 ~128.9k㎡)

 Samsung Austin 2.76M sq ft / 4,500 employees

 Samsung Taylor >5m㎡ site / >3,500 jobs / 2030 target

 SK hynix Icheon / Cheongju / Wuxi / Yongin Cluster 公开披露

 SK hynix M16 High-NA EUV 部署

 SK hynix Yongin First Fab 2027H1 目标

 Micron 全球 fab 列表（Manassas / Hiroshima / Singapore / Taiwan / Boise / NY）

 Micron Singapore Fab 10B 700k sq ft cleanroom / 2028H2 初始出片

 Micron Hiroshima 1β 量产 / 1γ EUV 2025

 Micron Tongluo P5 conversion (从 PSMC 收购)

 Kioxia Yokkaichi 694,000㎡ / 6,788 employees (2026/3/31)

 Kioxia Kitakami K1 / K2 218-layer 第八代 3D NAND

 UMC Fab 12A 87–90k 300mm/月（公开）

 UMC Fab 12i Singapore 50k 300mm/月 + Phase 3

 UMC United Semi Fab 12X Xiamen 50k 设计产能

 UMC USJC Fab 12M Mie 35k 300mm/月

 UMC 公司总 12 fab ≈ 850k 8-inch eq/月

 Intel Ocotillo Campus ~700 acres (Fab 12/22/32/42/52/62)

 Intel Oregon Ronler Acres / D1D + D1X · 21,000 employees

 Intel Ireland Leixlip Fab 24 / Fab 34 · 4,500+ employees

 Intel Ohio New Albany 进度延后 (2025)

 TI DMOS6 Dallas / RFAB1+2 Richardson 650k sq ft / LFAB1+2 Lehi 620k+ sq ft / Sherman SM1-4 1.3M sq ft / $40B 项目

 SMIC Shanghai Pudong / Beijing BDA / Tianjin / Shenzhen 厂群

 PSMC Hsinchu Fab P1/P2/P3 / Fab 8A / Tongluo P5 (50k 300mm/月设计值)

 Nexchip Hefei 12-inch Fab · ~115k+30–50k/月 · TDDI/OLED/BCD/CIS/MCU · Phase IV 55k/月设计

 完整 cite turn 标识保留在原报告 markdown 中。本可视化口径与排名源原值一致；公司总产能与 Site 级估算不强行求和等于排名值，因为 IDM 公司有大量未对外披露的内部 line 分配。

## Existing data files

- https://reports.instap.net/research-topics/wafer-foundries-2026.html
