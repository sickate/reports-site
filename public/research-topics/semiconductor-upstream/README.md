# Semiconductor Upstream Topic

This page is now split into a static shell plus module-based data files so each subsegment can be edited independently.

## Structure

- `index.html`: page shell and shared styles
- `app.js`: unified renderer and page interactions
- `../shared/company-card-snippet.js`: reusable company card snippet renderer
- `../shared/company-financials.js`: shared JSONL loader / lookup helpers
- `data/runtime-records.js`: runtime JSONL loader and merge layer for the semiconductor topic
- `lib/create-subsegment.js`: shared factories for subsegment modules
- `../../data/company-financials.jsonl`: project-level company finance snapshots shared across reports
- `../../data/semiconductor-upstream-subsegments.jsonl`: canonical subsegment research / snapshot data
- `../../data/semiconductor-upstream-company-exposures.jsonl`: canonical company-in-subsegment exposure records
- `data/market-data.js`: section-level market totals and labels
- `data/sections.js`: top-level section registry
- `data/subsegments/<section>/`: one file per subsegment

## Subsegment Formats

Use `createSimpleSubsegment(...)` for most subsegments:

```js
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'example-subsegment',
  name: '示例环节',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: false,
  summary: '一句话说明这个环节为什么重要。',
  market: {
    v2024: 1.2,
    v2025: 1.4,
    basis: 'B',
    note: '市场规模口径说明。'
  },
  snapshot: {
    metrics: [
      { key: 'revenue', previous: '$1.0B', current: '$1.2B' },
      { key: 'profit', previous: '$0.2B', current: '$0.3B' },
      { key: 'pe', previous: '18.0x', current: '22.0x' }
    ]
  },
  companies: [['Company A', 'us'], ['Company B', 'jp']]
});
```

Use `createDeepDiveSubsegment(...)` when a subsegment needs the full sell-side style company breakdown like the current etch page:

```js
import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'example-deep-dive',
  name: '示例深度拆解',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '一句话摘要。',
  market: {
    v2024: 2.4,
    v2025: 2.8,
    basis: 'A',
    note: '市场规模口径说明。'
  },
  detail: {
    title: '示例板块深度拆解',
    intro: '这里放板块总览。',
    updateNote: '这里放阶段性更新提示。',
    sections: [
      { title: '概述', content: '这里放一句或多句概述。', open: true },
      { title: '详细报告', content: '这里放更长的研究正文。', open: false }
    ],
    groups: [
      {
        title: 'A. 主线龙头',
        desc: '这一组的分层逻辑。',
        companies: [
          {
            name: 'Company A',
            market: 'us',
            cap: '$10.0B',
            summary: '公司摘要。',
            tags: ['标签1', '标签2'],
            segmentExposure: {
              role: '这家公司在当前细分里属于平台型核心玩家。',
              revenueShare: { value: '未单独披露', note: '建议后续补该环节占公司总收入比例。' },
              profitShare: { value: '待补', note: '建议后续补该环节利润或利润率贡献。' },
              source: '公司分部披露 / 研究口径',
              badges: ['平台型', '非纯收入'],
              note: '用于明确说明：公司虽然在这个环节很重要，但财务不是 pure-play 口径。'
            }
          }
        ]
      }
    ]
  }
});
```

## Unified Card Structure

Every subsegment now renders with the same three modules:

1. `snapshot`: fixed annual comparison cards. The factory auto-generates `市场规模 / 营收 / 利润 / 增长 / PE`; omitted values show as `待补`.
2. `detail.sections`: expandable research content, normally split into `概述` and `详细报告`.
3. `detail.groups`: grouped stock lists. Each group expands into company cards, and company finance data still comes from the shared JSONL dataset.

If `snapshot` or `detail.sections` is omitted, the factory will generate sensible defaults so simple subsegments and deep-dive subsegments can share one renderer.

## Data Decoupling

The page now treats JSONL as the canonical runtime data layer:

1. `scripts/generate-company-financials-jsonl.mjs` generates:
   - `public/data/company-financials.jsonl`
   - `public/data/semiconductor-upstream-subsegments.jsonl`
   - `public/data/semiconductor-upstream-company-exposures.jsonl`
2. `app.js` loads those JSONL files at runtime and merges them onto the section topology from `data/sections.js`.
3. `data/sections.js` remains the layout / ordering fallback, while research content and company exposure data can be updated independently through JSONL.

Draft research produced by agents can be dropped into `researches/semiconductor-upstream/*.jsonl`; the generator script will merge matching records into the final public JSONL outputs during build.

## Company-Level Segment Exposure

For companies that span multiple subsegments, add a `segmentExposure` block inside the company object. This is scoped to the current subsegment and is meant to answer:

1. What is the company's exact position in this subsegment?
2. How much of the company's revenue/profit comes from this subsegment?
3. What is the disclosure basis or research caveat?

Recommended shape:

```js
segmentExposure: {
  role: '平台型设备商中的清洗第二极。',
  revenueShare: { value: '未单独披露', note: '可后续补卖方拆分口径。' },
  profitShare: { value: '待补', note: '利润未单独披露。' },
  source: '公司分部披露 / 研究口径',
  badges: ['平台型', '非纯收入'],
  note: '不要直接用公司总收入替代该环节收入。'
}
```

The front-end renders this as a dedicated module between the company note and the shared finance card.

## Collaboration Notes

- One agent should own one subsegment file at a time.
- If finance cards are needed, update the source module and then regenerate `../../data/company-financials.jsonl` with `node scripts/generate-company-financials-jsonl.mjs` (or just run `npm run build`, which now does this automatically).
- If a new subsegment is added, register it in the relevant `data/subsegments/<section>/index.js`.
- Keep `slug` stable once added because page interactions use it as the selection key.
