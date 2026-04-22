import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'deposition-equipment',
  name: '薄膜沉积设备（CVD / PVD / ALD / 炉管）',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  summary: '平台型龙头的综合能力很重要，炉管与 ALD 又各自有细分壁垒。',
  market: { v2024: 25.0, v2025: 28.5, basis: 'B', note: '沉积为平台型最大设备环节之一，按deposition cluster大类映射。' },
  companies: [['Applied Materials', 'us'], ['Tokyo Electron（TEL）', 'jp'], ['Lam Research', 'us'], ['Kokusai Electric', 'jp'], ['北方华创', 'cn']]
});
