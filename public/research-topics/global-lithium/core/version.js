// The single source of truth for every version literal on this page.
//
// There are THREE clocks here, and conflating any two of them produces a defect with no
// visible symptom. They were previously one constant (`DATA_VERSION`), which is why this
// file exists.
//
//   CODE_VERSION    — the code cache-buster. Must equal index.html's `?v=` on the app.js
//                     script tag AND REPORT_VERSION in the React wrapper (which pins the
//                     iframe src). Bump on every code release.
//
//   DATA_CACHE_KEY  — the `?v=` appended to /data/* fetches. Bump whenever ANY file under
//                     public/data/ changes, including a pure schema change. Getting this
//                     wrong is severe: a browser holding yesterday's CSV would parse rows
//                     with no lifecycle column, and every project would silently collapse
//                     into one bucket.
//
//   UPDATE_MARKER   — the value of a row's `updated` cell that earns the "本次更新" pill,
//                     and the data as-of date shown to readers (kept equal to the report's
//                     `date` in src/reports/index.js). Bump ONLY when project facts change.
//
// The trap that motivated the split: a code-or-schema-only release has to bump the first
// two but must NOT bump the third, because raising the marker past every row's `updated`
// value clears all the pills at once and reads as "nothing changed this week".
//
// scripts/check-lithium-consistency.mjs enforces all of the above and fails the build.

export const CODE_VERSION = '2026-07-27';
export const DATA_CACHE_KEY = '2026-07-27';
export const UPDATE_MARKER = '2026-07-24';
