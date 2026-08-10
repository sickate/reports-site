// 已确认的政策与法规时点。
//
// The narrowest honest version of the "catalyst calendar" the review asked for.
//
// A catalyst calendar mixes two very different kinds of entry: policy with a published
// effective date, and operational events (restarts, maintenance, ramp-ups) whose timing is
// a probability. Putting both on one axis implies the second kind is as firm as the first.
// So this plots ONLY clauses that are already gazetted with a fixed date; `catalystFeed`
// stays in data/gaps.js for everything else, which is most of it.
//
// Rendered as a vertical list rather than a horizontal axis: with four entries the spacing
// on a time axis would be arbitrary, and a vertical list reads identically at every width.

import { geom, isNarrow, chartFrame, a11yTable } from './kit.js';

const DIRECTION = {
  positive: { color: '#4ade80', mark: '↑', label: '利多供给端' },
  negative: { color: '#fb7185', mark: '↓', label: '利空需求端' },
  neutral: { color: '#94a3b8', mark: '→', label: '中性' },
};

export function renderPolicyTimelineChart(envelope, reference) {
  const points = [...envelope.points].sort((a, b) => a.date.localeCompare(b.date));

  const narrow = isNarrow();
  const GEOM = geom(narrow);
  const rowH = narrow ? 92 : 74;
  const top = 26;
  const height = top + (points.length * rowH) + 20;

  const railX = narrow ? 78 : 150;
  const textX = railX + (narrow ? 20 : 28);

  const items = points.map((p, i) => {
    const y = top + (i * rowH) + 22;
    const d = DIRECTION[p.direction] || DIRECTION.neutral;

    return `
      <g>
        <text class="chart-rowlabel" x="${railX - 16}" y="${y + 5}" text-anchor="end">${p.date}</text>
        <circle cx="${railX}" cy="${y}" r="6" fill="${d.color}" />
        <text class="chart-glyph" x="${railX}" y="${y + 4}" text-anchor="middle"
              fill="#0b1020" font-size="9" font-weight="700">${d.mark}</text>
        <text class="chart-value" x="${textX}" y="${y + 5}">${p.title}</text>
        <text class="chart-tick" x="${textX}" y="${y + 26}">${p.detail}</text>
        <text class="chart-tick" x="${textX}" y="${y + 46}" fill="${d.color}">${d.label}</text>
      </g>`;
  }).join('');

  const railTop = top + 22;
  const railBottom = top + ((points.length - 1) * rowH) + 22;

  const svgBody = `
    <line class="chart-grid" x1="${railX}" x2="${railX}" y1="${railTop}" y2="${railBottom}"
          stroke-width="2" />
    ${items}`;

  const table = a11yTable({
    caption: '已确认生效日期的政策条款',
    head: ['生效日', '条款', '说明', '方向'],
    rows: points.map((p) => [
      p.date, p.title, p.detail, (DIRECTION[p.direction] || DIRECTION.neutral).label,
    ]),
  });

  return chartFrame({
    id: 'policy-timeline',
    kicker: '催化剂与预警',
    title: '已确认的政策与法规时点',
    // The module note says how to READ the chart; envelope.note carries the data's own
    // caveats. Keeping the split means neither repeats the other — an earlier version
    // printed the same "this is not a catalyst calendar" sentence twice.
    note: `按生效日排序，共 ${points.length} 条。${envelope.note || ''}`,
    height,
    width: GEOM.w,
    svgBody,
    envelope,
    reference,
    a11yLabel: `时间轴：${points.length} 条已确认生效日期的政策条款，`
      + `从 ${points[0].date} 到 ${points[points.length - 1].date}。完整内容见随后的数据表。`,
    table,
  });
}
