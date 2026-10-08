# Karanyé — Work Tracker

Derived from `PROJECT.md` (build phases §16, open decisions §17) and `AGENTS.md`.
Updated at the end of every task. Source of truth for sequencing stays `PROJECT.md`.

## Now

- [x] Home Page shell (layout, nav split, sections, dummy data, routes)
- [x] Route placeholders for header links + `/products/[slug]`
- [x] Shop page UI (dummy data, no backend)
  - [x] Install `sweetalert2` + `react-toastify` (approved)
  - [x] `lib/data/shop.ts` catalogue
  - [x] `components/reusable/ProductCard.tsx` (dead Add to Bag → toast only)
  - [x] `components/shop/Filter.tsx` + `ProductList.tsx` (client filters, pagination)
  - [x] `components/shop/Guarantee.tsx` + `SizingHelp.tsx` bands
  - [x] `app/shop/page.tsx` composition rewrite
  - [x] ToastContainer wiring + Toastify CSS overrides (radius 0, no shadow, tokens)
- [x] Fix leftover `BagPage` name in shop placeholder (absorbed by rewrite above)
- [x] About page (4 sections, copy inline per convention, screenshot placeholders)

## Next (in phase order, one phase at a time with review)

- [ ] Phase 2 — Catalogue: schema + migrations, RLS, storage bucket, Shop (search
      params + Postgres), design detail page, drawers. Needs: product detail design (§17)
- [ ] Phase 3 — Admin: products (auth + role checks, CRUD, images, sizes/stock)
- [ ] Phase 4 — Content pages: About, Size & Fit, Made to Measure, Contact + API,
      Private List + API
- [ ] Phase 5 — Bag/shop drawer + checkout + Paystack + emails. BLOCKED on delivery (§17)
- [ ] Phase 6 — Admin: orders, waitlist CSV, Order Lookup
- [ ] Phase 7 — Operations + launch (keep-alive, backups, a11y pass, full QA)

## Blocked — open decisions (PROJECT.md §17, do not implement until resolved)

- [ ] Delivery and shipping (blocks Phase 5)
- [ ] Made to Measure core fields
- [ ] MTM cancellation and refund policy
- [ ] Contact details (email, phone/WhatsApp, socials)
- [ ] Size chart data
- [ ] Product detail design
- [ ] Checkout design
- [ ] Brand assets (wordmark + monogram SVG)

## Exceptions log (user decisions overriding the spec)

- Bag → Shop conversion: header bag icon is a Shop icon → `/shop`;
  `app/bag/` removed; Phase 5 "bag drawer/page" to be re-scoped as shop drawer/page.
- `sweetalert2` installed but UNUSED — first use deferred (candidate: Phase 5
  checkout confirmations). Must be token-styled (`customClass`) to meet radius-0 /
  no-shadow rules when first used.
- Dead Add to Bag button fires a placeholder toast only (no cart state until Phase 5).

## Design review queue

- Home built from screenshot (no Stitch file in repo)
- Shop built from screenshot; badge wording uses canonical §3.7 tokens, screenshot's
  "LIMITED ATELIER RUN" / "IN STOCK / ATELIER" not implemented
