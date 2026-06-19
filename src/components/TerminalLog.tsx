import { useEffect, useRef } from "react";

// ============================================================
// 终端日志打字机 —— 4 段循环，对应：训练 / 推理部署 / Agent / 端侧
// 内容来自简历，全部真实。
// ============================================================

type LineType = "cmd" | "ok" | "warn" | "bar" | "dim";
interface LogLine {
  t: LineType;
  text: string; // 支持着色标记: [p]prompt[/p] [k]key[/k] [v]val[/v] [ok]..[/ok] [warn]..[/warn] [d]..[/d] [fill]..[/fill] [empty]..[/empty]
}
interface Segment {
  header: string;
  lines: LogLine[];
}

const SEGMENTS: Segment[] = [
  {
    header: "// [ Segment 1 ] 模型训练 — DFM 系列",
    lines: [
      { t: "cmd", text: "[p]$[/p] [k]init[/k] cluster [v]A800 x100[/v]" },
      { t: "ok", text: "  └─ nodes online            [ok]ok[/ok]" },
      { t: "cmd", text: "[p]$[/p] [k]load[/k] model [v]DFM-235B-MoE[/v]" },
      { t: "ok", text: "  └─ weights loaded          [ok]ok[/ok]" },
      { t: "cmd", text: "[p]$[/p] [k]strategy[/k] = [v]CP + SP + EP + Packing[/v]" },
      { t: "bar", text: "training  [fill]████████░░[/fill][empty]  [/empty] MFU [v]37%[/v]" },
      { t: "ok", text: "  └─ efficiency [v]+18%[/v]        [ok]done[/ok]" },
      { t: "dim", text: "[d]→ 江苏省首个双备案模型[/d]" },
    ],
  },
  {
    header: "// [ Segment 2 ] 推理与部署",
    lines: [
      { t: "cmd", text: "[p]$[/p] [k]deploy[/k] runtime [v]vLLM + SGLang + MindIE[/v]" },
      { t: "ok", text: "  └─ servers up              [ok]ok[/ok]" },
      { t: "cmd", text: "[p]$[/p] [k]quantize[/k] [v]GPTQ / AWQ / QAT[/v]" },
      { t: "ok", text: "  └─ kv-cache prefix enabled [ok]ok[/ok]" },
      { t: "cmd", text: "[p]$[/p] [k]benchmark[/k] vs A800 baseline" },
      { t: "bar", text: "infer     [fill]██████████[/fill]      [v]aligned[/v]" },
      { t: "warn", text: "  └─ speculative decoding    [warn]eagle/medusa[/warn]" },
      { t: "dim", text: "[d]→ 速度达 Nvidia 70%，单次成本降一倍[/d]" },
    ],
  },
  {
    header: "// [ Segment 3 ] 分布式智能体",
    lines: [
      { t: "cmd", text: "[p]$[/p] [k]start[/k] [v]MCPhub[/v] agent gateway" },
      { t: "ok", text: "  └─ multi-mcp integrated    [ok]online[/ok]" },
      { t: "cmd", text: "[p]$[/p] [k]load[/k] tools npm/uvx/sse/dxt" },
      { t: "ok", text: "  └─ toollist cached         [ok]ok[/ok]" },
      { t: "cmd", text: "[p]$[/p] [k]vehicle-agent[/k] = function_call + memory" },
      { t: "bar", text: "workflow  [fill]██████████[/fill]      [v]hybrid call[/v]" },
      { t: "ok", text: "  └─ monitoring              [ok]prometheus+grafana[/ok]" },
      { t: "dim", text: "[d]→ 车控 Agent 已上线使用[/d]" },
    ],
  },
  {
    header: "// [ Segment 4 ] 端侧运行时",
    lines: [
      { t: "cmd", text: "[p]$[/p] [k]profile[/k] edge chips 8295/MTK8678/RK3588" },
      { t: "warn", text: "  └─ bottleneck = [warn]memory bandwidth[/warn]" },
      { t: "cmd", text: "[p]$[/p] [k]compile[/k] MTK [v]INT4 weight + INT16 act[/v]" },
      { t: "ok", text: "  └─ kv-cache chunked prefill [ok]ok[/ok]" },
      { t: "bar", text: "throughput[fill]██████████[/fill]      [v]3.3x[/v]" },
      { t: "ok", text: "  └─ first-token latency     [v]-67%[/v]" },
      { t: "dim", text: "[d]→ 万字会议 35min → 8min，超竞品 2.7x[/d]" },
    ],
  },
];

const CLASS_MAP: Record<string, string> = {
  p: "tl-prompt",
  k: "tl-key",
  v: "tl-val",
  ok: "tl-ok",
  warn: "tl-warn",
  d: "tl-dim",
  fill: "tl-bar-fill",
  empty: "tl-bar-empty",
};

const TYPE_MS = 24;
const LINE_GAP = 180;
const SEG_GAP = 1400;
const MAX_LINES = 13;

function stripMarkup(text: string): string {
  return text.replace(/\[\/?\w+\]/g, "");
}

function openTag(tag: string): string {
  const cls = CLASS_MAP[tag] ?? tag;
  return `<span class="${cls}">`;
}

// Render markup with only the first `visibleN` visible characters shown.
function renderPartial(text: string, visibleN: number): string {
  let out = "";
  let count = 0;
  let i = 0;
  const tagRe = /\[(\/?)(\w+)\]/;
  const openStack: string[] = [];
  while (i < text.length) {
    const rest = text.slice(i);
    const m = rest.match(tagRe);
    if (m && m.index === 0) {
      const slash = m[1];
      const tag = m[2];
      if (slash) {
        out += "</span>";
        openStack.pop();
      } else {
        out += openTag(tag);
        openStack.push(tag);
      }
      i += m[0].length;
    } else {
      if (count < visibleN) {
        out += text[i];
        count++;
      }
      i++;
    }
    if (count >= visibleN && !tagRe.test(text.slice(i))) break;
  }
  // Close any still-open spans.
  for (let c = openStack.length; c > 0; c--) out += "</span>";
  return out;
}

function renderFull(text: string): string {
  return text.replace(/\[(\/?)(\w+)\]/g, (_m, slash: string, tag: string) =>
    slash ? "</span>" : openTag(tag)
  );
}

export default function TerminalLog() {
  const screenRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    segIdx: 0,
    lineIdx: 0,
    charIdx: 0,
    mode: "segmentGap" as "segmentGap" | "type" | "lineDone",
    paused: false,
  });

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const pushLine = (html: string) => {
      const div = document.createElement("div");
      div.className = "tl-line";
      div.innerHTML = html;
      screen.appendChild(div);
      while (screen.children.length > MAX_LINES) {
        const first = screen.firstChild;
        if (first) screen.removeChild(first);
      }
    };

    const renderPartialLine = (text: string, visibleN: number) => {
      let last = screen.lastElementChild as HTMLElement | null;
      if (!last || !last.dataset.typing) {
        last = document.createElement("div");
        last.className = "tl-line";
        last.dataset.typing = "1";
        screen.appendChild(last);
        while (screen.children.length > MAX_LINES) {
          const first = screen.firstChild;
          if (first) screen.removeChild(first);
        }
      }
      last.innerHTML = renderPartial(text, visibleN) + '<span class="tl-cursor"></span>';
    };

    const commitLine = () => {
      const last = screen.lastElementChild as HTMLElement | null;
      const st = stateRef.current;
      if (last && last.dataset.typing) {
        delete last.dataset.typing;
        last.innerHTML = renderFull(SEGMENTS[st.segIdx].lines[st.lineIdx].text);
      }
    };

    let timer: ReturnType<typeof setTimeout>;
    const schedule = (ms: number) => {
      clearTimeout(timer);
      timer = setTimeout(tick, ms);
    };

    const tick = () => {
      const st = stateRef.current;
      if (st.paused) {
        schedule(120);
        return;
      }

      if (st.mode === "segmentGap") {
        screen.innerHTML = "";
        st.mode = "type";
        st.lineIdx = 0;
        st.charIdx = 0;
        pushLine(`<span class="tl-dim">${SEGMENTS[st.segIdx].header}</span>`);
        schedule(LINE_GAP);
        return;
      }

      const seg = SEGMENTS[st.segIdx];
      if (st.lineIdx >= seg.lines.length) {
        st.mode = "segmentGap";
        st.segIdx = (st.segIdx + 1) % SEGMENTS.length;
        schedule(SEG_GAP);
        return;
      }

      const line = seg.lines[st.lineIdx];
      if (st.mode === "type") {
        st.charIdx++;
        const visibleLen = stripMarkup(line.text).length;
        renderPartialLine(line.text, st.charIdx);
        if (st.charIdx >= visibleLen) {
          commitLine();
          st.mode = "lineDone";
          schedule(LINE_GAP);
        } else {
          schedule(TYPE_MS);
        }
        return;
      }

      if (st.mode === "lineDone") {
        st.lineIdx++;
        st.charIdx = 0;
        st.mode = "type";
        schedule(50);
        return;
      }
    };

    // Kick off.
    stateRef.current = {
      segIdx: 0,
      lineIdx: 0,
      charIdx: 0,
      mode: "segmentGap",
      paused: false,
    };
    screen.innerHTML = "";
    schedule(300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tl-wrap">
      <div
        className="tl-terminal"
        onMouseEnter={() => (stateRef.current.paused = true)}
        onMouseLeave={() => (stateRef.current.paused = false)}
      >
        <div className="tl-titlebar">
          <span className="tl-dots">
            <i /> <i /> <i />
          </span>
          <span className="tl-title">shengjie@llm-dev — train.log</span>
        </div>
        <div className="tl-screen" ref={screenRef} />
      </div>
    </div>
  );
}
