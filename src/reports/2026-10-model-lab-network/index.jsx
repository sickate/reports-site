import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import research from '../../../public/research-topics/model-lab-network/research.md?raw';
import openaiResearch from '../../../public/research-topics/model-lab-network/openai-research.md?raw';

export default function ModelLabNetwork() {
  const frame = useRef(null);
  const [height, setHeight] = useState(1600);
  useEffect(() => {
    const resize = (event) => {
      if (event.origin === location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'instap-model-lab-height') {
        const next = Number(event.data.height);
        if (Number.isFinite(next) && next > 0) setHeight(Math.ceil(next) + 12);
      }
    };
    window.addEventListener('message', resize);
    return () => window.removeEventListener('message', resize);
  }, []);
  return <section className="model-lab-report">
    <div className="model-lab-access">
      <a href="#model-lab-openai-research">OpenAI research · Oct 8, 2026</a>
      <a href="/research-topics/model-lab-network/openai-research.md">OpenAI research Markdown</a>
      <a href="#model-lab-research">Anthropic research · Oct 7, 2026</a>
      <a href="/research-topics/model-lab-network/research.md">Research Markdown</a>
      <a href="/report-text/2026-10-model-lab-network.md">Full page text</a>
      <a href="/data/model-lab-network.json">Network data</a>
    </div>
    <iframe ref={frame} src="/research-topics/model-lab-network/index.html" title="Model Lab Network: capital, compute and global infrastructure" className="model-lab-frame" style={{height}} />
    <article id="model-lab-openai-research" className="model-lab-research">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{openaiResearch}</ReactMarkdown>
    </article>
    <article id="model-lab-research" className="model-lab-research">
      <p className="model-lab-provenance">Research supplied by the author, as of October 7, 2026. Original network evidence is retained. The draft’s unverified SpaceX assessment reflects its own search scope; the existing network includes a separate official Anthropic–SpaceX announcement. Contract amounts and capacity figures use different bases and must not be summed.</p>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{research}</ReactMarkdown>
    </article>
  </section>;
}
