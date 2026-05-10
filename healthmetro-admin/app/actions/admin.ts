'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function approveProvider(providerId: string, stateCode: string, providerType: string) {
  const supabase = createAdminClient();

  try {
    // 1. Call the RPC function to generate the Client ID
    const { data: clientId, error: rpcError } = await supabase.rpc('generate_client_id', {
      p_state_code: stateCode,
      p_year: new Date().getFullYear(),
      p_type_code: providerType === 'Hospital' ? 'HOS' : 
                   providerType === 'Clinic' ? 'CLI' :
                   providerType === 'Individual Doctor' ? 'DOC' :
                   providerType === 'Pharmacy' ? 'PHY' :
                   providerType === 'Diagnostic Center' ? 'DIA' : 'OTH'
    });

    if (rpcError) throw rpcError;
    if (!clientId) throw new Error('Failed to generate Client ID');

    // 2. Generate QR Code
    const { generateAndUploadQRCode } = await import('@/utils/qr');
    const { generateToken } = await import('@/utils/crypto');
    
    const formsBaseUrl = process.env.NEXT_PUBLIC_FORMS_URL || 'https://healthmetro-forms.vercel.app';
    const token = generateToken(clientId);
    const registrationUrl = `${formsBaseUrl}/register/customer?client_id=${clientId}&token=${token}&src=qr`;
    
    const qrResult = await generateAndUploadQRCode(clientId, registrationUrl);
    if (!qrResult.success) throw new Error(qrResult.error);

    // 3. Store QR mapping in database (Section 7)
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

    // 4. Update the provider status and assign the new client ID
    const { error: updateError } = await supabase
      .from('providers')
      .update({
        status: 'approved',
        client_id: clientId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', providerId);

    if (updateError) throw updateError;

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
        reviewed_at: new Date().toISOString(),
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
