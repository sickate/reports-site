import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line, Cell,
  Legend, PieChart, Pie
} from 'recharts';

// ==================== 工具组件 ====================

// 滚动动画Hook
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible];
};

// 动画数字组件
const AnimatedNumber = ({ value, suffix = '%' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [ref, isVisible] = useScrollAnimation();
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const end = parseInt(value);
    const timer = setInterval(() => {
      start += end / 60;
      if (start >= end) { setDisplayValue(end); clearInterval(timer); }
      else setDisplayValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, value]);
  return <span ref={ref}>{displayValue}{suffix}</span>;
};

// 折叠面板组件
const Accordion = ({ title, children, defaultOpen = false, highlight = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`border rounded-xl overflow-hidden mb-4 ${highlight ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-700/50 bg-slate-800/30'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/20 transition-all">
        <span className={`font-semibold text-lg ${highlight ? 'text-amber-300' : 'text-slate-100'}`}>{title}</span>
        <div className="flex items-center gap-2">
          {!isOpen && <span className="text-xs text-slate-500">点击展开</span>}
          <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 pt-2">{children}</div>
      </div>
    </div>
  );
};

// 信息提示组件
const InfoBox = ({ type = 'info', title, children }) => {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  };
  return (
    <div className={`border rounded-xl p-5 my-4 ${styles[type]}`}>
      {title && <div className="font-bold mb-2">{title}</div>}
      <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
};

// 引用块组件
const Quote = ({ children, author }) => (
  <blockquote className="border-l-4 border-amber-500 pl-5 py-3 my-6 bg-slate-800/30 rounded-r-xl">
    <p className="text-slate-200 italic leading-relaxed">{children}</p>
    {author && <cite className="text-amber-400 text-sm mt-2 block not-italic">— {author}</cite>}
  </blockquote>
);

// 术语定义组件
const Term = ({ term, definition, children }) => (
  <div className="bg-slate-800/50 rounded-xl p-5 my-3 border border-slate-700/50">
    <div className="flex items-start gap-3">
      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>
      <div>
        <span className="font-bold text-amber-300">{term}</span>
        <span className="text-slate-400 mx-2">—</span>
        <span className="text-slate-300">{definition}</span>
        {children && <div className="mt-2 text-slate-400 text-sm">{children}</div>}
      </div>
    </div>
  </div>
);

// 实验卡片组件
const ExperimentCard = ({ year, researcher, title, children }) => (
  <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 border border-slate-700/50 my-6">
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-lg text-sm">{year}</div>
      <div>
        <h4 className="text-lg font-bold text-slate-100">{title}</h4>
        <p className="text-slate-400 text-sm">{researcher}</p>
      </div>
    </div>
    <div className="text-slate-300 leading-relaxed">{children}</div>
  </div>
);

// 对比表格组件
const ComparisonTable = ({ headers, rows }) => (
  <div className="overflow-x-auto my-6">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="bg-slate-800 text-slate-200 font-semibold px-4 py-3 text-left border border-slate-700">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'}>
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 text-slate-300 text-sm border border-slate-700/50">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 步骤列表组件
const StepList = ({ steps }) => (
  <div className="space-y-4 my-4">
    {steps.map((step, idx) => (
      <div key={idx} className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center flex-shrink-0">
          {idx + 1}
        </div>
        <div className="flex-1 pt-1">
          <div className="text-slate-200 font-medium">{step.title}</div>
          <div className="text-slate-400 text-sm mt-1">{step.content}</div>
        </div>
      </div>
    ))}
  </div>
);

// ==================== 主组件 ====================

export default function EnigmaOfReasonComplete() {
  const [activeSection, setActiveSection] = useState(0);

  // 图表数据
  const wasonData = [
    { name: '个体推理', correct: 10, incorrect: 90 },
    { name: '群体讨论', correct: 80, incorrect: 20 },
  ];

  const coinFlipData = [
    { condition: '无硬币\n直接选择', selfBenefit: 80, fairAllocation: 20 },
    { condition: '有硬币\n可选使用', selfBenefit: 90, fairAllocation: 10 },
    { condition: '标记硬币\n结果清晰', selfBenefit: 86, fairAllocation: 14 },
    { condition: '镜子+硬币\n自我意识', selfBenefit: 50, fairAllocation: 50 },
  ];

  const moralRatingData = [
    { category: '直接拿好任务', rating: 4.00, color: '#ef4444' },
    { category: '掷硬币（赢了）', rating: 7.45, color: '#22c55e' },
    { category: '掷硬币（作弊）', rating: 5.56, color: '#f59e0b' },
    { category: '掷硬币后拿', rating: 7.30, color: '#3b82f6' },
    { category: '给他人好任务', rating: 8.25, color: '#10b981' },
  ];

  const cognitiveLoadData = [
    { condition: '控制-判断自己', fairness: 5.8, category: '控制条件' },
    { condition: '控制-判断他人', fairness: 3.2, category: '控制条件' },
    { condition: '负荷-判断自己', fairness: 3.4, category: '认知负荷' },
    { condition: '负荷-判断他人', fairness: 3.3, category: '认知负荷' },
  ];

  const reasonFunctionData = [
    { subject: '辩护功能', A: 95, fullMark: 100 },
    { subject: '说服论证', A: 90, fullMark: 100 },
    { subject: '评估他人', A: 85, fullMark: 100 },
    { subject: '社会协调', A: 92, fullMark: 100 },
    { subject: '独立求真', A: 30, fullMark: 100 },
    { subject: '决策优化', A: 35, fullMark: 100 },
  ];

  const sections = [
    { id: 'intro', title: '导言' },
    { id: 'paradox', title: '理性悖论' },
    { id: 'theory', title: '论证理论' },
    { id: 'wason', title: 'Wason实验' },
    { id: 'bias', title: '确认偏误' },
    { id: 'hypocrisy', title: '道德伪善' },
    { id: 'evolution', title: '进化起源' },
    { id: 'practice', title: '实践应用' },
  ];

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* 装饰背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* ==================== Hero区域 ==================== */}
      <header className="relative pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-8">
            <span className="text-amber-300 text-sm font-medium">📖 深度书评 · 认知科学 · 进化心理学</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent">
              理性之谜
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-2 font-light">The Enigma of Reason</p>
          <p className="text-lg text-slate-500 mb-8">Hugo Mercier & Dan Sperber 著 · Harvard University Press · 2017</p>

          {/* 核心论点卡片 */}
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-12">
            <div className="text-amber-400 text-sm font-semibold mb-3">📌 核心论点</div>
            <blockquote className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed">
              "理性的真正功能不是帮助个体独自发现真理，而是在社会交流中说服他人、评估他人的论点。确认偏误和我方偏误不是认知缺陷，而是设计特征。"
            </blockquote>
          </div>

          {/* 关键数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {[
              { value: '10', label: '个体Wason任务正确率', suffix: '%', desc: '单独推理时' },
              { value: '80', label: '群体讨论后正确率', suffix: '%', desc: '集体论辩后' },
              { value: '90', label: '硬币实验自利选择率', suffix: '%', desc: '即使掷了硬币' },
              { value: '2000', label: '年传统观点历史', suffix: '+', desc: '从亚里士多德至今' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-black text-amber-400 mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-slate-300 font-medium">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* 作者介绍 */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <div className="text-amber-400 font-bold mb-2">Hugo Mercier</div>
              <p className="text-slate-400 text-sm">法国国家科学研究中心（CNRS）认知科学研究员，专注于推理和论证的进化与认知机制研究。</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30">
              <div className="text-amber-400 font-bold mb-2">Dan Sperber</div>
              <p className="text-slate-400 text-sm">法国社会科学高等研究院荣誉教授，认知科学和人类学领域的先驱，关联理论（Relevance Theory）的创始人之一。</p>
            </div>
          </div>
        </div>
      </header>

      {/* ==================== 导航栏 ==================== */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 py-3 px-6">
        <div className="max-w-5xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {sections.map((section, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveSection(idx); scrollToSection(section.id); }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                activeSection === idx 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-700/50'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </nav>

      {/* ==================== 主内容区域 ==================== */}
      <main className="relative px-6 py-12">
        <div className="max-w-4xl mx-auto">

          {/* ==================== 第一部分：导言 ==================== */}
          <section id="intro" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg">1</span>
              导言：为什么这本书重要
            </h2>

            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed text-lg mb-6">
                两千多年来，西方哲学将理性视为人类认知的最高能力——它帮助我们发现真理、做出明智决策、超越本能和情感的局限。从亚里士多德到笛卡尔，从康德到当代认知科学家，这种"<strong className="text-amber-300">理智主义</strong>"（intellectualist）观点一直占据主导地位。然而，Hugo Mercier和Dan Sperber在《理性之谜》中提出了一个颠覆性的观点：<strong className="text-emerald-300">这种传统理解是错误的</strong>。
              </p>

              <Quote author="Hugo Mercier & Dan Sperber">
                理性不是帮助个体独自获取真理的工具。它是一种社会能力，进化的目的是让我们在交流中说服他人、评估他人的论点。那些我们通常视为"认知缺陷"的偏见，实际上是理性正常运作的特征。
              </Quote>

              <p className="text-slate-300 leading-relaxed mb-6">
                这本书的核心主张被称为"<strong className="text-amber-300">论证理论</strong>"（Argumentative Theory of Reasoning）或"<strong className="text-amber-300">交互论</strong>"（Interactionist Theory）。它不仅挑战了哲学传统，还对心理学、教育学、政治学和日常生活有深远影响。如果理性真的是为社会论证而设计的，那么我们应该如何看待确认偏误？如何改善决策？如何设计更好的教育和制度？
              </p>

              <InfoBox type="warning" title="本书要回答的核心问题">
                <ul className="space-y-2 mt-2">
                  <li>• 为什么人类是唯一进化出"理性"的物种？</li>
                  <li>• 为什么人类在推理时表现出系统性的偏见和错误？</li>
                  <li>• 如果理性是为了求真，为什么我们如此擅长为自己找借口？</li>
                  <li>• 为什么群体讨论往往能产生比个体更好的结论？</li>
                  <li>• 确认偏误是"缺陷"还是"特征"？</li>
                </ul>
              </InfoBox>
            </div>
          </section>

          {/* ==================== 第二部分：理性悖论 ==================== */}
          <section id="paradox" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white text-lg">2</span>
              理性的双重之谜
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              Mercier和Sperber的论证起点是一个看似简单却深刻的悖论。传统观点认为理性是帮助个体做出更好决策的"认知超能力"，但这种观点无法解释两个根本性的问题：
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-red-900/30 to-slate-800/40 border border-red-500/30 rounded-2xl p-6">
                <div className="text-5xl font-black text-red-400 mb-3">谜题 1</div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">为什么只有人类进化出理性？</h3>
                <p className="text-slate-300 leading-relaxed">
                  如果理性是帮助个体获取更好知识、做出更明智决策的能力，那么它对任何环境中的任何动物都应该有巨大的生存优势。蜜蜂如果能"推理"出花蜜的位置，猎豹如果能"推断"猎物的逃跑路线，它们的生存能力会大大增强。
                </p>
                <p className="text-slate-400 text-sm mt-4">
                  然而，理性似乎是人类独有的能力。这表明理性的进化必须依赖于某些人类特有的条件——这个条件是什么？
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-900/30 to-slate-800/40 border border-red-500/30 rounded-2xl p-6">
                <div className="text-5xl font-black text-red-400 mb-3">谜题 2</div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">为什么人类推理表现如此糟糕？</h3>
                <p className="text-slate-300 leading-relaxed">
                  如果理性是为了帮助我们发现真理，为什么人类在推理时表现出如此多的系统性偏见和错误？确认偏误、我方偏误、沉没成本谬误、后见之明偏见……心理学家发现了数十种"认知偏见"。
                </p>
                <p className="text-slate-400 text-sm mt-4">
                  一个为求真而设计的系统，不应该产生这么多系统性的错误。这要么意味着理性设计得很糟糕，要么意味着我们对理性功能的理解是错误的。
                </p>
              </div>
            </div>

            <Accordion title="传统理性主义观点的核心假设" defaultOpen={true}>
              <p className="text-slate-300 leading-relaxed mb-4">
                从古希腊哲学到现代认知科学，传统观点对理性有几个核心假设：
              </p>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-red-400 font-bold mb-2">假设1：理性是个体能力</div>
                  <p className="text-slate-400 text-sm">理性的典型运作场景是独自沉思的思想者——笛卡尔在火炉旁的冥想，牛顿在苹果树下的顿悟。推理是个人内部的认知过程。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-red-400 font-bold mb-2">假设2：理性的功能是求真</div>
                  <p className="text-slate-400 text-sm">理性帮助我们获得关于世界的准确信念，纠正直觉的错误，做出基于证据的判断。真理是理性追求的终极目标。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-red-400 font-bold mb-2">假设3：理性优于直觉</div>
                  <p className="text-slate-400 text-sm">理性（"系统2"）是缓慢、费力但准确的；直觉（"系统1"）是快速、自动但容易出错的。理性的作用是纠正直觉的偏差。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-red-400 font-bold mb-2">假设4：偏见是缺陷</div>
                  <p className="text-slate-400 text-sm">确认偏误、我方偏误等现象是理性系统的"bug"，是进化的不完善或认知资源的限制导致的错误。</p>
                </div>
              </div>
              
              <InfoBox type="error" title="传统观点面临的困境">
                如果这些假设是正确的，那么：理性应该在所有动物中进化出来（但没有）；人类应该是优秀的独立推理者（但不是）；训练和教育应该能消除偏见（但效果有限）；高智商应该与低偏见相关（但研究表明不相关）。
              </InfoBox>
            </Accordion>

            <Accordion title="论证理论如何解决这些悖论">
              <p className="text-slate-300 leading-relaxed mb-4">
                Mercier和Sperber提出了一个优雅的解决方案：<strong className="text-amber-300">理性是对人类"超社会性"生态位的适应</strong>。
              </p>
              
              <Quote>
                理性之所以只在人类中进化出来，是因为它的功能不是帮助个体独自求真，而是在高度依赖社会交流的物种中实现有效的沟通和协调。理性是为论证而设计的。
              </Quote>

              <ComparisonTable 
                headers={['问题', '传统观点的解释', '论证理论的解释']}
                rows={[
                  ['为什么只有人类有理性？', '不清楚，可能是偶然', '人类是唯一高度依赖语言交流的物种'],
                  ['为什么推理表现糟糕？', '系统缺陷、资源限制', '独自推理不是理性的设计用途'],
                  ['为什么存在确认偏误？', '认知bug需要克服', '为"我方"辩护是设计功能'],
                  ['为什么群体讨论有效？', '集体智慧的涌现', '这才是理性的正常运作环境'],
                  ['高智商为何不减少偏见？', '偏见与智力无关', '偏见是正常功能，不是缺陷'],
                ]}
              />

              <p className="text-slate-300 leading-relaxed mt-4">
                在这个框架下，所有的"反常现象"都变得可以理解：理性在社会交流中表现优异，因为这是它进化的目的；理性在独自推理时表现糟糕，因为这不是它的设计用途；确认偏误和我方偏误是特征而非缺陷，因为在群体论辩中，每个人为自己的立场辩护正是实现认知分工的方式。
              </p>
            </Accordion>
          </section>

          {/* ==================== 第三部分：论证理论框架 ==================== */}
          <section id="theory" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg">3</span>
              论证理论的核心框架
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              要理解论证理论，首先需要澄清几个核心概念。Mercier和Sperber对"推断"、"直觉"和"推理"进行了精确的技术性区分，这些区分对于理解他们的论点至关重要。
            </p>

            <Accordion title="核心概念：推断、直觉与推理" defaultOpen={true} highlight={true}>
              <Term term="推断 (Inference)" definition="从已有信息中提取新信息的过程">
                这是所有动物共有的能力。当一只狗听到门铃声就知道有人来了，它就是在进行推断。推断由大脑中多个特定领域的模块执行，大多数是无意识的自动过程。人类和动物的大脑中有专门处理面孔识别、空间导航、社会关系等的推断模块。
              </Term>

              <Term term="直觉 (Intuition)" definition="通过无意识过程得出的意识结论">
                直觉的特点是我们能意识到结论本身，但意识不到产生这个结论的理由。当你"感觉"某人不可信，或者"觉得"某个答案是对的，这就是直觉。直觉是推断过程的输出，但推断过程本身是无意识的。
              </Term>

              <Term term="推理 (Reasoning)" definition={"一种特殊类型的推断，专门处理\u201c理由\u201d这一特定领域"}>
                <strong className="text-amber-300">这是论证理论最关键的洞见</strong>：推理并非直觉推断的替代品，而是对"理由"这种特殊表征进行的直觉推断。当我们推理时，我们产生的是关于"X是否构成Y的理由"的直觉判断。换句话说，推理本身就是一个直觉模块，只不过它的专业领域是"理由"。
              </Term>

              <InfoBox type="info" title="对双过程理论的挑战">
                传统的双过程理论（如Kahneman的系统1与系统2）将直觉（快）与理性（慢）对立起来。但Mercier和Sperber认为这种对立是不必要的。他们指出："双过程叙事与宗教隐喻的关系不亚于科学——'理性对直觉'实际上就是'理性对情感'，也就是'精神对肉体'。"
                <br /><br />
                在论证理论中，推理不是直觉的对立面或纠正者，而是一种专门的直觉能力——专门产生和评估"理由"的直觉。
              </InfoBox>
            </Accordion>

            <Accordion title="理性的双重社会功能">
              <p className="text-slate-300 leading-relaxed mb-6">
                论证理论认为，理性服务于两大社会功能，两者都与社会交流密切相关：
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-amber-900/30 to-slate-800/40 border border-amber-500/30 rounded-xl p-6">
                  <div className="text-amber-400 font-bold text-lg mb-3">🛡️ 辩护功能 (Justification)</div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    我们关心他人对我们的看法，需要向他人解释我们的行为和信念。这对于建立和维护声誉至关重要，因为在高度依赖合作的社会中，声誉决定了他人是否愿意与我们合作。
                  </p>
                  <p className="text-slate-400 text-sm">
                    <strong>例子：</strong>当你做出一个不寻常的决定（如辞职创业），你会感到需要向家人、朋友解释你的理由。这种解释的冲动就是辩护功能在起作用。
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/40 border border-emerald-500/30 rounded-xl p-6">
                  <div className="text-emerald-400 font-bold text-lg mb-3">💬 论证功能 (Argumentation)</div>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    论证功能有两个方面：<br />
                    <strong className="text-emerald-300">对于交流者</strong>：产生论据以说服持怀疑态度的听众<br />
                    <strong className="text-emerald-300">对于听众</strong>：评估论据的质量，接受好论据，拒绝坏论据
                  </p>
                  <p className="text-slate-400 text-sm">
                    <strong>例子：</strong>当你试图说服朋友去某家餐厅时，你会寻找各种理由（食物好、价格合理、位置方便）。这就是论证功能的"生产"面。当朋友质疑你的理由时，你们都在进行论证功能的"评估"面。
                  </p>
                </div>
              </div>

              <Quote author="Mercier & Sperber">
                理性首先是一种社会能力。理性的典型运作场景不是科学家独自沉思，而是苏格拉底式的对话——在对话中，我们提出论点、评估反驳、调整立场。
              </Quote>

              {/* 理性功能雷达图 */}
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mt-6">
                <h4 className="text-lg font-bold text-slate-100 mb-4 text-center">理性功能强度分布：论证理论视角</h4>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={reasonFunctionData}>
                      <PolarGrid stroke="#475569" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                      <Radar name="功能强度" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-slate-400 text-sm mt-4">
                  论证理论认为理性在社会功能（辩护、说服、评估、协调）上表现强劲，<br />而在传统认为的"独立求真"和"决策优化"上相对较弱——因为这不是理性的设计用途
                </p>
              </div>
            </Accordion>

            <Accordion title="从苏格拉底到亚里士多德：历史转向">
              <p className="text-slate-300 leading-relaxed mb-6">
                Mercier和Sperber追溯了一个关键的历史转向，这个转向塑造了西方对理性的理解长达两千年：
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800/40 border border-emerald-500/30 rounded-xl p-6">
                  <div className="text-6xl mb-4 text-center">🏛️</div>
                  <h4 className="text-xl font-bold text-emerald-300 mb-3 text-center">苏格拉底式理性</h4>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    苏格拉底理解推理的社会本质。他的方法是<strong className="text-emerald-300">对话</strong>——通过提问、质疑、反驳来检验信念。苏格拉底从不独自写作，他的智慧在与他人的交流中展现。
                  </p>
                  <p className="text-slate-400 text-sm">
                    苏格拉底式推理的典范是：对话、说服、理解论据的力量。真理在交流中浮现。
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-900/30 to-slate-800/40 border border-red-500/30 rounded-xl p-6">
                  <div className="text-6xl mb-4 text-center">📚</div>
                  <h4 className="text-xl font-bold text-red-300 mb-3 text-center">亚里士多德式理性</h4>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    亚里士多德提供了一个新的推理者形象：<strong className="text-red-300">独自推理以更好理解世界的科学家</strong>。理性的典范变成了独自沉思、系统分析、建构理论。
                  </p>
                  <p className="text-slate-400 text-sm">
                    这一转向确立了统治西方哲学两千年的"孤独推理者理想"，从笛卡尔的沉思到康德的纯粹理性批判。
                  </p>
                </div>
              </div>

              <InfoBox type="warning" title="Mercier和Sperber的呼吁">
                "我们需要多一点苏格拉底，少一点亚里士多德——重新发现推理的对话本质，在社会交流中释放理性的真正力量。"
              </InfoBox>
            </Accordion>

            <Accordion title="交互论视角：理性如何在群体中运作">
              <p className="text-slate-300 leading-relaxed mb-4">
                论证理论的"交互论"视角与传统观点截然不同。它关注的不是个体如何独自推理，而是理性如何在社会交互中发挥作用：
              </p>

              <StepList steps={[
                {
                  title: '个体产生偏向性论据',
                  content: '每个人倾向于为自己的立场寻找支持理由（我方偏见），这不是缺陷，而是认知分工的基础。'
                },
                {
                  title: '在交流中提出论据',
                  content: '当人们交流时，他们会提出支持自己立场的论据，试图说服持不同观点的人。'
                },
                {
                  title: '他人评估和反驳',
                  content: '听众会批判性地评估论据，找出弱点，提出反驳。人们评估他人论据时比评估自己的更客观。'
                },
                {
                  title: '论据的竞争与筛选',
                  content: '好的论据在交流中存活下来，坏的论据被淘汰。这是一个"论据的自然选择"过程。'
                },
                {
                  title: '群体达成更好的结论',
                  content: '通过这种分布式的论证过程，群体整体能够达成比任何个体单独推理更好的结论。'
                },
              ]} />

              <Quote author="Mercier & Sperber">
                确认偏误和我方偏误在群体论辩中实现了高效的认知分工：每个人负责找支持自己立场的论据，他人负责找反驳。这样，所有可能的论据都会被探索，最强的论据会胜出。
              </Quote>
            </Accordion>
          </section>

          {/* ==================== 第四部分：Wason选择任务 ==================== */}
          <section id="wason" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg">4</span>
              Wason选择任务：关键实验证据
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              Wason选择任务是认知心理学史上被研究得最多的实验之一。它的结果长期困扰着研究者，但在论证理论的框架下变得完全可以理解。
            </p>

            <ExperimentCard year="1966" researcher="Peter Wason, 伦敦大学学院" title="Wason选择任务（四卡片问题）">
              <div className="space-y-6">
                <div>
                  <h5 className="text-amber-300 font-bold mb-3">实验设计</h5>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    实验者向参与者展示四张卡片，每张卡片一面是字母、另一面是数字。参与者能看到：
                  </p>
                  
                  <div className="flex justify-center gap-4 mb-6 flex-wrap">
                    {[
                      { front: 'E', back: '?', desc: '元音字母', highlight: true },
                      { front: 'K', back: '?', desc: '辅音字母', highlight: false },
                      { front: '4', back: '?', desc: '偶数', highlight: false },
                      { front: '7', back: '?', desc: '奇数', highlight: true },
                    ].map((card, idx) => (
                      <div key={idx} className="text-center">
                        <div className={`w-20 h-28 rounded-xl border-2 flex items-center justify-center mb-2 transition-all ${
                          card.highlight 
                            ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 border-emerald-400' 
                            : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600'
                        }`}>
                          <span className="text-3xl font-bold text-slate-100">{card.front}</span>
                        </div>
                        <p className="text-slate-400 text-xs">{card.desc}</p>
                        {card.highlight && <p className="text-emerald-400 text-xs mt-1">✓ 需翻开</p>}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
                    <p className="text-slate-200 text-center">
                      <strong className="text-amber-300">给定规则：</strong>"如果卡片一面是元音字母，那么另一面是偶数"
                    </p>
                    <p className="text-slate-400 text-center text-sm mt-2">
                      问题：你必须翻开哪些卡片才能检验这条规则是否成立？
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <div className="text-red-400 font-bold mb-2">❌ 大多数人的答案（约90%）</div>
                    <p className="text-slate-200 font-medium mb-2">翻开 E 和 4</p>
                    <p className="text-slate-400 text-sm">
                      人们倾向于寻找<strong>确认</strong>规则的证据：E是元音，如果背面是偶数就确认了规则；4是偶数，如果正面是元音也确认了规则。
                    </p>
                    <p className="text-red-400 text-sm mt-2">
                      <strong>问题：</strong>4的背面即使是辅音（如K），也不违反规则（规则没说"只有元音背面是偶数"）。翻4没有意义。
                    </p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                    <div className="text-emerald-400 font-bold mb-2">✓ 正确答案（仅约10%）</div>
                    <p className="text-slate-200 font-medium mb-2">翻开 E 和 7</p>
                    <p className="text-slate-400 text-sm">
                      要检验规则，需要寻找可能的<strong>反例</strong>：E是元音，如果背面不是偶数就否证了规则；7是奇数，如果正面是元音就否证了规则。
                    </p>
                    <p className="text-emerald-400 text-sm mt-2">
                      <strong>逻辑：</strong>K和4无论背面是什么都不能否证规则，所以翻它们没有信息价值。
                    </p>
                  </div>
                </div>

                <InfoBox type="error" title="为什么这个结果令人困扰">
                  这个任务在逻辑上并不复杂——它只需要理解条件命题（如果P则Q）的否证条件（P且非Q）。大多数受过教育的成年人都学过这种逻辑。然而，即使是逻辑学教授，在第一次遇到这个任务时也经常犯错。这表明人类的推理系统并不是为抽象逻辑推理设计的。
                </InfoBox>
              </div>
            </ExperimentCard>

            <ExperimentCard year="1992" researcher="Leda Cosmides & John Tooby, 加州大学圣芭芭拉分校" title="社会契约版本：正确率飙升">
              <p className="text-slate-300 leading-relaxed mb-4">
                进化心理学家Cosmides和Tooby发现了一个惊人的现象：当同样的逻辑结构被包装成社会契约形式时，正确率会从10%跃升至<strong className="text-emerald-300">75-80%</strong>。
              </p>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
                <h5 className="text-blue-300 font-bold mb-3">社会契约版本示例</h5>
                <p className="text-slate-200 mb-4">
                  <strong>规则：</strong>"如果你在喝酒，你必须年满18岁"
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {[
                    { label: '喝酒', desc: '行为', check: true },
                    { label: '喝可乐', desc: '行为', check: false },
                    { label: '25岁', desc: '年龄', check: false },
                    { label: '16岁', desc: '年龄', check: true },
                  ].map((card, idx) => (
                    <div key={idx} className="bg-slate-800 rounded-lg px-4 py-3 text-center">
                      <div className="text-slate-200 font-medium">{card.label}</div>
                      <div className="text-slate-500 text-xs">{card.desc}</div>
                      {card.check && <div className="text-emerald-400 text-xs mt-1">✓ 需检查</div>}
                    </div>
                  ))}
                </div>
                <p className="text-slate-400 text-sm mt-4 text-center">
                  大多数人立刻意识到需要检查"喝酒"的人（看他们是否成年）和"16岁"的人（看他们是否在喝酒）
                </p>
              </div>

              <InfoBox type="success" title="进化解释">
                为什么同样的逻辑结构在不同包装下表现如此不同？Cosmides和Tooby认为，人类大脑进化出了专门检测<strong>社会欺骗</strong>的认知机制。在人类进化的环境中，识别谁在违反社会规则、谁在"占便宜"对生存至关重要。我们天生擅长这种检测，但对抽象逻辑没有同样的适应。
              </InfoBox>
            </ExperimentCard>

            <ExperimentCard year="1998" researcher="David Moshman & Molly Geil, 内布拉斯加大学" title="群体推理：正确率飙升至80%">
              <p className="text-slate-300 leading-relaxed mb-4">
                这项研究提供了论证理论最直接的支持证据。Moshman和Geil让参与者在小组中讨论Wason选择任务，而不是独自回答。
              </p>

              <div className="h-72 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wasonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
                    <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8' }} width={100} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} 
                      formatter={(v) => [`${v}%`, '正确率']} 
                    />
                    <Bar dataKey="correct" radius={[0, 4, 4, 0]}>
                      <Cell fill="#ef4444" />
                      <Cell fill="#22c55e" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-red-400">~10%</div>
                  <p className="text-slate-400 text-sm">个体独立推理正确率</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-amber-400">~80%</div>
                  <p className="text-slate-400 text-sm">群体讨论后正确率</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-black text-emerald-400">8x</div>
                  <p className="text-slate-400 text-sm">正确率提升倍数</p>
                </div>
              </div>

              <InfoBox type="purple" title={"\u201c真理制胜\u201d(Truth Wins)现象"}>
                研究者发现了一个关键现象：<strong>一旦小组中有一个人理解了正确答案，他们通常能通过论证说服其他成员</strong>。
                <br /><br />
                关键的是，参与者并非简单地服从"聪明人"或多数人。对话记录显示，只有在被充分说服后，人们才会改变想法。这正是论证功能的体现：好的论据能够说服持怀疑态度的听众。
              </InfoBox>

              <Quote author="Moshman & Geil">
                我们观察到的不是服从或从众，而是真正的论证过程。当有人提出正确答案并解释理由时，其他人会质疑、反驳，最终在理解了论据的力量后才改变立场。
              </Quote>
            </ExperimentCard>

            <Accordion title="论证理论如何解释这些发现">
              <p className="text-slate-300 leading-relaxed mb-4">
                Wason选择任务的三组发现（个体失败、社会契约成功、群体讨论成功）在论证理论框架下形成了完美的一致性：
              </p>

              <ComparisonTable 
                headers={['发现', '传统解释的困难', '论证理论的解释']}
                rows={[
                  [
                    '个体正确率仅10%', 
                    '为什么逻辑能力这么差？', 
                    '独自推理不是理性的设计用途，缺乏论证语境'
                  ],
                  [
                    '社会契约版本75-80%', 
                    '为什么包装不同结果就不同？', 
                    '检测社会欺骗是进化适应，与论证评估相关'
                  ],
                  [
                    '群体讨论后80%', 
                    '群体智慧如何涌现？', 
                    '这才是理性的正常运作环境——论证与反驳'
                  ],
                  [
                    '"真理制胜"现象', 
                    '为什么好论据能说服人？', 
                    '评估他人论据正是理性的核心功能之一'
                  ],
                ]}
              />

              <InfoBox type="success" title="核心洞见">
                个体在缺乏论证语境的抽象任务中表现糟糕，这不是理性的失败，而是理性被放在了错误的环境中。当推理被置于其进化设计的社会环境中——有论证、有反驳、有分歧——人类展现出卓越的推理能力。
              </InfoBox>
            </Accordion>
          </section>

          {/* ==================== 第五部分：确认偏误与我方偏误 ==================== */}
          <section id="bias" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-lg">5</span>
              确认偏误与我方偏误：设计特征而非缺陷
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              确认偏误（confirmation bias）和我方偏误（myside bias）长期被视为人类认知的重大缺陷。但Mercier和Sperber认为，这些"偏误"实际上是理性正常运作的特征——在论证的语境下，它们是功能而非bug。
            </p>

            <ExperimentCard year="1960" researcher="Peter Wason, 伦敦大学学院" title="2-4-6任务：确认偏误的经典证据">
              <div className="space-y-4">
                <h5 className="text-amber-300 font-bold">实验设计</h5>
                <p className="text-slate-300 leading-relaxed">
                  实验者脑中有一条关于数字三元组的规则（实际上是"任何递增序列"），但参与者不知道这个规则。实验者给参与者展示<strong className="text-amber-300">2-4-6</strong>作为符合规则的例子，要求参与者通过提出自己的三元组来发现规则。对于每个三元组，实验者只回答"符合"或"不符合"。
                </p>

                <div className="bg-slate-800/50 rounded-xl p-5">
                  <h5 className="text-slate-200 font-bold mb-3">典型参与者的行为模式</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400">假设：</span>
                      <span className="text-slate-300">"规则是偶数递增2"</span>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-slate-400 text-sm mb-2">测试的三元组（全部符合规则）：</p>
                      <div className="flex flex-wrap gap-2">
                        {['8-10-12', '100-102-104', '22-24-26', '50-52-54'].map((n, i) => (
                          <span key={i} className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded text-sm">
                            {n} ✓
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-3">
                      <p className="text-red-400 text-sm">
                        <strong>问题：</strong>参与者几乎不测试可能否证假设的三元组，如1-2-3（奇数）、5-3-1（递减）、2-5-11（不等差）。这些都符合真正的规则（递增序列），但能帮助排除错误假设。
                      </p>
                    </div>
                  </div>
                </div>

                <InfoBox type="warning" title="结果">
                  大多数参与者无法发现真正的规则。他们不断测试符合自己假设的正例，得到"符合"的反馈后就更加确信自己是对的，最终宣布了错误的规则。这就是<strong>确认偏误</strong>：人们倾向于寻找支持而非挑战自己假设的证据。
                </InfoBox>
              </div>
            </ExperimentCard>

            <ExperimentCard year="2005" researcher="Cowley & Byrne" title="关键发现：偏误是选择性的">
              <p className="text-slate-300 leading-relaxed mb-4">
                后续研究揭示了一个关键细节：当假设来自他人时，参与者的行为模式发生了显著变化。
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                  <h5 className="text-red-300 font-bold mb-3">测试自己的假设时</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    参与者主要寻找支持证据，很少测试可能否证假设的例子。确认偏误明显。
                  </p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                  <h5 className="text-emerald-300 font-bold mb-3">测试他人的假设时</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    参与者更愿意寻找反例，更积极地尝试否证假设。表现出更好的"科学思维"。
                  </p>
                </div>
              </div>

              <InfoBox type="success" title="论证理论的解释">
                这个发现完美契合论证理论：我们的"偏误"是<strong>选择性的</strong>，专门针对我们自己的观点。这正是论证功能的体现——
                <br /><br />
                • <strong>为自己的立场辩护</strong>时，我们寻找支持证据（我方偏误）<br />
                • <strong>评估他人的立场</strong>时，我们寻找反驳证据（批判性评估）<br /><br />
                这种"双重标准"不是缺陷，而是认知分工的基础：每个人负责为自己的观点找论据，评估他人的观点时则扮演"魔鬼代言人"。
              </InfoBox>
            </ExperimentCard>

            <ExperimentCard year="1979" researcher="Lord, Ross & Lepper, 斯坦福大学" title="信念极化：混合证据导致更极端立场">
              <p className="text-slate-300 leading-relaxed mb-4">
                这项经典研究展示了确认偏误如何导致态度极化——一个在传统框架下难以理解的现象。
              </p>

              <StepList steps={[
                {
                  title: '选择参与者',
                  content: '研究者招募了对死刑持明确立场的人：一组支持死刑（认为它有威慑作用），一组反对死刑。'
                },
                {
                  title: '呈现混合证据',
                  content: '向所有参与者展示两项关于死刑威慑效果的研究——一项支持威慑效果，一项反对。两项研究的方法论质量经过控制，客观上同样可信。'
                },
                {
                  title: '测量态度变化',
                  content: '在阅读研究前后测量参与者对死刑的态度强度。'
                },
              ]} />

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 my-6">
                <h5 className="text-red-300 font-bold mb-3">令人震惊的结果</h5>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>参与者认为支持自己立场的研究方法论更严谨、结论更可信</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span>参与者认为反对自己立场的研究有各种方法论缺陷</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span><strong>阅读完全相同的混合证据后，双方的立场都变得更加极端</strong></span>
                  </li>
                </ul>
              </div>

              <InfoBox type="warning" title="传统观点的困境">
                这个结果在传统"理性求真"的框架下是不可理解的：如果理性的功能是客观评估证据、收敛于真理，那么阅读混合证据应该让人更加中立，而非更加极端。为什么同样的证据会让人更坚定地持有对立的观点？
              </InfoBox>

              <InfoBox type="success" title="论证理论的解释">
                在论证理论框架下，这是预期的结果。推理的功能是为自己的立场寻找支持论据——<br /><br />
                • 支持者从支持研究中找到"我早就知道"的证据，从反对研究中找到方法论漏洞<br />
                • 反对者做完全相反的事情<br />
                • 结果是双方都认为证据"总体上"支持自己，态度因此加强<br /><br />
                这不是理性的失败，而是理性按照其设计目的正常运作：为"我方"辩护。
              </InfoBox>
            </ExperimentCard>

            <ExperimentCard year="2000s-2010s" researcher="Keith Stanovich, 多伦多大学" title="我方偏误与智力无关">
              <p className="text-slate-300 leading-relaxed mb-4">
                认知科学家Stanovich及其同事进行了大量研究，系统检验我方偏误与智力的关系。
              </p>

              <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
                <h5 className="text-slate-200 font-bold mb-3">实验方法</h5>
                <p className="text-slate-400 text-sm leading-relaxed">
                  参与者被要求就有争议的话题（如堕胎、安乐死、最低工资）分别为自己持有的立场和对立立场生成论据。研究者测量参与者的智力（使用标准认知能力测试），然后分析我方偏误（为己方生成的论据数量与为对方生成的论据数量之差）与智力的关系。
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5">
                  <h5 className="text-purple-300 font-bold mb-3">关键发现</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    <strong className="text-purple-300">我方偏误与智力完全无关</strong>。高智商个体表现出与低智商个体同等程度的偏误。智力既不减少也不增加我方偏误。
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                  <h5 className="text-blue-300 font-bold mb-3">唯一相关因素</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    大学教育年限能<strong>轻微</strong>减少偏误（但效果有限）。这可能是因为学术训练强调考虑多方观点。但即使是受过高等教育的人，我方偏误仍然明显存在。
                  </p>
                </div>
              </div>

              <InfoBox type="success" title="论证理论的解释">
                这个发现是论证理论的关键证据。如果我方偏误是"认知懒惰"或"能力不足"，那么高智商应该减少偏误——但事实并非如此。<br /><br />
                <strong>这证明我方偏误不是系统的缺陷，而是系统的正常运作模式</strong>。一个专门为论证设计的推理系统<em>理应</em>偏向"我方"——这是它的工作。
              </InfoBox>

              <Quote author="Keith Stanovich">
                我方偏误是人类认知中最稳健、最普遍的现象之一。它不受智力影响，不受专业知识影响，即使明确要求人们考虑对立观点也难以消除。这表明它不是随机错误，而是推理系统的基本特征。
              </Quote>
            </ExperimentCard>

            <Accordion title="总结：为什么偏误是特征而非缺陷">
              <p className="text-slate-300 leading-relaxed mb-4">
                把所有发现放在一起，一个清晰的图景浮现出来：
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">发现1：人们为自己的假设寻找确认证据</div>
                  <p className="text-slate-400 text-sm">在2-4-6任务和类似实验中，人们主要测试正例而非反例。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">发现2：但人们更愿意为他人的假设寻找反例</div>
                  <p className="text-slate-400 text-sm">偏误是选择性的，专门针对"我方"观点。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">发现3：混合证据导致态度极化</div>
                  <p className="text-slate-400 text-sm">人们从混合证据中选择性地吸收支持自己立场的部分。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">发现4：偏误与智力无关</div>
                  <p className="text-slate-400 text-sm">这不是"笨"或"懒"，而是推理系统的基本运作方式。</p>
                </div>
              </div>

              <InfoBox type="warning" title="认知分工模型">
                在群体论辩中，这些"偏误"实现了高效的认知分工：<br /><br />
                <strong>每个人专注于为自己的立场找最好的论据</strong>（我方偏误）<br />
                <strong>每个人同时批判性地评估他人的论据</strong>（对他人的"反驳偏误"）<br /><br />
                这样，所有可能的论据和反驳都会被探索。最强的论据在交锋中存活下来，最弱的论据被淘汰。群体整体达成的结论优于任何个体单独推理的结果。<br /><br />
                <strong className="text-amber-300">个体偏见 + 群体辩论 = 集体智慧</strong>
              </InfoBox>
            </Accordion>
          </section>

          {/* ==================== 第六部分：道德伪善实验 ==================== */}
          <section id="hypocrisy" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-lg">6</span>
              道德伪善实验：推理如何为自利辩护
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              道德伪善研究提供了论证理论最直接的证据：推理被用来为自己的行为辩护，而非追求道德真理。这系列实验揭示了推理的辩护功能如何在道德领域运作。
            </p>

            <Term term="道德伪善 (Moral Hypocrisy)" definition={"渴望\u201c看起来道德\u201d，同时尽可能避免\u201c真正道德\u201d的代价"}>
              道德伪善者不是不知道什么是对的——他们知道公平、知道应该考虑他人。但他们使用推理来找借口，让自己能够在自利的同时维持道德的自我形象。
            </Term>

            <ExperimentCard year="1997" researcher="C. Daniel Batson, 堪萨斯大学" title="开创性硬币翻转实验">
              <div className="space-y-6">
                <div>
                  <h5 className="text-amber-300 font-bold mb-3">实验设置</h5>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    参与者被告知他们需要在自己和另一位匿名参与者之间分配两个任务。这是一个精心设计的道德困境：
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <div className="text-emerald-400 font-bold mb-2">🎁 正面后果任务</div>
                      <p className="text-slate-300 text-sm">正确回答问题可获得抽奖机会，最高可赢得30美元。任务有趣且有奖励。</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="text-red-400 font-bold mb-2">😑 中性后果任务</div>
                      <p className="text-slate-300 text-sm">被描述为"沉闷无聊"，没有任何奖励。纯粹是浪费时间。</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                    <h5 className="text-slate-200 font-bold mb-2">关键条件</h5>
                    <ul className="space-y-2 text-slate-400 text-sm">
                      <li>• 另一位参与者会认为任务分配是随机进行的（不会知道是你决定的）</li>
                      <li>• 整个过程完全私密匿名，没有人会知道你的选择</li>
                      <li>• 实验者提供了一枚硬币，并提示"大多数人认为给双方平等机会是最公平的"</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h5 className="text-amber-300 font-bold mb-3">实验结果</h5>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h6 className="text-slate-200 font-semibold mb-3">研究1：无道德引导条件</h6>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <div className="text-4xl font-black text-red-400 mb-2">80%</div>
                        <p className="text-slate-300 text-sm">将好任务分配给自己（16/20人）</p>
                        <p className="text-slate-500 text-xs mt-2">但只有1人认为这种分配是"道德正确"的</p>
                      </div>
                    </div>
                    <div>
                      <h6 className="text-slate-200 font-semibold mb-3">研究2：提供硬币条件</h6>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <div className="text-4xl font-black text-amber-400 mb-2">90%</div>
                        <p className="text-slate-300 text-sm">掷硬币后仍把好任务给自己（9/10人）</p>
                        <p className="text-slate-500 text-xs mt-2">如果硬币真正随机，比例应为50%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 道德评分对比 */}
                <div>
                  <h5 className="text-amber-300 font-bold mb-3">自我道德评分对比（9分量表）</h5>
                  <div className="h-64 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={moralRatingData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis type="number" domain={[0, 9]} tick={{ fill: '#94a3b8' }} />
                        <YAxis dataKey="category" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={130} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} 
                          formatter={(v) => [v.toFixed(2), '道德评分']} 
                        />
                        <Bar dataKey="rating" radius={[0, 4, 4, 0]}>
                          {moralRatingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <InfoBox type="error" title="关键发现">
                  <strong>掷硬币这一象征性行为提供了足够的"道德掩护"</strong>，让人们感到更加心安理得。<br /><br />
                  掷硬币者对自己行为的道德评分（7.30）显著高于直接拿好任务者（4.00），即使他们最终做了同样自利的选择！掷硬币成为了一种"道德洗白"的仪式——它让人可以说"我给了公平的机会"，尽管结果显示硬币被操纵或无视了。
                </InfoBox>
              </div>
            </ExperimentCard>

            <ExperimentCard year="1999" researcher="Batson等人" title="标记硬币实验与镜子实验">
              <p className="text-slate-300 leading-relaxed mb-4">
                后续实验进一步探究道德伪善的机制：人们是真的误判了自己的行为，还是在刻意回避道德反思？
              </p>

              <Accordion title="标记硬币实验：消除歧义" defaultOpen={true}>
                <p className="text-slate-300 leading-relaxed mb-4">
                  在这个版本中，硬币的两面清楚标注了"自己得好任务"和"他人得好任务"——完全消除了任何关于结果的歧义。
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-blue-400 mb-1">70%</div>
                    <p className="text-slate-400 text-sm">选择使用硬币</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-red-400 mb-1">86%</div>
                    <p className="text-slate-400 text-sm">掷硬币者仍给自己好任务</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-black text-amber-400 mb-1">7.42</div>
                    <p className="text-slate-400 text-sm">掷硬币者的道德自评</p>
                  </div>
                </div>

                <InfoBox type="warning">
                  结果清晰表明：参与者并非误读了硬币结果——他们要么无视结果，要么操纵了掷币过程。即使结果完全清晰，掷硬币者仍给自己的道德评分远高于不掷币者（7.42 vs 3.90）。<strong>程序正义的外表足以提供心理上的道德辩护。</strong>
                </InfoBox>
              </Accordion>

              <Accordion title="镜子实验：自我意识的威力">
                <p className="text-slate-300 leading-relaxed mb-4">
                  这个实验检验了一个关键假说：如果道德伪善源于"回避将行为与道德标准比较"，那么增强自我意识应该能减少伪善。
                </p>

                <div className="bg-slate-800/50 rounded-xl p-5 mb-4">
                  <h5 className="text-slate-200 font-bold mb-3">实验设计</h5>
                  <p className="text-slate-400 text-sm">
                    参与者在做决定时，面前要么有一面镜子（可以看到自己），要么没有。镜子被证明是增强自我意识的有效方法。
                  </p>
                </div>

                <ComparisonTable 
                  headers={['条件', '无镜子', '有镜子']}
                  rows={[
                    ['未掷硬币', '85%给自己好任务', '62%给自己好任务'],
                    ['掷硬币', '85%给自己好任务', '50%给自己好任务 ✓'],
                  ]}
                />

                <InfoBox type="success" title="历史性发现">
                  <strong>当镜子存在且参与者使用硬币时，结果首次符合随机概率（50%）</strong>——这是整个研究系列中首次观察到的真正公平结果！<br /><br />
                  镜子通过增强自我意识，迫使人们将自己的行为与道德标准进行比较，从而打破了伪善。这支持了Batson的"回避策略"假说：<strong>道德伪善的核心机制是人们刻意避免将自己的行为与道德标准进行比较</strong>。
                </InfoBox>
              </Accordion>
            </ExperimentCard>

            <ExperimentCard year="2008" researcher="Piercarlo Valdesolo & David DeSteno, 东北大学" title="认知负荷实验：揭示双重过程">
              <p className="text-slate-300 leading-relaxed mb-4">
                这项发表在《实验社会心理学杂志》的研究，从认知加工的角度深入剖析道德伪善的心理机制，为论证理论提供了关键证据。
              </p>

              <div className="bg-slate-800/50 rounded-xl p-5 mb-6">
                <h5 className="text-slate-200 font-bold mb-3">实验设计：2×2因子</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-amber-400 font-medium mb-2">因子1：判断对象</div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-slate-700 rounded text-sm text-slate-300">判断自己</span>
                      <span className="px-3 py-1 bg-slate-700 rounded text-sm text-slate-300">判断他人</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-amber-400 font-medium mb-2">因子2：认知约束</div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-slate-700 rounded text-sm text-slate-300">控制条件</span>
                      <span className="px-3 py-1 bg-slate-700 rounded text-sm text-slate-300">认知负荷</span>
                    </div>
                  </div>
                </div>
              </div>

              <Accordion title="认知负荷如何操控" defaultOpen={true}>
                <p className="text-slate-300 leading-relaxed mb-4">
                  研究者使用了<strong className="text-purple-300">7位数字串记忆任务</strong>来施加认知负荷：
                </p>
                <StepList steps={[
                  { title: '呈现数字', content: '参与者在每个判断问题前看到一串7位数字（如"3847291"）' },
                  { title: '快速判断', content: '参与者必须在10秒内回答道德判断问题' },
                  { title: '回忆数字', content: '回答问题后，立即要求回忆刚才的数字串' },
                ]} />
                <InfoBox type="info">
                  <strong>关键设计</strong>：认知负荷在参与者分配任务之后施加，因此只影响道德判断过程，而非行为本身。这让研究者能够分离"行为"和"对行为的判断"。
                </InfoBox>
              </Accordion>

              <div className="my-6">
                <h5 className="text-amber-300 font-bold mb-4">实验结果：公平性评分（7分量表）</h5>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cognitiveLoadData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                      <XAxis dataKey="condition" tick={{ fill: '#94a3b8', fontSize: 10 }} angle={-15} textAnchor="end" height={60} />
                      <YAxis tick={{ fill: '#94a3b8' }} domain={[0, 7]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} 
                        formatter={(v) => [v.toFixed(1), '公平性评分']} 
                      />
                      <Bar dataKey="fairness" radius={[4, 4, 0, 0]}>
                        <Cell fill="#ef4444" />
                        <Cell fill="#3b82f6" />
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#6366f1" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                  <h5 className="text-red-300 font-bold mb-3">控制条件：伪善效应显著</h5>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    参与者判断自己的"过失"（不公平分配）比他人同样的行为更加公平。
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3">
                    <code className="text-red-400 text-xs">t(49) = 3.39, p = .001, d = 0.95</code>
                    <p className="text-slate-500 text-xs mt-1">效应量很大，伪善效应非常显著</p>
                  </div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                  <h5 className="text-emerald-300 font-bold mb-3">认知负荷条件：伪善消失</h5>
                  <p className="text-slate-300 text-sm leading-relaxed mb-2">
                    对自己和他人的道德评价没有差异——伪善效应完全消失。
                  </p>
                  <div className="bg-slate-900/50 rounded-lg p-3 mt-3">
                    <code className="text-emerald-400 text-xs">t(38) = 0.12, p = .91</code>
                    <p className="text-slate-500 text-xs mt-1">没有显著差异，公平地评判自己和他人</p>
                  </div>
                </div>
              </div>

              <InfoBox type="success" title="核心理论贡献">
                这项研究确定了道德伪善的认知机制：<strong className="text-amber-300">伪善源于控制性/意志性加工过程，而非自动偏见</strong>。<br /><br />
                研究者提出了<strong>双重过程模型</strong>：<br /><br />
                <strong>自动/直觉层面</strong>：人类对公平规范的违反具有先天的负面反应——无论违反者是自己还是他人。我们的"道德直觉"是真实的。<br /><br />
                <strong>控制/审慎层面</strong>：当判断自己的过失时，动机性推理过程会进行"合理化和辩护"，以缓和初始的负面反应。<br /><br />
                认知负荷之所以消除伪善，是因为它阻止了对直觉厌恶反应的"压制或覆盖"——没有控制性加工资源，人们就无法进行自利的辩护。
              </InfoBox>

              <Quote author="Valdesolo & DeSteno, 2008">
                我们的发现表明，道德伪善并非源于道德感的缺失，而是源于能够压制这种道德感的控制性过程。具有讽刺意味的是，正是我们引以为傲的"理性思考"能力，使我们能够为自己的不道德行为找到借口。
              </Quote>
            </ExperimentCard>

            <Accordion title="道德伪善研究与论证理论的联系">
              <p className="text-slate-300 leading-relaxed mb-4">
                道德伪善研究完美支持了论证理论的核心主张：<strong>推理的功能是辩护，而非求真</strong>。
              </p>

              <div className="space-y-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">辩护功能的直接证据</div>
                  <p className="text-slate-400 text-sm">人们在做出自利选择后，使用推理来为自己的行为辩护，维持道德的自我形象。掷硬币、找借口都是辩护行为。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">我方偏误的道德表现</div>
                  <p className="text-slate-400 text-sm">同样的行为，当主体是自己时被评价为更公平，当主体是他人时被评价为更不公平。这是"我方偏误"在道德判断中的表现。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">推理作为"道德洗白"工具</div>
                  <p className="text-slate-400 text-sm">推理过程（控制性加工）被用来压制直觉的道德判断，为自利行为找借口。这正是论证理论所说的"为自己辩护"。</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="text-amber-400 font-bold mb-2">道德直觉是真实的</div>
                  <p className="text-slate-400 text-sm">研究表明人类确实有公平的道德直觉（在认知负荷下表现出来）。伪善不是因为缺乏道德感，而是因为推理可以压制它。</p>
                </div>
              </div>

              <InfoBox type="warning" title="具有讽刺意味的结论">
                传统上，我们认为推理是纠正直觉偏见的工具——"三思而后行"、"理性克服冲动"。但道德伪善研究揭示了一个相反的图景：<strong>有时候，正是推理让我们能够做出不道德的选择</strong>。<br /><br />
                我们的道德直觉——对不公平的即时厌恶——是相当可靠的。但我们的推理能力让我们能够找到各种借口来绕过这种直觉，为自利行为辩护。<br /><br />
                这并不意味着推理总是坏的——它只是意味着推理的功能不是我们传统上认为的那样。
              </InfoBox>
            </Accordion>
          </section>

          {/* ==================== 第七部分：进化起源 ==================== */}
          <section id="evolution" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-lg">7</span>
              进化起源：超社会性与认知警觉
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              论证理论不仅解释了理性如何运作，还解释了它为什么会进化出来。这个解释建立在人类独特的"超社会性"生态位之上。
            </p>

            <Accordion title="为什么只有人类进化出理性" defaultOpen={true}>
              <p className="text-slate-300 leading-relaxed mb-4">
                如果理性是通用的认知增强器，它应该在许多物种中独立进化出来。但事实上，只有人类拥有这种能力。论证理论提供了一个解释：
              </p>

              <div className="bg-gradient-to-r from-teal-900/30 to-slate-800/40 border border-teal-500/30 rounded-xl p-6 mb-6">
                <h4 className="text-teal-300 font-bold text-lg mb-4">人类的"超社会性"</h4>
                <p className="text-slate-300 leading-relaxed mb-4">
                  人类是<strong className="text-teal-300">"超社会性"物种</strong>——我们对社会合作的依赖程度远超任何其他物种。没有其他动物进行如此复杂的社会协调、分工合作、知识传承。
                </p>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• 人类社会依赖于复杂的<strong>语言交流</strong>——我们通过语言分享知识、协调行动、传递经验</li>
                  <li>• 这种依赖创造了一个<strong>新的进化压力</strong>：如何在高度依赖他人信息的同时，避免被欺骗或误导？</li>
                  <li>• 理性正是为了解决这个问题而进化出来的</li>
                </ul>
              </div>

              <Quote author="Mercier & Sperber">
                理性之所以只在人类中进化，是因为它是对一个独特生态位的适应——一个高度依赖语言交流和社会合作的生态位。理性是社会交流的工具，不是孤独思考的工具。
              </Quote>
            </Accordion>

            <Accordion title="认知警觉：信任与怀疑的平衡">
              <p className="text-slate-300 leading-relaxed mb-4">
                Dan Sperber及其同事提出了<strong className="text-cyan-300">认知警觉（epistemic vigilance）</strong>的概念，这是理解理性进化的关键：
              </p>

              <Term term="认知警觉 (Epistemic Vigilance)" definition="一套保护我们免受错误信息侵害的认知机制">
                人类极度依赖他人的信息交流，但这也使我们容易受到无意或有意的误导。认知警觉是我们用来评估信息可靠性的一套机制。
              </Term>

              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                  <h5 className="text-emerald-300 font-bold mb-3">信任是必要的</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    如果我们不信任他人的信息，我们就无法从他人的经验中学习，社会将无法运作。儿童必须信任成年人的教导，科学家必须信任同行的研究结果。
                  </p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                  <h5 className="text-amber-300 font-bold mb-3">警觉也是必要的</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    如果我们盲目信任所有信息，我们就会成为欺骗和误导的受害者。人们可能有意撒谎，也可能无意传播错误信息。
                  </p>
                </div>
              </div>

              <InfoBox type="info" title="关键洞见">
                认知警觉<strong>不是不信任的对立面，而是盲目信任的对立面</strong>。<br /><br />
                <strong>信任与警觉共同进化</strong>：我们之所以能相互信任，正是因为我们相互保持警觉。如果听众从不评估信息，交流者就没有动力保持诚实；如果交流者总是撒谎，听众就不会信任任何信息。正是因为双方都付出努力——交流者提供可信的信息，听众评估信息——有效的交流才成为可能。
              </InfoBox>
            </Accordion>

            <Accordion title="推理作为信任与警觉的桥梁">
              <p className="text-slate-300 leading-relaxed mb-4">
                理性——特别是论证能力——在这个框架中扮演了关键角色：它是连接信任与警觉的桥梁。
              </p>

              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <h5 className="text-slate-200 font-bold mb-4 text-center">论证如何促进有效交流</h5>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">🤔</span>
                    </div>
                    <p className="text-slate-300 text-sm font-medium">接收者持怀疑态度</p>
                    <p className="text-slate-500 text-xs">不太可能仅凭信任接受</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 text-2xl">→</span>
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4">
                      <p className="text-amber-300 font-bold text-center">交流者提供理由</p>
                      <p className="text-slate-400 text-xs text-center mt-1">论据、证据、解释</p>
                    </div>
                    <span className="text-amber-400 text-2xl">→</span>
                  </div>

                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl">✓</span>
                    </div>
                    <p className="text-slate-300 text-sm font-medium">接收者被论据说服</p>
                    <p className="text-slate-500 text-xs">基于理由接受信息</p>
                  </div>
                </div>
              </div>

              <InfoBox type="success" title="推理的进化功能">
                推理使得<strong>有益的真实信息交流能够在原本不可能的情况下发生</strong>。<br /><br />
                <strong>对于交流者</strong>：当听众持怀疑态度时，你可以通过提供理由来说服他们。好的论据可以打破怀疑的壁垒。<br /><br />
                <strong>对于听众</strong>：你可以评估他人提供的理由，决定是否接受。如果论据有力，你可以在保持警觉的同时接受新信息。<br /><br />
                推理是认知警觉的工具，也是与警觉的接收者进行有效交流的工具。
              </InfoBox>
            </Accordion>

            <Accordion title="研究时间线">
              <p className="text-slate-300 leading-relaxed mb-6">
                论证理论建立在数十年的认知心理学研究之上。以下是关键里程碑：
              </p>

              <div className="relative pl-8 border-l-2 border-amber-500/30">
                {[
                  { year: '1960', title: 'Wason 2-4-6任务', desc: '揭示了确认偏误的普遍性，人们倾向于寻找支持假设的证据而非反驳证据。' },
                  { year: '1966', title: 'Wason选择任务', desc: '发现个体在抽象逻辑推理中正确率仅约10%，成为认知心理学最著名的实验之一。' },
                  { year: '1979', title: 'Lord等人信念极化研究', desc: '证明混合证据可以导致双方态度都变得更极端，挑战了"理性收敛于真理"的假设。' },
                  { year: '1992', title: 'Cosmides社会契约研究', desc: '发现Wason任务包装为社会契约时正确率飙升至75-80%，揭示了进化适应的领域特异性。' },
                  { year: '1997', title: 'Batson道德伪善实验', desc: '开创性研究揭示80%的人选择自利分配，且使用推理为自己辩护。' },
                  { year: '1998', title: 'Moshman群体推理研究', desc: '发现群体讨论可将Wason任务正确率从10%提升至80%，支持"真理制胜"现象。' },
                  { year: '1999', title: 'Batson镜子实验', desc: '证明提升自我意识可以消除道德伪善效应，揭示了回避机制。' },
                  { year: '2008', title: 'Valdesolo认知负荷研究', desc: '揭示道德伪善依赖于控制性认知加工，确立了双重过程模型。' },
                  { year: '2010', title: 'Sperber等人认知警觉论文', desc: '系统阐述认知警觉概念，为论证理论提供进化背景。' },
                  { year: '2011', title: 'Mercier & Sperber论证理论论文', desc: '在《行为与脑科学》发表《为什么人类要推理》，正式提出论证理论。' },
                  { year: '2017', title: '《理性之谜》出版', desc: 'Harvard University Press出版完整专著，系统阐述论证理论。' },
                ].map((item, idx) => (
                  <div key={idx} className="relative mb-6 last:mb-0">
                    <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-amber-500 border-4 border-slate-900" />
                    <div className="bg-slate-800/50 rounded-xl p-4 ml-4">
                      <div className="text-amber-400 font-bold text-sm">{item.year}</div>
                      <div className="text-slate-100 font-semibold mt-1">{item.title}</div>
                      <div className="text-slate-400 text-sm mt-1">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Accordion>
          </section>

          {/* ==================== 第八部分：实践应用 ==================== */}
          <section id="practice" className="scroll-mt-24 mb-20">
            <h2 className="text-3xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white text-lg">8</span>
              实践应用：如何利用论证理论改善推理
            </h2>

            <p className="text-slate-300 leading-relaxed text-lg mb-6">
              论证理论不仅是一个学术理论，它对教育、决策、组织管理和个人生活都有深刻的实践意义。
            </p>

            <Accordion title="教育：拥抱群体审议" defaultOpen={true}>
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  论证理论最直接的教育启示是：<strong className="text-amber-300">让学生在小组中讨论和辩论，而不是独自学习</strong>。
                </p>

                <Quote author="Mercier & Sperber">
                  教授困难或抽象问题的最佳方式是将学生分成小组，让他们一起推理。协作学习产生的理解比学生独自学习深刻得多。
                </Quote>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <h5 className="text-red-300 font-bold mb-3">❌ 传统方法的问题</h5>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• 学生独自阅读、做题、听讲</li>
                      <li>• 缺乏论证语境</li>
                      <li>• 确认偏误不受挑战</li>
                      <li>• 误解可能持续存在</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                    <h5 className="text-emerald-300 font-bold mb-3">✓ 论证理论的建议</h5>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• 小组讨论和辩论</li>
                      <li>• 鼓励学生相互质疑</li>
                      <li>• 要求解释和辩护</li>
                      <li>• "真理制胜"机制自然运作</li>
                    </ul>
                  </div>
                </div>

                <InfoBox type="info" title="具体建议">
                  • <strong>苏格拉底式讨论</strong>：通过提问引导学生思考，而非直接告诉答案<br />
                  • <strong>同伴教学</strong>：让学生向彼此解释概念，解释的过程促进深度理解<br />
                  • <strong>辩论练习</strong>：让学生为不同立场辩护，培养考虑多方观点的能力<br />
                  • <strong>异质分组</strong>：将不同观点的学生分在一组，确保有分歧可以讨论
                </InfoBox>
              </div>
            </Accordion>

            <Accordion title="决策：寻求多元分歧">
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  论证理论表明，好的决策不是来自独自的深思熟虑，而是来自<strong className="text-amber-300">有分歧的群体讨论</strong>。
                </p>

                <div className="bg-slate-800/50 rounded-xl p-5">
                  <h5 className="text-slate-200 font-bold mb-3">论证理论有效的条件</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-emerald-400 font-medium mb-2">✓ 有效条件</div>
                      <ul className="space-y-1 text-slate-400 text-sm">
                        <li>• 存在真正的分歧和不同观点</li>
                        <li>• 参与者对真理有共同兴趣</li>
                        <li>• 群体包含多元视角</li>
                        <li>• 允许自由讨论和质疑</li>
                      </ul>
                    </div>
                    <div>
                      <div className="text-red-400 font-medium mb-2">✗ 失效条件</div>
                      <ul className="space-y-1 text-slate-400 text-sm">
                        <li>• 独自推理（缺乏外部反馈）</li>
                        <li>• 回音室（只有相同观点）</li>
                        <li>• 涉及核心身份信念</li>
                        <li>• 权力压制讨论</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <InfoBox type="warning" title="警惕回音室">
                  与意见相同的人讨论可能强化而非纠正偏见。如果所有人都倾向于支持某个结论，确认偏误会相互强化，群体可能做出比个体更极端、更错误的决定（群体极化）。<br /><br />
                  <strong>解决方案</strong>：主动引入不同观点，指定"魔鬼代言人"，鼓励建设性反对。
                </InfoBox>
              </div>
            </Accordion>

            <Accordion title="科学：理解科学为什么有效">
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  论证理论为我们理解科学的成功提供了新视角：<strong className="text-amber-300">科学之所以有效，正是因为它是一个社会过程</strong>。
                </p>

                <Quote author="Mercier & Sperber">
                  科学不是因为科学家是超级理性的个体而成功的。科学成功是因为它有一套制度——同行评审、批判性讨论、可重复性要求——确保论证的社会性质得到充分发挥。
                </Quote>

                <div className="bg-slate-800/50 rounded-xl p-5">
                  <h5 className="text-slate-200 font-bold mb-3">科学作为制度化的论证</h5>
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 font-bold">同行评审</span>
                      <span className="text-slate-400 text-sm">其他科学家批判性评估你的论据，找出弱点</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 font-bold">可重复性</span>
                      <span className="text-slate-400 text-sm">其他人可以检验你的声称，不能只靠你的话</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 font-bold">公开讨论</span>
                      <span className="text-slate-400 text-sm">会议、期刊提供论证交锋的场所</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-amber-400 font-bold">奖励发现错误</span>
                      <span className="text-slate-400 text-sm">推翻错误理论可以建立声誉</span>
                    </li>
                  </ul>
                </div>

                <InfoBox type="error" title="当科学失败时">
                  即使是诺贝尔奖得主，在缺乏社会纠正时也会严重偏离正轨。<br /><br />
                  <strong>例子</strong>：Linus Pauling（两次诺贝尔奖得主）晚年大力推广维生素C治疗癌症的说法，尽管证据不支持。他的声望使得批评减少，确认偏误不受挑战。<br /><br />
                  这提醒我们：没有人能免于偏见，科学的力量在于它的社会结构，而非个体的理性。
                </InfoBox>
              </div>
            </Accordion>

            <Accordion title="个人生活：发挥各自优势">
              <div className="space-y-4">
                <p className="text-slate-300 leading-relaxed">
                  论证理论对日常生活也有重要启示。关键是理解我们的优势和劣势：
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5">
                    <h5 className="text-emerald-300 font-bold mb-3">✓ 我们擅长</h5>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• 发现<strong>他人</strong>推理中的缺陷</li>
                      <li>• 为自己的立场生成论据</li>
                      <li>• 评估他人提供的论据</li>
                      <li>• 在讨论中被好论据说服</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <h5 className="text-red-300 font-bold mb-3">✗ 我们不擅长</h5>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• 发现<strong>自己</strong>推理中的缺陷</li>
                      <li>• 客观评估自己的论据</li>
                      <li>• 主动考虑对立观点</li>
                      <li>• 独自达到正确结论</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-900/30 to-slate-800/40 border border-amber-500/30 rounded-xl p-6">
                  <h5 className="text-amber-300 font-bold mb-4">实际建议：关于争吵的例子</h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <div className="text-red-400 font-bold mb-2">❌ 错误方式</div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        "如果你与伴侣发生争吵，然后独自回房间反复思考发生的事情……你会不断想到为什么一切都是他/她的错……你会找到许许多多理由证明自己没做错任何事。"
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <div className="text-emerald-400 font-bold mb-2">✓ 正确方式</div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        "如果你与一个可能更中立的人讨论同样的事情，那个人或许能告诉你，也许你也做了一些不太对的事情。"
                      </p>
                    </div>
                  </div>
                </div>

                <InfoBox type="success" title="核心原则">
                  <strong>对孤独得出的结论保持怀疑</strong>。如果你独自思考某个问题，无论你多么确信自己是对的，记住这可能只是确认偏误在起作用。<br /><br />
                  <strong>主动寻求批评</strong>。不是寻求确认你观点的人，而是能够挑战你观点的人。那正是我们需要他人的原因——来批评我们。<br /><br />
                  <strong>我们一起，希望真理能够浮现</strong>。
                </InfoBox>
              </div>
            </Accordion>
          </section>

          {/* ==================== 总结 ==================== */}
          <section className="py-12">
            <div className="bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 rounded-3xl p-10 border border-slate-700/50">
              <h2 className="text-3xl font-bold text-slate-100 mb-6 text-center">核心洞见总结</h2>
              
              <div className="max-w-3xl mx-auto mb-8">
                <p className="text-xl text-slate-300 leading-relaxed text-center mb-6">
                  《理性之谜》为我们提供了看待人类理性的全新视角。
                </p>
                
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <div className="text-amber-400 font-bold mb-2">理性是社会能力，不是个体求真工具</div>
                    <p className="text-slate-400 text-sm">理性进化的目的是让我们在社会交流中说服他人、评估他人的论点。独自沉思不是理性的设计用途。</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <div className="text-amber-400 font-bold mb-2">确认偏误和我方偏误是设计特征</div>
                    <p className="text-slate-400 text-sm">这些"偏误"在群体论辩中实现认知分工：每个人为自己辩护，他人负责批评。整体效果优于任何人独自推理。</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <div className="text-amber-400 font-bold mb-2">群体论辩释放理性的真正力量</div>
                    <p className="text-slate-400 text-sm">Wason任务个体正确率10%，群体讨论后80%。科学的成功不是因为科学家超级理性，而是因为同行评审等社会机制。</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-5">
                    <div className="text-amber-400 font-bold mb-2">对孤独结论保持怀疑</div>
                    <p className="text-slate-400 text-sm">如果你独自思考后非常确信某事，记住确认偏误可能在起作用。主动寻求批评，让他人检验你的推理。</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {['个体偏见 + 群体辩论 = 集体智慧', '推理首先是社会能力', '多一点苏格拉底，少一点亚里士多德'].map((tag, idx) => (
                  <span key={idx} className="px-5 py-2 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <blockquote className="text-lg text-slate-400 italic max-w-2xl mx-auto text-center">
                "我们不应期望通过个人反思达到真理，而应拥抱对话与分歧。
                在社会交流中释放理性的真正力量。"
              </blockquote>
            </div>
          </section>

        </div>
      </main>

      {/* ==================== 页脚 ==================== */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 mb-2">
            《理性之谜》(The Enigma of Reason)
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Hugo Mercier & Dan Sperber · Harvard University Press · 2017
          </p>
          <p className="text-slate-600 text-xs">
            本页面为深度书评与内容总结 · Instap Research
          </p>
        </div>
      </footer>
    </div>
  );
}
