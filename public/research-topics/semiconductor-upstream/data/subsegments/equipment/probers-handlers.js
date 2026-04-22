import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'probers-handlers',
  name: '探针台 / Handler / Prober',
  section: '设备',
  flowTo: ['测试 / 出货'],
  initialOpen: true,
  summary: '晶圆级测试、高温低温测试、先进封装测试和测试接触生态中的关键装备与关键配套。',
  market: {
    v2024: 4.2,
    v2025: 4.7,
    basis: 'B',
    note: '网页中采用 wafer prober、test handler、sorter 与关键测试接触件的合并展示口径，更适合从测试生态而不是单一整机去理解。'
  },
  detail: {
    title: '探针台 / Handler 板块深度拆解',
    intro: '把“探针台 / Handler / Prober”拆成四层来看：A 看量产型 probe / 测试生态主线龙头，B 看特色场景与后道平台玩家，C 看潜在进展者，D 看 A 股整机与关键配套映射。阅读上要把整机、handler、probe card、接触件分开理解，它们共同构成测试环节的完整生态。',
    updateNote: '这批数据里前几家公司仍带有明显 CMP 属性，所以本页按探针台主题只纳入真正属于 probe / handler / 测试接触生态的公司；CMP 相关公司继续留在 CMP 板块。',
    groups: [
      {
        title: 'A. 主线龙头与测试生态核心',
        desc: '这一层是测试环节里最值得优先研究的主线。东京精密代表量产型 wafer prober 龙头，FormFactor 和 Micronics Japan 更偏先进 probe card / 接触平台，Advantest 则是测试生态的绝对核心平台，虽然不是纯探针台公司，但对整个测试搬运和接口体系有极强支配力。',
        companies: [
          {
            name: '东京精密',
            market: 'jp',
            cap: 'USD 4.01B',
            summary: '日本量产型 wafer prober 龙头之一，强在高精度量产探针台与前道测试平台。',
            tags: ['wafer prober', 'high precision', 'japan leader', 'front-end', 'test automation'],
            note: '主业不止探针台，切割 / 测量等业务也贡献收入；板块敞口以半导体生产设备分部为主。'
          },
          {
            name: 'FormFactor',
            market: 'us',
            cap: 'USD 9.47B',
            summary: '先进 probe card 与 engineering probe systems 龙头，典型 “Lab-to-Fab” 测试接触平台。',
            tags: ['advanced probe card', 'engineering probe system', 'HBM', 'AI/HPC', 'lab-to-fab'],
            note: '并非纯 wafer prober 整机商；更偏先进接触件 + 工程测试平台。'
          },
          {
            name: 'Micronics Japan',
            market: 'jp',
            cap: 'USD 2.89B',
            summary: '存储器 / HBM probe card 强势玩家，同时布局 prober、tester 与接触件。',
            tags: ['memory probe card', 'HBM', 'probe card', 'japan', 'test contact'],
            note: '更接近 probe card 主线，不是纯 wafer prober 整机商。'
          },
          {
            name: 'Advantest',
            market: 'jp',
            cap: 'USD 111.42B',
            summary: 'ATE 绝对龙头，测试机主导并向 prober / handler / interface 延伸，是测试生态核心平台。',
            tags: ['ATE', 'test platform', 'handler', 'interface', 'ecosystem'],
            note: '非纯探针台公司；纳入是因为其在测试接触 / 搬运生态中的统治力。'
          }
        ]
      },
      {
        title: 'B. 特色玩家与后道平台',
        desc: '这一层更适合看特色测试场景和非纯整机平台。MPI Corp 在 RF、毫米波、热测试和光子方向有鲜明技术属性，Cohu 更偏 handler / final test 自动化平台，Technoprobe 则是欧洲 probe card 主线龙头之一，强在逻辑 / 非存储先进接触件。',
        companies: [
          {
            name: 'MPI Corp',
            market: 'tw',
            cap: 'USD 11.14B',
            summary: 'RF / mmWave、光子、低温 / 热测试与高端 probe systems 特色玩家。',
            tags: ['RF/mmWave', 'photonics', 'thermal test', 'probe system', 'taiwan'],
            note: '公司同时做 probe card 与特种测试平台，偏工程 / 高频场景。'
          },
          {
            name: 'Cohu',
            market: 'us',
            cap: 'USD 1.76B',
            summary: '后道测试自动化、handler、interface 与软件分析平台型公司。',
            tags: ['handler', 'final test', 'interface', 'inspection', 'software'],
            note: '非纯 wafer prober；更偏封装后测试搬运与接口平台。'
          },
          {
            name: 'Technoprobe',
            market: 'eu',
            cap: 'USD 11.30B',
            summary: '欧洲 probe card 龙头，逻辑 / 非存储先进接触件能力强。',
            tags: ['probe card', 'logic/non-memory', 'europe', 'test contact', 'advanced packaging'],
            note: '非 wafer prober 整机，属于测试接触关键配套；市值以母公司口径。'
          }
        ]
      },
      {
        title: 'C. 潜在进展者',
        desc: 'Japan Electronic Materials 体量不算大，但作为日本上市探针卡公司，正好卡在“规模不大、但受益先进逻辑 / 存储测试升级”的位置，更适合作为潜在进展者和弹性观察名单。',
        companies: [
          {
            name: 'Japan Electronic Materials',
            market: 'jp',
            cap: 'USD 0.61B',
            summary: '日本探针卡上市公司，国内份额高，受益先进逻辑 / 存储测试升级。',
            tags: ['probe card', 'japan', 'listed challenger', 'test contact', 'domestic share'],
            note: '规模与全球龙头仍有差距，更适合归入潜在进展者。'
          }
        ]
      },
      {
        title: 'D. A股整机与关键配套映射',
        desc: 'A 股这边要分成整机、后道自动化平台和接触件配套来理解。矽电股份是最接近 wafer prober 的本土整机映射，金海通更偏 handler / sorter，长川科技是测试平台型公司，和林微纳则卡在探针与接触件刀口。',
        companies: [
          {
            name: '矽电股份',
            market: 'cn',
            cap: 'RMB 11.78B',
            summary: 'A 股最接近纯 wafer prober 映射的大陆厂商，兼有晶粒探针台与分选机。',
            tags: ['wafer prober', 'china localization', '12-inch', 'optoelectronics', 'sorter'],
            note: '大陆 12 英寸晶圆探针台产业化代表；2025 业绩预告与单一卖方预测存在差异。'
          },
          {
            name: '金海通',
            market: 'cn',
            cap: 'RMB 20.02B',
            summary: 'A 股最纯的半导体测试分选机 / handler 标的，后道自动化映射最直接。',
            tags: ['handler', 'sorter', 'back-end test', 'china', 'high-end packaging'],
            note: '不是 wafer prober，属于测试搬运整机映射；2025 已是 actual。'
          },
          {
            name: '长川科技',
            market: 'cn',
            cap: 'RMB 89.59B',
            summary: '国产测试设备平台，测试机 + 分选机为主，探针台项目具备扩张想象力。',
            tags: ['test platform', 'tester', 'sorter', 'prober optionality', 'china'],
            note: '平台型公司，非纯探针台收入；探针台是部分敞口。'
          },
          {
            name: '和林微纳',
            market: 'cn',
            cap: 'RMB 13.21B',
            summary: '半导体测试探针与微纳精密件映射标的，卡在“接触件”刀口。',
            tags: ['test probe', 'micro-nano', 'contact parts', 'china', 'mapping'],
            note: '关键配套映射，不是整机厂；板块收入并非全部来自半导体测试探针。'
          }
        ]
      }
    ]
  }
});
