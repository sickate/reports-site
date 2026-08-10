// The data-gap register.
//
// Every entry here is the result of an actual sourcing attempt against the 研报 database
// and free public sources (2026-07-27), not a guess about what might be unavailable.
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
      '本视图上方的产能构成图已给出静态口径：44 个项目的已投产 1,736.7 kt 与规划合计 3,166.3 kt，'
        + '按生命周期分档。它回答「总量与分布」，但不回答「哪一季度到」——缺的正是时间与概率',
      '枧下窝：6/29 取得非煤矿山安全许可，前三个月为恢复调试期；26 年最后两个月产出约达规划产能 60%（4–5 千吨）；恢复 10 万吨级规划产能要到 27 年之后',
      '九零锂业：7 月中旬–8 月中旬停产检修技改，减少约 4,000 吨电池级碳酸锂',
      '津巴布韦：锂原矿出口禁令确定 2027 年 1 月按期执行、不予延期；大批量到港最早 8 月上旬形成实质影响',
      '宜春：省级生态环境工作组进驻核查尾矿/渗滤液，中小选矿厂大概率阶段性降负荷',
      '南美：盐湖冬季叠加智利港口罢工，Q3 到港量减少',
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
      '锂精矿价格可作为硬岩成本的间接锚点：6% 锂精矿 2,130 美元/吨（2026-07-23）',
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
      '「成本与价格」视图已画出广期所期限结构曲线（11 个有公开日线历史的合约，2608–2706）。'
        + '它是某一天的横截面，不是时间序列——能看出当前形态是 backwardation，看不出价格怎么走到这里',
      '2026-07-27 电池级碳酸锂 14.3 万元/吨（生意社），工业级 14.2 万元/吨',
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
      '「成本与价格」视图已画出库存结构图：冶炼厂 13,291 吨、下游 50,708 吨、其他 22,912 吨，'
        + '现货合计 86,911 吨。它回答「库存在谁手里」，不回答「够用几天」',
      '大样本周度库存 114,326 吨（周环比 −5,341 吨）',
      '仍缺的是日消耗口径，以及周度历史——单周切片无法算出趋势',
    ],
  },

  priceScenarios: {
    kind: 'gap',
    title: '熊市 / 基准 / 牛市三情景锂价假设',
    why: '没有任何一家机构发布带标签的三档情景。可得的只有单一一致预期中枢（13–15 万元/吨）'
      + '与市场心理价位区间，把它拆成三档等于替卖方编造它没说过的话。',
    needs: '多家机构的分档假设，或自建情景并明确标注为自有假设。',
    have: [
      '「成本与价格」视图已画出区间参考图：卖方一致预期中枢 13–15 万、市场心理价位 14.5–15.5 万、'
        + '本报告 3–6 个月判断 14–16 万，三行并列不合并，叠加当前现货 14.3 万',
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
      '本视图上方的政策时间轴已收录 4 条**已正式发布、生效日期确定**的条款：'
        + '锂电消费税 2026-09-01 起 2%、2027-09-01 升至 4%；出口退税 2027-01-01 全面取消；'
        + '津巴布韦锂原矿出口禁令 2027-01 按期执行',
      '仍缺的是另一半：宜春环保核查、枧下窝复产调试、九零锂业检修这类**需要赋兑现概率**的运营事件。'
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
