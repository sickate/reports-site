import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar, ReferenceArea } from 'recharts';

const cycleAnnotations = [
  { start: 1979, end: 1980, label: 'Post Oil Crisis Inflation Peak', color: '#ff6b6b' },
  { start: 1987, end: 1989, label: 'East Asia Industrialization', color: '#4ecdc4' },
  { start: 2003, end: 2008, label: 'China Super Cycle', color: '#45b7d1' },
  { start: 2009, end: 2011, label: 'QE Era Rebound', color: '#96ceb4' },
  { start: 2020, end: 2025, label: 'New Energy + De-dollarization', color: '#dda15e' },
];

// Metal display order and colors
const METAL_CONFIG = {
  gold: { name: 'Gold', color: '#FFD700' },
  silver: { name: 'Silver', color: '#C0C0C0' },
  copper: { name: 'Copper', color: '#B87333' },
  aluminum: { name: 'Aluminum', color: '#848789' },
  iron: { name: 'Iron', color: '#8B4513' },
  nickel: { name: 'Nickel', color: '#727472' },
  cobalt: { name: 'Cobalt', color: '#0047AB' },
  zinc: { name: 'Zinc', color: '#7CB9E8' },
  tin: { name: 'Tin', color: '#8B8589' },
  tungsten: { name: 'Tungsten', color: '#e74c3c' },
  molybdenum: { name: 'Molybdenum', color: '#4A4A4A' },
  lithium: { name: 'Lithium', color: '#9b59b6' },
  titanium: { name: 'Titanium', color: '#1abc9c' },
};

const METAL_ORDER = ['gold', 'silver', 'copper', 'aluminum', 'iron', 'nickel', 'cobalt', 'zinc', 'tin', 'tungsten', 'molybdenum', 'lithium', 'titanium'];

const MetalsDashboard = () => {
  const [timeRange, setTimeRange] = useState('50');
  const [useLogScale, setUseLogScale] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch price data on mount
  useEffect(() => {
    // Cache bust: new URL every hour to get fresh data
    const cacheBuster = Math.floor(Date.now() / 3600000);
    fetch(`/data/metals-prices.json?v=${cacheBuster}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load price data');
        return res.json();
      })
      .then(data => {
        setPriceData(data.metals);
        setLastUpdated(data.lastUpdated);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Build metals array from fetched data
  const metals = useMemo(() => {
    if (!priceData) return [];
    return METAL_ORDER.filter(id => priceData[id]).map(id => ({
      id,
      name: METAL_CONFIG[id]?.name || priceData[id].name,
      data: priceData[id].data,
      color: METAL_CONFIG[id]?.color || priceData[id].color,
      unit: priceData[id].unit,
    }));
  }, [priceData]);

  const [selectedMetals, setSelectedMetals] = useState(METAL_ORDER);

  // Update selectedMetals when metals data loads
  useEffect(() => {
    if (metals.length > 0) {
      setSelectedMetals(metals.map(m => m.id));
    }
  }, [metals]);

  const toggleMetal = (metalId) => {
    setSelectedMetals(prev =>
      prev.includes(metalId)
        ? prev.filter(id => id !== metalId)
        : [...prev, metalId]
    );
  };

  const selectAll = () => setSelectedMetals(metals.map(m => m.id));
  const deselectAll = () => setSelectedMetals([]);

  const filterByTimeRange = (data) => {
    const currentYear = 2026;
    const startYear = currentYear - parseInt(timeRange);
    return data.filter(d => d.year >= startYear);
  };

  // Calculate normalized data first (needs to be before yAxisDomain)
  const normalizedData = useMemo(() => {
    if (metals.length === 0) return [];
    const goldMetal = metals.find(m => m.id === 'gold');
    if (!goldMetal) return [];

    return goldMetal.data.map((_, index) => {
      const entry = { year: goldMetal.data[index].year };
      metals.forEach(metal => {
        const basePrice = metal.data[0].price;
        entry[metal.id] = parseFloat(((metal.data[index].price / basePrice) * 100).toFixed(1));
      });
      return entry;
    });
  }, [metals]);

  // Dynamic Y-axis domain based on selected metals and time range
  const yAxisDomain = useMemo(() => {
    if (selectedMetals.length === 0) return [0, 100];

    const currentYear = 2026;
    const startYear = currentYear - parseInt(timeRange);
    const filteredData = normalizedData.filter(d => d.year >= startYear);

    let min = Infinity;
    let max = -Infinity;

    filteredData.forEach(entry => {
      selectedMetals.forEach(metalId => {
        const value = entry[metalId];
        if (value !== undefined && !isNaN(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
    });

    if (min === Infinity || max === -Infinity) return [0, 100];

    // Add 10% padding for better visualization
    const padding = (max - min) * 0.1;
    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [selectedMetals, timeRange, normalizedData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <p style={{ color: '#94a3b8', marginBottom: '8px', fontWeight: '600' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0', fontSize: '13px' }}>
              {entry.name}: {entry.value.toLocaleString()} {entry.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#e2e8f0',
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Loading price data...</div>
          <div style={{ color: '#94a3b8' }}>Fetching historical metal prices</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#e2e8f0',
        fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#ef4444', marginBottom: '16px' }}>Error loading data</div>
          <div style={{ color: '#94a3b8' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e2e8f0',
      fontFamily: "'IBM Plex Sans', -apple-system, sans-serif",
      padding: '24px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(90deg, #FFD700, #FFA500, #FF6347)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Metals Commodity Prices (1975-2026)
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          50+ Years of Historical Data - 13 Major Metals - Cycle Analysis
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={selectAll}
          style={{
            background: selectedMetals.length === metals.length ? 'rgba(34, 197, 94, 0.2)' : 'rgba(30, 41, 59, 0.8)',
            border: `1px solid ${selectedMetals.length === metals.length ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '6px',
            padding: '6px 12px',
            color: selectedMetals.length === metals.length ? '#22c55e' : '#94a3b8',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          All
        </button>
        <button
          onClick={deselectAll}
          style={{
            background: selectedMetals.length === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(30, 41, 59, 0.8)',
            border: `1px solid ${selectedMetals.length === 0 ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '6px',
            padding: '6px 12px',
            color: selectedMetals.length === 0 ? '#ef4444' : '#94a3b8',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          None
        </button>
        <span style={{ color: '#475569', margin: '0 4px' }}>|</span>
        {metals.map(metal => (
          <button
            key={metal.id}
            onClick={() => toggleMetal(metal.id)}
            style={{
              background: selectedMetals.includes(metal.id) ? `${metal.color}22` : 'rgba(30, 41, 59, 0.8)',
              border: `1px solid ${selectedMetals.includes(metal.id) ? metal.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '6px',
              padding: '6px 12px',
              color: selectedMetals.includes(metal.id) ? metal.color : '#64748b',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontWeight: selectedMetals.includes(metal.id) ? '600' : '400'
            }}
          >
            {metal.name}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '10px 20px',
            color: '#e2e8f0',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <option value="50">50 Years</option>
          <option value="30">30 Years</option>
          <option value="20">20 Years</option>
          <option value="10">10 Years</option>
          <option value="5">5 Years</option>
        </select>

        <button
          onClick={() => setUseLogScale(!useLogScale)}
          style={{
            background: useLogScale ? 'rgba(255, 215, 0, 0.2)' : 'rgba(30, 41, 59, 0.8)',
            border: `1px solid ${useLogScale ? '#FFD700' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '8px',
            padding: '10px 20px',
            color: useLogScale ? '#FFD700' : '#e2e8f0',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {useLogScale ? 'Log Scale' : 'Linear Scale'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {cycleAnnotations.map((cycle, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#94a3b8'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: cycle.color
            }} />
            <span>{cycle.start}-{cycle.end}: {cycle.label}</span>
          </div>
        ))}
      </div>

      {selectedMetals.length === 0 ? (
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '16px',
          padding: '48px',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Please select at least one metal to view the chart
          </p>
        </div>
      ) : selectedMetals.length === 1 ? (
        (() => {
          const metal = metals.find(m => m.id === selectedMetals[0]);
          const data = filterByTimeRange(metal.data);
          const currentPrice = data[data.length - 1].price;
          const startPrice = data[0].price;
          const totalReturn = ((currentPrice - startPrice) / startPrice * 100).toFixed(1);
          const maxPrice = Math.max(...data.map(d => d.price));
          const minPrice = Math.min(...data.map(d => d.price));

          return (
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', color: metal.color, margin: 0 }}>
                  {metal.name} Price Trend
                </h2>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current Price</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: metal.color }}>
                      {currentPrice.toLocaleString()} {metal.unit}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Return</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: totalReturn > 0 ? '#22c55e' : '#ef4444' }}>
                      {totalReturn > 0 ? '+' : ''}{totalReturn}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>All-Time High</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f1f5f9' }}>
                      {maxPrice.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>All-Time Low</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f1f5f9' }}>
                      {minPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={450}>
                <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id={`gradient-${metal.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metal.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={metal.color} stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => v.toLocaleString()} />
                  {cycleAnnotations.map((cycle, index) => (
                    <ReferenceArea
                      key={`cycle-${index}`}
                      x1={cycle.start}
                      x2={cycle.end}
                      fill={cycle.color}
                      fillOpacity={0.15}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} ${metal.unit}`, metal.name]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={metal.color}
                    strokeWidth={2.5}
                    fill={`url(#gradient-${metal.id})`}
                    activeDot={{ r: 6, stroke: metal.color, strokeWidth: 2, fill: '#0f172a' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          );
        })()
      ) : (
        <>
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#f1f5f9' }}>
              Normalized Returns (Base 1975 = 100) - {selectedMetals.length} Metals
            </h2>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={filterByTimeRange(normalizedData)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  scale={useLogScale ? 'log' : 'auto'}
                  domain={useLogScale
                    ? [Math.max(50, yAxisDomain[0]), yAxisDomain[1]]
                    : yAxisDomain
                  }
                  tickFormatter={(v) => `${Math.round(v)}%`}
                  allowDataOverflow={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {cycleAnnotations.map((cycle, index) => (
                  <ReferenceArea
                    key={`cycle-${index}`}
                    x1={cycle.start}
                    x2={cycle.end}
                    fill={cycle.color}
                    fillOpacity={0.15}
                  />
                ))}
                {metals.filter(m => selectedMetals.includes(m.id)).map(metal => (
                  <Line
                    key={metal.id}
                    type="monotone"
                    dataKey={metal.id}
                    name={metal.name}
                    stroke={metal.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '24px'
          }}>
            {(() => {
              const goldMetal = metals.find(m => m.id === 'gold');
              const silverMetal = metals.find(m => m.id === 'silver');
              if (!goldMetal || !silverMetal) return null;
              const preciousData = filterByTimeRange(goldMetal.data).map((g, i) => ({
                year: g.year,
                gold: g.price,
                silver: filterByTimeRange(silverMetal.data)[i]?.price
              }));
              return (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <h3 style={{ color: '#FFD700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Precious Metals (Gold & Silver)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={preciousData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                      <YAxis yAxisId="left" stroke="#FFD700" fontSize={11} />
                      <YAxis yAxisId="right" orientation="right" stroke="#C0C0C0" fontSize={11} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="gold" name="Gold" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="silver" name="Silver" stroke="#C0C0C0" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ color: '#B87333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Industrial Metals (Copper, Aluminum & Zinc)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filterByTimeRange(normalizedData)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${Math.round(v)}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="copper" name="Copper" stroke="#B87333" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="aluminum" name="Aluminum" stroke="#848789" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="zinc" name="Zinc" stroke="#7CB9E8" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ color: '#8B4513', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Ferrous Metals (Iron, Cobalt & Nickel)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filterByTimeRange(normalizedData)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${Math.round(v)}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="iron" name="Iron" stroke="#8B4513" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cobalt" name="Cobalt" stroke="#0047AB" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="nickel" name="Nickel" stroke="#727472" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ color: '#8B8589', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Rare Metals (Tin, Tungsten & Molybdenum)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filterByTimeRange(normalizedData)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${Math.round(v)}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="tin" name="Tin" stroke="#8B8589" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="tungsten" name="Tungsten" stroke="#e74c3c" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="molybdenum" name="Molybdenum" stroke="#4A4A4A" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {(() => {
              const lithiumMetal = metals.find(m => m.id === 'lithium');
              const titaniumMetal = metals.find(m => m.id === 'titanium');
              if (!lithiumMetal || !titaniumMetal) return null;
              const energyData = filterByTimeRange(lithiumMetal.data).map((l, i) => ({
                year: l.year,
                lithium: l.price,
                titanium: filterByTimeRange(titaniumMetal.data)[i]?.price
              }));
              return (
                <div style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <h3 style={{ color: '#9b59b6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    New Energy Metals (Lithium & Titanium)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={energyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                      <YAxis yAxisId="left" stroke="#9b59b6" fontSize={11} />
                      <YAxis yAxisId="right" orientation="right" stroke="#1abc9c" fontSize={11} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="lithium" name="Lithium" stroke="#9b59b6" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="titanium" name="Titanium" stroke="#1abc9c" strokeWidth={2} dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
          </div>
        </>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginTop: '32px'
      }}>
        {metals.map(metal => {
          const data = metal.data;
          const currentPrice = data[data.length - 1].price;
          const prevPrice = data[data.length - 2].price;
          const ytdReturn = ((currentPrice - prevPrice) / prevPrice * 100).toFixed(1);
          const totalReturn = ((currentPrice - data[0].price) / data[0].price * 100).toFixed(0);

          return (
            <div
              key={metal.id}
              onClick={() => toggleMetal(metal.id)}
              style={{
                background: selectedMetals.includes(metal.id) ? 'rgba(255,255,255,0.1)' : 'rgba(30, 41, 59, 0.5)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${selectedMetals.includes(metal.id) ? metal.color : 'rgba(255,255,255,0.05)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: metal.color, fontWeight: '600' }}>{metal.name}</span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: ytdReturn > 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                  color: ytdReturn > 0 ? '#22c55e' : '#ef4444'
                }}>
                  {ytdReturn > 0 ? '+' : ''}{ytdReturn}% YoY
                </span>
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f1f5f9' }}>
                {currentPrice.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {metal.unit} - 50Y Return +{totalReturn}%
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '32px',
        padding: '16px',
        color: '#64748b',
        fontSize: '0.75rem',
        lineHeight: '1.6'
      }}>
        <div style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '12px' }}>
          Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          }) : 'Unknown'}
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#94a3b8' }}>Data Sources & Units:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '4px 16px' }}>
            <div><strong>Gold</strong> (USD/oz) - COMEX spot price, troy ounce</div>
            <div><strong>Silver</strong> (USD/oz) - COMEX spot price, troy ounce</div>
            <div><strong>Copper</strong> (USD/ton) - LME settlement, metric ton</div>
            <div><strong>Aluminum</strong> (USD/ton) - LME settlement, metric ton</div>
            <div><strong>Nickel</strong> (USD/ton) - LME settlement, metric ton</div>
            <div><strong>Zinc</strong> (USD/ton) - LME settlement, metric ton</div>
            <div><strong>Tin</strong> (USD/ton) - LME settlement, metric ton</div>
            <div><strong>Iron</strong> (USD/ton) - CFR China 62% Fe fines</div>
            <div><strong>Cobalt</strong> (USD/lb) - LME settlement, per pound</div>
            <div><strong>Tungsten</strong> (USD/mtu) - APT 88.5% WO3, metric ton unit</div>
            <div><strong>Molybdenum</strong> (USD/lb) - Oxide, per pound</div>
            <div><strong>Lithium</strong> (USD/ton) - Battery-grade carbonate, China spot</div>
            <div><strong>Titanium</strong> (USD/ton) - Sponge, metric ton</div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.7rem', color: '#475569' }}>
            Historical: Year-end closing price | Current year: Latest available price |
            Sources: LME, COMEX, Trading Economics, Fastmarkets, SMM
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetalsDashboard;
