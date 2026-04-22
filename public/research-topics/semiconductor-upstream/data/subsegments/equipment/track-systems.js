import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'track-systems',
  name: '涂胶显影设备（Track）',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '和曝光机强绑定，是光刻良率与节拍控制的关键环节。',
  market: { v2024: 4.8, v2025: 5.5, basis: 'B', note: '按coater/developer track的独立市场盘子估算。' },
  companies: [['Tokyo Electron（TEL）', 'jp'], ['SCREEN Holdings', 'jp'], ['芯源微', 'cn'], ['TAZMO', 'jp'], ['ACM Research', 'us']]
});
