import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'cmp-materials',
  name: 'CMP 材料',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: 'CMP 材料直接决定平坦化窗口与良率，slurry、pad 与 post-CMP clean 是一套协同材料体系。',
  overview: '这个赛道看起来像耗材，实际上高度绑定工艺窗口。真正的卡点在磨粒控制、配方稳定性、pad / slurry 协同和客户验证，而不是简单的“多卖一点抛光液”。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。值得继续深挖的不是单一品类，而是 slurry、pad 和 post-CMP clean 的组合能力。',
    '市场规模按 TECHCET 重排，2024 / 2025 / 2026E 约 USD 3.42bn / 3.62bn / 3.93bn。这个环节和先进节点层数增加、平坦化要求提升直接相关，属于前道材料里最容易出现国产化突破的一条。'
  ],
  basis: 'B',
  v2024: 3.42,
  v2025: 3.62,
  v2026: 3.93,
  marketNote: '2024 / 2025 采用 TECHCET CMP 材料口径，2026E 按 8.6% CAGR 机械外推。',
  market26Note: '2026E 按 2024-2029 CAGR 机械外推。',
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Entegris',
      market: 'us',
      summary: 'CMP slurry 与高纯材料平台型玩家，协同能力强。',
      tags: ['CMP slurry', 'US', 'platform'],
    },
    {
      name: 'DuPont',
      market: 'us',
      summary: 'CMP pad 与 slurry 体系完整，更适合按高端材料平台理解。',
      tags: ['CMP pad', 'CMP slurry', 'US'],
    },
    {
      name: 'Fujimi',
      market: 'jp',
      summary: '日本 CMP 材料主线公司，业务纯度和工艺绑定度都更高。',
      tags: ['CMP materials', 'Japan', 'planarization'],
    },
    {
      name: 'Resonac',
      market: 'jp',
      summary: '同时覆盖 CMP slurry、post-CMP 材料与先进封装化学，是平台型映射。',
      tags: ['CMP slurry', 'Japan', 'platform'],
    },
    {
      name: '安集科技',
      market: 'cn',
      summary: '国产 CMP slurry 与 post-CMP clean 核心龙头。',
      tags: ['A股', 'CMP slurry', 'post-CMP clean'],
    },
    {
      name: '鼎龙股份',
      market: 'cn',
      summary: '国产 CMP pad 主线，并持续向更多半导体材料平台延展。',
      tags: ['A股', 'CMP pad', 'materials platform'],
    },
  ],
});
