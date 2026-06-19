import FadeIn from "../components/FadeIn";
import { CAPABILITIES } from "../data/resume";

export default function ServicesSection() {
  return (
    <section
      id="capabilities"
      className="bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20 scroll-mt-24"
    >
      <h2
        className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Capabilities
      </h2>

      <div className="max-w-5xl mx-auto">
        {CAPABILITIES.map((service, i) => (
          <FadeIn
            key={service.number}
            delay={i * 0.1}
            y={30}
            className={`flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8
              py-8 sm:py-10 md:py-12 ${
                i !== 0 ? "border-t border-[rgba(12,12,12,0.15)]" : ""
              }`}
          >
            <span
              className="font-black leading-none shrink-0"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {service.number}
            </span>
            <div className="flex flex-col gap-2 sm:gap-3 sm:pt-3">
              <h3
                className="font-medium uppercase"
                style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
              >
                {service.name}
              </h3>
              <p
                className="font-light leading-relaxed max-w-2xl"
                style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)", opacity: 0.6 }}
              >
                {service.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
