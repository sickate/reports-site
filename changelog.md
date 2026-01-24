# Changelog

All notable changes to this project will be documented in this file.

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
