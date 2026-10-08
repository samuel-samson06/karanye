# KARANYÉ

**Made to order, thoughtfully crafted.**

Karanyé is a Nigerian fashion label creating distinctive, made-to-order contemporary pieces. This repository holds the Karanyé website: an editorial home for the brand and the commerce system that sits quietly behind it.

> **A fashion house with an e-commerce system behind it, rather than an e-commerce store wearing a fashion aesthetic.**

---

## About the website

Most fashion stores open with a product grid. Karanyé opens with a world.

The website introduces the brand before it asks anyone to buy. A visitor should first understand **who Karanyé is**, then **what Karanyé creates**, then **which piece they want**, and only then **how to make it theirs**.

```text
The story → The designs → The details → The fit → The purchase → The relationship
```

Every piece is presented as a design rather than an inventory item. Each one is made to order, and many can be made to the customer's own measurements.

---

## The experience

| Page | Purpose |
|---|---|
| **Home** | The first introduction to Karanyé: editorial imagery, the latest designs, the two ways to buy (Standard Size and Made to Measure), and an invitation to the private list |
| **Shop** | The full collection, with search, filters and sorting, presented editorially rather than as a marketplace |
| **Design detail** | Each piece in depth: imagery from every angle, fabric, fit, care, model details, production time, and the choice between a standard size and made to measure |
| **About** | The story behind the label: its origin, philosophy, craft and vision |
| **Size & Fit** | The body measurement chart, how to measure, fit descriptions and guidance between sizes |
| **Made to Measure** | Karanyé's personalised service, in four steps from choosing a design to receiving the finished piece |
| **Contact** | A direct line to the atelier |
| **Shop & Checkout** | A simple guest checkout, with payment through Paystack |
| **Order Lookup** | Customers check an order's status with their order reference and email |

Behind the storefront, a private admin lets Karanyé manage designs, images, sizes and availability, process orders through production to delivery, and view the private list.

---

## How Karanyé sells

- **Made to order.** Pieces are produced after purchase. Customers are told to allow 5–7 days for processing. Limited pieces can carry a stock count per size.
- **Two ways to buy.** **Standard Size** uses Karanyé's body measurement chart. **Made to Measure**, where a design offers it, lets the customer submit their own measurements, which travel with the paid order to the atelier.
- **Guest checkout.** No account is needed to buy. Customers receive email updates as their piece moves through production, and can look up their order at any time.
- **Secure payment.** Payments run through Paystack and are confirmed server-side before any order is treated as paid.

---

## Brand at a glance

| | |
|---|---|
| **Wordmark** | KARANYÉ: a custom high-contrast display serif with a metallic silver treatment |
| **Monogram** | An abstract K/Y mark in thin, continuous silver strokes |
| **Palette** | Royal crimson `#4A0E17`, near-black ink `#1A1818`, unbleached off-white `#FAF8F5`, linen `#F5F2EC`, platinum hairlines |
| **Typography** | Bodoni Moda (editorial headlines) and Hanken Grotesk (body, specifications, labels) |
| **Character** | Quiet luxury, editorial restraint, sharp architectural edges, no drop shadows |
| **References** | Karanyé's own identity first, then Hertunba (editorial direction) and Imata Studio (restraint and polish) |

The full design system lives in [`PROJECT.md`](./PROJECT.md#3-design-system).

---

## Built with

| | |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database, Auth, Storage | Supabase |
| Payments | Paystack |
| Email | Resend |
| Hosting | Vercel |
| Design | Google Stitch |

---

## Project status

| Area | Status |
|---|---|
| Brand direction | Established |
| Homepage design | Approved (visual source of truth) |
| Design system | Exported from Stitch, canonical tokens defined |
| Shop, About, Size & Fit, Made to Measure, Contact | Design direction prepared |
| Product detail and checkout designs | In progress |
| Architecture | Finalized |
| Development | Not started (Phase 0 next) |

---

## Repository documents

| File | What it's for |
|---|---|
| `README.md` | This file: what Karanyé and the website are |
| [`PROJECT.md`](./PROJECT.md) | The working specification: design system, architecture, data model, flows, build phases and open decisions |
| [`AGENT.md`](./AGENT.md) | Working rules for the AI development agent |

---

## Getting started

*Commands and scripts are finalized during Phase 0.*

**Prerequisites:** Node.js (LTS), the Supabase CLI, and access to the Karanyé Supabase project, Paystack account (test keys) and Resend account.

**Environment variables** (in `.env.local`, never committed):

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only
PAYSTACK_SECRET_KEY=              # server only; test key outside production
RESEND_API_KEY=                   # server only
NEXT_PUBLIC_SITE_URL=
```

```bash
npm install
npm run dev
```

---

© Karanyé. All rights reserved.# karanye
