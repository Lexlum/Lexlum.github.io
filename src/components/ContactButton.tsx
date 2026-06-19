import type { CSSProperties, ReactNode, MouseEvent } from "react";

interface ContactButtonProps {
  children?: ReactNode;
  className?: string;
  /** If provided, renders as <a> with this href (mailto:, tel:, #anchor). */
  href?: string;
  onClick?: (e: MouseEvent) => void;
}

/**
 * Gradient pill CTA. The white outline ring is rendered via an absolute
 * inset span so it reads as an outer halo around the gradient fill.
 * Renders as <a> when `href` is set, otherwise <button>.
 */
export default function ContactButton({
  children = "Contact Me",
  className = "",
  href,
  onClick,
}: ContactButtonProps) {
  const style: CSSProperties = {
    background:
      "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
    boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
  };

  const classes = `relative inline-flex items-center justify-center rounded-full text-white
    font-medium uppercase tracking-widest cursor-pointer
    px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4
    text-xs sm:text-sm md:text-base ${className}`;

  const ring = (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: "-3px",
        borderRadius: "9999px",
        border: "2px solid #FFFFFF",
        pointerEvents: "none",
      }}
    />
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} style={style} className={classes}>
        {ring}
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} style={style} className={classes}>
      {ring}
      {children}
    </button>
  );
}
