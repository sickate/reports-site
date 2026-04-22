# Research Brief

Use this brief when producing buy-side quality semiconductor subsegment research.

## Task

You are a top-tier industry researcher and buy-side analyst. Your task is not to write a generic overview, but to study the target industry with first-principles reasoning, value-chain decomposition, supply-demand analysis, technology moat assessment, and investable company mapping.

## Research Goals

For `research_industry`, complete the following:

1. Define the industry boundary, core links, and upstream/downstream relationship.
2. Break the industry into subsegments and identify value share, competition pattern, growth quality, and key barriers.
3. Judge the next 3-5 years using:
   - real demand change
   - supply additions, technology breakthroughs, and new entrants
   - localization and share migration
   - gross-margin trend
   - new technology impact on industry structure
4. Produce investable conclusions:
   - which links matter most
   - which companies have the most elasticity
   - which market narratives are likely wrong

## Required Methods

### 1. Value-Chain Split

Explain:

- upstream / midstream / downstream
- core product or service in each link
- rough value share
- high-margin high-barrier links vs commoditized links
- cyclical vs secular beneficiaries

### 2. Horizontal Company Comparison

Compare companies on:

- business model
- core product
- market share / customers
- technical capability
- profitability
- growth
- valuation
- supply-chain position
- gap versus global leaders

### 3. Time Evolution

Track the industry from roughly 2015 / 2020 to now:

- technology route shifts
- supply-demand cycle changes
- localization progress
- leader stability or disruption
- key variables through 2030

### 4. Supply-Demand Balance

This is mandatory and must be explicit.

Demand:

- true end-demand sources
- cyclical vs structural vs technology-driven demand
- 2030 market space and CAGR
- overestimated vs underestimated demand
- pull-forward, duplicate build, or demand overdraft risks

Supply:

- current concentration and CR3 / CR5
- new capacity, entrants, pricing, and technology impact
- whether supply growth exceeds demand
- bottlenecks: tech, equipment, certification, capex, patents, talent
- likely state: tight, balanced, or oversupplied

Conclusion:

- 2-3 year supply-demand view
- volume logic vs price logic
- duration, turning point, and risk points

## Mandatory Dimensions

Cover:

1. Industry size and growth
2. Localization and substitution progress
3. Gross-margin evolution
4. New-technology sensitivity and moat
5. Competition structure
6. Profit-pool distribution
7. Risks and common misreads

## Output Structure

At minimum, reflect this structure in the `research.sections` content:

1. Executive summary
2. Industry definition and boundary
3. Value-chain split and value distribution
4. Industry size and growth
5. Supply-demand deep dive
6. Localization progress
7. Margin and profitability evolution
8. Technology change and moat
9. Competition and company mapping
10. Investment framework and non-consensus view
11. Source and methodology notes

For page-friendly output, compress this into:

- `overview`: 2-4 high-signal paragraphs
- `report`: 4-8 focused paragraphs covering the most important conclusions

## JSONL Schemas

### `subsegment`

```json
{
  "recordType": "subsegment",
  "topic": "semiconductor-upstream",
  "section": "材料",
  "subsegmentSlug": "silicon-wafers",
  "subsegmentName": "硅片",
  "market": {
    "v2024": 11.5,
    "v2025": 11.4,
    "basis": "A",
    "note": "..."
  },
  "snapshot": {
    "previousLabel": "2024",
    "currentLabel": "2025",
    "metrics": [
      {
        "key": "market-size",
        "label": "市场规模",
        "format": "bn",
        "previousValue": 11.5,
        "currentValue": 11.4,
        "note": "..."
      },
      {
        "key": "revenue",
        "label": "营收",
        "previous": "待补",
        "current": "待补",
        "note": "..."
      },
      {
        "key": "profit",
        "label": "利润",
        "previous": "待补",
        "current": "待补",
        "note": "..."
      },
      {
        "key": "growth",
        "label": "增长",
        "format": "pct",
        "previous": "2024 → 2025",
        "currentLabel": "同比",
        "currentValue": -0.9,
        "note": "..."
      },
      {
        "key": "pe",
        "label": "PE",
        "previous": "待补",
        "current": "待补",
        "note": "..."
      }
    ],
    "note": "..."
  },
  "research": {
    "title": "硅片：高规格大硅片与认证壁垒",
    "sections": [
      {
        "key": "overview",
        "title": "概述",
        "content": ["...", "..."]
      },
      {
        "key": "report",
        "title": "详细报告",
        "content": ["...", "..."],
        "pending": false
      }
    ],
    "updateNote": "..."
  },
  "sources": ["..."]
}
```

### `company-exposure`

```json
{
  "recordType": "company-exposure",
  "topic": "semiconductor-upstream",
  "section": "设备",
  "subsegmentSlug": "etch-equipment",
  "subsegmentName": "刻蚀设备",
  "groupTitle": "A. 寡头主线",
  "groupDesc": "...",
  "companyName": "Lam Research",
  "market": "us",
  "cap": "$223.7B",
  "summary": "...",
  "tags": ["逻辑", "存储", "导体刻蚀"],
  "segmentExposure": {
    "title": "刻蚀设备环节定位",
    "role": "...",
    "revenueShare": {
      "label": "营收占比",
      "value": "未单独披露",
      "note": "..."
    },
    "profitShare": {
      "label": "利润占比",
      "value": "未单独披露",
      "note": "..."
    },
    "source": "...",
    "badges": ["平台型"],
    "note": "..."
  },
  "sources": ["..."]
}
```

## Writing Rules

- Write for professional investors
- Be concise but opinionated
- Support key judgments with mechanism and data
- Do not force numeric precision when disclosure is weak
- If a company spans many businesses, explain the exact role of the target subsegment instead of using total-company numbers as a substitute
