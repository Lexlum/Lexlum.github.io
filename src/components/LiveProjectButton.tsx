import type { ReactNode } from "react";

interface LiveProjectButtonProps {
  children?: ReactNode;
  className?: string;
}

export default function LiveProjectButton({
  children = "Live Project",
  className = "",
}: LiveProjectButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest cursor-pointer
        px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base
        transition-colors duration-200 hover:bg-[#D7E2EA]/10 ${className}`}
    >
      {children}
    </button>
  );
}
