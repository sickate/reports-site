const REPORT_HTML = `
<div class="page">

  <div class="hdr">
    <h1>法拉第旋光片产业链深度解析</h1>
    <div class="sub">AI 光模块时代的"光学单向阀" —— 全球双寡头格局裂解、中国国产替代窗口与稀土反制下的供需重塑</div>
    <div class="meta">
      <div class="item">分析日期 <b>2026-05-11</b></div>
      <div class="item">研究类型 <b>产业链深度</b></div>
      <div class="item">归属赛道 <b>光通信 / AI 算力基础设施</b></div>
      <div class="item">买方视角 <b>横纵分析 + 红队</b></div>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">一</span>
      为什么现在重要 — 供需三个数字
      <span class="tag">/ 卡脖子环节确认 + AI 光模块倍数需求</span>
    </div>
  </div>
  <div class="hero">
    <div class="stat red">
      <div class="num">~120 万</div>
      <div class="lbl">全球年产能（片）</div>
      <div class="desc">Coherent + Granopt 双寡头月产合计 ~10 万片，每片可切约 400 个隔离器</div>
    </div>
    <div class="stat green">
      <div class="num">~2,500 万</div>
      <div class="lbl">2026 年法拉第旋片需求（片）</div>
      <div class="desc">基于 1,500 万只光模块出货（800G 40%、1.6T 15%），1.6T 单机用量是 800G 的 2 倍</div>
    </div>
    <div class="stat">
      <div class="num">&lt; 10%</div>
      <div class="lbl">高端旋片国产化率</div>
      <div class="desc">YIG 中低端 ~50%，TGG/TSAG 高端段不足 10%；福晶科技 2026 Q1 高端方片 1 万片/月扩产</div>
    </div>
  </div>

  <div class="small-note">数据综合：Coherent、Granopt 公开披露 + 中信建投光通信团队、瑞银全球科技峰会反馈、上市公司公告整理。供需数字为产业链多方调研口径，存在 ±20% 不确定带，关键论断不依赖单一数据点。</div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">二</span>
      原理与材料分层 — 为什么材料选择决定了下游应用
    </div>
  </div>
  <div class="princ">
    <div class="princ-svg">
      <h4>光隔离器结构示意（核心元件：法拉第旋光片）</h4>
      <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="80" width="55" height="50" rx="4" fill="#1e40af"/>
        <text x="37.5" y="108" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">激光器</text>
        <text x="37.5" y="122" font-size="9" fill="#bfdbfe" text-anchor="middle">EML</text>

        <line x1="65" y1="100" x2="125" y2="100" stroke="#ef4444" stroke-width="2" marker-end="url(#arrR)"/>

        <rect x="125" y="65" width="38" height="80" fill="#0ea5e9" opacity="0.7"/>
        <text x="144" y="50" font-size="10" fill="#cbd5e1" text-anchor="middle" font-weight="600">偏振器</text>
        <text x="144" y="160" font-size="9" fill="#7dd3fc" text-anchor="middle">P-polarized</text>

        <line x1="163" y1="100" x2="215" y2="100" stroke="#ef4444" stroke-width="2" marker-end="url(#arrR)"/>

        <rect x="195" y="50" width="80" height="110" fill="#fbbf24" opacity="0.25" rx="4"/>
        <text x="235" y="42" font-size="10" fill="#fbbf24" text-anchor="middle" font-weight="700">永磁体（钕铁硼）</text>
        <rect x="215" y="65" width="40" height="80" fill="#dc2626" opacity="0.75"/>
        <text x="235" y="175" font-size="10" fill="#fca5a5" text-anchor="middle" font-weight="700">法拉第旋光片</text>
        <text x="235" y="190" font-size="9" fill="#fca5a5" text-anchor="middle">+45° 旋转偏振面</text>

        <line x1="255" y1="100" x2="307" y2="100" stroke="#ef4444" stroke-width="2" marker-end="url(#arrR)"/>

        <rect x="307" y="65" width="38" height="80" fill="#0ea5e9" opacity="0.7" transform="rotate(45 326 105)"/>
        <text x="326" y="50" font-size="10" fill="#cbd5e1" text-anchor="middle" font-weight="600">检偏器 (45°)</text>

        <line x1="345" y1="100" x2="430" y2="100" stroke="#ef4444" stroke-width="2" marker-end="url(#arrR)"/>

        <rect x="430" y="80" width="80" height="40" rx="20" fill="#10b981"/>
        <text x="470" y="105" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">光纤输出</text>

        <line x1="425" y1="115" x2="350" y2="115" stroke="#9ca3af" stroke-width="2" marker-end="url(#arrL)" stroke-dasharray="4,3"/>
        <line x1="305" y1="115" x2="270" y2="115" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4,3"/>
        <text x="260" y="118" font-size="20" fill="#dc2626" text-anchor="middle" font-weight="900">✕</text>
        <text x="380" y="135" font-size="10" fill="#94a3b8" text-anchor="middle">反射回光被阻断（再 +45° = 90° 偏振失配）</text>

        <defs>
          <marker id="arrR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#ef4444"/>
          </marker>
          <marker id="arrL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#9ca3af"/>
          </marker>
        </defs>
      </svg>
    </div>
    <div class="princ-text">
      <h4>关键技术参数与产业意义</h4>
      <p><span class="hi">磁光（法拉第）效应</span>：磁场作用下偏振面发生非互易性旋转，正反向光走的"光学路径"完全不同 —— 这是任何其他光学元件做不到的"光学二极管"特性。</p>
      <p><span class="hi">为什么 AI 光模块必须用</span>：800G/1.6T EML 激光器对回光极其敏感，0.1% 反射就能导致波长漂移、信号失稳；CW 光源更甚。1.6T 模块单机至少 8–16 个隔离器。</p>
      <p><span class="hi">两条核心技术路线</span>：(1) BiRIG / YIG 体系 LPE 法外延 —— 用于通信波段，薄膜薄、磁体小；(2) TGG / TSAG 体系 提拉法单晶 —— 用于 1μm 高功率激光、1.6T/CPO 高端通信。</p>
      <p><span class="hi">壁垒在哪</span>：液相外延 LPE 工艺 know-how 累积 30+ 年（Granopt 1990 年代起垄断）；TGG/TSAG 大尺寸提拉法良率 60–70% 是行业门槛。</p>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">三</span>
      四种磁光晶体材料对比 — 决定下游适配的关键
    </div>
  </div>
  <div style="padding: 0 44px;">
    <table class="mat-table">
      <thead>
        <tr>
          <th style="width: 110px;">材料</th>
          <th style="width: 130px;">化学式</th>
          <th style="width: 90px;">生长工艺</th>
          <th style="width: 130px;">适配应用</th>
          <th style="width: 90px;">国产化</th>
          <th>核心特点</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="tier">BiRIG（铋替代稀土铁石榴石）</td>
          <td>(Tb,Bi)<sub>3</sub>(Fe,Ga,Al)<sub>5</sub>O<sub>12</sub></td>
          <td>液相外延 LPE</td>
          <td>1.31/1.55μm 通信主流（自由空间 + 在线式）</td>
          <td><span class="tag-lo">起步</span></td>
          <td>法拉第旋转系数最大 → 薄膜薄 (≤450μm)、饱和磁场低 (≤800 Oe) → 隔离器小型化；Granopt 绝对垄断</td>
        </tr>
        <tr>
          <td class="tier">YIG（钇铁石榴石）</td>
          <td>Y<sub>3</sub>Fe<sub>5</sub>O<sub>12</sub></td>
          <td>液相外延 LPE</td>
          <td>800G 中低端 数通光模块</td>
          <td><span class="tag-md">~50%</span></td>
          <td>传统材料，性能略低于 BiRIG，但加工容易、成本低 —— 中低端 800G 主战场，东田微国内突破</td>
        </tr>
        <tr>
          <td class="tier">TGG（铽镓石榴石）</td>
          <td>Tb<sub>3</sub>Ga<sub>5</sub>O<sub>12</sub></td>
          <td>提拉法 Czochralski</td>
          <td>1μm 高功率光纤激光器、1.6T 高端通信</td>
          <td><span class="tag-hi">突破</span></td>
          <td>Verdet 常数大、可见光透明、热稳定性好；福晶科技国内唯一量产；TGG 单晶+SGGG 衬底全流程自主</td>
        </tr>
        <tr>
          <td class="tier">TSAG（铽钪铝石榴石）</td>
          <td>Tb<sub>3</sub>Sc<sub>2</sub>Al<sub>3</sub>O<sub>12</sub></td>
          <td>提拉法 Czochralski</td>
          <td>1.6T / CPO / 超高功率激光（必选）</td>
          <td><span class="tag-hi">先发</span></td>
          <td>磁光优值比 TGG 高约 20%；福晶已通过英伟达认证、稀缺标的；下一代光模块刚性需求</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">四</span>
      产业链全景 — 上游原料 → 衬底 → 磁光晶体 → 器件 → 光模块
    </div>
  </div>
  <div class="chain-wrap">

    <div class="chain-row">
      <div class="chain-label">
        <div class="step-num">①</div>
        <div class="step-name">上游<br>稀土原料</div>
      </div>
      <div class="chain-body">
        <div class="desc"><b>核心原料：铽 Tb（TGG/TSAG/BiRIG 的灵魂元素）</b>；辅料：铋 Bi（BiRIG 用）、钪 Sc（TSAG 用）、钆 Gd / 镓 Ga（衬底用）。<b>关键事件：2025-04 / 2025-10 中国对铽、镝等 12 种中重稀土全面实施出口管制 —— Granopt 原料端被直接卡。</b></div>
        <div class="firms">
          <span class="firm cn">北方稀土<span class="code">600111.SH</span></span>
          <span class="firm cn">中国稀土<span class="code">000831.SZ</span></span>
          <span class="firm cn">广晟有色<span class="code">600259.SH</span></span>
          <span class="firm cn">五矿稀土集团</span>
          <span class="firm cn">南方稀土集团</span>
        </div>
      </div>
    </div>

    <div class="chain-row">
      <div class="chain-label">
        <div class="step-num">②</div>
        <div class="step-name">衬底<br>SGGG / GGG</div>
      </div>
      <div class="chain-body">
        <div class="desc">非磁性石榴石单晶衬底 Gd<sub>3</sub>(ScGa)<sub>5</sub>O<sub>12</sub>，BiRIG/YIG 液相外延必需。晶格常数精度要求亚埃米级，全球供应商极少。</div>
        <div class="firms">
          <span class="firm cn">福晶科技<span class="code">SGGG 自研自产</span></span>
          <span class="firm jp">住友金属矿山<span class="code">5713.T</span></span>
          <span class="firm jp">Granopt<span class="code">SMM 子公司</span></span>
        </div>
      </div>
    </div>

    <div class="chain-row">
      <div class="chain-label">
        <div class="step-num">③</div>
        <div class="step-name">磁光晶体<br>（核心环节）</div>
      </div>
      <div class="chain-body">
        <div class="desc"><b>BiRIG / YIG 路线（LPE 法）：全球双寡头格局 — Coherent (II-VI, 美) ~60% + Granopt (日) ~40%；信越近年退出。</b>月产能合计 ~10 万片，每片切 ~400 个隔离器。<br><b>TGG / TSAG 路线（提拉法）：福晶科技国内独家量产 1.6T 级旋片，2026Q1 高端方片 1 万片/月，小片 500 万片/年，毛利率 &gt;40%，已通过英伟达认证。</b></div>
        <div class="firms">
          <span class="firm us">Coherent / II-VI<span class="code">COHR.US</span></span>
          <span class="firm jp">Granopt<span class="code">日 SMM × 三菱瓦斯化学</span></span>
          <span class="firm cn">福晶科技<span class="code">002222.SZ ★</span></span>
          <span class="firm cn">东田微（YIG）<span class="code">301183.SZ ★</span></span>
          <span class="firm cn">长飞光纤（TGG）<span class="code">601869.SH</span></span>
          <span class="firm cn">中际旭创参股森一量子</span>
        </div>
      </div>
    </div>

    <div class="chain-row">
      <div class="chain-label">
        <div class="step-num">④</div>
        <div class="step-name">配套光学<br>元件</div>
      </div>
      <div class="chain-body">
        <div class="desc">偏振分束器（YVO<sub>4</sub> 钒酸钇晶体）、楔角片、1/4 波片、镀膜元件等。钕铁硼磁环：光隔离器小型化的关键 —— 高性能磁环受铽镝渗透稀土供应约束。</div>
        <div class="firms">
          <span class="firm cn">福晶科技（YVO4 + 波片）<span class="code">002222</span></span>
          <span class="firm cn">腾景科技（YVO4）<span class="code">688195</span></span>
          <span class="firm cn">天通股份（铌酸锂 8寸）<span class="code">600330</span></span>
          <span class="firm cn">长光华芯参股匀晶光电</span>
          <span class="firm cn">中科磁业（磁环）<span class="code">688370</span></span>
          <span class="firm cn">横店东磁<span class="code">002056</span></span>
        </div>
      </div>
    </div>

    <div class="chain-row">
      <div class="chain-label">
        <div class="step-num">⑤</div>
        <div class="step-name">光隔离器 /<br>环行器组装</div>
      </div>
      <div class="chain-body">
        <div class="desc">将磁光晶体、偏振器件、磁环、光纤准直器封装为单/双级隔离器或光环行器。海外 Lumentum、住友电工占据高端；国内已批量替代 800G 中低端。</div>
        <div class="firms">
          <span class="firm us">Lumentum<span class="code">LITE.US</span></span>
          <span class="firm us">Coherent<span class="code">COHR.US</span></span>
          <span class="firm jp">住友电工<span class="code">5802.T</span></span>
          <span class="firm cn">光库科技<span class="code">300620</span></span>
          <span class="firm cn">博创科技<span class="code">300548</span></span>
          <span class="firm cn">太辰光<span class="code">300570</span></span>
          <span class="firm cn">隆华科技<span class="code">300263</span></span>
        </div>
      </div>
    </div>

    <div class="chain-row">
      <div class="chain-label">
        <div class="step-num">⑥</div>
        <div class="step-name">下游<br>应用拉动</div>
      </div>
      <div class="chain-body">
        <div class="desc"><b>AI 数据中心光模块（最大增量）：800G/1.6T 模块出货爆发，单机隔离器用量随通道数翻倍。</b>其他应用：光纤激光器（工业切割焊接）、相干光通信、量子通信、光纤陀螺仪、医疗激光。</div>
        <div class="firms">
          <span class="firm cn">中际旭创<span class="code">300308</span></span>
          <span class="firm cn">新易盛<span class="code">300502</span></span>
          <span class="firm cn">天孚通信<span class="code">300394</span></span>
          <span class="firm cn">光迅科技<span class="code">002281</span></span>
          <span class="firm cn">华工科技<span class="code">000988</span></span>
          <span class="firm cn">锐科激光<span class="code">300747</span></span>
          <span class="firm us">英伟达系 Hyperscaler 客户</span>
        </div>
      </div>
    </div>

  </div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">五</span>
      "双向卡脖子"叙事 — 受益方 vs 受压方
    </div>
  </div>
  <div class="impact">
    <div class="impact-col bull">
      <h4>直接受益方</h4>
      <ul>
        <li><b>福晶科技（002222）</b>：TGG/TSAG 高端段国内唯一，已通过英伟达认证；2025Q3 法拉第旋光片收入翻倍、毛利率 &gt;40%；2026Q1 高端方片 1 万片/月扩产、小片技改至 500 万片/年；预计高端市场份额 &gt;60%。</li>
        <li><b>东田微（301183）</b>：YIG 中低端 800G 主力；子公司微科光电首条产线良率 &gt;70%；2025 年备货 8000 万片，2026Q1 江西基地投产后扩至 1.2 亿片/年；800G 中低端份额 &gt;50%。</li>
        <li><b>长飞光纤（601869）</b>：子公司长飞光坊 TGG 自产、月产小片 10 万片；构建"晶体→隔离器→光模块"垂直整合稀缺路径。</li>
        <li><b>稀土上游</b>：北方稀土、中国稀土等中重稀土厂商 — 铽镝出口管制下国内厂商有原料优先权，价格中枢上移。</li>
        <li><b>下游光模块</b>：中际旭创、新易盛 — 短期供应紧张但需求强劲，绑定上游产能即获 CSP 订单。</li>
      </ul>
    </div>
    <div class="impact-col bear">
      <h4>受压 / 短期承压方</h4>
      <ul>
        <li><b>Granopt（日，SMM × 三菱瓦斯化学）</b>：BiRIG/LPE 全球龙头，但铽原料 100% 依赖中国进口；2023 年秋田扩产工厂投产周期临近，但若稀土审批节奏继续收紧，<b>产能扩张可能跑不赢供给约束</b>。</li>
        <li><b>Coherent / II-VI（COHR.US）</b>：全球 60% 份额，2025-12 已被报道限制对华出口 — 短期保护份额，但<b>变相加速国产替代</b>，长期份额结构性下行风险；同样受中重稀土管制传导影响。</li>
        <li><b>CoWoS / 海外封装设备链</b>：与本议题无关，<b>纯下游光模块 Hyperscaler 短期被动接受涨价</b>，传导能力强（光模块 BOM 中隔离器占比 &lt;5%），但 1.6T 量产节奏可能因供给受限被部分推迟。</li>
        <li><b>纯组装环节中游</b>：缺乏上游磁光晶体自主供应的纯隔离器组装厂 — 议价能力下降、毛利受挤压。</li>
      </ul>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">六</span>
      A 股核心标的横向比较表 — 按产业链位置 + 兑现确定性排序
    </div>
  </div>
  <table class="ashare-table">
    <thead>
      <tr>
        <th style="width: 130px;">公司</th>
        <th style="width: 80px;">代码</th>
        <th style="width: 80px;">环节</th>
        <th>核心技术 / 产能</th>
        <th style="width: 130px;">主要客户</th>
        <th style="width: 90px;">兑现等级</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="firm-name">福晶科技</span></td>
        <td><span class="firm-code">002222.SZ</span></td>
        <td>磁光晶体 高端</td>
        <td>TGG/TSAG 国内唯一量产；SGGG 衬底自研；全流程自主；TSAG 比 TGG 高 20%；2026Q1 高端方片 1 万片/月</td>
        <td>Coherent / Lumentum / 光迅 / 间接英伟达、旭创</td>
        <td><span class="tier-1">★★★★★ 高确定</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">东田微</span></td>
        <td><span class="firm-code">301183.SZ</span></td>
        <td>磁光晶体 中低端</td>
        <td>YIG 国内首条产线良率 &gt;70%；2025 备货 8000 万片，2026 扩至 1.2 亿片/年</td>
        <td>覆盖国内 80% 光模块厂（旭创、新易盛、光迅）</td>
        <td><span class="tier-1">★★★★★ 高确定</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">长飞光纤</span></td>
        <td><span class="firm-code">601869.SH</span></td>
        <td>晶体+隔离器+光模块 一体化</td>
        <td>长飞光坊 TGG 自产、月产小片 10 万片；垂直整合稀缺路径</td>
        <td>东田微 / 福晶 外供 + 自用</td>
        <td><span class="tier-2">★★★★ 中高</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">隆华科技</span></td>
        <td><span class="firm-code">300263.SZ</span></td>
        <td>TGG → 隔离器</td>
        <td>TGG 自产 + 隔离器组装；与东田微差异化</td>
        <td>国内光模块厂</td>
        <td><span class="tier-2">★★★ 中</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">中际旭创</span></td>
        <td><span class="firm-code">300308.SZ</span></td>
        <td>下游 + 投资上游</td>
        <td>800G/1.6T 光模块龙头；通过荷塘创芯基金参股森一量子（FRG 法拉第旋片）</td>
        <td>Hyperscaler / 英伟达</td>
        <td><span class="tier-2">★★★ 中</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">腾景科技</span></td>
        <td><span class="firm-code">688195.SH</span></td>
        <td>配套晶体</td>
        <td>YVO<sub>4</sub> 钒酸钇单晶量产（偏振器件用）</td>
        <td>国内一线光模块厂</td>
        <td><span class="tier-2">★★★ 中</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">光库科技</span></td>
        <td><span class="firm-code">300620.SZ</span></td>
        <td>隔离器组装</td>
        <td>光纤激光器件龙头，包含光纤型隔离器</td>
        <td>国内激光 + 通信客户</td>
        <td><span class="tier-3">★★ 间接</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">博创科技</span></td>
        <td><span class="firm-code">300548.SZ</span></td>
        <td>隔离器组装</td>
        <td>无源器件，具备隔离器规模化量产能力</td>
        <td>高速光模块 + 电信</td>
        <td><span class="tier-3">★★ 间接</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">天通股份</span></td>
        <td><span class="firm-code">600330.SH</span></td>
        <td>配套晶体</td>
        <td>A 股唯一 8 寸铌酸锂晶圆量产；可用于光隔离器晶片</td>
        <td>光通信 + 滤波器</td>
        <td><span class="tier-3">★★ 间接</span></td>
      </tr>
      <tr>
        <td><span class="firm-name">北方稀土 / 中国稀土</span></td>
        <td><span class="firm-code">600111 / 000831</span></td>
        <td>上游 中重稀土</td>
        <td>铽/镝原料；出口管制后国内供应优先权</td>
        <td>磁光晶体 + 钕铁硼厂商</td>
        <td><span class="tier-3">★★ 间接</span></td>
      </tr>
    </tbody>
  </table>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">七</span>
      红队清单 — 7 个常见误判
    </div>
  </div>
  <div class="risks">
    <div class="risk"><span class="num">1</span><b>"国产替代 = 业绩兑现"陷阱</b>：福晶 2025H1 法拉第旋光片业务占总营收仍较小，2026Q1 才是关键观察窗口；需验证收入弹性 vs 估值"概念炒作"。</div>
    <div class="risk"><span class="num">2</span><b>"所有法拉第旋光片公司一视同仁"陷阱</b>：YIG 价格 ~10 元/片 vs TGG/TSAG 单价 50–100 元/片 + 毛利率天差地别。东田微（YIG）≠ 福晶（TGG/TSAG）。</div>
    <div class="risk"><span class="num">3</span><b>"海外双寡头无反击"假设</b>：Granopt 2023 秋田工厂 2026 投产；Coherent 出口限制若放宽，国产替代窗口可能 12–18 个月内被压缩。</div>
    <div class="risk"><span class="num">4</span><b>"稀土管制只伤海外"误判</b>：国内厂商虽免出口审批，但铽现货价已上行 20–30%，福晶 / 东田微毛利率同样面临成本端挤压。</div>
    <div class="risk"><span class="num">5</span><b>"CPO 必爆发"乐观假设</b>：CPO 主流化时间表存疑，如果 1.6T DR/FR 仍是 2027–2028 主战场，TSAG 高端需求弹性弱于市场预期。</div>
    <div class="risk"><span class="num">6</span><b>"2500 万片需求"过度外推</b>：基于 Hyperscaler 2026 capex 兑现假设；任何宏观 / AI 资本开支放缓将直接打折供需缺口叙事。</div>
    <div class="risk"><span class="num">7</span><b>"长飞 38.5% 全球份额"数据存疑</b>：该数据见于民间研报，未在公司年报中明确披露 — 投资决策不应依赖单一未交叉验证的口径。</div>
  </div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">八</span>
      未来 12 个月关键观察节点
    </div>
  </div>
  <div class="watch">
    <div class="watch-grid">
      <div class="watch-item">
        <div class="when">2026 Q1</div>
        <div class="what">福晶 / 东田微 季报</div>
        <div class="why">高端 + 中低端法拉第旋光片收入弹性首次验证</div>
      </div>
      <div class="watch-item">
        <div class="when">2026 Q2</div>
        <div class="what">英伟达 GTC 后续</div>
        <div class="why">1.6T 光模块出货指引与硅光路线占比</div>
      </div>
      <div class="watch-item">
        <div class="when">2026 H2</div>
        <div class="what">Granopt 秋田扩产</div>
        <div class="why">日本端实际放量节奏决定海外替代是否兑现</div>
      </div>
      <div class="watch-item">
        <div class="when">滚动</div>
        <div class="what">中重稀土出口审批</div>
        <div class="why">铽、镝实际出口数据 vs 海外厂商库存情况</div>
      </div>
      <div class="watch-item">
        <div class="when">2026–2027</div>
        <div class="what">CPO 量产节点</div>
        <div class="why">谷歌 Mission Apollo + 英伟达 NVL 系列 CPO 兑现时间</div>
      </div>
    </div>
  </div>

  <div class="sec">
    <div class="sec-title">
      <span class="badge">九</span>
      投资策略框架 — 三段式时间轴
    </div>
  </div>
  <div class="strat">
    <div class="strat-card short">
      <div class="horizon">短期 0–3 个月</div>
      <h5>主题催化驱动</h5>
      <p>福晶 / 东田微 / 长飞 受益于 Coherent 限制 + 稀土反制双重叙事，估值弹性最大；但需警惕"概念炒作"，建议等待 2026Q1 业绩对叙事的实证。</p>
    </div>
    <div class="strat-card mid">
      <div class="horizon">中期 3–12 个月</div>
      <h5>业绩兑现 + 产能放量</h5>
      <p>核心看高端 TGG/TSAG 产能爬坡与英伟达认证扩展进度；福晶毛利率能否维持 &gt;40% 是关键 alpha；东田微 1.2 亿片产能 H2 实际利用率验证。</p>
    </div>
    <div class="strat-card long">
      <div class="horizon">长期 1–3 年</div>
      <h5>结构性国产替代</h5>
      <p>从"国产替代"走向"全球竞争者"。福晶 / 东田微若能稳定切入 Coherent、Lumentum 的海外光模块客户认证体系，估值锚从国产替代逻辑切换至全球磁光晶体寡头逻辑，估值中枢上移空间大。</p>
    </div>
  </div>

  <div class="footer">
    <h6>主要信源（按可信度排序）</h6>
    <div class="src-list">
      <div>• Granopt 官网 / 住友金属矿山 5713.T 公告</div>
      <div>• 福晶科技 2025 半年报、2023 年报</div>
      <div>• Coherent (II-VI) 磁光晶体产品 datasheet</div>
      <div>• 中国商务部 2025 年第 18、56、57、62 号公告</div>
      <div>• Google Patents (US5565131 / EP2647742B1 / US9303333B2)</div>
      <div>• 知乎《法拉第旋转片行业简介》— 行业份额数据</div>
      <div>• 东方财富网 caifuhao 2025-12 月行业纪要</div>
      <div>• 瑞银全球科技峰会 Coherent / Lumentum 反馈</div>
    </div>
    <div class="disc">
      <span>免责声明：本报告基于公开信息整理，仅供参考，不构成任何投资建议。投资有风险，入市需谨慎。</span>
      <span>Co-Authored-By: Claude Opus 4.7 · Deep-Research-Industry skill</span>
    </div>
  </div>

</div>
`;

const SCOPED_CSS = `
.faraday-report {
  --fr-bg: rgba(15, 23, 42, 0.6);
  --fr-card: rgba(30, 41, 59, 0.5);
  --fr-card-alt: rgba(30, 41, 59, 0.28);
  --fr-border: rgba(148, 163, 184, 0.18);
  --fr-text: #e2e8f0;
  --fr-text-soft: #cbd5e1;
  --fr-text-muted: #94a3b8;
  --fr-accent: #60a5fa;
  --fr-accent-strong: #93c5fd;
  --fr-accent-deep: #1e3a8a;
  color: var(--fr-text);
  font-family: "Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.6;
}
.faraday-report *,
.faraday-report *::before,
.faraday-report *::after { box-sizing: border-box; }
.faraday-report .page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--fr-bg);
  border: 1px solid var(--fr-border);
  border-radius: 16px;
  overflow: hidden;
}
.faraday-report .hdr {
  background: linear-gradient(135deg, #0c1e3e 0%, #1e3a8a 60%, #1e40af 100%);
  color: #fff;
  padding: 36px 44px 28px;
  position: relative;
  overflow: hidden;
}
.faraday-report .hdr::before {
  content: ""; position: absolute; right: -60px; top: -60px;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(96,165,250,0.35) 0%, transparent 70%);
}
.faraday-report .hdr h1 { font-size: 34px; font-weight: 900; letter-spacing: 1px; line-height: 1.2; margin: 0 0 8px; color: #fff; }
.faraday-report .hdr .sub { font-size: 16px; color: #bfdbfe; font-weight: 400; line-height: 1.55; margin-bottom: 18px; max-width: 920px; }
.faraday-report .hdr .meta { display: flex; flex-wrap: wrap; gap: 0; margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.18); padding-top: 14px; }
.faraday-report .hdr .meta .item {
  padding: 4px 18px 4px 0;
  border-right: 1px solid rgba(255,255,255,0.18);
  margin-right: 18px; font-size: 13px; color: #cbd5e1;
}
.faraday-report .hdr .meta .item:last-child { border-right: 0; }
.faraday-report .hdr .meta .item b { color: #fff; font-weight: 600; margin-left: 6px; }

.faraday-report .sec { padding: 28px 44px 8px; }
.faraday-report .sec-title {
  font-size: 20px; font-weight: 800; color: #e2e8f0;
  border-left: 4px solid #60a5fa;
  padding-left: 14px; margin: 0 0 16px;
  display: flex; align-items: center; flex-wrap: wrap;
}
.faraday-report .sec-title .badge {
  background: #1e40af; color: #fff; font-size: 13px;
  font-weight: 700; padding: 3px 9px; border-radius: 4px;
  margin-right: 12px;
}
.faraday-report .sec-title .tag { font-size: 12px; color: #94a3b8; font-weight: 400; margin-left: 12px; }

.faraday-report .hero { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; padding: 0 44px; }
.faraday-report .stat {
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-left: 4px solid #38bdf8;
  padding: 16px 18px; border-radius: 8px;
}
.faraday-report .stat.red {
  background: rgba(220, 38, 38, 0.10);
  border-color: rgba(248, 113, 113, 0.30); border-left-color: #f87171;
}
.faraday-report .stat.green {
  background: rgba(16, 185, 129, 0.10);
  border-color: rgba(52, 211, 153, 0.30); border-left-color: #34d399;
}
.faraday-report .stat .num { font-size: 28px; font-weight: 900; line-height: 1; color: #e2e8f0; margin-bottom: 6px; }
.faraday-report .stat.red .num { color: #fca5a5; }
.faraday-report .stat.green .num { color: #6ee7b7; }
.faraday-report .stat .lbl { font-size: 13px; color: #cbd5e1; font-weight: 600; margin-bottom: 4px; }
.faraday-report .stat .desc { font-size: 11.5px; color: #94a3b8; line-height: 1.5; }
.faraday-report .small-note { font-size: 11px; color: #64748b; padding: 8px 44px 6px; }

.faraday-report .princ {
  display: grid; grid-template-columns: 1.1fr 1fr; gap: 20px;
  padding: 0 44px; align-items: stretch;
}
.faraday-report .princ-svg, .faraday-report .princ-text {
  background: var(--fr-card-alt); border: 1px solid var(--fr-border);
  border-radius: 8px; padding: 18px;
}
.faraday-report .princ-svg h4, .faraday-report .princ-text h4 {
  font-size: 14px; font-weight: 700; color: #93c5fd; margin: 0 0 10px;
}
.faraday-report .princ-svg svg { width: 100%; height: auto; display: block; }
.faraday-report .princ-text p { font-size: 13px; line-height: 1.65; color: #cbd5e1; margin: 0 0 8px; }
.faraday-report .princ-text .hi { color: #93c5fd; font-weight: 700; }

.faraday-report .mat-table { width: 100%; border-collapse: collapse; font-size: 12.5px; color: #cbd5e1; }
.faraday-report .mat-table th {
  background: #1e3a8a; color: #fff; padding: 10px 8px;
  font-weight: 600; text-align: left; font-size: 12px;
}
.faraday-report .mat-table td {
  padding: 10px 8px; border-bottom: 1px solid var(--fr-border);
  vertical-align: top; line-height: 1.5;
}
.faraday-report .mat-table tr:nth-child(even) td { background: rgba(148, 163, 184, 0.05); }
.faraday-report .mat-table .tier { font-weight: 700; color: #e2e8f0; }
.faraday-report .mat-table .tag-hi {
  display: inline-block; background: rgba(59, 130, 246, 0.18); color: #93c5fd;
  font-size: 10.5px; padding: 2px 7px; border-radius: 3px; font-weight: 600;
}
.faraday-report .mat-table .tag-md {
  display: inline-block; background: rgba(245, 158, 11, 0.18); color: #fcd34d;
  font-size: 10.5px; padding: 2px 7px; border-radius: 3px; font-weight: 600;
}
.faraday-report .mat-table .tag-lo {
  display: inline-block; background: rgba(148, 163, 184, 0.15); color: #cbd5e1;
  font-size: 10.5px; padding: 2px 7px; border-radius: 3px; font-weight: 600;
}

.faraday-report .chain-wrap { padding: 0 44px; }
.faraday-report .chain-row {
  display: grid; grid-template-columns: 130px 1fr;
  gap: 0; margin-bottom: 10px;
  border: 1px solid var(--fr-border); border-radius: 8px; overflow: hidden;
  background: var(--fr-card-alt);
}
.faraday-report .chain-label {
  background: linear-gradient(160deg, #0c1e3e 0%, #1e3a8a 100%);
  color: #fff;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 12px 8px; text-align: center;
}
.faraday-report .chain-label .step-num {
  font-size: 22px; font-weight: 900; line-height: 1; color: #fbbf24; margin-bottom: 4px;
}
.faraday-report .chain-label .step-name { font-size: 13px; font-weight: 700; line-height: 1.3; color: #fff; }
.faraday-report .chain-body { padding: 12px 16px; background: transparent; }
.faraday-report .chain-body .desc { font-size: 12.5px; color: #cbd5e1; margin-bottom: 8px; line-height: 1.55; }
.faraday-report .chain-body .desc b { color: #e2e8f0; }
.faraday-report .chain-body .firms { display: flex; flex-wrap: wrap; gap: 6px; }
.faraday-report .firm {
  background: rgba(59, 130, 246, 0.10); border: 1px solid rgba(96, 165, 250, 0.30);
  color: #bfdbfe; font-size: 11.5px;
  padding: 4px 9px; border-radius: 4px; font-weight: 600;
}
.faraday-report .firm.cn { background: rgba(16, 185, 129, 0.10); border-color: rgba(52, 211, 153, 0.30); color: #6ee7b7; }
.faraday-report .firm.jp { background: rgba(220, 38, 38, 0.10); border-color: rgba(248, 113, 113, 0.30); color: #fca5a5; }
.faraday-report .firm.us { background: rgba(245, 158, 11, 0.12); border-color: rgba(251, 191, 36, 0.30); color: #fcd34d; }
.faraday-report .firm .code { font-size: 10.5px; color: #94a3b8; margin-left: 4px; font-weight: 400; }

.faraday-report .impact { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 0 44px; }
.faraday-report .impact-col { border-radius: 8px; padding: 16px 18px; }
.faraday-report .impact-col.bull {
  background: rgba(16, 185, 129, 0.10);
  border: 1px solid rgba(52, 211, 153, 0.28);
  border-left: 4px solid #34d399;
}
.faraday-report .impact-col.bear {
  background: rgba(220, 38, 38, 0.10);
  border: 1px solid rgba(248, 113, 113, 0.28);
  border-left: 4px solid #f87171;
}
.faraday-report .impact-col h4 { font-size: 16px; font-weight: 800; margin: 0 0 10px; display: flex; align-items: center; }
.faraday-report .impact-col.bull h4 { color: #6ee7b7; }
.faraday-report .impact-col.bear h4 { color: #fca5a5; }
.faraday-report .impact-col h4::before {
  content: ""; display: inline-block;
  width: 8px; height: 8px; border-radius: 50%;
  margin-right: 8px;
}
.faraday-report .impact-col.bull h4::before { background: #34d399; }
.faraday-report .impact-col.bear h4::before { background: #f87171; }
.faraday-report .impact-col ul { list-style: none; margin: 0; padding: 0; }
.faraday-report .impact-col li {
  font-size: 12.5px; line-height: 1.65; color: #cbd5e1;
  margin: 0 0 8px; padding-left: 14px; position: relative;
}
.faraday-report .impact-col li::before { content: "•"; position: absolute; left: 0; color: #94a3b8; font-weight: 700; }
.faraday-report .impact-col li b { color: #e2e8f0; }

.faraday-report .ashare-table {
  width: calc(100% - 88px); margin: 0 44px;
  border-collapse: collapse; font-size: 12px; color: #cbd5e1;
}
.faraday-report .ashare-table th {
  background: linear-gradient(180deg, #0c1e3e, #1e3a8a); color: #fff;
  padding: 10px 10px; text-align: left;
  font-weight: 600; font-size: 11.5px;
}
.faraday-report .ashare-table td {
  padding: 8px 10px; border-bottom: 1px solid var(--fr-border);
  line-height: 1.45; vertical-align: middle;
}
.faraday-report .ashare-table tr:nth-child(even) td { background: rgba(148, 163, 184, 0.05); }
.faraday-report .ashare-table .firm-name { font-weight: 700; color: #e2e8f0; }
.faraday-report .ashare-table .firm-code { font-size: 10.5px; color: #94a3b8; }
.faraday-report .ashare-table .star { color: #fbbf24; letter-spacing: -1px; font-weight: 700; }
.faraday-report .ashare-table .tier-1 { color: #6ee7b7; font-weight: 700; }
.faraday-report .ashare-table .tier-2 { color: #93c5fd; font-weight: 600; }
.faraday-report .ashare-table .tier-3 { color: #94a3b8; font-weight: 500; }

.faraday-report .risks { padding: 0 44px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.faraday-report .risk {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.28);
  border-left: 4px solid #f59e0b;
  padding: 11px 14px; border-radius: 6px;
  font-size: 12px; line-height: 1.6; color: #cbd5e1;
}
.faraday-report .risk b { color: #fcd34d; font-weight: 700; }
.faraday-report .risk .num {
  display: inline-block; background: #d97706; color: #fff;
  width: 18px; height: 18px; border-radius: 50%;
  font-size: 11px; line-height: 18px; text-align: center;
  font-weight: 700; margin-right: 6px;
}

.faraday-report .watch { padding: 0 44px; }
.faraday-report .watch-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.faraday-report .watch-item {
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-top: 3px solid #38bdf8;
  padding: 12px 12px; border-radius: 6px;
}
.faraday-report .watch-item .when { font-size: 11px; color: #7dd3fc; font-weight: 700; margin-bottom: 4px; }
.faraday-report .watch-item .what { font-size: 12px; color: #e2e8f0; font-weight: 600; line-height: 1.4; margin-bottom: 4px; }
.faraday-report .watch-item .why { font-size: 11px; color: #94a3b8; line-height: 1.5; }

.faraday-report .strat { padding: 0 44px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.faraday-report .strat-card {
  border-radius: 8px; padding: 14px 16px;
  background: var(--fr-card-alt); border: 1px solid var(--fr-border);
}
.faraday-report .strat-card .horizon {
  display: inline-block; font-size: 11px; font-weight: 700;
  padding: 3px 9px; border-radius: 3px; margin-bottom: 8px;
}
.faraday-report .strat-card.short .horizon { background: rgba(245, 158, 11, 0.18); color: #fcd34d; }
.faraday-report .strat-card.mid   .horizon { background: rgba(59, 130, 246, 0.18); color: #93c5fd; }
.faraday-report .strat-card.long  .horizon { background: rgba(168, 85, 247, 0.18); color: #d8b4fe; }
.faraday-report .strat-card h5 { font-size: 14px; font-weight: 700; color: #e2e8f0; margin: 0 0 6px; line-height: 1.4; }
.faraday-report .strat-card p { font-size: 12px; color: #cbd5e1; line-height: 1.6; margin: 0; }

.faraday-report .footer {
  background: linear-gradient(180deg, rgba(12, 30, 62, 0.6), rgba(12, 30, 62, 0.9));
  color: #cbd5e1;
  padding: 22px 44px;
  margin-top: 30px;
  font-size: 11.5px; line-height: 1.6;
  border-top: 1px solid var(--fr-border);
}
.faraday-report .footer h6 { font-size: 12px; color: #fff; font-weight: 700; margin: 0 0 6px; }
.faraday-report .src-list { columns: 2; column-gap: 24px; font-size: 10.5px; color: #94a3b8; }
.faraday-report .src-list a { color: #93c5fd; text-decoration: none; }
.faraday-report .footer .disc {
  border-top: 1px solid rgba(148, 163, 184, 0.15);
  padding-top: 12px; margin-top: 12px;
  color: #64748b; font-size: 10.5px;
  display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
}

@media (max-width: 900px) {
  .faraday-report .hero,
  .faraday-report .princ,
  .faraday-report .impact,
  .faraday-report .strat { grid-template-columns: 1fr; }
  .faraday-report .watch-grid { grid-template-columns: repeat(2, 1fr); }
  .faraday-report .risks { grid-template-columns: 1fr; }
  .faraday-report .chain-row { grid-template-columns: 100px 1fr; }
  .faraday-report .sec,
  .faraday-report .hero,
  .faraday-report .princ,
  .faraday-report .impact,
  .faraday-report .strat,
  .faraday-report .risks,
  .faraday-report .watch,
  .faraday-report .chain-wrap { padding-left: 18px; padding-right: 18px; }
  .faraday-report .ashare-table { width: calc(100% - 36px); margin: 0 18px; }
  .faraday-report .hdr,
  .faraday-report .footer { padding-left: 18px; padding-right: 18px; }
}
`;

function FaradayRotatorReport() {
  return (
    <div className="faraday-report" style={{ width: '100%' }}>
      <style>{SCOPED_CSS}</style>
      <div dangerouslySetInnerHTML={{ __html: REPORT_HTML }} />
    </div>
  );
}

export default FaradayRotatorReport;
