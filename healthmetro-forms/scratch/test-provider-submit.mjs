/**
 * Health Metro — Provider Submit CLI Tester
 * Tests: Uploading a dummy file to 'documents' bucket, inserting a provider record.
 * Run: node scratch/test-provider-submit.mjs
 */

import { createClient } from '@supabase/supabase-js';

// ── Config (from .env.local) ────────────────────────────────────────────────
const SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
}

function log(status, msg, detail = '') {
  console.log(`  ${status}  ${msg}${detail ? `\n       → ${detail}` : ''}`);
}

async function runTests() {
  console.log('\n🏥  HEALTH METRO — PROVIDER SUBMIT TEST');
  
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      const result = await fn();
      if (result === false) {
        log('❌ FAIL', name);
        failed++;
      } else {
        log('✅ PASS', name, typeof result === 'string' ? result : '');
        passed++;
      }
    } catch (err) {
      log('❌ FAIL', name, err.message);
      failed++;
    }
  };

  section('1. STORAGE BUCKET TEST');
  
  let uploadedPath = null;
  await test('Upload dummy file to "documents" bucket', async () => {
    // Create a dummy text file content as Blob/File equivalent buffer
    const dummyContent = Buffer.from('This is a test document for CLI testing.');
    const filename = `test_upload_${Date.now()}.txt`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`providers/${filename}`, dummyContent, {
        contentType: 'text/plain',
        upsert: false
      });
      
    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }
    
    uploadedPath = data.path;
    return `Uploaded successfully to: ${data.path}`;
  });

  section('2. PROVIDER DB INSERT TEST');
  
  let insertedProviderId = null;
  await test('Insert test provider via admin client (simulating provider.ts)', async () => {
    const data = {
      provider_type: 'Clinic',
      provider_name: 'CLI Diagnostic Test Clinic',
      registration_number: 'REG-CLI-999',
      gst_number: 'GST999',
      address: '123 Test Ave',
      state_code: 'TS',
      pin_code: '500001',
      contact_name: 'Admin User',
      designation: 'Manager',
      mobile: '9999999999',
      email: 'test@clinic.com',
      account_holder_name: 'Test Clinic',
      bank_name: 'Test Bank',
      account_no: '123456789',
      ifsc_code: 'TEST0001234'
    };

    const bankDetails = {
      account_holder_name: data.account_holder_name,
      bank_name: data.bank_name,
      account_no: data.account_no,
      ifsc_code: data.ifsc_code,
    };

    const typeCode = 'CLI';
    const year = new Date().getFullYear();

    const documentUrls = {};
    if (uploadedPath) {
      documentUrls.license = uploadedPath;
    }

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
      throw new Error(`DB Insert failed: ${insertError.message} (Code: ${insertError.code})`);
    }

    insertedProviderId = insertData.id;
    return `Provider inserted OK. ID: ${insertData.id}`;
  });

  section('3. CLEANUP');
  
  if (uploadedPath) {
    await test('Delete test uploaded file', async () => {
      const { error } = await supabase.storage.from('documents').remove([uploadedPath]);
      if (error) throw new Error(error.message);
      return 'File deleted';
    });
  }

  if (insertedProviderId) {
    await test('Delete test provider from DB', async () => {
      const { error } = await supabase.from('providers').delete().eq('id', insertedProviderId);
      if (error) throw new Error(error.message);
      return 'Provider deleted';
    });
  }

  console.log('\n  Total:', passed + failed);
  console.log(`  ✅ PASS ${passed}`);
  console.log(`  ❌ FAIL ${failed}\n`);
}

runTests().catch(err => {
  console.error('Fatal Error:', err);
});
