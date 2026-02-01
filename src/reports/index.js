export const reports = [
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
