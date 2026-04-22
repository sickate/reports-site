import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'rf-power-matching',
  name: 'RF 电源 / 匹配器',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  summary: '刻蚀与沉积的关键子系统，直接影响等离子体工艺一致性和重复性。',
  market: { v2024: 3.74, v2025: 4.28, basis: 'A', note: '参考半导体RF power supply公开市场锚点，并扩展到匹配器配套。' },
  companies: [['Advanced Energy', 'us'], ['MKS Instruments', 'us'], ['DAIHEN', 'jp'], ['ULVAC', 'jp'], ['JEOL', 'jp']]
});
