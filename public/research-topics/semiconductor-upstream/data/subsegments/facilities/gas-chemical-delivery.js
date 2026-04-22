import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'gas-chemical-delivery',
  name: '特气 / 化学品供配系统',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  summary: '核心不止是“卖气”，更在于储存、输送、纯化、阀件、流量控制与系统级安全。',
  market: { v2024: 6.6, v2025: 7.1, basis: 'B', note: '对应特气柜、阀件、化学品输送及二次配系统投入。' },
  companies: [['Entegris', 'us'], ['MKS Instruments', 'us'], ['CKD', 'jp'], ['KITZ', 'jp'], ['Ebara（荏原）', 'jp']]
});
