// The Metric envelope: the contract every displayed number on this page must satisfy.
//
// Pure data/logic — imported by the browser (components/metric.js) AND by
// scripts/check-lithium-consistency.mjs, so a malformed envelope fails the build rather
// than rendering as a confident-looking number with no provenance.
//
// ---------------------------------------------------------------------------------------
// WHY AN ENVELOPE INSTEAD OF A BARE NUMBER
// ---------------------------------------------------------------------------------------
// "14.3" is not a fact. "电池级碳酸锂现货 14.3 万元/吨，含税出厂口径，生意社，2026-07-27"
// is. The page previously carried the first kind inside prose bullets, which meant a reader
// could not tell a spot quote from a broker forecast from our own arithmetic, and a number
// six months stale looked exactly like one from this morning.
//
// Rendering goes through components/metric.js and nowhere else, so provenance cannot be
// dropped by forgetting to write it — there is no code path that renders a value without
// its source.
//
// `value: null` is a first-class state, not an error: it means the number could not be
// sourced. It renders as 未披露 / 数据缺口 (see data/gaps.js) instead of being estimated.

/** How the number came to exist. Drives the badge and the freshness thresholds. */
export const METRIC_KINDS = {
  observed: '观测值',          // a quoted / published number
  company_guidance: '公司指引',
  consensus: '卖方一致预期',
  own_calc: '自行测算',        // OUR arithmetic — never presented as someone else's number
  assumption: '假设',
};

/** Who published it. */
export const SOURCE_KINDS = {
  exchange: '交易所',
  broker: '券商',
  company: '公司披露',
  gov: '政府 / 监管',
  press: '资讯商',
  internal: '本报告',
};

export const CONFIDENCE_LABELS = { high: '高', medium: '中', low: '低' };

/**
 * Freshness thresholds in days, by series type.
 *
 * A spot price from three weeks ago is stale; a 2027 earnings consensus from three weeks
 * ago is current. One global threshold would have to be wrong for one of them, so the
 * window is a property of what is being measured.
 */
export const FRESHNESS_THRESHOLDS = {
  price: { fresh: 7, aging: 30 },        // spot / futures / concentrate
  inventory: { fresh: 14, aging: 45 },   // weekly series
  demand: { fresh: 45, aging: 120 },     // monthly schedules
  forecast: { fresh: 90, aging: 180 },   // sell-side estimates
  fact: { fresh: 180, aging: 365 },      // project / policy facts
};

export const FRESHNESS_LABELS = { fresh: '最新', aging: '偏旧', stale: '过期' };

const DAY_MS = 86400000;

/**
 * Days between two YYYY-MM-DD strings. Date-only arithmetic on purpose — these are
 * publication dates, not timestamps, and dragging a timezone into it would make the same
 * data classify differently depending on where the build ran.
 */
export function daysBetween(fromIso, toIso) {
  const a = Date.parse(`${fromIso}T00:00:00Z`);
  const b = Date.parse(`${toIso}T00:00:00Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.round((b - a) / DAY_MS);
}

/**
 * Classify a metric's age against the date the REPORT's data was assembled — not against
 * the reader's clock.
 *
 * Using `Date.now()` here would mean the same deployed page tells two readers different
 * things, and every number would drift to "stale" simply because nobody visited for a
 * month. Anchoring to `referenceIso` (the market file's own asOf) makes the badge answer a
 * stable question instead: *within this update, which numbers are older than the update?*
 * That is what catches an April consensus riding along in a July refresh.
 */
export function classifyFreshness(asOf, referenceIso, series = 'fact') {
  const t = FRESHNESS_THRESHOLDS[series] || FRESHNESS_THRESHOLDS.fact;
  const age = daysBetween(asOf, referenceIso);
  if (age === null) return 'stale';
  if (age <= t.fresh) return 'fresh';
  if (age <= t.aging) return 'aging';
  return 'stale';
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validate one envelope. Returns a list of problems (empty = valid).
 * Used by the build check; the runtime renders defensively rather than throwing.
 */
export function validateMetric(metric, path = 'metric') {
  const problems = [];
  const bad = (msg) => problems.push(`${path}: ${msg}`);

  if (!metric || typeof metric !== 'object') {
    bad('is not an object');
    return problems;
  }
  if (!metric.label) bad('missing label');
  if (!('value' in metric)) bad('missing value (use null for 未披露 — absent is not the same as unknown)');
  if (!ISO_DATE.test(metric.asOf || '')) bad(`asOf "${metric.asOf}" is not YYYY-MM-DD`);
  if (!metric.basis) bad('missing basis — a number without a 口径 is not comparable to anything');
  if (!metric.unit) bad('missing unit');
  if (!FRESHNESS_THRESHOLDS[metric.series]) bad(`series "${metric.series}" not one of: ${Object.keys(FRESHNESS_THRESHOLDS).join(' | ')}`);

  const hasValue = metric.value !== null && metric.value !== undefined;

  if (hasValue) {
    // kind / source / confidence are properties OF A NUMBER. They are required when there
    // is one and must be absent when there is not — attaching "观测值 · 置信度 低" to a
    // blank tile describes a reading that was never taken.
    if (!METRIC_KINDS[metric.kind]) bad(`kind "${metric.kind}" not one of: ${Object.keys(METRIC_KINDS).join(' | ')}`);
    if (!CONFIDENCE_LABELS[metric.confidence]) bad(`confidence "${metric.confidence}" not one of: high | medium | low`);

    const src = metric.source;
    if (!src || typeof src !== 'object') {
      bad('missing source');
    } else {
      if (!src.label) bad('source.label missing');
      if (!SOURCE_KINDS[src.kind]) bad(`source.kind "${src.kind}" not one of: ${Object.keys(SOURCE_KINDS).join(' | ')}`);
    }
  } else {
    // A null value is legitimate, but only with a stated reason — otherwise it is
    // indistinguishable from a number someone forgot to fill in.
    if (!metric.note) bad('value is null but no note explains why (未披露 vs 数据缺口)');
    else if (!/^(未披露|数据缺口)/.test(metric.note)) {
      bad('a null metric\'s note must start with 未披露 (nobody publishes it) or '
        + '数据缺口 (we should have it) — the two mean different things to a reader');
    }
    if (metric.source) bad('null metric must not carry a source — there is nothing sourced');
    if (metric.kind) bad('null metric must not carry a kind — there is no number to classify');
    if (metric.confidence) bad('null metric must not carry a confidence');
  }

  return problems;
}
