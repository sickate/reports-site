import { useEffect, useRef, useState } from 'react';

const REPORT_URL = '/research-topics/semiconductor-upstream/index.html';
const MIN_FRAME_HEIGHT = 1200;
const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';

function SemiconductorUpstreamTopic() {
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
      window.setTimeout(syncFromDocument, 160);
      window.setTimeout(syncFromDocument, 480);
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
        <span className="embedded-report-label">Research Topic</span>
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
          <div className="embedded-report-loading">加载研究专题...</div>
        )}

        <iframe
          ref={iframeRef}
          className="embedded-report-frame"
          src={REPORT_URL}
          title="半导体上游产业链关系图"
          scrolling="no"
          style={{ height: `${frameHeight}px`, opacity: isLoaded ? 1 : 0 }}
        />
      </div>
    </section>
  );
}

export default SemiconductorUpstreamTopic;
