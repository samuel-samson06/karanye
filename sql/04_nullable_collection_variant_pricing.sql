-- ============================================================================
-- Karanyé — 04 migration for EXISTING databases (already running 01–02).
-- Fresh setups: 01_core_schema.sql already includes these columns — do NOT
-- run this file on a fresh database.
--
-- Execution: run ONCE in Supabase Dashboard SQL Editor, after 01 and 02.
-- Rerun-safe (IF NOT EXISTS / guarded DO blocks). Never executed by the app.
--
-- What this changes on the live database:
--   1. products.collection_id becomes nullable (standalone pieces = NULL).
--   2. product_variants gains nullable price_kobo (NULL = inherit product).
-- ============================================================================

-- 1. Standalone pieces: allow NULL collection (no more fake collections).
ALTER TABLE products ALTER COLUMN collection_id DROP NOT NULL;

-- 2. Per-variant price override (NULL inherits products.price_kobo).
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS price_kobo integer
    CHECK (price_kobo IS NULL OR price_kobo >= 0);

COMMENT ON COLUMN product_variants.price_kobo IS
  'Optional override. NULL inherits the parent product price_kobo; effective price = variant.price_kobo ?? product.price_kobo.';
