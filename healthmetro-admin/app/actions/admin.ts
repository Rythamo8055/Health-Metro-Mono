'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function approveProvider(providerId: string, stateCode: string, providerType: string) {
  const supabase = createAdminClient();

  try {
    // Fetch provider details first so we have contact info for notifications
    const { data: provider, error: fetchErr } = await supabase
      .from('providers')
      .select('provider_name, contact_name, email, mobile')
      .eq('id', providerId)
      .single();

    if (fetchErr || !provider) {
      throw new Error(`Failed to fetch provider details: ${fetchErr?.message || 'Provider not found'}`);
    }

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
    }

    // 5. Send WhatsApp Notification via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.WHATSAPP_FROM_NUMBER || '+14155238886';
    const to = provider.mobile;

    if (accountSid && authToken && to) {
      try {
        const whatsappMessage = `🟢 *Healthmetro®*\n\nDear *${provider.contact_name || provider.provider_name}*,\n\nYour registration has been *approved*! 🎉\n\n🆔 *Client ID:* ${clientId}\n🔗 *Registration Link:* ${registrationUrl}\n\nAttached is your unique Customer Registration QR Code. Please print and display this QR code at your desk so customers can scan it to book blood sample collections.\n\nThank you for partnering with Healthmetro®.`;

        console.log(`[Twilio Approval Notification] Sending WhatsApp to: ${to}...`);
        const twilioRes = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: `whatsapp:${to}`,
              From: `whatsapp:${from}`,
              Body: whatsappMessage,
              MediaUrl: qrResult.imageUrl || '',
            }),
          }
        );
        const twilioData = await twilioRes.json();
        if (!twilioRes.ok) {
          console.error('[Twilio Approval Notification] Failed:', twilioData.message);
        } else {
          console.log('[Twilio Approval Notification] Sent successfully. SID:', twilioData.sid);
        }
      } catch (err: any) {
        console.error('[Twilio Approval Notification] Exception:', err.message);
      }
    } else {
      console.warn('[Twilio Approval Notification] Skipped: Twilio keys or provider mobile number missing.');
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

export async function getDocumentSignedUrl(path: string) {
  const supabase = createAdminClient();
  try {
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 900); // 15 minutes expiry
    if (error) throw error;
    return { success: true, url: data.signedUrl };
  } catch (error: any) {
    console.error('Error creating signed URL:', error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = createAdminClient();
  try {
    const { error } = await supabase
      .from('appointment_requests')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (error) throw error;

    revalidatePath('/leads');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return { success: false, error: error.message };
  }
}

