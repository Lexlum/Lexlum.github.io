import { useState, useEffect } from "react";
import FadeIn from "../components/FadeIn";
import BouncingAvatar from "../components/BouncingAvatar";
import ContactButton from "../components/ContactButton";
import { PROFILE } from "../data/resume";

const PORTRAIT_URL =
  "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";

// Avatar size scales with viewport without overwhelming the hero copy.
function avatarSizeFor(width: number): number {
  return Math.max(260, Math.min(480, Math.round(width * 0.46)));
}

export default function HeroSection() {
  const [avatarSize, setAvatarSize] = useState(() =>
    typeof window !== "undefined" ? avatarSizeFor(window.innerWidth) : 420
  );

  useEffect(() => {
    const onResize = () => setAvatarSize(avatarSizeFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-[calc(100vh-80px)] flex flex-col"
      style={{ overflowX: "clip" }}
    >
      {/* Bouncing avatar — layer 0, sits behind all text. Captures clicks. */}
      <div className="absolute inset-0 z-0">
        <BouncingAvatar
          src={PORTRAIT_URL}
          alt="孙圣杰头像"
          size={avatarSize}
          speed={1.6}
          kickPower={16}
        />
      </div>

      {/* Hero heading — layer 10, always readable on top of the avatar.
          pointer-events-none so clicks pass through to the bouncing layer. */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pointer-events-none">
        <FadeIn
          delay={0.15}
          y={40}
          as="h1"
          className="hero-heading font-black uppercase tracking-tight leading-[0.95] text-center
            text-[12vw] sm:text-[13vw] md:text-[11vw] lg:text-[10vw]"
        >
          Sun Shengjie
        </FadeIn>
      </div>

      {/* Bottom bar — layer 10, but the button re-enables pointer events. */}
      <div className="relative z-10 flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <FadeIn
          delay={0.35}
          y={20}
          className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug
            max-w-[160px] sm:max-w-[220px] md:max-w-[260px] pointer-events-none"
        >
          <p style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}>
            大模型算法工程师 · 训练 推理 Agent 端侧 全栈闭环
          </p>
          <p className="mt-2 text-[#D7E2EA]/50 normal-case" style={{ fontSize: "clamp(0.65rem, 1vw, 0.9rem)" }}>
            {PROFILE.location} · {PROFILE.company}
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton href={`mailto:${PROFILE.email}`} children="Get in Touch" />
        </FadeIn>
      </div>
    </section>
  );
}
