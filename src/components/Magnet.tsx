import { useRef, type ReactNode, type CSSProperties } from "react";

interface MagnetProps {
  children: ReactNode;
  /** Pixel distance from the element edge within which the magnet activates. */
  padding?: number;
  /** Higher = weaker pull (transform is divided by this). */
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Magnetic hover effect: the wrapped element translates toward the cursor
 * while the pointer is within `padding` of its bounding box.
 */
export default function Magnet({
  children,
  padding = 100,
  strength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
  style,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = useRef(false);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const { left, top, width, height } = el.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    // Activate when the cursor enters the padded bounding box.
    if (
      Math.abs(distX) < width / 2 + padding &&
      Math.abs(distY) < height / 2 + padding
    ) {
      if (!isActive.current) {
        el.style.transition = activeTransition;
        isActive.current = true;
      }
      el.style.transform = `translate3d(${distX / strength}px, ${
        distY / strength
      }px, 0)`;
    } else {
      if (isActive.current) {
        el.style.transition = inactiveTransition;
        el.style.transform = "translate3d(0, 0, 0)";
        isActive.current = false;
      }
    }
  };

  const reset = () => {
    const el = ref.current;
    if (!el || !isActive.current) return;
    el.style.transition = inactiveTransition;
    el.style.transform = "translate3d(0, 0, 0)";
    isActive.current = false;
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform", ...style }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </div>
  );
}
