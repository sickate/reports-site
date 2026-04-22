import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'sputtering-targets',
  name: '溅射靶材',
  flowTo: ['晶圆制造（前道）'],
  summary: '高纯靶材是典型的寡头材料，难点不在金属本身，而在纯度、组织控制和长认证周期。',
  overview: '这个赛道要刻意把“靶材”与“金属原料”区分开。真正的壁垒来自高纯提炼、组织均匀性、绑定件工艺和稳定量产，而不是名义冶炼能力。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。高纯 Al / Cu / Ti / Ta / W / Ru 等靶材仍长期由少数日美厂商主导。',
    '市场规模按 TECHCET 重排，2024 / 2025 / 2026E 约 USD 1.33bn / 1.45bn / 1.55bn。A 股里最清晰的主线仍是江丰电子，其他公司更适合按平台型映射或广义镀膜材料去看。'
  ],
  basis: 'B',
  v2024: 1.33,
  v2025: 1.45,
  v2026: 1.55,
  marketNote: '2025 采用 TECHCET semiconductor sputtering target 口径，2024 回推，2026E 按 7% CAGR 机械外推。',
  market26Note: '2026E 按 2024-2029 CAGR 机械外推。',
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'JX Advanced Metals',
      market: 'jp',
      summary: '全球高端半导体靶材主线龙头之一，是最典型的高纯材料平台。',
      tags: ['targets', 'Japan', 'oligopoly'],
    },
    {
      name: 'Materion',
      market: 'us',
      summary: '美股里少数能直接映射高端靶材与薄膜材料能力的公司。',
      tags: ['targets', 'US', 'thin films'],
    },
    {
      name: 'Tosoh',
      market: 'jp',
      summary: '日本综合材料龙头，半导体靶材与薄膜材料体系完整。',
      tags: ['targets', 'Japan', 'materials platform'],
    },
    {
      name: '江丰电子',
      market: 'cn',
      summary: '国产半导体靶材最直接的 A 股主线之一，同时向零部件延伸。',
      tags: ['A股', 'targets', '国产替代'],
    },
    {
      name: '有研新材',
      market: 'cn',
      summary: '靶材核心资产在子公司有研亿金，更适合按平台型映射理解。',
      tags: ['A股', 'platform', 'thin film materials'],
    },
    {
      name: '阿石创',
      market: 'cn',
      summary: '更偏广义靶材 / 镀膜材料平台，半导体纯度低于江丰电子。',
      tags: ['A股', 'coating materials', 'mapping'],
    },
  ],
});
