import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { reports } from '../src/reports/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');
const out = path.join(publicRoot, 'report-text');
await mkdir(out, { recursive: true });
const decode = (s) => s.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)))
  .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
function textFromHtml(html) {
  return decode(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, '$2 ($1)')
    .replace(/<\/(?:p|div|section|article|h[1-6]|tr|li|pre|header)>/gi, '\n')
    .replace(/<(?:br|hr)\b[^>]*>/gi, '\n').replace(/<\/(?:td|th)>/gi, ' | ')
    .replace(/<[^>]*>/g, '')).replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n/g, '\n\n').trim();
}
const isInside = (base, p) => p.startsWith(base + path.sep);
async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(p)); else result.push(p);
  }
  return result;
}
const publicFiles = (await walk(publicRoot)).filter(p => !p.startsWith(out + '/') && !p.includes('/legacy/') && (/\.(jsonl?|geojson|csv|tsv|md|txt|html)$/.test(p) || (p.includes('/research-topics/') && /\/(?:data|content)[^/]*\.js$|\/data\/.*\.js$/.test(p))));
const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
const catalog = [];
try {
  for (const report of reports) {
    const reportDir = path.join(root, 'src/reports', report.slug);
    const seen = new Set();
    const authoredData = new Set();
    const linkedFiles = new Set();
    async function visit(file) {
      if (seen.has(file) || !isInside(root, file)) return;
      seen.add(file);
      let source;
      try { source = await readFile(file, 'utf8'); } catch { return; }
      if (/\.(js|json|md|csv|tsv)$/.test(file) && file !== path.join(root, 'src/reports/index.js')) authoredData.add(file);
      for (const m of source.matchAll(/(?:from\s*|import\s*\(|import\s*)['"](\.[^'"]+)['"]/g)) {
        const base = path.resolve(path.dirname(file), m[1]);
        for (const suffix of ['', '.js', '.jsx', '/index.js', '/index.jsx']) {
          try { if ((await stat(base + suffix)).isFile()) { await visit(base + suffix); break; } } catch { /* Try next extension. */ }
        }
      }
      for (const m of source.matchAll(/['"`](\/(?:data|research-topics|researches)\/[^'"`?#\s]+)['"`]/g)) {
        const target = path.resolve(publicRoot, '.' + m[1]);
        if (!isInside(publicRoot, target)) continue;
        linkedFiles.add(target);
        if (target.endsWith('.html')) {
          try {
            const html = await readFile(target, 'utf8');
            for (const match of html.matchAll(/(?:src|href)=["'](\.[^"']+)["']/g)) await visit(path.resolve(path.dirname(target), match[1]));
          } catch { /* Missing assets are reported through coverage. */ }
        }
      }
    }
    await visit(path.join(reportDir, 'index.jsx'));
    const topic = report.slug.replace(/^\d{4}-\d{2}-/, '');
    let assets = publicFiles.filter(file => linkedFiles.has(file) || file.includes('/' + topic + '/') || path.basename(file).startsWith(topic) || (topic === 'model-lab-network' && file.endsWith('/model-lab-world.geojson')));
    if (topic.includes('metals')) assets.push(...publicFiles.filter(file => /\/metals-(prices|daily)\.json$/.test(file)));
    let body = '';
    let coverage = 'rendered-initial-view-and-existing-data';
    let failure = null;
    if (report.slug === '2026-10-model-lab-network') {
      body = await readFile(path.join(publicRoot, 'research-topics/model-lab-network/research.md'), 'utf8');
      body = await readFile(path.join(publicRoot, 'research-topics/model-lab-network/openai-research.md'), 'utf8') + '\n\n' + body;
      const data = JSON.parse(await readFile(path.join(publicRoot, 'data/model-lab-network.json'), 'utf8'));
      body += '\n\n## Existing network and integration policy\n\n' + Object.entries(data.meta).map(([k,v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`).join('\n');
      body += '\n\nThe supplied draft’s SpaceX assessment is limited to its own search scope. Existing official Anthropic–SpaceX evidence is preserved separately in the network.\n';
      for (const key of ['entities', 'relations', 'sites', 'sources']) body += `\n\n## ${key}\n\n` + data[key].map(row => JSON.stringify(row)).join('\n\n');
      coverage = 'complete-research-and-network-data';
    } else {
      try {
        const module = await vite.ssrLoadModule('/src/reports/' + report.slug + '/index.jsx');
        body = textFromHtml(renderToStaticMarkup(React.createElement(StaticRouter, { location: '/reports/' + report.slug }, React.createElement(module.default))));
      } catch (error) {
        failure = 'Initial view could not be rendered at build time; existing authored data is supplied.';
        coverage = 'existing-authored-data';
        console.error(`[report-text] ${report.slug}: ${error.message.split('\n')[0]}`);
      }
      for (const file of linkedFiles) if (file.endsWith('.html')) {
        try { body += '\n\n## Embedded report\n\n' + textFromHtml(await readFile(file, 'utf8')); } catch { /* No authored HTML. */ }
      }
      // Keep existing data modules intact rather than reconstructing other reports.
      for (const file of authoredData) {
        body += '\n\n## Existing authored data: ' + path.relative(root, file) + '\n\n```\n' + await readFile(file, 'utf8') + '\n```\n';
      }
    }
    assets = [...new Set(assets)].sort();
    if (await readFile(path.join(publicRoot, 'data/company-financials.jsonl'), 'utf8').then(text => text.includes(report.slug))) assets.push(path.join(publicRoot, 'data/company-financials.jsonl'));
    assets = [...new Set(assets)].sort();
    const dataPaths = assets.map(file => '/' + path.relative(publicRoot, file));
    const text = `# ${report.title}\n\nReport: https://reports.instap.net/reports/${report.slug}\nDate: ${report.date}\nCoverage: ${coverage}\n\n${report.description}\n\n${failure || ''}\n\n${body}\n\n## Existing data files\n\n${dataPaths.map(p => `- https://reports.instap.net${p}`).join('\n')}\n`;
    await writeFile(path.join(out, report.slug + '.md'), text);
    catalog.push({ slug: report.slug, title: report.title, description: report.description, date: report.date, tags: report.tags, category: report.category, url: `https://reports.instap.net/reports/${report.slug}`, textPath: `/report-text/${report.slug}.md`, coverage, dataPaths, textLength: text.length });
  }
  await writeFile(path.join(out, 'index.json'), JSON.stringify({ schemaVersion: 1, reports: catalog }, null, 2) + '\n');
  console.log(`Generated text exports for ${catalog.length} reports.`);
} finally { await vite.close(); }
