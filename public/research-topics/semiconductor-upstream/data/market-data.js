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
