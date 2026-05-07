import { useEffect, useRef, useState } from 'react';

const REPORT_URL = '/research-topics/wafer-foundries-2026.html';
const MIN_FRAME_HEIGHT = 4200;
const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';

function WaferFoundriesReport() {
  const iframeRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(MIN_FRAME_HEIGHT);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return undefined;

    const syncFromDocument = () => {
      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) return;
      const appRoot = iframeDocument.getElementById('app');
      const nextHeight = Math.max(
        MIN_FRAME_HEIGHT,
        appRoot?.scrollHeight ?? 0,
        appRoot?.offsetHeight ?? 0
      ) + 8;
      setFrameHeight((prev) => (Math.abs(prev - nextHeight) > 4 ? nextHeight : prev));
    };

    const handleMessage = (event) => {
      if (event.source !== iframe.contentWindow) return;
      if (event.data?.type !== HEIGHT_MESSAGE_TYPE) return;
      const nextHeight = Math.max(MIN_FRAME_HEIGHT, Number(event.data.height) || 0) + 8;
      setFrameHeight((prev) => (Math.abs(prev - nextHeight) > 4 ? nextHeight : prev));
    };

    const handleLoad = () => {
      setIsLoaded(true);
      syncFromDocument();
      window.setTimeout(syncFromDocument, 200);
      window.setTimeout(syncFromDocument, 600);
    };

    window.addEventListener('message', handleMessage);
    iframe.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('message', handleMessage);
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <section className="embedded-report-shell">
      <div className="mb-4 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/40 p-6 md:p-7">
          <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
            Foundry &amp; IDM Footprint
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-100">
            全球前十大晶圆代工与 IDM 制造版图
          </h2>
          <p className="mt-3 max-w-3xl text-sm md:text-[15px] leading-7 text-slate-400">
            按 Knometa / IC Insights 2024 月度装机产能口径排名 Top-10 厂商
            (Samsung · TSMC · SK hynix · Micron · Kioxia/WD · UMC · Intel · TI · SMIC · Powerchip/Nexchip)，
            把报告中 ~55 个 fab/site 落在地图上，并按区域、晶圆尺寸、状态、节点分层做必要聚合，
            完整保留 2025–2030 项目时间线与厂址明细。
          </p>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-500">
            数据快照 2026-05-07。地址按官方公开信息；未披露 site-level WSPM 标 估(H/M/L)；fab-level 客户分配普遍不公开。
          </p>
        </div>

        <div className="rounded-3xl border border-slate-700/50 bg-slate-900/35 p-6">
          <div className="text-sm font-semibold text-slate-200">快速入口</div>
          <div className="mt-4 space-y-3 text-sm text-slate-400">
            <a
              className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-950/30 px-4 py-3 transition hover:border-slate-600 hover:bg-slate-900/50"
              href={REPORT_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span>独立打开专题页</span>
              <span className="text-slate-500">↗</span>
            </a>
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            页面包含：公司排名条形图 · CARTO Dark 底图的 Leaflet 互动地图 · 4 张 Plotly 聚合图 · 时间线 · 厂址明细表 · 数据来源。
          </p>
        </div>
      </div>

      <div className="embedded-report-toolbar">
        <span className="embedded-report-label">Foundry / IDM Map</span>
        <a
          className="embedded-report-link"
          href={REPORT_URL}
          target="_blank"
          rel="noreferrer"
        >
          独立打开
        </a>
      </div>

      <div className="embedded-report-frame-wrap">
        {!isLoaded && (
          <div className="embedded-report-loading">加载全球晶圆代工/IDM 制造版图...</div>
        )}

        <iframe
          ref={iframeRef}
          className="embedded-report-frame"
          src={REPORT_URL}
          title="全球前十大晶圆代工与 IDM 制造版图"
          scrolling="no"
          style={{ height: `${frameHeight}px`, opacity: isLoaded ? 1 : 0 }}
        />
      </div>
    </section>
  );
}

export default WaferFoundriesReport;
