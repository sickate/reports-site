// Colour tokens. Status colours are paired with distinct shapes in the legend so the
// encoding survives colour-vision deficiency (see Phase 7).

// Keyed by the legend buckets in schema.js `statusLegendItems`. The former 'Cluster' and
// 'Other' swatches are gone: cluster-ness became its own axis (`structure`, rendered as a
// table badge and its own filter), and 'Other' was a fallback bucket that can no longer
// occur now that the lifecycle enum is closed.
export const colorMap = {
  Operating: '#4ade80',
  'Ramp-up': '#f59e0b',
  Construction: '#a78bfa',
  Development: '#22d3ee',
  'On hold / stalled': '#fb7185',
  'Resource stage': '#94a3b8',
};

export const countryPillColors = {
  Australia: '#38bdf8',
  Chile: '#fb923c',
  Argentina: '#34d399',
  Brazil: '#f59e0b',
  Canada: '#a78bfa',
  Mali: '#f87171',
  Zimbabwe: '#fb7185',
  DRC: '#f97316',
  Ghana: '#2dd4bf',
  USA: '#60a5fa',
  Serbia: '#c084fc',
  'Czech Republic': '#818cf8',
  Finland: '#22c55e',
  Portugal: '#14b8a6',
  Mexico: '#ef4444',
  China: '#f43f5e',
  Bolivia: '#94a3b8',
};
