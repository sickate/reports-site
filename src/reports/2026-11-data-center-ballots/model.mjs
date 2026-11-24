export const POLICY = {
  ban: { label: 'Construction ban', zh: '新建 / 规模禁令', color: '#f18ca7' },
  moratorium: { label: 'Temporary pause', zh: '临时暂停', color: '#c0a0ef' },
  zoning: { label: 'Rezoning rejected', zh: '土地改划遭否决', color: '#e3a574' },
  conditions: { label: 'Cost / approval gate', zh: '税惠条件 / 公投关口', color: '#eed080' },
  advisory: { label: 'Advisory vote', zh: '无约束力咨询票', color: '#6ed0c5' },
  recall: { label: 'Recall only', zh: '官员罢免', color: '#9fb2cb' },
};
export const STAGE = { planned: 'Proposed', construction: 'Under construction', paused: 'On hold', rejected: 'Previously rejected', terminated: 'Previously terminated', land: 'Land bank', unknown: 'Not disclosed' };
export const COMPANY_META = {
  amazon: { label:'Amazon / AWS', role:'云服务使用方', ticker:'AMZN' },
  meta: { label:'Meta', role:'自用算力园区', ticker:'META' },
  prologis: { label:'Prologis', role:'开发商；与 AWS 共享同一项目', ticker:'PLD' },
  microsoft: { label:'Microsoft', role:'储备土地', ticker:'MSFT' },
  nvidia: { label:'NVIDIA (indirect)', role:'Cloverleaf 少数股权；非园区业主', ticker:'NVDA', indirect:true },
  aligned: { label:'Aligned', role:'开发商；历史已拒方案' },
  thor: { label:'Thor Equities', role:'私人开发商' },
  crane: { label:'Crane Data Centers', role:'开发商；作者归因的历史方案' },
  kanza: { label:'Kanza Park Place', role:'私人开发商；租户未披露' },
  province: { label:'Province Group', role:'私人开发商' },
  cloverleaf: { label:'Cloverleaf', role:'私人开发商' },
  beltline: { label:'Beltline Energy', role:'跨辖区园区开发商' },
};
export function summarizeCompanies(sites, { includeHistorical = false } = {}) {
  const groups = new Map(), excluded = new Set(), unattributed = new Set();
  for (const site of sites) for (const project of site.projects) {
    const historical = ['rejected','terminated'].includes(project.stage);
    if (historical && !includeHistorical) { excluded.add(project.id); continue; }
    if (!project.companyKeys.length) { unattributed.add(project.id); continue; }
    for (const id of new Set(project.companyKeys)) {
      if (!COMPANY_META[id]) continue;
      if (!groups.has(id)) groups.set(id, { id,...COMPANY_META[id],projects:new Map() });
      groups.get(id).projects.set(project.id, { ...project, siteId:site.id, city:site.city, state:site.state, policy:site.policy, historical, sources:[...new Set([...site.sources,...project.sources])] });
    }
  }
  const companies = [...groups.values()].map(group => {
    const projects=[...group.projects.values()];
    const known=projects.filter(p=>Number.isFinite(p.mw));
    const policies=Object.fromEntries(Object.keys(POLICY).map(k=>[k,0]));
    const mwByPolicy={...policies};
    for (const p of projects) { policies[p.policy]+=1; if (Number.isFinite(p.mw)) mwByPolicy[p.policy]+=p.mw; }
    return { ...group,projects,projectCount:projects.length,knownMw:known.length?known.reduce((sum,p)=>sum+p.mw,0):null,unknownMwCount:projects.length-known.length,historicalCount:projects.filter(p=>p.historical).length,policies,mwByPolicy,states:[...new Set(projects.map(p=>p.state))] };
  });
  return { companies, historicalExcludedCount:excluded.size, unattributedCount:unattributed.size };
}
export function companyChartConfig(summary, metric='count') {
  const ordered=[...summary.companies].sort((a,b)=>metric==='mw'?(b.knownMw??-1)-(a.knownMw??-1)||a.label.localeCompare(b.label):b.projectCount-a.projectCount||a.label.localeCompare(b.label));
  const plotted=metric==='mw'?ordered.filter(c=>c.knownMw!=null):ordered;
  const fields=Object.values(POLICY).map(p=>p.zh);
  return { id:'dc-company-exposure', title:metric==='mw'?'已披露关联规划容量（MW）':'关联项目数量，按限制类型', height:Math.max(300,95+plotted.length*43),
    summary:'按公司关联汇总，跨公司共享项目重复出现，不可加总为全国容量或财务损失；未知 MW 不计为零。',
    spec:{type:'horizontalStackedBar',x:fields,y:'company',yOrder:plotted.map(c=>c.label),xLabel:metric==='mw'?'已披露关联规划 MW（非损失）':'关联项目数',startAtZero:true,showValues:true,showLegend:true,colors:Object.fromEntries(Object.values(POLICY).map(p=>[p.zh,p.color])),valueFormat:{style:'decimal',maximumFractionDigits:0}},
    rows:plotted.map(c=>({
      company:c.label,
      ...Object.fromEntries(Object.keys(POLICY).map(k=>[
        POLICY[k].zh,metric==='mw'?c.mwByPolicy[k]:c.policies[k],
      ])),
    })),
  };
}
export function markerValue(site, metric = 'mw') {
  const values = site.projects.map(p => metric === 'mw' ? p.mw : p.capexB).filter(v => Number.isFinite(v) && v > 0);
  return values.length ? Math.max(...values) : null;
}
export function markerRadius(value, metric = 'mw') {
  if (value == null) return 7;
  return 28 * Math.sqrt(value / (metric === 'mw' ? 1000 : 5));
}
export function capacityLabel(project) {
  if (project.mw != null) return project.mw >= 1000 ? `${(project.mw / 1000).toLocaleString('en-US')} GW` : `${project.mw.toLocaleString('en-US')} MW`;
  return project.capacityText || 'MW 未披露';
}
export function budgetLabel(project) { return project.capexB == null ? '未披露' : `${project.capexQualifier || ''}$${project.capexB.toLocaleString('en-US')}B`; }
export function electionLabel(e) {
  if (!e) return '尚未核实州级结果';
  if (e.governorFlip) return `${e.priorParty} → ${e.newParty} · ${e.winner}`;
  return e.note || '未确认换党';
}
export function filterSites(sites, filters, elections) {
  const q = filters.q.trim().toLowerCase();
  return sites.filter(s => (!filters.policy || s.policy === filters.policy)
    && (!filters.state || s.state === filters.state)
    && (!filters.flipOnly || elections[s.state]?.governorFlip === true)
    && (!filters.company || s.projects.some(p => p.companyKeys.includes(filters.company)))
    && (!q || [s.city, s.state, s.nameZh, s.policyText, ...s.projects.flatMap(p => [p.company, p.name, p.tickers.join(' ')])].join(' ').toLowerCase().includes(q)));
}
export function projectRows(sites, company = '', sort = 'mw') {
  const rows = sites.flatMap(s => s.projects.filter(p => !company || p.companyKeys.includes(company)).map(p => ({ ...p, site: s })));
  return rows.sort((a,b) => sort === 'place' ? a.site.city.localeCompare(b.site.city) : sort === 'budget' ? (b.capexB ?? -1) - (a.capexB ?? -1) : (b.mw ?? -1) - (a.mw ?? -1));
}
export function csv(rows, elections) {
  const header = ['City','State','Developer / user','Ticker','Project','Planned MW','Capacity basis','Budget USD B','Budget basis','Stage','Policy type','Election-night result','Governor change','Impact','Caveat','Sources'];
  const values = rows.map(p => [p.site.city,p.site.state,p.company,p.tickers.join(' / '),p.name,p.mw,p.capacityBasis,p.capexB,p.capexQualifier,STAGE[p.stage],POLICY[p.site.policy].label,p.site.result,electionLabel(elections[p.site.state]),p.impact,p.caveat,[...new Set([...p.site.sources,...p.sources])].join(' | ')]);
  const quote = v => `"${String(v ?? '').replaceAll('"','""')}"`;
  return '\ufeff' + [header,...values].map(r => r.map(quote).join(',')).join('\r\n');
}
export function electionCsv(rows) {
  const cells=[['State','Code','Outgoing governor','Prior party','Winner called','Incoming party','Governor party flip','Race status','House','Senate','AP call UTC','Certified','Assumed office','Notes','Sources'],...rows.map(e=>[e.name,e.stateCode,e.priorGovernor,e.priorParty,e.winner,e.newParty,e.governorFlip,e.status,e.house,e.senate,e.calledAt,e.certified,e.assumedOffice,e.note,e.sources.join(' | ')])];
  return '\ufeff'+cells.map(row=>row.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\r\n');
}
