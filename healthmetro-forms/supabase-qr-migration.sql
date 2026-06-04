-- =============================================
-- QR CODE SYSTEM MIGRATION (Section 7)
-- =============================================

-- 1. Create QR Codes Table
CREATE TABLE IF NOT EXISTS public.qr_codes (
    qr_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id VARCHAR REFERENCES public.providers(client_id) ON DELETE CASCADE,
    qr_url TEXT NOT NULL,
    qr_image_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(client_id)
);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Only service_role can manage QR codes
CREATE POLICY "Service role can manage QR codes"
ON public.qr_codes FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Public can select QR codes (if needed for display)
CREATE POLICY "Public can view QR codes"
ON public.qr_codes FOR SELECT
TO public
USING (true);

-- 2. Create Storage Bucket for QR Codes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('qrcodes', 'qrcodes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for qrcodes bucket
CREATE POLICY "Server Manage QRs" ON storage.objects
  FOR ALL USING (
    bucket_id = 'qrcodes'
    AND (current_setting('request.jwt.claims', true)::json ->> 'role') = 'service_role'
  );

CREATE POLICY "Public View QRs" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'qrcodes'
  );
