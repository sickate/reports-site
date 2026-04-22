import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'cleanroom-epc',
  name: '洁净室 / 机电 / EPC',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '建厂周期、洁净等级、暖通和公用工程一体化能力，往往直接影响产线导入与投产节奏。',
  market: { v2024: 15.8, v2025: 17.0, basis: 'B', note: '按半导体建厂/EPC总盘子中主包与洁净室工程的核心占比映射。' },
  companies: [['Taikisha（太机化）', 'jp'], ['Takasago Thermal', 'jp'], ['CTCI（中鼎工程）', 'tw'], ['亚翔工程', 'tw'], ['JGC Holdings', 'jp']]
});
