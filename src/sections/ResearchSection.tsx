import FadeIn from "../components/FadeIn";
import { PAPERS } from "../data/resume";

export default function ResearchSection() {
  return (
    <section
      id="research"
      className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20 scroll-mt-24"
    >
      <div className="max-w-5xl mx-auto">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="font-black uppercase leading-none tracking-tight text-center mb-6"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Research
        </FadeIn>
        <FadeIn delay={0.1} y={20}>
          <p className="text-[#0C0C0C]/50 font-light text-center mb-16 sm:mb-20" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}>
            一作 3 篇 · 合作 6 篇 · 覆盖 NeurIPS / ICML / ACL / KBS 等顶刊顶会
          </p>
        </FadeIn>

        <div>
          {PAPERS.map((paper, i) => (
            <FadeIn
              key={`${paper.title}-${i}`}
              delay={Math.min(i * 0.05, 0.3)}
              y={20}
              className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-8
                py-6 sm:py-7 border-b border-[rgba(12,12,12,0.15)] last:border-b-0"
            >
              <div className="shrink-0 sm:w-[200px] flex items-baseline gap-3">
                <span className="font-black text-[#0C0C0C]" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}>
                  {paper.venue}
                </span>
                <span className="text-[#0C0C0C]/40 font-light" style={{ fontSize: "clamp(0.8rem, 1vw, 0.95rem)" }}>
                  {paper.year}
                </span>
              </div>
              <div className="flex-1">
                <p
                  className="font-light leading-snug"
                  style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.2rem)" }}
                >
                  {paper.title}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                  paper.authorship === "一作/共一"
                    ? "bg-[#0C0C0C] text-white"
                    : "border border-[rgba(12,12,12,0.2)] text-[#0C0C0C]/60"
                }`}
              >
                {paper.authorship}
              </span>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
