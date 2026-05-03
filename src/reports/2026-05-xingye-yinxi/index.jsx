import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const REPORT_STYLES = `
  .xingye-report {
    --xy-bg: #07111f;
    --xy-panel: rgba(10, 23, 41, 0.82);
    --xy-panel-strong: rgba(14, 29, 49, 0.96);
    --xy-panel-soft: rgba(23, 39, 62, 0.66);
    --xy-border: rgba(148, 163, 184, 0.18);
    --xy-text: #e5edf8;
    --xy-text-dim: #9fb0c8;
    --xy-text-soft: #7f90a8;
    --xy-silver: #d6d8df;
    --xy-tin: #90a4b8;
    --xy-green: #56d6a2;
    --xy-amber: #f4b56a;
    --xy-red: #ff8b86;
    --xy-cyan: #65d3ff;
    width: min(1500px, calc(100vw - 32px));
    margin: 0 auto 48px;
    color: var(--xy-text);
    font-family: 'IBM Plex Sans', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
  }

  .xingye-report * {
    box-sizing: border-box;
  }

  .xingye-report a {
    color: var(--xy-cyan);
    text-decoration: none;
  }

  .xingye-report a:hover {
    text-decoration: underline;
  }

  .xingye-shell {
    background:
      radial-gradient(circle at top left, rgba(214, 216, 223, 0.16), transparent 28%),
      radial-gradient(circle at top right, rgba(101, 211, 255, 0.1), transparent 26%),
      linear-gradient(180deg, #09111c 0%, #07111f 24%, #091523 100%);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 28px 80px rgba(2, 6, 23, 0.42);
  }

  .xingye-hero {
    position: relative;
    padding: 40px 40px 30px;
    background:
      linear-gradient(135deg, rgba(214, 216, 223, 0.09), rgba(86, 214, 162, 0.05)),
      linear-gradient(180deg, rgba(8, 17, 30, 0.96), rgba(10, 23, 41, 0.86));
    border-bottom: 1px solid var(--xy-border);
  }

  .xingye-hero::after {
    content: '';
    position: absolute;
    inset: auto -10% -90px auto;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(244, 181, 106, 0.12), transparent 68%);
    pointer-events: none;
  }

  .xingye-pill-row,
  .xingye-meta-row,
  .xingye-hero-grid,
  .xingye-thesis-grid,
  .xingye-kpi-grid,
  .xingye-panel-grid,
  .xingye-dual-grid,
  .xingye-card-grid,
  .xingye-scenario-grid,
  .xingye-risk-grid,
  .xingye-source-grid {
    display: grid;
    gap: 16px;
  }

  .xingye-pill-row {
    grid-template-columns: repeat(auto-fit, minmax(160px, max-content));
    margin-bottom: 18px;
  }

  .xingye-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.56);
    border: 1px solid rgba(148, 163, 184, 0.18);
    color: var(--xy-text-dim);
    font-size: 0.8rem;
    letter-spacing: 0.01em;
  }

  .xingye-pill strong {
    color: var(--xy-text);
    font-weight: 600;
  }

  .xingye-title {
    max-width: 940px;
    margin-bottom: 14px;
  }

  .xingye-title h1 {
    margin: 0;
    font-size: clamp(2.2rem, 4vw, 4.1rem);
    line-height: 1.04;
    letter-spacing: -0.04em;
    font-weight: 700;
    color: var(--xy-text);
  }

  .xingye-title h1 span {
    display: inline-block;
    background: linear-gradient(90deg, #f5f7fb 0%, #cad4e5 35%, #f2bb72 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .xingye-title p {
    margin: 14px 0 0;
    color: var(--xy-text-dim);
    font-size: 1rem;
    line-height: 1.7;
    max-width: 780px;
  }

  .xingye-meta-row {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    margin: 22px 0 26px;
  }

  .xingye-meta-card {
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(12, 24, 42, 0.72);
    border: 1px solid var(--xy-border);
    backdrop-filter: blur(10px);
  }

  .xingye-meta-card span {
    display: block;
    color: var(--xy-text-soft);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .xingye-meta-card strong {
    display: block;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--xy-text);
  }

  .xingye-meta-card small {
    display: block;
    margin-top: 6px;
    color: var(--xy-text-dim);
    line-height: 1.5;
  }

  .xingye-hero-grid {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
    align-items: stretch;
  }

  .xingye-hero-notes,
  .xingye-model-card {
    background: var(--xy-panel);
    border: 1px solid var(--xy-border);
    border-radius: 24px;
    padding: 24px;
    backdrop-filter: blur(12px);
  }

  .xingye-hero-notes h2,
  .xingye-model-card h2 {
    margin: 0 0 10px;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--xy-text);
  }

  .xingye-hero-notes p,
  .xingye-model-card p,
  .xingye-copy p {
    margin: 0;
    color: var(--xy-text-dim);
    line-height: 1.75;
  }

  .xingye-hero-notes ul,
  .xingye-copy ul,
  .xingye-copy ol {
    margin: 14px 0 0;
    padding-left: 18px;
    color: var(--xy-text-dim);
    line-height: 1.72;
  }

  .xingye-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 16px;
  }

  .xingye-kpi-card {
    padding: 16px;
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(17, 29, 49, 0.9), rgba(9, 18, 31, 0.9));
    border: 1px solid rgba(148, 163, 184, 0.12);
  }

  .xingye-kpi-card span {
    display: block;
    color: var(--xy-text-soft);
    font-size: 0.82rem;
    margin-bottom: 8px;
  }

  .xingye-kpi-card strong {
    display: block;
    font-size: 1.7rem;
    font-weight: 700;
    color: var(--xy-text);
    letter-spacing: -0.03em;
  }

  .xingye-kpi-card small {
    display: block;
    margin-top: 8px;
    color: var(--xy-text-dim);
    line-height: 1.55;
  }

  .xingye-green {
    color: var(--xy-green) !important;
  }

  .xingye-silver {
    color: var(--xy-silver) !important;
  }

  .xingye-tin {
    color: var(--xy-tin) !important;
  }

  .xingye-amber {
    color: var(--xy-amber) !important;
  }

  .xingye-body {
    padding: 34px 40px 40px;
  }

  .xingye-section {
    margin-top: 34px;
  }

  .xingye-section:first-child {
    margin-top: 0;
  }

  .xingye-section-header {
    margin-bottom: 18px;
  }

  .xingye-section-header span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border-radius: 999px;
    background: rgba(101, 211, 255, 0.08);
    border: 1px solid rgba(101, 211, 255, 0.16);
    color: var(--xy-cyan);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .xingye-section-header h2 {
    margin: 0;
    font-size: clamp(1.5rem, 2vw, 2.15rem);
    font-weight: 650;
    letter-spacing: -0.03em;
    color: var(--xy-text);
  }

  .xingye-section-header p {
    margin: 10px 0 0;
    color: var(--xy-text-dim);
    max-width: 860px;
    line-height: 1.72;
  }

  .xingye-thesis-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .xingye-thesis-card,
  .xingye-panel,
  .xingye-mini-panel,
  .xingye-source-card {
    background: var(--xy-panel);
    border: 1px solid var(--xy-border);
    border-radius: 22px;
    padding: 20px;
  }

  .xingye-thesis-card strong,
  .xingye-panel h3,
  .xingye-mini-panel h3,
  .xingye-source-card strong {
    display: block;
    color: var(--xy-text);
    margin-bottom: 10px;
    font-size: 1.02rem;
    font-weight: 600;
  }

  .xingye-thesis-card p,
  .xingye-panel p,
  .xingye-panel li,
  .xingye-mini-panel p,
  .xingye-source-card p,
  .xingye-source-card li {
    color: var(--xy-text-dim);
    margin: 0;
    line-height: 1.7;
  }

  .xingye-panel-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .xingye-panel {
    min-height: 100%;
  }

  .xingye-panel ul,
  .xingye-mini-panel ul,
  .xingye-source-card ul {
    margin: 12px 0 0;
    padding-left: 18px;
  }

  .xingye-panel-grid .xingye-panel strong.metric {
    display: block;
    font-size: 1.6rem;
    color: var(--xy-text);
    margin-bottom: 8px;
  }

  .xingye-dual-grid {
    grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
  }

  .xingye-card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .xingye-mini-panel {
    min-height: 100%;
  }

  .xingye-mini-panel small {
    display: block;
    margin-top: 8px;
    color: var(--xy-text-soft);
    line-height: 1.6;
  }

  .xingye-chart-frame {
    background: var(--xy-panel-strong);
    border: 1px solid var(--xy-border);
    border-radius: 24px;
    padding: 18px 18px 10px;
  }

  .xingye-chart-head {
    margin-bottom: 16px;
  }

  .xingye-chart-head strong {
    display: block;
    color: var(--xy-text);
    font-size: 1rem;
    margin-bottom: 6px;
  }

  .xingye-chart-head p {
    margin: 0;
    color: var(--xy-text-dim);
    line-height: 1.65;
  }

  .xingye-scenario-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .xingye-scenario-card {
    position: relative;
    overflow: hidden;
    padding: 20px;
    border-radius: 22px;
    border: 1px solid var(--xy-border);
    background: linear-gradient(180deg, rgba(13, 25, 42, 0.92), rgba(7, 15, 27, 0.92));
  }

  .xingye-scenario-card.is-live {
    border-color: rgba(86, 214, 162, 0.44);
    box-shadow: 0 0 0 1px rgba(86, 214, 162, 0.12), inset 0 0 80px rgba(86, 214, 162, 0.05);
  }

  .xingye-scenario-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.1);
    color: var(--xy-text-dim);
    font-size: 0.78rem;
    margin-bottom: 14px;
  }

  .xingye-scenario-card.is-live .xingye-scenario-label {
    background: rgba(86, 214, 162, 0.16);
    color: var(--xy-green);
  }

  .xingye-scenario-card h3 {
    margin: 0 0 10px;
    font-size: 1.15rem;
    color: var(--xy-text);
  }

  .xingye-scenario-metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin: 14px 0 16px;
  }

  .xingye-scenario-metrics div {
    background: rgba(15, 23, 42, 0.56);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 16px;
    padding: 12px;
  }

  .xingye-scenario-metrics span {
    display: block;
    color: var(--xy-text-soft);
    font-size: 0.76rem;
    margin-bottom: 6px;
  }

  .xingye-scenario-metrics strong {
    display: block;
    color: var(--xy-text);
    font-size: 1.2rem;
  }

  .xingye-scenario-card p {
    margin: 0;
    color: var(--xy-text-dim);
    line-height: 1.65;
  }

  .xingye-mix-caption {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 14px;
  }

  .xingye-mix-caption span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--xy-text-dim);
    font-size: 0.82rem;
  }

  .xingye-mix-caption i {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    display: inline-block;
  }

  .xingye-heatmap {
    display: grid;
    grid-template-columns: 150px repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .xingye-heatmap-cell {
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    padding: 14px;
    min-height: 100px;
    background: rgba(12, 22, 38, 0.78);
  }

  .xingye-heatmap-cell.header {
    min-height: auto;
    padding: 10px 14px;
    color: var(--xy-text-dim);
    font-size: 0.82rem;
    display: flex;
    align-items: center;
  }

  .xingye-heatmap-cell strong {
    display: block;
    color: var(--xy-text);
    font-size: 1.15rem;
    margin-bottom: 6px;
  }

  .xingye-heatmap-cell span {
    display: block;
    color: var(--xy-text-dim);
    line-height: 1.45;
    font-size: 0.84rem;
  }

  .xingye-risk-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .xingye-source-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .xingye-source-card small {
    display: block;
    margin-top: 8px;
    color: var(--xy-text-soft);
    line-height: 1.6;
  }

  .xingye-footnote {
    margin-top: 20px;
    padding: 16px 18px;
    border-radius: 18px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(10, 19, 34, 0.56);
    color: var(--xy-text-dim);
    line-height: 1.72;
  }

  .xingye-footnote strong {
    color: var(--xy-text);
  }

  @media (max-width: 1180px) {
    .xingye-hero-grid,
    .xingye-dual-grid,
    .xingye-thesis-grid,
    .xingye-panel-grid,
    .xingye-card-grid,
    .xingye-scenario-grid,
    .xingye-risk-grid,
    .xingye-source-grid {
      grid-template-columns: 1fr;
    }

    .xingye-kpi-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 900px) {
    .xingye-hero,
    .xingye-body {
      padding-left: 20px;
      padding-right: 20px;
    }

    .xingye-heatmap {
      grid-template-columns: 1fr;
    }

    .xingye-heatmap-cell.header {
      justify-content: center;
      text-align: center;
    }
  }

  @media (max-width: 640px) {
    .xingye-report {
      width: calc(100vw - 16px);
    }

    .xingye-title h1 {
      font-size: 2rem;
    }

    .xingye-meta-row,
    .xingye-kpi-grid,
    .xingye-scenario-metrics {
      grid-template-columns: 1fr;
    }
  }
`;

const TROY_OUNCES_PER_TON = 32150.7466;

const MODEL_2026 = {
  silverPriceBase: 65,
  tinPriceBase: 45000,
  silverVolumeTons: 340,
  tinVolumeTons: 5800,
  silverRealization: 0.83,
  tinRealization: 0.87,
  otherRevenueYi: 19.5,
  baseRevenueYi: 78.31,
  baseCoreProfitYi: 33.06,
  oneOffAdjustmentYi: 4.47,
  silverProfitSensitivityYiPerDollar: 0.5,
  tinProfitSensitivityYiPerThousand: 0.28,
};

const STOCK_CONTEXT = {
  reportDate: '2026-05-03',
  latestTradeDate: '2026-04-30',
  latestClose: 42.38,
  totalShares: 1775635740,
};

const ANCHOR_METRICS = [
  {
    label: '2025 年营收',
    value: '55.55 亿元',
    note: '年报口径，银/锡收入占比合计 68.86%。',
  },
  {
    label: '2025 年归母',
    value: '17.04 亿元',
    note: '模型基线，决定 2026 弹性起点。',
  },
  {
    label: '2026Q1 扣非归母',
    value: '8.91 亿元',
    note: '比 13.38 亿元报表利润更适合拿来年化比较。',
  },
];

const THESIS_CARDS = [
  {
    title: '26 年它更像高弹性白银股',
    body: '2026Q1 矿产银收入占比升到 66.21%，而锡只剩 10.99%。利润主变量已经从“银锡双轮”切到“银价 + 宇邦产量释放”。',
  },
  {
    title: '锡更像 27 年后的资源期权',
    body: '银漫铜锡银锌矿、Achmmach 锡矿和银漫扩建共同决定了它的中期重估深度，但 2026 年当期利润并不是锡在主导。',
  },
  {
    title: 'Q1 质量强，但别把 13.38 亿元直接乘四',
    body: '其中包含双源有色处置带来的 4.47 亿元非经常性收益。更可比的经营利润底盘，是 8.91 亿元扣非归母。',
  },
  {
    title: '它不是便宜矿股，而是高景气成长矿股',
    body: '当前仓位逻辑更接近“商品景气 beta + 业绩催化 + 海外扩张期权”，而不是 2027 年归一化利润意义上的低估值底仓。',
  },
];

const RESOURCE_AND_PROJECTS = [
  {
    title: '银资源底盘',
    metric: '2.98 万吨',
    text: '公司国内采矿许可证范围内银资源量合计。宇邦矿业单体含银 20,864.3 吨，是产量上台阶的关键资产。',
  },
  {
    title: '锡资源底盘',
    metric: '39.16 万吨',
    text: '国内采矿许可证范围内锡资源量合计。银漫铜锡银锌矿单体含锡 17.83 万吨，海外 Achmmach 另有 21.33 万吨锡资源量。',
  },
  {
    title: '扩建主线',
    metric: '165 → 297 万吨/年',
    text: '银漫扩建已获核准，宇邦还在推进 825 万吨/年采矿项目与 2 万吨/日选矿厂，决定 2027 年后的成长斜率。',
  },
];

const Q1_FLAGS = [
  {
    title: '利润结构切银',
    metric: '66.21%',
    text: '2026Q1 矿产银收入占比，较 2025 全年的 39.17% 明显抬升。',
  },
  {
    title: '应收显著上跳',
    metric: '4,934.9 万元',
    text: '较年初 253.6 万元明显抬升，说明高价期出现更多赊销与账期拉长。',
  },
  {
    title: '财务费用抬升',
    metric: '+59.09%',
    text: '美元债与扩张期融资成本开始侵蚀部分利润弹性，后续不能只盯商品价格。',
  },
];

const REVENUE_MIX = [
  {
    period: '2025 全年',
    silver: 39.17,
    tin: 29.7,
    other: 31.13,
  },
  {
    period: '2026 Q1',
    silver: 66.21,
    tin: 10.99,
    other: 22.8,
  },
];

const SCENARIOS_2026 = [
  {
    key: 'bear',
    label: '悲观',
    silver: 50,
    tin: 34000,
    revenue: 59.78,
    profit: 21.04,
    description: '白银强势回落，锡供给恢复更快，利润回到仅略高于 2025 的平台。',
  },
  {
    key: 'base',
    label: '基准',
    silver: 65,
    tin: 45000,
    revenue: 78.31,
    profit: 33.06,
    description: '白银维持结构性赤字，锡供给修复慢于预期，Q2/Q3 延续高景气。',
  },
  {
    key: 'bull',
    label: '乐观',
    silver: 80,
    tin: 55000,
    revenue: 95.16,
    profit: 45.25,
    description: '白银金融再定价，锡供给扰动继续延长，公司进入 40 亿以上利润区间。',
  },
];

const TRADE_GUIDANCE = [
  {
    title: '仓位定义',
    body: '更适合做景气与催化仓位。初始 4%-6%，商品高位平台确认后再向 8%-10% 递进。',
  },
  {
    title: '增仓触发',
    body: '银价稳定在 60 美元/盎司以上、锡价稳定在 4.2 万美元/吨以上，同时 Q2 扣非利润不低于 8 亿元。',
  },
  {
    title: '减仓触发',
    body: '股价进入 56-60 元但商品价格没有同步抬升，或 Q2/Q3 扣非利润显著低于预期。',
  },
];

const CATALYSTS = [
  'Q2/Q3 单季扣非利润继续维持高位，证明 Q1 不是一次性错觉。',
  '宇邦产量释放、银漫扩建推进、Achmmach 锡矿进展兑现中期成长权。',
  'H 股上市与海外平台化推进，为估值锚增加新维度。',
];

const RISKS = [
  '白银价格回撤导致盈利高点回落，核心逻辑迅速失速。',
  '锡产销量低于预期，让“锡资源期权”无法及时兑现成报表利润。',
  '扩张期美元债、财务费用、汇率波动抬升，侵蚀高价周期利润。',
  '控股股东股份质押、客户集中度高，应收与回款质量需要持续跟踪。',
];

const SOURCE_GROUPS = [
  {
    title: '公司公告',
    items: [
      {
        label: '2025 年年度报告',
        href: 'https://static.cninfo.com.cn/finalpage/2026-04-22/1225136963.PDF',
      },
      {
        label: '2025 年财务附件',
        href: 'https://static.cninfo.com.cn/finalpage/2026-04-22/1225136984.PDF',
      },
      {
        label: '2026 年一季报',
        href: 'https://static.cninfo.com.cn/finalpage/2026-04-30/1225255187.PDF',
      },
    ],
    note: '资源量、扩建、收入结构、分产品产销量和 Q1 财务质量都以公司披露为锚。',
  },
  {
    title: '商品框架',
    items: [
      {
        label: 'World Silver Survey 2025',
        href: 'https://silverinstitute.org/wp-content/uploads/2025/04/Metals_Focus__World_Silver_Survey_2025-April2025.pdf',
      },
      {
        label: 'USGS MCS 2026 - Tin',
        href: 'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-tin.pdf',
      },
      {
        label: 'LBMA London Vault Data',
        href: 'https://www.lbma.org.uk/prices-and-data/london-vault-data',
      },
    ],
    note: '白银供需、锡供给、库存与下游用途逻辑来自行业统计口径，不直接来自公司。',
  },
  {
    title: '市场口径',
    items: [
      {
        label: 'Sina 股本结构',
        href: 'https://money.finance.sina.com.cn/corp/go.php/vCI_StockStructure/stockid/000426.phtml',
      },
      {
        label: '2026-04-30 收盘价快报',
        href: 'https://www.sohu.com/a/1016921148_121319643',
      },
      {
        label: '2026-04-29 收盘价快报',
        href: 'https://stock.stockstar.com/RB2026043000001450.shtml',
      },
    ],
    note: '本页当前 PE 采用 2026-04-30 最近一个交易日收盘价 42.38 元/股；5 月 3 日为休市。',
  },
];

const HEATMAP_PROFIT = [
  { silver: 55, tin40000: 26.68, tin45000: 28.07, tin50000: 29.46 },
  { silver: 65, tin40000: 31.67, tin45000: 33.06, tin50000: 34.45 },
  { silver: 75, tin40000: 36.66, tin45000: 38.05, tin50000: 39.44 },
];

function formatDateTime(dateString) {
  if (!dateString) {
    return '未加载';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatYi(value, digits = 2) {
  return `${value.toFixed(digits)} 亿元`;
}

function formatPercent(value, digits = 1) {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(digits)}%`;
}

function formatPrice(value, digits = 2) {
  return Number(value).toFixed(digits);
}

function formatHeatmapColor(value, min, max) {
  const ratio = (value - min) / (max - min || 1);
  const alpha = 0.14 + ratio * 0.34;
  const green = Math.round(120 + ratio * 70);
  const blue = Math.round(150 + ratio * 55);

  return `rgba(86, ${green}, ${blue}, ${alpha})`;
}

function CustomCommodityTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      style={{
        background: 'rgba(10, 23, 41, 0.96)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '14px',
        padding: '12px 14px',
        boxShadow: '0 16px 40px rgba(2, 6, 23, 0.3)',
      }}
    >
      <div style={{ color: '#e5edf8', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{ color: '#9fb0c8', display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              display: 'inline-block',
              background: entry.color,
            }}
          />
          <span>{entry.name}</span>
          <strong style={{ color: '#e5edf8' }}>
            {entry.dataKey === 'silver'
              ? `${formatPrice(entry.value, 2)} 美元/盎司`
              : `${Math.round(entry.value).toLocaleString()} 美元/吨`}
          </strong>
        </div>
      ))}
    </div>
  );
}

function CustomMixTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      style={{
        background: 'rgba(10, 23, 41, 0.96)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '14px',
        padding: '12px 14px',
      }}
    >
      <div style={{ color: '#e5edf8', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      {payload.map((entry) => (
        <div
          key={entry.dataKey}
          style={{ color: '#9fb0c8', display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              display: 'inline-block',
              background: entry.color,
            }}
          />
          <span>{entry.name}</span>
          <strong style={{ color: '#e5edf8' }}>{entry.value.toFixed(2)}%</strong>
        </div>
      ))}
    </div>
  );
}

function XingyeYinxiReport() {
  const [metalsData, setMetalsData] = useState(null);
  const [metalsLoading, setMetalsLoading] = useState(true);
  const [metalsError, setMetalsError] = useState(null);

  useEffect(() => {
    const cacheBuster = Math.floor(Date.now() / 3600000);

    fetch(`/data/metals-prices.json?v=${cacheBuster}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load metals price data');
        }

        return response.json();
      })
      .then((data) => {
        setMetalsData(data);
        setMetalsLoading(false);
      })
      .catch((error) => {
        setMetalsError(error.message);
        setMetalsLoading(false);
      });
  }, []);

  const recentCommoditySeries = useMemo(() => {
    const silverSeries = metalsData?.metals?.silver?.data ?? [];
    const tinSeries = metalsData?.metals?.tin?.data ?? [];
    const yearMap = new Map();

    silverSeries.forEach((item) => {
      yearMap.set(item.year, { year: item.year, silver: item.price });
    });

    tinSeries.forEach((item) => {
      const existing = yearMap.get(item.year) ?? { year: item.year };
      yearMap.set(item.year, { ...existing, tin: item.price });
    });

    return Array.from(yearMap.values())
      .sort((a, b) => a.year - b.year)
      .filter((item) => item.year >= 2018);
  }, [metalsData]);

  const liveCommodityPoint = useMemo(() => {
    const silverSeries = metalsData?.metals?.silver?.data ?? [];
    const tinSeries = metalsData?.metals?.tin?.data ?? [];
    const silver2026 = silverSeries.find((item) => item.year === 2026);
    const tin2026 = tinSeries.find((item) => item.year === 2026);

    return {
      silver: silver2026?.price ?? MODEL_2026.silverPriceBase,
      tin: tin2026?.price ?? MODEL_2026.tinPriceBase,
      hasLiveData: Boolean(silver2026 && tin2026),
      lastUpdated: metalsData?.lastUpdated ?? null,
    };
  }, [metalsData]);

  const dynamicEstimate = useMemo(() => {
    const realizedBaseUsd =
      MODEL_2026.silverPriceBase *
        MODEL_2026.silverRealization *
        MODEL_2026.silverVolumeTons *
        TROY_OUNCES_PER_TON +
      MODEL_2026.tinPriceBase *
        MODEL_2026.tinRealization *
        MODEL_2026.tinVolumeTons;

    // Anchor FX so the transparent revenue formula reproduces the report's 2026 base case.
    const fxRate =
      ((MODEL_2026.baseRevenueYi - MODEL_2026.otherRevenueYi) * 100000000) /
      realizedBaseUsd;

    const silverRevenueUsd =
      liveCommodityPoint.silver *
      MODEL_2026.silverRealization *
      MODEL_2026.silverVolumeTons *
      TROY_OUNCES_PER_TON;

    const tinRevenueUsd =
      liveCommodityPoint.tin *
      MODEL_2026.tinRealization *
      MODEL_2026.tinVolumeTons;

    const revenueYi =
      MODEL_2026.otherRevenueYi +
      ((silverRevenueUsd + tinRevenueUsd) * fxRate) / 100000000;

    const coreProfitYi =
      MODEL_2026.baseCoreProfitYi +
      (liveCommodityPoint.silver - MODEL_2026.silverPriceBase) *
        MODEL_2026.silverProfitSensitivityYiPerDollar +
      ((liveCommodityPoint.tin - MODEL_2026.tinPriceBase) / 1000) *
        MODEL_2026.tinProfitSensitivityYiPerThousand;

    const reportedProfitYi = coreProfitYi + MODEL_2026.oneOffAdjustmentYi;
    const marketCapYi =
      (STOCK_CONTEXT.latestClose * STOCK_CONTEXT.totalShares) / 100000000;

    return {
      silver: liveCommodityPoint.silver,
      tin: liveCommodityPoint.tin,
      fxRate,
      revenueYi,
      coreProfitYi,
      reportedProfitYi,
      corePE: marketCapYi / coreProfitYi,
      reportedPE: marketCapYi / reportedProfitYi,
      coreMargin: (coreProfitYi / revenueYi) * 100,
      marketCapYi,
      silverVsBasePct:
        ((liveCommodityPoint.silver - MODEL_2026.silverPriceBase) /
          MODEL_2026.silverPriceBase) *
        100,
      tinVsBasePct:
        ((liveCommodityPoint.tin - MODEL_2026.tinPriceBase) /
          MODEL_2026.tinPriceBase) *
        100,
    };
  }, [liveCommodityPoint]);

  const scenarioCards = useMemo(() => {
    const currentMarketCap = dynamicEstimate.marketCapYi;

    return [
      ...SCENARIOS_2026.slice(0, 2).map((scenario) => ({
        ...scenario,
        currentPE: currentMarketCap / scenario.profit,
        isLive: false,
      })),
      {
        key: 'live',
        label: '当前价格',
        silver: dynamicEstimate.silver,
        tin: dynamicEstimate.tin,
        revenue: dynamicEstimate.revenueYi,
        profit: dynamicEstimate.coreProfitYi,
        currentPE: dynamicEstimate.corePE,
        description:
          '按当前银价与锡价情形测算的 2026 年收入、利润与估值结果，用来观察股价是否已经交易进更高的商品中枢。',
        isLive: true,
      },
      {
        ...SCENARIOS_2026[2],
        currentPE: currentMarketCap / SCENARIOS_2026[2].profit,
        isLive: false,
      },
    ];
  }, [dynamicEstimate]);

  const heatmapExtents = useMemo(() => {
    const values = HEATMAP_PROFIT.flatMap((row) => [
      row.tin40000,
      row.tin45000,
      row.tin50000,
    ]);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, []);

  return (
    <div className="xingye-report">
      <style>{REPORT_STYLES}</style>

      <div className="xingye-shell">
        <section className="xingye-hero">
          <div className="xingye-pill-row">
            <div className="xingye-pill">
              <strong>Report Date</strong>
              <span>{STOCK_CONTEXT.reportDate}</span>
            </div>
            <div className="xingye-pill">
              <strong>Metals Data</strong>
              <span>{formatDateTime(liveCommodityPoint.lastUpdated)}</span>
            </div>
            <div className="xingye-pill">
              <strong>Stock Price</strong>
              <span>{STOCK_CONTEXT.latestTradeDate} close</span>
            </div>
          </div>

          <div className="xingye-title">
            <h1>
              <span>兴业银锡</span>：26 年看银，27 年看利润回归后的韧性
            </h1>
            <p>
              2026 年利润锚先看白银价格与宇邦产量释放，锡更多体现为 2027 年后的资源深度、供给扰动与扩建期权。
              顶部先给出当前价格情形下的全年营收、利润和 PE，再展开资源、Q1 质量与估值敏感性。
            </p>
          </div>

          <div className="xingye-meta-row">
            <div className="xingye-meta-card">
              <span>当前判断</span>
              <strong>高弹性白银股 + 远期锡资源期权</strong>
              <small>2026 年利润锚先看白银，锡更多体现为 2027 年以后的资源深度与供给扰动期权。</small>
            </div>
            <div className="xingye-meta-card">
              <span>最近股价口径</span>
              <strong>{STOCK_CONTEXT.latestClose.toFixed(2)} 元/股</strong>
              <small>
                采用最近一个交易日 {STOCK_CONTEXT.latestTradeDate} 收盘价。{STOCK_CONTEXT.reportDate}
                为休市日，不存在当日最新成交。
              </small>
            </div>
            <div className="xingye-meta-card">
              <span>总股本</span>
              <strong>17.756 亿股</strong>
              <small>按 Sina 股本结构页 2024-12-31 口径：177,563.574 万股，用于计算当前价格对应 PE。</small>
            </div>
          </div>

          <div className="xingye-hero-grid">
            <div className="xingye-hero-notes">
              <h2>为什么这家公司现在值得单独做一页</h2>
              <p>
                两份原始稿子的核心共识很清楚：兴业银锡不是“银锡均衡”的传统多金属公司，而是已经在 2026
                年阶段性切成了白银驱动的高弹性矿股。Q1 把这个结构变化彻底摊开了看，后面市场争论的焦点也会从
                “锡还会不会涨”转成“银价平台能不能维持、宇邦产量释放能不能持续”。
              </p>
              <ul>
                <li>2026Q1 矿产银收入占比 66.21%，比 2025 年全年的 39.17% 明显上移。</li>
                <li>2026Q1 扣非归母 8.91 亿元，比 13.38 亿元报表利润更能代表矿山经营底盘。</li>
                <li>银漫扩建、宇邦项目、Achmmach 和 H 股推进，让 2027 年后的成长权还没有结束。</li>
              </ul>
            </div>

            <div className="xingye-model-card">
              <h2>当前价格情形测算</h2>
              <p>
                按 2026 年基准销量 340 吨银、5,800 吨锡，其他收入 19.5 亿元，以及 0.83 / 0.87 的实现系数，
                对当前银价与锡价对应的全年收入和利润做一遍统一测算。
              </p>

              <div className="xingye-kpi-grid">
                <div className="xingye-kpi-card">
                  <span>2026 银价代理中枢</span>
                  <strong className="xingye-silver">
                    {metalsLoading ? '加载中' : `${formatPrice(dynamicEstimate.silver, 2)} 美元/盎司`}
                  </strong>
                  <small>
                    相对基准 65 美元/盎司 {formatPercent(dynamicEstimate.silverVsBasePct)}。
                  </small>
                </div>
                <div className="xingye-kpi-card">
                  <span>2026 锡价代理中枢</span>
                  <strong className="xingye-tin">
                    {metalsLoading ? '加载中' : `${Math.round(dynamicEstimate.tin).toLocaleString()} 美元/吨`}
                  </strong>
                  <small>
                    相对基准 4.5 万美元/吨 {formatPercent(dynamicEstimate.tinVsBasePct)}。
                  </small>
                </div>
                <div className="xingye-kpi-card">
                  <span>2026E 营收</span>
                  <strong>{metalsLoading ? '加载中' : formatYi(dynamicEstimate.revenueYi)}</strong>
                  <small>
                    透明公式：银收入 + 锡收入 + 其他收入 19.5 亿元，不直接拿现货价粗暴乘产量。
                  </small>
                </div>
                <div className="xingye-kpi-card">
                  <span>2026E 核心归母</span>
                  <strong className="xingye-green">
                    {metalsLoading ? '加载中' : formatYi(dynamicEstimate.coreProfitYi)}
                  </strong>
                  <small>
                    基于利润敏感性矩阵估算；若计入 Q1 非经常性收益，对应报表归母约{' '}
                    {formatYi(dynamicEstimate.reportedProfitYi)}。
                  </small>
                </div>
                <div className="xingye-kpi-card">
                  <span>当前价格对应核心 PE</span>
                  <strong>{metalsLoading ? '加载中' : `${dynamicEstimate.corePE.toFixed(1)}x`}</strong>
                  <small>
                    以 {STOCK_CONTEXT.latestTradeDate} 收盘价 {STOCK_CONTEXT.latestClose.toFixed(2)} 元 / 股计算。
                  </small>
                </div>
                <div className="xingye-kpi-card">
                  <span>核心净利率</span>
                  <strong className="xingye-amber">
                    {metalsLoading ? '加载中' : `${dynamicEstimate.coreMargin.toFixed(1)}%`}
                  </strong>
                  <small>
                    这反映的不是“真实已实现利润率”，而是当前商品价格代理中枢下的全年模型利润率。
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="xingye-body">
          <section className="xingye-section">
            <div className="xingye-section-header">
              <span>Core Thesis</span>
              <h2>把两份稿子压缩成四个判断</h2>
              <p>
                真正重要的不是公司有多少资源，而是 2026 年哪种金属在决定报表利润、哪种金属在决定远期估值。
              </p>
            </div>

            <div className="xingye-thesis-grid">
              {THESIS_CARDS.map((card) => (
                <div className="xingye-thesis-card" key={card.title}>
                  <strong>{card.title}</strong>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="xingye-section">
            <div className="xingye-section-header">
              <span>Commodity Engine</span>
              <h2>银价和锡价如何传导到 2026 年利润</h2>
              <p>
                为了更聚焦当前周期，图上只展示 2018-2026 的银价与锡价，估值区则把悲观、基准、当前价格、乐观四个情形并排放在一起。
              </p>
            </div>

            <div className="xingye-dual-grid">
              <div className="xingye-chart-frame">
                <div className="xingye-chart-head">
                  <strong>银 / 锡价格轨迹（2018-2026）</strong>
                  <p>
                    价格口径更新至 {formatDateTime(liveCommodityPoint.lastUpdated)}，用来观察当前商品中枢相对基准假设已经走到了哪里。
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart data={recentCommoditySeries}>
                    <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                    <XAxis dataKey="year" stroke="#7f90a8" />
                    <YAxis
                      yAxisId="silver"
                      stroke="#d6d8df"
                      width={58}
                      tickFormatter={(value) => `${value}`}
                    />
                    <YAxis
                      yAxisId="tin"
                      orientation="right"
                      stroke="#90a4b8"
                      width={72}
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                    />
                    <Tooltip content={<CustomCommodityTooltip />} />
                    <Line
                      yAxisId="silver"
                      type="monotone"
                      dataKey="silver"
                      name="白银"
                      stroke="#d6d8df"
                      strokeWidth={3}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="tin"
                      type="monotone"
                      dataKey="tin"
                      name="锡"
                      stroke="#90a4b8"
                      strokeWidth={3}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="xingye-panel">
                <h3>模型怎么避免“现货价直接乘产量”</h3>
                <p>
                  兴业银锡卖的是矿产品与精矿净回款，不是 100% 精炼金属现货，因此收入测算必须先经过实现系数。
                  2026 年测算采用两步法：
                </p>
                <ol>
                  <li>收入端：白银/锡价格 × 实现系数 × 基准销量，再加其他收入 19.5 亿元。</li>
                  <li>利润端：以基准利润 33.06 亿元为锚，按银价每 +1 美元带来约 +0.50 亿元、锡价每 +1000 美元带来约 +0.28 亿元线性外推。</li>
                </ol>
                <ul>
                  <li>白银实现系数：0.83</li>
                  <li>锡实现系数：0.87</li>
                  <li>基准销量：340 吨银 / 5,800 吨锡</li>
                  <li>其他收入假设：19.5 亿元</li>
                </ul>
              </div>
            </div>

            <div className="xingye-scenario-grid" style={{ marginTop: 18 }}>
              {scenarioCards.map((scenario) => (
                <div
                  className={`xingye-scenario-card${scenario.isLive ? ' is-live' : ''}`}
                  key={scenario.key}
                >
                  <div className="xingye-scenario-label">
                    {scenario.isLive ? '当前价格' : '模型情形'}
                  </div>
                  <h3>{scenario.label}</h3>
                  <p>
                    银价 {formatPrice(scenario.silver, 1)} 美元/盎司，锡价{' '}
                    {Math.round(scenario.tin).toLocaleString()} 美元/吨。
                  </p>
                  <div className="xingye-scenario-metrics">
                    <div>
                      <span>营收</span>
                      <strong>{formatYi(scenario.revenue)}</strong>
                    </div>
                    <div>
                      <span>核心归母</span>
                      <strong>{formatYi(scenario.profit)}</strong>
                    </div>
                    <div>
                      <span>当前股价 PE</span>
                      <strong>{scenario.currentPE.toFixed(1)}x</strong>
                    </div>
                    <div>
                      <span>相对基准</span>
                      <strong>
                        {scenario.isLive
                          ? `${(scenario.profit - MODEL_2026.baseCoreProfitYi).toFixed(2)} 亿元`
                          : `${(scenario.profit - MODEL_2026.baseCoreProfitYi).toFixed(2)} 亿元`}
                      </strong>
                    </div>
                  </div>
                  <p>{scenario.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="xingye-section">
            <div className="xingye-section-header">
              <span>Operating Reality</span>
              <h2>经营底盘和 Q1 质量决定利润兑现质量</h2>
              <p>
                资源量讲的是故事空间，但 2026 年更值得看的是利润结构迁移、应收变化、融资成本和扩建兑现节奏。
              </p>
            </div>

            <div className="xingye-panel-grid">
              {RESOURCE_AND_PROJECTS.map((item) => (
                <div className="xingye-panel" key={item.title}>
                  <h3>{item.title}</h3>
                  <strong className="metric">{item.metric}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <div className="xingye-dual-grid" style={{ marginTop: 18 }}>
              <div className="xingye-chart-frame">
                <div className="xingye-chart-head">
                  <strong>收入结构已经从“银锡并重”切成“白银主导”</strong>
                  <p>2025 全年与 2026Q1 的分产品收入占比对比。白银占比的抬升决定了 2026 年利润弹性的核心来源。</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={REVENUE_MIX}
                    layout="vertical"
                    barSize={74}
                    barCategoryGap={28}
                    margin={{ left: 8, right: 12, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid stroke="rgba(148,163,184,0.08)" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      ticks={[0, 25, 50, 75, 100]}
                      allowDecimals={false}
                      tickFormatter={(value) => `${value}%`}
                      stroke="#7f90a8"
                    />
                    <YAxis type="category" dataKey="period" stroke="#9fb0c8" width={86} />
                    <Tooltip content={<CustomMixTooltip />} />
                    <Bar
                      dataKey="silver"
                      name="白银收入占比"
                      stackId="mix"
                      fill="#d6d8df"
                      stroke="rgba(7,17,31,0.72)"
                      strokeWidth={1}
                      radius={[10, 0, 0, 10]}
                    />
                    <Bar
                      dataKey="tin"
                      name="锡收入占比"
                      stackId="mix"
                      fill="#90a4b8"
                      stroke="rgba(7,17,31,0.72)"
                      strokeWidth={1}
                    />
                    <Bar
                      dataKey="other"
                      name="其他收入占比"
                      stackId="mix"
                      fill="#3c5f8a"
                      stroke="rgba(7,17,31,0.72)"
                      strokeWidth={1}
                      radius={[0, 10, 10, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                <div className="xingye-mix-caption">
                  <span>
                    <i style={{ background: '#d6d8df' }} />
                    白银
                  </span>
                  <span>
                    <i style={{ background: '#90a4b8' }} />
                    锡
                  </span>
                  <span>
                    <i style={{ background: '#3c5f8a' }} />
                    其他金属
                  </span>
                </div>
              </div>

              <div className="xingye-card-grid">
                {Q1_FLAGS.map((flag) => (
                  <div className="xingye-mini-panel" key={flag.title}>
                    <h3>{flag.title}</h3>
                    <p style={{ fontSize: '1.5rem', color: '#e5edf8', fontWeight: 700 }}>{flag.metric}</p>
                    <small>{flag.text}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="xingye-section">
            <div className="xingye-section-header">
              <span>Valuation</span>
              <h2>敏感性清楚地告诉你：26 年先看银，锡排第二</h2>
              <p>
                下面这张矩阵直接来自原始模型。每个格子显示 2026E 核心归母利润，并额外按当前股价口径换算出对应 PE。
              </p>
            </div>

            <div className="xingye-chart-frame">
              <div className="xingye-heatmap">
                <div className="xingye-heatmap-cell header">银价 \\ 锡价</div>
                <div className="xingye-heatmap-cell header">4.0 万美元/吨</div>
                <div className="xingye-heatmap-cell header">4.5 万美元/吨</div>
                <div className="xingye-heatmap-cell header">5.0 万美元/吨</div>

                {HEATMAP_PROFIT.flatMap((row) => {
                  const entries = [
                    { key: 'tin40000', label: '4.0 万美元/吨', value: row.tin40000 },
                    { key: 'tin45000', label: '4.5 万美元/吨', value: row.tin45000 },
                    { key: 'tin50000', label: '5.0 万美元/吨', value: row.tin50000 },
                  ];

                  return [
                    <div className="xingye-heatmap-cell header" key={`silver-${row.silver}`}>
                      银价 {row.silver} 美元/盎司
                    </div>,
                    ...entries.map((entry) => (
                      <div
                        className="xingye-heatmap-cell"
                        key={`${row.silver}-${entry.key}`}
                        style={{
                          background: formatHeatmapColor(entry.value, heatmapExtents.min, heatmapExtents.max),
                        }}
                      >
                        <strong>{formatYi(entry.value)}</strong>
                        <span>
                          当前价格 PE {(dynamicEstimate.marketCapYi / entry.value).toFixed(1)}x
                        </span>
                        <span>{row.silver === 65 && entry.key === 'tin45000' ? '原始基准情形' : '情景利润点位'}</span>
                      </div>
                    )),
                  ];
                })}
              </div>
            </div>

            <div className="xingye-footnote">
              <strong>读法很简单：</strong>
              银价每上升 1 美元/盎司，2026 年核心归母大致增加 0.50 亿元；锡价每上升 1000 美元/吨，大致增加 0.28
              亿元。所以 2026 年它不是“传统锡股”的估值方式，首先得当作白银弹性股看。
            </div>
          </section>

          <section className="xingye-section">
            <div className="xingye-section-header">
              <span>Execution</span>
              <h2>交易与跟踪，不是只盯股价，而是盯四个变量</h2>
              <p>
                先定义仓位，再定义催化，再定义风险。真正决定这笔交易能否继续拿住的，不是短期波动，而是商品、产量、扩建和资本开支四条线是否共振。
              </p>
            </div>

            <div className="xingye-card-grid">
              {TRADE_GUIDANCE.map((item) => (
                <div className="xingye-mini-panel" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>

            <div className="xingye-risk-grid" style={{ marginTop: 18 }}>
              <div className="xingye-panel">
                <h3>后续最值得跟的催化</h3>
                <ul>
                  {CATALYSTS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="xingye-panel">
                <h3>真正会伤估值的风险</h3>
                <ul>
                  {RISKS.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="xingye-panel-grid" style={{ marginTop: 18 }}>
              {ANCHOR_METRICS.map((item) => (
                <div className="xingye-panel" key={item.label}>
                  <h3>{item.label}</h3>
                  <strong className="metric">{item.value}</strong>
                  <p>{item.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="xingye-section">
            <div className="xingye-section-header">
              <span>Sources</span>
              <h2>来源与限制</h2>
              <p>
                页面里的结论来自公司公告、商品行业资料和两份原始研究稿的模型整理。真正需要提醒的是，这仍然是情景测算页，不是已实现业绩页。
              </p>
            </div>

            <div className="xingye-source-grid">
              {SOURCE_GROUPS.map((group) => (
                <div className="xingye-source-card" key={group.title}>
                  <strong>{group.title}</strong>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} target="_blank" rel="noreferrer">
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <small>{group.note}</small>
                </div>
              ))}
            </div>

            <div className="xingye-footnote">
              <strong>限制说明：</strong>
              公司季报没有完整披露分产品季度成本、分矿山利润和季度实现系数，因此这页的 2026E 收入与利润属于“高透明度估算”
              而不是“逐矿精算”。商品价格口径截至 {formatDateTime(liveCommodityPoint.lastUpdated)}；若其后银价和锡价再出现大幅波动，顶部测算也需要结合新的年度中枢重新判断。
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default XingyeYinxiReport;
