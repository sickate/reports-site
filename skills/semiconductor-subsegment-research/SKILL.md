---
name: semiconductor-subsegment-research
description: Use when you need buy-side quality deep research for a semiconductor supply-chain subsegment, including industry structure, supply-demand, technology moat, localization path, company mapping, and structured JSONL output for page/data decoupling.
---

# Semiconductor Subsegment Research

Use this skill when the task is to research a semiconductor upstream subsegment and convert the result into structured records that can feed a report page or reusable dataset.

## When To Use

- The user wants deep industry research, not a light summary
- The target is a semiconductor subsegment, company cluster, or supply-chain node
- The output should support investment research, company mapping, or page content
- The result needs to be saved as structured `JSONL`

## Required Inputs

- `research_industry`: the exact subsegment to study
- `market_scope`: `global`, `china`, or `global + china`
- `focus_companies`: optional list of priority names
- `include_a_share_mapping`: `true` or `false`
- `need_24a_25e_26e`: `true` or `false`
- `output_mode`: usually `jsonl`

## Output Contract

Default to two JSONL record types:

1. `subsegment`
2. `company-exposure`

Use the schemas and research checklist in [references/research-brief.md](references/research-brief.md).

## Workflow

1. Define the subsegment boundary precisely.
2. Build the industry view first: value chain, market size, supply-demand, moat, localization, margin structure, technical change.
3. Then map companies by role: pure-play, platform, adjacent extension, key supplier, domestic substitute.
4. Only write ratios like revenue share or profit share when the disclosure is reliable.
5. If a ratio is not disclosed, write `未单独披露` or `待补` and explain why.
6. Keep page structure and data structure decoupled: research belongs in JSONL, not hardcoded render logic.

## Quality Bar

- Explain `why`, not just `what`
- Prefer primary sources and company disclosures
- Distinguish fact, inference, and estimate
- Avoid fake precision
- Identify non-consensus points, not just consensus narratives
