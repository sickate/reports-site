import artworkData from './artworks.json';
export const artworks = artworkData;

export const sources = [
  { id: 'vg-flower', label: '伦敦国家美术馆：《向日葵》', url: 'https://www.nationalgallery.org.uk/paintings/vincent-van-gogh-sunflowers', use: '伦敦版身份、黄色之间的关系、厚涂与生命阶段' },
  { id: 'monet-flower', label: '大都会艺术博物馆：莫奈《向日葵花束》', url: 'https://www.metmuseum.org/art/collection/search/437112', use: '1881 年作品、馆藏与展览语境' },
  { id: 'letter-sunflower', label: '梵高书信 721：对莫奈向日葵的评价', url: 'https://vangoghletters.org/vg/letters/let721/letter.html', use: '高更与梵高的不同意见；1888 年 11 月' },
  { id: 'starry', label: 'MoMA：《星月夜》的观察与想象', url: 'https://www.moma.org/momaorg/shared/flattened_pages/moma_learning/vincent-van-gogh-the-starry-night-1889/', use: '观察、记忆、想象与构图组织；作品主记录在图下' },
  { id: 'starry-letter', label: '梵高书信 782：星空习作与线条', url: 'https://vangoghletters.org/vg/letters/let782/letter.html', use: '1889 年 6 月的工作报告与表达目标' },
  { id: 'snow', label: 'Getty / Tate：晚期透纳的绘画实验', url: 'https://www.getty.edu/art/exhibitions/turner/', use: '暴风雪、诺勒姆城堡的年代与大气、色彩实验' },
  { id: 'romantic', label: 'Getty CONA：《现代罗马》的浪漫主义归属', url: 'https://www.getty.edu/cona/CONAFullSubject.aspx?subid=700008295', use: '英国浪漫主义及作品身份' },
  { id: 'rome', label: 'Getty：《现代罗马》', url: 'https://www.getty.edu/art/collection/object/103QTP', use: '1839 年作品；夕阳、月亮与回忆性的城市空间' },
  { id: 'monticelli', label: '梵高博物馆：蒙蒂切利《花瓶里的花》', url: 'https://www.vangoghmuseum.nl/en/collection/s0251V1962', use: '约 1875 年的花卉静物与具体馆藏版本' },
  { id: 'letter-impasto', label: '梵高书信 689：蒙蒂切利与厚涂', url: 'https://vangoghletters.org/vg/letters/let689/translation.html', use: '技法传承的作者自述' },
  { id: 'japan', label: '梵高博物馆：来自日本的启发', url: 'https://www.vangoghmuseum.nl/en/art-and-stories/stories/inspiration-from-japan?v=1', use: '前景、裁切、空间安排及梅园的色彩和边框改动' },
  { id: 'plum', label: '大英博物馆：广重展览作品导览', url: 'https://www.britishmuseum.org/exhibitions/hiroshige-artist-open-road/hiroshige-large-print-guide', use: '梵高的网格描摹、放大过程与不同印次' },
  { id: 'fame', label: '梵高博物馆：作品传播与乔的贡献', url: 'https://www.vangoghmuseum.nl/assets/28dfc097-b7d4-49ae-853d-3ff3e40b7a96/20230602_background_Van-Gogh-Museum_A-Living-Museum?c=b2ad506145dd8234b33c8add2480583e3ed3fdc09735a919d88c2d70fcf4b405', use: '保存、推广、出售与书信出版的历史机制（PDF）' },
  { id: 'health', label: '梵高博物馆：常设展文字中的精神健康记录', url: 'https://www.vangoghmuseum.nl/assets/60d9ce43-0bc7-4b29-b342-6843b9316a9e?c=b323eab7292fcd17bf0765d70c190f180353404ba9f7bdef56b0e5bdcbb3cd19', use: '发作、焦虑与幻觉的历史记载，以及病种的不确定性（PDF）' },
];

export const comparisons = [
  {
    id: 'sunflowers', label: '梵高 × 莫奈', question: '同样是向日葵，为什么感受不同？', title: '自然的花束，还是黄色的节奏？',
    works: ['vg-sunflowers', 'monet-sunflowers'],
    looking: ['看黄色背景、花瓣与花瓶怎样在相近色调中拉开差别，再看花心的厚涂。', '看花束如何从红、绿与灰色的背景中展开，花枝的交叠如何形成空间。'],
    points: [
      { title: '梵高：题材变成画面语言', text: '幼蕾、盛放与衰败并置，花头的形状和颜料的厚度带来不同节奏。黄色对黄色的组织比单纯“颜色鲜艳”更值得观察。这里的创新落在具体画面安排上。' },
      { title: '莫奈：花束仍有空气与层次', text: '这张 1881 年的静物并非只靠准确描摹取胜。松动的笔触、花瓣与背景的关系，让花束兼有物体感与色彩活力。喜欢它的自然美感，是有具体形式依据的审美判断。' },
    ],
    conclusion: '可以更喜欢莫奈，同时理解梵高对同类色与质感的探索。梵高在书信中转述高更更喜欢自己的向日葵，却表示自己不同意；作品之间的优劣并不由今天的名气决定。',
    sources: ['vg-flower', 'monet-flower', 'letter-sunflower'],
  },
  {
    id: 'vortex', label: '梵高 × 透纳', question: '画面不是真的在动，视线为什么会旋转？', title: '夜空的流动，风雪的回旋',
    works: ['starry-night', 'snow-storm'],
    looking: ['沿天空中央的长曲线移动视线，再看柏树与村庄怎样提供稳定支点。', '寻找汽船：周围深浅相间的风雪使目光在中心附近循环，轮廓更难停住。'],
    points: [
      { title: '梵高：线条留下清晰的运动路径', text: '星光、夜空、柏树与山脉都有明确的笔触节奏。深蓝与亮黄的关系，让天空的变化成为整体体验的中心；观察、记忆和想象共同进入构图。' },
      { title: '透纳：光气让形体变得不稳定', text: '在这幅风雪画中，船只被暗云、浪与浅光包围。边界消融之后，视觉回旋带来失去方向的感觉；自然力量的压迫与《星月夜》的神秘感可以分别体会。' },
    ],
    conclusion: '两幅画都能创造旋动的视觉经验，但方法和情绪不同。这里是形式比较，不能据相似效果推定梵高直接取法此画，也不能把旋涡当作证明幻觉经历或作出医学诊断的依据。',
    sources: ['starry', 'starry-letter', 'snow'],
  },
  {
    id: 'impasto', label: '梵高 × 蒙蒂切利', question: '已有厚涂前例，梵高的创新还在哪里？', title: '继承一种技法，组织另一种世界',
    works: ['vg-sunflowers', 'monticelli-flowers'],
    looking: ['观察花头边缘的清楚轮廓，以及颜料堆起后形成的质感。', '观察亮色花朵怎样从深色背景浮出，颜料的厚度如何强调局部闪光。'],
    points: [
      { title: '影响关系有直接证据', text: '梵高在 689 号信中将自己的厚涂联系到蒙蒂切利。承认这个前例，比把某一种笔触说成梵高的独家发明更准确。所选蒙蒂切利作品约作于 1875 年。' },
      { title: '独创性仍须逐幅讨论', text: '在这对画中，蒙蒂切利的深色底与花朵亮部形成闪烁；梵高则让黄底、花瓣与花瓶成为更连贯的色调关系。技法相通，仍可用于不同的轮廓、节奏与情绪。' },
    ],
    conclusion: '“厚涂并非梵高的独家发明”这个判断成立；由此推出“没有艺术创新”则跨过了作品组织这一层。是否喜欢厚涂，和如何评价画家改造它，是两个问题。',
    sources: ['monticelli', 'letter-impasto', 'vg-flower'],
  },
  {
    id: 'japan', label: '梵高 × 日本浮世绘', question: '这次不是相似，而是有据可查的临摹。', title: '广重的梅园，从木版到油彩',
    works: ['hiroshige-plum', 'vg-plum'],
    looking: ['巨大梅树占据前景，远处的小人和园林从枝干间显现；这张是布鲁克林馆藏印本。', '比较相近的树干与远景位置，再看油彩质感、色彩选择和新增的橙色边框。'],
    points: [
      { title: '借来的构图，清楚承认', text: '《盛开的梅园（仿广重）》保留广重的基本构图，梵高用网格描摹并放大。这里展示的是同一设计的另一馆藏印本，不能声称眼前这张就是他当年持有的那张版画。' },
      { title: '变化发生在媒介与取舍中', text: '梵高改动了色彩，添加边框，并借用另一幅版画中的日文。浮世绘还启发了他对放大前景、突然裁切和空间安排的理解；具体临摹与更广泛的吸收应分别讨论。' },
    ],
    conclusion: '这幅油画确有直接借鉴，不宜被包装成构图从零开始的原创。也不必因此否定跨媒介转换或他后来作品的独创性。不同木版印次本来就可能有颜色差别，比较时须保留这一层限制。',
    sources: ['japan', 'plum'],
  },
];

export const gallery = [
  { id: 'norham', tags: ['金色光雾', '水与倒影'], route: '从《现代罗马》出发，先看这一幅', note: '城堡退成柔软的蓝影，日光与河面几乎连成一片。试着只看整幅的暖冷关系，再找回建筑：空间还在，边界却越来越轻。', prompt: '留意：即使没有清晰建筑，光是否仍能让你停留？' },
  { id: 'temeraire', tags: ['金色光雾', '水与倒影'], route: '暖光、远方与回望', note: '白金色旧船与深色拖轮置于炽热的晚霞下。夕照在河面延伸，温暖并没有抹去离别感；画面也是对时代更替的想象性重构。', prompt: '留意：吸引你的是晚霞，还是旧船告别一个时代的感觉？' },
  { id: 'rain-steam', tags: ['金色光雾', '空间崇高'], route: '给梦幻的空气一点速度', note: '雨气让远景柔化，斜向桥轨却把空间推向面前。它可连接你对弥散光的偏好与对《星月夜》运动感的喜爱。', prompt: '留意：斜线制造的冲力，和旋涡牵引视线有什么不同？' },
  { id: 'parliament-fire', tags: ['金色光雾', '水与倒影', '空间崇高'], route: '温暖色彩，也可以带来危险', note: '火光与倒影让城市成为耀眼的色场。这里选克利夫兰的 1835 年版本；题名中的 1834 年是火灾日期。它有宏大氛围，也比宁静的梦幻更激烈。', prompt: '留意：相近的金橙色，在这里仍让你觉得安宁吗？' },
  { id: 'monet-parliament', tags: ['金色光雾', '水与倒影'], route: '建筑成为雾中的剪影', note: '先看天光、水面与建筑如何被相近的色调连接，再看国会大厦的边缘还剩下多少。画面让光与雾成为理解地点的方式。', prompt: '留意：是建筑的细节，还是包围它的空气更打动你？' },
  { id: 'monet-lilies', tags: ['水与倒影'], route: '把地平线暂时拿走', note: '水面、倒影与漂浮的花叶交织，让目光难以在前景、远景之间固定。这里的沉浸可以很安静：不用旋涡，也能让视线持续游走。', prompt: '留意：水面像一个地方，还是一片可以进入的颜色？' },
  { id: 'whistler-nocturne', tags: ['夜色静穆', '水与倒影'], route: '把强烈，换成低声的夜曲', note: '桥、水与夜色由少量色调连接，空间依靠朦胧关系显现。它可能让你喜欢整体氛围，也可能因为不够明亮而显得疏远。', prompt: '留意：少了灿烂金光，空气本身还能吸引你吗？' },
  { id: 'wanderer', tags: ['空间崇高'], route: '用冷雾检验空间偏好', note: '人物的背影给观看一个立足点，雾中的山峰又把目光推向远处。它更冷冽、静穆，可检验你喜欢的是暖光，还是宏大的空间本身。', prompt: '留意：你愿意进入这个世界，还是只愿意远远看它？' },
  { id: 'moon', tags: ['夜色静穆', '空间崇高'], route: '在暮色里，试一次长久停留', note: '两个人与月亮形成安静的观看关系。树木、天空和暮色的距离，比璀璨的颜色更重要；这是推荐中较需要亲自检验的一支。', prompt: '留意：静止的凝望，能否带来和动态夜空相近的沉浸？' },
];
