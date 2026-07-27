// All UI copy. The `en` block is retained even though the language toggle was removed:
// English project/company names still feed the bilingual search haystack.

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
    priceCall: {
      directionLabel: '中性偏多',
      tone: 'neutral-bull',
      target: '¥14–16 万/吨（旺季看 15–18 万）',
      horizon: '3–6 个月',
      confidence: 60,
      asOf: '2026-07-24',
      rationale: [
        '价格已跌逾 70% 至约 14.5 万元、逼近成本支撑，多机构称"见底迹象明显"；',
        '库存持续去化（8.69 万吨、年内 -2.3 万吨），周转天数偏低，供需紧平衡；',
        '8 月排产 304/317GWh 超预期、旺季临近，需求上修对冲供给放量；',
        '但上半年供给 +40.9%、枧下窝/藏格/津巴新增量陆续到位，压制上行斜率。',
      ],
      previous: { date: '2026-04-15', directionLabel: '看涨', confidence: 70, target: '¥16 万+（柴油挤压推动上行）' },
      delta: '较上次下调：4 月"澳洲柴油挤压→供给收缩→上行"未兑现，澳矿已集中到港、供给反而放量；但去库 + 旺季 + 见底支撑，维持中性偏多而非转空。',
    },
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
    changelog: [
      {
        date: '2026-07-24',
        prevDate: '2026-04-15',
        asOf: '行情 07-23/24 · 研报 5–7 月',
        diffs: [
          { label: '碳酸锂基准(万元/吨)', old: '~16', now: '14.5–15', change: '-9%' },
          { label: '中矿资源 26E PE', old: '20.8x', now: '13.1x', change: '-37%' },
          { label: '盐湖股份 26E PE', old: '16.5x', now: '12.3x', change: '-25%' },
          { label: '雅化集团 26E 净利(亿)', old: '14.2', now: '30.3', change: '+114%' },
          { label: '锂价判断', old: '看涨 · 70%', now: '中性偏多 · 60%', change: '下调' },
        ],
        items: [
          '基准锂价 16 万 → 14.5–15 万元/吨；研报更新区新增两条（柴油牛论证伪 + 见底信号；需求上修 + 宜春环保 / 津巴 2027 / 消费税）。',
          '10 只 A 股 + ALB / SQM 市值 / 现价刷新，26E / 27E 远期 PE 按当日市值 mark-to-market；逐个公司核对研报后仅雅化上修全年净利（东吴 7/7：26-28E 30.3 / 35.8 / 39.2 亿），盐湖 / 藏格附 26H1 预告，其余沿用 4 月一致预期。',
          '盐湖“五矿入主”落地（开源 12X）、藏格钾锂铜三线、中矿检修；数据库更新枧下窝复产 + 宜春环保、华友 Arcadia 硫酸锂厂投产、津巴 2027 禁令。',
        ],
      },
    ],
    updatesKicker: '最新研报更新',
    updatesTitle: '从柴油牛论到再平衡：2026 年年中的最新判断',
    updatesSubtitle: '前两条为 2026-07-24 基于 Caspian 行情 / 研报与公开信息的现状刷新；其后为 4 月以来的供给扰动、澳洲柴油、需求上修、库存与权益弹性判断脉络。（更新于 2026-07-24）',
    // 与 researchUpdates 同序（最新在前）：tone 决定颜色，impact/horizon 为显示文案。
    researchUpdateMeta: [
      { impact: '中性', tone: 'neutral', horizon: '短期' },
      { impact: '利多', tone: 'bull', horizon: '短期' },
      { impact: '利多', tone: 'bull', horizon: '短期' },
      { impact: '利多', tone: 'bull', horizon: '短期' },
      { impact: '利多', tone: 'bull', horizon: '短期' },
      { impact: '利多', tone: 'bull', horizon: '短期' },
      { impact: '利多', tone: 'bull', horizon: '长期' },
      { impact: '利多', tone: 'bull', horizon: '长期' },
    ],
    researchUpdates: [
      {
        title: '2026-07 现状检验：柴油牛论未兑现，锂价回落但见底信号增强',
        body: '4 月围绕澳洲柴油短缺的“供给收缩→涨价”逻辑并未兑现：进入 7 月澳矿集中到港、柴油危机缓解，价格反而在弱预期下回落。但去库延续、成本支撑与需求上修，使多数机构判断当前更接近周期底部而非趋势下行。',
        bullets: [
          '价格：电池级碳酸锂现货约 14.65 万元/吨（SMM，7/23），期货主力 LC2609 约 14.5 万元，工业级基准约 14.0 万元；较 4 月约 16 万元基准回落，距本轮高点已跌逾 70%。',
          '供给增量兑现：宁德时代枧下窝锂云母矿 6 月 29 日获安全生产许可、拟四季度复产（2026 年增量预计仅 2–4 万吨），藏格麻米措 5 万吨项目预计下半年投产，津巴布韦矿石 8 月起密集到港。',
          '供给其实在放量：上半年国内碳酸锂产量同比约 +40.9%；锂辉石上半年到港约 411.9 万吨（+28%）、锂盐进口 19.41 万吨（+64%），阿根廷盐湖 +102%、智利 +48%。',
          '机构判断：多数把价格中枢锚定在 13–15 万元；东吴等预计 9 月旺季供给缺口扩大、价格有望上修至 15–18 万元，开源等直言“见底迹象明显”。'
        ],
        note: '结论从 4 月的“供给兑现率弱→易涨”，转为“供给已放量，但需求上修 + 去库 + 成本支撑→紧平衡、15 万元附近有支撑”。'
      },
      {
        title: '供需再平衡：需求排产超预期，新扰动与消费税同时落地',
        body: '需求端 8 月排产超月初预期，储能出口与动力电池共振；供给端新增宜春环保核查与津巴布韦 2027 年禁令确认两重扰动，叠加锂电消费税落地“利空出尽”。',
        bullets: [
          '需求上修：8 月中国电池排产约 304GWh、全球约 317GWh，环比 +7.4%/+7.1%，超出月初 3–5% 的预期；机构预计 2026 年全球锂电需求增长 35%+、2027 年 25%+。',
          '新扰动一——宜春环保：省级生态环境工作组进驻宜春，专项核查锂云母尾矿与渗滤液，多数中小选矿厂库容临近红线，大概率阶段性降负荷整改，云母复产整体慢于市场预期。',
          '新扰动二——津巴布韦：锂原矿出口禁令确认 2027 年 1 月按期执行、不予延期；华友 Arcadia 硫酸锂厂已投产（非洲首批硫酸锂出口，年产能 5 万吨），中矿 Bikita、雅化 Kamativi 硫酸锂厂仍在建。',
          '政策：锂电池消费税确认自 2026-09-01 起征 2%、2027-09-01 起 4%（钠电/固态/燃料电池与自用及出口电池豁免），测算影响约相当于碳酸锂 +1.2–2.4 万元/吨，被解读为利空出尽、利好龙头集中。',
          '库存：总库存 8.69 万吨（7/23，环比 -3.0%，年内去库约 2.3 万吨），周转天数偏低，安全垫仍薄。'
        ],
        note: '供需两端同时收到新信息：需求超预期 + 云母/津巴新扰动 + 消费税落地，二季度到旺季前的紧平衡格局并未打破。'
      },
      {
        title: '春节后，高弹性供给增量持续低于预期',
        body: '今年原本被市场寄予增量预期的区域，春节后几乎都出现了事件性扰动，供给兑现率再次弱于年初乐观判断。',
        bullets: [
          '津巴布韦：2 月底禁止锂精矿出口，随后提出 2027 年 1 月前建设硫酸锂工厂、出口配额和 10% 出口税等条件。最新半年一批配额已较清晰，华友、中矿、雅化预计各约 20 万吨，盛新约 15 万吨；拥有硫酸锂工厂的企业受影响更小，但下半年和明年的产量不确定性仍在。',
          '江西：锂云母矿复产慢于年初预期，且 4 家锂矿进入采矿权收益评估、换证和重新申请安许流程，5-6 月可能出现 1 到 3 个月主动停产，二季度存在减量风险。',
          '尼日利亚：本被视为弹性供给来源，但中国驻尼使领馆已两次提示恐袭与绑架风险，安全局势将约束新增产量释放。',
          '澳洲：海峡封锁影响燃油补给，柴油和汽油库存偏紧，资源生产与运输面临压力；Greenbushes 还叠加税务调查。'
        ],
        note: '结论仍然清晰：市场容易高估锂供给，实际产量增长常常低于厂商最初指引。'
      },
      {
        title: '今天的核心变量，是澳洲柴油紧张开始传导',
        body: '最新反馈显示，不同矿山拿油难度已经分化，部分矿山依赖长协暂未受冲击，但也有小矿已经开始停产，柴油约束正从传闻走向实际约束。',
        bullets: [
          '2026 年澳洲锂矿约占全球供给 23%，若柴油问题扩散，将显著扰动全球供给。',
          '柴油主要用于采矿和矿卡运输，选矿多接电网，因此先受影响的是开采和运输环节。',
          '大型矿山通常有长期柴油保障，短期不会立即断供；但政府若启动储备释放与配额分配，优先级排序将成为关键变量。',
          '与铁矿相比，锂矿对高价柴油的承受能力更强，但若冲突持续到 5 月中旬，柴油约束仍可能开始影响锂矿生产。'
        ],
        note: '短期它未必立刻催化价格，但从 5 月开始，澳矿柴油供应已是必须紧盯的供给因子。'
      },
      {
        title: '进一步催化来自“澳矿收缩兑现 + 新能源车需求上修”',
        body: '市场下一阶段的重要变量，是澳洲柴油问题从中小矿向锂矿端显性化，以及全球新能源车销量在高油价环境下继续超预期。',
        bullets: [
          '西澳柴油存在断供风险，小矿最短 10 天内就可能出问题，政府也在讨论柴油配额。若矿山运输在未来 2 周受限，澳矿供给收缩逻辑就会快速兑现。',
          '需求端的重点应重新落到全球新能源车销量。高油价会持续刺激消费者转向新能源车，而 4 月排产和 5 月展望均沿着历史新高推进。',
          '储能需求方向明确，动力电池也逐步走出 1-2 月购置税退坡冲击，3 月起新车发布和销量环比明显改善。',
          '市场过去担心锂价上到 18-20 万元/吨后储能需求会“算不过来”，但近期反内卷会议提升了下游价格传导预期。'
        ],
        note: '长期看，资源品价格仍由最上游产量和最下游技术迭代带来的需求共同决定，而这两端当前都没有转弱。'
      },
      {
        title: '短期矛盾在库存极低的背景下进一步放大',
        body: '自去年 9 月以来行业大方向仍是去库，只是节奏阶段性受南美进口影响。当前显性库存已回到 10 万吨级别，绝对周转天数偏低。',
        bullets: [
          '行业库存周转天数已不足 20 天，下游周转天数甚至不足 10 天，库存安全垫极薄。',
          '上游经历套保和涨价后，对价格信心明显恢复，挺价成为更一致的选择；下游则仍坚持“不买就会更便宜”，导致拿货节奏和排产出现错配。',
          '按照最新 5、6 月排产，全年需求增速大概率在 30% 以上，总需求体量约 210 万吨，且仍有超预期空间。',
          '供给侧受影响的云母矿约 12-15 万吨，津巴事件约 1-2 万吨，尼日利亚与澳洲扰动也在边际收缩供给，合计减量预估约 15 万吨。'
        ],
        note: '在这个节奏下，二季度很可能就是全年供需最紧的时候。'
      },
      {
        title: '顺价正在成为中长期主线',
        body: '无论是全球能源体系重构下的新能源叙事，还是短期抢出口、储能新规和价格回归价值的逻辑，都在推动产业链重新接受顺价传导。',
        bullets: [
          '市场过去的核心担忧是“传导慢”，但慢并不等于不会传导。',
          '当前主力规格储能电芯价格已回到 0.4 元 / Wh 以上，说明部分价格压力已经开始往下游传递。',
          '产业链若继续朝着“全链条通胀”演化，锂价回归资源价值将是更自然的中长期结果。'
        ],
        note: '换句话说，价格上限不应只由短期悲观的 IR 模型来决定。'
      },
      {
        title: '权益端同时受益于锂价弹性与新能源价值重塑',
        body: '在当前约 16 万元锂价附近，行业 2025 年平均估值仍不足 16x，2026 年在 10x 出头，权益端仍具备价格和估值双击空间。',
        bullets: [
          '短期价格正处在上下游博弈最极致的时点，只要回归基本面，锂价仍有明显上修空间。',
          '宜春矿权益金陆续缴纳、后续换证停产，是国内供给侧的潜在催化。',
          '市场当前主要站在国内定价视角，不排除未来美国重新争取锂定价权、与智利谈判重启，外盘带动内盘价格也是一条重要暗线。'
        ],
        note: '本质上，当前权益端隐含着一个与锂价和全球新能源定价体系重估相关的看涨期权。'
      }
    ],
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
    tableTitle: '项目数据库',
    tableSubtitle: '优先展示容量、储量/资源、成本、运输路线与扰动因素，适合快速做供给曲线和兑现率筛查。数据更新时间 2026-07-24 · 高亮行为本次更新。',
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
  en: {
    title: 'Global Lithium Projects Map & Database (2026)',
    eyebrow: 'Lithium Research 2026',
    heroIntro1:
      'This page organizes global lithium supply along three <b>independent</b> axes: <b>lifecycle</b> (operating / construction / development / on hold / resource stage), <b>record structure</b> (single asset / cluster) and <b>capacity activity</b> (expanding / ramping / steady). Capacity is normalized to <b>kt LCE per year</b> whenever possible; hard-rock projects use approximate concentrate-to-LCE conversion when needed, while brine assets prioritize disclosed carbonate / hydroxide / chloride nameplate capacity.',
    heroIntro2:
      'The map runs on <b>Leaflet + OpenStreetMap</b>. Marker size scales with the <b>larger of current or planned capacity</b>, and dashed lines indicate representative logistics or export routes. Fragmented disclosure areas such as China lepidolite districts or Bolivia salars are grouped as <b>project clusters</b> so the coverage remains comparable for supply-curve analysis.',
    badgeProfessional: 'Built for professional research',
    badgeFilter: 'Map supports filter / search / sort',
    resourceCsv: '<strong>CSV</strong> Project database',
    resourceMd: '<strong>MD</strong> Key findings',
    stats: {
      project: 'Projects / clusters',
      country: 'Countries',
      operating: 'Operating assets',
      currentCapacity: 'Current nameplate capacity',
      plannedCapacity: 'Planned / design capacity',
      pipeline: 'Construction / development assets',
      unit: 'kt LCE / year',
    },
    priceCallKicker: 'Core Call',
    priceCall: {
      directionLabel: 'Moderately bullish',
      tone: 'neutral-bull',
      target: 'RMB 145–160k/t (peak season 150–180k)',
      horizon: '3–6 months',
      confidence: 60,
      asOf: '2026-07-24',
      rationale: [
        'Price is >70% off the peak at ~RMB 145k, near cost support; desks call the bottom "clearly visible";',
        'Continued destocking (86.9kt, -23kt YTD) with low turnover days keeps the balance tight;',
        'August schedules 304/317 GWh beat and peak season is near, offsetting supply ramps;',
        'but H1 supply +40.9% and Jianxiawo / Zangge / Zimbabwe additions cap the upside slope.',
      ],
      previous: { date: '2026-04-15', directionLabel: 'Bullish', confidence: 70, target: 'RMB 160k+ (diesel-squeeze driven)' },
      delta: 'Downgraded: April’s "Australian diesel squeeze → supply contraction → rally" did not play out (ore arrived in bulk, supply ramped); but destocking + peak season + a visible bottom keep it moderately bullish rather than bearish.',
    },
    findingsKicker: 'Analysis Framework',
    findings: [
      '<strong>The supply curve is highly concentrated:</strong> marginal pricing depends less on whether the world has enough lithium in the ground and more on whether a small group of low-cost brine and hard-rock leaders actually expand on schedule.',
      '<strong>Tier-one assets remain concentrated:</strong> the low-cost core still centers on Salar de Atacama in Chile, Greenbushes / Pilbara / Wodgina / Mt Holland in Australia, and a handful of mature Argentine brine operations.',
      '<strong>The next 3 to 5 years are about delivery, not discovery:</strong> South American brines hinge on DLE, water rights, communities and altitude logistics; Australian and African hard-rock projects hinge on recovery, stripping, discipline and infrastructure; Chinese mica remains highly sensitive to permits, enforcement and price levels.',
      '<strong>What matters is financeable and auditable low-cost tonnage:</strong> giant resources do not automatically deserve premium valuation if the project cannot be funded, permitted and delivered on time.',
    ],
    riskKicker: 'Five Disruptors To Track',
    risks: [
      'Whether commercial DLE ramp-up is real',
      'Whether producers restrain expansions in a low-price cycle',
      'Resource nationalism and local processing rules',
      'Environmental permits, water rights and community approvals',
      'Transport corridors and export-port bottlenecks',
    ],
    changelogKicker: 'Update Log',
    changelogHint: 'expand / collapse',
    changelogLatestPrefix: 'Last updated',
    changelogPrevPrefix: 'Previous',
    changelogHeaders: ['Date', 'Data as of', 'Core changes'],
    changelogDiffTitle: 'This vs previous (selected)',
    changelogDiffHeaders: ['Metric', 'Previous', 'Now', 'Change'],
    changelog: [
      {
        date: '2026-07-24',
        prevDate: '2026-04-15',
        asOf: 'Quotes Jul 23/24 · research May–Jul',
        diffs: [
          { label: 'Carbonate base (RMB k/t)', old: '~160', now: '145–150', change: '-9%' },
          { label: 'Sinomine 26E P/E', old: '20.8x', now: '13.1x', change: '-37%' },
          { label: 'Salt Lake 26E P/E', old: '16.5x', now: '12.3x', change: '-25%' },
          { label: 'Yahua 26E NPAT (RMB bn)', old: '1.42', now: '3.03', change: '+114%' },
          { label: 'Lithium call', old: 'Bullish · 70%', now: 'Mod. bullish · 60%', change: 'Downgraded' },
        ],
        items: [
          'Base lithium price 160k → 145–150k RMB/t; two new notes added to the research section (diesel bull case disproven + bottoming; demand upgrade + Yichun / Zimbabwe-2027 / consumption tax).',
          'Market caps / spot refreshed for 10 A-shares + ALB / SQM; 26E / 27E forward P/E marked to that day’s cap; after a per-company research check only Yahua’s full-year estimate was revised up (Soochow Jul 7: 26-28E RMB 3.03 / 3.58 / 3.92bn), Salt Lake / Zangge carry 1H26 preliminaries, the rest keep April consensus.',
          'Salt Lake “Minmetals in control” (Kaiyuan 12x), Zangge potash-lithium-copper, Sinomine maintenance; DB updates: Jianxiawo restart + Yichun audit, Huayou Arcadia LiSO4 plant online, Zimbabwe 2027 ban.',
        ],
      },
    ],
    updatesKicker: 'Research Update',
    updatesTitle: 'From The Diesel Bull Case To Rebalancing: The Mid-2026 View',
    updatesSubtitle: 'The first two notes are a 2026-07-24 refresh built from Caspian quotes / research and public data; the rest trace the April-onward arc of supply disruptions, Australian diesel, demand upgrades, inventory and equity leverage. (Updated 2026-07-24)',
    // Index-aligned with researchUpdates (newest first): tone drives color, impact/horizon are labels.
    researchUpdateMeta: [
      { impact: 'Neutral', tone: 'neutral', horizon: 'Short-term' },
      { impact: 'Bullish', tone: 'bull', horizon: 'Short-term' },
      { impact: 'Bullish', tone: 'bull', horizon: 'Short-term' },
      { impact: 'Bullish', tone: 'bull', horizon: 'Short-term' },
      { impact: 'Bullish', tone: 'bull', horizon: 'Short-term' },
      { impact: 'Bullish', tone: 'bull', horizon: 'Short-term' },
      { impact: 'Bullish', tone: 'bull', horizon: 'Long-term' },
      { impact: 'Bullish', tone: 'bull', horizon: 'Long-term' },
    ],
    researchUpdates: [
      {
        title: 'July 2026 reality check: the diesel bull case did not play out, but the price looks closer to a bottom',
        body: 'The April thesis — Australian diesel shortage to supply contraction to higher prices — did not materialize. By July, Australian ore was arriving in bulk and the fuel crisis had eased, yet prices fell on weak sentiment. Continued destocking, cost support and demand upgrades still lead most desks to see a cycle bottom rather than a downtrend.',
        bullets: [
          'Price: battery-grade carbonate spot ~RMB 146.5k/t (SMM, Jul 23), front futures LC2609 ~RMB 145k, industrial-grade ~RMB 140k — down from the ~RMB 160k April base and more than 70% off the cycle peak.',
          'Supply additions are landing: CATL’s Jianxiawo lepidolite mine got its safety-production licence on Jun 29 and targets a Q4 restart (2026 increment estimated at only 20–40 kt), Zangge’s 50 ktpa Mamicuo project is due in 2H, and Zimbabwean ore arrives densely from August.',
          'Supply is in fact ramping: H1 China carbonate output rose ~40.9% YoY; H1 spodumene to-port ~4.12 Mt (+28%) and lithium-salt imports 194 kt (+64%), with Argentine brine +102% and Chile +48%.',
          'Desk view: most anchor the price center at RMB 130–150k; Soochow and others expect the September peak season to widen the deficit and lift prices to RMB 150–180k, while Kaiyuan calls the bottom “clearly visible.”'
        ],
        note: 'The framing shifts from April’s “weak delivery, easy to rally” to “supply has ramped, but demand upgrades + destocking + cost support keep a tight balance with support near RMB 150k.”'
      },
      {
        title: 'Rebalancing: demand schedules beat, while fresh disruptions and a battery consumption tax land together',
        body: 'August battery schedules beat early-month expectations as storage exports and EV batteries move together, while the supply side absorbs two fresh shocks — a Yichun environmental audit and confirmation of Zimbabwe’s 2027 ban — alongside a battery consumption tax read as bad news already priced in.',
        bullets: [
          'Demand upgrade: August battery schedules ~304 GWh China / ~317 GWh global, +7.4%/+7.1% MoM, above the 3–5% expected at month start; 2026 global lithium-battery demand is seen +35%, 2027 +25%.',
          'New shock 1 — Yichun: a provincial environmental team entered Yichun to audit lepidolite tailings and leachate; most small concentrators are near capacity limits and likely to cut run-rates, and mica restarts are lagging.',
          'New shock 2 — Zimbabwe: the raw-ore export ban is confirmed for January 2027 with no extension; Huayou’s Arcadia lithium-sulfate plant is online (Africa’s first LiSO4 exports, 50 ktpa), while Sinomine’s Bikita and Yahua’s Kamativi plants are still under construction.',
          'Policy: a lithium-battery consumption tax is confirmed at 2% from 2026-09-01 and 4% from 2027-09-01 (sodium / solid-state / fuel-cell and self-use & export batteries exempt), estimated at roughly RMB 12–24k/t of carbonate and read as bad-news-priced-in and favorable to leaders.',
          'Inventory: total 86.9 kt (Jul 23, -3.0% w/w, ~23 kt destocked YTD), with low turnover days and still-thin buffers.'
        ],
        note: 'Both sides received new information at once — demand beat + mica / Zimbabwe shocks + the consumption tax — and the tight balance from Q2 into peak season has not broken.'
      },
      {
        title: 'Since the Lunar New Year, high-elasticity supply growth has kept disappointing',
        body: 'Almost every region that was expected to deliver incremental lithium supply this year has suffered some form of event-driven disruption, reinforcing the view that the market overestimates supply delivery.',
        bullets: [
          'Zimbabwe: lithium concentrate exports were banned in late February and have still not fully normalized. The government later tied exports to conditions such as lithium sulfate plant construction by January 2027, export quotas and a 10% export tax. The latest semiannual quotas now look clearer: Huayou, Sinomine and Yahua are each expected to receive roughly 200 kt of concentrate quota, while Chengxin is closer to 150 kt. Companies that already own lithium sulfate capacity are less exposed, but output uncertainty for 2H and 2027 remains high.',
          'Jiangxi: lepidolite mine restarts have lagged early-year expectations. In parallel, four mines are going through mining-right valuation, license renewal and renewed safety approvals, which could lead to 1-3 months of proactive shutdowns in May or June.',
          'Nigeria: once viewed as a flexible swing source, but renewed terrorist and kidnapping warnings from Chinese diplomatic missions suggest security risk will constrain expansion.',
          'Australia: fuel shortages linked to shipping disruptions are beginning to pressure mining logistics, while Greenbushes also faces a tax investigation.'
        ],
        note: 'The core conclusion is unchanged: the market repeatedly overestimates supply, while real production tends to undershoot optimistic corporate guidance.'
      },
      {
        title: 'The key near-term variable is Australia’s diesel shortage starting to matter',
        body: 'Recent channel checks suggest fuel stress is no longer theoretical. Some mines remain protected by long-term contracts, but smaller operations have already started to feel the pressure.',
        bullets: [
          'Australia is expected to account for about 23% of global lithium supply in 2026, so even a partial disruption can matter for the global balance.',
          'Diesel is mainly used in mining and haulage, while concentrators usually rely on grid power, meaning the first stress point is extraction and transportation.',
          'Large mines still have stronger fuel protection and the government may release strategic diesel reserves, but allocation rules will become critical.',
          'Compared with iron ore, lithium mines can economically tolerate higher diesel prices, yet a disruption lasting into mid-May could still start to cap output.'
        ],
        note: 'This may not trigger an immediate price spike, but from May onward Australian diesel supply is now a genuine supply-side variable for investors.'
      },
      {
        title: 'Further upside catalysts: Australian supply tightening and EV demand revisions',
        body: 'The next leg of the thesis is that diesel shortages become visible in Australian lithium output while global EV demand is revised upward under sustained high oil prices.',
        bullets: [
          'Western Australia faces a credible risk of diesel rationing; some smaller mines could face outright shortages in as little as 10 days.',
          'If trucking and mine logistics tighten within the next two weeks, the Australian supply-contraction logic could move from theory to fact.',
          'Demand should now be watched through global EV sales. High oil prices make EV adoption more attractive, and both April production schedules and May guidance are tracking toward record highs.',
          'Storage demand remains intact, and power-battery demand is recovering from the early-year tax step-down as new model launches and sales improved from March onward.'
        ],
        note: 'Longer term, lithium pricing is still anchored by upstream volume discipline and downstream technology-driven demand growth, and both anchors remain supportive.'
      },
      {
        title: 'Short-term tension is intensifying because inventories are already lean',
        body: 'The broad direction since last September has still been destocking. The visible inventory cushion is now thin enough that any supply miss or procurement delay can move spot pricing quickly.',
        bullets: [
          'Visible inventory is now around the 100 kt level, implying less than 20 days of sector-wide turnover and under 10 days in some downstream segments.',
          'Upstream producers have regained confidence after hedging and price recovery, so they are increasingly willing to hold the line on pricing.',
          'Downstream buyers still largely follow a “wait and prices will get cheaper” mindset, creating a sharp mismatch between procurement timing and actual production schedules.',
          'Using the latest May-June operating schedules, full-year demand could exceed 2.1 Mt and still has upside, while supply could lose roughly 150 kt once Jiangxi, Zimbabwe, Nigeria and Australia-related disruption are aggregated.'
        ],
        note: 'In this framing, the best window for tightness is still the second quarter.'
      },
      {
        title: 'Passing costs through the chain is becoming the medium-term direction',
        body: 'Whether the driver is global energy-system restructuring, export-front-loading, or fresh economics from storage policy, the broad conclusion is that prices need to move back toward resource value.',
        bullets: [
          'The key misunderstanding in the market has been to equate slow transmission with no transmission.',
          'Mainstream storage cell pricing has already moved back above RMB 0.4/Wh, showing that some cost pressure is starting to move downstream.',
          'If the whole chain continues drifting toward a more inflationary regime, lithium pricing should gradually re-anchor to upstream scarcity and cost.'
        ],
        note: 'That argues against using overly conservative downstream IRR models as the sole cap on lithium prices.'
      },
      {
        title: 'Equities should still benefit from both lithium beta and a broader re-rating',
        body: 'At around RMB 160k/t lithium prices, sector valuations still look low: sub-16x on 2025 earnings and just above 10x on 2026 in the referenced framework.',
        bullets: [
          'Spot prices are still sitting at an extreme bargaining point between upstream and downstream, so a reversion toward fundamentals can still lift price expectations.',
          'Yichun royalty payments and future permit-related shutdowns remain a domestic catalyst.',
          'The market is still focused on domestic pricing logic, but a future push by the U.S. to regain lithium pricing influence, potentially alongside renewed talks with Chile, could become an additional external trigger.'
        ],
        note: 'In practice, the equity side still embeds a meaningful call option on both lithium prices and the revaluation of the new-energy value chain.'
      }
    ],
    searchPlaceholder: 'Search project / country / listed owner / risk keyword…',
    allStatuses: 'All statuses',
    allCountries: 'All countries',
    allStructures: 'Single + cluster',
    sortOptions: {
      capacity_desc: 'Capacity (high to low)',
      capacity_asc: 'Capacity (low to high)',
      name_asc: 'Name (A to Z)',
      country_asc: 'Country',
    },
    legend: {
      Operating: 'Operating',
      'Ramp-up': 'Ramp-up',
      Construction: 'Construction',
      Development: 'Development / pre-start',
      'On hold / stalled': 'On hold / stalled',
      'Resource stage': 'Resource stage',
    },
    loading: 'Loading the lithium project database from the repository…',
    tableTitle: 'Project Database',
    tableSubtitle: 'Capacity, resource base, cost, logistics and execution risks are shown first so the table can be used directly for supply-curve and delivery analysis. Data updated 2026-07-24; highlighted rows changed in this update.',
    tableScrollHint: '← Swipe horizontally for more columns. Address / export route / source columns are hidden at this width (they remain searchable); rotate or use a desktop browser for all 14.',
    tableHeaders: [
      'Project',
      'Country',
      'Listed owner(s)',
      'Status',
      'Type',
      'Reserve / resource',
      'Grade',
      'Current capacity',
      'Planned capacity',
      'Cost',
      'Address',
      'Transport / export route',
      'Disruption risks',
      'Source note',
    ],
    footnote:
      '<b>Methodology:</b><br />1) Capacity prioritizes directly disclosed lithium carbonate / hydroxide / chloride or concentrate output whenever available.<br />2) Hard-rock projects use an approximate conversion when cross-asset comparison requires LCE normalization (SC6 × ~0.1484 ≈ LCE).<br />3) Brine projects prioritize reserve / resource disclosures in LCE or lithium concentration terms.<br />4) Cost uses company-disclosed cash cost / FOB cost whenever available; otherwise relative cost-band language is preserved rather than false precision.<br />5) Routes describe representative logistics and export pathways for research purposes and do not imply a single commercial route.<br />6) Fragmented disclosure areas such as China and Bolivia are grouped into project / salar clusters to improve coverage and explanatory power.<br /><br /><b>How to use it:</b> identify the large, low-cost, lower-risk assets on the map first, then read the disruption column carefully. In lithium, the real price elasticity comes from <i>supply delivery</i>, not from geology alone.',
    popupLabels: {
      country: 'Country',
      status: 'Status',
      type: 'Type',
      reserve: 'Reserve / resource',
      grade: 'Grade',
      current: 'Current capacity',
      planned: 'Planned capacity',
      cost: 'Cost',
      address: 'Address',
      route: 'Transport route',
      risks: 'Disruption risks',
      source: 'Source note',
    },
    resultSummary: (visible, total) => `Showing ${visible} / ${total} projects`,
    emptyState: 'No projects match the current filters.',
    errorPrefix: 'Failed to load database: ',
  },
};
