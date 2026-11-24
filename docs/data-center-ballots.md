# Data-center ballots and state-power report

## Requirements

Route: `/reports/2026-11-data-center-ballots`. Implement the user's requested Instap report from the verified J.D. Capelouto thread: geographic project scale, local restriction status, ownership, operating impact, and 2026 midterm state-power changes. Governor-party changes are the primary political layer; legislative control is secondary. UI controls follow the repository's English-control convention; research narrative is Chinese.

## Files and data contract

- `src/reports/2026-11-data-center-ballots/index.jsx`: lazy-loaded report and scoped inspector, filters, map, company summary, and project/state tables.
- `model.mjs`: pure scale, filtering, sorting, company aggregation and CSV helpers; `style.css`: report-scoped styles.
- `CompanySummary.jsx`: standard Data chart v1.2.1 via its pinned `mountChart` runtime; scoped source lists, exact company totals and company-to-project drilldown.
- `public/data/data-center-ballots.json`: 18 city/area records, 20 project/policy records, 10 scoped state-power records and source URLs. One Madison County record summarizes four advisory townships; counts are not unique ballots or a national census.
- `public/data/data-center-us-states.geojson`: 48 contiguous states and DC, extracted without geometry changes from Natural Earth 1:50m Admin-1. Source: `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_1_states_provinces.geojson`. Public domain: `https://www.naturalearthdata.com/about/terms-of-use/`.
- Point coordinates are Census 2024 Gazetteer representative internal points, matched by state and legal place name; Peru uses the Maine county-subdivision table. They are approximate city locations, not site parcels or guaranteed centroids. Source: `https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2024.html`.

## Non-negotiable display invariants

- Circle **area**, not radius, is proportional to numeric planned MW or multi-year project budget. City markers use the largest matching single project, not summed capacity. Company filters also narrow the projects used for marker sizing and inspector content.
- `null` capacity stays unknown. Emporia's qualitative GW-scale concept does not become 1,000MW; unknowns use fixed-size diamonds. Pataskala's land purchases are not data-center project capex.
- Circle colors encode six legal-policy classes; solid outlines indicate a city containing an under-construction project; cross marks identify historical rejected/terminated capacity. These are not operating assets lost. Inspector preserves stage/basis separately.
- Trenton's 250MW Prologis/AWS construction project differs from the second 1,000MW/601-acre/$5bn proposal; existing permits remain legally contested. Piqua's 1,400MW is requested load with developer-agreement uncertainty.
- Advisory votes and recalls are not construction bans. Perry incentive/noise conditions differ from the moratorium that excludes Champion Farm. Yukon early city-side figures differ from the later cross-border plan. No inference of automatic federal-company revenue loss or political causation is encoded.
- Blue state outlines show only verified governor-party changes in this research snapshot. Gray means no verified flip encoded, not proven unchanged. AP calls, official certification and assumption of office are separate fields. Candidate winners are not current governors.
- Governor snapshot: 2026-11-04 13:20 Asia/Shanghai, verified subset GA/OH/IA/TX R→D; not a final exhaustive national tally. Legislative snapshot: 12:57, only 29/88 chambers called. Unknown chambers remain `null`. OH incoming D governor plus R two chambers is divided government; never infer a D trifecta from a governor win. NJ's 2025 governor election is not a 2026 flip.

## Interaction and delivery

Map works from local data with no third-party tile requests. State boundary clicks and city markers show separate evidence; geographic/project filters link map and project table. State-power table applies state/flip filters; company/city filters remain project-specific. The current tab's filtered records are exported with source URLs and uncertainty fields. Native links preserve original sources.

Source changes are added to the existing repository and its report registry, preserving pre-existing dirty files. Publish only static assets/report datasets and update the app entry last; do not invoke the unrelated metals cron/backfill/dependency operations in the general deploy script. Preserve server-owned data and old hashed assets. No commit was requested.

## Plan status

- Done: source-backed dataset, local geography, linked map/table, MW/budget sizes, governor-flip highlights, legislative qualifiers, evidence details, search/filters, current-tab CSV, responsive layout.
- Verification: pure-data tests cover area encoding, non-additive city sizing, company scope, unknown values, snapshot party status, geographic integrity and CSV. A deliberate linear-radius mutation fails the area test. Production build and browser QA are recorded by the implementing agent before publication.
- Remaining: final official canvasses and later litigation/permit decisions require explicit future updates; this is a dated snapshot.
- Explicitly not doing: live election feeds, automated polling, national project completeness claims, exact parcel geocoding, speculative EPS estimates, aggregating planned capacity as operational capacity lost.

## Verified release

- Production route: `https://reports.instap.net/reports/2026-11-data-center-ballots`. Seven contract tests pass; the linear-radius mutation fails as expected. `npm run build` passes, including existing lithium consistency and shared dataset generation. Existing large-chunk build warnings remain.
- Browser QA covers national/Ohio map views, source-linked state and project inspectors, company filtering with Prologis narrowed to250MW, budget unknowns as diamonds, governor-flip-only filtering, state-power table, CSV action, and a390px mobile iframe.
- Release entry: `assets/index-dc-d3118fbaa3f0.js`; exactly one report-registry object added to the current published entry. All existing report expressions and global CSS retained byte-for-byte. Four reused shared dependencies matched live SHA-256 checksums. Upload comprised seven new hashed assets, two new data files and index.html, published last. No existing asset deletions or monitoring/price-script updates.
- Publication verified by remote file checksums and a live browser render with18locality records,20project/policy rows and10state-power rows. Original entry backup is recorded in the task release evidence; no commit requested.

## Company summary and readable tables

- Project/state tables use14–15px research text,12–13px secondary text, wider columns, higher contrast and a sticky location column. Wide tables scroll instead of shrinking text; mobile keeps the same reading scale.
- Company summary defaults to disclosed associated planned MW and switches to project count. Six additive policy classes provide the stack within each company, using the standard Data `horizontalStackedBar` component. A company may appear under different ownership/use roles; labels are association, not loss.
- Aggregate unique project IDs within each company. AWS has3records and1,250known MW plus1unknown-MW record; Prologis shares its250MW construction project. NVIDIA's500MW is an indirect Cloverleaf equity association, not an owned campus. Cross-company values are non-additive. No national aggregate is shown.
- Default excludes previously rejected/terminated Aligned200MW and Crane300MW concepts. The history control restores them explicitly. Companies without numeric MW remain null and are listed beside the MW chart; project-count view preserves their records. Eight unattributed policy records stay outside named-company groups.
- State/search/policy/flip scope applies to the company chart; company selection keeps peer comparisons visible while narrowing the map, inspector and detailed project rows. The exact-totals panel and per-company source links permit inspection.
- The map/data remain local; the new chart loads the pinned public Data chart runtime from `persistent.oaistatic.com`. Loading/error states retain the exact totals table, with a20-second visible timeout.
- Nine contract tests cover the earlier invariants plus company scope and historical/unknown handling. Deliberately replacing unknown company MW with zero causes both company tests to fail.

- Company-summary update verified live: entry `assets/index-dc-8094ee9387e9.js`, four uploaded files (new app entry, report JS/CSS, HTML), unchanged research dataset, existing report expressions and global CSS. Standard chart marks render on desktop and390px mobile; Project count / Disclosed MW, prior-history inclusion, AWS project drilldown and linked sources were exercised. The root production build and nine tests pass; reviewed chart configuration validation passed.

## Map filter visibility

+- The map section repeats the active shared query filters as removable chips directly below its heading: company, state, policy, search and governor-flip-only. This summary derives from the same `filters` state as the lower controls; it does not keep a second state copy.
+- Each chip clears only its own field; Clear all and the lower reset share one reset callback. Map markers, project rows, URL query, controls and company evidence update together. The unfiltered state explicitly says All projects / No active filters.
+- Company evidence derives from selectedCompany, so removing a company at the map or lower control also clears stale company detail. Company-chart-only history inclusion and map display/zoom controls are not represented as data filters.
+- Mobile chips wrap with readable text and removable buttons; they sit above the map instead of obscuring geographic marks. Native buttons include accessible Remove filter labels.

- Filter-summary release verified live: `assets/index-dc-02f3dcd78396.js`; production build and9existing contract tests pass. Browser checks exercised a5-condition URL, company-only removal preserving other fields, search/flip removal, Clear all restoring18places/20rows and lower controls, stale company-evidence clearing, and390px chip wrapping. Live lower company selection and map-chip removal synchronized the URL, map, dropdown and rows. Only four report/entry files uploaded; data and other report expressions unchanged.
