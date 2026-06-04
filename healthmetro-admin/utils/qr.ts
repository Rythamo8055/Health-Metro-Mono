import QRCode from 'qrcode';
import { createAdminClient } from './supabase/admin';

/**
 * Generates a QR code for a given URL and uploads it to Supabase storage.
 * Returns the public URL or storage path of the generated QR code.
 */
export async function generateAndUploadQRCode(clientId: string, targetUrl: string) {
  const supabase = createAdminClient();

  try {
    // 1. Generate QR Code as a Buffer (using SVG for best quality)
    // We'll use PNG for compatibility with more viewers if needed, 
    // but the doc says SVG is preferred for print. 
    // Let's generate PNG as a Buffer for easy upload.
    const qrBuffer = await QRCode.toBuffer(targetUrl, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 500,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const filename = `${clientId}.png`;
    const filepath = filename;

    // 2. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('qrcodes')
      .upload(filepath, qrBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading QR code:', uploadError);
      throw new Error(`Failed to upload QR code for ${clientId}`);
    }

    // 3. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('qrcodes')
      .getPublicUrl(filepath);

    return {
      success: true,
      imagePath: filepath,
      imageUrl: publicUrl,
    };
  } catch (error: any) {
    console.error('QR Generation failed:', error);
    return { success: false, error: error.message };
  }
}
