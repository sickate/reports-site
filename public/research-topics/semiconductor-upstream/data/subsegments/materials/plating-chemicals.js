import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'plating-chemicals',
  name: '电镀液 / 添加剂 / WLP 湿制程',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'WLP / advanced packaging 的电镀液和添加剂是高密度互连成形的底层化学体系，精细添加剂决定线形和填孔质量。',
  overview: '先进封装从“有无电镀”走向“电镀质量如何”，价值就转到添加剂体系、填孔表现、线形控制和稳定量产能力。',
  report: [
    '边界上它属于狭义封装材料，而且更偏先进封装。和前道湿化学相似，这里真正卖的是工艺窗口和可靠量产，而不是简单的化学品吨数。',
    '当前公开资料缺少独立全球 24 / 25 / 26E 可靠口径，因此页面优先保留赛道定义与投资映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '电镀液 / 添加剂 / WLP 湿制程的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装材料补齐',
  companies: [
    {
      name: 'DuPont',
      market: 'us',
      summary: '先进封装与电子化学平台型玩家，在 plating chemistries 上也有卡位。',
      tags: ['plating chemistries', 'US', 'platform'],
    },
    {
      name: 'JCU',
      market: 'jp',
      summary: '日系精细电镀化学代表公司，是 WLP 化学的重要映射标的。',
      tags: ['plating additives', 'Japan', 'WLP'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: 'A 股最直接的 advanced packaging 电镀液映射之一。',
      tags: ['A股', 'plating chemicals', 'platform'],
    },
    {
      name: '天承科技',
      market: 'cn',
      summary: 'A 股电镀添加剂与精细化学映射标的，适合跟踪先进封装渗透。',
      tags: ['A股', 'plating additives', 'WLP'],
    },
  ],
});
