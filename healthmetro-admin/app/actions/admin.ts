'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function approveProvider(providerId: string, stateCode: string, providerType: string) {
  const supabase = createAdminClient();

  try {
    // Call the RPC function to generate the Client ID
    const { data: clientId, error: rpcError } = await supabase.rpc('generate_client_id', {
      p_state_code: stateCode,
      p_provider_type: providerType,
    });

    if (rpcError) throw rpcError;
    if (!clientId) throw new Error('Failed to generate Client ID');

    // Update the provider status and assign the new client ID
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
    return { success: true, clientId };
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
