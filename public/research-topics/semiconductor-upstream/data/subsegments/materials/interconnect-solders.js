import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'interconnect-solders',
  name: '互连焊料',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '锡球、锡膏、助焊剂与预成型焊片是互连成形的基础材料，先进封装里可靠性与热循环能力更关键。',
  overview: '互连焊料看起来更成熟，但在高 I/O、高热流密度和更严苛可靠性条件下，材料配方与工艺窗口仍会持续升级。',
  report: [
    '边界上它属于狭义封装材料。对传统后道封装和先进封装都重要，但先进封装阶段更看重焊点可靠性、热循环表现和细间距成形能力。',
    '当前公开口径里缺少可靠的独立全球 24 / 25 / 26E 市场规模，因此页面优先保留赛道边界和代表公司的投资映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '互连焊料的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装材料补齐',
  companies: [
    {
      name: 'Senju',
      market: 'jp',
      summary: '日系焊锡材料代表厂商，覆盖锡膏、焊锡料与相关互连材料。',
      tags: ['solder', 'Japan', 'packaging'],
    },
    {
      name: '唯特偶',
      market: 'cn',
      summary: 'A 股最直接的锡膏 / 焊锡料 / 助焊剂映射标的之一。',
      tags: ['A股', 'solder paste', 'flux'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '在封装材料侧同时覆盖锡球、助焊剂和更多封装化学，是平台型映射。',
      tags: ['A股', 'packaging materials', 'platform'],
    },
  ],
});
