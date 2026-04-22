import { useEffect, useRef, useState } from 'react';

const REPORT_URL = '/research-topics/elon-musk-global-factories.html';
const DATA_URL = '/data/elon-musk-global-factories.csv';
const MIN_FRAME_HEIGHT = 2400;
const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';

function ElonMuskFactoriesReport() {
  const iframeRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(MIN_FRAME_HEIGHT);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return undefined;
    }

    const syncFromDocument = () => {
      const iframeDocument = iframe.contentDocument;

      if (!iframeDocument) {
        return;
      }

      const appRoot = iframeDocument.getElementById('app');
      const nextHeight = Math.max(
        MIN_FRAME_HEIGHT,
        appRoot?.scrollHeight ?? 0,
        appRoot?.offsetHeight ?? 0
      ) + 8;

      setFrameHeight((currentHeight) => (
        Math.abs(currentHeight - nextHeight) > 4 ? nextHeight : currentHeight
      ));
    };

    const handleMessage = (event) => {
      if (event.source !== iframe.contentWindow) {
        return;
      }

      if (event.data?.type !== HEIGHT_MESSAGE_TYPE) {
        return;
      }

      const nextHeight = Math.max(MIN_FRAME_HEIGHT, Number(event.data.height) || 0) + 8;

      setFrameHeight((currentHeight) => (
        Math.abs(currentHeight - nextHeight) > 4 ? nextHeight : currentHeight
      ));
    };

    const handleLoad = () => {
      setIsLoaded(true);
      syncFromDocument();
      window.setTimeout(syncFromDocument, 180);
      window.setTimeout(syncFromDocument, 520);
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
            Manufacturing Footprint
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-100">
            Elon Musk 全球制造基地分布图
          </h2>
          <p className="mt-3 max-w-3xl text-sm md:text-[15px] leading-7 text-slate-400">
            基于你附件里的地图与 CSV 数据接成了一个新专题页，覆盖 Tesla 与 SpaceX 的主要制造基地，
            可以同时看全球分布、单点信息和每个基地的产能/状态口径。
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
            <a
              className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-950/30 px-4 py-3 transition hover:border-slate-600 hover:bg-slate-900/50"
              href={DATA_URL}
              target="_blank"
              rel="noreferrer"
            >
              <span>查看原始 CSV</span>
              <span className="text-slate-500">↗</span>
            </a>
          </div>
          <p className="mt-4 text-xs leading-6 text-slate-500">
            数据口径截至 2026-04-17。Mexico 项目保留为“规划/暂停”，其余基地按已建成或扩建中展示。
          </p>
        </div>
      </div>

      <div className="embedded-report-toolbar">
        <span className="embedded-report-label">Tesla / SpaceX Map</span>
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
          <div className="embedded-report-loading">加载 Elon Musk 工厂分布图...</div>
        )}

        <iframe
          ref={iframeRef}
          className="embedded-report-frame"
          src={REPORT_URL}
          title="Elon Musk 全球制造基地分布图"
          scrolling="no"
          style={{ height: `${frameHeight}px`, opacity: isLoaded ? 1 : 0 }}
        />
      </div>
    </section>
  );
}

export default ElonMuskFactoriesReport;
