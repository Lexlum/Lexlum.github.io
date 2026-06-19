import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/nav";
import { PROFILE } from "../data/resume";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Shrink/tighten the bar after scrolling past the hero fold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on ESC + lock body scroll while drawer open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300
          ${scrolled ? "bg-[#0C0C0C]/85 backdrop-blur-md py-3" : "bg-transparent py-5"}`}
      >
        <nav className="flex items-center justify-between px-6 md:px-10 max-w-7xl mx-auto">
          {/* Brand */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-[#D7E2EA] font-black tracking-tight text-lg md:text-xl"
          >
            {PROFILE.name.split(" ").map((w) => w[0]).join("")}
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex md:gap-8 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNav(link.href)}
                className="text-[#D7E2EA] font-medium uppercase tracking-wider
                  text-sm md:text-base transition-opacity duration-200 hover:opacity-70"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href={`mailto:${PROFILE.email}`}
            className="hidden md:inline-flex items-center rounded-full text-white font-medium uppercase tracking-widest
              text-xs md:text-sm px-6 py-2.5 md:px-8 md:py-3
              transition-transform duration-200 hover:scale-105"
            style={{
              background:
                "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
              boxShadow: "0px 4px 4px rgba(181, 1, 167, 0.25)",
            }}
          >
            Contact
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10
              rounded-full border border-[#D7E2EA]/30 text-[#D7E2EA]"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0C0C0C]/95 backdrop-blur-sm flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNav(link.href)}
              className="text-[#D7E2EA] font-medium uppercase tracking-widest text-3xl"
            >
              {link.label}
            </button>
          ))}
          <a
            href={`mailto:${PROFILE.email}`}
            className="mt-4 rounded-full text-white font-medium uppercase tracking-widest text-sm px-8 py-3"
            style={{
              background:
                "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
            }}
          >
            Contact
          </a>
        </div>
      )}
    </>
  );
}
