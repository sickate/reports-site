import {
  ComposedChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

// ============================================================
// Shared Tooltip Style
// ============================================================
const tooltipStyle = {
  contentStyle: {
    background: 'rgba(15, 23, 42, 0.96)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: 8,
    fontSize: 12,
    padding: '8px 12px',
  },
  labelStyle: { color: '#cbd5e1', fontSize: 11, marginBottom: 4 },
  itemStyle: { color: '#e2e8f0', fontSize: 12 },
};

// ============================================================
// Common axis presets — keep both axes visually consistent.
// ============================================================
const axisCommon = {
  stroke: '#64748b',
  style: { fontSize: 11 },
  tickLine: false,
  axisLine: { stroke: 'rgba(148,163,184,0.2)' },
};

const legendStyle = { fontSize: 11, color: '#94a3b8' };

// Axis-label factory — keeps each YAxis call concise.
const axisLabel = (value, side = 'left') => ({
  value,
  angle: side === 'left' ? -90 : 90,
  position: side === 'left' ? 'insideLeft' : 'insideRight',
  fill: '#64748b',
  fontSize: 10,
  offset: 10,
});

// ============================================================
// Tick formatters
// ============================================================
const fmtUsdB = (v) => '$' + (v / 1000).toFixed(0) + 'B';
const fmtPct = (v) => v + '%';
const fmtUsdBn1 = (v) => '$' + v.toFixed(0) + 'B';

// ============================================================
// Data transform helper — derives a per-quarter row from
// the full quarterlySeries object exported from content/series.js.
// ============================================================
const buildSeriesData = (qs) =>
  qs.quarters.map((q, i) => ({
    q,
    services: qs.segmentServices[i],
    cloud: qs.segmentCloud[i],
    otherBets: qs.segmentOtherBets[i],
    revenue: qs.revenue[i],
    yoy: qs.revenueYoy[i],
    opMargin: qs.opMargin[i],
    servicesOpMargin: qs.servicesOpMargin[i],
    cloudOpMargin: qs.cloudOpMargin[i],
    capex: qs.capex[i],
    fcf: qs.fcf[i],
    capexPctRevenue: qs.capexPctRevenue[i],
    rpo: qs.cloudRpoBn[i],
    rpoQoq:
      i === 0
        ? null
        : ((qs.cloudRpoBn[i] - qs.cloudRpoBn[i - 1]) / qs.cloudRpoBn[i - 1]) * 100,
    sbc: qs.sbc[i],
    buyback: qs.buyback[i],
    dividend: qs.dividend[i],
    netBuyback: qs.netBuyback[i],
  }));

// ============================================================
// Reusable card wrapper — shared by all charts
// ============================================================
const ChartCard = ({ title, subtitle, insight, children }) => (
  <div className='rounded-2xl border border-slate-700/50 bg-slate-900/30 p-5'>
    <div className='mb-3'>
      <h4 className='text-base font-semibold text-slate-100'>{title}</h4>
      {subtitle && (
        <p className='text-xs text-slate-500 mt-0.5'>{subtitle}</p>
      )}
    </div>
    <ResponsiveContainer width='100%' height={260}>
      {children}
    </ResponsiveContainer>
    {insight && (
      <p className='mt-3 text-xs text-slate-400 italic leading-relaxed'>
        {insight}
      </p>
    )}
  </div>
);

// ============================================================
// 1) SegmentRevenueStack — 分部营收堆叠 + 总增速线
// ============================================================
export const SegmentRevenueStack = ({ data }) => {
  const rows = buildSeriesData(data);

  return (
    <ChartCard
      title='分部营收（堆叠）+ 总增速'
      subtitle='Services / Cloud / Other Bets · 5 季度时间序列'
      insight='Cloud 占比从 Q1 25 的 13.6% 升至 Q1 26 的 18.2%，结构性 mix-shift 正在加速。'
    >
      <ComposedChart
        data={rows}
        margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='rgba(148,163,184,0.15)'
        />
        <XAxis dataKey='q' {...axisCommon} />
        <YAxis
          yAxisId='left'
          {...axisCommon}
          tickFormatter={fmtUsdB}
          label={axisLabel('$M', 'left')}
        />
        <YAxis
          yAxisId='right'
          orientation='right'
          {...axisCommon}
          tickFormatter={fmtPct}
          label={axisLabel('%', 'right')}
        />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          yAxisId='left'
          dataKey='services'
          stackId='rev'
          name='Services'
          fill='#fbbf24'
        />
        <Bar
          yAxisId='left'
          dataKey='cloud'
          stackId='rev'
          name='Cloud'
          fill='#22d3ee'
        />
        <Bar
          yAxisId='left'
          dataKey='otherBets'
          stackId='rev'
          name='Other Bets'
          fill='#a78bfa'
        />
        <Line
          yAxisId='right'
          type='monotone'
          dataKey='yoy'
          name='Revenue YoY'
          stroke='#34d399'
          strokeWidth={2}
          strokeDasharray='4 3'
          dot={{ r: 3, fill: '#34d399' }}
        />
      </ComposedChart>
    </ChartCard>
  );
};

// ============================================================
// 2) SegmentMarginLines — 三分部经营利润率折线
// ============================================================
export const SegmentMarginLines = ({ data }) => {
  const rows = buildSeriesData(data);

  return (
    <ChartCard
      title='三分部经营利润率'
      subtitle='Cloud 利润率从 17.8% → 32.9% 的 +15.1pp 跃迁是核心 thesis'
      insight='Q3 25 含 35 亿欧盟罚款，剔除后整体 OpMargin 33.9%。Services 利润率创纪录 45.3%。Cloud 利润率扩张速度可能开始接近 AWS 水平。'
    >
      <LineChart
        data={rows}
        margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='rgba(148,163,184,0.15)'
        />
        <XAxis dataKey='q' {...axisCommon} />
        <YAxis {...axisCommon} tickFormatter={fmtPct} domain={[0, 50]} />
        <Tooltip {...tooltipStyle} formatter={(v) => v + '%'} />
        <Legend wrapperStyle={legendStyle} />
        <Line
          type='monotone'
          dataKey='opMargin'
          name='整体 OpMargin'
          stroke='#94a3b8'
          strokeWidth={2}
          dot={{ r: 3, fill: '#94a3b8' }}
        />
        <Line
          type='monotone'
          dataKey='servicesOpMargin'
          name='Services'
          stroke='#fbbf24'
          strokeWidth={2}
          dot={{ r: 3, fill: '#fbbf24' }}
        />
        <Line
          type='monotone'
          dataKey='cloudOpMargin'
          name='Cloud'
          stroke='#22d3ee'
          strokeWidth={2}
          dot={{ r: 3, fill: '#22d3ee' }}
        />
      </LineChart>
    </ChartCard>
  );
};

// ============================================================
// 3) CapexFcfPanel — CapEx 柱 + FCF 线 + 资本密度线
// ============================================================
export const CapexFcfPanel = ({ data }) => {
  const rows = buildSeriesData(data);

  return (
    <ChartCard
      title='CapEx vs FCF · 资本密度演变'
      subtitle='★ 重点 Panel — CapEx 周期顶部最关键的图'
      insight='Q1 26 资本密度 32.5% 创历史新高（每 1 美元营收 32.5 美分用于 capex）。FCF Margin 同步压缩到 9.2%，是 capex 上行直接结果，不是业务质量恶化。'
    >
      <ComposedChart
        data={rows}
        margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='rgba(148,163,184,0.15)'
        />
        <XAxis dataKey='q' {...axisCommon} />
        <YAxis
          yAxisId='left'
          {...axisCommon}
          tickFormatter={fmtUsdB}
          label={axisLabel('$M', 'left')}
        />
        <YAxis
          yAxisId='right'
          orientation='right'
          {...axisCommon}
          tickFormatter={fmtPct}
          domain={[0, 40]}
          label={axisLabel('%', 'right')}
        />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          yAxisId='left'
          dataKey='capex'
          name='CapEx'
          fill='#fb923c'
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId='left'
          type='monotone'
          dataKey='fcf'
          name='Free Cash Flow'
          stroke='#f87171'
          strokeWidth={2}
          dot={{ r: 3, fill: '#f87171' }}
        />
        <Line
          yAxisId='right'
          type='monotone'
          dataKey='capexPctRevenue'
          name='CapEx % Revenue'
          stroke='#fde047'
          strokeWidth={2}
          strokeDasharray='4 3'
          dot={{ r: 3, fill: '#fde047' }}
        />
      </ComposedChart>
    </ChartCard>
  );
};

// ============================================================
// 4) RpoChart — Cloud RPO（Backlog）跃迁
// ============================================================
export const RpoChart = ({ data }) => {
  const rows = buildSeriesData(data);

  return (
    <ChartCard
      title='Cloud RPO（Backlog）跃迁'
      subtitle='Q1 26 单季 +95% QoQ · 5x YoY · 增量 $228B 锁定多年产能'
      insight='RPO 倍数（RPO ÷ 当前年化 Cloud Rev）= 467.6 ÷ 80.1 ≈ 5.8x，远超 AWS / Azure 同类指标 3-4x。约 50%+ 将在未来 24 个月内确认收入。'
    >
      <ComposedChart
        data={rows}
        margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='rgba(148,163,184,0.15)'
        />
        <XAxis dataKey='q' {...axisCommon} />
        <YAxis
          yAxisId='left'
          {...axisCommon}
          tickFormatter={fmtUsdBn1}
          label={axisLabel('$B', 'left')}
        />
        <YAxis
          yAxisId='right'
          orientation='right'
          {...axisCommon}
          tickFormatter={fmtPct}
          label={axisLabel('%', 'right')}
        />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} />
        <Bar
          yAxisId='left'
          dataKey='rpo'
          name='Cloud RPO ($B)'
          fill='#22d3ee'
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId='right'
          type='monotone'
          dataKey='rpoQoq'
          name='QoQ Growth'
          stroke='#fb923c'
          strokeWidth={2}
          strokeDasharray='4 3'
          dot={{ r: 3, fill: '#fb923c' }}
          connectNulls={false}
        />
      </ComposedChart>
    </ChartCard>
  );
};

// ============================================================
// 5) CapitalAllocationPanel — 回购 + 分红 + 净回购
// 最后一个柱（Q1 26）以红色高亮，标记回购首次归零
// ============================================================
export const CapitalAllocationPanel = ({ data }) => {
  const rows = buildSeriesData(data);
  const lastIdx = rows.length - 1;

  return (
    <ChartCard
      title='资本配置：回购 + 分红 + 净回购'
      subtitle='Q1 26 回购首次归零，净回购转负 −$6.75B'
      insight='净回购（回购 − SBC）从 +$9.6B 降到 −$6.75B，意味着 SBC 稀释开始压过回购。如果 2026 全年继续暂停回购，股本数可能转为净增长。'
    >
      <ComposedChart
        data={rows}
        margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='rgba(148,163,184,0.15)'
        />
        <XAxis dataKey='q' {...axisCommon} />
        <YAxis
          {...axisCommon}
          tickFormatter={fmtUsdB}
          label={axisLabel('$M', 'left')}
        />
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={legendStyle} />
        <ReferenceLine
          y={0}
          stroke='rgba(148,163,184,0.4)'
          strokeDasharray='2 2'
        />
        <Bar dataKey='buyback' stackId='cap' name='Buyback' fill='#34d399'>
          {rows.map((_, idx) => (
            <Cell
              key={'bb-' + idx}
              fill={idx === lastIdx ? '#ef4444' : '#34d399'}
            />
          ))}
        </Bar>
        <Bar
          dataKey='dividend'
          stackId='cap'
          name='Dividend'
          fill='#22d3ee'
        />
        <Line
          type='monotone'
          dataKey='netBuyback'
          name='Net Buyback (Repo − SBC)'
          stroke='#f87171'
          strokeWidth={2}
          dot={{ r: 3, fill: '#f87171' }}
        />
      </ComposedChart>
    </ChartCard>
  );
};

// ============================================================
// 6) CloudMarginTrajectory — Cloud 利润率独立强调
// ============================================================
export const CloudMarginTrajectory = ({ data }) => {
  const rows = buildSeriesData(data);

  return (
    <ChartCard
      title='Cloud 利润率扩张轨迹（独立视图）'
      subtitle='从 17.8% 到 32.9% 的 5 季度跃迁'
      insight='17.8% → 20.7% → 23.7% → 30.1% → 32.9% — 五季度 +15.1pp 的稳态扩张验证规模经济。距离 AWS 报告 30% 边际利润率已接近持平。'
    >
      <LineChart
        data={rows}
        margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray='3 3'
          stroke='rgba(148,163,184,0.15)'
        />
        <XAxis dataKey='q' {...axisCommon} />
        <YAxis
          {...axisCommon}
          tickFormatter={fmtPct}
          domain={[0, 40]}
        />
        <Tooltip {...tooltipStyle} formatter={(v) => v + '%'} />
        <Legend wrapperStyle={legendStyle} />
        <ReferenceLine
          y={30}
          stroke='#f59e0b'
          strokeDasharray='5 4'
          label={{
            value: 'AWS-level (~30%)',
            position: 'insideTopRight',
            fill: '#f59e0b',
            fontSize: 10,
          }}
        />
        <Line
          type='monotone'
          dataKey='cloudOpMargin'
          name='Cloud OpMargin'
          stroke='#22d3ee'
          strokeWidth={3}
          dot={{ r: 5, fill: '#22d3ee', stroke: '#0e7490', strokeWidth: 1 }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ChartCard>
  );
};
