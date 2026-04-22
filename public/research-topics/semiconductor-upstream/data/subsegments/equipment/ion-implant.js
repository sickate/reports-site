import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'ion-implant',
  name: '离子注入设备',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  summary: '标准寡头市场，Axcelis 是很典型的纯方向资产。',
  market: { v2024: 2.8, v2025: 3.1, basis: 'B', note: '相对成熟但高进入门槛，按implant细分市场估算。' },
  companies: [['Applied Materials', 'us'], ['Axcelis', 'us'], ['Sumitomo Heavy Industries', 'jp'], ['Nissin Electric', 'jp']]
});
