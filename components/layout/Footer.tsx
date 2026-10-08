import Link from "next/link";

// Universal footer: plain four-column editorial footer on canvas
// with a platinum top border. Same tokens, type, and zero radius.
export default function Footer() {
  return (
    <footer className="border-t border-platinum bg-canvas">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 py-14 md:grid-cols-4 md:px-8 lg:px-16">
        <div>
          <p
            className="text-headline-md tracking-[0.08em]"
            style={{ fontFamily: "var(--font-bodoni)" }}
          >
            KARANYÉ
          </p>
          {/* TODO(content): confirm footer tagline */}
          <p className="mt-4 text-body-sm text-muted">
            Made to order, thoughtfully crafted.
          </p>
        </div>

        <nav aria-label="Shop">
          <p className="text-label-md text-ink">Shop</p>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <Link href="/shop" className="editorial-link text-body-sm text-muted">
                All Designs
              </Link>
            </li>
            <li>
              <Link href="/made-to-measure" className="editorial-link text-body-sm text-muted">
                Made to Measure
              </Link>
            </li>
            <li>
              <Link href="/size-fit" className="editorial-link text-body-sm text-muted">
                Size &amp; Fit
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="House">
          <p className="text-label-md text-ink">House</p>
          <ul className="mt-4 flex flex-col gap-3">
            <li>
              <Link href="/about" className="editorial-link text-body-sm text-muted">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="editorial-link text-body-sm text-muted">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/orders/lookup" className="editorial-link text-body-sm text-muted">
                Order Lookup
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-label-md text-ink">Atelier</p>
          {/* TODO(content): replace with real contact details */}
          <p className="mt-4 text-body-sm text-muted">TODO(content): contact details</p>
          <p className="mt-2 text-body-sm text-muted">TODO(content): social links</p>
        </div>
      </div>

      <div className="border-t border-platinum">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-16">
          <p className="text-label-sm text-muted">© Karanyé. All rights reserved.</p>
          <p className="text-label-sm text-muted">Lagos &amp; London</p>
        </div>
      </div>
    </footer>
  );
}
