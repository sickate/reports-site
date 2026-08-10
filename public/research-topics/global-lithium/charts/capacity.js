// 产能构成：已投产 vs 规划增量，按生命周期分组。
//
// This chart deliberately shows ALL 44 projects and does NOT follow the atlas filters.
//
// The filter UI lives in the atlas view. A chart on a different tab that silently reflected
// a filter set two tabs away would show a reader "half the pipeline" with no visible cause —
// a new instance of exactly the silent-inconsistency class that core/invariants.js exists to
// prevent. Making the scope constant and saying so in the caption is the honest fix. It also
// keeps this chart out of render()'s hot path, which reruns on every search keystroke.
//
// What the data says, and why the encoding is a stacked pair rather than two bars: every
// kilotonne of CURRENT capacity is in `operating` — all four other lifecycle buckets are
// zero. So the useful comparison is not "which stage is biggest" but "how much of each
// stage's number already exists versus is still promised", which is what solid-plus-hatch
// reads as directly.

import {
  geom, isNarrow, hbarHeight, scaleLinear, gridX, rowLabel, fmt,
  chartFrame, a11yTable, chartLegend,
} from './kit.js';
import { chartColors } from '../data/palette.js';
import { LIFECYCLE_LABELS } from '../data/schema.js';
import { UPDATE_MARKER } from '../core/version.js';

/** Display order: by planned capacity descending, so the bar chart reads top-heavy. */
const ORDER = ['operating', 'construction', 'development', 'on-hold', 'resource-stage'];

const ENVELOPE = {
  label: '全球锂项目产能构成',
  unit: 'kt LCE/年',
  asOf: UPDATE_MARKER,
  basis: '本页项目数据库 44 个项目的 current_kta_lce / planned_kta_lce 按 lifecycle 分组求和',
  kind: 'own_calc',
  confidence: 'high',
  series: 'fact',
  source: {
    label: '本页项目数据库（global-lithium-database-2026.csv）',
    kind: 'internal',
  },
};

export function renderCapacityChart(projects, reference) {
  const groups = aggregate(projects);
  const rows = ORDER.filter((k) => groups[k]).map((k) => ({ key: k, ...groups[k] }));

  const narrow = isNarrow();
  const GEOM = geom(narrow);
  const height = hbarHeight(rows.length, GEOM);
  const plotRight = GEOM.w - GEOM.pad.right;
  const maxPlanned = Math.max(...rows.map((r) => r.planned), 1);

  const x = scaleLinear({ domain: [0, maxPlanned], range: [GEOM.pad.left, plotRight] });
  const barH = GEOM.rowH * 0.52;

  const totalCurrent = rows.reduce((s, r) => s + r.current, 0);
  const totalPlanned = rows.reduce((s, r) => s + r.planned, 0);

  const bars = rows.map((r, i) => {
    const yTop = GEOM.pad.top + (i * GEOM.rowH) + ((GEOM.rowH - barH) / 2);
    const mid = yTop + (barH / 2);
    const xCur = x(r.current);
    const xPlan = x(r.planned);

    return `
      <g>
        ${rowLabel({ text: LIFECYCLE_LABELS[r.key] || r.key, y: mid + 5, g: GEOM,
          title: `${LIFECYCLE_LABELS[r.key]}（${r.n} 个项目）` })}
        <text class="chart-tick" x="${GEOM.pad.left - 12}" y="${mid + 19}" text-anchor="end">${r.n} 个项目</text>

        <rect class="chart-bar-track" x="${GEOM.pad.left}" y="${yTop}"
              width="${plotRight - GEOM.pad.left}" height="${barH}" rx="3" />

        ${r.current > 0 ? `<rect x="${GEOM.pad.left}" y="${yTop}"
              width="${xCur - GEOM.pad.left}" height="${barH}" rx="3"
              fill="${chartColors.capacityNow}" />` : ''}

        <rect x="${xCur}" y="${yTop}" width="${Math.max(xPlan - xCur, 0)}" height="${barH}" rx="3"
              fill="${chartColors.capacityPlanned}" />
        <rect x="${xCur}" y="${yTop}" width="${Math.max(xPlan - xCur, 0)}" height="${barH}" rx="3"
              fill="url(#capacity-hatch)" />

        <text class="chart-value" x="${xPlan + 10}" y="${mid + 5}">${fmt.kta(r.planned)}</text>
      </g>`;
  }).join('');

  const svgBody = `
    <defs>
      <pattern id="capacity-hatch" width="7" height="7" patternTransform="rotate(45)"
               patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,.34)" stroke-width="2.5" />
      </pattern>
    </defs>
    ${gridX({ scale: x, y0: GEOM.pad.top, y1: height - GEOM.pad.bottom, count: narrow ? 3 : 5, format: fmt.int })}
    ${bars}`;

  const table = a11yTable({
    caption: '各生命周期阶段的已投产产能与规划总产能（kt LCE/年）',
    head: ['阶段', '项目数', '已投产', '规划总产能', '规划增量'],
    rows: rows.map((r) => [
      LIFECYCLE_LABELS[r.key] || r.key,
      String(r.n),
      fmt.kta(r.current),
      fmt.kta(r.planned),
      fmt.kta(r.planned - r.current),
    ]).concat([['合计', String(projects.length), fmt.kta(totalCurrent), fmt.kta(totalPlanned), fmt.kta(totalPlanned - totalCurrent)]]),
  });

  return chartLegend([
    { label: '已投产产能', color: chartColors.capacityNow },
    { label: '规划增量（尚未兑现）', color: chartColors.capacityPlanned, hatch: true },
  ]) + chartFrame({
    id: 'capacity',
    kicker: '未来供给',
    title: '产能构成：已投产 vs 规划增量',
    note: `全部 ${projects.length} 个项目，不随筛选器变化。`
      + `已投产合计 ${fmt.kta(totalCurrent)} kt，规划合计 ${fmt.kta(totalPlanned)} kt——`
      + `全部已投产产能都在「在产」一档，其余 ${projects.length - (groups.operating?.n || 0)} 个项目的产能尚未兑现任何一吨。`
      + '横条长度是规划总产能，实心段是其中已经投产的部分。',
    height,
    width: GEOM.w,
    svgBody,
    envelope: ENVELOPE,
    reference,
    a11yLabel: `横向条形图：按生命周期阶段划分的锂项目产能。已投产合计 ${fmt.kta(totalCurrent)} kt LCE/年，`
      + `规划合计 ${fmt.kta(totalPlanned)} kt。完整数值见随后的数据表。`,
    table,
  });
}

function aggregate(projects) {
  const out = {};
  for (const p of projects) {
    const key = p.lifecycle;
    if (!key) continue;
    if (!out[key]) out[key] = { n: 0, current: 0, planned: 0 };
    out[key].n += 1;
    out[key].current += Number(p.current_kta_lce) || 0;
    out[key].planned += Number(p.planned_kta_lce) || 0;
  }
  return out;
}
