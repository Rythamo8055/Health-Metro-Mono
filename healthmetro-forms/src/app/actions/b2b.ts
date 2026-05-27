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
    const mobile = data.mobile;
    const pan_number = data.pan_number ? data.pan_number.toUpperCase() : null;

    if (!mobile || !pan_number) {
      return { success: false, error: 'Mobile number and PAN card number are required.' };
    }

    // Regex validation on the server side
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan_number)) {
      return { success: false, error: 'Invalid PAN card number format. Must be standard 10-character alphanumeric.' };
    }

    // 1. Check for duplicate mobile or pan_number
    const { data: existingProviders, error: queryError } = await supabase
      .from('providers')
      .select('id, mobile, pan_number')
      .or(`mobile.eq.${mobile},pan_number.eq.${pan_number}`);

    if (queryError) {
      console.error('Error checking duplicate B2B registration:', queryError);
      return { success: false, error: 'Database validation check failed. Please try again.' };
    }

    if (existingProviders && existingProviders.length > 0) {
      const matchedMobile = existingProviders.some(p => p.mobile === mobile);
      const matchedPan = existingProviders.some(p => p.pan_number === pan_number);

      if (matchedMobile && matchedPan) {
        return {
          success: false,
          error: 'A client is already registered with us using this mobile number and PAN card. If you believe this is an error or need assistance, please contact our partner support team.'
        };
      } else if (matchedPan) {
        return {
          success: false,
          error: 'This PAN card number is already associated with an existing account. Please reach out to our support team for assistance.'
        };
      } else if (matchedMobile) {
        return {
          success: false,
          error: 'This mobile number is already associated with an existing account. Please reach out to our support team for assistance.'
        };
      }
    }

    // 2. Determine type code
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

    // 3. Insert into Supabase
    // We map contact_name to provider_name with a [B2B] prefix to satisfy the database NOT NULL constraint.
    const { data: insertData, error: insertError } = await supabase
      .from('providers')
      .insert({
        provider_type: data.provider_type,
        provider_name: `[B2B] ${data.contact_name}`,
        registration_number: 'B2B-PENDING',
        gst_number: null,
        pan_number: pan_number,
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

export async function checkB2BDuplicate(mobile: string, pan_number: string) {
  let supabase: ReturnType<typeof createAdminClient>;
  try {
    supabase = createAdminClient();
  } catch (configErr: any) {
    return { isDuplicate: false };
  }

  try {
    const sanitizedMobile = mobile ? mobile.trim() : '';
    const sanitizedPan = pan_number ? pan_number.trim().toUpperCase() : '';

    if (!sanitizedMobile && !sanitizedPan) {
      return { isDuplicate: false };
    }

    // Build the query depending on what parameters are present
    let query = supabase.from('providers').select('id, mobile, pan_number');
    if (sanitizedMobile && sanitizedPan) {
      query = query.or(`mobile.eq.${sanitizedMobile},pan_number.eq.${sanitizedPan}`);
    } else if (sanitizedMobile) {
      query = query.eq('mobile', sanitizedMobile);
    } else if (sanitizedPan) {
      query = query.eq('pan_number', sanitizedPan);
    }

    const { data: existingProviders, error: queryError } = await query;
    if (queryError || !existingProviders || existingProviders.length === 0) {
      return { isDuplicate: false };
    }

    const matchedMobile = sanitizedMobile ? existingProviders.some(p => p.mobile === sanitizedMobile) : false;
    const matchedPan = sanitizedPan ? existingProviders.some(p => p.pan_number === sanitizedPan) : false;

    if (matchedMobile && matchedPan) {
      return {
        isDuplicate: true,
        field: 'both',
        error: 'A client is already registered with us using this mobile number and PAN card. If you need assistance, please contact our partner support team.'
      };
    } else if (matchedPan) {
      return {
        isDuplicate: true,
        field: 'pan_number',
        error: 'This PAN card number is already associated with an existing account. Please reach out to our support team for assistance.'
      };
    } else if (matchedMobile) {
      return {
        isDuplicate: true,
        field: 'mobile',
        error: 'This mobile number is already associated with an existing account. Please reach out to our support team for assistance.'
      };
    }

    return { isDuplicate: false };
  } catch (err) {
    console.error('Error in checkB2BDuplicate server action:', err);
    return { isDuplicate: false };
  }
}
