# Changelog

All notable changes to this project will be documented in this file.

## [1.6.0] - 2026-07-16

### Added

- New industry research page `2026-07-nvidia-memory-profit-pool` — "NVIDIA 与全球存储利润池":
  a visual research layout covering the CY2026 profit-pool comparison, HBM market
  boundary, financial-period normalization, verified company fact base, CY2027
  scenario ranges, ASP monitoring dashboard, and explicit data-quality controls
- Interactive CY2026E / CY2027E operating-profit range chart for NVIDIA, Samsung,
  SK hynix, and Micron, with each range retaining its A/P/G/E/M/S data-state label
- HBM revenue stack, profit-boundary framing, memory-cycle transmission diagram,
  desktop/mobile responsive layout, and permanent withdrawn-number register

### Changed

- Report registry now includes the new NVIDIA / global memory profit-pool research topic

## [1.5.0] - 2026-06-13

### Added

- New report `2026-06-metals-ytd` — "Metals Momentum — YTD & Rolling 1-Year":
  toggle between year-to-date and trailing rolling 12-month price-change trends
  on a shared full-calendar-year time axis (post-today span left empty),
  combined normalized %-change chart + per-metal price cards with data-cadence tags
- Daily price store `public/data/metals-daily.json` (one point per metal per day, rolling ~420-day window)
- Daily-data pipeline:
  - `scripts/lib/daily-store.mjs` — read / upsert / prune / write helpers
  - `scripts/lib/sources/fred.mjs` — FRED CSV history adapter (daily gold; monthly base/iron/cobalt)
  - `scripts/lib/sources/registry.mjs` — per-metal source map + `METALS_API_KEY` key-later seam
  - `scripts/backfill-daily.mjs` — one-time, re-runnable history backfill (degrades per-metal)

### Changed

- `scripts/update-prices.js` now also appends today's prices to the daily store (`DAILY_FILE` env), pruning to the rolling window
- `scripts/deploy.sh` excludes `data/metals-daily.json` from the `--delete` rsync (preserves accumulated server history) and syncs `update-prices.js`, `backfill-daily.mjs`, and `scripts/lib/`
- Report registry updated to include the new June 2026 metals momentum page

## [1.4.0] - 2026-04-22

### Added

- New April 2026 research topics:
  - `2026-04-optical-value-chain`
  - `2026-04-semiconductor-upstream`
  - `2026-04-high-voltage-platform`
  - `2026-04-global-lithium`
  - `2026-04-commercial-space`
  - `2026-04-elon-musk-factories`
- Shared company finance card renderer in `src/lib/`
- Generated finance dataset: `public/data/company-financials.jsonl`
- Generated semiconductor upstream datasets:
  - `public/data/semiconductor-upstream-subsegments.jsonl`
  - `public/data/semiconductor-upstream-company-exposures.jsonl`
- Research topic assets and supporting notes under `public/research-topics/`, `researches/`, and `skills/`

### Changed

- `npm run build` now runs a `prebuild` step that generates shared JSONL research datasets
- Deploy script now validates `dist/data/company-financials.jsonl` before syncing to production
- Report registry updated to include the new April 2026 topic pages
- Global styles and shared report infrastructure expanded to support richer topic pages, layered finance sections, and reusable research components

### Data

- Optical communications page now uses shared per-company finance records instead of page-local hardcoded tables
- Semiconductor upstream topic now reads generated subsegment and company exposure datasets
- Added new public data files for lithium and global manufacturing map research

### Infrastructure

- Established a reusable research-data pipeline for report pages that need shared company / subsegment / exposure datasets
- Added repository-level documentation for generated datasets and recent topic pages

## [1.3.0] - 2026-01-26

### Added

- Automatic price update system: CLI script to fetch latest metal prices
- External JSON data file: `public/data/metals-prices.json` for separating data from code
- "Last Updated" timestamp display on page footer
- Server-side cron job runs every 2 hours to update current year prices

### Changed

- React component now fetches price data from JSON file instead of hardcoded arrays
- Data source description: "Year-End Prices (Historical) / Latest Price (Current Year)"
- Deploy script now preserves server-side scripts folder

### Infrastructure

- Added Node.js on server for running update scripts
- Cron job: `0 */2 * * *` for price updates
- Log file: `/var/log/metals-update.log`

### Known Issues

- Web scraping requires improvement: current regex patterns may not match website HTML structure
- Alternative: Consider using an API service with proper data feeds

## [1.2.0] - 2025-01-24

### Added

- Multi-select metal comparison: chip-based UI replacing dropdown, supports selecting any combination of metals
- New metals: Molybdenum (钼), Iron (铁), Cobalt (钴) - total 13 metals now
- Dynamic Y-axis range: auto-adjusts based on selected metals and time range
- Cycle period markers: ReferenceArea components visualize economic cycles on chart

### Changed

- Sub-charts (Industrial, Ferrous, Rare Metals) now use normalized percentage Y-axis for proper comparison
- Updated metal groupings:
  - Industrial Metals: Copper, Aluminum, Zinc
  - Ferrous Metals: Iron, Cobalt, Nickel
  - Rare Metals: Tin, Tungsten, Molybdenum
  - New Energy Metals: Lithium, Titanium

### Fixed

- Y-axis range issue when selecting subset of metals (was showing all metals' range)
- Data type issue: normalized data now stored as numbers instead of strings

## [1.1.0] - 2025-01-23

### Added

- 2026 January price data for all metals
- Lithium and Titanium historical data (1975-2026)
- Linear/Log scale toggle button
- ReferenceArea for cycle period visualization

### Changed

- Chart height increased from 400px to 500px
- Updated title to reflect 1975-2026 time range

## [1.0.0] - 2025-01-22

### Added

- Initial release of Instap Research Reports website
- Vite 6 + React 18 build system
- Dark theme UI design
- Responsive layout with mobile support
- Report registry system for managing content
- Dynamic report loading with code splitting

### Reports

- **Metals Commodity Prices (1975-2025)**: Interactive visualization of 50-year historical data for 8 major metals (Gold, Silver, Copper, Aluminum, Nickel, Zinc, Tin, Tungsten)

### Infrastructure

- nginx configuration with HTTPS support
- Let's Encrypt SSL certificate automation
- Deployment script for rsync-based updates
- Server setup script for first-time configuration
