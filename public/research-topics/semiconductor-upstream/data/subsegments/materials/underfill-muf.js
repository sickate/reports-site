import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'underfill-muf',
  name: 'Underfill / MUF',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'Underfill / MUF 直接决定先进封装互连可靠性，是 HBM、2.5D / 3D 和大尺寸封装里的关键聚合物材料。',
  overview: '这条赛道越往先进封装走，价值越高。材料不仅要解决空隙填充，还要兼顾热应力、界面可靠性和大尺寸封装的长期稳定性。',
  report: [
    '边界上它属于狭义封装材料，而且是先进封装里最值得继续拆细的一档聚合物材料。',
    '当前公开资料中缺少可靠的独立全球 24 / 25 / 26E 市场规模，所以页面先保留赛道优先级与公司映射，不做机械外推。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'Underfill / MUF 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装聚合物补齐',
  companies: [
    {
      name: 'Henkel',
      market: 'eu',
      summary: '全球 underfill / die attach / 封装胶黏体系的重要平台型玩家。',
      tags: ['underfill', 'EU', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: 'A 股最直接的底部填充与封装胶黏剂映射标的之一。',
      tags: ['A股', 'underfill', 'packaging adhesives'],
    },
    {
      name: '华海诚科',
      market: 'cn',
      summary: '除塑封料外，也能映射 underfill / MUF 体系升级。',
      tags: ['A股', 'underfill', 'EMC'],
    },
  ],
});
