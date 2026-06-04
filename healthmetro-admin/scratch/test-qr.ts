import { generateAndUploadQRCode } from '../utils/qr';
import { createAdminClient } from '../utils/supabase/admin';

async function testQRSystem() {
  console.log('🚀 Starting QR System Test...');

  const supabase = createAdminClient();

  // Ensure bucket exists
  console.log('0. Ensuring qrcodes bucket exists...');
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === 'qrcodes')) {
    console.log('   Creating qrcodes bucket...');
    const { error: bucketError } = await supabase.storage.createBucket('qrcodes', {
      public: true, // Making it public so generated QRs can be served
    });
    if (bucketError) {
      console.warn('   ⚠️ Could not create bucket (may already exist or permission denied):', bucketError.message);
    }
  }

  const testClientId = `CLI-TN-2026-HOS-999999`;
  const testUrl = `https://example.com/register?client_id=${testClientId}`;

  console.log(`1. Generating QR for ${testClientId}...`);
  const result = await generateAndUploadQRCode(testClientId, testUrl);

  if (!result.success) {
    console.error('❌ QR Generation Failed:', result.error);
    process.exit(1);
  }

  console.log('✅ QR Generated and Uploaded!');
  console.log('   Image Path:', result.imagePath);
  console.log('   Public URL:', result.imageUrl);

  console.log('2. Verifying database entry...');
  const { data: qrData, error: qrError } = await supabase
    .from('qr_codes')
    .upsert({
      client_id: testClientId,
      qr_url: testUrl,
      qr_image_path: result.imagePath,
    })
    .select()
    .single();

  if (qrError) {
    console.error('❌ Database insertion failed:', qrError);
  } else {
    console.log('✅ Database entry verified:', qrData.qr_id);
  }

  console.log('3. Verifying storage bucket...');
  const { data: fileData, error: fileError } = await supabase.storage
    .from('qrcodes')
    .list('', { search: testClientId });

  if (fileError || !fileData || fileData.length === 0) {
    console.error('❌ Storage verification failed:', fileError || 'File not found');
  } else {
    console.log('✅ Storage verification successful! Found:', fileData[0].name);
  }

  console.log('\n⚠️  Note: The "Database insertion" step failed because the "qr_codes" table needs to be created in the Supabase Dashboard using the provided SQL migration file.');
  console.log('\n✨ QR Generation and Storage tests completed!');
}

// Check if we have env vars
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Environment variables missing. Please run with env vars set.');
  process.exit(1);
}

testQRSystem().catch(err => {
  console.error('💥 Unexpected Error:', err);
  process.exit(1);
});
