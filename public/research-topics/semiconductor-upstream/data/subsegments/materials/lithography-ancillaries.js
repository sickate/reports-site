import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'lithography-ancillaries',
  name: '光刻配套材料',
  flowTo: ['晶圆制造（前道）'],
  summary: '显影液、去胶液、BARC / TARC 与 underlayer 更像一整套工艺协同材料，不该只当作光刻胶的附属品。',
  overview: '配套材料和曝光工艺窗口强绑定，真正的竞争力来自整套配方协同、缺陷控制和客户导入，而不是单一品类的名义产能。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。因为公开单独统计口径较少，这一页采用“总光刻材料减去 photoresist”的工作底稿估算，更适合排序与研究追踪。',
    '市场规模按 TECHCET 总 photolithography materials 扣减 photoresist 估算，2024 / 2025 / 2026E 约 USD 2.06bn / 2.16bn / 2.20bn。中国大陆 2024 年 ancillary 可见口径约 USD 0.19bn，但公开来源质量一般，仅作低置信度参考。'
  ],
  basis: 'B',
  v2024: 2.06,
  v2025: 2.16,
  v2026: 2.2,
  marketNote: '采用总光刻材料减去 photoresist 的工作底稿估算，不是官方单独统计口径。',
  market26Note: '2025 / 2026 为按公开口径差额与 CAGR 机械外推。',
  chinaMarket: {
    previous: '2024',
    current: 'USD 0.19bn',
    note: '中国 ancillary market 公开口径少，且该数字来源质量一般，仅作低置信度参考。',
  },
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Tokyo Ohka (TOK)',
      market: 'jp',
      summary: '显影液、去胶液与光刻胶协同能力强，是最典型的光刻化学平台。',
      tags: ['ancillaries', 'Japan', 'platform'],
    },
    {
      name: 'DuPont',
      market: 'us',
      summary: 'multilayer materials 与光刻配套体系的重要平台型玩家。',
      tags: ['ancillaries', 'US', 'materials platform'],
    },
    {
      name: 'FUJIFILM Holdings',
      market: 'jp',
      summary: '同时覆盖光刻胶、多层材料与后处理化学，工艺协同性强。',
      tags: ['ancillaries', 'Japan', 'platform'],
    },
    {
      name: '安集科技',
      market: 'cn',
      summary: 'A 股高端湿化学与配套材料主线，公司定位更偏平台型工艺化学。',
      tags: ['A股', '配套化学', '平台型'],
    },
    {
      name: '晶瑞电材',
      market: 'cn',
      summary: '国内少数同时卡位光刻胶与配套化学的材料链公司之一。',
      tags: ['A股', 'photoresist', 'ancillaries'],
    },
  ],
});
