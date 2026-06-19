import { useRef } from "react";
import type { CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Character-by-character scroll-reveal. Each character animates its opacity
 * from 0.2 to 1 staggered across the overall scroll progress of the block.
 */
export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });

  const characters = Array.from(text);

  return (
    <p ref={ref} className={className} style={style}>
      {characters.map((char, i) => (
        <Char
          key={i}
          index={i}
          total={characters.length}
          progress={scrollYProgress}
        >
          {char}
        </Char>
      ))}
    </p>
  );
}

function Char({
  children,
  index,
  total,
  progress,
}: {
  children: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Each character's reveal window. Staggered start across the text.
  const start = index / total;
  const end = start + 1 / total;

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  // Reserve layout space with an invisible placeholder so the absolute span
  // doesn't collapse the line height.
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ opacity: 0 }} aria-hidden="true">
        {children === " " ? "\u00A0" : children}
      </span>
      <motion.span
        style={{ opacity, position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        {children === " " ? "\u00A0" : children}
      </motion.span>
    </span>
  );
}
