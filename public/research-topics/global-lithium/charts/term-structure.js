// 广期所碳酸锂期限结构。
//
// The one x/y chart in the set, because a term structure IS a shape: the reader's question
// is "does the curve slope down", not "what is contract 2703 worth". Backwardation says the
// market prices today's tonne above a future one — a scarcity signal that a table of eleven
// numbers does not deliver at a glance.
//
// It deliberately publishes NO spread number. The cockpit already carries a
// `gfex-term-spread` metric tile, computed over a 12-contract span including LC2707, for
// which no free daily history exists (see scripts/fetch-lithium-series.mjs). Printing a
// spread here too would put two numbers for one idea on one page, differing by exactly the
// contract we cannot retrieve. The tile owns the number; this owns the shape.

import {
  geom, isNarrow, XY_HEIGHT, scaleLinear, scaleBand, ticksBottom, ticksLeft,
  fmt, chartFrame, a11yTable,
} from './kit.js';
import { chartColors } from '../data/palette.js';

export function renderTermStructureChart(envelope, reference) {
  const points = [...envelope.points].sort((a, b) => a.contract.localeCompare(b.contract));
  const narrow = isNarrow();
  const GEOM = geom(narrow);
  const height = narrow ? 340 : XY_HEIGHT;

  const left = narrow ? 56 : 72;
  const right = GEOM.w - 20;
  const top = 26;
  const bottom = height - 52;

  const values = points.map((p) => p.settlement);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Pad the domain rather than zero-basing it: on a curve whose whole story is a 4.8%
  // slope, a zero baseline flattens the line into a horizontal rule and hides the signal.
  // The axis labels carry absolute levels, so there is no false-precision risk.
  const pad = (max - min) * 0.25 || 1000;

  const x = scaleBand({ domain: points.map((p) => p.contract), range: [left, right], padding: 0.1 });
  const y = scaleLinear({ domain: [min - pad, max + pad], range: [bottom, top] });
  const cx = (p) => x(p.contract) + (x.bandwidth() / 2);

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${cx(p).toFixed(1)},${y(p.settlement).toFixed(1)}`).join(' ');
  const area = `${line} L${cx(points[points.length - 1]).toFixed(1)},${bottom} L${cx(points[0]).toFixed(1)},${bottom} Z`;

  const dots = points.map((p, i) => {
    const isEnd = i === 0 || i === points.length - 1;
    return `
      <circle cx="${cx(p).toFixed(1)}" cy="${y(p.settlement).toFixed(1)}" r="${isEnd ? 5 : 3.5}"
              fill="${isEnd ? chartColors.coverageOver : chartColors.capacityNow}" />
      ${isEnd ? `<text class="chart-value" x="${cx(p).toFixed(1)}" y="${(y(p.settlement) - 14).toFixed(1)}"
              text-anchor="${i === 0 ? 'start' : 'end'}">${fmt.int(p.settlement)}</text>` : ''}`;
  }).join('');

  // Show every other contract label on the narrow box; all of them when there is room.
  const labelValues = narrow ? points.filter((_, i) => i % 2 === 0).map((p) => p.contract) : undefined;

  const svgBody = `
    <defs>
      <linearGradient id="ts-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${chartColors.capacityNow}" stop-opacity="0.20" />
        <stop offset="100%" stop-color="${chartColors.capacityNow}" stop-opacity="0.02" />
      </linearGradient>
    </defs>
    ${ticksLeft({ scale: y, x: left, x1: right, count: narrow ? 3 : 5, format: fmt.int })}
    <path d="${area}" fill="url(#ts-fill)" />
    <path class="chart-series-line" d="${line}" stroke="${chartColors.capacityNow}" />
    ${dots}
    ${ticksBottom({ scale: x, y: bottom + 26, values: labelValues, format: (v) => v })}
    <text class="chart-tick" x="${left}" y="${height - 12}" text-anchor="start">近月</text>
    <text class="chart-tick" x="${right}" y="${height - 12}" text-anchor="end">远月</text>`;

  const table = a11yTable({
    caption: `广期所碳酸锂各月合约结算价（${envelope.asOf}）`,
    head: ['合约', '结算价（元/吨）', '收盘价', '持仓量'],
    rows: points.map((p) => [
      p.contract, fmt.int(p.settlement),
      p.close == null ? '—' : fmt.int(p.close),
      p.openInterest == null ? '—' : fmt.int(p.openInterest),
    ]),
  });

  const descending = points[points.length - 1].settlement < points[0].settlement;

  return chartFrame({
    id: 'term-structure',
    kicker: '成本与价格',
    title: '广期所碳酸锂期限结构',
    note: `${descending ? '曲线向下倾斜（backwardation）：市场给今天的一吨定价高于未来的一吨，'
      + '通常是现货偏紧的信号。' : '曲线向上倾斜（contango）：远月溢价，通常对应现货宽松。'}`
      + `${envelope.note || ''}`
      + ' 纵轴按数据范围缩放而非从零起，否则 4.8% 的斜率会被压成一条平线；绝对价位见轴标签。',
    height,
    width: GEOM.w,
    svgBody,
    envelope,
    reference,
    scroll: !narrow,
    a11yLabel: `折线图：广期所碳酸锂 ${points.length} 个月度合约在 ${envelope.asOf} 的结算价，`
      + `从 ${points[0].contract} 的 ${fmt.int(points[0].settlement)} 元/吨`
      + `到 ${points[points.length - 1].contract} 的 ${fmt.int(points[points.length - 1].settlement)} 元/吨。`,
    table,
  });
}
