// HTML escaping, in one place.
//
// This existed as three byte-identical private copies (app.js, metric.js, empty-state.js)
// before the chart kit would have made it four. Every renderer on this page builds markup
// as strings and assigns it with innerHTML, so an unescaped interpolation anywhere is an
// injection; having one implementation means there is one thing to audit.
//
// TWO functions, because the nullish case has two legitimate answers and picking the wrong
// one is a real defect rather than a style preference:
//
//   escapeHtml — for TEXT the reader sees. Empty becomes 「—」, so a missing cell looks
//                deliberately blank instead of collapsing and shifting the layout.
//   escapeRaw  — for ATTRIBUTE values and SVG internals. Empty stays empty, because
//                `aria-label="—"` or `data-id="—"` would announce an em-dash as content
//                and turn a missing id into a matchable one.

const REPLACEMENTS = [
  ['&', '&amp;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
];

function replaceAll(input) {
  let out = String(input);
  for (const [from, to] of REPLACEMENTS) out = out.replaceAll(from, to);
  return out;
}

/** Escape for display. Nullish / empty renders as an em-dash placeholder. */
export function escapeHtml(value) {
  if (value === null || value === undefined || value === '') return '—';
  return replaceAll(value);
}

/** Escape for attributes and SVG internals. Nullish / empty stays empty. */
export function escapeRaw(value) {
  if (value === null || value === undefined) return '';
  return replaceAll(value);
}
