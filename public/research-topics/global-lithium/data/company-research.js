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
    companyTitle: '锂资源研究报告（26H1 业绩预告已全覆盖 · 全年预期仍为 4 月一致预期 · 市值更新至 2026-07-27）',
    companySubtitle:
      '把资源禀赋、盈利预测、成本曲线和扩产兑现放在一起看，方便直接做配置排序、弹性比较和政策风险筛选。10 家 A 股的 26H1 业绩预告已全部补齐（公司自己披露，7 月 3–15 日公告），市值按 2026-07-27 收盘刷新（Caspian 行情）；26E/27E 净利仍为 4 月卖方一致预期——其中 5 家的 H1 单独已覆盖全年预期七成以上，读 PE 前请先看备注里的覆盖率。',
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
      '口径说明：10 家已全部披露 26H1 业绩预告（公告日 2026-07-03 至 07-15），均为公司自己披露的区间，是本表内新鲜度最高的一层数据。'
      + '26E / 27E 净利仍沿用 4 月卖方一致预期——已逐个核对 2026-05 以来研报，仅雅化集团有可比的全年绝对额上修（东吴 7/7，26-28E 30.3 / 35.8 / 39.2 亿，已更新）；其余窗口内无新的全年预测，因此不替换、也不用 H1 外推伪造一个。'
      + '国金 7/1 明确指出全年指引的集中更新要等 8 月中报交流，所以这一列的过时是可预期的、有时点的，不是数据缺失。'
      + '远期 26E / 27E PE 按 2026-07-27 A 股收盘总市值 ÷ 表内净利预期重算，仅作再评级方向参考；当 H1 已覆盖 26E 七成以上时该 PE 不具估值含义，备注中逐个标出。'
      + '「H1×2 年化 PE」是本报告的自行测算（非机构预测），用于在一致预期过时的情况下提供一个统一口径的横比锚点；它假设下半年与上半年持平，在旺季或检修期都会失真。'
      + '24A / 25A 为披露期历史 PE 快照，个别公司（如赣锋）采用 MarketScreener 合并口径，与 A 股总市值口径不完全可比。锂盐、锂精矿、权益口径彼此不可完全横比，避免假精确。',
    domesticTitle: '国内锂资源 / 资源绑定型公司样本（10 家）',
    domesticSubtitle: '单位：归母净利为百万元人民币；26E/27E PE 按 2026-07-27 收盘市值 ÷ 表内净利预期重算（市值列为当日收盘，¥亿）；净利与 PE 列按强弱热力着色（绿=相对强、红=相对弱）；N.M. = 亏损导致 PE 无意义，N.A. = 公开覆盖不足。⚠️ 26E/27E 净利仍为 4 月一致预期（雅化除外），而 10 家已全部披露 26H1 业绩预告——备注里的「已覆盖 26E xx%」正是用来判断哪几列 PE 还能读：超过 70% 的（天齐 70%、赣锋 76%、永兴 93%、盛新 128%、天华 499%）意味着一致预期已过时，其 PE 高低反映的是预期陈旧程度，不是估值贵贱。',
    tableHeaders: ['公司', '24A净利', '25A净利', '26E净利', '27E净利', '24A PE', '25A PE', '26E PE', '27E PE', '市值(¥亿)', '备注 / 来源'],
    // 26E/27E 净利仍是 4 月一致预期（雅化除外，东吴 7/7 已上修）；PE 按 2026-07-27 收盘
    // 总市值重算。备注里的「已覆盖 26E xx%」是本次刷新的核心信息：10 家全部披露了
    // 26H1 业绩预告，其中 5 家的 H1 单独就吃掉了全年一致预期的 70% 以上，天华更是
    // 达到 499%——那一列 105.7x 的「远期 PE」量的不是估值，是预期的过时程度。
    domesticRows: [
      ['天齐锂业', '-7,905', '463', '5,053', '4,921', '-6.9x', '140x', '15.3x', '15.7x', '¥775', 'Greenbushes + SQM 敞口，全球资源中枢弹性。26H1 预告归母 28.5–42.5 亿（+3276%~+4935%，07-15），已覆盖 26E 一致预期 70%；SQM 投资收益按彭博预测口径计入，非实际披露。H1×2 年化 PE 约 10.9x（自行测算）。来源：公司业绩预告 / MarketScreener。'],
      ['赣锋锂业', '~-2,062', '~1,645', '~5,433', '~5,099', '-34x', '262x', '19.3x', '20.6x', '¥1,050', '净利按 EPS×股本近似，自给率提升最明确。26H1 预告归母 36.5–46.0 亿（扭亏，+787%~+966%，07-15），已覆盖 26E 一致预期 76%，其中含出售 PLS 股票的投资收益。H1×2 年化 PE 约 12.7x（自行测算）。历史 PE 为 MarketScreener 合并口径。来源：公司业绩预告 / MarketScreener UK。'],
      ['盐湖股份', '4,663', '8,476', '11,816', '13,565', '~44x', '~24x', '12.2x', '10.6x', '¥1,437', '低成本盐湖底仓标的；五矿盐湖并表（同一控制下追溯调整），开源 7/24 首次覆盖测算约 12X。26H1 预告归母 60–63 亿（+131%~+143%，07-03），覆盖 26E 一致预期 52%——十家中兑现节奏最均衡，其一致预期最经得起检验。H1 碳酸锂产 4.94 万吨、销 3.91 万吨。H1×2 年化 PE 约 11.7x（自行测算）。来源：公司业绩预告 / 开源 / 国投。'],
      ['藏格矿业', '2,580', '3,502', '5,732', '7,121', '~51x', '~34x', '21.8x', '17.6x', '¥1,251', '麻米错第二成长曲线，钾锂铜三线并行。26H1 预告归母 35.5–37.5 亿（+97%~+108%，07-07），覆盖 26E 一致预期 64%——但其中巨龙铜业权益投资收益约 28 亿，H1 碳酸锂产量仅约 5,400 吨：这更接近铜标的而非锂标的，不宜按锂价弹性定价。H1×2 年化 PE 约 17.1x（自行测算）。来源：公司业绩预告 / 国投。'],
      ['中矿资源', '~758', '~458', '~2,795', '~4,223', '33.8x', '124x', '12.6x', '8.3x', '¥352', 'Bikita + Tanco + 锂盐扩张，自给率上升；津巴 2027 禁令确认。26H1 预告归母 10.5–12.5 亿（+1078%~+1302%，07-11），覆盖 26E 一致预期 41%；国内冶炼厂两条产线各停产检修约一月，国金解读为锂精矿采购极度紧张而非需求问题。H1×2 年化 PE 约 15.3x（自行测算）。来源：公司业绩预告 / 国金 7/1。'],
      ['永兴材料', '1,043', '825', '1,130', '1,569', '19.1x', '50.9x', '21.9x', '15.8x', '¥248', '云母路线中成本控制较优。26H1 预告归母 9.5–11.5 亿（+137%~+187%，07-14），已覆盖 26E 一致预期 93%——4 月一致预期明显偏低，8 月中报后大概率上修，表内 21.9x 的 26E PE 应视为上限而非中枢。H1×2 年化 PE 约 11.8x（自行测算）。来源：公司业绩预告 / MarketScreener。'],
      ['盛新锂能', '~-622', '~-535', '~859', '~767', '-20x', '-35.1x', '31.1x', '34.8x', '¥267', '高弹性；印尼锂盐厂产能大幅释放，四川锂矿已开工。26H1 预告归母 10–12 亿（扭亏，+219%~+243%，07-09），已达 26E 一致预期的 128%——半年单独超越全年预期，表内 31.1x / 34.8x 不具参考性。H1×2 年化 PE 约 12.1x（自行测算）。来源：公司业绩预告 / 国金。'],
      ['雅化集团', '257', '485', '3,030', '3,580', '~108x', '57.7x', '6.7x', '5.7x', '¥204', '资源绑定 + 氢氧化锂利润修复；东吴 7/7 上修 26-28E 净利至 30.3 / 35.8 / 39.2 亿、锂盐出货全年约 12 万吨、自供比例升至 25%。26H1 预告归母 11–13 亿（+710%~+857%，07-07），覆盖已上修 26E 的 40%——本组唯一「预期已刷新且 H1 未超预期」的组合，PE 读数最可信。Q1 约 3 亿套保亏损，Q2 已减亏。H1×2 年化 PE 约 8.5x（自行测算）。来源：公司业绩预告 / 东吴证券。'],
      ['天华新能', '848', '402', '461', '844', '22.8x', '114x', '105.7x', '57.7x', '¥487', '矿端可比性弱于纯资源股。26H1 预告归母 22–24 亿（扭亏，+2471%~+2687%，07-10），为 26E 一致预期的 499%——4 月预期已被彻底证伪，表内 105.7x 的 26E PE 量的是预期过时程度而非估值，请勿据此排序。H1×2 年化 PE 约 10.6x（自行测算）。来源：公司业绩预告 / 兴证策略 7/9。'],
      ['融捷股份', '215', '279', 'N.A.', 'N.A.', '38.5x', '48.2x', 'N.A.', 'N.A.', '¥170', '川西锂矿高弹性；卖方全年绝对额覆盖仍然缺失，故 26E/27E 保持 N.A. 而非用 H1 外推填充。26H1 预告归母 9–11 亿（+957%~+1192%，07-11），驱动为锂精矿产销量价齐升 + 参股成都融捷锂业。H1×2 年化 PE 约 8.5x（自行测算）。来源：公司业绩预告。'],
    ],
    domesticNote:
      '怎么看：按 4 月一致预期读，这一组的 26E PE 从 6.7x 铺到 105.7x，看起来分化极大；但把口径换成各家自己披露的 26H1 × 2 年化，区间收敛到 8.5x–17.1x。也就是说，26E PE 列里的大部分离散度不是基本面差异，而是预期刷新速度的差异——8 月中报集中披露、卖方更新全年指引后，这一列会被大幅重排。'
      + '按年化口径最便宜的是雅化（8.5x）、融捷（8.5x）、天华（10.6x）、天齐（10.9x）；最贵的是藏格（17.1x）与中矿（15.3x）。'
      + '需要单独拎出来的是藏格：H1 的 35.5–37.5 亿里约 28 亿来自巨龙铜业权益投资收益，碳酸锂产量仅约 5,400 吨，把它放在锂价弹性框架里排序会得到错误答案。'
      + '结构性结论未变：真正“估值不贵 + 资源端扎实”的仍是盐湖股份、天齐锂业、雅化集团、中矿资源；行业双击空间集中在低成本盐湖与自给率提升的一体化龙头，而不是平均分布。',
    globalTitle: '国际巨头样本（5 家）',
    globalSubtitle: '单位：归母净利为百万美元或百万澳元；26E/27E 以公司披露口径和一致预期近似整理。',
    globalRows: [
      ['Albemarle', '-1,316', '-677', '1,033', '1,267', '-7.7x', '-24.6x', '25.5x', '20.9x', '—', 'USD；资源端强，但加工端回报承压。来源：MarketScreener / Albemarle。收盘 $114.85（2026-07-24）。'],
      ['SQM', '-404', '588', '~1,489', '~1,827', 'N.M.', '~43x', '~17x', '~14x', '—', 'USD；全球低成本盐湖核心资产。来源：SQM / MarketScreener。收盘 $68.73（2026-07-24）。'],
      ['Pilbara Minerals', '257', '-196', '422', '1,181', '36.3x', '-21.1x', '38.9x', '15.6x', '—', 'AUD；纯正硬岩 Beta，P1000 是核心看点。来源：MarketScreener。'],
      ['Mineral Resources', '114', '-896', '790', '739', '84.3x', '-4.7x', '14.2x', '13.7x', '—', 'AUD；Wodgina / Mt Marion 成本改善中。来源：MarketScreener / MinRes。'],
      ['IGO', '2.8', '-954.6', '215', '752.8', '1524x', '-3.31x', '30.5x', '7.76x', '—', 'AUD；集团混合口径，锂业务并非纯口径。来源：MarketScreener。'],
    ],
    globalNote:
      '国际样本的启示：SQM 仍是低成本核心资产；Albemarle 的问题不是资源，而是加工端回报率，2026 年 2 月已宣布把 Kemerton 剩余运行产线转入 care and maintenance；Pilbara、MinRes、IGO 更像澳洲硬岩周期 Beta，对精矿价格变化更敏感。口径：国际样本盈利与 PE 仍为 4 月一致预期（ASX 标的暂无实时重算），ALB / SQM 已更新至 2026-07-24 收盘（$114.85 / $68.73）；与 A 股样本不同，国际样本本次未做市值重算，两组 PE 口径不可直接横比。',
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
      'Method note: all ten names have now published 1H26 preliminary results (announced 2026-07-03 to 07-15). These are company-disclosed ranges and are the freshest layer of data in this table. 26E / 27E net profit still carries the April sell-side consensus: a per-company check of research since May 2026 found only Yahua with a comparable full-year revision (Soochow Jul 7, 26-28E RMB 3.03 / 3.58 / 3.92bn, already updated), and the rest had no new absolute full-year forecast in the window, so nothing was replaced and nothing was fabricated by extrapolating the half year. Guojin (Jul 1) states that full-year guidance is updated in bulk around the August interims, so the staleness of that column is expected and dated rather than missing. The forward 26E / 27E P/E is re-marked to the 2026-07-27 A-share closing market cap divided by those estimates and only signals the direction of a re-rating; where the half year already covers more than ~70% of 26E, that P/E carries no valuation meaning and each case is flagged in the notes. The "H1 x 2 annualized P/E" is this report\'s own calculation, not an institutional forecast, offered as a single consistent basis for cross-name comparison while the consensus is stale; it assumes the second half matches the first and will distort in peak-season or maintenance periods. 24A / 25A are historical P/E snapshots, and a few names (e.g. Ganfeng) carry a MarketScreener combined basis not fully comparable to the A-share market-cap basis. Lithium chemicals, concentrates and equity-accounted exposures are not fully comparable.',
    domesticTitle: 'China Lithium Resource / Resource-Linked Sample (10 names)',
    domesticSubtitle: 'Unit: attributable net profit in RMB mn; 26E/27E P/E re-marked to the 2026-07-27 closing market cap over the estimates in this table (the Mkt cap column is that day’s close, RMB bn). Net-profit and P/E columns are heat-shaded by strength (green = relatively strong, red = weak). N.M. = P/E not meaningful because of losses; N.A. = insufficient public coverage. Warning: 26E/27E net profit is still the April consensus (except Yahua), while all ten names have now published 1H26 preliminaries — the "already covers 26E xx%" figure in each note is what tells you which P/E columns are still readable. Above 70% (Tianqi 70%, Ganfeng 76%, Yongxing 93%, Chengxin 128%, Tianhua 499%) the consensus is stale and the P/E measures estimate staleness rather than valuation.',
    tableHeaders: ['Company', '24A NPAT', '25A NPAT', '26E NPAT', '27E NPAT', '24A P/E', '25A P/E', '26E P/E', '27E P/E', 'Mkt cap ¥bn', 'Comment / Source'],
    domesticRows: [
      ['Tianqi Lithium', '-7,905', '463', '5,053', '4,921', '-6.9x', '140x', '15.3x', '15.7x', '¥77.5', 'Greenbushes + SQM exposure. 1H26 preliminary net profit RMB 2.85-4.25bn (+3276~4935%, Jul 15), already 70% of the 26E consensus; the SQM equity pickup uses a Bloomberg-estimate basis, not disclosed results. H1x2 annualized P/E ~10.9x (own calculation). Source: company preliminary / MarketScreener.'],
      ['Ganfeng Lithium', '~-2,062', '~1,645', '~5,433', '~5,099', '-34x', '262x', '19.3x', '20.6x', '¥105.0', 'Net profit approximated from EPS × shares; self-sufficiency story is clearest. 1H26 preliminary net profit RMB 3.65-4.60bn (swing to profit, +787~966%, Jul 15), already 76% of the 26E consensus, including a gain on selling PLS shares. H1x2 annualized P/E ~12.7x (own calculation). Historical P/E on a MarketScreener combined basis. Source: company preliminary / MarketScreener UK.'],
      ['Salt Lake Industry', '4,663', '8,476', '11,816', '13,565', '~44x', '~24x', '12.2x', '10.6x', '¥143.7', 'Core low-cost brine holding; Minmetals Salt Lake consolidated (restated as a common-control transaction), Kaiyuan initiation Jul 24 pegs ~12x. 1H26 preliminary net profit RMB 6.0-6.3bn (+131~143%, Jul 3) = 52% of the 26E consensus, the most evenly paced of the ten and the estimate that best survives scrutiny. 1H carbonate output 49.4kt, sales 39.1kt. H1x2 annualized P/E ~11.7x (own calculation). Source: company preliminary / Kaiyuan / Guotou.'],
      ['Zangge Mining', '2,580', '3,502', '5,732', '7,121', '~51x', '~34x', '21.8x', '17.6x', '¥125.1', 'Mamicuo adds a second growth curve, with parallel potash-lithium-copper lines. 1H26 preliminary net profit RMB 3.55-3.75bn (+97~108%, Jul 7) = 64% of the 26E consensus — but ~RMB 2.8bn of that is the equity pickup from Julong Copper and 1H carbonate output was only ~5.4kt: this trades closer to a copper name than a lithium one and should not be priced off lithium beta. H1x2 annualized P/E ~17.1x (own calculation). Source: company preliminary / Guotou.'],
      ['Sinomine Resource', '~758', '~458', '~2,795', '~4,223', '33.8x', '124x', '12.6x', '8.3x', '¥35.2', 'Bikita + Tanco + lithium chemical expansion drive self-sufficiency; Zimbabwe 2027 ban confirmed. 1H26 preliminary net profit RMB 1.05-1.25bn (+1078~1302%, Jul 11) = 41% of the 26E consensus; two domestic converter lines are each down ~a month for maintenance, which Guojin reads as acute concentrate scarcity rather than weak demand. H1x2 annualized P/E ~15.3x (own calculation). Source: company preliminary / Guojin Jul 1.'],
      ['Yongxing Materials', '1,043', '825', '1,130', '1,569', '19.1x', '50.9x', '21.9x', '15.8x', '¥24.8', 'Among the better-managed lepidolite routes. 1H26 preliminary net profit RMB 0.95-1.15bn (+137~187%, Jul 14) already covers 93% of the 26E consensus — the April estimate is clearly too low and will most likely be raised after the August interim, so treat 21.9x as a ceiling rather than a central case. H1x2 annualized P/E ~11.8x (own calculation). Source: company preliminary / MarketScreener.'],
      ['Chengxin Lithium', '~-622', '~-535', '~859', '~767', '-20x', '-35.1x', '31.1x', '34.8x', '¥26.7', 'High beta; the Indonesian converter is ramping hard and the Sichuan mine has started. 1H26 preliminary net profit RMB 1.0-1.2bn (swing to profit, +219~243%, Jul 9) = 128% of the 26E consensus — the half year alone exceeds the full-year estimate, so 31.1x / 34.8x carry no information. H1x2 annualized P/E ~12.1x (own calculation). Source: company preliminary / Guojin.'],
      ['Yahua Group', '257', '485', '3,030', '3,580', '~108x', '57.7x', '6.7x', '5.7x', '¥20.4', 'Resource-linked model plus LiOH earnings recovery; Soochow (Jul 7) lifted 26-28E net profit to RMB 3.03 / 3.58 / 3.92bn, lithium-salt shipments ~120kt, self-supply up to 25%. 1H26 preliminary net profit RMB 1.1-1.3bn (+710~857%, Jul 7) = 40% of the REVISED 26E — the only name here whose estimate is both refreshed and not yet beaten, which makes its P/E the most readable of the ten. ~RMB 0.3bn of Q1 hedging losses narrowed in Q2. H1x2 annualized P/E ~8.5x (own calculation). Source: company preliminary / Soochow.'],
      ['Tianhua New Energy', '848', '402', '461', '844', '22.8x', '114x', '105.7x', '57.7x', '¥48.7', 'Mine exposure is less directly comparable than pure resource plays. 1H26 preliminary net profit RMB 2.2-2.4bn (swing to profit, +2471~2687%, Jul 10) = 499% of the 26E consensus — the April estimate is comprehensively falsified, so the 105.7x in this row measures how stale that estimate is, not how expensive the stock is. Do not rank on it. H1x2 annualized P/E ~10.6x (own calculation). Source: company preliminary / Xingzheng strategy Jul 9.'],
      ['Youngy', '215', '279', 'N.A.', 'N.A.', '38.5x', '48.2x', 'N.A.', 'N.A.', '¥17.0', 'High-beta western Sichuan exposure; sell-side full-year absolute coverage is still missing, so 26E/27E stay N.A. rather than being filled by extrapolating the half year. 1H26 preliminary net profit RMB 0.9-1.1bn (+957~1192%, Jul 11), driven by concentrate volume and price plus the Chengdu Rongjie associate. H1x2 annualized P/E ~8.5x (own calculation). Source: company preliminary.'],
    ],
    domesticNote:
      'How to read it: on the April consensus this group spans 6.7x to 105.7x on 26E, which looks like enormous dispersion; switch the basis to each company’s own 1H26 preliminary annualized (H1 x 2) and the range collapses to 8.5x-17.1x. Most of the spread in the 26E P/E column is therefore a difference in how fast estimates have been refreshed, not a difference in fundamentals, and that column will be substantially reordered once the August interims land and the sell side updates full-year guidance. On the annualized basis the cheapest are Yahua (8.5x), Youngy (8.5x), Tianhua (10.6x) and Tianqi (10.9x); the most expensive are Zangge (17.1x) and Sinomine (15.3x). Zangge deserves a separate flag: roughly RMB 2.8bn of its RMB 3.55-3.75bn first half is the Julong Copper equity pickup against only ~5.4kt of carbonate output, so ranking it inside a lithium-beta framework gives the wrong answer. The structural conclusion is unchanged: the names closest to "reasonable valuation plus solid resource depth" are Salt Lake, Tianqi, Yahua and Sinomine, and the rerating is concentrated in low-cost brine and integrated leaders raising self-sufficiency rather than spread evenly.',
    globalTitle: 'Global Majors Sample (5 names)',
    globalSubtitle: 'Unit: attributable net profit in USD mn or AUD mn, summarized from company disclosures and consensus framing.',
    globalRows: [
      ['Albemarle', '-1,316', '-677', '1,033', '1,267', '-7.7x', '-24.6x', '25.5x', '20.9x', '—', 'USD; strong resource base, weaker conversion returns. Source: MarketScreener / Albemarle. Close $114.85 (Jul 24, 2026).'],
      ['SQM', '-404', '588', '~1,489', '~1,827', 'N.M.', '~43x', '~17x', '~14x', '—', 'USD; global core low-cost brine asset. Source: SQM / MarketScreener. Close $68.73 (Jul 24, 2026).'],
      ['Pilbara Minerals', '257', '-196', '422', '1,181', '36.3x', '-21.1x', '38.9x', '15.6x', '—', 'AUD; pure hard-rock beta with P1000 as the key catalyst. Source: MarketScreener.'],
      ['Mineral Resources', '114', '-896', '790', '739', '84.3x', '-4.7x', '14.2x', '13.7x', '—', 'AUD; Wodgina / Mt Marion costs are improving. Source: MarketScreener / MinRes.'],
      ['IGO', '2.8', '-954.6', '215', '752.8', '1524x', '-3.31x', '30.5x', '7.76x', '—', 'AUD; conglomerate framing, not a pure lithium line. Source: MarketScreener.'],
    ],
    globalNote:
      'Takeaway: SQM still looks like the cleanest low-cost core asset. Albemarle’s issue is not resource quality but conversion economics, and in February 2026 it announced that the remaining operating Kemerton train would be placed into care and maintenance. Pilbara, MinRes and IGO are closer to Australian hard-rock beta. Note: the global sample keeps April consensus earnings and P/E (no live re-mark for the ASX names); ALB / SQM are updated to the 2026-07-24 close ($114.85 / $68.73). Unlike the A-share sample this group was not re-marked this round, so the two P/E bases are not directly comparable.',
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
