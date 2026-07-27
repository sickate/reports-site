// The data-gap register.
//
// Every entry here is the result of an actual sourcing attempt against the 研报 database
// and free public sources (2026-07-27), not a guess about what might be unavailable.
// These drive the placeholder blocks in the supply / cost / catalysts views AND the
// register table in the method view, so what the page cannot show is stated once, in one
// place, rather than being inferred from an absence.
//
// When a gap is filled, delete its entry and the placeholder disappears with it.

export const GAPS = {
  supplyBridge: {
    kind: 'gap',
    title: '未来 8 个季度概率加权供给桥',
    why: '研报库有项目级事件（复产、检修、出口政策），但没有任何机构发布按季度汇总的新增供给表；'
      + '现有条目多为调研/传闻级，不是公司指引，直接加总会把不同置信度的数字混为一谈。',
    needs: '逐项目的投产/爬坡时间表 + 兑现概率赋值，或一份第三方季度供需平衡表。',
    have: [
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
      '2026-07-27 电池级碳酸锂 14.3 万元/吨（生意社），工业级 14.2 万元/吨',
      '广期所 12 个合约完整期限结构（当前 backwardation，前后价差 −5.0%）',
      '期货连续合约历史可回溯至 2023 年上市',
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
      'SMM 周度库存（2026-07-24）：冶炼厂 13,291 吨、下游 50,708 吨、其他 22,912 吨，现货合计 86,911 吨',
      '大样本周度库存 114,326 吨（周环比 −5,341 吨）',
    ],
  },

  priceScenarios: {
    kind: 'gap',
    title: '熊市 / 基准 / 牛市三情景锂价假设',
    why: '没有任何一家机构发布带标签的三档情景。可得的只有单一一致预期中枢（13–15 万元/吨）'
      + '与市场心理价位区间，把它拆成三档等于替卖方编造它没说过的话。',
    needs: '多家机构的分档假设，或自建情景并明确标注为自有假设。',
    have: [
      '卖方一致预期中枢：13–15 万元/吨',
      '第三方交易区间参考：压制在 16.5 万下方，14.5–15.5 万为市场心理价位',
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
      '津巴布韦锂原矿出口禁令：2027 年 1 月按期执行（已确认，不予延期）',
      '锂电消费税：2026-09-01 起 2%，2027-09-01 起 4%；钠电/固态免征至 2028 年底',
      '出口退税：2027-01-01 全面取消（2026-04-01 已从 9% 降至 6%）',
      '宜春环保核查进行中；枧下窝复产调试中；九零锂业检修至 8 月中旬',
    ],
  },
};

/** Register order for the method view's table. */
export const GAP_REGISTER_ORDER = [
  'supplyDemandBalance', 'costCurve', 'spotHistory',
  'inventoryTurnover', 'supplyBridge', 'priceScenarios', 'catalystFeed',
];
