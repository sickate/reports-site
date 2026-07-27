import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ChartNoAxesCombined,
  CircleDollarSign,
  Database,
  Factory,
  Gauge,
  Layers3,
  Network,
  ShieldCheck,
  Target,
} from 'lucide-react';
import {
  dataLabels,
  buildMemorySankey,
  financialCalendar,
  hbmMarket,
  memoryFinancials,
  memorySankeySummary,
  nvidiaFinancials,
  profitPool2026,
  profitPool2027,
  qualityScores,
  reportMeta,
  scenarioData,
  watchlist,
  withdrawnNumbers,
} from './data.js';

const axisStyle = {
  tick: { fill: '#94a3b8', fontSize: 11 },
  tickLine: false,
  axisLine: { stroke: 'rgba(148, 163, 184, 0.18)' },
};

const tooltipStyle = {
  contentStyle: {
    background: 'rgba(15, 23, 42, 0.98)',
    border: '1px solid rgba(148, 163, 184, 0.32)',
    borderRadius: 10,
    color: '#e2e8f0',
    fontSize: 12,
  },
  labelStyle: { color: '#f8fafc', fontWeight: 600 },
};

const badgeTone = {
  emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  sky: 'border-sky-400/30 bg-sky-400/10 text-sky-200',
  violet: 'border-violet-400/30 bg-violet-400/10 text-violet-200',
  amber: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  orange: 'border-orange-400/30 bg-orange-400/10 text-orange-200',
  rose: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  slate: 'border-slate-500/40 bg-slate-500/15 text-slate-300',
};

const scenarioTone = {
  emerald: {
    border: 'border-emerald-400/25',
    bg: 'from-emerald-400/[0.11] to-emerald-400/[0.02]',
    pill: 'bg-emerald-400/15 text-emerald-200 border-emerald-400/30',
    bar: 'bg-emerald-400',
  },
  amber: {
    border: 'border-amber-400/25',
    bg: 'from-amber-400/[0.11] to-amber-400/[0.02]',
    pill: 'bg-amber-400/15 text-amber-200 border-amber-400/30',
    bar: 'bg-amber-400',
  },
  rose: {
    border: 'border-rose-400/25',
    bg: 'from-rose-400/[0.11] to-rose-400/[0.02]',
    pill: 'bg-rose-400/15 text-rose-200 border-rose-400/30',
    bar: 'bg-rose-400',
  },
};

const SectionHeading = ({ number, eyebrow, title, children, id }) => (
  <div id={id} className="mb-6 mt-14 scroll-mt-24">
    <div className="mb-2 flex items-center gap-3">
      <span className="font-mono text-xs tracking-[0.24em] text-sky-300/75">{number}</span>
      <span className="h-px w-8 bg-sky-400/40" />
      <span className="text-xs font-medium tracking-wide text-slate-500">{eyebrow}</span>
    </div>
    <h2 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">{title}</h2>
    {children && <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">{children}</p>}
  </div>
);

const MiniLabel = ({ children, tone = 'slate' }) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${badgeTone[tone]}`}>
    {children}
  </span>
);

const InsightCard = ({ icon: Icon, label, title, children, tone = 'sky' }) => {
  const iconTone = {
    sky: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
    amber: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
    emerald: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
  }[tone];
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/35 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ring-1 ${iconTone}`}><Icon size={20} /></div>
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">{label}</span>
      </div>
      <h3 className="text-lg font-semibold leading-snug text-slate-100">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-slate-400">{children}</div>
    </div>
  );
};

const FlowNode = ({ icon: Icon, label, detail, tone = 'sky' }) => {
  const styles = tone === 'amber'
    ? 'border-amber-400/25 bg-amber-400/[0.06] text-amber-200'
    : tone === 'emerald'
      ? 'border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-200'
      : 'border-sky-400/25 bg-sky-400/[0.06] text-sky-200';
  return (
    <div className={`min-w-0 flex-1 rounded-2xl border p-4 ${styles}`}>
      <Icon size={18} className="mb-3" />
      <div className="text-sm font-semibold">{label}</div>
      <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
    </div>
  );
};

const ProfitRangeChart = ({ period, data }) => {
  const rows = data.map((item) => ({
    ...item,
    floor: item.low,
    range: item.high - item.low,
    label: `$${item.low}–${item.high}B`,
  }));
  const ceiling = period === 'CY2027E' ? 450 : 300;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 48, bottom: 0, left: 8 }} barCategoryGap="28%">
        <CartesianGrid horizontal={false} stroke="rgba(148,163,184,0.12)" />
        <XAxis type="number" domain={[0, ceiling]} tickFormatter={(value) => `$${value}B`} {...axisStyle} />
        <YAxis type="category" dataKey="name" width={104} {...axisStyle} />
        <Tooltip
          {...tooltipStyle}
          cursor={{ fill: 'rgba(148,163,184,0.06)' }}
          formatter={(value, name, props) => {
            if (name === 'floor') return [`$${props.payload.low}B`, '区间下沿'];
            if (name === 'range') return [`$${props.payload.high}B`, '区间上沿'];
            return [value, name];
          }}
        />
        <Bar dataKey="floor" stackId="range" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="range" stackId="range" radius={[5, 5, 5, 5]} name="range">
          {rows.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
          <LabelList
            dataKey="label"
            position="right"
            fill="#cbd5e1"
            fontSize={11}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const HbmMarketChart = () => (
  <ResponsiveContainer width="100%" height={272}>
    <BarChart data={hbmMarket} margin={{ top: 12, right: 18, left: -10, bottom: 0 }} barCategoryGap="35%">
      <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" />
      <XAxis dataKey="year" {...axisStyle} />
      <YAxis tickFormatter={(value) => `$${value}B`} {...axisStyle} />
      <Tooltip {...tooltipStyle} formatter={(value) => [`$${value}B`, '']} />
      <Bar dataKey="hynix" stackId="hbm" fill="#f28e8e" name="SK hynix" radius={[0, 0, 3, 3]} />
      <Bar dataKey="samsung" stackId="hbm" fill="#e9c46a" name="Samsung" />
      <Bar dataKey="micron" stackId="hbm" fill="#89d6ae" name="Micron" radius={[3, 3, 0, 0]}>
        <LabelList dataKey="total" position="top" formatter={(value) => `$${value}B`} fill="#e2e8f0" fontSize={11} />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const FinancialQualityChart = () => (
  <ResponsiveContainer width="100%" height={248}>
    <LineChart data={nvidiaFinancials} margin={{ top: 12, right: 12, left: -10, bottom: 0 }}>
      <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.12)" />
      <XAxis dataKey="period" {...axisStyle} />
      <YAxis yAxisId="revenue" tickFormatter={(value) => `$${value}B`} domain={[0, 100]} {...axisStyle} />
      <YAxis yAxisId="margin" orientation="right" domain={[50, 70]} tickFormatter={(value) => `${value}%`} {...axisStyle} />
      <Tooltip
        {...tooltipStyle}
        formatter={(value, name) => [name === '营业利润率' ? `${value}%` : `$${value}B`, name]}
      />
      <Line yAxisId="revenue" type="monotone" dataKey="revenue" name="收入" stroke="#76b7ff" strokeWidth={2.5} dot={{ r: 4, fill: '#76b7ff' }} />
      <Line yAxisId="margin" type="monotone" dataKey="opMargin" name="营业利润率" stroke="#e9c46a" strokeWidth={2.25} strokeDasharray="5 4" dot={{ r: 4, fill: '#e9c46a' }} connectNulls={false} />
    </LineChart>
  </ResponsiveContainer>
);

const MicronChart = ({ row }) => {
  const chartData = row.labels.map((label, index) => ({ label, value: row.values[index], status: index === 3 ? 'G' : 'A' }));
  return (
    <ResponsiveContainer width="100%" height={138}>
      <AreaChart data={chartData} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="micronArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={row.color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={row.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" {...axisStyle} />
        <YAxis hide domain={[0, 55]} />
        <Tooltip {...tooltipStyle} formatter={(value) => [`$${value}B`, '收入']} />
        <Area type="monotone" dataKey="value" stroke={row.color} strokeWidth={2.3} fill="url(#micronArea)" dot={{ r: 3, fill: row.color }} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const fmtSankeyBn = (value) => `$${Number(value).toFixed(value >= 100 ? 0 : 1)}B`;

const SankeyLink = ({
  sourceX,
  sourceY,
  sourceControlX,
  targetX,
  targetY,
  targetControlX,
  linkWidth,
  payload,
}) => {
  const stroke = payload.source?.color || '#64748b';
  const path = `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`;
  return (
    <path
      d={path}
      fill="none"
      stroke={stroke}
      strokeOpacity={0.3}
      strokeWidth={Math.max(linkWidth, 1)}
    />
  );
};

const SankeyNode = ({ x, y, width, height, payload }) => {
  const labelOnLeft = payload.stage === 0 || payload.stage === 2;
  const labelX = labelOnLeft ? x - 8 : x + width + 8;
  const textAnchor = labelOnLeft ? 'end' : 'start';

  return (
    <g>
      <rect x={x} y={y} width={width} height={Math.max(height, 1)} rx={2} fill={payload.color} />
      <title>{`${payload.label} · ${fmtSankeyBn(payload.value)}`}</title>
      {payload.stage < 3 && (
        <text
          x={labelX}
          y={y + height / 2}
          dy="0.35em"
          fill="#cbd5e1"
          fontSize={10}
          fontWeight={500}
          paintOrder="stroke"
          stroke="#0f172a"
          strokeWidth={3}
          textAnchor={textAnchor}
        >
          {payload.label}
        </text>
      )}
    </g>
  );
};

const SankeyTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload?.payload || payload[0]?.payload;
  const source = item?.source?.label;
  const target = item?.target?.label;

  if (!source || !target) return null;

  return (
    <div className="max-w-56 rounded-xl border border-slate-600/70 bg-slate-950/95 px-3 py-2.5 text-xs shadow-xl">
      <div className="font-medium leading-5 text-slate-100">{source} <span className="text-slate-500">→</span> {target}</div>
      <div className="mt-1 flex items-center justify-between gap-4"><span className="text-slate-500">流量</span><span className="font-mono font-semibold text-slate-100">{fmtSankeyBn(item.value)}</span></div>
      <div className="mt-1 text-[10px] text-slate-500">{item.status} · 置信度 {item.confidence}</div>
    </div>
  );
};

const MobileSankeyLedger = ({ year }) => {
  const data = buildMemorySankey(year);
  const stageRows = (stage) => data.nodes
    .map((node, index) => ({ node, index }))
    .filter(({ node }) => node.stage === stage)
    .map(({ node, index }) => {
      const outgoing = data.links.filter((link) => link.source === index);
      const incoming = data.links.filter((link) => link.target === index);
      const value = [...outgoing, ...incoming].reduce((total, link) => total + link.value, 0) / (outgoing.length && incoming.length ? 2 : 1);
      const profit = outgoing.find((link) => link.targetName.startsWith('归属净利'))?.value;
      return { label: node.label, value, color: node.color, profit };
    });
  const total = memorySankeySummary[year].market;
  const sections = [
    ['下游平台', stageRows(0)],
    ['内存品类', stageRows(1)],
    ['供应商收入等价值 → 归属净利', stageRows(2)],
  ];

  return (
    <div className="space-y-3 md:hidden">
      {sections.map(([title, rows], sectionIndex) => (
        <div key={title}>
          {sectionIndex > 0 && <ArrowDown size={16} className="mx-auto mb-3 text-slate-600" aria-hidden="true" />}
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-slate-200">{title}</span><span className="text-[10px] text-slate-500">USD bn</span></div>
          <div className="space-y-2">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3">
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2 text-[11px]"><span className="truncate text-slate-300">{row.label}</span><span className="font-mono text-slate-200">{fmtSankeyBn(row.value)}</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full" style={{ width: `${Math.max((row.value / total) * 100, 1.5)}%`, backgroundColor: row.color }} /></div>
                </div>
                {row.profit !== undefined && <span className="font-mono text-[10px] text-emerald-300">净利 {fmtSankeyBn(row.profit)}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const MemorySankeyChart = ({ year }) => {
  const data = buildMemorySankey(year);
  return (
    <div role="img" aria-label={`${year} 年全球存储市场从下游平台、内存品类、供应商到归属净利和成本税费的资金流向图`}>
      <div className="hidden md:block">
        <div className="mb-3 grid grid-cols-4 px-2 text-center text-[10px] font-medium tracking-wide text-slate-500">
          <span>下游平台</span><span>内存品类</span><span>供应商</span><span>利润归属</span>
        </div>
        <ResponsiveContainer width="100%" height={620}>
          <Sankey
            data={data}
            node={<SankeyNode />}
            link={<SankeyLink />}
            nodePadding={8}
            nodeWidth={11}
            linkCurvature={0.52}
            iterations={32}
            margin={{ top: 4, right: 110, bottom: 6, left: 110 }}
            sort={false}
          >
            <Tooltip content={<SankeyTooltip />} cursor={false} />
          </Sankey>
        </ResponsiveContainer>
      </div>
      <MobileSankeyLedger year={year} />
    </div>
  );
};

const CompanyMetricCard = ({ data }) => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold text-slate-100">{data.company}</h3>
        <p className="mt-1 text-[11px] text-slate-500">{data.status}</p>
      </div>
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
    </div>
    {data.company === 'Micron' ? (
      <MicronChart row={data} />
    ) : (
      <div className="mt-7 flex items-end gap-4">
        {data.values.map((value, index) => (
          <div key={data.labels[index]} className="flex-1">
            <div className="mb-2 text-2xl font-bold text-slate-100">{value}%</div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: data.color }} />
            </div>
            <div className="mt-2 text-[11px] text-slate-500">{data.labels[index]}</div>
          </div>
        ))}
      </div>
    )}
    <div className="mt-4 border-t border-slate-800 pt-3 text-xs leading-5 text-slate-400">{data.note}</div>
  </div>
);

const MemoryProfitPoolReport = () => {
  const [profitPeriod, setProfitPeriod] = useState('CY2026E');
  const [sankeyYear, setSankeyYear] = useState(2026);
  const profitData = profitPeriod === 'CY2026E' ? profitPool2026 : profitPool2027;
  const sankeySummary = memorySankeySummary[sankeyYear];

  return (
    <article className="mx-auto max-w-7xl px-1 pb-12 text-slate-200 md:px-4">
      <header id="overview" className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-950/45 px-5 py-8 md:px-9 md:py-10">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-80 rounded-full bg-amber-400/[0.07] blur-3xl" />
        <div className="relative max-w-5xl">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <MiniLabel tone="sky">深度研究 / 终版 V2.0</MiniLabel>
            <MiniLabel tone="slate">数据截至 {reportMeta.asOf}</MiniLabel>
            <span className="text-xs text-slate-500">GAAP / IFRS 营业利润口径</span>
          </div>
          <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-50 md:text-5xl md:leading-tight">{reportMeta.title}</h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-slate-300 md:text-lg">{reportMeta.subtitle}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.07] p-4">
              <div className="text-[11px] font-medium tracking-wide text-sky-200">结构性触发器</div>
              <div className="mt-1 text-xl font-bold text-slate-100">AI / HBM 需求</div>
              <p className="mt-1 text-xs leading-5 text-slate-400">挤占 DRAM 晶圆与先进封装资源</p>
            </div>
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4">
              <div className="text-[11px] font-medium tracking-wide text-amber-200">利润放大器</div>
              <div className="mt-1 text-xl font-bold text-slate-100">全品类 ASP</div>
              <p className="mt-1 text-xs leading-5 text-slate-400">普通 DRAM、NAND、eSSD 同步提价</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
              <div className="text-[11px] font-medium tracking-wide text-emerald-200">NVIDIA 的护城河</div>
              <div className="mt-1 text-xl font-bold text-slate-100">平台租金</div>
              <p className="mt-1 text-xs leading-5 text-slate-400">CUDA、网络、系统与交付能力</p>
            </div>
          </div>
        </div>
      </header>

      <nav className="sticky top-16 z-20 mt-4 flex gap-2 overflow-x-auto rounded-2xl border border-slate-700/50 bg-slate-950/90 p-2 backdrop-blur">
        {[
          ['overview', '核心结论'], ['profit-pool', '利润池'], ['drivers', '增长驱动'], ['sankey', 'Sankey'], ['scenarios', '2027 情景'], ['watch', '跟踪框架'], ['quality', '质量边界'],
        ].map(([href, label]) => (
          <a key={href} href={`#${href}`} className="whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-100">{label}</a>
        ))}
      </nav>

      <SectionHeading number="01" eyebrow="EXECUTIVE SUMMARY" title="先给答案：HBM 是引爆点，不是全部利润">
        存储厂商的盈利接近 NVIDIA，不是因为单颗 GPU 的 HBM 成本很高；而是 HBM 需求改变了稀缺资源的配置，使整个存储组合价格与经营杠杆同时向上。
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-3">
        <InsightCard icon={Network} label="传导机制" title="稀缺从 HBM 扩散到通用存储" tone="sky">
          AI / HBM 需求优先占用 DRAM wafer 与封装能力；供给被挤出后，服务器 DRAM、移动 / PC DRAM、NAND 和 eSSD 同时涨价。
        </InsightCard>
        <InsightCard icon={Factory} label="存储厂盈利模型" title="全品类 ASP × 存量产能 × 高固定成本" tone="amber">
          HBM 是高价值产品，但普通 DRAM 和 NAND 在严重短缺时也能在成本变化有限的情况下捕获极高增量利润。
        </InsightCard>
        <InsightCard icon={ShieldCheck} label="NVIDIA 盈利模型" title="高 ASP × 系统锁定 × 平台附加值" tone="emerald">
          利润不仅来自 GPU；CUDA、NVLink / NVSwitch、Spectrum-X、BlueField、网络与整机交付共同构成平台定价权。
        </InsightCard>
      </div>

      <div className="mt-5 rounded-2xl border border-sky-400/25 bg-gradient-to-r from-sky-400/[0.09] via-slate-900/35 to-amber-400/[0.07] p-5 md:p-6">
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          <FlowNode icon={Boxes} label="AI / HBM 需求" detail="高层数堆叠、先进封装、认证期拉长" tone="sky" />
          <ArrowRight className="mx-auto shrink-0 text-slate-500 lg:mx-0" size={22} />
          <FlowNode icon={Layers3} label="晶圆 / 封装被挤占" detail="有效 bit 供给低于需求，资源稀缺扩散" tone="amber" />
          <ArrowRight className="mx-auto shrink-0 text-slate-500 lg:mx-0" size={22} />
          <FlowNode icon={CircleDollarSign} label="存储利润池放大" detail="DRAM、NAND、eSSD 的 ASP 与经营杠杆共振" tone="emerald" />
        </div>
        <p className="mt-4 text-center text-sm font-medium text-slate-200">结论：<span className="text-sky-200">HBM 是结构性触发器</span>；<span className="text-amber-200">普通 DRAM、NAND 与企业级 SSD 是利润池的主要放大器</span>。</p>
      </div>

      <SectionHeading id="profit-pool" number="02" eyebrow="CY2026E PROFIT POOL" title="统一到日历年后，NVIDIA 与 Samsung 的利润区间重叠">
        所有比较均为 GAAP / IFRS 营业利润。NVIDIA 和 Micron 的财年与日历年错位，因此图中的区间不是同等确定性的公司指引；状态标签与置信度必须随数字保留。
      </SectionHeading>
      <div className="grid gap-4 xl:grid-cols-[1.55fr_0.85fr]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-100">公司营业利润区间</h3>
              <p className="mt-1 text-xs text-slate-500">单位：USD bn；Samsung 使用固定汇率 KRW 1,475 / USD，仅用于横向比较。</p>
            </div>
            <div className="flex rounded-xl border border-slate-700/60 bg-slate-950/60 p-1">
              {['CY2026E', 'CY2027E'].map((period) => (
                <button
                  key={period}
                  onClick={() => setProfitPeriod(period)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${profitPeriod === period ? 'bg-slate-200 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
                >{period}</button>
              ))}
            </div>
          </div>
          <ProfitRangeChart period={profitPeriod} data={profitData} />
          <div className="grid gap-x-4 gap-y-2 border-t border-slate-800 pt-4 sm:grid-cols-2">
            {profitData.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-2 text-slate-300"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
                <span className="text-slate-500"><span className="text-slate-300">{item.status}</span> · 置信度 {item.confidence}</span>
              </div>
            ))}
          </div>
        </section>
        <aside className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.055] p-5 md:p-6">
          <div className="flex items-center gap-2 text-amber-200"><Target size={18} /><span className="text-xs font-semibold tracking-wide">正确的可流转表述</span></div>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-300">
            <li className="border-l-2 border-amber-300/60 pl-3">Samsung 在 2026 年<span className="font-semibold text-amber-100">可能</span>接近或超过 NVIDIA 营业利润，但现有信息不支持“确定超过”。</li>
            <li className="border-l-2 border-slate-500 pl-3">SK hynix 单独超过 NVIDIA 的概率较低，CY2026E 约为 NVIDIA 的 <span className="font-semibold text-slate-100">53%—73%</span>。</li>
            <li className="border-l-2 border-emerald-400/60 pl-3">Micron 盈利弹性很强，但财年错位使日历化误差更大。</li>
          </ul>
        </aside>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
          <h3 className="text-base font-semibold text-slate-100">会计期间统一：不可跳过的第一步</h3>
          <div className="mt-4 space-y-3">
            {financialCalendar.map((row) => (
              <div key={row.company} className="grid grid-cols-[1.1fr_0.65fr_1.35fr] items-center gap-2 border-b border-slate-800/70 pb-3 text-xs last:border-0 last:pb-0">
                <span className="font-medium text-slate-200">{row.company}</span><span className="text-slate-500">{row.fiscal}</span><span className={row.marker === 'CY' ? 'text-emerald-300' : 'text-amber-300'}>{row.alignment}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
          <h3 className="text-base font-semibold text-slate-100">数据标签是结论的一部分</h3>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {dataLabels.map((item) => (
              <div key={item.key} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-2.5">
                <MiniLabel tone={item.tone}>{item.key} · {item.label}</MiniLabel>
                <p className="mt-2 text-[11px] text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <SectionHeading id="drivers" number="03" eyebrow="WHAT IS REALLY DRIVING PROFITS" title="HBM 市场爆发，但不能将它等同于全部存储利润">
        BNP Paribas 的具名预测为全球 HBM 收入 CY2026E 约 $76B、CY2027E 约 $156B。供应商收入拆分是假设份额不变下的数量级校验，并非公司指引或市场共识。
      </SectionHeading>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div><h3 className="font-semibold text-slate-100">HBM 收入：2026E → 2027E</h3><p className="mt-1 text-xs text-slate-500">2025 年末收入份额：SK hynix 57% · Samsung 22% · Micron 21%</p></div>
            <MiniLabel tone="orange">E + M</MiniLabel>
          </div>
          <HbmMarketChart />
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400">
            <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#f28e8e]" />SK hynix</span>
            <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#e9c46a]" />Samsung</span>
            <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#89d6ae]" />Micron</span>
          </div>
        </section>
        <section className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.055] p-5 md:p-6">
          <div className="flex items-center gap-2 text-sky-200"><Gauge size={18} /><span className="text-sm font-semibold">HBM 的利润边界</span></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-sky-400/20 bg-slate-950/35 p-4"><div className="text-xs text-slate-500">2026E 贡献毛利情景</div><div className="mt-1 text-2xl font-bold text-slate-100">$49B—62B</div><div className="mt-1 text-[11px] text-slate-500">全球 HBM 收入 $76B</div></div>
            <div className="rounded-xl border border-sky-400/20 bg-slate-950/35 p-4"><div className="text-xs text-slate-500">2027E 贡献毛利情景</div><div className="mt-1 text-2xl font-bold text-slate-100">$101B—128B</div><div className="mt-1 text-[11px] text-slate-500">全球 HBM 收入 $156B</div></div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">三家公司均未披露 HBM 独立毛利率。上述假设为 <span className="font-semibold text-sky-100">65%—82% 贡献毛利</span>的情景上限，而不是营业利润；尚需扣除研发、认证、工程支持、销售管理、库存和良率风险。</p>
          <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3 text-xs leading-5 text-amber-100">即便取高端假设，HBM 也无法单独解释三家存储厂的集团利润。普通服务器 DRAM、移动 / PC DRAM、NAND 与 eSSD 必然是更大的利润来源之一。</div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <InsightCard icon={Database} label="反例验证" title="商品 DRAM 也能创造极高利润" tone="amber">Nanya 并非主流数据中心 HBM 供应商，但 Q2 2026 毛利率达 <span className="font-semibold text-amber-200">79.5%</span>，主要由普通 DRAM ASP 上涨推动。</InsightCard>
        <InsightCard icon={AlertTriangle} label="不可做的推导" title="不能从公司利润率反推产品利润率" tone="sky">Samsung 未披露 Memory / HBM / DRAM / NAND 独立利润；SK hynix 的 71.5% 也不是 HBM 独立营业利润率。</InsightCard>
        <InsightCard icon={Network} label="客户边界" title="终端需求不等于直接客户收入" tone="emerald">ODM、OEM、云厂商、最终使用方和最终算力平台需区分。所有 Microsoft、Meta、Amazon、Google 与 NVIDIA 的精确客户收入归因均不可用。</InsightCard>
      </div>

      <SectionHeading id="sankey" number="04" eyebrow="MEMORY VALUE FLOW" title="从下游平台到供应商：完整的内存价值与利润流向">
        该模型将全球市场价值沿“下游平台 → 内存品类 → 供应商 → 归属净利 / 成本税费”分配。供应商节点是市场价值按份额分配的收入等价值，并不等于会计报表收入；下游拆分、利润率和大部分 2027 参数均为模型假设。
      </SectionHeading>
      <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-slate-100">全球 Memory 市场价值流向</h3>
            <p className="mt-1 text-xs text-slate-500">单位：USD bn · 悬停任一流带可查看数值、数据状态与置信度</p>
          </div>
          <div className="flex rounded-xl border border-slate-700/60 bg-slate-950/60 p-1">
            {[2026, 2027].map((year) => (
              <button
                key={year}
                onClick={() => setSankeyYear(year)}
                aria-pressed={sankeyYear === year}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${sankeyYear === year ? 'bg-slate-200 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}
              >CY{year}</button>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 border-y border-slate-800 py-4 sm:grid-cols-3">
          <div><div className="text-[11px] text-slate-500">全球 Memory 市场价值</div><div className="mt-1 text-xl font-bold text-slate-100">${sankeySummary.market.toLocaleString()}B</div></div>
          <div><div className="text-[11px] text-slate-500">模型归属净利</div><div className="mt-1 text-xl font-bold text-emerald-300">${sankeySummary.netProfit.toFixed(2)}B</div></div>
          <div><div className="text-[11px] text-slate-500">模型净利率</div><div className="mt-1 text-xl font-bold text-slate-100">{sankeySummary.netMargin.toFixed(1)}%</div><div className="mt-0.5 text-[10px] text-slate-500">{sankeySummary.status} · 置信度 {sankeySummary.confidence}</div></div>
        </div>
        <MemorySankeyChart year={sankeyYear} />
        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-800 pt-4 text-[11px] text-slate-400">
          <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-400" />绿色：模型归属净利</span>
          <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-slate-500" />灰色：成本、Opex、税费及其他</span>
          <span>2026 HBM $76B 为 BNP Paribas 外部预测；2027 $1,110B 全球 Memory 市场为内部情景，不是 WSTS 预测。</span>
        </div>
      </section>

      <SectionHeading number="05" eyebrow="CURRENT FACT BASE" title="已验证的运行率：NVIDIA 强势，存储厂盈利弹性更高">
        实际披露是报告的事实层；Q2 初步业绩、公司指引和内部模型必须在同一视图中明确区分。NVIDIA Q1 FY2027 的 Networking 收入同比 +199%，快于 Compute 的 +77%，系统与网络价值占比正在提高。
      </SectionHeading>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-100">NVIDIA：收入与营业利润率</h3><p className="mt-1 text-xs text-slate-500">FY2026 A · Q4 FY2026 A · Q1 FY2027 A · Q2 FY2027 收入指引</p></div><MiniLabel tone="emerald">A / G</MiniLabel></div>
          <FinancialQualityChart />
          <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-xs">
            <div><div className="text-slate-500">FY2026 收入</div><div className="mt-1 font-semibold text-slate-100">$215.938B</div></div>
            <div><div className="text-slate-500">Q1 FY2027 DC</div><div className="mt-1 font-semibold text-slate-100">$75.2B</div></div>
            <div><div className="text-slate-500">Q2 FY2027 指引</div><div className="mt-1 font-semibold text-slate-100">$91.0B ±2%</div></div>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5 md:p-6">
          <h3 className="font-semibold text-slate-100">存储厂：有用事实与不可逾越的边界</h3>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/35 p-3"><span className="font-medium text-slate-100">Samsung：</span>Q1 2026 集团收入 KRW 133.9T、营业利润 KRW 57.2T；Q2 初步为 KRW 171.0T / KRW 89.4T。DS 包括 Foundry 与 System LSI，不能视为 Memory。</div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/35 p-3"><span className="font-medium text-slate-100">SK hynix：</span>Q1 2026 收入 KRW 52.576T、营业利润 KRW 37.610T；HBM、服务器内存与 eSSD 共同驱动。</div>
            <div className="rounded-xl border border-slate-700/50 bg-slate-950/35 p-3"><span className="font-medium text-slate-100">Micron：</span>FYQ3 DRAM 收入 $31.3B（76%）、NAND $9.9B（24%）；DRAM ASP 环比上涨低 60% 区间，NAND 为中 80% 区间。</div>
          </div>
        </section>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {memoryFinancials.map((company) => <CompanyMetricCard key={company.company} data={company} />)}
      </div>

      <SectionHeading id="scenarios" number="06" eyebrow="CY2027 SCENARIOS" title="相对于 CY2026 利润 = 100：决定收益弹性的，是 ASP 变化率">
        2027 年不具备全公司、同更新时间、同日历年、同利润口径与同价格假设的公开数据集。因此，SK hynix 和 Micron 不提供伪精确的绝对利润点估计，只给出可审计的情景指数。
      </SectionHeading>
      <div className="grid gap-4 xl:grid-cols-3">
        {scenarioData.map((scenario) => {
          const style = scenarioTone[scenario.tone];
          return (
            <section key={scenario.key} className={`rounded-2xl border bg-gradient-to-br p-5 ${style.border} ${style.bg}`}>
              <div className="flex items-center justify-between gap-3"><MiniLabel tone={scenario.tone}>{scenario.key} · CY2026 = 100</MiniLabel><span className={`h-2.5 w-2.5 rounded-full ${style.bar}`} /></div>
              <h3 className="mt-4 text-lg font-semibold text-slate-100">{scenario.title}</h3>
              <div className="mt-4 space-y-2">
                {scenario.values.map(([company, value]) => (
                  <div key={company} className="flex items-center justify-between border-b border-slate-700/30 pb-2 text-sm"><span className="text-slate-300">{company}</span><span className="font-mono font-semibold text-slate-100">{value}</span></div>
                ))}
              </div>
              <ul className="mt-4 space-y-1.5 text-xs leading-5 text-slate-400">
                {scenario.conditions.map((item) => <li key={item} className="flex gap-2"><span className="mt-1 text-slate-500">•</span><span>{item}</span></li>)}
              </ul>
              <p className="mt-4 border-t border-slate-700/40 pt-3 text-xs font-medium leading-5 text-slate-300">{scenario.result}</p>
            </section>
          );
        })}
      </div>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.055] p-5">
          <div className="flex items-center gap-2 text-emerald-200"><ArrowUpRight size={18} /><h3 className="font-semibold">阶段一：存储短缺强化</h3></div>
          <div className="mt-4 text-2xl font-semibold text-slate-100">Long Memory Producers <span className="text-slate-500">vs.</span> Underweight Hardware OEMs</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">存储厂拥有提价权；PC、手机与服务器 OEM 承受 BOM 上升及需求破坏。</p>
        </div>
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.055] p-5">
          <div className="flex items-center gap-2 text-sky-200"><ArrowDownRight size={18} /><h3 className="font-semibold">阶段二：ASP 上调速度见顶</h3></div>
          <div className="mt-4 text-2xl font-semibold text-slate-100">Long NVIDIA / Platform <span className="text-slate-500">vs.</span> Underweight Commodity Memory</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">当合约价仍高但涨幅不再加速，存储盈利预期停止上修；NVIDIA 的采购成本压力缓解，CUDA、网络与平台租金继续留存。</p>
        </div>
      </section>

      <SectionHeading id="watch" number="07" eyebrow="MONITORING DASHBOARD" title="真正需要跟踪的，不是已实现利润，而是下一季 ASP 预期差">
        最佳观察信号 = <span className="font-semibold text-slate-200">实际合约 ASP 上调幅度 / 市场预期的上调幅度</span>。即使合约价继续上涨，只要涨幅低于已计入水平，存储股仍可能见顶。
      </SectionHeading>
      <section className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/30">
        <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 border-b border-slate-700/50 bg-slate-800/50 px-4 py-3 text-xs font-semibold text-slate-300 md:px-5"><span>关键变量</span><span className="text-emerald-200">牛市确认</span><span className="text-rose-200">反转信号</span></div>
        {watchlist.map(([metric, bull, bear]) => (
          <div key={metric} className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 border-b border-slate-800/70 px-4 py-3 text-xs leading-5 last:border-0 md:px-5"><span className="font-medium text-slate-200">{metric}</span><span className="text-slate-400">{bull}</span><span className="text-slate-400">{bear}</span></div>
        ))}
      </section>
      <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.055] p-4 text-sm leading-6 text-slate-300"><span className="font-semibold text-amber-100">库存与应收的观察方法：</span>NVIDIA Q1 FY2027 库存由 $21.403B 增至 $25.797B，应收由 $38.466B 增至 $40.710B。当前并不自动构成需求风险；须与收入增速、供应准备共同观察。</div>

      <SectionHeading id="quality" number="08" eyebrow="QUALITY CONTROL" title="研究可流转，但必须保留边界、置信度与撤销清单">
        本页的设计原则是让事实层、模型层与情景层始终可视化分离。这样既能用于利润池比较与相对交易框架，也不会制造不存在的客户级、产品级精确利润。
      </SectionHeading>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
          <div className="flex items-center gap-2"><ChartNoAxesCombined size={18} className="text-sky-300" /><h3 className="font-semibold text-slate-100">模块质量评级</h3></div>
          <div className="mt-5 space-y-3">
            {qualityScores.map(([label, score, note]) => (
              <div key={label}>
                <div className="flex items-center justify-between gap-4 text-xs"><span className="font-medium text-slate-300">{label}</span><span className="font-mono text-slate-200">{score}/10</span></div>
                <div className="mt-1.5 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-sky-400" style={{ width: `${score * 10}%` }} /></div><span className="w-32 text-right text-[10px] text-slate-500">{note}</span></div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.045] p-5">
          <div className="flex items-center gap-2"><AlertTriangle size={18} className="text-rose-300" /><h3 className="font-semibold text-slate-100">永久撤销：不得再次引用的数字</h3></div>
          <div className="mt-4 grid gap-x-5 sm:grid-cols-2">
            {withdrawnNumbers.map(([claim, reason]) => (
              <div key={claim} className="border-b border-rose-400/10 py-2.5 last:border-0"><div className="text-xs font-medium leading-5 text-slate-300">{claim}</div><div className="mt-0.5 text-[11px] leading-4 text-slate-500">{reason}</div></div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5 text-sm leading-6 text-slate-300">
        <span className="font-semibold text-emerald-100">最终可流转性：</span>可以正式流转，前提是保留所有 A / P / G / E / M / S 标签。它适合支持利润池比较、行业传导、ASP 与供给情景、相对交易及财报 / 价格监控；不适合支持单客户精确收入、单产品精确营业利润或高精度 2027 点预测。
      </div>

      <footer className="mt-10 border-t border-slate-800 pt-5 text-xs leading-5 text-slate-500">
        <p>研究对象：{reportMeta.scope}。本页基于所提供的《NVIDIA 与全球存储利润池研究｜终版 V2.0》整理；数据口径与结论边界以原报告为准。</p>
        <p className="mt-1">事实层参考：NVIDIA FY2026 / Q1 FY2027 业绩材料、Samsung Q1 2026 与 Q2 初步业绩、SK hynix Q1 2026、Micron FY2026 季度材料，以及报告中列示的 BNP Paribas 与 Counterpoint 外部估计。</p>
      </footer>
    </article>
  );
};

export default MemoryProfitPoolReport;
