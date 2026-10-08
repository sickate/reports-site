# 光通信产业链：价值捕获点与验证深度图谱

Report: https://reports.instap.net/reports/2026-04-optical-value-chain
Date: 2026-04-15
Coverage: rendered-initial-view-and-existing-data

按价值捕获点、供给卡点与验证深度重排的光通信产业链页面，覆盖光纤、器件、光源、模块、设备、光引擎与制造装备。



Optical Communications Value Map
光通信产业链：真正拿走价值的是谁
这版不按“上中下游”平铺，而是按价值捕获点、供给卡点、验证深度来重排。Tier 也不是按市值，而是按产品卡位、客户验证、量产成熟度、垂直整合度与行业影响力来重新分层。
FAUMT / MPOAWGCW 光源法拉第旋片OCSNPO / CPO 光引擎
01预制棒 / 光纤 / 光缆 / 特种光缆 (#fiber)02连接与微光学：MPO/MTP、MT ferrule、FAU、透镜 / 棱镜 / 滤光片 (#micro-optics)03无源芯片与器件：PLC splitter、AWG、WDM、VOA、OSW、OADM / ROADM 基础器件 (#passive)04隔离器 / 环行器 / 法拉第旋片 / 磁光晶体 (#faraday)05有源芯片与光源：DFB、EML、CW 光源、VCSEL 阵列 (#active-chip)06硅光 / 薄膜铌酸锂（TFLN）/ CPO / NPO / OCS / 光引擎 (#next-gen)07高速光模块：可插拔模块、AOC、LPO / LRO / FRO、TOSA / ROSA / BOSA (#modules)08传输设备：OTN / WDM / ROADM / DCI / 干线与城域全光网 (#transport)09接入设备与 ODN：PON / FTTH / FTTR / OLT / ONT / ODN 配线 (#access)10生产：封装 / 组装 / 测试交付 / 柔性制造能力 (#manufacturing)11制造 / 封装 / 测试装备 (#equipment)
联动查看： 点按上面的编号、图中的节点或下方正文卡片，可以联动高亮。

最容易被低估
模块背后的小环节
FAU、AWG、MT/MPO、CW 光源、法拉第旋片和光引擎，决定了良率、BOM 与迭代速度。

最该高频跟踪
OCS / NPO / CPO
真正改变估值框架的不是单一速率升级，而是 AI 光互联从模块走向系统级架构迁移。

初版说明
结构化底稿
当前版本先按投研框架整理公司与赛道，后续可继续补来源链接、财务口径和公司对比维度。

Where Each Layer Sits
它们到底装在哪，起什么作用
上面先看它们在网络和设备里的位置，下面再把一个光模块拆开。这样读者能同时看清“产业链站位”和“产品内部职责”。

最容易被低估的价值区： 02–06 这些看似零碎的小环节，往往最决定良率、BOM 和代际切换速度。

系统位置图
从网络到端口再到物理链路
09
接入设备与 ODN
PON / FTTR / OLT / ONT / 配线，处在楼宇、园区与终端入口。

→

08
传输设备
OTN / WDM / ROADM / DCI，把城域、骨干与数据中心拉通。

→

07
高速光模块
800G / 1.6T / AOC / LPO 等端口级产品，直接插进交换机或设备。

→

06
OCS / NPO / CPO
进一步上移到交换架构、板级互联与 AI 集群光互联层。

→

01
光纤 / 特种光缆
真正承载光信号穿过机柜、机房、园区与长距离链路。

光模块爆炸图
把 07 高速光模块拆开，看内部价值链
01 光纤 / 特种光缆
外部光链路把信号送进模块前端。

07 高速光模块 / AOC / TOSA-ROSA-BOSA
模块本体像“壳”，真正决定性能和良率的是里面这条光学装配链。
02
连接与微光学
MT / MPO、FAU、透镜、棱镜把光精准耦合进模块。

→

03
无源器件
AWG / PLC / WDM / VOA 负责分光、复用、路由与损耗控制。

→

04
隔离 / 环行 / 法拉第
抑制回光和串扰，保证链路稳定与器件保护。

→

05
有源芯片 / CW 光源
DFB / EML / CW / VCSEL 生成和调制激光，是发光源头。

→

06
SiPh / TFLN / 光引擎
把多路光、电、封装整合成下一代平台，可继续上移到 NPO / CPO。

08 / 09 / 06 更上层系统
模块装回交换机、传输设备或进一步上移到 OCS / CPO / NPO 架构。

10
封装 / 组装 / 测试交付
把设计变成能规模量产、能稳定交付的产品。

11
制造 / 封装 / 测试装备
把自动化、节拍和良率做出来，是很多环节的隐形放大器。

Architecture Distinctions
OCS / NPO / CPO / OIO 到底差在哪
它们不是同一层东西。OCS 更像网络拓扑层的重构；NPO 与 CPO 主要解决交换芯片附近的电互连瓶颈；OIO 更进一步，直接把“电 I/O”本身改成光。

阅读顺序： 先看每列里“光学件离计算芯片有多近”，再看底部那条“它主要替代了哪一段电连接”。

四种架构的差别，核心在“光学件放在哪”和“替代哪一段电连接”左到右：从网络层的光路重构，到靠近封装，再到共封装，最后进入芯片 / 芯粒 I/O。离计算芯片更远离计算芯片最近OCSOptical Circuit SwitchRack ARack BpluggablepluggableOCSoptical switch fabric改的是网络层光路端点通常仍是传统模块，OCS 负责在中间建立可重构的直通光路径，减少 OEO 与电交换。替代对象：部分 spine / fabric 层的电交换与 OEONPONear-Packaged OpticsboardASICoptical enginesfiber out光引擎在封装旁边，不进封装缩短 ASIC 到 optics 的电走线，通常仍保留较强模块化 / 可维护性，是很典型的过渡方案。替代对象：ASIC 到外置模块之间的长板级电互连CPOCo-Packaged Opticsboardsame packageASICoptical enginesfiber exits near package光引擎与 ASIC 共封装比 NPO 更进一步，功耗、带宽密度和信号完整性更优，但热、封装、维修与供应链协同更难。替代对象：pluggable + 长电通道 + 外部光引擎负担OIOOptical I/Oremote laserpackage Apackage BXPUXPUoptical I/O chipletlight instead of electrical I/O把“电 I/O”本身换成光 I/O重点不是交换机模块位置，而是把光带到 XPU / chiplet边上，做 package-to-package / chip-to-chip 互连。替代对象：芯片 / 封装级电 I/O 与部分近距铜互连一句话区分OCS 是“用光来切网络路径”；NPO 是“光引擎挪到封装旁”；CPO 是“光引擎进封装”；OIO 是“连芯片 I/O 都改成光”。
OCSOptical Circuit Switch
网络层 / 机架间
用光路交换重构拓扑，减少 OEO 转换和部分电交换层。
改的是网络路径，不是把光学直接塞进 ASIC 封装里。

NPONear-Packaged Optics
板级 / 封装旁
把光引擎挪到 ASIC 附近，缩短电走线，同时保留较强可维护性。
常被当作 pluggable 到 CPO 的过渡形态。

CPOCo-Packaged Optics
同封装
把光引擎与交换 ASIC 共封装，进一步砍掉长电连接和 pluggable 负担。
更激进地换功耗、密度和信号完整性，但封装与热管理更难。

OIOOptical I/O
芯片 / 芯粒 I/O
用光替代芯片级或封装级电 I/O，把光直接带到 XPU 或 chiplet 边上。
更偏“替代电 I/O 本身”，不只是一种交换机光模块形态。

口径说明：CPO 与 OIO 在现实产品中会有交叉，但这张图里我刻意把它们区分为两个“主要关注点”。 CPO 更强调光引擎与交换 ASIC 的封装关系；OIO 更强调用光替代芯片 / 芯粒级电 I/O。 NPO 的具体实现路径在行业里还未完全标准化，这里采用的是“位于封装旁、介于 pluggable 与 CPO 之间”的工程化理解。

AI Rack View
把它们放回 AI 机柜与 switch tray 里看
这次不再用“自由摆放节点”的大 SVG，而是拆成结构化布局图。上面讲信号路径，下面按 Rack、Fiber、Fabric、Equipment 四个区来放节点。

阅读方法： `07` 在前面板，`01` 把链路拉出机柜，`06` 开始往系统内部和 fabric 上移；`08/09` 承载设备层，`10/11` 提供量产能力。

Signal Path
07 模块
→
01 光纤
→
06 CPO / OCS
→
08 / 09 设备层

AI Rack A
GPU tray / switch tray / front-panel optics
07
高速光模块
前面板可插拔模块，最接近 switch 端口。

Switch Tray

ASIC

06 CPO engines

这里是“电交换芯片 + 前面板模块”的主战场，若进一步上移，就会从 pluggable 走向 CPO / NPO。

GPU / XPU Tray
XPU
XPU
XPU

OIO 会更靠近这里发生，但这页当前重点仍放在 switch optics 与 fabric 迁移。

Fiber & Patch Zone
high-density cabling / patch panel / structured links
01
光纤 / 光缆
真正把信号拉出机柜、穿过机房和 pod 的物理链路。

02
微光学
FAU / MT / lens

03
无源器件
AWG / WDM / VOA

04
隔离 / 环行
Faraday / isolator

05
光源 / 芯片
DFB / EML / CW

01高芯数光纤、patch panel 和 structured links 负责把链路真正铺开。
02–05这些器件大多在模块或引擎内部完成耦合、分复用、隔离与发光，再从 fiber landing 对外。
06一旦 CPO / OCS 上移，fiber landing 会更靠近系统核心，而不是只停在前面板。

OCS / Fabric Zone
reconfigurable optical paths between racks / pods
06
CPO / OCS / 光引擎
光学开始脱离单个 pluggable，进入系统级互联和交换架构。

OCS Fabric
OCS
这里改的是网络路径与拓扑，不是把 02–05 这些模块内部器件简单搬个位置。

Equipment & Production
system hosts + scale enablers
08
传输设备
OTN / WDM / ROADM

09
接入设备
PON / ODN / FTTR

10
封装 / 测试交付
量产节拍、良率、海外产能

11
制造 / 测试装备
自动化与封测装备

08/09 是承载网络功能的设备层；10/11 不直接出现在链路上，却决定这些环节能不能按良率、节拍和成本大规模量产。

这张图现在不再依赖绝对坐标排版，而是按部署分区做结构化布局。后续即使继续补文案、公司名或说明，也不会像原来那样因为字体和坐标漂移导致整图重叠。

Market Supplement
The 7 Layers of Photonics
这组名单更像“海外资本市场 photonics 观察清单”，不是对前文 11 段产业链的替代，而是一个补充图层。 我把它们按原始 7 层保留，同时标出与本页 11 段投研口径的大致映射。

口径说明： 这里是“市场分层清单”，不强行改写前文中文产业链口径；右上角编号表示和本页哪几段最相关。

1. Materials & Wafers
材料、衬底、外延与晶圆供给

0203040506

$AXTI$ALMU$TECK$IQE$LWLG$SOI$WOLF
更偏光子材料与底层 wafer / substrate 供给，是很多器件与硅光平台的更上游约束。

2. Tools
外延、沉积、刻蚀、检测与工艺设备

1011

$AIXA$ALRIB$VECO$LRCX$AMATHamamatsu (6965 / HPHTY)$ONTO
这组公司更接近工艺设备与制造工具层，对应本页的量产与装备支撑能力。

3. Lasers
激光芯片、发射端与相关平台

05

$SIVE$MTSI$HIMX$STM$LASR
和本页“有源芯片与光源”最直接对应，口径上覆盖激光器件与其平台型受益者。

4. Foundries
硅光 / 模拟 / 混合信号代工与制造平台

050610

$TSEM$FN$XFAB$SANM$UMC$GFS
对应器件与光引擎背后的制造平台，不一定直接是通信纯标的，但承接量产能力。

5. Testing
测试、封测、 burn-in 与可靠性验证

1011

$AEHR$FORM$COHU$TER$VIAV$ASX$AMKR
与本页“封装 / 测试交付”以及“制造 / 测试装备”高度相关，是良率和验证深度的重要支撑层。

6. Optics
光学器件、模块、封装与光子平台

020304050607

$LITE$COHR$POET$MEMS$AAOI$OPTX$LPTH
这是和当前页面重合度最高的一层，覆盖微光学、器件、模块到部分光子平台公司。

7. Networking
DSP、交换、互联与网络设备平台

06070809

$CRDO$MRVL$SMTC$CIEN$NOK$GLW$ALAB$ANET$AVGO
偏系统与网络层，连接本页的光引擎、模块、传输设备与接入设备口径。

Financial & Fundamentals
Materials & Wafers：财务与基本面快照
先把第 1 组补进共享个股模板。24 / 25 / 26 / 27 默认按各家公司自身财年；利润优先写 net income / attributable net income，若公开页只给 EPS 或 EBT，会在卡片里明确标注。

这一组最重要的阅读方式： 不要只看营收体量，要同时看材料纯度、平台属性、分部口径是否真的对应 photonics 价值链。

已接入 0 / 7 家共享 jsonl + React 卡片模板前瞻毛利率多数缺口径
正在加载共享财务快照…

Financial & Fundamentals
Tools：财务与基本面快照
先把第 2 组补进共享个股模板。24 / 25 / 26 / 27 默认按各家公司自身财年；其中 LRCX、AMAT、ONTO、Hamamatsu 的财年与自然年不同。你给的 SHMN 这里按 Hamamatsu Photonics（6965 / HPHTY）处理。

这一组最重要的阅读方式： 先分清 pure photonics tools 与半导体设备平台映射。与 photonics 直接相关度更高的是 AIXTRON / Riber / Veeco / Hamamatsu；披露最完整的是 AMAT / LRCX / AIXTRON / Hamamatsu。

已接入 0 / 7 家披露最完整：AMAT / LRCX / AIXA / Hamamatsuphotonics 纯度更高：AIXA / ALRIB / VECO / Hamamatsu分产品毛利率公开稀缺
正在加载共享财务快照…

Financial & Fundamentals
Lasers：财务与基本面快照
先把第 3 组补进共享个股模板。这里会明确区分 pure laser、lightwave / optical connectivity 平台，以及显示 / 感测 / RF&OC 映射，避免把“激光平台”和“激光映射”混在一起。

这一组最重要的阅读方式： 最纯的 laser 暴露是 LASR / SIVE；MTSI 是 lightwave / optical connectivity / RF 平台；HIMX / STM 更偏显示、感测、成像、VCSEL / ToF 与 RF&OC 映射。

已接入 0 / 5 家laser 纯度最高：LASR / SIVELASR 披露最深：分产品收入 + 分产品 GMSIVE 更像节点驱动而非成熟一致预期票
正在加载共享财务快照…

Financial & Fundamentals
Foundries：财务与基本面快照
先把第 4 组补进共享个股模板。这里明确区分 pure foundry 主线与制造服务映射：TSEM / XFAB / UMC / GFS 是 foundry 主线，FN / SANM 更准确是光模块、通信设备和云基础设施相关制造平台。

这一组最重要的阅读方式： 先区分“wafer foundry 平台”与“系统 / 模块制造承接”。TSEM / GFS / XFAB / UMC 更适合跟平台工艺和 photonics 技术栈，FN / SANM 更适合看 end-market 制造承接与并购扰动。

已接入 0 / 6 家pure foundry：TSEM / XFAB / UMC / GFS制造映射：FN / SANM前瞻 GM 多数缺一致口径
正在加载共享财务快照…

Financial & Fundamentals
Testing：财务与基本面快照
先把第 5 组补进共享个股模板。这里明确区分纯测试设备 / 接口 / 测量主线与封测映射：AEHR / FORM / COHU / TER / VIAV 是测试主线，ASX / AMKR 是封测映射。

这一组最重要的阅读方式： 先分清 test equipment / measurement 平台与 OSAT。AEHR / FORM / COHU / TER 更适合看测试设备景气与 AI、HBM、PIC 相关验证；ASX / AMKR 更适合看 advanced packaging、封测结构升级和客户组合变化。

已接入 0 / 7 家纯测试主线：AEHR / FORM / COHU / TER / VIAV封测映射：ASX / AMKRFORM / VIAV / ASX 披露质量更高
正在加载共享财务快照…

Financial & Fundamentals
Optics：财务与基本面快照
先把第 6 组补进共享个股模板。这里会明确区分 AI 光互连 / 光模块主线、早期放量平台，以及“有光通信小分部但并非主业”的映射，避免把这组做成假整齐。

这一组最重要的阅读方式： 最直接的主线是 LITE / COHR / AAOI；POET / LPTH / OPTX 更偏早期或细分平台；MEMSCAP 更适合从高壁垒小分部看，而不是当主线 optics 公司。

已接入 0 / 7 家主线：LITE / COHR / AAOI早期 / 平台：POET / LPTH / OPTXMEMS 是小分部映射，不是主业
正在加载共享财务快照…

Financial & Fundamentals
Networking：财务与基本面快照
先把第 7 组补进共享个股模板。这里明确区分 AI 交换 / 互连 / 高速铜缆与光网络主线、光传输设备主线，以及超大平台映射；另外 MRVL、SMTC 的 FY26 已经是 actual，因此保留为 24A / 25A / 26A / 27E 口径。

这一组最重要的阅读方式： 最直接的主线仍是 CRDO / MRVL / ALAB / ANET；CIEN 是光网络设备主线；GLW 更适合看材料与器件映射；NOK / AVGO 的问题不是不重要，而是全公司太大，光网络只是其中一部分。

已接入 0 / 9 家主线：CRDO / MRVL / ALAB / ANET系统主线：CIEN平台映射：NOK / GLW / AVGO / SMTC
正在加载共享财务快照…

Tier 怎么分
这里的 Tier 不是按市值、营收或名气来排，而是按对行业节奏的真实影响力来排。
1产品卡位深度：是否处在良率、BOM、升级节奏的关键节点。

2主流客户验证：是否进入头部云厂商、设备商或模块龙头体系。

3量产成熟度：是否具备可复制的量产工艺、自动化和交付纪录。

4垂直整合度：是否能从芯片、器件到模块或子系统形成闭环。

5行业影响力：是否能左右某一代产品的验证、导入与扩产节奏。

投研最该盯的三件事
如果只盯“光模块出货量”，很容易错过真正的超额收益来源。更重要的是拆出关键瓶颈、验证层级和平台化采用。
价值捕获点
真正容易被低估的不是“光模块”三个字，而是背后那些决定耦合精度、热设计、封装良率和节拍的微型环节。

供给卡点
FAU、MT ferrule、AWG、CW 光源、法拉第旋片和 OCS/CPO 光引擎，往往比整机更早暴露供给缺口。

验证深度
谁拿到头部客户验证、谁率先跨过 800G 到 1.6T 再到 3.2T 的导入门槛，估值弹性就不在一个层级。

01
预制棒 / 光纤 / 光缆 / 特种光缆
现金流底座，但真正该盯的是高芯数、特种光纤、空芯光纤和数据中心高密度布线，而不是传统低端光缆的价格战。

核心玩家
长飞光纤亨通光电中天科技烽火通信住友电工古河电工

有特色的竞争者
Fujikura特发信息通鼎互联汇源通信

后起之秀
永鼎股份

投研看点
底部环节的胜负手不在“量”，而在结构升级能否顺利切向特种场景。

02
连接与微光学：MPO/MTP、MT ferrule、FAU、透镜 / 棱镜 / 滤光片
这个环节经常被市场低估，但它是高速升级中最典型的良率杀手与节拍决定者。

核心玩家
天孚通信太辰光光库科技FujikuraCoherent

有特色的竞争者
仕佳光子福晶科技光迅科技长芯博创

后起之秀
腾景科技

投研看点
谁能把 FAU、MT/MPO、微透镜阵列、耦合精度和自动化做深，谁更可能吃到 800G→1.6T→3.2T 的超额利润。

03
无源芯片与器件：PLC splitter、AWG、WDM、VOA、OSW、OADM / ROADM 基础器件
PLC / AWG / WDM 这条线在中国上市公司里可投密度其实不低，是拆分“器件能力分层”时绕不过去的主轴。

核心玩家
光迅科技仕佳光子长芯博创光库科技Coherent

有特色的竞争者
天孚通信福晶科技Fujikura

后起之秀
腾景科技华工科技

投研看点
无源器件往往不是最显眼，但却是速率抬升时决定损耗、成本与可扩展性的底层拼图。

04
隔离器 / 环行器 / 法拉第旋片 / 磁光晶体
严格按法拉第旋片 / 磁光材料口径，A 股直接上市参与者明显不足，不能把相邻精密光学厂商硬拼成核心供应链。

核心玩家
Kohoku KogyoCoherent光库科技

有特色的竞争者
福晶科技光迅科技Lumentum

后起之秀
腾景科技

投研看点
这是典型的小赛道大卡点，体量不大，但足以影响器件良率、磁光材料供给和高端产品爬坡节奏。
口径说明：腾景科技更偏精密光学件，不宜直接等同为纯法拉第旋片标的。

05
有源芯片与光源：DFB、EML、CW 光源、VCSEL 阵列
严格按通信用激光芯片 / 纯 CW 光源口径，A 股纯标的同样稀缺，真正硬核的是少数芯片或 IDM 能力玩家。

核心玩家
LumentumCoherent源杰科技仕佳光子

有特色的竞争者
光迅科技华工科技Broadcom

后起之秀
新易盛剑桥科技

投研看点
模块厂向上游延伸可以受益，但不能简单等同于“纯光源厂”。真正要看的是芯片良率、单波速率和客户导入深度。
口径说明：新易盛、剑桥科技更多是模块侧导入 EML / SiPh / TFLN / CW 方案的受益者。

06
硅光 / 薄膜铌酸锂（TFLN）/ CPO / NPO / OCS / 光引擎
这是 AI 光互联里最该高频跟踪的赛道，决定下一轮架构迁移的不是单个模块，而是芯片、引擎和系统级方案是否一起成熟。

核心玩家
BroadcomCisco / Acacia光迅科技中际旭创新易盛

有特色的竞争者
剑桥科技天孚通信华工科技Coherent

后起之秀
长芯博创联特科技

投研看点
更现实的跟踪方法，不是死盯“纯 TFLN 晶圆”标的，而是观察模块 / 光引擎厂对 SiPh、TFLN、NPO、OCS 的平台化采用。
口径说明：纯 TFLN 晶圆可投标的稀缺，现阶段更适合跟踪平台化采用率与样品转量产进度。

07
高速光模块：可插拔模块、AOC、LPO / LRO / FRO、TOSA / ROSA / BOSA
表面上看是“量大”，本质上拼的是单波 200G、热设计、DSP / PIC 方案、封装自动化与海外客户交付能力。

核心玩家
中际旭创新易盛光迅科技CoherentLumentum

有特色的竞争者
剑桥科技华工科技Cisco长芯博创

后起之秀
联特科技仕佳光子

投研看点
这也是为什么中际、新易盛、光迅与第二梯队不能简单横向比估值，验证深度和切换斜率差异太大。

08
传输设备：OTN / WDM / ROADM / DCI / 干线与城域全光网
如果严格按 OTN / WDM / ROADM 纯设备商口径，A 股直接上市公司并不多，真正能打的是少数平台型设备商。

核心玩家
中兴通讯烽火通信CienaNokiaFujitsu

有特色的竞争者
瑞斯康达Cisco

后起之秀
ADTRAN

投研看点
这里更适合用设备平台能力、运营商份额和全光网升级节奏去看，而不是把器件逻辑直接平移过来。
口径说明：很多公司更偏接入网、交换或器件侧，不能机械算作纯 OTN / WDM / ROADM 厂商。

09
接入设备与 ODN：PON / FTTH / FTTR / OLT / ONT / ODN 配线
接入网并非没有机会，关键是抓 50G PON、FTTR、政企园区光网升级和 ODN 改造，而不是只看传统宽带建设。

核心玩家
中兴通讯烽火通信剑桥科技共进股份ADTRAN

有特色的竞争者
通鼎互联长芯博创仕佳光子

后起之秀
瑞斯康达特发信息

投研看点
平台型设备商决定份额天花板，模块 / ODN / 器件玩家则更多体现结构性弹性。

10
生产：封装 / 组装 / 测试交付 / 柔性制造能力
“生产”不是低端词。对专业投资人来说，真正该拆的是谁能把自动化拉到量产良率，谁能把海外产能和客户验证跑通。

核心玩家
中际旭创新易盛光迅科技剑桥科技长芯博创

有特色的竞争者
华工科技天孚通信共进股份仕佳光子

后起之秀
联特科技太辰光

投研看点
量产爬坡、柔性交付与代际切换时的制造斜率，是很多估值分化真正发生的地方。

11
制造 / 封装 / 测试装备
这条支线很重要，但严格口径下，A 股真正纯光通信封装 / 测试装备标的仍偏稀缺，更多是平台型自动化设备公司切入。

核心玩家
罗博特科AnritsuYokogawaKeysight

有特色的竞争者
博杰股份赛腾股份博众精工

后起之秀
平台型自动化设备厂商

投研看点
如果制造良率是卡点，那么装备厂就是放大器。它们不一定最显眼，却常常最早感知一线验证节奏变化。
侧重点不是“设备卖了多少台”，而是它是否绑定了下一代封装和测试工艺。

说明：本页按你提供的初始投研框架完成结构化落版，先强调价值捕获点、卡点与验证深度，不展开教科书式全产业链百科。 若你愿意，下一版我可以继续补三类增强内容：公司对比矩阵、关键产品示意图、以及来源链接与时间口径。

## Existing authored data: src/lib/companyFinancials.js

```
const COMPANY_FINANCIALS_URL = '/data/company-financials.jsonl';

let recordsPromise;

export function normalizeCompanyKey(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

export async function loadCompanyFinancialRecords(url = COMPANY_FINANCIALS_URL) {
  if (!recordsPromise) {
    recordsPromise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load company financial records: ${response.status}`);
        }

        return response.text();
      })
      .then((text) => text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line)));
  }

  return recordsPromise;
}

export function filterCompanyFinancialRecords(records, filters = {}) {
  const { reportSlug, topic, datasetKind } = filters;

  return records.filter((record) => {
    if (reportSlug && !record.reportSlugs?.includes(reportSlug)) {
      return false;
    }

    if (topic && !record.topics?.includes(topic)) {
      return false;
    }

    if (datasetKind && record.finance?.datasetKind !== datasetKind) {
      return false;
    }

    return true;
  });
}

export function createCompanyFinanceIndex(records, filters = {}) {
  const index = new Map();

  filterCompanyFinancialRecords(records, filters).forEach((record) => {
    [record.companyName, ...(record.aliases || [])].forEach((name) => {
      const normalized = normalizeCompanyKey(name);

      if (normalized) {
        index.set(normalized, record);
      }
    });
  });

  return index;
}

export function getCompanyFinanceRecord(index, companyName) {
  return index.get(normalizeCompanyKey(companyName)) || null;
}

```


## Existing data files

- https://reports.instap.net/data/company-financials.jsonl
