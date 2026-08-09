// Hand-rolled SVG chart kit.
//
// WHY NOT A LIBRARY. This page is native ES modules served straight from public/ inside an
// iframe — node_modules is unreachable, so Recharts (which the React reports use) is not an
// option. Plotly via CDN was considered and rejected: its responsive layout is asynchronous,
// so it relayouts AFTER notifyParentHeight() has measured and posted, and the parent frame
// visibly jitters on every view switch. ~40 lines of scale code costs less than that.
//
// THE ONE RULE THAT SHAPES EVERYTHING HERE: never measure the container.
//
// Charts live inside view panels that are `hidden` until their tab is opened, where every
// element measures 0 wide. Worse, #app carries a ResizeObserver that posts a new iframe
// height to the parent on every layout change — so a chart whose height derived from its
// measured width would feed its own resize back through the parent and oscillate. Every
// chart here is therefore authored in a FIXED viewBox whose height is a pure function of
// the row count, and scaled by CSS alone. Nothing calls getBoundingClientRect.
//
// The corollary, inherited from components/metric.js: an empty chart occupies the SAME box
// as a populated one. Collapsing it would change the page height when data is missing,
// which both disturbs the height contract and reads as "there was nothing to say here".

import { escapeHtml, escapeRaw } from '../components/escape.js';
import { renderProvenanceFooter, renderFreshnessChip } from '../components/metric.js';

/**
 * Chart geometry, in viewBox units. Width is fixed; height is computed per chart.
 * `left` is generous because the row labels are Chinese project / company names.
 */
export const GEOM = {
  w: 960,
  rowH: 34,
  pad: { top: 20, right: 104, bottom: 42, left: 168 },
};

/** Height of a horizontal-bar chart with `rowCount` rows. Pure arithmetic, never measured. */
export function hbarHeight(rowCount) {
  return GEOM.pad.top + Math.max(rowCount, 1) * GEOM.rowH + GEOM.pad.bottom;
}

/** Height of an x/y chart. Fixed, so the empty state can match it exactly. */
export const XY_HEIGHT = 420;

// ---------------------------------------------------------------------------- scales

/**
 * Continuous scale. Returns a mapping function carrying `.ticks(n)`.
 * Deliberately minimal — no clamping, no nice-domain by default; callers pass the domain
 * they actually want so a bar can never silently exceed its axis.
 */
export function scaleLinear({ domain, range }) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = (d1 - d0) || 1;

  const fn = (value) => r0 + ((Number(value) - d0) / span) * (r1 - r0);
  fn.domain = domain;
  fn.range = range;
  fn.ticks = (count = 5) => niceTicks(d0, d1, count);
  return fn;
}

/** Discrete scale over `domain` entries, evenly spaced with proportional padding. */
export function scaleBand({ domain, range, padding = 0.25 }) {
  const [r0, r1] = range;
  const n = domain.length || 1;
  const step = (r1 - r0) / n;
  const bandwidth = step * (1 - padding);

  const fn = (value) => {
    const i = domain.indexOf(value);
    return i < 0 ? null : r0 + (i * step) + ((step - bandwidth) / 2);
  };
  fn.bandwidth = () => bandwidth;
  fn.step = () => step;
  fn.domain = domain;
  return fn;
}

/** 1 / 2 / 5 × 10^k tick steps — the standard "round numbers a reader expects" set. */
function niceTicks(min, max, count) {
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
  const raw = (max - min) / Math.max(count, 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;

  const out = [];
  for (let t = Math.ceil(min / step) * step; t <= max + step * 1e-9; t += step) {
    out.push(Number(t.toFixed(10)));
  }
  return out;
}

// ---------------------------------------------------------------------------- axes

/** Vertical grid lines + bottom tick labels, for horizontal-bar charts. */
export function gridX({ scale, y0, y1, count = 5, format = fmt.num }) {
  return scale.ticks(count).map((t) => `
    <line class="chart-grid" x1="${scale(t)}" x2="${scale(t)}" y1="${y0}" y2="${y1}" />
    <text class="chart-tick" x="${scale(t)}" y="${y1 + 22}" text-anchor="middle">${escapeRaw(format(t))}</text>`
  ).join('');
}

/** Bottom axis for x/y charts (categorical or continuous). */
export function ticksBottom({ scale, y, values, format = fmt.num, anchor = 'middle' }) {
  const list = values || scale.ticks?.() || scale.domain || [];
  return list.map((v) => {
    const x = scale(v) + (scale.bandwidth ? scale.bandwidth() / 2 : 0);
    return `<text class="chart-tick" x="${x}" y="${y}" text-anchor="${anchor}">${escapeRaw(format(v))}</text>`;
  }).join('');
}

/** Left axis with horizontal grid lines, for x/y charts. */
export function ticksLeft({ scale, x, x1, count = 5, format = fmt.num }) {
  return scale.ticks(count).map((t) => `
    <line class="chart-grid" x1="${x}" x2="${x1}" y1="${scale(t)}" y2="${scale(t)}" />
    <text class="chart-tick" x="${x - 10}" y="${scale(t) + 4}" text-anchor="end">${escapeRaw(format(t))}</text>`
  ).join('');
}

/** Row label at the left of a horizontal bar. */
export function rowLabel({ text, y, title }) {
  return `<text class="chart-rowlabel" x="${GEOM.pad.left - 12}" y="${y}" text-anchor="end"
    >${escapeRaw(truncate(text, 14))}<title>${escapeRaw(title || text)}</title></text>`;
}

function truncate(text, max) {
  const s = String(text ?? '');
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

// ---------------------------------------------------------------------------- formatting

export const fmt = {
  num: (v) => Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 2 }),
  int: (v) => Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 0 }),
  kta: (v) => `${Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 1 })}`,
  pct: (v) => `${Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}%`,
  wan: (v) => `${(Number(v) / 10000).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`,
  signed: (v) => (Number(v) > 0 ? '+' : '') + Number(v).toLocaleString('zh-CN', { maximumFractionDigits: 0 }),
};

/**
 * Direction glyph. This is the PRIMARY encoding of direction, not decoration — the house
 * rule is that colour is secondary, so every coloured mark carries a glyph and a number
 * that survive greyscale printing and all three forms of colour-vision deficiency.
 */
export function glyph(value, { high = 0, low = 0 } = {}) {
  if (!Number.isFinite(value)) return '';
  if (value > high) return '▲';
  if (value < low) return '▼';
  return '▬';
}

// ---------------------------------------------------------------------------- frames

/**
 * The only way a chart reaches the screen.
 *
 * @param {object}   spec
 * @param {string}   spec.id         stable DOM id suffix
 * @param {string}   spec.kicker     section eyebrow
 * @param {string}   spec.title      chart title
 * @param {string}  [spec.note]      one-line reading instruction / caveat
 * @param {number}   spec.height     viewBox height — MUST equal the empty state's
 * @param {string}   spec.svgBody    the chart's own SVG markup
 * @param {object}   spec.envelope   Metric/SeriesEnvelope supplying unit + provenance
 * @param {string}   spec.reference  market.meta.asOf, for the freshness chip
 * @param {string}   spec.a11yLabel  short description for screen readers
 * @param {string}  [spec.table]     visually-hidden data table (see a11yTable)
 * @param {boolean} [spec.scroll]    wrap the plot in a horizontal scroller (x/y charts,
 *                                   which cannot compress below ~720px and would be
 *                                   CLIPPED by the iframe's scrolling="no")
 */
export function chartFrame(spec) {
  const {
    id, kicker, title, note, height, svgBody, envelope,
    reference, a11yLabel, table = '', scroll = false,
  } = spec;

  return `
    <figure class="chart" id="chart-${escapeRaw(id)}">
      <figcaption class="chart-head">
        ${kicker ? `<div class="section-kicker">${escapeHtml(kicker)}</div>` : ''}
        <div class="chart-titlebar">
          <h3 class="chart-title">${escapeHtml(title)}</h3>
          <div class="metric-chips">
            <span class="chart-unit">${escapeHtml(envelope.unit)}</span>
            ${renderFreshnessChip(envelope, reference)}
          </div>
        </div>
        ${note ? `<p class="chart-note">${escapeHtml(note)}</p>` : ''}
      </figcaption>

      <div class="${scroll ? 'chart-scroll' : 'chart-plot'}">
        <svg class="chart-svg" viewBox="0 0 ${GEOM.w} ${height}"
             preserveAspectRatio="xMidYMid meet"
             role="img" aria-label="${escapeRaw(a11yLabel)}">
          ${svgBody}
        </svg>
      </div>
      ${scroll ? '<p class="table-scroll-hint">横向滑动查看完整曲线</p>' : ''}

      ${renderProvenanceFooter(envelope, true)}
      ${table}
    </figure>`;
}

/**
 * A chart we cannot draw, occupying the identical box.
 *
 * Takes a data/gaps.js entry, so the reason shown here and the reason listed in the method
 * view's register are the same string — they cannot drift apart, and deleting the gap
 * entry when the data arrives removes both.
 */
export function chartEmpty({ id, kicker, height, gap }) {
  const tone = gap.kind === 'undisclosed' ? 'is-undisclosed' : 'is-gap';
  const label = gap.kind === 'undisclosed' ? '未披露' : '数据缺口';

  return `
    <figure class="chart chart-is-empty ${tone}" id="chart-${escapeRaw(id)}">
      <figcaption class="chart-head">
        ${kicker ? `<div class="section-kicker">${escapeHtml(kicker)}</div>` : ''}
        <div class="chart-titlebar">
          <h3 class="chart-title">${escapeHtml(gap.title)}</h3>
          <span class="empty-state-tag">${label}</span>
        </div>
      </figcaption>

      <div class="chart-plot chart-plot-empty" style="--chart-empty-h:${height}px">
        <div class="empty-state-hatch" aria-hidden="true"></div>
        <div class="chart-empty-body">
          <p class="empty-state-why">${escapeHtml(gap.why)}</p>
          ${gap.needs ? `<p class="empty-state-needs"><b>补齐需要：</b>${escapeHtml(gap.needs)}</p>` : ''}
        </div>
      </div>
    </figure>`;
}

/**
 * Visually-hidden table mirroring the chart's data.
 *
 * A `role="img"` with an aria-label tells a screen-reader user WHAT the chart is; it does
 * not give them the numbers. Sighted readers can read values off the bars, so anything
 * less than the full table is a smaller chart for those users, not an equivalent one.
 */
export function a11yTable({ caption, head, rows }) {
  return `
    <table class="chart-a11y">
      <caption>${escapeHtml(caption)}</caption>
      <thead><tr>${head.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map((r) => `<tr>${r.map((c, i) => (
          i === 0 ? `<th scope="row">${escapeHtml(c)}</th>` : `<td>${escapeHtml(c)}</td>`
        )).join('')}</tr>`).join('')}
      </tbody>
    </table>`;
}

/** Legend row matching the page's existing `.legend` idiom, for multi-series charts. */
export function chartLegend(items) {
  return `<div class="chart-legend">${items.map((it) => `
    <span class="chart-legend-item">
      <span class="chart-swatch" style="background:${escapeRaw(it.color)}"
            ${it.hatch ? 'data-hatch="1"' : ''} aria-hidden="true"></span>
      ${escapeHtml(it.label)}
    </span>`).join('')}</div>`;
}
