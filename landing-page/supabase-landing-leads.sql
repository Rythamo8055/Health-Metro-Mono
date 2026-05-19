-- ========================================================
-- HEALTH METRO LANDING PAGE — APPOINTMENT REQUESTS / LEADS
-- Run this SQL in your Supabase SQL Editor to create the table
-- ========================================================

CREATE TABLE IF NOT EXISTS public.appointment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  service_needed VARCHAR,
  status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointment_requests ENABLE ROW LEVEL SECURITY;

-- Allow public access to insert requests from the landing page
CREATE POLICY "Enable insert access for all users" ON public.appointment_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authorized service role / admin to read and modify
CREATE POLICY "Enable read/write access for admin" ON public.appointment_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
