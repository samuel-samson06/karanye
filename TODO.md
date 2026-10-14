# Karanyé — Work Tracker

Sequencing source of truth: this file. Design/architecture source of truth:
`PROJECT.md`. Agent working rules: `AGENT.md`.

## Completed foundation (storefront UI, dummy data)

- [x] Home Page shell (layout, nav split, sections, dummy data, routes)
- [x] Route placeholders for header links + `/products/[slug]`
- [x] Shop page UI (dummy data, no backend) + toast wiring (`sweetalert2` + `react-toastify` installed; SWAL unused)
- [x] About page (4 sections, copy inline) + Contact page (InfoSection + FormSection, dead submit)
- [x] Hero slider (ScrollImages: 5s autoplay, no drag/controls, reduced-motion static)
- [x] Dissolved `lib/data/home.ts`; trimmed `lib/data/shop.ts` to products only (`lib/money.ts`, Navigation props)

## Phase 1 — Database foundation: tables and RLS — Status: In Progress

Objective: approved table structures + RLS in reviewable SQL, executed and verified in Dashboard.

- [x] `sql/01_core_schema.sql` created (tables, keys, constraints, indexes — no functions/triggers)
- [x] `sql/02_rls_policies.sql` created (grants, RLS, `available_variants` view, Storage policies)
- [x] Schema correction: dropped speculative product fields (`fit`, `model_info`,
      `mtm_extra_fields`); status kept as merchandising label (fulfilment on
      variants); images use `image_url` + optional alt; variant size nullable;
      standard order items no longer require a size snapshot
- [x] Schema correction 2: dropped `production_time_days` (timelines undefined)
      and deferred `mtm_surcharge_kobo` (no MTM pricing policy yet); kept
      `mtm_available` + `measurements` snapshot; no replacement pricing fields
- [ ] Review both files (done by author in-task; independent review pending)
- [ ] Execute 01 then 02 in Supabase Dashboard SQL Editor (manual step — NOT done)
- [ ] Verify tables, constraints, and RLS behaviour in Dashboard (manual step — NOT done)

Dependencies: §17 open decisions that shape copy/content (not schema-blocking).
Completion criteria: scripts executed without error; catalogue reads work anonymously;
commerce tables deny anonymous access; admin role gates writes. Phase 1 completes
only after execution + verification — files existing locally is not completion.

## Phase 2 — Admin UI foundation — Status: In Progress (milestone 1)

Objective: protected admin shell managing the Phase 1 schema.
- [x] Storefront moved to app/(storefront)/ (URLs unchanged); root layout slimmed
- [x] Supabase packages installed (@supabase/ssr + @supabase/supabase-js); .env.example
- [x] lib/supabase clients + trusted requireAdmin() (getUser + app_metadata)
- [x] /admin/login (public), /admin/unauthorized (public), protected (protected) group
- [x] Dashboard + products/collections skeleton routes (CRUD deferred)
- [x] Admin section skeletons: orders, payments, customers, complaints,
      subscribers (+ provisional reviews page, no table) with sidebar links
- [x] Phase A dashboard (mock data + KPIs + queue + top products + complaints;
      verified profitable-excluded math at runtime; Phase B live data pending)
- [ ] Manual: .env.local values, product-images bucket, provision admin + role SQL,
      sign out/in, verify gating live (anon → login, non-admin → unauthorized)
- [ ] Next milestone: collections/products CRUD incl. images (+ordering) and
      variants (size, colour, fulfilment, stock) management
Dependencies: Phase 1 executed. Completion: CRUD works against live schema with role checks.

## Phase 3 — Storefront database integration — Status: Not Started

Objective: dummy data replaced with live catalogue reads.
Tasks: collections/products/images/variants queries; catalogue filtering; newsletter
and complaint submissions via validated handlers.
Dependencies: Phases 1–2. Completion: shop renders from DB; subscriptions/complaints persist.

## Phase 4 — Cart and order creation — Status: Not Started

Objective: guest checkout producing snapshot-faithful orders.
Tasks: cart + checkout workflow; orders/items creation; secure order lookup; admin order needs.
Dependencies: Phases 1, 3. Completion: pending_payment orders with correct snapshots; lookup works.

## Phase 5 — Payments and transactional logic — Status: Not Started

Objective: Paystack money movement with safe confirmation.
Tasks: initialization + server verification; confirmation + inventory updates;
idempotency, shortages, reconciliation; refunds.
Dependencies: Phases 1, 4. Blocked on delivery decision (§17).
Completion: paid orders decremented exactly once; replays harmless; shortages surfaced.

## Phase 6 — Fulfilment, communication, hardening — Status: Not Started

Objective: production workflow, emails, and launch readiness.
Tasks: fulfilment transitions; transactional emails; order history actions;
security/error/deployment/E2E QA.
Dependencies: Phases 4–5. Completion: full QA pass on mobile/tablet/desktop.

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

- `sql/` root folder + manual Dashboard execution (overrides AGENTS.md §3 CLI workflow).
- Bag → Shop conversion: header bag icon is a Shop icon → `/shop`;
  `app/bag/` removed; Phase 5 "bag drawer/page" to be re-scoped as shop drawer/page.
- `sweetalert2` installed but UNUSED — first use deferred. Must be token-styled
  (`customClass`) to meet radius-0 / no-shadow rules when first used.
- Reviews table deferred (PROJECT.md §18 out-of-scope wins over earlier plan).
- `paid` order state replaced by payment/fulfilment split (`payments.status` +
  fulfilment-only `orders.status` incl. `awaiting_fulfilment`, `requires_attention`).

## Design review queue

- Home + Shop built from screenshots (no Stitch file in repo); About + Contact same
- Shop badge wording uses canonical §3.7 tokens; screenshot variants not implemented
