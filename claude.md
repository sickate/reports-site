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
| `scripts/deploy.sh` | Build and deploy to server |
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
    type: 'visualization',  // or 'markdown'
    tags: ['Tag1', 'Tag2'],
    component: () => import('./YYYY-MM-new-report/index.jsx'),
  },
];
```

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

**Data Structure:**
```javascript
// Raw price data arrays
const goldData = [{ year: 1975, price: 161 }, ...];

// Normalized data (calculated)
const normalizedData = goldData.map((_, index) => ({
  year: goldData[index].year,
  gold: parseFloat(((goldData[index].price / basePrice) * 100).toFixed(1)),
  // ... other metals
}));
```

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
