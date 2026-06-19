import FadeIn from "../components/FadeIn";
import { PROFILE, ACHIEVEMENTS } from "../data/resume";

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="bg-white text-[#0C0C0C]
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20 scroll-mt-24"
    >
      {/* Work experience */}
      <div className="max-w-5xl mx-auto">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Experience
        </FadeIn>

        <FadeIn delay={0.1} y={30} className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8 pb-6 border-b border-[rgba(12,12,12,0.15)]">
            <div className="flex-1">
              <h3
                className="font-medium uppercase"
                style={{ fontSize: "clamp(1.2rem, 2.2vw, 2rem)" }}
              >
                {PROFILE.company}
              </h3>
              <p className="text-[#0C0C0C]/60 font-light mt-1" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)" }}>
                {PROFILE.title}
              </p>
            </div>
            <span className="text-[#0C0C0C]/50 font-light shrink-0" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)" }}>
              2024.07 - 至今
            </span>
          </div>
          <p className="text-[#0C0C0C]/70 font-light leading-relaxed mt-4" style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)" }}>
            负责公司业务相关大模型全流程工作：使用 DeepSpeed、Megatron-LM、LLaMAFactory、MindSpeed-LLM（昇腾）等大规模分布式训练框架进行模型训练，并利用 vLLM、SGLang、Imdeploy、MindIE（昇腾）等框架进行高效部署。持续追踪前沿论文，深入分析核心原理与适用场景。
          </p>
        </FadeIn>

        {/* Achievements */}
        <FadeIn delay={0} y={30} as="h3" className="font-black uppercase mb-10" style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}>
          Key Achievements
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((item, i) => (
            <FadeIn
              key={item.title}
              delay={i * 0.1}
              y={30}
              className="rounded-3xl border border-[rgba(12,12,12,0.15)] p-6 sm:p-7"
            >
              <div className="text-[#0C0C0C]/50 text-xs uppercase tracking-widest mb-2">
                {item.org}
              </div>
              <h4 className="font-medium mb-2" style={{ fontSize: "clamp(1rem, 1.8vw, 1.4rem)" }}>
                {item.title}
              </h4>
              <p className="text-[#0C0C0C]/60 font-light leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.2vw, 0.95rem)" }}>
                {item.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
