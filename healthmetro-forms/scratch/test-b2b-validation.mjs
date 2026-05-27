/**
 * Health Metro — B2B PAN Card & Duplicate Prevention Tester
 * Directly imports and tests the B2B server action under all conditions.
 * Run: node scratch/test-b2b-validation.mjs
 */

import { createClient } from '@supabase/supabase-js';

// 1. Programmatically supply the Supabase environment variables so the server action can load them
const SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZWFjZmh6a3JjZmtjZXNvcW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODI4NjUyNCwiZXhwIjoyMDkzODYyNTI0fQ.rt6IRgf4C9IOSIEpQUb_80aUnfAr3hrTeQlFnAGuLB4';

process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_ROLE_KEY;

// Import the server action directly
import { submitB2BRegistration } from '../src/app/actions/b2b.ts';

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const PASS = '✅ PASS';
const FAIL = '❌ FAIL';

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    const result = await fn();
    console.log(`  ${PASS}  ${name} -> ${result || ''}`);
    passed++;
  } catch (err) {
    console.log(`  ${FAIL}  ${name} -> ${err.message}`);
    failed++;
  }
}

async function runB2BValidationTests() {
  console.log('\n🏥  HEALTH METRO — B2B PAN CARD & DUPLICATE PREVENTION VALIDATION');
  console.log('═'.repeat(70));

  // Generate unique credentials for this test run
  const testMobile = '987' + Math.floor(1000000 + Math.random() * 9000000).toString().slice(0, 7); // 10 digit unique number
  const testPan = 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'F';
  let createdProviderId = null;

  console.log(`ℹ️  Using unique test credentials:`);
  console.log(`   Mobile: ${testMobile}`);
  console.log(`   PAN Card: ${testPan}\n`);

  // First, verify if schema is updated or has missing column
  const { error: schemaCheck } = await adminClient.from('providers').select('pan_number').limit(1);
  if (schemaCheck && schemaCheck.message.includes('column "pan_number" does not exist')) {
    console.log(`🚨 SCHEMA WARNING: Column 'pan_number' does not exist in 'providers' table!`);
    console.log(`   Please execute this command in your Supabase SQL Editor:`);
    console.log(`   ALTER TABLE providers ADD COLUMN IF NOT EXISTS pan_number VARCHAR(10);`);
    console.log(`═`.repeat(70));
    return;
  }

  // Test 1: Successful Registration
  await test('1. Successful B2B registration with unique credentials', async () => {
    const data = {
      provider_type: 'Clinic',
      contact_name: 'Test Automation Admin',
      address: '404 Automated Test Boulevard',
      state_code: 'TS',
      pin_code: '500081',
      designation: 'QA Lead',
      mobile: testMobile,
      email: 'qa_auto@healthmetro.in',
      pan_number: testPan
    };

    const result = await submitB2BRegistration(data);
    if (!result.success) {
      throw new Error(`Submission failed: ${result.error}`);
    }
    
    createdProviderId = result.provider.id;
    return `Success (Provider ID: ${createdProviderId})`;
  });

  if (!createdProviderId) {
    console.log('\n❌ Primary registration failed. Skipping remaining duplication tests.');
    console.log('═'.repeat(70));
    return;
  }

  // Test 2: Duplicate registration (both Mobile and PAN match)
  await test('2. Prevent duplicate registration (Same Mobile + Same PAN)', async () => {
    const duplicateData = {
      provider_type: 'Clinic',
      contact_name: 'Test Automation Admin',
      address: '404 Automated Test Boulevard',
      state_code: 'TS',
      pin_code: '500081',
      designation: 'QA Lead',
      mobile: testMobile,
      email: 'qa_auto_dup@healthmetro.in',
      pan_number: testPan
    };

    const result = await submitB2BRegistration(duplicateData);
    if (result.success) {
      throw new Error('Registration should have been blocked, but succeeded.');
    }

    const expectedError = 'A client is already registered with us using this mobile number and PAN card. If you believe this is an error or need assistance, please contact our partner support team.';
    if (result.error !== expectedError) {
      throw new Error(`Wrong error message returned: "${result.error}"`);
    }

    return `Correctly blocked! Message: "${result.error.slice(0, 40)}..."`;
  });

  // Test 3: Duplicate PAN only
  await test('3. Prevent duplicate registration (New Mobile + Same PAN)', async () => {
    const duplicatePanData = {
      provider_type: 'Clinic',
      contact_name: 'Different Name',
      address: '404 Automated Test Boulevard',
      state_code: 'TS',
      pin_code: '500081',
      designation: 'QA Lead',
      mobile: '986' + testMobile.slice(3), // New mobile
      email: 'qa_auto_pan_dup@healthmetro.in',
      pan_number: testPan // Same PAN
    };

    const result = await submitB2BRegistration(duplicatePanData);
    if (result.success) {
      throw new Error('Registration should have been blocked (duplicate PAN), but succeeded.');
    }

    const expectedError = 'This PAN card number is already associated with an existing account. Please reach out to our support team for assistance.';
    if (result.error !== expectedError) {
      throw new Error(`Wrong error message: "${result.error}"`);
    }

    return `Correctly blocked! Message: "${result.error.slice(0, 40)}..."`;
  });

  // Test 4: Duplicate Mobile only
  await test('4. Prevent duplicate registration (Same Mobile + New PAN)', async () => {
    const duplicateMobileData = {
      provider_type: 'Clinic',
      contact_name: 'Different Name',
      address: '404 Automated Test Boulevard',
      state_code: 'TS',
      pin_code: '500081',
      designation: 'QA Lead',
      mobile: testMobile, // Same Mobile
      email: 'qa_auto_mob_dup@healthmetro.in',
      pan_number: 'XYZPD9999M' // New PAN
    };

    const result = await submitB2BRegistration(duplicateMobileData);
    if (result.success) {
      throw new Error('Registration should have been blocked (duplicate Mobile), but succeeded.');
    }

    const expectedError = 'This mobile number is already associated with an existing account. Please reach out to our support team for assistance.';
    if (result.error !== expectedError) {
      throw new Error(`Wrong error message: "${result.error}"`);
    }

    return `Correctly blocked! Message: "${result.error.slice(0, 40)}..."`;
  });

  // Test 5: PAN Card Validation Regex check
  await test('5. Reject invalid PAN format registration', async () => {
    const invalidPanData = {
      provider_type: 'Clinic',
      contact_name: 'Valid Name',
      address: '404 Automated Test Boulevard',
      state_code: 'TS',
      pin_code: '500081',
      designation: 'QA Lead',
      mobile: '9111111111',
      email: 'qa_invalid_pan@healthmetro.in',
      pan_number: '12345ABCDE' // Invalid format (should be letters first)
    };

    const result = await submitB2BRegistration(invalidPanData);
    if (result.success) {
      throw new Error('Registration should have been blocked due to invalid PAN format.');
    }

    return `Correctly blocked! Error: "${result.error}"`;
  });

  // Cleanup
  console.log('\n🧹  Cleaning up test data...');
  const { error: deleteError } = await adminClient.from('providers').delete().eq('id', createdProviderId);
  if (deleteError) {
    console.log(`⚠️  Failed to delete test provider: ${deleteError.message}`);
  } else {
    console.log('✅ Deleted test provider successfully.');
  }

  console.log('═'.repeat(70));
  console.log(`🏁 TESTS COMPLETE: ${passed} Passed, ${failed} Failed\n`);
}

runB2BValidationTests().catch(err => {
  console.error('\n💥 FATAL TEST SUITE ERROR:', err);
});
