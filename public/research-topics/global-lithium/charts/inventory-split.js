// 碳酸锂周度库存结构（单周切片）。
//
// This is NOT a time series and the chart says so. The interesting question about inventory
// is usually "which way is it moving", and the honest answer here is that no free source
// publishes weekly history — that gap is registered as `spotHistory` / `inventoryTurnover`
// in data/gaps.js and stays registered.
//
// What one week DOES answer is a different and still useful question: who is holding it.
// 58% sitting downstream rather than at smelters is a materially different market from the
// reverse, and that reading needs no history at all.

import {
  geom, isNarrow, scaleLinear, fmt, chartFrame, a11yTable,
} from './kit.js';

const SEGMENT_COLORS = {
  冶炼厂: '#a78bfa',
  下游: '#38bdf8',
  其他: '#94a3b8',
};

export function renderInventorySplitChart(envelope, reference) {
  const points = envelope.points;
  const total = points.reduce((s, p) => s + p.value, 0);

  const narrow = isNarrow();
  const GEOM = geom(narrow);
  const left = narrow ? 16 : 24;
  const right = GEOM.w - (narrow ? 16 : 24);
  const barTop = narrow ? 58 : 52;
  const barH = narrow ? 54 : 46;
  const height = barTop + barH + (narrow ? 108 : 78);

  const x = scaleLinear({ domain: [0, total], range: [left, right] });

  let cursor = 0;
  const segments = points.map((p) => {
    const x0 = x(cursor);
    cursor += p.value;
    const x1 = x(cursor);
    const w = x1 - x0;
    const share = (p.value / total) * 100;
    const color = SEGMENT_COLORS[p.segment] || '#94a3b8';
    // Only label inside the segment when it actually fits; a 5-unit sliver with text
    // overflowing into its neighbour is worse than no label.
    const fits = w > (narrow ? 88 : 116);

    return `
      <g>
        <rect x="${x0.toFixed(1)}" y="${barTop}" width="${Math.max(w, 0).toFixed(1)}" height="${barH}"
              fill="${color}" />
        ${fits ? `
          <text class="chart-on-fill" x="${(x0 + w / 2).toFixed(1)}" y="${barTop + barH / 2 - 2}"
                text-anchor="middle">${p.segment}</text>
          <text class="chart-on-fill-dim" x="${(x0 + w / 2).toFixed(1)}" y="${barTop + barH / 2 + 16}"
                text-anchor="middle">${fmt.int(p.value)} · ${share.toFixed(0)}%</text>` : ''}
        <line class="chart-grid" x1="${x1.toFixed(1)}" x2="${x1.toFixed(1)}"
              y1="${barTop}" y2="${barTop + barH}" />
      </g>`;
  }).join('');

  const svgBody = `
    <text class="chart-value" x="${left}" y="${barTop - 16}">现货合计 ${fmt.int(total)} 吨</text>
    <rect class="chart-bar-track" x="${left}" y="${barTop}" width="${right - left}" height="${barH}" rx="4" />
    ${segments}
    ${points.map((p, i) => {
      const share = (p.value / total) * 100;
      const y = barTop + barH + 26 + (i * 22);
      return `<text class="chart-tick" x="${left}" y="${y}">${p.segment}　${fmt.int(p.value)} 吨　${share.toFixed(1)}%</text>`;
    }).join('')}`;

  const table = a11yTable({
    caption: `碳酸锂周度库存分项（${envelope.asOf}）`,
    head: ['环节', '库存（吨）', '占比'],
    rows: points.map((p) => [p.segment, fmt.int(p.value), `${((p.value / total) * 100).toFixed(1)}%`])
      .concat([['现货合计', fmt.int(total), '100%']]),
  });

  const downstream = points.find((p) => p.segment === '下游');

  return chartFrame({
    id: 'inventory-split',
    kicker: '成本与价格',
    title: '碳酸锂库存在谁手里',
    note: `${downstream ? `下游持有 ${((downstream.value / total) * 100).toFixed(0)}%，` : ''}`
      + '库存重心在下游而非冶炼厂——同样的总量，压力位置不同。'
      + (envelope.note || ''),
    height,
    width: GEOM.w,
    svgBody,
    envelope,
    reference,
    a11yLabel: `堆叠条形图：${envelope.asOf} 碳酸锂现货库存合计 ${fmt.int(total)} 吨，`
      + points.map((p) => `${p.segment} ${fmt.int(p.value)} 吨`).join('，') + '。',
    table,
  });
}
