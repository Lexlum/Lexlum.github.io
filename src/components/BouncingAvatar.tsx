import { useRef, useEffect } from "react";

interface BouncingAvatarProps {
  src: string;
  alt: string;
  /** Element width in px. Height auto-fills the image aspect ratio. */
  size?: number;
  /** Base speed in px/frame. */
  speed?: number;
  /** Multiplier applied to the kick velocity on click. */
  kickPower?: number;
  className?: string;
}

/**
 * A square element that bounces around inside its parent container (DVD-style).
 * Interactions:
 *  - Click anywhere on the stage → the avatar is kicked away from the click.
 *  - Press + drag the avatar itself → it follows the cursor; on release it
 *    inherits the throw velocity and resumes bouncing.
 *
 * It sits at z-0 so text with a higher z-index always reads on top.
 * Pauses when the tab is hidden to save battery.
 */
export default function BouncingAvatar({
  src,
  alt,
  size = 440,
  speed = 1.6,
  kickPower = 16,
  className = "",
}: BouncingAvatarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  // Position + velocity live in refs so the loop doesn't trigger re-renders.
  const pos = useRef({ x: 80, y: 80 });
  const vel = useRef({ x: speed, y: speed });
  const raf = useRef<number | null>(null);
  const dragging = useRef(false);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  // Tracks the last few pointer positions to estimate throw velocity.
  const dragTrail = useRef<{ t: number; x: number; y: number }[]>([]);

  // Source image aspect ratio — used to derive the rendered height from width.
  // Loaded from the real image; defaults to the known 1450x1570 ratio.
  const aspectRef = useRef(1570 / 1450);
  const dims = () => {
    const w = sizeRef.current;
    const h = w * aspectRef.current;
    return { w, h };
  };

  useEffect(() => {
    const container = containerRef.current;
    const el = imgRef.current;
    if (!container || !el) return;

    const tick = () => {
      // While dragging, the pointermove handler drives position directly.
      if (dragging.current) {
        raf.current = requestAnimationFrame(tick);
        return;
      }

      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const { w, h } = dims();
      const maxX = Math.max(0, cw - w);
      const maxY = Math.max(0, ch - h);

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      // Bounce off edges.
      if (pos.current.x <= 0) {
        pos.current.x = 0;
        vel.current.x = Math.abs(vel.current.x);
      } else if (pos.current.x >= maxX) {
        pos.current.x = maxX;
        vel.current.x = -Math.abs(vel.current.x);
      }
      if (pos.current.y <= 0) {
        pos.current.y = 0;
        vel.current.y = Math.abs(vel.current.y);
      } else if (pos.current.y >= maxY) {
        pos.current.y = maxY;
        vel.current.y = -Math.abs(vel.current.y);
      }

      // Gently decay extra velocity back toward base speed, keeping direction.
      const decay = 0.985;
      vel.current.x *= decay;
      vel.current.y *= decay;
      const base = speed;
      if (Math.abs(vel.current.x) < base) vel.current.x = Math.sign(vel.current.x || 1) * base;
      if (Math.abs(vel.current.y) < base) vel.current.y = Math.sign(vel.current.y || 1) * base;

      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        if (raf.current) cancelAnimationFrame(raf.current);
        raf.current = null;
      } else if (raf.current === null) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [speed]);

  // --- Click anywhere → kick the avatar away from the click point ---
  const handleStageClick = (e: React.MouseEvent) => {
    // Ignore clicks that originated on the avatar itself (drag handles those).
    if (dragging.current) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const { w, h } = dims();
    const ax = pos.current.x + w / 2;
    const ay = pos.current.y + h / 2;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    let dx = ax - cx;
    let dy = ay - cy;
    const dist = Math.hypot(dx, dy) || 1;
    dx /= dist;
    dy /= dist;
    vel.current.x = dx * kickPower;
    vel.current.y = dy * kickPower;
  };

  // --- Drag the avatar directly ---
  const onAvatarPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    const el = imgRef.current;
    if (!el) return;

    dragging.current = true;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
    dragTrail.current = [{ t: performance.now(), x: e.clientX, y: e.clientY }];

    const rect = container.getBoundingClientRect();
    const { w, h } = dims();
    // Offset between pointer and the avatar's top-left, so it doesn't snap.
    const grabOffsetX = e.clientX - rect.left - pos.current.x;
    const grabOffsetY = e.clientY - rect.top - pos.current.y;

    const onMove = (ev: PointerEvent) => {
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      let nx = ev.clientX - rect.left - grabOffsetX;
      let ny = ev.clientY - rect.top - grabOffsetY;
      // Clamp inside the stage.
      nx = Math.max(0, Math.min(nx, cw - w));
      ny = Math.max(0, Math.min(ny, ch - h));
      pos.current.x = nx;
      pos.current.y = ny;
      el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
      dragTrail.current.push({ t: performance.now(), x: ev.clientX, y: ev.clientY });
      // Keep only the last ~100ms for velocity estimation.
      const cutoff = performance.now() - 100;
      dragTrail.current = dragTrail.current.filter((p) => p.t >= cutoff);
    };

    const onUp = (ev: PointerEvent) => {
      dragging.current = false;
      el.style.cursor = "grab";
      el.releasePointerCapture(ev.pointerId);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);

      // Estimate throw velocity from the last trail samples (px/frame @60fps).
      const trail = dragTrail.current;
      if (trail.length >= 2) {
        const first = trail[0];
        const last = trail[trail.length - 1];
        const dt = Math.max(1, last.t - first.t); // ms
        const pxPerMsX = (last.x - first.x) / dt;
        const pxPerMsY = (last.y - first.y) / dt;
        // Convert to px/frame assuming ~16.7ms per frame.
        const fx = pxPerMsX * 16.7;
        const fy = pxPerMsY * 16.7;
        // Cap the throw so it doesn't fly absurdly fast.
        const max = kickPower * 2.5;
        const clamp = (v: number) => Math.max(-max, Math.min(max, v));
        const cx = clamp(fx);
        const cy = clamp(fy);
        // Only accept a meaningful throw; otherwise keep base velocity in a valid dir.
        if (Math.hypot(cx, cy) > speed) {
          vel.current.x = cx;
          vel.current.y = cy;
        } else {
          vel.current.x = Math.sign(vel.current.x || 1) * speed;
          vel.current.y = Math.sign(vel.current.y || 1) * speed;
        }
      }
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleStageClick}
      className={`absolute inset-0 overflow-hidden cursor-pointer ${className}`}
    >
      <div
        ref={imgRef}
        onPointerDown={onAvatarPointerDown}
        style={{
          width: size,
          height: size * aspectRef.current,
          willChange: "transform",
          cursor: "grab",
          touchAction: "none",
        }}
        className="absolute top-0 left-0 z-0"
      >
        <img
          src={src}
          alt={alt}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              aspectRef.current = img.naturalHeight / img.naturalWidth;
              // Trigger a re-render so the box picks up the real ratio.
              if (imgRef.current) {
                imgRef.current.style.height = `${size * aspectRef.current}px`;
              }
            }
          }}
          className="w-full h-full rounded-[40px] object-contain select-none pointer-events-none"
          draggable={false}
        />
      </div>
    </div>
  );
}
