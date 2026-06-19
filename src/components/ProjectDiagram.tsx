/**
 * 项目示意图 —— 高级风格，渐变 + 发光 + 精细排版。
 * 纯 SVG，viewBox 适配全宽展示。
 */

type DiagramType = "pipeline" | "cluster" | "deploy" | "agent" | "edge";

const C = {
  bg: "#0d0d10",
  panel: "#16161b",
  stroke: "#2a2a33",
  text: "#D7E2EA",
  dim: "#6b7280",
  dim2: "#4b5563",
};

const MONO = "JetBrains Mono, ui-monospace, monospace";

export default function ProjectDiagram({ type }: { type: DiagramType }) {
  return (
    <div className="pd-wrap">
      <svg viewBox="0 0 480 210" className="pd-svg" role="img" aria-label="project diagram">
        <defs>
          {/* shared subtle grid pattern */}
          <pattern id="pd-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#1a1a20" strokeWidth="0.5" />
          </pattern>
          {/* soft vignette */}
          <radialGradient id="pd-vig" cx="50%" cy="50%" r="75%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width="480" height="210" rx="16" fill={C.bg} />
        <rect width="480" height="210" rx="16" fill="url(#pd-grid)" opacity="0.5" />
        {type === "pipeline" && <Pipeline />}
        {type === "cluster" && <Cluster />}
        {type === "deploy" && <Deploy />}
        {type === "agent" && <Agent />}
        {type === "edge" && <Edge />}
        <rect width="480" height="210" rx="16" fill="url(#pd-vig)" pointerEvents="none" />
      </svg>
    </div>
  );
}

// gradient def helper
function G({ id, from, to, dir = "x" }: { id: string; from: string; to: string; dir?: "x" | "y" }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={dir === "x" ? "1" : "0"} y2={dir === "x" ? "0" : "1"}>
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  );
}

function nodeGradients(ids: { id: string; from: string; to: string }[]) {
  return (
    <defs>
      {ids.map((g) => (
        <G key={g.id} id={g.id} from={g.from} to={g.to} />
      ))}
    </defs>
  );
}

// 01 中枢流水线
function Pipeline() {
  const steps = [
    { l: "数据", from: "#67e8f9", to: "#0891b2" },
    { l: "训练", from: "#c084fc", to: "#7c3aed" },
    { l: "评测", from: "#fde047", to: "#ca8a04" },
    { l: "上线", from: "#6ee7a8", to: "#16a34a" },
  ];
  const cy = 115;
  const gap = 110;
  const startX = 70;
  return (
    <>
      {nodeGradients([
        { id: "pl0", from: steps[0].from, to: steps[0].to },
        { id: "pl1", from: steps[1].from, to: steps[1].to },
        { id: "pl2", from: steps[2].from, to: steps[2].to },
        { id: "pl3", from: steps[3].from, to: steps[3].to },
      ])}
      <text x={240} y={34} textAnchor="middle" fill={C.dim} fontSize={11} fontFamily={MONO}>
        数据缩减 43% · 业务指标 95%
      </text>
      {/* connectors */}
      {steps.slice(0, -1).map((_, i) => {
        const x1 = startX + i * gap + 30;
        const x2 = startX + (i + 1) * gap - 30;
        return (
          <line key={i} x1={x1} y1={cy} x2={x2} y2={cy} stroke="#3a3a44" strokeWidth={1.5} strokeDasharray="2 4" />
        );
      })}
      {steps.map((s, i) => {
        const cx = startX + i * gap;
        return (
          <g key={s.l}>
            <circle cx={cx} cy={cy} r={30} fill={`url(#pl${i})`} opacity={0.18} />
            <circle cx={cx} cy={cy} r={22} fill={`url(#pl${i})`} stroke="#ffffff26" strokeWidth={1} />
            <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600} fontFamily={MONO}>{s.l}</text>
          </g>
        );
      })}
      <text x={240} y={190} textAnchor="middle" fill={C.dim2} fontSize={10} fontFamily={MONO}>
        回流 → 持续修复闭环
      </text>
    </>
  );
}

// 02 DFM 集群
function Cluster() {
  const cards = Array.from({ length: 15 });
  return (
    <>
      <defs>
        <G id="cl-g" from="#67e8f9" to="#3b82f6" />
      </defs>
      <text x={240} y={32} textAnchor="middle" fill={C.dim} fontSize={11} fontFamily={MONO}>
        A800 x100 · CP / SP / EP + Packing
      </text>
      {cards.map((_, i) => {
        const x = 36 + (i % 5) * 30;
        const y = 52 + Math.floor(i / 5) * 26;
        return <rect key={i} x={x} y={y} width={22} height={20} rx={4} fill="url(#cl-g)" opacity={0.12 + (i % 4) * 0.16} />;
      })}
      <text x={240} y={130} textAnchor="middle" fill="url(#cl-g)" fontSize={15} fontWeight={700} fontFamily={MONO}>
        DFM-235B-MoE
      </text>
      {/* MFU ring */}
      <g transform="translate(390,150)">
        <circle r={28} fill="none" stroke="#2a2a33" strokeWidth={6} />
        <circle r={28} fill="none" stroke="url(#cl-g)" strokeWidth={6} strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 28 * 0.37} ${2 * Math.PI * 28}`} transform="rotate(-90)" />
        <text y={3} textAnchor="middle" fill="url(#cl-g)" fontSize={13} fontWeight={700} fontFamily={MONO}>37%</text>
        <text y={46} textAnchor="middle" fill={C.dim} fontSize={8} fontFamily={MONO}>MFU</text>
      </g>
      <text x={70} y={170} fill={C.dim} fontSize={9} fontFamily={MONO}>efficiency</text>
      <text x={70} y={186} fill="#6ee7a8" fontSize={13} fontWeight={600} fontFamily={MONO}>+18%</text>
    </>
  );
}

// 03 昇腾部署
function Deploy() {
  const stages = [
    { l: "训练", s: "MindSpeed-LLM", from: "#67e8f9", to: "#0891b2" },
    { l: "量化", s: "W8A8", from: "#fde047", to: "#ca8a04" },
    { l: "推理", s: "MindIE", from: "#6ee7a8", to: "#16a34a" },
  ];
  return (
    <>
      <defs>
        <linearGradient id="dp-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#6ee7a8" />
        </linearGradient>
        <G id="dp0" from="#67e8f9" to="#0891b2" />
        <G id="dp1" from="#fde047" to="#ca8a04" />
        <G id="dp2" from="#6ee7a8" to="#16a34a" />
      </defs>
      <text x={240} y={32} textAnchor="middle" fill={C.dim} fontSize={11} fontFamily={MONO}>
        DeepSeek · Qwen3-235B-A22B
      </text>
      <line x1={90} y1={112} x2={390} y2={112} stroke="url(#dp-line)" strokeWidth={2.5} opacity={0.35} />
      {stages.map((st, i) => {
        const cx = 90 + i * 150;
        return (
          <g key={st.l}>
            <circle cx={cx} cy={112} r={30} fill={`url(#dp${i})`} opacity={0.18} />
            <circle cx={cx} cy={112} r={22} fill={`url(#dp${i})`} stroke="#ffffff26" strokeWidth={1} />
            <text x={cx} y={110} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600} fontFamily={MONO}>{st.l}</text>
            <text x={cx} y={122} textAnchor="middle" fill="#ffffff99" fontSize={7} fontFamily={MONO}>{st.s}</text>
          </g>
        );
      })}
      <text x={240} y={172} textAnchor="middle" fill="#6ee7a8" fontSize={11} fontWeight={500} fontFamily={MONO}>
        达 Nvidia 70% · 对齐 A800
      </text>
      <text x={240} y={190} textAnchor="middle" fill={C.dim2} fontSize={9} fontFamily={MONO}>
        千万级交付 · 私有化部署
      </text>
    </>
  );
}

// 04 Agent
function Agent() {
  const tools = ["npm", "uvx", "sse", "dxt"];
  return (
    <>
      <defs>
        <radialGradient id="ag-hub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
      {tools.map((t, i) => {
        const y = 50 + i * 30;
        return <line key={t} x1={86} y1={y} x2={220} y2={112} stroke="#67e8f9" strokeWidth={1} opacity={0.25} strokeDasharray="2 3" />;
      })}
      <line x1={260} y1={100} x2={356} y2={70} stroke="#6ee7a8" strokeWidth={1.3} opacity={0.45} />
      <line x1={260} y1={124} x2={356} y2={140} stroke="#fde047" strokeWidth={1.3} opacity={0.45} />
      {tools.map((t, i) => {
        const y = 50 + i * 30;
        return (
          <g key={t}>
            <rect x={30} y={y - 12} width={56} height={24} rx={12} fill="#16161b" stroke="#67e8f944" strokeWidth={0.8} />
            <text x={58} y={y + 3} textAnchor="middle" fill="#67e8f9" fontSize={10} fontFamily={MONO}>{t}</text>
          </g>
        );
      })}
      <circle cx={240} cy={112} r={36} fill="url(#ag-hub)" opacity={0.22} />
      <circle cx={240} cy={112} r={24} fill="url(#ag-hub)" stroke="#ffffff33" strokeWidth={1} />
      <text x={240} y={116} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700} fontFamily={MONO}>MCPhub</text>
      <g>
        <rect x={356} y={56} width={86} height={28} rx={14} fill="#16161b" stroke="#6ee7a844" strokeWidth={0.8} />
        <text x={399} y={74} textAnchor="middle" fill="#6ee7a8" fontSize={9} fontFamily={MONO}>车控 Agent</text>
      </g>
      <g>
        <rect x={356} y={126} width={86} height={28} rx={14} fill="#16161b" stroke="#fde04744" strokeWidth={0.8} />
        <text x={399} y={144} textAnchor="middle" fill="#fde047" fontSize={9} fontFamily={MONO}>Workflow</text>
      </g>
      <text x={240} y={190} textAnchor="middle" fill={C.dim2} fontSize={9} fontFamily={MONO}>
        Prometheus + Grafana 监控告警
      </text>
    </>
  );
}

// 05 端侧曲线
function Edge() {
  return (
    <>
      <defs>
        <linearGradient id="ed-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6ee7a8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6ee7a8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <text x={240} y={30} textAnchor="middle" fill={C.dim} fontSize={11} fontFamily={MONO}>
        INT4+INT16 · KV Cache 分块 Prefill
      </text>
      <line x1={50} y1={50} x2={50} y2={170} stroke="#2a2a33" />
      <line x1={50} y1={170} x2={450} y2={170} stroke="#2a2a33" />
      <polyline points="50,158 120,156 190,152 260,148 330,145 400,142 450,140" fill="none" stroke={C.dim2} strokeWidth={1.5} strokeDasharray="4 3" />
      <text x={446} y={132} textAnchor="end" fill={C.dim2} fontSize={9} fontFamily={MONO}>baseline</text>
      <path d="M50,158 L120,145 L190,115 L260,75 L330,52 L400,48 L450,46 L450,170 L50,170 Z" fill="url(#ed-fill)" />
      <polyline points="50,158 120,145 190,115 260,75 330,52 400,48 450,46" fill="none" stroke="#6ee7a8" strokeWidth={2.5} />
      {[[120,145],[260,75],[400,48]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="#6ee7a8" />
      ))}
      <text x={446} y={38} textAnchor="end" fill="#6ee7a8" fontSize={15} fontWeight={700} fontFamily={MONO}>3.3x</text>
      <text x={240} y={195} textAnchor="middle" fill="#67e8f9" fontSize={9} fontFamily={MONO}>
        8295 · MTK8678 · RK3588 · 后摩M50 · Orinx
      </text>
    </>
  );
}
