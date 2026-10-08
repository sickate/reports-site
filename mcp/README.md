# Instap research MCP

Read-only tools built with the official MCP SDK. No authentication or paid data
source is needed to read this public site's reports.

## Local connection (stdio)

Run `npm install` and `npm run reports:text` from the project root. Configure an
MCP client with the following entry (use the absolute Node executable if needed):

```json
{
  "mcpServers": {
    "instap-reports": {
      "command": "node",
      "args": ["/Users/paw/code/reports-site/mcp/server.mjs"]
    }
  }
}
```

`npm run mcp` also starts stdio, but clients should invoke `node` directly to avoid
npm's stdout logging. The default content root is `public/` relative to this
module, independent of the client's working directory. `REPORTS_CONTENT_ROOT`
can point to a built `dist/` or `/var/www/reports`.

## Tools and resources

- `list_reports({query?})`: report metadata, coverage and available data paths.
- `read_report({slug, offset?, limit?})`: text, metadata and `nextOffset`.
- `get_report_data({slug, assetPath?, offset?, limit?})`: omit `assetPath` to list
  existing assets; otherwise read a path from that list.
- `instap://reports/<slug>` resources provide unpaginated Markdown.

`limit` defaults to 24,000 characters, with a maximum of 100,000. Follow
`nextOffset` until it is null. Text is derived on every production build. Model
Lab includes the complete supplied research, original entities, relationships,
sites and sources. Other reports reuse their initial rendered view, embedded
HTML, authored data modules and associated existing public data files. Coverage
is reported explicitly; interactive tab states are not reconstructed. Asset
reads are allowlisted by report and checked against the content root; no arbitrary
local filesystem or URL fetching is exposed.

Public text exports after website deployment:
`/report-text/index.json` and `/report-text/<slug>.md`.

## HTTP connection and deployment

`npm run mcp:http` starts a stateless Streamable HTTP endpoint at
`http://127.0.0.1:3100/mcp`. GET and DELETE return 405 because this server does not
keep sessions or unsolicited event streams. Host and Origin checks are enabled.
`MCP_ALLOWED_HOSTS` and `MCP_ALLOWED_ORIGINS` accept comma-separated overrides.

For production, first publish the normal site build (including `report-text/`).
Then install this service separately; a static Vite deployment alone does not
start MCP:

```sh
ssh tzhu@maru 'sudo mkdir -p /var/www/instap-reports-mcp && sudo chown tzhu:tzhu /var/www/instap-reports-mcp'
rsync -av mcp/server.mjs mcp/content.mjs mcp/package.json mcp/package-lock.json tzhu@maru:/var/www/instap-reports-mcp/
ssh tzhu@maru 'cd /var/www/instap-reports-mcp && npm ci --omit=dev'
scp mcp/instap-reports-mcp.service tzhu@maru:/tmp/instap-reports-mcp.service
ssh tzhu@maru 'sudo cp /tmp/instap-reports-mcp.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable --now instap-reports-mcp'
```

Add the `location = /mcp` block from the repository's nginx configuration to the
**active HTTPS server block**, keeping the existing Let's Encrypt settings.
Validate with `sudo nginx -t`, then reload nginx. Do not replace the live TLS
configuration with the repository's first-install HTTP template.

The production endpoint is now `https://reports.instap.net/mcp` (published and
verified on 2026-10-08). The steps above also document how to set up another
server. Normal `npm run deploy` updates and restarts an already installed MCP
service; first installation remains explicit. Later server code updates require `systemctl restart instap-reports-mcp`;
report-text/catalog updates also require a restart because the catalog is read at
startup. Node 18+ and `/usr/bin/node` are assumed by the service unit.

Validation: `npm run build` and `npm run test:mcp`. Tests use real SDK clients for
stdio and HTTP, validate complete pagination and resources, and check invalid
report names, asset access, Host and Origin restrictions.
