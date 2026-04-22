import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'advanced-packaging-polymers',
  name: '先进封装聚合物材料（合计）',
  flowTo: ['先进封装', '封装（后道）'],
  initialOpen: true,
  summary: '把 dielectrics、mold compounds、underfill 和 temporary bonding materials 合并看，更能反映先进封装聚合物材料这一条真正的景气主线。',
  overview: '如果只选一条最值得继续深挖的封装材料主线，这一项优先级很高。它把 advanced packaging 中最关键的聚合物材料放到同一口径里看，更贴近 HBM、Chiplet 和大尺寸封装升级。',
  report: [
    '边界上它属于狭义封装材料，而且明确偏先进封装。这个合并口径更适合做赛道总入口，再向下拆 EMC、Underfill、临时键合和 RDL dielectrics。',
    '市场规模按 advanced packaging polymeric materials 口径重排，2024 / 2025 / 2026E 约 USD 1.60bn / 1.81bn / 2.05bn，其中 2025 / 2026 为按 13.2% CAGR 机械外推。'
  ],
  basis: 'B',
  v2024: 1.6,
  v2025: 1.81,
  v2026: 2.05,
  marketNote: '2024 采用 advanced packaging polymeric materials 公开口径；2025 / 2026E 按 13.2% CAGR 机械外推。',
  market26Note: '2025 / 2026 为按公开 CAGR 机械外推。',
  updateNote: '先进封装主线重排',
  companies: [
    {
      name: 'Henkel',
      market: 'eu',
      summary: 'underfill、die attach 与更多封装胶黏体系的重要平台型玩家。',
      tags: ['packaging polymers', 'EU', 'platform'],
    },
    {
      name: 'Sumitomo Bakelite',
      market: 'jp',
      summary: '塑封料与 advanced packaging polymers 的主线龙头之一。',
      tags: ['EMC', 'Japan', 'packaging polymers'],
    },
    {
      name: 'Resonac',
      market: 'jp',
      summary: '兼具前道化学与后道封装材料，是最典型的平台型映射之一。',
      tags: ['packaging polymers', 'Japan', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: 'A 股 advanced packaging polymers 最直接的映射之一，覆盖 underfill 与封装胶黏体系。',
      tags: ['A股', 'underfill', 'packaging adhesives'],
    },
    {
      name: '华海诚科',
      market: 'cn',
      summary: '塑封料与封装聚合物链条重要标的之一。',
      tags: ['A股', 'EMC', 'packaging polymers'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: 'advanced packaging 化学平台型玩家，临时键合、电镀液和封装材料卡位较多。',
      tags: ['A股', 'platform', 'advanced packaging'],
    },
  ],
});
