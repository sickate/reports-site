// AUTHORING SOURCE for the company tables.
//
// IMPORTANT: `en.domesticRows` / `en.globalRows` are NOT dead code, even though the UI
// language toggle was removed. scripts/generate-company-financials-jsonl.mjs imports this
// module at build time and reads the English rows to emit `aliases` and `finance.notes.en`
// into public/data/company-financials.jsonl. Deleting them breaks `npm run build`.
//
// Each row has EXACTLY 11 cells, destructured positionally by the generator:
//   [名称, 24A净利, 25A净利, 26E净利, 27E净利, 24A PE, 25A PE, 26E PE, 27E PE, 市值, 备注]
// Adding a 12th column silently turns the market cap into the note.
//
// Must stay DOM-free and side-effect-free so Node can import it directly.

export const companyResearchContent = {
  zh: {
    pageNav: [
      { href: '#researchUpdatesSection', label: '最新研报更新' },
      { href: '#companyResearchSection', label: '锂资源公司研究' },
      { href: '#projectMapSection', label: '全球项目地图' },
      { href: '#projectDatabaseSection', label: '项目数据库' },
      { href: '#methodologySection', label: '方法说明' },
    ],
    companyKicker: '锂资源公司覆盖',
    companyTitle: '锂资源研究报告（盈利预期为 4 月一致预期 · 行情/市值更新至 2026-07-24）',
    companySubtitle:
      '把资源禀赋、盈利预测、成本曲线和扩产兑现放在一起看，方便直接做配置排序、弹性比较和政策风险筛选。市值与现价已按 2026-07-23/24 收盘刷新（Caspian 行情），净利预期仍为 4 月一致预期。',
    subnav: [
      { href: '#quickTakeSection', label: '先给结论' },
      { href: '#domesticEquitiesSection', label: '国内样本' },
      { href: '#globalEquitiesSection', label: '国际样本' },
      { href: '#resourceMatrixSection', label: '资源矩阵' },
      { href: '#focusVariablesSection', label: '关键变量' },
      { href: '#rankingSection', label: '投资排序' },
    ],
    quickTakeTitle: '先给结论',
    quickTakeSubtitle: '基准情景：碳酸锂约 14.5–15 万元/吨（2026-07-23：电池级现货 ¥14.65 万、期货主力 ¥14.5 万、工业级基准 ¥14.0 万；机构中枢 13–15 万，旺季看 15–18 万）',
    quickTakeCards: [
      {
        pill: 'Bucket 1',
        title: '低成本盐湖：盐湖股份 / 藏格矿业 / SQM',
        body: '这一组的核心不是弹性最大，而是在 16 万元附近仍有明显利润和现金流，属于更适合做底仓的中枢资产。',
        bullets: [
          '盐湖股份 2025 年碳酸锂单吨生产成本约 3.1 万元/吨，碳酸锂产量约 4.65 万吨，新增 4 万吨/年项目已建成投料试车。',
          '藏格矿业披露麻米错一期达产后碳酸锂成本约 3.10 万元/吨，低成本逻辑清晰。',
          'SQM 仍是全球低成本盐湖核心资产，Atacama 成本曲线位置最稳。'
        ],
      },
      {
        pill: 'Bucket 2',
        title: '硬岩一体化龙头：天齐 / 赣锋 / 中矿 / Pilbara / MinRes',
        body: '这组公司的优势不只是资源多，而是矿端自给率提升、锂盐或精矿放量后，利润对锂价更敏感。',
        bullets: [
          '赣锋披露 Goulamina 2025 年产出约 33 万吨锂精矿，并计划 2026 年实现满产。',
          '中矿在公开研报口径下锂盐产能已达 6.6 万吨/年，Bikita 400 万吨/年采选规模达产。',
          'Pilbara 的 P1000 扩产目标，是把 Pilgangoora 推至 100 万吨/年精矿产能。'
        ],
      },
      {
        pill: 'Bucket 3',
        title: '高弹性二线 / 资源绑定型：永兴 / 盛新 / 融捷 / 雅化 / 天华',
        body: '这组的赔率很高，但兑现更依赖单一项目爬坡、政策变化和外部供矿稳定性，更适合做进攻型配置。',
        bullets: [
          '盛新披露津巴布韦萨比星矿山大约覆盖其 2026 年锂盐原料需求的 1/3。',
          '融捷相关媒体测算，2026 年甲基卡 134 号脉与李家沟年产量均有望达到约 18 万吨。',
          '永兴、雅化、天华的利润修复，本质上都与资源保障改善和锂盐价格回升同步。'
        ],
      },
    ],
    quickTakeNote:
      '口径说明：已逐个公司核对 2026-05 以来研报——仅雅化集团有可比的全年净利上修（东吴 7/7，26-28E 30.3 / 35.8 / 39.2 亿，已更新），其余多数窗口内无新的全年绝对额预测，故净利预期沿用 4 月一致预期，并在备注附 26H1 业绩预告作为方向性信号。远期 26E / 27E PE 已统一按 2026-07-23 A 股总市值 ÷ 表内净利预期重算，PE 仅作再评级方向参考。24A / 25A 为披露期历史 PE 快照，个别公司（如赣锋）历史 PE 采用 MarketScreener 合并口径，与 A 股总市值口径不完全可比。锂盐、锂精矿、权益口径彼此不可完全横比，避免假精确。',
    domesticTitle: '国内锂资源 / 资源绑定型公司样本（10 家）',
    domesticSubtitle: '单位：归母净利为百万元人民币；26E/27E PE 按 2026-07-23 收盘市值 ÷ 表内净利预期重算（市值列为当日收盘，¥亿）；净利与 PE 列按强弱热力着色（绿=相对强、红=相对弱）；N.M. = 亏损导致 PE 无意义，N.A. = 公开覆盖不足。',
    tableHeaders: ['公司', '24A净利', '25A净利', '26E净利', '27E净利', '24A PE', '25A PE', '26E PE', '27E PE', '市值(¥亿)', '备注 / 来源'],
    domesticRows: [
      ['天齐锂业', '-7,905', '463', '5,053', '4,921', '-6.9x', '140x', '15.7x', '16.1x', '¥795', 'Greenbushes + SQM 敞口，全球资源中枢弹性。来源：MarketScreener。'],
      ['赣锋锂业', '~-2,062', '~1,645', '~5,433', '~5,099', '-34x', '262x', '19.8x', '21.0x', '¥1,073', '净利按 EPS×股本近似，自给率提升最明确。历史 PE 为 MarketScreener 合并口径。来源：MarketScreener UK。'],
      ['盐湖股份', '4,663', '8,476', '11,816', '13,565', '~44x', '~24x', '12.3x', '10.8x', '¥1,459', '低成本盐湖底仓标的；五矿入主、开源 7/24 首次覆盖测算约 12X、账面现金近 300 亿；26H1 预告归母净利 60–63 亿（+131%~143%）。来源：开源 / 国投 / MarketScreener。'],
      ['藏格矿业', '2,580', '3,502', '5,732', '7,121', '~51x', '~34x', '21.8x', '17.5x', '¥1,247', '麻米错提供第二成长曲线，钾锂铜三线并行；26H1 预告归母净利 35.5–37.5 亿（+97%~108%）。来源：国投 / MarketScreener / 新浪财经。'],
      ['中矿资源', '~758', '~458', '~2,795', '~4,223', '33.8x', '124x', '13.1x', '8.7x', '¥366', 'Bikita + Tanco + 锂盐扩张，自给率上升；津巴 2027 禁令确认。来源：MarketScreener。'],
      ['永兴材料', '1,043', '825', '1,130', '1,569', '19.1x', '50.9x', '21.9x', '15.8x', '¥247', '云母路线中成本控制较优。来源：MarketScreener。'],
      ['盛新锂能', '~-622', '~-535', '~859', '~767', '-20x', '-35.1x', '32.4x', '36.3x', '¥278', '高弹性但受津巴布韦政策约束。来源：MarketScreener。'],
      ['雅化集团', '257', '485', '3,030', '3,580', '~108x', '57.7x', '6.8x', '5.7x', '¥206', '资源绑定 + 氢氧化锂利润修复；东吴 7/7 上修 26-28E 净利至 30.3 / 35.8 / 39.2 亿（+379%/18%/10%）、锂盐出货全年约 12 万吨、自供比例升至 25%。来源：东吴证券 / MarketScreener。'],
      ['天华新能', '848', '402', '461', '844', '22.8x', '114x', '108.8x', '59.4x', '¥502', '矿端可比性弱于纯资源股。来源：MarketScreener。'],
      ['融捷股份', '215', '279', 'N.A.', 'N.A.', '38.5x', '48.2x', 'N.A.', 'N.A.', '¥167', '川西锂矿高弹性，但公开覆盖不足。来源：MarketScreener。'],
    ],
    domesticNote:
      '怎么看：真正更接近“估值不贵 + 资源端扎实”的，是盐湖股份、藏格矿业、中矿资源、天齐锂业、雅化集团；更接近高弹性交易品的是赣锋、盛新、融捷、天华。行业双击空间不是平均分布，而是集中在低成本盐湖与自给率提升的一体化龙头。',
    globalTitle: '国际巨头样本（5 家）',
    globalSubtitle: '单位：归母净利为百万美元或百万澳元；26E/27E 以公司披露口径和一致预期近似整理。',
    globalRows: [
      ['Albemarle', '-1,316', '-677', '1,033', '1,267', '-7.7x', '-24.6x', '25.5x', '20.9x', '—', 'USD；资源端强，但加工端回报承压。来源：MarketScreener / Albemarle。 现价 $116.9（2026-07-24）。'],
      ['SQM', '-404', '588', '~1,489', '~1,827', 'N.M.', '~43x', '~17x', '~14x', '—', 'USD；全球低成本盐湖核心资产。来源：SQM / MarketScreener。 现价 $69.3（2026-07-24）。'],
      ['Pilbara Minerals', '257', '-196', '422', '1,181', '36.3x', '-21.1x', '38.9x', '15.6x', '—', 'AUD；纯正硬岩 Beta，P1000 是核心看点。来源：MarketScreener。'],
      ['Mineral Resources', '114', '-896', '790', '739', '84.3x', '-4.7x', '14.2x', '13.7x', '—', 'AUD；Wodgina / Mt Marion 成本改善中。来源：MarketScreener / MinRes。'],
      ['IGO', '2.8', '-954.6', '215', '752.8', '1524x', '-3.31x', '30.5x', '7.76x', '—', 'AUD；集团混合口径，锂业务并非纯口径。来源：MarketScreener。'],
    ],
    globalNote:
      '国际样本的启示：SQM 仍是低成本核心资产；Albemarle 的问题不是资源，而是加工端回报率，2026 年 2 月已宣布把 Kemerton 剩余运行产线转入 care and maintenance；Pilbara、MinRes、IGO 更像澳洲硬岩周期 Beta，对精矿价格变化更敏感。口径：国际样本盈利与 PE 仍为 4 月一致预期（ASX 标的暂无实时重算），ALB / SQM 已附 2026-07-24 现价（$116.9 / $69.3）。',
    matrixTitle: '资源端：产能、成本、风险与机遇矩阵',
    matrixSubtitle: '把盐湖、硬岩和资源绑定型放到同一视角比较，避免把锂盐、锂精矿和权益口径混为一谈。',
    matrixHeaders: ['公司', '资源 / 项目', '24A-27E 产能轨迹（关键口径）', '成本判断', '主要机遇', '核心风险', '来源'],
    matrixRows: [
      ['天齐锂业', 'Greenbushes + SQM + 锂盐加工', '核心不是新矿放量，而是低成本矿权 + 锂盐 / 联营收益弹性。', '低成本矿端', 'Greenbushes 低成本、SQM 分红 / 权益收益、锂价上涨时利润弹性大。', 'SQM 分红波动、智利政策、加工端开工率。', '东方财富 / 公司资料'],
      ['赣锋锂业', 'Goulamina / Mt Marion / 一里坪 / Gabus', 'Goulamina 2025 年产约 33 万吨精矿，2026 年计划满产；一里坪现有 1.5 万吨碳酸锂产能。', '中低成本，改善中', '自给率提升最明确，锂价反弹时利润弹性大。', '马里 / 津巴布韦 / 跨境物流与政策风险。', '中国证券网'],
      ['盐湖股份', '察尔汗 + 一里坪', '2025 年碳酸锂产销约 4.65 / 4.56 万吨；新增 4 万吨项目已建成投料试车；五矿入主后集团规划 30 年前钾锂产能翻倍。', '低成本，2025 单吨约 3.1 万元/吨', '五矿入主打造世界级盐湖基地 + 低成本扩产 + 钾锂共振；开源测算当前钾锂价年化利润约 120 亿、对应约 12X、账面现金近 300 亿。', '新项目爬坡、盐湖工艺波动、税项与资源政策。', '开源证券 / 新浪研报'],
      ['藏格矿业', '察尔汗 / 麻米错 / 巨龙铜', '麻米措 5 万吨预计 2026 下半年投产，巨龙铜矿持续爬坡，形成钾锂铜三线并行。', '低成本', '钾锂铜三线放量 + 西藏盐湖成长曲线。', '麻米措爬坡、西藏环保与基础设施、铜价扰动。', '新浪财经 / 研报'],
      ['中矿资源', 'Bikita + Tanco + 春鹏锂业', '锂盐产能约 6.6 万吨/年，Bikita 400 万吨/年采选达产；7 月锂盐产线检修，Bikita 硫酸锂厂仍在建。', '成本持续下降', '非洲矿自给提升、Bikita 电力 / 光伏降本。', '津巴 2027 原矿出口禁令确认、汇率与海外执行。', '东吴 / 新浪研报'],
      ['永兴材料', '江西锂云母', '云母路线，量不是最大，但利润弹性高。', '云母路线中成本控制较优', '锂价上行时盈利恢复快。', '云母品位、酸电成本、环保波动。', '新浪财经'],
      ['盛新锂能', '萨比星 + 奥伊诺 + 外购矿', '萨比星约覆盖 2026 年原料需求的 1/3。', '成本中枢取决于自供矿占比', '自供矿占比上升带来利润修复。', '津巴布韦政策、外购矿依赖仍高。', '新浪财经'],
      ['融捷股份', '李家沟 + 甲基卡 134 号脉', '媒体测算 2026 年两矿年产量均有望达到约 18 万吨。', '高弹性、低可见度', '川西锂矿真正放量后，盈利弹性极大。', '大矿小选瓶颈、选矿 / 运输 / 关联交易定价。', '新浪财经'],
      ['雅化集团', '资源绑定 / 长协供矿 + 氢氧化锂', '更偏资源绑定型，已签五年锂供应协议。', '成本更依赖供矿条款', '供矿保障改善后，LiOH 利润修复明显。', '津巴布韦政策与海外精矿禁令风险。', 'MarketScreener'],
      ['天华新能', '资源绑定 + 锂盐加工', '更偏锂盐加工 / 资源绑定，矿端可比性弱。', '非纯矿端口径', '锂盐价格回升时利润高弹性。', '自有矿不足、外部资源与价格波动。', 'MarketScreener'],
      ['Albemarle', 'Greenbushes / Wodgina / Kemerton', '资源端仍强，但 Kemerton 已转 care and maintenance。', '矿端强、加工端承压', '锂价回升时全球资源王者重估。', '加工回报率、资本开支纪律。', 'Albemarle'],
      ['SQM', 'Atacama + Codelco 协议', '低成本盐湖基础上，目标到本十年末新增至少 10 万吨/年国际锂产能。', '全球最低成本之一', '智利资源禀赋 + 国企合作稳定扩张。', '国家合作条款、水资源与社区约束。', 'SQM'],
      ['Pilbara Minerals', 'Pilgangoora', 'P1000 扩产目标把总精矿产能提升到 100 万吨/年。', '硬岩中有竞争力', '纯正硬岩 Beta，精矿涨价时弹性最直接。', '硬岩价格下跌时利润波动大。', 'Pilbara Minerals'],
      ['Mineral Resources', 'Wodgina / Mt Marion / Bald Hill', 'FY25 显示 Wodgina、Mt Marion 成本显著下降，Bald Hill 进入 care and maintenance。', '成本改善中', '成本下行 + 锂价回升，26E/27E PE 已压到低 teens。', '杠杆、资本开支、项目执行。', 'MinRes'],
      ['IGO', 'Greenbushes / Kwinana 敞口', '锂业务并非纯口径，但 26E/27E 利润修复明显。', '集团混合口径', '27E PE 已明显压缩，修复弹性大。', '锂业务非纯、收益受 JV / 镍业务扰动。', 'MarketScreener'],
    ],
    focusTitle: '投资上最该盯的，不是“有矿没矿”，而是这 4 个变量',
    focusSubtitle: '锂资源股的胜负手，本质上是现金流、资源自给率、扩产兑现和政策折价。',
    focusCards: [
      {
        title: '1）谁在 16 万元/吨附近仍有明显自由现金流',
        body: '第一梯队仍是盐湖股份、藏格、SQM。它们不是等周期救命，而是在当前位置就能赚到钱，适合作为底仓配置。',
      },
      {
        title: '2）谁的自给率在 2026-2027 真正提升',
        body: '最典型的是赣锋、中矿、盛新。矿端从外购矿 / 代工矿向自有矿切换，利润弹性通常会高于单纯的锂价上涨。',
      },
      {
        title: '3）谁的扩产是“已投产待爬坡”，而不是“PPT 产能”',
        body: '盐湖股份新增 4 万吨项目、赣锋 Goulamina、Pilbara P1000 都属于更靠近兑现端的扩产路径，确定性高于早期绿地项目。',
      },
      {
        title: '4）谁暴露在政策 / 地缘不确定性里',
        body: '这轮锂资源股的最大非基本面风险不是成本，而是资源民族主义和政策不确定性。赣锋、中矿、盛新、雅化、SQM 都面临估值折价。'
      },
    ],
    rankingTitle: '落到投资排序：谁更像“强阿尔法 + 贝塔”？',
    rankingSubtitle: '把防守底仓、利润弹性和高 Beta 标的拆开看，比讨论行业平均估值更有用。',
    rankingCards: [
      {
        pill: 'Tier 1',
        title: '第一梯队：核心配置',
        companies: '盐湖股份、藏格矿业、天齐锂业、SQM',
        body: '共同特征是低成本、资源质量高、产能兑现概率高、估值不算离谱。盐湖和藏格更偏防守，天齐和 SQM 更偏全球资源中枢。'
      },
      {
        pill: 'Tier 2',
        title: '第二梯队：上行弹性最强',
        companies: '赣锋锂业、中矿资源、Pilbara、MinRes',
        body: '这组不是最稳，但利润弹性最大。一旦锂价再上台阶，26E / 27E 的盈利修复往往最陡。'
      },
      {
        pill: 'Tier 3',
        title: '第三梯队：高 Beta / 高分化',
        companies: '盛新锂能、永兴材料、融捷股份、雅化集团、天华新能',
        body: '涨起来可能非常猛，但前提是项目爬坡、供矿稳定、外部政策不出问题，更适合做进攻型仓位。'
      },
    ],
    finalCallTitle: '最重要的一句判断',
    finalCallBody:
      '这轮锂资源投资，胜负手不是“谁的矿最多”，而是谁能把低成本资源、2026-2027 的产量兑现、以及政策风险折价三件事同时做对。按这个标准，底仓桶更适合盐湖股份、藏格、天齐、SQM，进攻桶更适合赣锋、中矿、Pilbara、MinRes。',
  },
  en: {
    pageNav: [
      { href: '#researchUpdatesSection', label: 'Research Update' },
      { href: '#companyResearchSection', label: 'Equities View' },
      { href: '#projectMapSection', label: 'Project Map' },
      { href: '#projectDatabaseSection', label: 'Project Database' },
      { href: '#methodologySection', label: 'Methodology' },
    ],
    companyKicker: 'Lithium Equities Coverage',
    companyTitle: 'Lithium Equities Research Note (earnings = April consensus; quotes / market caps refreshed to 2026-07-24)',
    companySubtitle:
      'This section links resource quality, earnings revisions, cost positioning and project delivery so the page can also work as an allocation and beta-screening tool. Market caps and spot prices are refreshed to the 2026-07-23/24 close (Caspian quotes); net-profit estimates remain the April consensus.',
    subnav: [
      { href: '#quickTakeSection', label: 'Quick Take' },
      { href: '#domesticEquitiesSection', label: 'China Sample' },
      { href: '#globalEquitiesSection', label: 'Global Sample' },
      { href: '#resourceMatrixSection', label: 'Resource Matrix' },
      { href: '#focusVariablesSection', label: 'What Matters' },
      { href: '#rankingSection', label: 'Ranking' },
    ],
    quickTakeTitle: 'Quick Take',
    quickTakeSubtitle: 'Base case: lithium carbonate around RMB 145–150k/t (2026-07-23: battery-grade spot ¥146.5k, front futures ¥145k, industrial ¥140k; desk center RMB 130–150k, peak season seen 150–180k)',
    quickTakeCards: [
      {
        pill: 'Bucket 1',
        title: 'Low-cost brines: Salt Lake, Zangge, SQM',
        body: 'These are not the highest-beta names. They matter because they still generate clear profits and cash flow around RMB 160k/t and therefore work as core holdings.',
        bullets: [
          'Salt Lake disclosed 2025 lithium carbonate cash cost around RMB 31k/t, output of roughly 46.5 kt, and a new 40 ktpa project already in trial operation.',
          'Zangge indicated Stage-1 Mamicuo cost around RMB 31k/t once ramped.',
          'SQM remains the core low-cost salar asset globally, anchored by Atacama.'
        ],
      },
      {
        pill: 'Bucket 2',
        title: 'Integrated hard-rock leaders: Tianqi, Ganfeng, Sinomine, Pilbara, MinRes',
        body: 'The edge here is not simply “bigger resources” but rising mine self-sufficiency and larger downstream volumes, which make earnings more sensitive to a lithium price recovery.',
        bullets: [
          'Ganfeng disclosed Goulamina output of about 330 kt concentrate in 2025 and targets full run-rate in 2026.',
          'Sinomine is already at roughly 66 ktpa lithium chemical capacity in public broker framing, while Bikita has reached 4 Mtpa mining and processing scale.',
          'Pilbara’s P1000 expansion targets 1 Mtpa concentrate capacity at Pilgangoora.'
        ],
      },
      {
        pill: 'Bucket 3',
        title: 'Higher-beta second line / resource-linked names: Yongxing, Chengxin, Youngy, Yahua, Tianhua',
        body: 'These names can re-rate sharply, but delivery depends much more on single-project ramp-up, policy stability and external concentrate supply.',
        bullets: [
          'Chengxin says Sabi Star could cover roughly one-third of its 2026 feedstock needs.',
          'Media estimates imply both Jiajika No.134 and Lijiagou could approach roughly 180 kt annual output in 2026.',
          'Yongxing, Yahua and Tianhua all need better resource security plus higher lithium salt prices for a stronger earnings rebound.'
        ],
      },
    ],
    quickTakeNote:
      'Method note: a per-company check of research since May 2026 found only Yahua with a comparable full-year upward revision (Soochow Jul 7, 26-28E RMB 3.03 / 3.58 / 3.92bn, already updated); most others had no new absolute full-year forecast in the window, so their net-profit estimates keep the April 15 consensus, with 1H26 preliminary results added to the notes as a directional signal. The forward 26E / 27E P/E is re-marked to the 2026-07-23 A-share market cap divided by those estimates, so it only signals the direction of the re-rating. 24A / 25A are historical P/E snapshots, and a few names (e.g. Ganfeng) carry a MarketScreener combined basis not fully comparable to the A-share market-cap basis. Lithium chemicals, concentrates and equity-accounted exposures are not fully comparable.',
    domesticTitle: 'China Lithium Resource / Resource-Linked Sample (10 names)',
    domesticSubtitle: 'Unit: attributable net profit in RMB mn; 26E/27E P/E re-marked to the 2026-07-23 closing market cap over the April net-profit estimates (the Mkt cap column is that day’s close, RMB bn). Net-profit and P/E columns are heat-shaded by strength (green = relatively strong, red = weak). N.M. = P/E not meaningful because of losses; N.A. = insufficient public coverage.',
    tableHeaders: ['Company', '24A NPAT', '25A NPAT', '26E NPAT', '27E NPAT', '24A P/E', '25A P/E', '26E P/E', '27E P/E', 'Mkt cap ¥bn', 'Comment / Source'],
    domesticRows: [
      ['Tianqi Lithium', '-7,905', '463', '5,053', '4,921', '-6.9x', '140x', '15.7x', '16.1x', '¥79.5', 'Greenbushes + SQM exposure; rerating tied to global core-asset recovery. Source: MarketScreener.'],
      ['Ganfeng Lithium', '~-2,062', '~1,645', '~5,433', '~5,099', '-34x', '262x', '19.8x', '21.0x', '¥107.3', 'Net profit approximated from EPS × shares; self-sufficiency story is clearest. Historical P/E on a MarketScreener combined basis. Source: MarketScreener UK.'],
      ['Salt Lake Industry', '4,663', '8,476', '11,816', '13,565', '~44x', '~24x', '12.3x', '10.8x', '¥145.9', 'Core low-cost brine holding; Minmetals in control, Kaiyuan initiation Jul 24 pegs ~12x with ~RMB 30bn cash; 1H26 preliminary net profit RMB 6.0-6.3bn (+131~143%). Source: Kaiyuan / Guotou / MarketScreener.'],
      ['Zangge Mining', '2,580', '3,502', '5,732', '7,121', '~51x', '~34x', '21.8x', '17.5x', '¥124.7', 'Mamicuo adds a second growth curve, with parallel potash-lithium-copper lines; 1H26 preliminary net profit RMB 3.55-3.75bn (+97~108%). Source: Guotou / MarketScreener / Sina Finance.'],
      ['Sinomine Resource', '~758', '~458', '~2,795', '~4,223', '33.8x', '124x', '13.1x', '8.7x', '¥36.6', 'Bikita + Tanco + lithium chemical expansion drive self-sufficiency; Zimbabwe 2027 ban confirmed. Source: MarketScreener.'],
      ['Yongxing Materials', '1,043', '825', '1,130', '1,569', '19.1x', '50.9x', '21.9x', '15.8x', '¥24.7', 'Among the better-managed lepidolite routes. Source: MarketScreener.'],
      ['Chengxin Lithium', '~-622', '~-535', '~859', '~767', '-20x', '-35.1x', '32.4x', '36.3x', '¥27.8', 'High beta, but still highly exposed to Zimbabwe policy. Source: MarketScreener.'],
      ['Yahua Group', '257', '485', '3,030', '3,580', '~108x', '57.7x', '6.8x', '5.7x', '¥20.6', 'Resource-linked model plus LiOH earnings recovery; Soochow (Jul 7) lifted 26-28E net profit to RMB 3.03 / 3.58 / 3.92bn (+379%/18%/10%), lithium-salt shipments ~120kt for the year, self-supply up to 25%. Source: Soochow / MarketScreener.'],
      ['Tianhua New Energy', '848', '402', '461', '844', '22.8x', '114x', '108.8x', '59.4x', '¥50.2', 'Mine exposure is less directly comparable than pure resource plays. Source: MarketScreener.'],
      ['Youngy', '215', '279', 'N.A.', 'N.A.', '38.5x', '48.2x', 'N.A.', 'N.A.', '¥16.7', 'High-beta western Sichuan exposure, but public forward coverage is thin. Source: MarketScreener.'],
    ],
    domesticNote:
      'How to read it: the names closest to “reasonable valuation plus solid resource depth” are Salt Lake, Zangge, Sinomine, Tianqi and Yahua. The names closer to pure trading beta are Ganfeng, Chengxin, Youngy and Tianhua. The rerating is not evenly distributed across the sector.',
    globalTitle: 'Global Majors Sample (5 names)',
    globalSubtitle: 'Unit: attributable net profit in USD mn or AUD mn, summarized from company disclosures and consensus framing.',
    globalRows: [
      ['Albemarle', '-1,316', '-677', '1,033', '1,267', '-7.7x', '-24.6x', '25.5x', '20.9x', '—', 'USD; strong resource base, weaker conversion returns. Source: MarketScreener / Albemarle. Spot $116.9 (Jul 24, 2026).'],
      ['SQM', '-404', '588', '~1,489', '~1,827', 'N.M.', '~43x', '~17x', '~14x', '—', 'USD; global core low-cost brine asset. Source: SQM / MarketScreener. Spot $69.3 (Jul 24, 2026).'],
      ['Pilbara Minerals', '257', '-196', '422', '1,181', '36.3x', '-21.1x', '38.9x', '15.6x', '—', 'AUD; pure hard-rock beta with P1000 as the key catalyst. Source: MarketScreener.'],
      ['Mineral Resources', '114', '-896', '790', '739', '84.3x', '-4.7x', '14.2x', '13.7x', '—', 'AUD; Wodgina / Mt Marion costs are improving. Source: MarketScreener / MinRes.'],
      ['IGO', '2.8', '-954.6', '215', '752.8', '1524x', '-3.31x', '30.5x', '7.76x', '—', 'AUD; conglomerate framing, not a pure lithium line. Source: MarketScreener.'],
    ],
    globalNote:
      'Takeaway: SQM still looks like the cleanest low-cost core asset. Albemarle’s issue is not resource quality but conversion economics, and in February 2026 it announced that the remaining operating Kemerton train would be placed into care and maintenance. Pilbara, MinRes and IGO are closer to Australian hard-rock beta. Note: the global sample keeps April consensus earnings and P/E (no live re-mark for the ASX names); ALB / SQM carry the 2026-07-24 spot ($116.9 / $69.3).',
    matrixTitle: 'Resources: Capacity, Cost, Risk And Opportunity Matrix',
    matrixSubtitle: 'This matrix compares brines, hard-rock and resource-linked names on the same investment lens instead of mixing lithium chemicals, concentrates and equity-accounted assets.',
    matrixHeaders: ['Company', 'Resource / project', '2024A-2027E capacity path', 'Cost view', 'Main upside', 'Core risk', 'Source'],
    matrixRows: [
      ['Tianqi Lithium', 'Greenbushes + SQM + conversion', 'The key is not new mine growth but low-cost mine ownership plus earnings leverage from lithium chemicals and associates.', 'Low-cost mine end', 'Greenbushes cost position, SQM dividends and strong leverage when lithium prices recover.', 'SQM dividend volatility, Chile policy, conversion utilization.', 'Eastmoney / company materials'],
      ['Ganfeng Lithium', 'Goulamina / Mt Marion / Yiliping / Gabus', 'Goulamina produced about 330 kt concentrate in 2025 and targets full run-rate in 2026; Yiliping already has 15 ktpa lithium carbonate capacity.', 'Mid-low cost, improving', 'Self-sufficiency is rising most clearly among Chinese majors.', 'Mali / Zimbabwe / cross-border logistics and policy risk.', 'China Securities Journal'],
      ['Salt Lake Industry', 'Qarhan + Yiliping', '2025 carbonate production/sales ~46.5 / 45.6 kt; new 40 ktpa project in commissioning; post-Minmetals control, the group plans to double potash and lithium capacity within 30 years.', 'Low cost, about RMB 31k/t in 2025', 'Minmetals building a world-class salar base + low-cost expansion + potash-lithium resonance; Kaiyuan pegs ~RMB 12bn annualized profit ≈ ~12x with ~RMB 30bn cash.', 'Ramp-up, process stability, taxes and resource policy.', 'Kaiyuan / Sina sell-side note'],
      ['Zangge Mining', 'Qarhan / Mamicuo / Julong copper', 'Mamicuo 50 ktpa due 2H 2026 and Julong copper still ramping, giving parallel potash-lithium-copper lines.', 'Low cost', 'Potash-lithium-copper ramp + Tibet salar growth curve.', 'Mamicuo ramp, Tibet permitting/infrastructure, copper-price swings.', 'Sina Finance / research'],
      ['Sinomine Resource', 'Bikita + Tanco + Chunpeng Lithium', 'Lithium chemicals ~66 ktpa and Bikita at 4 Mtpa scale; July lithium-salt lines under maintenance and the Bikita sulfate plant still under construction.', 'Costs still falling', 'African ore self-sufficiency and power / solar cost-down at Bikita.', 'Zimbabwe 2027 raw-ore ban confirmed, FX and overseas execution.', 'Soochow / Sina sell-side note'],
      ['Yongxing Materials', 'Jiangxi lepidolite', 'Not the biggest volume story, but earnings beta is high if lithium prices rise.', 'Better cost control within mica routes', 'Fast earnings recovery when lithium prices rebound.', 'Ore grade, reagent and power costs, environmental enforcement.', 'Sina Finance'],
      ['Chengxin Lithium', 'Sabi Star + OYN + third-party ore', 'Sabi Star may cover around one-third of 2026 feedstock demand.', 'Cost center depends on self-supplied ore mix', 'Higher self-supply can drive a strong earnings rebound.', 'Zimbabwe policy and still-high reliance on third-party ore.', 'Sina Finance'],
      ['Youngy', 'Lijiagou + Jiajika No.134', 'Media estimates suggest both mines could approach 180 kt annual output in 2026.', 'High beta, low visibility', 'If western Sichuan volumes really scale up, earnings beta becomes very large.', 'Processing bottlenecks, transport and related-party pricing.', 'Sina Finance'],
      ['Yahua Group', 'Resource-linked model + LiOH', 'More resource-linked than pure mining; long-term supply agreements matter more than ore tonnage alone.', 'Cost depends on supply terms', 'Better feedstock security can sharply improve LiOH earnings.', 'Zimbabwe policy and concentrate export risk.', 'MarketScreener'],
      ['Tianhua New Energy', 'Resource-linked + lithium chemicals', 'Closer to a downstream lithium chemical model than a pure mine owner.', 'Not a pure mine-end story', 'Higher lithium salt prices can still produce strong earnings leverage.', 'Limited owned ore, external resource and price volatility.', 'MarketScreener'],
      ['Albemarle', 'Greenbushes / Wodgina / Kemerton', 'Resource exposure remains strong, but Kemerton is in care and maintenance.', 'Strong mine end, weak conversion returns', 'Could rerate sharply if the lithium cycle improves.', 'Conversion returns and capex discipline.', 'Albemarle'],
      ['SQM', 'Atacama + Codelco framework', 'Built on a low-cost salar base, with a plan to add at least 100 ktpa of international LCE capacity by decade end.', 'Among the global lowest-cost assets', 'Atacama resource quality plus state-backed expansion stability.', 'State-partnership terms, water and communities.', 'SQM'],
      ['Pilbara Minerals', 'Pilgangoora', 'P1000 targets 1 Mtpa total concentrate capacity.', 'Competitive within hard-rock', 'The cleanest pure hard-rock beta when concentrate prices rise.', 'Earnings swing sharply if hard-rock prices fall.', 'Pilbara Minerals'],
      ['Mineral Resources', 'Wodgina / Mt Marion / Bald Hill', 'FY25 showed clear cost improvement at Wodgina and Mt Marion, while Bald Hill moved into care and maintenance.', 'Improving cost base', 'Lower costs plus higher prices make 26E / 27E valuation look compressed.', 'Leverage, capex and execution.', 'MinRes'],
      ['IGO', 'Greenbushes / Kwinana exposure', 'Not a pure lithium business, but 26E / 27E earnings recovery is still meaningful.', 'Mixed-group framing', '27E valuation looks much lower if lithium exposure normalizes.', 'Lithium is diluted by JV structure and nickel volatility.', 'MarketScreener'],
    ],
    focusTitle: 'The four variables that matter more than simply “having a mine”',
    focusSubtitle: 'The sector’s real swing factors are free cash flow, rising self-sufficiency, deliverable ramp-up and policy discount.',
    focusCards: [
      {
        title: '1) Who still generates visible free cash flow around RMB 160k/t',
        body: 'Salt Lake, Zangge and SQM remain the clear first group. These names do not need a heroic cycle rebound to survive; they already work at current prices.',
      },
      {
        title: '2) Who actually improves self-sufficiency in 2026-2027',
        body: 'The clearest examples are Ganfeng, Sinomine and Chengxin. The switch from third-party ore to owned ore usually delivers more leverage than price alone.',
      },
      {
        title: '3) Whose expansion is “commissioned and ramping” rather than “slide-deck capacity”',
        body: 'Salt Lake’s new 40 ktpa project, Ganfeng’s Goulamina and Pilbara’s P1000 all sit much closer to delivery than early greenfield ideas.',
      },
      {
        title: '4) Who is most exposed to policy and geopolitical uncertainty',
        body: 'The biggest non-fundamental risk in this cycle is resource nationalism. Ganfeng, Sinomine, Chengxin, Yahua and SQM all face some degree of policy-driven discount.'
      },
    ],
    rankingTitle: 'Where the allocation ranking lands',
    rankingSubtitle: 'Separating core holdings, steep beta and speculative high-beta names is more useful than debating an average sector multiple.',
    rankingCards: [
      {
        pill: 'Tier 1',
        title: 'Core holdings',
        companies: 'Salt Lake, Zangge, Tianqi, SQM',
        body: 'Low cost, strong resource quality, higher probability of delivery and still-manageable valuations. Salt Lake and Zangge are more defensive; Tianqi and SQM are global core-asset exposure.'
      },
      {
        pill: 'Tier 2',
        title: 'Strongest upside beta',
        companies: 'Ganfeng, Sinomine, Pilbara, MinRes',
        body: 'These are not the steadiest names, but they offer the steepest earnings recovery if lithium prices move higher again.'
      },
      {
        pill: 'Tier 3',
        title: 'High beta / high dispersion',
        companies: 'Chengxin, Yongxing, Youngy, Yahua, Tianhua',
        body: 'These can rally hard, but only if project ramp-up, ore supply and policy stability all cooperate.'
      },
    ],
    finalCallTitle: 'Bottom line',
    finalCallBody:
      'The winning criterion in this lithium cycle is not “who owns the most ore” but who can align low-cost resources, real 2026-2027 volume delivery and manageable policy discount at the same time. On that basis, the core bucket is closer to Salt Lake, Zangge, Tianqi and SQM, while the attack bucket is closer to Ganfeng, Sinomine, Pilbara and MinRes.',
  },
};
