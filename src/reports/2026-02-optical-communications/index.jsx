import { useState } from "react";

const data = {
  tamGrowth: [
    { year: "2024", traditional: 25, emerging: 0.2 },
    { year: "2025", traditional: 30, emerging: 1 },
    { year: "2026", traditional: 40, emerging: 5 },
    { year: "2027", traditional: 52, emerging: 12 },
    { year: "2028", traditional: 65, emerging: 23 },
  ],
  fiveTracksData: [
    { name: "铜→光\n(Scale-up)", tam2028: 6.5, difficulty: "中", timeline: "2028+", color: "#F59E0B" },
    { name: "CPO\n(Scale-up)", tam2028: 3.0, difficulty: "高", timeline: "2028+", color: "#EF4444" },
    { name: "OCS\n(Scale-out)", tam2028: 5.7, difficulty: "中高", timeline: "2024-2028", color: "#3B82F6" },
    { name: "CPO\n(Scale-out)", tam2028: 5.0, difficulty: "高", timeline: "2028+", color: "#8B5CF6" },
    { name: "带外管理\n(PON)", tam2028: 3.0, difficulty: "低", timeline: "已落地", color: "#10B981" },
  ],
  ocsGrowth: [
    { year: "2024", revenue: 0.198, portShare: 15 },
    { year: "2025", revenue: 0.8, portShare: 17 },
    { year: "2026", revenue: 2.0, portShare: 19 },
    { year: "2027", revenue: 3.8, portShare: 22 },
    { year: "2028", revenue: 5.709, portShare: 25 },
  ],
  stockPerformance: [
    { ticker: "LITE", gain: "~400%+", pe2028: "35x+", risk: "高", rating: "谨慎" },
    { ticker: "GLW", gain: "~200%", pe2028: "30-35x", risk: "中", rating: "偏好" },
    { ticker: "COHR", gain: "~200%", pe2028: "30-40x", risk: "中高", rating: "中性" },
    { ticker: "CIEN", gain: "~200%", pe2028: "30-40x", risk: "中", rating: "中性" },
  ],
};

const Section = ({ title, children, accent = "#3B82F6" }) => (
  <div style={{ marginBottom: 48, position: "relative" }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
    }}>
      <div style={{ width: 4, height: 28, background: accent, borderRadius: 2 }} />
      <h2 style={{
        fontSize: 20, fontWeight: 700, color: "#E2E8F0", margin: 0,
        fontFamily: "'Noto Serif SC', 'Source Han Serif SC', Georgia, serif",
        letterSpacing: 1,
      }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: "rgba(30, 41, 59, 0.7)", borderRadius: 12,
    border: "1px solid rgba(148, 163, 184, 0.12)",
    padding: 24, ...style,
  }}>{children}</div>
);

const BarChart = ({ items, maxVal, valueKey, labelKey, colorKey, unit = "$", suffix = "B" }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 90, fontSize: 12, color: "#94A3B8", textAlign: "right",
          whiteSpace: "pre-line", lineHeight: 1.3, fontFamily: "monospace",
        }}>{item[labelKey]}</div>
        <div style={{ flex: 1, position: "relative", height: 28 }}>
          <div style={{
            height: "100%", borderRadius: 6,
            background: `linear-gradient(90deg, ${item[colorKey]}CC, ${item[colorKey]}88)`,
            width: `${Math.max((item[valueKey] / maxVal) * 100, 4)}%`,
            transition: "width 0.6s ease",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            paddingRight: 10, boxSizing: "border-box",
          }}>
            <span style={{
              fontSize: 13, fontWeight: 700, color: "#fff",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 1px 3px rgba(0,0,0,0.5)",
            }}>{unit}{item[valueKey]}{suffix}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const tabs = ["总览", "五条赛道", "OCS详解", "估值与选股", "关键争论"];

export default function ReportSummary() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{
      minHeight: "100vh", background: "#0F172A",
      color: "#CBD5E1",
      fontFamily: "'Noto Sans SC', 'PingFang SC', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
        padding: "36px 24px 24px",
      }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: "#3B82F6", letterSpacing: 3,
            textTransform: "uppercase", marginBottom: 12,
            fontFamily: "'JetBrains Mono', monospace",
          }}>MORGAN STANLEY · RESEARCH SUMMARY</div>
          <h1 style={{
            fontSize: 28, fontWeight: 800, color: "#F1F5F9", margin: 0,
            lineHeight: 1.3,
            fontFamily: "'Noto Serif SC', Georgia, serif",
          }}>光通信：AI数据中心的物理边界</h1>
          <p style={{
            fontSize: 14, color: "#64748B", marginTop: 8, lineHeight: 1.6,
          }}>
            分析师：Meta Marshall & Mary Lenox · 2025年12月 · 2026年展望报告
          </p>
          <div style={{
            display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap",
          }}>
            {[
              { label: "光学市场2025", value: "~$30B" },
              { label: "基准情形2028", value: "$65B+" },
              { label: "新增TAM", value: "+$23B" },
              { label: "远期TAM", value: "~$90B" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: 8, padding: "10px 16px",
              }}>
                <div style={{ fontSize: 11, color: "#64748B" }}>{item.label}</div>
                <div style={{
                  fontSize: 20, fontWeight: 800, color: "#60A5FA",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
        background: "rgba(15, 23, 42, 0.9)", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{
          maxWidth: 860, margin: "0 auto", display: "flex", gap: 0,
          overflowX: "auto", padding: "0 24px",
        }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              padding: "14px 20px", fontSize: 14, fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? "#60A5FA" : "#64748B",
              background: "transparent", border: "none", cursor: "pointer",
              borderBottom: activeTab === i ? "2px solid #3B82F6" : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap",
              fontFamily: "'Noto Sans SC', sans-serif",
            }}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Tab 0: 总览 */}
        {activeTab === 0 && (
          <>
            <Section title="核心论点：从升级周期到架构迁移" accent="#F59E0B">
              <Card>
                <p style={{ fontSize: 15, lineHeight: 1.9, margin: 0, color: "#CBD5E1" }}>
                  这份报告的核心观点并非“又一轮800G/1.6T升级”，而是认为<span style={{ color: "#F59E0B", fontWeight: 700 }}>网络架构正在从铜走向光</span>——
                  把共封装光学（CPO）、光电路交换（OCS）等“讲了十年但没大规模落地”的技术，提前折进估值。
                  资金在买的是<span style={{ color: "#60A5FA", fontWeight: 700 }}>“下一次网络范式迁移”</span>，而不是一个季度的订单。
                </p>
              </Card>
            </Section>

            <Section title="市场规模路径：2025 → 2028" accent="#3B82F6">
              <Card>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.tamGrowth.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 48, fontSize: 13, color: "#94A3B8", textAlign: "right",
                        fontFamily: "monospace", fontWeight: 600,
                      }}>{d.year}</div>
                      <div style={{ flex: 1, display: "flex", height: 30, borderRadius: 6, overflow: "hidden", gap: 2 }}>
                        <div style={{
                          width: `${(d.traditional / 90) * 100}%`,
                          background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                          display: "flex", alignItems: "center", paddingLeft: 8,
                          transition: "width 0.5s",
                        }}>
                          <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, fontFamily: "monospace" }}>
                            ${d.traditional}B
                          </span>
                        </div>
                        {d.emerging > 0.5 && (
                          <div style={{
                            width: `${(d.emerging / 90) * 100}%`,
                            background: "linear-gradient(90deg, #F59E0B, #FBBF24)",
                            display: "flex", alignItems: "center", paddingLeft: 6,
                            transition: "width 0.5s",
                          }}>
                            <span style={{ fontSize: 11, color: "#0F172A", fontWeight: 700, fontFamily: "monospace" }}>
                              +${d.emerging}B
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: "#3B82F6" }} />
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>传统光学市场</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: "#F59E0B" }} />
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>新兴光学增量 (CPO/OCS/铜→光等)</span>
                  </div>
                </div>
              </Card>
            </Section>

            <Section title="铜的物理极限：为什么必须转向光" accent="#EF4444">
              <Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { icon: "⚡", title: "传输距离骤降", desc: `AEC传输距离在下一代（Rubin）大概率“砍半”至~2.5m` },
                    { icon: "🔥", title: "功耗与可靠性", desc: `微软研究：光方案功耗/失效率可能比铜“最差到100倍”` },
                    { icon: "📏", title: "英伟达路线", desc: `承诺到Rubin仍用铜，但再往后“可能需要转向光”` },
                    { icon: "🔄", title: "全链条重做", desc: "不是单点替换，是全链条架构重做——所以慢，但机会大" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: "rgba(239, 68, 68, 0.06)", borderRadius: 8,
                      padding: 16, border: "1px solid rgba(239, 68, 68, 0.15)",
                    }}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#F87171", marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </Section>
          </>
        )}

        {/* Tab 1: 五条赛道 */}
        {activeTab === 1 && (
          <>
            <Section title="五条增量赛道 · 2028年TAM估算" accent="#8B5CF6">
              <Card>
                <BarChart
                  items={data.fiveTracksData}
                  maxVal={7}
                  valueKey="tam2028"
                  labelKey="name"
                  colorKey="color"
                />
                <div style={{
                  marginTop: 20, padding: "16px 0 0",
                  borderTop: "1px solid rgba(148, 163, 184, 0.1)",
                }}>
                  <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10 }}>落地难度 & 时间线</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {data.fiveTracksData.map((t, i) => (
                      <div key={i} style={{
                        fontSize: 12, padding: "6px 12px", borderRadius: 6,
                        background: `${t.color}15`, border: `1px solid ${t.color}30`,
                        color: t.color,
                      }}>
                        {t.name.replace("\n", " ")} · 难度{t.difficulty} · {t.timeline}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Section>

            {[
              {
                title: "① 铜→光 (Scale-up)", accent: "#F59E0B",
                points: [
                  "当前DAC/AEC市场约~$1B，光缆成本至少2x铜缆",
                  "数据中心铜消耗约~$6B，其中数据传输~$1.5B",
                  "假设2029/2030各20%增长，传输铜到2030年可能达~$5B",
                  "2028年对应机会约$6.5B"
                ]
              },
              {
                title: "② CPO (Scale-up)", accent: "#EF4444",
                points: [
                  "到2028年约~$3B市场 （Omdia口径）",
                  "ASP可能是传统可插拔方案的~8–10倍",
                  "坏了不能热插拔，失效成本更高、良率更难控制",
                  "供给更集中在英伟达、博通等大厂路线，利润池更集中"
                ]
              },
              {
                title: "③ OCS (Scale-out)", accent: "#3B82F6",
                points: [
                  "收入从2024年$198M到2028年$5,709M （约29倍增长）",
                  "OCS端口占比从15%（2024）到25%（2028）",
                  "减少O-E-O转换，降低延迟和功耗",
                  "前提：需对流量模式非常清楚，不适合高度动态流量"
                ]
              },
              {
                title: "④ CPO (Scale-out / On-board)", accent: "#8B5CF6",
                points: [
                  `约~$5B（主要算“激光价值” ≈ 光模块成本的50%）`,
                  "约15%的光模块市场搬到板上",
                  "部分光模块价值链由on-board CPO结构替代",
                  "报告存在scale-up/scale-out表述交叉"
                ]
              },
              {
                title: "⑤ 带外管理 (PON)", accent: "#10B981",
                points: [
                  "成本约占机架网络/光学成本的2%–5%，AI场景更接近2%–3%",
                  "基于~$150B云网络市场，推算出$3–4B",
                  "Ciena DCOM：与Meta共研，节省99%空间、降低30%功耗",
                  "Ciena已有几亿美元收入，另有两家超大厂深度讨论中"
                ]
              },
            ].map((section, si) => (
              <Section key={si} title={section.title} accent={section.accent}>
                <Card>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {section.points.map((p, pi) => (
                      <div key={pi} style={{
                        display: "flex", alignItems: "flex-start", gap: 10,
                        fontSize: 14, lineHeight: 1.7, color: "#CBD5E1",
                      }}>
                        <span style={{ color: section.accent, fontWeight: 700, flexShrink: 0 }}>›</span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </Section>
            ))}
          </>
        )}

        {/* Tab 2: OCS详解 */}
        {activeTab === 2 && (
          <>
            <Section title="OCS收入增长路径" accent="#3B82F6">
              <Card>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>从$198M到$5,709M的跨越 · </span>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: "#60A5FA",
                    fontFamily: "monospace",
                  }}>约29倍增长（2024–2028）</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {data.ocsGrowth.map((d, i) => (
                    <div key={i}>
                      <div style={{
                        display: "flex", justifyContent: "space-between", marginBottom: 6,
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0", fontFamily: "monospace" }}>
                          {d.year}
                        </span>
                        <span style={{ fontSize: 14, color: "#60A5FA", fontFamily: "monospace", fontWeight: 700 }}>
                          ${d.revenue.toFixed(1)}B · 端口占比{d.portShare}%
                        </span>
                      </div>
                      <div style={{
                        height: 8, borderRadius: 4, background: "rgba(59, 130, 246, 0.1)",
                        overflow: "hidden",
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 4,
                          background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                          width: `${(d.revenue / 6) * 100}%`,
                          transition: "width 0.5s",
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Section>

            <Section title="OCS技术逻辑" accent="#3B82F6">
              <Card>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr", gap: 16,
                }}>
                  <div style={{
                    background: "rgba(59, 130, 246, 0.05)", borderRadius: 8,
                    padding: 20, border: "1px solid rgba(59, 130, 246, 0.15)",
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#60A5FA", marginBottom: 12 }}>
                      传统方式 vs OCS
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 13, color: "#EF4444", fontWeight: 600, marginBottom: 6 }}>❌ 传统: O-E-O转换</div>
                        <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
                          光→电→光 多次转换，每次转换都消耗功耗并增加延迟
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: "#10B981", fontWeight: 600, marginBottom: 6 }}>✓ OCS: 全光交换</div>
                        <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>
                          减少O-E-O转换，直接在光域完成电路交换，降低延迟和功耗
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                  }}>
                    <div style={{
                      background: "rgba(16, 185, 129, 0.06)", borderRadius: 8,
                      padding: 14, border: "1px solid rgba(16, 185, 129, 0.15)",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#10B981" }}>优势</div>
                      <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6, lineHeight: 1.6 }}>
                        功耗大幅降低，延迟减少；Google已小范围验证7年
                      </div>
                    </div>
                    <div style={{
                      background: "rgba(239, 68, 68, 0.06)", borderRadius: 8,
                      padding: 14, border: "1px solid rgba(239, 68, 68, 0.15)",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#F87171" }}>局限</div>
                      <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 6, lineHeight: 1.6 }}>
                        需精确了解流量模式，不适合高度动态流量场景
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Section>
          </>
        )}

        {/* Tab 3: 估值与选股 */}
        {activeTab === 3 && (
          <>
            <Section title={`估值已在定价“完美落地”`} accent="#EF4444">
              <Card>
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20,
                }}>
                  {[
                    { label: "龙头平均涨幅", value: "300%+", sub: "过去一年" },
                    { label: "估值水平", value: "30-40x", sub: "FY28盈利预期" },
                    { label: "新增市值", value: "$180B+", sub: "过去一年合计" },
                    { label: "年内额外上涨", value: "~50%", sub: "2025年内" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      background: "rgba(239, 68, 68, 0.05)", borderRadius: 8,
                      padding: 14, border: "1px solid rgba(239, 68, 68, 0.12)",
                      textAlign: "center",
                    }}>
                      <div style={{
                        fontSize: 22, fontWeight: 800, color: "#F87171",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>{item.value}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: "rgba(245, 158, 11, 0.08)", borderRadius: 8,
                  padding: 14, border: "1px solid rgba(245, 158, 11, 0.2)",
                  fontSize: 14, color: "#FBBF24", lineHeight: 1.7, fontWeight: 500,
                }}>
                  ⚠️ 报告直言：市场把“5-10年的产业剧本”压缩成了“12个月的股价”。只要capex数据点继续上修，这些票就还能跑。但不少地方已经开始“price in perfection”。
                </div>
              </Card>
            </Section>

            <Section title="个股风险曲线对比" accent="#8B5CF6">
              <Card>
                <div style={{ overflowX: "auto" }}>
                  <table style={{
                    width: "100%", borderCollapse: "collapse", fontSize: 14,
                  }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(148, 163, 184, 0.15)" }}>
                        {["标的", "过去一年涨幅", "FY28 PE", "风险等级", "MS态度"].map((h, i) => (
                          <th key={i} style={{
                            padding: "10px 12px", textAlign: "left", color: "#64748B",
                            fontSize: 12, fontWeight: 600,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.stockPerformance.map((s, i) => (
                        <tr key={i} style={{
                          borderBottom: "1px solid rgba(148, 163, 184, 0.07)",
                        }}>
                          <td style={{
                            padding: "12px", fontWeight: 700, color: "#E2E8F0",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>{s.ticker}</td>
                          <td style={{ padding: "12px", color: "#10B981", fontFamily: "monospace" }}>{s.gain}</td>
                          <td style={{ padding: "12px", color: "#F59E0B", fontFamily: "monospace" }}>{s.pe2028}</td>
                          <td style={{ padding: "12px" }}>
                            <span style={{
                              padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                              background: s.risk === "高" ? "rgba(239,68,68,0.15)" : s.risk === "中高" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)",
                              color: s.risk === "高" ? "#F87171" : s.risk === "中高" ? "#FBBF24" : "#60A5FA",
                            }}>{s.risk}</span>
                          </td>
                          <td style={{
                            padding: "12px", fontWeight: 600,
                            color: s.rating === "偏好" ? "#10B981" : s.rating === "谨慎" ? "#EF4444" : "#94A3B8",
                          }}>{s.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{
                    fontSize: 13, color: "#94A3B8", lineHeight: 1.7,
                    padding: 12, background: "rgba(16, 185, 129, 0.05)", borderRadius: 8,
                    borderLeft: "3px solid #10B981",
                  }}>
                    <strong style={{ color: "#10B981" }}>GLW（康宁）偏好：</strong>“铜到光”的scale-up迁移大概率2028之后，反而没被充分写进一致预期，给了“2028之后还能继续讲增长窗口”的理由。光纤更像“长坡厚雪”。
                  </div>
                  <div style={{
                    fontSize: 13, color: "#94A3B8", lineHeight: 1.7,
                    padding: 12, background: "rgba(239, 68, 68, 0.05)", borderRadius: 8,
                    borderLeft: "3px solid #EF4444",
                  }}>
                    <strong style={{ color: "#F87171" }}>LITE（Lumentum）谨慎：</strong>市场定价依赖EML紧缺+高毛利持续。光器件行业历史上每年10-15%价格下滑，但已连续2年不降反涨。一旦供需均衡或硅光替代加速，价格压力就会回来。
                  </div>
                </div>
              </Card>
            </Section>
          </>
        )}

        {/* Tab 4: 关键争论 */}
        {activeTab === 4 && (
          <>
            <Section title="争论点1：CPO是2028起飞，还是继续讲PPT？" accent="#8B5CF6">
              <Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{
                    background: "rgba(16, 185, 129, 0.06)", borderRadius: 8,
                    padding: 16, border: "1px solid rgba(16, 185, 129, 0.15)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981", marginBottom: 10 }}>🐂 多头逻辑</div>
                    <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
                      基准情形假设scale-out到2028年~15% CPO渗透；I/O、功耗、延迟瓶颈逼近，CPO迟早上台面
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(239, 68, 68, 0.06)", borderRadius: 8,
                    padding: 16, border: "1px solid rgba(239, 68, 68, 0.15)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#F87171", marginBottom: 10 }}>🐻 空头逻辑</div>
                    <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
                      生态、标准化、良率、可维护性都是硬骨头。OCS被Google小范围用了7年，CPO被讨论了10年
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: 16, padding: 14, borderRadius: 8,
                  background: "rgba(139, 92, 246, 0.06)",
                  border: "1px solid rgba(139, 92, 246, 0.15)",
                  fontSize: 13, color: "#A78BFA", lineHeight: 1.7,
                }}>
                  💡 <strong>作者判断：</strong>CPO是“决定估值天花板”的变量，不是“决定当季业绩”的变量。需要看到封装生态成熟 + 大厂明确时间表。
                </div>
              </Card>
            </Section>

            <Section title="争论点2：EML紧缺和定价能撑到FY28吗？" accent="#F59E0B">
              <Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{
                    background: "rgba(16, 185, 129, 0.06)", borderRadius: 8,
                    padding: 16, border: "1px solid rgba(16, 185, 129, 0.15)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981", marginBottom: 10 }}>🐂 多头逻辑</div>
                    <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
                      过去两年价格不降反涨，紧缺带来超额利润；AI capex不松，紧缺延续
                    </div>
                  </div>
                  <div style={{
                    background: "rgba(239, 68, 68, 0.06)", borderRadius: 8,
                    padding: 16, border: "1px solid rgba(239, 68, 68, 0.15)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#F87171", marginBottom: 10 }}>🐻 空头逻辑</div>
                    <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>
                      行业规律每年10%–15%降价；产能起来/硅光替代加速，价格就回归周期。硅光当前良率~60%，需达到80%–90%才具备价格竞争力
                    </div>
                  </div>
                </div>
                <div style={{
                  marginTop: 16, padding: 14, borderRadius: 8,
                  background: "rgba(245, 158, 11, 0.06)",
                  border: "1px solid rgba(245, 158, 11, 0.15)",
                  fontSize: 13, color: "#FBBF24", lineHeight: 1.7,
                }}>
                  💡 <strong>作者判断：</strong>不站队“永远紧缺”也不站队“立刻崩价”。核心盯两条线：①capex是否继续上修 ②硅光在800G/1.6T的渗透和良率进展
                </div>
              </Card>
            </Section>

            <Section title="接下来最该盯的变量/事件" accent="#3B82F6">
              <Card>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { event: "GTC与OFC（行业大会）", desc: "大厂路线会不会给出更清晰的CPO/OCS节点", urgency: "高" },
                    { event: "Capex数据点", desc: "只要上修，股价还能跑；下修则立刻变成估值压力", urgency: "高" },
                    { event: "EML/光模块定价", desc: `从“紧缺涨价”回归“周期性下滑”的任何早期信号`, urgency: "中高" },
                    { event: "硅光良率进展", desc: "当前~60%，需达到80%–90%才具备价格竞争力", urgency: "中" },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: 14, borderRadius: 8,
                      background: "rgba(59, 130, 246, 0.04)",
                      border: "1px solid rgba(59, 130, 246, 0.1)",
                    }}>
                      <div style={{
                        flexShrink: 0, width: 40, height: 40, borderRadius: "50%",
                        background: item.urgency === "高" ? "rgba(239,68,68,0.15)" : item.urgency === "中高" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700,
                        color: item.urgency === "高" ? "#F87171" : item.urgency === "中高" ? "#FBBF24" : "#60A5FA",
                      }}>{item.urgency}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>{item.event}</div>
                        <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Section>

            <div style={{
              marginTop: 32, padding: 20, borderRadius: 12,
              background: "rgba(148, 163, 184, 0.04)",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              fontSize: 12, color: "#64748B", lineHeight: 1.7,
              textAlign: "center",
            }}>
              ⚠️ 以上为基于研究材料的整理与个人理解，不构成投资建议。在30–40x FY28的定价环境里，错的往往不是方向，而是时间与节奏。
            </div>
          </>
        )}
      </div>
    </div>
  );
}
