import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Bump on every CODE update so the iframe requests a fresh, version-pinned URL.
// Must stay in sync with the ?v= on index.html's app.js script tag — enforced by
// scripts/check-lithium-consistency.mjs, which fails the build if they diverge.
// (The two separate DATA clocks — DATA_CACHE_KEY and UPDATE_MARKER — live alongside
// CODE_VERSION in the report's core/version.js; see that file for why there are three.)
const REPORT_VERSION = '2026-07-27';
const REPORT_PATH = '/research-topics/global-lithium/';
// Was 1400 when the report was one long page. Now that it is split into views, the
// shortest (catalysts) is under 800px, and a 1400px floor would leave visible dead space.
const MIN_FRAME_HEIGHT = 420;
const HEIGHT_MESSAGE_TYPE = 'instap-research-topic-height';
const STATE_MESSAGE_TYPE = 'instap-research-topic-state';

// Filter keys the embedded report owns. Mirrored onto this page's URL so a shared link
// restores the reader's view; anything else in the query string is left untouched.
const REPORT_STATE_KEYS = ['view', 'q', 'status', 'country', 'sort'];

function GlobalLithiumReport() {
  const iframeRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(MIN_FRAME_HEIGHT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read once, on mount only: this seeds the iframe's src. Re-deriving it on every
  // searchParams change would reload the iframe on every keystroke the reader types
  // inside it — the mirror below writes the URL, so that would be a feedback loop.
  const initialQuery = useRef(null);
  if (initialQuery.current === null) {
    const seed = new URLSearchParams();
    for (const key of REPORT_STATE_KEYS) {
      const value = searchParams.get(key);
      if (value) seed.set(key, value);
    }
    initialQuery.current = seed.toString();
  }

  const reportUrl = useMemo(() => {
    const params = new URLSearchParams(initialQuery.current);
    params.set('v', REPORT_VERSION);
    return `${REPORT_PATH}?${params.toString()}`;
  }, []);

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

      if (event.data?.type === STATE_MESSAGE_TYPE) {
        // Mirror the report's filter state onto this page's URL so the address bar is
        // shareable. Goes through React Router (replace: true) rather than a raw
        // history.replaceState, so the router's own location never goes stale — and
        // `replace` keeps the Back button pointing at the previous PAGE, not at a
        // previous filter state.
        const incoming = new URLSearchParams(String(event.data.search || '').replace(/^\?/, ''));
        setSearchParams((current) => {
          const next = new URLSearchParams(current);
          for (const key of REPORT_STATE_KEYS) {
            const value = incoming.get(key);
            if (value) next.set(key, value);
            else next.delete(key);
          }
          return next;
        }, { replace: true });
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
  }, [setSearchParams]);

  return (
    <section className="embedded-report-shell">
      <div className="embedded-report-toolbar">
        <span className="embedded-report-label">Lithium Research</span>
        <a
          className="embedded-report-link"
          href={reportUrl}
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
          src={reportUrl}
          title="全球锂资源项目地图与数据库（2026）"
          scrolling="no"
          style={{ height: `${frameHeight}px`, opacity: isLoaded ? 1 : 0 }}
        />
      </div>
    </section>
  );
}

export default GlobalLithiumReport;
