import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'etch-equipment',
  name: '刻蚀设备',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '先进逻辑和存储里最核心的工艺放大器之一。',
  market: { v2024: 18.0, v2025: 20.9, basis: 'B', note: '按WFE中etch大类拆分，受先进逻辑/3D NAND拉动较强。' },
  detail: {
    title: '刻蚀板块深度拆解',
    intro: '把“刻蚀”从平铺公司列表升级为三层主线 + 一层A股配套映射：A 看寡头主线，B 看特色场景，C 看潜在进展者，D 看A股整机与关键配套。默认仅显示名称 + 市值，点组内 + 号后再看财务卡。',
    updateNote: '财务卡当前已补充 10 家公司：营收增长、25/26 收入、净利润、净利率、PE；毛利率字段已预留，待你后续补数。',
    groups: [
      {
        title: 'A. 寡头主线',
        desc: '最直接对应先进逻辑、先进存储、HBM 与高端前道扩产，是刻蚀方向里真正决定资本开支主线与客户粘性的核心龙头。',
        companies: [
          { name: 'Lam Research', market: 'us', cap: '$223.7B', summary: '导体刻蚀、高端逻辑/存储刻蚀龙头。', tags: ['逻辑', '存储', '导体刻蚀'] },
          { name: 'Tokyo Electron', market: 'jp', cap: '$125.6B', summary: 'DRAM 电容、NAND 低温深孔、HBM / 先进封装强。', tags: ['DRAM', '3D NAND', 'HBM'] },
          { name: 'Applied Materials', market: 'us', cap: '$255.3B', summary: '材料工程平台型巨头，在 2nm / HBM Etch 拿到 TOR，值得重点跟踪。', tags: ['平台型', '2nm', 'HBM'] },
          { name: 'Hitachi High-Tech', market: 'jp', cap: '母公司 $141.1B', summary: '在各向同性 / 原子级刻蚀、先进 3D 结构修形更强。', tags: ['原子级', '各向同性', '3D 修形'], note: '当前并非独立上市主体；页面展示的是其母公司 Hitachi 的市值。' },
          { name: '中微公司（AMEC）', market: 'cn', cap: 'RMB 227.8B', summary: '中国先进 Etch 纯正龙头。', tags: ['中国龙头', 'CCP', '国产替代'], note: '2026E 利润在不同卖方模型中分歧不小；页面财务卡默认采用你提供的完整模型口径。' }
        ]
      },
      {
        title: 'B. 细分特色玩家',
        desc: '这组更适合看“结构性机会”——先进封装、TSV、compound semiconductor、特殊 dry / wet etch 场景，经常不是最大盘子，但容易出现超预期进展。',
        companies: [
          { name: 'KLA / SPTS', market: 'us', cap: '$159.7B', summary: '在先进封装、TSV、via reveal、薄化相关刻蚀场景值得重点跟踪。', tags: ['先进封装', 'TSV', 'Via Reveal'], note: 'SPTS 是 KLA 旗下业务单元，页面展示 KLA 的市值。' },
          { name: 'ULVAC', market: 'jp', cap: '$3.05B', summary: '深氧化层刻蚀、干法刻蚀、NLD 技术有特色。', tags: ['深氧化层', 'Dry Etch', 'NLD'] },
          { name: 'Oxford Instruments Plasma Technology', market: 'uk', cap: '$1.97B', summary: '研发到量产兼顾；2026 年披露新的等离子设备供货协议。', tags: ['Photonics', 'InP', 'Plasma'], note: 'Oxford Instruments 2026 年初披露与 AOI 的多套 etch / deposition cluster systems 供货协议。' },
          { name: 'Samco', market: 'jp', cap: '$380M', summary: 'GaN / AlGaN、SiC、DRIE / TSV 刻蚀有特色。', tags: ['GaN', 'SiC', 'DRIE / TSV'] },
          { name: 'ACM Research', market: 'us', cap: '$2.51B', summary: '更偏 wet etch / bevel etch / backside cleaning，不是高端 dry etch 主龙头，但在特殊刻蚀场景值得关注。', tags: ['Wet Etch', 'Bevel', 'Backside'] }
        ]
      },
      {
        title: 'C. 值得额外盯的潜在进展者',
        desc: '这一层不一定是当前刻蚀份额最大的玩家，但在平台延展、产品线外溢、国产替代和区域扩张上，最容易出现“从跟踪名单升格为主线配置”的变化。',
        companies: [
          { name: '北方华创', market: 'cn', cap: 'RMB 359.5B', summary: '中国最强平台型半导体设备公司之一，Etch 产品线覆盖已经很全。', tags: ['平台延展', '国产替代', '产品线全'] },
          { name: 'GIGALANE', market: 'kr', cap: '$143M', summary: '在 DRIE / ICP 方向持续推进，并扩展中国布局。', tags: ['DRIE', 'ICP', '中国扩张'] }
        ]
      },
      {
        title: 'D. A股：整机 + 关键配套映射',
        desc: '这层不是“高端 dry etch 主机龙头”的同义词，而是围绕刻蚀设备交付链条的重要国产映射：整机平台、腔体/零部件、超高洁净流体、真空系统、高纯石英材料。',
        companies: [
          { name: '富创精密', market: 'cn', cap: 'RMB 27.9B', summary: '半导体设备精密零部件核心标的，适合放在国产设备渗透链条里跟踪。', tags: ['零部件', '腔体', '国产替代'] },
          { name: '新莱应材', market: 'cn', cap: 'RMB 21.0B', summary: '高洁净流体系统与真空相关部件能力强，是设备链条里的关键配套。', tags: ['高洁净', '流体系统', '真空配套'] },
          { name: '汉钟精机', market: 'cn', cap: 'RMB 12.8B', summary: '真空泵与相关设备配套受益于 fab 扩产和设备交付。', tags: ['真空泵', 'Fab 配套', '低估值'] },
          { name: '石英股份', market: 'cn', cap: 'RMB 27.1B', summary: '高纯石英材料与器件是等离子、刻蚀、扩散等设备的重要上游耗材/部件映射。', tags: ['高纯石英', '耗材', '设备上游'] }
        ]
      }
    ]
  }
});
