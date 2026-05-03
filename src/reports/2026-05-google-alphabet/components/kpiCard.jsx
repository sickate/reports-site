import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const TONE_BADGE_STYLES = {
  positive: 'border-emerald-500/50 text-emerald-300',
  negative: 'border-red-500/50 text-red-300',
  warning: 'border-amber-500/50 text-amber-300',
  neutral: 'border-slate-500/50 text-slate-300',
};

const TONE_BORDER_STYLES = {
  positive: 'border-emerald-500/30',
  negative: 'border-red-500/30',
  warning: 'border-amber-500/40',
  neutral: 'border-slate-700/50',
};

export const Sparkline = ({ history = [], color = '#fbbf24' }) => {
  if (!history || history.length < 2) {
    return (
      <div className="h-10 flex items-center justify-center text-xs text-slate-600 italic">
        —
      </div>
    );
  }

  const data = history.map((h) => ({ q: h.q, v: h.v }));

  return (
    <div className="h-10 -mx-1">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
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
            itemStyle={{ color }}
            formatter={(v) => v?.toLocaleString('en-US')}
            labelFormatter={(_, payload) => {
              const point = payload && payload[0] && payload[0].payload;
              return point?.q ?? '';
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ToneBadge = ({ tone = 'neutral', children }) => {
  const styles = TONE_BADGE_STYLES[tone] ?? TONE_BADGE_STYLES.neutral;
  return (
    <span
      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-slate-900/40 ${styles}`}
    >
      {children}
    </span>
  );
};

export const KpiCard = ({ card }) => {
  if (!card) return null;
  const {
    name,
    unit,
    latestDisplay,
    yoy,
    yoyTone = 'neutral',
    history,
    sparkColor = '#fbbf24',
    note,
  } = card;

  const borderClass = TONE_BORDER_STYLES[yoyTone] ?? TONE_BORDER_STYLES.neutral;

  return (
    <div
      className={`rounded-xl p-4 bg-slate-800/40 border ${borderClass} hover:bg-slate-800/60 transition-all flex flex-col gap-2 min-h-[180px]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-slate-400 text-xs font-medium leading-snug flex-1">
          {name}
        </div>
        {yoy && <ToneBadge tone={yoyTone}>{yoy}</ToneBadge>}
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-3xl font-bold text-slate-100">
          {latestDisplay ?? '—'}
        </span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      <Sparkline history={history} color={sparkColor} />
      {note && (
        <div className="mt-auto text-[11px] italic text-slate-500 leading-snug">
          {note}
        </div>
      )}
    </div>
  );
};

export const KpiGrid = ({ cards = [] }) => {
  if (!cards || cards.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <KpiCard key={card.key} card={card} />
      ))}
    </div>
  );
};
