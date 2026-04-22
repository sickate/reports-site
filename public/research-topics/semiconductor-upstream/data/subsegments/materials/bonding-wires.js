import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'bonding-wires',
  name: '键合丝',
  flowTo: ['封装（后道）'],
  summary: '键合丝是典型的成熟但不低门槛材料，Au / Cu / Ag / Pd-coated wire 的制程稳定性与客户导入是核心。',
  overview: '这个赛道成熟，但不代表没有壁垒。材料纯度、拉丝工艺和客户验证仍决定产品结构与盈利质量。',
  report: [
    '边界上它属于狭义封装材料，更贴近传统后道封装。虽然市场关注度低于先进封装聚合物或载板，但在成熟封装里仍是基本盘。',
    '独立全球 24 / 25 / 26E 公开口径不足，因此页面不强行估值，只保留公司映射与赛道边界。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '键合丝的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '传统后道材料补齐',
  companies: [
    {
      name: 'MK Electron',
      market: 'kr',
      summary: '韩股键合丝主线映射之一，适合跟踪 wire bond 生态。',
      tags: ['bonding wire', 'Korea', 'packaging'],
    },
    {
      name: '康强电子',
      market: 'cn',
      summary: 'A 股里同时覆盖引线框架和键合丝的最直接映射标的之一。',
      tags: ['A股', 'bonding wire', 'leadframe'],
    },
  ],
});
