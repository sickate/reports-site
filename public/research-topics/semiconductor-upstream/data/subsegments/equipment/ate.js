import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'ate',
  name: 'ATE 测试设备',
  section: '设备',
  flowTo: ['测试 / 出货'],
  summary: 'AI / HBM / HPC 周期里价值抬升明显，双寡头属性突出。',
  market: { v2024: 7.8, v2025: 8.4, basis: 'A', note: '参考ATE公开市场规模，AI/HBM带来高端测试机需求上行。' },
  companies: [['Advantest', 'jp'], ['Teradyne', 'us'], ['Cohu', 'us'], ['Chroma ATE（致茂）', 'tw'], ['东京精密', 'jp']]
});
