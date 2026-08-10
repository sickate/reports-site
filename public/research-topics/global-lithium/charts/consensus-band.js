// 锂价区间参考 vs 当前现货。
//
// NOT a scenario chart, and the distinction is the point. A bear / base / bull panel needs
// three labelled forecasts; nobody publishes them for lithium (see gaps.priceScenarios).
// Splitting the single consensus mid-range into three tiers would put words in the sell
// side's mouth, so what is drawn is what exists: a few independently-sourced ranges, each
// on its own row with its own attribution, plus today's spot as a reference line.
//
// Rows are NOT merged into one "consensus range". They come from different institutions
// with different bases, and averaging them would manufacture a number none of them stated.

import {
  geom, isNarrow, hbarHeight, scaleLinear, gridX, rowLabel, fmt,
  chartFrame, a11yTable,
} from './kit.js';
import { chartColors } from '../data/palette.js';

export function renderConsensusBandChart(envelope, reference) {
  const bands = envelope.points.filter((p) => p.kind === 'band');
  const spot = envelope.points.find((p) => p.kind === 'spot');

  const narrow = isNarrow();
  const GEOM = geom(narrow);
  const height = hbarHeight(bands.length, GEOM);
  const plotRight = GEOM.w - GEOM.pad.right;

  const lo = Math.min(...envelope.points.map((p) => p.low));
  const hi = Math.max(...envelope.points.map((p) => p.high));
  const pad = (hi - lo) * 0.18 || 1;
  const x = scaleLinear({ domain: [lo - pad, hi + pad], range: [GEOM.pad.left, plotRight] });
  const barH = GEOM.rowH * 0.42;

  const rows = bands.map((b, i) => {
    const yTop = GEOM.pad.top + (i * GEOM.rowH) + ((GEOM.rowH - barH) / 2);
    const mid = yTop + (barH / 2);
    const x0 = x(b.low);
    const x1 = x(b.high);

    return `
      <g>
        ${rowLabel({ text: b.label, y: mid + 5, title: b.label, g: GEOM, max: narrow ? 9 : 14 })}
        <rect x="${x0.toFixed(1)}" y="${yTop}" width="${(x1 - x0).toFixed(1)}" height="${barH}" rx="4"
              fill="${chartColors.coverageNormal}" opacity="0.55" />
        <line class="chart-grid" x1="${x0.toFixed(1)}" x2="${x0.toFixed(1)}"
              y1="${yTop - 3}" y2="${yTop + barH + 3}" stroke="${chartColors.coverageNormal}" />
        <line class="chart-grid" x1="${x1.toFixed(1)}" x2="${x1.toFixed(1)}"
              y1="${yTop - 3}" y2="${yTop + barH + 3}" stroke="${chartColors.coverageNormal}" />
        <text class="chart-value" x="${(x1 + 10).toFixed(1)}" y="${mid + 5}"
          >${fmt.num(b.low)}–${fmt.num(b.high)}</text>
      </g>`;
  }).join('');

  const spotLine = spot ? `
    <line class="chart-refline" x1="${x(spot.low).toFixed(1)}" x2="${x(spot.low).toFixed(1)}"
          y1="${GEOM.pad.top - 8}" y2="${height - GEOM.pad.bottom}"
          stroke="${chartColors.coverageOver}" />
    <text class="chart-reflabel" x="${x(spot.low).toFixed(1)}" y="${GEOM.pad.top - 12}"
          text-anchor="middle" fill="${chartColors.coverageOver}"
      >现货 ${fmt.num(spot.low)}</text>` : '';

  const svgBody = `
    ${gridX({ scale: x, y0: GEOM.pad.top, y1: height - GEOM.pad.bottom, count: narrow ? 3 : 5, format: fmt.num })}
    ${spotLine}
    ${rows}`;

  const table = a11yTable({
    caption: `锂价区间参考与当前现货（${envelope.unit}）`,
    head: ['口径', '下限', '上限'],
    rows: envelope.points.map((p) => [
      p.label,
      fmt.num(p.low),
      p.kind === 'spot' ? '（单点）' : fmt.num(p.high),
    ]),
  });

  const inside = spot ? bands.filter((b) => spot.low >= b.low && spot.low <= b.high).length : 0;

  return chartFrame({
    id: 'consensus-band',
    kicker: '成本与价格',
    title: '锂价区间参考 vs 当前现货',
    note: `当前现货落在 ${inside}/${bands.length} 条区间之内。`
      + '每一行是一个独立机构的口径，没有合并成「一条一致预期区间」——它们的基准不同，'
      + '取平均会造出一个谁都没说过的数字。' + (envelope.note || ''),
    height,
    width: GEOM.w,
    svgBody,
    envelope,
    reference,
    a11yLabel: `区间条形图：${bands.length} 条锂价区间参考与当前电池级现货价 `
      + `${spot ? fmt.num(spot.low) : '—'} ${envelope.unit} 的对比。完整数值见随后的数据表。`,
    table,
  });
}
