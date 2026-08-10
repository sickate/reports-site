// 26H1 实绩 vs FY26E 一致预期覆盖率。
//
// This is the chart the company table cannot draw. All ten A-share names have now filed a
// 26H1 preliminary, and for five of them the half-year alone already exceeds 70% of the
// FULL-YEAR April consensus — 天华新能's H1 is 499% of it. In the table that fact is a
// sentence at the end of a long 备注 cell, ranked below a 26E PE column computed from the
// very estimate it invalidates. Plotted against a 100% reference line it is the first thing
// the reader sees, which is the correct priority: those PE readings measure how out-of-date
// the estimate is, not how expensive the stock is.
//
// COVERAGE IS COMPUTED, NOT STORED. market.json holds only the H1 forecast ranges (the
// genuinely new, company-disclosed data); FY26E is read from the company table at runtime.
// Storing the ratio too would create a second copy that drifts the moment a broker revises
// the full-year number — 雅化's 26E has already been revised once (东吴 7/7).

import {
  geom, isNarrow, hbarHeight, scaleLinear, gridX, rowLabel, fmt, marker,
  chartFrame, a11yTable, chartLegend,
} from './kit.js';
import { chartColors } from '../data/palette.js';

/** Above this share of the full-year estimate, the estimate is the thing in question. */
const STALE_THRESHOLD = 70;

/**
 * @param {object} envelope  market.charts.h1Coverage
 * @param {Map<string, number|null>} fy26eByCompany  company name → FY26E 净利（百万元），
 *   null when the sell side publishes no full-year absolute figure.
 * @param {string} reference  market.meta.asOf
 */
export function renderCoverageChart(envelope, fy26eByCompany, reference) {
  const rows = envelope.points.map((pt) => {
    const midYi = (pt.low + pt.high) / 2;              // 亿元
    const fy26e = fy26eByCompany.get(pt.company);       // 百万元
    // null FY26E is a real state (融捷: no full-year consensus published), not a zero.
    const coverage = Number.isFinite(fy26e) && fy26e > 0
      ? (midYi * 100 / fy26e) * 100
      : null;
    return { ...pt, midYi, fy26e, coverage };
  }).sort((a, b) => (b.coverage ?? -1) - (a.coverage ?? -1));

  const narrow = isNarrow();
  const GEOM = geom(narrow);
  const height = hbarHeight(rows.length, GEOM);
  const plotRight = GEOM.w - GEOM.pad.right;

  // Domain is capped at 200% with an explicit overflow marker rather than scaled to 499%:
  // letting one outlier set the axis would squash the other nine into an unreadable stub
  // and hide the 70–130% band where the interesting comparisons actually are.
  const CAP = 200;
  const x = scaleLinear({ domain: [0, CAP], range: [GEOM.pad.left, plotRight] });
  const barH = GEOM.rowH * 0.5;
  const x100 = x(100);

  const bars = rows.map((r, i) => {
    const yTop = GEOM.pad.top + (i * GEOM.rowH) + ((GEOM.rowH - barH) / 2);
    const mid = yTop + (barH / 2);

    if (r.coverage === null) {
      return `
      <g>
        ${rowLabel({ text: r.company, y: mid + 5, title: r.company, g: GEOM })}
        <rect class="chart-bar-track" x="${GEOM.pad.left}" y="${yTop}"
              width="${plotRight - GEOM.pad.left}" height="${barH}" rx="3" />
        <rect x="${GEOM.pad.left}" y="${yTop}" width="${plotRight - GEOM.pad.left}" height="${barH}"
              rx="3" fill="url(#coverage-hatch)" />
        <text class="chart-tick" x="${GEOM.pad.left + 14}" y="${mid + 5}"
          >${narrow ? '无全年一致预期' : `无全年一致预期 · H1 预告 ${fmt.num(r.low)}–${fmt.num(r.high)} 亿`}</text>
      </g>`;
    }

    const over = r.coverage > STALE_THRESHOLD;
    const clipped = Math.min(r.coverage, CAP);
    const xEnd = x(clipped);

    return `
      <g>
        ${rowLabel({ text: r.company, y: mid + 5, title: r.company, g: GEOM })}
        <rect class="chart-bar-track" x="${GEOM.pad.left}" y="${yTop}"
              width="${plotRight - GEOM.pad.left}" height="${barH}" rx="3" />
        <rect x="${GEOM.pad.left}" y="${yTop}" width="${xEnd - GEOM.pad.left}" height="${barH}" rx="3"
              fill="${over ? chartColors.coverageOver : chartColors.coverageNormal}" />
        ${r.coverage > CAP ? `
          <polygon points="${plotRight + 3},${yTop} ${plotRight + 13},${mid} ${plotRight + 3},${yTop + barH}"
                   fill="${chartColors.coverageOver}" />` : ''}
        <text class="chart-value" x="${Math.min(xEnd, plotRight) + (r.coverage > CAP ? 18 : 10)}" y="${mid + 5}"
          ><tspan class="chart-glyph">${marker(over)}</tspan> ${fmt.pct(r.coverage)}</text>
      </g>`;
  }).join('');

  const svgBody = `
    <defs>
      <pattern id="coverage-hatch" width="7" height="7" patternTransform="rotate(45)"
               patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(148,163,184,.30)" stroke-width="2.5" />
      </pattern>
    </defs>
    ${gridX({ scale: x, y0: GEOM.pad.top, y1: height - GEOM.pad.bottom, count: narrow ? 2 : 4, format: fmt.pct })}
    <line class="chart-refline" x1="${x100}" x2="${x100}"
          y1="${GEOM.pad.top - 6}" y2="${height - GEOM.pad.bottom}" />
    <text class="chart-reflabel" x="${x100}" y="${GEOM.pad.top - 10}" text-anchor="middle"
      >全年预期 100%</text>
    ${bars}`;

  const overCount = rows.filter((r) => r.coverage !== null && r.coverage > STALE_THRESHOLD).length;

  const table = a11yTable({
    caption: '26H1 业绩预告中值占 FY26E 一致预期的比例',
    head: ['公司', 'H1 预告区间（亿元）', 'FY26E 一致预期（亿元）', '覆盖率'],
    rows: rows.map((r) => [
      r.company,
      `${fmt.num(r.low)}–${fmt.num(r.high)}`,
      Number.isFinite(r.fy26e) ? fmt.num(r.fy26e / 100) : '无全年一致预期',
      r.coverage === null ? '—' : fmt.pct(r.coverage),
    ]),
  });

  return chartLegend([
    { label: `● 覆盖率 > ${STALE_THRESHOLD}%：4 月一致预期已明显落后`, color: chartColors.coverageOver },
    { label: `○ 覆盖率 ≤ ${STALE_THRESHOLD}%`, color: chartColors.coverageNormal },
    { label: '无全年一致预期', color: 'rgba(148,163,184,.3)', hatch: true },
  ]) + chartFrame({
    id: 'coverage',
    kicker: '预期兑现度',
    title: '26H1 业绩预告已覆盖全年一致预期的比例',
    note: `${overCount} 家公司的半年业绩已超过 4 月全年一致预期的 ${STALE_THRESHOLD}%，`
      + '其中盛新、天华的 H1 单独就超过了全年预期。'
      + '这些公司的 26E PE 读数量的是预期过时的程度，不是估值高低——排序前请先看这张图。'
      + `横轴上限截到 ${CAP}%，超出者用箭头标记并在标签中给出真实数值。`,
    height,
    width: GEOM.w,
    svgBody,
    envelope,
    reference,
    a11yLabel: `横向条形图：10 家 A 股锂业公司 26H1 业绩预告中值占全年一致预期的比例，`
      + `${overCount} 家超过 ${STALE_THRESHOLD}%。完整数值见随后的数据表。`,
    table,
  });
}
