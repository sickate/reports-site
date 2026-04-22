import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'cleaning-equipment',
  name: '清洗设备',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '在先进存储、多重图形化、EUV 和先进封装里，对良率与缺陷控制极其敏感，是最容易被低估但工艺刚性很强的一类设备。',
  market: {
    v2024: 8.5,
    v2025: 9.8,
    basis: 'B',
    note: '先进节点、多重图形化与先进封装共同提升 single-wafer cleaning、strip / clean 与邻近清洗设备的重要性。'
  },
  detail: {
    title: '清洗设备板块深度拆解',
    intro: '把“清洗设备”分成四层来看：A 看全球主线龙头，B 看特色挑战者与小而专玩家，C 看板块边界外延，D 看 A 股主线与平台映射。阅读上先抓 SCREEN / TEL 这条主线，再往下看中国设备商平台化扩张。',
    updateNote: '当前已补入 11 家公司及统一财务卡；由于很多公司属于平台型设备商，卡片里的营收和利润并不等同于清洗单一业务收入。',
    groups: [
      {
        title: 'A. 全球主线龙头',
        desc: '这一层是清洗设备最核心的供给侧。SCREEN 是最纯主线龙头，TEL 是平台协同最强的第二极，Lam 和 AMAT 则更多从平台能力切入 strip / clean、wet clean 与整线工艺解决方案。',
        companies: [
          {
            name: 'SCREEN Holdings',
            market: 'jp',
            cap: 'USD 12.66B',
            summary: '全球纯清洗龙头，单片 / 槽式 / 刷洗三线领先。',
            tags: ['single-wafer', 'batch', 'spin scrubber', 'EUV', 'advanced packaging'],
            note: '非纯清洗收入；SPE 内亦含 coater / developer、anneal、inspection。',
            segmentExposure: {
              role: '在清洗设备里属于全球最核心主线龙头，但上市公司财务仍包含更广的 SPE 设备组合，不等于 pure-play 清洗主体。',
              revenueShare: { value: '未单独披露', note: '公司公开口径以 SPE 事业部为主，未拆出清洗单项收入。' },
              profitShare: { value: '未单独披露', note: '未按清洗设备单独披露利润或利润率。' },
              source: '公司分部披露 / 产品线口径',
              badges: ['核心主线', '分部口径'],
              note: '如果后续补卖方拆分模型，可以直接在这里写清洗收入占 SPE 或占公司总收入的比例。'
            }
          },
          {
            name: 'Tokyo Electron',
            market: 'jp',
            cap: 'USD 125.04B',
            summary: '全球清洗第二，且平台协同能力最强。',
            tags: ['cleaning system', 'track', 'etch', 'HBM', '2nm'],
            note: '平台型公司 / 非纯清洗收入。',
            segmentExposure: {
              role: '在清洗设备里处于全球第一梯队，是平台型设备巨头中最强的清洗第二极之一。',
              revenueShare: { value: '未单独披露', note: '清洗系统并入更大的产品线组合，未见公司单独给出收入占比。' },
              profitShare: { value: '未单独披露', note: '公司未按清洗单环节披露利润。' },
              source: '公司产品线披露',
              badges: ['平台型', '第一梯队'],
              note: '这里的阅读重点是“清洗在 TEL 版图中的战略地位”，而不是把 TEL 当成单一清洗公司。'
            }
          },
          {
            name: 'Lam Research',
            market: 'us',
            cap: 'USD 223.66B',
            summary: 'Strip / Clean / Bevel / Wet processing 强势平台商。',
            tags: ['strip clean', 'wet clean', 'bevel clean', 'advanced packaging', 'platform'],
            note: '非纯清洗收入；清洗为平台能力的一部分。',
            segmentExposure: {
              role: '在清洗设备里属于“平台能力非常强的主线玩家”，尤其在 strip / bevel / 邻近湿法处理上很关键。',
              revenueShare: { value: '未单独披露', note: '公司以整个平台口径披露，清洗相关收入未单拆。' },
              profitShare: { value: '未单独披露', note: '未见清洗业务独立利润披露。' },
              source: '公司整体财务 + 产品线描述',
              badges: ['平台型', '非纯板块'],
              note: '更适合作为“清洗相关能力权重很高的平台商”理解，而不是湿法清洗 pure-play。'
            }
          },
          {
            name: 'Applied Materials',
            market: 'us',
            cap: 'USD 255.31B',
            summary: '平台型巨头，wet clean exposure 主要通过整线工艺平台体现。',
            tags: ['platform', 'wet clean exposure', 'etch', 'integrated solutions', 'front-end'],
            note: '平台型公司 / 非纯板块收入。',
            segmentExposure: {
              role: '在清洗设备里的地位更偏“平台型整线工艺参与者”，并非传统意义上的纯清洗主机龙头。',
              revenueShare: { value: '未单独披露', note: '公司未将 wet clean 单列为独立收入项目。' },
              profitShare: { value: '未单独披露', note: '利润跟随更大的 Semiconductor Systems 口径披露。' },
              source: '公司分部披露 / 产品线描述',
              badges: ['平台型', '整线方案'],
              note: '后续如果接入卖方模型，可以写成“清洗相关收入约占半导体系统业务的 x%”这种格式。'
            }
          }
        ]
      },
      {
        title: 'B. 特色挑战者与小而专玩家',
        desc: '这组更适合看份额提升和结构性突破。ACM Research 是中国背景下最强的全球挑战者之一，TAZMO 则是小而专的单片清洗与临时键合设备玩家，特点是产品细分、弹性更大、但纯度和流动性都更复杂。',
        companies: [
          {
            name: 'ACM Research',
            market: 'us',
            cap: 'USD 2.51B',
            summary: '中国背景下最强全球挑战者之一，单片湿法 + 先进封装延展明显。',
            tags: ['single-wafer', 'wet clean', 'advanced packaging', 'megasonic', 'China exposure'],
            note: '非纯清洗；亦覆盖电镀、炉管、PECVD 等。',
            segmentExposure: {
              role: '虽然不是完全纯清洗公司，但在湿法清洗环节属于最值得单独跟踪的挑战者之一，清洗权重显著高于多数平台型设备商。',
              revenueShare: { value: '待补', note: '可后续补“清洗及邻近湿法设备占总收入比例”的估算口径。' },
              profitShare: { value: '待补', note: '公司未按清洗单独披露利润，需要研究员估算。' },
              source: '公司产品线口径',
              badges: ['挑战者', '清洗权重高']
            }
          },
          {
            name: 'TAZMO',
            market: 'jp',
            cap: 'USD 0.26B',
            summary: '小而专的单片清洗 / 临时键合 / 涂胶显影设备商。',
            tags: ['single-wafer cleaning', 'CENOTE', 'temporary bonding', 'coater', 'small cap'],
            note: '非纯清洗；半导体生产设备为多产品组合。'
          }
        ]
      },
      {
        title: 'C. 板块边界外延',
        desc: '这一层不属于典型 wet clean 主线，更像清洗板块的外延边界。PSK Holdings 以 dry cleaning / strip 为核心，受益逻辑更多来自去胶、DRAM 和高深宽比结构处理，而不是传统单片湿法清洗。',
        companies: [
          {
            name: 'PSK Holdings',
            market: 'kr',
            cap: 'USD 1.51B',
            summary: '干法清洗 / 去胶特色厂商，位于清洗板块边界外延。',
            tags: ['dry cleaning', 'PR strip', 'DRAM', 'high aspect ratio', 'adjacent clean'],
            note: '更偏 dry cleaning / strip；非典型 wet clean 主线。'
          }
        ]
      },
      {
        title: 'D. A股主线与平台映射',
        desc: 'A 股这边最值得先盯的是盛美上海这条相对更纯的主机主线，再看北方华创、芯源微、华海清科和至纯科技这些通过平台扩张、邻近工艺延展或系统能力切入清洗赛道的映射标的。',
        companies: [
          {
            name: '盛美上海',
            market: 'cn',
            cap: 'RMB 726.63B',
            summary: '中国最纯清洗主机厂之一，正向平台化扩张。',
            tags: ['wet clean', 'megasonic', 'advanced packaging', 'China OEM', 'platformization'],
            note: '非纯清洗；已延伸电镀、炉管、Track、PECVD 等。'
          },
          {
            name: '北方华创',
            market: 'cn',
            cap: 'RMB 3,490.79B',
            summary: '国产平台设备龙头，前道单片 / 背面 / 槽式清洗持续扩张。',
            tags: ['platform', 'cleaning', 'etch', 'deposition', 'China OEM'],
            note: '平台型公司 / 清洗非全部收入；2025E 利润口径分歧较大。'
          },
          {
            name: '芯源微',
            market: 'cn',
            cap: 'RMB 331.19B',
            summary: 'Track 主业之外，前道物理 / 化学清洗与先进封装是重要增量。',
            tags: ['track', 'physical clean', 'chemical clean', 'advanced packaging', 'China OEM'],
            note: '非纯清洗；2025 为业绩快报口径，2026 完整主表预测缺失。'
          },
          {
            name: '华海清科',
            market: 'cn',
            cap: 'RMB 644.14B',
            summary: 'CMP 龙头向 post-CMP / 清洗延伸。',
            tags: ['CMP', 'post-CMP clean', 'wafer thinning', 'platform', 'China OEM'],
            note: '清洗非主收入，仅为平台延伸；2025 为业绩快报口径。',
            segmentExposure: {
              role: '在清洗设备里更适合作为“CMP 向 post-CMP clean 延伸”的邻近玩家，而不是清洗主线整机厂。',
              revenueShare: { value: '未单独披露', note: '清洗仍是平台延展方向，未单拆为独立收入。' },
              profitShare: { value: '未单独披露', note: '利润随公司整体设备平台披露。' },
              source: '公司业务口径',
              badges: ['邻近延伸', '非主收入']
            }
          },
          {
            name: '至纯科技',
            market: 'cn',
            cap: 'RMB 92.41B',
            summary: '高纯系统 + 湿法设备双轮驱动，S300-D 湿法平台推进中。',
            tags: ['high-purity system', 'wet equipment', 'S300-D', 'China OEM', 'mixed exposure'],
            note: '非纯清洗；2024 净利润由年报现金分红总额 / 占比反推；2025 仅有净利一致预期，营收预测主口径不足。'
          }
        ]
      }
    ]
  }
});
