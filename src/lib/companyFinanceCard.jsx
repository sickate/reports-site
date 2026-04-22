function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function calcPct(base, next) {
  if (!isFiniteNumber(base) || !isFiniteNumber(next) || base === 0) {
    return null;
  }

  return ((next - base) / base) * 100;
}

function formatNumber(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  let maximumFractionDigits = 2;

  if (Math.abs(value - Math.round(value)) < 0.005) {
    maximumFractionDigits = 0;
  } else if (Math.abs(value * 10 - Math.round(value * 10)) < 0.05) {
    maximumFractionDigits = 1;
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  });
}

function formatPercent(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatMultiple(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `${value.toFixed(1)}x`;
}

function compactPeriodLabel(label) {
  const trimmed = String(label ?? '').trim();
  const match = trimmed.match(/(?:FY)?(\d{2,4})([A-Z])?/i);

  if (!match) {
    return trimmed;
  }

  const year = match[1].slice(-2);
  const suffix = match[2] ? match[2].toUpperCase() : '';
  const remainder = trimmed.slice(match.index + match[0].length).trim();

  return remainder ? `${year}${suffix} ${remainder}` : `${year}${suffix}`;
}

function buildDisplaySeries(record, key, formatter) {
  const rawSeries = record?.finance?.series?.[key] || [];
  const displaySeries = record?.finance?.display?.[key];

  return rawSeries.map((value, index) => displaySeries?.[index] || formatter(value));
}

function buildMarginSeries(record) {
  const explicitMargins = record?.finance?.series?.grossMargin || [];

  if (explicitMargins.some((value) => isFiniteNumber(value))) {
    return explicitMargins;
  }

  const revenue = record?.finance?.series?.revenue || [];
  const profit = record?.finance?.series?.netProfit || [];

  return revenue.map((value, index) => (
    isFiniteNumber(value) && value !== 0 && isFiniteNumber(profit[index])
      ? (profit[index] / value) * 100
      : null
  ));
}

function buildGrowthChips(labels, revenue) {
  const chips = [];

  for (let index = 1; index < revenue.length; index += 1) {
    const growth = calcPct(revenue[index - 1], revenue[index]);

    if (growth !== null) {
      chips.push(`${labels[index - 1]}→${labels[index]} 营收 ${formatPercent(growth)}`);
    }
  }

  return chips.slice(0, 3);
}

function marketLabel(market) {
  return {
    us: 'US',
    ca: 'Canada',
    de: 'Germany',
    se: 'Sweden',
    eu: 'Europe',
    il: 'Israel',
    uk: 'UK',
    fr: 'France',
    jp: 'Japan',
    cn: 'China',
    tw: 'Taiwan',
  }[market] || 'Global';
}

function buildStatusTags(record) {
  const tags = [...(record.companyProfile?.tags || [])];
  const flags = record.finance?.flags || {};

  if (Array.isArray(flags.approximateNetProfit) && flags.approximateNetProfit.some(Boolean)) {
    tags.push('利润含粗算口径');
  }

  if (Array.isArray(flags.netProfitUsesEbt) && flags.netProfitUsesEbt.some(Boolean)) {
    tags.push('后续利润仅公开 EBT');
  }

  if (flags.noReliableForwardConsensus) {
    tags.push('缺可靠远期一致预期');
  }

  return tags;
}

function FinanceSeriesRows({ labels, values, displayValues, fillClass = '' }) {
  const numericValues = values.map((value) => (isFiniteNumber(value) ? Math.abs(value) : 0));
  const maxValue = Math.max(...numericValues, 0) || 1;

  return labels.map((label, index) => (
    <div key={`${label}-${fillClass || 'base'}`} className="finance-series-row">
      <span className="finance-series-label">{label}</span>
      <div className="finance-series-track">
        <div
          className={`finance-series-fill${fillClass ? ` ${fillClass}` : ''}`}
          style={{ width: `${((isFiniteNumber(values[index]) ? Math.abs(values[index]) : 0) / maxValue) * 100}%` }}
        />
      </div>
      <span className="finance-series-value">{displayValues[index]}</span>
    </div>
  ));
}

function FinancePairRows({ labels, displayValues }) {
  return labels.map((label, index) => (
    <div key={`${label}-${displayValues[index]}`} className="finance-pair-row">
      <span className="finance-pair-label">{label}</span>
      <span className="finance-pair-value">{displayValues[index]}</span>
    </div>
  ));
}

export function CompanyFinanceCard({ record }) {
  const periodLabels = record.finance?.periods?.length
    ? record.finance.periods
    : String(record.finance?.periodLabel ?? '').split('/').map((label) => label.trim()).filter(Boolean);
  const compactLabels = periodLabels.map(compactPeriodLabel);
  const revenue = record.finance?.series?.revenue || [];
  const netProfit = record.finance?.series?.netProfit || [];
  const margin = buildMarginSeries(record);
  const revenueDisplay = buildDisplaySeries(record, 'revenue', formatNumber);
  const profitDisplay = buildDisplaySeries(record, 'netProfit', formatNumber);
  const marginDisplay = buildDisplaySeries(
    {
      finance: {
        series: { grossMargin: margin },
        display: record.finance?.display,
      },
    },
    'grossMargin',
    formatPercent
  );
  const peDisplay = buildDisplaySeries(record, 'forwardPE', formatMultiple);
  const growthChips = buildGrowthChips(compactLabels, revenue);
  const profile = record.companyProfile || {};
  const topSubline = [marketLabel(record.market), profile.ticker ? `$${profile.ticker}` : null, profile.fiscalYearEnd ? `FY end ${profile.fiscalYearEnd}` : null]
    .filter(Boolean)
    .join(' · ');
  const tags = buildStatusTags(record);

  return (
    <article className={`deep-company-card market-${record.market || 'global'}`} data-market={record.market || 'global'}>
      <div className="deep-card-top">
        <div>
          <div className="deep-name">{record.companyName}</div>
          <div className="deep-sub">{topSubline}</div>
        </div>
        {profile.badge ? <span className="cap-pill">{profile.badge}</span> : null}
      </div>

      {profile.business ? <div className="deep-summary">{profile.business}</div> : null}

      {tags.length ? (
        <div className="deep-tags">
          {tags.map((tag) => (
            <span key={`${record.id}-${tag}`} className="deep-tag">{tag}</span>
          ))}
        </div>
      ) : null}

      <div className="company-finance">
        <div className="finance-topline">
          <span className="finance-chip">{record.finance.periodLabel}</span>
          <span className="finance-chip soft">单位 {record.finance.unit}</span>
          {growthChips.map((chip) => (
            <span key={`${record.id}-${chip}`} className="finance-chip">{chip}</span>
          ))}
        </div>

        <div className="finance-panel-grid">
          <section className="finance-series-card">
            <div className="finance-series-head">
              <strong>营收趋势</strong>
              <span>{record.finance.unit}</span>
            </div>
            <div className="finance-series-chart">
              <FinanceSeriesRows labels={compactLabels} values={revenue} displayValues={revenueDisplay} />
            </div>
          </section>

          <section className="finance-series-card">
            <div className="finance-series-head">
              <strong>净利润趋势</strong>
              <span>{record.finance.unit}</span>
            </div>
            <div className="finance-series-chart">
              <FinanceSeriesRows labels={compactLabels} values={netProfit} displayValues={profitDisplay} fillClass="profit" />
            </div>
          </section>
        </div>

        <div className="finance-summary-grid">
          <section className="finance-summary-card">
            <div className="finance-summary-head"><strong>营收</strong><span>{record.finance.unit}</span></div>
            <div className="finance-pair-list">
              <FinancePairRows labels={compactLabels} displayValues={revenueDisplay} />
            </div>
            <span className="finance-pair-sub">共享 jsonl 口径，后续可以直接跨页面复用。</span>
          </section>

          <section className="finance-summary-card">
            <div className="finance-summary-head"><strong>净利润</strong><span>{record.finance.unit}</span></div>
            <div className="finance-pair-list">
              <FinancePairRows labels={compactLabels} displayValues={profitDisplay} />
            </div>
            <span className="finance-pair-sub">利润优先写 net income；若只能拿到 EPS / EBT，会在卡片里单独标明。</span>
          </section>

          <section className="finance-summary-card">
            <div className="finance-summary-head"><strong>毛利率</strong><span>Margin</span></div>
            <div className="finance-pair-list">
              <FinancePairRows labels={compactLabels} displayValues={marginDisplay} />
            </div>
            <span className="finance-pair-sub">前瞻毛利率公开可得性很差，绝大多数公司只给历史整体毛利率。</span>
          </section>

          <section className="finance-summary-card">
            <div className="finance-summary-head"><strong>估值</strong><span>Forward PE</span></div>
            <div className="finance-pair-list">
              <FinancePairRows labels={compactLabels} displayValues={peDisplay} />
            </div>
            <span className="finance-pair-sub">这一轮先补财务与基本面，估值列暂只保留共享字段位。</span>
          </section>
        </div>

        <div className="finance-note">{record.finance.note || '暂无补充说明。'}</div>
      </div>

      {profile.detailBullets?.length ? (
        <section className="company-fundamentals">
          <div className="company-fundamentals-head">
            <strong>分部 / 口径补充</strong>
            <span>{profile.layerTitle}</span>
          </div>
          <div className="company-fundamentals-list">
            {profile.detailBullets.map((item) => (
              <div key={`${record.id}-${item}`} className="company-fundamentals-item">{item}</div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
