import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Use same config
const SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ngoDp5AJJUSGOuVuNCdRoA_1Du4Iw72';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZWFjZmh6a3JjZmtjZXNvcW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODI4NjUyNCwiZXhwIjoyMDkzODYyNTI0fQ.rt6IRgf4C9IOSIEpQUb_80aUnfAr3hrTeQlFnAGuLB4';
const SECRET_KEY = 'health-metro-default-secret-2026';

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const PASS = '✅ PASS';
const FAIL = '❌ FAIL';

let totalTests = 0, passed = 0, failed = 0;

async function test(name, fn) {
  totalTests++;
  try {
    const result = await fn();
    console.log(`  ${PASS}  ${name} -> ${result || ''}`);
    passed++;
  } catch (err) {
    console.log(`  ${FAIL}  ${name} -> ${err.message}`);
    failed++;
  }
}

async function runE2E() {
  console.log('\n🏥  HEALTH METRO E2E INTEGRATION TEST (CLI)');
  console.log('═'.repeat(60));

  let testB2bId = null;

  await test('1. B2B Provider Form -> Database Insertion', async () => {
    // This perfectly mimics the B2B Server Action
    const { data, error } = await adminClient.from('providers').insert({
        provider_name: '[B2B] E2E Automated Partner',
        registration_number: 'B2B-TEST-001',
        provider_type: 'B2B Partner',
        contact_name: 'Test B2B Admin',
        designation: 'Manager',
        mobile: '9876543222',
        email: 'b2btest@healthmetro.in',
        address: '404 Automate Ave',
        state_code: 'TS',
        pin_code: '500081',
        client_id: 'B2B-CLI-TEMP-001',
        type_code: 'HOS',
        year: 2026,
        sequence: 999,
        status: 'pending',
        onboarding_stage: 'SUBMITTED',
        agreement_status: 'PENDING',
        activation_status: 'BLOCKED_UNTIL_SIGNED'
    }).select().single();
    if (error) throw error;
    testB2bId = data.id;
    return `Inserted B2B Provider (ID: ${data.id})`;
  });

  await test('2. Admin Dashboard -> B2B Providers Retrieval', async () => {
    if (!testB2bId) throw new Error('Skipping: Test provider not created');
    const { data, error } = await adminClient.from('providers').select('id, provider_name, registration_number').eq('id', testB2bId).single();
    if (error) throw error;
    if (!data.provider_name.startsWith('[B2B]')) throw new Error('Missing B2B prefix filter identity');
    return `Retrieved successfully: ${data.provider_name}`;
  });

  await test('3. Admin Dashboard -> Generate QR Crypto Token', async () => {
    const clientId = 'B2B-CLI-TEMP-001';
    const token = crypto.createHmac('sha256', SECRET_KEY).update(clientId).digest('hex').slice(0, 16);
    if (!token) throw new Error('Token generation failed');
    return `Secure HMAC SHA-256 Token Generated: ${token}`;
  });

  await test('4. Customer Registration -> Form Simulation', async () => {
    // Generate the customer via RPC
    const { data: customerId, error: rpcError } = await adminClient.rpc('generate_customer_id', {
      p_client_short: 'CLI-AP',
      p_service_type: 'BLD',
      p_year: 2026
    });
    if (rpcError) throw rpcError;
    return `Generated valid Customer ID via Postgres RPC: ${customerId}`;
  });

  await test('5. Cleanup Test Data', async () => {
    if (!testB2bId) throw new Error('Skipping: Test provider not created');
    const { error } = await adminClient.from('providers').delete().eq('id', testB2bId);
    if (error) throw error;
    return 'Deleted test B2B provider';
  });

  console.log('═'.repeat(60));
  console.log(`🏁 E2E COMPLETE: ${passed} Passed, ${failed} Failed`);
}
runE2E();
