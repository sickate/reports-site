// Colour tokens. Status colours are paired with distinct shapes in the legend so the
// encoding survives colour-vision deficiency (see Phase 7).

export const colorMap = {
  Operating: '#4ade80',
  'Ramp-up': '#f59e0b',
  Construction: '#a78bfa',
  Development: '#22d3ee',
  'On hold / stalled': '#fb7185',
  Cluster: '#94a3b8',
  // Warm stone, deliberately distinct from Cluster's cool slate: these two are
  // the only muted swatches, so sharing a hex made them indistinguishable on the map.
  Other: '#a8a29e',
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
