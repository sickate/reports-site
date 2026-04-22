import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'rdl-dielectrics',
  name: 'RDL 光刻 / PI / PBO',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'RDL 光刻胶、PI / PBO 绝缘层与 dry film 直接决定先进封装重布线密度与层间可靠性。',
  overview: '这条材料线是先进封装里最典型的“看起来细、实则很关键”的环节。重布线层数、线宽线距和可靠性提升，都会持续抬高它的重要性。',
  report: [
    '边界上它属于狭义封装材料，而且明确偏先进封装。它和 ABF、underfill、电镀液一样，都是 HBM / Chiplet 链条里需要单独跟踪的材料节点。',
    '当前公开资料里缺少可靠的独立全球 24 / 25 / 26E 市场规模，因此页面先保留边界和代表公司的映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'RDL 光刻 / PI / PBO 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装材料补齐',
  companies: [
    {
      name: 'DuPont',
      market: 'us',
      summary: 'PI / PBO 和更多 advanced packaging dielectrics 的重要平台型玩家。',
      tags: ['RDL', 'PI', 'US', 'platform'],
    },
    {
      name: 'FUJIFILM Holdings',
      market: 'jp',
      summary: '从光刻到 advanced packaging materials 的平台型映射。',
      tags: ['RDL', 'photo materials', 'Japan'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '在晶圆级封装材料侧卡位清晰，是 RDL / plating / bonding 的平台映射。',
      tags: ['A股', 'RDL', 'platform'],
    },
    {
      name: '彤程新材',
      market: 'cn',
      summary: '除前道光刻胶外，也能映射封装侧 RDL 相关材料升级。',
      tags: ['A股', 'RDL', 'photo materials'],
    },
  ],
});
