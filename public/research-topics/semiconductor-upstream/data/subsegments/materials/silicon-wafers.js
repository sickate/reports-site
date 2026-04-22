import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'silicon-wafers',
  name: '硅片',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '300mm 抛光片、外延片和 SOI 仍是前道材料里壁垒最高的一档，真正的卡点在高规格工艺与长认证周期。',
  overview: '硅片不只是“卖片子”，而是晶体生长、切磨抛、外延、缺陷控制和客户导入的系统能力。高端 12 英寸、SOI 和外延片的认证周期长，供给侧长期由少数台日厂商主导。',
  report: [
    '边界上它属于典型前道晶圆制造材料，不属于狭义半导体封装。真正值得看的不是名义产能，而是高规格产品良率、客户验证和产品结构升级。',
    '市场规模沿用 SEMI / SMG 口径，2024 / 2025 分别约 USD 11.5bn / 11.4bn，2026 暂未见统一公开值。你给出的“约 50%”更适合作为整体硅片自给率参考，不能直接外推到先进 300mm 抛光片、外延片或 SOI。'
  ],
  basis: 'A',
  v2024: 11.5,
  v2025: 11.4,
  v2026: null,
  marketNote: '采用 SEMI / SMG 公开收入口径；短期受库存与稼动率影响，但高规格大硅片壁垒没有变化。',
  market26Note: '2026 暂无统一公开锚点，因此保留空白。',
  localization: {
    previous: '整体自给率口径',
    current: '约50%',
    note: '先进 300mm、外延片和 SOI 的真实国产化率显著低于这一数字。',
  },
  updateNote: '前道主线重排',
  groupDesc: '先看全球寡头，再看台系国际化平台与 A 股国产替代。',
  companies: [
    {
      name: 'Shin-Etsu Chemical',
      market: 'jp',
      summary: '全球高端硅片双寡头之一，强在 12 英寸、大客户认证与综合材料体系。',
      tags: ['12-inch', 'Japan', 'prime wafer'],
    },
    {
      name: 'SUMCO',
      market: 'jp',
      summary: '全球 12 英寸硅片核心纯赛道玩家，是观察行业景气与扩产节奏的主线标的。',
      tags: ['12-inch', 'advanced node', 'Japan'],
    },
    {
      name: 'GlobalWafers（环球晶）',
      market: 'tw',
      summary: '最重要的台系国际化硅片平台之一，跨地区产能和特殊规格片布局完整。',
      tags: ['Taiwan', 'specialty wafers', 'global capacity'],
    },
    {
      name: '沪硅产业',
      market: 'cn',
      summary: 'A 股大硅片主线标的，核心看高规格产品验证、良率与客户突破。',
      tags: ['A股', '国产替代', '12-inch'],
    },
  ],
});
