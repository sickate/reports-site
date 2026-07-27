// Static UI copy — labels, headers, methodology prose. Layer B of the data contract:
// it changes when the PAGE changes, not when the market does.
//
// Everything that turns over weekly — the core call, the changelog, the research cards,
// the key metrics — lives in /data/global-lithium-market.json instead, so the weekly
// refresh edits data rather than source code. A stray character in a .js module
// white-screens the whole report; a stray character in the JSON degrades to one block
// saying it could not load.
//
// The `en` locale was removed here (239 lines) because nothing read it: `currentLang` has
// been the constant 'zh' since the toggle was dropped, and `localizeValue(..., 'en')`
// returns the raw CSV value without consulting this file. English strings that ARE still
// load-bearing live in data/company-research.js — the JSONL generator reads
// `en.domesticRows` / `en.globalRows` for aliases and notes. Do not "clean those up".

export const locales = {
  zh: {
    title: '全球锂资源项目地图与数据库（2026）',
    eyebrow: '2026 锂资源研究',
    heroIntro1:
      '本页将全球锂资源按三个<b>互相独立</b>的维度统一到同一套投研口径：<b>生命周期</b>（在产 / 建设 / 开发 / 停摆 / 资源阶段）、<b>记录单元</b>（单体 / 集群）、<b>产能动作</b>（扩产 / 爬坡 / 稳产）。三者拆开是因为挤在一个字段里时，六个在产项目会因为名字里带「集群」或「扩建」而被误判为不在产。容量优先使用 <b>kt LCE/年</b>；硬岩项目以公开的精矿吨数按近似 LCE 系数折算；盐湖项目优先使用公司披露的碳酸锂/氢氧化锂/氯化锂名义产能。',
    heroIntro2:
      '地图使用 <b>Leaflet + OpenStreetMap</b>。圆点大小按 <b>当前或规划产能的较大值</b> 缩放，虚线代表典型物流/出口路线。对中国分散云母矿、玻利维亚巨型盐湖等披露不统一区域，使用 <b>项目群/盐湖群</b> 纳入，以保证覆盖面和供给曲线可比性。',
    badgeProfessional: '适用于专业投研',
    badgeFilter: '地图可筛选 / 搜索 / 排序',
    resourceCsv: '<strong>CSV</strong> 项目数据库',
    resourceMd: '<strong>MD</strong> 核心结论',
    stats: {
      project: '样本数',
      country: '国家数',
      operating: '在产样本（含爬坡）',
      currentCapacity: '当前名义产能合计',
      plannedCapacity: '规划/设计产能合计',
      pipeline: '建设/开发样本',
      unit: 'kt LCE/年',
    },
    priceCallKicker: '核心判断',
    findingsKicker: '分析框架',
    findings: [
      '<strong>供给曲线高度集中：</strong>边际价格更多取决于少数低成本盐湖与硬岩巨头能否按计划扩产、爬坡，而不是“资源够不够”。',
      '<strong>第一梯队资产集中：</strong>低成本锂资产仍以智利 Salar de Atacama、澳洲 Greenbushes / Pilbara / Wodgina / Mt Holland，以及阿根廷部分成熟盐湖为核心。',
      '<strong>未来 3 到 5 年看兑现率：</strong>南美盐湖关注 DLE 与水权，澳非硬岩关注回收率和扩产纪律，中国云母关注环保、许可与成本曲线脆弱性。',
      '<strong>真正稀缺的是可兑现的低成本吨位：</strong>资源体量大不等于高估值，能审计、能融资、能准时交付的项目才更稀缺。',
    ],
    riskKicker: '最需跟踪的五类扰动',
    risks: [
      'DLE 商业化爬坡能否真正兑现',
      '低价周期下企业扩产纪律是否收缩',
      '资源民族主义与本地加工要求',
      '环评、水权与社区许可风险',
      '运输走廊与出口港口瓶颈',
    ],
    changelogKicker: '更新时间线',
    changelogHint: '展开 / 收起',
    changelogLatestPrefix: '最近更新',
    changelogPrevPrefix: '上次更新',
    changelogHeaders: ['更新日期', '数据截止', '核心变化'],
    changelogDiffTitle: '本次 vs 上次（精选关键项）',
    changelogDiffHeaders: ['指标', '上次', '本次', '变化'],
    updatesKicker: '最新研报更新',
    searchPlaceholder: '搜索项目 / 国家 / 上市公司 / 风险关键词…',
    allStatuses: '全部状态',
    allCountries: '全部国家',
    allStructures: '单体 + 集群',
    sortOptions: {
      capacity_desc: '按容量（高→低）',
      capacity_asc: '按容量（低→高）',
      name_asc: '按名称（A→Z）',
      country_asc: '按国家',
    },
    legend: {
      Operating: '在产',
      'Ramp-up': '爬坡',
      Construction: '建设中',
      Development: '开发 / 待开工',
      'On hold / stalled': '停摆 / 政治性卡点',
      'Resource stage': '资源阶段',
    },
    loading: '正在从项目仓库加载锂资源数据库…',
    marketUnavailable: '行情与判断数据（/data/global-lithium-market.json）加载失败，本区块暂不可用。'
      + '页面其余部分不受影响——宁可显式说明缺失，也不呈现一个看起来完整、实则少了核心判断的版面。',
    tableTitle: '项目数据库',
    // {updateMarker} is substituted at render time from core/version.js. Hard-coding the
    // date here is how it silently drifted out of step with the rows it describes.
    tableSubtitle: '优先展示容量、储量/资源、成本、运输路线与扰动因素，适合快速做供给曲线和兑现率筛查。数据更新时间 {updateMarker} · 高亮行为本次更新。',
    tableScrollHint: '← 左右滑动查看更多列。小屏下已隐藏「地址 / 运输出口路线 / 数据来源摘要」三列（仍可被搜索命中），横屏或桌面端可看到完整 14 列。',
    tableHeaders: [
      '项目',
      '国家',
      '所属上市公司',
      '状态',
      '类型',
      '储量/资源',
      '品位',
      '当前产能',
      '规划产能',
      '成本',
      '地址',
      '运输/出口路线',
      '产能扰动因素',
      '数据来源摘要',
    ],
    footnote:
      '<b>方法说明：</b><br />1) 容量口径优先使用项目直接披露的碳酸锂 / 氢氧化锂 / 氯化锂或精矿产能；<br />2) 硬岩项目在需要横向比较时采用近似换算（SC6 × ~0.1484 ≈ LCE）；<br />3) 盐湖项目优先列示资源/储量中的 LCE 或金属锂 / 卤水浓度；<br />4) “成本”优先使用公司披露的现金成本 / FOB 成本；若缺失，则保留相对成本带描述，不强行伪精确；<br />5) 路线为典型物流 / 出口路径，用于投研定位基础设施和地缘风险，并不代表唯一商业流向；<br />6) 对中国与玻利维亚等项目披露碎片化地区，采用“项目群 / 盐湖群”处理，以提高覆盖率与行业解释力。<br /><br /><b>使用建议：</b>先看地图识别“容量大、成本低、风险低”的第一梯队，再看表格里的“扰动因素”，因为锂行业真正的价格弹性来自 <i>供给兑现率</i>，不是地质资源是否存在。',
    popupLabels: {
      country: '国家',
      status: '状态',
      type: '类型',
      reserve: '储量/资源',
      grade: '品位',
      current: '当前产能',
      planned: '规划产能',
      cost: '成本',
      address: '地址',
      route: '运输路线',
      risks: '扰动因素',
      source: '来源摘要',
    },
    resultSummary: (visible, total) => `显示 ${visible} / ${total} 个项目`,
    emptyState: '没有匹配的项目，请调整筛选条件。',
    errorPrefix: '数据库加载失败：',
  },
};
