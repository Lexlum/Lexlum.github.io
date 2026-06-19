import FadeIn from "../components/FadeIn";
import AnimatedText from "../components/AnimatedText";
import ContactButton from "../components/ContactButton";
import { ABOUT_TEXT, ABOUT_ADVANTAGES, PROFILE } from "../data/resume";

const BASE =
  "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7";

const MOON = `${BASE}/moon_icon.11395d36.png`;
const P59 = `${BASE}/p59_1.4659672e.png`;
const LEGO = `${BASE}/lego_icon-1.703bb594.png`;
const GROUP = `${BASE}/Group_134-1.2e04f3ce.png`;

const FACTS = [
  { label: "现职", value: PROFILE.company },
  { label: "学历", value: PROFILE.education },
  { label: "方向", value: PROFILE.researchFocus },
  { label: "坐标", value: `${PROFILE.location} · 籍贯 ${PROFILE.hometown}` },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 scroll-mt-24">
      {/* Decorative corner images */}
      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%]"
      >
        <img src={MOON} alt="" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]"
      >
        <img src={P59} alt="" className="w-[100px] sm:w-[140px] md:w-[180px]" />
      </FadeIn>
      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%]"
      >
        <img src={LEGO} alt="" className="w-[120px] sm:w-[160px] md:w-[210px]" />
      </FadeIn>
      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]"
      >
        <img src={GROUP} alt="" className="w-[130px] sm:w-[170px] md:w-[220px]" />
      </FadeIn>

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 max-w-4xl">
        <FadeIn
          delay={0}
          y={40}
          as="h2"
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          About me
        </FadeIn>

        <AnimatedText
          text={ABOUT_TEXT}
          className="text-[#D7E2EA] font-medium text-center leading-relaxed max-w-[560px]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        />

        {/* Facts grid */}
        <FadeIn delay={0.2} y={20} className="w-full max-w-[640px]">
          <div className="grid grid-cols-2 gap-3">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="rounded-3xl border-2 border-[#D7E2EA]/15 bg-[#D7E2EA]/5 px-5 py-4"
              >
                <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-1">
                  {fact.label}
                </div>
                <div className="text-[#D7E2EA] font-medium text-sm sm:text-base">
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Advantages */}
        <FadeIn delay={0.3} y={20} className="w-full max-w-[640px]">
          <div className="text-[#D7E2EA]/50 text-xs uppercase tracking-widest mb-4 text-center">
            个人优势
          </div>
          <ul className="flex flex-col gap-3">
            {ABOUT_ADVANTAGES.map((adv) => (
              <li
                key={adv}
                className="text-[#D7E2EA] font-light leading-relaxed flex gap-3"
                style={{ fontSize: "clamp(0.85rem, 1.3vw, 1.05rem)" }}
              >
                <span className="text-[#D7E2EA]/40 shrink-0">—</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      <div className="mt-16 sm:mt-20 md:mt-24">
        <FadeIn delay={0.1} y={20}>
          <ContactButton href={`mailto:${PROFILE.email}`} children="Let's Talk" />
        </FadeIn>
      </div>
    </section>
  );
}
