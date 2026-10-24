"use client";

import { useCallback, useState } from "react";
import DesktopNav from "@/components/layout/DesktopNav";
import MobileMenu from "@/components/layout/MobileMenu";

export interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Size & Fit", href: "/size-fit" },
  { label: "Contact", href: "/contact" },
];

// Orchestrator: owns the link list and the mobile menu open state, and
// composes the desktop and mobile navigation.
export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <DesktopNav links={navLinks} />
      <MobileMenu links={navLinks} open={menuOpen} onOpen={openMenu} onClose={closeMenu} />
    </>
  );
}
