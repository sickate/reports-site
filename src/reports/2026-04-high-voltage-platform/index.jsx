import {
  ArrowRightLeft,
  BatteryCharging,
  CircuitBoard,
  Factory,
  Gauge,
  Layers3,
  Sparkles,
  Target,
  Workflow,
  Zap,
} from 'lucide-react';

const overviewStats = [
  {
    label: '市场定价篮子',
    value: '4',
    note: 'Long Option / Execution Breadth / Socket & Position / Structural Shift',
  },
  {
    label: '真实产业链环节',
    value: '3',
    note: '功率器件 / 模拟控制 / 系统架构',
  },
  {
    label: '跨层平台公司',
    value: '2+',
    note: 'IFX、Renesas 同时横跨器件、控制与系统方案层。',
  },
  {
    label: 'A 股稀缺缺口',
    value: '1',
    note: 'VICR 式车辆 PDN / 高密度电源模块架构，在 A 股里仍偏稀缺。',
  },
];

const marketLenses = [
  {
    title: 'Long Option',
    subtitle: '高弹性期权',
    accent: '#f59e0b',
    thesis: '市场买的是第三代功率器件渗透率与估值弹性，赔率高，但更依赖 800V 放量节奏。',
    companies: [
      {
        ticker: 'NVTS',
        name: 'Navitas Semiconductor',
        note: '纯第三代功率半导体公司，GaNFast GaN 功率 IC + GeneSiC SiC；汽车侧落点是 OBC、HV-LV DC/DC、高压电源转换。',
      },
      {
        ticker: 'POWI',
        name: 'Power Integrations',
        note: '强项是高压电源转换与驱动，SCALE EV 车规门极驱动支持 SiC MOSFET / IGBT，典型卡位在牵引逆变器高压功率级。',
      },
    ],
  },
  {
    title: 'Execution Breadth',
    subtitle: '平台型、覆盖广',
    accent: '#38bdf8',
    thesis: '市场买的是平台广度和多点兑现能力，一旦 800V 渗透，上游多个 socket 同时受益。',
    companies: [
      {
        ticker: 'ADI',
        name: 'Analog Devices',
        note: '核心覆盖 BMS、电流/电压采样、隔离与信号链，偏“控制精度”和“安全性”收益。',
      },
      {
        ticker: 'IFX',
        name: 'Infineon Technologies',
        note: '大平台功率半导体 + 车规 MCU / 控制玩家，覆盖电驱、OBC、DC/DC、功率器件，是 800V 渗透的宽受益者。',
      },
      {
        ticker: 'RENESAS',
        name: 'Renesas Electronics',
        note: 'EV/HEV 方案里直接覆盖 traction inverter、chargers、fast charging、battery management，偏 MCU / 控制 + 功率 + 系统方案。',
      },
      {
        ticker: 'TXN',
        name: 'Texas Instruments',
        note: '覆盖牵引逆变器、BMS、隔离 / 检测 / 控制，并有 800V SiC 牵引逆变器参考设计。',
      },
    ],
  },
  {
    title: 'Socket & Position',
    subtitle: '卡位明确、单车价值量抬升',
    accent: '#34d399',
    thesis: '市场买的是明确卡位和单车价值量提升，高压架构越复杂，这类公司越容易放大 ASP。',
    companies: [
      {
        ticker: 'MPWR',
        name: 'Monolithic Power Systems',
        note: '更像电源管理 + 隔离 + BMS + 栅驱的 socket 型公司，覆盖 traction inverter、OBC、DC/DC、DC fast charging。',
      },
      {
        ticker: 'AOSL',
        name: 'Alpha and Omega Semiconductor',
        note: 'MOSFET / IGBT / SiC / Power IC 平台，官方明确把 EV Powertrain 指向主驱逆变器 + OBC，并同时适配 400V / 800V 架构。',
      },
    ],
  },
  {
    title: 'Structural Shift',
    subtitle: '架构升级受益者',
    accent: '#a855f7',
    thesis: '市场买的是系统级电源网络重构，而不是单颗器件放量；兑现路径更偏整车平台升级和总成架构迁移。',
    companies: [
      {
        ticker: 'VICR',
        name: 'Vicor',
        note: '高密度电源模块 / PDN 架构公司，重点落在 400V / 800V 兼容快充、800V / 400V 到 48V 的电源配送网络、减重和体积优化。',
      },
      {
        ticker: 'DELTA',
        name: 'Delta Electronics',
        note: '系统级电力电子集成商，覆盖 OBC、DC/DC、牵引逆变器、牵引电机和 X-in-1 集成产品。',
      },
    ],
  },
];

const stageOverview = [
  {
    number: '01',
    title: '功率器件 / 功率级',
    note: 'SiC / GaN / IGBT / MOSFET / Gate Driver，决定效率、温升与功率密度。',
    accent: '#f59e0b',
  },
  {
    number: '02',
    title: '模拟控制 / BMS / 隔离',
    note: '采样、隔离、栅驱、控制、MCU、BMS，决定控制精度与安全边界。',
    accent: '#38bdf8',
  },
  {
    number: '03',
    title: '系统级电源架构 / 集成总成',
    note: 'OBC、DC/DC、逆变器、X-in-1、800V↔400V↔48V 配电架构，决定集成度与整车电能流。',
    accent: '#34d399',
  },
];

const chainStages = [
  {
    title: '环节一：功率器件 / 功率级',
    subtitle: '决定高压平台的效率、温升与功率密度',
    accent: '#f59e0b',
    icon: Zap,
    focus: 'SiC / GaN / IGBT / MOSFET / Gate Driver',
    overseas: [
      {
        ticker: 'NVTS',
        note: '第三代功率半导体弹性标的，GaN 指向 400V，SiC 指向 800V 及以上平台。',
      },
      {
        ticker: 'POWI',
        note: '高压电源转换与车规门极驱动切入牵引逆变器功率级。',
      },
      {
        ticker: 'IFX',
        note: '功率器件平台型龙头，在主驱、OBC、DC/DC 多点受益。',
      },
      {
        ticker: 'AOSL',
        note: '400V / 800V 双架构兼容的器件平台。',
      },
    ],
    aShares: [
      '时代电气',
      '斯达半导',
      '宏微科技',
      '三安光电 / 三安半导体',
      '天岳先进',
    ],
    insight:
      'A 股没有完全等价的 NVTS。更贴切的看法是用“时代电气 + 斯达半导 + 三安光电”的组合，去映射纯第三代器件弹性与 SiC 渗透率提升。',
    winners: '最硬的主线仍是 SiC 器件 / 模块，重点看时代电气、斯达半导。',
  },
  {
    title: '环节二：模拟控制 / BMS / 隔离 / 信号链',
    subtitle: '决定系统控制精度、安全性与单车价值量上升斜率',
    accent: '#38bdf8',
    icon: CircuitBoard,
    focus: '采样 / 隔离 / 栅驱 / 控制 / MCU / BMS',
    overseas: [
      {
        ticker: 'ADI',
        note: '更偏高精度 BMS、采样、隔离和信号链。',
      },
      {
        ticker: 'TXN',
        note: '牵引逆变器、BMS、隔离与控制参考设计齐全。',
      },
      {
        ticker: 'RENESAS',
        note: 'MCU / 控制 + 功率 + 系统方案并行，平台深度强。',
      },
      {
        ticker: 'MPWR',
        note: '更像 socket 生意，隔离 / 驱动 / 电源管理卡位清晰。',
      },
      {
        ticker: 'IFX',
        note: '也横跨这一层，兼具器件与控制平台属性。',
      },
    ],
    aShares: ['纳芯微', '圣邦股份', '思瑞浦', '兆易创新', '国芯科技', '芯朋微'],
    insight:
      '如果把 800V 理解成“单车电子复杂度抬升”，这一层往往最容易被低估。纳芯微最像 MPWR 的 socket 思路，圣邦股份 + 思瑞浦 + 纳芯微更接近 ADI / TXN 的组合映射。',
    winners: '最容易被低估的卡位是隔离 / 驱动 / 传感 / BMS，优先看纳芯微。',
  },
  {
    title: '环节三：系统级电源架构 / 集成总成',
    subtitle: '决定 OBC、DC/DC、逆变器和整车电能配送网络的集成方式',
    accent: '#34d399',
    icon: Workflow,
    focus: 'OBC / DC-DC / 逆变器 / X-in-1 / 800V↔400V↔48V PDN',
    overseas: [
      {
        ticker: 'VICR',
        note: '高密度电源模块和车辆 PDN 架构受益者，逻辑更偏结构性升级。',
      },
      {
        ticker: 'DELTA',
        note: '系统级电力电子集成商，覆盖 OBC、DC/DC、牵引逆变器和 X-in-1。',
      },
      {
        ticker: 'RENESAS',
        note: '部分跨到系统方案层，但不等同于纯总成厂。',
      },
      {
        ticker: 'IFX',
        note: '部分跨到系统方案层，更接近平台提供者。',
      },
    ],
    aShares: ['威迈斯', '欣锐科技', '英搏尔'],
    insight:
      '最像 DELTA 的是威迈斯 + 欣锐科技 + 英搏尔。VICR 在 A 股里没有完全等价物，欣锐科技 / 威迈斯只能算系统侧近似，不是电源网络架构的一一映射。',
    winners: '系统放量 beta 更像威迈斯、欣锐科技；VICR 式高密度模块 / PDN 仍是 A 股稀缺缺口。',
  },
];

const mappingPrinciples = [
  'A 股和海外公司之间没有严格的一一对应，更适合用功能映射，而不是公司名称硬对标。',
  'A 股多了一层海外图里没有单列、但在 800V 里非常重要的 SiC 材料 / 制造层，典型代表是天岳先进。',
  '真正实用的拆法，是把 800V 升级拆成“功率器件、模拟控制、系统集成”三条线，再看谁同时受益于渗透率、单车价值量和平台化能力。',
];

const mappingRows = [
  {
    overseas: 'NVTS',
    aShares: '时代电气 / 斯达半导 / 三安光电',
    note: '更像纯第三代器件弹性组合，而不是单一公司。',
  },
  {
    overseas: 'POWI',
    aShares: '芯朋微 / 纳芯微',
    note: '一个偏电源 / 驱动，一个偏隔离 / 栅驱。',
  },
  {
    overseas: 'ADI',
    aShares: '圣邦股份 / 思瑞浦 / 纳芯微',
    note: '对应模拟平台、信号链与隔离能力。',
  },
  {
    overseas: 'IFX',
    aShares: '时代电气 / 斯达半导 / 纳芯微',
    note: '功率器件 + 控制平台的组合映射。',
  },
  {
    overseas: 'RENESAS',
    aShares: '兆易创新 / 国芯科技 / 纳芯微',
    note: 'A 股没有同等平台深度，更适合用 MCU + 模拟 + 控制组合去看。',
  },
  {
    overseas: 'TXN',
    aShares: '圣邦股份 / 思瑞浦 / 纳芯微',
    note: '偏模拟控制、隔离与参考设计平台。',
  },
  {
    overseas: 'MPWR',
    aShares: '纳芯微 / 圣邦股份',
    note: '核心在 socket 卡位和电源管理。',
  },
  {
    overseas: 'AOSL',
    aShares: '斯达半导 / 宏微科技 / 三安光电',
    note: '更接近功率器件 / 模块平台映射。',
  },
  {
    overseas: 'VICR',
    aShares: '欣锐科技 / 威迈斯',
    note: '仅系统侧近似，不是等价映射。',
  },
  {
    overseas: 'DELTA',
    aShares: '威迈斯 / 欣锐科技 / 英搏尔',
    note: '更偏车载电源总成与系统集成。',
  },
];

const tradeAngles = [
  {
    title: '器件升级',
    subtitle: 'SiC / GaN 替代，吃渗透率',
    accent: '#f59e0b',
    companies: '时代电气、斯达半导、三安光电、天岳先进',
  },
  {
    title: '单车价值量提升',
    subtitle: '隔离、驱动、BMS、模拟控制变复杂',
    accent: '#38bdf8',
    companies: '纳芯微、思瑞浦、圣邦股份',
  },
  {
    title: '系统集成升级',
    subtitle: 'OBC / DC-DC / X-in-1 / 电源总成升级',
    accent: '#34d399',
    companies: '威迈斯、欣锐科技、英搏尔',
  },
  {
    title: '平台化赢家',
    subtitle: '谁能从单点器件走到整个平台',
    accent: '#a855f7',
    companies: '时代电气、纳芯微',
  },
];

const rankingCards = [
  {
    title: '最硬的主线',
    body: 'SiC 器件 / 模块，优先看时代电气、斯达半导。',
  },
  {
    title: '最容易被低估的卡位',
    body: '隔离 / 驱动 / 传感 / BMS，优先看纳芯微。',
  },
  {
    title: '最像系统放量 beta',
    body: '车载电源总成，重点看威迈斯、欣锐科技。',
  },
  {
    title: '最稀缺的海外映射缺口',
    body: 'VICR 式车辆 PDN / 高密度模块架构，在 A 股仍然偏稀缺。',
  },
];

function SectionHeading({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
        <Icon className="h-4 w-4" />
        <span>{eyebrow}</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>
      </div>
    </div>
  );
}

function HighVoltagePlatformReport() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 text-slate-100">
      <section
        className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] md:p-8"
        style={{
          backgroundImage: `
            radial-gradient(circle at top left, rgba(245, 158, 11, 0.18), transparent 26%),
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 24%),
            radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.14), transparent 28%)
          `,
        }}
      >
        <div className="relative z-10 space-y-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300">
            <span className="rounded-full border border-amber-400/25 bg-amber-400/12 px-3 py-1 text-amber-200">
              Research Topic
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              EV Electrification
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              800V Platform
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Power Electronics
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                <BatteryCharging className="h-4 w-4" />
                <span>800V 高压平台升级</span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  从四种 market multiple，
                  <br className="hidden md:block" />
                  重排到三层真实产业链
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                  这页不是把原图机械翻译成“上下游顺序图”，而是先解释市场如何用四种不同的定价方式给同一条
                  800V 升级主线买单，再把公司按真实产业链环节重排成
                  “功率器件、模拟控制、系统架构”三层，并补上 A 股功能映射。
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <ArrowRightLeft className="h-4 w-4 text-amber-300" />
                    <span>看图方法</span>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">
                    原图本质上不是线性供应链，而是把同一个“800V 电动车 / 高压平台升级”主题，投射到四种最常见的市场定价篮子里。
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <Layers3 className="h-4 w-4 text-cyan-300" />
                    <span>本页做法</span>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">
                    研究和交易上更实用的方式，是把公司按功能拆成三层，再分别看渗透率、单车价值量和平台化能力的抬升。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {overviewStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur"
                >
                  <div className="text-sm text-slate-400">{item.label}</div>
                  <div className="mt-2 text-4xl font-semibold text-white">{item.value}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 md:p-8">
        <SectionHeading
          icon={Target}
          eyebrow="Market Lens"
          title="原图真正表达的是四种定价方式"
          description="先别把这张图理解成严格线性的上下游顺序。它更像是同一条 800V 升级主线，在不同公司类型上的四种投影方式。"
        />

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {marketLenses.map((lens) => (
            <article
              key={lens.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: `${lens.accent}22`,
                    border: `1px solid ${lens.accent}44`,
                    color: lens.accent,
                  }}
                >
                  {lens.title}
                </div>
                <span className="text-sm font-medium text-slate-300">{lens.subtitle}</span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">{lens.thesis}</p>

              <div className="mt-5 grid gap-4">
                {lens.companies.map((company) => (
                  <div
                    key={company.ticker}
                    className="rounded-2xl border border-white/8 bg-slate-900/60 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: `${lens.accent}22`,
                          color: '#f8fafc',
                        }}
                      >
                        {company.ticker}
                      </span>
                      <span className="text-sm font-semibold text-white">{company.name}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{company.note}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 md:p-8">
        <SectionHeading
          icon={Gauge}
          eyebrow="Real Chain"
          title="按真实产业链重排，高压平台升级是三层结构"
          description="如果真正按产业链来排，这些公司不应混成一张“顺序图”。更准确的框架，是功率器件、模拟控制、系统架构三层同时抬升。"
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {stageOverview.map((stage) => (
            <div
              key={stage.number}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5"
            >
              <div
                className="text-sm font-semibold"
                style={{ color: stage.accent }}
              >
                {stage.number}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-white">{stage.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{stage.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6">
          {chainStages.map((stage) => {
            const Icon = stage.icon;

            return (
              <article
                key={stage.title}
                className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: `${stage.accent}1f`,
                          border: `1px solid ${stage.accent}44`,
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: stage.accent }} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-white">{stage.title}</h3>
                        <p className="text-sm leading-7 text-slate-300">{stage.subtitle}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        核心看点
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-200">{stage.focus}</p>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        A 股核心映射
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {stage.aShares.map((company) => (
                          <span
                            key={company}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-100"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      {stage.overseas.map((company) => (
                        <div
                          key={`${stage.title}-${company.ticker}`}
                          className="rounded-2xl border border-white/8 bg-slate-900/60 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="rounded-full px-2.5 py-1 text-xs font-semibold"
                              style={{
                                backgroundColor: `${stage.accent}22`,
                                color: '#f8fafc',
                              }}
                            >
                              {company.ticker}
                            </span>
                            <span className="text-sm font-semibold text-white">海外代表</span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-slate-300">{company.note}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          功能映射结论
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{stage.insight}</p>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-slate-900/60 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          交易主线
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{stage.winners}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 md:p-8">
        <SectionHeading
          icon={Layers3}
          eyebrow="A Share Mapping"
          title="A 股更适合做功能映射，而不是机械对标"
          description="海外平台型大厂、细分高弹性标的和系统集成商，在 A 股里往往需要一对多地拆开看。真正有用的是知道每种能力映射到哪一层。"
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {mappingPrinciples.map((rule) => (
            <div
              key={rule}
              className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-slate-300"
            >
              {rule}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {mappingRows.map((row) => (
            <div
              key={row.overseas}
              className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-200">
                  {row.overseas}
                </span>
                <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-white">{row.aShares}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{row.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 md:p-8">
        <SectionHeading
          icon={Sparkles}
          eyebrow="Trade Setup"
          title="真正值得交易的，不是名字像谁，而是哪条线同时抬升"
          description="800V 主题的关键，不在于哪家公司和海外标的名字最像，而在于哪些环节会同时受益于渗透率、单车价值量和平台化能力提升。"
        />

        <div className="mt-8 grid gap-5 xl:grid-cols-4">
          {tradeAngles.map((angle) => (
            <article
              key={angle.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5"
            >
              <div
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{
                  backgroundColor: `${angle.accent}22`,
                  color: angle.accent,
                }}
              >
                {angle.title}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{angle.subtitle}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{angle.companies}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {rankingCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[24px] border border-white/10 bg-slate-900/70 p-5"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Factory className="h-4 w-4 text-cyan-300" />
                <span>{card.title}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] border border-cyan-400/20 bg-cyan-400/8 p-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10">
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">一句话总结</h3>
              <p className="text-sm leading-8 text-slate-200 md:text-base">
                这张图本质上是在说：市场在用四种不同的 multiple，给同一个 800V 升级买单。放到 A 股里，最好的用法不是机械对标，而是拆成
                功率器件、模拟控制、系统集成三条线，再去找未来两年谁的渗透率、单车价值量和平台化能力会同时上台阶。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HighVoltagePlatformReport;
