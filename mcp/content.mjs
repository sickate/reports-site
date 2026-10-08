import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const defaultContentRoot = fileURLToPath(new URL('../public/', import.meta.url));
export async function openContent(root = process.env.REPORTS_CONTENT_ROOT || defaultContentRoot) {
  const base = await realpath(root);
  const read = async (assetPath) => {
    const target = await realpath(path.resolve(base, '.' + assetPath));
    if (!target.startsWith(base + path.sep)) throw new Error('Asset outside report content directory');
    return readFile(target, 'utf8');
  };
  const catalog = JSON.parse(await read('/report-text/index.json'));
  const find = (slug) => {
    const report = catalog.reports.find(r => r.slug === slug);
    if (!report) throw new Error(`Unknown report: ${slug}`);
    return report;
  };
  const page = (value, offset = 0, limit = 24000) => ({ text: value.slice(offset, offset + limit), offset, totalCharacters: value.length, nextOffset: offset + limit < value.length ? offset + limit : null });
  return {
    catalog,
    listReports(query = '') {
      const q = query.toLowerCase();
      return catalog.reports.filter(r => JSON.stringify([r.slug, r.title, r.description, r.tags]).toLowerCase().includes(q));
    },
    async readReport(slug, offset, limit) {
      const report = find(slug);
      return { report, ...page(await read(report.textPath), offset, limit) };
    },
    async getReportData(slug, assetPath, offset, limit) {
      const report = find(slug);
      if (!assetPath) return { slug, dataPaths: report.dataPaths };
      if (!report.dataPaths.includes(assetPath)) throw new Error('Asset is not listed for this report');
      return { slug, assetPath, ...page(await read(assetPath), offset, limit) };
    },
    async resource(slug) { const report = find(slug); return read(report.textPath); },
  };
}
