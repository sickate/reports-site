# Instap Research Reports

Static website for research reports and data visualizations.

**Live Site**: https://reports.instap.net

## Tech Stack

- **Build**: Vite 6
- **Frontend**: React 18
- **Charts**: Recharts
- **Deployment**: nginx + Let's Encrypt (Aliyun VM)

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

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
│   ├── pages/          # Page components
│   ├── reports/        # Report content
│   │   ├── index.js    # Report registry
│   │   └── YYYY-MM-*/  # Individual reports
│   └── styles/         # Global styles
├── scripts/
│   ├── deploy.sh       # Deployment script
│   └── server-setup.sh # Server initialization
├── nginx/              # nginx configuration
└── public/             # Static assets
```

## Server Information

- **Host**: Aliyun Ubuntu VM (alias: `maru`)
- **Web Root**: `/var/www/reports`
- **nginx Config**: `/etc/nginx/sites-available/reports.instap.net.conf`
- **SSL**: Let's Encrypt (auto-renewal via certbot timer)

## License

Private - Instap Research
