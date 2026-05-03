import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'sputtering-targets',
  name: '溅射靶材',
  section: '材料',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '高纯靶材是典型的寡头材料，难点不在金属本身，而在纯度、组织控制和长认证周期。',
  market: {
    v2024: 1.33,
    v2025: 1.45,
    basis: 'B',
    note: '2025 采用 TECHCET semiconductor sputtering target 口径，2024 回推，2026E 按 7% CAGR 机械外推。'
  },
  detail: {
    title: '溅射靶材板块深度拆解',
    intro: '把“溅射靶材”拆成四层来看：A 看全球主线龙头，B 看平台与协同玩家，C 看 A 股最纯主线，D 看 A 股平台映射与子公司资产。',
    updateNote: '靶材已经切到统一深拆结构；后续如果补更多子公司维度数据，可以继续挂在 D 组的平台映射卡下。',
    groups: [
      {
        title: 'A. 全球主线龙头',
        desc: '这一层是高纯靶材真正的全球主线。关键不只是市场份额，还包括高纯提炼、组织均匀性、绑定件工艺、稳定量产和长认证能力。',
        companies: [
          {
            name: 'JX Advanced Metals',
            market: 'jp',
            cap: 'USD 21.50B',
            summary: '全球半导体高端金属靶材主线龙头之一，AI 相关需求下继续扩产。',
            tags: ['semiconductor targets', 'thin film materials', 'Japan', 'oligopoly'],
            note: '非纯靶材收入；市值为母公司整体。'
          },
          {
            name: 'Materion',
            market: 'us',
            cap: 'USD 2.48B',
            summary: '北美高纯金属 / 靶材核心供应商，电子材料业务具备半导体靶材敞口。',
            tags: ['high purity metals', 'electronic materials', 'US', 'specialty materials'],
            note: '平台型材料公司，非纯靶材。'
          },
          {
            name: 'Tosoh',
            market: 'jp',
            cap: 'USD 4.86B',
            summary: '日本老牌化工材料龙头，Tosoh SMD 为全球重要靶材品牌。',
            tags: ['sputtering targets', 'Tosoh SMD', 'Japan', 'specialty chemicals'],
            note: '非纯靶材收入；靶材属 specialty 材料体系。'
          },
          {
            name: 'Mitsui Mining & Smelting',
            market: 'jp',
            cap: 'USD 13.77B',
            summary: '日本综合材料龙头，PVD Materials 为重要靶材 / 薄膜材料平台。',
            tags: ['PVD materials', 'Japan', 'advanced materials', 'platform company'],
            note: '非纯靶材收入；PVD Materials 只是分部。'
          }
        ]
      },
      {
        title: 'B. 平台与协同玩家',
        desc: '这一层更适合看“设备 + 材料”协同和平台型材料公司，而不是纯靶材收入。研究重点是其在半导体靶材链里的战略卡位。',
        companies: [
          {
            name: 'ULVAC',
            market: 'jp',
            cap: 'USD 2.76B',
            summary: '兼具真空设备与靶材材料能力，属于“设备 + 材料”协同玩家。',
            tags: ['vacuum equipment', 'sputtering targets', 'Japan', 'equipment+materials'],
            note: '非纯靶材；核心收入仍来自设备。'
          },
          {
            name: 'Honeywell',
            market: 'us',
            cap: 'USD 124.65B',
            summary: '平台型工业材料公司，半导体材料只是 Advanced Materials 业务线一部分。',
            tags: ['semiconductor materials', 'platform company', 'US', 'diversified'],
            note: '业务重要，但非独立靶材上市主体；不建议用集团整体财务代表靶材业务。'
          }
        ]
      },
      {
        title: 'C. A股最纯主线',
        desc: 'A 股里最接近 pure-play 靶材叙事的核心主线，关键看国产替代、先进制程验证和向零部件延展后的估值体系变化。',
        companies: [
          {
            name: '江丰电子',
            market: 'cn',
            cap: 'RMB 409.52B',
            summary: '国产半导体溅射靶材龙头，向零部件与静电卡盘延伸。',
            tags: ['domestic substitution', 'semiconductor targets', 'China', 'precision parts'],
            note: '靶材最纯 A 股主线之一，但近年零部件占比也在提升。'
          }
        ]
      },
      {
        title: 'D. A股平台映射与子公司资产',
        desc: '这组更适合按平台映射去读，核心不是它们“是不是纯靶材公司”，而是靶材资产在上市平台中的位置、纯度和兑现路径。',
        companies: [
          {
            name: '有研新材',
            market: 'cn',
            cap: 'RMB 186.75B',
            summary: '平台型新材料公司，半导体靶材核心资产为全资子公司有研亿金。',
            tags: ['Grikin', 'thin film materials', 'China', 'platform company'],
            note: '非纯靶材收入；更应关注有研亿金而不是上市平台整体。'
          },
          {
            name: '阿石创',
            market: 'cn',
            cap: 'RMB 57.92B',
            summary: '国内 PVD 靶材 / 镀膜材料玩家，覆盖显示、光伏与部分半导体材料。',
            tags: ['PVD materials', 'China', 'thin film', 'platform'],
            note: '更偏广义靶材 / 镀膜材料平台，半导体纯度低于江丰 / 有研亿金。'
          },
          {
            name: '隆华科技',
            market: 'cn',
            cap: 'RMB 95.95B',
            summary: '平台型新材料公司，靶材是其新材料板块的重要组成部分。',
            tags: ['sputtering target', 'China', 'new materials', 'platform'],
            note: '非纯靶材；集团业务较杂。'
          }
        ]
      }
    ]
  }
});
