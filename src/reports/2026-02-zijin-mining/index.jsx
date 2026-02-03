import { useState, useRef, useEffect, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, ReferenceArea
} from 'recharts';

import {
  keyMetrics,
  copperUsageComparison,
  datacenterCopperForecast,
  goldPriceData,
  goldProducerComparison,
  strategicRadar,
  sensitivityMatrix,
  copperAssets,
  goldAssets,
  lithiumAssets,
  extremeScenario2026,
  profitElasticity,
  bearVsBull,
  projectTimeline,
  tradeGuidance,
  riskFactors,
  buriticaRedTeam,
  metalColors
} from './data/zijinData';

// ============================================
// Utility Components
// ============================================

const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

const AnimatedNumber = ({ value, suffix = '', prefix = '', duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [ref, isVisible] = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;

    const numericValue = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    if (isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(numericValue * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [isVisible, value, duration]);

  return <span ref={ref}>{prefix}{displayValue}{suffix}</span>;
};

// ============================================
// Core UI Components
// ============================================

const Accordion = ({ title, children, defaultOpen = false, highlight = false, icon = null }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border rounded-xl mb-4 overflow-hidden transition-all duration-300 ${
      highlight
        ? 'border-amber-500/50 bg-amber-500/5'
        : 'border-slate-700/50 bg-slate-800/30'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors ${
          highlight ? 'hover:bg-amber-500/10' : 'hover:bg-slate-700/30'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <span className={`font-medium ${highlight ? 'text-amber-200' : 'text-slate-200'}`}>
            {title}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
        <div className="px-6 pb-6 pt-2 text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ type = 'info', title, children }) => {
  const styles = {
    info: 'border-blue-500/50 bg-blue-500/10 text-blue-200',
    warning: 'border-amber-500/50 bg-amber-500/10 text-amber-200',
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200',
    error: 'border-red-500/50 bg-red-500/10 text-red-200',
    purple: 'border-purple-500/50 bg-purple-500/10 text-purple-200',
  };

  const icons = {
    info: '💡',
    warning: '⚠️',
    success: '✅',
    error: '❌',
    purple: '🔮',
  };

  return (
    <div className={`border rounded-xl p-5 mb-4 ${styles[type]}`}>
      {title && (
        <div className="flex items-center gap-2 mb-2 font-semibold">
          <span>{icons[type]}</span>
          <span>{title}</span>
        </div>
      )}
      <div className="text-sm leading-relaxed opacity-90">{children}</div>
    </div>
  );
};

const Quote = ({ children, author }) => (
  <blockquote className="border-l-4 border-amber-500/70 pl-6 py-4 my-6 bg-slate-800/30 rounded-r-xl">
    <p className="text-slate-200 italic text-lg leading-relaxed">"{children}"</p>
    {author && <cite className="text-slate-400 text-sm mt-2 block">— {author}</cite>}
  </blockquote>
);

const MetricCard = ({ label, value, unit, change, trend, subtext, color }) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 transition-all duration-500 hover:scale-105 hover:border-slate-600/50 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-slate-400 text-sm mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <span
          className="text-3xl font-bold"
          style={{ color: color || '#f1f5f9' }}
        >
          {value}
        </span>
        <span className="text-slate-400 text-sm">{unit}</span>
      </div>
      {change && (
        <div className={`text-sm mt-2 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </div>
      )}
      {subtext && (
        <div className="text-slate-500 text-xs mt-2">{subtext}</div>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl">
      <div className="text-slate-300 text-sm mb-2 font-medium">{label}</div>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-400">{entry.name}:</span>
          <span className="text-slate-200 font-medium">{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const SectionTitle = ({ children, subtitle }) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">{children}</h2>
      {subtitle && <p className="text-slate-400">{subtitle}</p>}
    </div>
  );
};

const Badge = ({ children, color = 'amber' }) => {
  const colors = {
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${colors[color]}`}>
      {children}
    </span>
  );
};

// ============================================
// Specialized Components
// ============================================

const ComparisonTable = ({ headers, rows, highlightFirst = false }) => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th
              key={i}
              className="text-left px-4 py-3 text-slate-300 font-medium border-b border-slate-700/50 bg-slate-800/50"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            className={`border-b border-slate-700/30 transition-colors hover:bg-slate-800/30 ${
              highlightFirst && i === 0 ? 'bg-amber-500/5' : ''
            }`}
          >
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 text-slate-300">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BearBullCard = ({ topic, bear, bull }) => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="border border-slate-700/50 rounded-xl overflow-hidden mb-6">
      <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50">
        <h4 className="text-lg font-semibold text-slate-200">{topic}</h4>
      </div>
      <div className="grid md:grid-cols-2 divide-x divide-slate-700/50">
        {/* Bear Case */}
        <div className="p-4">
          <div
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => setExpanded(expanded === 'bear' ? null : 'bear')}
          >
            <span className="text-2xl">🐻</span>
            <div className="flex-1">
              <div className="text-red-400 font-medium mb-1">{bear.title}</div>
              <div className={`text-slate-400 text-sm overflow-hidden transition-all duration-300 ${
                expanded === 'bear' ? 'max-h-96' : 'max-h-12'
              }`}>
                {bear.detail}
              </div>
              {bear.detail.length > 100 && (
                <button className="text-red-400/70 text-xs mt-2 hover:text-red-400">
                  {expanded === 'bear' ? '收起 ↑' : '展开 ↓'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bull Case */}
        <div className="p-4 bg-emerald-500/5">
          <div
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => setExpanded(expanded === 'bull' ? null : 'bull')}
          >
            <span className="text-2xl">🐂</span>
            <div className="flex-1">
              <div className="text-emerald-400 font-medium mb-1">{bull.title}</div>
              <div className={`text-slate-400 text-sm overflow-hidden transition-all duration-300 ${
                expanded === 'bull' ? 'max-h-96' : 'max-h-12'
              }`}>
                {bull.detail}
              </div>
              {bull.detail.length > 100 && (
                <button className="text-emerald-400/70 text-xs mt-2 hover:text-emerald-400">
                  {expanded === 'bull' ? '收起 ↑' : '展开 ↓'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SensitivityHeatmap = ({ data }) => (
  <div className="grid grid-cols-3 gap-4">
    {data.map((scenario, i) => (
      <div
        key={i}
        className="rounded-xl p-5 text-center transition-transform hover:scale-105"
        style={{
          backgroundColor: `${scenario.color}15`,
          borderColor: `${scenario.color}50`,
          borderWidth: '1px'
        }}
      >
        <div className="text-slate-400 text-sm mb-2">{scenario.scenario}情景</div>
        <div className="text-3xl font-bold mb-3" style={{ color: scenario.color }}>
          {scenario.netProfit}亿
        </div>
        <div className="text-xs text-slate-500 space-y-1">
          <div>铜价: ${scenario.copperPrice.toLocaleString()}/t</div>
          <div>金价: ${scenario.goldPrice.toLocaleString()}/oz</div>
          <div>隐含PE: {scenario.impliedPE}x</div>
        </div>
      </div>
    ))}
  </div>
);

const ProjectTimeline = ({ data }) => (
  <div className="relative">
    {/* Timeline line */}
    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-700" />

    {data.map((item, i) => {
      const metalColor = metalColors[item.metal] || '#64748b';
      const statusColors = {
        completed: 'bg-emerald-500',
        'in-progress': 'bg-amber-500',
        planned: 'bg-slate-500'
      };

      return (
        <div key={i} className="relative pl-16 pb-8">
          {/* Node */}
          <div
            className={`absolute left-4 w-5 h-5 rounded-full border-4 border-slate-900 ${statusColors[item.status]}`}
          />

          {/* Content */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-slate-400 text-sm">{item.year} {item.quarter}</span>
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: `${metalColor}30`, color: metalColor }}
              >
                {item.metal === 'copper' ? '铜' : item.metal === 'gold' ? '金' : '锂'}
              </span>
            </div>
            <div className="text-slate-200 font-medium">{item.project}</div>
            <div className="text-slate-400 text-sm">{item.capacity}</div>
          </div>
        </div>
      );
    })}
  </div>
);

const AssetTable = ({ assets, metal }) => {
  const metalColor = metalColors[metal] || '#64748b';

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="text-left px-4 py-3 text-slate-400 text-sm">项目</th>
            <th className="text-left px-4 py-3 text-slate-400 text-sm">位置</th>
            <th className="text-left px-4 py-3 text-slate-400 text-sm">2026产量</th>
            <th className="text-left px-4 py-3 text-slate-400 text-sm">状态/成本</th>
            <th className="text-left px-4 py-3 text-slate-400 text-sm">战略意义</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, i) => (
            <tr
              key={i}
              className={`border-b border-slate-700/30 transition-colors hover:bg-slate-800/30 ${
                asset.highlight ? 'bg-amber-500/5' : ''
              }`}
            >
              <td className="px-4 py-3">
                <span className="text-slate-200 font-medium">{asset.name}</span>
                {asset.ownership && (
                  <span className="text-slate-500 text-xs ml-2">({asset.ownership})</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-400 text-sm">{asset.location}</td>
              <td className="px-4 py-3 text-slate-300" style={{ color: metalColor }}>
                {asset.production2026}
              </td>
              <td className="px-4 py-3 text-slate-400 text-sm">{asset.status || asset.cost}</td>
              <td className="px-4 py-3 text-slate-400 text-sm">{asset.significance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// Main Report Component
// ============================================

export default function ZijinMiningReport() {
  const [activeSection, setActiveSection] = useState(null);

  // Navigation items
  const navItems = [
    { id: 'thesis', label: '投资逻辑' },
    { id: 'copper', label: '铜板块' },
    { id: 'gold', label: '金板块' },
    { id: 'lithium', label: '锂板块' },
    { id: 'debate', label: '多空博弈' },
    { id: 'assets', label: '资产扫描' },
    { id: 'valuation', label: '估值模型' },
    { id: 'trade', label: '交易指引' },
    { id: 'risks', label: '风险因素' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <header className="relative pt-16 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Stock codes */}
          <div className="flex items-center gap-4 mb-6">
            <Badge color="amber">2899.HK</Badge>
            <Badge color="blue">601899.SS</Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
              紫金矿业
            </span>
            <span className="text-slate-300 text-2xl md:text-3xl ml-4">深度分析</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl text-slate-400 mb-8 max-w-3xl">
            全球铜金龙头，AI时代的"新石油"供应商，央行购金浪潮的核心受益者
          </p>

          {/* Rating badge */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl px-6 py-3">
              <div className="text-emerald-400 text-sm mb-1">投资评级</div>
              <div className="text-2xl font-bold text-emerald-300">强力买入 Strong Buy</div>
              <div className="text-emerald-400/70 text-sm">置信度 92%</div>
            </div>

            <div className="flex gap-8">
              <div>
                <div className="text-slate-400 text-sm">H股目标价</div>
                <div className="text-2xl font-bold" style={{ color: metalColors.gold }}>
                  HK$ 52
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">A股目标价</div>
                <div className="text-2xl font-bold" style={{ color: metalColors.gold }}>
                  ¥ 25
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {navItems.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeSection === item.id
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">

        {/* Key Metrics Dashboard */}
        <section className="mb-20">
          <SectionTitle subtitle="一览核心数据">📊 关键指标仪表盘</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {keyMetrics.map((metric, i) => (
              <MetricCard key={i} {...metric} />
            ))}
          </div>
        </section>

        {/* Investment Thesis */}
        <section id="thesis" className="mb-20">
          <SectionTitle subtitle="三大金属战略定位">🎯 投资逻辑总览</SectionTitle>

          {/* Radar Chart */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4 text-center">铜/金/锂 三驾马车战略评分</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={strategicRadar}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={12} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Radar name="铜" dataKey="copper" stroke={metalColors.copper} fill={metalColors.copper} fillOpacity={0.3} />
                  <Radar name="金" dataKey="gold" stroke={metalColors.gold} fill={metalColors.gold} fillOpacity={0.3} />
                  <Radar name="锂" dataKey="lithium" stroke={metalColors.lithium} fill={metalColors.lithium} fillOpacity={0.3} />
                  <Legend />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6" style={{ borderColor: `${metalColors.copper}50` }}>
              <div className="text-3xl mb-3">🔶</div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: metalColors.copper }}>铜：AI时代新石油</h4>
              <p className="text-slate-400 text-sm">
                AI数据中心铜需求爆发，单个超大规模数据中心铜耗达5万吨，是传统数据中心的4-10倍。2026年巨龙二期投产将使紫金铜产量突破120万吨，跻身全球前五。
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6" style={{ borderColor: `${metalColors.gold}50` }}>
              <div className="text-3xl mb-3">🥇</div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: metalColors.gold }}>金：主权信用对冲</h4>
              <p className="text-slate-400 text-sm">
                全球央行连续3年净购金超1,000吨，去美元化趋势明确。紫金黄金成本&lt;$1,200/oz，即使金价回调至$2,400仍有100%毛利空间。2026年产量将达105吨。
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6" style={{ borderColor: `${metalColors.lithium}50` }}>
              <div className="text-3xl mb-3">🔮</div>
              <h4 className="text-lg font-semibold mb-2" style={{ color: metalColors.lithium }}>锂：免费看涨期权</h4>
              <p className="text-slate-400 text-sm">
                Manono是全球最大硬岩锂矿，资源量超4亿吨。当前锂价低迷使该资产被市场忽视，一旦锂价回暖，将贡献巨大增量价值。3Q锂业已实现盈利。
              </p>
            </div>
          </div>
        </section>

        {/* Copper Section */}
        <section id="copper" className="mb-20">
          <SectionTitle subtitle="AI数据中心：新一代「吃铜巨兽」">🔶 铜板块：AI时代的「新石油」</SectionTitle>

          {/* Copper usage comparison chart */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">传统 vs AI数据中心铜用量对比</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={copperUsageComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={12} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="usage" name="铜用量(吨)" radius={[0, 8, 8, 0]}>
                    {copperUsageComparison.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-slate-400 text-sm text-center mt-4">
              AI超大规模数据中心单体铜用量达50,000吨，是传统数据中心的4-10倍
            </p>
          </div>

          {/* Datacenter copper forecast */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">2024-2030 数据中心铜消耗预测</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={datacenterCopperForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} label={{ value: '万吨', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#22c55e" fontSize={12} label={{ value: 'YoY%', angle: 90, position: 'insideRight', fill: '#22c55e' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="consumption" name="铜消耗量(万吨)" fill={metalColors.copper} radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="growth" name="同比增长%" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed content accordions */}
          <Accordion title="旧动能的衰退：房地产铜需求见顶" icon="🏗️">
            <p className="mb-4">
              中国房地产行业曾是全球最大的铜消费终端，高峰期占中国铜消费的25-30%。但随着房地产市场进入长期调整期，这一传统需求引擎正在熄火：
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li>2024年中国房屋新开工面积同比下降23%，连续第三年大幅负增长</li>
              <li>房地产用铜量从峰值的350万吨/年下降至约250万吨/年</li>
              <li>存量房装修带来的铜需求增量难以弥补新建房减少的缺口</li>
              <li>房地产铜需求占比已从30%降至约20%，趋势不可逆转</li>
            </ul>
            <InfoBox type="info" title="关键洞察">
              房地产铜需求的结构性下降是铜消费"旧动能"衰退的核心体现，但这恰恰为"新动能"腾出了供应空间。在全球铜供应增长乏力的背景下，需求结构的切换将使价格中枢上移而非下降。
            </InfoBox>
          </Accordion>

          <Accordion title="新动能的爆发：AI数据中心革命" icon="🤖" highlight={true}>
            <p className="mb-4">
              AI大模型的爆发式发展正在重塑全球数据中心格局，而铜作为电力传输的核心材料，正站在这场革命的风口：
            </p>

            <h5 className="text-amber-300 font-semibold mb-2">为什么AI数据中心是"吃铜巨兽"？</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li><strong>电力密度激增</strong>：传统数据中心机架功率为5-10kW，AI训练机架功率达50-100kW，单位面积电力需求增长10倍</li>
              <li><strong>铜线缆用量倍增</strong>：更高的电流需要更粗的铜线缆，加上冗余设计，单机架铜用量从10kg增至50kg以上</li>
              <li><strong>液冷系统普及</strong>：AI芯片的高发热量推动液冷系统替代风冷，铜管和铜散热片需求激增</li>
              <li><strong>规模效应</strong>：超大规模AI数据中心单体容量达1GW以上，是传统数据中心的10-20倍</li>
            </ul>

            <h5 className="text-amber-300 font-semibold mb-2">全球AI数据中心建设浪潮</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>微软宣布2024-2025财年资本开支800亿美元，主要用于AI数据中心</li>
              <li>亚马逊AWS计划未来15年投资1500亿美元建设数据中心</li>
              <li>Stargate项目（OpenAI+软银+甲骨文）计划投资5000亿美元</li>
              <li>中国"东数西算"工程八大枢纽节点建设加速推进</li>
            </ul>

            <InfoBox type="success" title="量化测算">
              按当前规划，2024-2030年全球AI数据中心新增装机容量约200GW，对应新增铜需求约200-280万吨。仅此一项就将使全球铜供需平衡表从"紧平衡"转向"结构性短缺"。
            </InfoBox>

            <Quote author="高盛商品研究团队">
              AI是铜需求的"游戏改变者"。我们预计到2030年，AI相关铜需求将从2023年的不足10万吨增长至超过100万吨，CAGR超过40%。
            </Quote>
          </Accordion>

          <Accordion title="电动车的存量替代：被低估的增量" icon="🚗">
            <p className="mb-4">
              电动车对燃油车的替代正在进入加速期，而这一进程带来的铜需求增量常被市场低估：
            </p>

            <h5 className="text-slate-200 font-semibold mb-2">单车铜用量对比</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>传统燃油车：约23kg铜/车</li>
              <li>混合动力车：约40kg铜/车</li>
              <li>纯电动车：约83kg铜/车</li>
              <li>电动巴士：约250kg铜/车</li>
            </ul>

            <h5 className="text-slate-200 font-semibold mb-2">全球电动化进程</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>2024年全球新能源车销量约1800万辆，渗透率约20%</li>
              <li>预计2030年全球新能源车销量将达4500万辆，渗透率超过50%</li>
              <li>电动车带来的增量铜需求从2024年约120万吨增至2030年约300万吨</li>
            </ul>

            <h5 className="text-slate-200 font-semibold mb-2">充电基础设施</h5>
            <p className="text-slate-400 mb-4">
              除整车外，充电桩和电网升级也带来可观铜需求。一个直流快充桩约需20kg铜，全球2030年预计安装5000万个公共充电桩，对应100万吨铜需求。
            </p>

            <InfoBox type="info">
              电动车铜需求的特点是"确定性高、增长线性、可预测性强"，为铜价提供了坚实的需求底部支撑。
            </InfoBox>
          </Accordion>
        </section>

        {/* Gold Section */}
        <section id="gold" className="mb-20">
          <SectionTitle subtitle="央行购金范式转移">🥇 金板块：主权信用对冲</SectionTitle>

          {/* Gold price chart */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">金价历史走势与预测</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={goldPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[1500, 3500]} tickFormatter={v => `$${v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceArea x1="2025E" x2="2026E" fill={metalColors.gold} fillOpacity={0.1} />
                  <ReferenceLine y={2800} stroke={metalColors.gold} strokeDasharray="5 5" label={{ value: '预测中枢 $2,800', fill: metalColors.gold, fontSize: 12 }} />
                  <Area type="monotone" dataKey="price" stroke={metalColors.gold} fill={metalColors.gold} fillOpacity={0.2} name="金价($/oz)" />
                  <Line type="monotone" dataKey="price" stroke={metalColors.gold} strokeWidth={3} dot={{ fill: metalColors.gold, strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gold producer comparison */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">全球主要金企产量对比（吨）</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goldProducerComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="company" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="production2024" name="2024年产量" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="production2026E" name="2026E产量" fill={metalColors.gold} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-slate-400 text-sm text-center mt-4">
              紫金2024-2026年产量增速43.8%，远超Newmont(4.7%)和Barrick(4.0%)
            </p>
          </div>

          <Accordion title="央行购金：去美元化的战略选择" icon="🏦" highlight={true}>
            <p className="mb-4">
              2022年以来，全球央行购金出现历史性转变。这不是周期性行为，而是结构性范式转移：
            </p>

            <h5 className="text-amber-300 font-semibold mb-2">央行购金数据</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>2022年：全球央行净购金1,136吨，创1967年以来最高纪录</li>
              <li>2023年：全球央行净购金1,037吨，连续第二年超千吨</li>
              <li>2024年：上半年央行购金达483吨，全年有望再超千吨</li>
              <li>主要买家：中国、印度、土耳其、波兰、卡塔尔、新加坡</li>
            </ul>

            <h5 className="text-amber-300 font-semibold mb-2">为什么是结构性转变？</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li><strong>美元武器化</strong>：俄乌冲突后美国冻结俄罗斯外汇储备，引发全球央行对美元资产安全性的担忧</li>
              <li><strong>美国财政恶化</strong>：美国国债规模突破34万亿美元，利息支出占财政收入比例创新高，长期偿债能力存疑</li>
              <li><strong>储备多元化</strong>：新兴市场央行黄金储备占比普遍偏低（中国4.9%，印度8%），补库空间巨大</li>
              <li><strong>通胀预期</strong>：全球央行扩表+财政扩张的组合意味着长期通胀中枢上移</li>
            </ul>

            <InfoBox type="success" title="中国央行潜在增持空间">
              中国央行黄金储备约2,264吨，占外汇储备比例仅4.9%，远低于全球平均15%和美国的75%。若提升至10%，对应约2,000吨增量购金需求。按当前年均200吨购金速度，这一进程将持续10年以上。
            </InfoBox>
          </Accordion>

          <Accordion title="紫金黄金业务：成本与产量的双重优势" icon="⛏️">
            <p className="mb-4">
              紫金黄金业务的核心竞争力在于"低成本+高成长"的稀缺组合：
            </p>

            <h5 className="text-slate-200 font-semibold mb-2">成本优势</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>国内金矿平均成本约180-350美元/oz，远低于全球平均~1,200美元/oz</li>
              <li>成本优势来源于：高品位矿体、规模效应、国产设备、管理精细</li>
              <li>即使金价跌至$1,500/oz（当前价格腰斩），国内金矿仍有正毛利</li>
            </ul>

            <h5 className="text-slate-200 font-semibold mb-2">产量增长路径</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>2024年：73吨（同比+15%）</li>
              <li>2025E：90吨（同比+23%）</li>
              <li>2026E：105吨（同比+17%）</li>
              <li>增量来源：陇南紫金扩产、海域金矿达产、收购整合</li>
            </ul>

            <Quote>
              紫金的黄金业务是"进可攻、退可守"的典范：金价上涨时利润弹性最大，金价下跌时成本护城河最深。
            </Quote>
          </Accordion>

          <Accordion title="金价与紫金盈利的脱钩机会" icon="📈">
            <p className="mb-4">
              市场往往线性外推金价与金矿股盈利的关系，但紫金的产量增长正在打破这一假设：
            </p>

            <h5 className="text-slate-200 font-semibold mb-2">盈利弹性测算</h5>
            <ComparisonTable
              headers={['金价情景', '金价变化', '产量变化', '黄金业务净利润变化']}
              rows={[
                ['基准', '$2,600/oz', '73吨', '100亿元'],
                ['金价持平', '$2,600/oz', '105吨', '144亿元（+44%）'],
                ['金价涨10%', '$2,860/oz', '105吨', '180亿元（+80%）'],
                ['金价涨20%', '$3,120/oz', '105吨', '216亿元（+116%）'],
              ]}
            />

            <InfoBox type="info" title="关键洞察">
              即使金价完全不涨，紫金黄金业务利润也将因产量增长而提升44%。这就是"产量增长带来的免费期权"——市场往往只给予金价弹性估值，而忽视产量弹性。
            </InfoBox>
          </Accordion>
        </section>

        {/* Lithium Section */}
        <section id="lithium" className="mb-20">
          <SectionTitle subtitle="Manono：全球最大硬岩锂矿">🔮 锂板块：免费看涨期权</SectionTitle>

          <Accordion title="Manono项目详情：被低估的巨型资产" icon="💎" highlight={true}>
            <p className="mb-4">
              Manono锂矿位于刚果(金)，是全球已探明的最大硬岩锂矿，其规模和品位都具有世界级水平：
            </p>

            <h5 className="text-purple-300 font-semibold mb-2">资源量数据</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>总资源量：4.09亿吨矿石，含1,390万吨氧化锂（LCE）</li>
              <li>平均品位：1.65% Li₂O，属全球顶级</li>
              <li>矿体规模：长13.5公里，宽1.5公里，厚度达150米</li>
              <li>紫金权益：通过AVZ Minerals持有24%权益</li>
            </ul>

            <h5 className="text-purple-300 font-semibold mb-2">开发进展</h5>
            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>2023年：完成资源量升级和初步经济评估</li>
              <li>2024年：推进可行性研究，优化选矿工艺</li>
              <li>2025-2026年：预计完成可行性研究，启动融资</li>
              <li>2028年后：预计建成投产，年产能15-20万吨LCE</li>
            </ul>

            <h5 className="text-purple-300 font-semibold mb-2">战略意义</h5>
            <p className="text-slate-400 mb-4">
              Manono的战略价值在于：1) 其规模足以支撑紫金成为全球锂业巨头；2) 硬岩锂矿品质稳定，适合生产电池级碳酸锂；3) 刚果(金)虽有政治风险，但紫金已有Kamoa-Kakula运营经验，风险可控。
            </p>

            <InfoBox type="purple" title="期权价值">
              按当前锂价低迷状态，市场对Manono几乎零估值。但若锂价回升至15万元/吨（2022年峰值的三分之一），Manono的NPV将超过500亿元。这就是"免费看涨期权"的含义——下行有限，上行巨大。
            </InfoBox>
          </Accordion>

          <Accordion title="3Q锂业：已盈利的锂业务标杆" icon="🔋">
            <p className="mb-4">
              3Q锂业是紫金在阿根廷的盐湖提锂项目，已于2024年实现满产和盈利：
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>产能：3万吨/年碳酸锂当量（LCE）</li>
              <li>成本：约4,500美元/吨，处于全球第一梯队</li>
              <li>品质：电池级碳酸锂，直供下游电池厂</li>
              <li>2024年贡献净利润约5-8亿元，证明锂业务盈利可行性</li>
            </ul>

            <p className="text-slate-400">
              3Q的成功运营为紫金积累了宝贵的锂业务经验，也验证了其在新兴金属领域的扩张能力。
            </p>
          </Accordion>

          <Accordion title="西藏拉果错：国内战略储备" icon="🏔️">
            <p className="mb-4">
              西藏拉果错盐湖锂矿是紫金在国内布局的战略性资源：
            </p>

            <ul className="list-disc pl-6 space-y-2 text-slate-400 mb-4">
              <li>资源量：碳酸锂当量约200万吨，品位适中</li>
              <li>建设进度：2025年动工，2026年投产，规划产能2万吨/年</li>
              <li>战略意义：国内锂资源自主可控，降低进口依赖</li>
              <li>成本预期：受高海拔影响，成本约6,000-7,000美元/吨</li>
            </ul>

            <InfoBox type="info">
              拉果错虽成本不及阿根廷盐湖，但其"国内资源、自主可控"的属性在地缘政治紧张背景下具有战略溢价。
            </InfoBox>
          </Accordion>
        </section>

        {/* Bear vs Bull Section */}
        <section id="debate" className="mb-20">
          <SectionTitle subtitle="预期差博弈">🐻 vs 🐂 多空论战</SectionTitle>

          <p className="text-slate-400 mb-8">
            投资紫金矿业的核心在于理解市场的"预期差"。以下是主要空头论点及我们的反驳：
          </p>

          {bearVsBull.map((item, i) => (
            <BearBullCard key={i} {...item} />
          ))}
        </section>

        {/* Asset Deep Dive */}
        <section id="assets" className="mb-20">
          <SectionTitle subtitle="核心资产全景扫描">⛏️ 深度资产扫描</SectionTitle>

          {/* Copper Assets */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4" style={{ color: metalColors.copper }}>
              🔶 铜板块资产
            </h3>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
              <AssetTable assets={copperAssets} metal="copper" />
            </div>
          </div>

          {/* Gold Assets */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4" style={{ color: metalColors.gold }}>
              🥇 金板块资产
            </h3>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
              <AssetTable assets={goldAssets} metal="gold" />
            </div>
          </div>

          {/* Lithium Assets */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4" style={{ color: metalColors.lithium }}>
              🔮 锂板块资产
            </h3>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
              <AssetTable assets={lithiumAssets} metal="lithium" />
            </div>
          </div>

          {/* Project Timeline */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-slate-200">📅 项目投产时间线</h3>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <ProjectTimeline data={projectTimeline} />
            </div>
          </div>
        </section>

        {/* Valuation Section */}
        <section id="valuation" className="mb-20">
          <SectionTitle subtitle="三情景敏感性分析">💰 估值模型</SectionTitle>

          {/* Sensitivity Heatmap */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-6 text-center">2026年净利润敏感性分析</h4>
            <SensitivityHeatmap data={sensitivityMatrix} />
          </div>

          {/* Profit Elasticity Chart */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">业绩弹性对比</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitElasticity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} label={{ value: '亿元', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="baseProfit" name="基础利润" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="actualProfit" name="情景利润" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Extreme Scenario 2026 */}
          <Accordion title="2026年极值压力测试（来自第二篇研报）" icon="🔥" highlight={true}>
            <p className="mb-4">
              第二篇研报提供了一个极端乐观情景的压力测试，假设铜金价格同时创历史新高：
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">极值假设 - 铜价</div>
                <div className="text-2xl font-bold text-amber-400">${extremeScenario2026.assumptions.copperPrice}/t</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">极值假设 - 金价</div>
                <div className="text-2xl font-bold" style={{ color: metalColors.gold }}>${extremeScenario2026.assumptions.goldPrice}/oz</div>
              </div>
            </div>

            <h5 className="text-amber-300 font-semibold mb-3">分板块收入与毛利预测</h5>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-400">板块</th>
                    <th className="text-left py-2 px-3 text-slate-400">产量</th>
                    <th className="text-right py-2 px-3 text-slate-400">收入(亿元)</th>
                    <th className="text-right py-2 px-3 text-slate-400">毛利率</th>
                    <th className="text-right py-2 px-3 text-slate-400">贡献占比</th>
                  </tr>
                </thead>
                <tbody>
                  {extremeScenario2026.segments.map((seg, i) => (
                    <tr key={i} className="border-b border-slate-700/30">
                      <td className="py-2 px-3 font-medium" style={{ color: seg.color }}>{seg.metal}</td>
                      <td className="py-2 px-3 text-slate-300">{seg.production}</td>
                      <td className="py-2 px-3 text-right text-slate-300">{seg.revenue}</td>
                      <td className="py-2 px-3 text-right text-emerald-400">{seg.grossMargin}%</td>
                      <td className="py-2 px-3 text-right text-slate-400">{seg.marginContrib}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-600">
                    <td className="py-2 px-3 font-semibold text-slate-200">合计</td>
                    <td></td>
                    <td className="py-2 px-3 text-right font-semibold text-slate-200">{extremeScenario2026.totalRevenue}</td>
                    <td className="py-2 px-3 text-right font-semibold text-emerald-400">{extremeScenario2026.grossMarginAvg}%</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <div className="text-slate-400 text-sm mb-1">极值情景净利润</div>
              <div className="text-4xl font-bold text-emerald-400">{extremeScenario2026.netProfit}</div>
              <div className="text-emerald-400/70 text-sm mt-1">较2025年增长75-85%</div>
            </div>

            <InfoBox type="warning" title="重要提示">
              极值情景仅用于展示紫金的最大盈利弹性，并非我们的基准预测。实际投资决策应基于中性情景（净利润580亿元）进行。
            </InfoBox>
          </Accordion>

          {/* Segment Contribution Pie */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">极值情景下毛利贡献分布</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={extremeScenario2026.segments}
                    dataKey="marginContrib"
                    nameKey="metal"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {extremeScenario2026.segments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Trade Execution */}
        <section id="trade" className="mb-20">
          <SectionTitle subtitle="建仓策略与止损红线">📈 交易指引</SectionTitle>

          {/* Target Prices */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-200 mb-4">H股目标价</h4>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-slate-400">当前</span>
                <span className="text-2xl text-slate-300">HK$ {tradeGuidance.targetPrices.hShare.current}</span>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-slate-400">目标</span>
                <span className="text-4xl font-bold" style={{ color: metalColors.gold }}>
                  HK$ {tradeGuidance.targetPrices.hShare.target}
                </span>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 rounded-lg px-4 py-2 text-center">
                潜在上涨空间 +{tradeGuidance.targetPrices.hShare.upside}%
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-200 mb-4">A股目标价</h4>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-slate-400">当前</span>
                <span className="text-2xl text-slate-300">¥ {tradeGuidance.targetPrices.aShare.current}</span>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-slate-400">目标</span>
                <span className="text-4xl font-bold" style={{ color: metalColors.gold }}>
                  ¥ {tradeGuidance.targetPrices.aShare.target}
                </span>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 rounded-lg px-4 py-2 text-center">
                潜在上涨空间 +{tradeGuidance.targetPrices.aShare.upside}%
              </div>
            </div>
          </div>

          {/* Entry Strategy */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-200 mb-4">建仓节奏建议</h4>
            <div className="space-y-3">
              {tradeGuidance.entryStrategy.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-lg">
                  <div className="text-slate-400 w-36">{entry.price}</div>
                  <div className="text-slate-200 flex-1">{entry.action}</div>
                  <div className="text-emerald-400 font-semibold">{entry.position}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Invalidation Triggers */}
          <InfoBox type="error" title="失效红线 - 以下情况需重新评估投资逻辑">
            <ul className="space-y-2 mt-2">
              {tradeGuidance.invalidationTriggers.map((trigger, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>{trigger}</span>
                </li>
              ))}
            </ul>
          </InfoBox>
        </section>

        {/* Risk Factors */}
        <section id="risks" className="mb-20">
          <SectionTitle subtitle="全面风险评估">⚠️ 风险因素</SectionTitle>

          <div className="space-y-4 mb-8">
            {riskFactors.map((risk, i) => {
              const levelColors = {
                high: 'error',
                medium: 'warning',
                low: 'info'
              };
              const levelLabels = {
                high: '高风险',
                medium: '中风险',
                low: '低风险'
              };

              return (
                <InfoBox key={i} type={levelColors[risk.level]} title={`${risk.title} [${levelLabels[risk.level]}]`}>
                  <p className="text-sm">{risk.detail}</p>
                </InfoBox>
              );
            })}
          </div>

          {/* Buriticá Red Team */}
          <Accordion title="附录：哥伦比亚Buriticá风险详解（红队测试）" icon="🔴">
            <p className="mb-4 text-slate-400">{buriticaRedTeam.summary}</p>

            <h5 className="text-red-400 font-semibold mb-3">主要挑战</h5>
            {buriticaRedTeam.challenges.map((challenge, i) => (
              <div key={i} className="mb-4 p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                <div className="text-red-300 font-medium mb-2">{challenge.title}</div>
                <p className="text-slate-400 text-sm">{challenge.detail}</p>
              </div>
            ))}

            <h5 className="text-emerald-400 font-semibold mb-3 mt-6">缓释措施</h5>
            <ul className="space-y-2">
              {buriticaRedTeam.mitigations.map((mitigation, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-400">
                  <span className="text-emerald-400">✓</span>
                  <span>{mitigation}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="text-slate-300 font-medium mb-2">结论</div>
              <p className="text-slate-400 text-sm">{buriticaRedTeam.conclusion}</p>
            </div>
          </Accordion>
        </section>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-slate-800">
          <p className="text-slate-500 text-sm mb-2">
            本报告基于公开信息整理，仅供参考，不构成投资建议
          </p>
          <p className="text-slate-600 text-xs">
            数据来源：公司公告、券商研报、行业数据库 | 更新日期：2026年2月
          </p>
        </footer>
      </main>
    </div>
  );
}
