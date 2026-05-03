import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'abf-substrates',
  name: 'ABF / 封装基板',
  section: '材料',
  flowTo: ['先进封装', '封装（后道）'],
  initialOpen: true,
  summary: 'ABF 更适合放在封装材料侧看，本质上是高端封装基板 / 载板体系，对 AI、HBM 与 Chiplet 尤其关键。',
  market: {
    v2024: 5.36,
    v2025: 5.88,
    basis: 'B',
    note: '2024 采用 ABF substrate 公开锚点；2025 / 2026E 按 9.8% CAGR 机械外推。'
  },
  detail: {
    title: 'ABF 封装基板板块深度拆解',
    intro: '把“ABF / 封装基板”拆成四层来看：A 看全球主线寡头，B 看高弹性与上游关键受益方，C 看区域弹性与边际恢复玩家，D 看 A 股映射与国产替代链。',
    updateNote: '载板主线已经切到统一深拆结构；后续补数据时直接按 A / B / C / D 四层继续扩展即可。',
    groups: [
      {
        title: 'A. 全球主线寡头',
        desc: '这一层是最直接受益 AI GPU / CPU、HBM 和高阶网络芯片升级的 ABF 主线。看点在大尺寸、高层数、FC-BGA 良率和头部客户绑定。',
        companies: [
          {
            name: 'Ibiden',
            market: 'jp',
            cap: 'USD 14.3B',
            summary: '日本高阶 FC-BGA / ABF 龙头，核心受益 AI GPU / CPU 大尺寸载板升级。',
            tags: ['ABF载板', 'FC-BGA', 'AI服务器', '日本龙头'],
            note: '纯度高，属全球主线标的。'
          },
          {
            name: 'Shinko Electric',
            market: 'jp',
            cap: 'USD 5.2B',
            summary: '日本先进封装基板核心厂，历史上是 Intel / 高端处理器载板重要供应商之一。',
            tags: ['ABF载板', '日本', '先进封装', '已私有化'],
            note: '2025-06-06 已退市；这里保留作为产业链历史核心样本。'
          },
          {
            name: 'Unimicron',
            market: 'tw',
            cap: 'USD 22.4B',
            summary: '全球 ABF / IC 载板主力厂之一，AI 加速器与高阶网络芯片敞口突出。',
            tags: ['ABF载板', '台股', 'AI服务器', '高阶网络'],
            note: '主线龙头，受益大尺寸 / 高层数基板。'
          },
          {
            name: 'Nan Ya PCB',
            market: 'tw',
            cap: 'USD 9.5B',
            summary: '台系 ABF / BT 载板重要厂商，处于 AI 相关高阶载板景气修复链条。',
            tags: ['ABF载板', '台股', 'FC-BGA', '景气修复'],
            note: '近两年盈利波动大，2026E 弹性高于 2025A。'
          }
        ]
      },
      {
        title: 'B. 高弹性与上游关键受益方',
        desc: '这一层更适合看利润弹性和材料卡位。Kinsus 偏高 beta 载板弹性，Ajinomoto 是 ABF 绝缘材料事实标准，SEMCO 则是韩系 FC-BGA 主线扩张平台。',
        companies: [
          {
            name: 'Kinsus',
            market: 'tw',
            cap: 'USD 4.8B',
            summary: '高弹性 ABF / SiP 载板厂，业绩对高端计算与手机模组需求修复更敏感。',
            tags: ['ABF载板', 'SiP', '台股', '高弹性'],
            note: '规模低于一线寡头，但弹性和博弈性更强。'
          },
          {
            name: 'Ajinomoto',
            market: 'jp',
            cap: 'USD 28.1B',
            summary: 'ABF 树脂 / 绝缘膜事实标准制定者，是 ABF 载板产业链最关键的上游材料公司。',
            tags: ['ABF材料', '上游垄断', '日本', '先进封装'],
            note: '不是纯载板制造商；为 ABF 材料核心受益标的。'
          },
          {
            name: 'Samsung Electro-Mechanics',
            market: 'kr',
            cap: 'USD 20.5B',
            summary: '韩国高阶封装基板 / FC-BGA 重要玩家，受益 AI 服务器与 HBM 配套封装生态扩张。',
            tags: ['FC-BGA', '韩国', 'AI服务器', '先进封装'],
            note: '平台型电子零部件公司，非纯 ABF 收入。'
          }
        ]
      },
      {
        title: 'C. 区域弹性与边际恢复玩家',
        desc: '这一层更适合看景气修复、客户升级和扩产节奏。Daeduck 是韩系弹性标的，AT&S 则代表欧洲高端载板与 Kulim 扩产逻辑。',
        companies: [
          {
            name: 'Daeduck Electronics',
            market: 'kr',
            cap: 'USD 2.2B',
            summary: '韩国 ABF / 高阶基板弹性标的，AI 相关高层数载板恢复时利润弹性较大。',
            tags: ['ABF载板', '韩国', '弹性', '高层数'],
            note: '体量较小，但处于产业修复和客户升级观察名单。'
          },
          {
            name: 'AT&S',
            market: 'eu',
            cap: 'USD 2.3B',
            summary: '欧洲高端 IC substrate / FC-BGA 玩家，Kulim 扩产与 AI 服务器需求是核心观察点。',
            tags: ['IC载板', '欧洲', '扩产', 'AI服务器'],
            note: '2026 收入采用 FY2026/27 官方指引中值；净利与估值缺口较大。'
          }
        ]
      },
      {
        title: 'D. A股映射与国产替代链',
        desc: 'A 股更适合从平台型高端 PCB、上游材料和国产替代能力验证去看，而不是把它们硬读成纯 ABF 载板公司。',
        companies: [
          {
            name: 'Shennan Circuits',
            market: 'cn',
            cap: 'RMB 176.83B',
            summary: 'A 股中最接近高端封装基板平台型龙头，兼具 PCB、封装基板与电子装联能力。',
            tags: ['A股', '封装基板', '平台型', '高端PCB'],
            note: '不是纯 ABF 公司，但在国产高端载板链条中地位最强。'
          },
          {
            name: 'Shengyi Technology',
            market: 'cn',
            cap: 'RMB 154.10B',
            summary: 'A 股电子材料龙头之一，IC substrate / 高速材料 / CCL 是 ABF 载板链关键上游映射。',
            tags: ['A股', 'CCL', '高速材料', 'IC substrate材料'],
            note: '上游材料映射，不是纯 ABF 载板制造商。'
          },
          {
            name: 'Fastprint / 兴森科技',
            market: 'cn',
            cap: 'RMB 41.45B',
            summary: 'A 股封装基板国产替代代表之一，业务更贴近“国产 ABF / 封装基板能力验证”。',
            tags: ['A股', '封装基板', '国产替代', 'IC载板'],
            note: '2025 收入 / 利润多采用 TTM proxy，2026E 公开口径不足。'
          },
          {
            name: 'Huazheng New Material',
            market: 'cn',
            cap: 'RMB 10.82B',
            summary: '高频高速覆铜板 / 树脂体系映射标的，可作为 ABF 载板国产材料链的边际观察点。',
            tags: ['A股', '材料', '高速CCL', '边际受益'],
            note: '纯度较低，更多是材料映射与国产替代观察。'
          }
        ]
      }
    ]
  }
});
