import { getFinancePeriodLabels } from './company-financials.js';

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function calcPct(a, b) {
  if (!isFiniteNumber(a) || !isFiniteNumber(b) || a === 0) {
    return null;
  }

  return ((b - a) / a) * 100;
}

function formatNumber(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  let maxDigits = 2;

  if (Math.abs(value - Math.round(value)) < 0.005) {
    maxDigits = 0;
  } else if (Math.abs(value * 10 - Math.round(value * 10)) < 0.05) {
    maxDigits = 1;
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
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

function renderPairRows(entries) {
  return entries.map((entry) => `
    <div class="finance-pair-row">
      <span class="finance-pair-label">${entry.label}</span>
      <span class="finance-pair-value">${entry.value}</span>
    </div>
  `).join('');
}

function renderSeriesRows(labels, values, displayValues, fillClass = '') {
  const numericValues = values.map((value) => (isFiniteNumber(value) ? Math.abs(value) : 0));
  const maxValue = Math.max(...numericValues, 0) || 1;

  return labels.map((label, index) => `
    <div class="finance-series-row">
      <span class="finance-series-label">${label}</span>
      <div class="finance-series-track">
        <div
          class="finance-series-fill ${fillClass}"
          style="width:${((isFiniteNumber(values[index]) ? Math.abs(values[index]) : 0) / maxValue) * 100}%;"
        ></div>
      </div>
      <span class="finance-series-value">${displayValues[index]}</span>
    </div>
  `).join('');
}

function buildDisplaySeries(record, key, formatter) {
  const rawSeries = record?.finance?.series?.[key] || [];
  const displaySeries = record?.finance?.display?.[key];

  return rawSeries.map((value, index) => displaySeries?.[index] || formatter(value));
}

function buildMarginSeries(record) {
  const revenue = record?.finance?.series?.revenue || [];
  const profit = record?.finance?.series?.netProfit || [];
  const explicitMargins = record?.finance?.series?.grossMargin || [];

  if (explicitMargins.some((value) => isFiniteNumber(value))) {
    return explicitMargins;
  }

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

function renderFinanceBlock(record) {
  if (!record?.finance) {
    return '';
  }

  const periodLabels = getFinancePeriodLabels(record);
  const compactLabels = periodLabels.map(compactPeriodLabel);
  const revenue = record.finance.series?.revenue || [];
  const netProfit = record.finance.series?.netProfit || [];
  const margin = buildMarginSeries(record);
  const forwardPE = record.finance.series?.forwardPE || [];

  const revenueDisplay = buildDisplaySeries(record, 'revenue', formatNumber);
  const profitDisplay = buildDisplaySeries(record, 'netProfit', formatNumber);
  const marginDisplay = buildDisplaySeries(
    {
      finance: {
        series: { grossMargin: margin },
        display: record.finance.display,
      },
    },
    'grossMargin',
    formatPercent
  );
  const peDisplay = buildDisplaySeries(record, 'forwardPE', formatMultiple);
  const growthChips = buildGrowthChips(compactLabels, revenue);

  return `
    <div class="company-finance">
      <div class="finance-topline">
        <span class="finance-chip">${record.finance.periodLabel}</span>
        <span class="finance-chip soft">单位 ${record.finance.unit}</span>
        ${growthChips.map((chip) => `<span class="finance-chip">${chip}</span>`).join('')}
      </div>
      <div class="finance-panel-grid">
        <section class="finance-series-card">
          <div class="finance-series-head">
            <strong>营收趋势</strong>
            <span>${record.finance.unit}</span>
          </div>
          <div class="finance-series-chart">
            ${renderSeriesRows(compactLabels, revenue, revenueDisplay)}
          </div>
        </section>
        <section class="finance-series-card">
          <div class="finance-series-head">
            <strong>净利润趋势</strong>
            <span>${record.finance.unit}</span>
          </div>
          <div class="finance-series-chart">
            ${renderSeriesRows(compactLabels, netProfit, profitDisplay, 'profit')}
          </div>
        </section>
      </div>
      <div class="finance-summary-grid">
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>营收</strong><span>${record.finance.unit}</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: revenueDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">统一走共享 jsonl 数据源，方便跨报告引用。</span>
        </section>
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>净利润</strong><span>${record.finance.unit}</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: profitDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">不同页面都可复用同一企业财务快照。</span>
        </section>
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>净利率 / 毛利率</strong><span>Margin</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: marginDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">优先展示显式毛利率，否则回退到净利率近似。</span>
        </section>
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>估值</strong><span>Forward PE</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: peDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">${record.finance.flags?.pe26Approx ? '末期估值含近似口径，请结合注释阅读。' : '按当前记录的公开估值口径展示。'}</span>
        </section>
      </div>
      <div class="finance-note">${record.finance.note || '暂无补充说明。'}</div>
    </div>
  `;
}

function renderSegmentExposure(company) {
  const exposure = company.segmentExposure;

  if (!exposure) {
    return '';
  }

  return `
    <section class="company-exposure">
      <div class="company-exposure-head">
        <strong>${exposure.title}</strong>
        ${exposure.source ? `<span>${exposure.source}</span>` : ''}
      </div>
      ${exposure.badges?.length ? `
        <div class="company-exposure-badges">
          ${exposure.badges.map((badge) => `<span class="finance-chip soft">${badge}</span>`).join('')}
        </div>
      ` : ''}
      <div class="company-exposure-role">${exposure.role}</div>
      <div class="company-exposure-grid">
        <article class="company-exposure-card">
          <span class="company-exposure-label">${exposure.revenueShare.label}</span>
          <strong class="company-exposure-value">${exposure.revenueShare.value}</strong>
          ${exposure.revenueShare.note ? `<span class="company-exposure-note">${exposure.revenueShare.note}</span>` : ''}
        </article>
        <article class="company-exposure-card">
          <span class="company-exposure-label">${exposure.profitShare.label}</span>
          <strong class="company-exposure-value">${exposure.profitShare.value}</strong>
          ${exposure.profitShare.note ? `<span class="company-exposure-note">${exposure.profitShare.note}</span>` : ''}
        </article>
      </div>
      ${exposure.note ? `<div class="company-exposure-foot">${exposure.note}</div>` : ''}
    </section>
  `;
}

export function renderCompanyCardSnippet({ company, financeRecord, marketLabel }) {
  const tags = company.tags?.length
    ? `<div class="deep-tags">${company.tags.map((tag) => `<span class="deep-tag">${tag}</span>`).join('')}</div>`
    : '';

  return `
    <article class="deep-company-card market-${company.market}" data-market="${company.market}">
      <div class="deep-card-top">
        <div>
          <div class="deep-name">${company.name}</div>
          <div class="deep-sub">${marketLabel || ''}</div>
        </div>
        ${company.cap ? `<span class="cap-pill">${company.cap}</span>` : ''}
      </div>
      ${company.summary ? `<div class="deep-summary">${company.summary}</div>` : ''}
      ${tags}
      ${company.note ? `<div class="deep-note">${company.note}</div>` : ''}
      ${renderSegmentExposure(company)}
      ${renderFinanceBlock(financeRecord)}
    </article>
  `;
}
