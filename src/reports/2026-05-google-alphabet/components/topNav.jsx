// Sticky horizontal anchor nav for the Alphabet report page.
// Sits below the global Navbar (which is sticky top: 0; ~60px tall).
// Highlights the section currently in view via IntersectionObserver.

import { useEffect, useState, useRef } from 'react';

export const navSections = [
  { id: 'overview', label: '概览' },
  { id: 'kpi', label: 'KPI 仪表盘' },
  { id: 'trends', label: '趋势图' },
  { id: 'mod1-revenue', label: '营收 / 业务线' },
  { id: 'mod2-profit', label: '盈利 / SBC' },
  { id: 'mod3-cost', label: '成本结构' },
  { id: 'mod4-capex', label: 'CapEx ★' },
  { id: 'mod5-capital', label: '资本配置' },
  { id: 'mod6-bs', label: '资产负债' },
  { id: 'mod7-segment', label: '分部深度' },
  { id: 'mod8-ops', label: '运营 / AI' },
  { id: 'mod9-valuation', label: '估值 / SOTP' },
  { id: 'mod10-guidance', label: '指引' },
  { id: 'ec', label: 'EC 引用' },
  { id: 'mod11-risk', label: '风险 / 自检' },
];

const NAV_OFFSET = 110; // approx global navbar (60) + chip bar (50)

export const TopNav = () => {
  const [activeId, setActiveId] = useState(navSections[0].id);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // mark a section as "active" when its top crosses 130px below viewport top
        // and it stays in the upper 60% of the viewport
        rootMargin: '-130px 0px -40% 0px',
        threshold: 0,
      },
    );

    navSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll the active chip into view inside the horizontal scroller
  useEffect(() => {
    const chip = containerRef.current?.querySelector(`[data-chip="${activeId}"]`);
    if (chip) {
      chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeId]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <div
      className="sticky top-[60px] z-30 -mx-4 mb-6 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md"
    >
      <div ref={containerRef} className="max-w-6xl mx-auto px-4 overflow-x-auto scrollbar-hide">
        <nav className="flex gap-1.5 py-2 whitespace-nowrap">
          {navSections.map((s) => {
            const active = s.id === activeId;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-chip={s.id}
                onClick={(e) => handleClick(e, s.id)}
                className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700/40 hover:text-slate-200 hover:border-slate-600/60'
                }`}
              >
                {s.label}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
