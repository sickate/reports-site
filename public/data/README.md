# Instap Research Data API

Base URL: `https://reports.instap.net/data/`

All endpoints return JSON, no authentication required. Data files are static JSON served by nginx with gzip compression. CORS is not explicitly configured (same-origin only by default).

---

## 1. Metals Commodity Prices

```
GET /data/metals-prices.json
```

50-year historical price data for 13 metals, updated hourly via server-side cron.

### Response Schema

```jsonc
{
  "lastUpdated": "2026-04-12T07:00:09.567Z",  // ISO 8601, UTC
  "metals": {
    "<metalId>": {
      "name": "Gold",           // Display name
      "unit": "USD/oz",         // Price unit
      "color": "#FFD700",       // Chart color (hex)
      "data": [
        { "year": 1975, "price": 161 },
        // ... one entry per year, 1975–2026
        { "year": 2026, "price": 4749.2 }
      ]
    }
  }
}
```

### Available Metals

| ID | Name | Unit | Update |
|----|------|------|--------|
| `gold` | Gold | USD/oz | Auto (hourly) |
| `silver` | Silver | USD/oz | Auto (hourly) |
| `copper` | Copper | USD/ton | Auto (hourly) |
| `aluminum` | Aluminum | USD/ton | Auto (hourly) |
| `nickel` | Nickel | USD/ton | Auto (hourly) |
| `zinc` | Zinc | USD/ton | Auto (hourly) |
| `tin` | Tin | USD/ton | Auto (hourly) |
| `iron` | Iron | USD/ton | Manual |
| `cobalt` | Cobalt | USD/lb | Manual |
| `tungsten` | Tungsten | USD/mtu | Manual |
| `molybdenum` | Molybdenum | USD/lb | Manual |
| `lithium` | Lithium | USD/ton | Manual |
| `titanium` | Titanium | USD/ton | Manual |

### Data Sources

- **Auto-updated**: gold-api.com (Gold, Silver), westmetall.com/LME (Copper, Aluminum, Nickel, Zinc, Tin)
- **Manual**: Trading Economics, SMM, Fastmarkets (updated periodically in source code)

### Notes

- Historical years: December 31 closing price
- Current year: latest available price
- Each metal has exactly 52 data points (1975–2026)
- `color` field provides a suggested chart color per metal

---

## 2. COSCO Shipping Energy Indicators

```
GET /data/cosco-shipping-energy.json
```

Key monitoring indicators for COSCO Shipping Energy (1138.HK) investment thesis, combining manual research data with auto-scraped leading indicators.

### Response Schema

```jsonc
{
  "lastUpdated": "2026-04-12T07:00:00Z",  // ISO 8601, UTC
  "metrics": {
    "<metricId>": {
      "type": "auto" | "manual",
      "name": "Metric display name",
      "unit": "USD/天",
      "baseline": "Reference benchmark text",
      "source": "Data source name",
      "latest": { ... },       // Current snapshot (schema varies by metric)
      "threshold": { ... },    // Alert thresholds (auto metrics only)
      "history": [ ... ]       // Time series (auto metrics only)
    }
  }
}
```

### Auto Metrics (updated weekly by cron)

#### `vlccOrders` — Monthly New VLCC Orders

Scraped weekly from Splash247, iMarine, Eworldship. Counts new VLCC newbuilding contracts from news headlines.

```jsonc
{
  "type": "auto",
  "unit": "艘",
  "threshold": { "alert": 15, "window": "monthly" },
  "latest": {
    "value": 13,              // Number of VLCCs ordered
    "asOf": "2026-04-11",
    "rolling7d": 13,          // Rolling 7-day count
    "details": [              // Individual order headlines
      {
        "source": "Splash247",
        "title": "China Merchants orders 10 VLCCs...",
        "count": 10,
        "url": "https://..."
      }
    ],
    "alert": false            // true when value >= 15
  },
  "history": [
    { "date": "2026-04-11", "value": 13, "window": "rolling-7d" }
  ]
}
```

**Cron**: Every Monday 09:00 UTC

**Alert logic**: `value >= 15` per rolling 7-day window signals orderbook FOMO (cycle top proximity)

#### `vlccPriceRatio` — 10yr Secondhand / Newbuild VLCC Price Ratio

Scraped weekly from Hellenic Shipping News (Clarksons Research summaries).

```jsonc
{
  "type": "auto",
  "unit": "ratio",
  "threshold": { "alert": 0.70, "extreme": 0.80 },
  "latest": {
    "value": 0.856,           // secondhand / newbuild ratio
    "asOf": "2026-03-02",
    "newbuildUsdM": 128.5,    // Newbuild price in USD millions
    "secondhand10yrUsdM": 110.0,  // 10-year-old secondhand price
    "sourceUrl": "https://...",
    "alert": true,            // true when ratio >= 0.70
    "extreme": true           // true when ratio >= 0.80
  },
  "history": [
    {
      "date": "2026-03-02",
      "value": 0.856,
      "newbuildUsdM": 128.5,
      "secondhand10yrUsdM": 110.0
    }
  ]
}
```

**Cron**: Every Tuesday 10:00 UTC

**Alert logic**: `ratio >= 0.70` = elevated enthusiasm; `ratio >= 0.80` = extreme (historical tops form here)

### Manual Metrics (updated in JSON file directly)

| ID | Name | Unit | Latest Value | As Of |
|----|------|------|-------------|-------|
| `td3cTce` | VLCC TD3C TCE (Middle East→China) | USD/天 | 451,000 | 2026-04-09 |
| `bdti` | BDTI Baltic Dirty Tanker Index | 点 | 3,658 | 2026-04-09 |
| `vlccEffectiveFleet` | Global Compliant VLCC Effective Fleet | 艘 | 650 | 2026-02-01 |
| `coscoNetIncome` | COSCO SE 2025 Net Income (attributable) | 亿元 | 40.37 | 2026-03-27 |
| `brentOil` | Brent Crude Oil | USD/桶 | 95.71 | 2026-04-09 |
| `hormuzStatus` | Strait of Hormuz Status | — | 近乎封锁, 仅 ~5% 通行 | 2026-04-09 |

Manual metrics have a simpler `latest` structure:

```jsonc
{
  "latest": {
    "value": 451000,          // Number or string
    "asOf": "2026-04-09",     // ISO date
    "note": "战时溢价"         // Optional context note
  }
}
```

### Failure Behavior

- Auto metrics use non-destructive failure: if all scraping sources fail, the existing `latest` and `history` are preserved unchanged. The script exits with code 1 and logs the error.
- `history` arrays are capped at 52 entries (1 year of weekly data).

---

## Cache Behavior

Both JSON files are served as static assets by nginx. Frontend uses hourly cache-busting:

```javascript
fetch(`/data/metals-prices.json?v=${Math.floor(Date.now() / 3600000)}`)
```

Static asset caching (`Cache-Control: public, immutable, max-age=1y`) applies to JS/CSS/images but NOT to `.json` files.

---

## Update Schedule Summary

| Endpoint | Update Frequency | Mechanism |
|----------|-----------------|-----------|
| `metals-prices.json` | Hourly (7 auto metals) | Node.js cron on server |
| `cosco-shipping-energy.json` | Weekly (2 auto indicators) | Python cron on server |
| `cosco-shipping-energy.json` | Ad-hoc (6 manual indicators) | Edit JSON directly |

---

## 3. Company Financial Cards Dataset

```
GET /data/company-financials.jsonl
```

Line-delimited JSON dataset used by shared company finance cards across research reports. Each line is a standalone company record.

### Record Schema

```jsonc
{
  "id": "optical-value-chain/lumentum",
  "companyName": "Lumentum",
  "aliases": ["LITE"],
  "market": "us",
  "reportSlugs": ["2026-04-optical-value-chain"],
  "topics": ["optical-value-chain", "photonics", "optics"],
  "companyProfile": {
    "layerId": "optics",
    "layerTitle": "Optics",
    "ticker": "LITE",
    "fiscalYearEnd": "Jun",
    "badge": "AI optics mainline",
    "business": "..."
  },
  "finance": {
    "schemaVersion": 1,
    "datasetKind": "annual",
    "periodLabel": "FY2024A / FY2025A / FY2026E / FY2027E",
    "periods": ["FY2024A", "FY2025A", "FY2026E", "FY2027E"],
    "unit": "USD mn",
    "series": {
      "revenue": [1359, 1645, 2950, 4800],
      "netProfit": [-546.5, 25.9, 544.8, 1037.4],
      "grossMargin": [18.5, 28.0, null, null]
    },
    "flags": {
      "approximateNetProfit": [false, false, true, true]
    }
  }
}
```

### Notes

- Generated by `scripts/generate-company-financials-jsonl.mjs`
- Regenerated automatically via `npm run build` (`prebuild`)
- Designed for report-level reuse, especially layered pages such as optical communications and semiconductor upstream

---

## 4. Semiconductor Upstream Research Datasets

```
GET /data/semiconductor-upstream-subsegments.jsonl
GET /data/semiconductor-upstream-company-exposures.jsonl
```

Generated JSONL datasets that power the semiconductor upstream research topic.

### `semiconductor-upstream-subsegments.jsonl`

- One record per upstream subsegment
- Includes market size, industry structure, key bottlenecks, localization path, and related companies

### `semiconductor-upstream-company-exposures.jsonl`

- One record per company exposure mapping
- Includes company, geography, related subsegment, role in the value chain, and relevance notes
