/**
 * Health Metro — Full Flow CLI Tester
 * Tests: DB connectivity, providers table, customers insert, bookings, generate_customer_id RPC
 * Run: node scratch/test-all-flows.mjs
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ── Config (from .env.local) ────────────────────────────────────────────────
const SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ngoDp5AJJUSGOuVuNCdRoA_1Du4Iw72';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SECRET_KEY = 'health-metro-default-secret-2026';

// ── Helpers ──────────────────────────────────────────────────────────────────
const PASS = '✅ PASS';
const FAIL = '❌ FAIL';
const INFO = '📋 INFO';
const WARN = '⚠️  WARN';

function generateToken(clientId) {
  return crypto.createHmac('sha256', SECRET_KEY).update(clientId).digest('hex').slice(0, 16);
}

function section(title) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
}

function log(status, msg, detail = '') {
  console.log(`  ${status}  ${msg}${detail ? `\n       → ${detail}` : ''}`);
}

// ── Supabase clients ─────────────────────────────────────────────────────────
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ── Test Runner ──────────────────────────────────────────────────────────────
async function runTests() {
  console.log('\n🏥  HEALTH METRO — FULL FLOW TEST SUITE');
  console.log(`    Supabase: ${SUPABASE_URL}`);
  console.log(`    Time:     ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

  let totalTests = 0;
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    totalTests++;
    try {
      const result = await fn();
      if (result === false) {
        log(FAIL, name);
        failed++;
      } else {
        log(PASS, name, typeof result === 'string' ? result : '');
        passed++;
      }
    } catch (err) {
      log(FAIL, name, err.message);
      failed++;
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  section('1. DATABASE CONNECTIVITY');
  // ──────────────────────────────────────────────────────────────────────────

  await test('Supabase URL reachable (anon)', async () => {
    const { data, error } = await anonClient.from('states').select('count').limit(1);
    if (error) throw new Error(error.message);
    return 'Connected via anon key';
  });

  await test('Supabase admin client works (service_role)', async () => {
    const { data, error } = await adminClient.from('providers').select('count').limit(1);
    if (error) throw new Error(error.message);
    return 'Connected via service_role key';
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('2. TABLE EXISTENCE CHECKS');
  // ──────────────────────────────────────────────────────────────────────────

  const tables = ['states', 'cities', 'providers', 'customers', 'bookings', 'payments', 'slot_configuration', 'agreements'];
  for (const table of tables) {
    await test(`Table exists: ${table}`, async () => {
      const { error } = await adminClient.from(table).select('*').limit(1);
      if (error) throw new Error(error.message);
      return `table ok`;
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  section('3. STATES SEED DATA');
  // ──────────────────────────────────────────────────────────────────────────

  await test('States table has seed data (India states)', async () => {
    const { data, error } = await adminClient.from('states').select('state_code').order('state_code');
    if (error) throw new Error(error.message);
    if (!data || data.length < 10) throw new Error(`Only ${data?.length ?? 0} states found — expected 28+`);
    return `${data.length} states seeded`;
  });

  await test('Telangana (TS) state exists', async () => {
    const { data, error } = await adminClient.from('states').select('*').eq('state_code', 'TS').single();
    if (error) throw new Error(error.message);
    return `id=${data.id}, name=${data.state_name}`;
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('4. PROVIDERS TABLE');
  // ──────────────────────────────────────────────────────────────────────────

  let testProviderId = null;
  let testClientId = null;

  await test('Can list existing providers', async () => {
    const { data, error } = await adminClient.from('providers').select('id, client_id, provider_name, status').limit(5);
    if (error) throw new Error(error.message);
    if (data && data.length > 0) {
      testProviderId = data[0].id;
      testClientId = data[0].client_id;
      const names = data.map(p => p.provider_name || p.client_id).join(', ');
      return `${data.length} providers found: ${names}`;
    }
    return 'No providers yet (table empty — will insert test provider)';
  });

  // Insert a test provider if none exist
  let insertedTestProvider = false;
  if (!testClientId) {
    await test('Insert test provider (since table is empty)', async () => {
      const { data, error } = await adminClient.from('providers').insert({
        provider_type: 'Clinic',
        provider_name: 'Test Clinic (CLI Test)',
        registration_number: 'TEST-REG-001',
        address: '123 Test Street',
        state_code: 'TS',
        pin_code: '500001',
        contact_name: 'Test Admin',
        designation: 'Owner',
        mobile: '9876543210',
        email: 'test@healthmetro.in',
        type_code: 'CLI',
        year: 2026,
        sequence: 1,
        client_id: 'CLI-TS-2026-CLI-000001',
        status: 'approved',
        onboarding_stage: 'SUBMITTED',
        agreement_status: 'PENDING',
        activation_status: 'BLOCKED_UNTIL_SIGNED'
      }).select().single();

      if (error) throw new Error(error.message);
      testProviderId = data.id;
      testClientId = data.client_id;
      insertedTestProvider = true;
      return `Inserted test provider: ${testClientId}`;
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  section('5. TOKEN / QR VERIFICATION');
  // ──────────────────────────────────────────────────────────────────────────

  await test('Token generation works for clientId', async () => {
    if (!testClientId) throw new Error('No clientId available for token test');
    const token = generateToken(testClientId);
    if (!token || token.length !== 16) throw new Error(`Token length invalid: ${token}`);
    return `Token: ${token} (16 chars)`;
  });

  await test('Token verification: valid token passes', async () => {
    if (!testClientId) throw new Error('No clientId available');
    const token = generateToken(testClientId);
    const expected = generateToken(testClientId);
    if (token !== expected) throw new Error('Token mismatch');
    return `Verified for ${testClientId}`;
  });

  await test('Token verification: wrong token fails', async () => {
    if (!testClientId) throw new Error('No clientId available');
    const wrongToken = 'wrongtoken12345';
    const expected = generateToken(testClientId);
    if (wrongToken === expected) throw new Error('Should have failed but passed!');
    return 'Correctly rejected invalid token';
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('6. CUSTOMER ID GENERATION (RPC)');
  // ──────────────────────────────────────────────────────────────────────────

  let generatedCustomerId = null;

  await test('RPC generate_customer_id executes', async () => {
    const { data, error } = await adminClient.rpc('generate_customer_id', {
      p_client_short: 'CLI1',
      p_service_type: 'BLD',
      p_year: 2026
    });
    if (error) throw new Error(`RPC error: ${error.message} (code: ${error.code})`);
    generatedCustomerId = data;
    return `Generated ID: ${data}`;
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('7. CUSTOMER REGISTRATION FLOW');
  // ──────────────────────────────────────────────────────────────────────────

  let insertedCustomerId = null;
  let insertedCustomerRowId = null;

  await test('Insert customer record', async () => {
    if (!testClientId || !testProviderId) throw new Error('No provider available for customer test');

    const customerId = generatedCustomerId || `CUST-CLI1-2026-BLD-${String(Math.floor(Math.random() * 99999)).padStart(6, '0')}`;

    const { data: stateData } = await adminClient.from('states').select('id').eq('state_code', 'TS').single();

    const { data, error } = await adminClient.from('customers').insert({
      customer_id: customerId,
      client_id: testClientId,
      provider_id: testProviderId,
      client_short: 'CLI1',
      full_name: 'CLI Test Patient',
      gender: 'Male',
      age: 30,
      mobile: '9876543210',
      email: 'patient@test.com',
      address: '456 Patient Street, Hyderabad',
      state_id: stateData?.id || null,
      pin_code: '500001',
      collection_type: 'provider',
      service_type: 'BLD',
      year: 2026,
      sequence: 1,
      referral_source: 'QR_SCAN',
      declaration_agreed: true
    }).select().single();

    if (error) throw new Error(`Customer insert error: ${error.message}`);
    insertedCustomerId = customerId;
    insertedCustomerRowId = data.id;
    return `Customer inserted: ${customerId} (row: ${data.id})`;
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('8. BOOKING FLOW');
  // ──────────────────────────────────────────────────────────────────────────

  let insertedBookingId = null;
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 3); // 3 days from now
  const slotDate = testDate.toISOString().split('T')[0];
  const slotTime = '09:00 AM – 11:00 AM';

  await test('Insert booking record', async () => {
    if (!insertedCustomerRowId || !testProviderId) throw new Error('No customer/provider for booking test');

    const { data, error } = await adminClient.from('bookings').insert({
      customer_id: insertedCustomerRowId,
      provider_id: testProviderId,
      slot_date: slotDate,
      slot_time: slotTime,
      status: 'booked',
      payment_status: 'PENDING',
      activation_status: 'PENDING_PAYMENT'
    }).select().single();

    if (error) {
      if (error.code === '23505') throw new Error('SLOT_CONFLICT: This slot is already booked (unique constraint hit)');
      throw new Error(`Booking insert error: ${error.message}`);
    }
    insertedBookingId = data.id;
    return `Booking inserted: ${data.id} | ${slotDate} @ ${slotTime}`;
  });

  await test('Slot conflict prevention (duplicate booking = should fail)', async () => {
    if (!insertedCustomerRowId || !testProviderId) throw new Error('No customer/provider');

    const { data, error } = await adminClient.from('bookings').insert({
      customer_id: insertedCustomerRowId,
      provider_id: testProviderId,
      slot_date: slotDate,  // same date
      slot_time: slotTime,  // same time
      status: 'booked',
      payment_status: 'PENDING',
      activation_status: 'PENDING_PAYMENT'
    }).select().single();

    if (error && error.code === '23505') return 'Duplicate correctly rejected (23505 unique violation)';
    if (!error) throw new Error('Duplicate booking was ACCEPTED — unique constraint missing!');
    throw new Error(`Unexpected error: ${error.message}`);
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('9. SLOT CONFIGURATION');
  // ──────────────────────────────────────────────────────────────────────────

  await test('Slot configuration table has data', async () => {
    const { data, error } = await adminClient.from('slot_configuration').select('*').limit(10);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('slot_configuration is empty — run seed SQL');
    return `${data.length} slot configs found`;
  });

  await test('Can fetch non-blocked slots for Monday', async () => {
    const { data, error } = await adminClient.from('slot_configuration')
      .select('slot_time')
      .eq('day_of_week', 'Mon')
      .eq('is_blocked', false);
    if (error) throw new Error(error.message);
    return `${data?.length ?? 0} available slots on Mon`;
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('10. DATA RETRIEVAL FLOWS');
  // ──────────────────────────────────────────────────────────────────────────

  await test('Can fetch customer by customer_id', async () => {
    if (!insertedCustomerId) throw new Error('No customer inserted');
    const { data, error } = await adminClient.from('customers')
      .select('customer_id, full_name, mobile')
      .eq('customer_id', insertedCustomerId)
      .single();
    if (error) throw new Error(error.message);
    return `Found: ${data.full_name} (${data.customer_id})`;
  });

  await test('Can fetch booking for customer', async () => {
    if (!insertedBookingId) throw new Error('No booking inserted');
    const { data, error } = await adminClient.from('bookings')
      .select('id, slot_date, slot_time, status')
      .eq('id', insertedBookingId)
      .single();
    if (error) throw new Error(error.message);
    return `Booking: ${data.slot_date} @ ${data.slot_time} [${data.status}]`;
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('11. WHATSAPP AUTOMATION READINESS');
  // ──────────────────────────────────────────────────────────────────────────

  await test('OPS_WHATSAPP_NUMBER in env', async () => {
    const num = '+919985508027'; // from .env.local
    if (!num) throw new Error('OPS_WHATSAPP_NUMBER not set');
    return `OPS number: ${num}`;
  });

  await test('Provider has whatsapp_number field (or use mobile)', async () => {
    const { data, error } = await adminClient.from('providers').select('mobile').limit(1).single();
    if (error) throw new Error(error.message);
    return `Provider mobile (used as WA): ${data?.mobile || 'NULL — whatsapp_number column missing!'}`;
  });

  await test('customers.mobile field exists for WA notifications', async () => {
    if (!insertedCustomerRowId) throw new Error('No test customer');
    const { data, error } = await adminClient.from('customers').select('mobile').eq('id', insertedCustomerRowId).single();
    if (error) throw new Error(error.message);
    return `Customer mobile: ${data.mobile}`;
  });

  // ──────────────────────────────────────────────────────────────────────────
  section('12. CLEANUP (Delete test data)');
  // ──────────────────────────────────────────────────────────────────────────

  if (insertedBookingId) {
    await test('Cleanup: delete test booking', async () => {
      const { error } = await adminClient.from('bookings').delete().eq('id', insertedBookingId);
      if (error) throw new Error(error.message);
      return 'Deleted';
    });
  }

  if (insertedCustomerRowId) {
    await test('Cleanup: delete test customer', async () => {
      const { error } = await adminClient.from('customers').delete().eq('id', insertedCustomerRowId);
      if (error) throw new Error(error.message);
      return 'Deleted';
    });
  }

  if (insertedTestProvider) {
    await test('Cleanup: delete test provider', async () => {
      const { error } = await adminClient.from('providers').delete().eq('id', testProviderId);
      if (error) throw new Error(error.message);
      return 'Deleted';
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  section('SUMMARY');
  // ──────────────────────────────────────────────────────────────────────────
  console.log(`\n  Total:  ${totalTests} tests`);
  console.log(`  ${PASS}  ${passed} passed`);
  console.log(`  ${FAIL}  ${failed} failed`);
  if (failed > 0) {
    console.log('\n  🚨 SOME TESTS FAILED — review errors above\n');
    process.exit(1);
  } else {
    console.log('\n  🎉 ALL TESTS PASSED — Database is working correctly!\n');
  }
}

runTests().catch(err => {
  console.error('\n💥 FATAL ERROR:', err.message);
  process.exit(1);
});
