"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** "drawer" slides from the right at all widths; "sheet" is a specification
   *  drawer — bottom near-full-height on mobile, right side on desktop (§3.7). */
  variant?: "drawer" | "sheet";
  className?: string;
}

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Shared overlay drawer (right-slide cart, garment specification sheets).
// Extracts the behaviour MobileMenu established: obsidian wash + blur,
// focus trap, Escape, body scroll lock, focus returned to the trigger.
export default function Drawer({
  open,
  onClose,
  label,
  children,
  variant = "drawer",
  className = "",
}: DrawerProps) {
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const trigger = document.activeElement as HTMLElement | null;

    (panel?.querySelector<HTMLElement>(focusableSelector) ?? panel)?.focus();

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const isSheet = variant === "sheet";
  const panelClasses = isSheet
    ? // Sheet: bottom-rise near-full-height on mobile, right-side on desktop.
      "inset-x-0 bottom-0 h-[92vh] border-t md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-md md:border-t-0 md:border-l "
    : "top-0 right-0 h-full w-full max-w-[420px] border-l ";
  const animationClass = isSheet ? "drawer-panel-sheet" : "drawer-panel-right";

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        aria-label={`Close ${label}`}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[8px]"
      />
      <div
        ref={panelRef}
        id={panelId}
        tabIndex={-1}
        className={`absolute overflow-y-auto border-platinum bg-canvas ${panelClasses}${animationClass} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
