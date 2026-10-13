import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import type { NavLink } from "@/components/layout/Navigation";

interface DesktopNavProps {
  links: NavLink[];
}

// Desktop navigation: wordmark left, links centre, shop + Account right.
// Hidden below lg; MobileMenu owns smaller screens.
export default function DesktopNav({ links }: DesktopNavProps) {
  return (
    <div className="hidden lg:flex items-center justify-between gap-8">
      <Link
        href="/"
        aria-label="Karanyé home"
        className="text-headline-md tracking-[0.08em]"
        style={{ fontFamily: "var(--font-bodoni)" }}
      >
        <Image src={logo} alt="Karanyé" width={120} height={120}/>
      </Link>

      <nav aria-label="Primary" className="flex items-center gap-8">
        {links.map((link) => (
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
        
      </div>
    </div>
  );
}
