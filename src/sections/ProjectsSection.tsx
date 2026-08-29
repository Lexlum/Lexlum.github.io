import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, type MotionStyle } from "framer-motion";
import { X } from "lucide-react";
import { PROJECTS, type Project } from "../data/resume";

/* ============================================================
   Projects — 炉石式开包交互：
   1. 初始是一摞卡包，点击后卡片爆开散落成堆
   2. 卡片可自由拖拽叠放，单击真实卡片弹出详情
   3. 向下滑向 Tech Stack 时，整堆卡片粒子消散（canvas）

   卡片尺寸 / 字号 / 散落位姿全部由牌桌实测尺寸推导，
   任何视口宽度下牌堆都收在容器内、只轻微叠压不乱糊。
   ============================================================ */

const PACK = { x: 0.5, y: 0.4 }; // 卡包中心（牌桌比例）

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** 可复现的伪随机（固定种子 → 每次渲染牌堆布局一致） */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Pose {
  x: number; // 牌桌像素（卡片左上角）
  y: number;
  cx: number; // 卡片中心（供爆开动画计算位移）
  cy: number;
  rotate: number;
  z: number;
}

interface Size {
  w: number;
  h: number;
}

/** 按牌桌尺寸生成散落位姿：全在容器内、中心间距受控、只轻微叠压 */
function generatePoses({ w, h }: Size, cardW: number, cardH: number): Pose[] {
  const rnd = mulberry32(20260829);
  const poses: Pose[] = [];
  const minX = 10;
  const maxX = Math.max(minX, w - cardW - 10);
  const minY = 8;
  const maxY = Math.max(minY, h - cardH - 8);
  const minDist = cardW * 0.8; // 中心最小间距 → 只允许轻微叠压，卡面主体可见
  const packCx = w * PACK.x;
  const packCy = h * PACK.y;

  for (let i = 0; i < PROJECTS.length; i++) {
    let x = minX;
    let y = minY;
    let ok = false;
    for (let tries = 0; tries < 50 && !ok; tries++) {
      const ang = rnd() * Math.PI * 2;
      const rad = 0.1 + rnd() * 0.24;
      x = clamp(packCx + Math.cos(ang) * w * rad - cardW / 2, minX, maxX);
      y = clamp(packCy + Math.sin(ang) * h * rad - cardH / 2, minY, maxY);
      const cx = x + cardW / 2;
      const cy = y + cardH / 2;
      ok = poses.every((p) => Math.hypot(p.cx - cx, p.cy - cy) >= minDist);
    }
    poses.push({
      x,
      y,
      cx: x + cardW / 2,
      cy: y + cardH / 2,
      rotate: -16 + rnd() * 32,
      z: 10 + i,
    });
  }
  return poses;
}

/* ---------------- 卡背（装饰卡 & 卡包面），全百分比自适应 ---------------- */
function CardBack({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl border-2 border-[#D7E2EA]/20
        bg-[#171a24] shadow-[0_24px_54px_-10px_rgba(0,0,0,0.9)] [container-type:size] ${className}`}
      style={style}
    >
      <div className="absolute inset-[7%] rounded-xl border border-[#D7E2EA]/15" />
      {/* 中心纹章 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-[46%] w-[46%] items-center justify-center rounded-full
            bg-[radial-gradient(circle_at_35%_30%,#242838,#12141c_70%)]
            shadow-[0_0_26px_rgba(103,232,249,0.28),inset_0_0_0_3px_rgba(103,232,249,0.25)]"
        >
          <div
            className="flex h-[72%] w-[72%] items-center justify-center rounded-full text-white"
            style={{
              background: "linear-gradient(135deg,#18011F 0%,#B600A8 45%,#7621B0 75%,#BE4C00 100%)",
              boxShadow: "inset 0 2px 6px rgba(255,255,255,0.25)",
            }}
          >
            <span className="font-black tracking-tight" style={{ fontSize: "clamp(0.8rem,17cqw,1.5rem)" }}>
              SS
            </span>
          </div>
        </div>
      </div>
      {/* 四角刻点 */}
      {["top-[6%] left-[6%]", "top-[6%] right-[6%]", "bottom-[6%] left-[6%]", "bottom-[6%] right-[6%]"].map((p) => (
        <span key={p} className={`absolute ${p} h-[3.5%] w-[3.5%] min-h-1 min-w-1 rounded-full bg-[#67e8f9]/40`} />
      ))}
    </div>
  );
}

/* ---------------- 牌堆里的项目卡（正面），字号随卡片宽度缩放 ---------------- */
function ProjectCardFace({ project, s }: { project: Project; s: number }) {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#D7E2EA]/25
        bg-gradient-to-b from-[#242837] to-[#161821] shadow-[0_24px_54px_-10px_rgba(0,0,0,0.9)]"
      style={{ padding: `${14 * s}px ${13 * s}px` }}
    >
      {/* 顶部高光线，让卡面有厚度感 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/15" />
      <div className="flex items-baseline justify-between gap-1">
        <span className="font-black leading-none text-[#D7E2EA]" style={{ fontSize: 26 * s }}>
          {project.number}
        </span>
        <span
          className="text-right text-[#D7E2EA]/50 uppercase tracking-widest leading-tight"
          style={{ fontSize: 8.5 * s }}
        >
          {project.category} · {project.period}
        </span>
      </div>
      <h3 className="hero-heading mt-1.5 font-black uppercase leading-tight" style={{ fontSize: 19 * s }}>
        {project.name}
      </h3>
      <p className="mt-1.5 line-clamp-3 font-light leading-relaxed text-[#D7E2EA]/70" style={{ fontSize: 10.5 * s }}>
        {project.summary}
      </p>
      <div
        className="mt-auto grid grid-cols-3 gap-1 border-t border-[#D7E2EA]/10"
        style={{ paddingTop: 9 * s }}
      >
        {project.stats.map((stat) => (
          <div key={stat.label} className="min-w-0 text-center">
            <div className="truncate font-black text-[#67e8f9]" style={{ fontSize: 12 * s }}>
              {stat.value}
            </div>
            <div className="truncate text-[#D7E2EA]/45" style={{ fontSize: 8 * s }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 text-center text-[#67e8f9]/70" style={{ fontSize: 9 * s }}>
        点击卡片查看细节 →
      </div>
    </div>
  );
}

/* ---------------- 详情弹层 ---------------- */
function DetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-h-[86vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border-2 border-[#D7E2EA]/20
          bg-[#0C0C0C] p-5 sm:p-7 md:p-9"
        initial={{ scale: 0.82, y: 46, rotate: -3 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        exit={{ scale: 0.85, y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="关闭详情"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full
            border border-[#D7E2EA]/25 text-[#D7E2EA]/70 transition-colors hover:bg-[#D7E2EA]/10"
        >
          <X size={17} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
          <span className="hero-heading font-black leading-none" style={{ fontSize: "clamp(2.6rem,8vw,5.5rem)" }}>
            {project.number}
          </span>
          <div className="min-w-0">
            <span className="text-[#D7E2EA]/55 uppercase tracking-widest" style={{ fontSize: "clamp(0.7rem,1vw,0.9rem)" }}>
              {project.category} · {project.period}
            </span>
            <h3 className="hero-heading mt-1 font-black uppercase leading-none" style={{ fontSize: "clamp(1.5rem,4vw,3rem)" }}>
              {project.name}
            </h3>
          </div>
        </div>
        <p className="mt-3 text-[#D7E2EA]/75 font-light leading-relaxed" style={{ fontSize: "clamp(0.9rem,1.4vw,1.1rem)" }}>
          {project.detail}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {project.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[#D7E2EA]/20 bg-[#D7E2EA]/5 flex flex-col items-center justify-center
                text-center px-2 py-3.5 min-w-0"
            >
              <span className="truncate w-full font-black text-[#D7E2EA]" style={{ fontSize: "clamp(0.95rem,1.8vw,1.5rem)" }}>
                {s.value}
              </span>
              <span className="mt-1 text-[#D7E2EA]/55" style={{ fontSize: "clamp(0.62rem,0.9vw,0.78rem)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
          <div>
            <div className="mb-2.5 flex items-center gap-2 text-[#D7E2EA]/60 uppercase tracking-widest" style={{ fontSize: "clamp(0.9rem,1.4vw,1.1rem)" }}>
              <span className="inline-block h-2 w-2 rounded-full bg-[#67e8f9]" /> 工作内容
            </div>
            <ul className="flex flex-col gap-2">
              {project.work.map((w, i) => (
                <li key={i} className="flex gap-2 font-light leading-relaxed text-[#D7E2EA]/85" style={{ fontSize: "clamp(0.78rem,1.1vw,0.92rem)" }}>
                  <span className="shrink-0 font-medium text-[#67e8f9]">{String(i + 1).padStart(2, "0")}</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2.5 flex items-center gap-2 text-[#D7E2EA]/60 uppercase tracking-widest" style={{ fontSize: "clamp(0.9rem,1.4vw,1.1rem)" }}>
              <span className="inline-block h-2 w-2 rounded-full bg-[#6ee7a8]" /> 业绩成果
            </div>
            <ul className="flex flex-col gap-2">
              {project.achievements.map((a, i) => (
                <li key={i} className="flex gap-2 font-light leading-relaxed text-[#D7E2EA]/85" style={{ fontSize: "clamp(0.78rem,1.1vw,0.92rem)" }}>
                  <span className="shrink-0 text-[#6ee7a8]">▸</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-[#D7E2EA]/55 uppercase tracking-widest" style={{ fontSize: "clamp(0.72rem,1vw,0.9rem)" }}>
            技术栈
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[#D7E2EA]/25 bg-[#D7E2EA]/5 px-3 py-1.5 text-[#D7E2EA]/80"
                style={{ fontSize: "clamp(0.65rem,0.9vw,0.8rem)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================ */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

const PARTICLE_COLORS = ["#7dd3fc", "#38bdf8", "#bae6fd", "#e0f2fe", "#a78bfa", "#67e8f9"];

export default function ProjectsSection() {
  const tableRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zTop = useRef(40);
  const downPos = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  const [tableSize, setTableSize] = useState<Size>({ w: 0, h: 0 });
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [dissolved, setDissolved] = useState(false);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // 量牌桌：卡片与位姿全部由它推导
  useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const measure = () => setTableSize({ w: table.clientWidth, h: table.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(table);
    return () => ro.disconnect();
  }, []);

  const cardW = clamp(tableSize.w * 0.19, 132, 216);
  const cardH = cardW * 1.5;
  const s = cardW / 200; // 卡内字号缩放系数
  const poses = useMemo(
    () => (tableSize.w > 0 ? generatePoses(tableSize, cardW, cardH) : []),
    [tableSize, cardW, cardH]
  );

  /* ---- 粒子消散 ---- */
  const spawnParticles = () => {
    const canvas = canvasRef.current;
    const table = tableRef.current;
    if (!canvas || !table) return;
    const cRect = canvas.getBoundingClientRect();
    for (const el of cardRefs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const cx = r.left - cRect.left + r.width / 2;
      const cy = r.top - cRect.top + r.height / 2;
      const n = reducedMotion ? 0 : 46 + Math.floor(Math.random() * 22);
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 240;
        const maxLife = 0.9 + Math.random() * 1.1;
        particles.current.push({
          x: r.left - cRect.left + Math.random() * r.width,
          y: r.top - cRect.top + Math.random() * r.height,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 50 - Math.random() * 90,
          life: maxLife,
          maxLife,
          size: 1.4 + Math.random() * 3.4,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        });
      }
      // 少量大的柔光团，还原参考图里的辉光爆点
      for (let i = 0; i < 10; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 30 + Math.random() * 90;
        const maxLife = 0.7 + Math.random() * 0.7;
        particles.current.push({
          x: cx + (Math.random() - 0.5) * r.width * 0.7,
          y: cy + (Math.random() - 0.5) * r.height * 0.7,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 40,
          life: maxLife,
          maxLife,
          size: 7 + Math.random() * 9,
          color: "rgba(125,211,252,0.16)",
        });
      }
    }
  };

  const runParticleLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const alive: Particle[] = [];
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles.current) {
        p.life -= dt;
        if (p.life <= 0) continue;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 - 18 * dt;
        const a = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = a * (0.55 + 0.45 * Math.sin(now * 0.02 + p.x));
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        alive.push(p);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      particles.current = alive;
      if (alive.length > 0) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  // 切往 Tech Stack：projects 大部分离开视口 → 消散；滚回主体 → 复原
  useEffect(() => {
    const section = document.getElementById("projects");
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.3 && opened) {
          if (!dissolved) {
            setDissolved(true);
            setActive(null);
            spawnParticles();
            runParticleLoop();
          }
        } else if (entry.intersectionRatio >= 0.55 && dissolved) {
          setDissolved(false);
          particles.current = [];
          const canvas = canvasRef.current;
          if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
        }
      },
      { threshold: [0.3, 0.55] }
    );
    io.observe(section);
    return () => {
      io.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, dissolved]);

  const measured = tableSize.w > 0 && poses.length > 0;
  const packCx = tableSize.w * PACK.x;
  const packCy = tableSize.h * PACK.y;

  return (
    <section
      id="projects"
      className="relative z-30 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-4 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 scroll-mt-24"
    >
      <div className="pt-16 sm:pt-20 md:pt-28">
        <motion.h2
          className="hero-heading mx-auto mb-8 text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem,12vw,160px)" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Projects
        </motion.h2>

        <div ref={tableRef} className="relative mx-auto h-[82vh] min-h-[600px] max-w-6xl overflow-hidden">
          {/* 粒子层（消散时盖在卡片上方） */}
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[60] h-full w-full" />

          {measured && !opened ? (
            /* ---------- 卡包（未开包） ---------- */
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setOpened(true)}
                aria-label="点击打开项目卡包"
                className="group relative block h-[min(300px,60vw)] w-[min(210px,42vw)] cursor-pointer outline-none"
              >
                {/* 叠起的卡背 */}
                <div className="absolute inset-0 rotate-[9deg] translate-x-3 opacity-70 transition-transform duration-300 group-hover:rotate-[12deg]">
                  <CardBack />
                </div>
                <div className="absolute inset-0 -rotate-[5deg] -translate-x-2 opacity-85 transition-transform duration-300 group-hover:-rotate-[8deg]">
                  <CardBack />
                </div>
                <div className="animate-[pack-float_3.2s_ease-in-out_infinite] absolute inset-0">
                  <CardBack className="shadow-[0_0_60px_rgba(103,232,249,0.18)]" />
                </div>
              </button>
              <div className="mt-6 text-center">
                <div
                  className="font-black uppercase tracking-[0.3em] text-[#D7E2EA]"
                  style={{ fontSize: "clamp(0.85rem,1.5vw,1.15rem)" }}
                >
                  Project Pack
                </div>
                <div className="mt-2 text-[#D7E2EA]/50" style={{ fontSize: "clamp(0.7rem,1vw,0.85rem)" }}>
                  {PROJECTS.length} 个项目 · 点击开包 · 拖动整理 · 单击查细节
                </div>
              </div>
            </div>
          ) : null}

          {/* ---------- 爆开后的卡片堆 ---------- */}
          {measured &&
            opened &&
            PROJECTS.map((project, i) => {
              const pose = poses[i];
              const dissolvedStyle = dissolved
                ? { opacity: 0, scale: 0.7, filter: "blur(2px)" }
                : { opacity: 1, scale: 1, filter: "blur(0px)" };
              return (
                <motion.div
                  key={project.number}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  drag={!dissolved}
                  dragConstraints={tableRef}
                  dragElastic={0.12}
                  dragMomentum={false}
                  onPointerDown={(e) => {
                    downPos.current = { x: e.clientX, y: e.clientY };
                    zTop.current = Math.min(zTop.current + 1, 50);
                    if (cardRefs.current[i]) cardRefs.current[i]!.style.zIndex = String(zTop.current);
                  }}
                  onPointerUp={(e) => {
                    // 位移很小 → 视为点击 → 打开详情
                    const dx = e.clientX - downPos.current.x;
                    const dy = e.clientY - downPos.current.y;
                    if (dx * dx + dy * dy < 36) setActive(i);
                  }}
                  whileDrag={{ scale: 1.07, rotate: 0 }}
                  whileHover={!dissolved ? { scale: 1.04 } : undefined}
                  animate={dissolvedStyle}
                  transition={{ duration: 0.55, delay: i * 0.05 }}
                  className={`absolute cursor-grab touch-none select-none active:cursor-grabbing ${
                    active === i ? "rounded-2xl ring-2 ring-[#67e8f9]/70" : ""
                  } ${dissolved ? "pointer-events-none" : ""}`}
                  style={
                    {
                      left: pose.x,
                      top: pose.y,
                      width: cardW,
                      height: cardH,
                      zIndex: pose.z,
                      rotate: pose.rotate,
                    } as MotionStyle
                  }
                >
                  {/* 爆开入场：从卡包中心飞向各自散落位（px 位移在渲染时按牌桌实算） */}
                  {!reducedMotion && (
                    <style>{`
                      @keyframes card-burst-pose-${i} {
                        0% { transform: translate(${(packCx - pose.cx).toFixed(1)}px, ${(packCy - pose.cy).toFixed(1)}px) rotate(${-pose.rotate}deg) scale(0.25); }
                        100% { transform: none; }
                      }
                      .burst-${i} { animation: card-burst-pose-${i} 0.85s cubic-bezier(0.18,0.9,0.28,1.04) both; animation-delay: ${i * 60}ms; }
                    `}</style>
                  )}
                  <div className={`h-full w-full ${!reducedMotion ? `burst-${i}` : ""}`}>
                    <ProjectCardFace project={project} s={s} />
                  </div>
                </motion.div>
              );
            })}

        </div>

        {/* 开包后的操作提示 */}
        {opened && !dissolved && (
          <div className="pb-8 text-center text-[#D7E2EA]/40" style={{ fontSize: "clamp(0.7rem,1vw,0.85rem)" }}>
            拖动卡片整理牌堆 · 单击项目卡查看细节 · 继续下滑将消散进入 Tech Stack
          </div>
        )}
      </div>

      <AnimatePresence>
        {active !== null && !dissolved && <DetailModal project={PROJECTS[active]} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
