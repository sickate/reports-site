import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'photoresist',
  name: '光刻胶',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '光刻胶不是普通化工品，配方、工艺窗口和客户认证共同构成主壁垒，先进胶仍高度集中。',
  overview: '从 g/i-line 到 KrF、ArF、EUV，技术代际越往前，配方体系、杂质控制和批次一致性要求越高。市场的关键不只是国产替代意愿，而是长期验证后能否稳定量产。',
  report: [
    '边界上它属于前道晶圆制造材料，不属于狭义封装。真正的稀缺能力是先进胶配方、工艺窗口和客户验证，而不是简单的化工产能。',
    '市场规模按 QYResearch 重排，2024 / 2025 / 2026E 约 USD 2.69bn / 2.90bn / 3.13bn，2025 / 2026 为按 7.9% CAGR 机械外推。中国大陆 2024 年可见的广义 photoresist 市场约 USD 1.02bn，但这并不完全等同于前道半导体光刻胶。'
  ],
  basis: 'B',
  v2024: 2.69,
  v2025: 2.9,
  v2026: 3.13,
  marketNote: '2024 采用 QYResearch 半导体 photoresist 口径；2025 / 2026E 按 7.9% CAGR 机械外推。',
  market26Note: '2025 / 2026 为按公开 CAGR 机械外推。',
  chinaMarket: {
    previous: '2024',
    current: 'USD 1.02bn',
    note: '中国大陆口径更偏广义 photoresist 市场，仅作参考。',
  },
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Tokyo Ohka (TOK)',
      market: 'jp',
      summary: '全球光刻胶核心厂商之一，覆盖 g/i-line 到先进节点材料。',
      tags: ['photoresist', 'Japan', 'advanced node'],
    },
    {
      name: 'DuPont',
      market: 'us',
      summary: '先进光刻材料与配套化学平台型玩家。',
      tags: ['photoresist', 'US', 'materials platform'],
    },
    {
      name: 'FUJIFILM Holdings',
      market: 'jp',
      summary: '先进光刻材料平台，胶材与多层材料协同能力强。',
      tags: ['photoresist', 'Japan', 'platform'],
    },
    {
      name: '彤程新材',
      market: 'cn',
      summary: 'A 股光刻胶主线映射，核心看高端胶导入和产品结构升级。',
      tags: ['A股', '光刻胶', '国产替代'],
    },
    {
      name: '晶瑞电材',
      market: 'cn',
      summary: '同时卡位光刻胶与配套化学品，是国内光刻材料链的重要观察标的。',
      tags: ['A股', 'photoresist', '配套材料'],
    },
  ],
});
