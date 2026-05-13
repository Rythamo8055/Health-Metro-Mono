'use server';

import { createAdminClient } from '@/utils/supabase/admin';

export async function submitProviderRegistration(formData: FormData) {
  const supabase = createAdminClient();

  // 1. Extract files
  const licenseFile = formData.get('licenseFile') as File | null;
  const idProofFile = formData.get('idProofFile') as File | null;
  const chequeFile = formData.get('chequeFile') as File | null;

  // 2. Extract JSON data
  const dataString = formData.get('data') as string;
  if (!dataString) throw new Error('Form data missing');
  const data = JSON.parse(dataString);

  const documentUrls: Record<string, string> = {};

  // Helper to upload file and get a signed URL (private bucket)
  const uploadFile = async (file: File, prefix: string) => {
    if (!file || file.size === 0) return null;
    
    const ext = file.name.split('.').pop() || 'pdf';
    const filename = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    
    const { error } = await supabase.storage
      .from('documents')
      .upload(`providers/${filename}`, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error(`Error uploading ${prefix}:`, error);
      throw new Error(`Failed to upload ${prefix}`);
    }

    // Store the path (not public URL since bucket is now private)
    return `providers/${filename}`;
  };

  try {
    // 3. Upload documents
    if (licenseFile) {
      documentUrls.license = await uploadFile(licenseFile, 'license') as string;
    }
    if (idProofFile) {
      documentUrls.id_proof = await uploadFile(idProofFile, 'id_proof') as string;
    }
    if (chequeFile) {
      documentUrls.cheque = await uploadFile(chequeFile, 'cheque') as string;
    }

    // 4. Construct Bank Details JSON
    const bankDetails = {
      account_holder_name: data.account_holder_name || '',
      bank_name: data.bank_name || '',
      account_no: data.account_no || '',
      ifsc_code: data.ifsc_code || '',
    };

    // Determine type code (Doc 2 mapping)
    const typeMapping: Record<string, string> = {
      'Hospital': 'HOS',
      'Clinic': 'CLI',
      'Individual Doctor': 'DOC',
      'Pharmacy': 'PHY',       // standardised — was 'PHA'
      'Diagnostic Center': 'DIA',
      'Other': 'OTH'
    };
    const typeCode = typeMapping[data.provider_type] || 'OTH';
    const year = new Date().getFullYear();

    // 5. Insert into Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('providers')
      .insert({
        provider_type: data.provider_type,
        provider_name: data.provider_name,
        registration_number: data.registration_number,
        gst_number: data.gst_number || null,
        address: data.address,
        state_code: data.state_code,
        city_id: null,
        pin_code: data.pin_code,
        contact_name: data.contact_name,
        designation: data.designation,
        mobile: data.mobile,
        email: data.email,
        bank_details: bankDetails,
        documents: documentUrls,
        type_code: typeCode,
        year: year,
        status: 'pending',
        onboarding_stage: 'SUBMITTED',
        agreement_status: 'PENDING',
        activation_status: 'BLOCKED_UNTIL_SIGNED'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error(insertError.message);
    }

    return { success: true, provider: insertData };

  } catch (error: unknown) {
    console.error('Registration failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
  }
}
