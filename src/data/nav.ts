export interface NavLink {
  label: string;
  href: string;
}

// Single source of truth for both desktop nav and mobile menu.
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "Contact", href: "#contact" },
];
