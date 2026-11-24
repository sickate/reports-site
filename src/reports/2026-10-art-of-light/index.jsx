import { useEffect, useRef, useState } from 'react';
import { artworks, comparisons, gallery, sources } from './content';
import './style.css';

const byId = Object.fromEntries(artworks.map((work) => [work.id, work]));
const filters = ['全部作品', '金色光雾', '水与倒影', '夜色静穆', '空间崇高'];

function SourceLinks({ work }) {
  return <div className="al-source-links">
    <a href={work.sourceUrl} target="_blank" rel="noreferrer">馆藏与作品资料</a>
    <a href={work.imageSourceUrl} target="_blank" rel="noreferrer">图片来源与权利</a>
  </div>;
}

function Painting({ id, onOpen, priority = false, children }) {
  const work = byId[id];
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [id]);
  return <figure className="al-painting">
    {failed ? <div className="al-image-failed">图片暂时无法显示。<a href={work.imageSourceUrl} target="_blank" rel="noreferrer">到来源查看画作</a></div>
      : <button className="al-image-button" onClick={() => onOpen(work)} aria-label={`放大查看${work.artist}《${work.title}》`}>
        <img src={work.image} alt={`${work.artist}《${work.title}》，${work.year}`} width={work.width} height={work.height}
          loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" onError={() => setFailed(true)} />
        <span className="al-image-hint" aria-hidden="true">放大看画</span>
      </button>}
    <figcaption>
      <h3>《{work.title}》</h3>
      <p className="al-work-meta">{work.artist}，{work.year}<br />{work.museum}</p>
      <SourceLinks work={work} />
      {children && <div className="al-looking-note">{children}</div>}
    </figcaption>
  </figure>;
}

function References({ ids }) {
  return <p className="al-references">资料依据：{ids.map((id) => {
    const source = sources.find((item) => item.id === id);
    return <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.label}</a>;
  })}</p>;
}

export default function ArtOfLight() {
  const [comparisonId, setComparisonId] = useState('sunflowers');
  const [filter, setFilter] = useState('全部作品');
  const [enlarged, setEnlarged] = useState(null);
  const dialogRef = useRef(null);
  const selected = comparisons.find((item) => item.id === comparisonId);
  const visible = gallery.filter((item) => filter === '全部作品' || item.tags.includes(filter));

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '当光改写世界：梵高、透纳与我的审美地图 | Instap';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!enlarged || !dialog) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [enlarged]);

  return <article className="art-light" lang="zh-CN">
    <header className="al-intro">
      <p className="al-edition">艺术赏析手记 <time dateTime="2026-10-14">2026 年 10 月 14 日</time></p>
      <h1>当光改写世界</h1>
      <p className="al-deck">从梵高与其他画家的比较，走向一份关于金色光雾、深蓝夜空与沉浸空间的个人审美地图。</p>
      <p className="al-intro-note">理解一幅画的成就，与喜欢它，是两件可以同时成立的事。</p>
    </header>

    <div className="al-hero-pair">
      <Painting id="modern-rome" priority onOpen={setEnlarged}>城市的边界在光里变软，目光沿着金色空气走向远方。</Painting>
      <Painting id="starry-night" priority onOpen={setEnlarged}>夜空的曲线不断牵引视线，深蓝与星光把整幅画连接起来。</Painting>
    </div>

    <nav className="al-section-nav" aria-label="赏析目录">
      <a href="#al-compare">梵高与他人</a><a href="#al-preference">我的审美偏好</a><a href="#al-gallery">继续看画</a><a href="#al-sources">资料与图片</a>
    </nav>

    <section id="al-compare" className="al-section">
      <div className="al-section-heading"><h2>把两幅画放在一起</h2><p>以下比较属于画面观察与赏析，馆藏和书信资料另列依据。相似的题材或手法，不等于相同的艺术目标。</p></div>
      <div className="al-choices" role="group" aria-label="选择画作比较">
        {comparisons.map((item) => <button key={item.id} aria-pressed={comparisonId === item.id} onClick={() => setComparisonId(item.id)}>{item.label}</button>)}
      </div>
      <div className="al-comparison" key={selected.id}>
        <header><p className="al-comparison-question">{selected.question}</p><h3>{selected.title}</h3></header>
        <div className="al-comparison-pair">{selected.works.map((id, index) => <Painting key={id} id={id} priority onOpen={setEnlarged}>{selected.looking[index]}</Painting>)}</div>
        <div className="al-comparison-reading">
          {selected.points.map((point) => <div key={point.title}><h4>{point.title}</h4><p>{point.text}</p></div>)}
        </div>
        <p className="al-judgment"><strong>如何评价：</strong>{selected.conclusion}</p>
        <References ids={selected.sources} />
      </div>
      <div className="al-context">
        <div><h3>名望能告诉我们什么？</h3><p>梵高的身后声望涉及作品传播、展览、收藏与书信出版。它帮助解释我们为什么反复遇见他的作品，却不能替代对这幅画的判断。厚涂、强色彩或个人苦难，也不自动构成艺术价值。</p><p>评价时可以分开问：这幅画怎样组织视觉经验？它在当时改变了什么？今天的我是否愿意继续看它？三个答案不必一致。</p><References ids={['fame']} /></div>
        <div><h3>旋涡是幻觉的记录吗？</h3><p>精神健康问题是梵高生平的一部分，但仅凭旋涡、变形或强烈色彩，无法判断某幅作品描绘了幻觉，更无法倒推出具体诊断。《星月夜》包含观察、记忆与构图加工；把它全部归因于病症，会跳过画家做出的选择。</p><p>更稳妥的说法是：病史提供创作处境，作品仍须从色彩、节奏和空间结构中理解。视觉震撼本身不是医学证据。</p><References ids={['starry', 'health']} /></div>
      </div>
    </section>

    <section id="al-preference" className="al-section al-preference">
      <div className="al-section-heading"><h2>我喜欢的是怎样的世界？</h2><p>根据今天明确表达的感受，暂时描出一张偏好地图。它是继续看画的线索，随新的体验修正。</p></div>
      <blockquote>“因为那种金色阳光笼罩整座城市的梦幻感。”</blockquote>
      <p className="al-quote-credit">对《现代罗马》的偏好，来自本次讨论。</p>
      <div className="al-preference-grid">
        <div><h3>金色弥散光</h3><p>偏爱光线贯穿空气、柔化建筑边界的整体效果。温暖与梦幻是个人感受，不是所有观众共有的心理结论。</p></div>
        <div><h3>能进入的空间</h3><p>画面让目光停留、游走，远景仍有延伸。物体是否精细，不如整个世界是否形成统一氛围重要。</p></div>
        <div><h3>深蓝与视觉旋涡</h3><p>《星月夜》的深邃色彩与流动线条同样打动我。这说明柔和与强烈可以共存于偏好中：关键是整体节奏。</p></div>
        <div><h3>静物目前较远</h3><p>对花卉静物兴趣较弱，不代表无法理解它的价值。同类色、材质和形体关系值得观察，也可以理解之后仍不偏爱。</p></div>
      </div>
      <div className="al-two-worlds">
        <h3>同一种沉浸，两种方向</h3>
        <div className="al-two-worlds-row"><strong>《现代罗马》</strong><p>光从景物之间扩散，建筑、天空和远景连成一体。它是 1839 年的英国浪漫主义作品；相近的光感并不使它成为印象派。</p></div>
        <div className="al-two-worlds-row"><strong>《星月夜》</strong><p>天空的曲线让视线持续运动，柏树与村庄形成相对稳定的支点。这里的“旋涡”是可观察的视觉效果，而非关于疾病的判定。</p></div>
        <References ids={['rome', 'romantic', 'starry']} />
      </div>
      <p className="al-boundary"><strong>这张地图最薄弱的假设：</strong>少数作品的喜好，能否延伸为稳定的风格偏好？尤其《星月夜》的强烈运动感，与透纳的温暖弥散光并不相同。下面的推荐用于检验这个推断；弗里德里希的冷冽静穆可能合拍，也可能偏离。无需把偏好排成高低等级。</p>
    </section>

    <section id="al-gallery" className="al-section">
      <div className="al-section-heading"><h2>沿着光，继续看画</h2><p>透纳的晚期风景、莫奈的水与雾、惠斯勒的夜曲，以及弗里德里希的远方。每幅先看一个具体线索。</p></div>
      <div className="al-gallery-toolbar"><div className="al-choices" role="group" aria-label="按氛围筛选画作">{filters.map((tag) => <button key={tag} aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}</button>)}</div><p aria-live="polite">{visible.length} 幅作品</p></div>
      <div className="al-gallery-grid">{visible.map((item) => <div key={item.id} className="al-gallery-entry"><Painting id={item.id} onOpen={setEnlarged}><p className="al-gallery-route">{item.route}</p><p>{item.note}</p><p className="al-gallery-prompt">{item.prompt}</p></Painting></div>)}</div>
      <aside className="al-viewing"><h3>把“喜欢”变成更清楚的观察</h3><p>先退远看整幅的明暗与色彩，再放大看笔触。比较同一幅画两个观看距离下的感受：是光、空间、运动，还是题材在吸引你？屏幕大小与图片色彩会影响体验，这份画廊不能替代观看原作。</p></aside>
    </section>

    <section id="al-sources" className="al-section al-sources">
      <div className="al-section-heading"><h2>资料与图片说明</h2><p>馆藏记录用于作品身份与年代核验；赏析与推荐属于基于画面的解释。原讨论经过整理和事实校正。</p></div>
      <p>本页使用随站点保存的画作复制图，不依赖聊天图片或运行时外部图片服务。所选原作均为已故艺术家的历史作品；各复制图的开放许可或公有领域标注以对应来源页为准。可在每幅图下查看馆藏资料与图片权利，放大窗口另列具体标注。</p>
      <ul className="al-source-list">{sources.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a><span>{source.use}</span></li>)}</ul>
      <details className="al-rights"><summary>展开全部画作的图片来源与权利标注（{artworks.length} 幅）</summary><ul>{artworks.map((work) => <li key={work.id}><strong>{work.artist}《{work.title}》</strong><p>{work.rights}</p><SourceLinks work={work} /></li>)}</ul></details>
      <p className="al-edition">资料核验日期：2026 年 10 月 14 日。推荐为偏好假设，不是艺术史排名。</p>
    </section>

    <dialog ref={dialogRef} className="al-lightbox" aria-labelledby="al-dialog-title" onClose={() => setEnlarged(null)} onClick={(event) => { if (event.target === event.currentTarget) setEnlarged(null); }}>
      {enlarged && <div className="al-lightbox-content"><button className="al-close" onClick={() => setEnlarged(null)} autoFocus>关闭 <span aria-hidden="true">×</span></button><h2 id="al-dialog-title">{enlarged.artist}《{enlarged.title}》</h2><img src={enlarged.image} width={enlarged.width} height={enlarged.height} alt={`${enlarged.artist}《${enlarged.title}》完整画作`} /><p>{enlarged.originalTitle}，{enlarged.year}。{enlarged.museum}</p><p className="al-rights-text">{enlarged.rights}</p><SourceLinks work={enlarged} /></div>}
    </dialog>
  </article>;
}
