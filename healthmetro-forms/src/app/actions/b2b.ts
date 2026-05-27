'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function submitB2BRegistration(data: any) {
  // Guard: check config before doing anything
  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (configErr: any) {
    console.error('Supabase admin client config error:', configErr.message);
    return { 
      success: false, 
      error: `Server configuration error: ${configErr.message}. Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment.` 
    };
  }

  try {
    // 1. Determine type code
    const typeMapping: Record<string, string> = {
      'Hospital': 'HOS',
      'Clinic': 'CLI',
      'Individual Doctor': 'DOC',
      'Pharmacy': 'PHY',
      'Diagnostic Center': 'DIA',
      'Other': 'OTH',
    };
    const typeCode = typeMapping[data.provider_type] || 'OTH';
    const year = new Date().getFullYear();

    // 2. Insert into Supabase
    // We map contact_name to provider_name with a [B2B] prefix to satisfy the database NOT NULL constraint.
    const { data: insertData, error: insertError } = await supabase
      .from('providers')
      .insert({
        provider_type: data.provider_type,
        provider_name: `[B2B] ${data.contact_name}`,
        registration_number: 'B2B-PENDING',
        gst_number: null,
        address: data.address,
        state_code: data.state_code,
        city_id: null,
        pin_code: data.pin_code,
        contact_name: data.contact_name,
        designation: data.designation,
        mobile: data.mobile,
        email: data.email,
        bank_details: {}, // Empty JSON structure for schema compatibility
        documents: {},    // Empty JSON structure since 3.5 is omitted
        type_code: typeCode,
        year: year,
        status: 'pending',
        onboarding_stage: 'SUBMITTED',
        agreement_status: 'PENDING',
        activation_status: 'BLOCKED_UNTIL_SIGNED',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(insertError.message);
    }

    return { success: true, provider: insertData };

  } catch (error: any) {
    console.error('B2B Registration failed:', error);
    return { success: false, error: error.message || 'Registration failed' };
  }
}
