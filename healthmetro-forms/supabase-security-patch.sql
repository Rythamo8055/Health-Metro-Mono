-- =============================================
-- HEALTH METRO — SECURITY & PERFORMANCE PATCH
-- Run AFTER the initial schema has been created
-- =============================================


-- ═══════════════════════════════════════════════
-- 1. INDEXES (Performance)
-- ═══════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);
CREATE INDEX IF NOT EXISTS idx_providers_state_year_type ON providers(state_code, year, type_code);
CREATE INDEX IF NOT EXISTS idx_customers_client_id ON customers(client_id);
CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_date ON bookings(slot_date);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_date ON bookings(provider_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_referral_ledger_client_id ON referral_ledger(client_id);
CREATE INDEX IF NOT EXISTS idx_collections_booking_id ON collections(booking_id);
CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);


-- ═══════════════════════════════════════════════
-- 2. UPDATED_AT TRIGGER (Auto-update timestamp)
-- ═══════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to providers table
DROP TRIGGER IF EXISTS set_updated_at ON providers;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════
-- 3. ENABLE RLS ON ALL TABLES
-- ═══════════════════════════════════════════════

ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;


-- ═══════════════════════════════════════════════
-- 4. RLS POLICIES
-- ═══════════════════════════════════════════════

-- ─── STATES & CITIES: Anyone can read (public reference data) ───
CREATE POLICY "states_read_all" ON states FOR SELECT USING (true);
CREATE POLICY "cities_read_all" ON cities FOR SELECT USING (true);

-- ─── PROVIDERS ───
-- Anyone can INSERT (registration form is public)
CREATE POLICY "providers_insert_public" ON providers
  FOR INSERT WITH CHECK (true);

-- Only service_role (admin/server) can SELECT all providers
-- The anon key CANNOT read provider data from the browser
CREATE POLICY "providers_select_service" ON providers
  FOR SELECT USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- Only service_role can UPDATE (admin approval/rejection)
CREATE POLICY "providers_update_service" ON providers
  FOR UPDATE USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- ─── AGREEMENTS ───
CREATE POLICY "agreements_insert_public" ON agreements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "agreements_select_service" ON agreements
  FOR SELECT USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE POLICY "agreements_update_service" ON agreements
  FOR UPDATE USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- ─── CUSTOMERS ───
-- Anyone can INSERT (customer registration form is public via QR)
CREATE POLICY "customers_insert_public" ON customers
  FOR INSERT WITH CHECK (true);

-- Only service_role can read customer data
CREATE POLICY "customers_select_service" ON customers
  FOR SELECT USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- ─── BOOKINGS ───
-- Anyone can INSERT (created during customer registration)
CREATE POLICY "bookings_insert_public" ON bookings
  FOR INSERT WITH CHECK (true);

-- Only service_role can read/update bookings
CREATE POLICY "bookings_select_service" ON bookings
  FOR SELECT USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE POLICY "bookings_update_service" ON bookings
  FOR UPDATE USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- ─── PAYMENTS ───
CREATE POLICY "payments_insert_service" ON payments
  FOR INSERT WITH CHECK (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE POLICY "payments_select_service" ON payments
  FOR SELECT USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE POLICY "payments_update_service" ON payments
  FOR UPDATE USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- ─── REFERRAL LEDGER ───
CREATE POLICY "ledger_all_service" ON referral_ledger
  FOR ALL USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- ─── AGENTS ───
CREATE POLICY "agents_all_service" ON agents
  FOR ALL USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- ─── COLLECTIONS ───
CREATE POLICY "collections_all_service" ON collections
  FOR ALL USING (
    (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );


-- ═══════════════════════════════════════════════
-- 5. STORAGE SECURITY (Fix public bucket)
-- ═══════════════════════════════════════════════

-- Drop the overly permissive policies we created earlier
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Read" ON storage.objects;

-- Only allow uploads from server-side (service_role)
CREATE POLICY "Server Upload Only" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- Only allow reads from server-side (service_role)  
CREATE POLICY "Server Read Only" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

-- Allow server to update/delete files
CREATE POLICY "Server Manage Only" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents'
    AND (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE POLICY "Server Delete Only" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents'
    AND (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );


-- ═══════════════════════════════════════════════
-- 6. MOVE ID FUNCTIONS TO PRIVATE EXECUTION
-- ═══════════════════════════════════════════════

-- Revoke public execution of ID generation functions
-- Only the service_role (server-side) can call these
REVOKE EXECUTE ON FUNCTION generate_client_id(TEXT, INT, TEXT) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION generate_customer_id(TEXT, TEXT, INT) FROM anon, authenticated;


-- ═══════════════════════════════════════════════
-- 7. MAKE STORAGE BUCKET PRIVATE
-- ═══════════════════════════════════════════════

-- Switch documents bucket from public to private
-- Files will be served via signed URLs from the server
UPDATE storage.buckets SET public = false WHERE id = 'documents';


-- ═══════════════════════════════════════════════
-- DONE! Your database is now production-secure.
-- ═══════════════════════════════════════════════
