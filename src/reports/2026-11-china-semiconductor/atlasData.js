// Research assessments as of 2026-11-24. Gap is ordinal, not a measured percentage or market share.
export const sourceRegistry = {
  "triolo": [
    "2026-02-20 · Paul Triolo / American Affairs",
    "https://americanaffairsjournal.org/2026/02/innovation-under-pressure-chinas-semiconductor-industry-at-a-crossroads/"
  ],
  "asml": [
    "ASML 2025 年报（2026 发布）",
    "https://www.sec.gov/Archives/edgar/data/937966/000162828026011377/asml-2025xannualxreportx.htm"
  ],
  "tsmc": [
    "TSMC 2025 年报（N2 于 2025Q4 HVM）",
    "https://investor.tsmc.com/static/annualReports/2025/english/index.html"
  ],
  "tech": [
    "2026-08-27 · TechInsights N+3 拆解",
    "https://www.techinsights.com/blog/smic-n3-kirin-9030-pro-process-flow-analysis"
  ],
  "semi": [
    "2026-06-14 · SemiAnalysis N+3 拆解",
    "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"
  ],
  "cxmt": [
    "2026-09-20 · 长鑫 G5 工艺量产公告",
    "https://www.cxmt.com/news/info_97.html"
  ],
  "lpddr": [
    "2026-09-07 · 长鑫 LPDDR6 商用公告",
    "https://www.cxmt.com/news/info_96.html"
  ],
  "hbm": [
    "2026-10-28 · SK hynix Q3 2026",
    "https://news.skhynix.com/en/q3-2026-business-results/"
  ],
  "samsung": [
    "2026-02-12 · Samsung HBM4 商用公告",
    "https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4-with-ultimate-performance-for-ai-computing"
  ],
  "nand": [
    "2026-05-14 · TechInsights NAND 路线图",
    "https://www.techinsights.com/blog/nand-technology-roadmap-0"
  ],
  "euv": [
    "2025-12-17 · Reuters EUV 原型报道（转载）",
    "https://www.investing.com/news/stock-market-news/exclusivehow-china-built-its-manhattan-project-to-rival-the-west-in-ai-chips-4413119"
  ],
  "duv": [
    "2026-07-28 · Reuters 爱晟纳报道（转载）",
    "https://www.streetinsider.com/Reuters/Exclusive-China%2Bstarts%2Bproduction%2Bof%2Bhome-grown%2Bimmersion%2BDUV%2Bchipmaking%2Btools%2C%2Bsource%2Bsays/26821124.html?classic=1"
  ],
  "ft": [
    "2026-09 · FT 华为光刻产业协同报道",
    "https://www.ft.com/content/36333a53-4063-4aad-8d2f9d0048a3"
  ],
  "nikkei": [
    "2025 · Nikkei Asia 光刻产业协作调查",
    "https://nikkei.shorthandstories.com/can-china-build-its-own-asml/"
  ],
  "amies": [
    "2026-01-07 · SCMP 上海微电子资产调整报道",
    "https://www.scmp.com/tech/big-tech/article/3339071/chinas-top-lithography-bet-shifts-gears-smee-sells-subsidiary-strategic-pivot"
  ],
  "ding": [
    "2026-06-12 · 鼎龙光刻胶订单公告",
    "https://static.cninfo.com.cn/finalpage/2026-06-12/1225366157.PDF"
  ],
  "piotech": [
    "2026-08-21 · 拓荆半年报",
    "https://static.cninfo.com.cn/finalpage/2026-08-21/1225486631.PDF"
  ],
  "huawei": [
    "2026-09-17 · 华为全联接大会",
    "https://www.huawei.com/cn/news/2026/9/hc-wang-keynote"
  ],
  "baseline": [
    "原专题：公司与产品映射（2026-11-24，非逐项独立核验）",
    "#cs-companies"
  ]
};
export const gapLevels = {
  "0": [
    "G0",
    "局部领先 / 同级",
    "#22c55e"
  ],
  "1": [
    "G1",
    "接近 / 商用竞争",
    "#2dd4bf"
  ],
  "2": [
    "G2",
    "可商用但有明显差距",
    "#eab308"
  ],
  "3": [
    "G3",
    "代差 / 高端验证",
    "#fb923c"
  ],
  "4": [
    "G4",
    "关键能力未证实",
    "#f87171"
  ],
  "U": [
    "U",
    "无法同口径比较",
    "#94a3b8"
  ]
};
export const processNodes = [
  {
    "id": "p0",
    "group": "制造",
    "segment": "先进逻辑",
    "label": "先进逻辑",
    "gap": 3,
    "cn": "中芯 N+3：7nm 级演进；已见终端产品",
    "world": "TSMC N2：2025Q4 量产，GAA",
    "why": "N+3 密度约接近 N6，未达商业 5nm 整体缩放水平；多重曝光增加成本及缺陷风险。不能把单项金属 pitch 等同节点领先。",
    "sourceIds": [
      "tech",
      "semi",
      "tsmc"
    ],
    "stage": "商用 / 先进节点落后",
    "evidence": "拆解 + 年报",
    "players": "中芯国际 688981/00981.HK；鹏芯微 PXW；华为关联制造集群",
    "leaders": "TSMC"
  },
  {
    "id": "p1",
    "group": "制造",
    "segment": "成熟逻辑/特色工艺",
    "label": "成熟逻辑 / 特色",
    "gap": 1,
    "cn": "多类成熟节点已规模商用",
    "world": "UMC / GF：广泛特色工艺平台",
    "why": "同节点下看 BCD、RF、汽车可靠性、良率和客户组合；无统一代差。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "规模商用，工艺各异",
    "evidence": "原研究映射 / 定性判断",
    "players": "华虹 688347/01347.HK；华力；晶合集成 688249；芯联集成 688469；粤芯；积塔；芯恩；燕东微 688172；士兰微 600460；华润微 688396；广州增芯",
    "leaders": "UMC / GlobalFoundries"
  },
  {
    "id": "p2",
    "group": "制造",
    "segment": "DRAM / HBM",
    "label": "通用 DRAM",
    "gap": 1,
    "cn": "长鑫 G5：11.95nm AA 半间距；LPDDR6 量产（公司披露）",
    "world": "SK hynix / Samsung 1c 等先进平台",
    "why": "局部节点和接口已接近；同密度成本、良率、产品组合和服务器认证未公开对标。",
    "sourceIds": [
      "cxmt",
      "lpddr",
      "hbm",
      "samsung"
    ],
    "stage": "量产",
    "evidence": "公司披露",
    "players": "长鑫存储；福建晋华；昇维旭（进展不透明）",
    "leaders": "SK hynix / Micron / Samsung"
  },
  {
    "id": "p3",
    "group": "制造",
    "segment": "DRAM / HBM",
    "label": "HBM",
    "gap": 3,
    "cn": "早期 HBM 路线有报道；先进堆叠批量良品未核实",
    "world": "Samsung 2026-02 HBM4 商用；SK hynix 2026Q4 预计 HBM4 为主流",
    "why": "DRAM 代际不能直接推断 HBM；基底 die、TSV、堆叠良率、带宽与客户认证是约束。",
    "sourceIds": [
      "triolo",
      "hbm",
      "samsung"
    ],
    "stage": "研发 / 导入",
    "evidence": "报道 + 海外公告",
    "players": "长鑫存储；华为关联生态（候选，具体供应未知）",
    "leaders": "SK hynix / Micron / Samsung"
  },
  {
    "id": "p4",
    "group": "制造",
    "segment": "NAND / NOR",
    "label": "NAND / NOR",
    "gap": 1,
    "cn": "长江存储 Xtacking；已商用 3D NAND",
    "world": "SK hynix 321 层；Samsung 286 active layers 等",
    "why": "国内最新量产层数、单位面积位元数及 eSSD 认证缺乏同口径比较；键合路线有竞争力，层数不能单独判断。",
    "sourceIds": [
      "nand",
      "hbm",
      "baseline"
    ],
    "stage": "NAND 商用；武汉新芯侧重特色存储",
    "evidence": "原研究映射 / 定性判断",
    "players": "长江存储；武汉新芯",
    "leaders": "Kioxia / SanDisk"
  },
  {
    "id": "p5",
    "group": "前道设备",
    "segment": "光刻 i-line / DUV / EUV",
    "label": "干式 DUV / i-line",
    "gap": 2,
    "cn": "成熟与部分干式产品已有商用/验证",
    "world": "ASML KrF、ArF dry 多代量产",
    "why": "先进干式系统的分辨率、套刻、吞吐及稳定性无同口径数据。",
    "sourceIds": [
      "triolo",
      "asml"
    ],
    "stage": "商用 / 验证",
    "evidence": "报道 + 年报",
    "players": "上海微电子；芯上微装（应用不同）",
    "leaders": "ASML / Nikon / Canon"
  },
  {
    "id": "p6",
    "group": "前道设备",
    "segment": "光刻 i-line / DUV / EUV",
    "label": "浸没式 DUV",
    "gap": 3,
    "cn": "宇量昇测试；爱晟纳小批生产报道，验收与出货未核实",
    "world": "ASML NXT:2150：310 wafers/h（ATP，2024测量）",
    "why": "同剂量、套刻、uptime、连续跑片良率未知；报道产量目标不等于可量产。",
    "sourceIds": [
      "duv",
      "ft",
      "asml"
    ],
    "stage": "小批生产报道 / 验证",
    "evidence": "媒体 + 年报",
    "players": "宇量昇；上海爱晟纳；上海微电子；新凯来相关体系",
    "leaders": "ASML / Nikon / Canon"
  },
  {
    "id": "p7",
    "group": "前道设备",
    "segment": "光刻 i-line / DUV / EUV",
    "label": "EUV / High-NA",
    "gap": 4,
    "cn": "原型光源报道；未确认量产合格芯片",
    "world": "ASML NXE:3800E 230 wafers/h；EXE:5200B 客户现场规格验证",
    "why": "光源、反射光学、掩模、精密运动及工艺集成均须验证。原型不等于曝光或量产。",
    "sourceIds": [
      "euv",
      "asml",
      "triolo"
    ],
    "stage": "研发 / 原型",
    "evidence": "媒体 + 年报",
    "players": "华为关联专项；长春光机所等科研团队；整机主体不透明",
    "leaders": "ASML / Nikon / Canon"
  },
  {
    "id": "p8",
    "group": "前道设备",
    "segment": "涂胶显影 Track",
    "label": "Track 涂胶显影",
    "gap": 3,
    "cn": "国产 Track 已导入部分场景",
    "world": "TEL 高端 ArF/EUV Track",
    "why": "高端胶膜均匀性、缺陷、烘烤及 scanner 联机认证不足。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入；先进 Track 待验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "芯源微 688037；盛美上海 688082；新凯来",
    "leaders": "TEL"
  },
  {
    "id": "p9",
    "group": "前道设备",
    "segment": "CCP / ICP / HAR / ALE / DRIE 刻蚀",
    "label": "刻蚀 CCP / ICP / HAR",
    "gap": 1,
    "cn": "中微、北方华创已有规模设备",
    "world": "Lam / TEL / AMAT 多代先进 HAR、ALE",
    "why": "先进 GAA 选择比、HAR 轮廓及跨客户良率缺少同规格对标；ALE 单独观察。",
    "sourceIds": [
      "triolo",
      "baseline"
    ],
    "stage": "商用；高端工艺逐型号验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "中微公司 688012；北方华创 002371；屹唐股份 688729（去胶及等离子处理等）",
    "leaders": "Lam / AMAT / TEL"
  },
  {
    "id": "p10",
    "group": "前道设备",
    "segment": "PVD / PECVD / LPCVD / SACVD / HDP-CVD",
    "label": "PVD / CVD",
    "gap": 1,
    "cn": "国产 PVD、PECVD、LPCVD 有商用基础",
    "world": "AMAT / Lam / Kokusai 全工艺平台",
    "why": "先进低缺陷薄膜、低温工艺、均匀性和重复性仍须逐配方验收。",
    "sourceIds": [
      "triolo",
      "baseline"
    ],
    "stage": "商用/导入",
    "evidence": "原研究映射 / 定性判断",
    "players": "北方华创 002371；拓荆科技 688072；中微公司 688012",
    "leaders": "AMAT / Lam / Kokusai"
  },
  {
    "id": "p11",
    "group": "前道设备",
    "segment": "ALD / PEALD / 外延 / MOCVD",
    "label": "ALD / 外延",
    "gap": 2,
    "cn": "ALD 与部分外延商业导入",
    "world": "ASM / TEL / AMAT 先进原子层及选择性外延",
    "why": "先进逻辑与 DRAM 的膜厚精度、杂质、选择性及产能；MOCVD/光伏不能替代。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "不同应用不可混同",
    "evidence": "原研究映射 / 定性判断",
    "players": "拓荆科技 688072；北方华创 002371；微导纳米 688147；中微公司 688012；晶升股份 688478（晶体生长装备相关）",
    "leaders": "ASM / Aixtron / Veeco"
  },
  {
    "id": "p12",
    "group": "前道设备",
    "segment": "铜电镀 ECP / TSV",
    "label": "铜电镀 / ECP",
    "gap": 1,
    "cn": "盛美等有电镀产品",
    "world": "Lam / AMAT 先进互连及 TSV",
    "why": "微孔无空洞填充、缺陷、配方及高端工艺认证未统一对标。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入",
    "evidence": "原研究映射 / 定性判断",
    "players": "盛美上海 688082；北方华创 002371",
    "leaders": "Lam / AMAT"
  },
  {
    "id": "p13",
    "group": "前道设备",
    "segment": "湿法清洗 / 兆声波 / 去胶",
    "label": "清洗 / 去胶",
    "gap": 1,
    "cn": "单片/槽式已规模供货",
    "world": "SCREEN / TEL 高端低损伤清洗",
    "why": "先进高深宽比结构的颗粒、表面损伤和干燥控制。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "规模商用，先进工艺逐项认证",
    "evidence": "原研究映射 / 定性判断",
    "players": "盛美上海 688082；北方华创 002371；芯源微 688037；至纯科技 603690；屹唐股份 688729",
    "leaders": "SCREEN / TEL"
  },
  {
    "id": "p14",
    "group": "前道设备",
    "segment": "CMP / 减薄",
    "label": "CMP / 减薄",
    "gap": 1,
    "cn": "华海清科商用 CMP",
    "world": "AMAT / Ebara / DISCO",
    "why": "先进材料选择比、纳米级平坦度、低缺陷及薄晶圆良率待对标。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用；先进键合前 CMP 逐项认证",
    "evidence": "原研究映射 / 定性判断",
    "players": "华海清科 688120",
    "leaders": "AMAT / Ebara / DISCO"
  },
  {
    "id": "p15",
    "group": "前道设备",
    "segment": "离子注入",
    "label": "离子注入",
    "gap": 2,
    "cn": "凯世通、中科信等导入",
    "world": "Axcelis / AMAT 高能、大束流全平台",
    "why": "束流纯度、剂量均匀性、可用性和完整机型覆盖。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入",
    "evidence": "原研究映射 / 定性判断",
    "players": "凯世通；中科信；北方华创相关布局",
    "leaders": "Axcelis / AMAT"
  },
  {
    "id": "p16",
    "group": "前道设备",
    "segment": "氧化 / 扩散 / RTP / 退火",
    "label": "热处理 / RTP",
    "gap": 1,
    "cn": "氧化、扩散、RTP 已商用",
    "world": "TEL / Kokusai / AMAT",
    "why": "高端温度均匀性、热预算和先进退火性能。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入",
    "evidence": "原研究映射 / 定性判断",
    "players": "北方华创 002371；屹唐股份 688729；AMIES",
    "leaders": "TEL / Kokusai / AMAT"
  },
  {
    "id": "p17",
    "group": "前道设备",
    "segment": "光学缺陷检测 / 膜厚 / OCD / Overlay / CD-SEM / 电子束",
    "label": "光学量测 / 检测",
    "gap": 3,
    "cn": "部分无图形缺陷与膜厚、OCD 商用",
    "world": "KLA / Nova 高端图形检测与工艺控制",
    "why": "先进图形缺陷捕获率、误报、吞吐、overlay 及工艺覆盖率。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用 / 先进验证",
    "evidence": "定性判断",
    "players": "中科飞测；精测电子；睿励；御微半导体",
    "leaders": "KLA / Nova / Hitachi / ASML"
  },
  {
    "id": "p18",
    "group": "前道设备",
    "segment": "光学缺陷检测 / 膜厚 / OCD / Overlay / CD-SEM / 电子束",
    "label": "电子束 / CD-SEM",
    "gap": 3,
    "cn": "国产设备研发与导入",
    "world": "KLA / Hitachi / ASML 多束电子束",
    "why": "分辨率、束流稳定性、吞吐及低损伤；多束量产证据有限。",
    "sourceIds": [
      "asml",
      "baseline"
    ],
    "stage": "验证 / 导入",
    "evidence": "定性判断",
    "players": "精测电子；东方晶源；中科飞测等候选",
    "leaders": "KLA / Nova / Hitachi / ASML"
  },
  {
    "id": "p19",
    "group": "零部件",
    "segment": "真空泵 / 阀 / 腔体 / 密封",
    "label": "真空泵 / 阀 / 腔体",
    "gap": 2,
    "cn": "部分结构件及工艺泵商用",
    "world": "Edwards / VAT / UCT",
    "why": "先进腐蚀性工艺下寿命、泄漏率、颗粒控制；不能用通用工业泵替代。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入，工艺级性能待分型号确认",
    "evidence": "原研究映射 / 定性判断",
    "players": "汉钟精机 002158；中科仪；新莱应材 300260；富创精密 688409；先锋精科 688605；托伦斯",
    "leaders": "Edwards / VAT / UCT"
  },
  {
    "id": "p20",
    "group": "零部件",
    "segment": "RF 电源 / 匹配器 / 等离子体源",
    "label": "RF 电源 / 等离子体",
    "gap": 2,
    "cn": "国产射频电源部分商用",
    "world": "Advanced Energy / MKS",
    "why": "高频脉冲、阻抗匹配、重复性及高端机台长时验证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "部分商用，先进型号待验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "恒运昌；英杰电气 300820；新克斯等",
    "leaders": "Advanced Energy / MKS"
  },
  {
    "id": "p21",
    "group": "零部件",
    "segment": "Gas Box / MFC / 高纯管路 / 纯化",
    "label": "Gas Box / MFC",
    "gap": 2,
    "cn": "高纯管路及系统商用；高端 MFC 待确认",
    "world": "HORIBA / MKS / Fujikin",
    "why": "微流量精度、动态响应、腐蚀耐受及配方重复性。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "高端 MFC 仍需单独验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "富创精密 688409；新莱应材 300260；正帆科技 688596；至纯科技 603690；七星华创相关体系",
    "leaders": "HORIBA / MKS / Fujikin"
  },
  {
    "id": "p22",
    "group": "零部件",
    "segment": "精密结构件 / ESC / 陶瓷加热器",
    "label": "结构件 / ESC / 加热器",
    "gap": 2,
    "cn": "结构件规模商用；先进 ESC 验证",
    "world": "NGK / Kyocera / UCT",
    "why": "ESC 温度均匀性、吸附、耐等离子体和寿命；结构件与 ESC 差距不同。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "结构件商用；高端 ESC 导入/验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "富创精密 688409；先锋精科 688605；珂玛科技 301611；江丰电子 300666；国瓷材料 300285",
    "leaders": "UCT / NGK / Kyocera"
  },
  {
    "id": "p23",
    "group": "零部件",
    "segment": "Chiller / 废气处理",
    "label": "Chiller / 废气处理",
    "gap": 1,
    "cn": "已有晶圆厂相关产品",
    "world": "SMC / Edwards 等",
    "why": "高精度温控、排放处理效率、可靠性需同工况比较。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用",
    "evidence": "原研究映射 / 定性判断",
    "players": "京仪装备 688652；正帆科技 688596",
    "leaders": "SMC / Edwards"
  },
  {
    "id": "p24",
    "group": "零部件",
    "segment": "石英 / 硅环 / SiC / 陶瓷",
    "label": "石英 / 硅 / SiC 部件",
    "gap": 1,
    "cn": "国产多种耗材已商用",
    "world": "Ferrotec / CoorsTek 等",
    "why": "纯度、颗粒、耐腐蚀、寿命以及高端机台认证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用，先进工艺认证有差异",
    "evidence": "原研究映射 / 定性判断",
    "players": "菲利华 300395；石英股份 603688；凯德石英；神工股份 688233；臻宝科技；珂玛科技 301611",
    "leaders": "Ferrotec / CoorsTek"
  },
  {
    "id": "p25",
    "group": "零部件",
    "segment": "机械手 / EFEM / AMHS / FOUP",
    "label": "晶圆传输 / AMHS",
    "gap": 2,
    "cn": "国产机械手、自动化部分商用",
    "world": "Brooks / RORZE / Daifuku",
    "why": "洁净传输、可靠性、精密定位及整厂调度。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "部分商用，具体型号待核实",
    "evidence": "原研究映射 / 定性判断",
    "players": "新松机器人 300024；华卓精科；新施诺；弥费科技；专业载具厂商",
    "leaders": "Brooks / RORZE / Daifuku / Entegris"
  },
  {
    "id": "p26",
    "group": "光刻子系统",
    "segment": "ArF / KrF 光源",
    "label": "ArF / KrF 光源",
    "gap": 3,
    "cn": "国产准分子光源研发与验证",
    "world": "Cymer / Gigaphoton 成熟量产",
    "why": "高功率稳定光源、线宽、能量波动、寿命与维护；FT 报道仍为短板。",
    "sourceIds": [
      "ft",
      "triolo",
      "baseline"
    ],
    "stage": "子系统参与不等于整机供货",
    "evidence": "原研究映射 / 定性判断",
    "players": "科益虹源；福晶科技 002222；炬光科技 688167（相关光学元件）",
    "leaders": "Cymer / Gigaphoton"
  },
  {
    "id": "p27",
    "group": "光刻子系统",
    "segment": "投影物镜 / 照明光学 / EUV 反射镜",
    "label": "DUV 精密光学",
    "gap": 3,
    "cn": "国内物镜研发，部分原型仍用进口镜头的报道",
    "world": "ZEISS / Nikon 高精密投影物镜",
    "why": "波前像差、透过率、热稳定性和系统套刻；供应关系需确认。",
    "sourceIds": [
      "ft",
      "triolo"
    ],
    "stage": "研发 / 验证",
    "evidence": "媒体",
    "players": "国望光学；国科精密；茂莱光学；至期光子（报道）；长春光机所等",
    "leaders": "ZEISS"
  },
  {
    "id": "p28",
    "group": "光刻子系统",
    "segment": "投影物镜 / 照明光学 / EUV 反射镜",
    "label": "EUV 反射光学",
    "gap": 4,
    "cn": "多层反射光学科研；整机可用性未知",
    "world": "ZEISS EUV / High-NA 反射光学",
    "why": "反射率、波前精度、污染控制、全光路装调；无可比量产规格。",
    "sourceIds": [
      "euv",
      "asml",
      "triolo"
    ],
    "stage": "研发",
    "evidence": "媒体 / 科研",
    "players": "长春光机所等；整机配套主体未公开",
    "leaders": "ZEISS"
  },
  {
    "id": "p29",
    "group": "光刻子系统",
    "segment": "双工件台 / 光栅 / 干涉仪 / 浸没控制",
    "label": "工件台 / 浸没控制",
    "gap": 3,
    "cn": "华卓精科等有相关研发",
    "world": "ASML / Nikon 系统级精密运动与浸没",
    "why": "动态套刻、定位、加速度、振动、浸没缺陷和系统吞吐；单部件指标不可外推。",
    "sourceIds": [
      "triolo",
      "baseline"
    ],
    "stage": "研发/验证；具体量产供货未证实",
    "evidence": "原研究映射 / 定性判断",
    "players": "华卓精科；苏大维格 300331；凌聚科技；启尔机电",
    "leaders": "ASML / 精密运动供应商"
  },
  {
    "id": "p30",
    "group": "材料",
    "segment": "200/300mm 硅片 / SOI",
    "label": "硅片 / SOI",
    "gap": 2,
    "cn": "300mm 已商用；先进产品认证不同",
    "world": "信越 / SUMCO 高端全规格",
    "why": "晶体缺陷、金属杂质、平坦度、外延及先进客户认证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用；先进节点认证有差异",
    "evidence": "原研究映射 / 定性判断",
    "players": "沪硅产业 688126；奕斯伟材料；中环领先；立昂微 605358；有研硅 688432；中晶科技 003026",
    "leaders": "Shin-Etsu / SUMCO / GlobalWafers"
  },
  {
    "id": "p31",
    "group": "材料",
    "segment": "SiC / GaN 衬底与外延",
    "label": "SiC / GaN 衬底",
    "gap": 1,
    "cn": "SiC、GaN 商用及扩产",
    "world": "Wolfspeed / Coherent 等",
    "why": "高端大尺寸缺陷密度与良率；非硅逻辑路线。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入，区别于硅逻辑",
    "evidence": "原研究映射 / 定性判断",
    "players": "天岳先进 688234；天科合达；瀚天天成；东莞天域；英诺赛科 02577.HK；晶湛；聚能晶源",
    "leaders": "Wolfspeed / Coherent"
  },
  {
    "id": "p32",
    "group": "材料",
    "segment": "i-line / KrF / ArF / EUV 光刻胶",
    "label": "KrF / ArF 光刻胶",
    "gap": 2,
    "cn": "鼎龙公告部分高端胶批量订单；多款验证",
    "world": "JSR / TOK / Shin-Etsu 全谱系",
    "why": "先进关键层缺陷、CD 均匀性、配方与批次稳定；商用不等于全覆盖。",
    "sourceIds": [
      "ding",
      "baseline"
    ],
    "stage": "商用 / 导入",
    "evidence": "公司公告",
    "players": "彤程新材 603650（北京科华）；鼎龙股份 300054；南大光电 300346；上海新阳 300236；晶瑞电材 300655；徐州博康（华懋科技 603306 关联）；强力新材 300429",
    "leaders": "JSR / TOK"
  },
  {
    "id": "p33",
    "group": "材料",
    "segment": "i-line / KrF / ArF / EUV 光刻胶",
    "label": "EUV 光刻胶",
    "gap": 4,
    "cn": "科研与材料研发，量产认证未核实",
    "world": "JSR / TOK 等 EUV 商用材料",
    "why": "分辨率、线边粗糙度、灵敏度三者权衡及随机缺陷。",
    "sourceIds": [
      "triolo",
      "baseline"
    ],
    "stage": "研发",
    "evidence": "定性判断",
    "players": "国内科研院所及光刻材料企业（具体量产供货未知）",
    "leaders": "JSR / TOK"
  },
  {
    "id": "p34",
    "group": "材料",
    "segment": "掩模 / Blank / Pellicle / 写入",
    "label": "传统 / 先进 DUV 掩模",
    "gap": 2,
    "cn": "成熟掩模已商用；先进工艺导入",
    "world": "DNP / Toppan 高端掩模",
    "why": "复杂 OPC 图形、缺陷控制、坯料纯度、写入和检测。",
    "sourceIds": [
      "triolo",
      "baseline"
    ],
    "stage": "商用 / 导入",
    "evidence": "定性判断",
    "players": "清溢光电；路维光电；晶圆厂内部体系；菲利华（相关基材）",
    "leaders": "DNP / HOYA / IMS / LaserTec"
  },
  {
    "id": "p35",
    "group": "材料",
    "segment": "掩模 / Blank / Pellicle / 写入",
    "label": "EUV 掩模 / 写入检测",
    "gap": 4,
    "cn": "专项研发，关键量产设备与供应未证实",
    "world": "HOYA / IMS / NuFlare / Lasertec",
    "why": "无缺陷反射坯、相位缺陷检测、多束写入、pellicle 与修复。",
    "sourceIds": [
      "triolo",
      "baseline"
    ],
    "stage": "研发",
    "evidence": "定性判断",
    "players": "国内专项科研团队；具体商业主体待核实",
    "leaders": "DNP / HOYA / IMS / LaserTec"
  },
  {
    "id": "p36",
    "group": "材料",
    "segment": "电子特气 NF3 / WF6 / 刻蚀气 / 硅烷 / 稀有气体",
    "label": "电子特气",
    "gap": 1,
    "cn": "多种电子级气体已商用",
    "world": "Linde / Air Liquide 等",
    "why": "超高纯杂质与批次稳定、高端气种认证；需按气种判断。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用，具体纯度及认证不同",
    "evidence": "原研究映射 / 定性判断",
    "players": "中船特气 688146；华特气体 688268；金宏气体 688106；昊华科技 600378；南大光电 300346；硅烷科技；凯美特气 002549；杭氧股份 002430",
    "leaders": "Linde / Air Liquide"
  },
  {
    "id": "p37",
    "group": "材料",
    "segment": "ALD / CVD 前驱体",
    "label": "沉积前驱体",
    "gap": 2,
    "cn": "硅基、部分金属前驱体商用",
    "world": "Merck / Air Liquide 高端配方",
    "why": "新金属分子设计、杂质控制与先进 ALD 配方认证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入；先进金属前驱体待验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "雅克科技 002409；南大光电 300346；中船特气 688146",
    "leaders": "Merck / Air Liquide"
  },
  {
    "id": "p38",
    "group": "材料",
    "segment": "湿电子化学品 / TMAH / 电镀添加剂",
    "label": "湿电子化学品",
    "gap": 1,
    "cn": "多类高纯化学品量产",
    "world": "BASF / Stella 高等级产品",
    "why": "先进节点金属杂质、颗粒与长期稳定性。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用；先进纯度需认证",
    "evidence": "原研究映射 / 定性判断",
    "players": "兴福电子 688545；江化微 603078；晶瑞电材 300655；中巨芯 688549；格林达 603931；上海新阳 300236；艾森股份 688720；多氟多 002407",
    "leaders": "BASF / Stella"
  },
  {
    "id": "p39",
    "group": "材料",
    "segment": "CMP 抛光液 / 垫 / 磨料 / 清洗液",
    "label": "CMP 材料",
    "gap": 1,
    "cn": "安集抛光液、鼎龙抛光垫商业化",
    "world": "Entegris / Fujimi / DuPont",
    "why": "先进多材料选择比、刮伤与一致性；按工艺验证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入",
    "evidence": "原研究映射 / 定性判断",
    "players": "安集科技 688019；鼎龙股份 300054；国瓷材料 300285；上海新阳 300236",
    "leaders": "Entegris / Fujimi / DuPont"
  },
  {
    "id": "p40",
    "group": "材料",
    "segment": "高纯溅射靶材",
    "label": "高纯靶材",
    "gap": 1,
    "cn": "江丰等已规模供货",
    "world": "JX Advanced Metals 等",
    "why": "先进高纯金属杂质、晶粒与靶材寿命。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用；显示与晶圆收入不可混同",
    "evidence": "原研究映射 / 定性判断",
    "players": "江丰电子 300666；有研新材 600206；隆华科技 300263；东方钽业 000962",
    "leaders": "JX Advanced Metals"
  },
  {
    "id": "p41",
    "group": "基础原料/厂务",
    "segment": "高纯原料",
    "label": "高纯基础原料",
    "gap": null,
    "cn": "多类工业原料可供，电子级资格各异",
    "world": "各材料国际专业供应商",
    "why": "缺乏同材料、同纯度的统一口径；不以工业产能推断先进电子级水平。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "相关原料不等于电子级认证",
    "evidence": "原研究映射 / 定性判断",
    "players": "石英股份 603688；菲利华 300395；巨化股份 600160；三美股份 603379；多氟多 002407；东方钽业 000962；国瓷材料 300285；惠丰钻石；力量钻石 301071",
    "leaders": "专业材料供应商"
  },
  {
    "id": "p42",
    "group": "基础原料/厂务",
    "segment": "洁净室 / 超纯水 / 气体供应 / 过滤",
    "label": "厂务 / 洁净室",
    "gap": 1,
    "cn": "洁净厂房与介质系统商业化",
    "world": "Exyte 等国际工程体系",
    "why": "先进厂务整合、可靠性及运营成本应按项目比较。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用",
    "evidence": "原研究映射 / 定性判断",
    "players": "中电二公司；中电四公司；亚翔集成 603929；柏诚股份 601133；圣晖集成 603163；美埃科技 688376；正帆科技 688596；至纯科技 603690；金宏气体 688106；杭氧股份 002430；京仪装备 688652",
    "leaders": "Exyte / Kinetics"
  },
  {
    "id": "p43",
    "group": "基础原料/厂务",
    "segment": "MES / EAP / APC / SPC / YMS",
    "label": "MES / APC / YMS",
    "gap": 2,
    "cn": "国产局部工具已商用",
    "world": "Applied Materials / Siemens 等",
    "why": "跨设备数据、先进过程控制、缺陷预测与全厂集成。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入",
    "evidence": "原研究映射 / 定性判断",
    "players": "上扬软件；赛美特；中控技术 688777（相关业务）；广立微 301095",
    "leaders": "Applied Materials / Siemens"
  },
  {
    "id": "p44",
    "group": "先进封装",
    "segment": "OSAT / Chiplet / 2.5D / 3D",
    "label": "先进封装制造",
    "gap": 2,
    "cn": "OSAT 与部分 2.5D/3D 工艺商用",
    "world": "TSMC CoWoS / SoIC；ASE / Amkor",
    "why": "大型 HPC 多 die 互连、良率、基板和实际规模交付。",
    "sourceIds": [
      "tsmc",
      "baseline"
    ],
    "stage": "传统商用；高端 HPC 能力逐项目验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "长电科技 600584；通富微电 002156；华天科技 002185；甬矽电子 688362；晶方科技 603005；盛合晶微；华进半导体；颀中科技 688352",
    "leaders": "ASE / Amkor"
  },
  {
    "id": "p45",
    "group": "先进封装",
    "segment": "TSV 刻蚀/沉积/电镀/CMP",
    "label": "TSV 刻蚀 / 电镀 / CMP",
    "gap": 1,
    "cn": "相关工艺设备已有商用",
    "world": "Lam / AMAT / Ebara",
    "why": "HBM 专用尺寸与填充、翘曲、缺陷和堆叠客户认证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "相关工艺商用，不代表 HBM 客户认证",
    "evidence": "原研究映射 / 定性判断",
    "players": "中微公司 688012；北方华创 002371；拓荆科技 688072；盛美上海 688082；华海清科 688120",
    "leaders": "Lam / AMAT / Ebara"
  },
  {
    "id": "p46",
    "group": "先进封装",
    "segment": "减薄 / 临时键合 / W2W / D2W / TCB",
    "label": "减薄 / 临时键合",
    "gap": 2,
    "cn": "国产产品商用/导入",
    "world": "DISCO / EVG / SUSS",
    "why": "超薄晶圆完整性、翘曲、对准、解键合残留及良率。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用 / 导入",
    "evidence": "定性判断",
    "players": "华海清科；芯源微；华卓精科等",
    "leaders": "DISCO / EVG / Besi / Hanmi"
  },
  {
    "id": "p47",
    "group": "先进封装",
    "segment": "减薄 / 临时键合 / W2W / D2W / TCB",
    "label": "W2W 混合键合",
    "gap": 2,
    "cn": "拓荆披露混合键合等设备",
    "world": "EVG / AMAT / Besi",
    "why": "精度、界面颗粒、吞吐及量产良率；不能外推至 D2W。",
    "sourceIds": [
      "piotech",
      "baseline"
    ],
    "stage": "商用 / 导入",
    "evidence": "公司披露",
    "players": "拓荆科技；华卓精科等候选",
    "leaders": "DISCO / EVG / Besi / Hanmi"
  },
  {
    "id": "p48",
    "group": "先进封装",
    "segment": "减薄 / 临时键合 / W2W / D2W / TCB",
    "label": "D2W / TCB 堆叠",
    "gap": 3,
    "cn": "相关国产设备布局，先进 HBM 规模验证不足",
    "world": "Besi / ASMPT / Hanmi",
    "why": "高速贴装对准、热压控制、薄 die 处理与合格堆叠产量。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "导入 / 验证",
    "evidence": "定性判断",
    "players": "国内先进封装设备企业；快克智能、新益昌等相关布局",
    "leaders": "DISCO / EVG / Besi / Hanmi"
  },
  {
    "id": "p49",
    "group": "先进封装",
    "segment": "封装光刻 / 切割 / 模塑 / X-ray",
    "label": "封装光刻 / 切割 / 检测",
    "gap": 1,
    "cn": "多种封装设备商用",
    "world": "Canon / DISCO / TOWA / Nordson",
    "why": "先进封装高精度、薄晶圆破损、X-ray 检出率需分设备验证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入",
    "evidence": "原研究映射 / 定性判断",
    "players": "上海微电子；AMIES；芯源微 688037；大族激光 002008；光力科技 300480；德龙激光 688170；耐科装备 688419；日联科技 688531；中科飞测 688361",
    "leaders": "Canon / DISCO / TOWA / Nordson"
  },
  {
    "id": "p50",
    "group": "先进封装",
    "segment": "FC-BGA / BT / ABF / RDL",
    "label": "FC-BGA / RDL / BT",
    "gap": 2,
    "cn": "国产基板及 RDL 导入",
    "world": "Ibiden / Shinko 等高层大型基板",
    "why": "大尺寸、高层数、翘曲、良率与客户认证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用 / 导入",
    "evidence": "定性判断",
    "players": "深南电路；兴森科技；珠海越亚；广州广芯；芯爱科技；生益科技（相关材料）",
    "leaders": "Ibiden / Shinko / Ajinomoto"
  },
  {
    "id": "p51",
    "group": "先进封装",
    "segment": "FC-BGA / BT / ABF / RDL",
    "label": "ABF 类增层膜",
    "gap": 3,
    "cn": "国内研发及客户验证，先进规模供货待核实",
    "world": "Ajinomoto ABF 量产体系",
    "why": "低粗糙度、介电、热膨胀、可靠性与基板工艺兼容。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "研发 / 验证",
    "evidence": "定性判断",
    "players": "国内树脂/薄膜企业及基板厂研发体系；具体认证待核实",
    "leaders": "Ibiden / Shinko / Ajinomoto"
  },
  {
    "id": "p52",
    "group": "先进封装",
    "segment": "EMC / GMC / Underfill / NCF / DAF / PSPI",
    "label": "封装化学材料",
    "gap": 2,
    "cn": "多种 EMC、Underfill、PSPI 商用/导入",
    "world": "Resonac / Namics 等",
    "why": "HBM NCF、热机械应力、低离子污染、可靠性和量产认证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用/导入，HBM 专用材料待验证",
    "evidence": "原研究映射 / 定性判断",
    "players": "华海诚科 688535；德邦科技 688035；衡所华威；鼎龙股份 300054；上海新阳 300236；艾森股份 688720；康强电子 002119；中瓷电子 003031",
    "leaders": "Resonac / Namics"
  },
  {
    "id": "p53",
    "group": "测试",
    "segment": "ATE / DRAM / NAND / HPC / HBM / Handler / Prober",
    "label": "通用 ATE / 分选 / 探针台",
    "gap": 2,
    "cn": "国产模拟及部分数字测试设备商用",
    "world": "Advantest / Teradyne / TEL",
    "why": "高端数字并行度、信号完整性及测试成本。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "商用 / 导入",
    "evidence": "定性判断",
    "players": "长川科技 300604；华峰测控 688200；精智达 688627；金海通 603061；联动科技 301369；广立微 301095",
    "leaders": "Advantest / Teradyne / TEL"
  },
  {
    "id": "p54",
    "group": "测试",
    "segment": "ATE / DRAM / NAND / HPC / HBM / Handler / Prober",
    "label": "HBM / HPC 测试机",
    "gap": 3,
    "cn": "国产高端产品研发或导入",
    "world": "Advantest / Teradyne 高速测试平台",
    "why": "高速 I/O、并测、KGD、测试时间与客户认证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "导入 / 验证",
    "evidence": "定性判断",
    "players": "精智达；长川科技等候选",
    "leaders": "Advantest / Teradyne / TEL"
  },
  {
    "id": "p55",
    "group": "测试",
    "segment": "Probe Card / Socket / Load Board / 独立测试",
    "label": "探针卡 / 测试接口",
    "gap": 2,
    "cn": "垂直及 MEMS 探针卡等布局",
    "world": "FormFactor / Technoprobe",
    "why": "微间距、接触一致性、耐久性与 HBM 并测验证。",
    "sourceIds": [
      "baseline"
    ],
    "stage": "分路线验证，不等同 HBM 认证",
    "evidence": "原研究映射 / 定性判断",
    "players": "强一半导体；华兴源创 688001；利扬芯片 688135；伟测科技 688372；华岭股份；赛微电子 300456（MEMS 工艺）",
    "leaders": "FormFactor / Technoprobe"
  },
  {
    "id": "p56",
    "group": "EDA",
    "segment": "TCAD / SPICE / DFM / OPC / DFT / IP",
    "label": "EDA / 计算光刻",
    "gap": 3,
    "cn": "局部 SPICE、DFM、OPC 等工具",
    "world": "Synopsys / Cadence / Siemens 全流程",
    "why": "先进 PDK、签核、计算光刻及设计制造协同工具闭环。",
    "sourceIds": [
      "triolo",
      "baseline"
    ],
    "stage": "局部工具商用，先进全流程仍有缺口",
    "evidence": "原研究映射 / 定性判断",
    "players": "华大九天 301269；概伦电子 688206；广立微 301095；东方晶源；芯华章；合见工软；芯原股份 688521；灿芯股份 688691；海思",
    "leaders": "Synopsys / Cadence / Siemens"
  }
];
export const ecosystemNodes = [
  {
    "id": "policy",
    "lane": "政策 / 国资",
    "period": "2014–18",
    "name": "国家产业基金",
    "description": "大基金 2014 年成立；政策及资本支持，不是企业股权统一控制。",
    "role": "政策背景",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "id": "smee",
    "lane": "上海体系",
    "period": "2014–18",
    "name": "上海微电子 SMEE",
    "description": "传统光刻整机平台；近年重组及分工调整。位置表示产业发展时期，非成立时间。",
    "role": "传统平台",
    "sourceIds": [
      "triolo",
      "amies"
    ]
  },
  {
    "id": "huawei",
    "lane": "华为关联",
    "period": "2019–22",
    "name": "华为 / 哈勃",
    "description": "出口限制后强化国内设备、芯片和系统协同；关联投资不意味着全资控制。",
    "role": "需求 / 协同",
    "sourceIds": [
      "triolo",
      "ft"
    ]
  },
  {
    "id": "hisilicon",
    "lane": "华为关联",
    "period": "2019–22",
    "name": "海思",
    "description": "华为芯片设计体系；Kirin、昇腾等需求与制造协同。",
    "role": "设计",
    "sourceIds": [
      "triolo",
      "tech"
    ]
  },
  {
    "id": "shenzhen",
    "lane": "政策 / 国资",
    "period": "2019–22",
    "name": "深圳国资",
    "description": "新凯来、鹏芯微相关资本支持由文章报道；具体持股链待工商核实。",
    "role": "资本",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "id": "smic",
    "lane": "共享制造",
    "period": "2019–22",
    "name": "中芯国际",
    "description": "传统制造平台；为华为芯片代工，亦为国产设备验证场。",
    "role": "晶圆制造",
    "sourceIds": [
      "tech",
      "triolo"
    ]
  },
  {
    "id": "sic",
    "lane": "华为关联",
    "period": "2023–24",
    "name": "新凯来 SiCarrier",
    "description": "深圳国资背景设备平台，与华为有技术关联的报道；非已确认华为子公司。",
    "role": "设备平台",
    "sourceIds": [
      "triolo",
      "nikkei"
    ]
  },
  {
    "id": "pxw",
    "lane": "华为关联",
    "period": "2023–24",
    "name": "鹏芯微 PXW",
    "description": "华为关联制造及新凯来设备验证的报道；产能、股权、先进良率不透明。",
    "role": "制造 / 验证",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "id": "shanghai",
    "lane": "政策 / 国资",
    "period": "2023–24",
    "name": "上海国资",
    "description": "上海电气控股与上海国际信托相关主体为爱晟纳股东的媒体报道。",
    "role": "资本",
    "sourceIds": [
      "duv"
    ]
  },
  {
    "id": "aish",
    "lane": "交叉协作",
    "period": "2023–24",
    "name": "爱晟纳 Aishengna",
    "description": "2023-08 成立、注册资本70亿元（媒体转述工商）；2026-07 报道整合上海微电子与宇量昇团队并小批生产浸没式 DUV。非已证实 HVM。",
    "role": "整合 / 浸没 DUV",
    "sourceIds": [
      "duv"
    ]
  },
  {
    "id": "labs",
    "lane": "共享上游",
    "period": "2023–24",
    "name": "光机所 / 科研机构",
    "description": "长春光机所等具备光学研究；具体 EUV 项目分工未公开，不画成集团子公司。",
    "role": "科研 / 候选",
    "sourceIds": [
      "triolo",
      "euv"
    ]
  },
  {
    "id": "yul",
    "lane": "交叉协作",
    "period": "2025",
    "name": "宇量昇 Yuliangsheng",
    "description": "2025 原型测试报道；Triolo 2026-02 称新凯来与创科微各50%；上海微电子提供人员/技术支持的报道。",
    "role": "浸没 DUV 研发",
    "sourceIds": [
      "triolo",
      "nikkei",
      "duv",
      "ft"
    ]
  },
  {
    "id": "chuang",
    "lane": "上海体系",
    "period": "2025",
    "name": "创科微（上海）",
    "description": "Triolo 称为宇量昇 50% 股东；未在本次核查工商原件。",
    "role": "报道股东",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "id": "amies",
    "lane": "交叉协作",
    "period": "2025",
    "name": "AMIES",
    "description": "Triolo 称新凯来与 SMEE 各持50%；后道光刻、激光退火、封装等。500台步进机里程碑不是先进前道量产。",
    "role": "后道装备",
    "sourceIds": [
      "triolo",
      "amies"
    ]
  },
  {
    "id": "euv",
    "lane": "华为关联",
    "period": "2025",
    "name": "深圳 EUV 专项",
    "description": "2025-12 Reuters 报道原型，未生产可用芯片；项目组织与供应 BOM 不透明。",
    "role": "科研 / 原型",
    "sourceIds": [
      "euv",
      "triolo"
    ]
  },
  {
    "id": "parts",
    "lane": "共享上游",
    "period": "2025",
    "name": "光源 / 物镜 / 工件台",
    "description": "科益虹源、国望光学、国科精密、华卓精科、启尔机电等候选；供应关系不等于已进入先进整机。",
    "role": "子系统",
    "sourceIds": [
      "triolo",
      "ft",
      "baseline"
    ]
  },
  {
    "id": "memory",
    "lane": "共享制造",
    "period": "2025",
    "name": "长鑫 / 长江存储 / 华虹",
    "description": "存储及成熟制造工艺学习平台；具体设备供应合同须核实。",
    "role": "晶圆制造",
    "sourceIds": [
      "triolo",
      "duv"
    ]
  },
  {
    "id": "weiyao",
    "lane": "上海体系",
    "period": "2026",
    "name": "上海微耀",
    "description": "2026-01-07 SCMP 报道上海微电子将该制造子公司100%转予 AMIES（转让价2.285亿元）。",
    "role": "资产重组",
    "sourceIds": [
      "amies"
    ]
  },
  {
    "id": "duvramp",
    "lane": "交叉协作",
    "period": "2026",
    "name": "浸没式 DUV 小批阶段",
    "description": "2026-07 Reuters 报道爱晟纳组织生产；9月 FT 报道宇量昇测试与产量计划，两者口径不同，不相加；实际验收未确认。",
    "role": "报道 / 验证",
    "sourceIds": [
      "duv",
      "ft"
    ]
  },
  {
    "id": "system",
    "lane": "华为关联",
    "period": "2026",
    "name": "昇腾 / 鲲鹏系统",
    "description": "2026-09-17 华为发布昇腾960超节点等系统进展；不由此推断芯片工艺或国产设备份额。",
    "role": "应用牵引",
    "sourceIds": [
      "huawei"
    ]
  },
  {
    "id": "future",
    "lane": "交叉协作",
    "period": "2027+",
    "name": "规模量产目标",
    "description": "以持续良率、套刻、uptime、吞吐、复购作为验证，而非台数目标。",
    "role": "目标 / 情景",
    "sourceIds": [
      "duv",
      "ft"
    ]
  }
];
export const ecosystemEdges = [
  {
    "from": "policy",
    "to": "shenzhen",
    "type": "context",
    "note": "政策与地方产业资本背景",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "policy",
    "to": "shanghai",
    "type": "context",
    "note": "政策背景；非持股链",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "huawei",
    "to": "hisilicon",
    "type": "ownership",
    "note": "华为芯片设计体系",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "huawei",
    "to": "sic",
    "type": "reported",
    "note": "技术与人员协同报道；不认定股权",
    "sourceIds": [
      "triolo",
      "nikkei"
    ]
  },
  {
    "from": "shenzhen",
    "to": "sic",
    "type": "reportedOwnership",
    "note": "深圳国资控制/资本背景（Triolo）",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "shenzhen",
    "to": "pxw",
    "type": "reportedOwnership",
    "note": "深圳政府资金支持（非持股比例）",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "sic",
    "to": "pxw",
    "type": "reported",
    "note": "设备验证合作报道",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "hisilicon",
    "to": "smic",
    "type": "confirmed",
    "note": "Kirin N+3 代工产品拆解",
    "sourceIds": [
      "tech"
    ]
  },
  {
    "from": "huawei",
    "to": "euv",
    "type": "reported",
    "note": "参与专项的媒体报道",
    "sourceIds": [
      "euv"
    ]
  },
  {
    "from": "labs",
    "to": "euv",
    "type": "candidate",
    "note": "科研能力相关；项目分工未核实",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "sic",
    "to": "yul",
    "type": "reportedOwnership",
    "note": "Triolo 报道 50% 持股",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "chuang",
    "to": "yul",
    "type": "reportedOwnership",
    "note": "Triolo 报道 50% 持股",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "smee",
    "to": "yul",
    "type": "reported",
    "note": "人员与技术支持报道",
    "sourceIds": [
      "nikkei"
    ]
  },
  {
    "from": "sic",
    "to": "amies",
    "type": "reportedOwnership",
    "note": "Triolo 报道 50% 持股",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "smee",
    "to": "amies",
    "type": "reportedOwnership",
    "note": "Triolo 报道 50% 持股及后道业务分拆",
    "sourceIds": [
      "triolo"
    ]
  },
  {
    "from": "amies",
    "to": "weiyao",
    "type": "reportedOwnership",
    "note": "2026-01 报道收购 100% 股权",
    "sourceIds": [
      "amies"
    ]
  },
  {
    "from": "shanghai",
    "to": "aish",
    "type": "reportedOwnership",
    "note": "媒体转述两家上海国资股东",
    "sourceIds": [
      "duv"
    ]
  },
  {
    "from": "smee",
    "to": "aish",
    "type": "reported",
    "note": "团队整合报道，非股权转让",
    "sourceIds": [
      "duv"
    ]
  },
  {
    "from": "yul",
    "to": "aish",
    "type": "reported",
    "note": "团队整合报道；两实体仍需区分",
    "sourceIds": [
      "duv"
    ]
  },
  {
    "from": "yul",
    "to": "smic",
    "type": "reported",
    "note": "原型/设备验证报道",
    "sourceIds": [
      "triolo",
      "ft"
    ]
  },
  {
    "from": "aish",
    "to": "duvramp",
    "type": "reported",
    "note": "小批生产报道",
    "sourceIds": [
      "duv"
    ]
  },
  {
    "from": "yul",
    "to": "duvramp",
    "type": "reported",
    "note": "测试及产量目标报道（不与爱晟纳相加）",
    "sourceIds": [
      "ft"
    ]
  },
  {
    "from": "duvramp",
    "to": "memory",
    "type": "candidate",
    "note": "报道的潜在交付对象；验收未知",
    "sourceIds": [
      "duv"
    ]
  },
  {
    "from": "parts",
    "to": "yul",
    "type": "candidate",
    "note": "国产配套候选；非确认 BOM",
    "sourceIds": [
      "ft",
      "baseline"
    ]
  },
  {
    "from": "parts",
    "to": "smee",
    "type": "candidate",
    "note": "光刻子系统配套候选；非确认 BOM",
    "sourceIds": [
      "baseline"
    ]
  },
  {
    "from": "hisilicon",
    "to": "system",
    "type": "confirmed",
    "note": "芯片设计及系统应用协同",
    "sourceIds": [
      "huawei",
      "triolo"
    ]
  },
  {
    "from": "duvramp",
    "to": "future",
    "type": "candidate",
    "note": "未来规模量产条件；非既成事实",
    "sourceIds": [
      "duv",
      "ft"
    ]
  }
];
