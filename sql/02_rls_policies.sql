-- ============================================================================
-- Karanyé — 02_rls_policies.sql
-- Phase 1: privileges, RLS, public availability view, Storage policies.
-- No functions. No triggers. No business logic.
--
-- Execution: run AFTER sql/01_core_schema.sql in Supabase Dashboard SQL
-- Editor. Rerun-safe (policies are dropped IF EXISTS before creation;
-- grants and CREATE OR REPLACE are idempotent).
--
-- Privilege model (RLS policies do NOT grant privileges by themselves):
--   * anon + authenticated receive USAGE on schema public and SELECT on the
--     catalogue surface ONLY (collections, products, product_images,
--     available_variants view, plus SELECT on product_variants which the
--     invoker-rights view requires to execute as the caller — rows remain
--     limited by the RLS policy below, columns by the view definition).
--   * authenticated receives table privileges for commerce tables, but every
--     such privilege is gated by an app_metadata admin check inside the
--     matching RLS policy. Without role = 'admin', they permit nothing.
--   * service_role bypasses RLS entirely (Supabase default) and is the ONLY
--     writer of customer/order/payment/complaint/newsletter rows, via
--     validated server-side route handlers (Phase 3+). It needs no grants.
-- Admin grant mechanism: Supabase Auth user with app_metadata = {"role":
--   "admin"}, set in Dashboard user management or a service-role script.
--   Never a passwords table. Inline check used in every admin policy
--   (no helper function — functions are deferred to a later phase):
--     (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
-- Anonymous writes: NONE. No INSERT/UPDATE/DELETE policy exists for anon
--   on any table. Newsletter/complaint submissions go through the service
--   role in Phase 3, not through public policies.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Minimum grants.
-- ----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- Storage objects: base DML privileges (Supabase ships these by default;
-- restated here so this file is self-sufficient). Row access is still gated
-- by the storage policies in section 6.
GRANT SELECT ON storage.objects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON storage.objects TO authenticated;

-- Public catalogue reads (row-filtered by RLS policies in section 3).
GRANT SELECT ON collections TO anon, authenticated;
GRANT SELECT ON products TO anon, authenticated;
GRANT SELECT ON product_images TO anon, authenticated;
-- Required for the invoker-rights view below: permission checks on the
-- underlying table run as the caller. Row access is still limited by the
-- product_variants RLS policy; column access is limited by the view.
GRANT SELECT ON product_variants TO anon, authenticated;

-- Commerce tables: privileges for the admin path only. Each grant below is
-- inert without its matching app_metadata-gated RLS policy in section 4.
GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON order_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON complaints TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON newsletter_subscribers TO authenticated;

-- ----------------------------------------------------------------------------
-- 2. Enable RLS on every table. Deny-by-default: tables without a matching
--    policy below permit nothing to anon/authenticated (service_role
--    bypasses RLS and is unaffected).
-- ----------------------------------------------------------------------------
ALTER TABLE collections             ENABLE ROW LEVEL SECURITY;
ALTER TABLE products                ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants        ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments                ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints              ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers  ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. Public catalogue read policies (anon + authenticated).
-- ----------------------------------------------------------------------------

-- Visible collections only.
DROP POLICY IF EXISTS collections_public_read ON collections;
CREATE POLICY collections_public_read
  ON collections FOR SELECT TO anon, authenticated
  USING (is_visible = true);

-- Public products: never draft or archived, and only inside a visible
-- collection.
DROP POLICY IF EXISTS products_public_read ON products;
CREATE POLICY products_public_read
  ON products FOR SELECT TO anon, authenticated
  USING (
    status NOT IN ('draft', 'archived')
    AND EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = products.collection_id
        AND collections.is_visible = true
    )
  );

-- Images of public products only.
DROP POLICY IF EXISTS product_images_public_read ON product_images;
CREATE POLICY product_images_public_read
  ON product_images FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN collections ON collections.id = products.collection_id
      WHERE products.id = product_images.product_id
        AND products.status NOT IN ('draft', 'archived')
        AND collections.is_visible = true
    )
  );

-- Variant rows: active variants of public products only. This policy — not
-- the absence of grants — is what limits rows; the view in section 5 is
-- what limits columns (stock_quantity never leaves the database publicly).
DROP POLICY IF EXISTS product_variants_public_read ON product_variants;
CREATE POLICY product_variants_public_read
  ON product_variants FOR SELECT TO anon, authenticated
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM products
      JOIN collections ON collections.id = products.collection_id
      WHERE products.id = product_variants.product_id
        AND products.status NOT IN ('draft', 'archived')
        AND collections.is_visible = true
    )
  );

-- ----------------------------------------------------------------------------
-- 4. Administrator policies (authenticated + app_metadata role check).
--    One ALL policy per table keeps the audit surface minimal; every policy
--    below permits nothing unless the caller is a provisioned admin.
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS collections_admin_all ON collections;
CREATE POLICY collections_admin_all
  ON collections FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS products_admin_all ON products;
CREATE POLICY products_admin_all
  ON products FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS product_images_admin_all ON product_images;
CREATE POLICY product_images_admin_all
  ON product_images FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS product_variants_admin_all ON product_variants;
CREATE POLICY product_variants_admin_all
  ON product_variants FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS customers_admin_all ON customers;
CREATE POLICY customers_admin_all
  ON customers FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS orders_admin_all ON orders;
CREATE POLICY orders_admin_all
  ON orders FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS order_items_admin_all ON order_items;
CREATE POLICY order_items_admin_all
  ON order_items FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS payments_admin_all ON payments;
CREATE POLICY payments_admin_all
  ON payments FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS order_events_admin_all ON order_events;
CREATE POLICY order_events_admin_all
  ON order_events FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS complaints_admin_all ON complaints;
CREATE POLICY complaints_admin_all
  ON complaints FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS newsletter_admin_all ON newsletter_subscribers;
CREATE POLICY newsletter_admin_all
  ON newsletter_subscribers FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ----------------------------------------------------------------------------
-- 5. Public variant availability view (explicit invoker rights).
-- Three layers work together — none is sufficient alone:
--   a. GRANT SELECT ON available_variants TO anon, authenticated (this view).
--   b. WITH (security_invoker = true): the view executes as the caller, so
--      the product_variants RLS policy in section 3 still filters rows.
--      (PostgreSQL 15+ view option; stated explicitly, not assumed.)
--   c. The view's select list is the column allowlist: stock_quantity is
--      absent, so exact inventory counts cannot leak — only the derived
--      is_available boolean is exposed.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW available_variants
WITH (security_invoker = true) AS
SELECT
  v.id           AS variant_id,
  v.product_id   AS product_id,
  v.size_label   AS size_label,
  v.colour       AS colour,
  v.fulfilment_type AS fulfilment_type,
  (
    CASE
      WHEN v.fulfilment_type = 'ready_made'
        THEN v.is_active AND v.stock_quantity > 0
      ELSE v.is_active
    END
  ) AS is_available
FROM product_variants AS v;

GRANT SELECT ON available_variants TO anon, authenticated;

-- ----------------------------------------------------------------------------
-- 6. Storage policies for the product-images bucket.
-- MANUAL PREREQUISITE (Supabase Dashboard → Storage): create a bucket named
-- exactly `product-images` and mark it PUBLIC before running this section.
-- Without the bucket, these policies create cleanly but match nothing.
-- RLS is enabled on storage.objects by default on Supabase; the statements
-- below only add policies.
-- ----------------------------------------------------------------------------

-- Public reads of product imagery.
DROP POLICY IF EXISTS "product-images public read" ON storage.objects;
CREATE POLICY "product-images public read"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Admin-only writes (insert / update / delete share one definition shape).
DROP POLICY IF EXISTS "product-images admin insert" ON storage.objects;
CREATE POLICY "product-images admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "product-images admin update" ON storage.objects;
CREATE POLICY "product-images admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'product-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'product-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

DROP POLICY IF EXISTS "product-images admin delete" ON storage.objects;
CREATE POLICY "product-images admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'product-images'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
