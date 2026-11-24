import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw } from 'lucide-react';
import { POLICY, summarizeCompanies, companyChartConfig } from './model.mjs';

const CHART_RUNTIME='https://persistent.oaistatic.com/plugins/visualize/charts/data-analytics-plugin/1.2.1/charts/element.js';
let runtimePromise;
function StandardChart({ config }) {
  const container=useRef(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  useEffect(()=>{
    let cancelled=false,chart=null;
    setError('');setLoading(true);
    const timer=setTimeout(()=>{if(!cancelled){setLoading(false);setError('图表加载超时；可展开下方 Company totals 查看同口径数值。');}},20000);
    runtimePromise ||= import(/* @vite-ignore */ CHART_RUNTIME).catch(e=>{runtimePromise=null;throw e;});
    runtimePromise.then(({mountChart})=>{
      if(cancelled)return;
      clearTimeout(timer);setError('');container.current.replaceChildren();chart=mountChart(container.current,config);setLoading(false);
    }).catch(()=>{if(!cancelled){clearTimeout(timer);setLoading(false);setError('图表暂未能加载；下方 Company totals 保留完整汇总及原始来源。');}});
    return()=>{cancelled=true;clearTimeout(timer);if(chart?.destroy)chart.destroy();container.current?.replaceChildren();};
  },[config]);
  return <div className="dc-standard-chart" data-data-chart data-appearance="dark" style={{minHeight:config.height}}>{loading&&<p className="dc-chart-loading" role="status">Loading company chart…</p>}{error?<p role="alert" className="dc-chart-error">{error}</p>:null}<div ref={container} data-viz-container style={{minHeight:config.height}}/></div>;
}
function Sources({ projects }) {
  return <div className="dc-sources">{[...new Set(projects.flatMap(p=>p.sources))].map((url,i)=><a key={url} href={url} target="_blank" rel="noreferrer">[{i+1}] {new URL(url).hostname.replace('www.','')}</a>)}</div>;
}
export default function CompanySummary({ sites, selectedCompany, onSelectCompany }) {
  const [metric,setMetric]=useState('mw'),[includeHistorical,setIncludeHistorical]=useState(false);
  const summary=useMemo(()=>summarizeCompanies(sites,{includeHistorical}),[sites,includeHistorical]);
  const config=useMemo(()=>companyChartConfig(summary,metric),[summary,metric]);
  const unknown=summary.companies.filter(c=>c.knownMw==null);
  const details=summary.companies.find(c=>c.id===selectedCompany);
  const leading=config.rows[0];
  const selectCompany=id=>onSelectCompany(id);
  return <section className="dc-company-summary" aria-label="Affected companies summary">
    <div className="dc-company-summary-heading"><div><h3>受影响公司汇总</h3><p>按公司查看关联项目；圆点之外，先看谁面临什么开发约束。</p></div><div className="dc-summary-controls"><div role="group" aria-label="Company summary metric"><button aria-pressed={metric==='count'} onClick={()=>setMetric('count')}>Project count</button><button aria-pressed={metric==='mw'} onClick={()=>setMetric('mw')}>Disclosed MW</button></div><label><input type="checkbox" checked={includeHistorical} onChange={e=>setIncludeHistorical(e.target.checked)}/>Include prior rejected / terminated</label></div></div>
    <p className="dc-company-scope">当前地理、搜索、政策和换党州筛选适用；公司筛选保留同组对比。{includeHistorical?'包含此前已拒 / 终止的历史方案。':`已排除 ${summary.historicalExcludedCount} 项此前已拒 / 终止方案。`}{summary.unattributedCount} 项尚未归属公司，不强行分配。</p>
    {config.rows.length?<><StandardChart config={config}/><p className="dc-company-chart-caption">{leading?`${leading.company}：${Object.keys(POLICY).reduce((sum,k)=>sum+leading[POLICY[k].zh],0).toLocaleString()} ${metric==='mw'?'MW 已披露关联规划容量':'项关联项目'}。`:''}颜色表示地方政策类型；所有数值均为关联项目口径，不是公司损失。</p></>:<p className="dc-chart-empty">No numeric company records match this view. 规模未知保持未知，可切换 Project count 或调整筛选。</p>}
    {metric==='mw'&&unknown.length>0&&<p className="dc-company-unknown">精确 MW 未披露，未绘成零值：{unknown.map(c=>c.label).join('、')}。</p>}
    <div className="dc-company-drilldown" aria-label="Filter projects by company">{summary.companies.map(c=><button key={c.id} aria-pressed={selectedCompany===c.id} onClick={()=>selectCompany(c.id)}><span>{c.label}</span><b>{c.projectCount}</b><ArrowUpRight size={14}/></button>)}{selectedCompany&&<button onClick={()=>onSelectCompany('')}><RotateCcw size={14}/>All companies</button>}</div>
    <p className="dc-company-nonadditive">AWS / Prologis 共享 Trenton 的 250MW 项目；Cloverleaf / NVIDIA 共享同一 500MW 关联。NVIDIA 为少数股权敞口，并非园区业主。跨公司柱值不可相加；MW 仅合计同一公司下已披露的不同项目，不补未知值。</p>
    {details&&<div className="dc-company-evidence"><h4>{details.label} · {details.role}</h4><p>{details.projectCount} 项 · {details.knownMw==null?'MW 未披露':`${details.knownMw.toLocaleString()} MW 已披露关联规划`} · {details.unknownMwCount} 项 MW 未知 · {details.historicalCount} 项历史方案</p><ul>{details.projects.map(p=><li key={p.id}><strong>{p.city} · {p.name}</strong><span style={{color:POLICY[p.policy].color}}>{POLICY[p.policy].zh}</span><span>{p.mw==null?'MW 未披露':`${p.mw.toLocaleString()} MW`}{p.historical?' · 此前已拒 / 终止':''}</span></li>)}</ul><Sources projects={details.projects}/></div>}
    <details className="dc-company-totals"><summary>Company totals · 汇总数值与口径</summary><div className="dc-table-scroll"><table><caption>同一项目在关联公司下各列一次；下列公司不可跨行求和。</caption><thead><tr><th>Company / role</th><th>Project count</th><th>Disclosed MW</th><th>Missing MW / historical</th></tr></thead><tbody>{summary.companies.map(c=><tr key={c.id}><td><button className="dc-location-link" onClick={()=>selectCompany(c.id)}>{c.label}</button><small>{c.role}</small></td><td>{c.projectCount}</td><td>{c.knownMw==null?'未披露':c.knownMw.toLocaleString()}</td><td>{c.unknownMwCount} unknown · {c.historicalCount} historical</td></tr>)}</tbody></table></div></details>
  </section>;
}
