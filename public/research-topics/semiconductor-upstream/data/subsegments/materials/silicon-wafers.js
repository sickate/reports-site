import { createDeepDiveSubsegment } from '../../../lib/create-subsegment.js';

export default createDeepDiveSubsegment({
  slug: 'silicon-wafers',
  name: '硅片',
  section: '材料',
  flowTo: ['晶圆制造（前道）'],
  initialOpen: true,
  summary: '300mm 抛光片、外延片和 SOI 仍是前道材料里壁垒最高的一档，真正的卡点在高规格工艺与长认证周期。',
  market: {
    v2024: 11.5,
    v2025: 11.4,
    basis: 'A',
    note: '采用 SEMI / SMG 公开收入口径；短期受库存与稼动率影响，但高规格大硅片壁垒没有变化。'
  },
  detail: {
    title: '硅片板块深度拆解',
    intro: '把“硅片”拆成三层来看：A 看全球双寡头，B 看台系国际化平台，C 看 A 股国产替代。阅读重点不只是名义产能，而是高规格产品结构、客户认证和良率爬坡。',
    updateNote: '硅片板块现在也走统一深拆组件；后续补财务时直接往共享公司财务库加条目即可。',
    groups: [
      {
        title: 'A. 全球主线寡头',
        desc: '这一层决定了 12 英寸高端抛光片、外延片和 SOI 的产业节奏。它们的优势不只在规模，更在高规格工艺、稳定良率和长认证周期。',
        companies: [
          {
            name: 'Shin-Etsu Chemical',
            market: 'jp',
            summary: '全球高端硅片双寡头之一，强在 12 英寸、大客户认证与综合材料体系。',
            tags: ['12-inch', 'Japan', 'prime wafer'],
            note: '研究重点在高规格大硅片与综合材料平台协同，而不是简单名义产能。'
          },
          {
            name: 'SUMCO',
            market: 'jp',
            summary: '全球 12 英寸硅片核心纯赛道玩家，是观察行业景气与扩产节奏的主线标的。',
            tags: ['12-inch', 'advanced node', 'Japan'],
            note: '更接近 pure-play 硅片口径，适合用来观察行业价格与稼动率周期。'
          }
        ]
      },
      {
        title: 'B. 台系国际化平台',
        desc: '这组适合看区域产能布局、特殊规格片和国际客户结构，核心不是份额最大，而是全球化平台能力和产品线延展。',
        companies: [
          {
            name: 'GlobalWafers（环球晶）',
            market: 'tw',
            summary: '最重要的台系国际化硅片平台之一，跨地区产能和特殊规格片布局完整。',
            tags: ['Taiwan', 'specialty wafers', 'global capacity'],
            note: '更适合从全球化供给平台与特殊规格片结构升级来理解。'
          }
        ]
      },
      {
        title: 'C. A股国产替代',
        desc: 'A 股当前更适合看国产替代、产品升级和客户验证，不宜把整体自给率直接套到先进 300mm、外延片或 SOI。',
        companies: [
          {
            name: '沪硅产业',
            market: 'cn',
            summary: 'A 股大硅片主线标的，核心看高规格产品验证、良率与客户突破。',
            tags: ['A股', '国产替代', '12-inch'],
            note: '整体自给率参考意义有限，真正关键是先进规格的验证与导入进度。'
          }
        ]
      }
    ]
  }
});
