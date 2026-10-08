import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { openContent } from './content.mjs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { request } from 'node:http';

const slug = '2026-10-model-lab-network';
const parse = (r) => JSON.parse(r.content[0].text);
async function checkClient(client) {
  assert.deepEqual((await client.listTools()).tools.map(t => t.name).sort(), ['get_report_data','list_reports','read_report']);
  const reports = parse(await client.callTool({ name: 'list_reports', arguments: { query: 'Anthropic' } }));
  assert.ok(reports.some(r => r.slug === slug));
  let text = '', offset = 0;
  do {
    const result = parse(await client.callTool({ name: 'read_report', arguments: { slug, offset, limit: 8000 } }));
    text += result.text; offset = result.nextOffset;
  } while (offset !== null);
  for (const name of ['TeraWulf','Hut 8','Lambda','Nscale','Akamai','OpenAI','DeepMind']) assert.ok(text.includes(name), name);
  const source = await openContent();
  assert.equal(text, await source.resource(slug));
  const data = parse(await client.callTool({ name: 'get_report_data', arguments: { slug, assetPath:'/data/model-lab-network.json', limit:100000 } }));
  assert.ok(data.text.includes('ant-akamai-warrants'));
  const denied = await client.callTool({ name: 'get_report_data', arguments: { slug, assetPath:'/../../package.json' } });
  assert.equal(denied.isError, true);
  assert.equal((await client.callTool({name:'read_report',arguments:{slug:'nonexistent'}})).isError,true);
  assert.ok((await client.listResources()).resources.some(r => r.uri === 'instap://reports/' + slug));
  assert.equal((await client.readResource({uri:'instap://reports/'+slug})).contents[0].text, text);
}
test('all reports export existing content; network references are valid', async () => {
  const content = await openContent();
  for (const r of content.listReports()) {
    const text = await content.resource(r.slug);
    assert.ok(text.length > r.description.length + 100);
    for (const assetPath of r.dataPaths) assert.ok((await content.getReportData(r.slug, assetPath, 0, 10)).totalCharacters > 0);
  }
  const data = JSON.parse(await readFile(new URL('../public/data/model-lab-network.json', import.meta.url)));
  const ids = new Set(data.entities.map(e => e.id));
  const sources = new Set(data.sources.map(s => s.id));
  assert.equal(ids.size, data.entities.length);
  assert.equal(data.entities.filter(e => e.name === 'TeraWulf').length, 1);
  assert.equal(new Set(data.relations.map(r=>r.id)).size, data.relations.length);
  for (const site of data.sites) {
    assert.ok(['planned', 'construction', 'operational'].includes(site.status), site.id + ': ' + site.status);
    for (const id of [...site.entities, ...site.labs]) assert.ok(ids.has(id), site.id + ':' + id);
    for (const id of site.sources) assert.ok(sources.has(id), site.id + ':' + id);
  }
  for (const r of data.relations) {
    assert.ok(ids.has(r.source), r.id); assert.ok(ids.has(r.target), r.id);
    for (const s of r.sources) assert.ok(sources.has(s), r.id + ':' + s);
  }
});
test('OpenAI integration separates shared amounts, cancellations and negative findings', async () => {
  const data = JSON.parse(await readFile(new URL('../public/data/model-lab-network.json', import.meta.url)));
  const records = JSON.parse(await readFile(new URL('../public/research-topics/model-lab-network/openai-research-records.json', import.meta.url)));
  const covered = new Set(data.relations.map(r => r.researchRecord));
  records.forEach((record, index) => {
    if (record.relationship_type !== 'other') assert.ok(covered.has(index), 'Missing supplied record ' + index);
  });
  assert.equal(data.meta.openaiFundingRound.committedCapitalB, 122);
  assert.equal(data.meta.openaiCreditFacility.drawnAtCloseB, 0);
  for (const relation of data.relations) {
    if (relation.facilityId || (relation.roundId && relation.id.startsWith('openai-research-'))) {
      assert.equal(relation.amountB, null, 'Shared amount allocated to ' + relation.id);
    }
  }
  for (const id of ['oai-no-nscale', 'oai-no-aker', 'oai-uk']) {
    const relation = data.relations.find(r => r.id === id);
    assert.equal(relation.status, 'cancelled');
    assert.equal(relation.attribution, 'historical');
  }
  for (const finding of data.meta.openaiNegativeFindings) {
    assert.ok(!data.relations.some(r =>
      (r.source === 'openai' && r.target === finding.counterparty) ||
      (r.target === 'openai' && r.source === finding.counterparty)), finding.counterparty);
  }
});
test('real MCP stdio client: discovery, full pagination, assets, errors and resources', async () => {
  const client = new Client({name:'instap-test',version:'1.0.0'});
  const transport = new StdioClientTransport({command:process.execPath,args:[fileURLToPath(new URL('./server.mjs',import.meta.url))]});
  try { await client.connect(transport); await checkClient(client); } finally { await client.close(); }
});
test('real Streamable HTTP client and origin / host restrictions', async () => {
  const port = 13100;
  const child = spawn(process.execPath, [fileURLToPath(new URL('./server.mjs',import.meta.url)), '--http'], {env:{...process.env,MCP_PORT:String(port)},stdio:['ignore','ignore','pipe']});
  const client = new Client({name:'instap-http-test',version:'1.0.0'});
  try {
    await Promise.race([once(child.stderr,'data'),once(child,'exit').then(()=>{throw new Error('HTTP server exited');}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Startup timed out')),10000).unref())]);
    await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`)));
    await checkClient(client);
    assert.equal((await fetch(`http://127.0.0.1:${port}/mcp`,{method:'POST',headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},body:'{}'})).status,403);
    const hostStatus = await new Promise((resolve,reject) => { const req = request(`http://127.0.0.1:${port}/health`, {headers:{Host:'untrusted.example'}}, res => { res.resume(); resolve(res.statusCode); }); req.on('error',reject); req.end(); });
    assert.equal(hostStatus,403);
  } finally { await client.close(); child.kill('SIGTERM'); await once(child,'exit'); }
});
