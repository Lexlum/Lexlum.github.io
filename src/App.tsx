import Navbar from "./components/Navbar";
import WorkBadge from "./components/WorkBadge";
import HeroSection from "./sections/HeroSection";
import TerminalSection from "./sections/TerminalSection";
// 跑马灯暂时下线，后续写博客时可能换回：import MarqueeSection from "./sections/MarqueeSection";
import AboutSection from "./sections/AboutSection";
import ServicesSection from "./sections/ServicesSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import ResearchSection from "./sections/ResearchSection";
import ContactSection from "./sections/ContactSection";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0C0C0C]" style={{ overflowX: "clip" }}>
      <Navbar />
      {/* 挂绳工牌 — fixed 常驻右上角，从导航栏底边垂下（z: 导航栏 50 > 工牌 30 > 页面内容） */}
      <WorkBadge />
      <HeroSection />
      <TerminalSection />
      {/* <MarqueeSection /> — 跑马灯已替换为终端日志，保留代码待博客上线 */}
      <AboutSection />
      <ServicesSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <ResearchSection />
      <ContactSection />
    </div>
  );
}
