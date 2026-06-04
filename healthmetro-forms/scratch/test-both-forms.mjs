/**
 * Health Metro — COMPREHENSIVE FORM SUBMIT TESTER
 * Tests BOTH provider registration AND customer registration flows end-to-end
 * No browser needed — calls the same Supabase logic the actions use.
 *
 * Run: node scratch/test-both-forms.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const log  = (ok, msg, detail='') => console.log(`  ${ok ? '✅' : '❌'} ${msg}${detail ? `\n     → ${detail}` : ''}`);
const sep  = title => { console.log(`\n${'═'.repeat(62)}\n  ${title}\n${'═'.repeat(62)}`); };
const fail = (msg, detail) => { log(false, msg, detail); };

let passed = 0, failed = 0;
const cleanup = { providerIds: [], customerIds: [], bookingIds: [], storagePaths: [] };

async function test(name, fn) {
  try {
    const r = await fn();
    if (r === false) { fail(name); failed++; }
    else { log(true, name, typeof r === 'string' ? r : ''); passed++; }
  } catch (e) {
    fail(name, e.message); failed++;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// SECTION A  — PROVIDER REGISTRATION (mirrors provider.ts exactly)
// ────────────────────────────────────────────────────────────────────────────
async function testProviderFlow() {
  sep('A. PROVIDER REGISTRATION FORM (provider.ts simulation)');

  // ── A1: Storage upload (licenseFile) ──
  let uploadPath = null;
  await test('A1: Upload license file to documents bucket', async () => {
    const content = Buffer.from('Dummy license certificate content');
    const filename = `license_cli_test_${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`providers/${filename}`, content, { contentType: 'application/pdf', upsert: false });
    if (error) throw new Error(error.message);
    uploadPath = data.path;
    cleanup.storagePaths.push(uploadPath);
    return `Uploaded → ${uploadPath}`;
  });

  // ── A2: Upload idProofFile ──
  let idProofPath = null;
  await test('A2: Upload ID proof file to documents bucket', async () => {
    const content = Buffer.from('Dummy Aadhaar scan');
    const filename = `id_proof_cli_test_${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`providers/${filename}`, content, { contentType: 'application/pdf', upsert: false });
    if (error) throw new Error(error.message);
    idProofPath = data.path;
    cleanup.storagePaths.push(idProofPath);
    return `Uploaded → ${idProofPath}`;
  });

  // ── A3: DB insert (exact same payload as provider.ts) ──
  let providerId = null;
  let providerClientId = null;
  await test('A3: Insert provider record to DB (status=pending)', async () => {
    const typeMapping = {
      'Hospital': 'HOS', 'Clinic': 'CLI', 'Individual Doctor': 'DOC',
      'Pharmacy': 'PHY', 'Diagnostic Center': 'DIA', 'Other': 'OTH'
    };
    const providerType = 'Clinic';
    const typeCode = typeMapping[providerType];
    const year = new Date().getFullYear();
    const bankDetails = {
      account_holder_name: 'Test Clinic', bank_name: 'HDFC Bank',
      account_no: '987654321012', ifsc_code: 'HDFC0001234'
    };
    const documentUrls = {
      license: uploadPath || 'providers/test.pdf',
      id_proof: idProofPath || 'providers/test2.pdf'
    };

    const { data, error } = await supabase.from('providers').insert({
      provider_type: providerType,
      provider_name: 'CLI Full Test Clinic',
      registration_number: 'REG-CLI-FULLTEST-001',
      gst_number: '29ABCDE1234F1Z5',
      address: '456 Test Street, Test Nagar',
      state_code: 'AP',
      city_id: null,
      pin_code: '500001',
      contact_name: 'Test Manager',
      designation: 'Manager',
      mobile: '9876543210',
      email: 'test.clinic@healthmetro.in',
      bank_details: bankDetails,
      documents: documentUrls,
      type_code: typeCode,
      year: year,
      status: 'pending',
      onboarding_stage: 'SUBMITTED',
      agreement_status: 'PENDING',
      activation_status: 'BLOCKED_UNTIL_SIGNED'
    }).select().single();

    if (error) throw new Error(`${error.message} (code: ${error.code})`);
    providerId = data.id;
    cleanup.providerIds.push(providerId);
    return `Provider inserted → ID: ${data.id} | Status: ${data.status}`;
  });

  // ── A4: Admin approval (mirrors admin.ts approveProvider) ──
  await test('A4: Admin approves provider (generate_client_id RPC + update)', async () => {
    if (!providerId) throw new Error('No provider to approve (A3 failed)');
    const year = new Date().getFullYear();
    const typeCode = 'CLI';
    const stateCode = 'AP';

    // Call the same RPC admin.ts uses
    const { data: clientId, error: rpcError } = await supabase.rpc('generate_client_id', {
      p_state_code: stateCode,
      p_year: year,
      p_type_code: typeCode,
      p_provider_id: providerId
    });
    if (rpcError) throw new Error(`RPC error: ${rpcError.message}`);
    if (!clientId) throw new Error('RPC returned no clientId');

    const parts = clientId.split('-');
    const sequence = parseInt(parts[parts.length - 1], 10);

    const { error: updateError } = await supabase.from('providers').update({
      status: 'approved',
      client_id: clientId,
      state_code: stateCode,
      year: year,
      type_code: typeCode,
      sequence: sequence,
      updated_at: new Date().toISOString()
    }).eq('id', providerId);

    if (updateError) throw new Error(updateError.message);
    providerClientId = clientId;
    return `Approved → client_id: ${clientId}`;
  });

  // ── A5: Verify provider can now be looked up by client_id (what customer form does) ──
  await test('A5: Verify approved provider lookup (customer form prereq)', async () => {
    if (!providerClientId) throw new Error('No client_id (A4 failed)');
    const { data, error } = await supabase.from('providers')
      .select('id, client_id, type_code, sequence, status')
      .eq('client_id', providerClientId)
      .single();
    if (error || !data) throw new Error(error?.message || 'Provider not found');
    if (data.status !== 'approved') throw new Error(`Status is ${data.status}, expected approved`);
    return `Found → ${data.client_id} | type: ${data.type_code} | seq: ${data.sequence}`;
  });

  return { providerId, providerClientId };
}

// ────────────────────────────────────────────────────────────────────────────
// SECTION B  — CUSTOMER REGISTRATION (mirrors customer.ts exactly)
// ────────────────────────────────────────────────────────────────────────────
async function testCustomerFlow(providerClientId, providerId) {
  sep('B. CUSTOMER REGISTRATION FORM (customer.ts simulation)');

  let customerId = null;
  let customerUUID = null;
  let bookingId = null;
  const testClientId = providerClientId || 'CLI-AP-2026-HOS-000001'; // fallback to existing valid one

  // ── B1: Lookup provider by client_id (Step 2 of customer.ts) ──
  let providerData = null;
  await test('B1: Lookup provider by client_id (token validation step)', async () => {
    const { data, error } = await supabase.from('providers')
      .select('id, client_id, type_code, sequence, status')
      .eq('client_id', testClientId)
      .single();
    if (error || !data) throw new Error(error?.message || `No provider found for client_id=${testClientId}`);
    if (!data.type_code || !data.sequence) throw new Error(`Provider missing type_code or sequence! (client_id=${testClientId})`);
    providerData = data;
    return `Found → ${data.client_id} | type: ${data.type_code} | seq: ${data.sequence}`;
  });

  // ── B2: Build client_short (what customer.ts derives) ──
  let clientShort = null;
  await test('B2: Build client_short from provider data', async () => {
    if (!providerData) throw new Error('No providerData (B1 failed)');
    clientShort = `${providerData.type_code}${providerData.sequence}`;
    return `client_short = "${clientShort}"`;
  });

  // ── B3: generate_customer_id RPC ──
  await test('B3: Call generate_customer_id RPC', async () => {
    if (!clientShort) throw new Error('No clientShort (B2 failed)');
    const year = new Date().getFullYear();
    const { data, error } = await supabase.rpc('generate_customer_id', {
      p_client_short: clientShort,
      p_service_type: 'BLD',
      p_year: year
    });
    if (error) throw new Error(error.message);
    if (!data) throw new Error('RPC returned null');
    customerId = data;
    return `Generated → ${data}`;
  });

  // ── B4: Insert customer record (mirrors customer.ts exactly — uses state_id not state_code) ──
  await test('B4: Insert customer record to DB', async () => {
    if (!customerId || !providerData) throw new Error('Missing customerId or providerData');
    const year = new Date().getFullYear();
    const parts = customerId.split('-');
    const seq = parseInt(parts[parts.length - 1], 10);

    // Lookup state_id (exactly as customer.ts does)
    const { data: stateData } = await supabase
      .from('states').select('id').eq('state_code', 'AP').single();

    const { data, error } = await supabase.from('customers').insert({
      customer_id: customerId,
      client_id: providerData.client_id,
      provider_id: providerData.id,
      client_short: clientShort,
      full_name: 'CLI Test Patient',
      gender: 'Male',
      age: 35,
      mobile: '8888888888',
      email: 'patient@test.in',
      address: '789 Patient Street',
      state_id: stateData?.id || null,   // ← FK integer, not state_code varchar
      city_id: null,
      pin_code: '500001',
      collection_type: 'provider',
      home_address: null,
      service_type: 'BLD',
      sequence: seq,
      year: year,
      referral_source: 'QR_SCAN',
      declaration_agreed: true
    }).select().single();

    if (error) throw new Error(`${error.message} (code: ${error.code})`);
    customerUUID = data.id;
    cleanup.customerIds.push(customerUUID);
    return `Customer inserted → ID: ${data.customer_id} | state_id: ${stateData?.id}`;
  });

  // ── B5: Insert booking (tests slot conflict constraint too) ──
  const testDate = '2026-12-25';
  const testTime = '07:00 AM – 09:00 AM';
  await test('B5: Insert booking record to DB', async () => {
    if (!customerUUID || !providerData) throw new Error('Missing customerUUID or providerData');
    const { data, error } = await supabase.from('bookings').insert({
      customer_id: customerUUID,
      provider_id: providerData.id,
      slot_date: testDate,
      slot_time: testTime,
      status: 'booked',
      payment_status: 'PENDING',
      activation_status: 'PENDING_PAYMENT'
    }).select().single();
    if (error) throw new Error(`${error.message} (code: ${error.code})`);
    bookingId = data.id;
    cleanup.bookingIds.push(bookingId);
    return `Booking inserted → ${testDate} @ ${testTime}`;
  });

  // ── B6: Slot conflict test ── (unique constraint)
  await test('B6: Slot double-booking rejected (unique constraint)', async () => {
    if (!providerData) throw new Error('No providerData');
    const { error } = await supabase.from('bookings').insert({
      customer_id: customerUUID,
      provider_id: providerData.id,
      slot_date: testDate,
      slot_time: testTime,
      status: 'booked'
    });
    if (!error) throw new Error('Duplicate booking was NOT rejected — constraint missing!');
    if (error.code !== '23505') throw new Error(`Wrong error code: ${error.code} — ${error.message}`);
    return `Conflict correctly rejected (code: 23505)`;
  });

  // ── B7: Verify complete booking flow data ──
  await test('B7: Retrieve full booking with customer + provider joined', async () => {
    if (!bookingId) throw new Error('No bookingId');
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, slot_date, slot_time, status, payment_status,
        customers (customer_id, full_name, mobile),
        providers (client_id, provider_name)
      `)
      .eq('id', bookingId)
      .single();
    if (error) throw new Error(error.message);
    return `${data.customers.full_name} @ ${data.providers.provider_name} on ${data.slot_date}`;
  });
}

// ────────────────────────────────────────────────────────────────────────────
// SECTION C  — PRE-EXISTING VALID PROVIDER TEST
// ────────────────────────────────────────────────────────────────────────────
async function testExistingProviderFlow() {
  sep('C. EXISTING VALID PROVIDERS — Customer form should work right now');

  const { data: validProviders, error } = await supabase
    .from('providers')
    .select('client_id, provider_name, type_code, sequence, status')
    .eq('status', 'approved')
    .not('client_id', 'is', null)
    .not('sequence', 'is', null)
    .limit(5);

  if (error || !validProviders?.length) {
    fail('C1: Find approved providers', error?.message || 'No approved providers found');
    failed++;
    return;
  }

  log(true, `C1: Found ${validProviders.length} approved providers`);
  passed++;
  validProviders.forEach(p => {
    const clientShort = `${p.type_code}${p.sequence}`;
    console.log(`     → ${p.client_id} | short: ${clientShort} | ${p.provider_name}`);
  });

  const { data: nullProviders } = await supabase
    .from('providers')
    .select('id, provider_name')
    .is('client_id', null);

  if (nullProviders?.length > 0) {
    log(false, `C2: ${nullProviders.length} providers still have NULL client_id — they CANNOT accept customers!`);
    nullProviders.forEach(p => console.log(`     → ${p.provider_name} (${p.id})`));
    failed++;
  } else {
    log(true, 'C2: All providers have client_id assigned — no blocking issues!');
    passed++;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// CLEANUP
// ────────────────────────────────────────────────────────────────────────────
async function runCleanup() {
  sep('D. CLEANUP — Remove test data');

  // Must delete in FK order: bookings → customers → providers
  if (cleanup.bookingIds.length) {
    await test('D1: Delete test bookings', async () => {
      const { error } = await supabase.from('bookings').delete().in('id', cleanup.bookingIds);
      if (error) throw new Error(error.message);
      return `Deleted ${cleanup.bookingIds.length} booking(s)`;
    });
  }
  if (cleanup.customerIds.length) {
    await test('D2: Delete test customers', async () => {
      const { error } = await supabase.from('customers').delete().in('id', cleanup.customerIds);
      if (error) throw new Error(error.message);
      return `Deleted ${cleanup.customerIds.length} customer(s)`;
    });
  }
  if (cleanup.providerIds.length) {
    await test('D3: Delete test providers (after bookings/customers cleared)', async () => {
      // First delete any bookings linked to these providers created during the test
      await supabase.from('bookings').delete().in('provider_id', cleanup.providerIds);
      const { error } = await supabase.from('providers').delete().in('id', cleanup.providerIds);
      if (error) throw new Error(error.message);
      return `Deleted ${cleanup.providerIds.length} provider(s)`;
    });
  }
  if (cleanup.storagePaths.length) {
    await test('D4: Delete test storage files', async () => {
      const { error } = await supabase.storage.from('documents').remove(cleanup.storagePaths);
      if (error) throw new Error(error.message);
      return `Deleted ${cleanup.storagePaths.length} file(s)`;
    });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🏥  HEALTH METRO — FULL FORM SUBMIT TEST SUITE');
  console.log('    Provider Form + Customer Form + DB Integrity');

  const { providerId, providerClientId } = await testProviderFlow();
  await testCustomerFlow(providerClientId, providerId);
  await testExistingProviderFlow();
  await runCleanup();

  const total = passed + failed;
  sep('RESULTS');
  console.log(`  Total: ${total}`);
  console.log(`  ✅ PASS  ${passed}`);
  console.log(`  ❌ FAIL  ${failed}`);
  console.log(`\n  ${failed === 0 ? '🎉 ALL TESTS PASSED — SAFE TO COMMIT' : '🚨 FAILURES FOUND — DO NOT COMMIT YET'}\n`);

  process.exit(failed === 0 ? 0 : 1);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
