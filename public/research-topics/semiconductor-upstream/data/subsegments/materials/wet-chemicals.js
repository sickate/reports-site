import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'wet-chemicals',
  name: '湿电子化学品',
  flowTo: ['晶圆制造（前道）'],
  summary: '高纯湿电子化学品的核心是纯化、批次稳定性和现场交付，普通化工产能很难直接迁移到高端制程。',
  overview: 'HF、H2SO4、H2O2、TMAH 以及各类功能性清洗液，看上去像普通化学品，实则高度依赖纯化、杂质控制、危化物流和现场服务体系。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。高端环节的关键不在品类多少，而在超高纯度、稳定批次和客户端长周期导入。',
    '市场规模按 TECHCET wet chemicals & specialty cleans 口径重排，2024 / 2025 / 2026E 约 USD 5.13bn / 5.44bn / 5.77bn，适合和清洗、CMP 前后处理协同去看。'
  ],
  basis: 'B',
  v2024: 5.13,
  v2025: 5.44,
  v2026: 5.77,
  marketNote: '采用 TECHCET wet chemicals & specialty cleans 口径；2024 回推，2026E 按 6% CAGR 机械外推。',
  market26Note: '2026E 由 2024-2029 CAGR 机械外推。',
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Entegris',
      market: 'us',
      summary: '高纯材料与过滤纯化平台，是湿法化学和相关纯化体系的重要玩家。',
      tags: ['wet chemicals', 'US', 'platform'],
    },
    {
      name: 'Stella Chemifa',
      market: 'jp',
      summary: '高纯氟系化学主线公司，HF / BHF 等产品在半导体应用里卡位清晰。',
      tags: ['HF', 'Japan', 'high purity'],
    },
    {
      name: 'Mitsubishi Chemical',
      market: 'jp',
      summary: '综合化学平台里的半导体湿化学重要供应方。',
      tags: ['wet chemicals', 'Japan', 'platform'],
    },
    {
      name: '江化微',
      market: 'cn',
      summary: 'A 股湿电子化学品代表标的，核心看高等级产品导入和客户扩张。',
      tags: ['A股', '湿电子化学品', '国产替代'],
    },
    {
      name: '格林达',
      market: 'cn',
      summary: '国内高纯湿化学链条重要玩家之一，更适合放在本土供应链里看。',
      tags: ['A股', '高纯化学'],
    },
    {
      name: '安集科技',
      market: 'cn',
      summary: '虽然更出名的是 CMP，但本质上是高端工艺化学平台，也能映射湿化学升级。',
      tags: ['A股', '平台型', '工艺化学'],
    },
  ],
});
