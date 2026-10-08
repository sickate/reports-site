# 半导体上游产业链关系图

Report: https://reports.instap.net/reports/2026-04-semiconductor-upstream
Date: 2026-04-14
Coverage: rendered-initial-view-and-existing-data

从材料、设备、零部件到晶圆厂的半导体上游图谱，含细分市场规模、代表公司与市场分布。



Research Topic独立打开 (/research-topics/semiconductor-upstream/index.html)
加载研究专题...

## Embedded report

半导体上游产业链关系图

 半导体上游产业链关系图

 以“工程 / 材料 / 设备 → 晶圆制造（前道）→ 先进封装 → 封装（后道）→ 测试 / 出货”为主轴，梳理关键细分环节、市场规模与代表公司。

 页面同时标注公司上市地与主要流向，方便快速判断产业链位置、市场结构与潜在投资映射。

 显示全部
 美股
 日股
 A股
 韩股
 港股
 台股
 欧股
 英股

 全部展开
 全部收起
 打印 / 导出 PDF

 市场图例
 美股
 日股
 A股
 韩股
 港股
 台股
 欧股
 英股

 全产业链

 点击流程节点切换当前视图

 上游工程 / 厂务
 上游材料
 上游设备
 ➜

 晶圆制造（前道）
 ➜

 先进封装
 ➜

 封装（后道）
 ➜

 测试 / 出货

 工程 / 厂务：5 个核心细分
 材料：23 个核心细分
 设备：11 个核心细分
 当前视图：全产业链

 三大主环节市场规模与结构

 把建厂 / 材料 / 设备的总量、增速与细分排名放在同一屏里看，便于快速判断资本开支重心与产业链弹性。

 2024 vs 2025

 注：主环节使用公开总量口径。A = 有较明确公开市场值锚点；B = 有公开锚点、但需映射到网页分类；C = 以行业代理口径归一后与主环节总量对齐。

 注：个别环节为高度寡头或寡头市场，少数未在上述市场挂牌的全球强势企业未纳入。

 主环节数据采用公开总量口径；子环节数据依据公开锚点、代理映射与归一化校准拆分，更适合做相对比较、产业链讲解与投资优先级排序，而非严格财务审计口径。

## Existing authored data: public/research-topics/semiconductor-upstream/app.js

```
import { sections as baseSections } from './data/sections.js';
import { marketCards, marketMap, sectionMarketData } from './data/market-data.js';
import { loadSemiconductorRuntimeRecords, mergeSectionsWithRuntimeRecords } from './data/runtime-records.js';
import {
  createCompanyFinanceIndex,
  getCompanyFinanceRecord,
  loadCompanyFinancialRecords,
} from '../shared/company-financials.js';
import { renderCompanyCardSnippet } from '../shared/company-card-snippet.js';

const marketGrid = document.getElementById('marketGrid');
const grid = document.getElementById('grid');
const activeFlowLabel = document.getElementById('activeFlowLabel');
const marketViewBadge = document.getElementById('marketViewBadge');
const showAllFlows = document.getElementById('showAllFlows');
const flowButtons = Array.from(document.querySelectorAll('.node[data-flow]'));
let data = baseSections;

const FLOW_TO_SECTION = {
  '上游工程 / 厂务': '工程 / 厂务',
  '上游材料': '材料',
  '上游设备': '设备'
};

const marketCardState = Object.fromEntries(baseSections.map((section) => [section.section, true]));
const subsegmentSortBySection = Object.fromEntries(baseSections.map((section) => [section.section, 'size']));
const activeSubsegmentBySection = Object.fromEntries(baseSections.map((section) => [section.section, null]));

const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';
let activeFlow = 'all';
let activeMarket = 'all';
let heightSyncQueued = false;
let lastSentHeight = 0;
let companyFinanceIndex = new Map();

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function fmtBn(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `$${value.toFixed(1)}B`;
}

function fmtPct(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function fmtMultiple(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)}x` : '待补';
}

function fmtNumber(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.abs(value) >= 100 ? 0 : 2,
  });
}

function getMarketValue(item, key) {
  const value = item?.market?.[key];
  return isFiniteNumber(value) ? value : null;
}

function calcSubsegmentYoy(item) {
  const v2024 = getMarketValue(item, 'v2024');
  const v2025 = getMarketValue(item, 'v2025');

  if (!isFiniteNumber(v2024) || !isFiniteNumber(v2025) || v2024 === 0) {
    return null;
  }

  return ((v2025 - v2024) / v2024) * 100;
}

function sumMarketValues(entries, key) {
  return entries.reduce((sum, item) => sum + (getMarketValue(item, key) || 0), 0);
}

function sortableNumber(value) {
  return isFiniteNumber(value) ? value : Number.NEGATIVE_INFINITY;
}

function formatSnapshotValue(metric, side) {
  const directValue = metric?.[side];

  if (directValue !== undefined && directValue !== null && directValue !== '') {
    return String(directValue);
  }

  const rawValue = metric?.[`${side}Value`];

  if (!Number.isFinite(rawValue)) {
    return '待补';
  }

  switch (metric?.format) {
    case 'bn':
      return fmtBn(rawValue);
    case 'pct':
      return fmtPct(rawValue);
    case 'multiple':
      return fmtMultiple(rawValue);
    case 'number':
      return fmtNumber(rawValue);
    default:
      return String(rawValue);
  }
}

function getSnapshot(item) {
  return item.snapshot || {
    previousLabel: '2024',
    currentLabel: '2025',
    metrics: [],
    note: item.market.note,
  };
}

function renderSnapshotModule(item) {
  const snapshot = getSnapshot(item);
  const metrics = snapshot.metrics || [];

  return `
    <section class="subsegment-module-card">
      <div class="subsegment-module-head">
        <div>
          <h4>年度对比</h4>
          <p>固定展示当前年份与上一年份的核心指标，便于后续继续补充营收、利润与估值口径。</p>
        </div>
        <div class="subsegment-module-meta">
          <span class="market-badge">${snapshot.previousLabel} vs ${snapshot.currentLabel}</span>
          <span class="basis-badge">口径 ${item.market.basis}</span>
        </div>
      </div>
      <div class="snapshot-metric-grid">
        ${metrics.map((metric) => `
          <article class="snapshot-metric-card metric-${metric.key || 'default'}">
            <div class="snapshot-metric-head">
              <strong>${metric.label}</strong>
              ${metric.note ? `<span>${metric.note}</span>` : ''}
            </div>
            <div class="snapshot-metric-compare">
              <div class="snapshot-metric-cell">
                <span class="snapshot-metric-period">${metric.previousLabel || snapshot.previousLabel}</span>
                <strong class="snapshot-metric-value">${formatSnapshotValue(metric, 'previous')}</strong>
              </div>
              <div class="snapshot-metric-cell current">
                <span class="snapshot-metric-period">${metric.currentLabel || snapshot.currentLabel}</span>
                <strong class="snapshot-metric-value">${formatSnapshotValue(metric, 'current')}</strong>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
      <div class="market-note">${snapshot.note || item.market.note}</div>
    </section>
  `;
}

function normalizeTextBlocks(content) {
  if (Array.isArray(content)) {
    return content
      .map((entry) => String(entry ?? '').trim())
      .filter(Boolean);
  }

  return String(content ?? '')
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function renderResearchModule(item) {
  const sections = item.detail?.sections || [];

  return `
    <section class="subsegment-module-card">
      <div class="subsegment-module-head">
        <div>
          <h4>${item.detail?.title || `${item.name}深度拆解`}</h4>
          <p>统一分成“概述”和“详细报告”两节；后续可以直接把更深入的研究内容导入到这里。</p>
        </div>
        <div class="subsegment-module-meta">
          <span class="basis-badge">深度拆解</span>
          ${item.detail?.updateNote ? `<span class="market-badge">${item.detail.updateNote}</span>` : ''}
        </div>
      </div>
      <div class="subsegment-research-list">
        ${sections.map((section, index) => `
          <details class="research-panel" ${section.open || index === 0 ? 'open' : ''}>
            <summary>
              <div class="research-panel-title">
                <strong>${section.title}</strong>
                ${section.pending ? '<span class="basis-badge">待补充</span>' : ''}
              </div>
              <span class="summary-toggle-text">${section.open || index === 0 ? '点击收起' : '点击展开'}</span>
            </summary>
            <div class="research-panel-body">
              ${normalizeTextBlocks(section.content).map((paragraph) => `<p>${paragraph}</p>`).join('')}
            </div>
          </details>
        `).join('')}
      </div>
    </section>
  `;
}

function renderCompanyGroupsModule(item) {
  const groups = item.detail?.groups || [];
  const totalCompanies = groups.reduce((sum, group) => sum + group.companies.length, 0);

  return `
    <section class="subsegment-module-card">
      <div class="subsegment-module-head">
        <div>
          <h4>股票分组</h4>
          <p>按组收纳核心玩家，展开分组后直接显示个股卡片与共享财务快照。</p>
        </div>
        <div class="subsegment-module-meta">
          <span class="market-badge">${groups.length} 个分组</span>
          <span class="stat-pill">${totalCompanies} 家公司</span>
        </div>
      </div>
      <div class="deepdive-wrap company-groups-wrap">
        ${groups.length ? groups.map((group) => `
          <section class="deep-group-block" data-open="false">
            <div class="deep-group-header">
              <div>
                <h5>${group.title}</h5>
                <p>${group.desc}</p>
              </div>
              <div class="deep-group-tools">
                <span class="stat-pill">${group.companies.length} 家</span>
                <button class="group-toggle-btn" type="button" data-group-toggle aria-expanded="false" title="展开 / 收起">+</button>
              </div>
            </div>
            <div class="deep-company-grid">
              ${group.companies.map(renderCompanyCard).join('')}
            </div>
          </section>
        `).join('') : '<div class="market-note">当前还没有录入公司分组。</div>'}
      </div>
    </section>
  `;
}

function getFlowLabel() {
  return activeFlow === 'all' ? '全产业链' : activeFlow;
}

function getSectionByKey(sectionKey) {
  return data.find((section) => section.section === sectionKey);
}

function getVisibleItemsForSection(section) {
  let visibleItems;

  if (activeFlow === 'all') {
    visibleItems = section.items;
  } else {
    const sectionFilter = FLOW_TO_SECTION[activeFlow];

    if (sectionFilter) {
      visibleItems = sectionFilter === section.section ? section.items : [];
    } else {
      visibleItems = section.items.filter((item) => item.flowTo.includes(activeFlow));
    }
  }

  const activeSubsegment = activeSubsegmentBySection[section.section];

  if (!activeSubsegment) {
    return visibleItems;
  }

  return visibleItems.filter((item) => item.slug === activeSubsegment);
}

function getVisibleSections() {
  return data
    .map((section) => ({
      ...section,
      visibleItems: getVisibleItemsForSection(section)
    }))
    .filter((section) => section.visibleItems.length > 0);
}

function sortSubsegments(items, sectionKey) {
  const sortBy = subsegmentSortBySection[sectionKey] || 'size';

  return [...items].sort((a, b) => {
    if (sortBy === 'yoy') {
      const yoyA = calcSubsegmentYoy(a);
      const yoyB = calcSubsegmentYoy(b);
      const yoyDiff = sortableNumber(yoyB) - sortableNumber(yoyA);

      if (yoyDiff !== 0) {
        return yoyDiff;
      }
    }

    return sortableNumber(getMarketValue(b, 'v2025')) - sortableNumber(getMarketValue(a, 'v2025'));
  });
}

function getVisibleSubsegments(sectionKey) {
  const section = getSectionByKey(sectionKey);
  if (!section) return [];
  return sortSubsegments(getVisibleItemsForSection(section), sectionKey);
}

function getDisplaySubsegments(sectionKey) {
  const section = getSectionByKey(sectionKey);
  if (!section) return [];

  let visibleItems;

  if (activeFlow === 'all') {
    visibleItems = section.items;
  } else {
    const sectionFilter = FLOW_TO_SECTION[activeFlow];

    if (sectionFilter) {
      visibleItems = sectionFilter === section.section ? section.items : [];
    } else {
      visibleItems = section.items.filter((item) => item.flowTo.includes(activeFlow));
    }
  }

  return sortSubsegments(visibleItems, sectionKey);
}

function getSectionFocus(sectionKey) {
  const total = sectionMarketData[sectionKey];
  const entries = getVisibleSubsegments(sectionKey);
  const v2024 = sumMarketValues(entries, 'v2024');
  const v2025 = sumMarketValues(entries, 'v2025');
  const yoy = v2024 ? ((v2025 - v2024) / v2024) * 100 : 0;
  const share = total?.v2025 ? (v2025 / total.v2025) * 100 : 0;
  const isSubset = Boolean(total) && (
    Math.abs(v2024 - total.v2024) > 0.05 || Math.abs(v2025 - total.v2025) > 0.05
  );

  return { entries, v2024, v2025, yoy, share, isSubset };
}

function getFocusedSubsegment(sectionKey) {
  const entries = getDisplaySubsegments(sectionKey);
  if (!entries.length) return null;

  const selectedSlug = activeSubsegmentBySection[sectionKey];
  const explicitMatch = selectedSlug ? entries.find((item) => item.slug === selectedSlug) : null;

  return explicitMatch || entries[0];
}

function updateFlowChrome() {
  showAllFlows.classList.toggle('active', activeFlow === 'all');
  flowButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.flow === activeFlow);
  });

  activeFlowLabel.textContent = `当前视图：${getFlowLabel()}`;
  marketViewBadge.textContent = activeFlow === 'all' ? '2024 vs 2025' : `当前聚焦：${getFlowLabel()}`;
}

function queueHeightSync() {
  if (heightSyncQueued) return;

  heightSyncQueued = true;

  window.requestAnimationFrame(() => {
    heightSyncQueued = false;
    const appRoot = document.getElementById('app');
    const nextHeight = Math.max(appRoot?.scrollHeight || 0, appRoot?.offsetHeight || 0);

    if (Math.abs(nextHeight - lastSentHeight) <= 4) return;

    lastSentHeight = nextHeight;
    window.parent.postMessage({ type: HEIGHT_MESSAGE_TYPE, height: nextHeight }, '*');
  });
}

function renderCompanyCard(company) {
  return renderCompanyCardSnippet({
    company,
    financeRecord: getCompanyFinanceRecord(companyFinanceIndex, company.name),
    marketLabel: marketMap[company.market] || '',
  });
}

function renderSubsegmentDetail(item) {
  if (!item.detail) return '';

  return `
    <div class="subsegment-detail-stack">
      ${renderSnapshotModule(item)}
      ${renderResearchModule(item)}
      ${renderCompanyGroupsModule(item)}
    </div>
  `;
}

function renderSubsegmentPicker(sectionKey) {
  const entries = getDisplaySubsegments(sectionKey);
  const selectedSlug = activeSubsegmentBySection[sectionKey];
  const sortBy = subsegmentSortBySection[sectionKey] || 'size';

  return `
    <div class="subsegment-picker-wrap">
      <div class="subsegment-sortbar">
        <div class="subsegment-sort-label">排序</div>
        <div class="subsegment-sort-group">
          <button class="subsegment-sort-btn ${sortBy === 'size' ? 'active' : ''}" type="button" data-subsegment-sort="${sectionKey}" data-sort="size">按 2025E 规模</button>
          <button class="subsegment-sort-btn ${sortBy === 'yoy' ? 'active' : ''}" type="button" data-subsegment-sort="${sectionKey}" data-sort="yoy">按同比增速</button>
        </div>
      </div>
      <div class="subsegment-picker">
        <button class="subsegment-tab all ${selectedSlug ? '' : 'active'}" type="button" data-subsegment-select="${sectionKey}" data-subsegment-slug="">
          <span class="subsegment-tab-name">全部细分</span>
        </button>
        ${entries.map((item, idx) => `
          <button class="subsegment-tab ${selectedSlug === item.slug ? 'active' : ''}" type="button" data-subsegment-select="${sectionKey}" data-subsegment-slug="${item.slug}">
            <span class="subsegment-tab-rank">${idx + 1}</span>
            <span class="subsegment-tab-name">${item.name}</span>
            <span class="subsegment-tab-size">${sortBy === 'yoy' ? fmtPct(calcSubsegmentYoy(item)) : fmtBn(getMarketValue(item, 'v2025'))}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSubsegmentFocusCard(item, rank, compact = false) {
  const v2024 = getMarketValue(item, 'v2024');
  const v2025 = getMarketValue(item, 'v2025');
  const yoy = calcSubsegmentYoy(item);
  const maxValue = Math.max(v2024 || 0, v2025 || 0);
  const w24 = maxValue && isFiniteNumber(v2024) ? (v2024 / maxValue) * 100 : 0;
  const w25 = maxValue && isFiniteNumber(v2025) ? (v2025 / maxValue) * 100 : 0;

  if (compact) {
    return `
      <article class="subsegment-focus-card compact">
        <div class="subsegment-focus-head">
          <span class="rank-badge">${rank}</span>
          <div class="subsegment-focus-main">
            <div class="subsegment-focus-title">
              <h4>${item.name}</h4>
              <div class="sub-label">口径 ${item.market.basis} · 2025E ${fmtBn(v2025)}</div>
            </div>
          </div>
        </div>
        <div class="subsegment-focus-kpis">
          <div class="subsegment-focus-kpi"><span class="label">2024</span><span class="value">${fmtBn(v2024)}</span></div>
          <div class="subsegment-focus-kpi"><span class="label">2025</span><span class="value">${fmtBn(v2025)}</span></div>
          <div class="subsegment-focus-kpi"><span class="label">同比</span><span class="value">${fmtPct(yoy)}</span></div>
        </div>
        <div class="subsegment-focus-note">${item.market.note}</div>
      </article>
    `;
  }

  return `
    <article class="subsegment-focus-card">
      <div class="subsegment-focus-head">
        <span class="rank-badge">${rank}</span>
        <div class="subsegment-focus-main">
          <div class="subsegment-focus-title">
            <h4>${item.name}</h4>
            <div class="sub-label">聚焦当前细分的市场规模、增速与说明，便于继续往下看对应公司。</div>
          </div>
        </div>
        <div class="subsegment-score">
          <span class="label">2025E</span>
          <span class="value">${fmtBn(v2025)}</span>
        </div>
        <span class="basis-badge">口径 ${item.market.basis}</span>
      </div>
      <div class="subsegment-focus-kpis">
        <div class="subsegment-focus-kpi"><span class="label">2024</span><span class="value">${fmtBn(v2024)}</span></div>
        <div class="subsegment-focus-kpi"><span class="label">2025</span><span class="value">${fmtBn(v2025)}</span></div>
        <div class="subsegment-focus-kpi"><span class="label">同比</span><span class="value">${fmtPct(yoy)}</span></div>
      </div>
      <div class="subsegment-focus-bars">
        <div class="bar-row">
          <span class="bar-label">2024</span>
          <div class="bar-track"><div class="bar-fill" style="width:${w24}%;"></div></div>
          <span class="bar-value">${fmtBn(v2024)}</span>
        </div>
        <div class="bar-row">
          <span class="bar-label">2025</span>
          <div class="bar-track"><div class="bar-fill" style="width:${w25}%;"></div></div>
          <span class="bar-value">${fmtBn(v2025)}</span>
        </div>
      </div>
      <div class="subsegment-focus-note">${item.market.note}</div>
    </article>
  `;
}

function renderFocusedSubsegment(sectionKey) {
  const entries = getDisplaySubsegments(sectionKey);
  if (!entries.length) return `<div class="market-note">当前视图下没有对应细分。</div>`;

  const selectedSlug = activeSubsegmentBySection[sectionKey];

  if (!selectedSlug) {
    return `
      <div class="subsegment-focus-collection">
        <div class="subsegment-focus-overview">
          当前展示该主环节下全部细分的 2024 / 2025 规模与同比，便于横向比较后再点选单个细分深入查看。
        </div>
        <div class="subsegment-focus-grid">
          ${entries.map((item, idx) => renderSubsegmentFocusCard(item, idx + 1, true)).join('')}
        </div>
      </div>
    `;
  }

  const item = entries.find((entry) => entry.slug === selectedSlug);
  if (!item) return `<div class="market-note">当前视图下没有对应细分。</div>`;

  return renderSubsegmentFocusCard(
    item,
    entries.findIndex((entry) => entry.slug === item.slug) + 1,
    false
  );
}

function renderMarketDashboard() {
  const visibleCards = marketCards.filter((card) => getVisibleSubsegments(card.key).length > 0);
  const maxValue = visibleCards.length
    ? Math.max(...visibleCards.flatMap((card) => {
      const focus = getSectionFocus(card.key);
      return [focus.v2024 || 0, focus.v2025 || 0];
    }))
    : 1;

  if (!visibleCards.length) {
    marketGrid.dataset.count = '0';
    marketGrid.innerHTML = '<div class="market-note">当前视图下没有对应的主环节卡片。</div>';
    queueHeightSync();
    return;
  }

  marketGrid.dataset.count = String(Math.min(visibleCards.length, 3));

  marketGrid.innerHTML = visibleCards.map((card) => {
    const meta = sectionMarketData[card.key];
    const focus = getSectionFocus(card.key);
    const w24 = maxValue ? (focus.v2024 / maxValue) * 100 : 0;
    const w25 = maxValue ? (focus.v2025 / maxValue) * 100 : 0;
    const subCount = focus.entries.length;
    const collapsed = visibleCards.length === 1 ? false : marketCardState[card.key];
    const headlineLabel = focus.isSubset ? '2025E 关联规模' : '2025E 主环节总量';
    const scopeText = focus.isSubset ? `当前仅统计与 ${getFlowLabel()} 直接相关的 ${subCount} 个子环节。` : meta.scope;
    const noteText = focus.isSubset ? `${meta.note} 当前视图对应规模占该主环节 ${focus.share.toFixed(1)}%。` : meta.note;

    return `
      <article class="market-card tone-${card.tone}" data-section-card="${card.key}" data-collapsed="${collapsed ? 'true' : 'false'}">
        <div class="market-card-core">
          <div class="market-summary-panel">
            <div class="market-card-head">
              <div>
                <div class="market-eyebrow">${card.english}</div>
                <h3>${card.title}</h3>
                <div class="market-sub">${scopeText}</div>
              </div>
              <span class="market-share-pill">${focus.isSubset ? `占主环节 ${focus.share.toFixed(0)}%` : '主环节全量'}</span>
            </div>
            <div class="market-hero">
              <div class="market-hero-main">
                <div class="market-hero-label">${headlineLabel}</div>
                <div class="market-hero-value">${fmtBn(focus.v2025)}</div>
                <div class="market-hero-sub">${focus.isSubset ? `对应 ${getFlowLabel()} 的上游投入规模。` : '对应该主环节的公开总量口径。'}</div>
              </div>
              <div class="market-kpi-strip">
                <div class="market-kpi"><span class="label">2024</span><span class="value">${fmtBn(focus.v2024)}</span></div>
                <div class="market-kpi"><span class="label">同比</span><span class="value">${fmtPct(focus.yoy)}</span></div>
                <div class="market-kpi"><span class="label">子环节数</span><span class="value">${subCount}</span></div>
                <div class="market-kpi"><span class="label">绝对增量</span><span class="value">${fmtBn(focus.v2025 - focus.v2024)}</span></div>
              </div>
            </div>
            <div class="bars">
              <div class="bar-row">
                <span class="bar-label">2024</span>
                <div class="bar-track"><div class="bar-fill" style="width:${w24}%;"></div></div>
                <span class="bar-value">${fmtBn(focus.v2024)}</span>
              </div>
              <div class="bar-row">
                <span class="bar-label">2025</span>
                <div class="bar-track"><div class="bar-fill" style="width:${w25}%;"></div></div>
                <span class="bar-value">${fmtBn(focus.v2025)}</span>
              </div>
            </div>
            <div class="market-metrics">
              <span class="stat-pill">同比：${fmtPct(focus.yoy)}</span>
              <span class="stat-pill">绝对增量：${fmtBn(focus.v2025 - focus.v2024)}</span>
              <span class="stat-pill">${subCount} 个子环节</span>
              ${focus.isSubset ? `<span class="stat-pill">主环节总量：${fmtBn(meta.v2025)}</span>` : ''}
            </div>
            <div class="market-note">${noteText}</div>
          </div>
          <div class="market-detail-panel">
            <div class="subsection-block">
              <div class="subsection-head">
                <div>
                  <h4>子环节选择</h4>
                  <div class="hint">先在这里锁定你关心的细分，再往下看对应公司的详细卡片，不用拖过整张长榜单。</div>
                </div>
                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                  <span class="basis-badge">A / B / C</span>
                  <button class="subsection-toggle-btn" type="button" data-section-toggle="${card.key}" aria-expanded="${collapsed ? 'false' : 'true'}">${collapsed ? '展开选择器' : '收起选择器'}</button>
                </div>
              </div>
              <div class="subsection-body">
                ${renderSubsegmentPicker(card.key)}
                ${renderFocusedSubsegment(card.key)}
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');

  queueHeightSync();
}

function sectionHTML(section) {
  const marketMeta = sectionMarketData[section.section];
  const isFilteredView = section.visibleItems.length !== section.items.length || activeFlow !== 'all';
  const items = section.visibleItems.map((item) => {
    const shouldOpen = section.visibleItems.length === 1 ? true : Boolean(item.initialOpen);

    return `
      <details class="cat" ${shouldOpen ? 'open' : ''}>
        <summary>
          <div class="cat-title">
            <strong>${item.name}</strong>
            <div class="meta">
              ${item.flowTo.map((target) => `<span class="dest-pill">流向：${target}</span>`).join('')}
              <span class="market-badge">24：${fmtBn(getMarketValue(item, 'v2024'))}</span>
              <span class="market-badge">25：${fmtBn(getMarketValue(item, 'v2025'))}</span>
              <span class="basis-badge">${item.market.basis}</span>
              <span class="basis-badge">深度拆解</span>
            </div>
          </div>
          <span class="summary-toggle-text">${shouldOpen ? '点击收起' : '点击展开'}</span>
        </summary>
        <div class="content">
          ${renderSubsegmentDetail(item)}
        </div>
      </details>
    `;
  }).join('');

  return `
    <section class="section">
      <div class="section-header">
        <div>
          <h2>${section.section}</h2>
          <div class="hint">${section.hint}${isFilteredView ? ` · 当前仅显示与 ${getFlowLabel()} 相关的 ${section.visibleItems.length} 个细分` : ''}</div>
        </div>
        <div class="meta">
          ${marketMeta ? `<span class="market-badge">2024：${fmtBn(marketMeta.v2024)}</span><span class="market-badge">2025：${fmtBn(marketMeta.v2025)}</span>` : ''}
          <span class="stat-pill">${section.visibleItems.length} / ${section.items.length} 个细分</span>
        </div>
      </div>
      ${items}
    </section>
  `;
}

function renderSectionsGrid() {
  const visibleSections = getVisibleSections();
  grid.dataset.count = String(Math.min(visibleSections.length, 3));
  grid.innerHTML = visibleSections.map(sectionHTML).join('');
  queueHeightSync();
}

function renderPage() {
  updateFlowChrome();
  renderMarketDashboard();
  renderSectionsGrid();
  setMarket(activeMarket);
}

function setMarket(market) {
  activeMarket = market;
  const buttons = Array.from(document.querySelectorAll('[data-market]')).filter((element) => element.classList.contains('btn'));
  const app = document.getElementById('app');
  const nodes = Array.from(document.querySelectorAll('.company, .deep-company-card'));

  buttons.forEach((button) => button.classList.toggle('active', button.dataset.market === market));

  if (market === 'all') {
    app.classList.remove('dim');
    nodes.forEach((node) => node.classList.remove('active-market'));
    return;
  }

  app.classList.add('dim');
  nodes.forEach((node) => node.classList.toggle('active-market', node.dataset.market === market));
}

async function initializePage() {
  try {
    const [records, runtimeRecords] = await Promise.all([
      loadCompanyFinancialRecords(),
      loadSemiconductorRuntimeRecords(),
    ]);
    companyFinanceIndex = createCompanyFinanceIndex(records, {
      reportSlug: '2026-04-semiconductor-upstream',
      datasetKind: 'annual',
    });
    data = mergeSectionsWithRuntimeRecords(baseSections, runtimeRecords);
  } catch (error) {
    console.error('Failed to initialize company finance data', error);
    companyFinanceIndex = new Map();
    data = baseSections;
  }

  renderPage();
}

await initializePage();

Array.from(document.querySelectorAll('[data-market]'))
  .filter((element) => element.classList.contains('btn'))
  .forEach((button) => button.addEventListener('click', () => setMarket(button.dataset.market)));

document.addEventListener('click', (event) => {
  const flowTrigger = event.target.closest('[data-flow]');
  if (flowTrigger) {
    activeFlow = flowTrigger.dataset.flow;
    renderPage();
    return;
  }

  const subsegmentTrigger = event.target.closest('[data-subsegment-select]');
  if (subsegmentTrigger) {
    const sectionKey = subsegmentTrigger.dataset.subsegmentSelect;
    activeSubsegmentBySection[sectionKey] = subsegmentTrigger.dataset.subsegmentSlug || null;
    renderPage();
    return;
  }

  const sortTrigger = event.target.closest('[data-subsegment-sort]');
  if (sortTrigger) {
    const sectionKey = sortTrigger.dataset.subsegmentSort;
    subsegmentSortBySection[sectionKey] = sortTrigger.dataset.sort || 'size';
    renderPage();
    return;
  }

  const sectionToggle = event.target.closest('[data-section-toggle]');
  if (sectionToggle) {
    const sectionKey = sectionToggle.dataset.sectionToggle;
    marketCardState[sectionKey] = !marketCardState[sectionKey];
    renderMarketDashboard();
    return;
  }

  const toggle = event.target.closest('[data-group-toggle]');
  if (!toggle) return;
  const block = toggle.closest('.deep-group-block');
  if (!block) return;

  const willOpen = block.dataset.open !== 'true';
  block.dataset.open = willOpen ? 'true' : 'false';
  toggle.textContent = willOpen ? '−' : '+';
  toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  queueHeightSync();
});

document.getElementById('expandAll').addEventListener('click', () => {
  document.querySelectorAll('details.cat').forEach((detail) => {
    detail.open = true;
  });
  queueHeightSync();
});

document.getElementById('collapseAll').addEventListener('click', () => {
  document.querySelectorAll('details.cat').forEach((detail) => {
    detail.open = false;
  });
  queueHeightSync();
});

document.addEventListener('toggle', (event) => {
  if (!event.target.matches('details.cat, details.research-panel')) return;

  const toggleText = event.target.querySelector('.summary-toggle-text');
  if (toggleText) {
    toggleText.textContent = event.target.open ? '点击收起' : '点击展开';
  }

  queueHeightSync();
}, true);

window.addEventListener('resize', queueHeightSync);
window.addEventListener('load', () => {
  queueHeightSync();
  window.setTimeout(queueHeightSync, 160);
  window.setTimeout(queueHeightSync, 420);
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/sections.js

```
import facilities from './subsegments/facilities/index.js';
import materials from './subsegments/materials/index.js';
import equipment from './subsegments/equipment/index.js';

export const sections = [facilities, materials, equipment];

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/facilities/index.js

```
import cleanroomEpc from './cleanroom-epc.js';
import upwSystems from './upw-systems.js';
import gasChemicalDelivery from './gas-chemical-delivery.js';
import exhaustVacuum from './exhaust-vacuum.js';
import rfPowerMatching from './rf-power-matching.js';

export default {
  section: '工程 / 厂务',
  hint: '最容易被忽视，但直接决定 fab 能否顺利拉坡',
  items: [cleanroomEpc, upwSystems, gasChemicalDelivery, exhaustVacuum, rfPowerMatching]
};

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/facilities/cleanroom-epc.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'cleanroom-epc',
  name: '洁净室 / 机电 / EPC',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '建厂周期、洁净等级、暖通和公用工程一体化能力，往往直接影响产线导入与投产节奏。',
  market: { v2024: 15.8, v2025: 17.0, basis: 'B', note: '按半导体建厂/EPC总盘子中主包与洁净室工程的核心占比映射。' },
  companies: [['Taikisha（太机化）', 'jp'], ['Takasago Thermal', 'jp'], ['CTCI（中鼎工程）', 'tw'], ['亚翔工程', 'tw'], ['JGC Holdings', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/lib/create-subsegment.js

```
function normalizeExposureMetric(metric, fallbackLabel) {
  if (!metric) {
    return {
      label: fallbackLabel,
      value: '待补',
      note: '',
    };
  }

  if (typeof metric === 'string') {
    return {
      label: fallbackLabel,
      value: metric,
      note: '',
    };
  }

  return {
    label: metric.label || fallbackLabel,
    value: metric.value || '待补',
    note: metric.note || '',
  };
}

function normalizeSegmentExposure(company, subsegmentName) {
  const exposure = company.segmentExposure || company.exposure;

  if (!exposure) {
    return company;
  }

  return {
    ...company,
    segmentExposure: {
      title: exposure.title || `${subsegmentName}环节定位`,
      role: exposure.role || company.summary || '待补',
      revenueShare: normalizeExposureMetric(exposure.revenueShare, '营收占比'),
      profitShare: normalizeExposureMetric(exposure.profitShare, '利润占比'),
      source: exposure.source || exposure.basis || '',
      note: exposure.note || '',
      badges: exposure.badges || [],
    },
  };
}

const normalizeCompany = (company, context = {}) => (
  Array.isArray(company)
    ? { name: company[0], market: company[1] }
    : normalizeSegmentExposure(company, context.subsegmentName || '当前')
);

function buildSnapshot(market, snapshot = {}) {
  const previousLabel = snapshot.previousLabel || '2024';
  const currentLabel = snapshot.currentLabel || '2025';
  const yoy = market?.v2024
    ? ((market.v2025 - market.v2024) / market.v2024) * 100
    : null;
  const customMetrics = new Map((snapshot.metrics || []).map((metric) => [metric.key, metric]));
  const baseOrder = ['market-size', 'revenue', 'profit', 'growth', 'pe'];
  const defaultMetrics = {
    'market-size': {
      key: 'market-size',
      label: '市场规模',
      format: 'bn',
      previousValue: market?.v2024 ?? null,
      currentValue: market?.v2025 ?? null,
      note: market?.basis ? `口径 ${market.basis}` : '',
    },
    revenue: {
      key: 'revenue',
      label: '营收',
      previous: '待补',
      current: '待补',
      note: '后续可接入板块年度营收口径。',
    },
    profit: {
      key: 'profit',
      label: '利润',
      previous: '待补',
      current: '待补',
      note: '后续可接入板块年度利润口径。',
    },
    growth: {
      key: 'growth',
      label: '增长',
      previousLabel: '区间',
      currentLabel: '同比',
      previous: `${previousLabel} → ${currentLabel}`,
      format: 'pct',
      currentValue: yoy,
      note: '默认按当前录入的年度对比自动计算。',
    },
    pe: {
      key: 'pe',
      label: 'PE',
      previous: '待补',
      current: '待补',
      note: '后续可接入板块估值口径。',
    },
  };

  const metrics = baseOrder.map((key) => ({
    ...defaultMetrics[key],
    ...(customMetrics.get(key) || {}),
  }));
  const extraMetrics = (snapshot.metrics || []).filter((metric) => !baseOrder.includes(metric.key));

  return {
    previousLabel,
    currentLabel,
    note: snapshot.note || market?.note || '',
    metrics: [...metrics, ...extraMetrics],
  };
}

function normalizeResearchSections({ summary, detail = {} }) {
  if (Array.isArray(detail.sections) && detail.sections.length > 0) {
    return detail.sections;
  }

  const overviewContent = detail.overview || detail.intro || summary;
  const reportContent = detail.report || detail.reportContent || detail.updateNote
    || '当前先按统一模板预留“详细报告”位置，后续可直接导入更完整的板块研究。';

  return [
    {
      key: 'overview',
      title: '概述',
      content: overviewContent,
      open: true,
    },
    {
      key: 'report',
      title: '详细报告',
      content: reportContent,
      open: false,
      pending: !detail.report && !detail.reportContent,
    },
  ];
}

export function createSimpleSubsegment({
  slug,
  name,
  section,
  flowTo,
  initialOpen = false,
  summary,
  market,
  companies,
  snapshot,
  groupTitle = 'A. 核心公司',
  groupDesc,
  detailTitle,
  updateNote = '当前先提供核心公司清单；后续可沿同一组件继续补充分层、标签与财务卡。'
}) {
  const detail = {
    title: detailTitle || `${name}板块深度拆解`,
    intro: summary,
    updateNote,
    sections: normalizeResearchSections({
      summary,
      detail: {
        title: detailTitle || `${name}板块深度拆解`,
        intro: summary,
        updateNote,
      },
    }),
    groups: [
      {
          title: groupTitle,
          desc: groupDesc || summary,
          companies: companies.map((company) => normalizeCompany(company, { subsegmentName: name })),
        },
      ],
    };

  return {
    slug,
    name,
    section,
    flowTo,
    initialOpen,
    summary,
    market,
    snapshot: buildSnapshot(market, snapshot),
    detail,
  };
}

export function createDeepDiveSubsegment(config) {
  const detail = {
    ...config.detail,
    sections: normalizeResearchSections({
      summary: config.summary,
      detail: config.detail,
    }),
    groups: config.detail.groups.map((group) => ({
      ...group,
      companies: group.companies.map((company) => normalizeCompany(company, { subsegmentName: config.name })),
    })),
  };

  return {
    ...config,
    snapshot: buildSnapshot(config.market, config.snapshot),
    detail,
  };
}

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/facilities/upw-systems.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'upw-systems',
  name: '超纯水（UPW）系统',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '先进制程对颗粒、离子和有机残留极敏感，UPW 系统是良率底层支撑。',
  market: { v2024: 6.9, v2025: 7.4, basis: 'B', note: '以fab facilities中的水系统和高纯流体子系统为代理口径。' },
  companies: [['Kurita（栗田工业）', 'jp'], ['Organo', 'jp'], ['Nomura Micro Science', 'jp'], ['Ecolab', 'us'], ['METAWATER', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/facilities/gas-chemical-delivery.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'gas-chemical-delivery',
  name: '特气 / 化学品供配系统',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  summary: '核心不止是“卖气”，更在于储存、输送、纯化、阀件、流量控制与系统级安全。',
  market: { v2024: 6.6, v2025: 7.1, basis: 'B', note: '对应特气柜、阀件、化学品输送及二次配系统投入。' },
  companies: [['Entegris', 'us'], ['MKS Instruments', 'us'], ['CKD', 'jp'], ['KITZ', 'jp'], ['Ebara（荏原）', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/facilities/exhaust-vacuum.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'exhaust-vacuum',
  name: '废气治理 / 真空排气',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  summary: '与环保合规、真空稳定性、产线连续运行直接相关，也是先进 fab 的隐形门槛。',
  market: { v2024: 4.6, v2025: 4.9, basis: 'C', note: '以废气治理、真空排气与sub-fab环保投入作为代理拆分。' },
  companies: [['Ebara（荏原）', 'jp'], ['MKS Instruments', 'us'], ['Resonac', 'jp'], ['ULVAC', 'jp'], ['汉钟精机', 'cn']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/facilities/rf-power-matching.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'rf-power-matching',
  name: 'RF 电源 / 匹配器',
  section: '工程 / 厂务',
  flowTo: ['晶圆制造（前道）'],
  summary: '刻蚀与沉积的关键子系统，直接影响等离子体工艺一致性和重复性。',
  market: { v2024: 3.74, v2025: 4.28, basis: 'A', note: '参考半导体RF power supply公开市场锚点，并扩展到匹配器配套。' },
  companies: [['Advanced Energy', 'us'], ['MKS Instruments', 'us'], ['DAIHEN', 'jp'], ['ULVAC', 'jp'], ['JEOL', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/index.js

```
import siliconWafers from './silicon-wafers.js';
import photomasks from './photomasks.js';
import photoresist from './photoresist.js';
import lithographyAncillaries from './lithography-ancillaries.js';
import electronicGases from './electronic-gases.js';
import wetChemicals from './wet-chemicals.js';
import cmpMaterials from './cmp-materials.js';
import sputteringTargets from './sputtering-targets.js';
import abfSubstrates from './abf-substrates.js';
import btSubstrates from './bt-substrates.js';
import interconnectSolders from './interconnect-solders.js';
import moldingCompounds from './molding-compounds.js';
import underfillMuf from './underfill-muf.js';
import dieAttachMaterials from './die-attach-materials.js';
import leadframes from './leadframes.js';
import bondingWires from './bonding-wires.js';
import temporaryBonding from './temporary-bonding.js';
import rdlDielectrics from './rdl-dielectrics.js';
import platingChemicals from './plating-chemicals.js';
import sphericalSilica from './spherical-silica.js';
import ceramicFillers from './ceramic-fillers.js';
import solderPowdersAlloys from './solder-powders-alloys.js';
import advancedPackagingPolymers from './advanced-packaging-polymers.js';

export default {
  section: '材料',
  hint: '前道卡制程窗口，封装侧卡载板、聚合物与可靠性材料',
  items: [
    siliconWafers,
    photomasks,
    photoresist,
    lithographyAncillaries,
    electronicGases,
    wetChemicals,
    cmpMaterials,
    sputteringTargets,
    abfSubstrates,
    btSubstrates,
    interconnectSolders,
    moldingCompounds,
    underfillMuf,
    dieAttachMaterials,
    leadframes,
    bondingWires,
    temporaryBonding,
    rdlDielectrics,
    platingChemicals,
    sphericalSilica,
    ceramicFillers,
    solderPowdersAlloys,
    advancedPackagingPolymers,
  ],
};

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/silicon-wafers.js

```
import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'silicon-wafers',
  name: '硅片',
  section: '材料',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '300mm 抛光片、外延片和 SOI 仍是前道材料里壁垒最高的一档，真正的卡点在高规格工艺与长认证周期。',
  market: {
    v2024: 11.5,
    v2025: 11.4,
    basis: 'A',
    note: '采用 SEMI / SMG 公开收入口径；短期受库存与稼动率影响，但高规格大硅片壁垒没有变化。'
  },
  detail: {
    title: '硅片板块深度拆解',
    intro: '把“硅片”拆成三层来看：A 看全球双寡头，B 看台系国际化平台，C 看 A 股国产替代。阅读重点不只是名义产能，而是高规格产品结构、客户认证和良率爬坡。',
    updateNote: '硅片板块现在也走统一深拆组件；后续补财务时直接往共享公司财务库加条目即可。',
    groups: [
      {
        title: 'A. 全球主线寡头',
        desc: '这一层决定了 12 英寸高端抛光片、外延片和 SOI 的产业节奏。它们的优势不只在规模，更在高规格工艺、稳定良率和长认证周期。',
        companies: [
          {
            name: 'Shin-Etsu Chemical',
            market: 'jp',
            summary: '全球高端硅片双寡头之一，强在 12 英寸、大客户认证与综合材料体系。',
            tags: ['12-inch', 'Japan', 'prime wafer'],
            note: '研究重点在高规格大硅片与综合材料平台协同，而不是简单名义产能。'
          },
          {
            name: 'SUMCO',
            market: 'jp',
            summary: '全球 12 英寸硅片核心纯赛道玩家，是观察行业景气与扩产节奏的主线标的。',
            tags: ['12-inch', 'advanced node', 'Japan'],
            note: '更接近 pure-play 硅片口径，适合用来观察行业价格与稼动率周期。'
          }
        ]
      },
      {
        title: 'B. 台系国际化平台',
        desc: '这组适合看区域产能布局、特殊规格片和国际客户结构，核心不是份额最大，而是全球化平台能力和产品线延展。',
        companies: [
          {
            name: 'GlobalWafers（环球晶）',
            market: 'tw',
            summary: '最重要的台系国际化硅片平台之一，跨地区产能和特殊规格片布局完整。',
            tags: ['Taiwan', 'specialty wafers', 'global capacity'],
            note: '更适合从全球化供给平台与特殊规格片结构升级来理解。'
          }
        ]
      },
      {
        title: 'C. A股国产替代',
        desc: 'A 股当前更适合看国产替代、产品升级和客户验证，不宜把整体自给率直接套到先进 300mm、外延片或 SOI。',
        companies: [
          {
            name: '沪硅产业',
            market: 'cn',
            summary: 'A 股大硅片主线标的，核心看高规格产品验证、良率与客户突破。',
            tags: ['A股', '国产替代', '12-inch'],
            note: '整体自给率参考意义有限，真正关键是先进规格的验证与导入进度。'
          }
        ]
      }
    ]
  }
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/photomasks.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'photomasks',
  name: '掩膜 / 坯料',
  flowTo: ['晶圆制造（前道）'],
  summary: '掩膜版与 mask blanks 是先进光刻里的隐形瓶颈，高端坯料、缺陷控制与写修检能力共同决定壁垒。',
  overview: '这个环节最容易被低估，因为它不是简单的“图形载体”，而是先进节点良率、线边粗糙度和缺陷密度的关键约束。EUV 时代，mask blanks 的洁净度与多轮检测能力更重要。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。真正决定供给格局的，是高端 blanks、merchant photomask 的写版修复能力，以及与先进制程同步升级的客户验证。',
    '市场规模按 QYResearch photomask 口径重排，2024 / 2025 / 2026E 约 USD 6.31bn / 6.59bn / 6.89bn，其中 2025 / 2026 为按 4.5% CAGR 机械外推。'
  ],
  basis: 'B',
  v2024: 6.31,
  v2025: 6.59,
  v2026: 6.89,
  marketNote: '2024 采用 QYResearch photomask 口径；2025 / 2026E 按 4.5% CAGR 机械外推。',
  market26Note: '2025 / 2026 为按公开 CAGR 机械外推，适合做工作底稿排序。',
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'DNP',
      market: 'jp',
      summary: '高端 photomask 与掩膜坯料链条里的核心日系玩家。',
      tags: ['photomask', 'Japan', 'merchant'],
    },
    {
      name: 'HOYA',
      market: 'jp',
      summary: 'mask blanks 关键供应方之一，高端坯料能力突出。',
      tags: ['mask blanks', 'Japan', 'EUV'],
    },
    {
      name: 'Photronics',
      market: 'us',
      summary: '全球 merchant photomask 纯玩家主线，成熟与先进节点兼顾。',
      tags: ['merchant photomask', 'US', 'pure-play'],
    },
    {
      name: '路维光电',
      market: 'cn',
      summary: 'A 股掩膜版映射标的，核心看制程升级与高端客户导入。',
      tags: ['A股', 'photomask', '国产替代'],
    },
    {
      name: '台湾光罩',
      market: 'tw',
      summary: '台股中最直接的 photomask 映射标的之一。',
      tags: ['Taiwan', 'photomask'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/material-subsegment.js

```
import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function formatUsdBn(value) {
  return isFiniteNumber(value) ? `USD ${value.toFixed(2)}bn` : '待补';
}

function build2026Metric(v2025, v2026, note = '2026E 口径见研究说明。') {
  if (!isFiniteNumber(v2025) && !isFiniteNumber(v2026)) {
    return null;
  }

  return {
    key: 'market-size-2026',
    label: '2025E / 2026E 规模',
    previousLabel: '2025E',
    currentLabel: '2026E',
    previous: formatUsdBn(v2025),
    current: formatUsdBn(v2026),
    note,
  };
}

function buildChinaMarketMetric(chinaMarket) {
  if (!chinaMarket) {
    return null;
  }

  return {
    key: 'china-market',
    label: '中国大陆市场',
    previousLabel: chinaMarket.previousLabel || '年份',
    currentLabel: chinaMarket.currentLabel || '规模',
    previous: chinaMarket.previous || chinaMarket.year || '待补',
    current: chinaMarket.current || chinaMarket.value || '待补',
    note: chinaMarket.note || '',
  };
}

function buildLocalizationMetric(localization) {
  if (!localization) {
    return null;
  }

  return {
    key: 'localization',
    label: localization.label || '国产替代率',
    previousLabel: localization.previousLabel || '口径',
    currentLabel: localization.currentLabel || '水平',
    previous: localization.previous || '待补',
    current: localization.current || '待补',
    note: localization.note || '',
  };
}

export function createMaterialSubsegment({
  slug,
  name,
  flowTo,
  initialOpen = false,
  summary,
  overview,
  report,
  basis = 'C',
  v2024 = null,
  v2025 = null,
  v2026 = null,
  marketNote,
  market26Note,
  chinaMarket,
  localization,
  snapshotNote,
  updateNote = '口径与公司映射已按当前公开资料重排。',
  detailTitle,
  groupTitle = 'A. 核心公司映射',
  groupDesc,
  companies,
}) {
  const snapshotMetrics = [
    build2026Metric(v2025, v2026, market26Note),
    buildChinaMarketMetric(chinaMarket),
    buildLocalizationMetric(localization),
  ].filter(Boolean);

  return createDeepDiveSubsegment({
    slug,
    name,
    section: '材料',
    flowTo,
    initialOpen,
    summary,
    market: {
      v2024,
      v2025,
      basis,
      note: marketNote,
    },
    snapshot: {
      note: snapshotNote || marketNote,
      metrics: snapshotMetrics,
    },
    detail: {
      title: detailTitle || `${name}板块速览`,
      intro: summary,
      updateNote,
      sections: [
        {
          key: 'overview',
          title: '概述',
          content: overview || summary,
          open: true,
        },
        {
          key: 'report',
          title: '详细报告',
          content: report || marketNote || '当前页面优先保留市场边界、规模锚点与公司映射。',
          open: false,
        },
      ],
      groups: [
        {
          title: groupTitle,
          desc: groupDesc || summary,
          companies,
        },
      ],
    },
  });
}

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/photoresist.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'photoresist',
  name: '光刻胶',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '光刻胶不是普通化工品，配方、工艺窗口和客户认证共同构成主壁垒，先进胶仍高度集中。',
  overview: '从 g/i-line 到 KrF、ArF、EUV，技术代际越往前，配方体系、杂质控制和批次一致性要求越高。市场的关键不只是国产替代意愿，而是长期验证后能否稳定量产。',
  report: [
    '边界上它属于前道晶圆制造材料，不属于狭义封装。真正的稀缺能力是先进胶配方、工艺窗口和客户验证，而不是简单的化工产能。',
    '市场规模按 QYResearch 重排，2024 / 2025 / 2026E 约 USD 2.69bn / 2.90bn / 3.13bn，2025 / 2026 为按 7.9% CAGR 机械外推。中国大陆 2024 年可见的广义 photoresist 市场约 USD 1.02bn，但这并不完全等同于前道半导体光刻胶。'
  ],
  basis: 'B',
  v2024: 2.69,
  v2025: 2.9,
  v2026: 3.13,
  marketNote: '2024 采用 QYResearch 半导体 photoresist 口径；2025 / 2026E 按 7.9% CAGR 机械外推。',
  market26Note: '2025 / 2026 为按公开 CAGR 机械外推。',
  chinaMarket: {
    previous: '2024',
    current: 'USD 1.02bn',
    note: '中国大陆口径更偏广义 photoresist 市场，仅作参考。',
  },
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Tokyo Ohka (TOK)',
      market: 'jp',
      summary: '全球光刻胶核心厂商之一，覆盖 g/i-line 到先进节点材料。',
      tags: ['photoresist', 'Japan', 'advanced node'],
    },
    {
      name: 'DuPont',
      market: 'us',
      summary: '先进光刻材料与配套化学平台型玩家。',
      tags: ['photoresist', 'US', 'materials platform'],
    },
    {
      name: 'FUJIFILM Holdings',
      market: 'jp',
      summary: '先进光刻材料平台，胶材与多层材料协同能力强。',
      tags: ['photoresist', 'Japan', 'platform'],
    },
    {
      name: '彤程新材',
      market: 'cn',
      summary: 'A 股光刻胶主线映射，核心看高端胶导入和产品结构升级。',
      tags: ['A股', '光刻胶', '国产替代'],
    },
    {
      name: '晶瑞电材',
      market: 'cn',
      summary: '同时卡位光刻胶与配套化学品，是国内光刻材料链的重要观察标的。',
      tags: ['A股', 'photoresist', '配套材料'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/lithography-ancillaries.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'lithography-ancillaries',
  name: '光刻配套材料',
  flowTo: ['晶圆制造（前道）'],
  summary: '显影液、去胶液、BARC / TARC 与 underlayer 更像一整套工艺协同材料，不该只当作光刻胶的附属品。',
  overview: '配套材料和曝光工艺窗口强绑定，真正的竞争力来自整套配方协同、缺陷控制和客户导入，而不是单一品类的名义产能。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。因为公开单独统计口径较少，这一页采用“总光刻材料减去 photoresist”的工作底稿估算，更适合排序与研究追踪。',
    '市场规模按 TECHCET 总 photolithography materials 扣减 photoresist 估算，2024 / 2025 / 2026E 约 USD 2.06bn / 2.16bn / 2.20bn。中国大陆 2024 年 ancillary 可见口径约 USD 0.19bn，但公开来源质量一般，仅作低置信度参考。'
  ],
  basis: 'B',
  v2024: 2.06,
  v2025: 2.16,
  v2026: 2.2,
  marketNote: '采用总光刻材料减去 photoresist 的工作底稿估算，不是官方单独统计口径。',
  market26Note: '2025 / 2026 为按公开口径差额与 CAGR 机械外推。',
  chinaMarket: {
    previous: '2024',
    current: 'USD 0.19bn',
    note: '中国 ancillary market 公开口径少，且该数字来源质量一般，仅作低置信度参考。',
  },
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Tokyo Ohka (TOK)',
      market: 'jp',
      summary: '显影液、去胶液与光刻胶协同能力强，是最典型的光刻化学平台。',
      tags: ['ancillaries', 'Japan', 'platform'],
    },
    {
      name: 'DuPont',
      market: 'us',
      summary: 'multilayer materials 与光刻配套体系的重要平台型玩家。',
      tags: ['ancillaries', 'US', 'materials platform'],
    },
    {
      name: 'FUJIFILM Holdings',
      market: 'jp',
      summary: '同时覆盖光刻胶、多层材料与后处理化学，工艺协同性强。',
      tags: ['ancillaries', 'Japan', 'platform'],
    },
    {
      name: '安集科技',
      market: 'cn',
      summary: 'A 股高端湿化学与配套材料主线，公司定位更偏平台型工艺化学。',
      tags: ['A股', '配套化学', '平台型'],
    },
    {
      name: '晶瑞电材',
      market: 'cn',
      summary: '国内少数同时卡位光刻胶与配套化学的材料链公司之一。',
      tags: ['A股', 'photoresist', 'ancillaries'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/electronic-gases.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'electronic-gases',
  name: '电子特气',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '电子特气更像工艺基础设施，高纯度、混配能力、现场供气与认证站点共同决定壁垒。',
  overview: '这个环节的难点不是“卖气”，而是卖一整套经过客户验证的供气体系。先进制程越复杂，对纯度、稳定性、危化管理和现场系统的要求越高。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。真正的定价权不只来自气体配方，还来自全球交付网络、现场供气系统和长期认证关系。',
    '市场规模按 TECHCET 口径整理，2024 / 2025 约 USD 6.05bn / 6.34bn，2026 暂未见统一公开值。中国大陆 2025 年可见市场规模约 RMB 31.66bn，更适合看本土渗透与站点建设能力。'
  ],
  basis: 'B',
  v2024: 6.05,
  v2025: 6.34,
  v2026: null,
  marketNote: '2025 采用 TECHCET 电子特气口径，2024 由同比回推；2026 暂未见统一公开锚点。',
  market26Note: '2026 暂无统一公开锚点，因此保留空白。',
  chinaMarket: {
    previous: '2025',
    current: 'RMB 31.66bn',
    note: '中国电子特气市场采用券商转引 TECHCET 的口径。',
  },
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Linde',
      market: 'us',
      summary: '全球电子气体和现场供气平台型龙头，强在跨地区供给网络与纯化能力。',
      tags: ['electronics gases', 'US', 'platform'],
    },
    {
      name: 'Air Products',
      market: 'us',
      summary: '高纯电子气体与现场系统核心玩家之一。',
      tags: ['electronics gases', 'US', 'onsite supply'],
    },
    {
      name: 'Air Liquide',
      market: 'eu',
      summary: '欧洲电子气体与供气系统主线平台，先进材料协同能力强。',
      tags: ['electronics gases', 'EU', 'platform'],
    },
    {
      name: '华特气体',
      market: 'cn',
      summary: 'A 股电子特气代表标的，核心看高纯气体与客户认证扩张。',
      tags: ['A股', '电子特气', '国产替代'],
    },
    {
      name: '中船特气',
      market: 'cn',
      summary: '国内电子特气主线玩家之一，偏高纯气与多品类扩张。',
      tags: ['A股', '电子特气'],
    },
    {
      name: '凯美特气',
      market: 'cn',
      summary: '更适合作为国内气体链条的边际映射和弹性跟踪标的。',
      tags: ['A股', '映射', '气体'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/wet-chemicals.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'wet-chemicals',
  name: '湿电子化学品',
  flowTo: ['晶圆制造（前道）'],
  summary: '高纯湿电子化学品的核心是纯化、批次稳定性和现场交付，普通化工产能很难直接迁移到高端制程。',
  overview: 'HF、H2SO4、H2O2、TMAH 以及各类功能性清洗液，看上去像普通化学品，实则高度依赖纯化、杂质控制、危化物流和现场服务体系。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。高端环节的关键不在品类多少，而在超高纯度、稳定批次和客户端长周期导入。',
    '市场规模按 TECHCET wet chemicals & specialty cleans 口径重排，2024 / 2025 / 2026E 约 USD 5.13bn / 5.44bn / 5.77bn，适合和清洗、CMP 前后处理协同去看。'
  ],
  basis: 'B',
  v2024: 5.13,
  v2025: 5.44,
  v2026: 5.77,
  marketNote: '采用 TECHCET wet chemicals & specialty cleans 口径；2024 回推，2026E 按 6% CAGR 机械外推。',
  market26Note: '2026E 由 2024-2029 CAGR 机械外推。',
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Entegris',
      market: 'us',
      summary: '高纯材料与过滤纯化平台，是湿法化学和相关纯化体系的重要玩家。',
      tags: ['wet chemicals', 'US', 'platform'],
    },
    {
      name: 'Stella Chemifa',
      market: 'jp',
      summary: '高纯氟系化学主线公司，HF / BHF 等产品在半导体应用里卡位清晰。',
      tags: ['HF', 'Japan', 'high purity'],
    },
    {
      name: 'Mitsubishi Chemical',
      market: 'jp',
      summary: '综合化学平台里的半导体湿化学重要供应方。',
      tags: ['wet chemicals', 'Japan', 'platform'],
    },
    {
      name: '江化微',
      market: 'cn',
      summary: 'A 股湿电子化学品代表标的，核心看高等级产品导入和客户扩张。',
      tags: ['A股', '湿电子化学品', '国产替代'],
    },
    {
      name: '格林达',
      market: 'cn',
      summary: '国内高纯湿化学链条重要玩家之一，更适合放在本土供应链里看。',
      tags: ['A股', '高纯化学'],
    },
    {
      name: '安集科技',
      market: 'cn',
      summary: '虽然更出名的是 CMP，但本质上是高端工艺化学平台，也能映射湿化学升级。',
      tags: ['A股', '平台型', '工艺化学'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/cmp-materials.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'cmp-materials',
  name: 'CMP 材料',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: 'CMP 材料直接决定平坦化窗口与良率，slurry、pad 与 post-CMP clean 是一套协同材料体系。',
  overview: '这个赛道看起来像耗材，实际上高度绑定工艺窗口。真正的卡点在磨粒控制、配方稳定性、pad / slurry 协同和客户验证，而不是简单的“多卖一点抛光液”。',
  report: [
    '边界上它属于前道材料，不属于狭义封装。值得继续深挖的不是单一品类，而是 slurry、pad 和 post-CMP clean 的组合能力。',
    '市场规模按 TECHCET 重排，2024 / 2025 / 2026E 约 USD 3.42bn / 3.62bn / 3.93bn。这个环节和先进节点层数增加、平坦化要求提升直接相关，属于前道材料里最容易出现国产化突破的一条。'
  ],
  basis: 'B',
  v2024: 3.42,
  v2025: 3.62,
  v2026: 3.93,
  marketNote: '2024 / 2025 采用 TECHCET CMP 材料口径，2026E 按 8.6% CAGR 机械外推。',
  market26Note: '2026E 按 2024-2029 CAGR 机械外推。',
  updateNote: '前道主线重排',
  companies: [
    {
      name: 'Entegris',
      market: 'us',
      summary: 'CMP slurry 与高纯材料平台型玩家，协同能力强。',
      tags: ['CMP slurry', 'US', 'platform'],
    },
    {
      name: 'DuPont',
      market: 'us',
      summary: 'CMP pad 与 slurry 体系完整，更适合按高端材料平台理解。',
      tags: ['CMP pad', 'CMP slurry', 'US'],
    },
    {
      name: 'Fujimi',
      market: 'jp',
      summary: '日本 CMP 材料主线公司，业务纯度和工艺绑定度都更高。',
      tags: ['CMP materials', 'Japan', 'planarization'],
    },
    {
      name: 'Resonac',
      market: 'jp',
      summary: '同时覆盖 CMP slurry、post-CMP 材料与先进封装化学，是平台型映射。',
      tags: ['CMP slurry', 'Japan', 'platform'],
    },
    {
      name: '安集科技',
      market: 'cn',
      summary: '国产 CMP slurry 与 post-CMP clean 核心龙头。',
      tags: ['A股', 'CMP slurry', 'post-CMP clean'],
    },
    {
      name: '鼎龙股份',
      market: 'cn',
      summary: '国产 CMP pad 主线，并持续向更多半导体材料平台延展。',
      tags: ['A股', 'CMP pad', 'materials platform'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/sputtering-targets.js

```
import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'sputtering-targets',
  name: '溅射靶材',
  section: '材料',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '高纯靶材是典型的寡头材料，难点不在金属本身，而在纯度、组织控制和长认证周期。',
  market: {
    v2024: 1.33,
    v2025: 1.45,
    basis: 'B',
    note: '2025 采用 TECHCET semiconductor sputtering target 口径，2024 回推，2026E 按 7% CAGR 机械外推。'
  },
  detail: {
    title: '溅射靶材板块深度拆解',
    intro: '把“溅射靶材”拆成四层来看：A 看全球主线龙头，B 看平台与协同玩家，C 看 A 股最纯主线，D 看 A 股平台映射与子公司资产。',
    updateNote: '靶材已经切到统一深拆结构；后续如果补更多子公司维度数据，可以继续挂在 D 组的平台映射卡下。',
    groups: [
      {
        title: 'A. 全球主线龙头',
        desc: '这一层是高纯靶材真正的全球主线。关键不只是市场份额，还包括高纯提炼、组织均匀性、绑定件工艺、稳定量产和长认证能力。',
        companies: [
          {
            name: 'JX Advanced Metals',
            market: 'jp',
            cap: 'USD 21.50B',
            summary: '全球半导体高端金属靶材主线龙头之一，AI 相关需求下继续扩产。',
            tags: ['semiconductor targets', 'thin film materials', 'Japan', 'oligopoly'],
            note: '非纯靶材收入；市值为母公司整体。'
          },
          {
            name: 'Materion',
            market: 'us',
            cap: 'USD 2.48B',
            summary: '北美高纯金属 / 靶材核心供应商，电子材料业务具备半导体靶材敞口。',
            tags: ['high purity metals', 'electronic materials', 'US', 'specialty materials'],
            note: '平台型材料公司，非纯靶材。'
          },
          {
            name: 'Tosoh',
            market: 'jp',
            cap: 'USD 4.86B',
            summary: '日本老牌化工材料龙头，Tosoh SMD 为全球重要靶材品牌。',
            tags: ['sputtering targets', 'Tosoh SMD', 'Japan', 'specialty chemicals'],
            note: '非纯靶材收入；靶材属 specialty 材料体系。'
          },
          {
            name: 'Mitsui Mining & Smelting',
            market: 'jp',
            cap: 'USD 13.77B',
            summary: '日本综合材料龙头，PVD Materials 为重要靶材 / 薄膜材料平台。',
            tags: ['PVD materials', 'Japan', 'advanced materials', 'platform company'],
            note: '非纯靶材收入；PVD Materials 只是分部。'
          }
        ]
      },
      {
        title: 'B. 平台与协同玩家',
        desc: '这一层更适合看“设备 + 材料”协同和平台型材料公司，而不是纯靶材收入。研究重点是其在半导体靶材链里的战略卡位。',
        companies: [
          {
            name: 'ULVAC',
            market: 'jp',
            cap: 'USD 2.76B',
            summary: '兼具真空设备与靶材材料能力，属于“设备 + 材料”协同玩家。',
            tags: ['vacuum equipment', 'sputtering targets', 'Japan', 'equipment+materials'],
            note: '非纯靶材；核心收入仍来自设备。'
          },
          {
            name: 'Honeywell',
            market: 'us',
            cap: 'USD 124.65B',
            summary: '平台型工业材料公司，半导体材料只是 Advanced Materials 业务线一部分。',
            tags: ['semiconductor materials', 'platform company', 'US', 'diversified'],
            note: '业务重要，但非独立靶材上市主体；不建议用集团整体财务代表靶材业务。'
          }
        ]
      },
      {
        title: 'C. A股最纯主线',
        desc: 'A 股里最接近 pure-play 靶材叙事的核心主线，关键看国产替代、先进制程验证和向零部件延展后的估值体系变化。',
        companies: [
          {
            name: '江丰电子',
            market: 'cn',
            cap: 'RMB 409.52B',
            summary: '国产半导体溅射靶材龙头，向零部件与静电卡盘延伸。',
            tags: ['domestic substitution', 'semiconductor targets', 'China', 'precision parts'],
            note: '靶材最纯 A 股主线之一，但近年零部件占比也在提升。'
          }
        ]
      },
      {
        title: 'D. A股平台映射与子公司资产',
        desc: '这组更适合按平台映射去读，核心不是它们“是不是纯靶材公司”，而是靶材资产在上市平台中的位置、纯度和兑现路径。',
        companies: [
          {
            name: '有研新材',
            market: 'cn',
            cap: 'RMB 186.75B',
            summary: '平台型新材料公司，半导体靶材核心资产为全资子公司有研亿金。',
            tags: ['Grikin', 'thin film materials', 'China', 'platform company'],
            note: '非纯靶材收入；更应关注有研亿金而不是上市平台整体。'
          },
          {
            name: '阿石创',
            market: 'cn',
            cap: 'RMB 57.92B',
            summary: '国内 PVD 靶材 / 镀膜材料玩家，覆盖显示、光伏与部分半导体材料。',
            tags: ['PVD materials', 'China', 'thin film', 'platform'],
            note: '更偏广义靶材 / 镀膜材料平台，半导体纯度低于江丰 / 有研亿金。'
          },
          {
            name: '隆华科技',
            market: 'cn',
            cap: 'RMB 95.95B',
            summary: '平台型新材料公司，靶材是其新材料板块的重要组成部分。',
            tags: ['sputtering target', 'China', 'new materials', 'platform'],
            note: '非纯靶材；集团业务较杂。'
          }
        ]
      }
    ]
  }
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/abf-substrates.js

```
import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'abf-substrates',
  name: 'ABF / 封装基板',
  section: '材料',
  flowTo: ['先进封装', '封装（后道）'],
  initialOpen: true,
  summary: 'ABF 更适合放在封装材料侧看，本质上是高端封装基板 / 载板体系，对 AI、HBM 与 Chiplet 尤其关键。',
  market: {
    v2024: 5.36,
    v2025: 5.88,
    basis: 'B',
    note: '2024 采用 ABF substrate 公开锚点；2025 / 2026E 按 9.8% CAGR 机械外推。'
  },
  detail: {
    title: 'ABF 封装基板板块深度拆解',
    intro: '把“ABF / 封装基板”拆成四层来看：A 看全球主线寡头，B 看高弹性与上游关键受益方，C 看区域弹性与边际恢复玩家，D 看 A 股映射与国产替代链。',
    updateNote: '载板主线已经切到统一深拆结构；后续补数据时直接按 A / B / C / D 四层继续扩展即可。',
    groups: [
      {
        title: 'A. 全球主线寡头',
        desc: '这一层是最直接受益 AI GPU / CPU、HBM 和高阶网络芯片升级的 ABF 主线。看点在大尺寸、高层数、FC-BGA 良率和头部客户绑定。',
        companies: [
          {
            name: 'Ibiden',
            market: 'jp',
            cap: 'USD 14.3B',
            summary: '日本高阶 FC-BGA / ABF 龙头，核心受益 AI GPU / CPU 大尺寸载板升级。',
            tags: ['ABF载板', 'FC-BGA', 'AI服务器', '日本龙头'],
            note: '纯度高，属全球主线标的。'
          },
          {
            name: 'Shinko Electric',
            market: 'jp',
            cap: 'USD 5.2B',
            summary: '日本先进封装基板核心厂，历史上是 Intel / 高端处理器载板重要供应商之一。',
            tags: ['ABF载板', '日本', '先进封装', '已私有化'],
            note: '2025-06-06 已退市；这里保留作为产业链历史核心样本。'
          },
          {
            name: 'Unimicron',
            market: 'tw',
            cap: 'USD 22.4B',
            summary: '全球 ABF / IC 载板主力厂之一，AI 加速器与高阶网络芯片敞口突出。',
            tags: ['ABF载板', '台股', 'AI服务器', '高阶网络'],
            note: '主线龙头，受益大尺寸 / 高层数基板。'
          },
          {
            name: 'Nan Ya PCB',
            market: 'tw',
            cap: 'USD 9.5B',
            summary: '台系 ABF / BT 载板重要厂商，处于 AI 相关高阶载板景气修复链条。',
            tags: ['ABF载板', '台股', 'FC-BGA', '景气修复'],
            note: '近两年盈利波动大，2026E 弹性高于 2025A。'
          }
        ]
      },
      {
        title: 'B. 高弹性与上游关键受益方',
        desc: '这一层更适合看利润弹性和材料卡位。Kinsus 偏高 beta 载板弹性，Ajinomoto 是 ABF 绝缘材料事实标准，SEMCO 则是韩系 FC-BGA 主线扩张平台。',
        companies: [
          {
            name: 'Kinsus',
            market: 'tw',
            cap: 'USD 4.8B',
            summary: '高弹性 ABF / SiP 载板厂，业绩对高端计算与手机模组需求修复更敏感。',
            tags: ['ABF载板', 'SiP', '台股', '高弹性'],
            note: '规模低于一线寡头，但弹性和博弈性更强。'
          },
          {
            name: 'Ajinomoto',
            market: 'jp',
            cap: 'USD 28.1B',
            summary: 'ABF 树脂 / 绝缘膜事实标准制定者，是 ABF 载板产业链最关键的上游材料公司。',
            tags: ['ABF材料', '上游垄断', '日本', '先进封装'],
            note: '不是纯载板制造商；为 ABF 材料核心受益标的。'
          },
          {
            name: 'Samsung Electro-Mechanics',
            market: 'kr',
            cap: 'USD 20.5B',
            summary: '韩国高阶封装基板 / FC-BGA 重要玩家，受益 AI 服务器与 HBM 配套封装生态扩张。',
            tags: ['FC-BGA', '韩国', 'AI服务器', '先进封装'],
            note: '平台型电子零部件公司，非纯 ABF 收入。'
          }
        ]
      },
      {
        title: 'C. 区域弹性与边际恢复玩家',
        desc: '这一层更适合看景气修复、客户升级和扩产节奏。Daeduck 是韩系弹性标的，AT&S 则代表欧洲高端载板与 Kulim 扩产逻辑。',
        companies: [
          {
            name: 'Daeduck Electronics',
            market: 'kr',
            cap: 'USD 2.2B',
            summary: '韩国 ABF / 高阶基板弹性标的，AI 相关高层数载板恢复时利润弹性较大。',
            tags: ['ABF载板', '韩国', '弹性', '高层数'],
            note: '体量较小，但处于产业修复和客户升级观察名单。'
          },
          {
            name: 'AT&S',
            market: 'eu',
            cap: 'USD 2.3B',
            summary: '欧洲高端 IC substrate / FC-BGA 玩家，Kulim 扩产与 AI 服务器需求是核心观察点。',
            tags: ['IC载板', '欧洲', '扩产', 'AI服务器'],
            note: '2026 收入采用 FY2026/27 官方指引中值；净利与估值缺口较大。'
          }
        ]
      },
      {
        title: 'D. A股映射与国产替代链',
        desc: 'A 股更适合从平台型高端 PCB、上游材料和国产替代能力验证去看，而不是把它们硬读成纯 ABF 载板公司。',
        companies: [
          {
            name: 'Shennan Circuits',
            market: 'cn',
            cap: 'RMB 176.83B',
            summary: 'A 股中最接近高端封装基板平台型龙头，兼具 PCB、封装基板与电子装联能力。',
            tags: ['A股', '封装基板', '平台型', '高端PCB'],
            note: '不是纯 ABF 公司，但在国产高端载板链条中地位最强。'
          },
          {
            name: 'Shengyi Technology',
            market: 'cn',
            cap: 'RMB 154.10B',
            summary: 'A 股电子材料龙头之一，IC substrate / 高速材料 / CCL 是 ABF 载板链关键上游映射。',
            tags: ['A股', 'CCL', '高速材料', 'IC substrate材料'],
            note: '上游材料映射，不是纯 ABF 载板制造商。'
          },
          {
            name: 'Fastprint / 兴森科技',
            market: 'cn',
            cap: 'RMB 41.45B',
            summary: 'A 股封装基板国产替代代表之一，业务更贴近“国产 ABF / 封装基板能力验证”。',
            tags: ['A股', '封装基板', '国产替代', 'IC载板'],
            note: '2025 收入 / 利润多采用 TTM proxy，2026E 公开口径不足。'
          },
          {
            name: 'Huazheng New Material',
            market: 'cn',
            cap: 'RMB 10.82B',
            summary: '高频高速覆铜板 / 树脂体系映射标的，可作为 ABF 载板国产材料链的边际观察点。',
            tags: ['A股', '材料', '高速CCL', '边际受益'],
            note: '纯度较低，更多是材料映射与国产替代观察。'
          }
        ]
      }
    ]
  }
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/bt-substrates.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'bt-substrates',
  name: 'BT 树脂 / BT 基板',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'BT resin / laminate 是封装基板体系的底层材料，更偏传统与中高端封装平台的基础盘。',
  overview: '和 ABF 相比，BT 更接近传统与中高端封装基板的基础材料层。它的研究重点不在“最先进”，而在稳定供给、树脂体系和基板材料卡位。',
  report: [
    '边界上它属于狭义封装材料。和 ABF 不同，BT 更像封装基板体系的基础盘，适合结合传统封装、存储和中高端基板去看。',
    '当前公开口径里缺少足够可靠、可交叉验证的独立全球 24 / 25 / 26E 市场规模，因此页面暂留空白，优先保留边界与公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'BT resin / BT laminate 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装基础盘补齐',
  companies: [
    {
      name: 'Mitsubishi Gas Chemical',
      market: 'jp',
      summary: 'BT resin / BT laminate 体系代表厂商，是这条链最典型的材料龙头。',
      tags: ['BT resin', 'Japan', 'packaging materials'],
    },
    {
      name: 'Panasonic',
      market: 'jp',
      summary: '日本材料平台里 BT 与相关基板材料的重要供给方。',
      tags: ['BT substrate', 'Japan', 'materials platform'],
    },
    {
      name: 'Nan Ya Plastics',
      market: 'tw',
      summary: '台系 BT / laminate 体系的重要映射标的。',
      tags: ['BT substrate', 'Taiwan', 'laminate'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/interconnect-solders.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'interconnect-solders',
  name: '互连焊料',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '锡球、锡膏、助焊剂与预成型焊片是互连成形的基础材料，先进封装里可靠性与热循环能力更关键。',
  overview: '互连焊料看起来更成熟，但在高 I/O、高热流密度和更严苛可靠性条件下，材料配方与工艺窗口仍会持续升级。',
  report: [
    '边界上它属于狭义封装材料。对传统后道封装和先进封装都重要，但先进封装阶段更看重焊点可靠性、热循环表现和细间距成形能力。',
    '当前公开口径里缺少可靠的独立全球 24 / 25 / 26E 市场规模，因此页面优先保留赛道边界和代表公司的投资映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '互连焊料的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装材料补齐',
  companies: [
    {
      name: 'Senju',
      market: 'jp',
      summary: '日系焊锡材料代表厂商，覆盖锡膏、焊锡料与相关互连材料。',
      tags: ['solder', 'Japan', 'packaging'],
    },
    {
      name: '唯特偶',
      market: 'cn',
      summary: 'A 股最直接的锡膏 / 焊锡料 / 助焊剂映射标的之一。',
      tags: ['A股', 'solder paste', 'flux'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '在封装材料侧同时覆盖锡球、助焊剂和更多封装化学，是平台型映射。',
      tags: ['A股', 'packaging materials', 'platform'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/molding-compounds.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'molding-compounds',
  name: 'EMC / GMC / LMC',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '模塑 / 塑封材料正在从传统 EMC 向颗粒状与液态体系延伸，先进封装对热管理和应力控制要求更高。',
  overview: '这条赛道最容易被市场低估，因为它同时影响封装可靠性、应力管理、翘曲和热性能。HBM 与大尺寸封装升级，会持续抬高材料要求。',
  report: [
    '边界上它属于狭义封装材料。和传统理解不同，EMC / GMC / LMC 不只是“塑封料”，而是先进封装聚合物材料体系中的重要分支。',
    '独立全球 24 / 25 / 26E 可靠公开口径不足，因此页面不强行估值，只保留边界清晰的公司映射与后续深挖入口。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'EMC / GMC / LMC 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装聚合物补齐',
  companies: [
    {
      name: 'Sumitomo Bakelite',
      market: 'jp',
      summary: '全球塑封料主线龙头之一，是先进封装聚合物材料的核心日系玩家。',
      tags: ['EMC', 'Japan', 'packaging polymers'],
    },
    {
      name: 'Resonac',
      market: 'jp',
      summary: '兼具前道化学与后道封装材料，是平台型聚合物映射。',
      tags: ['EMC', 'Japan', 'platform'],
    },
    {
      name: '华海诚科',
      market: 'cn',
      summary: 'A 股塑封料主线标的之一，更直接映射 EMC / underfill 升级。',
      tags: ['A股', 'EMC', 'packaging materials'],
    },
    {
      name: '凯华材料',
      market: 'cn',
      summary: '国内封装塑封材料玩家，适合作为本土替代边际观察点。',
      tags: ['A股', 'EMC', 'mapping'],
    },
    {
      name: '创达新材',
      market: 'cn',
      summary: '封装模塑材料映射标的之一，更适合放在 advanced packaging polymers 链条里看。',
      tags: ['A股', 'molding compounds'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/underfill-muf.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'underfill-muf',
  name: 'Underfill / MUF',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'Underfill / MUF 直接决定先进封装互连可靠性，是 HBM、2.5D / 3D 和大尺寸封装里的关键聚合物材料。',
  overview: '这条赛道越往先进封装走，价值越高。材料不仅要解决空隙填充，还要兼顾热应力、界面可靠性和大尺寸封装的长期稳定性。',
  report: [
    '边界上它属于狭义封装材料，而且是先进封装里最值得继续拆细的一档聚合物材料。',
    '当前公开资料中缺少可靠的独立全球 24 / 25 / 26E 市场规模，所以页面先保留赛道优先级与公司映射，不做机械外推。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'Underfill / MUF 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装聚合物补齐',
  companies: [
    {
      name: 'Henkel',
      market: 'eu',
      summary: '全球 underfill / die attach / 封装胶黏体系的重要平台型玩家。',
      tags: ['underfill', 'EU', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: 'A 股最直接的底部填充与封装胶黏剂映射标的之一。',
      tags: ['A股', 'underfill', 'packaging adhesives'],
    },
    {
      name: '华海诚科',
      market: 'cn',
      summary: '除塑封料外，也能映射 underfill / MUF 体系升级。',
      tags: ['A股', 'underfill', 'EMC'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/die-attach-materials.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'die-attach-materials',
  name: 'DAF / 银胶 / 银烧结',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '固晶膜、导电胶与银烧结共同决定 die attach 的热阻、可靠性与功率器件上限。',
  overview: '这条赛道横跨传统封装、先进封装和功率半导体，关键不是材料名词，而是热阻、导电性、工艺适配和长期可靠性。',
  report: [
    '边界上它属于狭义封装材料。随着功率器件和高热流密度封装升级，银烧结和高性能 die attach 材料的重要性会继续提升。',
    '独立全球 24 / 25 / 26E 公开口径不足，因此页面先保留材料形态与代表公司，不强行做工作底稿以外的规模估算。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'DAF / 银胶 / 银烧结的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装材料补齐',
  companies: [
    {
      name: 'Henkel',
      market: 'eu',
      summary: '封装胶黏与 die attach 平台型龙头，覆盖 DAF 与导电胶体系。',
      tags: ['DAF', 'EU', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: 'A 股里更直接映射 DAF / underfill / 固晶材料升级的公司之一。',
      tags: ['A股', 'DAF', 'packaging adhesives'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '封装材料平台型映射，能覆盖导电胶和更多封装化学。',
      tags: ['A股', 'silver paste', 'platform'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/leadframes.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'leadframes',
  name: '引线框架',
  flowTo: ['封装（后道）'],
  summary: '引线框架更偏传统后道封装主材，壁垒在精密冲压 / 蚀刻、镀层与大客户供货稳定性。',
  overview: '它不是先进封装最性感的赛道，但仍是传统封装和大量分立器件的重要基础材料。研究重点在成本、良率和客户结构，而不是单纯看行业景气叙事。',
  report: [
    '边界上它属于狭义封装材料，更贴近传统后道封装，因此页面把它放在“封装（后道）”视图里，而不是强行归到先进封装。',
    '公开资料里缺少足够可靠的独立全球 24 / 25 / 26E 市场口径，所以页面先保留公司映射与边界说明。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '引线框架的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '传统后道材料补齐',
  companies: [
    {
      name: '康强电子',
      market: 'cn',
      summary: 'A 股最直接的引线框架映射标的之一，也覆盖键合丝。',
      tags: ['A股', 'leadframe', 'traditional packaging'],
    },
    {
      name: 'Shinko Electric',
      market: 'jp',
      summary: '除高端载板外，也能映射引线框架等传统封装基础材料能力。',
      tags: ['Japan', 'leadframe', 'packaging'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/bonding-wires.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'bonding-wires',
  name: '键合丝',
  flowTo: ['封装（后道）'],
  summary: '键合丝是典型的成熟但不低门槛材料，Au / Cu / Ag / Pd-coated wire 的制程稳定性与客户导入是核心。',
  overview: '这个赛道成熟，但不代表没有壁垒。材料纯度、拉丝工艺和客户验证仍决定产品结构与盈利质量。',
  report: [
    '边界上它属于狭义封装材料，更贴近传统后道封装。虽然市场关注度低于先进封装聚合物或载板，但在成熟封装里仍是基本盘。',
    '独立全球 24 / 25 / 26E 公开口径不足，因此页面不强行估值，只保留公司映射与赛道边界。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '键合丝的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '传统后道材料补齐',
  companies: [
    {
      name: 'MK Electron',
      market: 'kr',
      summary: '韩股键合丝主线映射之一，适合跟踪 wire bond 生态。',
      tags: ['bonding wire', 'Korea', 'packaging'],
    },
    {
      name: '康强电子',
      market: 'cn',
      summary: 'A 股里同时覆盖引线框架和键合丝的最直接映射标的之一。',
      tags: ['A股', 'bonding wire', 'leadframe'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/temporary-bonding.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'temporary-bonding',
  name: '临时键合 / 解键合',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '临时键合 / 解键合是晶圆级先进封装与薄化工艺的关键胶黏体系，真正的卡点在制程窗口与可逆剥离性能。',
  overview: '晶圆越薄、层数越高、工艺越复杂，对 temporary bond / debond 的要求就越高。这条材料线和先进封装良率直接相关。',
  report: [
    '边界上它属于狭义封装材料，而且更偏先进封装。和普通胶黏剂不同，它真正卖的是工艺窗口和可控解键合能力。',
    '当前公开资料里缺少独立全球 24 / 25 / 26E 市场规模，因此页面只保留赛道边界与代表公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '临时键合 / 解键合的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装聚合物补齐',
  companies: [
    {
      name: 'DuPont',
      market: 'us',
      summary: 'advanced packaging 材料平台型玩家，临时键合体系是其重要能力之一。',
      tags: ['temporary bonding', 'US', 'platform'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: 'A 股最直接的临时键合 / 电镀液 / 封装材料平台映射之一。',
      tags: ['A股', 'temporary bonding', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: '封装胶黏剂与 underfill 体系玩家，也能映射临时键合升级。',
      tags: ['A股', 'packaging adhesives'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/rdl-dielectrics.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'rdl-dielectrics',
  name: 'RDL 光刻 / PI / PBO',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'RDL 光刻胶、PI / PBO 绝缘层与 dry film 直接决定先进封装重布线密度与层间可靠性。',
  overview: '这条材料线是先进封装里最典型的“看起来细、实则很关键”的环节。重布线层数、线宽线距和可靠性提升，都会持续抬高它的重要性。',
  report: [
    '边界上它属于狭义封装材料，而且明确偏先进封装。它和 ABF、underfill、电镀液一样，都是 HBM / Chiplet 链条里需要单独跟踪的材料节点。',
    '当前公开资料里缺少可靠的独立全球 24 / 25 / 26E 市场规模，因此页面先保留边界和代表公司的映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: 'RDL 光刻 / PI / PBO 的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装材料补齐',
  companies: [
    {
      name: 'DuPont',
      market: 'us',
      summary: 'PI / PBO 和更多 advanced packaging dielectrics 的重要平台型玩家。',
      tags: ['RDL', 'PI', 'US', 'platform'],
    },
    {
      name: 'FUJIFILM Holdings',
      market: 'jp',
      summary: '从光刻到 advanced packaging materials 的平台型映射。',
      tags: ['RDL', 'photo materials', 'Japan'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '在晶圆级封装材料侧卡位清晰，是 RDL / plating / bonding 的平台映射。',
      tags: ['A股', 'RDL', 'platform'],
    },
    {
      name: '彤程新材',
      market: 'cn',
      summary: '除前道光刻胶外，也能映射封装侧 RDL 相关材料升级。',
      tags: ['A股', 'RDL', 'photo materials'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/plating-chemicals.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'plating-chemicals',
  name: '电镀液 / 添加剂 / WLP 湿制程',
  flowTo: ['先进封装', '封装（后道）'],
  summary: 'WLP / advanced packaging 的电镀液和添加剂是高密度互连成形的底层化学体系，精细添加剂决定线形和填孔质量。',
  overview: '先进封装从“有无电镀”走向“电镀质量如何”，价值就转到添加剂体系、填孔表现、线形控制和稳定量产能力。',
  report: [
    '边界上它属于狭义封装材料，而且更偏先进封装。和前道湿化学相似，这里真正卖的是工艺窗口和可靠量产，而不是简单的化学品吨数。',
    '当前公开资料缺少独立全球 24 / 25 / 26E 可靠口径，因此页面优先保留赛道定义与投资映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '电镀液 / 添加剂 / WLP 湿制程的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '先进封装材料补齐',
  companies: [
    {
      name: 'DuPont',
      market: 'us',
      summary: '先进封装与电子化学平台型玩家，在 plating chemistries 上也有卡位。',
      tags: ['plating chemistries', 'US', 'platform'],
    },
    {
      name: 'JCU',
      market: 'jp',
      summary: '日系精细电镀化学代表公司，是 WLP 化学的重要映射标的。',
      tags: ['plating additives', 'Japan', 'WLP'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: 'A 股最直接的 advanced packaging 电镀液映射之一。',
      tags: ['A股', 'plating chemicals', 'platform'],
    },
    {
      name: '天承科技',
      market: 'cn',
      summary: 'A 股电镀添加剂与精细化学映射标的，适合跟踪先进封装渗透。',
      tags: ['A股', 'plating additives', 'WLP'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/spherical-silica.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'spherical-silica',
  name: '球形硅微粉',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '球形硅微粉是 EMC、underfill 和更多封装填料体系里的关键低膨胀填充料，决定热稳定与流变表现。',
  overview: '市场往往更后知后觉，但它是先进封装聚合物材料的重要底层填料。随着封装热管理和翘曲控制要求提升，填料的重要性会被不断抬高。',
  report: [
    '边界上它属于狭义封装材料，更准确地说，是封装聚合物材料里的关键填料层。',
    '公开资料里缺少可靠的独立全球 24 / 25 / 26E 市场规模，因此页面先保留公司映射，不做过度精确化。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '球形硅微粉的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装填料补齐',
  companies: [
    {
      name: 'Denka',
      market: 'jp',
      summary: '高性能封装填料与先进材料的重要日系玩家。',
      tags: ['spherical silica', 'Japan', 'fillers'],
    },
    {
      name: '联瑞新材',
      market: 'cn',
      summary: 'A 股球形硅微粉最直接的映射标的之一。',
      tags: ['A股', 'spherical silica', 'fillers'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/ceramic-fillers.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'ceramic-fillers',
  name: '氧化铝 / 氮化硼填料',
  flowTo: ['先进封装', '封装（后道）'],
  summary: '球形氧化铝和氮化硼是高导热封装材料的重要填料，热管理要求越高，这类材料价值越容易被重估。',
  overview: '这条线更偏封装材料上游，但随着热设计成为先进封装的核心议题，导热填料的重要性会持续上升。',
  report: [
    '边界上它属于狭义封装材料里的填料层，和 EMC、underfill、导热界面体系强相关。',
    '公开资料里缺少可靠的独立全球 24 / 25 / 26E 市场口径，因此页面先保留边界与公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '氧化铝 / 氮化硼填料的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '封装填料补齐',
  companies: [
    {
      name: 'Denka',
      market: 'jp',
      summary: '高性能导热填料与封装材料的重要日系代表。',
      tags: ['alumina', 'boron nitride', 'Japan'],
    },
    {
      name: 'Saint-Gobain',
      market: 'eu',
      summary: '欧洲先进陶瓷与导热材料平台型玩家，可映射封装填料升级。',
      tags: ['ceramic fillers', 'EU', 'thermal management'],
    },
    {
      name: '联瑞新材',
      market: 'cn',
      summary: 'A 股填料主线标的，球形氧化铝等高性能填料是重要看点。',
      tags: ['A股', 'ceramic fillers', 'thermal'],
    },
    {
      name: '国瓷材料',
      market: 'cn',
      summary: '先进陶瓷与高性能粉体平台，也能映射封装导热材料升级。',
      tags: ['A股', 'advanced ceramics', 'fillers'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/solder-powders-alloys.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'solder-powders-alloys',
  name: '铋 / 锡 / 银 / 铟合金粉',
  flowTo: ['封装（后道）'],
  summary: '这层更偏封装焊料与原料上游，不属于狭义封装材料本体，但会影响互连体系的成本与配方选择。',
  overview: '它更像封装材料的原料层而不是材料本体，但在焊料体系升级和配方变化时，仍会对成本和产业链定价产生明显影响。',
  report: [
    '边界上它不属于狭义半导体封装材料，更接近焊料和封装原料上游，所以页面把它单列出来，避免和 underfill、EMC 这类材料混在一起。',
    '公开资料里缺少可靠的独立全球 24 / 25 / 26E 口径，因此页面先保留链条位置与公司映射。'
  ],
  basis: 'C',
  v2024: null,
  v2025: null,
  v2026: null,
  marketNote: '铋 / 锡 / 银 / 铟合金粉的独立全球 24 / 25 / 26E 公开口径不足，页面暂留空白。',
  updateNote: '原料层补齐',
  companies: [
    {
      name: 'Senju',
      market: 'jp',
      summary: '日系焊料体系代表厂商，可映射上游合金粉与配方能力。',
      tags: ['solder alloys', 'Japan', 'packaging'],
    },
    {
      name: '唯特偶',
      market: 'cn',
      summary: 'A 股焊料体系最直接的映射之一，也能向上看合金粉和配方演进。',
      tags: ['A股', 'solder alloys', 'flux'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: '封装材料平台型映射，也能覆盖焊料和原料体系的边际变化。',
      tags: ['A股', 'packaging materials', 'mapping'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/materials/advanced-packaging-polymers.js

```
import { createMaterialSubsegment } from './material-subsegment.js';

export default createMaterialSubsegment({
  slug: 'advanced-packaging-polymers',
  name: '先进封装聚合物材料（合计）',
  flowTo: ['先进封装', '封装（后道）'],
  initialOpen: true,
  summary: '把 dielectrics、mold compounds、underfill 和 temporary bonding materials 合并看，更能反映先进封装聚合物材料这一条真正的景气主线。',
  overview: '如果只选一条最值得继续深挖的封装材料主线，这一项优先级很高。它把 advanced packaging 中最关键的聚合物材料放到同一口径里看，更贴近 HBM、Chiplet 和大尺寸封装升级。',
  report: [
    '边界上它属于狭义封装材料，而且明确偏先进封装。这个合并口径更适合做赛道总入口，再向下拆 EMC、Underfill、临时键合和 RDL dielectrics。',
    '市场规模按 advanced packaging polymeric materials 口径重排，2024 / 2025 / 2026E 约 USD 1.60bn / 1.81bn / 2.05bn，其中 2025 / 2026 为按 13.2% CAGR 机械外推。'
  ],
  basis: 'B',
  v2024: 1.6,
  v2025: 1.81,
  v2026: 2.05,
  marketNote: '2024 采用 advanced packaging polymeric materials 公开口径；2025 / 2026E 按 13.2% CAGR 机械外推。',
  market26Note: '2025 / 2026 为按公开 CAGR 机械外推。',
  updateNote: '先进封装主线重排',
  companies: [
    {
      name: 'Henkel',
      market: 'eu',
      summary: 'underfill、die attach 与更多封装胶黏体系的重要平台型玩家。',
      tags: ['packaging polymers', 'EU', 'platform'],
    },
    {
      name: 'Sumitomo Bakelite',
      market: 'jp',
      summary: '塑封料与 advanced packaging polymers 的主线龙头之一。',
      tags: ['EMC', 'Japan', 'packaging polymers'],
    },
    {
      name: 'Resonac',
      market: 'jp',
      summary: '兼具前道化学与后道封装材料，是最典型的平台型映射之一。',
      tags: ['packaging polymers', 'Japan', 'platform'],
    },
    {
      name: '德邦科技',
      market: 'cn',
      summary: 'A 股 advanced packaging polymers 最直接的映射之一，覆盖 underfill 与封装胶黏体系。',
      tags: ['A股', 'underfill', 'packaging adhesives'],
    },
    {
      name: '华海诚科',
      market: 'cn',
      summary: '塑封料与封装聚合物链条重要标的之一。',
      tags: ['A股', 'EMC', 'packaging polymers'],
    },
    {
      name: '飞凯材料',
      market: 'cn',
      summary: 'advanced packaging 化学平台型玩家，临时键合、电镀液和封装材料卡位较多。',
      tags: ['A股', 'platform', 'advanced packaging'],
    },
  ],
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/index.js

```
import lithographyScanners from './lithography-scanners.js';
import trackSystems from './track-systems.js';
import etchEquipment from './etch-equipment.js';
import depositionEquipment from './deposition-equipment.js';
import cleaningEquipment from './cleaning-equipment.js';
import cmpEquipment from './cmp-equipment.js';
import ionImplant from './ion-implant.js';
import metrologyInspection from './metrology-inspection.js';
import ate from './ate.js';
import probersHandlers from './probers-handlers.js';
import advancedPackagingEquipment from './advanced-packaging-equipment.js';

export default {
  section: '设备',
  hint: '最核心的资本开支入口，也是先进制程最显性的卡位环节',
  items: [
    lithographyScanners,
    trackSystems,
    etchEquipment,
    depositionEquipment,
    cleaningEquipment,
    cmpEquipment,
    ionImplant,
    metrologyInspection,
    ate,
    probersHandlers,
    advancedPackagingEquipment
  ]
};

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/lithography-scanners.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'lithography-scanners',
  name: '光刻曝光机',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '先进曝光几乎被 ASML 主导，全球真实格局接近三强寡头。',
  market: { v2024: 24.0, v2025: 27.5, basis: 'B', note: '以曝光设备为最核心单体设备大类，参考龙头收入与WFE结构映射。' },
  companies: [['ASML', 'us'], ['Nikon', 'jp'], ['Canon', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/track-systems.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'track-systems',
  name: '涂胶显影设备（Track）',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '和曝光机强绑定，是光刻良率与节拍控制的关键环节。',
  market: { v2024: 4.8, v2025: 5.5, basis: 'B', note: '按coater/developer track的独立市场盘子估算。' },
  companies: [['Tokyo Electron（TEL）', 'jp'], ['SCREEN Holdings', 'jp'], ['芯源微', 'cn'], ['TAZMO', 'jp'], ['ACM Research', 'us']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/etch-equipment.js

```
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

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/deposition-equipment.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'deposition-equipment',
  name: '薄膜沉积设备（CVD / PVD / ALD / 炉管）',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  summary: '平台型龙头的综合能力很重要，炉管与 ALD 又各自有细分壁垒。',
  market: { v2024: 25.0, v2025: 28.5, basis: 'B', note: '沉积为平台型最大设备环节之一，按deposition cluster大类映射。' },
  companies: [['Applied Materials', 'us'], ['Tokyo Electron（TEL）', 'jp'], ['Lam Research', 'us'], ['Kokusai Electric', 'jp'], ['北方华创', 'cn']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/cleaning-equipment.js

```
import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'cleaning-equipment',
  name: '清洗设备',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '在先进存储、多重图形化、EUV 和先进封装里，对良率与缺陷控制极其敏感，是最容易被低估但工艺刚性很强的一类设备。',
  market: {
    v2024: 8.5,
    v2025: 9.8,
    basis: 'B',
    note: '先进节点、多重图形化与先进封装共同提升 single-wafer cleaning、strip / clean 与邻近清洗设备的重要性。'
  },
  detail: {
    title: '清洗设备板块深度拆解',
    intro: '把“清洗设备”分成四层来看：A 看全球主线龙头，B 看特色挑战者与小而专玩家，C 看板块边界外延，D 看 A 股主线与平台映射。阅读上先抓 SCREEN / TEL 这条主线，再往下看中国设备商平台化扩张。',
    updateNote: '当前已补入 11 家公司及统一财务卡；由于很多公司属于平台型设备商，卡片里的营收和利润并不等同于清洗单一业务收入。',
    groups: [
      {
        title: 'A. 全球主线龙头',
        desc: '这一层是清洗设备最核心的供给侧。SCREEN 是最纯主线龙头，TEL 是平台协同最强的第二极，Lam 和 AMAT 则更多从平台能力切入 strip / clean、wet clean 与整线工艺解决方案。',
        companies: [
          {
            name: 'SCREEN Holdings',
            market: 'jp',
            cap: 'USD 12.66B',
            summary: '全球纯清洗龙头，单片 / 槽式 / 刷洗三线领先。',
            tags: ['single-wafer', 'batch', 'spin scrubber', 'EUV', 'advanced packaging'],
            note: '非纯清洗收入；SPE 内亦含 coater / developer、anneal、inspection。',
            segmentExposure: {
              role: '在清洗设备里属于全球最核心主线龙头，但上市公司财务仍包含更广的 SPE 设备组合，不等于 pure-play 清洗主体。',
              revenueShare: { value: '未单独披露', note: '公司公开口径以 SPE 事业部为主，未拆出清洗单项收入。' },
              profitShare: { value: '未单独披露', note: '未按清洗设备单独披露利润或利润率。' },
              source: '公司分部披露 / 产品线口径',
              badges: ['核心主线', '分部口径'],
              note: '如果后续补卖方拆分模型，可以直接在这里写清洗收入占 SPE 或占公司总收入的比例。'
            }
          },
          {
            name: 'Tokyo Electron',
            market: 'jp',
            cap: 'USD 125.04B',
            summary: '全球清洗第二，且平台协同能力最强。',
            tags: ['cleaning system', 'track', 'etch', 'HBM', '2nm'],
            note: '平台型公司 / 非纯清洗收入。',
            segmentExposure: {
              role: '在清洗设备里处于全球第一梯队，是平台型设备巨头中最强的清洗第二极之一。',
              revenueShare: { value: '未单独披露', note: '清洗系统并入更大的产品线组合，未见公司单独给出收入占比。' },
              profitShare: { value: '未单独披露', note: '公司未按清洗单环节披露利润。' },
              source: '公司产品线披露',
              badges: ['平台型', '第一梯队'],
              note: '这里的阅读重点是“清洗在 TEL 版图中的战略地位”，而不是把 TEL 当成单一清洗公司。'
            }
          },
          {
            name: 'Lam Research',
            market: 'us',
            cap: 'USD 223.66B',
            summary: 'Strip / Clean / Bevel / Wet processing 强势平台商。',
            tags: ['strip clean', 'wet clean', 'bevel clean', 'advanced packaging', 'platform'],
            note: '非纯清洗收入；清洗为平台能力的一部分。',
            segmentExposure: {
              role: '在清洗设备里属于“平台能力非常强的主线玩家”，尤其在 strip / bevel / 邻近湿法处理上很关键。',
              revenueShare: { value: '未单独披露', note: '公司以整个平台口径披露，清洗相关收入未单拆。' },
              profitShare: { value: '未单独披露', note: '未见清洗业务独立利润披露。' },
              source: '公司整体财务 + 产品线描述',
              badges: ['平台型', '非纯板块'],
              note: '更适合作为“清洗相关能力权重很高的平台商”理解，而不是湿法清洗 pure-play。'
            }
          },
          {
            name: 'Applied Materials',
            market: 'us',
            cap: 'USD 255.31B',
            summary: '平台型巨头，wet clean exposure 主要通过整线工艺平台体现。',
            tags: ['platform', 'wet clean exposure', 'etch', 'integrated solutions', 'front-end'],
            note: '平台型公司 / 非纯板块收入。',
            segmentExposure: {
              role: '在清洗设备里的地位更偏“平台型整线工艺参与者”，并非传统意义上的纯清洗主机龙头。',
              revenueShare: { value: '未单独披露', note: '公司未将 wet clean 单列为独立收入项目。' },
              profitShare: { value: '未单独披露', note: '利润跟随更大的 Semiconductor Systems 口径披露。' },
              source: '公司分部披露 / 产品线描述',
              badges: ['平台型', '整线方案'],
              note: '后续如果接入卖方模型，可以写成“清洗相关收入约占半导体系统业务的 x%”这种格式。'
            }
          }
        ]
      },
      {
        title: 'B. 特色挑战者与小而专玩家',
        desc: '这组更适合看份额提升和结构性突破。ACM Research 是中国背景下最强的全球挑战者之一，TAZMO 则是小而专的单片清洗与临时键合设备玩家，特点是产品细分、弹性更大、但纯度和流动性都更复杂。',
        companies: [
          {
            name: 'ACM Research',
            market: 'us',
            cap: 'USD 2.51B',
            summary: '中国背景下最强全球挑战者之一，单片湿法 + 先进封装延展明显。',
            tags: ['single-wafer', 'wet clean', 'advanced packaging', 'megasonic', 'China exposure'],
            note: '非纯清洗；亦覆盖电镀、炉管、PECVD 等。',
            segmentExposure: {
              role: '虽然不是完全纯清洗公司，但在湿法清洗环节属于最值得单独跟踪的挑战者之一，清洗权重显著高于多数平台型设备商。',
              revenueShare: { value: '待补', note: '可后续补“清洗及邻近湿法设备占总收入比例”的估算口径。' },
              profitShare: { value: '待补', note: '公司未按清洗单独披露利润，需要研究员估算。' },
              source: '公司产品线口径',
              badges: ['挑战者', '清洗权重高']
            }
          },
          {
            name: 'TAZMO',
            market: 'jp',
            cap: 'USD 0.26B',
            summary: '小而专的单片清洗 / 临时键合 / 涂胶显影设备商。',
            tags: ['single-wafer cleaning', 'CENOTE', 'temporary bonding', 'coater', 'small cap'],
            note: '非纯清洗；半导体生产设备为多产品组合。'
          }
        ]
      },
      {
        title: 'C. 板块边界外延',
        desc: '这一层不属于典型 wet clean 主线，更像清洗板块的外延边界。PSK Holdings 以 dry cleaning / strip 为核心，受益逻辑更多来自去胶、DRAM 和高深宽比结构处理，而不是传统单片湿法清洗。',
        companies: [
          {
            name: 'PSK Holdings',
            market: 'kr',
            cap: 'USD 1.51B',
            summary: '干法清洗 / 去胶特色厂商，位于清洗板块边界外延。',
            tags: ['dry cleaning', 'PR strip', 'DRAM', 'high aspect ratio', 'adjacent clean'],
            note: '更偏 dry cleaning / strip；非典型 wet clean 主线。'
          }
        ]
      },
      {
        title: 'D. A股主线与平台映射',
        desc: 'A 股这边最值得先盯的是盛美上海这条相对更纯的主机主线，再看北方华创、芯源微、华海清科和至纯科技这些通过平台扩张、邻近工艺延展或系统能力切入清洗赛道的映射标的。',
        companies: [
          {
            name: '盛美上海',
            market: 'cn',
            cap: 'RMB 726.63B',
            summary: '中国最纯清洗主机厂之一，正向平台化扩张。',
            tags: ['wet clean', 'megasonic', 'advanced packaging', 'China OEM', 'platformization'],
            note: '非纯清洗；已延伸电镀、炉管、Track、PECVD 等。'
          },
          {
            name: '北方华创',
            market: 'cn',
            cap: 'RMB 3,490.79B',
            summary: '国产平台设备龙头，前道单片 / 背面 / 槽式清洗持续扩张。',
            tags: ['platform', 'cleaning', 'etch', 'deposition', 'China OEM'],
            note: '平台型公司 / 清洗非全部收入；2025E 利润口径分歧较大。'
          },
          {
            name: '芯源微',
            market: 'cn',
            cap: 'RMB 331.19B',
            summary: 'Track 主业之外，前道物理 / 化学清洗与先进封装是重要增量。',
            tags: ['track', 'physical clean', 'chemical clean', 'advanced packaging', 'China OEM'],
            note: '非纯清洗；2025 为业绩快报口径，2026 完整主表预测缺失。'
          },
          {
            name: '华海清科',
            market: 'cn',
            cap: 'RMB 644.14B',
            summary: 'CMP 龙头向 post-CMP / 清洗延伸。',
            tags: ['CMP', 'post-CMP clean', 'wafer thinning', 'platform', 'China OEM'],
            note: '清洗非主收入，仅为平台延伸；2025 为业绩快报口径。',
            segmentExposure: {
              role: '在清洗设备里更适合作为“CMP 向 post-CMP clean 延伸”的邻近玩家，而不是清洗主线整机厂。',
              revenueShare: { value: '未单独披露', note: '清洗仍是平台延展方向，未单拆为独立收入。' },
              profitShare: { value: '未单独披露', note: '利润随公司整体设备平台披露。' },
              source: '公司业务口径',
              badges: ['邻近延伸', '非主收入']
            }
          },
          {
            name: '至纯科技',
            market: 'cn',
            cap: 'RMB 92.41B',
            summary: '高纯系统 + 湿法设备双轮驱动，S300-D 湿法平台推进中。',
            tags: ['high-purity system', 'wet equipment', 'S300-D', 'China OEM', 'mixed exposure'],
            note: '非纯清洗；2024 净利润由年报现金分红总额 / 占比反推；2025 仅有净利一致预期，营收预测主口径不足。'
          }
        ]
      }
    ]
  }
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/cmp-equipment.js

```
import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'cmp-equipment',
  name: 'CMP 设备',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '又一个集中度极高、客户粘性很强的前道设备环节，核心受益先进互连、存储和部分先进封装工艺升级。',
  market: {
    v2024: 3.5,
    v2025: 4.1,
    basis: 'B',
    note: '以 CMP tool 寡头市场结构为基础，结合先进互连、存储和部分先进封装增量需求进行网页映射。'
  },
  detail: {
    title: 'CMP 设备板块深度拆解',
    intro: '把“CMP 设备”拆成四层来看：A 看全球主线龙头，B 看正式拥有 CMP 产品线但业务更广的平台型设备商，C 看区域型挑战者，D 看 A 股材料与零部件映射。阅读时先抓 Ebara / Applied / 华海清科，再往下看周边平台和国产材料链。',
    updateNote: '你这批数据标题里写了“探针台”，但内容实际对应 CMP / 抛光赛道，我已经按 CMP 设备板块落地。统一财务卡也同步用了这版口径。',
    groups: [
      {
        title: 'A. 全球主线龙头',
        desc: '这一层是 CMP 赛道最值得优先研究的核心供给侧。Applied Materials 代表平台型前道龙头，Ebara 是全球 CMP 主线龙头之一，华海清科则是中国本土主机主线，三者共同构成了这个赛道最重要的观察框架。',
        companies: [
          {
            name: 'Applied Materials',
            market: 'us',
            cap: 'USD 255.31B',
            summary: '全球前道平台龙头，CMP 是其 Semiconductor Systems 中的重要一条产品线。',
            tags: ['CMP', 'front-end', 'platform', 'logic', 'memory'],
            note: '平台型公司；CMP 非独立收入口径。',
            segmentExposure: {
              role: '在 CMP 设备里属于全球主线龙头之一，但本质上仍是平台型前道设备公司，CMP 只是其中一条重要产品线。',
              revenueShare: { value: '未单独披露', note: '公司未按 CMP 单项拆分收入。' },
              profitShare: { value: '未单独披露', note: '利润随更大的半导体系统业务披露。' },
              source: '公司分部披露 / 产品线口径',
              badges: ['全球主线', '平台型'],
              note: '这类公司后续建议补“CMP 在半导体系统中的权重”而不是直接拿公司总收入替代 CMP 收入。'
            }
          },
          {
            name: 'Ebara（荏原）',
            market: 'jp',
            cap: 'USD 14.74B',
            summary: '全球 CMP 主线龙头之一，覆盖 CMP、bevel polishing、plating 等完整量产平台。',
            tags: ['CMP', '300mm', 'bevel', 'plating', 'japan'],
            note: '非纯 CMP；市值以母公司整体计，CMP 敞口位于半导体制造设备相关业务。',
            segmentExposure: {
              role: '在 CMP 设备里是全球最关键主线之一，但上市公司主体仍覆盖泵、环境工程等更广业务，不能直接把母公司口径视为 CMP pure-play。',
              revenueShare: { value: '待补', note: '建议后续补“半导体系统 / CMP 相关收入占母公司比例”的拆分口径。' },
              profitShare: { value: '待补', note: '未见按 CMP 单独披露利润。' },
              source: '母公司财务 + 半导体制造设备业务口径',
              badges: ['全球主线', '母公司口径']
            }
          },
          {
            name: '华海清科',
            market: 'cn',
            cap: 'RMB 61.40B',
            summary: '中国 CMP 整机龙头，已从单一 CMP 扩展到平台化半导体装备。',
            tags: ['CMP', 'china', 'domestic-substitution', 'platform', 'front-end'],
            note: '中国本土主线；但已扩至减薄、离子注入、湿法等，非纯 CMP-only 叙事。',
            segmentExposure: {
              role: '在 CMP 设备里是 A 股最直接的整机主线，但公司已经从单一 CMP 走向平台化，后续需要持续跟踪 CMP 在总盘子里的占比变化。',
              revenueShare: { value: '待补', note: '建议后续补“CMP 主设备 / 耗材 / 新平台”三层收入拆分。' },
              profitShare: { value: '待补', note: '利润贡献尚需结合业务拆分估算。' },
              source: '公司主业结构 / 研究口径',
              badges: ['A股主线', '平台化中']
            }
          }
        ]
      },
      {
        title: 'B. 正式产品线玩家',
        desc: '这组公司在 CMP 上是“正式参与者”，但整体业务更偏广义 semicap、量测或精密设备平台。东京精密是其中最值得跟踪的名字，既有官方 CMP 产品线，也保留了更多跨板块设备属性。',
        companies: [
          {
            name: '东京精密',
            market: 'jp',
            cap: 'USD 4.01B',
            summary: '日本精密设备厂商，拥有正式 CMP 产品线，但整体更偏 broader semicap / metrology。',
            tags: ['CMP', 'semicap', 'metrology', 'compact', 'japan'],
            note: '业务重要但非纯 CMP；公司收入包含更广泛设备与测量业务。',
            segmentExposure: {
              role: '在 CMP 环节属于“正式产品线玩家”，有真实产品布局，但研究时更应把它当作广义 semicap / metrology 平台来读。',
              revenueShare: { value: '未单独披露', note: 'CMP 产品线未单独成为上市公司主表收入项目。' },
              profitShare: { value: '未单独披露', note: '利润同样未按 CMP 单独披露。' },
              source: '公司业务口径',
              badges: ['正式产品线', '非纯CMP']
            }
          }
        ]
      },
      {
        title: 'C. 区域型挑战者',
        desc: 'KC Tech 代表韩国区域型 CMP 设备玩家，虽然全球份额不在一线寡头之列，但兼具 slurry / wet cleaning 组合，在区域客户和订单节奏上有一定跟踪价值。',
        companies: [
          {
            name: 'KC Tech',
            market: 'kr',
            cap: 'USD 0.69B',
            summary: '韩国区域型 CMP 设备玩家，兼有 slurry / wet cleaning 组合。',
            tags: ['CMP', 'slurry', 'wet-cleaning', 'korea', 'regional'],
            note: '非纯 CMP；业务同时覆盖材料与清洗，全球份额并非主线寡头。'
          }
        ]
      },
      {
        title: 'D. A股材料与零部件映射',
        desc: 'A 股在 CMP 赛道里更适合从材料和关键零部件映射去看。安集科技和鼎龙股份分别对应 slurry、post-CMP clean 与抛光垫主线，富创精密则更适合作为整机关键零部件平台的下游映射。',
        companies: [
          {
            name: '安集科技',
            market: 'cn',
            cap: 'RMB 47.02B',
            summary: '中国 CMP slurry 与 post-CMP clean 核心材料龙头。',
            tags: ['CMP-slurry', 'post-CMP-clean', 'materials', 'china', 'advanced-nodes'],
            note: '非整机；用于 CMP 板块关键材料映射。'
          },
          {
            name: '鼎龙股份',
            market: 'cn',
            cap: 'RMB 50.31B',
            summary: 'A 股 CMP 抛光垫主线，同时覆盖 slurry / cleaner 等半导体材料。',
            tags: ['CMP-pad', 'slurry', 'cleaner', 'materials', 'china'],
            note: '非整机；平台型材料公司，CMP 仅为其半导体材料板块一部分。'
          },
          {
            name: '富创精密',
            market: 'cn',
            cap: 'RMB 27.88B',
            summary: '半导体设备精密部件 / 模组平台，适合作为 CMP 整机关键零部件映射。',
            tags: ['precision-modules', 'semicap-components', 'china', 'non-pure', 'supply-chain'],
            note: '非纯 CMP；并非整机厂，CMP 为下游半导体设备客户映射。'
          }
        ]
      }
    ]
  }
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/ion-implant.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'ion-implant',
  name: '离子注入设备',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  summary: '标准寡头市场，Axcelis 是很典型的纯方向资产。',
  market: { v2024: 2.8, v2025: 3.1, basis: 'B', note: '相对成熟但高进入门槛，按implant细分市场估算。' },
  companies: [['Applied Materials', 'us'], ['Axcelis', 'us'], ['Sumitomo Heavy Industries', 'jp'], ['Nissin Electric', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/metrology-inspection.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'metrology-inspection',
  name: '量测 / 缺陷检测',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  summary: '与光刻、刻蚀一起决定先进制程能否顺利爬坡。',
  market: { v2024: 12.5, v2025: 14.4, basis: 'B', note: 'process control在先进节点权重提升，检测/量测投入弹性高。' },
  companies: [['KLA', 'us'], ['Hitachi High-Tech', 'jp'], ['Lasertec', 'jp'], ['Onto Innovation', 'us'], ['Camtek', 'us']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/ate.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'ate',
  name: 'ATE 测试设备',
  section: '设备',
  flowTo: ['测试 / 出货'],
  summary: 'AI / HBM / HPC 周期里价值抬升明显，双寡头属性突出。',
  market: { v2024: 7.8, v2025: 8.4, basis: 'A', note: '参考ATE公开市场规模，AI/HBM带来高端测试机需求上行。' },
  companies: [['Advantest', 'jp'], ['Teradyne', 'us'], ['Cohu', 'us'], ['Chroma ATE（致茂）', 'tw'], ['东京精密', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/probers-handlers.js

```
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

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/subsegments/equipment/advanced-packaging-equipment.js

```
import { createSimpleSubsegment } from '../../../lib/create-subsegment.js';

export default createSimpleSubsegment({
  slug: 'advanced-packaging-equipment',
  name: '先进封装设备（键合 / 塑封 / 切磨）',
  section: '设备',
  flowTo: ['先进封装'],
  summary: 'AI 周期中常常比前道设备更早体现弹性。',
  market: { v2024: 6.0, v2025: 8.2, basis: 'B', note: 'AI/HBM推动bonder、molder、dicing/grinding设备扩容，弹性更高。' },
  companies: [['ASMPT', 'hk'], ['Kulicke & Soffa', 'us'], ['Hanmi Semiconductor', 'kr'], ['TOWA', 'jp'], ['DISCO', 'jp']]
});

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/market-data.js

```
export const marketMap = {
  us: '美股',
  jp: '日股',
  cn: 'A股',
  kr: '韩股',
  hk: '港股',
  tw: '台股',
  eu: '欧股',
  uk: '英股'
};

export const sectionMarketData = {
  '工程 / 厂务': {
    v2024: 37.64,
    v2025: 40.68,
    yoy: 8.1,
    scope: '半导体 plant construction / fab facilities',
    note: '涵盖半导体建厂与厂务设施相关投入，用作网页中的工程/厂务代理口径。'
  },
  '材料': {
    v2024: 67.5,
    v2025: 72.03,
    yoy: 6.7,
    scope: '全球半导体材料市场',
    note: '2024 为 SEMI 实际值；2025 采用公开市场研究的行业规模估计。'
  },
  '设备': {
    v2024: 117.1,
    v2025: 135.1,
    yoy: 15.4,
    scope: '全球半导体制造设备 billings',
    note: '采用 SEMI WWSEMS 公开口径，2025 为最新公开实际值。'
  }
};

export const marketCards = [
  { key: '工程 / 厂务', title: '工程 / 厂务', tone: 'facilities', english: 'Fab Build' },
  { key: '材料', title: '材料', tone: 'materials', english: 'Materials' },
  { key: '设备', title: '设备', tone: 'equipment', english: 'Equipment' }
];

```


## Existing authored data: public/research-topics/semiconductor-upstream/data/runtime-records.js

```
const SUBSEGMENT_RECORDS_URL = '/data/semiconductor-upstream-subsegments.jsonl';
const EXPOSURE_RECORDS_URL = '/data/semiconductor-upstream-company-exposures.jsonl';

let runtimeRecordsPromise;

async function loadJsonl(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load JSONL records: ${url} ${response.status}`);
  }

  const text = await response.text();

  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function buildSubsegmentIndex(records) {
  return new Map(records.map((record) => [record.subsegmentSlug, record]));
}

function buildExposureIndex(records) {
  const index = new Map();

  records.forEach((record) => {
    const next = index.get(record.subsegmentSlug) || [];
    next.push(record);
    index.set(record.subsegmentSlug, next);
  });

  return index;
}

function buildGroupsFromExposureRecords(records) {
  const groups = new Map();

  records.forEach((record) => {
    const key = `${record.groupTitle}:::${record.groupDesc || ''}`;
    const currentGroup = groups.get(key) || {
      title: record.groupTitle,
      desc: record.groupDesc || '',
      companies: [],
    };

    currentGroup.companies.push({
      name: record.companyName,
      market: record.market,
      cap: record.cap,
      summary: record.summary,
      tags: record.tags || [],
      note: record.note || '',
      segmentExposure: record.segmentExposure || null,
    });

    groups.set(key, currentGroup);
  });

  return [...groups.values()];
}

function normalizeCompanyKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[（(].*?[)）]/g, '')
    .replace(/[\/&·.,:：\-\s]/g, '');
}

function buildExposureLookup(records) {
  const lookup = new Map();

  records.forEach((record) => {
    lookup.set(normalizeCompanyKey(record.companyName), record);
  });

  return lookup;
}

function mergeCompanyWithExposure(baseCompany, exposureRecord) {
  if (!exposureRecord) {
    return baseCompany;
  }

  return {
    ...baseCompany,
    market: exposureRecord.market || baseCompany.market,
    cap: exposureRecord.cap || baseCompany.cap,
    summary: exposureRecord.summary || baseCompany.summary,
    tags: exposureRecord.tags?.length ? exposureRecord.tags : (baseCompany.tags || []),
    note: exposureRecord.note || baseCompany.note,
    segmentExposure: exposureRecord.segmentExposure || baseCompany.segmentExposure || null,
  };
}

function mergeGroups(baseGroups, exposureRecords) {
  const hasBaseGroups = Array.isArray(baseGroups) && baseGroups.length > 0;
  const hasExposureRecords = Array.isArray(exposureRecords) && exposureRecords.length > 0;

  if (!hasExposureRecords) {
    return hasBaseGroups ? baseGroups : [];
  }

  if (!hasBaseGroups) {
    return buildGroupsFromExposureRecords(exposureRecords);
  }

  const exposureLookup = buildExposureLookup(exposureRecords);
  const matchedKeys = new Set();

  const mergedBaseGroups = baseGroups.map((group) => ({
    ...group,
    companies: (group.companies || []).map((company) => {
      const key = normalizeCompanyKey(company.name);
      const matchedRecord = exposureLookup.get(key);

      if (matchedRecord) {
        matchedKeys.add(key);
      }

      return mergeCompanyWithExposure(company, matchedRecord);
    }),
  }));

  const unmatchedExposureRecords = exposureRecords.filter(
    (record) => !matchedKeys.has(normalizeCompanyKey(record.companyName))
  );

  if (!unmatchedExposureRecords.length) {
    return mergedBaseGroups;
  }

  return [
    ...mergedBaseGroups,
    ...buildGroupsFromExposureRecords(unmatchedExposureRecords),
  ];
}

function resolveRuntimeSnapshot(subsegmentRecord) {
  if (subsegmentRecord?.snapshot) {
    return subsegmentRecord.snapshot;
  }

  if (Array.isArray(subsegmentRecord?.market?.metrics)) {
    return subsegmentRecord.market;
  }

  return null;
}

function resolveRuntimeMarket(baseItem, subsegmentRecord) {
  if (subsegmentRecord?.market?.v2024 !== undefined && subsegmentRecord?.market?.v2025 !== undefined) {
    return subsegmentRecord.market;
  }

  return baseItem.market;
}

function mergeSubsegment(baseItem, subsegmentRecord, exposureRecords) {
  const runtimeSnapshot = resolveRuntimeSnapshot(subsegmentRecord);

  return {
    ...baseItem,
    name: subsegmentRecord?.subsegmentName || baseItem.name,
    flowTo: subsegmentRecord?.flowTo || baseItem.flowTo,
    summary: subsegmentRecord?.summary || baseItem.summary,
    market: resolveRuntimeMarket(baseItem, subsegmentRecord),
    snapshot: runtimeSnapshot || baseItem.snapshot,
    detail: {
      ...baseItem.detail,
      title: subsegmentRecord?.research?.title || baseItem.detail?.title,
      intro: subsegmentRecord?.research?.intro || baseItem.detail?.intro,
      sections: subsegmentRecord?.research?.sections || baseItem.detail?.sections || [],
      updateNote: subsegmentRecord?.research?.updateNote || baseItem.detail?.updateNote,
      badges: subsegmentRecord?.research?.badges || baseItem.detail?.badges || [],
      groups: mergeGroups(baseItem.detail?.groups || [], exposureRecords),
    },
  };
}

export async function loadSemiconductorRuntimeRecords() {
  if (!runtimeRecordsPromise) {
    runtimeRecordsPromise = Promise.all([
      loadJsonl(SUBSEGMENT_RECORDS_URL),
      loadJsonl(EXPOSURE_RECORDS_URL),
    ]).then(([subsegments, exposures]) => ({
      subsegments,
      exposures,
      subsegmentIndex: buildSubsegmentIndex(subsegments),
      exposureIndex: buildExposureIndex(exposures),
    }));
  }

  return runtimeRecordsPromise;
}

export function mergeSectionsWithRuntimeRecords(baseSections, runtimeRecords) {
  return baseSections.map((section) => ({
    ...section,
    items: section.items.map((item) => mergeSubsegment(
      item,
      runtimeRecords.subsegmentIndex.get(item.slug),
      runtimeRecords.exposureIndex.get(item.slug)
    )),
  }));
}

```


## Existing authored data: public/research-topics/shared/company-financials.js

```
export const COMPANY_FINANCIALS_URL = '/data/company-financials.jsonl';

let recordsPromise;

export function normalizeCompanyKey(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '');
}

export async function loadCompanyFinancialRecords(url = COMPANY_FINANCIALS_URL) {
  if (!recordsPromise) {
    recordsPromise = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load company financial records: ${response.status}`);
        }

        return response.text();
      })
      .then((text) => text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line)));
  }

  return recordsPromise;
}

export function filterCompanyFinancialRecords(records, filters = {}) {
  const { reportSlug, topic, datasetKind } = filters;

  return records.filter((record) => {
    if (reportSlug && !record.reportSlugs?.includes(reportSlug)) {
      return false;
    }

    if (topic && !record.topics?.includes(topic)) {
      return false;
    }

    if (datasetKind && record.finance?.datasetKind !== datasetKind) {
      return false;
    }

    return true;
  });
}

export function createCompanyFinanceIndex(records, filters = {}) {
  const index = new Map();

  filterCompanyFinancialRecords(records, filters).forEach((record) => {
    const keys = [record.companyName, ...(record.aliases || [])];

    keys.forEach((key) => {
      const normalized = normalizeCompanyKey(key);

      if (normalized) {
        index.set(normalized, record);
      }
    });
  });

  return index;
}

export function getCompanyFinanceRecord(index, companyName) {
  return index.get(normalizeCompanyKey(companyName)) || null;
}

export function getFinancePeriodLabels(record) {
  const periods = record?.finance?.periods;

  if (Array.isArray(periods) && periods.length > 0) {
    return periods;
  }

  return String(record?.finance?.periodLabel ?? '')
    .split('/')
    .map((label) => label.trim())
    .filter(Boolean);
}

```


## Existing authored data: public/research-topics/shared/company-card-snippet.js

```
import { getFinancePeriodLabels } from './company-financials.js';

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function calcPct(a, b) {
  if (!isFiniteNumber(a) || !isFiniteNumber(b) || a === 0) {
    return null;
  }

  return ((b - a) / a) * 100;
}

function formatNumber(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  let maxDigits = 2;

  if (Math.abs(value - Math.round(value)) < 0.005) {
    maxDigits = 0;
  } else if (Math.abs(value * 10 - Math.round(value * 10)) < 0.05) {
    maxDigits = 1;
  }

  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDigits,
  });
}

function formatPercent(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatMultiple(value) {
  if (!isFiniteNumber(value)) {
    return '待补';
  }

  return `${value.toFixed(1)}x`;
}

function compactPeriodLabel(label) {
  const trimmed = String(label ?? '').trim();
  const match = trimmed.match(/(?:FY)?(\d{2,4})([A-Z])?/i);

  if (!match) {
    return trimmed;
  }

  const year = match[1].slice(-2);
  const suffix = match[2] ? match[2].toUpperCase() : '';
  const remainder = trimmed.slice(match.index + match[0].length).trim();

  return remainder ? `${year}${suffix} ${remainder}` : `${year}${suffix}`;
}

function renderPairRows(entries) {
  return entries.map((entry) => `
    <div class="finance-pair-row">
      <span class="finance-pair-label">${entry.label}</span>
      <span class="finance-pair-value">${entry.value}</span>
    </div>
  `).join('');
}

function renderSeriesRows(labels, values, displayValues, fillClass = '') {
  const numericValues = values.map((value) => (isFiniteNumber(value) ? Math.abs(value) : 0));
  const maxValue = Math.max(...numericValues, 0) || 1;

  return labels.map((label, index) => `
    <div class="finance-series-row">
      <span class="finance-series-label">${label}</span>
      <div class="finance-series-track">
        <div
          class="finance-series-fill ${fillClass}"
          style="width:${((isFiniteNumber(values[index]) ? Math.abs(values[index]) : 0) / maxValue) * 100}%;"
        ></div>
      </div>
      <span class="finance-series-value">${displayValues[index]}</span>
    </div>
  `).join('');
}

function buildDisplaySeries(record, key, formatter) {
  const rawSeries = record?.finance?.series?.[key] || [];
  const displaySeries = record?.finance?.display?.[key];

  return rawSeries.map((value, index) => displaySeries?.[index] || formatter(value));
}

function buildMarginSeries(record) {
  const revenue = record?.finance?.series?.revenue || [];
  const profit = record?.finance?.series?.netProfit || [];
  const explicitMargins = record?.finance?.series?.grossMargin || [];

  if (explicitMargins.some((value) => isFiniteNumber(value))) {
    return explicitMargins;
  }

  return revenue.map((value, index) => (
    isFiniteNumber(value) && value !== 0 && isFiniteNumber(profit[index])
      ? (profit[index] / value) * 100
      : null
  ));
}

function buildGrowthChips(labels, revenue) {
  const chips = [];

  for (let index = 1; index < revenue.length; index += 1) {
    const growth = calcPct(revenue[index - 1], revenue[index]);

    if (growth !== null) {
      chips.push(`${labels[index - 1]}→${labels[index]} 营收 ${formatPercent(growth)}`);
    }
  }

  return chips.slice(0, 3);
}

function renderFinanceBlock(record) {
  if (!record?.finance) {
    return '';
  }

  const periodLabels = getFinancePeriodLabels(record);
  const compactLabels = periodLabels.map(compactPeriodLabel);
  const revenue = record.finance.series?.revenue || [];
  const netProfit = record.finance.series?.netProfit || [];
  const margin = buildMarginSeries(record);
  const forwardPE = record.finance.series?.forwardPE || [];

  const revenueDisplay = buildDisplaySeries(record, 'revenue', formatNumber);
  const profitDisplay = buildDisplaySeries(record, 'netProfit', formatNumber);
  const marginDisplay = buildDisplaySeries(
    {
      finance: {
        series: { grossMargin: margin },
        display: record.finance.display,
      },
    },
    'grossMargin',
    formatPercent
  );
  const peDisplay = buildDisplaySeries(record, 'forwardPE', formatMultiple);
  const growthChips = buildGrowthChips(compactLabels, revenue);

  return `
    <div class="company-finance">
      <div class="finance-topline">
        <span class="finance-chip">${record.finance.periodLabel}</span>
        <span class="finance-chip soft">单位 ${record.finance.unit}</span>
        ${growthChips.map((chip) => `<span class="finance-chip">${chip}</span>`).join('')}
      </div>
      <div class="finance-panel-grid">
        <section class="finance-series-card">
          <div class="finance-series-head">
            <strong>营收趋势</strong>
            <span>${record.finance.unit}</span>
          </div>
          <div class="finance-series-chart">
            ${renderSeriesRows(compactLabels, revenue, revenueDisplay)}
          </div>
        </section>
        <section class="finance-series-card">
          <div class="finance-series-head">
            <strong>净利润趋势</strong>
            <span>${record.finance.unit}</span>
          </div>
          <div class="finance-series-chart">
            ${renderSeriesRows(compactLabels, netProfit, profitDisplay, 'profit')}
          </div>
        </section>
      </div>
      <div class="finance-summary-grid">
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>营收</strong><span>${record.finance.unit}</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: revenueDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">统一走共享 jsonl 数据源，方便跨报告引用。</span>
        </section>
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>净利润</strong><span>${record.finance.unit}</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: profitDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">不同页面都可复用同一企业财务快照。</span>
        </section>
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>净利率 / 毛利率</strong><span>Margin</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: marginDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">优先展示显式毛利率，否则回退到净利率近似。</span>
        </section>
        <section class="finance-summary-card">
          <div class="finance-summary-head"><strong>估值</strong><span>Forward PE</span></div>
          <div class="finance-pair-list">${renderPairRows(compactLabels.map((label, index) => ({ label, value: peDisplay[index] || '待补' })))}</div>
          <span class="finance-pair-sub">${record.finance.flags?.pe26Approx ? '末期估值含近似口径，请结合注释阅读。' : '按当前记录的公开估值口径展示。'}</span>
        </section>
      </div>
      <div class="finance-note">${record.finance.note || '暂无补充说明。'}</div>
    </div>
  `;
}

function renderSegmentExposure(company) {
  const exposure = company.segmentExposure;

  if (!exposure) {
    return '';
  }

  return `
    <section class="company-exposure">
      <div class="company-exposure-head">
        <strong>${exposure.title}</strong>
        ${exposure.source ? `<span>${exposure.source}</span>` : ''}
      </div>
      ${exposure.badges?.length ? `
        <div class="company-exposure-badges">
          ${exposure.badges.map((badge) => `<span class="finance-chip soft">${badge}</span>`).join('')}
        </div>
      ` : ''}
      <div class="company-exposure-role">${exposure.role}</div>
      <div class="company-exposure-grid">
        <article class="company-exposure-card">
          <span class="company-exposure-label">${exposure.revenueShare.label}</span>
          <strong class="company-exposure-value">${exposure.revenueShare.value}</strong>
          ${exposure.revenueShare.note ? `<span class="company-exposure-note">${exposure.revenueShare.note}</span>` : ''}
        </article>
        <article class="company-exposure-card">
          <span class="company-exposure-label">${exposure.profitShare.label}</span>
          <strong class="company-exposure-value">${exposure.profitShare.value}</strong>
          ${exposure.profitShare.note ? `<span class="company-exposure-note">${exposure.profitShare.note}</span>` : ''}
        </article>
      </div>
      ${exposure.note ? `<div class="company-exposure-foot">${exposure.note}</div>` : ''}
    </section>
  `;
}

export function renderCompanyCardSnippet({ company, financeRecord, marketLabel }) {
  const tags = company.tags?.length
    ? `<div class="deep-tags">${company.tags.map((tag) => `<span class="deep-tag">${tag}</span>`).join('')}</div>`
    : '';

  return `
    <article class="deep-company-card market-${company.market}" data-market="${company.market}">
      <div class="deep-card-top">
        <div>
          <div class="deep-name">${company.name}</div>
          <div class="deep-sub">${marketLabel || ''}</div>
        </div>
        ${company.cap ? `<span class="cap-pill">${company.cap}</span>` : ''}
      </div>
      ${company.summary ? `<div class="deep-summary">${company.summary}</div>` : ''}
      ${tags}
      ${company.note ? `<div class="deep-note">${company.note}</div>` : ''}
      ${renderSegmentExposure(company)}
      ${renderFinanceBlock(financeRecord)}
    </article>
  `;
}

```


## Existing data files

- https://reports.instap.net/data/company-financials.jsonl
- https://reports.instap.net/data/semiconductor-upstream-company-exposures.jsonl
- https://reports.instap.net/data/semiconductor-upstream-subsegments.jsonl
- https://reports.instap.net/research-topics/semiconductor-upstream.html
- https://reports.instap.net/research-topics/semiconductor-upstream/README.md
- https://reports.instap.net/research-topics/semiconductor-upstream/data/company-finance.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/market-data.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/runtime-records.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/sections.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/advanced-packaging-equipment.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/ate.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/cleaning-equipment.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/cmp-equipment.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/deposition-equipment.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/etch-equipment.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/index.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/ion-implant.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/lithography-scanners.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/metrology-inspection.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/probers-handlers.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/equipment/track-systems.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/facilities/cleanroom-epc.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/facilities/exhaust-vacuum.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/facilities/gas-chemical-delivery.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/facilities/index.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/facilities/rf-power-matching.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/facilities/upw-systems.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/abf-substrates.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/advanced-packaging-polymers.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/bonding-wires.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/bt-substrates.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/ceramic-fillers.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/cmp-materials.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/die-attach-materials.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/electronic-gases.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/index.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/interconnect-solders.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/leadframes.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/lithography-ancillaries.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/material-subsegment.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/molding-compounds.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/photomasks.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/photoresist.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/plating-chemicals.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/rdl-dielectrics.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/silicon-wafers.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/solder-powders-alloys.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/spherical-silica.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/sputtering-targets.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/temporary-bonding.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/underfill-muf.js
- https://reports.instap.net/research-topics/semiconductor-upstream/data/subsegments/materials/wet-chemicals.js
- https://reports.instap.net/research-topics/semiconductor-upstream/index.html
