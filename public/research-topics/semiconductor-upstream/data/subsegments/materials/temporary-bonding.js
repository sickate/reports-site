import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'temporary-bonding',
  name: '临时键合 / 解键合',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '临时键合 / 解键合是晶圆级先进封装与薄化工艺的关键胶黏体系，真正的卡点在制程窗口与可逆剥离性能。',
  overview: '晶圆越薄、层数越高、工艺越复杂，对 temporary bond / debond 的要求就越高。这条材料线和先进封装良率直接相关。',
  report: [
    '边界上它属于狭义封装材料，而且更偏先进封装。和普通胶黏剂不同，它真正卖的是工艺窗口和可控解键合能力。',
    '当前公开资料里缺少独立全球 24 / 25 / 26E 市场规模，因此页面只保留赛道边界与代表公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '临时键合 / 解键合的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装聚合物补齐',
  companies: [
    {
      name: 'DuPont',
      market: 'us',
      summary: 'advanced packaging 材料平台型玩家，临时键合体系是其重要能力之一。',
      tags: ['temporary bonding', 'US', 'platform'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: 'A 股最直接的临时键合 / 电镀液 / 封装材料平台映射之一。',
      tags: ['A股', 'temporary bonding', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: '封装胶黏剂与 underfill 体系玩家，也能映射临时键合升级。',
      tags: ['A股', 'packaging adhesives'],
    },
  ],
});
