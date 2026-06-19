import FadeIn from "../components/FadeIn";
import ContactButton from "../components/ContactButton";
import { PROFILE, HOBBIES } from "../data/resume";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 scroll-mt-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="hero-heading font-black uppercase leading-none tracking-tight mb-8"
          style={{ fontSize: "clamp(2.5rem, 10vw, 130px)" }}
        >
          Let&apos;s Build
        </FadeIn>

        <FadeIn delay={0.15} y={20}>
          <p className="text-[#D7E2EA]/70 font-light leading-relaxed max-w-[520px] mb-12" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)" }}>
            适合联系我的场景：车载智能体、中枢大模型、Function Call、推理部署、端侧运行时与模型压缩优化。
          </p>
        </FadeIn>

        {/* Education + contact facts */}
        <FadeIn delay={0.25} y={20} className="w-full max-w-[640px] mb-12">
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="rounded-3xl border-2 border-[#D7E2EA]/15 bg-[#D7E2EA]/5 px-5 py-4">
              <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-1">教育</div>
              <div className="text-[#D7E2EA] font-medium text-sm sm:text-base">
                {PROFILE.education}
              </div>
              <div className="text-[#D7E2EA]/50 font-light text-xs mt-1">2021 - 2024</div>
            </div>
            <a href={`tel:${PROFILE.phone}`} className="rounded-3xl border-2 border-[#D7E2EA]/15 bg-[#D7E2EA]/5 px-5 py-4 transition-colors duration-200 hover:bg-[#D7E2EA]/10">
              <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-1">电话</div>
              <div className="text-[#D7E2EA] font-medium text-sm sm:text-base">{PROFILE.phone}</div>
              <div className="text-[#D7E2EA]/50 font-light text-xs mt-1">微信同号</div>
            </a>
            <a href={`mailto:${PROFILE.email}`} className="rounded-3xl border-2 border-[#D7E2EA]/15 bg-[#D7E2EA]/5 px-5 py-4 transition-colors duration-200 hover:bg-[#D7E2EA]/10">
              <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-1">邮箱</div>
              <div className="text-[#D7E2EA] font-medium text-sm sm:text-base break-all">
                {PROFILE.email}
              </div>
            </a>
            <div className="rounded-3xl border-2 border-[#D7E2EA]/15 bg-[#D7E2EA]/5 px-5 py-4">
              <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-1">坐标</div>
              <div className="text-[#D7E2EA] font-medium text-sm sm:text-base">
                {PROFILE.location} · 籍贯 {PROFILE.hometown}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Hobbies */}
        <FadeIn delay={0.35} y={20} className="mb-12">
          <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-4">兴趣爱好</div>
          <div className="flex flex-wrap justify-center gap-3">
            {HOBBIES.map((hobby) => (
              <span
                key={hobby}
                className="rounded-full border-2 border-[#D7E2EA]/20 px-4 py-2 text-[#D7E2EA] font-light"
                style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)" }}
              >
                {hobby}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.45} y={20}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ContactButton href={`mailto:${PROFILE.email}`} children="Get in Touch" />
            <ContactButton href={`tel:${PROFILE.phone}`} children="Call Me" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
