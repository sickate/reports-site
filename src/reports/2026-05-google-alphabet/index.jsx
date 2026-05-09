// Alphabet (GOOG) Q1 2026 投研模板页面
// 11 模块科技公司投研模板的 Google 实例化版本
// 数据基准：SEC EDGAR 8-K (2026-04-29) + 管理层 PR + 2026-05-01 收盘

import { reportMeta, narrativePivots, kpiCards } from './content/meta.js';
import {
  quarterlySeries,
  servicesBreakdown,
  geoRevenueTable,
  tacSeries,
  costStructure,
  headcountSeries,
  daSeries,
  sbcSeries,
} from './content/series.js';
import {
  segmentDeepDive,
  capexGuidanceTimeline,
  capexComposition,
  capexConstraintQuote,
  capitalAllocationCommentary,
  wizAcquisition,
  balanceSheet,
  operatingKpis,
  aiMetrics,
  cloudRunRate,
} from './content/segments.js';
import {
  sotpTable,
  valuationSnapshot,
  analystTargets,
  forwardGuidanceTable,
} from './content/valuation.js';
import {
  earningsCallNotes,
  riskEvents,
  alphabetWatchlist,
  sanityChecks,
  dataSources,
  disclaimer,
} from './content/notes.js';

import { KpiGrid } from './components/kpiCard.jsx';
import {
  SegmentRevenueStack,
  SegmentMarginLines,
  CapexFcfPanel,
  RpoChart,
  CapitalAllocationPanel,
  CloudMarginTrajectory,
} from './components/trendCharts.jsx';
import { ComparisonTable, AnalystTargetTable, SanityCheckList, TonePill } from './components/tables.jsx';
import { TopNav } from './components/topNav.jsx';

// ============================================
// Section title (chapter heading)
// ============================================

const SectionTitle = ({ id, number, children, subtitle }) => (
  <div id={id} className="mb-6 mt-12 scroll-mt-[130px]">
    <div className="flex items-baseline gap-3 mb-1 flex-wrap">
      {number && (
        <span className="text-xs font-mono text-amber-400/70 tracking-widest">{number}</span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100">{children}</h2>
    </div>
    {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
  </div>
);

const SubHeading = ({ children, subtitle }) => (
  <div className="mb-4 mt-8">
    <h3 className="text-lg md:text-xl font-semibold text-slate-100">{children}</h3>
    {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
  </div>
);

// ============================================
// Narrative pivot card (top 3 highlights)
// ============================================

const pivotStyles = {
  risk: {
    border: 'border-red-500/40',
    bg: 'bg-gradient-to-br from-red-500/10 to-red-500/[0.03]',
    label: 'text-red-300',
    metric: 'text-red-200',
  },
  safe: {
    border: 'border-emerald-500/40',
    bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/[0.03]',
    label: 'text-emerald-300',
    metric: 'text-emerald-200',
  },
  fair: {
    border: 'border-amber-500/40',
    bg: 'bg-gradient-to-br from-amber-500/10 to-amber-500/[0.03]',
    label: 'text-amber-300',
    metric: 'text-amber-200',
  },
};

const pivotToneLabel = { risk: '资本周期顶部', safe: '需求验证强信号', fair: '资本配置转向' };

const NarrativePivotCard = ({ pivot }) => {
  const s = pivotStyles[pivot.tone];
  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-5 flex flex-col h-full`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{pivot.icon}</span>
        <span className={`text-[10px] font-mono uppercase tracking-widest ${s.label}`}>
          {pivotToneLabel[pivot.tone]}
        </span>
      </div>
      <h3 className={`text-base md:text-lg font-semibold leading-snug mb-2 ${s.metric}`}>
        {pivot.headline}
      </h3>
      <div className={`text-2xl md:text-3xl font-bold ${s.metric} mb-1`}>{pivot.metric}</div>
      <div className="text-xs text-slate-500 mb-3">{pivot.metricNote}</div>
      <p className="text-xs text-slate-300 leading-relaxed mt-auto">{pivot.body}</p>
    </div>
  );
};

// ============================================
// Segment deep-dive card
// ============================================

const SegmentDeepDiveCard = ({ segment }) => (
  <div
    className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5"
    style={{ borderLeft: `4px solid ${segment.color}` }}
  >
    <div className="flex items-baseline justify-between gap-2 flex-wrap mb-3">
      <h4 className="text-lg font-bold text-slate-100">{segment.name}</h4>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-100">{segment.q1RevDisplay}</span>
        <TonePill tone={segment.yoy.startsWith('+') ? 'positive' : 'negative'}>
          {segment.yoy} YoY
        </TonePill>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 text-xs mb-3">
      <div>
        <div className="text-slate-500">经营利润</div>
        <div className="text-base font-semibold text-slate-100">{segment.opIncDisplay}</div>
      </div>
      {segment.opMargin !== null && (
        <div>
          <div className="text-slate-500">利润率</div>
          <div className="text-base font-semibold text-slate-100">{segment.opMargin}%</div>
        </div>
      )}
    </div>
    <p className="text-xs text-slate-400 leading-relaxed mb-3">{segment.narrative}</p>
    <div className="grid grid-cols-2 gap-2">
      {segment.kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-lg bg-slate-900/50 border border-slate-700/30 px-2.5 py-1.5"
        >
          <div className="text-[10px] text-slate-500">{k.label}</div>
          <div
            className={`text-sm font-semibold ${
              k.tone === 'positive'
                ? 'text-emerald-300'
                : k.tone === 'negative'
                ? 'text-red-300'
                : 'text-slate-200'
            }`}
          >
            {k.value}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// CapEx guidance timeline
// ============================================

const guidanceToneStyles = {
  neutral: 'border-slate-600/40 text-slate-300',
  warning: 'border-amber-500/40 text-amber-300',
  risk: 'border-red-500/40 text-red-300',
};

const CapexGuidanceTimeline = ({ items }) => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
    <h4 className="text-base font-semibold text-slate-100 mb-1">CapEx 全年指引演变</h4>
    <p className="text-xs text-slate-500 mb-4">连续 5 次上调 — 资本周期"看不到顶"</p>
    <div className="relative pl-8 space-y-4 border-l border-slate-700/50">
      {items.map((g) => (
        <div key={g.id} className="relative">
          <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-slate-800 border-2 border-amber-400" />
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div>
              <div className="text-[10px] font-mono text-slate-500">{g.date}</div>
              <div className="text-sm text-slate-300">{g.label}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-mono font-bold text-slate-100">{g.value}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                  guidanceToneStyles[g.deltaTone]
                }`}
              >
                {g.delta}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// CapEx composition donut (simple bar chart)
// ============================================

const CapexCompositionPanel = ({ composition }) => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
    <h4 className="text-base font-semibold text-slate-100 mb-1">CapEx 构成</h4>
    <p className="text-xs text-slate-500 mb-4">{composition.asOf}</p>
    <div className="space-y-3">
      {composition.items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">{item.label}</span>
            <span className="font-semibold" style={{ color: item.color }}>
              {item.pct}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-slate-800/60 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// Quote card (Pichai / Ashkenazi commentary)
// ============================================

const quoteToneBorder = {
  positive: 'border-l-emerald-500',
  warning: 'border-l-amber-500',
  negative: 'border-l-red-500',
  neutral: 'border-l-slate-500',
};

const quoteToneText = {
  positive: 'text-emerald-300',
  warning: 'text-amber-300',
  negative: 'text-red-300',
  neutral: 'text-slate-300',
};

const EarningsCallQuote = ({ note }) => (
  <div
    className={`rounded-xl border-l-4 ${quoteToneBorder[note.topicTone]} bg-slate-800/30 border border-slate-700/50 p-4`}
  >
    <div className="flex items-center gap-2 flex-wrap mb-2">
      <span className="text-sm font-semibold text-slate-100">{note.speaker}</span>
      <span className="text-[10px] text-slate-500">· {note.role}</span>
      <span className={`text-[10px] font-mono uppercase tracking-wider ml-auto ${quoteToneText[note.topicTone]}`}>
        {note.topic}
      </span>
    </div>
    <blockquote className="text-sm text-slate-200 leading-relaxed italic mb-2 pl-2 border-l-2 border-slate-700">
      "{note.quote}"
    </blockquote>
    <div className="text-xs text-slate-400 leading-relaxed mb-1.5">{note.zh}</div>
    {note.context && (
      <div className="text-[11px] text-slate-500 italic leading-relaxed mt-2 pt-2 border-t border-slate-700/40">
        {note.context}
      </div>
    )}
  </div>
);

// ============================================
// Wiz acquisition callout
// ============================================

const WizAcquisitionPanel = ({ wiz }) => (
  <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.05] p-5">
    <div className="flex items-baseline gap-2 mb-3">
      <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
        🛡 Wiz 收购完成 · {wiz.closingDate}
      </span>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
      <div>
        <div className="text-[10px] text-slate-500">现金对价</div>
        <div className="text-base font-bold text-slate-100">{wiz.cashConsideration}</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500">分部归属</div>
        <div className="text-base font-bold text-slate-100">{wiz.segment}</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500">Goodwill 增量</div>
        <div className="text-base font-bold text-cyan-200">+${wiz.goodwillIncrement}B</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500">Intangibles 增量</div>
        <div className="text-base font-bold text-cyan-200">+${wiz.intangiblesIncrement}B</div>
      </div>
    </div>
    <p className="text-xs text-slate-400 leading-relaxed">{wiz.notes}</p>
  </div>
);

// ============================================
// CapEx constraint quote (large highlight)
// ============================================

const CapexConstraintQuoteBox = ({ quote }) => (
  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.05] p-6">
    <div className="flex items-baseline gap-2 mb-3 flex-wrap">
      <span className="text-xs font-mono uppercase tracking-widest text-emerald-300">
        💬 需求验证关键证据
      </span>
      <span className="text-[10px] text-slate-500">· {quote.occasion}</span>
    </div>
    <blockquote className="text-base md:text-lg text-emerald-100 leading-relaxed italic mb-3 pl-3 border-l-4 border-emerald-500/50">
      "{quote.quote}"
    </blockquote>
    <div className="text-sm text-slate-300 leading-relaxed mb-2">{quote.zh}</div>
    <div className="text-xs text-slate-500 italic">— {quote.speaker}</div>
    <div className="mt-3 pt-3 border-t border-emerald-500/20 text-xs text-slate-400 leading-relaxed">
      {quote.context}
    </div>
  </div>
);

// ============================================
// Subscription / KPI horizontal table
// ============================================

const KpiTimepointTable = ({ kpi }) => (
  <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
    <h5 className="text-sm font-semibold text-slate-100 mb-2">{kpi.title}</h5>
    <div className="space-y-1">
      {kpi.rows.map((r, i) => (
        <div
          key={i}
          className={`flex items-baseline justify-between text-xs ${
            r.highlight ? 'text-emerald-300 font-semibold' : 'text-slate-300'
          }`}
        >
          <span className="text-slate-500">{r.time}</span>
          <span>
            {r.value}
            {r.metric && <span className="text-slate-500 ml-1">· {r.metric}</span>}
          </span>
        </div>
      ))}
    </div>
    {kpi.note && <p className="mt-2 text-[11px] text-slate-500 italic leading-relaxed">{kpi.note}</p>}
  </div>
);

// ============================================
// Risk event row
// ============================================

const riskRowToneBg = {
  risk: 'border-l-red-500 bg-red-500/[0.04]',
  fair: 'border-l-amber-500 bg-amber-500/[0.04]',
  safe: 'border-l-emerald-500 bg-emerald-500/[0.04]',
};

const RiskOngoingRow = ({ row }) => (
  <div className={`rounded-xl border-l-4 border border-slate-700/50 ${riskRowToneBg[row.tone]} p-4`}>
    <div className="text-sm font-semibold text-slate-100 mb-1">{row.title}</div>
    <p className="text-xs text-slate-400 leading-relaxed">{row.body}</p>
  </div>
);

// ============================================
// Watchlist item row
// ============================================

const WatchlistRow = ({ item }) => (
  <div className="flex gap-3 py-2 border-b border-slate-800/50 last:border-0">
    <span className="text-amber-400 font-mono text-xs font-bold flex-shrink-0 w-6">{item.n}.</span>
    <div className="flex-1">
      <div className="text-sm font-semibold text-slate-100">{item.item}</div>
      <div className="text-xs text-slate-400 mt-0.5">{item.why}</div>
    </div>
  </div>
);

// ============================================
// Source list
// ============================================

const sourceConfidenceBadge = {
  high: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  medium: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  low: 'bg-slate-700/30 text-slate-400 border-slate-600/40',
};

const SourceList = ({ sources }) => (
  <div className="space-y-2">
    {sources.map((s) => (
      <div
        key={s.id}
        className="flex items-baseline gap-3 py-2 border-b border-slate-800/30 last:border-0"
      >
        <span className="text-xs font-mono text-slate-500 w-12 flex-shrink-0">{s.id}</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${
            sourceConfidenceBadge[s.confidence]
          }`}
        >
          {s.confidence.toUpperCase()}
        </span>
        <span className="text-xs text-slate-500 whitespace-nowrap">{s.category}</span>
        <a
          href={s.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-cyan-300 hover:text-cyan-200 hover:underline truncate"
        >
          {s.label}
        </a>
      </div>
    ))}
  </div>
);

// ============================================
// Main report component
// ============================================

const GoogleAlphabetReport = () => (
  <div className="max-w-6xl mx-auto px-4 py-6 text-slate-200">
    {/* Header */}
    <header id="overview" className="mb-6 scroll-mt-[130px]">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className="text-xs text-slate-500">更新于 {reportMeta.updatedAt}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2 leading-tight">
        {reportMeta.title}
      </h1>
      <p className="text-slate-400 text-base mb-4">{reportMeta.subtitle}</p>
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {reportMeta.ticker}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-600/30">
          {reportMeta.fiscalQuarter} · 财报披露 {reportMeta.reportingDate}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-600/30">
          {reportMeta.rating}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">股价 · {reportMeta.asOfPrice}</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">${reportMeta.price}</div>
          <div className="text-[10px] text-emerald-300 mt-0.5">{reportMeta.monthReturn}</div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">市值</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">{reportMeta.marketCapLabel}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">52w {reportMeta.range52w}</div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">P/E (GAAP TTM / 核心)</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">
            {reportMeta.pe.gaap}x <span className="text-slate-500 text-sm">/ {reportMeta.pe.core}x</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">P/S {reportMeta.ps}x</div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 p-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">FCF Yield · 分红</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">
            {reportMeta.fcfYield}% <span className="text-slate-500 text-sm">/ {reportMeta.dividendYield}%</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">资本周期下显著低于历史</div>
        </div>
      </div>
      <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-slate-400 italic leading-relaxed">
        {reportMeta.revisionNote}
      </div>
    </header>

    {/* Sticky anchor nav */}
    <TopNav />

    {/* Three narrative pivots */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {narrativePivots.map((p) => (
        <NarrativePivotCard key={p.id} pivot={p} />
      ))}
    </div>

    {/* KPI Cards */}
    <SectionTitle id="kpi" number="0" subtitle="8 张核心 KPI · 季度时间序列 · 当前 vs YoY">
      KPI 仪表盘
    </SectionTitle>
    <KpiGrid cards={kpiCards} />

    {/* Trend Charts */}
    <SectionTitle id="trends" number="0+" subtitle="12-16 季度时间序列 · 模板核心可视化">
      季度趋势图（6 张）
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SegmentRevenueStack data={quarterlySeries} />
      <SegmentMarginLines data={quarterlySeries} />
      <CapexFcfPanel data={quarterlySeries} />
      <RpoChart data={quarterlySeries} />
      <CapitalAllocationPanel data={quarterlySeries} />
      <CloudMarginTrajectory data={quarterlySeries} />
    </div>

    {/* Module 1: Revenue & Growth */}
    <SectionTitle id="mod1-revenue" number="一" subtitle="分部 / 业务线 / 地区 / TAC">
      模块 1：营收与增长
    </SectionTitle>

    <SubHeading subtitle="Search & other 加速到 +19% 是反驳 AI 颠覆论的核心证据">
      Google Services 业务线明细
    </SubHeading>
    <ComparisonTable table={servicesBreakdown} />

    <SubHeading subtitle="美元走弱推升 EMEA / Other Americas 报告值；常数汇率下美国仍是增速最快地区">
      地区营收对照（Q1 25 vs Q1 26）
    </SubHeading>
    <ComparisonTable table={geoRevenueTable} />

    <SubHeading subtitle="议价权代理变量 · 持续小幅下行是结构性利好">TAC 比率走势</SubHeading>
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
      <div className="grid grid-cols-5 gap-2">
        {tacSeries.quarters.map((q, i) => (
          <div key={q} className="text-center">
            <div className="text-[10px] text-slate-500">{q}</div>
            <div className="text-sm font-bold text-slate-100 mt-0.5">{tacSeries.pctAdRev[i]}%</div>
            <div className="text-[10px] text-slate-500">${(tacSeries.tac[i] / 1000).toFixed(1)}B</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400 italic leading-relaxed">{tacSeries.insight}</p>
    </div>

    {/* Module 2: Profitability */}
    <SectionTitle id="mod2-profit" number="二" subtitle="分部利润率 · SBC / 利润质量">
      模块 2：盈利能力
    </SectionTitle>

    <SubHeading subtitle="GAAP vs ex-SBC 利润率对照 · 真实盈利能力">SBC 与利润率口径</SubHeading>
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/60 border-b border-slate-700/50">
            <th className="text-left px-4 py-3 font-semibold text-slate-300">季度</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-300">SBC ($M)</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-300">SBC / 营收</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-300">OpMargin (GAAP)</th>
            <th className="text-right px-4 py-3 font-semibold text-amber-300">OpMargin ex-SBC</th>
          </tr>
        </thead>
        <tbody>
          {sbcSeries.quarters.map((q, i) => (
            <tr key={q} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30">
              <td className="px-4 py-2.5 font-medium text-slate-300">{q}</td>
              <td className="px-4 py-2.5 text-right font-mono text-slate-300">
                {sbcSeries.sbc[i].toLocaleString('en-US')}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-slate-300">
                {sbcSeries.pctRevenue[i]}%
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-slate-300">
                {sbcSeries.opMarginGaap[i]}%
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-amber-200 font-semibold">
                {sbcSeries.opMarginExSbc[i]}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="mt-3 space-y-1">
      {sbcSeries.notes.map((n, i) => (
        <li key={i} className="text-xs text-slate-400 leading-relaxed list-disc ml-5">
          {n}
        </li>
      ))}
    </ul>

    {/* Module 3: Cost Structure */}
    <SectionTitle id="mod3-cost" number="三" subtitle="费用增速 vs 营收增速 · 操作杠杆方向">
      模块 3：成本结构
    </SectionTitle>
    <ComparisonTable table={costStructure} />
    <ul className="mt-3 space-y-1">
      {costStructure.insights.map((s, i) => (
        <li key={i} className="text-xs text-slate-400 leading-relaxed list-disc ml-5">
          {s}
        </li>
      ))}
    </ul>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <h5 className="text-sm font-semibold text-slate-100 mb-2">员工人数与人均年化营收</h5>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {headcountSeries.quarters.map((q, i) => (
            <div key={q} className="text-center">
              <div className="text-[10px] text-slate-500">{q}</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">
                {(headcountSeries.headcount[i] / 1000).toFixed(0)}K
              </div>
              {headcountSeries.yoy[i] && (
                <div className="text-[10px] text-emerald-300">{headcountSeries.yoy[i]}</div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 italic leading-relaxed">{headcountSeries.insight}</p>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <h5 className="text-sm font-semibold text-slate-100 mb-2">折旧（D&amp;A）</h5>
        <div className="grid grid-cols-5 gap-1 mb-2">
          {daSeries.quarters.map((q, i) => (
            <div key={q} className="text-center">
              <div className="text-[10px] text-slate-500">{q}</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">
                ${(daSeries.da[i] / 1000).toFixed(1)}B
              </div>
              {daSeries.yoy[i] && (
                <div
                  className={`text-[10px] ${
                    daSeries.yoy[i].includes('+44') ? 'text-amber-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  {daSeries.yoy[i]}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 italic leading-relaxed">{daSeries.insight}</p>
      </div>
    </div>

    {/* Module 4: CapEx & Cash Flow */}
    <SectionTitle id="mod4-capex" number="四" subtitle="★ 模板第一重点 Panel · CapEx 周期顶部观察">
      模块 4：CapEx 与现金流
    </SectionTitle>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <CapexGuidanceTimeline items={capexGuidanceTimeline} />
      <CapexCompositionPanel composition={capexComposition} />
    </div>

    <CapexConstraintQuoteBox quote={capexConstraintQuote} />

    {/* Module 5: Capital Allocation */}
    <SectionTitle id="mod5-capital" number="五" subtitle="回购暂停 · Wiz 收购 · 长期债务发行">
      模块 5：股东回报与资本配置
    </SectionTitle>
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-5 mb-4">
      <h4 className="text-base font-semibold text-amber-200 mb-2">{capitalAllocationCommentary.headline}</h4>
      <ul className="space-y-1">
        {capitalAllocationCommentary.bullets.map((b, i) => (
          <li key={i} className="text-xs text-slate-300 list-disc ml-5 leading-relaxed">
            {b}
          </li>
        ))}
      </ul>
    </div>
    <WizAcquisitionPanel wiz={wizAcquisition} />

    {/* Module 6: Balance Sheet */}
    <SectionTitle id="mod6-bs" number="六" subtitle="净现金收缩 · 长期债务突增 · 隐形资产 $107B">
      模块 6：资产负债表
    </SectionTitle>
    <ComparisonTable table={balanceSheet} highlightCol={5} />
    <ul className="mt-3 space-y-1">
      {balanceSheet.insights.map((s, i) => (
        <li key={i} className="text-xs text-slate-400 leading-relaxed list-disc ml-5">
          {s}
        </li>
      ))}
    </ul>

    {/* Module 7: Segment Deep-Dive */}
    <SectionTitle id="mod7-segment" number="七" subtitle="Services / Cloud / Other Bets 三联深度">
      模块 7：分部深度
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {segmentDeepDive.map((s) => (
        <SegmentDeepDiveCard key={s.key} segment={s} />
      ))}
    </div>

    {/* Module 8: Operating KPIs */}
    <SectionTitle id="mod8-ops" number="八" subtitle="订阅 · YouTube · RPO · Waymo · Token / Gemini">
      模块 8：运营 KPI 与 AI 指标
    </SectionTitle>

    <SubHeading subtitle="模板第一前瞻指标 · 5 季度 RPO 演进">Cloud Revenue Backlog (RPO)</SubHeading>
    <ComparisonTable table={operatingKpis.cloudRpo} />
    <ul className="mt-3 space-y-1">
      {operatingKpis.cloudRpo.insights.map((s, i) => (
        <li key={i} className="text-xs text-slate-400 leading-relaxed list-disc ml-5">
          {s}
        </li>
      ))}
    </ul>

    <SubHeading>Cloud 年化运行率演进</SubHeading>
    <ComparisonTable table={cloudRunRate} />
    <p className="mt-3 text-xs text-slate-400 italic leading-relaxed">{cloudRunRate.insight}</p>

    <SubHeading subtitle="订阅 / YouTube / Waymo · 多 KPI 时点对照">订阅与运营时点</SubHeading>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <KpiTimepointTable kpi={operatingKpis.subscriptions} />
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <h5 className="text-sm font-semibold text-slate-100 mb-2">{operatingKpis.youtubeFy25.title}</h5>
        <div className="text-2xl font-bold text-amber-200">{operatingKpis.youtubeFy25.value}</div>
        <div className="text-xs text-slate-500 mt-1">{operatingKpis.youtubeFy25.period}</div>
        <div className="text-[11px] text-slate-500 italic mt-2">{operatingKpis.youtubeFy25.source}</div>
      </div>
      <KpiTimepointTable kpi={operatingKpis.waymo} />
    </div>

    <SubHeading subtitle="Token rate · Gemini App / Enterprise · Cloud AI 收入">AI 指标</SubHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <ComparisonTable table={aiMetrics.tokenRate} />
      <KpiTimepointTable kpi={aiMetrics.geminiApp} />
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <h5 className="text-sm font-semibold text-slate-100 mb-1">{aiMetrics.geminiEnterprise.title}</h5>
        <div className="text-2xl font-bold text-cyan-300 mt-1">{aiMetrics.geminiEnterprise.value}</div>
        <div className="text-[11px] text-slate-500 italic mt-2">{aiMetrics.geminiEnterprise.note}</div>
      </div>
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <h5 className="text-sm font-semibold text-slate-100 mb-2">{aiMetrics.cloudAi.title}</h5>
        <ul className="space-y-1.5">
          {aiMetrics.cloudAi.items.map((item, i) => (
            <li key={i} className="text-xs flex justify-between border-b border-slate-700/30 pb-1.5">
              <span className="text-slate-500">{item.period}</span>
              <span className="text-emerald-300 font-semibold">{item.metric}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Module 9: Valuation */}
    <SectionTitle id="mod9-valuation" number="九" subtitle="估值快照 · SOTP · 分析师目标价">
      模块 9：估值
    </SectionTitle>

    <SubHeading subtitle="2026-05-01 收盘 · 横向交叉验证">估值快照</SubHeading>
    <ComparisonTable table={valuationSnapshot} />
    <p className="mt-3 text-xs text-slate-500 italic leading-relaxed">{valuationSnapshot.caveat}</p>

    <SubHeading subtitle="按可比公司倍数拆分 · 隐形资产 $234B 加回市值">SOTP 拆分</SubHeading>
    <ComparisonTable table={sotpTable} highlightCol={4} />

    <SubHeading subtitle="58 家机构均值 vs 现价对比">分析师目标价</SubHeading>
    <AnalystTargetTable table={analystTargets} />

    {/* Module 10: Forward Guidance */}
    <SectionTitle id="mod10-guidance" number="十" subtitle="Q4 2025 vs Q1 2026 口径变化">
      模块 10：前瞻指引
    </SectionTitle>
    <ComparisonTable table={forwardGuidanceTable} />
    <p className="mt-3 text-xs text-slate-400 italic leading-relaxed">{forwardGuidanceTable.notes}</p>

    {/* Earnings call notes */}
    <SectionTitle id="ec" number="十一" subtitle="管理层 commentary · CEO Pichai + CFO Ashkenazi · 10 条核心引用">
      电话会议事录摘录
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {earningsCallNotes.map((note) => (
        <EarningsCallQuote key={note.id} note={note} />
      ))}
    </div>

    {/* Module 11: Risks */}
    <SectionTitle id="mod11-risk" number="十二" subtitle="已落地事件 · 持续追踪 · Alphabet 专属 watchlist">
      模块 11：风险与监管追踪
    </SectionTitle>

    <SubHeading>已落地的法律 / 监管 / 一次性事件</SubHeading>
    <ComparisonTable table={riskEvents.landed} />

    <SubHeading>持续追踪的监管 / 竞争风险</SubHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {riskEvents.ongoing.rows.map((r, i) => (
        <RiskOngoingRow key={i} row={r} />
      ))}
    </div>

    <SubHeading subtitle="模板第四节 · 10 项 Alphabet 区别于其他 MAG7 的独有变量">
      Alphabet 专属 watchlist
    </SubHeading>
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-4">
      {alphabetWatchlist.map((item) => (
        <WatchlistRow key={item.n} item={item} />
      ))}
    </div>

    {/* Sanity checks */}
    <SectionTitle number="十三" subtitle="数据完整性自检 · 7 项交叉验证">
      红队自检
    </SectionTitle>
    <SanityCheckList checks={sanityChecks} />

    {/* Sources */}
    <SectionTitle number="十四" subtitle="按可信度分级 · HIGH = SEC / IR 一手 · MEDIUM = 第三方汇总">
      数据来源
    </SectionTitle>
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5">
      <SourceList sources={dataSources} />
    </div>

    {/* Disclaimer */}
    <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-600 italic leading-relaxed">
      {disclaimer}
    </div>
  </div>
);

export default GoogleAlphabetReport;
