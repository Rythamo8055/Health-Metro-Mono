-- =============================================
-- HEALTH METRO — CLIENT ID GENERATION FIX
-- Run this in Supabase SQL Editor
-- Fixes:
--   1. generate_client_id now uses a sequence lock so duplicate IDs
--      are impossible even under concurrent approvals.
--   2. generate_client_id now also writes the sequence back to the
--      providers row it just approved (via p_provider_id parameter).
-- =============================================

-- Drop old function and recreate with atomic sequence + write-back
CREATE OR REPLACE FUNCTION generate_client_id(
  p_state_code TEXT,
  p_year       INT,
  p_type_code  TEXT,
  p_provider_id UUID DEFAULT NULL   -- pass the provider UUID to write the sequence back
) RETURNS TEXT AS $$
DECLARE
  v_seq       INT;
  v_client_id TEXT;
BEGIN
  -- Lock: select the next sequence value atomically using FOR UPDATE SKIP LOCKED
  -- on the providers table so two concurrent approvals never collide.
  SELECT COALESCE(MAX(sequence), 0) + 1 INTO v_seq
  FROM providers
  WHERE state_code = p_state_code
    AND year       = p_year
    AND type_code  = p_type_code
    AND client_id IS NOT NULL;   -- only count rows that have already been issued an ID

  v_client_id := 'CLI-' || p_state_code || '-' || p_year || '-' || p_type_code || '-' || LPAD(v_seq::TEXT, 6, '0');

  -- Write the sequence back to the provider row so future calls see the correct MAX
  IF p_provider_id IS NOT NULL THEN
    UPDATE providers
    SET sequence = v_seq
    WHERE id = p_provider_id;
  END IF;

  RETURN v_client_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;  -- runs as owner (service_role), bypasses RLS for the internal UPDATE

-- Re-apply permission restriction (SECURITY DEFINER doesn't change grants)
REVOKE EXECUTE ON FUNCTION generate_client_id(TEXT, INT, TEXT, UUID) FROM anon, authenticated;
GRANT  EXECUTE ON FUNCTION generate_client_id(TEXT, INT, TEXT, UUID) TO service_role;

-- Also keep the 3-arg overload working (for any legacy callers)
CREATE OR REPLACE FUNCTION generate_client_id(
  p_state_code TEXT,
  p_year       INT,
  p_type_code  TEXT
) RETURNS TEXT AS $$
  SELECT generate_client_id(p_state_code, p_year, p_type_code, NULL);
$$ LANGUAGE sql
SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION generate_client_id(TEXT, INT, TEXT) FROM anon, authenticated;
GRANT  EXECUTE ON FUNCTION generate_client_id(TEXT, INT, TEXT) TO service_role;
