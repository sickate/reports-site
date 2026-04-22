import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'die-attach-materials',
  name: 'DAF / 银胶 / 银烧结',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '固晶膜、导电胶与银烧结共同决定 die attach 的热阻、可靠性与功率器件上限。',
  overview: '这条赛道横跨传统封装、先进封装和功率半导体，关键不是材料名词，而是热阻、导电性、工艺适配和长期可靠性。',
  report: [
    '边界上它属于狭义封装材料。随着功率器件和高热流密度封装升级，银烧结和高性能 die attach 材料的重要性会继续提升。',
    '独立全球 24 / 25 / 26E 公开口径不足，因此页面先保留材料形态与代表公司，不强行做工作底稿以外的规模估算。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'DAF / 银胶 / 银烧结的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装材料补齐',
  companies: [
    {
      name: 'Henkel',
      market: 'eu',
      summary: '封装胶黏与 die attach 平台型龙头，覆盖 DAF 与导电胶体系。',
      tags: ['DAF', 'EU', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: 'A 股里更直接映射 DAF / underfill / 固晶材料升级的公司之一。',
      tags: ['A股', 'DAF', 'packaging adhesives'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '封装材料平台型映射，能覆盖导电胶和更多封装化学。',
      tags: ['A股', 'silver paste', 'platform'],
    },
  ],
});
