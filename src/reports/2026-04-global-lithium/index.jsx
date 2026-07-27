import { useEffect, useRef, useState } from 'react';

// Bump on every CODE update so the iframe requests a fresh, version-pinned URL.
// Must stay in sync with the ?v= on index.html's app.js script tag — enforced by
// scripts/check-lithium-consistency.mjs, which fails the build if they diverge.
// (The separate DATA clock lives in the report's data/config.js as DATA_VERSION.)
const REPORT_VERSION = '2026-07-27';
const REPORT_URL = `/research-topics/global-lithium/?v=${REPORT_VERSION}`;
const MIN_FRAME_HEIGHT = 1400;
const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';

function GlobalLithiumReport() {
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
      <div className="embedded-report-toolbar">
        <span className="embedded-report-label">Lithium Research</span>
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
          <div className="embedded-report-loading">加载锂资源研究页面...</div>
        )}

        <iframe
          ref={iframeRef}
          className="embedded-report-frame"
          src={REPORT_URL}
          title="全球锂资源项目地图与数据库（2026）"
          scrolling="no"
          style={{ height: `${frameHeight}px`, opacity: isLoaded ? 1 : 0 }}
        />
      </div>
    </section>
  );
}

export default GlobalLithiumReport;
