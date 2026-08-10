// The data-gap register.
//
// Every entry here is the result of an actual sourcing attempt against the 研报 database
// and free public sources (last re-attempted 2026-08-11), not a guess about what might be
// unavailable. Each refresh re-checks them: the 2026-08-11 pass confirmed the cash-cost
// curve and the annual supply/demand balance are still absent from every free source.
// These drive the placeholder blocks in the supply / cost / catalysts views AND the
// register table in the method view, so what the page cannot show is stated once, in one
// place, rather than being inferred from an absence.
//
// When a gap is filled, delete its entry and the placeholder disappears with it.
//
// A PARTIALLY filled gap keeps its entry but must have its wording corrected, because the
// placeholder now sits on the same view as a chart. Phase 5 added six charts; each `have`
// list below therefore states what is now PLOTTED and what is still missing, so no view
// shows a chart and a note claiming that chart cannot be built. The distinction is real and
// worth the words: "we can now show the shape of the futures curve" is not "we can now show
// the spot price history".

export const GAPS = {
  supplyBridge: {
    kind: 'gap',
    title: '未来 8 个季度概率加权供给桥',
    why: '研报库有项目级事件（复产、检修、出口政策），但没有任何机构发布按季度汇总的新增供给表；'
      + '现有条目多为调研/传闻级，不是公司指引，直接加总会把不同置信度的数字混为一谈。',
    needs: '逐项目的投产/爬坡时间表 + 兑现概率赋值，或一份第三方季度供需平衡表。',
    have: [
      '本视图上方的产能构成图已给出静态口径：44 个项目的已投产 1,761.7 kt 与规划合计 3,166.3 kt，'
        + '按生命周期分档。它回答「总量与分布」，但不回答「哪一季度到」——缺的正是时间与概率',
      '枧下窝：2026-06-29 取得非煤矿山安全许可，但财新 2026-08-07 实地核实其**仍处停产检修状态**、复产时点未定；'
        + '环评 2026-08-07 完成公示、待专家评审。上一版此处写的「拟四季度复产」已被证伪，现按停产口径记录',
      'Greenbushes：CGP3 于 2026-06-09 火灾停产约 7 周、2026-08-01 复产，预计 1Q27 满产；'
        + 'IGO 给出 FY27 精矿指引 155–175 万吨（中值同比 +17%）',
      '力拓：Sal de Vida 一期（1.5 万吨 LCE）与 Fénix 1B（1 万吨）2026Q2 提前投产，已计入数据库的 current 口径；FY26 指引 6.1–6.4 万吨 LCE、26H2 环比 +30%',
      '锂盐厂检修：7–9 月合计约 14,000 吨；其中天华新能 8/13 起停产检修（−4,000~4,300 吨）；中矿 6.5 万吨产线已于 8/10 复产',
      '津巴布韦：并非「2027 起禁出口」——2026-02-25 曾全面禁运，2026-04 改配额制有条件放行'
        + '（须承诺 2027-01-01 前建成本地硫酸锂厂 + 10% 出口税），精矿 7 月起恢复到港。'
        + '上一版预期的「8 月起密集到港」未兑现：6 月发运仅 6 万余吨，低于禁令前月均 10 万吨以上',
      '宜春：省级生态环境工作组进驻核查尾矿/渗滤液，重点查借「陶瓷土」证照变相采锂的灰色产能，中小选矿厂大概率阶段性降负荷',
      '缺的仍然是同一样东西：以上每条都能说清「会发生什么」，但没有一条带**季度级时点 + 兑现概率**，因此无法加总成供给桥',
    ],
  },

  costCurve: {
    kind: 'undisclosed',
    title: '全球锂项目现金成本曲线（USD/t LCE）',
    why: '研报库中没有任何一条以 USD/t 或 RMB/t 计的现金成本数字，也没有盐湖／硬岩／云母的分档拆分；'
      + '免费公开源同样不提供。相关讨论只到「成本端还会有比较好的支撑」这类定性表述为止。',
    needs: 'Wood Mackenzie / Benchmark Mineral Intelligence / Fastmarkets 的成本曲线数据（均为付费）。',
    have: [
      '项目数据库的「成本」列保留了各项目的定性成本带描述（低成本 / 中低成本等），未强行伪精确',
      '锂精矿价格可作为硬岩成本的间接锚点：6% 锂精矿 2,045 美元/吨（2026-08-06，东吴引 SMM 周度值）。'
        + '注意这个锚点本身也有口径分歧：国盛 08-02 同一指标报 1,985 美元，两家差约 3%',
    ],
  },

  supplyDemandBalance: {
    kind: 'undisclosed',
    title: '全球锂供需平衡表（kt LCE，2024–2027E）',
    why: '研报库与免费公开源均无任何年度供需平衡表。可得的只有方向性判断：'
      + '「盐端缺口缩窄，需求端略强于供应端，保持紧平衡」「前些年供需相对小幅累库或偏过剩」。',
    needs: '第三方年度供需平衡模型（付费），或自建产能-需求模型并公开全部假设。',
    have: [
      '全球已探明锂储量 3,700 万金属吨（2025 年底），中国占约 12%',
      '需求侧增速可得：27 年锂电池需求增速一致预期 28%–32%',
    ],
  },

  spotHistory: {
    kind: 'gap',
    title: '碳酸锂现货价历史序列',
    why: '现货当日价位可从生意社／Mysteel／SMM 取到，但**没有免费的历史序列**。'
      + '可程序化回溯的只有广期所期货连续合约——用期货历史冒充现货会系统性歪曲基差与波动率。',
    needs: 'SMM / Mysteel 的付费历史数据接口；在此之前只能展示当日价位与期货曲线。',
    have: [
      '「成本与价格」视图已画出广期所期限结构曲线（10 个有公开日线历史的合约，2608–2705）。'
        + '它是某一天的横截面，不是时间序列——能看出当前形态是 backwardation，看不出价格怎么走到这里',
      '覆盖面这次是**变窄**的（上期 11 个：2608–2706）：新浪对 2707/2708 仍无任何日线历史，'
        + '2706 在 2026-08-10 当日无成交。上一版交接文档曾预期「刷到当天后 11/12 合约的口径差会自动消失」，'
        + '实测并没有——远月合约的公开日线历史缺失是结构性的，不是时点问题',
      '2026-08-10 电池级碳酸锂 14.3 万元/吨（生意社），工业级 13.7 万元/吨',
      '这一期恰好演示了「没有历史序列」为什么是真缺口：电池级两个端点都是 14.3 万，看起来什么都没发生，'
        + '实际路径是 08-03 破位到期货 13.556 万、08-04 起 V 型收复。只有端点没有序列，就看不见这段往返',
      '期货连续合约历史可回溯至 2023 年上市，但期货不等于现货，两者基差与波动率不同',
    ],
  },

  inventoryTurnover: {
    kind: 'gap',
    title: '库存周转天数',
    why: '库存**绝对量**有（SMM 周度四分项），但没有任何机构发布周转天数。'
      + '它可以由「库存 ÷ 日消耗」自行测算，但那是我们的计算而非可引用的公开数字，'
      + '口径（是否含冶炼厂在途、日消耗取哪个口径）会显著改变结果。',
    needs: '确定并公开测算口径后自行计算，标注为「自行测算」而非观测值。',
    have: [
      '「成本与价格」视图已画出库存结构图：冶炼厂 15,640 吨、下游 43,439 吨、其他 20,331 吨，'
        + '现货合计 79,410 吨（2026-08-06）。它回答「库存在谁手里」，不回答「够用几天」',
      '大样本周度库存 101,104 吨（两周去库 13,222 吨）；广期所注册仓单 25,042 吨，较 07-24 −37%',
      '本期通过券商周报间接拿到了三期差分（86,911 → 83,587 → 79,410），因此**能说「连续 13 周去库且在加速」**——'
        + '但那是转载来的口径，不是可自主回溯的序列；下一期若某家券商停发，这条链就断了',
      '仍缺的是日消耗口径，以及可自主获取的周度历史——三个点不构成序列，也不足以算周转天数',
    ],
  },

  priceScenarios: {
    kind: 'gap',
    title: '熊市 / 基准 / 牛市三情景锂价假设',
    why: '没有任何一家机构发布带标签的三档情景。可得的只有单一一致预期中枢（13–15 万元/吨）'
      + '与市场心理价位区间，把它拆成三档等于替卖方编造它没说过的话。',
    needs: '多家机构的分档假设，或自建情景并明确标注为自有假设。',
    have: [
      '「成本与价格」视图已画出区间参考图：卖方短期支撑区间 14–15 万、华泰 9 月旺季情景 17–20 万（08-10）、'
        + '本报告 3–6 个月判断 14–17 万，三行并列不合并，叠加当前现货 14.3 万',
      '本期分歧显著变宽：国盛 08-02 说「14 万附近支撑」，华泰 08-10 说「9 月回升至 17–20 万」，'
        + '两者相差 6 万元/吨。区间图能并列展示这种分歧，但仍**不能**把它变成带概率的情景',
      '那张图画的是「几个独立口径的区间」，**不是**熊/基准/牛三档情景——没有机构发布带标签的分档，'
        + '把区间改称情景等于替卖方编造它没说过的话',
      '上一轮周期高点约 60 万元/吨，可作为极端情景的历史锚点',
    ],
  },

  catalystFeed: {
    kind: 'gap',
    title: '结构化催化剂日历与阈值预警',
    why: '事件本身在研报库里是有的，但都是自然语言叙述，没有结构化的日期／标的／影响方向字段，'
      + '也没有可订阅的阈值（价格突破、库存分位）触发机制。',
    needs: '把事件抽取为 {date, projectId, category, impact, source} 结构，并定义阈值规则。',
    have: [
      '本视图上方的政策时间轴已收录 5 条**已正式发布、生效日期确定**的条款：'
        + '《新型电力系统「十五五」规划》2026-08-03 发布（2030 年新型储能 300GW）；'
        + '锂电消费税 2026-09-01 起 2%、2027-09-01 升至 4%；出口退税 2027-01-01 全面取消；'
        + '津巴布韦 2027-01-01 本地硫酸锂厂建成期限',
      '本期修正了轴上一条**错误**：津巴布韦 2027-01 原本被记为「原矿出口禁令生效日」，'
        + '实为配额制下的本地建厂期限——禁令 2026-02-25 就已实施并在 2026-04 有条件解除。'
        + '这提示确定生效日的政策也会被误读，条款的**性质**和日期同样需要复核',
      '仍缺的是另一半：宜春环保核查、枧下窝复产调试、锂盐厂检修这类**需要赋兑现概率**的运营事件。'
        + '把它们与确定生效日的政策画在同一根轴上，会让前者看起来和后者一样确定',
      '也仍缺阈值触发机制（价格突破、库存分位），那需要可订阅的规则而不只是一份清单',
    ],
  },
};

/** Register order for the method view's table. */
export const GAP_REGISTER_ORDER = [
  'supplyDemandBalance', 'costCurve', 'spotHistory',
  'inventoryTurnover', 'supplyBridge', 'priceScenarios', 'catalystFeed',
];
