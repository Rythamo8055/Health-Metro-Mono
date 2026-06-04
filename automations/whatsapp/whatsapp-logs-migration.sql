-- =============================================
-- WHATSAPP LOGS TABLE (Doc 10. Automations)
-- =============================================

CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES customers(id),
    recipient_number VARCHAR(20) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    message_status VARCHAR(20) DEFAULT 'SENT' CHECK (message_status IN ('SENT', 'FAILED', 'DELIVERED')),
    api_response JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_customer_id ON whatsapp_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_status ON whatsapp_logs(message_status);
