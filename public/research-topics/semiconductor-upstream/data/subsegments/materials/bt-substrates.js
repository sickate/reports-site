import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'bt-substrates',
  name: 'BT 树脂 / BT 基板',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'BT resin / laminate 是封装基板体系的底层材料，更偏传统与中高端封装平台的基础盘。',
  overview: '和 ABF 相比，BT 更接近传统与中高端封装基板的基础材料层。它的研究重点不在“最先进”，而在稳定供给、树脂体系和基板材料卡位。',
  report: [
    '边界上它属于狭义封装材料。和 ABF 不同，BT 更像封装基板体系的基础盘，适合结合传统封装、存储和中高端基板去看。',
    '当前公开口径里缺少足够可靠、可交叉验证的独立全球 24 / 25 / 26E 市场规模，因此页面暂留空白，优先保留边界与公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'BT resin / BT laminate 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装基础盘补齐',
  companies: [
    {
      name: 'Mitsubishi Gas Chemical',
      market: 'jp',
      summary: 'BT resin / BT laminate 体系代表厂商，是这条链最典型的材料龙头。',
      tags: ['BT resin', 'Japan', 'packaging materials'],
    },
    {
      name: 'Panasonic',
      market: 'jp',
      summary: '日本材料平台里 BT 与相关基板材料的重要供给方。',
      tags: ['BT substrate', 'Japan', 'materials platform'],
    },
    {
      name: 'Nan Ya Plastics',
      market: 'tw',
      summary: '台系 BT / laminate 体系的重要映射标的。',
      tags: ['BT substrate', 'Taiwan', 'laminate'],
    },
  ],
});
