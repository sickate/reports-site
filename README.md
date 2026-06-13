# Instap Research Reports

Static website for research reports and data visualizations.

**Live Site**: https://reports.instap.net

## Tech Stack

- **Build**: Vite 6
- **Frontend**: React 18
- **Charts**: Recharts
- **3D Graphics**: Three.js + React Three Fiber (for interactive visualizations)
- **Deployment**: nginx + Let's Encrypt (Aliyun VM)

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Generate shared research datasets
# (also runs automatically before npm run build)
node scripts/generate-company-financials-jsonl.mjs

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### First-time Server Setup

Run locally (configures remote server via SSH):

```bash
./scripts/server-setup.sh
```

This will:
1. Create `/var/www/reports` on the server
2. Upload nginx configuration
3. Enable the site and test nginx
4. Request SSL certificate via certbot
5. Reload nginx

### Deploy Updates

```bash
npm run deploy
```

This builds the project locally and syncs the `dist/` folder to the server via rsync.

## Adding New Reports

### React Visualization Report

1. Create directory: `src/reports/YYYY-MM-slug/`
2. Create `index.jsx` with your React component
3. Register in `src/reports/index.js`:

```javascript
{
  slug: 'YYYY-MM-slug',
  title: 'Report Title',
  description: 'Brief description',
  date: 'YYYY-MM-DD',
  type: 'visualization',
  tags: ['Tag1', 'Tag2'],
  component: () => import('./YYYY-MM-slug/index.jsx'),
}
```

4. Deploy: `npm run deploy`

### Markdown Report

1. Create directory: `src/reports/YYYY-MM-slug/`
2. Create `index.md` with frontmatter:

```markdown
---
title: Report Title
date: YYYY-MM-DD
tags: [Tag1, Tag2]
---

# Content here
```

3. Register with `type: 'markdown'` in `src/reports/index.js`

## Project Structure

```
reports-instap/
├── src/
│   ├── components/     # Shared React components
│   ├── lib/            # Shared data/report rendering utilities
│   ├── pages/          # Page components
│   ├── reports/        # Report content
│   │   ├── index.js    # Report registry
│   │   └── YYYY-MM-*/  # Individual reports
│   └── styles/         # Global styles
├── scripts/
│   ├── deploy.sh       # Deployment script
│   ├── generate-company-financials-jsonl.mjs  # Shared finance dataset generator
│   └── server-setup.sh # Server initialization
├── nginx/              # nginx configuration
└── public/
    ├── data/           # JSON / JSONL datasets consumed by reports
    ├── research-topics/# Topic landing pages and generated research assets
    └── textures/       # Texture assets for 3D visualizations
        └── planets/    # Planet textures (CC BY 4.0 from Solar System Scope)
```

## Data Pipeline

- `npm run build` now runs `prebuild`, which generates shared research datasets such as `public/data/company-financials.jsonl`
- Report pages can reuse shared company finance cards and generated JSONL instead of hardcoding tables into each page
- Deployment now validates that `dist/data/company-financials.jsonl` exists before syncing to the server
- Daily metals price store (`public/data/metals-daily.json`) accumulates one point per metal per day over a rolling ~420-day window: seeded by `scripts/backfill-daily.mjs` (FRED history) and appended hourly by `scripts/update-prices.js`. It is excluded from the deploy `--delete` so accumulated history survives deploys

## Recent Research Topics

- `2026-06-metals-ytd`: 13 种金属的 YTD / 滚动一年价格动量页（共用整年横轴，按日累积）
- `2026-04-optical-value-chain`: 光通信产业链价值捕获点、架构图示与分层财务卡片
- `2026-04-semiconductor-upstream`: 半导体上游产业链关系图与细分赛道数据
- `2026-04-high-voltage-platform`: 800V 高压平台升级与产业链映射
- `2026-04-global-lithium`: 全球锂资源项目地图与数据库
- `2026-04-commercial-space`: 商业航天催化时间轴与火箭爆炸图
- `2026-04-elon-musk-factories`: Tesla / SpaceX 全球制造基地地图

## Texture Credits

Planet textures are from [Solar System Scope](https://www.solarsystemscope.com/textures/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license. These textures are based on NASA elevation and imagery data.

## Server Information

- **Host**: Aliyun Ubuntu VM (alias: `maru`)
- **Web Root**: `/var/www/reports`
- **nginx Config**: `/etc/nginx/sites-available/reports.instap.net.conf`
- **SSL**: Let's Encrypt (auto-renewal via certbot timer)

## License

Private - Instap Research
