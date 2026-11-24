import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { markerValue, markerRadius, filterSites, projectRows, csv, electionCsv, summarizeCompanies, companyChartConfig } from '../../src/reports/2026-11-data-center-ballots/model.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../../public/data/data-center-ballots.json',import.meta.url)));
const base={q:'',state:'',company:'',policy:'',flipOnly:false};
test('circle area is proportional to disclosed capacity, not its square',()=>{
  const area=v=>Math.PI*markerRadius(v)**2;
  assert.ok(Math.abs(area(1000)/area(250)-4)<1e-10);
  assert.ok(Math.abs(markerRadius(5,'budget')-markerRadius(1000,'mw'))<1e-10);
});
test('two Trenton projects are not summed, and developer filter changes sizing scope',()=>{
  const s=data.sites.find(s=>s.id==='trenton');assert.equal(s.projects.length,2);assert.equal(markerValue(s),1000);
  const rows=projectRows(filterSites(data.sites,{...base,company:'prologis'},data.elections),'prologis');
  assert.deepEqual(rows.map(r=>r.mw),[250]);
  assert.equal(markerValue({...s,projects:s.projects.filter(p=>p.companyKeys.includes('prologis'))}),250);
});
test('unknown capacity stays unknown; qualitative GW estimate is not numeric MW',()=>{
  const s=data.sites.find(s=>s.id==='emporia');assert.equal(markerValue(s),null);assert.equal(s.projects[0].mw,null);
  assert.equal(markerValue(data.sites.find(s=>s.id==='sunbury')),null);
});
test('flip-only filter uses verified state results and keeps pending Kansas out',()=>{
  const shown=filterSites(data.sites,{...base,flipOnly:true},data.elections);assert.ok(shown.length>0);assert.ok(shown.every(s=>s.state==='OH'));
  assert.equal(data.elections.KS.status,'pending');assert.equal(data.elections.KS.newParty,null);
  assert.equal(data.elections.NJ.status,'no-election');
  assert.deepEqual(Object.values(data.elections).filter(e=>e.governorFlip).map(e=>e.stateCode).sort(),['GA','IA','OH','TX']);
  assert.ok(Object.values(data.elections).every(e=>e.certified===false&&e.assumedOffice===false));
});
test('data identities, geographic state mapping and sources are intact',()=>{
  assert.equal(data.sites.length,18);assert.equal(projectRows(data.sites).length,20);
  const g=JSON.parse(fs.readFileSync(new URL('../../public/data/data-center-us-states.geojson',import.meta.url)));
  const codes=new Set(g.features.map(f=>f.properties.postal));assert.equal(codes.size,49);
  assert.equal(new Set(data.sites.map(s=>s.id)).size,18);
  assert.equal(new Set(projectRows(data.sites).map(p=>p.id)).size,20);
  for(const s of data.sites){assert.ok(codes.has(s.state));assert.ok(s.lat>24&&s.lat<50&&s.lng>-126&&s.lng<-66);assert.ok(s.sources.length>0);}
});
test('CSV includes caveats, source URLs, planned basis and blank unknown MW',()=>{
  const s=data.sites.find(s=>s.id==='sunbury');const output=csv(projectRows([s]),data.elections);
  assert.ok(output.includes('Planned MW'));assert.ok(output.includes('Capacity basis'));assert.ok(output.includes('https://'));
  assert.match(output,/"Sunbury","OH".+"Sunbury 拟建园区","",/);
});
test('state CSV exports party changes and preserves pending control as blank',()=>{
  const output=electionCsv([data.elections.KS]);
  assert.ok(output.includes('Incoming party'));assert.ok(output.includes('Certified'));
  assert.ok(output.includes('"Laura Kelly","D","","","false","pending"'));
  assert.ok(!output.includes('Planned MW'));
});

test('company aggregation preserves shared roles, unknown MW and indirect equity',()=>{
  const s=summarizeCompanies(data.sites);const by=Object.fromEntries(s.companies.map(c=>[c.id,c]));
  assert.equal(by.amazon.projectCount,3);assert.equal(by.amazon.knownMw,1250);assert.equal(by.amazon.unknownMwCount,1);
  assert.equal(by.prologis.knownMw,250);assert.equal(by.microsoft.knownMw,null);assert.equal(by.nvidia.indirect,true);
  assert.equal(by.nvidia.knownMw,by.cloverleaf.knownMw);assert.equal(s.historicalExcludedCount,2);assert.equal(s.unattributedCount,8);
  assert.ok(!by.crane);assert.ok(!by.aligned);
  for(const c of s.companies)assert.equal(Object.values(c.policies).reduce((a,b)=>a+b,0),c.projectCount);
});
test('company chart excludes unknown MW while count and history use their own scope',()=>{
  const current=summarizeCompanies(data.sites),full=summarizeCompanies(data.sites,{includeHistorical:true});
  assert.equal(full.companies.find(c=>c.id==='crane').knownMw,300);assert.equal(full.companies.find(c=>c.id==='aligned').historicalCount,1);
  const mw=companyChartConfig(current,'mw'),count=companyChartConfig(current,'count');
  assert.ok(!mw.rows.some(r=>r.company==='Microsoft'));assert.ok(count.rows.some(r=>r.company==='Microsoft'));
  assert.equal(mw.spec.type,'horizontalStackedBar');assert.ok(mw.height>=40+20*mw.rows.length);
  const one=summarizeCompanies([data.sites.find(s=>s.id==='trenton')]);assert.equal(one.companies.find(c=>c.id==='amazon').knownMw,1250);
  const duplicated=summarizeCompanies([data.sites.find(s=>s.id==='trenton'),data.sites.find(s=>s.id==='trenton')]);assert.equal(duplicated.companies.find(c=>c.id==='amazon').projectCount,2);
});
