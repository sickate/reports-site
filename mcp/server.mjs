import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import { z } from 'zod';
import { openContent } from './content.mjs';

const content = await openContent();
const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const pagination = { offset: z.number().int().min(0).default(0), limit: z.number().int().min(1).max(100000).default(24000) };
const respond = (fn) => async (args) => {
  try { return { content: [{ type: 'text', text: JSON.stringify(await fn(args), null, 2) }] }; }
  catch (error) { return { isError: true, content: [{ type: 'text', text: error.message }] }; }
};
export function createServer() {
  const server = new McpServer({ name: 'instap-reports', version: '1.0.0' });
  server.registerTool('list_reports', { description: 'List or search Instap research reports, with text coverage and existing data paths.', inputSchema: { query: z.string().default('') }, annotations }, respond(({ query }) => content.listReports(query)));
  server.registerTool('read_report', { description: 'Read report text. Model Lab includes the complete research, all entities, relations, sites and sources. Other reports reuse initial views and authored data; coverage is explicit. Follow nextOffset until null for the full text.', inputSchema: { slug: z.string(), ...pagination }, annotations }, respond(({ slug, offset, limit }) => content.readReport(slug, offset, limit)));
  server.registerTool('get_report_data', { description: 'List existing report data assets, or read an allowlisted asset as text. Follow nextOffset until null. Only paths listed for the requested report are readable.', inputSchema: { slug: z.string(), assetPath: z.string().optional(), ...pagination }, annotations }, respond(({ slug, assetPath, offset, limit }) => content.getReportData(slug, assetPath, offset, limit)));
  for (const report of content.catalog.reports) {
    const uri = `instap://reports/${report.slug}`;
    server.registerResource(report.slug, uri, { title: report.title, description: `${report.coverage}; ${report.url}`, mimeType: 'text/markdown' }, async () => ({ contents: [{ uri, mimeType: 'text/markdown', text: await content.resource(report.slug) }] }));
  }
  return server;
}
if (process.argv.includes('--http')) {
  const host = process.env.MCP_HOST || '127.0.0.1';
  const port = Number(process.env.MCP_PORT || 3100);
  const allowedHosts = (process.env.MCP_ALLOWED_HOSTS || '127.0.0.1,localhost,reports.instap.net').split(',');
  const allowedOrigins = (process.env.MCP_ALLOWED_ORIGINS || 'https://reports.instap.net').split(',');
  const app = createMcpExpressApp({ host, allowedHosts });
  app.use('/mcp', (req, res, next) => {
    if (req.headers.origin && !allowedOrigins.includes(req.headers.origin)) return res.status(403).json({ error: 'Origin not allowed' });
    next();
  });
  app.post('/mcp', async (req, res) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => { void transport.close(); void server.close(); });
    try { await server.connect(transport); await transport.handleRequest(req, res, req.body); }
    catch (error) {
      console.error(error.message);
      if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', id: null, error: { code: -32603, message: 'Internal server error' } });
    }
  });
  app.all('/mcp', (_req, res) => res.status(405).set('Allow', 'POST').end());
  app.get('/health', (_req, res) => res.json({ status: 'ok', reports: content.catalog.reports.length }));
  const listener = app.listen(port, host, () => console.error(`Instap MCP: http://${host}:${port}/mcp`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => listener.close(() => process.exit(0)));
} else {
  await createServer().connect(new StdioServerTransport());
}
