import { useEffect, useRef } from "react";
import { PROFILE, PORTRAIT_IMG } from "../data/resume";

/* ============================================================
   WorkBadge — 一张挂在织带上的工牌，带真实物理：
   · verlet 绳索模拟挂绳的垂坠与弯折
   · 卡片作为刚体用弹簧-阻尼跟随绳子末端，产生摆动回弹
   · 点击卡片左/右半边 → 绕 Y 轴翻页式旋转（带惯性回弹）
   · 拖拽甩动 → 松手继承速度自然摆回
   · 滚动页面、待机微风都会轻微吹动挂绳
   ============================================================ */

const ROPE_POINTS = 11; // 挂绳节点数
const GRAVITY = 2600; // px/s²
const ITERATIONS = 6; // 约束求解迭代次数
const VMAX = 24; // 单点每帧最大位移（px/帧），防止甩飞
const BASE_W = 236; // 卡片设计宽度
const BASE_H = 384; // 卡片设计高度
const CLIP_H = 30; // 金属夹高度


const STRAP_TEXT = "SUN SHENGJIE · 大模型算法工程师 · LLM · AGENT · EDGE · ";

interface RopePt {
  x: number;
  y: number;
  px: number;
  py: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** 由一串点生成平滑的二次贝塞尔路径（相邻中点连线法）。 */
function smoothPath(pts: RopePt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

export default function WorkBadge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const strapBgRef = useRef<SVGPathElement>(null);
  const strapEdgeRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const rigidRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const rigid = rigidRef.current;
    const flip = flipRef.current;
    const sheen = sheenRef.current;
    if (!stage || !rigid || !flip || !sheen) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- 世界状态（全部放 ref，避免每帧触发 React 渲染） ----
    let stageW = stage.clientWidth;
    let stageH = stage.clientHeight;
    let stageLeft = 0; // 舞台在视口中的横向起点（用于把卡片限制在屏幕内）
    let viewW = window.innerWidth;
    // 展开/收起：1 = 完整工牌，0 = 收成小徽章。绳长与卡片缩放都随它插值
    let ext = 1;
    let extTarget = 1;
    let fullSegLen = 10;
    let fullScale = 1;
    const COLLAPSED_SEG_LEN = 7; // 收起后织带收得很短
    let cardScale = 1;
    let segLen = 10;
    const rope: RopePt[] = Array.from({ length: ROPE_POINTS }, () => ({
      x: 0,
      y: 0,
      px: 0,
      py: 0,
    }));

    let ang = 0; // 卡片绕吊点的摆角（rad，0 = 竖直下垂）
    let angVel = 0;
    let flipAng = 0; // 卡片绕 Y 轴翻转角（rad）
    let flipVel = 0;
    let flipTarget = 0;
    let tiltX = 0; // 跟随摆速的前后倾
    let running = true;
    let inView = true;

    let grabbing = false;
    let grabX = 0;
    let grabY = 0;
    let downX = 0;
    let downY = 0;
    let downT = 0;
    let lastScrollY = window.scrollY;
    let scrollKick = 0;

    const layout = () => {
      stageW = stage.clientWidth;
      stageH = stage.clientHeight;
      viewW = window.innerWidth;
      stageLeft = stage.getBoundingClientRect().left;
      fullScale = clamp(stageW / 330, 0.6, 1.05);
      const ropeLen = Math.max(40, stageH - BASE_H * fullScale - CLIP_H - 6);
      fullSegLen = ropeLen / (ROPE_POINTS - 1);
      segLen = fullSegLen;
      cardScale = fullScale;
      const ax = stageW / 2;
      for (let i = 0; i < ROPE_POINTS; i++) {
        const p = rope[i];
        p.x = ax;
        p.px = ax;
        p.y = i * segLen;
        p.py = p.y;
      }
      svgRef.current?.setAttribute("viewBox", `0 0 ${stageW} ${stageH}`);
      // 静置姿态先画出来：物理循环首帧之前工牌就是正确悬挂的
      const d = smoothPath(rope);
      strapBgRef.current?.setAttribute("d", d);
      strapEdgeRef.current?.setAttribute("d", d);
      document.getElementById("badge-strap-guide")?.setAttribute("d", d);
      rigid.style.transform = `translate3d(${ax}px, ${(ROPE_POINTS - 1) * segLen}px, 0) rotate(0deg) scale(${cardScale.toFixed(3)})`;
    };

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastScrollY;
      lastScrollY = y;
      scrollKick = clamp(scrollKick + dy * 0.9, -240, 240);
      // 下滑后收成小徽章，回到顶部再展开（阈值带滞回，避免临界抖动）
      extTarget = y > 170 ? 0 : y < 80 ? 1 : extTarget;
    };
    onScroll();
    if (window.scrollY > 170) ext = 0; // 刷新时页面已在半空则直接以收起态出现
    window.addEventListener("scroll", onScroll, { passive: true });

    // 只在可见时跑物理，省电
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(stage);
    const onVis = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    // ---- 指针交互：拖拽甩动 / 单击翻转 ----
    const onPointerDown = (e: PointerEvent) => {
      grabbing = true;
      const rect = stage.getBoundingClientRect();
      const p = rope[ROPE_POINTS - 1];
      grabX = e.clientX - rect.left;
      grabY = e.clientY - rect.top;
      downX = grabX;
      downY = grabY;
      downT = performance.now();
      // 抓取瞬间把速度清零，避免旧摆动叠加跳变
      p.px = p.x;
      p.py = p.y;
      rigid.setPointerCapture(e.pointerId);
      rigid.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!grabbing) return;
      const rect = stage.getBoundingClientRect();
      grabX = e.clientX - rect.left;
      grabY = e.clientY - rect.top;
    };

    const onPointerUp = () => {
      if (!grabbing) return;
      grabbing = false;
      rigid.style.cursor = "grab";
      const moved = Math.hypot(grabX - downX, grabY - downY);
      const held = performance.now() - downT;
      // 位移小、时间短 → 视为点击：向点击的一侧翻页旋转
      if (moved < 7 && held < 400) {
        const end = rope[ROPE_POINTS - 1];
        flipTarget += grabX < end.x ? -Math.PI : Math.PI;
      }
    };

    rigid.addEventListener("pointerdown", onPointerDown);
    rigid.addEventListener("pointermove", onPointerMove);
    rigid.addEventListener("pointerup", onPointerUp);
    rigid.addEventListener("pointercancel", onPointerUp);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipTarget += Math.PI;
      }
    };
    rigid.addEventListener("keydown", onKey);

    // ---- 物理步进 ----
    const step = (dt: number, t: number) => {
      const ax = stageW / 2;

      // 收起/展开插值：像卷尺一样把织带收短、卡片缩小，绳索约束会自然把卡片拉上去
      ext += (extTarget - ext) * (reducedMotion ? 1 : Math.min(1, dt * 4.5));
      segLen = COLLAPSED_SEG_LEN + (fullSegLen - COLLAPSED_SEG_LEN) * ext;
      cardScale = fullScale * (0.44 + 0.56 * ext);

      // 微风 + 滚动气流：只推下半段，越往下越明显；收起后气流也减弱（单位 px/s²）
      scrollKick *= 0.88;
      const gust = 0.35 + 0.65 * ext;
      const breeze =
        (reducedMotion ? 0 : 200 * Math.sin(t * 0.00037) + 110 * Math.sin(t * 0.00071 + 1.7)) *
        gust;
      for (let i = 1; i < ROPE_POINTS; i++) {
        const p = rope[i];
        const depth = i / (ROPE_POINTS - 1);
        const wind = (breeze * depth * depth + scrollKick * depth) * gust;
        let vx = (p.x - p.px) * 0.985;
        let vy = (p.y - p.py) * 0.985;
        // 限速：再猛的甩动也不会让绳段拉伸失控、把卡片抛出屏幕
        const vlen = Math.hypot(vx, vy);
        if (vlen > VMAX) {
          vx *= VMAX / vlen;
          vy *= VMAX / vlen;
        }
        p.px = p.x;
        p.py = p.y;
        p.x += vx + wind * dt * dt;
        p.y += vy + GRAVITY * dt * dt;
      }

      // 抓取时把绳端往手上拉：目标点钳制在绳长可达范围内，
      // 追随系数调低让卡片有"分量"，不会瞬间吸到指针上
      if (grabbing) {
        const p = rope[ROPE_POINTS - 1];
        const maxReach = (ROPE_POINTS - 1) * segLen * 0.96;
        let gx = grabX - ax;
        let gy = grabY;
        const gd = Math.hypot(gx, gy);
        if (gd > maxReach) {
          gx *= maxReach / gd;
          gy *= maxReach / gd;
        }
        p.x += (ax + gx - p.x) * 0.35;
        p.y += (gy - p.y) * 0.35;
      }

      // 距离约束
      rope[0].x = ax;
      rope[0].y = 0;
      for (let k = 0; k < ITERATIONS; k++) {
        for (let i = 0; i < ROPE_POINTS - 1; i++) {
          const a = rope[i];
          const b = rope[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1e-6;
          const diff = (dist - segLen) / dist;
          if (i === 0) {
            b.x -= dx * diff;
            b.y -= dy * diff;
          } else {
            const half = diff * 0.5;
            a.x += dx * half;
            a.y += dy * half;
            b.x -= dx * half;
            b.y -= dy * half;
          }
        }
        rope[0].x = ax;
        rope[0].y = 0;
      }

      // 视口硬边界：无论绳子怎么甩，整张卡片（含左右边缘）永远留在屏幕内
      const end = rope[ROPE_POINTS - 1];
      const cardHalf = (BASE_W * cardScale) / 2 + 6;
      end.x = clamp(end.x, cardHalf + 8 - stageLeft, viewW - stageLeft - cardHalf - 8);
      end.y = clamp(end.y, -36, stageH - 30);

      // 卡片刚体：弹簧-阻尼跟随绳子末段方向（偏重、偏阻尼，摆动沉稳不乱弹）
      // 屏幕坐标 y 向下，竖直下垂 = atan2(0, +dy) = 0
      const prev = rope[ROPE_POINTS - 2];
      const segAng = Math.atan2(end.x - prev.x, end.y - prev.y);
      const stiff = 80;
      const damp = reducedMotion ? 20 : 13;
      angVel += ((segAng - ang) * stiff - angVel * damp) * dt;
      angVel = clamp(angVel, -9, 9);
      ang += angVel * dt;

      // 翻转弹簧：目标是 180° 的整数倍，带回弹（ζ≈0.5，过冲约 25°）
      flipVel += (flipTarget - flipAng) * 160 * dt;
      flipVel *= Math.pow(reducedMotion ? 1e-7 : 3.2e-6, dt);
      flipAng += flipVel * dt;

      // 摆速带来前后倾与光泽位移（物理质感）
      const vxCard = (end.x - end.px) / Math.max(dt, 1e-4);
      const vyCard = (end.y - end.py) / Math.max(dt, 1e-4);
      const tiltTarget = clamp(vxCard * 0.012, -8, 8);
      tiltX += (tiltTarget - tiltX) * Math.min(1, dt * 6);
      const sheenX = 50 + Math.sin(flipAng) * 70 + ang * 22 + tiltX * 1.5;
      return { end, vxCard, vyCard, sheenX };
    };

    // ---- 渲染 ----
    const render = ({ end, vxCard, vyCard, sheenX }: ReturnType<typeof step>) => {
      const d = smoothPath(rope);
      strapBgRef.current?.setAttribute("d", d);
      strapEdgeRef.current?.setAttribute("d", d);
      textPathRef.current?.setAttribute("href", "#badge-strap-guide");
      document.getElementById("badge-strap-guide")?.setAttribute("d", d);

      const angDeg = (ang * 180) / Math.PI;
      rigid.style.transform = `translate3d(${end.x.toFixed(2)}px, ${end.y.toFixed(2)}px, 0) rotate(${angDeg.toFixed(2)}deg) scale(${cardScale.toFixed(3)})`;
      flip.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${((flipAng * 180) / Math.PI).toFixed(2)}deg)`;
      sheen.style.backgroundPosition = `${clamp(sheenX, -80, 180).toFixed(1)}% 0`;

      // 甩动时轻微压扁/拉伸，模拟卡片惯量带来的形变
      const speed = Math.hypot(vxCard, vyCard);
      const squash = clamp(speed * 0.00004, 0, 0.05);
      flip.style.scale = `${1 + squash} ${1 - squash}`;
      void vyCard;
    };

    // ---- 主循环（固定步长） ----
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const FIXED = 1 / 60;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!running || !inView) {
        last = now;
        return;
      }
      acc += Math.min(now - last, 50);
      last = now;
      let out: ReturnType<typeof step> | null = null;
      while (acc >= FIXED * 1000) {
        out = step(FIXED, now);
        acc -= FIXED * 1000;
      }
      if (out) render(out);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      rigid.removeEventListener("pointerdown", onPointerDown);
      rigid.removeEventListener("pointermove", onPointerMove);
      rigid.removeEventListener("pointerup", onPointerUp);
      rigid.removeEventListener("pointercancel", onPointerUp);
      rigid.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="badge-stage" ref={stageRef} aria-hidden="false">
      {/* 挂绳（SVG，逐帧重建路径，织带文字会跟着绳子弯曲游走） */}
      <svg ref={svgRef} className="badge-strap-svg" aria-hidden="true">
        <defs>
          <path id="badge-strap-guide" fill="none" />
        </defs>
        <path ref={strapBgRef} className="badge-strap-bg" />
        <path ref={strapEdgeRef} className="badge-strap-edge" />
        <text className="badge-strap-text">
          <textPath ref={textPathRef} href="#badge-strap-guide" startOffset="0">
            {STRAP_TEXT.repeat(4)}
          </textPath>
        </text>
      </svg>

      {/* 刚体：吊点 = 卡片顶部中心，transform 每帧由物理写入 */}
      <div
        ref={rigidRef}
        className="badge-rigid"
        role="button"
        tabIndex={0}
        aria-label="孙圣杰的工牌，可拖拽甩动，点击翻面"
        style={{
          width: BASE_W,
          height: BASE_H + CLIP_H,
          marginLeft: -BASE_W / 2,
          touchAction: "none",
        }}
      >
        {/* 金属夹 + 鸡眼 */}
        <div className="badge-clip" style={{ height: CLIP_H }}>
          <span className="badge-clip-hole" />
        </div>
        <div className="badge-flip" ref={flipRef}>
          {/* 正面 */}
          <div className="badge-face badge-front">
            <div className="badge-slot" />
            <div className="badge-head">
              <span className="badge-logo">SS</span>
              <span className="badge-org">AISPEECH · 思必驰</span>
            </div>
            <div className="badge-photo-wrap">
              <img src={PORTRAIT_IMG} alt="" draggable={false} className="badge-photo" />
            </div>
            <div className="badge-name-cn">{PROFILE.nameCN}</div>
            <div className="badge-name-en">SUN SHENGJIE</div>
            <div className="badge-title-chip">{PROFILE.title}</div>
            <div className="badge-id-row">
              <span>NO. SH-2024-0718</span>
              <span>上海 · SH</span>
            </div>
            <div className="badge-barcode" />
            <div className="badge-foot mono">
              TRAIN · INFER · AGENT · EDGE
            </div>
            <div className="badge-sheen" ref={sheenRef} aria-hidden="true" />
          </div>
          {/* 背面 */}
          <div className="badge-face badge-back">
            <div className="badge-magstripe" />
            <div className="badge-back-title">若拾获这张工牌 / IF FOUND</div>
            <div className="badge-back-rows">
              <div>
                <i>MAIL</i>
                <b>{PROFILE.email}</b>
              </div>
              <div>
                <i>TEL</i>
                <b>{PROFILE.phone}</b>
              </div>
              <div>
                <i>BASE</i>
                <b>
                  {PROFILE.location} · {PROFILE.company}
                </b>
              </div>
            </div>
            <div className="badge-back-bottom">
              <span className="badge-chip" />
              <span className="badge-barcode badge-barcode--back" />
            </div>
            <div className="badge-foot mono">PROPERTY OF AISPEECH · EST. 2024</div>
            <div className="badge-sheen" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
