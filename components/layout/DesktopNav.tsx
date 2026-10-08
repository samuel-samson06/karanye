import Link from "next/link";
import { navLinks } from "@/lib/data/home";

// Desktop navigation: wordmark left, links centre, shop + Account right.
// Hidden below lg; MobileMenu owns smaller screens.
export default function DesktopNav() {
  return (
    <div className="hidden lg:flex items-center justify-between gap-8">
      <Link
        href="/"
        aria-label="Karanyé home"
        className="text-headline-md tracking-[0.08em]"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        KARANYÉ
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="editorial-link text-label-md text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <Link
          href="/shop"
          className="editorial-link flex min-h-11 min-w-11 items-center gap-2 text-label-md text-ink"
          aria-label="Shopping shop"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 6h12l-1 11H4L3 6Z"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M6 6V5a3 3 0 0 1 6 0v1"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          shop
        </Link>
        <Link
          href="/orders/lookup"
          className="editorial-link flex min-h-11 min-w-11 items-center gap-2 text-label-md text-ink"
          aria-label="Account — order lookup"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1" />
            <path
              d="M3 17c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
          Account
        </Link>
      </div>
    </div>
  );
}
