import { supabase } from './supabase';

// ─── TYPE CODES (Doc 2) ────────────────────────────────────────────────────
const PROVIDER_TYPE_CODES: Record<string, string> = {
  Hospital: 'HOS',
  Clinic: 'CLI',
  'Individual Doctor': 'DOC',
  Pharmacy: 'PHY',
  'Diagnostic Center': 'DIA',
  Other: 'OTH',
};

// SERVICE TYPE CODES (Doc 4)
const SERVICE_TYPE_CODES: Record<string, string> = {
  'Blood Collection': 'BLD',
  'Home Collection': 'HMC',
  'Clinic Visit': 'CLV',
  'Diagnostic Test': 'DGN',
};

// ─── CLIENT ID: CLI-TN-2026-HOS-000145 (Doc 2) ────────────────────────────
export async function generateClientId(
  stateCode: string,
  providerType: string,
  year?: number
): Promise<string> {
  const typeCode = PROVIDER_TYPE_CODES[providerType] ?? 'OTH';
  const y = year ?? new Date().getFullYear();

  const { data, error } = await supabase.rpc('generate_client_id', {
    p_state_code: stateCode.toUpperCase(),
    p_year: y,
    p_type_code: typeCode,
  });

  if (error) throw new Error(`Client ID generation failed: ${error.message}`);
  return data as string;
}

// ─── CUSTOMER ID: CUST-HOS145-2026-BLD-000251 (Doc 4) ────────────────────
export function deriveClientShort(clientId: string): string {
  // CLI-TN-2026-HOS-000145  →  HOS145
  const parts = clientId.split('-');
  if (parts.length < 5) return clientId;
  const typeCode = parts[3];             // HOS
  const sequence = parts[4].replace(/^0+/, ''); // 000145 → 145
  return `${typeCode}${sequence}`;
}

export async function generateCustomerId(
  clientShort: string,
  serviceType: string,
  year?: number
): Promise<string> {
  const typeCode = SERVICE_TYPE_CODES[serviceType] ?? 'BLD';
  const y = year ?? new Date().getFullYear();

  const { data, error } = await supabase.rpc('generate_customer_id', {
    p_client_short: clientShort,
    p_service_type: typeCode,
    p_year: y,
  });

  if (error) throw new Error(`Customer ID generation failed: ${error.message}`);
  return data as string;
}
