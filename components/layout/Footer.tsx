import Link from "next/link";

// Universal footer: plain four-column editorial footer on canvas
// with a platinum top border. Same tokens, type, and zero radius.
export default function Footer() {
  return (
    <footer className="border-t border-platinum bg-canvas">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 md:grid-cols-4 md:gap-8 md:px-8 lg:px-16">
        <div className="col-span-2 md:col-span-1">
          <p className="text-headline-md tracking-[0.08em]">
            KARANYÉ
          </p>
          {/* TODO(content): confirm footer tagline */}
          <p className="mt-4 text-body-sm text-muted">
            Made to order, thoughtfully crafted.
          </p>
        </div>

        <nav aria-label="Shop">
          <p className="text-label-md text-ink">Shop</p>
          <ul className="mt-2 flex flex-col md:mt-4 md:gap-3">
            <li>
              <Link href="/shop" className="inline-flex min-h-11 items-center text-body-sm text-muted md:min-h-0">
                <span className="editorial-link">All Designs</span>
              </Link>
            </li>
            <li>
              <Link href="/made-to-measure" className="inline-flex min-h-11 items-center text-body-sm text-muted md:min-h-0">
                <span className="editorial-link">Made to Measure</span>
              </Link>
            </li>
            <li>
              <Link href="/size-fit" className="inline-flex min-h-11 items-center text-body-sm text-muted md:min-h-0">
                <span className="editorial-link">Size &amp; Fit</span>
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="House">
          <p className="text-label-md text-ink">House</p>
          <ul className="mt-2 flex flex-col md:mt-4 md:gap-3">
            <li>
              <Link href="/about" className="inline-flex min-h-11 items-center text-body-sm text-muted md:min-h-0">
                <span className="editorial-link">About</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="inline-flex min-h-11 items-center text-body-sm text-muted md:min-h-0">
                <span className="editorial-link">Contact</span>
              </Link>
            </li>
            <li>
              <Link href="/orders/lookup" className="inline-flex min-h-11 items-center text-body-sm text-muted md:min-h-0">
                <span className="editorial-link">Order Lookup</span>
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
