import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  Flame,
  Orbit,
  Radar,
  Rocket,
  Ship,
  Sparkles,
} from 'lucide-react';

const snapshotCards = [
  {
    label: '当前观察日',
    value: '2026-04-21',
    note: '页面里所有补充口径均按这一天整理。',
  },
  {
    label: '布局窗口',
    value: '2026-04-15 to 2026-05-05',
    note: '对应原文“4 月 15 日到 5 月初”的震荡蓄势段。',
  },
  {
    label: '催化密集窗',
    value: '2026-05 early to 2026-06 mid',
    note: 'SpaceX、蓝箭、朱雀三号、长征十号乙预期事件在这里共振。',
  },
];

const researchCorrections = [
  {
    title: 'SpaceX 上市',
    body: '文章里的“SpaceX 上市”并不是公开 S-1 已披露的既成事实；截至 2026-04-21，更接近“4 月 1 日被多家媒体报道已向 SEC 秘密递表、冲击 6 月上市窗口”。',
    tone: 'reported',
  },
  {
    title: '蓝箭上市',
    body: '蓝箭航天的 IPO 不是已经排定上市日。现状是 2025-12-31 获受理、2026-01-22 进入已问询、2026-03-31 因财报更新进入“中止”，官方称属程序性调整。',
    tone: 'watch',
  },
  {
    title: '朱雀三号复飞',
    body: '蓝箭公开口径是 2026 年第二季度再次开展回收试验，若回收成功，再争取第四季度首次回收复用飞行；目前没有看到精确到某一天的官方日程。',
    tone: 'planned',
  },
  {
    title: '文昌与海南商发',
    body: '2 月 11 日长征十号系列低空演示验证是在文昌航天发射场完成，不是海南商业航天发射场 2 号工位；后者对应的是文中讨论的长征十号乙首飞预期场景。',
    tone: 'watch',
  },
];

const explodedStages = [
  {
    key: 'mission',
    side: 'left',
    eyebrow: 'Mission Pull',
    title: '任务牵引 / 载荷需求',
    segment: 'Payload',
    segmentClass: 'h-18 rounded-t-[999px] rounded-b-3xl',
    accent: '#f59e0b',
    description:
      '原文把星网组网、空间站货运、载人登月技术验证放在长征十号乙的需求端，这决定了它的可靠性和运力优先级。',
    companies: [
      {
        name: '中国卫星网络集团',
        role: '把文中“星网组网”补全到具体运营主体',
        sourceType: 'supplement',
      },
      {
        name: '上海垣信卫星',
        role: '可放在商业卫星互联网需求侧，对应千帆星座的补充案例',
        sourceType: 'supplement',
      },
      {
        name: '中国载人航天工程',
        role: '空间站与载人登月任务体系',
        sourceType: 'supplement',
      },
    ],
    bullets: ['国家任务牵引', '高频组网需求', '高可靠性优先'],
    status: 'supplement',
  },
  {
    key: 'launch-site',
    side: 'right',
    eyebrow: 'Launch Pad',
    title: '发射场与测发系统',
    segment: 'Sites',
    segmentClass: 'h-22 rounded-[2rem]',
    accent: '#22c55e',
    description:
      '这里要拆成两个站点看。文中讨论的长征十号乙首飞预期挂在海南国际商业航天发射场 2 号工位，但今年 2 月 11 日长征十号系列官方验证是在文昌航天发射场完成，不能混为一谈。',
    companies: [
      {
        name: '海南国际商业航天发射场',
        role: '商业发射入口，文中直接提及',
        sourceType: 'article',
      },
      {
        name: '海南商业航天发射有限公司',
        role: '研究补充的发射场运营主体',
        sourceType: 'supplement',
      },
      {
        name: '文昌航天发射场',
        role: '2 月 11 日长征十号系列低空演示验证的官方试验场',
        sourceType: 'confirmed',
      },
    ],
    bullets: ['文昌 / 海南商发分口径', '双工位能力', '液体通用型工位'],
    status: 'confirmed',
  },
  {
    key: 'prime',
    side: 'left',
    eyebrow: 'Prime Integrator',
    title: '火箭总体 / 国家队主线',
    segment: 'Core',
    segmentClass: 'h-26 rounded-[2rem]',
    accent: '#38bdf8',
    description:
      '长征十号乙是长征十号载人火箭的衍生商用型号，文中指出火箭院主导海上网捕回收路线，这是国家队最核心的一条技术主线。',
    companies: [
      {
        name: '中国航天科技集团',
        role: '国家队体系平台',
        sourceType: 'supplement',
      },
      {
        name: '中国运载火箭技术研究院（火箭院）',
        role: '长征十号系列与海上网捕方案抓总',
        sourceType: 'article',
      },
    ],
    bullets: ['5 米级箭体', '两级构型', '商用衍生型号'],
    status: 'confirmed',
  },
  {
    key: 'first-stage',
    side: 'right',
    eyebrow: 'Booster & Recovery',
    title: '一级动力 / 回收控制',
    segment: 'Booster',
    segmentClass: 'h-30 rounded-[2rem]',
    accent: '#fb7185',
    description:
      '一级采用 7 台液发 100K，是整枚火箭最强的动力段。文中强调真正的难点在二次点火、深度节流、多机同步、栅格舵和 GNC。',
    companies: [
      {
        name: '航天推进技术研究院（航天六院）',
        role: 'YF-100K 动力来源的研究补充',
        sourceType: 'supplement',
      },
      {
        name: 'SpaceX',
        role: '文中拿 Falcon 9 作可回收工程化对标',
        sourceType: 'article',
      },
    ],
    bullets: ['7 x YF-100K', '栅格舵 + GNC', '二次点火与深度节流'],
    status: 'supplement',
  },
  {
    key: 'second-stage',
    side: 'left',
    eyebrow: 'Upper Stage',
    title: '二级入轨 / 构型待官宣',
    segment: 'Stage 2',
    segmentClass: 'h-22 rounded-[2rem]',
    accent: '#a78bfa',
    description:
      '原文写到二级“可能采用液发 100M 或液发 219（液氧甲烷）”，这部分仍属于待官方最终披露的口径，因此页面里单独标为待确认。',
    companies: [
      {
        name: '长征十号乙二级',
        role: '具体动力构型待官方定版',
        sourceType: 'article',
      },
      {
        name: '航天六院',
        role: '若对应液发 100M / 219，则仍在液体动力体系内',
        sourceType: 'inference',
      },
    ],
    bullets: ['液氧甲烷预期', '上面级效率', '最终以官宣为准'],
    status: 'watch',
  },
  {
    key: 'recovery',
    side: 'right',
    eyebrow: 'Sea Recovery',
    title: '海上网捕回收',
    segment: 'Recovery',
    segmentClass: 'h-20 rounded-[2rem]',
    accent: '#14b8a6',
    description:
      '“领航者”平台是海上柔性网捕方案的关键基础设施。公开信息显示该平台已完成命名交付，这是国家队区别于 VTVL 的核心差异化环节。',
    companies: [
      {
        name: '火箭院 / 航天科技一院',
        role: '海上网捕平台抓总研制',
        sourceType: 'confirmed',
      },
      {
        name: '领航者海上回收平台',
        role: '网系回收基础设施',
        sourceType: 'confirmed',
      },
    ],
    bullets: ['柔性网捕', '海上安全回收', '平台成本与海况约束'],
    status: 'confirmed',
  },
];

const routeCards = [
  {
    title: '海上柔性网捕路线',
    subtitle: '国家队差异化方案',
    accent: '#14b8a6',
    players: [
      '中国航天科技集团一院 / 火箭院',
      '长征十号乙 / 长征十号系列',
      '领航者海上回收平台',
    ],
    note: '文章里最有辨识度的增量，就是把“海上网捕”单独抽成中国可复用火箭的一条路线，而不是继续沿着 VTVL 走。',
  },
  {
    title: '国家队 VTVL 路线',
    subtitle: '成本导向的另一条国资主线',
    accent: '#38bdf8',
    players: [
      '航天八院',
      '长征十二甲 / 乙',
      '中国商火',
    ],
    note: '这组公司在文章里作为另一条国家队商业化路线出现，定位更偏纯商业市场与低成本发射。',
  },
  {
    title: '民营 VTVL 路线',
    subtitle: '技术迭代最快，但入轨和回收仍在爬坡',
    accent: '#f97316',
    players: [
      '蓝箭航天 / 朱雀三号',
      '星际荣耀 / 双曲线三号',
      '天兵科技 / 天龙三号',
    ],
    note: '文章明确把民营玩家放到“中型可回收火箭、普遍仍处入轨验证阶段”的位置上，今年最大的公开催化主要集中在蓝箭。',
  },
  {
    title: '海外成熟标杆',
    subtitle: '可复用工程化与资本化锚点',
    accent: '#facc15',
    players: ['SpaceX', 'Falcon 9', 'Starship'],
    note: 'SpaceX 在文中既是回收技术对标，也是产业链情绪和估值锚。若上市窗口推进，会成为整条商业航天链条的情绪放大器。',
  },
];

const timelineEvents = [
  {
    dateLabel: '2026-01-19',
    title: '海南商业航天发射场完成今年的重要商业发射节点',
    summary:
      '新华社披露，海南商业航天发射场在 1 月 19 日成功发射卫星互联网低轨 19 组卫星，说明商业发射场今年仍在常态化执行组网任务。',
    status: 'confirmed',
    companies: ['海南商业航天发射场', '卫星互联网'],
  },
  {
    dateLabel: '2026-01-27',
    title: '中国商火把“主力箭首飞 + 回收”定为全年主线',
    summary:
      '中国商火在年度工作会议中明确把首飞与回收攻坚放到核心任务，意味着国家队商业化平台在 2026 年把可重复使用技术推到更前排。',
    status: 'confirmed',
    companies: ['中国商火'],
  },
  {
    dateLabel: '2026-02-11',
    title: '长征十号系统低空演示验证与梦舟最大动压逃逸试验成功',
    summary:
      '这是今年最重要的官方已发生催化之一，直接验证了长征十号系列初样飞行与回收相关能力，也把“可复用 + 载人月球探测”叙事推到台前。',
    status: 'confirmed',
    companies: ['中国载人航天工程', '火箭院'],
  },
  {
    dateLabel: '2026-02-13',
    title: '我国首次完成火箭一级箭体海上打捞回收',
    summary:
      '两天后的官方打捞回收节点，让“海上回收”从概念变成工程动作，为后续长征十号乙海上网捕叙事提供现实锚点。',
    status: 'confirmed',
    companies: ['中国载人航天工程', '火箭院'],
  },
  {
    dateLabel: '2026-02-25',
    title: '蓝箭披露：朱雀三号计划在 2026 年第二季度再次开展回收试验',
    summary:
      '公司公开口径还给出了更远一步的目标：若 Q2 回收试验顺利，则争取在 2026 年第四季度尝试首次回收复用飞行。',
    status: 'planned',
    companies: ['蓝箭航天', '朱雀三号'],
  },
  {
    dateLabel: '2026-03-31',
    title: '蓝箭航天 IPO 状态变为“中止（财报更新）”',
    summary:
      '这条是对原文最需要纠偏的地方。蓝箭并非已经排定上市日，而是处在审核推进中，3 月底因为财报更新进入程序性中止，官方称不是终止审核。',
    status: 'watch',
    companies: ['蓝箭航天'],
  },
  {
    dateLabel: '2026-04-01',
    title: 'SpaceX 被 Bloomberg / Reuters 报道已秘密递交 IPO 草案',
    summary:
      '截至 2026-04-21，市场能看到的是“confidential filing”报道，而不是公开 S-1。若节奏顺利，主流报道提到的目标窗口是 6 月上市。',
    status: 'reported',
    companies: ['SpaceX'],
  },
  {
    dateLabel: '2026-04-15 to 2026-05-05',
    title: '文章定义的第一段布局窗口',
    summary:
      '这一段不是官方任务排期，而是原文给出的资金布局时间窗。页面保留它，是为了把“交易窗口”和“工程节点”区分开看。',
    status: 'article',
    companies: ['板块资金', '商业航天链'],
  },
  {
    dateLabel: '2026-H1 / late Apr rumor',
    title: '长征十号乙首飞被普遍放在 2026 年上半年',
    summary:
      '公开可见的更稳妥口径是“2026 年上半年首飞预期”。市场流传过“4 月 28 日在海南商发 2 号工位首飞”的说法，但截至 2026-04-21 我没有采用为确定日期。',
    status: 'watch',
    companies: ['长征十号乙', '海南国际商业航天发射场 2 号工位'],
  },
  {
    dateLabel: '2026-Q2 (Apr to Jun)',
    title: '朱雀三号第二次回收试验窗口',
    summary:
      '蓝箭公开口径只给到 Q2，没有精确到某天。把它放在时间轴里，是因为它和原文“5 月初到 6 月中旬催化密集”高度重合。',
    status: 'planned',
    companies: ['蓝箭航天', '朱雀三号'],
  },
  {
    dateLabel: '2026-Q4',
    title: '朱雀三号首次回收复用飞行目标窗口',
    summary:
      '这是蓝箭在公开沟通里给出的更远一层目标，前提是 Q2 回收试验顺利，因此它更适合作为“公司目标”而不是已经锁定的任务排期。',
    status: 'planned',
    companies: ['蓝箭航天', '朱雀三号'],
  },
  {
    dateLabel: '2026-05 early to 2026-06 mid',
    title: '文章中的第二段高密度催化窗',
    summary:
      '如果把原文拆开，实际对应的是 SpaceX 上市预期、蓝箭 IPO 重启 / 上市预期、朱雀三号回收试验，以及长征十号乙首飞预期等多条线共振。',
    status: 'article',
    companies: ['SpaceX', '蓝箭航天', '朱雀三号', '长征十号乙'],
  },
];

const sources = [
  {
    label: '中国载人航天工程网：长征十号系统低空演示验证成功（2026-02-11）',
    url: 'https://www.cmse.gov.cn/xwzx/202602/t20260211_57264.html',
  },
  {
    label: '中国载人航天工程网：首次火箭一级箭体海上打捞回收（2026-02-13）',
    url: 'https://www.cmse.gov.cn/xwzx/202602/t20260213_57272.html',
  },
  {
    label: '海南省政府：海南商业航天发射场一号工位首发成功、具备双工位能力（2025-03-12）',
    url: 'https://www.hainan.gov.cn/hainan/5309/202503/da0f1431ea1440e8b3d9b736eb5cbee7.shtml',
  },
  {
    label: '新华社：我国首艘火箭网系回收海上平台“领航者”交付（2025-12-01）',
    url: 'https://www.news.cn/20251201/594fb6cc7c7e4a3c994ce23e1f8e0607/c.html',
  },
  {
    label: '新华社：海南商业航天发射场成功发射卫星互联网低轨 19 组卫星（2026-01-19）',
    url: 'https://www.news.cn/tech/20260119/b64da3aff1e546ad8891757dd7d4d4af/c.html',
  },
  {
    label: '央视新闻：朱雀三号计划在 2026 年 Q2 再次挑战回收（2026-02-25）',
    url: 'https://news.cctv.com/2026/02/25/ARTIZJBwHyhhubEBpHVKg3hu260225.shtml',
  },
  {
    label: '蓝箭航天官网：朱雀三号遥一入轨成功（2025-12-03）',
    url: 'https://www.landspace.com/news-detail.html?itemid=66',
  },
  {
    label: '上交所：商业火箭企业适用科创板第五套上市标准（2025-12-26）',
    url: 'https://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20251226_10803077.shtml',
  },
  {
    label: '澎湃 / 蓝箭回应：IPO 中止系财报更新，将补充申报材料（2026-03-31）',
    url: 'https://finance.sina.com.cn/jjxw/2026-03-31/doc-inhswttq3267513.shtml',
  },
  {
    label: 'Reuters 报道转载：SpaceX 4 月 1 日秘密递交 IPO 草案',
    url: 'https://www.investing.com/news/stock-market-news/factboxmega-ipos-loom-on-wall-street-as-elon-musks-spacex-confidentially-files-paperwork-4593643',
  },
];

const statusMeta = {
  confirmed: {
    label: '已确认',
    icon: CheckCircle2,
    className:
      'border-emerald-400/25 bg-emerald-400/10 text-emerald-200',
  },
  planned: {
    label: '公司披露计划',
    icon: CalendarRange,
    className: 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200',
  },
  reported: {
    label: '媒体报道',
    icon: Radar,
    className: 'border-indigo-400/25 bg-indigo-400/10 text-indigo-200',
  },
  watch: {
    label: '市场观察',
    icon: AlertTriangle,
    className:
      'border-amber-400/25 bg-amber-400/10 text-amber-100',
  },
  article: {
    label: '文章时间窗',
    icon: Orbit,
    className: 'border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-100',
  },
  supplement: {
    label: '研究补充',
    icon: Sparkles,
    className: 'border-slate-400/25 bg-slate-400/10 text-slate-200',
  },
};

const sourceTypeMeta = {
  article: '文中',
  confirmed: '公开',
  supplement: '补充',
  inference: '推断',
};

function StatusBadge({ status }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase ${meta.className}`}
    >
      <Icon size={14} />
      {meta.label}
    </span>
  );
}

function SourceTypePill({ type }) {
  return (
    <span className="rounded-full border border-slate-600/80 bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {sourceTypeMeta[type] ?? '补充'}
    </span>
  );
}

function StageCard({ stage }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.4)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: stage.accent }}
        />
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {stage.eyebrow}
        </div>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-100">
        {stage.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        {stage.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {stage.bullets.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-xs text-slate-300"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {stage.companies.map((company) => (
          <div
            key={company.name}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-medium text-slate-100">
                {company.name}
              </div>
              <SourceTypePill type={company.sourceType} />
            </div>
            <div className="mt-2 text-xs leading-6 text-slate-400">
              {company.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StageRow({ stage }) {
  const isLeft = stage.side === 'left';

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)] md:items-center">
      <div>{isLeft ? <StageCard stage={stage} /> : null}</div>

      <div className="relative mx-auto flex w-full max-w-[220px] flex-col items-center justify-center">
        <div className="pointer-events-none absolute inset-y-[-22px] left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-slate-700/0 via-slate-500/70 to-slate-700/0 md:block" />
        <div
          className={`relative flex w-full items-center justify-center border border-white/15 bg-slate-900/95 ${stage.segmentClass}`}
          style={{
            boxShadow: `0 0 0 1px ${stage.accent}22, 0 18px 60px ${stage.accent}20`,
          }}
        >
          <div
            className={`absolute top-1/2 hidden h-px w-12 -translate-y-1/2 md:block ${
              isLeft
                ? 'right-full bg-gradient-to-r from-slate-500/80 to-transparent'
                : 'left-full bg-gradient-to-r from-transparent to-slate-500/80'
            }`}
          />

          <div
            className="absolute inset-x-3 top-3 h-px bg-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-3 bottom-3 h-px bg-white/8"
            aria-hidden="true"
          />

          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Stage
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-100">
              {stage.segment}
            </div>
          </div>
        </div>
      </div>

      <div>{!isLeft ? <StageCard stage={stage} /> : null}</div>
    </div>
  );
}

function TimelineCard({ event }) {
  return (
    <div className="relative rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_20px_70px_rgba(2,6,23,0.35)] backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-xs font-semibold text-slate-200">
          {event.dateLabel}
        </div>
        <StatusBadge status={event.status} />
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-100">
        {event.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">
        {event.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {event.companies.map((company) => (
          <span
            key={company}
            className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs text-slate-300"
          >
            {company}
          </span>
        ))}
      </div>
    </div>
  );
}

function CommercialSpaceReport() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 pb-16 text-slate-100">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-[0_30px_120px_rgba(2,6,23,0.5)] backdrop-blur md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,6,23,0.92))]" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
              <Rocket size={14} />
              Commercial Space 2026
            </div>

            <h2 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-slate-50 md:text-5xl">
              商业航天：可复用火箭爆炸图与 2026 年催化时间轴
            </h2>

            <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-[15px]">
              按原文的交易视角，这一轮行情不是只看单一发射，而是把
              <span className="text-cyan-200"> 长征十号乙海上网捕路线 </span>
              、<span className="text-amber-200">朱雀三号回收试验</span>、
              <span className="text-fuchsia-200"> 蓝箭资本化进度 </span>
              和
              <span className="text-emerald-200">SpaceX 上市预期</span>
              叠在一起看。页面里把原文缺口补齐后，重点区分四类口径：已确认、公司披露计划、媒体报道、市场预期。
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {snapshotCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {card.label}
                  </div>
                  <div className="mt-2 text-base font-semibold text-slate-100">
                    {card.value}
                  </div>
                  <div className="mt-2 text-xs leading-6 text-slate-400">
                    {card.note}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Flame size={16} className="text-amber-300" />
              研究补全后的三条修正
            </div>
            <div className="mt-4 space-y-3">
              {researchCorrections.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4"
                >
                  <StatusBadge status={item.tone} />
                  <div className="mt-3 text-sm font-semibold text-slate-100">
                    {item.title}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Part 1
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-slate-50 md:text-3xl">
              火箭发射爆炸图：把公司放回每一个环节
            </h3>
          </div>
          <div className="max-w-xl text-sm leading-7 text-slate-400">
            中轴是一枚被拆开的火箭，左右是各环节的参与者与补全口径。页面把“海上网捕”和“VTVL”刻意拆开，避免把不同路线揉成同一种叙事。
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_90px_rgba(2,6,23,0.38)] backdrop-blur md:p-7">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_42%)]" />
            <div className="relative space-y-5">
              {explodedStages.map((stage) => (
                <StageRow key={stage.key} stage={stage} />
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-4">
            {routeCards.map((route) => (
              <div
                key={route.title}
                className="rounded-[1.5rem] border border-white/10 bg-slate-900/65 p-5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: route.accent }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-100">
                      {route.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {route.subtitle}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {route.players.map((player) => (
                    <span
                      key={player}
                      className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300"
                    >
                      {player}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {route.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-fuchsia-200">
              Part 2
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-slate-50 md:text-3xl">
              2026 年商业航天催化时间轴
            </h3>
          </div>
          <div className="max-w-xl text-sm leading-7 text-slate-400">
            这一段把原文里的时间描述尽量落到绝对日期上。能确认的就给日期，不能确认的则明确标成“公司披露计划”或“市场观察”，避免把交易预期误画成官宣日程。
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 shadow-[0_24px_90px_rgba(2,6,23,0.38)] backdrop-blur md:p-7">
          <div className="grid gap-4 lg:grid-cols-2">
            {timelineEvents.map((event) => (
              <TimelineCard key={`${event.dateLabel}-${event.title}`} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-[0_24px_90px_rgba(2,6,23,0.34)] backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Ship size={16} className="text-cyan-300" />
          信息来源
        </div>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
          研究补充优先采用官方机构、公司官网和主流媒体。对于 SpaceX 递表、长征十号乙首飞窗口这类仍在变化中的信息，页面已经用状态标签区分“报道 / 观察 / 官宣”。
        </p>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-900"
            >
              {source.label}
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}

export default CommercialSpaceReport;
