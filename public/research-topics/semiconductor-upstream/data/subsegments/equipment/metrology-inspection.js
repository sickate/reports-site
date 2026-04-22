import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'metrology-inspection',
  name: '量测 / 缺陷检测',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  summary: '与光刻、刻蚀一起决定先进制程能否顺利爬坡。',
  market: { v2024: 12.5, v2025: 14.4, basis: 'B', note: 'process control在先进节点权重提升，检测/量测投入弹性高。' },
  companies: [['KLA', 'us'], ['Hitachi High-Tech', 'jp'], ['Lasertec', 'jp'], ['Onto Innovation', 'us'], ['Camtek', 'us']]
});
