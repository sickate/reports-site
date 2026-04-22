import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'electronic-gases',
  name: '电子特气',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '电子特气更像工艺基础设施，高纯度、混配能力、现场供气与认证站点共同决定壁垒。',
  overview: '这个环节的难点不是“卖气”，而是卖一整套经过客户验证的供气体系。先进制程越复杂，对纯度、稳定性、危化管理和现场系统的要求越高。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。真正的定价权不只来自气体配方，还来自全球交付网络、现场供气系统和长期认证关系。',
    '市场规模按 TECHCET 口径整理，2024 / 2025 约 USD 6.05bn / 6.34bn，2026 暂未见统一公开值。中国大陆 2025 年可见市场规模约 RMB 31.66bn，更适合看本土渗透与站点建设能力。'
  ],
  basis: 'B',
  v2024: 6.05,
  v2025: 6.34,
  v2026: null,
  marketNote: '2025 采用 TECHCET 电子特气口径，2024 由同比回推；2026 暂未见统一公开锚点。',
  market26Note: '2026 暂无统一公开锚点，因此保留空白。',
  chinaMarket: {
    previous: '2025',
    current: 'RMB 31.66bn',
    note: '中国电子特气市场采用券商转引 TECHCET 的口径。',
  },
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Linde',
      market: 'us',
      summary: '全球电子气体和现场供气平台型龙头，强在跨地区供给网络与纯化能力。',
      tags: ['electronics gases', 'US', 'platform'],
    },
    {
      name: 'Air Products',
      market: 'us',
      summary: '高纯电子气体与现场系统核心玩家之一。',
      tags: ['electronics gases', 'US', 'onsite supply'],
    },
    {
      name: 'Air Liquide',
      market: 'eu',
      summary: '欧洲电子气体与供气系统主线平台，先进材料协同能力强。',
      tags: ['electronics gases', 'EU', 'platform'],
    },
    {
      name: '华特气体',
      market: 'cn',
      summary: 'A 股电子特气代表标的，核心看高纯气体与客户认证扩张。',
      tags: ['A股', '电子特气', '国产替代'],
    },
    {
      name: '中船特气',
      market: 'cn',
      summary: '国内电子特气主线玩家之一，偏高纯气与多品类扩张。',
      tags: ['A股', '电子特气'],
    },
    {
      name: '凯美特气',
      market: 'cn',
      summary: '更适合作为国内气体链条的边际映射和弹性跟踪标的。',
      tags: ['A股', '映射', '气体'],
    },
  ],
});
