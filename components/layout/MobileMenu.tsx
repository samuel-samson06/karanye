"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { navLinks } from "@/lib/data/home";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

// Mobile navigation: hamburger opens a full-height overlay panel.
// shop and Account stay visible in the bar at all times (§3.7).
export default function MobileMenu({ open, onClose, onOpen }: MobileMenuProps) {
  const panelId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const openButton = openButtonRef.current;
    closeButtonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      openButton?.focus();
    };
  }, [open, onClose]);

  return (
    <div className="flex items-center justify-between lg:hidden">
      <button
        ref={openButtonRef}
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        className="flex min-h-11 min-w-11 items-center justify-center text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      <Link
        href="/"
        aria-label="Karanyé home"
        className="text-headline-sm tracking-[0.08em]"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        KARANYÉ
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/shop"
          aria-label="Shopping shop"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 6h12l-1 11H4L3 6Z" stroke="currentColor" strokeWidth="1" />
            <path d="M6 6V5a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Link>
        <Link
          href="/orders/lookup"
          aria-label="Account — order lookup"
          className="flex min-h-11 min-w-11 items-center justify-center text-ink"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1" />
            <path d="M3 17c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1" />
          </svg>
        </Link>
      </div>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[8px]"
          />
          <div
            id={panelId}
            className="absolute top-0 left-0 flex h-full w-[85%] max-w-80 flex-col border-r border-platinum bg-canvas px-5 py-6"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-headline-sm tracking-[0.08em]"
                style={{ fontFamily: "var(--font-bodoni)" }}
              >
                KARANYÉ
              </span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex min-h-11 min-w-11 items-center justify-center text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
            </div>
            <nav aria-label="Mobile" className="mt-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="border-b border-platinum py-4 text-label-md text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Link
                href="/shop"
                onClick={onClose}
                className="flex h-[52px] items-center justify-center border border-ink text-label-md text-ink"
              >
                shop
              </Link>
              <Link
                href="/orders/lookup"
                onClick={onClose}
                className="flex h-[52px] items-center justify-center bg-crimson text-label-md text-canvas"
              >
                Account — Order Lookup
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
