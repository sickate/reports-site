import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'leadframes',
  name: '引线框架',
  flowTo: ['封装（后道）'],
  summary: '引线框架更偏传统后道封装主材，壁垒在精密冲压 / 蚀刻、镀层与大客户供货稳定性。',
  overview: '它不是先进封装最性感的赛道，但仍是传统封装和大量分立器件的重要基础材料。研究重点在成本、良率和客户结构，而不是单纯看行业景气叙事。',
  report: [
    '边界上它属于狭义封装材料，更贴近传统后道封装，因此页面把它放在“封装（后道）”视图里，而不是强行归到先进封装。',
    '公开资料里缺少足够可靠的独立全球 24 / 25 / 26E 市场口径，所以页面先保留公司映射与边界说明。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '引线框架的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '传统后道材料补齐',
  companies: [
    {
      name: '康强电子',
      market: 'cn',
      summary: 'A 股最直接的引线框架映射标的之一，也覆盖键合丝。',
      tags: ['A股', 'leadframe', 'traditional packaging'],
    },
    {
      name: 'Shinko Electric',
      market: 'jp',
      summary: '除高端载板外，也能映射引线框架等传统封装基础材料能力。',
      tags: ['Japan', 'leadframe', 'packaging'],
    },
  ],
});
