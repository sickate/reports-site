// The 7 views that replace the single ~14,000px scroll.
//
// Sections stay in the DOM and are toggled with `display:none` rather than being
// mounted/unmounted: the content is static markup that the existing renderers already
// fill, so a mount/teardown lifecycle would buy nothing and risk losing scroll//state.
// `display:none` is what actually collapses the page height, which is the point.
//
// The cost of display:none is Leaflet: a map sized inside a hidden container renders grey
// tiles. `onEnter` exists for exactly that (see app.js) — it is not a general lifecycle.

export const VIEWS = [
  {
    id: 'cockpit',
    label: '市场状态',
    hint: '当前观点、置信度、关键发现与风险',
    sections: [
      'statsSection', 'findingsSection', 'keyMetricsSection',
      'changelogSection', 'researchUpdatesSection',
    ],
  },
  {
    id: 'supply',
    label: '未来供给',
    hint: '投产节奏与产能兑现',
    sections: ['supplySection'],
  },
  {
    id: 'cost',
    label: '成本与价格',
    hint: '成本曲线与价格敏感性',
    sections: ['costSection'],
  },
  {
    id: 'equities',
    label: '权益标的',
    hint: '公司盈利、估值与投资排序',
    sections: ['companyResearchSection'],
  },
  {
    id: 'atlas',
    label: '地图与项目库',
    hint: '44 个项目的空间分布与明细',
    sections: ['projectMapSection', 'projectDatabaseSection'],
  },
  {
    id: 'catalysts',
    label: '催化剂与预警',
    hint: '许可、投产、政策与物流事件',
    sections: ['catalystsSection'],
  },
  {
    id: 'method',
    label: '方法与来源',
    hint: '口径、换算与数据缺口登记',
    sections: ['methodologySection', 'gapRegisterSection'],
  },
];

export const DEFAULT_VIEW = 'cockpit';

export const VIEW_IDS = VIEWS.map((v) => v.id);

export function isValidView(id) {
  return VIEW_IDS.includes(id);
}
