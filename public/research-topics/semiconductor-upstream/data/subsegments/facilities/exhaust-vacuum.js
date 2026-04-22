import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'exhaust-vacuum',
  name: '废气治理 / 真空排气',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  summary: '与环保合规、真空稳定性、产线连续运行直接相关，也是先进 fab 的隐形门槛。',
  market: { v2024: 4.6, v2025: 4.9, basis: 'C', note: '以废气治理、真空排气与sub-fab环保投入作为代理拆分。' },
  companies: [['Ebara（荏原）', 'jp'], ['MKS Instruments', 'us'], ['Resonac', 'jp'], ['ULVAC', 'jp'], ['汉钟精机', 'cn']]
});
