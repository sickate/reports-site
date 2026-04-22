import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'molding-compounds',
  name: 'EMC / GMC / LMC',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '模塑 / 塑封材料正在从传统 EMC 向颗粒状与液态体系延伸，先进封装对热管理和应力控制要求更高。',
  overview: '这条赛道最容易被市场低估，因为它同时影响封装可靠性、应力管理、翘曲和热性能。HBM 与大尺寸封装升级，会持续抬高材料要求。',
  report: [
    '边界上它属于狭义封装材料。和传统理解不同，EMC / GMC / LMC 不只是“塑封料”，而是先进封装聚合物材料体系中的重要分支。',
    '独立全球 24 / 25 / 26E 可靠公开口径不足，因此页面不强行估值，只保留边界清晰的公司映射与后续深挖入口。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'EMC / GMC / LMC 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装聚合物补齐',
  companies: [
    {
      name: 'Sumitomo Bakelite',
      market: 'jp',
      summary: '全球塑封料主线龙头之一，是先进封装聚合物材料的核心日系玩家。',
      tags: ['EMC', 'Japan', 'packaging polymers'],
    },
    {
      name: 'Resonac',
      market: 'jp',
      summary: '兼具前道化学与后道封装材料，是平台型聚合物映射。',
      tags: ['EMC', 'Japan', 'platform'],
    },
    {
      name: '华海诚科',
      market: 'cn',
      summary: 'A 股塑封料主线标的之一，更直接映射 EMC / underfill 升级。',
      tags: ['A股', 'EMC', 'packaging materials'],
    },
    {
      name: '凯华材料',
      market: 'cn',
      summary: '国内封装塑封材料玩家，适合作为本土替代边际观察点。',
      tags: ['A股', 'EMC', 'mapping'],
    },
    {
      name: '创达新材',
      market: 'cn',
      summary: '封装模塑材料映射标的之一，更适合放在 advanced packaging polymers 链条里看。',
      tags: ['A股', 'molding compounds'],
    },
  ],
});
