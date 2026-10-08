"use client";

import { useCallback, useState } from "react";
import DesktopNav from "@/components/layout/DesktopNav";
import MobileMenu from "@/components/layout/MobileMenu";

// Orchestrator: owns only the mobile menu open state and composes
// the desktop and mobile navigation. No link data lives here.
export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <DesktopNav />
      <MobileMenu open={menuOpen} onOpen={openMenu} onClose={closeMenu} />
    </>
  );
}
