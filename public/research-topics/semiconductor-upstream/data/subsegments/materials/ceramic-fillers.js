import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'ceramic-fillers',
  name: '氧化铝 / 氮化硼填料',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '球形氧化铝和氮化硼是高导热封装材料的重要填料，热管理要求越高，这类材料价值越容易被重估。',
  overview: '这条线更偏封装材料上游，但随着热设计成为先进封装的核心议题，导热填料的重要性会持续上升。',
  report: [
    '边界上它属于狭义封装材料里的填料层，和 EMC、underfill、导热界面体系强相关。',
    '公开资料里缺少可靠的独立全球 24 / 25 / 26E 市场口径，因此页面先保留边界与公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '氧化铝 / 氮化硼填料的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装填料补齐',
  companies: [
    {
      name: 'Denka',
      market: 'jp',
      summary: '高性能导热填料与封装材料的重要日系代表。',
      tags: ['alumina', 'boron nitride', 'Japan'],
    },
    {
      name: 'Saint-Gobain',
      market: 'eu',
      summary: '欧洲先进陶瓷与导热材料平台型玩家，可映射封装填料升级。',
      tags: ['ceramic fillers', 'EU', 'thermal management'],
    },
    {
      name: '联瑞新材',
      market: 'cn',
      summary: 'A 股填料主线标的，球形氧化铝等高性能填料是重要看点。',
      tags: ['A股', 'ceramic fillers', 'thermal'],
    },
    {
      name: '国瓷材料',
      market: 'cn',
      summary: '先进陶瓷与高性能粉体平台，也能映射封装导热材料升级。',
      tags: ['A股', 'advanced ceramics', 'fillers'],
    },
  ],
});
