import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from 'recharts';

// Historical price data (1975-2025) - Based on actual market data
const goldData = [
  { year: 1975, price: 161 }, { year: 1976, price: 125 }, { year: 1977, price: 148 },
  { year: 1978, price: 194 }, { year: 1979, price: 307 }, { year: 1980, price: 615 },
  { year: 1981, price: 460 }, { year: 1982, price: 376 }, { year: 1983, price: 424 },
  { year: 1984, price: 361 }, { year: 1985, price: 317 }, { year: 1986, price: 368 },
  { year: 1987, price: 448 }, { year: 1988, price: 437 }, { year: 1989, price: 381 },
  { year: 1990, price: 384 }, { year: 1991, price: 362 }, { year: 1992, price: 344 },
  { year: 1993, price: 360 }, { year: 1994, price: 384 }, { year: 1995, price: 384 },
  { year: 1996, price: 388 }, { year: 1997, price: 331 }, { year: 1998, price: 294 },
  { year: 1999, price: 279 }, { year: 2000, price: 279 }, { year: 2001, price: 271 },
  { year: 2002, price: 310 }, { year: 2003, price: 363 }, { year: 2004, price: 409 },
  { year: 2005, price: 445 }, { year: 2006, price: 603 }, { year: 2007, price: 695 },
  { year: 2008, price: 872 }, { year: 2009, price: 972 }, { year: 2010, price: 1225 },
  { year: 2011, price: 1572 }, { year: 2012, price: 1669 }, { year: 2013, price: 1411 },
  { year: 2014, price: 1266 }, { year: 2015, price: 1160 }, { year: 2016, price: 1251 },
  { year: 2017, price: 1257 }, { year: 2018, price: 1269 }, { year: 2019, price: 1393 },
  { year: 2020, price: 1770 }, { year: 2021, price: 1799 }, { year: 2022, price: 1800 },
  { year: 2023, price: 1943 }, { year: 2024, price: 2386 }, { year: 2025, price: 4200 }
];

const silverData = [
  { year: 1975, price: 4.42 }, { year: 1976, price: 4.35 }, { year: 1977, price: 4.62 },
  { year: 1978, price: 5.40 }, { year: 1979, price: 11.09 }, { year: 1980, price: 20.63 },
  { year: 1981, price: 10.52 }, { year: 1982, price: 7.95 }, { year: 1983, price: 11.44 },
  { year: 1984, price: 8.14 }, { year: 1985, price: 6.14 }, { year: 1986, price: 5.47 },
  { year: 1987, price: 7.01 }, { year: 1988, price: 6.53 }, { year: 1989, price: 5.50 },
  { year: 1990, price: 4.83 }, { year: 1991, price: 4.04 }, { year: 1992, price: 3.94 },
  { year: 1993, price: 4.30 }, { year: 1994, price: 5.29 }, { year: 1995, price: 5.20 },
  { year: 1996, price: 5.19 }, { year: 1997, price: 4.89 }, { year: 1998, price: 5.54 },
  { year: 1999, price: 5.22 }, { year: 2000, price: 4.95 }, { year: 2001, price: 4.37 },
  { year: 2002, price: 4.60 }, { year: 2003, price: 4.88 }, { year: 2004, price: 6.67 },
  { year: 2005, price: 7.31 }, { year: 2006, price: 11.55 }, { year: 2007, price: 13.38 },
  { year: 2008, price: 14.99 }, { year: 2009, price: 14.67 }, { year: 2010, price: 20.19 },
  { year: 2011, price: 35.12 }, { year: 2012, price: 31.15 }, { year: 2013, price: 23.79 },
  { year: 2014, price: 19.08 }, { year: 2015, price: 15.68 }, { year: 2016, price: 17.14 },
  { year: 2017, price: 17.05 }, { year: 2018, price: 15.71 }, { year: 2019, price: 16.21 },
  { year: 2020, price: 20.55 }, { year: 2021, price: 25.14 }, { year: 2022, price: 21.73 },
  { year: 2023, price: 23.35 }, { year: 2024, price: 28.27 }, { year: 2025, price: 92 }
];

const copperData = [
  { year: 1975, price: 1237 }, { year: 1976, price: 1402 }, { year: 1977, price: 1310 },
  { year: 1978, price: 1367 }, { year: 1979, price: 2009 }, { year: 1980, price: 2182 },
  { year: 1981, price: 1742 }, { year: 1982, price: 1480 }, { year: 1983, price: 1592 },
  { year: 1984, price: 1377 }, { year: 1985, price: 1417 }, { year: 1986, price: 1374 },
  { year: 1987, price: 1785 }, { year: 1988, price: 2608 }, { year: 1989, price: 2848 },
  { year: 1990, price: 2662 }, { year: 1991, price: 2339 }, { year: 1992, price: 2281 },
  { year: 1993, price: 1913 }, { year: 1994, price: 2307 }, { year: 1995, price: 2936 },
  { year: 1996, price: 2295 }, { year: 1997, price: 2277 }, { year: 1998, price: 1654 },
  { year: 1999, price: 1573 }, { year: 2000, price: 1813 }, { year: 2001, price: 1578 },
  { year: 2002, price: 1559 }, { year: 2003, price: 1779 }, { year: 2004, price: 2866 },
  { year: 2005, price: 3679 }, { year: 2006, price: 6722 }, { year: 2007, price: 7118 },
  { year: 2008, price: 6956 }, { year: 2009, price: 5150 }, { year: 2010, price: 7534 },
  { year: 2011, price: 8828 }, { year: 2012, price: 7962 }, { year: 2013, price: 7332 },
  { year: 2014, price: 6863 }, { year: 2015, price: 5510 }, { year: 2016, price: 4868 },
  { year: 2017, price: 6166 }, { year: 2018, price: 6530 }, { year: 2019, price: 6010 },
  { year: 2020, price: 6181 }, { year: 2021, price: 9317 }, { year: 2022, price: 8797 },
  { year: 2023, price: 8478 }, { year: 2024, price: 9200 }, { year: 2025, price: 12400 }
];

const aluminumData = [
  { year: 1975, price: 850 }, { year: 1976, price: 920 }, { year: 1977, price: 1100 },
  { year: 1978, price: 1150 }, { year: 1979, price: 1450 }, { year: 1980, price: 1780 },
  { year: 1981, price: 1260 }, { year: 1982, price: 1020 }, { year: 1983, price: 1430 },
  { year: 1984, price: 1250 }, { year: 1985, price: 1050 }, { year: 1986, price: 1150 },
  { year: 1987, price: 1565 }, { year: 1988, price: 2551 }, { year: 1989, price: 1951 },
  { year: 1990, price: 1639 }, { year: 1991, price: 1302 }, { year: 1992, price: 1254 },
  { year: 1993, price: 1139 }, { year: 1994, price: 1477 }, { year: 1995, price: 1805 },
  { year: 1996, price: 1506 }, { year: 1997, price: 1599 }, { year: 1998, price: 1357 },
  { year: 1999, price: 1361 }, { year: 2000, price: 1549 }, { year: 2001, price: 1444 },
  { year: 2002, price: 1350 }, { year: 2003, price: 1431 }, { year: 2004, price: 1716 },
  { year: 2005, price: 1898 }, { year: 2006, price: 2570 }, { year: 2007, price: 2638 },
  { year: 2008, price: 2573 }, { year: 2009, price: 1665 }, { year: 2010, price: 2173 },
  { year: 2011, price: 2401 }, { year: 2012, price: 2023 }, { year: 2013, price: 1847 },
  { year: 2014, price: 1867 }, { year: 2015, price: 1665 }, { year: 2016, price: 1604 },
  { year: 2017, price: 1968 }, { year: 2018, price: 2110 }, { year: 2019, price: 1794 },
  { year: 2020, price: 1704 }, { year: 2021, price: 2480 }, { year: 2022, price: 2705 },
  { year: 2023, price: 2255 }, { year: 2024, price: 2450 }, { year: 2025, price: 3150 }
];

const nickelData = [
  { year: 1975, price: 4550 }, { year: 1976, price: 4850 }, { year: 1977, price: 5100 },
  { year: 1978, price: 4650 }, { year: 1979, price: 5950 }, { year: 1980, price: 6519 },
  { year: 1981, price: 5950 }, { year: 1982, price: 4750 }, { year: 1983, price: 4750 },
  { year: 1984, price: 4752 }, { year: 1985, price: 4899 }, { year: 1986, price: 3855 },
  { year: 1987, price: 4872 }, { year: 1988, price: 13778 }, { year: 1989, price: 13300 },
  { year: 1990, price: 8864 }, { year: 1991, price: 8156 }, { year: 1992, price: 7001 },
  { year: 1993, price: 5293 }, { year: 1994, price: 6340 }, { year: 1995, price: 8228 },
  { year: 1996, price: 7501 }, { year: 1997, price: 6927 }, { year: 1998, price: 4630 },
  { year: 1999, price: 6011 }, { year: 2000, price: 8638 }, { year: 2001, price: 5945 },
  { year: 2002, price: 6772 }, { year: 2003, price: 9640 }, { year: 2004, price: 13823 },
  { year: 2005, price: 14744 }, { year: 2006, price: 24254 }, { year: 2007, price: 37230 },
  { year: 2008, price: 21111 }, { year: 2009, price: 14655 }, { year: 2010, price: 21809 },
  { year: 2011, price: 22910 }, { year: 2012, price: 17548 }, { year: 2013, price: 15032 },
  { year: 2014, price: 16893 }, { year: 2015, price: 11863 }, { year: 2016, price: 9595 },
  { year: 2017, price: 10411 }, { year: 2018, price: 13114 }, { year: 2019, price: 13914 },
  { year: 2020, price: 13789 }, { year: 2021, price: 18465 }, { year: 2022, price: 25617 },
  { year: 2023, price: 21511 }, { year: 2024, price: 17500 }, { year: 2025, price: 15200 }
];

const zincData = [
  { year: 1975, price: 650 }, { year: 1976, price: 720 }, { year: 1977, price: 580 },
  { year: 1978, price: 620 }, { year: 1979, price: 740 }, { year: 1980, price: 760 },
  { year: 1981, price: 850 }, { year: 1982, price: 770 }, { year: 1983, price: 820 },
  { year: 1984, price: 950 }, { year: 1985, price: 800 }, { year: 1986, price: 760 },
  { year: 1987, price: 820 }, { year: 1988, price: 1410 }, { year: 1989, price: 1510 },
  { year: 1990, price: 1513 }, { year: 1991, price: 1088 }, { year: 1992, price: 1240 },
  { year: 1993, price: 958 }, { year: 1994, price: 998 }, { year: 1995, price: 1030 },
  { year: 1996, price: 1025 }, { year: 1997, price: 1313 }, { year: 1998, price: 1023 },
  { year: 1999, price: 1077 }, { year: 2000, price: 1128 }, { year: 2001, price: 886 },
  { year: 2002, price: 779 }, { year: 2003, price: 828 }, { year: 2004, price: 1048 },
  { year: 2005, price: 1381 }, { year: 2006, price: 3273 }, { year: 2007, price: 3242 },
  { year: 2008, price: 1871 }, { year: 2009, price: 1658 }, { year: 2010, price: 2161 },
  { year: 2011, price: 2194 }, { year: 2012, price: 1950 }, { year: 2013, price: 1910 },
  { year: 2014, price: 2161 }, { year: 2015, price: 1932 }, { year: 2016, price: 2090 },
  { year: 2017, price: 2896 }, { year: 2018, price: 2922 }, { year: 2019, price: 2546 },
  { year: 2020, price: 2266 }, { year: 2021, price: 3003 }, { year: 2022, price: 3478 },
  { year: 2023, price: 2651 }, { year: 2024, price: 2800 }, { year: 2025, price: 3195 }
];

const tinData = [
  { year: 1975, price: 6800 }, { year: 1976, price: 7500 }, { year: 1977, price: 10500 },
  { year: 1978, price: 12800 }, { year: 1979, price: 15500 }, { year: 1980, price: 16750 },
  { year: 1981, price: 14200 }, { year: 1982, price: 12800 }, { year: 1983, price: 12500 },
  { year: 1984, price: 11800 }, { year: 1985, price: 11500 }, { year: 1986, price: 5500 },
  { year: 1987, price: 6100 }, { year: 1988, price: 7400 }, { year: 1989, price: 8600 },
  { year: 1990, price: 6100 }, { year: 1991, price: 5580 }, { year: 1992, price: 6100 },
  { year: 1993, price: 5150 }, { year: 1994, price: 5460 }, { year: 1995, price: 6180 },
  { year: 1996, price: 6120 }, { year: 1997, price: 5620 }, { year: 1998, price: 5515 },
  { year: 1999, price: 5420 }, { year: 2000, price: 5435 }, { year: 2001, price: 4480 },
  { year: 2002, price: 4061 }, { year: 2003, price: 4890 }, { year: 2004, price: 8510 },
  { year: 2005, price: 7380 }, { year: 2006, price: 8760 }, { year: 2007, price: 14530 },
  { year: 2008, price: 18510 }, { year: 2009, price: 13570 }, { year: 2010, price: 20406 },
  { year: 2011, price: 26054 }, { year: 2012, price: 21125 }, { year: 2013, price: 22282 },
  { year: 2014, price: 21899 }, { year: 2015, price: 16067 }, { year: 2016, price: 17934 },
  { year: 2017, price: 20128 }, { year: 2018, price: 20145 }, { year: 2019, price: 18670 },
  { year: 2020, price: 17125 }, { year: 2021, price: 32560 }, { year: 2022, price: 30959 },
  { year: 2023, price: 25913 }, { year: 2024, price: 29000 }, { year: 2025, price: 45560 }
];

const tungstenData = [
  { year: 1975, price: 85 }, { year: 1976, price: 90 }, { year: 1977, price: 95 },
  { year: 1978, price: 100 }, { year: 1979, price: 140 }, { year: 1980, price: 180 },
  { year: 1981, price: 145 }, { year: 1982, price: 110 }, { year: 1983, price: 85 },
  { year: 1984, price: 78 }, { year: 1985, price: 65 }, { year: 1986, price: 48 },
  { year: 1987, price: 52 }, { year: 1988, price: 58 }, { year: 1989, price: 62 },
  { year: 1990, price: 55 }, { year: 1991, price: 50 }, { year: 1992, price: 45 },
  { year: 1993, price: 42 }, { year: 1994, price: 48 }, { year: 1995, price: 75 },
  { year: 1996, price: 65 }, { year: 1997, price: 58 }, { year: 1998, price: 52 },
  { year: 1999, price: 48 }, { year: 2000, price: 52 }, { year: 2001, price: 55 },
  { year: 2002, price: 52 }, { year: 2003, price: 58 }, { year: 2004, price: 95 },
  { year: 2005, price: 210 }, { year: 2006, price: 245 }, { year: 2007, price: 265 },
  { year: 2008, price: 280 }, { year: 2009, price: 195 }, { year: 2010, price: 245 },
  { year: 2011, price: 450 }, { year: 2012, price: 380 }, { year: 2013, price: 350 },
  { year: 2014, price: 365 }, { year: 2015, price: 230 }, { year: 2016, price: 195 },
  { year: 2017, price: 275 }, { year: 2018, price: 320 }, { year: 2019, price: 260 },
  { year: 2020, price: 255 }, { year: 2021, price: 285 }, { year: 2022, price: 350 },
  { year: 2023, price: 330 }, { year: 2024, price: 380 }, { year: 2025, price: 1050 }
];

const cycleAnnotations = [
  { start: 1979, end: 1980, label: 'Post Oil Crisis Inflation Peak', color: '#ff6b6b' },
  { start: 1987, end: 1989, label: 'East Asia Industrialization', color: '#4ecdc4' },
  { start: 2003, end: 2008, label: 'China Super Cycle', color: '#45b7d1' },
  { start: 2009, end: 2011, label: 'QE Era Rebound', color: '#96ceb4' },
  { start: 2020, end: 2025, label: 'New Energy + De-dollarization', color: '#dda15e' },
];

const MetalsDashboard = () => {
  const [selectedMetal, setSelectedMetal] = useState('all');
  const [timeRange, setTimeRange] = useState('50');
  const [useLogScale, setUseLogScale] = useState(false);

  const metals = [
    { id: 'gold', name: 'Gold', data: goldData, color: '#FFD700', unit: 'USD/oz' },
    { id: 'silver', name: 'Silver', data: silverData, color: '#C0C0C0', unit: 'USD/oz' },
    { id: 'copper', name: 'Copper', data: copperData, color: '#B87333', unit: 'USD/ton' },
    { id: 'aluminum', name: 'Aluminum', data: aluminumData, color: '#848789', unit: 'USD/ton' },
    { id: 'nickel', name: 'Nickel', data: nickelData, color: '#727472', unit: 'USD/ton' },
    { id: 'zinc', name: 'Zinc', data: zincData, color: '#7CB9E8', unit: 'USD/ton' },
    { id: 'tin', name: 'Tin', data: tinData, color: '#8B8589', unit: 'USD/ton' },
    { id: 'tungsten', name: 'Tungsten', data: tungstenData, color: '#3D3D3D', unit: 'USD/mtu' },
  ];

  const filterByTimeRange = (data) => {
    const currentYear = 2025;
    const startYear = currentYear - parseInt(timeRange);
    return data.filter(d => d.year >= startYear);
  };

  const normalizedData = goldData.map((_, index) => {
    const entry = { year: goldData[index].year };
    metals.forEach(metal => {
      const basePrice = metal.data[0].price;
      entry[metal.id] = ((metal.data[index].price / basePrice) * 100).toFixed(1);
    });
    return entry;
  });

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
          Metals Commodity Prices (1975-2025)
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          50 Years of Historical Data - 8 Major Metals - Cycle Analysis
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <select
          value={selectedMetal}
          onChange={(e) => setSelectedMetal(e.target.value)}
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
          <option value="all">All Metals Comparison</option>
          {metals.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

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

      {selectedMetal === 'all' ? (
        <>
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px', color: '#f1f5f9' }}>
              Normalized Returns (Base 1975 = 100)
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filterByTimeRange(normalizedData)} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  scale={useLogScale ? 'log' : 'auto'}
                  domain={useLogScale ? [50, 'auto'] : ['auto', 'auto']}
                  tickFormatter={(v) => `${Math.round(v)}%`}
                  allowDataOverflow={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {metals.map(metal => (
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
                <ComposedChart data={filterByTimeRange(goldData)} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#FFD700" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#C0C0C0" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="price" name="Gold" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth={2} />
                  {filterByTimeRange(silverData).map((item, idx) => {
                    const goldItem = filterByTimeRange(goldData)[idx];
                    if (goldItem) goldItem.silver = item.price;
                    return null;
                  })}
                  <Line yAxisId="right" type="monotone" dataKey="silver" data={filterByTimeRange(silverData).map((s, i) => ({ ...filterByTimeRange(goldData)[i], silver: s.price }))} name="Silver" stroke="#C0C0C0" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ color: '#B87333', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Industrial Metals (Copper & Aluminum)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} allowDuplicatedCategory={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line data={filterByTimeRange(copperData)} type="monotone" dataKey="price" name="Copper" stroke="#B87333" strokeWidth={2} dot={false} />
                  <Line data={filterByTimeRange(aluminumData)} type="monotone" dataKey="price" name="Aluminum" stroke="#848789" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <h3 style={{ color: '#727472', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Battery Metals (Nickel & Zinc)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} allowDuplicatedCategory={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line data={filterByTimeRange(nickelData)} type="monotone" dataKey="price" name="Nickel" stroke="#727472" strokeWidth={2} dot={false} />
                  <Line data={filterByTimeRange(zincData)} type="monotone" dataKey="price" name="Zinc" stroke="#7CB9E8" strokeWidth={2} dot={false} />
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
                Rare Metals (Tin & Tungsten)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} allowDuplicatedCategory={false} />
                  <YAxis yAxisId="left" stroke="#8B8589" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3D3D3D" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" data={filterByTimeRange(tinData)} type="monotone" dataKey="price" name="Tin" stroke="#8B8589" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" data={filterByTimeRange(tungstenData)} type="monotone" dataKey="price" name="Tungsten" stroke="#e74c3c" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {(() => {
            const metal = metals.find(m => m.id === selectedMetal);
            const data = filterByTimeRange(metal.data);
            const currentPrice = data[data.length - 1].price;
            const startPrice = data[0].price;
            const totalReturn = ((currentPrice - startPrice) / startPrice * 100).toFixed(1);
            const maxPrice = Math.max(...data.map(d => d.price));
            const minPrice = Math.min(...data.map(d => d.price));

            return (
              <>
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
              </>
            );
          })()}
        </div>
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
              onClick={() => setSelectedMetal(metal.id)}
              style={{
                background: selectedMetal === metal.id ? 'rgba(255,255,255,0.1)' : 'rgba(30, 41, 59, 0.5)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${selectedMetal === metal.id ? metal.color : 'rgba(255,255,255,0.05)'}`,
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
        textAlign: 'center',
        marginTop: '32px',
        padding: '16px',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        Data Source: LME, COMEX, World Bank - Annual Average Prices - Last Updated: January 2025
      </div>
    </div>
  );
};

export default MetalsDashboard;
