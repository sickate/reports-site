import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'advanced-packaging-equipment',
  name: '先进封装设备（键合 / 塑封 / 切磨）',
  section: '设备',
  flowTo: ['先进封装'],
  summary: 'AI 周期中常常比前道设备更早体现弹性。',
  market: { v2024: 6.0, v2025: 8.2, basis: 'B', note: 'AI/HBM推动bonder、molder、dicing/grinding设备扩容，弹性更高。' },
  companies: [['ASMPT', 'hk'], ['Kulicke & Soffa', 'us'], ['Hanmi Semiconductor', 'kr'], ['TOWA', 'jp'], ['DISCO', 'jp']]
});
