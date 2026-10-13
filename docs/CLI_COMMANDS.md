# Metals price commands

Run from the project root with Node.js 18+ (production uses Node.js 22).

| Command | Purpose |
| --- | --- |
| `node scripts/update-prices.js` | Update all configured metals; tungsten and lithium affect only their independently sourced daily series. |
| `METALS=copper,tungsten,lithium node scripts/update-prices.js` | Incremental update of the three changed benchmarks only. |
| `node scripts/backfill-copper.mjs` | Replace copper's 420-day window with exact LME cash-settlement dates and prices. |
| `node scripts/backfill-tungsten.mjs` | Backfill publication-dated European APT ranges; preserve other metals. |
| `node scripts/backfill-lithium.mjs` | Backfill battery-grade carbonate AM spot and historical ECB FX; preserve other metals. |
| `node scripts/backfill-daily.mjs` | Rebuild configured history across all metals; uses separate baselines for copper, tungsten and lithium. |
| `node --test scripts/tests/copper-source.test.mjs scripts/tests/ctia-tungsten.test.mjs scripts/tests/mysteel-lithium.test.mjs scripts/tests/daily-store.test.mjs` | Run the price-source regression suite. |
| `npm run deploy` | Build, back up the previous release, prepare changed price series, publish static files, and refresh the existing research MCP service. |

`DATA_FILE` overrides the annual JSON path. `DAILY_FILE` overrides the daily JSON path; by default it is `metals-daily.json` beside `DATA_FILE`. The server's existing hourly job needs no new schedule:

```bash
DATA_FILE=/var/www/reports/data/metals-prices.json node /var/www/reports/scripts/update-prices.js
```

See [tungsten source details](tungsten-price-sources.md), [lithium conversion details](lithium-price-source.md), and [copper repair evidence](copper-price-data-fix.md).
