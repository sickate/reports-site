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
