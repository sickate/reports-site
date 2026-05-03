import {
  reportMeta,
  bluf,
  baseDataTable,
  revenueMultiples,
  earningsMultiples,
  capacityMultiples,
  multiplesKeyFinding,
  backlogMethodology,
  raBacklogTable,
  raBacklogFindings,
  impliedGrowthMethodology,
  impliedGrowthTable,
  safetyMarginRules,
  impliedGrowthKeyFinding,
  nbisNumberCheck,
  nbisGrowthCheck,
  nbisNonCoreAssets,
  nbisSpotCapacity,
  nbisBearArguments,
  nbisBullArguments,
  nbisFinalVerdict,
  growthScorecard,
  backlogRanking,
  finalRanking,
  frameworkValidation,
  systemicRisks,
  companyOpenQuestions,
  disclaimer,
} from './content.js';

// ============================================
// Section title (chapter heading)
// ============================================

const SectionTitle = ({ number, children, subtitle }) => (
  <div className="mb-6 mt-12">
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
// BLUF callout (top, amber)
// ============================================

const BlufCallout = ({ data }) => (
  <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-amber-500/[0.03] p-6 mb-8">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
        ⚡ BLUF · 底线先行
      </span>
    </div>
    <h2 className="text-xl md:text-2xl font-semibold text-amber-100 leading-snug mb-3">
      {data.headline}
    </h2>
    <p className="text-sm md:text-base text-slate-300 leading-relaxed">{data.body}</p>
  </div>
);

// ============================================
// Generic comparison table (sticky first column, horizontal scroll)
// ============================================

const ComparisonTable = ({ table, highlightCol, accentRow }) => (
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
            const isAccent = accentRow && accentRow === i;
            return (
              <tr
                key={i}
                className={`border-b border-slate-800/50 last:border-0 transition-colors ${
                  isAccent ? 'bg-amber-500/5' : 'hover:bg-slate-800/30'
                }`}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2.5 whitespace-nowrap ${
                      j === 0
                        ? 'sticky left-0 z-10 bg-slate-900/95 font-medium text-slate-300'
                        : 'text-slate-300'
                    } ${highlightCol && j === highlightCol ? 'text-amber-200 font-semibold' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================
// Methodology card (4-dimension layout)
// ============================================

const MethodologyCard = ({ item }) => (
  <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
    <div className="text-[11px] font-mono text-cyan-300/80 tracking-widest mb-1">
      {item.dim || item.label}
    </div>
    <div className="text-sm font-semibold text-slate-100 mb-2">{item.title || ''}</div>
    <p className="text-sm text-slate-400 leading-relaxed">{item.body}</p>
  </div>
);

// ============================================
// Implied Growth table (verdict-tinted rows)
// ============================================

const verdictRowBg = {
  safe: 'bg-emerald-500/5 hover:bg-emerald-500/10',
  fair: 'bg-amber-500/5 hover:bg-amber-500/10',
  risk: 'bg-red-500/5 hover:bg-red-500/10',
};

const verdictGapColor = {
  safe: 'text-emerald-300 font-semibold',
  fair: 'text-amber-300 font-semibold',
  risk: 'text-red-300 font-semibold',
};

const ImpliedGrowthTable = ({ table }) => (
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
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => {
            const verdict = row.verdict || 'fair';
            const lastIdx = table.headers.length - 1;
            return (
              <tr
                key={i}
                className={`border-b border-slate-800/50 last:border-0 transition-colors ${verdictRowBg[verdict]}`}
              >
                <td
                  className={`px-4 py-2.5 sticky left-0 z-10 font-semibold text-slate-200 whitespace-nowrap bg-slate-900/95`}
                >
                  {row.label}
                </td>
                {row.cells.map((cell, j) => {
                  const isGapCol = j + 1 === lastIdx;
                  return (
                    <td
                      key={j}
                      className={`px-4 py-2.5 whitespace-nowrap text-slate-300 ${
                        isGapCol ? verdictGapColor[verdict] : ''
                      }`}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================
// Safety margin rule cards
// ============================================

const verdictBlockStyles = {
  safe: 'border-emerald-500/40 bg-emerald-500/5',
  fair: 'border-amber-500/40 bg-amber-500/5',
  risk: 'border-red-500/40 bg-red-500/5',
};

const verdictTextStyles = {
  safe: 'text-emerald-300',
  fair: 'text-amber-300',
  risk: 'text-red-300',
};

const SafetyMarginRules = ({ rules }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {rules.map((rule, i) => (
      <div
        key={i}
        className={`rounded-xl border p-4 ${verdictBlockStyles[rule.verdict]}`}
      >
        <div
          className={`text-sm font-semibold flex items-center gap-2 mb-2 ${verdictTextStyles[rule.verdict]}`}
        >
          <span className="text-base">{rule.icon}</span>
          <span>{rule.label}</span>
        </div>
        <div className="text-xs text-slate-400 leading-relaxed mb-2 font-mono">{rule.criterion}</div>
        <div className="text-xs text-slate-500">公司: <span className="text-slate-300">{rule.companies}</span></div>
      </div>
    ))}
  </div>
);

// ============================================
// Verdict badge for table cells (small)
// ============================================

const verdictCellStyles = {
  safe: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  fair: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  risk: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const VerdictPill = ({ tone, text }) => (
  <span
    className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap ${verdictCellStyles[tone]}`}
  >
    {text}
  </span>
);

// ============================================
// Final verdict table (mixed cell types)
// ============================================

const FinalVerdictTable = ({ table }) => (
  <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-800/60 border-b border-slate-700/50">
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-4 py-3 font-semibold whitespace-nowrap text-slate-300"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-800/50 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 align-top text-slate-300 ${j === 0 ? 'font-semibold whitespace-nowrap' : ''}`}>
                  {typeof cell === 'object' && cell !== null && cell.tone ? (
                    <VerdictPill tone={cell.tone} text={cell.text} />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================
// Bull / Bear arguments column
// ============================================

const ArgumentList = ({ args, tone }) => {
  const styles = {
    bull: 'border-emerald-500/30 bg-emerald-500/[0.04]',
    bear: 'border-red-500/30 bg-red-500/[0.04]',
  };
  const numColor = {
    bull: 'text-emerald-300',
    bear: 'text-red-300',
  };
  return (
    <div className={`rounded-2xl border ${styles[tone]} p-5`}>
      <div className="text-xs uppercase font-mono tracking-widest mb-4 text-slate-400">
        {tone === 'bull' ? '反驳"无安全边际"的 5 条最强论据' : '支持"无安全边际"的 5 条最强论据'}
      </div>
      <ul className="space-y-4">
        {args.map((a) => (
          <li key={a.n} className="flex gap-3">
            <span className={`text-sm font-mono font-bold flex-shrink-0 ${numColor[tone]}`}>
              {a.n}.
            </span>
            <div>
              <div className="text-sm font-semibold text-slate-200 mb-1">{a.title}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{a.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================
// Final ranking card (with stars)
// ============================================

const renderStars = (count) => (
  <span className="text-amber-300 tracking-tight">
    {'⭐'.repeat(count)}
    <span className="text-slate-700">{'⭐'.repeat(5 - count)}</span>
  </span>
);

const positionStyles = {
  '核心持仓': 'border-emerald-500/40 bg-emerald-500/[0.06]',
  '战术仓 (可升级)': 'border-cyan-500/40 bg-cyan-500/[0.05]',
  '战术仓 (谨慎)': 'border-amber-500/40 bg-amber-500/[0.05]',
  '战术仓 (对冲 CRWV)': 'border-amber-500/40 bg-amber-500/[0.05]',
  '回避 / 小仓': 'border-red-500/30 bg-red-500/[0.04]',
  '回避': 'border-red-500/40 bg-red-500/[0.05]',
};

const positionTextColor = {
  '核心持仓': 'text-emerald-300',
  '战术仓 (可升级)': 'text-cyan-300',
  '战术仓 (谨慎)': 'text-amber-300',
  '战术仓 (对冲 CRWV)': 'text-amber-300',
  '回避 / 小仓': 'text-red-300',
  '回避': 'text-red-300',
};

const RankingCard = ({ item }) => {
  const cardStyle = positionStyles[item.position] || 'border-slate-700/50 bg-slate-800/30';
  const textStyle = positionTextColor[item.position] || 'text-slate-300';
  return (
    <div className={`rounded-2xl border p-5 ${cardStyle}`}>
      <div className="flex items-start gap-4 mb-3 flex-wrap">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/70 border border-slate-700 text-amber-300 font-bold">
          {item.rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className="text-lg font-bold text-slate-100">{item.ticker}</h4>
            <div className="text-sm">{renderStars(item.stars)}</div>
          </div>
          <div className={`text-xs font-semibold mt-1 ${textStyle}`}>定位建议: {item.position}</div>
        </div>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">{item.logic}</p>
    </div>
  );
};

// ============================================
// Main component
// ============================================

const NeocloudSectorReport = () => (
  <div className="max-w-6xl mx-auto px-4 py-6 text-slate-200">
    {/* Header */}
    <header className="mb-6">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
          投研分析 · Neocloud 横评
        </span>
        <span className="text-xs text-slate-500">更新于 {reportMeta.updatedAt}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2 leading-tight">
        {reportMeta.title}
      </h1>
      <p className="text-slate-400 text-base mb-4">{reportMeta.subtitle}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          综合判断: {reportMeta.rating}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-600/30">
          数据基准 {reportMeta.asOfDate}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-600/30">
          覆盖 {reportMeta.scope}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/30 text-slate-300 border border-slate-600/30">
          时间框架 {reportMeta.timeframe}
        </span>
      </div>
      <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 text-xs text-slate-400 italic leading-relaxed">
        {reportMeta.revisionNote}
      </div>
    </header>

    {/* BLUF */}
    <BlufCallout data={bluf} />

    {/* Section 1 — Base data */}
    <SectionTitle number="一" subtitle="2026-04-10 ~ 2026-04-13 数据基准 · 7 家 Neocloud 横向数据">
      估值基础数据总览
    </SectionTitle>
    <ComparisonTable table={baseDataTable} />
    <p className="text-[11px] text-slate-500 leading-relaxed italic mt-3">{baseDataTable.notes}</p>

    {/* Section 2 — Multiples matrix */}
    <SectionTitle number="二" subtitle="收入 / 盈利 / 产能 三个维度 · 揭示估值分化">
      综合多倍数估值矩阵
    </SectionTitle>

    <SubHeading subtitle={revenueMultiples.title}>收入类倍数</SubHeading>
    <ComparisonTable table={revenueMultiples} />
    <p className="text-[11px] text-slate-500 leading-relaxed italic mt-3">
      {revenueMultiples.notes}
    </p>

    <SubHeading subtitle={earningsMultiples.title}>盈利类倍数</SubHeading>
    <ComparisonTable table={earningsMultiples} />
    <p className="text-[11px] text-slate-500 leading-relaxed italic mt-3">
      {earningsMultiples.notes}
    </p>

    <SubHeading subtitle={capacityMultiples.title}>产能类倍数</SubHeading>
    <ComparisonTable table={capacityMultiples} />

    <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5">
      <div className="text-xs font-mono uppercase tracking-widest text-cyan-300 mb-2">关键发现</div>
      <p className="text-sm text-slate-300 leading-relaxed">{multiplesKeyFinding}</p>
    </div>

    {/* Section 3 — Backlog risk adjustment */}
    <SectionTitle number="三" subtitle="剥离合同账面价值的水分 · 四维风险调整框架">
      Backlog 风险调整
    </SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {backlogMethodology.map((item, i) => (
        <MethodologyCard key={i} item={item} />
      ))}
    </div>

    <SubHeading>风险调整结果 (RA-Backlog 与 EV/RA-Backlog)</SubHeading>
    <ComparisonTable table={raBacklogTable} highlightCol={7} />

    <div className="mt-6 space-y-4">
      {raBacklogFindings.map((f, i) => (
        <div
          key={i}
          className={`rounded-xl border p-5 ${
            f.tone === 'warning'
              ? 'border-amber-500/40 bg-amber-500/5'
              : 'border-slate-700/50 bg-slate-800/30'
          }`}
        >
          <div
            className={`text-sm font-semibold mb-2 ${
              f.tone === 'warning' ? 'text-amber-300' : 'text-emerald-300'
            }`}
          >
            {f.heading}
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{f.body}</p>
        </div>
      ))}
    </div>

    {/* Section 4 — Implied growth */}
    <SectionTitle number="四" subtitle="市场在为每家公司定价多少增长 · Reverse DCF">
      Implied Growth 反推
    </SectionTitle>

    <SubHeading subtitle="假设 + 反推路径">方法论</SubHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {impliedGrowthMethodology.map((item, i) => (
        <MethodologyCard key={i} item={item} />
      ))}
    </div>

    <SubHeading>反推结果总表</SubHeading>
    <ImpliedGrowthTable table={impliedGrowthTable} />
    <p className="text-[11px] text-slate-500 leading-relaxed italic mt-3">
      {impliedGrowthTable.notes}
    </p>

    <SubHeading>安全边际判定规则</SubHeading>
    <SafetyMarginRules rules={safetyMarginRules} />

    <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
      <div className="text-xs font-mono uppercase tracking-widest text-emerald-300 mb-2">
        最关键的发现
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{impliedGrowthKeyFinding}</p>
    </div>

    {/* Section 5 — NBIS Red Team */}
    <SectionTitle number="五" subtitle="逐项检验 $146 估值断言">
      NBIS $146 红队专项检验
    </SectionTitle>

    <SubHeading subtitle='"3.5x EV/2026E Revenue"到底对不对'>
      数字验证
    </SubHeading>
    <p className="text-sm text-slate-300 leading-relaxed mb-4">{nbisNumberCheck.intro}</p>
    <ComparisonTable table={nbisNumberCheck.table} />
    <p className="text-[11px] text-slate-500 leading-relaxed italic mt-3">
      {nbisNumberCheck.table.notes}
    </p>
    <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-slate-300 leading-relaxed">
      {nbisNumberCheck.conclusion}
    </div>

    <SubHeading>"500% 增速"验证</SubHeading>
    <ComparisonTable table={nbisGrowthCheck.table} />
    <div className="mt-4 rounded-xl border border-slate-700/50 bg-slate-800/30 p-5 text-sm text-slate-300 leading-relaxed">
      {nbisGrowthCheck.analysis}
    </div>

    <SubHeading subtitle='非核心资产 SOTP · 反驳"无安全边际"论断的最有力武器'>
      NBIS 独特估值 offset
    </SubHeading>
    <ComparisonTable table={nbisNonCoreAssets.table} highlightCol={4} accentRow={4} />
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <div className="text-xs font-mono uppercase tracking-widest text-emerald-300 mb-2">
          $7B 缓冲
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{nbisNonCoreAssets.totalNote}</p>
      </div>
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-5">
        <div className="text-xs font-mono uppercase tracking-widest text-cyan-300 mb-2">
          ClickHouse 流动化
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{nbisNonCoreAssets.clickhouseNote}</p>
      </div>
    </div>

    <SubHeading>{nbisSpotCapacity.intro}</SubHeading>
    <p className="text-sm text-slate-300 leading-relaxed mb-3">{nbisSpotCapacity.body}</p>
    <ul className="space-y-2 ml-4">
      {nbisSpotCapacity.bullets.map((b, i) => (
        <li key={i} className="text-sm text-slate-400 list-disc leading-relaxed">
          {b}
        </li>
      ))}
    </ul>

    <SubHeading subtitle="Bear vs Bull · 5 vs 5">红队对立论点总结</SubHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ArgumentList args={nbisBearArguments} tone="bear" />
      <ArgumentList args={nbisBullArguments} tone="bull" />
    </div>

    <SubHeading>红队终局判定</SubHeading>
    <p className="text-sm text-slate-300 leading-relaxed mb-4">{nbisFinalVerdict.intro}</p>
    <FinalVerdictTable table={nbisFinalVerdict.table} />
    <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/[0.06] p-5">
      <div className="text-xs font-mono uppercase tracking-widest text-amber-300 mb-2">
        操作建议
      </div>
      <p className="text-sm text-slate-200 leading-relaxed">{nbisFinalVerdict.advice}</p>
    </div>

    {/* Section 6 — Final ranking */}
    <SectionTitle number="六" subtitle="Implied Growth Scorecard · Backlog 质量 · 综合评分">
      7 家公司安全边际综合排序
    </SectionTitle>

    <SubHeading>Implied Growth Scorecard</SubHeading>
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/60 border-b border-slate-700/50">
              {growthScorecard.headers.map((h, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-3 font-semibold whitespace-nowrap text-slate-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {growthScorecard.rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-slate-800/50 last:border-0 transition-colors ${verdictRowBg[row.tone]}`}
              >
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2.5 whitespace-nowrap ${
                      j === 1 ? 'font-semibold text-slate-200' : 'text-slate-300'
                    }`}
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

    <SubHeading>Risk-Adjusted Backlog 质量排名</SubHeading>
    <ComparisonTable table={backlogRanking} />

    <SubHeading subtitle="加权评分综合估值反推、backlog 质量与资产负债表健康度">
      安全边际综合终排序
    </SubHeading>
    <div className="space-y-4">
      {finalRanking.map((item) => (
        <RankingCard key={item.rank} item={item} />
      ))}
    </div>

    <SubHeading>对用户持仓框架的验证</SubHeading>
    <p className="text-sm text-slate-300 leading-relaxed mb-4">{frameworkValidation.intro}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {frameworkValidation.adjustments.map((a, i) => (
        <div
          key={i}
          className="rounded-xl border border-cyan-500/30 bg-cyan-500/[0.04] p-5"
        >
          <div className="text-sm font-semibold text-cyan-200 mb-2">{a.heading}</div>
          <p className="text-sm text-slate-400 leading-relaxed">{a.body}</p>
        </div>
      ))}
    </div>

    {/* Section 7 — Risks */}
    <SectionTitle number="七" subtitle="系统性风险 + 公司未决问题">
      风险提示与未决问题
    </SectionTitle>

    <SubHeading subtitle="影响全板块">系统性风险</SubHeading>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {systemicRisks.map((r, i) => (
        <div key={i} className="rounded-xl border border-red-500/30 bg-red-500/[0.04] p-5">
          <div className="text-sm font-semibold text-red-300 mb-2">{r.title}</div>
          <p className="text-xs text-slate-400 leading-relaxed">{r.body}</p>
        </div>
      ))}
    </div>

    <SubHeading>公司特定未决问题</SubHeading>
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {companyOpenQuestions.map((q, i) => (
            <tr
              key={i}
              className="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30"
            >
              <td className="px-4 py-3 align-top font-semibold text-amber-200 whitespace-nowrap w-24">
                {q.ticker}
              </td>
              <td className="px-4 py-3 text-slate-400 leading-relaxed text-sm">{q.questions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Disclaimer */}
    <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-600 italic leading-relaxed">
      {disclaimer}
    </div>
  </div>
);

export default NeocloudSectorReport;
