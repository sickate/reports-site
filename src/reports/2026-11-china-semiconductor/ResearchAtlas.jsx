import {useEffect,useMemo,useRef,useState} from 'react';
import {gapLevels,processNodes,ecosystemNodes,ecosystemEdges,sourceRegistry} from './atlasData.js';

const groupColors={'基础原料/厂务':'#94a3b8','零部件':'#fb923c','光刻子系统':'#f472b6','前道设备':'#a78bfa','材料':'#34d399','EDA':'#818cf8','制造':'#60a5fa','先进封装':'#22d3ee','测试':'#2dd4bf'};
const lanes=[
 ['L0–L1','原料、零部件与光刻子系统',['基础原料/厂务','零部件','光刻子系统']],
 ['L2','前道设备、材料与软件',['前道设备','材料','EDA']],
 ['L3','晶圆制造',['制造']],
 ['L4','先进封装与测试',['先进封装','测试']]
];
const groupLinks={'基础原料/厂务':['零部件','材料','制造'],'零部件':['前道设备','先进封装'],'光刻子系统':['前道设备'],'前道设备':['制造','先进封装'],'材料':['制造','先进封装'],'EDA':['制造'],'制造':['先进封装','测试'],'先进封装':['测试'],'测试':[]};
const ecoColors={'华为关联':'#fb923c','上海体系':'#60a5fa','交叉协作':'#e879f9','政策 / 国资':'#cbd5e1','共享制造':'#2dd4bf','共享上游':'#a78bfa'};
const periods=['2014–18','2019–22','2023–24','2025','2026','2027+'];
const ecoLanes=['政策 / 国资','华为关联','交叉协作','上海体系','共享制造','共享上游'];
const relationStyles={
 ownership:{label:'明确体系/从属',color:'#fbbf24',dash:'',width:3},
 confirmed:{label:'已证实产品/协作',color:'#38bdf8',dash:'',width:2.5},
 reportedOwnership:{label:'报道股权/资本（待工商核实）',color:'#fbbf24',dash:'8 4',width:2.5},
 reported:{label:'报道技术/验证合作',color:'#c084fc',dash:'8 5',width:2},
 candidate:{label:'候选/推断/目标',color:'#94a3b8',dash:'2 6',width:1.8},
 context:{label:'政策背景',color:'#64748b',dash:'4 5',width:1.5}
};
const gapOf=n=>gapLevels[n.gap===null?'U':n.gap];
// Explicit process-level assessments: a commercial base is not proof of advanced-node qualification.
const stageLabels={commercial:['已有商用基础','#2dd4bf'],adoption:['导入 / 验证','#eab308'],research:['研发 / 原型','#fb923c'],unknown:['证据不足','#94a3b8']};
const stageGroups={commercial:[0,1,2,4,5,9,10,12,13,14,16,19,20,23,24,25,30,31,32,34,36,37,38,39,40,42,43,44,45,46,47,49,50,52,53,56],adoption:[3,6,8,11,15,17,18,21,22,48,54,55],research:[7,26,27,28,29,33,35,51],unknown:[41]};
const stageById=Object.fromEntries(Object.entries(stageGroups).flatMap(([stage,ids])=>ids.map(i=>['p'+i,stage])));
function stageOf(n){return stageLabels[stageById[n.id]??'unknown'];}
function evidenceOf(n){return /拆解|公司披露|公司公告/.test(n.evidence)?['拆解 / 公司披露','#2dd4bf']:/媒体|报道/.test(n.evidence)?['报道 / 外部资料','#c084fc']:['定性研究 / 待核验','#94a3b8'];}
const nodeColor=(n,mode)=>mode==='gap'?gapOf(n)[2]:mode==='stage'?stageOf(n)[1]:mode==='evidence'?evidenceOf(n)[1]:groupColors[n.group];
function Sources({ids=[]}){return <ul className="cs-atlas-sources">{[...new Set(ids)].map(id=>{const s=sourceRegistry[id];return s?<li key={id}>{id==='baseline'?s[0]:<a href={s[1]} target="_blank" rel="noreferrer">{s[0]}</a>}</li>:null;})}</ul>}
function Tag({color,children}){return <span className="cs-atlas-tag" style={{'--tag':color}}>{children}</span>}
function Legend({items}){return <div className="cs-atlas-legend">{items.map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div>}
function Drawer({selected,onClose,onDirectory,onSelect}){
 const dialog=useRef(null);const closeRef=useRef(null);
 useEffect(()=>{const el=dialog.current;if(selected){if(!el.open)el.showModal();el.scrollTop=0;closeRef.current?.focus({preventScroll:true});}else if(el.open)el.close();},[selected]);
 const n=selected?.node;
 const isProcess=selected?.kind==='process';
 const connected=n&&!isProcess?ecosystemEdges.filter(e=>e.from===n.id||e.to===n.id):[];
 return <dialog ref={dialog} className="cs-atlas-dialog" aria-labelledby={n?'cs-drawer-title':undefined} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
 {n&&<div className="cs-atlas-drawer"><div className="cs-drawer-top"><span className="cs-atlas-kicker">{isProcess?'PROCESS INTELLIGENCE':'ECOSYSTEM INTELLIGENCE'}</span><button ref={closeRef} type="button" aria-label="关闭详情" className="cs-atlas-close" onClick={onClose}>×</button></div>
 <h2 id="cs-drawer-title">{isProcess?n.label:n.name}</h2>
 {isProcess?<><div className="cs-atlas-tags"><Tag color={groupColors[n.group]}>{n.group}</Tag><Tag color={gapOf(n)[2]}>{gapOf(n)[0]} · {gapOf(n)[1]}</Tag><Tag color={stageOf(n)[1]}>{stageOf(n)[0]}</Tag></div>
 <div className="cs-compare"><div><small>中国现状 / CHINA</small><strong>{n.cn}</strong></div><div><small>全球基准 / GLOBAL</small><strong>{n.world}</strong></div></div>
 <h3>中国参与者</h3><div className="cs-player-list">{n.players.split('；').map((v,i)=><span key={i}>{v}</span>)}</div>
 <h3>国际对标</h3><p>{n.leaders}</p><h3>差距与验证指标</h3><p>{n.why}</p><h3>技术与证据状态</h3><p>{n.stage}</p><Tag color={evidenceOf(n)[1]}>{n.evidence}</Tag><p className="cs-note">G 等级为研究者按先进产品能力、商业化与验证程度作出的定性判断，不是精确市占率、年份或性能比例；未披露的同口径数据不补估。</p>
 <h3>相关产业环节</h3><div className="cs-atlas-tags">{processNodes.filter(p=>p.id!==n.id&&(p.group===n.group||groupLinks[n.group].includes(p.group))).slice(0,12).map(p=><button type="button" className="cs-atlas-link" key={p.id} onClick={()=>onSelect({kind:'process',node:p})}>{p.label}</button>)}</div>
 <h3>来源与证据</h3><Sources ids={n.sourceIds}/><button className="cs-atlas-primary" type="button" onClick={()=>{dialog.current?.close();onClose();onDirectory(n.group,n.segment);}}>打开对应详细表格 ↗</button>
 </>:<><div className="cs-atlas-tags"><Tag color={ecoColors[n.lane]}>{n.lane}</Tag><Tag color="#94a3b8">{n.period} · {n.role}</Tag></div><h3>分工与已知进展</h3><p>{n.description}</p><h3>关系与证据</h3>{connected.length?connected.map((e,i)=>{const target=ecosystemNodes.find(v=>v.id===(e.from===n.id?e.to:e.from));const style=relationStyles[e.type];return <div className="cs-relation-detail" key={i}><Tag color={style.color}>{style.label}</Tag><button type="button" className="cs-atlas-link" onClick={()=>onSelect({kind:'eco',node:target})}>{e.from===n.id?'→ ':'← '}{target.name}</button><p>{e.note}</p><Sources ids={e.sourceIds}/></div>}):<p>暂无可核实的直接关系边。</p>}<h3>节点来源</h3><Sources ids={n.sourceIds}/><p className="cs-note">归入生态表示研究上的分工/协作，不自动表示控股、排他供应或集团子公司。</p></>}
 </div>}
 </dialog>
}
function Ecosystem({onSelect}){
 const [types,setTypes]=useState(Object.keys(relationStyles));
 const [focus,setFocus]=useState('all');
 const geometry=useMemo(()=>{
  const pos={};let y=80;const bands=[];
  for(const lane of ecoLanes){
    const cells=periods.map(p=>ecosystemNodes.filter(n=>n.lane===lane&&n.period===p));
    const height=Math.max(1,...cells.map(c=>c.length))*84+26;
    bands.push({lane,y,height});cells.forEach((cell,col)=>cell.forEach((n,row)=>{pos[n.id]={x:150+col*204,y:y+12+row*84};}));y+=height;
  }
  return {pos,bands,height:y+12,width:1390};
 },[]);
 const {pos,bands,height,width}=geometry;
 const visibleEdges=ecosystemEdges.filter(e=>types.includes(e.type)&&(focus==='all'||e.from===focus||e.to===focus));
 return <div className="cs-atlas-panel">
 <div className="cs-atlas-header"><div><span className="cs-atlas-kicker">ECOSYSTEM / 2014–2027+</span><h3>华为关联生态 × 上海微电子生态</h3><p>横轴是事件或产业阶段，非企业成立日期；纵轴是产业协作范围。交叉协作带突出新凯来、宇量昇、AMIES、爱晟纳之间的重组与技术流动。点击企业查看角色、日期、所有关联边及来源。</p></div><Tag color="#e879f9">{ecosystemNodes.length} 节点 · {ecosystemEdges.length} 关系</Tag></div>
 <Legend items={Object.entries(ecoColors)}/>
 <div className="cs-relation-controls" aria-label="关系过滤">{Object.entries(relationStyles).map(([id,s])=><button type="button" key={id} aria-pressed={types.includes(id)} onClick={()=>setTypes(t=>t.includes(id)?t.filter(v=>v!==id):[...t,id])}><svg width="28" height="8" aria-hidden="true"><line x1="0" x2="28" y1="4" y2="4" stroke={s.color} strokeWidth={s.width} strokeDasharray={s.dash}/></svg>{s.label}</button>)}</div>
 <label className="cs-focus-label">关系聚焦 <select value={focus} onChange={e=>setFocus(e.target.value)}><option value="all">全部节点</option>{ecosystemNodes.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</select></label>
 <div className="cs-eco-scroll" tabIndex={0} aria-label="可横向滚动的生态时间图"><div className="cs-eco-canvas" style={{width,height}}>
 {bands.map(b=><div key={b.lane} className="cs-eco-band" style={{top:b.y,height:b.height,'--lane':ecoColors[b.lane]}}><b>{b.lane}</b></div>)}
 {periods.map((p,i)=><div className="cs-eco-period" key={p} style={{left:150+i*204}}>{p}<small>{p==='2027+'?'目标 / 情景':'事件阶段'}</small></div>)}
 <svg className="cs-eco-edges" width={width} height={height} aria-label="关系线"><defs>{Object.entries(relationStyles).map(([id,s])=><marker key={id} id={'cs-eco-arrow-'+id} markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill={s.color}/></marker>)}</defs>{visibleEdges.map((e,i)=>{const a=pos[e.from],b=pos[e.to],s=relationStyles[e.type];const same=a.x===b.x;const forward=b.x>a.x;const x1=same?a.x+90:a.x+(forward?184:0),x2=same?b.x+90:b.x+(forward?0:184);const y1=same?a.y+(b.y>a.y?68:0):a.y+34,y2=same?b.y+(b.y>a.y?0:68):b.y+34;const bend=same?Math.min(a.x,b.x)-12:(x1+x2)/2;const d=same?'M '+x1+' '+y1+' C '+bend+' '+y1+' '+bend+' '+y2+' '+x2+' '+y2:'M '+x1+' '+y1+' C '+bend+' '+y1+' '+bend+' '+y2+' '+x2+' '+y2;return <path key={e.from+e.to+i} d={d} stroke={s.color} strokeWidth={s.width} strokeDasharray={s.dash} fill="none" opacity={focus==='all'?.65:1} markerEnd={'url(#cs-eco-arrow-'+e.type+')'}><title>{e.note}</title></path>})}</svg>
 {ecosystemNodes.map(n=><button key={n.id} type="button" className={'cs-eco-node '+(focus===n.id?'is-focused':'')} style={{left:pos[n.id].x,top:pos[n.id].y,'--node-color':ecoColors[n.lane],opacity:focus==='all'||focus===n.id||visibleEdges.some(e=>e.from===n.id||e.to===n.id)?1:.4}} onClick={()=>onSelect({kind:'eco',node:n})}><strong>{n.name}</strong><small>{n.role}</small></button>)}
 </div></div>
 <p className="cs-note">时间轴并非组织树。箭头方向表示关系发起/作用方向，可跨期或回指历史平台；虚线股权未核查工商原件。2026 年 7 月与 9 月关于浸没 DUV 的报道口径不一致，计划台数不可相加。</p>
 </div>
}
function ProcessMap({onSelect}){
 const [mode,setMode]=useState('category');
 const [query,setQuery]=useState('');
 const [gapFilter,setGapFilter]=useState('all');
 const filtered=processNodes.filter(n=>(gapFilter==='all'||(n.gap===null?'U':String(n.gap))===gapFilter)&&[n.label,n.segment,n.players,n.leaders,n.cn,n.world].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 const modes=[['category','产业类别'],['gap','全球差距'],['stage','成熟度'],['evidence','证据状态']];
 const colors=mode==='gap'?Object.values(gapLevels).map(v=>[v[0]+' '+v[1],v[2]]):mode==='stage'?Object.values(stageLabels):mode==='evidence'?[['拆解 / 公司披露','#2dd4bf'],['报道 / 外部资料','#c084fc'],['定性研究 / 待核验','#94a3b8']]:Object.entries(groupColors);
 return <div className="cs-atlas-panel"><div className="cs-atlas-header"><div><span className="cs-atlas-kicker">GLOBAL GAP ATLAS / PROCESS LEVEL</span><h3>中国 vs 全球领先：逐工艺节点</h3><p>每个节点展示国内现状和海外基准。点击打开详情，无需离开图谱。节点底色按所选视角变化，右侧 G 标签始终保留差距等级。</p></div><Tag color="#60a5fa">{filtered.length} / {processNodes.length} 节点</Tag></div>
 <div className="cs-atlas-controls"><div className="cs-chips">{modes.map(([id,label])=><button key={id} type="button" aria-pressed={mode===id} onClick={()=>setMode(id)}>{label}</button>)}</div><label>搜索节点或公司 <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="EUV / 华海清科 / HBM"/></label><label>差距筛选 <select value={gapFilter} onChange={e=>setGapFilter(e.target.value)}><option value="all">全部</option>{Object.entries(gapLevels).map(([key,v])=><option key={key} value={key}>{v[0]} · {v[1]}</option>)}</select></label></div>
 <Legend items={colors}/><div className="cs-gap-key">{Object.values(gapLevels).map(v=><Tag key={v[0]} color={v[2]}>{v[0]} {v[1]}</Tag>)}</div>
 <p className="cs-note">同类内部按高端/先进应用判断，G0–G4 是有序定性等级；U 表示无法比较，不用推测的“领先几年”填空。不同应用、同口径性能、良率和可用率数据未披露时，在详情列出验证指标。</p>
 <div className="cs-atlas-grid">{lanes.map(([level,title,gs],li)=><section key={level} className="cs-atlas-lane"><header><span>{level}</span><h4>{title}</h4>{li<lanes.length-1&&<span className="cs-lane-arrow" aria-hidden="true">→</span>}</header>{gs.map(g=>{const list=filtered.filter(n=>n.group===g);if(!list.length)return null;return <div className="cs-atlas-group" key={g} style={{'--group':groupColors[g]}}><h5>{g} <small>{list.length}</small></h5><div className="cs-group-deps">{groupLinks[g].length?'→ '+groupLinks[g].join(' / '):'终端测试 / 反馈'}</div>{list.map(n=><button key={n.id} type="button" className="cs-process-node" style={{'--node-color':nodeColor(n,mode),'--gap-color':gapOf(n)[2]}} onClick={()=>onSelect({kind:'process',node:n})}><div className="cs-process-title"><strong>{n.label}</strong><Tag color={gapOf(n)[2]}>{gapOf(n)[0]}</Tag></div><div className="cs-process-compare"><small>CN</small><span>{n.cn}</span><small>GL</small><span>{n.world}</span></div><div className="cs-process-footer"><span>{evidenceOf(n)[0]}</span><span>详情 ↗</span></div></button>)}</div>})}</section>)}</div>{!filtered.length&&<p>没有匹配节点，请调整筛选。</p>}
 </div>
}
export default function ResearchAtlas({onDirectory}){
 const [selected,setSelected]=useState(null);
 return <><Ecosystem onSelect={setSelected}/><ProcessMap onSelect={setSelected}/><Drawer selected={selected} onClose={()=>setSelected(null)} onDirectory={onDirectory} onSelect={setSelected}/></>
}
