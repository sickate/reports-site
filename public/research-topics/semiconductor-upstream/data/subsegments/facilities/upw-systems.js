import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'upw-systems',
  name: '超纯水（UPW）系统',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '先进制程对颗粒、离子和有机残留极敏感，UPW 系统是良率底层支撑。',
  market: { v2024: 6.9, v2025: 7.4, basis: 'B', note: '以fab facilities中的水系统和高纯流体子系统为代理口径。' },
  companies: [['Kurita（栗田工业）', 'jp'], ['Organo', 'jp'], ['Nomura Micro Science', 'jp'], ['Ecolab', 'us'], ['METAWATER', 'jp']]
});
