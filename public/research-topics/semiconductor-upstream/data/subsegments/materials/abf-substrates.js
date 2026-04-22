import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'abf-substrates',
  name: 'ABF / 封装基板',
  flowTo: ['先进封装', '封装（后道）'],
  initialOpen: true,
  summary: 'ABF 更适合放在封装材料侧看，本质上是高端封装基板 / 载板体系，对 AI、HBM 与 Chiplet 尤其关键。',
  overview: '这条赛道的价值不只是基板本身，还在于层数升级、线宽线距、翘曲控制和上游 ABF 绝缘材料体系。它是先进封装里最值得优先跟踪的一条材料主线。',
  report: [
    '边界上它属于狭义半导体封装材料，不再放在前道晶圆制造材料里看。阅读顺序更适合先看载板产能与层数升级，再看 Ajinomoto 这类上游材料卡位。',
    '市场规模按 ABF substrate 口径重排，2024 / 2025 / 2026E 约 USD 5.36bn / 5.88bn / 6.46bn，2025 / 2026 为按 9.8% CAGR 机械外推。'
  ],
  basis: 'B',
  v2024: 5.36,
  v2025: 5.88,
  v2026: 6.46,
  marketNote: '2024 采用 ABF substrate 公开锚点；2025 / 2026E 按 9.8% CAGR 机械外推。',
  market26Note: '2025 / 2026 为按公开 CAGR 机械外推，适合做工作底稿排序。',
  updateNote: '先进封装主线重排',
  companies: [
    {
      name: 'Ajinomoto',
      market: 'jp',
      summary: 'ABF 绝缘材料事实标准制定者，是封装基板链条最关键的上游材料卡位。',
      tags: ['ABF', 'Japan', 'upstream materials'],
    },
    {
      name: 'Ibiden',
      market: 'jp',
      summary: '高阶 FC-BGA / ABF 龙头，最能直接映射 AI 载板升级。',
      tags: ['ABF substrates', 'Japan', 'FC-BGA'],
    },
    {
      name: 'Shinko Electric',
      market: 'jp',
      summary: '高端封装基板核心厂商，是日系载板链的重要代表。',
      tags: ['ABF substrates', 'Japan', 'advanced packaging'],
    },
    {
      name: 'Unimicron',
      market: 'tw',
      summary: '台系高阶载板主线龙头之一，AI 加速器和网络芯片敞口突出。',
      tags: ['ABF substrates', 'Taiwan', 'AI'],
    },
    {
      name: 'Nan Ya PCB',
      market: 'tw',
      summary: '南电是台股 ABF / BT 载板主线标的，景气修复弹性突出。',
      tags: ['ABF substrates', 'Taiwan', 'BT'],
    },
    {
      name: 'Kinsus',
      market: 'tw',
      summary: '景硕更偏高弹性载板玩家，适合跟踪行业修复阶段的利润弹性。',
      tags: ['ABF substrates', 'Taiwan', 'high beta'],
    },
  ],
});
