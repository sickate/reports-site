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
import { escapeHtml as escape } from './escape.js';

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
 * The provenance footer, exported so the chart kit renders the SAME one.
 *
 * A chart is a second surface that puts sourced numbers on screen, so it needs the same
 * 口径 / as-of / 来源 / 置信度 line. Exporting it — rather than letting charts/kit.js
 * reproduce the markup — is what keeps the "one renderer" property in this file true
 * rather than merely nominal: there is still exactly one implementation of how provenance
 * reaches the reader, and a change to it cannot leave charts behind.
 *
 * @param {object} envelope  a Metric or SeriesEnvelope — both carry asOf/basis/source/
 *   kind/confidence/unit with identical meaning; only the payload differs.
 * @param {boolean} hasValue  whether the payload exists. A null payload gets 口径 only,
 *   because kind/source/confidence are properties of a number that was never taken.
 */
export function renderProvenanceFooter(envelope, hasValue = true) {
  const sourceLabel = escape(envelope.source?.label);
  const sourceText = envelope.source?.url
    ? `<a href="${escape(envelope.source.url)}" target="_blank" rel="noopener noreferrer">${sourceLabel}</a>`
    : sourceLabel;

  return `
      <footer class="metric-foot">
        <div class="metric-basis"><b>口径</b> ${escape(envelope.basis)}${
          hasValue ? '' : `（${escape(envelope.unit)}）`
        }</div>
        ${hasValue ? `
          <div class="metric-prov">
            <span>${escape(envelope.asOf)}</span>
            <span class="metric-dot" aria-hidden="true">·</span>
            <span>${sourceText}</span>
            <span class="metric-dot" aria-hidden="true">·</span>
            <span>${escape(SOURCE_KINDS[envelope.source?.kind] || envelope.source?.kind)}</span>
            <span class="metric-dot" aria-hidden="true">·</span>
            <span>置信度 ${escape(CONFIDENCE_LABELS[envelope.confidence] || envelope.confidence)}</span>
          </div>` : ''}
      </footer>`;
}

/**
 * The freshness chip, exported for the same reason as the footer.
 *
 * Renders nothing when the data IS fresh — a row of 「最新」 badges is visual noise that
 * trains the reader to ignore the one badge that matters.
 */
export function renderFreshnessChip(envelope, reference) {
  const freshness = classifyFreshness(envelope.asOf, reference, envelope.series);
  if (freshness === 'fresh') return '';
  const age = daysBetween(envelope.asOf, reference);
  return `<span class="metric-chip metric-fresh-${freshness}"
          title="${escape(envelope.asOf)} 距本次数据整理 ${age} 天">${FRESHNESS_LABELS[freshness]}</span>`;
}

/**
 * @param {object} metric   a Metric envelope (see data/market-schema.js)
 * @param {string} reference  the date freshness is measured against — the market file's
 *   own asOf, NOT the reader's clock. See classifyFreshness for why.
 */
export function renderMetric(metric, reference) {
  const hasValue = metric.value !== null && metric.value !== undefined;

  // A metric with no value has no age worth reporting either.
  const freshnessChip = hasValue ? renderFreshnessChip(metric, reference) : '';

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
${renderProvenanceFooter(metric, hasValue)}
    </article>`;
}

export function renderMetricGrid(metrics, reference) {
  return `<div class="metric-grid">${metrics.map((m) => renderMetric(m, reference)).join('')}</div>`;
}
