# Preserved deployed Model Lab component

The Model Lab Network was already published at reports.instap.net on 2026-10-08,
but its authored source was absent from the supplied checkout and origin/main
(commit 3c5c1d9). These nine assets were downloaded from that deployment on
2026-10-08 to preserve its graph, filters, paths, export, registry and map behavior.
Their original filenames and module imports are retained. The wrapper mounts only
the report component, not a second copy of the site shell.

Canonical content is maintained in `/public/data/model-lab-network.json` and
`/public/research-topics/model-lab-network/research.md`. The preserved component
fetches this same JSON; the text exporter and MCP consume it too. New research is
rendered by the authored React wrapper. Do not edit minified vendor assets to
change report content. If the original component source becomes available,
replace the snapshot with its authored implementation.

Source URLs: `https://reports.instap.net/assets/<filename>` for the `.js` and
`.css` files in this directory. Third-party license notices remain in those files.

Local interaction adjustment (2026-10-08): the report initialization uses
Cytoscape wheelSensitivity 0.12 to reduce scroll zoom jumps. Leaflet uses
zoomSnap 0.25, zoomDelta 0.5 and wheelPxPerZoomLevel 240 for finer map zoom.
These changes apply only to report options; bundled vendor implementations
and research content are preserved.

Local timeline enhancement: `../timeline.js` and `../timeline.css` add an
announcement-date range control above the relationship graph, reusing the
existing from/until filter state. Month-only announcements use interval overlap
so a date range inside that month still includes the relationship.

OpenAI research integration (2026-10-08): report configuration adds content
licensing, grants, research and governance relationship types and a cancelled
status. Cancelled edges use faint dotted lines. Canonical content is still
maintained in JSON and the authored research Markdown, not in vendor code.
