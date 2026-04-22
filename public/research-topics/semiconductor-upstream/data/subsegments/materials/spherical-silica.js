import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'spherical-silica',
  name: '球形硅微粉',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '球形硅微粉是 EMC、underfill 和更多封装填料体系里的关键低膨胀填充料，决定热稳定与流变表现。',
  overview: '市场往往更后知后觉，但它是先进封装聚合物材料的重要底层填料。随着封装热管理和翘曲控制要求提升，填料的重要性会被不断抬高。',
  report: [
    '边界上它属于狭义封装材料，更准确地说，是封装聚合物材料里的关键填料层。',
    '公开资料里缺少可靠的独立全球 24 / 25 / 26E 市场规模，因此页面先保留公司映射，不做过度精确化。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '球形硅微粉的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装填料补齐',
  companies: [
    {
      name: 'Denka',
      market: 'jp',
      summary: '高性能封装填料与先进材料的重要日系玩家。',
      tags: ['spherical silica', 'Japan', 'fillers'],
    },
    {
      name: '联瑞新材',
      market: 'cn',
      summary: 'A 股球形硅微粉最直接的映射标的之一。',
      tags: ['A股', 'spherical silica', 'fillers'],
    },
  ],
});
