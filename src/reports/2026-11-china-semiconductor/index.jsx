import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { segments, facts, sources, spending, maturity, watch, regions } from './data.js';
import './styles.css';

const groups = [...new Set(segments.map(row => row[0]))];
const graph = [
  {id:'raw', label:'Raw Materials / Facilities', sub:'高纯原料 · 洁净室 · 工艺介质', x:20,y:25, group:'基础原料/厂务'},
  {id:'parts',label:'Equipment Components',sub:'RF · ESC · 真空 · MFC',x:20,y:145,group:'零部件'},
  {id:'optics',label:'Lithography Subsystems',sub:'光源 · 光学 · 工件台',x:20,y:265,group:'光刻子系统'},
  {id:'equipment',label:'Front-End Equipment',sub:'刻蚀 · 沉积 · 光刻 · CMP',x:300,y:115,group:'前道设备'},
  {id:'materials',label:'Process Materials',sub:'硅片 · 光刻胶 · 特气',x:300,y:265,group:'材料'},
  {id:'eda',label:'EDA / Process Software',sub:'OPC · TCAD · 良率',x:300,y:385,group:'EDA'},
  {id:'fab',label:'Wafer Manufacturing',sub:'中芯 · 长鑫 · 长江存储',x:580,y:190,group:'制造'},
  {id:'package',label:'Advanced Packaging',sub:'TSV · 键合 · FC-BGA',x:860,y:115,group:'先进封装'},
  {id:'test',label:'Testing',sub:'ATE · Probe Card · KGD',x:860,y:265,group:'测试'},
];
const edges=[['raw','parts'],['raw','materials'],['parts','equipment'],['optics','equipment'],['equipment','fab'],['materials','fab'],['eda','fab'],['fab','package'],['fab','test'],['package','test'],['equipment','package']];
const nodeMap=Object.fromEntries(graph.map(n=>[n.id,n]));
const groupLabels = Object.fromEntries(graph.map(({ group, label }) => [group, label]));
const sections = [
  ['cs-map', 'Supply Chain Map'],
  ['cs-facts', 'Evidence Timeline'],
  ['cs-companies', 'Company Directory'],
  ['cs-hbm', 'HBM Process'],
  ['cs-market', 'Market and Maturity'],
  ['cs-regions', 'Regional Clusters'],
  ['cs-watch', 'Watchlist'],
  ['cs-sources', 'Sources'],
];
const chains=[
 ['存储扩产','长鑫 / 长江存储','HAR 刻蚀 · 沉积 · 清洗','前驱体 · 特气 · 零部件'],
 ['先进逻辑','中芯 / 华为关联制造','光刻 · Track · 量测','ArF 胶 · 掩模 · 光学'],
 ['三维集成 / HBM','DRAM / GPU Die','TSV · CMP · 减薄','键合 · 封装 · 测试'],
 ['设备内部自主化','国产设备 OEM','RF · ESC · MFC · 真空','陶瓷 · 石英 · 精密加工']
];
const hbm=['DRAM 晶圆','TSV 刻蚀','绝缘 / 阻挡层沉积','铜填充','CMP','临时键合 / 减薄','KGD 测试 / 切割','TCB / 混合键合','HBM 堆叠','与 GPU / ASIC 集成','基板 / 最终测试'];
const ecosystems=[
 ['传统制造体系','中芯国际 / 华虹 / 华力','北方华创 / 中微 / 拓荆'],
 ['华为关联体系（研究假设）','鹏芯微及关联项目','新凯来 / 宇量昇 / 光刻研发'],
 ['存储工艺学习平台','长鑫存储 / 长江存储','国产刻蚀、沉积、检测导入']
];
function DataTable({headers,rows}){return <div className="cs-table-wrap"><table><thead><tr>{headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}
function Section({id,title,children}){return <section id={id} className="cs-section"><h2>{title}</h2>{children}</section>}
export default function ChinaSemiconductor(){
 const [group,setGroup]=useState('All');
 const [query,setQuery]=useState('');
 const filtered=useMemo(()=>segments.filter(r=>(group==='All'||r[0]===group)&&r.join(' ').toLowerCase().includes(query.trim().toLowerCase())),[group,query]);
 function choose(g){setGroup(g);setQuery('');}
 function selectNode(g){choose(g);document.getElementById('cs-companies')?.scrollIntoView({behavior:'smooth'});}
 return <article className="cs-report">
 <header className="cs-hero"><div className="cs-kicker">RESEARCH / SEMICONDUCTORS / 2026.11.24</div><h1>中国半导体制造产业链全景图</h1><p>从原材料、设备核心零部件与工艺材料，到晶圆制造、HBM、先进封装及测试。以实际工艺能力而非概念股标签建立研究底图。</p><div className="cs-metrics"><div><small>2025 中国大陆设备销售额（SEMI）</small><strong>$49.3B</strong><span>含进口设备，非国产设备收入</span></div><div><small>细分环节</small><strong>{segments.length}</strong><span>覆盖上市与非上市主体</span></div><div><small>核心跟踪窗口</small><strong>2027–28</strong><span>目标与预测不计入已实现事实</span></div></div></header>
 <nav aria-label="Report contents" className="cs-nav">
  {sections.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}
 </nav>
 <Section id="cs-map" title="01 / 产业链关系图">
 <p>芯片国产化、制造设备国产化、设备内部零部件国产化，是三个不同的层次。点击节点可筛选对应环节；箭头表示工艺或产业依赖，不代表已确认的企业间供货合同。</p>
 <div className="cs-graph"><svg viewBox="0 0 1120 490" role="group" aria-label="China semiconductor supply chain. Select a node to filter the directory."><defs><marker id="cs-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#64748b"/></marker></defs>{edges.map(([a,b])=>{const s=nodeMap[a],t=nodeMap[b],x=s.x+240,y=s.y+36,tx=t.x,ty=t.y+36;return <path key={a+b} d={x<tx?'M'+x+' '+y+' C'+(x+25)+' '+y+' '+(tx-25)+' '+ty+' '+tx+' '+ty:'M'+(s.x+120)+' '+(s.y+72)+' L'+(t.x+120)+' '+t.y} fill="none" stroke="#64748b" strokeWidth="1.6" markerEnd="url(#cs-arrow)"/>})}{graph.map(n=><g key={n.id} role="button" tabIndex={0} aria-label={n.label} aria-pressed={group===n.group} onClick={()=>selectNode(n.group)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(n.group);}}} className={'cs-node '+(group===n.group?'selected':'')}><rect x={n.x} y={n.y} width="240" height="72" rx="10"/><text x={n.x+14} y={n.y+28}>{n.label}</text><text x={n.x+14} y={n.y+51} className="cs-node-sub">{n.sub}</text></g>)}</svg></div>
 <h3>制造生态及工艺学习平台</h3><div className="cs-cards">{ecosystems.map(([a,b,c])=><div key={a}><h4>{a}</h4><p>{b}</p><p>{c}</p></div>)}</div><p className="cs-note">华为关联生态来自 Paul Triolo 的研究框架，不是正式股权结构；长鑫和长江存储与各设备商的具体采购关系需逐厂核实。</p>
 <h3>四条独立研究主线</h3><div className="cs-cards">{chains.map(([a,...b])=><div key={a}><h4>{a}</h4>{b.map((v,i)=><p key={v}>{i>0?'↓ ':''}{v}</p>)}</div>)}</div>
 </Section>
 <Section id="cs-facts" title="02 / 重要事实、数据与日期"><p>原文发布于 2026-02-20。以下将原文引述、媒体报道、公司公告和预测分开；并保留后续研究的补充信息。尚未独立逐项核查原文脚注。</p><DataTable headers={['日期','事实 / 主张','证据状态']} rows={facts}/><p>关键争议：文章中的 Ascend 每片约 60 个理论裸片与个位数良品说法缺乏独立核实；不能将月投片直接乘以理论裸片数视为合格芯片产出。70% 国产化的 2028 年目标也是未验证说法。EUV 光源产生、可曝光晶圆和稳定量产分别是不同里程碑。</p></Section>
 <Section id="cs-companies" title="03 / 企业与细分工艺目录"><p>按产品类别列出候选参与者及国际对标；股票代码为研究标识，不构成上市状态或投资建议。跨环节企业可重复出现。</p><div className="cs-filters"><label>Search companies / tickers / processes<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="中微 / 688012 / HBM" /></label><div className="cs-chips">{['All',...groups].map(g=><button type="button" key={g} onClick={()=>choose(g)} aria-pressed={group===g}>{groupLabels[g] ?? g}</button>)}</div></div><p className="cs-note">{filtered.length} / {segments.length} segments</p><DataTable headers={['层级','细分工艺','国内参与者','技术/证据状态','国际对标']} rows={filtered}/>{!filtered.length&&<p>No matching segments.</p>}</Section>
 <Section id="cs-hbm" title="04 / HBM 与先进封装流程"><div className="cs-flow">{hbm.map((v,i)=><div key={v}><span>{String(i+1).padStart(2,'0')}</span>{v}</div>)}</div><DataTable headers={['工艺','候选参与者','核查重点']} rows={[
 ['DRAM Die','长鑫存储；其他潜在主体待核实','先进 DRAM 实际良品及 HBM 认证'],
 ['TSV / 沉积','中微、北方华创、拓荆','高深宽比、均匀性'],
 ['电镀 / CMP','盛美、华海清科、安集、鼎龙','铜填充、平坦化'],
 ['减薄 / 临时键合','华海清科、芯源微','薄晶圆破损、翘曲'],
 ['堆叠 / 键合','拓荆、华卓精科及专项设备企业','W2W、D2W、TCB 不可混同'],
 ['封装制造','长鑫、长电、盛合晶微等候选','实际合格堆叠产量及客户认证'],
 ['测试','精智达、长川、强一半导体','KGD、HBM 专用测试'],
 ['系统集成','华为海思 / 昇腾生态','系统带宽、功耗与可靠性']
 ]}/></Section>
 <Section id="cs-market" title="05 / 设备采购与国产化成熟度"><div className="cs-market-grid"><div><h3>中国大陆设备采购额（亿美元）</h3>{spending.map(([year,v])=><div className="cs-bar-row" key={year}><span>{year}</span><div className="cs-bar"><i style={{width:(v/500*100)+'%'}}/></div><b>{v}</b></div>)}<p className="cs-note">数据口径为 SEMI WWSEMS。2021–2024 沿用原研究整理的序列，2025 依据 SEMI 公布的地区设备销售额。</p></div><div><h3>2024 国产化率区间（原研究转引估算）</h3>{maturity.map(([name,l,h])=><div className="cs-bar-row" key={name}><span>{name}</span><div className="cs-bar"><i style={{width:h+'%',opacity:l===0?.45:1}}/></div><b>{l===0?'＜'+h:l===h?l:l+'–'+h}%</b></div>)}<p className="cs-note">非 2026 实时份额；统计口径和先进节点覆盖率均不确定。</p></div></div><DataTable headers={['阶段','代表性技术','限制']} rows={[
 ['规模商用','成熟逻辑、DRAM/NAND、刻蚀、清洗、CMP、PECVD、特气、靶材','不代表先进节点全覆盖'],
 ['商业导入','ALD、离子注入、Track、300mm 硅片、KrF/ArF、混合键合、FC-BGA','须按型号/客户核实'],
 ['早期突破','浸没 DUV、先进量测、高端 ESC/MFC、TCB、HBM 测试、ABF 类膜','研发、验证、订单与量产须分开'],
 ['关键短板','EUV 整机、反射光学、光源、胶及先进掩模','完整系统集成与良率未证实']
 ]}/></Section>
 <Section id="cs-regions" title="06 / 区域产业集群"><DataTable headers={['地区','代表企业或机构']} rows={regions}/><p className="cs-note">总部、研发和生产基地不一定在同一地区。</p></Section>
 <Section id="cs-watch" title="07 / 2027–2028 跟踪框架"><ol>{watch.map(v=><li key={v}>{v}</li>)}</ol><h3>数据缺口与风险</h3><p>设备国产化率的金额、数量、装机及节点口径不一致；华为关联晶圆厂产能和股权信息有限；设备整机与内部 BOM 自主化不能混同；HBM 按合格堆叠产量而非前端投片评价。企业最新上市、产品认证、合同与财务数据未全部逐项核验。</p><p>设备主要受新增产能和升级驱动；材料受实际投片和工艺步骤驱动；零部件兼有新增装机与存量耗材需求。四条主线应独立建模。</p></Section>
 <Section id="cs-sources" title="08 / 参考资料"><ul>{sources.map(([title,url])=><li key={url}><a href={url} target="_blank" rel="noreferrer">{title}</a></li>)}</ul><p>更多背景：<Link to="/reports/2026-04-semiconductor-upstream">Semiconductor Upstream Supply Chain</Link> · <Link to="/reports/2026-05-wafer-foundries">Global Wafer Foundry Map</Link></p><p className="cs-note">研究日期 2026-11-24。资料为此前对话研究成果整理，并非本次重新完成的独立尽调；未验证内容明确保留其证据边界。</p></Section>
 </article>
}
