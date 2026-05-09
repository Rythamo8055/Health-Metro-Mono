-- =============================================
-- HEALTH METRO — SUPABASE SCHEMA (EXPANDED)
-- Includes Payments, Agreements & Storage
-- =============================================

-- ─── STATES (Doc 9) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  state_name VARCHAR NOT NULL,
  state_code VARCHAR(10) UNIQUE NOT NULL,
  country VARCHAR DEFAULT 'India',
  active BOOLEAN DEFAULT true
);

-- ─── CITIES (Doc 9) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  state_id INT REFERENCES states(id) ON DELETE CASCADE,
  city_name VARCHAR NOT NULL,
  active BOOLEAN DEFAULT true
);

-- ─── PROVIDERS / CLIENTS (Doc 1, 2, 8) ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id VARCHAR UNIQUE,
  state_code VARCHAR(10),
  year INT,
  type_code VARCHAR(5),
  sequence INT,
  provider_type VARCHAR NOT NULL,
  provider_name VARCHAR NOT NULL,
  registration_number VARCHAR,
  gst_number VARCHAR,
  address TEXT,
  state_id INT REFERENCES states(id),
  city_id INT REFERENCES cities(id),
  pin_code VARCHAR(6),
  contact_name VARCHAR,
  designation VARCHAR,
  mobile VARCHAR(15),
  email VARCHAR,
  bank_details JSONB DEFAULT '{}',
  documents JSONB DEFAULT '{}',
  settlement_mode VARCHAR DEFAULT 'REFERRAL',
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  rejection_reason TEXT,
  -- Doc 8 Fields (Agreement & Activation Gate)
  agreement_status VARCHAR DEFAULT 'PENDING' CHECK (agreement_status IN ('PENDING','SIGNED')),
  activation_status VARCHAR DEFAULT 'BLOCKED_UNTIL_SIGNED',
  signed_at TIMESTAMPTZ,
  onboarding_stage VARCHAR DEFAULT 'SUBMITTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AGREEMENTS (Doc 8) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agreements (
  agreement_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id VARCHAR REFERENCES providers(client_id),
  provider_id UUID REFERENCES providers(id),
  status VARCHAR DEFAULT 'PENDING' CHECK (status IN ('PENDING','SIGNED')),
  document_url TEXT,
  ip_address VARCHAR,
  esign_provider VARCHAR CHECK (esign_provider IN ('DocuSign', 'Adobe', 'Zoho', 'Digio')),
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CUSTOMERS (Doc 3 & 4) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id VARCHAR UNIQUE,
  client_id VARCHAR REFERENCES providers(client_id),
  provider_id UUID REFERENCES providers(id),
  client_short VARCHAR,
  full_name VARCHAR NOT NULL,
  gender VARCHAR CHECK (gender IN ('Male','Female','Other')),
  age INT CHECK (age BETWEEN 0 AND 120),
  mobile VARCHAR(15) NOT NULL,
  email VARCHAR,
  address TEXT,
  state_code VARCHAR(10),
  state_id INT REFERENCES states(id),
  city_id INT REFERENCES cities(id),
  pin_code VARCHAR(6),
  collection_type VARCHAR CHECK (collection_type IN ('provider','home')),
  home_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  maps_link TEXT,
  service_type VARCHAR DEFAULT 'BLD',
  sequence INT,
  year INT,
  referral_source VARCHAR CHECK (referral_source IN ('QR_SCAN','LINK')),
  declaration_agreed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BOOKINGS (Doc 3 & 7) ────────────────────────────────────────────────
-- Renamed from 'appointments' to match Doc 7 perfectly
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  provider_id UUID REFERENCES providers(id),
  slot_date DATE NOT NULL,
  slot_time VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'booked' CHECK (status IN ('booked','assigned','on_route','collected','delivered','reported','cancelled')),
  -- Doc 7 Payment Fields
  payment_status VARCHAR DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','SUCCESS','FAILED')),
  payment_link TEXT,
  payment_due_time TIMESTAMPTZ,
  activation_status VARCHAR DEFAULT 'PENDING_PAYMENT',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider_id, slot_date, slot_time)  -- Prevent double booking (Slot conflict handling)
);

-- ─── PAYMENTS (Doc 7) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  payment_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  booking_id UUID REFERENCES bookings(id),
  razorpay_order_id VARCHAR UNIQUE,
  razorpay_payment_id VARCHAR,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR DEFAULT 'PENDING' CHECK (status IN ('PENDING','SUCCESS','FAILED')),
  link_generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REFERRAL LEDGER (Doc 6) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referral_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id VARCHAR REFERENCES providers(client_id),
  booking_id UUID REFERENCES bookings(id),
  revenue DECIMAL(10, 2),
  payout_percentage DECIMAL(5, 2),
  payout_amount DECIMAL(10, 2),
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending','approved','paid')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AGENTS (Doc 5) ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  phone VARCHAR(15),
  zone VARCHAR,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active','inactive'))
);

-- ─── COLLECTIONS (Doc 5) ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  agent_id UUID REFERENCES agents(id),
  booking_id UUID REFERENCES bookings(id),
  status VARCHAR DEFAULT 'booked',
  route_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =============================================
-- DB FUNCTIONS (ID GENERATION)
-- =============================================

-- CLIENT ID GENERATOR: CLI-TN-2026-HOS-000145 (Doc 2)
CREATE OR REPLACE FUNCTION generate_client_id(
  p_state_code TEXT,
  p_year INT,
  p_type_code TEXT
) RETURNS TEXT AS $$
DECLARE
  v_seq INT;
  v_client_id TEXT;
BEGIN
  SELECT COALESCE(MAX(sequence), 0) + 1 INTO v_seq
  FROM providers
  WHERE state_code = p_state_code
    AND year = p_year
    AND type_code = p_type_code;

  v_client_id := 'CLI-' || p_state_code || '-' || p_year || '-' || p_type_code || '-' || LPAD(v_seq::TEXT, 6, '0');
  RETURN v_client_id;
END;
$$ LANGUAGE plpgsql;

-- CUSTOMER ID GENERATOR: CUST-HOS145-2026-BLD-000251 (Doc 4)
CREATE OR REPLACE FUNCTION generate_customer_id(
  p_client_short TEXT,
  p_service_type TEXT,
  p_year INT
) RETURNS TEXT AS $$
DECLARE
  v_seq INT;
  v_customer_id TEXT;
BEGIN
  SELECT COALESCE(MAX(sequence), 0) + 1 INTO v_seq
  FROM customers
  WHERE client_short = p_client_short
    AND service_type = p_service_type
    AND year = p_year;

  v_customer_id := 'CUST-' || p_client_short || '-' || p_year || '-' || p_service_type || '-' || LPAD(v_seq::TEXT, 6, '0');
  RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql;


-- =============================================
-- SEED DATA (Doc 9)
-- =============================================

INSERT INTO states (state_name, state_code) VALUES
  ('Andhra Pradesh', 'AP'), ('Arunachal Pradesh', 'AR'), ('Assam', 'AS'), ('Bihar', 'BR'),
  ('Chhattisgarh', 'CG'), ('Goa', 'GA'), ('Gujarat', 'GJ'), ('Haryana', 'HR'),
  ('Himachal Pradesh', 'HP'), ('Jharkhand', 'JH'), ('Karnataka', 'KA'), ('Kerala', 'KL'),
  ('Madhya Pradesh', 'MP'), ('Maharashtra', 'MH'), ('Manipur', 'MN'), ('Meghalaya', 'ML'),
  ('Mizoram', 'MZ'), ('Nagaland', 'NL'), ('Odisha', 'OD'), ('Punjab', 'PB'),
  ('Rajasthan', 'RJ'), ('Sikkim', 'SK'), ('Tamil Nadu', 'TN'), ('Telangana', 'TS'),
  ('Tripura', 'TR'), ('Uttar Pradesh', 'UP'), ('Uttarakhand', 'UK'), ('West Bengal', 'WB'),
  ('Delhi', 'DL'), ('Jammu & Kashmir', 'JK'), ('Ladakh', 'LA'), ('Puducherry', 'PY'),
  ('Chandigarh', 'CH'), ('Andaman & Nicobar', 'AN'), ('Lakshadweep', 'LD'),
  ('Dadra & Nagar Haveli', 'DN'), ('Daman & Diu', 'DD')
ON CONFLICT (state_code) DO NOTHING;

INSERT INTO cities (state_id, city_name)
SELECT s.id, c.city FROM states s
JOIN (VALUES
  ('TN', 'Chennai'), ('TN', 'Coimbatore'), ('TN', 'Madurai'), ('TN', 'Tiruchirappalli'),
  ('TN', 'Salem'), ('TN', 'Tirunelveli'), ('TN', 'Vellore'), ('TN', 'Erode'),
  ('KA', 'Bengaluru'), ('KA', 'Mysuru'), ('KA', 'Hubli'), ('KA', 'Mangaluru'),
  ('KA', 'Belagavi'), ('KA', 'Kalaburagi'), ('KA', 'Tumkur'),
  ('MH', 'Mumbai'), ('MH', 'Pune'), ('MH', 'Nagpur'), ('MH', 'Nashik'),
  ('MH', 'Aurangabad'), ('MH', 'Solapur'), ('MH', 'Kolhapur'), ('MH', 'Amravati'),
  ('DL', 'New Delhi'), ('DL', 'Noida'), ('DL', 'Dwarka'), ('DL', 'Rohini'),
  ('GJ', 'Ahmedabad'), ('GJ', 'Surat'), ('GJ', 'Vadodara'), ('GJ', 'Rajkot'),
  ('GJ', 'Bhavnagar'), ('GJ', 'Jamnagar'), ('GJ', 'Gandhinagar'),
  ('TS', 'Hyderabad'), ('TS', 'Warangal'), ('TS', 'Nizamabad'), ('TS', 'Karimnagar'),
  ('AP', 'Visakhapatnam'), ('AP', 'Vijayawada'), ('AP', 'Guntur'), ('AP', 'Tirupati'),
  ('RJ', 'Jaipur'), ('RJ', 'Jodhpur'), ('RJ', 'Udaipur'), ('RJ', 'Kota'), ('RJ', 'Ajmer'),
  ('UP', 'Lucknow'), ('UP', 'Kanpur'), ('UP', 'Agra'), ('UP', 'Varanasi'),
  ('UP', 'Allahabad'), ('UP', 'Ghaziabad'), ('UP', 'Noida'), ('UP', 'Meerut'),
  ('WB', 'Kolkata'), ('WB', 'Howrah'), ('WB', 'Durgapur'), ('WB', 'Asansol'),
  ('KL', 'Thiruvananthapuram'), ('KL', 'Kochi'), ('KL', 'Kozhikode'), ('KL', 'Thrissur'),
  ('MP', 'Bhopal'), ('MP', 'Indore'), ('MP', 'Jabalpur'), ('MP', 'Gwalior'),
  ('HR', 'Gurgaon'), ('HR', 'Faridabad'), ('HR', 'Panipat'), ('HR', 'Ambala'),
  ('PB', 'Ludhiana'), ('PB', 'Amritsar'), ('PB', 'Chandigarh'), ('PB', 'Jalandhar'),
  ('BR', 'Patna'), ('BR', 'Gaya'), ('BR', 'Bhagalpur'), ('BR', 'Muzaffarpur'),
  ('OD', 'Bhubaneswar'), ('OD', 'Cuttack'), ('OD', 'Rourkela'), ('OD', 'Berhampur'),
  ('AS', 'Guwahati'), ('AS', 'Silchar'), ('AS', 'Dibrugarh'), ('AS', 'Jorhat'),
  ('JH', 'Ranchi'), ('JH', 'Jamshedpur'), ('JH', 'Dhanbad'), ('JH', 'Bokaro'),
  ('CG', 'Raipur'), ('CG', 'Bhilai'), ('CG', 'Bilaspur'), ('CG', 'Korba'),
  ('PY', 'Puducherry')
) AS c(state_code, city)
ON s.state_code = c.state_code;


-- =============================================
-- STORAGE BUCKETS (run manually in dashboard if errors)
-- =============================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage bucket (Allow anyone to upload & read for now during development)
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
