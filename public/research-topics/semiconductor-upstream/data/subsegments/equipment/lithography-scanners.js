import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'lithography-scanners',
  name: '光刻曝光机',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '先进曝光几乎被 ASML 主导，全球真实格局接近三强寡头。',
  market: { v2024: 24.0, v2025: 27.5, basis: 'B', note: '以曝光设备为最核心单体设备大类，参考龙头收入与WFE结构映射。' },
  companies: [['ASML', 'us'], ['Nikon', 'jp'], ['Canon', 'jp']]
});
