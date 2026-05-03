// Generic table components for Alphabet research dashboard.

const baseToneStyles = {
  positive: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
  negative: 'bg-red-500/10 text-red-300 border-red-500/40',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
  neutral: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
  risk: 'bg-red-500/10 text-red-300 border-red-500/40',
  safe: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
  fair: 'bg-amber-500/10 text-amber-300 border-amber-500/40',
};

export const TonePill = ({ tone = 'neutral', children }) => (
  <span
    className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full font-semibold border whitespace-nowrap ${
      baseToneStyles[tone] || baseToneStyles.neutral
    }`}
  >
    {children}
  </span>
);

const formatNumberCell = (value) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return value.toLocaleString('en-US');
  if (typeof value === 'object' && value.tone) {
    return <TonePill tone={value.tone}>{value.text}</TonePill>;
  }
  return value;
};

// Generic horizontal-scrollable comparison table with sticky first column.
// Accepts:
//   table = { headers: [...], rows: [[...]] }
//   highlightCol (optional, 1-indexed) — visually accent that column
export const ComparisonTable = ({ table, highlightCol }) => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/60 border-b border-slate-700/50">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className={`text-left px-4 py-3 font-semibold whitespace-nowrap text-slate-300 ${
                  i === 0 ? 'sticky left-0 z-10 bg-slate-800/95' : ''
                } ${highlightCol && i === highlightCol ? 'text-amber-300' : ''}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => {
            const isTotalRow =
              typeof row[0] === 'string' &&
              (row[0].includes('合计') || row[0].includes('Total') || row[0].includes('小计'));
            return (
              <tr
                key={i}
                className={`border-b border-slate-800/50 last:border-0 transition-colors ${
                  isTotalRow ? 'bg-slate-800/40' : 'hover:bg-slate-800/30'
                }`}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2.5 whitespace-nowrap ${
                      j === 0
                        ? 'sticky left-0 z-10 bg-slate-900/95 font-medium text-slate-300'
                        : 'text-slate-300'
                    } ${highlightCol && j === highlightCol ? 'text-amber-200 font-semibold' : ''} ${
                      isTotalRow ? 'font-semibold text-slate-100' : ''
                    }`}
                  >
                    {formatNumberCell(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    {table.notes && (
      <div className="px-4 py-3 border-t border-slate-800/50 text-[11px] text-slate-500 leading-relaxed italic">
        {table.notes}
      </div>
    )}
  </div>
);

// Analyst target table with target column tinted by tone.
export const AnalystTargetTable = ({ table }) => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/60 border-b border-slate-700/50">
            <th className="text-left px-4 py-3 font-semibold text-slate-300">机构</th>
            <th className="text-right px-4 py-3 font-semibold text-slate-300">目标价</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-300">动作 / 评级</th>
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => {
            const toneText = {
              positive: 'text-emerald-300',
              negative: 'text-red-300',
              neutral: 'text-slate-300',
            }[row.tone];
            return (
              <tr key={i} className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30">
                <td className="px-4 py-2.5 font-medium text-slate-200 whitespace-nowrap">{row.firm}</td>
                <td className={`px-4 py-2.5 text-right font-mono font-semibold ${toneText}`}>
                  ${row.target}
                </td>
                <td className="px-4 py-2.5 text-slate-400 text-sm leading-relaxed">{row.action}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    {table.caveat && (
      <div className="px-4 py-3 border-t border-slate-800/50 text-[11px] text-slate-500 italic">
        {table.caveat}
      </div>
    )}
  </div>
);

// Sanity-check table: one row per check, with PASS / WARN status pill.
export const SanityCheckList = ({ checks }) => (
  <div className="space-y-2">
    {checks.map((c) => {
      const passTone = c.pass === true ? 'positive' : c.pass === 'warning' ? 'warning' : 'negative';
      const passLabel = c.pass === true ? '✓ PASS' : c.pass === 'warning' ? '⚠ WATCH' : '✗ FAIL';
      return (
        <div
          key={c.n}
          className={`rounded-xl border p-4 ${
            passTone === 'warning'
              ? 'border-amber-500/30 bg-amber-500/[0.04]'
              : 'border-slate-700/50 bg-slate-800/30'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-mono text-slate-500">#{c.n}</span>
              <span className="text-sm font-semibold text-slate-200">{c.check}</span>
            </div>
            <TonePill tone={passTone}>{passLabel}</TonePill>
          </div>
          <div className="text-xs text-slate-400 leading-relaxed mt-2">
            <div>
              <span className="text-slate-500">期望: </span>
              <span className="font-mono text-slate-300">{c.expected}</span>
            </div>
            <div className="mt-1">
              <span className="text-slate-500">实际: </span>
              <span className="font-mono text-slate-300">{c.actual}</span>
            </div>
            <div className="mt-1.5 italic text-slate-400">{c.comment}</div>
          </div>
        </div>
      );
    })}
  </div>
);
