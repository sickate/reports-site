import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, ReferenceLine,
} from 'recharts';

// Colors/names kept in sync with the 50-year metals page + the data registry.
const METAL_CONFIG = {
  gold: { name: 'Gold', color: '#FFD700' },
  silver: { name: 'Silver', color: '#C0C0C0' },
  copper: { name: 'Copper', color: '#B87333' },
  aluminum: { name: 'Aluminum', color: '#848789' },
  iron: { name: 'Iron', color: '#8B4513' },
  nickel: { name: 'Nickel', color: '#727472' },
  cobalt: { name: 'Cobalt', color: '#0047AB' },
  zinc: { name: 'Zinc', color: '#7CB9E8' },
  tin: { name: 'Tin', color: '#8B8589' },
  tungsten: { name: 'Tungsten', color: '#e74c3c' },
  molybdenum: { name: 'Molybdenum', color: '#4A4A4A' },
  lithium: { name: 'Lithium', color: '#9b59b6' },
  titanium: { name: 'Titanium', color: '#1abc9c' },
};
const METAL_ORDER = ['gold', 'silver', 'copper', 'aluminum', 'iron', 'nickel', 'cobalt', 'zinc', 'tin', 'tungsten', 'molybdenum', 'lithium', 'titanium'];

const DAY = 86400000;
const FREQ_LABEL = { daily: 'Daily', monthly: 'Monthly', manual: 'Low-freq' };
const FREQ_COLOR = { daily: '#34d399', monthly: '#fbbf24', manual: '#94a3b8' };

const tsOf = (dateStr) => new Date(`${dateStr}T00:00:00Z`).getTime();
const fmtMonth = (ts) => {
  const d = new Date(ts);
  const mo = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  return d.getUTCMonth() === 0 ? `${mo} ’${String(d.getUTCFullYear()).slice(2)}` : mo;
};
const fmtDate = (ts) => new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
const fmtPrice = (v) =>
  v == null ? '—' : v >= 1000
    ? v.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : v.toLocaleString(undefined, { maximumFractionDigits: 2 });
const fmtPct = (v) => (v == null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`);

const CombinedTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const rows = payload.filter((p) => p.value != null).sort((a, b) => b.value - a.value);
  return (
    <div style={{ background: 'rgba(15,23,42,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <p style={{ color: '#94a3b8', margin: '0 0 6px', fontWeight: 600, fontSize: 12 }}>{fmtDate(label)}</p>
      {rows.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, margin: '3px 0', fontSize: 13 }}>
          {METAL_CONFIG[p.dataKey]?.name || p.dataKey}: {fmtPct(p.value)}
        </p>
      ))}
    </div>
  );
};

function MetalsMomentum() {
  const [mode, setMode] = useState('ytd'); // 'ytd' | 'rolling'
  const [dailyMetals, setDailyMetals] = useState(null);
  const [yearlyMetals, setYearlyMetals] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetals, setSelectedMetals] = useState(METAL_ORDER);

  useEffect(() => {
    const cb = Math.floor(Date.now() / 3600000);
    Promise.all([
      fetch(`/data/metals-daily.json?v=${cb}`).then((r) => {
        if (!r.ok) throw new Error('Failed to load daily price data');
        return r.json();
      }),
      fetch(`/data/metals-prices.json?v=${cb}`).then((r) => (r.ok ? r.json() : { metals: {} })).catch(() => ({ metals: {} })),
    ])
      .then(([daily, yearly]) => {
        setDailyMetals(daily.metals || {});
        setYearlyMetals(yearly.metals || {});
        setLastUpdated(daily.lastUpdated);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  // Window + axis domain. Same ~1-year width in both modes; YTD pins to the full
  // calendar year so the post-today span renders empty.
  const { winStartTs, axisStartTs, axisEndTs } = useMemo(() => {
    const now = new Date();
    const todayTs = Date.now();
    if (mode === 'ytd') {
      const y = now.getUTCFullYear();
      return { winStartTs: Date.UTC(y, 0, 1), axisStartTs: Date.UTC(y, 0, 1), axisEndTs: Date.UTC(y, 11, 31) };
    }
    const start = todayTs - 365 * DAY;
    return { winStartTs: start, axisStartTs: start, axisEndTs: todayTs };
  }, [mode]);

  const metals = useMemo(() => {
    if (!dailyMetals) return [];
    return METAL_ORDER.filter((id) => dailyMetals[id]).map((id) => ({
      id,
      name: METAL_CONFIG[id]?.name || dailyMetals[id].name,
      color: METAL_CONFIG[id]?.color || dailyMetals[id].color,
      unit: dailyMetals[id].unit,
      frequency: dailyMetals[id].frequency || 'daily',
      points: (dailyMetals[id].data || [])
        .map((p) => ({ ts: tsOf(p.date), price: p.price }))
        .sort((a, b) => a.ts - b.ts),
    }));
  }, [dailyMetals]);

  // Per-metal: baseline (window-start price), in-window series, current, % change.
  const computed = useMemo(() => {
    const map = {};
    metals.forEach((m) => {
      const inWin = m.points.filter((p) => p.ts >= axisStartTs && p.ts <= axisEndTs);

      // Baseline = latest point on/before window start (exact). For YTD this is
      // the prior year-end anchor (Dec 31 < Jan 1), giving a true YTD baseline.
      let base = null;
      for (const p of m.points) {
        if (p.ts <= winStartTs) base = p.price; else break;
      }
      const baseExact = base != null;

      // Fallbacks when no point precedes the window (cold start):
      if (base == null) {
        const y = new Date(winStartTs).getUTCFullYear();
        const prevClose = yearlyMetals?.[m.id]?.data?.find((d) => d.year === y - 1)?.price ?? null;
        const firstIn = inWin.length ? inWin[0].price : null;
        // YTD wants the prior year-end close; rolling wants the earliest in-window point.
        base = mode === 'ytd' ? (prevClose ?? firstIn) : (firstIn ?? prevClose);
      }

      const current = m.points.length ? m.points[m.points.length - 1].price : null;
      const pct = base != null && current != null ? (current / base - 1) * 100 : null;
      map[m.id] = { base, baseExact, inWin, current, pct };
    });
    return map;
  }, [metals, mode, winStartTs, axisStartTs, axisEndTs, yearlyMetals]);

  // Combined normalized %-change rows (merged by timestamp; lines connectNulls).
  // When the baseline is exact (a point precedes the window), seed a 0% anchor at
  // the axis start so the line spans the full period even if the first real point
  // is later (e.g. YTD with only a prior year-end anchor + today's price).
  const combinedData = useMemo(() => {
    const tsSet = new Set();
    selectedMetals.forEach((id) => {
      const c = computed[id];
      if (!c || c.base == null) return;
      if (c.baseExact) tsSet.add(axisStartTs);
      c.inWin.forEach((p) => tsSet.add(p.ts));
    });
    const rowByTs = new Map([...tsSet].sort((a, b) => a - b).map((ts) => [ts, { ts }]));
    selectedMetals.forEach((id) => {
      const c = computed[id];
      if (!c || c.base == null) return;
      if (c.baseExact) rowByTs.get(axisStartTs)[id] = 0;
      c.inWin.forEach((p) => { rowByTs.get(p.ts)[id] = +(((p.price / c.base) - 1) * 100).toFixed(2); });
    });
    return [...rowByTs.values()];
  }, [selectedMetals, computed, axisStartTs]);

  const yDomain = useMemo(() => {
    let min = Infinity, max = -Infinity;
    combinedData.forEach((r) => selectedMetals.forEach((id) => {
      const v = r[id];
      if (v != null && !isNaN(v)) { min = Math.min(min, v); max = Math.max(max, v); }
    }));
    if (min === Infinity) return [-10, 10];
    const pad = Math.max((max - min) * 0.1, 2);
    return [Math.floor(min - pad), Math.ceil(max + pad)];
  }, [combinedData, selectedMetals]);

  const xTicks = useMemo(() => {
    const ticks = [];
    let d = new Date(axisStartTs);
    let y = d.getUTCFullYear(), m = d.getUTCMonth();
    let t = Date.UTC(y, m, 1);
    if (t < axisStartTs) { m += 1; if (m > 11) { m = 0; y += 1; } t = Date.UTC(y, m, 1); }
    while (t <= axisEndTs) {
      ticks.push(t);
      m += 1; if (m > 11) { m = 0; y += 1; }
      t = Date.UTC(y, m, 1);
    }
    return ticks;
  }, [axisStartTs, axisEndTs]);

  const toggleMetal = (id) => setSelectedMetals((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  if (loading) return <div style={{ padding: 48, color: '#94a3b8', textAlign: 'center' }}>Loading price data…</div>;
  if (error) return <div style={{ padding: 48, color: '#f87171', textAlign: 'center' }}>Error: {error}</div>;

  const modeLabel = mode === 'ytd' ? 'Year-to-Date' : 'Rolling 1-Year';
  const baselineNote = mode === 'ytd' ? 'baseline = prior year-end close' : 'baseline = price ~12 months ago';

  const btn = (active) => ({
    padding: '8px 18px',
    borderRadius: 8,
    border: `1px solid ${active ? '#FFD700' : 'rgba(255,255,255,0.12)'}`,
    background: active ? 'rgba(255,215,0,0.12)' : 'rgba(30,41,59,0.8)',
    color: active ? '#FFD700' : '#94a3b8',
    fontWeight: active ? 700 : 500,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 4px' }}>
      <div style={{ marginBottom: 8 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 28, color: '#e2e8f0' }}>Metals Momentum — YTD & Rolling 1-Year</h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 15, lineHeight: 1.6 }}>
          Daily price-change trends for 13 metals over a single year. Toggle between year-to-date and a trailing
          rolling 12-month window — both use the same one-year horizontal scale.
        </p>
      </div>

      {/* Cold-start / data-cadence banner */}
      <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10, padding: '12px 16px', margin: '16px 0 24px', color: '#93c5fd', fontSize: 13, lineHeight: 1.6 }}>
        Daily history is backfilled and accrues over time, so trend lines fill in as snapshots are collected. Each metal
        is tagged by data cadence — <b>Daily</b> (gold, silver, LME base metals), <b>Monthly</b> (iron ore, cobalt), or
        <b> Low-freq</b> (tungsten, molybdenum, lithium, titanium — no free daily feed). Returns are computed vs the
        period {baselineNote}.
        {lastUpdated && <> Updated {fmtDate(new Date(lastUpdated).getTime())}.</>}
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button style={btn(mode === 'ytd')} onClick={() => setMode('ytd')}>Year-to-Date</button>
        <button style={btn(mode === 'rolling')} onClick={() => setMode('rolling')}>Rolling 1-Year</button>
      </div>

      {/* Metal chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {metals.map((m) => {
          const on = selectedMetals.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => toggleMetal(m.id)}
              style={{
                background: on ? `${m.color}22` : 'rgba(30,41,59,0.8)',
                border: `1px solid ${on ? m.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 6, padding: '6px 12px',
                color: on ? m.color : '#64748b', fontSize: 12,
                cursor: 'pointer', fontWeight: on ? 600 : 400, transition: 'all 0.2s ease',
              }}
            >
              {m.name}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        <button onClick={() => setSelectedMetals(metals.map((m) => m.id))} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Select all</button>
        <button onClick={() => setSelectedMetals([])} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>Clear</button>
      </div>

      {/* Combined normalized %-change chart */}
      <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 16, padding: 24, marginBottom: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 18, color: '#e2e8f0' }}>{modeLabel} price change (%)</h2>
        <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 13 }}>All selected metals rebased to {mode === 'ytd' ? 'Jan 1' : '12 months ago'} = 0%.</p>
        {selectedMetals.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748b' }}>Select one or more metals above.</div>
        ) : (
          <ResponsiveContainer width="100%" height={460}>
            <LineChart data={combinedData} margin={{ top: 10, right: 24, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="ts" type="number" scale="time"
                domain={[axisStartTs, axisEndTs]} ticks={xTicks}
                tickFormatter={fmtMonth} stroke="#94a3b8" fontSize={12} allowDataOverflow
              />
              <YAxis stroke="#94a3b8" fontSize={12} domain={yDomain} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CombinedTooltip />} />
              <Legend />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
              {metals.filter((m) => selectedMetals.includes(m.id)).map((m) => (
                <Line key={m.id} type="monotone" dataKey={m.id} name={m.name} stroke={m.color} strokeWidth={2} dot={false} connectNulls activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Per-metal price cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {metals.filter((m) => selectedMetals.includes(m.id)).map((m) => {
          const c = computed[m.id];
          const series = c.inWin.slice();
          // Anchor the card at the period start only when the baseline is exact,
          // so we never draw a flat segment over a period with no data.
          if (c.baseExact && c.base != null && (series.length === 0 || series[0].ts > axisStartTs)) {
            series.unshift({ ts: axisStartTs, price: c.base });
          }
          const up = (c.pct ?? 0) >= 0;
          return (
            <div key={m.id} style={{ background: 'rgba(30,41,59,0.5)', borderRadius: 14, padding: 18, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
                    <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 15 }}>{m.name}</span>
                    <span style={{ fontSize: 10, color: FREQ_COLOR[m.frequency], border: `1px solid ${FREQ_COLOR[m.frequency]}55`, borderRadius: 4, padding: '1px 6px' }}>
                      {FREQ_LABEL[m.frequency] || m.frequency}
                    </span>
                  </div>
                  <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>
                    {fmtPrice(c.current)} {m.unit}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: up ? '#34d399' : '#f87171', fontWeight: 700, fontSize: 18 }}>{fmtPct(c.pct)}</div>
                  <div style={{ color: '#64748b', fontSize: 10 }}>{mode === 'ytd' ? 'YTD' : '1Y'}{c.base != null && !c.baseExact ? '*' : ''}</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={110}>
                <AreaChart data={series} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`g-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={m.color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={m.color} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="ts" type="number" scale="time" domain={[axisStartTs, axisEndTs]} hide />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(15,23,42,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 12 }}
                    labelFormatter={(ts) => fmtDate(ts)}
                    formatter={(v) => [`${fmtPrice(v)} ${m.unit}`, m.name]}
                  />
                  <Area type="monotone" dataKey="price" stroke={m.color} strokeWidth={2} fill={`url(#g-${m.id})`} dot={false} connectNulls activeDot={{ r: 4, stroke: m.color, strokeWidth: 2, fill: '#0f172a' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      <p style={{ color: '#475569', fontSize: 11, marginTop: 24, lineHeight: 1.6 }}>
        * Return approximated from the earliest available data point (full period baseline not yet collected).
        Sources: gold-api.com (gold/silver spot), westmetall.com (LME base metals), FRED (history). The 6 minor metals
        without a free daily feed use periodic/manual quotes. Not investment advice.
      </p>
    </div>
  );
}

export default MetalsMomentum;
