import { useEffect, useState } from 'react';

import { CompanyFinanceCard } from '../../lib/companyFinanceCard.jsx';
import {
  createCompanyFinanceIndex,
  getCompanyFinanceRecord,
  loadCompanyFinancialRecords,
} from '../../lib/companyFinancials.js';

const highlights = [
  'FAU',
  'MT / MPO',
  'AWG',
  'CW 光源',
  '法拉第旋片',
  'OCS',
  'NPO / CPO 光引擎',
];

const tierRules = [
  '产品卡位深度：是否处在良率、BOM、升级节奏的关键节点。',
  '主流客户验证：是否进入头部云厂商、设备商或模块龙头体系。',
  '量产成熟度：是否具备可复制的量产工艺、自动化和交付纪录。',
  '垂直整合度：是否能从芯片、器件到模块或子系统形成闭环。',
  '行业影响力：是否能左右某一代产品的验证、导入与扩产节奏。',
];

const watchAngles = [
  {
    title: '价值捕获点',
    body: '真正容易被低估的不是“光模块”三个字，而是背后那些决定耦合精度、热设计、封装良率和节拍的微型环节。',
  },
  {
    title: '供给卡点',
    body: 'FAU、MT ferrule、AWG、CW 光源、法拉第旋片和 OCS/CPO 光引擎，往往比整机更早暴露供给缺口。',
  },
  {
    title: '验证深度',
    body: '谁拿到头部客户验证、谁率先跨过 800G 到 1.6T 再到 3.2T 的导入门槛，估值弹性就不在一个层级。',
  },
];

const systemView = [
  {
    number: '09',
    title: '接入设备与 ODN',
    note: 'PON / FTTR / OLT / ONT / 配线，处在楼宇、园区与终端入口。',
    accent: '#84cc16',
  },
  {
    number: '08',
    title: '传输设备',
    note: 'OTN / WDM / ROADM / DCI，把城域、骨干与数据中心拉通。',
    accent: '#38bdf8',
  },
  {
    number: '07',
    title: '高速光模块',
    note: '800G / 1.6T / AOC / LPO 等端口级产品，直接插进交换机或设备。',
    accent: '#f97316',
  },
  {
    number: '06',
    title: 'OCS / NPO / CPO',
    note: '进一步上移到交换架构、板级互联与 AI 集群光互联层。',
    accent: '#06b6d4',
  },
  {
    number: '01',
    title: '光纤 / 特种光缆',
    note: '真正承载光信号穿过机柜、机房、园区与长距离链路。',
    accent: '#60a5fa',
  },
];

const moduleExploded = [
  {
    number: '02',
    title: '连接与微光学',
    note: 'MT / MPO、FAU、透镜、棱镜把光精准耦合进模块。',
    accent: '#22c55e',
  },
  {
    number: '03',
    title: '无源器件',
    note: 'AWG / PLC / WDM / VOA 负责分光、复用、路由与损耗控制。',
    accent: '#f59e0b',
  },
  {
    number: '04',
    title: '隔离 / 环行 / 法拉第',
    note: '抑制回光和串扰，保证链路稳定与器件保护。',
    accent: '#ef4444',
  },
  {
    number: '05',
    title: '有源芯片 / CW 光源',
    note: 'DFB / EML / CW / VCSEL 生成和调制激光，是发光源头。',
    accent: '#a855f7',
  },
  {
    number: '06',
    title: 'SiPh / TFLN / 光引擎',
    note: '把多路光、电、封装整合成下一代平台，可继续上移到 NPO / CPO。',
    accent: '#06b6d4',
  },
];

const supportLayers = [
  {
    number: '10',
    title: '封装 / 组装 / 测试交付',
    note: '把设计变成能规模量产、能稳定交付的产品。',
    accent: '#14b8a6',
  },
  {
    number: '11',
    title: '制造 / 封装 / 测试装备',
    note: '把自动化、节拍和良率做出来，是很多环节的隐形放大器。',
    accent: '#e879f9',
  },
];

const layerQuickMap = {
  '01': '光纤 / 特种光缆',
  '02': '连接与微光学',
  '03': '无源器件',
  '04': '隔离 / 法拉第',
  '05': '有源芯片 / 光源',
  '06': 'SiPh / TFLN / CPO / NPO / OCS / 光引擎',
  '07': '高速光模块',
  '08': '传输设备',
  '09': '接入设备与 ODN',
  '10': '封装 / 组装 / 测试交付',
  '11': '制造 / 封装 / 测试装备',
};

const architectureModes = [
  {
    key: 'OCS',
    title: 'OCS',
    subtitle: 'Optical Circuit Switch',
    accent: '#38bdf8',
    where: '网络层 / 机架间',
    role: '用光路交换重构拓扑，减少 OEO 转换和部分电交换层。',
    changes: '改的是网络路径，不是把光学直接塞进 ASIC 封装里。',
  },
  {
    key: 'NPO',
    title: 'NPO',
    subtitle: 'Near-Packaged Optics',
    accent: '#22c55e',
    where: '板级 / 封装旁',
    role: '把光引擎挪到 ASIC 附近，缩短电走线，同时保留较强可维护性。',
    changes: '常被当作 pluggable 到 CPO 的过渡形态。',
  },
  {
    key: 'CPO',
    title: 'CPO',
    subtitle: 'Co-Packaged Optics',
    accent: '#f97316',
    where: '同封装',
    role: '把光引擎与交换 ASIC 共封装，进一步砍掉长电连接和 pluggable 负担。',
    changes: '更激进地换功耗、密度和信号完整性，但封装与热管理更难。',
  },
  {
    key: 'OIO',
    title: 'OIO',
    subtitle: 'Optical I/O',
    accent: '#a855f7',
    where: '芯片 / 芯粒 I/O',
    role: '用光替代芯片级或封装级电 I/O，把光直接带到 XPU 或 chiplet 边上。',
    changes: '更偏“替代电 I/O 本身”，不只是一种交换机光模块形态。',
  },
];

const photonicsLayers = [
  {
    id: 'materials',
    title: '1. Materials & Wafers',
    subtitle: '材料、衬底、外延与晶圆供给',
    mappedSections: ['02', '03', '04', '05', '06'],
    note: '更偏光子材料与底层 wafer / substrate 供给，是很多器件与硅光平台的更上游约束。',
    tickers: ['$AXTI', '$ALMU', '$TECK', '$IQE', '$LWLG', '$SOI', '$WOLF'],
  },
  {
    id: 'tools',
    title: '2. Tools',
    subtitle: '外延、沉积、刻蚀、检测与工艺设备',
    mappedSections: ['10', '11'],
    note: '这组公司更接近工艺设备与制造工具层，对应本页的量产与装备支撑能力。',
    tickers: ['$AIXA', '$ALRIB', '$VECO', '$LRCX', '$AMAT', 'Hamamatsu (6965 / HPHTY)', '$ONTO'],
  },
  {
    id: 'lasers',
    title: '3. Lasers',
    subtitle: '激光芯片、发射端与相关平台',
    mappedSections: ['05'],
    note: '和本页“有源芯片与光源”最直接对应，口径上覆盖激光器件与其平台型受益者。',
    tickers: ['$SIVE', '$MTSI', '$HIMX', '$STM', '$LASR'],
  },
  {
    id: 'foundries',
    title: '4. Foundries',
    subtitle: '硅光 / 模拟 / 混合信号代工与制造平台',
    mappedSections: ['05', '06', '10'],
    note: '对应器件与光引擎背后的制造平台，不一定直接是通信纯标的，但承接量产能力。',
    tickers: ['$TSEM', '$FN', '$XFAB', '$SANM', '$UMC', '$GFS'],
  },
  {
    id: 'testing',
    title: '5. Testing',
    subtitle: '测试、封测、 burn-in 与可靠性验证',
    mappedSections: ['10', '11'],
    note: '与本页“封装 / 测试交付”以及“制造 / 测试装备”高度相关，是良率和验证深度的重要支撑层。',
    tickers: ['$AEHR', '$FORM', '$COHU', '$TER', '$VIAV', '$ASX', '$AMKR'],
  },
  {
    id: 'optics',
    title: '6. Optics',
    subtitle: '光学器件、模块、封装与光子平台',
    mappedSections: ['02', '03', '04', '05', '06', '07'],
    note: '这是和当前页面重合度最高的一层，覆盖微光学、器件、模块到部分光子平台公司。',
    tickers: ['$LITE', '$COHR', '$POET', '$MEMS', '$AAOI', '$OPTX', '$LPTH'],
  },
  {
    id: 'networking',
    title: '7. Networking',
    subtitle: 'DSP、交换、互联与网络设备平台',
    mappedSections: ['06', '07', '08', '09'],
    note: '偏系统与网络层，连接本页的光引擎、模块、传输设备与接入设备口径。',
    tickers: ['$CRDO', '$MRVL', '$SMTC', '$CIEN', '$NOK', '$GLW', '$ALAB', '$ANET', '$AVGO'],
  },
];

const financeSectionConfigs = [
  {
    layerId: 'materials',
    expectedKeys: ['AXTI', 'ALMU', 'TECK', 'IQE', 'LWLG', 'SOI', 'WOLF'],
    title: 'Materials & Wafers：财务与基本面快照',
    subtitle: '先把第 1 组补进共享个股模板。24 / 25 / 26 / 27 默认按各家公司自身财年；利润优先写 net income / attributable net income，若公开页只给 EPS 或 EBT，会在卡片里明确标注。',
    asideTitle: '这一组最重要的阅读方式：',
    asideBody: '不要只看营收体量，要同时看材料纯度、平台属性、分部口径是否真的对应 photonics 价值链。',
    metaChips: ['共享 jsonl + React 卡片模板', '前瞻毛利率多数缺口径'],
  },
  {
    layerId: 'tools',
    expectedKeys: ['AIXA', 'ALRIB', 'VECO', 'LRCX', 'AMAT', 'SHMN', 'ONTO'],
    title: 'Tools：财务与基本面快照',
    subtitle: '先把第 2 组补进共享个股模板。24 / 25 / 26 / 27 默认按各家公司自身财年；其中 LRCX、AMAT、ONTO、Hamamatsu 的财年与自然年不同。你给的 SHMN 这里按 Hamamatsu Photonics（6965 / HPHTY）处理。',
    asideTitle: '这一组最重要的阅读方式：',
    asideBody: '先分清 pure photonics tools 与半导体设备平台映射。与 photonics 直接相关度更高的是 AIXTRON / Riber / Veeco / Hamamatsu；披露最完整的是 AMAT / LRCX / AIXTRON / Hamamatsu。',
    metaChips: ['披露最完整：AMAT / LRCX / AIXA / Hamamatsu', 'photonics 纯度更高：AIXA / ALRIB / VECO / Hamamatsu', '分产品毛利率公开稀缺'],
  },
  {
    layerId: 'lasers',
    expectedKeys: ['SIVE', 'MTSI', 'HIMX', 'STM', 'LASR'],
    title: 'Lasers：财务与基本面快照',
    subtitle: '先把第 3 组补进共享个股模板。这里会明确区分 pure laser、lightwave / optical connectivity 平台，以及显示 / 感测 / RF&OC 映射，避免把“激光平台”和“激光映射”混在一起。',
    asideTitle: '这一组最重要的阅读方式：',
    asideBody: '最纯的 laser 暴露是 LASR / SIVE；MTSI 是 lightwave / optical connectivity / RF 平台；HIMX / STM 更偏显示、感测、成像、VCSEL / ToF 与 RF&OC 映射。',
    metaChips: ['laser 纯度最高：LASR / SIVE', 'LASR 披露最深：分产品收入 + 分产品 GM', 'SIVE 更像节点驱动而非成熟一致预期票'],
  },
  {
    layerId: 'foundries',
    expectedKeys: ['TSEM', 'FN', 'XFAB', 'SANM', 'UMC', 'GFS'],
    title: 'Foundries：财务与基本面快照',
    subtitle: '先把第 4 组补进共享个股模板。这里明确区分 pure foundry 主线与制造服务映射：TSEM / XFAB / UMC / GFS 是 foundry 主线，FN / SANM 更准确是光模块、通信设备和云基础设施相关制造平台。',
    asideTitle: '这一组最重要的阅读方式：',
    asideBody: '先区分“wafer foundry 平台”与“系统 / 模块制造承接”。TSEM / GFS / XFAB / UMC 更适合跟平台工艺和 photonics 技术栈，FN / SANM 更适合看 end-market 制造承接与并购扰动。',
    metaChips: ['pure foundry：TSEM / XFAB / UMC / GFS', '制造映射：FN / SANM', '前瞻 GM 多数缺一致口径'],
  },
  {
    layerId: 'testing',
    expectedKeys: ['AEHR', 'FORM', 'COHU', 'TER', 'VIAV', 'ASX', 'AMKR'],
    title: 'Testing：财务与基本面快照',
    subtitle: '先把第 5 组补进共享个股模板。这里明确区分纯测试设备 / 接口 / 测量主线与封测映射：AEHR / FORM / COHU / TER / VIAV 是测试主线，ASX / AMKR 是封测映射。',
    asideTitle: '这一组最重要的阅读方式：',
    asideBody: '先分清 test equipment / measurement 平台与 OSAT。AEHR / FORM / COHU / TER 更适合看测试设备景气与 AI、HBM、PIC 相关验证；ASX / AMKR 更适合看 advanced packaging、封测结构升级和客户组合变化。',
    metaChips: ['纯测试主线：AEHR / FORM / COHU / TER / VIAV', '封测映射：ASX / AMKR', 'FORM / VIAV / ASX 披露质量更高'],
  },
  {
    layerId: 'optics',
    expectedKeys: ['LITE', 'COHR', 'POET', 'MEMS', 'AAOI', 'OPTX', 'LPTH'],
    title: 'Optics：财务与基本面快照',
    subtitle: '先把第 6 组补进共享个股模板。这里会明确区分 AI 光互连 / 光模块主线、早期放量平台，以及“有光通信小分部但并非主业”的映射，避免把这组做成假整齐。',
    asideTitle: '这一组最重要的阅读方式：',
    asideBody: '最直接的主线是 LITE / COHR / AAOI；POET / LPTH / OPTX 更偏早期或细分平台；MEMSCAP 更适合从高壁垒小分部看，而不是当主线 optics 公司。',
    metaChips: ['主线：LITE / COHR / AAOI', '早期 / 平台：POET / LPTH / OPTX', 'MEMS 是小分部映射，不是主业'],
  },
  {
    layerId: 'networking',
    expectedKeys: ['CRDO', 'MRVL', 'SMTC', 'CIEN', 'NOK', 'GLW', 'ALAB', 'ANET', 'AVGO'],
    title: 'Networking：财务与基本面快照',
    subtitle: '先把第 7 组补进共享个股模板。这里明确区分 AI 交换 / 互连 / 高速铜缆与光网络主线、光传输设备主线，以及超大平台映射；另外 MRVL、SMTC 的 FY26 已经是 actual，因此保留为 24A / 25A / 26A / 27E 口径。',
    asideTitle: '这一组最重要的阅读方式：',
    asideBody: '最直接的主线仍是 CRDO / MRVL / ALAB / ANET；CIEN 是光网络设备主线；GLW 更适合看材料与器件映射；NOK / AVGO 的问题不是不重要，而是全公司太大，光网络只是其中一部分。',
    metaChips: ['主线：CRDO / MRVL / ALAB / ANET', '系统主线：CIEN', '平台映射：NOK / GLW / AVGO / SMTC'],
  },
];

const sections = [
  {
    id: 'fiber',
    number: '01',
    title: '预制棒 / 光纤 / 光缆 / 特种光缆',
    accent: '#60a5fa',
    summary: '现金流底座，但真正该盯的是高芯数、特种光纤、空芯光纤和数据中心高密度布线，而不是传统低端光缆的价格战。',
    corePlayers: ['长飞光纤', '亨通光电', '中天科技', '烽火通信', '住友电工', '古河电工'],
    featuredPlayers: ['Fujikura', '特发信息', '通鼎互联', '汇源通信'],
    risingPlayers: ['永鼎股份'],
    focus: '底部环节的胜负手不在“量”，而在结构升级能否顺利切向特种场景。',
  },
  {
    id: 'micro-optics',
    number: '02',
    title: '连接与微光学：MPO/MTP、MT ferrule、FAU、透镜 / 棱镜 / 滤光片',
    accent: '#22c55e',
    summary: '这个环节经常被市场低估，但它是高速升级中最典型的良率杀手与节拍决定者。',
    corePlayers: ['天孚通信', '太辰光', '光库科技', 'Fujikura', 'Coherent'],
    featuredPlayers: ['仕佳光子', '福晶科技', '光迅科技', '长芯博创'],
    risingPlayers: ['腾景科技'],
    focus: '谁能把 FAU、MT/MPO、微透镜阵列、耦合精度和自动化做深，谁更可能吃到 800G→1.6T→3.2T 的超额利润。',
  },
  {
    id: 'passive',
    number: '03',
    title: '无源芯片与器件：PLC splitter、AWG、WDM、VOA、OSW、OADM / ROADM 基础器件',
    accent: '#f59e0b',
    summary: 'PLC / AWG / WDM 这条线在中国上市公司里可投密度其实不低，是拆分“器件能力分层”时绕不过去的主轴。',
    corePlayers: ['光迅科技', '仕佳光子', '长芯博创', '光库科技', 'Coherent'],
    featuredPlayers: ['天孚通信', '福晶科技', 'Fujikura'],
    risingPlayers: ['腾景科技', '华工科技'],
    focus: '无源器件往往不是最显眼，但却是速率抬升时决定损耗、成本与可扩展性的底层拼图。',
  },
  {
    id: 'faraday',
    number: '04',
    title: '隔离器 / 环行器 / 法拉第旋片 / 磁光晶体',
    accent: '#ef4444',
    summary: '严格按法拉第旋片 / 磁光材料口径，A 股直接上市参与者明显不足，不能把相邻精密光学厂商硬拼成核心供应链。',
    corePlayers: ['Kohoku Kogyo', 'Coherent', '光库科技'],
    featuredPlayers: ['福晶科技', '光迅科技', 'Lumentum'],
    risingPlayers: ['腾景科技'],
    focus: '这是典型的小赛道大卡点，体量不大，但足以影响器件良率、磁光材料供给和高端产品爬坡节奏。',
    note: '口径说明：腾景科技更偏精密光学件，不宜直接等同为纯法拉第旋片标的。',
  },
  {
    id: 'active-chip',
    number: '05',
    title: '有源芯片与光源：DFB、EML、CW 光源、VCSEL 阵列',
    accent: '#a855f7',
    summary: '严格按通信用激光芯片 / 纯 CW 光源口径，A 股纯标的同样稀缺，真正硬核的是少数芯片或 IDM 能力玩家。',
    corePlayers: ['Lumentum', 'Coherent', '源杰科技', '仕佳光子'],
    featuredPlayers: ['光迅科技', '华工科技', 'Broadcom'],
    risingPlayers: ['新易盛', '剑桥科技'],
    focus: '模块厂向上游延伸可以受益，但不能简单等同于“纯光源厂”。真正要看的是芯片良率、单波速率和客户导入深度。',
    note: '口径说明：新易盛、剑桥科技更多是模块侧导入 EML / SiPh / TFLN / CW 方案的受益者。',
  },
  {
    id: 'next-gen',
    number: '06',
    title: '硅光 / 薄膜铌酸锂（TFLN）/ CPO / NPO / OCS / 光引擎',
    accent: '#06b6d4',
    summary: '这是 AI 光互联里最该高频跟踪的赛道，决定下一轮架构迁移的不是单个模块，而是芯片、引擎和系统级方案是否一起成熟。',
    corePlayers: ['Broadcom', 'Cisco / Acacia', '光迅科技', '中际旭创', '新易盛'],
    featuredPlayers: ['剑桥科技', '天孚通信', '华工科技', 'Coherent'],
    risingPlayers: ['长芯博创', '联特科技'],
    focus: '更现实的跟踪方法，不是死盯“纯 TFLN 晶圆”标的，而是观察模块 / 光引擎厂对 SiPh、TFLN、NPO、OCS 的平台化采用。',
    note: '口径说明：纯 TFLN 晶圆可投标的稀缺，现阶段更适合跟踪平台化采用率与样品转量产进度。',
  },
  {
    id: 'modules',
    number: '07',
    title: '高速光模块：可插拔模块、AOC、LPO / LRO / FRO、TOSA / ROSA / BOSA',
    accent: '#f97316',
    summary: '表面上看是“量大”，本质上拼的是单波 200G、热设计、DSP / PIC 方案、封装自动化与海外客户交付能力。',
    corePlayers: ['中际旭创', '新易盛', '光迅科技', 'Coherent', 'Lumentum'],
    featuredPlayers: ['剑桥科技', '华工科技', 'Cisco', '长芯博创'],
    risingPlayers: ['联特科技', '仕佳光子'],
    focus: '这也是为什么中际、新易盛、光迅与第二梯队不能简单横向比估值，验证深度和切换斜率差异太大。',
  },
  {
    id: 'transport',
    number: '08',
    title: '传输设备：OTN / WDM / ROADM / DCI / 干线与城域全光网',
    accent: '#38bdf8',
    summary: '如果严格按 OTN / WDM / ROADM 纯设备商口径，A 股直接上市公司并不多，真正能打的是少数平台型设备商。',
    corePlayers: ['中兴通讯', '烽火通信', 'Ciena', 'Nokia', 'Fujitsu'],
    featuredPlayers: ['瑞斯康达', 'Cisco'],
    risingPlayers: ['ADTRAN'],
    focus: '这里更适合用设备平台能力、运营商份额和全光网升级节奏去看，而不是把器件逻辑直接平移过来。',
    note: '口径说明：很多公司更偏接入网、交换或器件侧，不能机械算作纯 OTN / WDM / ROADM 厂商。',
  },
  {
    id: 'access',
    number: '09',
    title: '接入设备与 ODN：PON / FTTH / FTTR / OLT / ONT / ODN 配线',
    accent: '#84cc16',
    summary: '接入网并非没有机会，关键是抓 50G PON、FTTR、政企园区光网升级和 ODN 改造，而不是只看传统宽带建设。',
    corePlayers: ['中兴通讯', '烽火通信', '剑桥科技', '共进股份', 'ADTRAN'],
    featuredPlayers: ['通鼎互联', '长芯博创', '仕佳光子'],
    risingPlayers: ['瑞斯康达', '特发信息'],
    focus: '平台型设备商决定份额天花板，模块 / ODN / 器件玩家则更多体现结构性弹性。',
  },
  {
    id: 'manufacturing',
    number: '10',
    title: '生产：封装 / 组装 / 测试交付 / 柔性制造能力',
    accent: '#14b8a6',
    summary: '“生产”不是低端词。对专业投资人来说，真正该拆的是谁能把自动化拉到量产良率，谁能把海外产能和客户验证跑通。',
    corePlayers: ['中际旭创', '新易盛', '光迅科技', '剑桥科技', '长芯博创'],
    featuredPlayers: ['华工科技', '天孚通信', '共进股份', '仕佳光子'],
    risingPlayers: ['联特科技', '太辰光'],
    focus: '量产爬坡、柔性交付与代际切换时的制造斜率，是很多估值分化真正发生的地方。',
  },
  {
    id: 'equipment',
    number: '11',
    title: '制造 / 封装 / 测试装备',
    accent: '#e879f9',
    summary: '这条支线很重要，但严格口径下，A 股真正纯光通信封装 / 测试装备标的仍偏稀缺，更多是平台型自动化设备公司切入。',
    corePlayers: ['罗博特科', 'Anritsu', 'Yokogawa', 'Keysight'],
    featuredPlayers: ['博杰股份', '赛腾股份', '博众精工'],
    risingPlayers: ['平台型自动化设备厂商'],
    focus: '如果制造良率是卡点，那么装备厂就是放大器。它们不一定最显眼，却常常最早感知一线验证节奏变化。',
    note: '侧重点不是“设备卖了多少台”，而是它是否绑定了下一代封装和测试工艺。',
  },
];

function Tag({ children, tone = 'default' }) {
  return <span className={`optical-tag optical-tag-${tone}`}>{children}</span>;
}

function CompanyGroup({ title, companies, tone }) {
  return (
    <div className="optical-company-group">
      <div className="optical-group-title">{title}</div>
      <div className="optical-company-list">
        {companies.map((company) => (
          <Tag key={`${title}-${company}`} tone={tone}>
            {company}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  id,
  number,
  title,
  summary,
  focus,
  corePlayers,
  featuredPlayers,
  risingPlayers,
  note,
  accent,
  isActive = false,
  onActivate,
  onDeactivate,
  onToggle,
}) {
  return (
    <article
      className={`optical-section-card${isActive ? ' is-active' : ''}`}
      style={{ '--accent-color': accent }}
      onMouseEnter={() => onActivate?.(number)}
      onMouseLeave={() => onDeactivate?.()}
      onFocus={() => onActivate?.(number)}
      onBlur={() => onDeactivate?.()}
      onClick={() => onToggle?.(number)}
      tabIndex={0}
      aria-labelledby={`section-title-${id}`}
    >
      <div className="optical-section-head">
        <div className="optical-section-number">{number}</div>
        <div>
          <h2 id={`section-title-${id}`}>{title}</h2>
          <p>{summary}</p>
        </div>
      </div>

      <div className="optical-section-grid">
        <div className="optical-section-main">
          <CompanyGroup title="核心玩家" companies={corePlayers} tone="core" />
          <CompanyGroup title="有特色的竞争者" companies={featuredPlayers} tone="feature" />
          <CompanyGroup title="后起之秀" companies={risingPlayers} tone="rise" />
        </div>

        <div className="optical-focus-panel">
          <div className="optical-focus-label">投研看点</div>
          <p>{focus}</p>
          {note ? <div className="optical-note">{note}</div> : null}
        </div>
      </div>
    </article>
  );
}

function StageCard({
  number,
  title,
  note,
  accent,
  compact = false,
  isActive = false,
  onActivate,
  onDeactivate,
  onToggle,
}) {
  return (
    <div
      className={`optical-stage-card${compact ? ' compact' : ''}${isActive ? ' is-active' : ''}`}
      style={{ '--stage-accent': accent }}
      onMouseEnter={() => onActivate?.(number)}
      onMouseLeave={() => onDeactivate?.()}
      onFocus={() => onActivate?.(number)}
      onBlur={() => onDeactivate?.()}
      onClick={() => onToggle?.(number)}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
    >
      <div className="optical-stage-number">{number}</div>
      <div className="optical-stage-copy">
        <h3>{title}</h3>
        <p>{note}</p>
      </div>
    </div>
  );
}

function OpticalPositionMap({ activeLayer, onActivate, onDeactivate, onToggle }) {
  return (
    <section id="optical-position-map" className="optical-position-section">
      <div className="optical-position-header">
        <div>
          <div className="optical-kicker">Where Each Layer Sits</div>
          <h2 className="optical-block-title">它们到底装在哪，起什么作用</h2>
          <p className="optical-block-subtitle">
            上面先看它们在网络和设备里的位置，下面再把一个光模块拆开。这样读者能同时看清“产业链站位”和“产品内部职责”。
          </p>
        </div>
        <div className="optical-position-note">
          <strong>最容易被低估的价值区：</strong>
          <span> 02–06 这些看似零碎的小环节，往往最决定良率、BOM 和代际切换速度。</span>
        </div>
      </div>

      <div className="optical-position-grid">
        <div className="optical-map-panel">
          <div className="optical-map-title-row">
            <h3>系统位置图</h3>
            <span>从网络到端口再到物理链路</span>
          </div>

          <div className="optical-flow-row">
            {systemView.map((item, index) => (
              <div key={item.number} className="optical-flow-item">
                <StageCard
                  {...item}
                  compact
                  isActive={activeLayer === item.number}
                  onActivate={onActivate}
                  onDeactivate={onDeactivate}
                  onToggle={onToggle}
                />
                {index < systemView.length - 1 ? <div className="optical-flow-arrow">→</div> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="optical-map-panel">
          <div className="optical-map-title-row">
            <h3>光模块爆炸图</h3>
            <span>把 07 高速光模块拆开，看内部价值链</span>
          </div>

          <div className="optical-exploded-layout">
            <div className="optical-edge-node" style={{ '--stage-accent': '#60a5fa' }}>
              <div className="optical-edge-label">01 光纤 / 特种光缆</div>
              <p>外部光链路把信号送进模块前端。</p>
            </div>

            <div className="optical-shell">
              <div className="optical-shell-title">07 高速光模块 / AOC / TOSA-ROSA-BOSA</div>
              <div className="optical-shell-subtitle">
                模块本体像“壳”，真正决定性能和良率的是里面这条光学装配链。
              </div>

              <div className="optical-exploded-track">
                {moduleExploded.map((item, index) => (
                  <div key={item.number} className="optical-exploded-item">
                    <StageCard
                      {...item}
                      compact
                      isActive={activeLayer === item.number}
                      onActivate={onActivate}
                      onDeactivate={onDeactivate}
                      onToggle={onToggle}
                    />
                    {index < moduleExploded.length - 1 ? (
                      <div className="optical-exploded-connector">→</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="optical-edge-node" style={{ '--stage-accent': '#38bdf8' }}>
              <div className="optical-edge-label">08 / 09 / 06 更上层系统</div>
              <p>模块装回交换机、传输设备或进一步上移到 OCS / CPO / NPO 架构。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="optical-support-strip">
        {supportLayers.map((item) => (
          <div key={item.number} className="optical-support-item">
            <StageCard
              {...item}
              isActive={activeLayer === item.number}
              onActivate={onActivate}
              onDeactivate={onDeactivate}
              onToggle={onToggle}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function ArchitectureModeCard({ title, subtitle, where, role, changes, accent, isActive = false }) {
  return (
    <article className={`optical-mode-card${isActive ? ' is-active' : ''}`} style={{ '--mode-accent': accent }}>
      <div className="optical-mode-head">
        <span className="optical-mode-pill">{title}</span>
        <span className="optical-mode-subtitle">{subtitle}</span>
      </div>
      <div className="optical-mode-meta">{where}</div>
      <p>{role}</p>
      <div className="optical-mode-note">{changes}</div>
    </article>
  );
}

function PhotonicsLayerCard({ title, subtitle, mappedSections, note, tickers, isActive = false }) {
  return (
    <article className={`optical-layer-card${isActive ? ' is-active' : ''}`}>
      <div className="optical-layer-card-head">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <div className="optical-layer-map">
          {mappedSections.map((section) => (
            <span key={`${title}-${section}`} className="optical-layer-map-chip">
              {section}
            </span>
          ))}
        </div>
      </div>

      <div className="optical-layer-tickers">
        {tickers.map((ticker) => (
          <span key={`${title}-${ticker}`} className="optical-layer-ticker">
            {ticker}
          </span>
        ))}
      </div>

      <div className="optical-layer-note">{note}</div>
    </article>
  );
}

function PhotonicsLayersSupplement({ activeLayer }) {
  return (
    <section className="optical-supplement-section">
      <div className="optical-position-header">
        <div>
          <div className="optical-kicker">Market Supplement</div>
          <h2 className="optical-block-title">The 7 Layers of Photonics</h2>
          <p className="optical-block-subtitle">
            这组名单更像“海外资本市场 photonics 观察清单”，不是对前文 11 段产业链的替代，而是一个补充图层。
            我把它们按原始 7 层保留，同时标出与本页 11 段投研口径的大致映射。
          </p>
        </div>
        <div className="optical-position-note">
          <strong>口径说明：</strong>
          <span> 这里是“市场分层清单”，不强行改写前文中文产业链口径；右上角编号表示和本页哪几段最相关。</span>
        </div>
      </div>

      <div className="optical-layer-grid">
        {photonicsLayers.map((layer) => (
          <PhotonicsLayerCard
            key={layer.id}
            {...layer}
            isActive={Boolean(activeLayer) && layer.mappedSections.includes(activeLayer)}
          />
        ))}
      </div>
    </section>
  );
}

function LayerFinanceSection({ config, activeLayer, records, loading, error }) {
  const layer = photonicsLayers.find((item) => item.id === config.layerId);
  const loadedTickers = new Set(
    records.flatMap((record) => [
      record.companyProfile?.ticker,
      record.companyName,
      ...(record.aliases || []),
    ].filter(Boolean))
  );
  const missingTickers = config.expectedKeys.filter((ticker) => !loadedTickers.has(ticker));

  return (
    <section className={`optical-finance-section${activeLayer && layer?.mappedSections.includes(activeLayer) ? ' is-active' : ''}`}>
      <div className="optical-position-header">
        <div>
          <div className="optical-kicker">Financial & Fundamentals</div>
          <h2 className="optical-block-title">{config.title}</h2>
          <p className="optical-block-subtitle">{config.subtitle}</p>
        </div>
        <div className="optical-position-note">
          <strong>{config.asideTitle}</strong>
          <span> {config.asideBody}</span>
        </div>
      </div>

      <div className="optical-finance-meta">
        <span className="finance-chip soft">已接入 {records.length} / {config.expectedKeys.length} 家</span>
        {config.metaChips.map((chip) => (
          <span key={`${config.layerId}-${chip}`} className="finance-chip soft">{chip}</span>
        ))}
      </div>

      {loading ? <div className="optical-finance-status">正在加载共享财务快照…</div> : null}
      {error ? <div className="optical-finance-status is-error">财务数据加载失败：{error}</div> : null}

      {records.length ? (
        <div className="optical-finance-grid">
          {records.map((record) => (
            <CompanyFinanceCard key={record.id} record={record} />
          ))}
        </div>
      ) : null}

      {!loading && !error && missingTickers.length ? (
        <div className="optical-finance-status">
          仍待接入共享数据的 ticker：{missingTickers.join(', ')}。
        </div>
      ) : null}
    </section>
  );
}

function OpticalArchitectureSvg({ activeLayer }) {
  return (
    <section className="optical-svg-section">
      <div className="optical-position-header">
        <div>
          <div className="optical-kicker">Architecture Distinctions</div>
          <h2 className="optical-block-title">OCS / NPO / CPO / OIO 到底差在哪</h2>
          <p className="optical-block-subtitle">
            它们不是同一层东西。OCS 更像网络拓扑层的重构；NPO 与 CPO 主要解决交换芯片附近的电互连瓶颈；OIO
            更进一步，直接把“电 I/O”本身改成光。
          </p>
        </div>
        <div className="optical-position-note">
          <strong>阅读顺序：</strong>
          <span> 先看每列里“光学件离计算芯片有多近”，再看底部那条“它主要替代了哪一段电连接”。</span>
        </div>
      </div>

      <div className="optical-svg-wrap">
        <svg
          className="optical-architecture-svg"
          viewBox="0 0 1280 760"
          role="img"
          aria-label="OCS、NPO、CPO 与 OIO 的结构差异示意图"
        >
          <defs>
            <linearGradient id="svgPanel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(20,31,55,0.98)" />
              <stop offset="100%" stopColor="rgba(8,14,28,0.98)" />
            </linearGradient>
            <marker id="arrowBlue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#7dd3fc" />
            </marker>
            <marker id="arrowOrange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#fdba74" />
            </marker>
            <marker id="arrowPurple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#d8b4fe" />
            </marker>
          </defs>

          <rect x="0" y="0" width="1280" height="760" rx="28" fill="url(#svgPanel)" />

          <text x="70" y="48" fill="#f8fbff" fontSize="28" fontWeight="700">
            四种架构的差别，核心在“光学件放在哪”和“替代哪一段电连接”
          </text>
          <text x="70" y="80" fill="#8fa5c1" fontSize="15">
            左到右：从网络层的光路重构，到靠近封装，再到共封装，最后进入芯片 / 芯粒 I/O。
          </text>

          <line x1="70" y1="118" x2="1210" y2="118" stroke="rgba(148,163,184,0.3)" strokeWidth="2" />
          <text x="70" y="110" fill="#93c5fd" fontSize="13">离计算芯片更远</text>
          <text x="1110" y="110" fill="#d8b4fe" fontSize="13">离计算芯片最近</text>

          <g transform="translate(60 140)">
            <rect x="0" y="0" width="260" height="470" rx="24" fill="rgba(56,189,248,0.08)" stroke="rgba(56,189,248,0.3)" />
            <text x="24" y="38" fill="#7dd3fc" fontSize="24" fontWeight="800">OCS</text>
            <text x="82" y="38" fill="#c6d4ea" fontSize="13">Optical Circuit Switch</text>

            <rect x="22" y="120" width="68" height="128" rx="12" fill="#12233f" stroke="#355b87" />
            <rect x="170" y="120" width="68" height="128" rx="12" fill="#12233f" stroke="#355b87" />
            <text x="34" y="144" fill="#dbe7ff" fontSize="14" fontWeight="700">Rack A</text>
            <text x="182" y="144" fill="#dbe7ff" fontSize="14" fontWeight="700">Rack B</text>

            <rect x="38" y="164" width="36" height="18" rx="6" fill="#f97316" />
            <rect x="186" y="164" width="36" height="18" rx="6" fill="#f97316" />
            <text x="27" y="198" fill="#8fa5c1" fontSize="11">pluggable</text>
            <text x="175" y="198" fill="#8fa5c1" fontSize="11">pluggable</text>

            <rect x="88" y="286" width="84" height="76" rx="14" fill="#0e2236" stroke="#7dd3fc" strokeWidth="2" />
            <text x="108" y="326" fill="#f8fbff" fontSize="18" fontWeight="700">OCS</text>
            <text x="93" y="346" fill="#9fb3cc" fontSize="11">optical switch fabric</text>

            <line x1="72" y1="182" x2="118" y2="286" stroke="#7dd3fc" strokeWidth="4" markerEnd="url(#arrowBlue)" />
            <line x1="204" y1="182" x2="142" y2="286" stroke="#7dd3fc" strokeWidth="4" markerEnd="url(#arrowBlue)" />

            <text x="24" y="402" fill="#f8fbff" fontSize="14" fontWeight="700">改的是网络层光路</text>
            <text x="24" y="426" fill="#9fb3cc" fontSize="13">端点通常仍是传统模块，OCS 负责在中间</text>
            <text x="24" y="446" fill="#9fb3cc" fontSize="13">建立可重构的直通光路径，减少 OEO 与电交换。</text>

            <rect x="22" y="470" width="216" height="54" rx="12" fill="rgba(56,189,248,0.12)" />
            <text x="34" y="502" fill="#d8f0ff" fontSize="13">替代对象：部分 spine / fabric 层的电交换与 OEO</text>
          </g>

          <g transform="translate(360 140)">
            <rect x="0" y="0" width="260" height="470" rx="24" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.3)" />
            <text x="24" y="38" fill="#86efac" fontSize="24" fontWeight="800">NPO</text>
            <text x="85" y="38" fill="#c6d4ea" fontSize="13">Near-Packaged Optics</text>

            <rect x="24" y="284" width="212" height="110" rx="18" fill="#0d1b2c" stroke="#37506b" />
            <text x="106" y="378" fill="#7f96b3" fontSize="12">board</text>

            <rect x="88" y="310" width="84" height="58" rx="14" fill="#162842" stroke="#dbe7ff" />
            <text x="117" y="344" fill="#f8fbff" fontSize="16" fontWeight="700">ASIC</text>

            <rect x="38" y="296" width="34" height="28" rx="8" fill="#22c55e" />
            <rect x="188" y="296" width="34" height="28" rx="8" fill="#22c55e" />
            <rect x="38" y="346" width="34" height="28" rx="8" fill="#22c55e" />
            <rect x="188" y="346" width="34" height="28" rx="8" fill="#22c55e" />
            <text x="30" y="282" fill="#9fe7b4" fontSize="11">optical engines</text>

            <line x1="88" y1="328" x2="72" y2="310" stroke="#fdba74" strokeWidth="4" />
            <line x1="172" y1="328" x2="188" y2="310" stroke="#fdba74" strokeWidth="4" />
            <line x1="88" y1="350" x2="72" y2="360" stroke="#fdba74" strokeWidth="4" />
            <line x1="172" y1="350" x2="188" y2="360" stroke="#fdba74" strokeWidth="4" />

            <line x1="55" y1="296" x2="55" y2="198" stroke="#86efac" strokeWidth="4" markerEnd="url(#arrowBlue)" />
            <line x1="205" y1="296" x2="205" y2="198" stroke="#86efac" strokeWidth="4" markerEnd="url(#arrowBlue)" />
            <text x="95" y="200" fill="#9fb3cc" fontSize="12">fiber out</text>

            <text x="24" y="76" fill="#f8fbff" fontSize="14" fontWeight="700">光引擎在封装旁边，不进封装</text>
            <text x="24" y="100" fill="#9fb3cc" fontSize="13">缩短 ASIC 到 optics 的电走线，通常仍保留较强</text>
            <text x="24" y="120" fill="#9fb3cc" fontSize="13">模块化 / 可维护性，是很典型的过渡方案。</text>

            <rect x="22" y="470" width="216" height="54" rx="12" fill="rgba(34,197,94,0.12)" />
            <text x="34" y="502" fill="#dcffe7" fontSize="13">替代对象：ASIC 到外置模块之间的长板级电互连</text>
          </g>

          <g transform="translate(660 140)">
            <rect x="0" y="0" width="260" height="470" rx="24" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.3)" />
            <text x="24" y="38" fill="#fdba74" fontSize="24" fontWeight="800">CPO</text>
            <text x="84" y="38" fill="#c6d4ea" fontSize="13">Co-Packaged Optics</text>

            <rect x="28" y="276" width="204" height="126" rx="20" fill="#0d1b2c" stroke="#6f5134" />
            <text x="102" y="390" fill="#7f96b3" fontSize="12">board</text>

            <rect x="56" y="294" width="148" height="88" rx="18" fill="#1a2d47" stroke="#fdba74" strokeWidth="2" />
            <text x="94" y="314" fill="#ffdfbf" fontSize="11">same package</text>

            <rect x="100" y="324" width="60" height="34" rx="10" fill="#102238" stroke="#dbe7ff" />
            <text x="114" y="345" fill="#f8fbff" fontSize="15" fontWeight="700">ASIC</text>

            <rect x="64" y="320" width="22" height="16" rx="5" fill="#f97316" />
            <rect x="176" y="320" width="22" height="16" rx="5" fill="#f97316" />
            <rect x="64" y="346" width="22" height="16" rx="5" fill="#f97316" />
            <rect x="176" y="346" width="22" height="16" rx="5" fill="#f97316" />
            <text x="58" y="304" fill="#ffd7ae" fontSize="10">optical engines</text>

            <line x1="74" y1="320" x2="40" y2="212" stroke="#fdba74" strokeWidth="4" markerEnd="url(#arrowOrange)" />
            <line x1="188" y1="320" x2="220" y2="212" stroke="#fdba74" strokeWidth="4" markerEnd="url(#arrowOrange)" />
            <text x="87" y="206" fill="#9fb3cc" fontSize="12">fiber exits near package</text>

            <text x="24" y="76" fill="#f8fbff" fontSize="14" fontWeight="700">光引擎与 ASIC 共封装</text>
            <text x="24" y="100" fill="#9fb3cc" fontSize="13">比 NPO 更进一步，功耗、带宽密度和信号完整性更优，</text>
            <text x="24" y="120" fill="#9fb3cc" fontSize="13">但热、封装、维修与供应链协同更难。</text>

            <rect x="22" y="470" width="216" height="54" rx="12" fill="rgba(249,115,22,0.12)" />
            <text x="34" y="502" fill="#ffedd5" fontSize="13">替代对象：pluggable + 长电通道 + 外部光引擎负担</text>
          </g>

          <g transform="translate(960 140)">
            <rect x="0" y="0" width="260" height="470" rx="24" fill="rgba(168,85,247,0.08)" stroke="rgba(168,85,247,0.3)" />
            <text x="24" y="38" fill="#d8b4fe" fontSize="24" fontWeight="800">OIO</text>
            <text x="76" y="38" fill="#c6d4ea" fontSize="13">Optical I/O</text>

            <rect x="98" y="112" width="64" height="24" rx="8" fill="#2e163f" stroke="#d8b4fe" />
            <text x="109" y="128" fill="#f3e8ff" fontSize="11">remote laser</text>

            <rect x="24" y="278" width="88" height="118" rx="18" fill="#0d1b2c" stroke="#6b4c7d" />
            <rect x="148" y="278" width="88" height="118" rx="18" fill="#0d1b2c" stroke="#6b4c7d" />
            <text x="50" y="294" fill="#bfa3d4" fontSize="11">package A</text>
            <text x="174" y="294" fill="#bfa3d4" fontSize="11">package B</text>

            <rect x="42" y="318" width="40" height="38" rx="10" fill="#162842" stroke="#dbe7ff" />
            <rect x="166" y="318" width="40" height="38" rx="10" fill="#162842" stroke="#dbe7ff" />
            <text x="51" y="342" fill="#f8fbff" fontSize="14" fontWeight="700">XPU</text>
            <text x="175" y="342" fill="#f8fbff" fontSize="14" fontWeight="700">XPU</text>

            <rect x="82" y="324" width="16" height="26" rx="5" fill="#a855f7" />
            <rect x="150" y="324" width="16" height="26" rx="5" fill="#a855f7" />
            <text x="22" y="368" fill="#d8b4fe" fontSize="10">optical I/O chiplet</text>

            <line x1="90" y1="324" x2="110" y2="136" stroke="#d8b4fe" strokeWidth="4" markerEnd="url(#arrowPurple)" />
            <line x1="158" y1="324" x2="150" y2="136" stroke="#d8b4fe" strokeWidth="4" markerEnd="url(#arrowPurple)" />
            <line x1="98" y1="337" x2="150" y2="337" stroke="#d8b4fe" strokeWidth="5" markerEnd="url(#arrowPurple)" />
            <text x="92" y="360" fill="#9fb3cc" fontSize="12">light instead of electrical I/O</text>

            <text x="24" y="76" fill="#f8fbff" fontSize="14" fontWeight="700">把“电 I/O”本身换成光 I/O</text>
            <text x="24" y="100" fill="#9fb3cc" fontSize="13">重点不是交换机模块位置，而是把光带到 XPU / chiplet</text>
            <text x="24" y="120" fill="#9fb3cc" fontSize="13">边上，做 package-to-package / chip-to-chip 互连。</text>

            <rect x="22" y="470" width="216" height="54" rx="12" fill="rgba(168,85,247,0.12)" />
            <text x="34" y="502" fill="#f3e8ff" fontSize="13">替代对象：芯片 / 封装级电 I/O 与部分近距铜互连</text>
          </g>

          <rect x="70" y="650" width="1140" height="70" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
          <text x="94" y="682" fill="#f8fbff" fontSize="16" fontWeight="700">一句话区分</text>
          <text x="94" y="706" fill="#9fb3cc" fontSize="14">
            OCS 是“用光来切网络路径”；NPO 是“光引擎挪到封装旁”；CPO 是“光引擎进封装”；OIO 是“连芯片 I/O 都改成光”。
          </text>
        </svg>
      </div>

      <div className="optical-mode-grid">
        {architectureModes.map(({ key: modeKey, ...mode }) => (
          <ArchitectureModeCard key={modeKey} {...mode} isActive={activeLayer === '06'} />
        ))}
      </div>

      <div className="optical-footnote">
        口径说明：CPO 与 OIO 在现实产品中会有交叉，但这张图里我刻意把它们区分为两个“主要关注点”。
        CPO 更强调光引擎与交换 ASIC 的封装关系；OIO 更强调用光替代芯片 / 芯粒级电 I/O。
        NPO 的具体实现路径在行业里还未完全标准化，这里采用的是“位于封装旁、介于 pluggable 与 CPO 之间”的工程化理解。
      </div>
    </section>
  );
}

function OpticalRackSvg({ activeLayer, onActivate, onDeactivate, onToggle }) {
  const fiberNodes = [
    { number: '02', title: '微光学', note: 'FAU / MT / lens', accent: '#22c55e' },
    { number: '03', title: '无源器件', note: 'AWG / WDM / VOA', accent: '#f59e0b' },
    { number: '04', title: '隔离 / 环行', note: 'Faraday / isolator', accent: '#ef4444' },
    { number: '05', title: '光源 / 芯片', note: 'DFB / EML / CW', accent: '#a855f7' },
  ];

  const networkNodes = [
    { number: '08', title: '传输设备', note: 'OTN / WDM / ROADM', accent: '#38bdf8' },
    { number: '09', title: '接入设备', note: 'PON / ODN / FTTR', accent: '#84cc16' },
  ];

  const productionNodes = [
    { number: '10', title: '封装 / 测试交付', note: '量产节拍、良率、海外产能', accent: '#14b8a6' },
    { number: '11', title: '制造 / 测试装备', note: '自动化与封测装备', accent: '#e879f9' },
  ];

  return (
    <section className="optical-svg-section">
      <div className="optical-position-header">
        <div>
          <div className="optical-kicker">AI Rack View</div>
          <h2 className="optical-block-title">把它们放回 AI 机柜与 switch tray 里看</h2>
          <p className="optical-block-subtitle">
            这次不再用“自由摆放节点”的大 SVG，而是拆成结构化布局图。上面讲信号路径，下面按 Rack、Fiber、Fabric、Equipment 四个区来放节点。
          </p>
        </div>
        <div className="optical-position-note">
          <strong>阅读方法：</strong>
          <span> `07` 在前面板，`01` 把链路拉出机柜，`06` 开始往系统内部和 fabric 上移；`08/09` 承载设备层，`10/11` 提供量产能力。</span>
        </div>
      </div>

      <div className="optical-rack-layout">
        <div className="optical-rack-sequence">
          <div className="optical-rack-sequence-label">Signal Path</div>
          <div className="optical-rack-sequence-item">07 模块</div>
          <div className="optical-rack-sequence-arrow">→</div>
          <div className="optical-rack-sequence-item">01 光纤</div>
          <div className="optical-rack-sequence-arrow">→</div>
          <div className="optical-rack-sequence-item">06 CPO / OCS</div>
          <div className="optical-rack-sequence-arrow">→</div>
          <div className="optical-rack-sequence-item">08 / 09 设备层</div>
        </div>

        <div className="optical-rack-grid">
          <section className="optical-rack-zone">
            <div className="optical-rack-zone-title">AI Rack A</div>
            <div className="optical-rack-zone-subtitle">GPU tray / switch tray / front-panel optics</div>

            <div className="optical-rack-zone-stack">
              <StageCard
                number="07"
                title="高速光模块"
                note="前面板可插拔模块，最接近 switch 端口。"
                accent="#f97316"
                compact
                isActive={activeLayer === '07'}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
                onToggle={onToggle}
              />

              <div className="optical-rack-panel">
                <div className="optical-rack-panel-title">Switch Tray</div>
                <div className="optical-switch-diagram">
                  <div className="optical-switch-port" />
                  <div className="optical-switch-core">ASIC</div>
                  <div className="optical-switch-port" />
                </div>
                <div className="optical-switch-cpo">
                  <span>06 CPO engines</span>
                  <div className="optical-switch-cpo-bars">
                    <span className="optical-switch-cpo-bar" />
                    <span className="optical-switch-cpo-bar" />
                  </div>
                </div>
                <div className="optical-rack-zone-note">
                  这里是“电交换芯片 + 前面板模块”的主战场，若进一步上移，就会从 pluggable 走向 CPO / NPO。
                </div>
              </div>

              <div className="optical-rack-panel">
                <div className="optical-rack-panel-title">GPU / XPU Tray</div>
                <div className="optical-xpu-grid">
                  <div className="optical-xpu-chip">XPU</div>
                  <div className="optical-xpu-chip">XPU</div>
                  <div className="optical-xpu-chip">XPU</div>
                </div>
                <div className="optical-rack-zone-note">
                  OIO 会更靠近这里发生，但这页当前重点仍放在 switch optics 与 fabric 迁移。
                </div>
              </div>
            </div>
          </section>

          <section className="optical-rack-zone">
            <div className="optical-rack-zone-title">Fiber & Patch Zone</div>
            <div className="optical-rack-zone-subtitle">high-density cabling / patch panel / structured links</div>

            <div className="optical-rack-zone-stack">
              <StageCard
                number="01"
                title="光纤 / 光缆"
                note="真正把信号拉出机柜、穿过机房和 pod 的物理链路。"
                accent="#60a5fa"
                compact
                isActive={activeLayer === '01'}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
                onToggle={onToggle}
              />

              <div className="optical-fiber-grid">
                {fiberNodes.map((item) => (
                  <StageCard
                    key={item.number}
                    {...item}
                    compact
                    isActive={activeLayer === item.number}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                    onToggle={onToggle}
                  />
                ))}
              </div>

              <div className="optical-rack-note-list">
                <div className="optical-rack-note-item">
                  <span className="optical-rack-note-badge badge-fiber">01</span>
                  <span>高芯数光纤、patch panel 和 structured links 负责把链路真正铺开。</span>
                </div>
                <div className="optical-rack-note-item">
                  <span className="optical-rack-note-badge badge-module">02–05</span>
                  <span>这些器件大多在模块或引擎内部完成耦合、分复用、隔离与发光，再从 fiber landing 对外。</span>
                </div>
                <div className="optical-rack-note-item">
                  <span className="optical-rack-note-badge badge-system">06</span>
                  <span>一旦 CPO / OCS 上移，fiber landing 会更靠近系统核心，而不是只停在前面板。</span>
                </div>
              </div>
            </div>
          </section>

          <section className="optical-rack-zone">
            <div className="optical-rack-zone-title">OCS / Fabric Zone</div>
            <div className="optical-rack-zone-subtitle">reconfigurable optical paths between racks / pods</div>

            <div className="optical-rack-zone-stack">
              <StageCard
                number="06"
                title="CPO / OCS / 光引擎"
                note="光学开始脱离单个 pluggable，进入系统级互联和交换架构。"
                accent="#06b6d4"
                compact
                isActive={activeLayer === '06'}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
                onToggle={onToggle}
              />

              <div className="optical-rack-panel optical-rack-panel-fabric">
                <div className="optical-rack-panel-title">OCS Fabric</div>
                <div className="optical-ocs-box">OCS</div>
                <div className="optical-rack-zone-note">
                  这里改的是网络路径与拓扑，不是把 02–05 这些模块内部器件简单搬个位置。
                </div>
              </div>
            </div>
          </section>

          <section className="optical-rack-zone">
            <div className="optical-rack-zone-title">Equipment & Production</div>
            <div className="optical-rack-zone-subtitle">system hosts + scale enablers</div>

            <div className="optical-rack-zone-stack">
              <div className="optical-rack-subgrid">
                {networkNodes.map((item) => (
                  <StageCard
                    key={item.number}
                    {...item}
                    compact
                    isActive={activeLayer === item.number}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                    onToggle={onToggle}
                  />
                ))}
              </div>

              <div className="optical-rack-subgrid">
                {productionNodes.map((item) => (
                  <StageCard
                    key={item.number}
                    {...item}
                    compact
                    isActive={activeLayer === item.number}
                    onActivate={onActivate}
                    onDeactivate={onDeactivate}
                    onToggle={onToggle}
                  />
                ))}
              </div>

              <div className="optical-rack-zone-note">
                08/09 是承载网络功能的设备层；10/11 不直接出现在链路上，却决定这些环节能不能按良率、节拍和成本大规模量产。
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="optical-footnote">
        这张图现在不再依赖绝对坐标排版，而是按部署分区做结构化布局。后续即使继续补文案、公司名或说明，也不会像原来那样因为字体和坐标漂移导致整图重叠。
      </div>
    </section>
  );
}

export default function OpticalValueChainReport() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [layerFinanceRecords, setLayerFinanceRecords] = useState({});
  const [layerFinanceError, setLayerFinanceError] = useState('');
  const [layerFinanceLoaded, setLayerFinanceLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadCompanyFinancialRecords()
      .then((records) => {
        if (cancelled) {
          return;
        }

        const financeIndex = createCompanyFinanceIndex(records, {
          reportSlug: '2026-04-optical-value-chain',
          datasetKind: 'annual',
        });
        const groupedRecords = Object.fromEntries(
          financeSectionConfigs.map((config) => [
            config.layerId,
            config.expectedKeys.map((ticker) => getCompanyFinanceRecord(financeIndex, ticker)).filter(Boolean),
          ])
        );

        setLayerFinanceRecords(groupedRecords);
        setLayerFinanceError('');
        setLayerFinanceLoaded(true);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setLayerFinanceRecords({});
        setLayerFinanceError(error instanceof Error ? error.message : 'Unknown error');
        setLayerFinanceLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleActivate = (layer) => {
    setActiveLayer(layer);
  };

  const handleDeactivate = () => {
    setActiveLayer(null);
  };

  const handleToggle = (layer) => {
    setSelectedLayer((current) => (current === layer ? null : layer));
  };

  const linkedLayer = activeLayer ?? selectedLayer;

  return (
    <div className="optical-report-shell">
      <style>{`
        .optical-report-shell {
          position: relative;
          width: min(1480px, calc(100vw - 48px));
          left: 50%;
          transform: translateX(-50%);
          color: #dbe7ff;
          font-family: "IBM Plex Sans", "PingFang SC", "Hiragino Sans GB", sans-serif;
        }

        .optical-report {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(125, 211, 252, 0.12);
          border-radius: 28px;
          background:
            radial-gradient(circle at top left, rgba(34, 197, 94, 0.16), transparent 28%),
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 34%),
            linear-gradient(180deg, rgba(8, 15, 33, 0.98), rgba(10, 18, 39, 0.96));
          box-shadow: 0 30px 80px rgba(2, 6, 23, 0.38);
        }

        .optical-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.06) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.26), rgba(0, 0, 0, 0.02));
          pointer-events: none;
        }

        .optical-content {
          position: relative;
          padding: 40px 40px 52px;
        }

        .optical-hero {
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
          gap: 24px;
          align-items: stretch;
        }

        .optical-hero-card,
        .optical-side-card,
        .optical-method-card,
        .optical-angle-card,
        .optical-section-card {
          background: rgba(15, 23, 42, 0.74);
          border: 1px solid rgba(148, 163, 184, 0.14);
          backdrop-filter: blur(18px);
        }

        .optical-hero-card {
          border-radius: 24px;
          padding: 30px;
        }

        .optical-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.18);
          color: #7dd3fc;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .optical-title {
          margin: 18px 0 12px;
          color: #f8fbff;
          font-size: clamp(32px, 4vw, 54px);
          line-height: 1.06;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .optical-subtitle {
          max-width: 860px;
          color: #9fb2ca;
          font-size: 16px;
          line-height: 1.8;
        }

        .optical-highlight-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .optical-tag {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
        }

        .optical-tag-default {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #d6e4ff;
        }

        .optical-tag-core {
          background: rgba(14, 165, 233, 0.12);
          border: 1px solid rgba(14, 165, 233, 0.22);
          color: #7dd3fc;
        }

        .optical-tag-feature {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.22);
          color: #86efac;
        }

        .optical-tag-rise {
          background: rgba(249, 115, 22, 0.12);
          border: 1px solid rgba(249, 115, 22, 0.2);
          color: #fdba74;
        }

        .optical-side-stack {
          display: grid;
          gap: 16px;
        }

        .optical-side-card {
          border-radius: 22px;
          padding: 22px;
          min-height: 0;
        }

        .optical-side-label {
          color: #8b9cb6;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .optical-side-value {
          margin-top: 12px;
          color: #f8fbff;
          font-size: 30px;
          line-height: 1.1;
          font-weight: 800;
        }

        .optical-side-card p {
          margin-top: 10px;
          color: #a6bad4;
          font-size: 14px;
          line-height: 1.7;
        }

        .optical-jump-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .optical-jump-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(15, 23, 42, 0.56);
          color: #c6d4ea;
          font-size: 13px;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .optical-jump-link.active,
        .optical-jump-link:hover {
          transform: translateY(-1px);
          border-color: rgba(125, 211, 252, 0.3);
          background: rgba(15, 23, 42, 0.8);
        }

        .optical-overview {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: 24px;
          margin-top: 28px;
        }

        .optical-position-section {
          margin-top: 28px;
          display: grid;
          gap: 18px;
        }

        .optical-svg-section {
          margin-top: 28px;
          display: grid;
          gap: 18px;
        }

        .optical-supplement-section {
          margin-top: 28px;
          display: grid;
          gap: 18px;
        }

        .optical-position-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
          gap: 18px;
          align-items: end;
        }

        .optical-position-note {
          padding: 18px 20px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #b9cbdf;
          font-size: 14px;
          line-height: 1.75;
        }

        .optical-position-note strong {
          color: #f8fbff;
        }

        .optical-position-grid {
          display: grid;
          gap: 18px;
        }

        .optical-svg-wrap {
          overflow: hidden;
          border-radius: 26px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(15, 23, 42, 0.74);
          box-shadow: 0 20px 50px rgba(2, 6, 23, 0.28);
        }

        .optical-architecture-svg {
          display: block;
          width: 100%;
          height: auto;
        }

        .optical-rack-layout {
          display: grid;
          gap: 18px;
          padding: 24px;
          border-radius: 26px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          background: rgba(15, 23, 42, 0.74);
          box-shadow: 0 20px 50px rgba(2, 6, 23, 0.28);
        }

        .optical-rack-sequence {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .optical-rack-sequence-label {
          color: #f8fbff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .optical-rack-sequence-item {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          color: #dbe7ff;
          font-size: 13px;
          font-weight: 600;
        }

        .optical-rack-sequence-arrow {
          color: #7f96b3;
          font-size: 18px;
          font-weight: 700;
        }

        .optical-rack-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .optical-rack-zone {
          display: grid;
          gap: 16px;
          padding: 22px;
          border-radius: 24px;
          background: rgba(10, 18, 34, 0.72);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .optical-rack-zone-title {
          color: #f8fbff;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .optical-rack-zone-subtitle {
          margin-top: -8px;
          color: #8fa5c1;
          font-size: 13px;
          line-height: 1.7;
        }

        .optical-rack-zone-stack {
          display: grid;
          gap: 14px;
        }

        .optical-rack-panel {
          display: grid;
          gap: 14px;
          padding: 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .optical-rack-panel-title {
          color: #f8fbff;
          font-size: 16px;
          font-weight: 700;
        }

        .optical-switch-diagram {
          display: grid;
          grid-template-columns: 28px minmax(120px, 1fr) 28px;
          align-items: center;
          gap: 18px;
          min-height: 64px;
        }

        .optical-switch-port {
          width: 28px;
          height: 28px;
          border-radius: 9px;
          background: #f97316;
          box-shadow: 0 0 0 1px rgba(249, 115, 22, 0.28);
        }

        .optical-switch-core {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 58px;
          border-radius: 16px;
          background: rgba(27, 48, 79, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #f8fbff;
          font-size: 18px;
          font-weight: 800;
        }

        .optical-switch-cpo {
          display: grid;
          gap: 10px;
        }

        .optical-switch-cpo > span {
          color: #8be9f7;
          font-size: 12px;
          font-weight: 700;
        }

        .optical-switch-cpo-bars {
          display: flex;
          gap: 10px;
        }

        .optical-switch-cpo-bar {
          width: 56px;
          height: 16px;
          border-radius: 999px;
          background: rgba(6, 182, 212, 0.78);
        }

        .optical-xpu-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .optical-xpu-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 88px;
          border-radius: 18px;
          background: rgba(22, 40, 66, 0.92);
          border: 1px solid rgba(96, 120, 149, 0.9);
          color: #f8fbff;
          font-size: 16px;
          font-weight: 800;
        }

        .optical-fiber-grid,
        .optical-rack-subgrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .optical-rack-note-list {
          display: grid;
          gap: 10px;
        }

        .optical-rack-note-item,
        .optical-rack-zone-note {
          color: #a9bfd8;
          font-size: 13px;
          line-height: 1.75;
        }

        .optical-rack-note-item {
          display: grid;
          grid-template-columns: 66px minmax(0, 1fr);
          gap: 10px;
          align-items: start;
          padding: 10px 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .optical-rack-note-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 28px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
        }

        .optical-rack-note-badge.badge-fiber {
          background: rgba(96, 165, 250, 0.4);
        }

        .optical-rack-note-badge.badge-module {
          background: rgba(249, 115, 22, 0.38);
        }

        .optical-rack-note-badge.badge-system {
          background: rgba(6, 182, 212, 0.38);
        }

        .optical-rack-panel-fabric {
          align-content: start;
        }

        .optical-ocs-box {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 120px;
          border-radius: 20px;
          background: rgba(13, 34, 52, 0.94);
          border: 2px solid rgba(56, 189, 248, 0.78);
          color: #f8fbff;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .optical-mode-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .optical-layer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .optical-layer-card {
          display: grid;
          gap: 14px;
          padding: 20px;
          border-radius: 22px;
          background: rgba(15, 23, 42, 0.74);
          border: 1px solid rgba(148, 163, 184, 0.14);
          backdrop-filter: blur(18px);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .optical-layer-card.is-active {
          transform: translateY(-2px);
          border-color: rgba(125, 211, 252, 0.3);
          box-shadow: 0 18px 42px rgba(2, 6, 23, 0.24);
        }

        .optical-layer-card-head {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
        }

        .optical-layer-card-head h3 {
          color: #f8fbff;
          font-size: 19px;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .optical-layer-card-head p {
          margin-top: 6px;
          color: #9fb3cc;
          font-size: 13px;
          line-height: 1.65;
        }

        .optical-layer-map {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }

        .optical-layer-map-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 34px;
          height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(96, 165, 250, 0.14);
          border: 1px solid rgba(96, 165, 250, 0.22);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 800;
        }

        .optical-layer-tickers {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .optical-layer-ticker {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #dbe7ff;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
        }

        .optical-layer-note {
          color: #a9bfd8;
          font-size: 13px;
          line-height: 1.75;
        }

        .optical-mode-card {
          padding: 18px;
          border-radius: 20px;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--mode-accent) 10%, rgba(15, 23, 42, 0.9)), rgba(15, 23, 42, 0.88));
          border: 1px solid color-mix(in srgb, var(--mode-accent) 22%, rgba(255, 255, 255, 0.08));
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .optical-mode-card.is-active {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--mode-accent) 58%, rgba(255, 255, 255, 0.18));
        }

        .optical-mode-head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .optical-mode-pill {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: color-mix(in srgb, var(--mode-accent) 18%, rgba(15, 23, 42, 0.92));
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
        }

        .optical-mode-subtitle {
          color: #b9cbdf;
          font-size: 12px;
        }

        .optical-mode-meta {
          margin-top: 12px;
          color: color-mix(in srgb, var(--mode-accent) 78%, white);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .optical-mode-card p {
          margin-top: 10px;
          color: #d6e4ff;
          font-size: 14px;
          line-height: 1.75;
        }

        .optical-mode-note {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #9ab0cb;
          font-size: 13px;
          line-height: 1.7;
        }

        .optical-map-panel {
          padding: 24px;
          border-radius: 24px;
          background: rgba(15, 23, 42, 0.74);
          border: 1px solid rgba(148, 163, 184, 0.14);
          backdrop-filter: blur(18px);
        }

        .optical-map-title-row {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: 10px;
        }

        .optical-map-title-row h3 {
          color: #f8fbff;
          font-size: 20px;
          font-weight: 700;
        }

        .optical-map-title-row span {
          color: #8fa5c1;
          font-size: 13px;
        }

        .optical-flow-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .optical-flow-item,
        .optical-exploded-item {
          display: flex;
          align-items: stretch;
          gap: 10px;
          flex: 1 1 210px;
          min-width: 210px;
        }

        .optical-flow-arrow,
        .optical-exploded-connector {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          color: #5f7693;
          font-size: 20px;
          font-weight: 700;
        }

        .optical-stage-card {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: 14px;
          width: 100%;
          padding: 16px;
          border-radius: 20px;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--stage-accent) 12%, rgba(15, 23, 42, 0.9)), rgba(15, 23, 42, 0.88));
          border: 1px solid color-mix(in srgb, var(--stage-accent) 28%, rgba(255, 255, 255, 0.08));
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }

        .optical-stage-card.compact {
          padding: 14px;
          border-radius: 18px;
        }

        .optical-stage-card:hover,
        .optical-stage-card:focus-visible,
        .optical-stage-card.is-active {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(2, 6, 23, 0.24);
          border-color: color-mix(in srgb, var(--stage-accent) 52%, rgba(255, 255, 255, 0.22));
        }

        .optical-stage-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--stage-accent) 24%, rgba(15, 23, 42, 0.92));
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .optical-stage-copy h3 {
          color: #f8fbff;
          font-size: 16px;
          line-height: 1.3;
          font-weight: 700;
        }

        .optical-stage-copy p {
          margin-top: 6px;
          color: #9fb3cc;
          font-size: 13px;
          line-height: 1.65;
        }

        .optical-exploded-layout {
          display: grid;
          grid-template-columns: minmax(180px, 220px) minmax(0, 1fr) minmax(180px, 220px);
          gap: 16px;
          align-items: center;
          margin-top: 18px;
        }

        .optical-edge-node {
          padding: 18px;
          border-radius: 20px;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--stage-accent) 12%, rgba(15, 23, 42, 0.9)), rgba(15, 23, 42, 0.88));
          border: 1px solid color-mix(in srgb, var(--stage-accent) 28%, rgba(255, 255, 255, 0.08));
        }

        .optical-edge-label {
          color: #f8fbff;
          font-size: 15px;
          font-weight: 700;
        }

        .optical-edge-node p {
          margin-top: 8px;
          color: #9fb3cc;
          font-size: 13px;
          line-height: 1.7;
        }

        .optical-shell {
          position: relative;
          padding: 20px;
          border-radius: 24px;
          border: 1px dashed rgba(249, 115, 22, 0.4);
          background: rgba(9, 14, 28, 0.72);
          box-shadow: inset 0 0 0 1px rgba(249, 115, 22, 0.08);
        }

        .optical-shell-title {
          color: #ffedd5;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .optical-shell-subtitle {
          margin-top: 6px;
          color: #9eb0c8;
          font-size: 13px;
          line-height: 1.7;
        }

        .optical-exploded-track {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .optical-support-strip {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .optical-support-item {
          min-width: 0;
        }

        .optical-method-card,
        .optical-angle-card {
          border-radius: 24px;
          padding: 26px;
        }

        .optical-block-title {
          color: #f8fbff;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .optical-block-subtitle {
          margin-top: 8px;
          color: #8fa5c1;
          font-size: 14px;
          line-height: 1.7;
        }

        .optical-rule-list {
          display: grid;
          gap: 12px;
          margin-top: 20px;
        }

        .optical-rule-item {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .optical-rule-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: rgba(96, 165, 250, 0.14);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 700;
        }

        .optical-angle-grid {
          display: grid;
          gap: 14px;
          margin-top: 20px;
        }

        .optical-angle-item {
          padding: 16px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .optical-angle-item h3 {
          color: #e8f3ff;
          font-size: 16px;
          font-weight: 700;
        }

        .optical-angle-item p {
          margin-top: 8px;
          color: #9ab0cb;
          font-size: 14px;
          line-height: 1.75;
        }

        .optical-section-list {
          display: grid;
          gap: 20px;
          margin-top: 28px;
        }

        .optical-section-card {
          border-radius: 24px;
          padding: 26px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          outline: none;
        }

        .optical-section-card:hover,
        .optical-section-card:focus-visible,
        .optical-section-card.is-active {
          transform: translateY(-2px);
          box-shadow: 0 18px 42px rgba(2, 6, 23, 0.24);
          border-color: color-mix(in srgb, var(--accent-color) 38%, rgba(255, 255, 255, 0.18));
        }

        .optical-section-head {
          display: grid;
          grid-template-columns: 76px minmax(0, 1fr);
          gap: 18px;
          align-items: start;
        }

        .optical-section-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 76px;
          height: 76px;
          border-radius: 22px;
          background: color-mix(in srgb, var(--accent-color) 20%, rgba(15, 23, 42, 0.9));
          border: 1px solid color-mix(in srgb, var(--accent-color) 36%, rgba(255, 255, 255, 0.08));
          color: #ffffff;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .optical-section-head h2 {
          color: #f8fbff;
          font-size: 24px;
          line-height: 1.25;
          font-weight: 750;
          letter-spacing: -0.03em;
        }

        .optical-section-head p {
          margin-top: 10px;
          color: #9bb0ca;
          font-size: 15px;
          line-height: 1.78;
        }

        .optical-section-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
          gap: 20px;
          margin-top: 22px;
        }

        .optical-section-main {
          display: grid;
          gap: 16px;
        }

        .optical-company-group {
          padding: 16px 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .optical-group-title {
          color: #dbe7ff;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .optical-company-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .optical-focus-panel {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 18px;
          border-radius: 20px;
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--accent-color) 12%, rgba(15, 23, 42, 0.9)), rgba(15, 23, 42, 0.88));
          border: 1px solid color-mix(in srgb, var(--accent-color) 22%, rgba(255, 255, 255, 0.08));
        }

        .optical-focus-label {
          color: color-mix(in srgb, var(--accent-color) 72%, white);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .optical-focus-panel p,
        .optical-note {
          color: #d2def5;
          font-size: 14px;
          line-height: 1.8;
        }

        .optical-note {
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffe4b3;
        }

        .optical-finance-section {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-top: 28px;
          padding: 26px;
          border-radius: 24px;
          background: rgba(12, 20, 38, 0.74);
          border: 1px solid rgba(148, 163, 184, 0.12);
          backdrop-filter: blur(18px);
        }

        .optical-finance-section.is-active {
          border-color: rgba(96, 165, 250, 0.38);
          box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.12), 0 20px 48px rgba(15, 23, 42, 0.36);
        }

        .optical-finance-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .optical-finance-status {
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #b8cae3;
          font-size: 14px;
          line-height: 1.7;
        }

        .optical-finance-status.is-error {
          border-color: rgba(248, 113, 113, 0.28);
          color: #fecaca;
          background: rgba(127, 29, 29, 0.16);
        }

        .optical-finance-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .deep-company-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          border-radius: 22px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.82), rgba(10, 18, 32, 0.78));
          box-shadow: 0 18px 42px rgba(2, 6, 23, 0.22);
        }

        .deep-company-card.market-us {
          border-color: rgba(37, 99, 235, 0.34);
          background: linear-gradient(180deg, rgba(37, 99, 235, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-ca {
          border-color: rgba(14, 165, 233, 0.32);
          background: linear-gradient(180deg, rgba(14, 165, 233, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-de {
          border-color: rgba(34, 197, 94, 0.34);
          background: linear-gradient(180deg, rgba(34, 197, 94, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-se {
          border-color: rgba(56, 189, 248, 0.34);
          background: linear-gradient(180deg, rgba(56, 189, 248, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-eu {
          border-color: rgba(168, 85, 247, 0.34);
          background: linear-gradient(180deg, rgba(168, 85, 247, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-il {
          border-color: rgba(234, 179, 8, 0.34);
          background: linear-gradient(180deg, rgba(234, 179, 8, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-uk {
          border-color: rgba(2, 132, 199, 0.34);
          background: linear-gradient(180deg, rgba(2, 132, 199, 0.1), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-fr {
          border-color: rgba(147, 51, 234, 0.34);
          background: linear-gradient(180deg, rgba(147, 51, 234, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-jp {
          border-color: rgba(249, 115, 22, 0.34);
          background: linear-gradient(180deg, rgba(249, 115, 22, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-company-card.market-tw {
          border-color: rgba(202, 138, 4, 0.34);
          background: linear-gradient(180deg, rgba(202, 138, 4, 0.08), rgba(15, 23, 42, 0.78));
        }

        .deep-card-top {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: flex-start;
        }

        .deep-name {
          color: #f8fbff;
          font-size: 24px;
          font-weight: 800;
          line-height: 1.1;
        }

        .deep-sub {
          margin-top: 6px;
          color: #8fa5c1;
          font-size: 13px;
          letter-spacing: 0.04em;
        }

        .cap-pill {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          color: #dbe7ff;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .deep-summary {
          color: #d8e4fb;
          font-size: 14px;
          line-height: 1.75;
        }

        .deep-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .deep-tag {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.14);
          color: #c7d7ef;
          font-size: 12px;
          font-weight: 600;
        }

        .company-finance {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .finance-topline {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .finance-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.22);
          color: #d8f0ff;
          font-size: 12px;
          font-weight: 700;
        }

        .finance-chip.soft {
          background: rgba(148, 163, 184, 0.1);
          border-color: rgba(148, 163, 184, 0.18);
          color: #c6d4ea;
        }

        .finance-panel-grid,
        .finance-summary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .finance-series-card,
        .finance-summary-card,
        .company-fundamentals {
          padding: 16px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.58);
          border: 1px solid rgba(148, 163, 184, 0.14);
        }

        .finance-series-head,
        .finance-summary-head,
        .company-fundamentals-head {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: baseline;
          margin-bottom: 12px;
        }

        .finance-series-head strong,
        .finance-summary-head strong,
        .company-fundamentals-head strong {
          color: #f8fbff;
          font-size: 15px;
        }

        .finance-series-head span,
        .finance-summary-head span,
        .company-fundamentals-head span {
          color: #8fa5c1;
          font-size: 12px;
        }

        .finance-series-chart,
        .finance-pair-list,
        .company-fundamentals-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .finance-series-row,
        .finance-pair-row {
          display: grid;
          align-items: center;
          gap: 10px;
        }

        .finance-series-row {
          grid-template-columns: 54px minmax(0, 1fr) minmax(72px, auto);
        }

        .finance-pair-row {
          grid-template-columns: 54px minmax(0, 1fr);
        }

        .finance-series-label,
        .finance-pair-label {
          color: #9fb3cc;
          font-size: 12px;
          font-weight: 700;
        }

        .finance-series-track {
          height: 9px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.12);
          overflow: hidden;
        }

        .finance-series-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, rgba(56, 189, 248, 0.42), rgba(125, 211, 252, 0.95));
        }

        .finance-series-fill.profit {
          background: linear-gradient(90deg, rgba(45, 212, 191, 0.35), rgba(45, 212, 191, 0.95));
        }

        .finance-series-value,
        .finance-pair-value {
          color: #eef4ff;
          font-size: 13px;
          font-weight: 700;
          text-align: right;
        }

        .finance-pair-sub {
          display: block;
          margin-top: 12px;
          color: #7f96b3;
          font-size: 12px;
          line-height: 1.65;
        }

        .finance-note {
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #c5d5eb;
          font-size: 13px;
          line-height: 1.75;
        }

        .company-fundamentals-item {
          position: relative;
          padding-left: 14px;
          color: #d4e0f6;
          font-size: 13px;
          line-height: 1.75;
        }

        .company-fundamentals-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 9px;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #7dd3fc;
        }

        .optical-footnote {
          margin-top: 22px;
          padding: 18px 20px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #8fa5c1;
          font-size: 13px;
          line-height: 1.75;
        }

        .optical-linked-hint {
          margin-top: 18px;
          padding: 12px 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #9fb3cc;
          font-size: 13px;
          line-height: 1.7;
        }

        .optical-linked-hint strong {
          color: #f8fbff;
        }

        @media (max-width: 1100px) {
          .optical-hero,
          .optical-overview,
          .optical-section-grid,
          .optical-position-header,
          .optical-exploded-layout {
            grid-template-columns: 1fr;
          }

          .optical-mode-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .optical-rack-grid {
            grid-template-columns: 1fr;
          }

          .optical-layer-grid,
          .optical-finance-grid,
          .finance-panel-grid,
          .finance-summary-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .optical-report-shell {
            width: calc(100vw - 32px);
          }

          .optical-content {
            padding: 24px 18px 32px;
          }

          .optical-title {
            font-size: 30px;
          }

          .optical-section-head {
            grid-template-columns: 1fr;
          }

          .optical-section-number {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            font-size: 18px;
          }

          .optical-section-card,
          .optical-method-card,
          .optical-angle-card,
          .optical-map-panel,
          .optical-hero-card,
          .optical-side-card {
            border-radius: 20px;
          }

          .optical-flow-item,
          .optical-exploded-item {
            min-width: 100%;
          }

          .optical-support-strip {
            grid-template-columns: 1fr;
          }

          .optical-mode-grid {
            grid-template-columns: 1fr;
          }

          .optical-layer-card-head {
            flex-direction: column;
          }

          .optical-layer-map {
            justify-content: flex-start;
          }

          .optical-rack-layout {
            padding: 18px;
          }

          .optical-fiber-grid,
          .optical-rack-subgrid,
          .optical-xpu-grid {
            grid-template-columns: 1fr;
          }

          .optical-rack-note-item {
            grid-template-columns: 1fr;
          }

          .deep-card-top {
            flex-direction: column;
          }

          .finance-series-row {
            grid-template-columns: 48px minmax(0, 1fr) minmax(64px, auto);
          }

          .finance-pair-row {
            grid-template-columns: 48px minmax(0, 1fr);
          }
        }
      `}</style>

      <section className="optical-report">
        <div className="optical-grid" />

        <div className="optical-content">
          <header className="optical-hero">
            <div className="optical-hero-card">
              <div className="optical-kicker">Optical Communications Value Map</div>
              <h1 className="optical-title">光通信产业链：真正拿走价值的是谁</h1>
              <p className="optical-subtitle">
                这版不按“上中下游”平铺，而是按价值捕获点、供给卡点、验证深度来重排。Tier
                也不是按市值，而是按产品卡位、客户验证、量产成熟度、垂直整合度与行业影响力来重新分层。
              </p>

              <div className="optical-highlight-row">
                {highlights.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>

              <div className="optical-jump-nav">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    className={`optical-jump-link${linkedLayer === section.number ? ' active' : ''}`}
                    href={`#${section.id}`}
                    onMouseEnter={() => handleActivate(section.number)}
                    onMouseLeave={handleDeactivate}
                    onFocus={() => handleActivate(section.number)}
                    onBlur={handleDeactivate}
                    onClick={() => handleToggle(section.number)}
                  >
                    <span>{section.number}</span>
                    <span>{section.title}</span>
                  </a>
                ))}
              </div>

              <div className="optical-linked-hint">
                <strong>联动查看：</strong>
                {linkedLayer
                  ? ` 当前高亮的是 ${linkedLayer} ${layerQuickMap[linkedLayer]}。`
                  : ' 点按上面的编号、图中的节点或下方正文卡片，可以联动高亮。'}
              </div>
            </div>

            <div className="optical-side-stack">
              <div className="optical-side-card">
                <div className="optical-side-label">最容易被低估</div>
                <div className="optical-side-value">模块背后的小环节</div>
                <p>FAU、AWG、MT/MPO、CW 光源、法拉第旋片和光引擎，决定了良率、BOM 与迭代速度。</p>
              </div>
              <div className="optical-side-card">
                <div className="optical-side-label">最该高频跟踪</div>
                <div className="optical-side-value">OCS / NPO / CPO</div>
                <p>真正改变估值框架的不是单一速率升级，而是 AI 光互联从模块走向系统级架构迁移。</p>
              </div>
              <div className="optical-side-card">
                <div className="optical-side-label">初版说明</div>
                <div className="optical-side-value">结构化底稿</div>
                <p>当前版本先按投研框架整理公司与赛道，后续可继续补来源链接、财务口径和公司对比维度。</p>
              </div>
            </div>
          </header>

          <OpticalPositionMap
            activeLayer={linkedLayer}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onToggle={handleToggle}
          />
          <OpticalArchitectureSvg activeLayer={linkedLayer} />
          <OpticalRackSvg
            activeLayer={linkedLayer}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
            onToggle={handleToggle}
          />
          <PhotonicsLayersSupplement activeLayer={linkedLayer} />
          {financeSectionConfigs.map((config) => (
            <LayerFinanceSection
              key={config.layerId}
              config={config}
              activeLayer={linkedLayer}
              records={layerFinanceRecords[config.layerId] || []}
              loading={!layerFinanceLoaded && !layerFinanceError}
              error={layerFinanceError}
            />
          ))}

          <section className="optical-overview">
            <div className="optical-method-card">
              <h2 className="optical-block-title">Tier 怎么分</h2>
              <p className="optical-block-subtitle">
                这里的 Tier 不是按市值、营收或名气来排，而是按对行业节奏的真实影响力来排。
              </p>
              <div className="optical-rule-list">
                {tierRules.map((rule, index) => (
                  <div key={rule} className="optical-rule-item">
                    <span className="optical-rule-index">{index + 1}</span>
                    <div>{rule}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="optical-angle-card">
              <h2 className="optical-block-title">投研最该盯的三件事</h2>
              <p className="optical-block-subtitle">
                如果只盯“光模块出货量”，很容易错过真正的超额收益来源。更重要的是拆出关键瓶颈、验证层级和平台化采用。
              </p>
              <div className="optical-angle-grid">
                {watchAngles.map((angle) => (
                  <div key={angle.title} className="optical-angle-item">
                    <h3>{angle.title}</h3>
                    <p>{angle.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="optical-section-list">
            {sections.map((section) => (
              <div id={section.id} key={section.id}>
                <SectionCard
                  {...section}
                  isActive={linkedLayer === section.number}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  onToggle={handleToggle}
                />
              </div>
            ))}
          </section>

          <div className="optical-footnote">
            说明：本页按你提供的初始投研框架完成结构化落版，先强调价值捕获点、卡点与验证深度，不展开教科书式全产业链百科。
            若你愿意，下一版我可以继续补三类增强内容：公司对比矩阵、关键产品示意图、以及来源链接与时间口径。
          </div>
        </div>
      </section>
    </div>
  );
}
