import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

import {
  reportMeta,
  backgroundNarrative,
  metricOrder,
  structuralInsights,
  valuationTable,
  valuationCommentary,
  redTeamCards,
  weakAssumptions,
  coreLogicChains,
  tradeGuidance,
  disclaimer,
} from './content.js';

// ============================================
// Utilities
// ============================================

const formatNumber = (value) => {
  if (value === null || value === undefined) return '—';
  if (typeof value !== 'number') return String(value);
  if (Math.abs(value) >= 1000) return value.toLocaleString('en-US');
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(2);
};

const formatDate = (iso) => {
  if (!iso) return '—';
  if (iso.length === 10) return iso;
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
};

// ============================================
// Metric Card (dashboard header)
// ============================================

const TypeBadge = ({ type }) => {
  const auto = type === 'auto';
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
        auto
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
          : 'bg-slate-600/20 text-slate-400 border border-slate-500/30'
      }`}
    >
      {auto ? '● Auto' : '◦ Manual'}
    </span>
  );
};

const AlertChip = ({ level }) => {
  if (!level) return null;
  const styles = {
    alert: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    extreme: 'bg-red-500/20 text-red-300 border-red-500/40',
  };
  const label = { alert: '⚠️ ALERT', extreme: '🚨 EXTREME' }[level];
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${styles[level]}`}>
      {label}
    </span>
  );
};

const Sparkline = ({ history = [], color = '#fbbf24' }) => {
  if (!history || history.length < 2) {
    return <div className="h-8 text-xs text-slate-600 italic flex items-center">等待更多数据…</div>;
  }
  const data = history.map((h) => ({ date: h.date, value: h.value }));
  return (
    <div className="h-10 -mx-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.8}
            dot={false}
            isAnimationActive={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: 6,
              fontSize: 12,
              padding: '4px 8px',
            }}
            labelStyle={{ color: '#cbd5e1', fontSize: 11 }}
            itemStyle={{ color: color }}
            formatter={(v) => formatNumber(v)}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const MetricCard = ({ metric }) => {
  if (!metric) return null;
  const { name, unit, baseline, source, latest, type, history } = metric;
  const alertLevel = latest?.extreme ? 'extreme' : latest?.alert ? 'alert' : null;
  const borderClass = {
    extreme: 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    alert: 'border-amber-500/50',
    null: 'border-slate-700/50',
  }[alertLevel ?? 'null'];

  return (
    <div
      className={`rounded-xl p-4 bg-slate-800/40 backdrop-blur-sm border ${borderClass} transition-all hover:bg-slate-800/60 flex flex-col gap-2 min-h-[150px]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-slate-400 text-xs font-medium leading-snug flex-1">{name}</div>
        <TypeBadge type={type} />
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-bold text-slate-100">{formatNumber(latest?.value)}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
        <AlertChip level={alertLevel} />
      </div>
      {baseline && (
        <div className="text-[11px] text-slate-500 leading-snug">参照: {baseline}</div>
      )}
      {type === 'auto' && <Sparkline history={history} color="#fbbf24" />}
      {latest?.note && <div className="text-[11px] text-slate-400 italic">{latest.note}</div>}
      <div className="mt-auto pt-1 flex items-center justify-between text-[10px] text-slate-600">
        <span>{source || '—'}</span>
        <span>{formatDate(latest?.asOf)}</span>
      </div>
    </div>
  );
};

// ============================================
// Dashboard (header)
// ============================================

const MetricsDashboard = ({ data, lastUpdated, loading, error }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-12 text-center text-slate-400">
        正在加载实时指标…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-red-300">
        无法加载指标数据: {error}
      </div>
    );
  }
  if (!data) return null;

  const orderedMetrics = metricOrder
    .filter((key) => data.metrics?.[key])
    .map((key) => ({ key, ...data.metrics[key] }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          关键监控指标仪表盘
        </h3>
        <div className="text-[11px] text-slate-500">
          最后更新: {lastUpdated ? new Date(lastUpdated).toLocaleString('zh-CN') : '—'}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {orderedMetrics.map((m) => (
          <MetricCard key={m.key} metric={m} />
        ))}
      </div>
    </div>
  );
};

// ============================================
// Content Components
// ============================================

const SectionTitle = ({ number, children, subtitle }) => (
  <div className="mb-6 mt-12">
    <div className="flex items-baseline gap-3 mb-1">
      {number && (
        <span className="text-xs font-mono text-amber-400/70 tracking-widest">{number}</span>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100">{children}</h2>
    </div>
    {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
  </div>
);

const InsightBlock = ({ insight }) => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 mb-6">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{insight.icon}</span>
      <div>
        <h3 className="text-lg font-semibold text-slate-100">{insight.title}</h3>
        {insight.subtitle && (
          <p className="text-xs text-slate-500 italic">{insight.subtitle}</p>
        )}
      </div>
    </div>
    <div className="space-y-4 mt-4">
      {insight.blocks.map((b, i) => (
        <div
          key={i}
          className={`border-l-2 pl-4 ${
            b.tone === 'warning' ? 'border-amber-500/50' : 'border-slate-600/50'
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              b.tone === 'warning' ? 'text-amber-300' : 'text-slate-200'
            }`}
          >
            {b.heading}
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{b.body}</p>
        </div>
      ))}
    </div>
  </div>
);

const ValuationTable = () => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/50 border-b border-slate-700/50">
            {valuationTable.headers.map((h, i) => (
              <th
                key={i}
                className={`text-left px-4 py-3 font-semibold text-slate-300 ${
                  i === 0 ? 'sticky left-0 bg-slate-800/80' : ''
                } ${i === 1 ? 'text-amber-300' : ''}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {valuationTable.rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-2.5 ${
                    j === 0
                      ? 'sticky left-0 bg-slate-900/80 font-medium text-slate-400'
                      : 'text-slate-300'
                  } ${j === 1 ? 'text-amber-200 font-semibold' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const VerdictBadge = ({ verdict, label }) => {
  const styles = {
    falsified: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    partial: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    risk: 'bg-red-500/20 text-red-300 border-red-500/40',
  };
  const icons = { falsified: '✅', partial: '⚠️', risk: '🚨' };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border ${styles[verdict]}`}
    >
      <span>{icons[verdict]}</span>
      <span>{label}</span>
    </span>
  );
};

const RedTeamCard = ({ card }) => (
  <div
    className={`rounded-2xl border p-6 ${
      card.highlight
        ? 'border-red-500/40 bg-red-500/5'
        : 'border-slate-700/50 bg-slate-800/30'
    }`}
  >
    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 mb-1">{card.number}</div>
        {card.originalTitle && (
          <div className="text-sm text-slate-500 line-through mb-1">{card.originalTitle}</div>
        )}
        <h4 className="text-base md:text-lg font-semibold text-slate-100">{card.revisedTitle}</h4>
      </div>
      <VerdictBadge verdict={card.verdict} label={card.verdictLabel} />
    </div>
    <p className="text-sm text-slate-400 leading-relaxed mb-3">{card.body}</p>
    {card.bullets && (
      <ul className="space-y-1.5 mb-3 ml-4">
        {card.bullets.map((b, i) => (
          <li key={i} className="text-sm text-slate-400 list-disc">
            {b}
          </li>
        ))}
      </ul>
    )}
    {card.conclusion && (
      <div className="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-sm text-amber-200/90">
        {card.conclusion}
      </div>
    )}
  </div>
);

const TradeGuidanceTable = () => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
    <table className="w-full text-sm">
      <tbody>
        {tradeGuidance.map((row, i) => {
          const toneBg = {
            base: 'bg-blue-500/5',
            bull: 'bg-emerald-500/5',
            bear: 'bg-red-500/5',
          }[row.tone];
          return (
            <tr
              key={i}
              className={`border-b border-slate-800/50 last:border-0 ${toneBg || ''}`}
            >
              <td className="px-4 py-3 align-top font-semibold text-slate-300 whitespace-nowrap w-32">
                {row.key}
              </td>
              <td className="px-4 py-3 text-slate-300 leading-relaxed">
                {Array.isArray(row.value) ? (
                  <ol className="list-decimal ml-4 space-y-1">
                    {row.value.map((v, j) => (
                      <li key={j}>{v}</li>
                    ))}
                  </ol>
                ) : (
                  row.value
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

// ============================================
// Main Component
// ============================================

const CoscoShippingEnergyReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheBuster = Math.floor(Date.now() / 3600000);
    fetch(`/data/cosco-shipping-energy.json?v=${cacheBuster}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const lastUpdated = data?.lastUpdated;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-200">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
            投研分析 · v3.1
          </span>
          <span className="text-xs text-slate-500">更新于 {reportMeta.updatedAt}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2">
          {reportMeta.title}
        </h1>
        <p className="text-slate-400 text-base mb-4">{reportMeta.subtitle}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            {reportMeta.rating}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-600/30">
            置信度 {reportMeta.confidence}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-600/30">
            时间框架 {reportMeta.timeframe}
          </span>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-slate-400 italic">
          {reportMeta.revisionNote}
        </div>
      </header>

      {/* Dashboard */}
      <MetricsDashboard
        data={data}
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
      />

      {/* Background narrative */}
      <SectionTitle number="一" subtitle="霍尔木兹危机背景">
        关键数据仪表盘说明
      </SectionTitle>
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-slate-300 leading-relaxed text-sm md:text-base">
        {backgroundNarrative}
      </div>

      {/* Structural insights */}
      <SectionTitle number="二" subtitle="独立于地缘事件的中期逻辑">
        结构性洞察
      </SectionTitle>
      {structuralInsights.map((ins) => (
        <InsightBlock key={ins.id} insight={ins} />
      ))}

      {/* Valuation */}
      <SectionTitle number="三" subtitle="vs. Frontline / DHT / INSW / 招商轮船">
        可比估值分析
      </SectionTitle>
      <ValuationTable />
      <div className="mt-4 space-y-3">
        {valuationCommentary.map((text, i) => (
          <p key={i} className="text-sm text-slate-400 leading-relaxed">
            {text}
          </p>
        ))}
      </div>

      {/* Red team */}
      <SectionTitle number="四" subtitle="v3.1 修正版 · 5 个反对观点逐一测试">
        红队测试: 多空对决
      </SectionTitle>
      <div className="space-y-4">
        {redTeamCards.map((card) => (
          <RedTeamCard key={card.id} card={card} />
        ))}
      </div>

      {/* Weak assumptions */}
      <SectionTitle number="五" subtitle="本报告最容易崩坏的前提">
        最薄弱的假设
      </SectionTitle>
      <div className="space-y-4">
        {weakAssumptions.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5"
          >
            <h4 className="text-slate-200 font-semibold mb-2">{a.title}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{a.body}</p>
          </div>
        ))}
      </div>

      {/* Conclusion */}
      <SectionTitle number="六" subtitle="核心逻辑三条链">
        核心结论与评级
      </SectionTitle>
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">评级</div>
            <div className="text-lg font-semibold text-amber-300">{reportMeta.rating}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">置信度</div>
            <div className="text-lg font-semibold text-slate-200">{reportMeta.confidence}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">时间框架</div>
            <div className="text-lg font-semibold text-slate-200">{reportMeta.timeframe}</div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {coreLogicChains.map((chain, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4"
          >
            <div className="text-sm font-semibold text-amber-300 mb-1">{chain.heading}</div>
            <p className="text-sm text-slate-400 leading-relaxed">{chain.body}</p>
          </div>
        ))}
      </div>

      {/* Trade guide */}
      <SectionTitle number="七" subtitle="仓位、情景、失效红线、催化剂">
        交易指引
      </SectionTitle>
      <TradeGuidanceTable />

      {/* Disclaimer */}
      <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-600 italic leading-relaxed">
        {disclaimer}
      </div>
    </div>
  );
};

export default CoscoShippingEnergyReport;
