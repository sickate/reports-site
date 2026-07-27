// The ONLY place a Metric envelope is turned into markup.
//
// That exclusivity is the point. Provenance is not something a renderer can forget to
// include, because there is no other renderer — a number reaches the screen with its
// as-of, 口径 and source attached or it does not reach the screen at all.
//
// The contract itself (fields, kinds, freshness thresholds) lives in
// ../data/market-schema.js so the Node build check validates the same rules.

import {
  METRIC_KINDS, SOURCE_KINDS, CONFIDENCE_LABELS, FRESHNESS_LABELS,
  classifyFreshness, daysBetween,
} from '../data/market-schema.js';

function escape(value) {
  if (value === null || value === undefined || value === '') return '—';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Thousands separators, but never invented precision: the stored value is shown as-is. */
function formatValue(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return escape(value);
  return value.toLocaleString('zh-CN', { maximumFractionDigits: 4 });
}

/**
 * A missing number is rendered at FULL tile height with its reason, not collapsed to a
 * dash. Collapsing would make the grid shorter when data is missing, which reads as
 * "there was nothing to say here" — the opposite of the truth, and it would also change
 * the page height and disturb the iframe height contract.
 */
function renderNullBody(metric) {
  const isUndisclosed = /未披露/.test(metric.note || '');
  const tag = isUndisclosed ? '未披露' : '数据缺口';
  const tone = isUndisclosed ? 'is-undisclosed' : 'is-gap';

  return `
    <div class="metric-null ${tone}">
      <span class="metric-null-tag">${tag}</span>
      <p class="metric-null-why">${escape((metric.note || '').replace(/^(未披露|数据缺口)[：:]\s*/, ''))}</p>
    </div>`;
}

/**
 * @param {object} metric   a Metric envelope (see data/market-schema.js)
 * @param {string} reference  the date freshness is measured against — the market file's
 *   own asOf, NOT the reader's clock. See classifyFreshness for why.
 */
export function renderMetric(metric, reference) {
  const freshness = classifyFreshness(metric.asOf, reference, metric.series);
  const age = daysBetween(metric.asOf, reference);
  const hasValue = metric.value !== null && metric.value !== undefined;

  const sourceLabel = escape(metric.source?.label);
  const sourceText = metric.source?.url
    ? `<a href="${escape(metric.source.url)}" target="_blank" rel="noopener noreferrer">${sourceLabel}</a>`
    : sourceLabel;

  // The freshness chip is only worth showing when it is NOT fresh: a row of "最新" badges
  // is visual noise that trains the reader to ignore the one badge that matters.
  // A metric with no value has no age worth reporting either.
  const freshnessChip = (!hasValue || freshness === 'fresh') ? '' : `
    <span class="metric-chip metric-fresh-${freshness}"
          title="${escape(metric.asOf)} 距本次数据整理 ${age} 天">${FRESHNESS_LABELS[freshness]}</span>`;

  // `kind`, `source` and `confidence` describe a number. Printing "观测值 · 置信度 低"
  // above a blank tile attaches properties to a value that does not exist, which is worse
  // than saying nothing: it reads as a real reading someone declined to show. For a null,
  // the only honest metadata is the 口径 — what WOULD have been measured.
  const kindChip = hasValue
    ? `<span class="metric-chip metric-kind-${escape(metric.kind)}">${escape(METRIC_KINDS[metric.kind] || metric.kind)}</span>`
    : '';

  return `
    <article class="metric-card" data-metric="${escape(metric.id)}">
      <header class="metric-head">
        <h4 class="metric-label">${escape(metric.label)}</h4>
        <div class="metric-chips">${kindChip}${freshnessChip}</div>
      </header>

      ${hasValue ? `
        <div class="metric-value">
          <span class="metric-number">${formatValue(metric.value)}</span>
          <span class="metric-unit">${escape(metric.unit)}</span>
        </div>` : renderNullBody(metric)}

      ${hasValue && metric.note ? `<p class="metric-note">${escape(metric.note)}</p>` : ''}

      <footer class="metric-foot">
        <div class="metric-basis"><b>口径</b> ${escape(metric.basis)}${
          hasValue ? '' : `（${escape(metric.unit)}）`
        }</div>
        ${hasValue ? `
          <div class="metric-prov">
            <span>${escape(metric.asOf)}</span>
            <span class="metric-dot" aria-hidden="true">·</span>
            <span>${sourceText}</span>
            <span class="metric-dot" aria-hidden="true">·</span>
            <span>${escape(SOURCE_KINDS[metric.source?.kind] || metric.source?.kind)}</span>
            <span class="metric-dot" aria-hidden="true">·</span>
            <span>置信度 ${escape(CONFIDENCE_LABELS[metric.confidence] || metric.confidence)}</span>
          </div>` : ''}
      </footer>
    </article>`;
}

export function renderMetricGrid(metrics, reference) {
  return `<div class="metric-grid">${metrics.map((m) => renderMetric(m, reference)).join('')}</div>`;
}
