import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';

// A fixed sample of 1,000 independent paths is reused when sizing changes.
// This isolates the effect of position sizing from Monte Carlo sampling noise.
const PATH_COUNT = 1000;
const MAX_BETS = 300;
const WIN_PROB = 0.6;
const KELLY_FRACTION = 2 * WIN_PROB - 1;

function mulberry32(seed) {
  let state = seed | 0;
  return () => {
    state += 0x6D2B79F5;
    let x = state;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function generateOutcomes(seed) {
  const random = mulberry32(seed);
  return Array.from({ length: PATH_COUNT }, () => {
    const row = new Uint8Array(MAX_BETS);
    for (let t = 0; t < MAX_BETS; t += 1) row[t] = random() < WIN_PROB ? 1 : 0;
    return row;
  });
}

function percentile(sorted, q) {
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const fraction = index - lower;
  return sorted[lower] * (1 - fraction) +
    sorted[Math.min(lower + 1, sorted.length - 1)] * fraction;
}

function simulate(outcomes, fraction, bets) {
  const paths = new Array(PATH_COUNT);
  const low = new Float64Array(bets + 1);
  const median = new Float64Array(bets + 1);
  const high = new Float64Array(bets + 1);
  let profitable = 0;

  for (let i = 0; i < PATH_COUNT; i += 1) {
    const row = new Float64Array(bets + 1);
    const outcomesRow = outcomes[i];
    row[0] = 1;
    for (let t = 1; t <= bets; t += 1) {
      row[t] = row[t - 1] * (outcomesRow[t - 1] ? 1 + fraction : 1 - fraction);
    }
    if (row[bets] > 1) profitable += 1;
    paths[i] = row;
  }

  const values = new Float64Array(PATH_COUNT);
  for (let t = 0; t <= bets; t += 1) {
    for (let i = 0; i < PATH_COUNT; i += 1) values[i] = paths[i][t];
    values.sort();
    low[t] = percentile(values, 0.05);
    median[t] = percentile(values, 0.5);
    high[t] = percentile(values, 0.95);
  }

  return {
    paths, low, median, high,
    finalLow: low[bets],
    finalMedian: median[bets],
    finalHigh: high[bets],
    profitableShare: profitable / PATH_COUNT,
  };
}

function formatWealth(value) {
  if (!Number.isFinite(value)) return '∞';
  if (value === 0) return '0×';
  if (value < 0.0001 || value >= 10000) return value.toExponential(2) + '×';
  if (value < 0.1) return value.toFixed(4) + '×';
  if (value < 10) return value.toFixed(2) + '×';
  if (value < 1000) return value.toFixed(1) + '×';
  return value.toFixed(0) + '×';
}

function renderChart(canvas, result, bets, logarithmic, showPaths) {
  if (!canvas) return;
  const bounds = canvas.getBoundingClientRect();
  const width = bounds.width;
  const height = bounds.height;
  if (width < 50 || height < 50) return;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const margins = { top: 20, right: 20, bottom: 47, left: 75 };
  const plotWidth = width - margins.left - margins.right;
  const plotHeight = height - margins.top - margins.bottom;
  const anchors = [1, ...result.low, ...result.high];
  let min = Math.max(Math.min(...anchors), 1e-300);
  let max = Math.max(...anchors);
  if (max <= min) max = min * 1.1;

  let minValue;
  let maxValue;
  if (logarithmic) {
    minValue = Math.log10(min) - 0.16;
    maxValue = Math.log10(max) + 0.16;
    if (maxValue - minValue < 0.6) {
      minValue -= 0.3;
      maxValue += 0.3;
    }
  } else {
    minValue = 0;
    maxValue = Math.max(1.15, max * 1.14);
  }

  const scaleValue = (v) => logarithmic ? Math.log10(Math.max(v, 1e-300)) : v;
  const posX = (t) => margins.left + t / bets * plotWidth;
  const posY = (v) => margins.top + plotHeight -
    ((scaleValue(v) - minValue) / (maxValue - minValue)) * plotHeight;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#101c30';
  ctx.fillRect(0, 0, width, height);

  ctx.font = '11px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  for (let k = 0; k <= 5; k += 1) {
    const value = maxValue - (maxValue - minValue) * k / 5;
    const y = margins.top + plotHeight * k / 5;
    ctx.strokeStyle = 'rgba(158, 179, 207, 0.14)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margins.left, y);
    ctx.lineTo(margins.left + plotWidth, y);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'right';
    const raw = logarithmic ? 10 ** value : value;
    ctx.fillText(formatWealth(raw).replace('×', ''), margins.left - 11, y);
  }

  ctx.save();
  ctx.beginPath();
  ctx.rect(margins.left, margins.top, plotWidth, plotHeight);
  ctx.clip();

  // Original capital is a useful reference even at extreme bet fractions.
  ctx.strokeStyle = 'rgba(212, 225, 243, 0.42)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 6]);
  ctx.beginPath();
  ctx.moveTo(margins.left, posY(1));
  ctx.lineTo(margins.left + plotWidth, posY(1));
  ctx.stroke();
  ctx.setLineDash([]);

  if (showPaths) {
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.048)';
    ctx.lineWidth = 0.75;
    for (const row of result.paths) {
      ctx.beginPath();
      for (let t = 0; t <= bets; t += 1) {
        if (t === 0) ctx.moveTo(posX(t), posY(row[t]));
        else ctx.lineTo(posX(t), posY(row[t]));
      }
      ctx.stroke();
    }
  }

  // Cross-sectional 5th–95th percentile envelope (not individual paths).
  ctx.beginPath();
  for (let t = 0; t <= bets; t += 1) {
    if (t === 0) ctx.moveTo(posX(t), posY(result.high[t]));
    else ctx.lineTo(posX(t), posY(result.high[t]));
  }
  for (let t = bets; t >= 0; t -= 1) ctx.lineTo(posX(t), posY(result.low[t]));
  ctx.closePath();
  ctx.fillStyle = 'rgba(52, 211, 153, 0.11)';
  ctx.fill();

  const line = (values, color, widthPx, dashed = false) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.setLineDash(dashed ? [6, 5] : []);
    ctx.beginPath();
    for (let t = 0; t <= bets; t += 1) {
      if (t === 0) ctx.moveTo(posX(t), posY(values[t]));
      else ctx.lineTo(posX(t), posY(values[t]));
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };
  line(result.low, '#fbbf24', 2, true);
  line(result.high, '#c4b5fd', 2, true);
  line(result.median, '#34d399', 3.2);
  ctx.restore();

  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let k = 0; k <= 5; k += 1) {
    const tick = bets * k / 5;
    ctx.fillText(String(Math.round(tick)), posX(tick), margins.top + plotHeight + 13);
  }
  ctx.fillText('下注次数', margins.left + plotWidth / 2, height - 16);
  ctx.save();
  ctx.translate(13, margins.top + plotHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(logarithmic ? '财富倍数（对数）' : '财富倍数', 0, 0);
  ctx.restore();
}

function Metric({ label, value, caption, emphasis = false }) {
  return (
    <div className={'kelly-metric' + (emphasis ? ' kelly-metric-primary' : '')}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{caption}</small>
    </div>
  );
}

export default function KellyCriterion() {
  const [fractionPercent, setFractionPercent] = useState(20);
  const [bets, setBets] = useState(100);
  const [seed, setSeed] = useState(42);
  const [logarithmic, setLogarithmic] = useState(true);
  const [showPaths, setShowPaths] = useState(true);
  const canvasRef = useRef(null);

  const outcomes = useMemo(() => generateOutcomes(seed), [seed]);
  const fraction = fractionPercent / 100;
  const result = useMemo(() => simulate(outcomes, fraction, bets), [outcomes, fraction, bets]);
  const growth = WIN_PROB * Math.log1p(fraction) + (1 - WIN_PROB) * Math.log1p(-fraction);

  const redraw = useCallback(() => {
    renderChart(canvasRef.current, result, bets, logarithmic, showPaths);
  }, [result, bets, logarithmic, showPaths]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let frame = requestAnimationFrame(redraw);
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(redraw);
        })
      : null;
    if (observer) observer.observe(canvas);
    window.addEventListener('resize', redraw);
    return () => {
      cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
      window.removeEventListener('resize', redraw);
    };
  }, [redraw]);

  let observation;
  if (fractionPercent === 20) observation = '当前为理论满凯利仓位，长期期望对数增长率达到最大。有限样本中的中位数峰值可能略有偏差。';
  else if (fractionPercent < 20) observation = '仓位低于满凯利：通常减少波动与尾部亏损，但也放弃了一部分理论复利增长率。';
  else observation = '仓位超过满凯利：算术期望财富仍可能继续上升，但长期对数增长率下降，典型路径更脆弱。';

  return (
    <main className="kelly-lab">
      <header className="kelly-header">
        <div className="kelly-eyebrow">MONTE CARLO LAB / KELLY CRITERION</div>
        <h1>仓位如何改变长期财富分布？</h1>
        <p>固定 1000 条随机胜负序列，拖动仓位就能在相同运气下比较不同下注策略。每轮按当前财富比例复投。</p>
      </header>

      <div className="kelly-layout">
        <aside className="kelly-panel kelly-controls" aria-label="模拟参数">
          <h2>01 / 模拟参数</h2>
          <div className="kelly-optimum">
            <small>理论最优 Kelly 仓位</small>
            <strong>20%</strong>
            <p>胜率 60%，赢时赚下注额 100%，输时损失下注额 100%。</p>
          </div>

          <div className="kelly-control">
            <label htmlFor="kelly-fraction"><span>每次下注的财富比例</span><output>{fractionPercent}%</output></label>
            <input id="kelly-fraction" aria-label="下注比例" type="range" min="0" max="99" step="1" value={fractionPercent} onChange={(event) => setFractionPercent(Number(event.target.value))} />
            <div className="kelly-scale"><span>0%</span><span>Kelly 20%</span><span>99%</span></div>
          </div>
          <div className="kelly-control">
            <label htmlFor="kelly-bets"><span>连续下注次数</span><output>{bets} 次</output></label>
            <input id="kelly-bets" aria-label="下注次数" type="range" min="20" max="300" step="10" value={bets} onChange={(event) => setBets(Number(event.target.value))} />
            <div className="kelly-scale"><span>20 次</span><span>300 次</span></div>
          </div>
          <div className="kelly-actions">
            <button type="button" onClick={() => setFractionPercent(20)}>使用 Kelly 20%</button>
            <button type="button" onClick={() => setSeed((value) => value + 1)}>重新抽样</button>
          </div>
          <label className="kelly-check">
            <input type="checkbox" checked={logarithmic} onChange={(event) => setLogarithmic(event.target.checked)} />
            对数纵轴（更容易比较复利差异）
          </label>
          <label className="kelly-check">
            <input type="checkbox" checked={showPaths} onChange={(event) => setShowPaths(event.target.checked)} />
            显示全部 1000 条模拟路径
          </label>
          <p className="kelly-assumptions">初始财富 1×；每轮独立；不考虑交易成本、滑点和赔率变化。仓位上限 99%，防止单次亏损导致本金归零。P5 / 中位数 / P95 均为各时点的横截面统计量。</p>
        </aside>

        <div className="kelly-results">
          <div className="kelly-metrics">
            <Metric label="最终财富 · P5" value={formatWealth(result.finalLow)} caption="最差 5% 的分界点" />
            <Metric label="最终财富 · 中位数" value={formatWealth(result.finalMedian)} caption="第 50 百分位" emphasis />
            <Metric label="最终财富 · P95" value={formatWealth(result.finalHigh)} caption="最好 5% 的分界点" />
            <Metric label="终点盈利概率" value={(100 * result.profitableShare).toFixed(1) + '%'} caption="1000 条模拟路径中盈利的比例" />
          </div>

          <section className="kelly-panel kelly-chart-panel">
            <div className="kelly-chart-header">
              <h2>财富路径分布 <span>/ {PATH_COUNT} 条模拟</span></h2>
              <div className="kelly-legend">
                <span><i className="kelly-key kelly-key-path" />模拟路径</span>
                <span><i className="kelly-key kelly-key-median" />中位数</span>
                <span><i className="kelly-key kelly-key-low" />P5</span>
                <span><i className="kelly-key kelly-key-high" />P95</span>
              </div>
            </div>
            <canvas ref={canvasRef} className="kelly-canvas" role="img" aria-label="1000 条财富路径，以及各时点的 5%、50%、95% 财富分位数。可以用左侧滑块更改下注比例。" />
            <div className="kelly-observation">{observation}</div>
          </section>
          <p className="kelly-formula">单轮理论期望对数增长率：g(f) = 0.6 ln(1 + f) + 0.4 ln(1 − f) = <strong className={growth >= 0 ? 'positive' : 'negative'}>{growth.toFixed(5)}</strong>。理论最优仓位 f* = {Math.round(KELLY_FRACTION * 100)}%。</p>
        </div>
      </div>

      <footer className="kelly-footnote">教学模拟，非投资建议。所有仓位复用同一组模拟胜负结果，方便观察仓位对财富分布的影响。凯利最大化长期预期对数增长，并不保证有限期样本的最终财富中位数恰好在 20% 达到峰值。</footer>
    </main>
  );
}
