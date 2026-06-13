# Claude Code Guide

AI collaboration guide for the Instap Research Reports project.

## Project Overview

This is a static website for hosting research reports and data visualizations, deployed at https://reports.instap.net.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Build Tool | Vite 6 |
| Frontend | React 18 |
| Charts | Recharts |
| Styling | CSS (global.css) |
| Deployment | nginx + Let's Encrypt |
| Server | Aliyun Ubuntu VM (maru) |

## Key Files

| File | Purpose |
|------|---------|
| `src/reports/index.js` | Report registry - add new reports here |
| `src/App.jsx` | React Router configuration |
| `src/styles/global.css` | Global styles (dark theme) |
| `public/data/metals-prices.json` | Metal price data (fetched by React, updated by cron) |
| `scripts/deploy.sh` | Build and deploy to server |
| `scripts/update-prices.js` | CLI script for fetching latest prices |
| `nginx/reports.instap.net.conf` | nginx server configuration |

## Common Commands

```bash
# Development
npm run dev          # Start dev server at localhost:5173

# Production
npm run build        # Build to dist/
npm run preview      # Preview production build
npm run deploy       # Build + deploy to server
```

## Adding a New Report

1. Create directory: `src/reports/YYYY-MM-slug/`
2. Add component: `index.jsx` (React) or `index.md` (Markdown)
3. Register in `src/reports/index.js`:

```javascript
export const reports = [
  // ... existing reports
  {
    slug: 'YYYY-MM-new-report',
    title: 'New Report Title',
    description: 'Brief description',
    date: 'YYYY-MM-DD',
    type: 'visualization',  // 'visualization' | 'html' | 'markdown'
    category: 'company',    // 'company' | 'industry' | 'viz' | 'reading'
    tags: ['Tag1', 'Tag2'],
    component: () => import('./YYYY-MM-new-report/index.jsx'),
  },
];
```

### Report Categories

The `category` field drives homepage grouping (defined in `src/reports/index.js` as `REPORT_CATEGORIES`):

| Category | Label | Use for |
|----------|-------|---------|
| `company` | 公司报告 | Single-ticker deep dive / quarterly tracking |
| `industry` | 行业分析 | Sector / value chain / multi-company horizontal comparison |
| `viz` | 可视化研究 | Interactive map / dashboard / 3D simulation |
| `reading` | 读书笔记 | Book reports — collapsed by default on the homepage |

The first three categories render as full-weight sections at the top of the homepage. The `reading` category lives in a collapsed `<details>` block below them, alongside the existing Books series (Rifters reader).

### Tech Company Quarterly Report Template

For company-category quarterly tracking reports, use the reusable template at `docs/templates/tech-company-research/`:

| File | Purpose |
|------|---------|
| `meta.template.js` | reportMeta, narrativePivots, kpiCards |
| `series.template.js` | quarterlySeries + business line / geography / TAC / cost / SBC tables |
| `segments.template.js` | segmentDeepDive, capexGuidance, balance sheet, ops/AI KPIs |
| `valuation.template.js` | SOTP, valuationSnapshot, analystTargets, forwardGuidance |
| `notes.template.js` | earningsCallNotes, riskEvents, watchlist, sanityChecks, sources |
| `PROMPT.md` | Self-contained AI prompt with `{COMPANY_NAME}` / `{TICKER}` / `{FISCAL_QUARTER}` placeholders |
| `README.md` | 3-step workflow + per-export reference + customization notes (Meta=ARPU/DAU, NVDA=Datacenter $bn, etc.) |

Reference implementation: `src/reports/2026-05-google-alphabet/` (the canonical Alphabet Q1 2026 report, also the template's first concrete instance).

To create a new tech company report:
1. Paste `docs/templates/tech-company-research/PROMPT.md` into an AI session, fill in placeholders, and have it return 5 filled JS files
2. Save them to `src/reports/YYYY-MM-{company-slug}/content/`
3. Copy `src/reports/2026-05-google-alphabet/index.jsx` and `components/` into the new directory (or import from a shared location once one exists)
4. Register in `src/reports/index.js` with `category: 'company'`

## Server Information

- **SSH Alias**: `maru`
- **Web Root**: `/var/www/reports`
- **nginx Config**: `/etc/nginx/sites-available/reports.instap.net.conf`
- **SSL Certs**: `/etc/letsencrypt/live/reports.instap.net/`
- **Logs**: `/var/log/nginx/reports.instap.net.*.log`

## Code Style

- Functional React components with Hooks
- Dark theme (colors in CSS variables)
- English UI text
- Component files use `.jsx` extension

## Design Patterns

### Report Loading

Reports are loaded dynamically using React's lazy loading:

```javascript
component: () => import('./path/to/report.jsx')
```

This enables code splitting - each report is a separate chunk.

### Styling

All styles are in `src/styles/global.css` using CSS custom properties:

```css
:root {
  --color-bg-primary: #0f172a;
  --color-text-primary: #e2e8f0;
  /* ... */
}
```

## Deployment Flow

```
Local Machine                    Server (maru)
┌──────────────┐                ┌──────────────┐
│ npm run build│                │              │
│      ↓       │    rsync      │ /var/www/    │
│   dist/      │ ───────────→  │ reports/     │
└──────────────┘                └──────────────┘
```

### First-time Setup (run locally)
```bash
./scripts/server-setup.sh   # Configures server via SSH
```

### Updates
```bash
npm run deploy              # Build + rsync
```

## Current Reports

### Metals Commodity Prices (1975-2026)

Location: `src/reports/2025-01-metals/index.jsx`

**Features:**
- 13 metals: Gold, Silver, Copper, Aluminum, Iron, Nickel, Cobalt, Zinc, Tin, Tungsten, Molybdenum, Lithium, Titanium
- Multi-select comparison with chip-based UI
- Dynamic Y-axis range based on selected metals
- Linear/Log scale toggle
- Time range filter (5/10/20/30/50 years)
- Cycle period markers (ReferenceArea)
- Sub-charts grouped by category:
  - Precious Metals (Gold & Silver) - dual Y-axis
  - Industrial Metals (Copper, Aluminum, Zinc) - normalized %
  - Ferrous Metals (Iron, Cobalt, Nickel) - normalized %
  - Rare Metals (Tin, Tungsten, Molybdenum) - normalized %
  - New Energy Metals (Lithium & Titanium) - dual Y-axis

**Data Architecture:**

Data is stored in `public/data/metals-prices.json` and fetched by the React component:

```json
{
  "lastUpdated": "2026-01-26T12:00:00Z",
  "metals": {
    "gold": {
      "name": "Gold",
      "unit": "USD/oz",
      "color": "#FFD700",
      "data": [{"year": 1975, "price": 161}, ...]
    }
  }
}
```

Price types:
- Historical years: Dec 31 closing price
- Current year: Latest available price

**Auto-Update System:**

Server-side cron job runs every hour:
```bash
# Cron: 0 * * * *
DATA_FILE=/var/www/reports/data/metals-prices.json node /var/www/reports/scripts/update-prices.js
```

Log file: `/var/log/metals-update.log`

**Daily Price Store (for the YTD / Rolling-1Y report):**

The yearly `metals-prices.json` keeps only one point per year. A separate
`public/data/metals-daily.json` keeps one point **per metal per day** over a
rolling ~420-day window, powering `src/reports/2026-06-metals-ytd/`.

| Piece | File | Role |
|-------|------|------|
| Shared store helpers | `scripts/lib/daily-store.mjs` | read / upsert (same-day overwrite) / prune / write |
| History source | `scripts/lib/sources/fred.mjs` | FRED `fredgraph.csv` (daily gold; monthly base/iron/cobalt) |
| Per-metal map | `scripts/lib/sources/registry.mjs` | unit, cadence, FRED series + conversion; `METALS_API_KEY` key-later seam |
| One-time backfill | `scripts/backfill-daily.mjs` | seeds yearly anchors + FRED history; degrades per-metal; re-runnable |
| Ongoing append | `scripts/update-prices.js` | also upserts today's price into the daily store (`DAILY_FILE` env), then prunes |

Data cadence is **honest, not uniform** (surfaced as a tag in the UI):
`daily` (gold, silver, copper, aluminum, nickel, zinc, tin), `monthly`
(iron ore, cobalt — FRED monthly), `manual`/flat (tungsten, molybdenum,
lithium, titanium — no free daily feed). The YTD baseline is the prior
year-end close (always present as a `YYYY-12-31` anchor).

Ops notes:
- The hourly cron must also set `DAILY_FILE`:
  ```bash
  # Cron: 0 * * * *
  DATA_FILE=/var/www/reports/data/metals-prices.json \
  DAILY_FILE=/var/www/reports/data/metals-daily.json \
  node /var/www/reports/scripts/update-prices.js
  ```
- `scripts/deploy.sh` **excludes `data/metals-daily.json`** from the `--delete`
  rsync so deploys never wipe accumulated history. Seed it once on the server:
  `scp public/data/metals-daily.json maru:/var/www/reports/data/`, then run
  `node scripts/backfill-daily.mjs` on `maru` (clean network reaches FRED) to
  enrich history. Deploys keep `scripts/update-prices.js`, `backfill-daily.mjs`,
  and `scripts/lib/` in sync automatically.

**Data Sources & Units:**

| Metal | Unit | Source | Auto-Update |
|-------|------|--------|-------------|
| Gold | USD/oz | gold-api.com (COMEX spot) | Yes |
| Silver | USD/oz | gold-api.com (COMEX spot) | Yes |
| Copper | USD/ton | westmetall.com (LME) | Yes |
| Aluminum | USD/ton | westmetall.com (LME) | Yes |
| Nickel | USD/ton | westmetall.com (LME) | Yes |
| Zinc | USD/ton | westmetall.com (LME) | Yes |
| Tin | USD/ton | westmetall.com (LME) | Yes |
| Iron | USD/ton | Manual (CFR China 62% Fe) | No |
| Cobalt | USD/lb | Manual (LME) | No |
| Tungsten | USD/mtu | Manual (APT 88.5% WO3) | No |
| Molybdenum | USD/lb | Manual (Oxide) | No |
| Lithium | USD/ton | Manual (Battery-grade carbonate) | No |
| Titanium | USD/ton | Manual (Sponge) | No |

**Manual Price Update Notes:**

6 metals require manual price updates in `scripts/update-prices.js`:

1. **Unit Consistency**: Always use USD. If source is CNY, convert to USD.
2. **Product Consistency**: Use the same product type as historical data:
   - Lithium: Battery-grade carbonate (not hydroxide)
   - Titanium: Sponge (not ingot)
   - Iron: 62% Fe fines CFR China
3. **Verify YoY**: After updating, check Year-over-Year change is reasonable (typically <50%)
4. **Data Sources**:
   - Trading Economics: https://tradingeconomics.com/commodities
   - SMM (Shanghai Metals Market): https://www.metal.com
   - Fastmarkets: https://www.fastmarkets.com

To update manual prices:
```javascript
// In scripts/update-prices.js, edit METAL_SOURCES:
lithium: {
  api: 'manual',
  price: 22000,  // Update this value
  unit: 'USD/ton',
  source: 'SMM China',
},
```

Then run: `node scripts/update-prices.js` and `npm run deploy`

### Metals Momentum — YTD & Rolling 1-Year (2026-06)

Location: `src/reports/2026-06-metals-ytd/index.jsx`

Short-horizon companion to the 50-year metals page, driven by the daily store
above (`public/data/metals-daily.json`).

**Features:**
- Toggle between **YTD** and **Rolling 1-Year** modes on a shared one-year
  time axis. YTD pins the axis to the full calendar year (Jan 1 → Dec 31); the
  post-today span renders empty while keeping all month ticks.
- Combined normalized %-change chart (all selected metals rebased to the period
  start = 0%) + a grid of per-metal cards (absolute price line, return badge,
  data-cadence tag).
- Chip multi-select (all 13 metals); dynamic Y `%` domain; cold-start `*`
  marker when the full-period baseline is not yet collected.

### 3D Solar System Simulator (2026-02)

Location: `src/reports/2026-02-solar-system/`

**Features:**
- Interactive 3D solar system with all 8 planets + Pluto
- Realistic orbital mechanics and planet sizes (logarithmic scale)
- Hand gesture control via MediaPipe
- Mouse/touch controls (OrbitControls)
- Fullscreen mode (hides all UI)
- Planet info panel on click

**Tech Stack:**
- Three.js + React Three Fiber
- MediaPipe Tasks Vision (hand tracking)
- Zustand (state management)
- Custom GLSL shaders (sun, atmosphere)

**Hand Gesture Controls:**

| Gesture | Detection | Action |
|---------|-----------|--------|
| ✋ Open hand | All fingers extended | Rotate view (turn hand left/right) |
| 🤏 Single pinch | Thumb + index close | Pan view (move pinched hand) |
| 🤲 Two-hand pinch | Both hands pinching | Zoom (pull hands apart/together) |

**Key Components:**

| File | Purpose |
|------|---------|
| `index.jsx` | Main component, fullscreen toggle |
| `components/SolarSystemScene.jsx` | 3D scene setup |
| `components/Controls/GestureController.jsx` | MediaPipe hand tracking |
| `components/Controls/CameraRig.jsx` | Camera control (mouse + gesture) |
| `hooks/useGestureStore.js` | Zustand store for gesture state |
| `data/planetData.js` | Planet orbital parameters |

**Fullscreen Mode:**
- Click fullscreen button (top-left) to enter
- Hides navbar, footer, and all UI overlays
- Press ESC or click exit button to exit
- Uses `body.solar-system-fullscreen` CSS class

**Adding New Gestures:**

1. Add detection logic in `GestureController.jsx`:
```javascript
const isNewGesture = (landmarks) => {
  // Check landmark positions
  return condition;
};
```

2. Add state/action in `useGestureStore.js`:
```javascript
newGestureActive: false,
newGestureDelta: 0,
updateNewGesture: (value) => set({ ... }),
endNewGesture: () => set({ ... }),
```

3. Handle in `CameraRig.jsx` useFrame loop

## Troubleshooting

### Build fails
- Check Node.js version (18+)
- Delete `node_modules` and reinstall

### Deploy fails
- Verify SSH access: `ssh maru`
- Check server disk space

### SSL issues
- Check certbot timer: `systemctl status certbot.timer`
- Manual renewal: `sudo certbot renew`
