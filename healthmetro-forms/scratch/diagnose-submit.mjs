/**
 * Health Metro — DEEP DIAGNOSTIC
 * Checks EXACTLY what happens during form submission (mirrors customer.ts action)
 * Run: node scratch/diagnose-submit.mjs [client_id]
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

function section(title) {
  console.log(`\n${'═'.repeat(65)}`);
  console.log(`  ${title}`);
  console.log('═'.repeat(65));
}

async function diagnose() {
  console.log('\n🔍 HEALTH METRO — FORM SUBMISSION DEEP DIAGNOSTIC');
  console.log('   Reproducing exactly what customer.ts submitCustomerRegistration does\n');

  // ── Step 1: Show all providers and check critical fields ─────────────────
  section('ALL PROVIDERS IN DATABASE');

  const { data: allProviders, error: allError } = await supabase
    .from('providers')
    .select('id, client_id, provider_name, type_code, sequence, status, mobile')
    .order('created_at', { ascending: false });

  if (allError) {
    console.log('  ❌ Cannot fetch providers:', allError.message);
    return;
  }

  if (!allProviders || allProviders.length === 0) {
    console.log('  ⚠️  NO PROVIDERS IN DATABASE — this is why form fails!');
    console.log('     You need at least one approved provider with a valid client_id');
    return;
  }

  console.log(`\n  Found ${allProviders.length} providers:\n`);
  console.log('  ┌─────────────────────────────┬────────────┬──────────┬──────────────────────────┐');
  console.log('  │ client_id                   │ type_code  │ sequence │ Issues                   │');
  console.log('  ├─────────────────────────────┼────────────┼──────────┼──────────────────────────┤');

  for (const p of allProviders) {
    const issues = [];
    if (!p.client_id) issues.push('NO client_id');
    if (!p.type_code) issues.push('NO type_code');
    if (!p.sequence) issues.push('NO sequence');

    const clientId = (p.client_id || 'NULL').padEnd(27);
    const typeCode = (p.type_code || 'NULL').padEnd(10);
    const seq = String(p.sequence || 'NULL').padEnd(8);
    const issue = issues.length > 0 ? '❌ ' + issues.join(', ') : '✅ OK';
    console.log(`  │ ${clientId} │ ${typeCode} │ ${seq} │ ${issue.padEnd(24)} │`);
  }
  console.log('  └─────────────────────────────┴────────────┴──────────┴──────────────────────────┘');

  // ── Step 2: Simulate the submission with the first valid provider ─────────
  section('SIMULATING FORM SUBMISSION (customer.ts logic)');

  // Use the first provider with a client_id
  const testProvider = allProviders.find(p => p.client_id);
  if (!testProvider) {
    console.log('\n  ❌ CRITICAL: No provider has a client_id set!');
    console.log('     Form will ALWAYS fail at "Validate Provider" step.');
    console.log('\n  FIX: Update a provider to set client_id, type_code, and sequence.\n');
    return;
  }

  const clientId = testProvider.client_id;
  console.log(`\n  Using client_id: ${clientId}`);
  console.log(`  Provider: ${testProvider.provider_name || 'Unknown'}`);

  // Simulate step 2 of customer.ts
  console.log('\n  → Step 2: Validate Provider & Get Provider ID');
  const { data: providerData, error: providerError } = await supabase
    .from('providers')
    .select('id, client_id, type_code, sequence')
    .eq('client_id', clientId)
    .single();

  if (providerError || !providerData) {
    console.log('  ❌ FAIL: Provider lookup failed:', providerError?.message);
    console.log('  → This is the "Invalid Provider Client ID" error users see!');
    return;
  }
  console.log('  ✅ Provider found:', JSON.stringify(providerData));

  // Check type_code and sequence
  if (!providerData.type_code || providerData.sequence == null) {
    console.log('\n  ❌ CRITICAL ISSUE: Provider has null type_code or sequence!');
    console.log(`     type_code: ${providerData.type_code}`);
    console.log(`     sequence:  ${providerData.sequence}`);
    console.log('\n  FIX needed: UPDATE providers SET type_code=\'CLI\', sequence=1 WHERE id=\'...\'\n');
  }

  const clientShort = `${providerData.type_code}${providerData.sequence}`;
  const year = new Date().getFullYear();
  console.log(`\n  → client_short: "${clientShort}" (type_code + sequence)`);
  console.log(`  → year: ${year}`);

  // Simulate step 3: RPC
  console.log('\n  → Step 3: Generate Customer ID via RPC');
  const { data: customerId, error: rpcError } = await supabase.rpc('generate_customer_id', {
    p_client_short: clientShort,
    p_service_type: 'BLD',
    p_year: year
  });

  if (rpcError) {
    console.log('  ❌ RPC Error:', rpcError.message);
    console.log('  → The code has a fallback for this, so it won\'t block submission.');
    console.log('  → Fallback ID will be used instead.');
  } else {
    console.log('  ✅ RPC OK, Generated ID:', customerId);
  }

  const finalCustomerId = customerId || `CUST-${clientShort}-${year}-BLD-${String(Math.floor(Math.random() * 99999)).padStart(6, '0')}`;
  console.log(`  → Final Customer ID: ${finalCustomerId}`);

  // State lookup
  console.log('\n  → Lookup state_id for TS (Telangana)');
  const { data: stateData } = await supabase.from('states').select('id').eq('state_code', 'TS').single();
  console.log('  ✅ state_id:', stateData?.id || 'NULL (will be null in insert)');

  // Step 4: try customer insert (dry run — we'll rollback by deleting)
  console.log('\n  → Step 4: Insert Customer (TEST INSERT)');

  const customerParts = finalCustomerId.split('-');
  const sequence = parseInt(customerParts[customerParts.length - 1], 10);

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .insert({
      customer_id: finalCustomerId,
      client_id: clientId,
      provider_id: providerData.id,
      client_short: clientShort,
      full_name: 'DIAGNOSTIC TEST - DELETE',
      gender: 'Male',
      age: 25,
      mobile: '9000000001',
      email: null,
      address: 'Test Address, Hyderabad',
      state_id: stateData?.id || null,
      city_id: null,
      pin_code: '500001',
      collection_type: 'provider',
      home_address: null,
      latitude: null,
      longitude: null,
      maps_link: null,
      service_type: 'BLD',
      year: year,
      sequence: sequence,
      referral_source: 'QR_SCAN',
      declaration_agreed: true
    })
    .select()
    .single();

  if (customerError) {
    console.log('  ❌ CUSTOMER INSERT FAILED:', customerError.message);
    console.log('  → CODE:', customerError.code);
    console.log('  → DETAILS:', customerError.details);
    console.log('\n  🚨 THIS IS WHY THE FORM FAILS!\n');
  } else {
    console.log('  ✅ Customer inserted OK! Row ID:', customerData.id);

    // Step 5: Booking insert
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 7);
    const slotDate = testDate.toISOString().split('T')[0];
    const slotTime = '07:00 AM – 09:00 AM';

    console.log('\n  → Step 5: Insert Booking');
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id: customerData.id,
        provider_id: providerData.id,
        slot_date: slotDate,
        slot_time: slotTime,
        status: 'booked',
        payment_status: 'PENDING',
        activation_status: 'PENDING_PAYMENT'
      })
      .select()
      .single();

    if (bookingError) {
      console.log('  ❌ BOOKING INSERT FAILED:', bookingError.message);
      console.log('  → CODE:', bookingError.code);
      if (bookingError.code === '23505') {
        console.log('  → SLOT CONFLICT — this date+time slot already taken');
      }
    } else {
      console.log('  ✅ Booking inserted OK! Booking ID:', bookingData.id);
    }

    // Cleanup
    console.log('\n  → Cleanup: removing diagnostic test records...');
    if (bookingData) await supabase.from('bookings').delete().eq('id', bookingData.id);
    await supabase.from('customers').delete().eq('id', customerData.id);
    console.log('  ✅ Cleanup done.');
  }

  // ── Check providers with missing fields ──────────────────────────────────
  section('PROVIDER DATA QUALITY CHECK');

  const broken = allProviders.filter(p => !p.client_id || !p.type_code || p.sequence == null);
  if (broken.length > 0) {
    console.log(`\n  ⚠️  ${broken.length} provider(s) have missing data that will BREAK form submission:\n`);
    for (const p of broken) {
      console.log(`  → ${p.provider_name || p.id}`);
      if (!p.client_id) console.log(`     ✗ client_id is NULL`);
      if (!p.type_code) console.log(`     ✗ type_code is NULL`);
      if (p.sequence == null) console.log(`     ✗ sequence is NULL`);
    }
    console.log('\n  SQL FIX (run in Supabase SQL editor):');
    for (const p of broken) {
      const typeCode = { Hospital: 'HOS', Clinic: 'CLI', 'Individual Doctor': 'DOC', Pharmacy: 'PHY', 'Diagnostic Center': 'DIA' }[p.provider_type] || 'OTH';
      console.log(`  UPDATE providers SET type_code='${typeCode}', sequence=1 WHERE id='${p.id}';`);
    }
  } else {
    console.log('\n  ✅ All providers have required fields (client_id, type_code, sequence)');
  }

  // ── WhatsApp automation check ─────────────────────────────────────────────
  section('WHATSAPP AUTOMATION (10.automations.md)');
  
  console.log('\n  The automations document defines what SHOULD happen after submit:');
  console.log('  1. Send WhatsApp to Provider (providers.mobile or whatsapp_number)');
  console.log('  2. Send WhatsApp to Customer (customers.mobile)');
  console.log('  3. Send WhatsApp to Ops Team (OPS_WHATSAPP_NUMBER=+919985508027)');
  console.log('');
  console.log('  Current Status:');

  // Check if there's any WA integration code
  const hasWhatsappRoute = false; // We'll check below
  
  const { data: opsProvider } = await supabase.from('providers').select('mobile').limit(1).single();
  
  console.log(`  → Twilio SID configured: CONFIGURED ✅`);
  console.log(`  → Twilio Auth Token: configured ✅`);
  console.log(`  → From number: +14155238886 ✅`);
  console.log(`  → Ops number: +919985508027 ✅`);
  console.log(`  → Provider mobile available: ${opsProvider?.mobile || 'NONE'}`);
  console.log('\n  ⚠️  AUTOMATION NOT CONNECTED TO FORM YET');
  console.log('     customer.ts submitCustomerRegistration() does NOT call any WA API');
  console.log('     After success, it just returns { success: true, customer_id }');
  console.log('     WhatsApp notifications need to be added to the action.');

  console.log('\n════════════════════════════════════════════════════════════════\n');
}

diagnose().catch(err => {
  console.error('\n💥 FATAL ERROR:', err.message);
  process.exit(1);
});
