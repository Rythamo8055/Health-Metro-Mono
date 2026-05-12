'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function approveProvider(providerId: string, stateCode: string, providerType: string) {
  const supabase = createAdminClient();

  try {
    const year = new Date().getFullYear();
    const typeCode = providerType === 'Hospital'          ? 'HOS'
                   : providerType === 'Clinic'            ? 'CLI'
                   : providerType === 'Individual Doctor' ? 'DOC'
                   : providerType === 'Pharmacy'          ? 'PHY'
                   : providerType === 'Diagnostic Center' ? 'DIA' : 'OTH';

    // 1. Call the RPC function to generate the Client ID
    // Pass the provider UUID so the DB writes the sequence back atomically
    const { data: clientId, error: rpcError } = await supabase.rpc('generate_client_id', {
      p_state_code: stateCode,
      p_year: year,
      p_type_code: typeCode,
      p_provider_id: providerId,
    });

    if (rpcError) throw rpcError;
    if (!clientId) throw new Error('Failed to generate Client ID');

    // Extract sequence from the generated ID (format: CLI-TN-2026-HOS-000145)
    const parts = clientId.split('-');
    const sequence = parseInt(parts[parts.length - 1], 10);

    // 2. Generate QR Code
    const { generateAndUploadQRCode } = await import('@/utils/qr');
    const { generateToken } = await import('@/utils/crypto');
    
    const formsBaseUrl = process.env.NEXT_PUBLIC_FORMS_URL || 'https://healthmetro-forms.vercel.app';
    const token = generateToken(clientId);
    const registrationUrl = `${formsBaseUrl}/register/customer?client_id=${clientId}&token=${token}&src=qr`;
    
    const qrResult = await generateAndUploadQRCode(clientId, registrationUrl);
    if (!qrResult.success) throw new Error(qrResult.error);

    // 3. Update the provider status and assign the new client ID + metadata
    const { error: updateError } = await supabase
      .from('providers')
      .update({
        status: 'approved',
        client_id: clientId,
        state_code: stateCode,
        year: year,
        type_code: typeCode,
        sequence: sequence,
        updated_at: new Date().toISOString(),
      })
      .eq('id', providerId);

    if (updateError) throw updateError;

    // 4. Store QR mapping in database (Section 7)
    // This must happen AFTER provider is updated because of the foreign key constraint
    const { error: qrDbError } = await supabase
      .from('qr_codes')
      .upsert({
        client_id: clientId,
        qr_url: registrationUrl,
        qr_image_path: qrResult.imagePath,
      });

    if (qrDbError) {
      console.error('Error saving QR to DB:', qrDbError);
      // We don't throw here to avoid failing the whole approval if just the mapping fails, 
      // but in production we might want to.
    }

    revalidatePath('/providers');
    return { success: true, clientId, qrUrl: qrResult.imageUrl };
  } catch (error: any) {
    console.error('Error approving provider:', error);
    return { success: false, error: error.message };
  }
}


export async function rejectProvider(providerId: string, reason: string) {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase
      .from('providers')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', providerId);

    if (error) throw error;

    revalidatePath('/providers');
    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting provider:', error);
    return { success: false, error: error.message };
  }
}
