import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import FadeIn from "../components/FadeIn";
import { PROJECTS, type Project } from "../data/resume";

function StackCard({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="h-[85vh] sticky flex items-center justify-center"
      style={{ top: `${96 + index * 28}px` }}
    >
      <motion.div
        style={{ scale: scale as MotionValue<number>, width: "100%", maxWidth: "100%" }}
        className="relative rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA]/15
          bg-[#0C0C0C] p-5 sm:p-7 md:p-9 max-h-full overflow-hidden"
      >
        {/* Content */}
        <div className="overflow-y-auto pr-1" style={{ maxHeight: "calc(85vh - 100px)" }}>
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 mb-4 sm:mb-6">
            <span
              className="font-black text-[#D7E2EA] leading-none shrink-0"
              style={{ fontSize: "clamp(2.8rem, 9vw, 6rem)" }}
            >
              {project.number}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[#D7E2EA]/60 uppercase tracking-widest" style={{ fontSize: "clamp(0.8rem, 1.1vw, 1rem)" }}>
                {project.category} · {project.period}
              </span>
              <h3
                className="hero-heading font-black uppercase leading-none mt-1.5"
                style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.4rem)" }}
              >
                {project.name}
              </h3>
              <p className="text-[#D7E2EA]/60 font-light leading-relaxed mt-2.5" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}>
                {project.summary}
              </p>
            </div>
          </div>

          {/* Metric tiles row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {project.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#D7E2EA]/20 bg-[#D7E2EA]/5
                  flex flex-col justify-center items-center text-center p-4 min-w-0"
              >
                <span
                  className="font-black text-[#D7E2EA] leading-none truncate w-full"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.8rem)" }}
                >
                  {stat.value}
                </span>
                <span className="text-[#D7E2EA]/55 mt-2 leading-tight break-words" style={{ fontSize: "clamp(0.72rem, 1vw, 0.88rem)" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Work + achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-9">
            <div>
              <div className="text-[#D7E2EA]/60 uppercase tracking-widest mb-3 flex items-center gap-2" style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.6rem)" }}>
                <span className="inline-block w-2 h-2 rounded-full bg-[#67e8f9]" />
                工作内容
              </div>
              <ul className="flex flex-col gap-2.5">
                {project.work.map((item, i) => (
                  <li
                    key={i}
                    className="text-[#D7E2EA]/85 font-light leading-relaxed flex gap-2.5"
                    style={{ fontSize: "clamp(1.15rem, 1.9vw, 1.6rem)" }}
                  >
                    <span className="text-[#67e8f9] shrink-0 font-medium" style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[#D7E2EA]/60 uppercase tracking-widest mb-3 flex items-center gap-2" style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.6rem)" }}>
                <span className="inline-block w-2 h-2 rounded-full bg-[#6ee7a8]" />
                业绩成果
              </div>
              <ul className="flex flex-col gap-2.5">
                {project.achievements.map((item, i) => (
                  <li
                    key={i}
                    className="text-[#D7E2EA]/85 font-light leading-relaxed flex gap-2.5"
                    style={{ fontSize: "clamp(1.15rem, 1.9vw, 1.6rem)" }}
                  >
                    <span className="text-[#6ee7a8] shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <div className="text-[#D7E2EA]/60 uppercase tracking-widest mb-2.5" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>技术栈</div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[#D7E2EA]/25 bg-[#D7E2EA]/5 px-3 py-1.5 text-[#D7E2EA]/80 font-light"
                      style={{ fontSize: "clamp(0.72rem, 0.95vw, 0.85rem)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 z-10 relative px-4 sm:px-8 md:px-10 scroll-mt-24"
    >
      <div className="pt-16 sm:pt-20 md:pt-28 pb-10">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-12 sm:mb-16 md:mb-20"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          Projects
        </FadeIn>

        <div>
          {PROJECTS.map((project, i) => (
            <StackCard
              key={project.number}
              project={project}
              index={i}
              total={PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
