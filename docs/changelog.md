# Changelog

## 2026-10-14

- Restore tungsten trends with publication-dated Chinatungsten European APT ranges, source links, an independent baseline, and hourly incremental collection.
- Add Mysteel China battery-grade lithium carbonate AM spot history, converting each quote with same-day or preceding ECB USD/CNY and retaining original prices and FX dates.
- Repair the September 1 copper anomaly by selecting the exact Westmetall LME cash-settlement field and source dates; reject alternate benchmarks and malformed values.
- Provide scoped copper/tungsten/lithium backfills and `METALS` incremental selection; preserve previous series when sources fail and write daily stores atomically.
- Deploy from the latest project revision, prepare the changed series before publishing the UI, retain server-owned yearly/daily metals files and COSCO monitoring data, preserve server-only research archives, and back up releases outside the web root.

Validation: 31 price-source and store tests, 4 existing MCP integration tests, and the complete production build passed.
