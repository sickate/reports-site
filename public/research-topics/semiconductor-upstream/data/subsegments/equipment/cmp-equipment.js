import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'cmp-equipment',
  name: 'CMP 设备',
  section: '设备',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '又一个集中度极高、客户粘性很强的前道设备环节，核心受益先进互连、存储和部分先进封装工艺升级。',
  market: {
    v2024: 3.5,
    v2025: 4.1,
    basis: 'B',
    note: '以 CMP tool 寡头市场结构为基础，结合先进互连、存储和部分先进封装增量需求进行网页映射。'
  },
  detail: {
    title: 'CMP 设备板块深度拆解',
    intro: '把“CMP 设备”拆成四层来看：A 看全球主线龙头，B 看正式拥有 CMP 产品线但业务更广的平台型设备商，C 看区域型挑战者，D 看 A 股材料与零部件映射。阅读时先抓 Ebara / Applied / 华海清科，再往下看周边平台和国产材料链。',
    updateNote: '你这批数据标题里写了“探针台”，但内容实际对应 CMP / 抛光赛道，我已经按 CMP 设备板块落地。统一财务卡也同步用了这版口径。',
    groups: [
      {
        title: 'A. 全球主线龙头',
        desc: '这一层是 CMP 赛道最值得优先研究的核心供给侧。Applied Materials 代表平台型前道龙头，Ebara 是全球 CMP 主线龙头之一，华海清科则是中国本土主机主线，三者共同构成了这个赛道最重要的观察框架。',
        companies: [
          {
            name: 'Applied Materials',
            market: 'us',
            cap: 'USD 255.31B',
            summary: '全球前道平台龙头，CMP 是其 Semiconductor Systems 中的重要一条产品线。',
            tags: ['CMP', 'front-end', 'platform', 'logic', 'memory'],
            note: '平台型公司；CMP 非独立收入口径。',
            segmentExposure: {
              role: '在 CMP 设备里属于全球主线龙头之一，但本质上仍是平台型前道设备公司，CMP 只是其中一条重要产品线。',
              revenueShare: { value: '未单独披露', note: '公司未按 CMP 单项拆分收入。' },
              profitShare: { value: '未单独披露', note: '利润随更大的半导体系统业务披露。' },
              source: '公司分部披露 / 产品线口径',
              badges: ['全球主线', '平台型'],
              note: '这类公司后续建议补“CMP 在半导体系统中的权重”而不是直接拿公司总收入替代 CMP 收入。'
            }
          },
          {
            name: 'Ebara（荏原）',
            market: 'jp',
            cap: 'USD 14.74B',
            summary: '全球 CMP 主线龙头之一，覆盖 CMP、bevel polishing、plating 等完整量产平台。',
            tags: ['CMP', '300mm', 'bevel', 'plating', 'japan'],
            note: '非纯 CMP；市值以母公司整体计，CMP 敞口位于半导体制造设备相关业务。',
            segmentExposure: {
              role: '在 CMP 设备里是全球最关键主线之一，但上市公司主体仍覆盖泵、环境工程等更广业务，不能直接把母公司口径视为 CMP pure-play。',
              revenueShare: { value: '待补', note: '建议后续补“半导体系统 / CMP 相关收入占母公司比例”的拆分口径。' },
              profitShare: { value: '待补', note: '未见按 CMP 单独披露利润。' },
              source: '母公司财务 + 半导体制造设备业务口径',
              badges: ['全球主线', '母公司口径']
            }
          },
          {
            name: '华海清科',
            market: 'cn',
            cap: 'RMB 61.40B',
            summary: '中国 CMP 整机龙头，已从单一 CMP 扩展到平台化半导体装备。',
            tags: ['CMP', 'china', 'domestic-substitution', 'platform', 'front-end'],
            note: '中国本土主线；但已扩至减薄、离子注入、湿法等，非纯 CMP-only 叙事。',
            segmentExposure: {
              role: '在 CMP 设备里是 A 股最直接的整机主线，但公司已经从单一 CMP 走向平台化，后续需要持续跟踪 CMP 在总盘子里的占比变化。',
              revenueShare: { value: '待补', note: '建议后续补“CMP 主设备 / 耗材 / 新平台”三层收入拆分。' },
              profitShare: { value: '待补', note: '利润贡献尚需结合业务拆分估算。' },
              source: '公司主业结构 / 研究口径',
              badges: ['A股主线', '平台化中']
            }
          }
        ]
      },
      {
        title: 'B. 正式产品线玩家',
        desc: '这组公司在 CMP 上是“正式参与者”，但整体业务更偏广义 semicap、量测或精密设备平台。东京精密是其中最值得跟踪的名字，既有官方 CMP 产品线，也保留了更多跨板块设备属性。',
        companies: [
          {
            name: '东京精密',
            market: 'jp',
            cap: 'USD 4.01B',
            summary: '日本精密设备厂商，拥有正式 CMP 产品线，但整体更偏 broader semicap / metrology。',
            tags: ['CMP', 'semicap', 'metrology', 'compact', 'japan'],
            note: '业务重要但非纯 CMP；公司收入包含更广泛设备与测量业务。',
            segmentExposure: {
              role: '在 CMP 环节属于“正式产品线玩家”，有真实产品布局，但研究时更应把它当作广义 semicap / metrology 平台来读。',
              revenueShare: { value: '未单独披露', note: 'CMP 产品线未单独成为上市公司主表收入项目。' },
              profitShare: { value: '未单独披露', note: '利润同样未按 CMP 单独披露。' },
              source: '公司业务口径',
              badges: ['正式产品线', '非纯CMP']
            }
          }
        ]
      },
      {
        title: 'C. 区域型挑战者',
        desc: 'KC Tech 代表韩国区域型 CMP 设备玩家，虽然全球份额不在一线寡头之列，但兼具 slurry / wet cleaning 组合，在区域客户和订单节奏上有一定跟踪价值。',
        companies: [
          {
            name: 'KC Tech',
            market: 'kr',
            cap: 'USD 0.69B',
            summary: '韩国区域型 CMP 设备玩家，兼有 slurry / wet cleaning 组合。',
            tags: ['CMP', 'slurry', 'wet-cleaning', 'korea', 'regional'],
            note: '非纯 CMP；业务同时覆盖材料与清洗，全球份额并非主线寡头。'
          }
        ]
      },
      {
        title: 'D. A股材料与零部件映射',
        desc: 'A 股在 CMP 赛道里更适合从材料和关键零部件映射去看。安集科技和鼎龙股份分别对应 slurry、post-CMP clean 与抛光垫主线，富创精密则更适合作为整机关键零部件平台的下游映射。',
        companies: [
          {
            name: '安集科技',
            market: 'cn',
            cap: 'RMB 47.02B',
            summary: '中国 CMP slurry 与 post-CMP clean 核心材料龙头。',
            tags: ['CMP-slurry', 'post-CMP-clean', 'materials', 'china', 'advanced-nodes'],
            note: '非整机；用于 CMP 板块关键材料映射。'
          },
          {
            name: '鼎龙股份',
            market: 'cn',
            cap: 'RMB 50.31B',
            summary: 'A 股 CMP 抛光垫主线，同时覆盖 slurry / cleaner 等半导体材料。',
            tags: ['CMP-pad', 'slurry', 'cleaner', 'materials', 'china'],
            note: '非整机；平台型材料公司，CMP 仅为其半导体材料板块一部分。'
          },
          {
            name: '富创精密',
            market: 'cn',
            cap: 'RMB 27.88B',
            summary: '半导体设备精密部件 / 模组平台，适合作为 CMP 整机关键零部件映射。',
            tags: ['precision-modules', 'semicap-components', 'china', 'non-pure', 'supply-chain'],
            note: '非纯 CMP；并非整机厂，CMP 为下游半导体设备客户映射。'
          }
        ]
      }
    ]
  }
});
