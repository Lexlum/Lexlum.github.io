// ============================================================
// ⚠️ 已下线 — 2026-06-19
// 跑马灯区块被终端日志打字机 (TerminalSection) 替换。
// 代码完整保留：后续写博客 / 有了自己的作品截图后，可重新启用
// （在 App.tsx 里把 <TerminalSection /> 换回 <MarqueeSection />）。
// 第三方 GIF (motionsites.ai) 与个人内容无关，替换前请换成自有素材。
// ============================================================

import { useEffect, useRef, useState } from "react";

const IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const ROW1 = IMAGES.slice(0, 11);
const ROW2 = IMAGES.slice(11);

const TRIPLE = <T,>(arr: T[]): T[] => [...arr, ...arr, ...arr];

function MarqueeRow({
  images,
  direction,
}: {
  images: string[];
  direction: "right" | "left";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      const next = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(next - 200);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const translateX =
    direction === "right" ? offset : -offset;

  return (
    <div ref={ref} style={{ willChange: "transform", overflow: "hidden" }}>
      <div
        className="flex gap-3"
        style={{
          transform: `translateX(${translateX}px)`,
          willChange: "transform",
        }}
      >
        {TRIPLE(images).map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            className="shrink-0 rounded-2xl object-cover"
            style={{ width: 420, height: 270 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MarqueeSection() {
  return (
    <section className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3">
      <MarqueeRow images={ROW1} direction="right" />
      <MarqueeRow images={ROW2} direction="left" />
    </section>
  );
}
