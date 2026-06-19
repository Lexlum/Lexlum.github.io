import FadeIn from "../components/FadeIn";
import { SKILLS } from "../data/resume";

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative scroll-mt-24">
      <div className="max-w-5xl mx-auto">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16 sm:mb-20"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Tech Stack
        </FadeIn>

        <div className="flex flex-col gap-10 sm:gap-12">
          {SKILLS.map((group, i) => (
            <FadeIn key={group.category} delay={i * 0.1} y={30}>
              <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-4">
                {group.category}
              </div>
              <div className="flex flex-wrap gap-3">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border-2 border-[#D7E2EA]/20 bg-[#D7E2EA]/5
                      text-[#D7E2EA] font-light px-5 py-2.5
                      transition-colors duration-200 hover:bg-[#D7E2EA]/15"
                    style={{ fontSize: "clamp(0.85rem, 1.3vw, 1.05rem)" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
