import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowUpRight, ChevronDown, Download, ExternalLink, MapPin, Search, X, RotateCcw, Layers, Scale } from 'lucide-react';
import { POLICY, STAGE, markerValue, markerRadius, capacityLabel, budgetLabel, electionLabel, filterSites, projectRows, csv, electionCsv } from './model.mjs';
import './style.css';
import CompanySummary from './CompanySummary.jsx';

const COMPANIES = { amazon: 'Amazon / AWS', meta: 'Meta', prologis: 'Prologis', microsoft: 'Microsoft', nvidia: 'NVIDIA (indirect)', aligned: 'Aligned', thor: 'Thor Equities', crane: 'Crane Data Centers', kanza: 'Kanza Park Place', province: 'Province Group', cloverleaf: 'Cloverleaf', beltline: 'Beltline' };
const INITIAL = { q: '', state: '', policy: '', company: '', flipOnly: false };
const US_BOUNDS = [[24,-126],[50,-66]];
function queryFilters() {
  const p = new URLSearchParams(window.location.search);
  return { q:p.get('q') || '', state:p.get('state') || '', policy:POLICY[p.get('policy')] ? p.get('policy') : '', company:COMPANIES[p.get('company')] ? p.get('company') : '', flipOnly:p.get('flips') === '1' };
}
function SourceLinks({ urls, compact = false }) {
  const unique = [...new Set(urls)];
  return <div className={`dc-sources ${compact?'compact':''}`}>{unique.map((url,i)=><a key={url} href={url} target="_blank" rel="noreferrer">{compact?`[${i+1}]`:new URL(url).hostname.replace('www.','')}<ExternalLink size={11}/></a>)}</div>;
}
function PolicyTag({ type }) { return <span className="dc-tag" style={{'--tag':POLICY[type].color}}><i/>{POLICY[type].zh}</span>; }
function MapFilterSummary({ filters, elections, onRemove, onReset }) {
  const active = [
    filters.company && { key:'company',label:`Company: ${COMPANIES[filters.company]}` },
    filters.state && { key:'state',label:`State: ${elections[filters.state]?.name || filters.state} (${filters.state})` },
    filters.policy && { key:'policy',label:`Policy: ${POLICY[filters.policy].zh}` },
    filters.q.trim() && { key:'q',label:`Search: ${filters.q}` },
    filters.flipOnly && { key:'flipOnly',label:'Governor flip states only' },
  ].filter(Boolean);
  return <div className="dc-map-filter-summary" role="group" aria-label="Active map filters">
    <div className="dc-map-filter-status" role="status"><strong>Map filters</strong><span>{active.length ? `${active.length} active` : 'All projects · No active filters'}</span></div>
    {active.length>0&&<><div className="dc-map-filter-chips">{active.map(item=><button key={item.key} title={item.label} aria-label={`Remove filter ${item.label}`} onClick={()=>onRemove(item.key,item.key==='flipOnly'?false:'')}><span>{item.label}</span><X size={14} aria-hidden="true"/></button>)}</div><button className="dc-map-clear-filters" onClick={onReset}>Clear all<RotateCcw size={14} aria-hidden="true"/></button></>}
  </div>;
}
function PartyTransition({ election, small = false }) {
  if (!election) return <span className="dc-muted">尚未核实</span>;
  if (election.status==='pending') return <span className="dc-pending">州长结果待核实</span>;
  if (election.status==='no-election') return <span className="dc-muted">本次无常规州长选举</span>;
  return <span className={`dc-party-transition ${small?'small':''}`}><b className={`party-${election.priorParty}`}>{election.priorParty}</b><span>{election.governorFlip?'→':'＝'}</span><b className={`party-${election.newParty}`}>{election.newParty}</b><span>{election.governorFlip?'州长换党':'所属党维持'}</span></span>;
}
function StateDetail({ election, code, count }) {
  return <section className="dc-state-detail"><div className="dc-detail-kicker">State power · {code}</div><h3>{election?.name || code}</h3><PartyTransition election={election}/>{election?.winner&&<p><strong>{election.priorGovernor}</strong> → <strong>{election.winner}</strong></p>}<p>{election?.note || '本次资料尚未核实该州选举结果；灰色不表示控制权未变化。'}</p><dl><dt>州众议院</dt><dd>{election?.house || '尚待核实'}</dd><dt>州参议院</dt><dd>{election?.senate || '尚待核实'}</dd><dt>本报告地方记录</dt><dd>{count} 处</dd></dl>{election?.calledAt&&<small>AP call · {new Date(election.calledAt).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false})} 北京时间<br/>未取得认证结果 · 尚未交接就任</small>}<SourceLinks urls={election?.sources || []}/></section>;
}
function MapCanvas({ sites, allSites, elections, geometry, metric, politics, selection, onSelect, onState, api, stateFocus }) {
  const el=useRef(null), mapRef=useRef(null), points=useRef(null), states=useRef(null), stateLabels=useRef(null), callbacks=useRef({onSelect,onState});
  callbacks.current={onSelect,onState};
  useEffect(()=>{
    const map=L.map(el.current,{center:[38,-96],zoom:4,minZoom:2,maxZoom:10,scrollWheelZoom:false,zoomAnimation:false,fadeAnimation:false,markerZoomAnimation:false});
    mapRef.current=map;map.createPane('stateLabels');map.getPane('stateLabels').style.pointerEvents='none';map.getPane('stateLabels').style.zIndex='410';
    map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Natural Earth</a> · <a href="https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2024.html" target="_blank" rel="noreferrer">Census points</a>');
    points.current=L.layerGroup().addTo(map);
    stateLabels.current=L.layerGroup().addTo(map);
    api.current={fit:()=>map.fitBounds(US_BOUNDS,{padding:[12,12],animate:false}),ohio:()=>map.fitBounds([[38.6,-85.1],[42.1,-80.3]],{padding:[35,35],animate:false}),focus:(s)=>map.setView([s.lat,s.lng],8,{animate:false})};
    map.fitBounds(US_BOUNDS,{padding:[12,12],animate:false});
    const ro=new ResizeObserver(()=>map.invalidateSize({pan:false}));ro.observe(el.current);
    return()=>{ro.disconnect();map.remove();mapRef.current=null;api.current=null;};
  },[api]);
  useEffect(()=>{
    const map=mapRef.current;if(!map||!geometry)return;
    if(states.current)map.removeLayer(states.current);
    stateLabels.current.clearLayers();
    states.current=L.geoJSON(geometry,{style:f=>{
      const code=f.properties.postal,e=elections[code],flip=politics&&e?.governorFlip,focus=stateFocus===code;
      return {color:focus?'#fff1bf':flip?'#7ba6ff':'#425166',weight:focus?2.8:flip?2.4:0.8,fillColor:flip?'#315bc0':allSites.some(s=>s.state===code)?'#273a4e':'#1c2a39',fillOpacity:flip?0.65:0.86};
    },onEachFeature:(f,layer)=>{
      const code=f.properties.postal,e=elections[code];
      layer.bindTooltip(`${f.properties.name} · ${e?electionLabel(e):'尚未核实州级结果'}`,{sticky:true,className:'dc-map-tooltip'});
      layer.on('click',()=>callbacks.current.onState(code));
      if(e?.governorFlip&&politics){const center=layer.getBounds().getCenter(),labelPoint=code==='OH'?L.latLng(43,-79.8):center;if(code==='OH')L.polyline([center,labelPoint],{interactive:false,color:'#8cafff',weight:1.2,dashArray:'3 4',pane:'stateLabels'}).addTo(stateLabels.current);L.marker(labelPoint,{interactive:false,pane:'stateLabels',icon:L.divIcon({className:'dc-state-label',html:`<span>${code}</span><b>R → D</b>`,iconSize:[58,42],iconAnchor:[29,21]})}).addTo(stateLabels.current);}
    }}).addTo(map);states.current.bringToBack();
  },[geometry,elections,politics,stateFocus,allSites]);
  useEffect(()=>{
    const map=mapRef.current;if(!map)return;points.current.clearLayers();
    [...sites].sort((a,b)=>(markerValue(b,metric)||0)-(markerValue(a,metric)||0)).forEach(s=>{
      const value=markerValue(s,metric),r=markerRadius(value,metric),size=r*2+10,color=POLICY[s.policy].color;
      const hasConstruction=s.projects.some(p=>p.stage==='construction'),selected=selection===s.id;
      const sizedProjects=s.projects.filter(p=>(metric==='mw'?p.mw:p.capexB)===value),inactive=value!=null&&sizedProjects.length>0&&sizedProjects.every(p=>['rejected','terminated'].includes(p.stage));
      const symbol=value==null?'◇':'';
      const html=`<span class="dc-map-dot ${value==null?'unknown':''} ${hasConstruction?'construction':''} ${inactive?'inactive':''} ${selected?'selected':''}" style="--dot:${color};--diameter:${r*2}px">${symbol}</span>${selected?`<span class="dc-pin-label">${s.city}</span>`:''}`;
      const marker=L.marker([s.lat,s.lng],{title:`${s.city}, ${s.state} · ${POLICY[s.policy].label} · ${value==null?'规模未披露':metric==='mw'?`${value} MW`:`$${value}B`}`,keyboard:true,icon:L.divIcon({className:'dc-marker',html,iconSize:[size,size],iconAnchor:[size/2,size/2]}),zIndexOffset:selected?1000:hasConstruction?20:0}).addTo(points.current);
      const content=document.createElement('div');
      const title=document.createElement('strong');title.textContent=`${s.city}, ${s.state}`;content.append(title);
      const facts=document.createElement('p');facts.textContent=`${POLICY[s.policy].zh} · ${value==null?'精确规模未披露':metric==='mw'?`${value.toLocaleString()} MW`:`$${value}B`} · ${s.projects.length>1?'同城多项目，圆取最大单项':'规划口径'}`;content.append(facts);
      const company=document.createElement('small');company.textContent=s.projects.map(p=>p.company).join(' / ');content.append(company);
      marker.bindTooltip(content,{direction:'top',className:'dc-map-tooltip',opacity:1});marker.on('click',()=>callbacks.current.onSelect(s.id));
    });
  },[sites,metric,selection]);
  return <div ref={el} className="dc-map" role="region" aria-label="United States map: state governor-party changes and data-center project scale. All records are also available in tables below."/>;
}
function Inspector({ site, data, stateCode, onClose, onProject }) {
  if(!site&&stateCode)return <aside className="dc-inspector"><button className="dc-close" onClick={onClose} aria-label="Close details"><X size={18}/></button><StateDetail election={data.elections[stateCode]} code={stateCode} count={data.sites.filter(s=>s.state===stateCode).length}/><p className="dc-small-note">州级选举与地方开发限制是两个维度；本页面未验证二者存在因果关系。</p></aside>;
  if(!site)return <aside className="dc-inspector dc-intro-panel"><div className="dc-detail-kicker">Reading the map</div><h2>两层选票，<br/>一张算力版图。</h2><p>州界标出已核实的州长换党；圆点展示地方数据中心限制。</p><div className="dc-observation"><span>重点交集</span><h3>Ohio</h3><p>州长选举 R → D，共和党保住两院。多个地方同时限制大型数据中心。</p><button onClick={()=>onProject('piqua')}>Inspect Ohio projects <ArrowUpRight size={15}/></button></div><ul className="dc-reading-list"><li><i/>圆面积随规划 MW / 预算变化</li><li><i/>颜色区分政策类型</li><li><i/>实线圆含在建；× 为此前已拒 / 终止</li><li><i/>菱形表示精确规模未披露</li></ul><p className="dc-small-note">点击圆点、州界或下方表格查看证据。城市点不是项目地块位置。</p></aside>;
  return <aside className="dc-inspector"><button className="dc-close" onClick={onClose} aria-label="Close details"><X size={18}/></button><div className="dc-detail-kicker">Local vote · {site.state}</div><h2>{site.city}</h2><PolicyTag type={site.policy}/><p className="dc-result">{site.result}</p><p>{site.policyText}</p>{site.projects.map(p=><article key={p.id} className="dc-project-detail"><div className="dc-detail-top"><h3>{p.company}</h3><span className={`dc-stage stage-${p.stage}`}>{STAGE[p.stage]}</span></div><div className="dc-project-scale"><strong>{capacityLabel(p)}</strong><span>{budgetLabel(p)}<small>项目预算</small></span></div><dl><dt>项目</dt><dd>{p.name}</dd><dt>面积</dt><dd>{p.area}</dd><dt>容量口径</dt><dd>{p.capacityBasis}</dd></dl><p>{p.impact}</p><div className="dc-caveat"><Scale size={15}/><span>{p.caveat}</span></div><SourceLinks urls={[...site.sources,...p.sources]}/></article>)}<StateDetail election={data.elections[site.state]} code={site.state} count={data.sites.filter(s=>s.state===site.state).length}/></aside>;
}
export default function DataCenterBallots() {
  const [data,setData]=useState(null),[geometry,setGeometry]=useState(null),[error,setError]=useState(''),[geoError,setGeoError]=useState('');
  const [legendOpen,setLegendOpen]=useState(()=>window.matchMedia('(min-width: 741px)').matches);
  const [filters,setFilters]=useState(queryFilters),[metric,setMetric]=useState('mw'),[politics,setPolitics]=useState(true),[selection,setSelection]=useState(null),[stateDetail,setStateDetail]=useState(''),[sort,setSort]=useState('mw'),[tab,setTab]=useState('projects');
  const mapApi=useRef(null),mapSection=useRef(null);
  useEffect(()=>{
    const c=new AbortController();
    const get=async(url)=>{const timeout=new AbortController();const timer=setTimeout(()=>timeout.abort(),15000);try{const r=await fetch(url,{signal:AbortSignal.any([c.signal,timeout.signal])});if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.json();}finally{clearTimeout(timer);}};
    get('/data/data-center-ballots.json').then(setData).catch(e=>{if(!c.signal.aborted)setError(`研究数据未能加载：${e.name==='AbortError'?'请求超时':e.message}`);});
    get('/data/data-center-us-states.geojson').then(setGeometry).catch(()=>{if(!c.signal.aborted)setGeoError('州界未能加载；项目点与表格仍可使用。请刷新页面重试。');});
    return()=>c.abort();
  },[]);
  useEffect(()=>{const p=new URLSearchParams();for(const key of ['q','state','policy','company'])if(filters[key])p.set(key,filters[key]);if(filters.flipOnly)p.set('flips','1');window.history.replaceState(null,'',`${window.location.pathname}${p.size?'?'+p:''}${window.location.hash}`);},[filters]);
  const change=useCallback((key,value)=>{setFilters(f=>({...f,[key]:value}));setSelection(null);setStateDetail('');},[]);
  const resetFilters=useCallback(()=>{setFilters(INITIAL);setSelection(null);setStateDetail('');},[]);
  const sites=useMemo(()=>data?filterSites(data.sites,filters,data.elections):[],[data,filters]);
  const companySites=useMemo(()=>data?filterSites(data.sites,{...filters,company:''},data.elections):[],[data,filters]);
  const rows=useMemo(()=>projectRows(sites,filters.company,sort),[sites,filters.company,sort]);
  const visibleMapSites=useMemo(()=>sites.map(s=>({...s,projects:s.projects.filter(p=>!filters.company||p.companyKeys.includes(filters.company))})),[sites,filters.company]);
  const selected=visibleMapSites.find(s=>s.id===selection);
  const select=useCallback((id,focus=false)=>{setSelection(id);setStateDetail('');if(focus){const s=data?.sites.find(s=>s.id===id);if(s)mapApi.current?.focus(s);mapSection.current?.scrollIntoView({behavior:'instant',block:'start'});}},[data]);
  const inspectState=useCallback(code=>{setSelection(null);setStateDetail(code);},[]);
  const flips=useMemo(()=>data?Object.values(data.elections).filter(e=>e.governorFlip):[],[data]);
  const powerRows=useMemo(()=>data?Object.values(data.elections).filter(e=>(!filters.state||e.stateCode===filters.state)&&(!filters.flipOnly||e.governorFlip)).sort((a,b)=>Number(b.governorFlip)-Number(a.governorFlip)||a.name.localeCompare(b.name)):[],[data,filters.state,filters.flipOnly]);
  const download=()=>{const url=URL.createObjectURL(new Blob([tab==='power'?electionCsv(powerRows):csv(rows,data.elections)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${tab==='power'?'state-power':'data-center-ballots'}-2026-11-04.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  if(error)return <div className="dc-report"><div className="dc-error" role="alert">{error}<button onClick={()=>window.location.reload()}>Retry</button></div></div>;
  if(!data)return <div className="dc-report dc-loading" role="status">Loading research map…</div>;
  return <div className="dc-report">
    <header className="dc-header"><div><div className="dc-dateline"><span>Instap Research</span><span>2026.11.04 · Election-night snapshot</span></div><h1>当地方选票<br className="dc-mobile-break"/>遇上算力扩张</h1><p className="dc-lede">数据中心的开发限制、公司敞口，以及中期选举后的州级权力变化。</p></div><a className="dc-origin" href={data.meta.thread} target="_blank" rel="noreferrer">J.D. Capelouto 原始讨论串<ArrowUpRight size={16}/><small>原帖 + 17 条作者续帖</small></a></header>
    <section className="dc-election-strip" aria-label="Verified governor party changes"><div className="dc-strip-label"><span className="dc-blue-key"/><strong>{flips.length} 个已核实换党州</strong><small>Governor · R → D</small></div>{flips.map(e=><button key={e.stateCode} className={stateDetail===e.stateCode?'active':''} onClick={()=>{inspectState(e.stateCode);mapSection.current?.scrollIntoView({behavior:'instant',block:'start'});}}><span>{e.name}<b>{e.stateCode}</b></span><strong>{e.winner}</strong><small>{data.sites.filter(s=>s.state===e.stateCode).length?`${data.sites.filter(s=>s.state===e.stateCode).length} 处地方记录 · 州两院 R`:'本讨论串未列当地项目'}</small></button>)}</section>
    <div className="dc-snapshot-note"><span>截至北京时间 11/04 13:20 的已核实快照，非最终全国清点。</span><span>AP 已叫票 ≠ 官方认证 ≠ 已交接就任。州议会采用 12:57 快照，未知不作“未变化”。</span></div>
    <section className="dc-map-section" ref={mapSection}>
      <div className="dc-map-heading"><div><MapPin size={18}/><h2>限制发生在哪里</h2><span>{sites.length} / {data.sites.length} 地方</span></div><div className="dc-map-actions"><button onClick={()=>mapApi.current?.fit()}>Fit US</button><button onClick={()=>mapApi.current?.ohio()}>Ohio close-up</button><button className={politics?'active':''} aria-pressed={politics} onClick={()=>setPolitics(v=>!v)}><Layers size={14}/>Governor changes</button></div></div>
      <MapFilterSummary filters={filters} elections={data.elections} onRemove={change} onReset={resetFilters}/>
      <div className="dc-map-layout"><div className="dc-map-stage"><MapCanvas sites={visibleMapSites} allSites={data.sites} elections={data.elections} geometry={geometry} metric={metric} politics={politics} selection={selection} onSelect={select} onState={inspectState} api={mapApi} stateFocus={stateDetail || selected?.state}/><div className="dc-scale-control"><span>Size by</span><button className={metric==='mw'?'active':''} aria-pressed={metric==='mw'} onClick={()=>setMetric('mw')}>Planned MW</button><button className={metric==='budget'?'active':''} aria-pressed={metric==='budget'} onClick={()=>setMetric('budget')}>Budget USD</button></div><div className="dc-map-legend"><button className="dc-legend-toggle" aria-expanded={legendOpen} onClick={()=>setLegendOpen(v=>!v)}>Scale & status legend <ChevronDown size={12}/></button>{legendOpen&&<><div className="dc-size-key">{(metric==='mw'?[250,1000]:[1,5]).map(v=><span key={v}><i style={{width:markerRadius(v,metric)*2,height:markerRadius(v,metric)*2}}/>{metric==='mw'?`${v} MW`:`$${v}B`}</span>)}<span><b>◇</b>Undisclosed</span></div><p>圆面积正比于数值 · 同城取最大单项<br/>× 历史已拒 / 终止方案 · 实线圆含在建<br/>蓝色州界：已核实州长换党 · 灰色不等于未变化</p></>}</div>{geoError&&<div className="dc-map-error" role="alert">{geoError}</div>}{!sites.length&&<div className="dc-no-map">No matching local records.<br/>该州可能有州级变化，但未出现在本次地方项目清单中。</div>}<div className="dc-map-caption">城市近似位置，不是项目地块 · CONUS</div></div><Inspector site={selected} data={data} stateCode={stateDetail} onClose={()=>{setSelection(null);setStateDetail('');}} onProject={id=>select(id,true)}/></div>
      <div className="dc-policy-legend">{Object.entries(POLICY).map(([k,p])=><button key={k} onClick={()=>change('policy',filters.policy===k?'':k)} className={filters.policy===k?'active':''} aria-pressed={filters.policy===k}><i style={{background:p.color}}/>{p.zh}</button>)}</div>
    </section>
    <section className="dc-registry"><div className="dc-section-heading"><div><h2>项目与权力变化</h2><p>地方限制与州级选举分别记录；不把同日投票解释成因果关系。</p></div><button className="dc-download" onClick={download}><Download size={15}/>Export filtered CSV</button></div>
      <div className="dc-filter-bar"><label className="dc-search"><Search size={16}/><input aria-label="Search city or company" placeholder="Search city, company or ticker" value={filters.q} onChange={e=>change('q',e.target.value)}/></label><label><span className="dc-sr-only">State</span><select aria-label="Filter state" value={filters.state} onChange={e=>change('state',e.target.value)}><option value="">All states</option>{[...new Set([...data.sites.map(s=>s.state),...flips.map(e=>e.stateCode)])].sort().map(code=><option key={code} value={code}>{code} · {data.elections[code]?.name || code}</option>)}</select><ChevronDown size={13}/></label><label><span className="dc-sr-only">Company</span><select aria-label="Filter company" value={filters.company} onChange={e=>change('company',e.target.value)}><option value="">All companies</option>{Object.entries(COMPANIES).map(([k,v])=><option value={k} key={k}>{v}</option>)}</select><ChevronDown size={13}/></label><label className="dc-checkbox"><input type="checkbox" checked={filters.flipOnly} onChange={e=>change('flipOnly',e.target.checked)}/><span>Governor flip states only</span></label><button className="dc-reset" aria-label="Reset filters" onClick={resetFilters}><RotateCcw size={16}/></button></div>
      <CompanySummary sites={companySites} selectedCompany={filters.company} onSelectCompany={id=>change('company',id)}/>
      <div className="dc-table-toolbar"><div className="dc-tabs" role="tablist" aria-label="Record type"><button role="tab" aria-selected={tab==='projects'} onClick={()=>setTab('projects')}>Projects & policies <b>{rows.length}</b></button><button role="tab" aria-selected={tab==='power'} onClick={()=>setTab('power')}>State power <b>{powerRows.length}</b></button></div>{tab==='projects'&&<label>Sort by <select aria-label="Sort project rows" value={sort} onChange={e=>setSort(e.target.value)}><option value="mw">Planned MW</option><option value="budget">Budget USD</option><option value="place">City A–Z</option></select></label>}</div>
      {tab==='projects'?<div className="dc-table-scroll"><table><caption className="dc-table-reading-note">Project details · 宽表可横向滚动；地点列固定，点击地点联动地图</caption><thead><tr><th>Location / company</th><th>Project scale</th><th>Local restriction</th><th>Governor / legislature</th><th>Operating impact / limits</th></tr></thead><tbody>{rows.map(p=><tr key={p.id} className={selection===p.site.id?'selected':''}><td><button className="dc-location-link" onClick={()=>select(p.site.id,true)}>{p.site.city}<ArrowUpRight size={13}/></button><small>{p.site.state} · {p.name}</small><strong className="dc-company">{p.company}</strong><span className="dc-tickers">{p.tickers.join(' / ') || (p.company==='未确认'?'Company unverified':'Private / unlisted')}</span></td><td><strong className="dc-capacity">{capacityLabel(p)}</strong><span>{budgetLabel(p)}<small>项目预算 · 非损失额</small></span><span className={`dc-stage stage-${p.stage}`}>{STAGE[p.stage]}</span><small>{p.area}</small></td><td><PolicyTag type={p.site.policy}/><p>{p.site.result}</p><small>{p.site.policyText}</small></td><td><PartyTransition election={data.elections[p.site.state]} small/><p>{data.elections[p.site.state]?.winner || data.elections[p.site.state]?.note}</p><small>{data.elections[p.site.state]?.legislativeStatus}</small></td><td><p>{p.impact}</p><details><summary>口径与风险</summary><p>{p.capacityBasis}</p><p>{p.caveat}</p><SourceLinks urls={[...p.site.sources,...p.sources]}/></details></td></tr>)}</tbody></table>{!rows.length&&<div className="dc-empty">No matching records. <button onClick={()=>setFilters(INITIAL)}>Reset filters</button><p>GA / IA / TX 的州长换党已核实，但本讨论串没有列出当地项目；未列出不代表没有项目。</p></div>}</div>:<div className="dc-table-scroll"><table className="dc-election-table"><caption className="dc-power-filter-note">State & governor-flip filters apply to this table; city / company filters apply to projects.</caption><thead><tr><th>State</th><th>Governor transition</th><th>Legislative control</th><th>Evidence / limits</th></tr></thead><tbody>{powerRows.map(e=><tr key={e.stateCode} className={e.governorFlip?'dc-flip-row':''}><td><button className="dc-location-link" onClick={()=>{inspectState(e.stateCode);mapSection.current?.scrollIntoView({behavior:'instant',block:'start'});}}>{e.name}<ArrowUpRight size={13}/></button><small>{e.stateCode} · {data.sites.filter(s=>s.state===e.stateCode).length} local records</small></td><td><PartyTransition election={e}/><p>{e.priorGovernor}{e.winner?` → ${e.winner}`:''}</p></td><td><p>House: {e.house || 'Uncalled / not verified'}</p><p>Senate: {e.senate || 'Uncalled / not verified'}</p></td><td><p>{e.note}</p><small>{e.calledAt?'AP called · 未认证 / 未就任':e.status==='no-election'?'Not scheduled':'Pending within this research snapshot'}</small><SourceLinks urls={e.sources}/></td></tr>)}</tbody></table></div>}
    </section>
    <section className="dc-method"><div><h2>如何理解经营影响</h2><p>Meta 与 AWS 的主要敞口是未来容量、审批和交付；Prologis 涉及在建项目履约。微软在 Pataskala 是储地敞口，NVIDIA 对 Cloverleaf 为间接股权。私人开发商更直接承受前期开支与融资风险。</p><p>影响判断依赖两个未决条件：法院如何处理既有许可 / 开发协议，以及替代地点能否及时取得电力和审批。未披露数据不足以计算集团收入或 EPS 损失。</p></div><div><h2>规模与证据口径</h2><ul><li>MW 为规划 / 申请负荷，非已运行 IT 容量。未知值保留未知，Emporia 的“GW 级”构想不强填成 1,000MW。</li><li>预算是多年项目口径，非损失额。Yukon 使用早期单侧口径，跨界扩展范围在详情中另列。</li><li>18 个地方记录中 Madison County 汇总四镇；同城多个项目用一个圆，面积取最大单项而非求和。</li><li>{data.electionMeta.legislatureNote}</li><li>政治变化不代表项目审批自动反转。州界为 Natural Earth 公有领域数据，点位为 Census 城镇代表内点。</li></ul><SourceLinks urls={[data.meta.thread,...data.electionMeta.sources,'https://www.naturalearthdata.com/about/terms-of-use/','https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.2024.html']}/></div></section>
    <footer className="dc-report-footer"><span>Research snapshot · 2026-11-04 · Asia/Shanghai</span><a href="/data/data-center-ballots.json" target="_blank" rel="noreferrer">Download source dataset <Download size={12}/></a></footer>
  </div>;
}
