# Karanyé — Project Specification

**Status:** Architecture finalized · Design system defined · Homepage approved
**Last updated:** October 2026

This is the working specification for the Karanyé website: what we are building, how it looks, and how it works. `README.md` describes the project. `AGENT.md` holds the development agent's working rules. When anything conflicts, this file wins, except where it says something is open.

---

## 1. Vision

Karanyé is a Nigerian fashion label producing distinctive, thoughtfully crafted, made-to-order pieces. The website introduces the world of Karanyé before it asks anyone to buy.

> **North star:** A fashion house with an e-commerce system behind it, rather than an e-commerce store wearing a fashion aesthetic.

```text
The story → The designs → The details → The fit → The purchase → The relationship
```

Engineering priorities, in order:

1. Correctness
2. Security
3. Maintainability
4. Good UX
5. Visual fidelity to the Stitch design
6. Simplicity

The site should be production-capable without enterprise complexity, and understandable by one developer.

---

## 2. Brand

- **Wordmark:** KARANYÉ, a custom high-contrast display serif with a metallic silver treatment. The accent on the É is always retained.
- **Monogram:** an abstract K/Y mark in thin, continuous silver strokes, used subtly. A larger blind-embossed or debossed treatment may appear as a quiet texture, never as a dominant element.
- **Silver** lives in the brand assets (wordmark and monogram, delivered as SVG or image files), not in the UI colour palette. Platinum hairlines echo it in the interface.
- **References (priority order):** Karanyé's own identity → Hertunba (editorial direction, iconic presentation of pieces) → Imata Studio (restraint and polish) → other references. Desktop layouts are tighter than Hertunba's.
- **Visual source of truth:** the approved Google Stitch homepage. Every other page extends it.
- **Announcement bar copy:** "Made to order, thoughtfully crafted." and "Allow 5–7 days to process your orders."

---

## 3. Design system

**Name:** Karanyé Editorial Haute Couture.
**Style:** minimalist editorial luxury with architectural framing. Quiet confidence, intentional slowness, meticulous craft. Deep regal crimson balanced against raw alabaster and muted platinum, laid out with the discipline of an art monograph or high-fashion periodical.

The full Stitch export is preserved verbatim in **Appendix A**. This section defines the **canonical tokens** used in code. Where Stitch's auto-generated colour scheme and its written component specs disagree, the written specs win, because they describe the approved homepage. Resolutions are listed in §3.9.

### 3.1 Colour

| Token | Hex | Use |
|---|---|---|
| `crimson` | `#4A0E17` | Signature colour. Primary buttons, key brand statements, focus borders, selected states, made-to-order badges |
| `crimson-deep` | `#3B0A11` | Hover state for primary actions; deep editorial vignettes |
| `crimson-vibrant` | `#671624` | Form error borders and error text; sparing editorial accents |
| `ink` | `#1A1818` | Body text, headings, secondary buttons, checkbox borders |
| `muted` | `#615D5D` | Secondary text: metadata, specifications, floating labels, captions |
| `slate` | `#9CA3AF` | Decorative only: dividers, icons, disabled states. **Never used for text** on light surfaces (contrast ≈ 2.4:1) |
| `canvas` | `#FAF8F5` | Page background; text on crimson and ink |
| `linen` | `#F5F2EC` | Tonal cards, chips, layered surfaces |
| `platinum` | `#E5E7EB` | 1px structural borders: cards, drawers, navigation |
| `hairline` | `#D1D5DB` | 1px input borders and finer dividers |
| `white` | `#FFFFFF` | Rare. Checkmarks, image frames where needed |

The overlay wash is `rgba(26, 24, 24, 0.45)` with `backdrop-filter: blur(8px)`.

**Tailwind implementation** (Tailwind v4 `@theme`; if the project uses v3, map the same values into `tailwind.config`):

```css
@theme {
  --color-crimson: #4A0E17;
  --color-crimson-deep: #3B0A11;
  --color-crimson-vibrant: #671624;
  --color-ink: #1A1818;
  --color-muted: #615D5D;
  --color-slate: #9CA3AF;
  --color-canvas: #FAF8F5;
  --color-linen: #F5F2EC;
  --color-platinum: #E5E7EB;
  --color-hairline: #D1D5DB;
}
```

No other colours are used. The Material-generated tokens in Appendix A (`surface-container-*`, `tertiary`, `on-*`, etc.) are reference only and are not implemented.

### 3.2 Typography

Two families, both loaded through `next/font/google` (no extra packages), exposed as CSS variables and mapped into the Tailwind theme:

- **Bodoni Moda** (serif): editorial titles, narrative headlines, collection and product names, pull quotes. Never for body copy, forms or prices.
- **Hanken Grotesk** (sans): brand stories, body copy, specifications, prices, forms, shop and checkout, admin, labels.

| Style | Family | Desktop size / line | Mobile size / line | Weight | Tracking |
|---|---|---|---|---|---|
| `display-xl` | Bodoni Moda | 72 / 76px | 42 / 46px | 400 | −0.02em (mobile −0.01em) |
| `display-lg` | Bodoni Moda | 48 / 54px | 32 / 38px | 400 | −0.015em (mobile −0.01em) |
| `headline-lg` | Bodoni Moda | 32 / 40px | — | 400 | 0 |
| `headline-md` | Bodoni Moda | 24 / 32px | — | 500 | 0.01em |
| `headline-sm` | Bodoni Moda | 20 / 28px | — | 500 | 0.01em |
| `body-lg` | Hanken Grotesk | 18 / 30px | — | 300 | 0.01em |
| `body-md` | Hanken Grotesk | 15 / 24px | — | 400 | 0.01em |
| `body-sm` | Hanken Grotesk | 13 / 20px | — | 400 | 0.02em |
| `label-lg` | Hanken Grotesk | 12 / 16px | — | 500 | 0.15em |
| `label-md` | Hanken Grotesk | 11 / 14px | — | 500 | 0.18em |
| `label-sm` | Hanken Grotesk | 9 / 12px | — | 600 | 0.22em |

The display styles switch from mobile to desktop sizes at the `lg` breakpoint (1024px). Implement each style as a single Tailwind utility (e.g. `text-display-xl`) so components never hand-assemble font size, line height and tracking.

**Rules:**

- All labels, category tags, badges and buttons are **uppercase** with label tracking, like gallery labelling.
- `label-sm` (9px) is for decorative or redundant microcopy only. Anything a customer must read to complete a task (sizes, prices, form labels, errors, delivery info) uses `label-md` or larger.
- Body copy stays in `body-md` or `body-lg`. Never use `body-lg` weight 300 on a crimson or image background.

### 3.3 Layout and grid

| Breakpoint | Range | Columns | Outer margin | Gutter |
|---|---|---|---|---|
| Mobile | 320–767px | 4 | 20px (`margin-mobile`) | 16px (`gutter-mobile`) |
| Tablet (`md`) | 768–1023px | 8 | 32px | 24px |
| Desktop (`lg`) | 1024px+ | 12 | 64px (`margin`) | 32px (`gutter`) |

**Spacing scale:** `space-xs` 0.25rem · `space-sm` 0.5rem · `space-md` 1rem · `space-lg` 2rem · `space-xl` 3.5rem.

- Product pages use asymmetric spans on desktop: about 7 columns of garment photography beside 5 columns of narrative and purchase details.
- Full-bleed imagery may break the outer margins; text never does.
- **Section spacing:** `space-xl` (3.5rem) by default, scaling to a **maximum of 6rem** on desktop. This keeps the editorial breathing room while honouring the brief that desktop is more compact than Hertunba. Avoid stacking large empty bands.
- Maximum content width and exact homepage proportions are taken from the Stitch homepage code, not invented.

### 3.4 Elevation and depth

- **No drop shadows anywhere.** Hierarchy comes from tonal layering (`linen` cards on the `canvas` background) and 1px hairlines (`platinum`, `hairline`).
- Hairlines frame images, specification drawers, navigation bars and inputs.
- Overlays (drawers, shop drawer, mobile menu) use the obsidian wash `rgba(26, 24, 24, 0.45)` with `blur(8px)` behind a `canvas` panel.

### 3.5 Shape

- **Border radius is 0 on everything**: buttons, inputs, cards, modals, drawers, swatches, chips, checkboxes, size tiles, images. No rounded utilities are used anywhere in the codebase.
- Sharp edges evoke trimmed archival paper, pattern drafts and structured tailoring.

### 3.6 Motion

- Subtle and slow: short opacity fades, the editorial link underline expanding from the centre, drawer slides. Roughly 200–400ms with an ease-out curve.
- Product cards may fade to an alternate image on hover (desktop pointer devices only).
- All non-essential motion is disabled under `prefers-reduced-motion: reduce`.
- No parallax, scroll-jacking, bouncing or attention-seeking animation.

### 3.7 Components

**Buttons** (all 0 radius, uppercase `label-md`, 0.18em tracking)

| Variant | Spec | Karanyé use |
|---|---|---|
| Primary | `crimson` fill, `canvas` text, 52px height; hover → `crimson-deep` | Add to shop, Checkout, Pay, Join the Private List |
| Secondary ("Atelier") | Transparent, 1px `ink` border, `ink` text; hover fills `ink` with `canvas` text | Size guide, Made to Measure entry points, Send enquiry |
| Tertiary (editorial link) | Text only in `crimson` or `ink`, 1px underline expanding from centre on hover | "Discover Our Story", "View Design", in-copy links |

The homepage hero CTA ("Discover Our Story") follows whatever the approved Stitch homepage uses.

**Product and editorial cards**

- Frameless, or framed with a 1px `platinum` border. No background fills or shadows.
- Portrait imagery at 3:4 or 4:5 with `object-cover`. On hover, fade to the product's `back` or `detail` image if one exists.
- Product name in `headline-sm`. Price and lead time in `label-md`.
- Status chip where relevant (see below).

**Chips and badges**

- Rectangular, 0 radius, `linen` fill, 1px `platinum` border, `ink` text in `label-sm`, used only for decorative tags.
- Status badges map to product status and use `label-md`, since they carry purchase information:
  - `made_to_order` → "MADE TO ORDER", with a 1px `crimson` border and `crimson` text
  - `limited` → "LIMITED", with a 1px `crimson` border and `crimson` text
  - `sold_out` → "SOLD OUT", with a 1px `hairline` border and `muted` text

**Inputs and forms**

- Either an underline or a sharp rectangle with a 1px `hairline` border, used consistently per form.
- Floating uppercase labels in `label-md`, `muted` colour. (Stitch specifies `label-sm` in slate; see §3.9.)
- Focus: border changes to `crimson`. No glow rings, but a visible focus indicator must always be present for keyboard users.
- Error: border changes to `crimson-vibrant`, with a caption below in `body-sm` and `crimson-vibrant`. Errors are always stated in words, never by colour alone.

**Checkboxes and selectors**

- Checkboxes: 16×16px squares, 1px `ink` border; checked state is a `crimson` fill with a minimal white check.
- No circular radios. Size options, Standard vs Made to Measure, colour choices and delivery options are **rectangular tiles** that fill solid (`ink` or `crimson`) when selected. They are built as accessible radio groups underneath.

**Garment specification drawer**

- A side sheet sliding in from the right on desktop and from the bottom (near full height) on mobile.
- `canvas` surface, 1px `platinum` left border, `headline-md` Bodoni heading, overlay wash behind.
- Karanyé uses it for: **Made to Measure measurement entry** on the product page, and **quick size chart** access from the product page.

**shop drawer (mini-cart)**

- Uses the same drawer pattern. It opens after Add to shop, shows the items and a Checkout button, and links to the full `/shop` page.

**Navigation**

- Desktop: wordmark, primary navigation (Home, Shop, About, Size & Fit, Made to Measure, Contact), shop, Account (Order Lookup). 1px `platinum` bottom border.
- Mobile: hamburger menu in a full-height overlay panel, with shop and Account always visible in the header.
- **Mobile sticky commerce bar:** on the product page, a sticky bottom bar holds the price and the Add to shop / choose-size action. This is how Stitch's "sticky bottom navigation anchors commerce controls" is applied; site navigation itself stays in the header.

**Announcement bar**

- Slim, `label-md` uppercase, low visual weight. It must not compete with the hero.

### 3.8 Accessibility baseline

- Text contrast is at least 4.5:1 (3:1 for 24px+ display text). `slate` is never used for text.
- Every interactive element has a visible focus state.
- All images have meaningful alt text, stored with each product image.
- Drawers and the mobile menu trap focus, close on Escape, and return focus to the element that opened them.
- Tile selectors are real radio groups. Forms have associated labels.
- Tap targets are at least 44×44px on mobile.

### 3.9 Resolved conflicts in the Stitch export

| Conflict | Resolution |
|---|---|
| The token `primary` is `#2a0006`, but the written spec says primary is `#4A0E17` | `crimson` = `#4A0E17`, following the written spec and approved components |
| The token `secondary` is `#615d5d`, but the written spec says secondary is `#1A1818` | `ink` = `#1A1818` for text and secondary buttons; `#615D5D` kept as `muted` for secondary text |
| The token `tertiary` is `#091019`, but the written spec says tertiary is `#9CA3AF` | `slate` = `#9CA3AF`, decorative only |
| The token `surface` is `#fbf9f6`, but the written spec says neutral is `#FAF8F5` | `canvas` = `#FAF8F5` |
| Floating labels are specified as `label-sm` in `#9CA3AF`, which fails contrast and is too small to read | Floating labels use `label-md` in `muted` |
| Stitch mentions "bespoke appointment forms" | Out of scope. Karanyé has no appointment booking; enquiries go through Contact |
| "Expansive negative space" versus the brief's compact desktop | Section spacing is capped at 6rem (§3.3) |
| No silver token exists in the UI palette | Silver lives in the brand assets; platinum hairlines are the UI echo |

---

## 4. Finalized architecture decisions

| Area | Decision |
|---|---|
| Framework | Next.js (App Router), TypeScript, Tailwind CSS |
| Database | Supabase Postgres |
| Auth | Supabase Auth, used for admins only at launch |
| Storage | Supabase Storage for product image originals |
| Image delivery | Next.js `<Image>` optimization on Vercel |
| Payments | Paystack; payment confirmed only via verified webhook or server-side verify |
| Email | Resend |
| Hosting | Vercel Pro (the Hobby plan does not permit commercial use) |
| Checkout | Guest checkout only at launch |
| Customer accounts | Deferred. The account icon links to Order Lookup |
| Order tracking | Order Lookup by order reference + email |
| Inventory | Made to order by default; optional stock per size for limited pieces |
| Made to Measure | Integrated into purchasing; measurements stored on the order item |
| Admin | In-app at `/admin`: products, orders, private list |
| Search | Postgres queries (`ilike`, upgrading to full-text search only if needed) |
| API client | Axios for browser → own route handlers; `supabase-js` for database access |
| Validation | `zod` |
| Keep-alive | GitHub Actions query every 3 days (prevents the Supabase Free inactivity pause) |
| Backups | GitHub Actions weekly `pg_dump` (Supabase Free includes no backups) |
| Schema management | Supabase CLI migrations in `supabase/migrations/` |
| Money | Integers in kobo everywhere; NGN only |

**Upgrade path:** move Supabase to the Pro plan once orders justify it. That removes the inactivity pause and adds managed backups. The keep-alive workflow can then be retired.

---

## 5. System overview

```text
                    ┌──────────────────────────────┐
   Customer ──────► │  Vercel · Next.js            │
   Admin    ──────► │  Pages · Server Components   │
                    │  Route Handlers (/api/*)     │
                    └──┬───────────┬───────────┬───┘
                       │           │           │
                       ▼           ▼           ▼
              ┌──────────────┐ ┌────────┐ ┌────────┐
              │  Supabase    │ │Paystack│ │ Resend │
              │  Postgres    │ │        │ │        │
              │  Auth        │ └───┬────┘ └────────┘
              │  Storage     │     │ webhook
              └──────────────┘ ◄───┘ (/api/paystack/webhook)

   GitHub Actions ──► keep-alive query (every 3 days) + pg_dump backup (weekly)
```

There is no separate backend server. Next.js provides the UI, Server Components, route handlers, payment logic and database access.

**Region:** Supabase and Vercel functions must run in the same region. A European region (e.g. London) is the expected pairing for customers in Nigeria. Confirm this at project setup.

---

## 6. Security model

### Keys

| Key | Where it may be used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server; access limited by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only (route handlers, server-only modules); bypasses RLS |
| `PAYSTACK_SECRET_KEY` | Server only |
| `RESEND_API_KEY` | Server only |

### Roles

- **Public (anon):** may read products whose status is not `draft` or `archived`, plus their images and sizes. Nothing else.
- **Customers:** never write to the database directly. All customer writes go through validated route handlers using the service role.
- **Admins:** Supabase Auth users with `role: "admin"` in `app_metadata`, which is set server-side only. RLS admin policies check `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`. `/admin` routes also verify the role on the server.

### Rules

- RLS is enabled on every table, with no exceptions.
- Prices, totals, stock and order status are computed and checked on the server.
- Route handler input is validated with `zod`.
- Public forms (waitlist, contact, order lookup, checkout) use a honeypot field plus server validation. No extra rate-limiting infrastructure at launch.

---

## 7. Data model

Postgres tables, created through migrations. All money columns are integers in kobo. All tables have `created_at`; mutable tables also have `updated_at`.

### Enums

```text
product_fit:    fitted | relaxed | oversized | structured
product_status: draft | made_to_order | limited | sold_out | archived
image_role:     front | back | side | detail | fabric
sizing_type:    standard | made_to_measure
order_status:   pending_payment | paid | in_production | ready
                | shipped | delivered | cancelled
```

### Tables

```text
products
  id                    uuid pk
  name                  text
  slug                  text unique
  description           text
  price_kobo            integer
  fabric_composition    text
  care_instructions     text
  fit                   product_fit
  colours               text[]
  status                product_status   default 'draft'
  production_time_days  integer
  mtm_available         boolean          default false
  mtm_surcharge_kobo    integer          default 0
  mtm_extra_fields      jsonb            -- garment-specific measurement fields
  model_info            jsonb            -- { height, measurements, size_worn }

product_images
  id            uuid pk
  product_id    uuid → products (on delete cascade)
  storage_path  text
  alt           text
  role          image_role
  sort_order    integer

product_sizes
  id          uuid pk
  product_id  uuid → products (on delete cascade)
  label       text
  sort_order  integer
  stock       integer null   -- NULL = made to order (unlimited)
                             -- number = limited; decremented when paid

orders
  id                 uuid pk
  reference          text unique   -- e.g. KRN-XXXXXX; also the Paystack reference
  email              text
  full_name          text
  phone              text
  delivery_address   text
  delivery_city      text
  delivery_state     text
  delivery_country   text
  subtotal_kobo      integer
  delivery_fee_kobo  integer
  total_kobo         integer
  currency           text default 'NGN'
  status             order_status default 'pending_payment'
  paid_at            timestamptz null

order_items
  id               uuid pk
  order_id         uuid → orders (on delete cascade)
  product_id       uuid → products (on delete set null)
  product_name     text      -- snapshot at purchase
  unit_price_kobo  integer   -- snapshot at purchase, includes MTM surcharge
  colour           text
  quantity         integer
  sizing_type      sizing_type
  size_label       text null    -- standard only
  measurements     jsonb null   -- made_to_measure only

order_status_history
  id          uuid pk
  order_id    uuid → orders (on delete cascade)
  status      order_status
  note        text null
  changed_by  uuid null   -- admin user id; null for system changes

waitlist_subscribers
  id     uuid pk
  name   text
  email  text unique

keepalive
  id     integer pk   -- single row; public select only (used by the keep-alive workflow)
```

Contact form submissions are emailed through Resend and not stored at launch.

### Inventory rules

- `made_to_order`: all listed sizes are purchasable, and `stock` is NULL.
- `limited`: sizes with a `stock` number are purchasable while stock > 0. Stock is decremented only when an order is marked paid.
- `sold_out`: visible but not purchasable.
- `draft` and `archived`: not publicly visible.

### Database function: `mark_order_paid(reference, amount_kobo)`

This function can be executed by the service role only. In one transaction, it:

1. Locks the order row.
2. Confirms the status is `pending_payment` and the amount matches `total_kobo`.
3. Sets `status = 'paid'` and `paid_at = now()`.
4. Decrements stock for limited sizes.
5. Writes an `order_status_history` row.
6. Returns whether the order changed.

A second call for the same order changes nothing, which makes payment confirmation idempotent.

### Storage

- Bucket `product-images`: public read; write and delete for admins only.

---

## 8. Pages and routes

### Storefront

| Route | Page | Rendering |
|---|---|---|
| `/` | Home | Static, revalidated |
| `/shop` | Shop (search, filter and sort via search params) | Dynamic on params, cached |
| `/products/[slug]` | Design detail | Static, revalidated on admin save |
| `/about` | About | Static |
| `/size-fit` | Size & Fit | Static |
| `/made-to-measure` | Made to Measure | Static |
| `/contact` | Contact | Static page + API |
| `/shop` | Shopping shop (full page; the shop drawer is also available site-wide) | Client |
| `/checkout` | Checkout | Dynamic |
| `/checkout/complete` | Payment result | Dynamic |
| `/orders/lookup` | Order Lookup (reference + email) | Dynamic |

### Admin

| Route | Purpose |
|---|---|
| `/admin/login` | Supabase Auth sign-in |
| `/admin/products` | List, create, edit and archive products; manage images, alt text, sizes and stock |
| `/admin/orders` | Filter by status, view detail including measurements, update status |
| `/admin/waitlist` | View subscribers, export CSV |

The admin area is plain and functional but uses the same tokens, type and zero-radius rules.

### API route handlers

| Route | Purpose |
|---|---|
| `POST /api/checkout` | Validate the shop, recompute totals, create the order, initialize Paystack |
| `POST /api/paystack/webhook` | Verify the signature, call `mark_order_paid`, send emails |
| `POST /api/waitlist` | Add a subscriber, send the welcome email |
| `POST /api/contact` | Send the enquiry email to Karanyé |
| `POST /api/orders/lookup` | Return order status if reference + email match |
| `GET /api/health` | Cheap database query, for uptime monitoring |

Admin mutations may use route handlers or Server Actions. Either way, the admin role is checked on the server.

---

## 9. Page requirements

### Home

Announcement bar · navigation · editorial hero (image or short video) with "Discover Our Story" as the primary CTA, deliberately not "Shop Now" · "The Latest Designs" or "The Karanyé Edits" (image, name, price, status, View Design) · Standard Size and Made to Measure introduction (no forms) · Private List invitation (name and email) · footer.

### Shop

Search; filters for size, colour and price; sorting by newest, price and availability. Image-led and editorial, never a dense marketplace grid. On mobile, filters open in a drawer.

### Design detail

- **Images:** front, back, side, detail and fabric texture, in roughly 7 columns on desktop and a swipeable gallery on mobile.
- **Information:** name (Bodoni), price, status badge, description, fabric composition, care instructions, fit.
- **Model:** height, measurements, size worn.
- **Production:** production time and delivery information.
- **Purchase:** tile selector for **Standard Size** or **Made to Measure** (only when `mtm_available`, with the surcharge shown). Standard shows the size tiles plus a size chart drawer. Made to Measure opens the specification drawer for measurements. Colour tiles appear where applicable, then Add to shop, which opens the shop drawer.
- **Mobile:** a sticky bottom commerce bar.

### About

Editorial storytelling (image, short narrative, typography, image, brand statement, craft and production philosophy). No mission, vision or value card grids.

### Size & Fit

Standard sizing explanation, body measurement chart (usable on mobile, either scrolling horizontally inside its own container or transposed), how to measure, fit descriptions, guidance between sizes, and an introduction to Made to Measure. Editorial in feel, never like technical documentation.

### Made to Measure

The four steps (01 Choose Your Design · 02 Share Your Measurements · 03 We Create Your Piece · 04 Your Karanyé Piece). It links to designs that offer Made to Measure and is not a configurator.

### Contact

Contact details (to be supplied) and a form with name, email, enquiry type (General, Order, Size & Fit, Made to Measure, Other) and message.

---

## 10. Purchase flow

```text
1. Product page
   Choose Standard (size) or Made to Measure (measurements) → Add to shop → shop drawer

2. shop (browser localStorage)
   Stores product id, colour, sizing type, size or measurements, and quantity.
   Prices shown are display-only.

3. Checkout
   Contact details + delivery address → delivery fee (OPEN, see §17)

4. POST /api/checkout
   • Validate input with zod
   • Re-fetch products, sizes, prices and statuses from the database
   • Reject archived, draft, sold-out or out-of-stock items, and invalid measurements
   • Compute subtotal, delivery fee and total on the server
   • Generate a unique reference; insert the order (pending_payment) and order_items
   • Initialize the Paystack transaction with the server-computed amount (kobo),
     the reference and the callback URL
   • Return the authorization URL → redirect

5. Customer pays on Paystack

6. POST /api/paystack/webhook   (source of truth)
   • Read the raw body; verify x-paystack-signature (HMAC-SHA512, secret key)
   • Handle charge.success only
   • Call mark_order_paid(reference, amount)
   • If the order changed: send the customer confirmation and the Karanyé
     new-order notification. If not: it's a duplicate event, so do nothing.
   • Return 200

7. /checkout/complete?reference=…
   • Read and display the order's status
   • If it's still pending_payment: call Paystack's verify endpoint on the server and,
     on success, call the same mark_order_paid function (covers delayed webhooks)
   • The page never marks an order paid by any other route
   • Clear the shop once the order is confirmed paid
```

Abandoned `pending_payment` orders are harmless and can be cancelled from the admin.

---

## 11. Order lifecycle and emails

```text
pending_payment ──► paid ──► in_production ──► ready ──► shipped ──► delivered
       │
       └──► cancelled
```

| Event | Email |
|---|---|
| Order paid | Customer: order and payment confirmation (including measurements for MTM items). Karanyé: new-order notification |
| `in_production`, `ready`, `shipped`, `delivered`, `cancelled` | Customer: status update |
| Waitlist signup | Subscriber: private list welcome |
| Contact form | Karanyé: the enquiry, with reply-to set to the customer |

Every status change is recorded in `order_status_history`. Emails use the brand's typography and palette within the limits of email clients, with simple, sharp-edged layouts.

---

## 12. Made to Measure

- Enabled per product (`mtm_available`), with an optional surcharge (`mtm_surcharge_kobo`).
- Core measurement fields apply to all MTM items (the final list is OPEN, see §17). Garment-specific fields are defined per product in `mtm_extra_fields`.
- Entered in the garment specification drawer, validated on the server, and stored as a snapshot on the order item.
- Unusual or custom requests go through Contact (the "Made to Measure" enquiry type).

---

## 13. Shop, search and filtering

- Search, size, colour and price filters, and sorting (newest, price, availability) are all expressed as URL search params, so filtered views are shareable and work with the back button.
- Queries run in Postgres, starting with `ilike` on name and description and moving to full-text search only if needed.

---

## 14. Rendering and performance

- Statically render content and product pages; call `revalidatePath` when an admin saves product data.
- Use Next.js `<Image>` with accurate `sizes` for all imagery, serving portrait ratios (3:4 or 4:5) consistently.
- Load fonts through `next/font` with `display: swap`.
- Load the shop from localStorage on the client only.
- Use Server Components by default and keep client JavaScript small.

---

## 15. Intended project structure

This is a guide. Create directories only when they are needed.

```text
.github/workflows/
  supabase-keepalive.yml
  supabase-backup.yml
design/                 Stitch exports (HTML, screenshots) used as visual reference
supabase/
  migrations/
src/
  app/
    (storefront)/  page.tsx, shop/, products/[slug]/, about/, size-fit/,
                   made-to-measure/, contact/, shop/, checkout/, orders/lookup/
    admin/         login/, products/, orders/, waitlist/
    api/           checkout/, paystack/webhook/, waitlist/, contact/,
                   orders/lookup/, health/
    globals.css    Tailwind theme tokens (§3)
  components/      layout/, navigation/, products/, checkout/, forms/, ui/
  lib/
    supabase/      client.ts, server.ts, admin.ts (server-only)
    paystack/
    resend/
    money.ts       kobo ↔ Naira formatting
    validation/    zod schemas
  types/           generated database types
```

---

## 16. Build phases

Work through these in order, with review at the end of each phase.

| Phase | Scope |
|---|---|
| **0. Setup** | Next.js + TS + Tailwind project, Supabase project and CLI, environment variables, Supabase clients, region confirmed |
| **1. Design system and shell** | Theme tokens and type utilities (§3), fonts, base primitives (buttons, inputs, tiles, chips, drawer), announcement bar, navigation (desktop and mobile), footer, homepage implemented from Stitch |
| **2. Catalogue** | Product schema and migrations, RLS, storage bucket, Shop page, Design detail page (seeded data), size chart and specification drawers |
| **3. Admin: products** | Admin auth and role checks, product CRUD, image upload with alt text, sizes and stock, revalidation |
| **4. Content pages** | About, Size & Fit, Made to Measure, Contact + API, Private List + API |
| **5. shop and checkout** | shop drawer and page, checkout, `/api/checkout`, Paystack initialize, webhook, `mark_order_paid`, completion page, emails. **Blocked until delivery is decided (§17)** |
| **6. Admin: orders** | Orders list and detail, status updates with emails, waitlist view and CSV export, Order Lookup |
| **7. Operations and launch** | Keep-alive and backup workflows, uptime monitor, live keys, accessibility pass, full QA on mobile, tablet and desktop |

---

## 17. Open decisions

Do not implement anything below until it is resolved.

| Item | What's needed | Blocks |
|---|---|---|
| **Delivery and shipping** | Where Karanyé ships (Nigeria only or international) and how fees are set (flat or zone-based) | Checkout design, `/api/checkout` fee logic, order delivery fields |
| **Made to Measure core fields** | Final list of required measurements and units | MTM drawer, validation schema |
| **MTM cancellation and refund policy** | Policy wording, shown at checkout | Checkout, confirmation emails |
| **Contact details** | Email, phone/WhatsApp, social links | Contact page, footer, emails |
| **Size chart data** | Standard sizes and body measurements | Size & Fit page, size selectors |
| **Product detail design** | Stitch design for the product page | Phase 2 UI |
| **Checkout design** | Stitch design for the shop and checkout | Phase 5 UI |
| **Brand assets** | Wordmark and monogram files (SVG preferred) | Navigation, footer, favicon, emails |

---

## 18. Out of scope for launch

Customer accounts and login, saved addresses, wishlists/favourites, reviews, discount codes, multi-currency, appointment booking, a CMS, external search services, analytics beyond Vercel's built-in tools, and any separate backend service. These can be revisited after launch.

---

## Appendix A — Stitch design system export (verbatim reference)

This is preserved exactly as exported from Google Stitch. Canonical implementation values are in §3. Where they differ, §3 wins (see §3.9).

```yaml
---
name: Karanyé Editorial Haute Couture
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#544343'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#867273'
  outline-variant: '#d9c1c1'
  surface-tint: '#93474d'
  primary: '#2a0006'
  on-primary: '#ffffff'
  primary-container: '#4a0e17'
  on-primary-container: '#ca7379'
  inverse-primary: '#ffb3b6'
  secondary: '#615d5d'
  on-secondary: '#ffffff'
  secondary-container: '#e7e1e1'
  on-secondary-container: '#676363'
  tertiary: '#091019'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e252e'
  on-tertiary-container: '#858c98'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdada'
  primary-fixed-dim: '#ffb3b6'
  on-primary-fixed: '#3d040e'
  on-primary-fixed-variant: '#763037'
  secondary-fixed: '#e7e1e1'
  secondary-fixed-dim: '#cbc5c5'
  on-secondary-fixed: '#1d1b1b'
  on-secondary-fixed-variant: '#494646'
  tertiary-fixed: '#dce3f0'
  tertiary-fixed-dim: '#c0c7d3'
  on-tertiary-fixed: '#151c25'
  on-tertiary-fixed-variant: '#404752'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
  crimson-deep: '#3B0A11'
  crimson-vibrant: '#671624'
  linen-tint: '#F5F2EC'
  border-platinum: '#E5E7EB'
  slate-hairline: '#D1D5DB'
typography:
  display-xl:
    fontFamily: Bodoni Moda
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 76px
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Bodoni Moda
    fontSize: 42px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: -0.01em
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 54px
    letterSpacing: -0.015em
  display-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0em
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Bodoni Moda
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 30px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.15em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.18em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 9px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.22em
spacing:
  gutter: 2rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 3.5rem
---
```

### Brand & Style

This design system establishes a quiet luxury aesthetic for high-end, made-to-order contemporary African fashion. Merging architectural precision with artisanal heritage, the aesthetic moves away from standard commercial tropes toward high-fashion editorial publication standards.

The visual style embodies **Minimalist Editorial Luxury with Architectural Framing**:
- **Purity and Cadence:** Expansive warm-tinted negative space, disciplined asymmetrical visual tension, and strict grid alignments reminiscent of collectible art monographs and high-end fashion periodicals.
- **African Haute Couture Sensibility:** Deep, regal crimson and wine undertones balanced by raw alabaster backgrounds and muted platinum accents, reflecting tactile couture fabrics and modern structural tailoring.
- **Emotional Resonance:** Quiet confidence, exclusivity, intentional slowness, and meticulous bespoke craftsmanship.

### Colors

The palette is tuned around tactile, physical haute couture textiles and archival book stocks:
- **Primary (`#4A0E17`):** The signature royal crimson. Reserved for high-impact brand statements, prominent action states, and key editorial focal points.
- **Secondary (`#1A1818`):** Deep charcoal/near-black, delivering rich readability without the harsh, digital glare of true `#000000`.
- **Tertiary (`#9CA3AF`):** Muted cool slate. Acts as structural punctuation for metadata, product specifications, and quiet architectural dividers.
- **Neutral (`#FAF8F5`):** Warm, unbleached silk and textured cotton rag off-white, providing an organic canvas for rich photography.
- **Named Accents:** `crimson-deep` and `crimson-vibrant` provide interactive depth and gradient illumination across focused editorial vignettes; `linen-tint` forms layered background tonal cards; `border-platinum` and `slate-hairline` establish 1px structural framing.

### Typography

The typographical pairing creates an interplay between dramatic, high-contrast serif fashion editorial and modern, utilitarian geometric sans-serif:
- **Bodoni Moda** delivers classic couture gravitas. Used exclusively for editorial titles, narrative headlines, collection identities, and quotation pulls.
- **Hanken Grotesk** serves as the utilitarian balance. Highly legible with geometric clarity, it is deployed across long-form brand stories, specifications, dimensions, cart structures, and metadata labels.
- **Labels & Microcopy:** All labels, category tags, and action buttons use uppercase tracking (`0.15em` to `0.22em`) to evoke curated gallery labeling.

### Layout & Spacing

The layout is structured around an editorial 12-column grid system with generous horizontal margins that frame full-bleed atelier imagery:
- **Desktop (1024px+):** 12-column layout with 64px (`margin`) outer offsets and 32px (`gutter`) alleys. Product galleries lean into asymmetrical multi-column spans (e.g., 7-column primary garment photography flanked by 5-column bespoke narrative details).
- **Tablet (768px - 1023px):** 8-column layout with 32px margins and 24px gutters.
- **Mobile (320px - 767px):** 4-column layout with 20px (`margin-mobile`) outer margins and 16px (`gutter-mobile`) gutters. Sticky bottom navigation anchors commerce controls.
- **Editorial Pacing:** Vertical pacing relies on expansive section separators (`space-xl` scaled dynamically up to `6rem`) to let high-resolution fabric textures, drape details, and silhouette studies breathe.

### Elevation & Depth

This design system avoids simulated skeuomorphic dropshadows, relying instead on **Archival Flat Tonal Layering and Hairline Structural Framing**:
- **Layering:** Hierarchy is generated by layering `#FAF8F5` base surfaces with subtle `#F5F2EC` surface cards.
- **Hairlines:** Thin 1px solid dividers (`#E5E7EB` and `#D1D5DB`) draw precise architectural silhouettes around image frames, specification drawers, and navigation bars.
- **Overlays & Modals:** Slide-out made-to-order sizing panels, bespoke appointment forms, and mini-carts utilize an optical blur (`backdrop-filter: blur(8px)`) combined with a sheer crimson-tinted obsidian wash (`rgba(26, 24, 24, 0.45)`), keeping spatial continuity without abrupt visual breaks.

### Shapes

The design system maintains strict architectural, razor-sharp edges (`roundedness: 0`):
- **Zero Radius:** All primary components—including buttons, input containers, product cards, dialogue modals, and swatch selectors—feature clean, non-rounded geometries (`border-radius: 0px`).
- **Architectural Rationale:** The sharp geometries evoke trimmed archival paper, high-fashion pattern drafts, and structured bespoke tailoring, preserving a deliberate, unyielding haute-couture presence.

### Components

#### Buttons
- **Primary:** Full `#4A0E17` background, text in crisp `#FAF8F5`, 0px border radius, 52px height. Uppercase `label-md` typography with `0.18em` tracking. Subtle hover transition to `#3B0A11`.
- **Secondary / Atelier Inquire:** Transparent background, 1px solid `#1A1818` stroke, `#1A1818` text. Hover fills completely to `#1A1818` with `#FAF8F5` text.
- **Tertiary / Editorial Link:** Text-only in `#4A0E17` or `#1A1818`, bordered by an animated 1px underline that expands smoothly from center on hover.

#### Product & Editorial Cards
- Frameless or enclosed with a 1px `#E5E7EB` structural border.
- Imagery utilizes a 3:4 or 4:5 portrait ratio with full object-cover centering. Hover interactions trigger an understated fade to alternate silhouette angles or textile close-ups.
- Product titles utilize `headline-sm`, and pricing or made-to-order lead times are rendered in `label-md` tracking.

#### Input Fields & Bespoke Forms
- Minimalist architectural underlines or sharp rectangular inputs with 1px `#D1D5DB` borders.
- Floating uppercase labels in `label-sm` (`#9CA3AF`). Focus state transitions border cleanly to `#4A0E17` without outer glow rings.
- Error states transition the border to `#671624` with discreet caption notes positioned below the baseline.

#### Chips & Material Badges
- Flat, rectangular tag elements with zero border radius.
- `#F5F2EC` fill with 1px `#E5E7EB` stroke and `#1A1818` text in `label-sm`.
- Made-to-Order and Limited Edition indicators carry a muted `#4A0E17` hairline border with matching typography.

#### Checkboxes & Radio Selectors
- Sharp, square check elements (16px x 16px) with 1px solid `#1A1818` borders.
- Active checkbox is filled in `#4A0E17` with a minimal geometric white checkmark.
- Radio buttons for sizing and made-to-order bespoke measurements are rendered as rectangular tiled selectors rather than circular discs, filling solid on selection.

#### Custom Garment Specification Drawer
- A sliding side-sheet for tailored fit measurements and artisan notes.
- Elevated through an unbleached `#FAF8F5` surface, framed by a left-hand 1px `#E5E7EB` divider and anchored with `headline-md` Bodoni headings.