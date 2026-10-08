# Karanyé — Development Agent Rules

You are the development agent for **Karanyé**, a Nigerian fashion label's website. This is a solo-developed project with deliberate, already-agreed decisions. Your job is to implement them faithfully, not to redesign or re-architect them.

## Read order

1. **`AGENT.md`** (this file): how you work.
2. **`README.md`**: what Karanyé and the website are.
3. **`PROJECT.md`**, in full: the source of truth for the design system, architecture, data model, flows, build phases and open decisions.
4. **`design/`**: the Stitch exports. The homepage is the visual source of truth.

If these documents conflict, or something you need isn't covered, **stop and ask**. Do not guess.

---

## 1. The standard

> A fashion house with an e-commerce system behind it, not an e-commerce store wearing a fashion aesthetic.

Every screen should feel editorial, restrained and intentional. The commerce underneath must be correct, secure and simple. When choosing between clever and clear, choose clear.

---

## 2. Stack — do not change

| Concern | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database, Auth, Storage | Supabase |
| Payments | Paystack |
| Email | Resend |
| Hosting | Vercel |
| Browser → own API calls | Axios |
| Validation | zod |

### Approved dependencies

- `next`, `react`, `react-dom`, `typescript`, `tailwindcss` and their standard tooling
- `@supabase/supabase-js`, `@supabase/ssr`
- `axios`
- `resend`
- `zod`

Fonts load through `next/font/google`, which needs no extra package.

**Any other dependency requires approval first.** Explain what it is, why the existing stack can't do the job, and its size and maintenance cost. Specifically, do not add: UI component libraries (shadcn/ui, MUI, Chakra, Radix, Headless UI, etc.), animation libraries, icon packs beyond a few inline SVGs, state-management libraries, ORMs, separate backend frameworks, search services, queues, or analytics SDKs.

---

## 3. Architecture rules

- There is no separate backend server, and no microservices, queues or event systems. Next.js route handlers, Server Actions and Server Components are the backend.
- All schema changes go through Supabase CLI migrations in `supabase/migrations/`. Never change the schema only in the dashboard.
- Generate database types from the schema with the Supabase CLI. Do not hand-write duplicate types.
- Create directories and files only when they are needed. The structure in `PROJECT.md` is a guide, not a scaffold to generate up front.
- Do not rewrite working code or delete existing work without a stated reason and approval.
- Anything listed under **Open decisions** in `PROJECT.md` must not be implemented until it is resolved. Use placeholders instead.

---

## 4. Security rules

- The **service role key** is used only on the server. It must never be imported into a client component or exposed through a `NEXT_PUBLIC_` variable. Mark the admin Supabase client module as server-only.
- Customers never write to the database directly. Every customer write goes through a validated route handler.
- **Never trust prices, totals, stock or status sent from the browser.** The server recomputes everything from the database.
- **Never mark an order paid from the frontend.** Only the verified Paystack webhook, or the server-side verify fallback on the completion page, may do it, and only through the `mark_order_paid` database function.
- Verify the Paystack webhook signature against the **raw** request body before parsing or acting on it.
- RLS is enabled on every table. A table without RLS policies is a bug.
- Validate all route handler input with `zod`, and reject unknown or malformed fields.
- Check the admin role on the server for every `/admin` page and every admin mutation.

### Money

All money is stored and computed as **integers in kobo**. Convert to Naira only for display, through the single helper in `src/lib/money.ts`.

### Content

Do not invent contact details, delivery fees, policies, measurements, sizes, product copy, model details or brand claims. Use clearly marked placeholders such as `TODO(content): delivery fee copy` and list them in your report.

---

## 5. Design rules

The design system is defined in **`PROJECT.md` §3**. The Stitch export in its Appendix A is reference only. Where they differ, §3 wins.

### Tokens

- Use **only** the canonical colour tokens: `crimson`, `crimson-deep`, `crimson-vibrant`, `ink`, `muted`, `slate`, `canvas`, `linen`, `platinum`, `hairline` (and `white` where specified). No raw hex values in components, no Tailwind default palette colours (`gray-500`, `red-600`, etc.), and no Material tokens from the Stitch export.
- Use the named typography utilities (`text-display-xl`, `text-headline-sm`, `text-body-md`, `text-label-md`, …). Never hand-assemble font size, line height and tracking in a component.
- Use the spacing, margin and gutter values from §3.3.

### Hard rules

- **Border radius is 0 everywhere.** No `rounded-*` classes.
- **No shadows.** Depth comes from `linen` layering and 1px `platinum`/`hairline` borders.
- **No gradients** in the UI.
- **`slate` is never used for text.** Secondary text uses `muted`.
- **Bodoni Moda** is for headlines, product names and pull quotes only. Everything else is **Hanken Grotesk**.
- Labels, tags, badges and buttons are uppercase with label tracking.
- `label-sm` (9px) is for decorative microcopy only. Anything a customer must read uses `label-md` or larger.
- Selectors (size, Standard/Made to Measure, colour, delivery) are rectangular tiles built as accessible radio groups. No circular radios.
- Section spacing tops out at 6rem on desktop. Keep desktop compact and avoid large empty bands.
- Motion is subtle (fades, centre-out underline, drawer slides, roughly 200–400ms) and disabled under `prefers-reduced-motion`.

### Fidelity

- Match the **Stitch homepage** for composition, proportions, navigation, image treatment and pacing. Every other page must look like it belongs to the same site.
- When a page has no Stitch design yet (product detail, checkout), build it from the §3 components and patterns, then flag it for design review. Don't invent a new visual language.
- Avoid: generic rounded cards, SaaS-style storefront UI, oversized buttons, dense marketplace grids, Shopify-style templates, decorative effects.

### Responsive and accessible

- Design for mobile, tablet and desktop separately (4 / 8 / 12 columns). Mobile is not a shrunken desktop.
- On mobile: hamburger navigation,  and Account always visible in the header, a sticky commerce bar on the product page, filters in a drawer, measurement tables usable without breaking the layout.
- Text contrast is at least 4.5:1, every interactive element has a visible focus state, every image has alt text, drawers trap focus and close on Escape, and tap targets are at least 44×44px.
- The admin area may be plain, but it uses the same tokens, fonts and zero-radius rules.

---

## 6. How to work

1. **Work one phase at a time**, following **Build phases** in `PROJECT.md`. Do not start the next phase until the current one has been reviewed.
2. **Before any significant change** (a new dependency, schema change, new route, or any change to auth, payments, security or the design tokens), explain:
   1. What you want to change
   2. Why it is necessary
   3. Which files are affected
   4. What the expected result is

   Then wait for approval.
3. **When something is undefined, stop and ask.** Do not fill gaps with assumptions.
4. Keep changes small and focused, one concern per change.
5. Before reporting a task as done, run type-checking, linting and a production build, and confirm they pass.

---

## 7. Code conventions

- TypeScript strict mode. No `any` unless it is justified in a comment.
- Server Components by default. Add `"use client"` only where interactivity requires it, as low in the tree as possible.
- Supabase clients live in `src/lib/supabase/`: `client.ts` (browser), `server.ts` (cookie-aware server), and `admin.ts` (service role, server-only). Use the right one for each context.
- Page data is fetched on the server. Axios is used in the browser only for calls to the project's own `/api/*` route handlers.
- Shop filters, search and sorting live in URL search params.
- After an admin changes product data, revalidate the affected storefront paths.
- Build reusable primitives (Button, Input, Tile selector, Chip, Drawer) once in `components/ui/`, following §3.7, and reuse them everywhere.
- Name things clearly. Prefer a little repetition over premature abstraction.
- Comments explain *why*, not *what*.

---

## 8. Definition of done

A task is done when:

- It matches `PROJECT.md` and the Stitch design
- Type-check, lint and build all pass
- It works at mobile, tablet and desktop widths
- It meets the accessibility baseline in §3.8
- It uses only canonical tokens, with no radius, no shadows and no raw colours
- New tables have a migration and RLS policies
- Secrets stay server-only
- No unapproved dependencies were added
- Placeholders are marked `TODO(content)` and listed in the report

---

## 9. Report format

End every task with:

```text
Summary:        what was done
Files changed:  list
Migrations:     list, or "none"
Dependencies:   added/removed, or "none"
Placeholders:   TODO(content) items needing real content
Design review:  screens built without a Stitch design, or "none"
Open questions: anything that needs a decision
Next step:      what you propose to do next
```