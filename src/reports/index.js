export const reports = [
  {
    slug: '2026-02-zijin-mining',
    title: '紫金矿业深度分析',
    description: '紫金矿业 (2899.HK / 601899.SS) 投研分析：全球铜金龙头，AI时代的"新石油"供应商，央行购金浪潮的核心受益者。',
    date: '2026-02-03',
    type: 'visualization',
    tags: ['投资分析', 'Mining', 'Commodities', '铜', '黄金'],
    component: () => import('./2026-02-zijin-mining/index.jsx'),
  },
  {
    slug: '2025-01-enigma-of-reason',
    title: 'The Enigma of Reason',
    description: 'Interactive book report on "The Enigma of Reason" by Hugo Mercier & Dan Sperber — exploring the argumentative theory of reasoning.',
    date: '2025-02-01',
    type: 'visualization',
    tags: ['Cognitive Science', 'Psychology', 'Book Report'],
    component: () => import('./2025-01-enigma-of-reason/index.jsx'),
  },
  {
    slug: '2025-01-metals',
    title: 'Metals Commodity Prices (1975-2025)',
    description: '50-year historical data analysis of 8 major metals including gold, silver, copper, and more.',
    date: '2025-01-22',
    type: 'visualization',
    tags: ['Commodities', 'Metals', 'Data Visualization'],
    component: () => import('./2025-01-metals/index.jsx'),
  },
];
