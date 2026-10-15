-- ============================================================================
-- Karanyé — 01_core_schema.sql
-- Phase 1: tables, keys, constraints, indexes. NOTHING ELSE.
-- No functions. No triggers. No seed data. No business logic.
--
-- Execution: run FIRST in Supabase Dashboard SQL Editor, then
--            sql/02_rls_policies.sql. Target: PostgreSQL 15 (Supabase).
-- Rerun safety: every statement below is safe to re-run (IF NOT EXISTS).
--   Later schema changes MUST ship as new files (sql/04_...): editing this
--   file afterwards will NOT alter already-created tables.
-- UUIDs use gen_random_uuid(), available in PostgreSQL 15 core — no
--   extension required.
-- Money is integer kobo everywhere; display conversion happens app-side.
-- updated_at columns default to now() but are NOT auto-maintained (no
--   triggers in Phase 1); writers set them explicitly until a later phase.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Collections: merchandising groups with routable slugs.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS collections (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  description text,
  image_path  text,
  sort_order  integer     NOT NULL DEFAULT 0,
  is_visible  boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS collections_visible_sort_idx
  ON collections (is_visible, sort_order);

-- ----------------------------------------------------------------------------
-- Products: catalogue records. collection_id is NULLABLE: a selected
-- collection stores its UUID; NULL means a standalone piece (never a fake
-- "Standalone" collection). The foreign key and ON DELETE RESTRICT behaviour
-- are preserved.
-- Focused on describing, publishing, pricing, and selling: no model info,
-- fit classification, or generic extra-measurement columns (no documented
-- requirement for them).
-- care_instructions is plain comma-separated text; the frontend splits it
-- for display and editing (no JSON structure, no separate table).
-- status is a merchandising/publication label, NOT fulfilment:
-- draft/archived are admin publication states; made_to_order/limited/
-- sold_out are the canonical storefront badges (§3.7). Actual fulfilment
-- (ready-made vs made-to-order) lives on product_variants per row.
-- Deleting a collection with products is RESTRICTED; retire products via
-- status = 'archived' instead of deleting them.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id        uuid        REFERENCES collections (id) ON DELETE RESTRICT,
  name                 text        NOT NULL,
  slug                 text        NOT NULL UNIQUE,
  description          text,
  price_kobo           integer     NOT NULL CHECK (price_kobo >= 0),
  fabric_composition   text,
  care_instructions    text,
  status               text        NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'made_to_order', 'limited', 'sold_out', 'archived')),
  mtm_available        boolean     NOT NULL DEFAULT false,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_collection_idx ON products (collection_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products (status);

-- ----------------------------------------------------------------------------
-- Product images: one row per image URL (never image bytes). Alt text is
-- optional — when omitted the frontend falls back to the product name.
-- Rows are catalogue-only and CASCADE with their product; Supabase Storage
-- file cleanup is explicitly out of scope (orphaned files accepted for now).
-- NOTE: the URL/storage approach may be adjusted later if the image
-- pipeline requires it; no Storage bucket is claimed to exist by this file.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   uuid        NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  image_url    text        NOT NULL,
  alt          text,
  is_primary   boolean     NOT NULL DEFAULT false,
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS product_images_product_sort_idx
  ON product_images (product_id, sort_order);

-- At most one primary image per product (partial unique index).
CREATE UNIQUE INDEX IF NOT EXISTS product_images_single_primary_uidx
  ON product_images (product_id) WHERE is_primary;

-- ----------------------------------------------------------------------------
-- Product variants: only combinations the product actually offers.
-- Variants are purchasable options of their parent product, never
-- independent catalogue products (no has_variants flag: existence of
-- variant rows is the signal; the future Admin UI switch needs no column).
-- Size is optional: sizeless goods use size_label = NULL (convention
-- 'One Size' at display time); colourless goods use colour = NULL. At
-- least one of the two is required so a variant always denotes something.
-- Fulfilment is EXPLICIT, never inferred from stock:
--   ready_made   → stock_quantity is a real, non-negative count.
--   made_to_order → stock_quantity is always NULL (nothing to decrement).
-- Deleting a variant referenced by an order item is RESTRICTED; delist via
-- is_active = false instead.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     uuid        NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  size_label     text        CHECK (size_label IS NULL OR char_length(size_label) > 0),
  colour         text,
  sku            text        UNIQUE,
  fulfilment_type text       NOT NULL
    CHECK (fulfilment_type IN ('ready_made', 'made_to_order')),
  price_kobo       integer     CHECK (price_kobo IS NULL OR price_kobo >= 0),
  -- Optional override: NULL inherits products.price_kobo (effective price =
  -- variant.price_kobo ?? product.price_kobo).
  stock_quantity integer     CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  is_active      boolean     NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CHECK (size_label IS NOT NULL OR colour IS NOT NULL),
  CHECK (
    (fulfilment_type = 'ready_made' AND stock_quantity IS NOT NULL)
    OR
    (fulfilment_type = 'made_to_order' AND stock_quantity IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS product_variants_product_idx
  ON product_variants (product_id);

-- NULL-safe duplicate prevention per product (NULLs would otherwise compare
-- unequal to themselves and slip through a plain UNIQUE constraint).
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_no_dup_uidx
  ON product_variants (product_id, COALESCE(size_label, ''), COALESCE(colour, ''));

-- ----------------------------------------------------------------------------
-- Customers: guest identities keyed by normalized email. No logins, no
-- passwords anywhere in this schema. Matching key is email alone —
-- never name or phone. The UNIQUE index on lower(email) enforces
-- normalization at the database level; the app lowercases/trims first.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text        NOT NULL,
  name       text,
  phone      text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS customers_email_normalized_uidx
  ON customers (lower(email));

-- ----------------------------------------------------------------------------
-- Orders: guest checkout. customer_id is a nullable link for repeat-guest
-- association (SET NULL keeps the order if the customer row is removed).
-- Contact + delivery columns are purchase-time snapshots: written once,
-- never updated. Money columns are integer kobo with an enforced total
-- formula (discount_kobo is a reserved column, default 0 — no discount
-- feature exists). Payment outcomes live in payments; this status column
-- tracks fulfilment only (transition logic arrives in Phase 5).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         uuid        REFERENCES customers (id) ON DELETE SET NULL,
  reference           text        NOT NULL UNIQUE,
  email               text        NOT NULL,
  full_name           text,
  phone               text,
  delivery_address    text,
  delivery_city       text,
  delivery_state      text,
  delivery_country    text        NOT NULL DEFAULT 'Nigeria',
  subtotal_kobo       integer     NOT NULL CHECK (subtotal_kobo >= 0),
  delivery_fee_kobo   integer     NOT NULL DEFAULT 0 CHECK (delivery_fee_kobo >= 0),
  discount_kobo       integer     NOT NULL DEFAULT 0 CHECK (discount_kobo >= 0),
  total_kobo          integer     NOT NULL CHECK (total_kobo >= 0),
  currency            text        NOT NULL DEFAULT 'NGN',
  status              text        NOT NULL DEFAULT 'pending_payment'
    CHECK (status IN ('pending_payment', 'awaiting_fulfilment', 'in_production',
                      'ready', 'shipped', 'delivered', 'requires_attention',
                      'cancelled')),
  paid_at             timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CHECK (total_kobo = subtotal_kobo + delivery_fee_kobo - discount_kobo)
);

CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders (customer_id);

-- ----------------------------------------------------------------------------
-- Order items: immutable purchase-time snapshots. product_id / variant_id are
-- nullable links guarded by RESTRICT (history never depends on catalogue rows
-- still existing, and referenced rows cannot be deleted out from under it).
-- Made-to-measure is a per-item choice, independent of variant fulfilment:
-- standard rows record the selected size where one exists and never carry
-- measurements; MTM rows carry the submitted measurements JSONB. Capturing
-- measurements and pricing them are separate concerns: unit_price_kobo is
-- the charged snapshot (computed server-side) and is never re-derived.
-- No surcharge/quote/pricing-formula columns exist yet — MTM pricing policy
-- is undefined and will be schemed separately once defined. Whether MTM was
-- permitted (product.mtm_available) is enforced by the application/Phase-5
-- confirmation, not by this shape check.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id              uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid    NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id      uuid    REFERENCES products (id) ON DELETE RESTRICT,
  variant_id      uuid    REFERENCES product_variants (id) ON DELETE RESTRICT,
  product_name    text    NOT NULL,
  unit_price_kobo integer NOT NULL CHECK (unit_price_kobo >= 0),
  colour          text,
  quantity        integer NOT NULL CHECK (quantity > 0),
  sizing_type     text    NOT NULL CHECK (sizing_type IN ('standard', 'made_to_measure')),
  size_label      text,
  measurements    jsonb,
  CHECK (
    (sizing_type = 'standard' AND measurements IS NULL)
    OR
    (sizing_type = 'made_to_measure' AND measurements IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_idx ON order_items (product_id);

-- ----------------------------------------------------------------------------
-- Payments: one row per verified payment outcome, separate from orders.
-- paystack_reference UNIQUE gives replay idempotency at the database level.
-- Gateway fees are NOT stored (Paystack dashboard is the source).
-- Deletion is RESTRICTED while payment rows exist: an order with a money
-- trail cannot be deleted (unpaid orders without payments remain removable,
-- cascading their items and events with them).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           uuid        NOT NULL REFERENCES orders (id) ON DELETE RESTRICT,
  paystack_reference text        NOT NULL UNIQUE,
  amount_kobo        integer     NOT NULL CHECK (amount_kobo > 0),
  currency           text        NOT NULL DEFAULT 'NGN',
  channel            text,
  status             text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'success', 'failed')),
  paid_at            timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_order_idx ON payments (order_id);

-- ----------------------------------------------------------------------------
-- Order events: append-only fulfilment/payment history (transition logic in
-- Phase 5). changed_by holds the Supabase Auth user id for admin actions,
-- NULL for system actions. No foreign key: auth.users lives outside this
-- schema's remit.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_events (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   uuid        NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  status     text        NOT NULL,
  note       text,
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_events_order_created_idx
  ON order_events (order_id, created_at);

-- ----------------------------------------------------------------------------
-- Complaints (minimal): filer details + optional order link + message.
-- Matches the Contact form's defined enquiry values app-side; no general
-- enquiries table. order_id SET NULL preserves the complaint if the order
-- row is ever removed.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaints (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  order_id   uuid        REFERENCES orders (id) ON DELETE SET NULL,
  subject    text        NOT NULL,
  message    text        NOT NULL,
  status     text        NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_review', 'resolved', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS complaints_status_created_idx
  ON complaints (status, created_at);
CREATE INDEX IF NOT EXISTS complaints_email_idx ON complaints (email);

-- ----------------------------------------------------------------------------
-- Newsletter subscribers: required backend for the existing newsletter UI
-- (name + email + honeypot). Distinct from a product waitlist — no waitlist
-- table exists or is created here.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text,
  email         text        NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_normalized_uidx
  ON newsletter_subscribers (lower(email));
