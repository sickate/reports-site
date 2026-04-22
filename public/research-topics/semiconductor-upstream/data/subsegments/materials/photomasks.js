import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'photomasks',
  name: '掩膜 / 坯料',
  flowTo: ['晶圆制造（前道）'],
  summary: '掩膜版与 mask blanks 是先进光刻里的隐形瓶颈，高端坯料、缺陷控制与写修检能力共同决定壁垒。',
  overview: '这个环节最容易被低估，因为它不是简单的“图形载体”，而是先进节点良率、线边粗糙度和缺陷密度的关键约束。EUV 时代，mask blanks 的洁净度与多轮检测能力更重要。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。真正决定供给格局的，是高端 blanks、merchant photomask 的写版修复能力，以及与先进制程同步升级的客户验证。',
    '市场规模按 QYResearch photomask 口径重排，2024 / 2025 / 2026E 约 USD 6.31bn / 6.59bn / 6.89bn，其中 2025 / 2026 为按 4.5% CAGR 机械外推。'
  ],
  basis: 'B',
  v2024: 6.31,
  v2025: 6.59,
  v2026: 6.89,
  marketNote: '2024 采用 QYResearch photomask 口径；2025 / 2026E 按 4.5% CAGR 机械外推。',
  market26Note: '2025 / 2026 为按公开 CAGR 机械外推，适合做工作底稿排序。',
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'DNP',
      market: 'jp',
      summary: '高端 photomask 与掩膜坯料链条里的核心日系玩家。',
      tags: ['photomask', 'Japan', 'merchant'],
    },
    {
      name: 'HOYA',
      market: 'jp',
      summary: 'mask blanks 关键供应方之一，高端坯料能力突出。',
      tags: ['mask blanks', 'Japan', 'EUV'],
    },
    {
      name: 'Photronics',
      market: 'us',
      summary: '全球 merchant photomask 纯玩家主线，成熟与先进节点兼顾。',
      tags: ['merchant photomask', 'US', 'pure-play'],
    },
    {
      name: '路维光电',
      market: 'cn',
      summary: 'A 股掩膜版映射标的，核心看制程升级与高端客户导入。',
      tags: ['A股', 'photomask', '国产替代'],
    },
    {
      name: '台湾光罩',
      market: 'tw',
      summary: '台股中最直接的 photomask 映射标的之一。',
      tags: ['Taiwan', 'photomask'],
    },
  ],
});
