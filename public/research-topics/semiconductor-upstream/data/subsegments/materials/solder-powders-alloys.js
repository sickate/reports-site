import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'solder-powders-alloys',
  name: '铋 / 锡 / 银 / 铟合金粉',
  flowTo: ['封装（后道）'],
  summary: '这层更偏封装焊料与原料上游，不属于狭义封装材料本体，但会影响互连体系的成本与配方选择。',
  overview: '它更像封装材料的原料层而不是材料本体，但在焊料体系升级和配方变化时，仍会对成本和产业链定价产生明显影响。',
  report: [
    '边界上它不属于狭义半导体封装材料，更接近焊料和封装原料上游，所以页面把它单列出来，避免和 underfill、EMC 这类材料混在一起。',
    '公开资料里缺少可靠的独立全球 24 / 25 / 26E 口径，因此页面先保留链条位置与公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '铋 / 锡 / 银 / 铟合金粉的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '原料层补齐',
  companies: [
    {
      name: 'Senju',
      market: 'jp',
      summary: '日系焊料体系代表厂商，可映射上游合金粉与配方能力。',
      tags: ['solder alloys', 'Japan', 'packaging'],
    },
    {
      name: '唯特偶',
      market: 'cn',
      summary: 'A 股焊料体系最直接的映射之一，也能向上看合金粉和配方演进。',
      tags: ['A股', 'solder alloys', 'flux'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '封装材料平台型映射，也能覆盖焊料和原料体系的边际变化。',
      tags: ['A股', 'packaging materials', 'mapping'],
    },
  ],
});
