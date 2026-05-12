#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════
// HEALTH METRO — FULL FLOW CLI TEST SUITE
// Tests: Provider Submit → Admin Approve → Client ID → Customer Register → Booking
// Run: node scratch/test-all-flows.mjs
// ═══════════════════════════════════════════════════════════════════

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ───────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
);

const SUPABASE_URL  = env['NEXT_PUBLIC_SUPABASE_URL'];
const SERVICE_KEY   = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing SUPABASE env vars. Check .env.local');
  process.exit(1);
}

// ── Supabase REST helpers ─────────────────────────────────────────
const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function sb(path, method = 'GET', body = null) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

async function rpc(fn, params) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

// ── Logger ────────────────────────────────────────────────────────
let passed = 0, failed = 0;
const CYAN   = '\x1b[36m', GREEN = '\x1b[32m', RED = '\x1b[31m';
const YELLOW = '\x1b[33m', BOLD  = '\x1b[1m',  RESET = '\x1b[0m';

function section(title) {
  console.log(`\n${BOLD}${CYAN}━━━  ${title}  ━━━${RESET}`);
}
function pass(msg) { console.log(`  ${GREEN}✅ PASS${RESET}  ${msg}`); passed++; }
function fail(msg, detail = '') {
  console.log(`  ${RED}❌ FAIL${RESET}  ${msg}`);
  if (detail) console.log(`         ${RED}${detail}${RESET}`);
  failed++;
}
function info(msg) { console.log(`  ${YELLOW}ℹ${RESET}  ${msg}`); }

// ── Test state shared across flows ────────────────────────────────
const RUN_ID   = Date.now().toString(36).toUpperCase();
let testProviderId   = null;
let testClientId     = null;
let testCustomerId   = null;
let testBookingId    = null;

// ═══════════════════════════════════════════════════════════════════
//  FLOW 1 — Provider Submission (mimics the registration form)
// ═══════════════════════════════════════════════════════════════════
async function testProviderSubmission() {
  section('FLOW 1 · Provider Registration');

  const payload = {
    provider_type:       'Clinic',
    provider_name:       `Test Clinic ${RUN_ID}`,
    registration_number: `REG-${RUN_ID}`,
    gst_number:          null,
    address:             '12, MG Road, Anna Nagar',
    state_code:          'TN',
    city_id:             null,
    pin_code:            '600040',
    contact_name:        'Dr. Test User',
    designation:         'Director',
    mobile:              '9876543210',
    email:               `test+${RUN_ID}@healthmetro.in`,
    bank_details:        {},
    documents:           {},
    type_code:           'CLI',
    year:                new Date().getFullYear(),
    status:              'pending',
    onboarding_stage:    'SUBMITTED',
    agreement_status:    'PENDING',
    activation_status:   'BLOCKED_UNTIL_SIGNED',
  };

  const { ok, data } = await sb('/providers', 'POST', payload);

  if (ok && Array.isArray(data) && data[0]?.id) {
    testProviderId = data[0].id;
    pass(`Provider inserted — UUID: ${testProviderId}`);
    pass(`Status: ${data[0].status} | Client ID: ${data[0].client_id ?? '(none — expected)'}`);
  } else {
    fail('Provider INSERT failed', JSON.stringify(data));
    return false;
  }

  // Verify it shows up in pending list
  const list = await sb(`/providers?id=eq.${testProviderId}&select=id,status,client_id`);
  if (list.ok && list.data[0]?.status === 'pending') {
    pass('Provider visible in DB with status=pending');
  } else {
    fail('Could not re-fetch provider from DB');
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════════
//  FLOW 2 — Admin: Generate Client ID (approveProvider logic)
// ═══════════════════════════════════════════════════════════════════
async function testAdminApproval() {
  section('FLOW 2 · Admin Approval & Client ID Generation');

  if (!testProviderId) { fail('No provider from Flow 1, skipping'); return false; }

  const year     = new Date().getFullYear();
  const stateCode = 'TN';
  const typeCode  = 'CLI';

  // Step 2a — Call RPC: generate_client_id (with provider UUID for write-back)
  const rpcRes = await rpc('generate_client_id', {
    p_state_code:   stateCode,
    p_year:         year,
    p_type_code:    typeCode,
    p_provider_id:  testProviderId,
  });

  if (rpcRes.ok && typeof rpcRes.data === 'string' && rpcRes.data.startsWith('CLI-')) {
    testClientId = rpcRes.data;
    pass(`generate_client_id RPC returned: ${testClientId}`);
  } else {
    fail('generate_client_id RPC failed', JSON.stringify(rpcRes.data));
    return false;
  }

  // Parse sequence from ID  (CLI-TN-2026-CLI-000001 → 1)
  const parts    = testClientId.split('-');
  const sequence = parseInt(parts[parts.length - 1], 10);
  pass(`Parsed sequence: ${sequence}`);

  // Step 2b — Update provider: status=approved, assign client_id
  const updateRes = await sb(
    `/providers?id=eq.${testProviderId}`,
    'PATCH',
    {
      status:     'approved',
      client_id:  testClientId,
      sequence:   sequence,
      type_code:  typeCode,
      state_code: stateCode,
      year:       year,
    }
  );

  if (updateRes.ok) {
    pass(`Provider updated: status=approved, client_id=${testClientId}`);
  } else {
    fail('Provider PATCH failed', JSON.stringify(updateRes.data));
    return false;
  }

  // Step 2c — Verify the write
  const verify = await sb(`/providers?id=eq.${testProviderId}&select=status,client_id,sequence`);
  const row = verify.data?.[0];
  if (row?.status === 'approved' && row?.client_id === testClientId) {
    pass(`DB verified — status: ${row.status} | client_id: ${row.client_id} | sequence: ${row.sequence}`);
  } else {
    fail('Verification mismatch', JSON.stringify(row));
  }

  // Step 2d — Test duplicate prevention (second approval same bucket should increment)
  const rpc2 = await rpc('generate_client_id', {
    p_state_code:  stateCode,
    p_year:        year,
    p_type_code:   typeCode,
    p_provider_id: null,
  });
  if (rpc2.ok && typeof rpc2.data === 'string') {
    const seq2 = parseInt(rpc2.data.split('-').pop(), 10);
    if (seq2 > sequence) {
      pass(`Sequence increments correctly: next would be ${rpc2.data}`);
    } else {
      fail('Sequence did NOT increment — duplicate IDs possible!', `got seq ${seq2}, expected >${sequence}`);
    }
  } else {
    fail('Second RPC call failed', JSON.stringify(rpc2.data));
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════════
//  FLOW 3 — Customer Registration (mimics QR scan → registration)
// ═══════════════════════════════════════════════════════════════════
async function testCustomerRegistration() {
  section('FLOW 3 · Customer Registration via QR');

  if (!testClientId || !testProviderId) {
    fail('No approved provider from Flow 2, skipping');
    return false;
  }

  // Step 3a — Validate client_id (as the customer form would)
  const providerCheck = await sb(
    `/providers?client_id=eq.${testClientId}&select=id,client_id,type_code,sequence&status=eq.approved`
  );
  if (providerCheck.ok && providerCheck.data[0]?.client_id === testClientId) {
    pass(`Provider validated by client_id: ${testClientId}`);
  } else {
    fail('Provider lookup by client_id failed', JSON.stringify(providerCheck.data));
    return false;
  }

  const provider    = providerCheck.data[0];
  const clientShort = `${provider.type_code}${provider.sequence}`;
  const year        = new Date().getFullYear();
  info(`clientShort: ${clientShort}`);

  // Step 3b — Generate Customer ID via RPC
  const custRpc = await rpc('generate_customer_id', {
    p_client_short: clientShort,
    p_service_type: 'BLD',
    p_year:         year,
  });

  let customerId;
  if (custRpc.ok && typeof custRpc.data === 'string' && custRpc.data.startsWith('CUST-')) {
    customerId = custRpc.data;
    pass(`generate_customer_id RPC returned: ${customerId}`);
  } else {
    // Fallback (same as production code)
    customerId = `CUST-${clientShort}-${year}-BLD-${String(Math.floor(Math.random() * 99999)).padStart(6, '0')}`;
    info(`RPC failed (${JSON.stringify(custRpc.data)}), used fallback: ${customerId}`);
  }

  const custParts  = customerId.split('-');
  const custSeq    = parseInt(custParts[custParts.length - 1], 10);

  // Step 3c — Lookup state_id for TN
  const stateRes = await sb('/states?state_code=eq.TN&select=id');
  const stateId  = stateRes.data?.[0]?.id ?? null;

  // Step 3d — Insert customer
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const slotDate = tomorrow.toISOString().split('T')[0];

  const custInsert = await sb('/customers', 'POST', {
    customer_id:       customerId,
    client_id:         testClientId,
    provider_id:       testProviderId,
    client_short:      clientShort,
    full_name:         `Test Patient ${RUN_ID}`,
    gender:            'Male',
    age:               30,
    mobile:            '9123456789',
    email:             `patient+${RUN_ID}@healthmetro.in`,
    address:           '5, Gandhi Street, T Nagar',
    state_id:          stateId,
    pin_code:          '600017',
    collection_type:   'provider',
    service_type:      'BLD',
    year:              year,
    sequence:          custSeq,
    referral_source:   'QR_SCAN',
    declaration_agreed: true,
  });

  if (custInsert.ok && custInsert.data[0]?.id) {
    testCustomerId = custInsert.data[0].id;
    pass(`Customer inserted — UUID: ${testCustomerId} | ID: ${customerId}`);
  } else {
    fail('Customer INSERT failed', JSON.stringify(custInsert.data));
    return false;
  }

  // Step 3e — Insert booking
  const bookingInsert = await sb('/bookings', 'POST', {
    customer_id:       testCustomerId,
    provider_id:       testProviderId,
    slot_date:         slotDate,
    slot_time:         '09:00 AM – 11:00 AM',
    status:            'booked',
    payment_status:    'PENDING',
    activation_status: 'PENDING_PAYMENT',
  });

  if (bookingInsert.ok && bookingInsert.data[0]?.id) {
    testBookingId = bookingInsert.data[0].id;
    pass(`Booking created — UUID: ${testBookingId} | Date: ${slotDate}`);
  } else {
    fail('Booking INSERT failed', JSON.stringify(bookingInsert.data));
    return false;
  }

  // Step 3f — Test slot conflict (same provider + date + time should fail)
  const dup = await sb('/bookings', 'POST', {
    customer_id:       testCustomerId,
    provider_id:       testProviderId,
    slot_date:         slotDate,
    slot_time:         '09:00 AM – 11:00 AM',
    status:            'booked',
    payment_status:    'PENDING',
    activation_status: 'PENDING_PAYMENT',
  });
  if (!dup.ok) {
    pass(`Slot conflict correctly blocked — duplicate booking rejected (${dup.status})`);
  } else {
    fail('Slot conflict was NOT blocked — duplicate booking accepted!');
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════════
//  FLOW 4 — Admin Reads (providers + customers + bookings)
// ═══════════════════════════════════════════════════════════════════
async function testAdminReads() {
  section('FLOW 4 · Admin Read Access');

  // Providers list
  const provList = await sb('/providers?select=id,provider_name,status,client_id&order=created_at.desc&limit=5');
  if (provList.ok && Array.isArray(provList.data)) {
    pass(`Admin can list providers (${provList.data.length} returned in this page)`);
    provList.data.forEach(p =>
      info(`  ${p.provider_name} | ${p.status} | ${p.client_id ?? '—'}`)
    );
  } else {
    fail('Admin provider list failed', JSON.stringify(provList.data));
  }

  // Customer read
  if (testCustomerId) {
    const custRead = await sb(`/customers?id=eq.${testCustomerId}&select=customer_id,full_name,client_id`);
    if (custRead.ok && custRead.data[0]?.customer_id) {
      pass(`Customer record readable — ID: ${custRead.data[0].customer_id}`);
    } else {
      fail('Customer read failed', JSON.stringify(custRead.data));
    }
  }

  // Booking read
  if (testBookingId) {
    const bkRead = await sb(`/bookings?id=eq.${testBookingId}&select=id,slot_date,slot_time,status`);
    if (bkRead.ok && bkRead.data[0]?.id) {
      pass(`Booking record readable — ${bkRead.data[0].slot_date} ${bkRead.data[0].slot_time}`);
    } else {
      fail('Booking read failed', JSON.stringify(bkRead.data));
    }
  }

  return true;
}

// ═══════════════════════════════════════════════════════════════════
//  FLOW 5 — Reject Flow (reject a separate pending provider)
// ═══════════════════════════════════════════════════════════════════
async function testRejectionFlow() {
  section('FLOW 5 · Admin Rejection Flow');

  // Insert a temp provider to reject
  const temp = await sb('/providers', 'POST', {
    provider_type:       'Pharmacy',
    provider_name:       `Reject Test ${RUN_ID}`,
    registration_number: `REJ-${RUN_ID}`,
    state_code:          'MH',
    pin_code:            '400001',
    contact_name:        'Test Reject',
    designation:         'Owner',
    mobile:              '9000000000',
    email:               `reject+${RUN_ID}@test.in`,
    type_code:           'PHY',
    year:                new Date().getFullYear(),
    status:              'pending',
    onboarding_stage:    'SUBMITTED',
    agreement_status:    'PENDING',
    activation_status:   'BLOCKED_UNTIL_SIGNED',
    bank_details:        {},
    documents:           {},
  });

  if (!temp.ok || !temp.data[0]?.id) {
    fail('Could not create temp provider for rejection test', JSON.stringify(temp.data));
    return;
  }
  const tempId = temp.data[0].id;
  info(`Temp provider created: ${tempId}`);

  const reject = await sb(
    `/providers?id=eq.${tempId}`,
    'PATCH',
    { status: 'rejected', rejection_reason: 'CLI test — invalid documents' }
  );

  if (reject.ok) {
    pass('Provider rejected successfully');
  } else {
    fail('Rejection PATCH failed', JSON.stringify(reject.data));
  }

  // Verify
  const verify = await sb(`/providers?id=eq.${tempId}&select=status,rejection_reason`);
  const row = verify.data?.[0];
  if (row?.status === 'rejected' && row?.rejection_reason) {
    pass(`Verified: status=${row.status} | reason="${row.rejection_reason}"`);
  } else {
    fail('Rejection not reflected in DB', JSON.stringify(row));
  }
}

// ═══════════════════════════════════════════════════════════════════
//  FLOW 6 — Slot Configuration Read
// ═══════════════════════════════════════════════════════════════════
async function testSlotConfiguration() {
  section('FLOW 6 · Slot Configuration');

  const slots = await sb('/slot_configuration?select=day_of_week,slot_time,is_blocked&limit=10');
  if (slots.ok && Array.isArray(slots.data) && slots.data.length > 0) {
    pass(`Slot configuration readable — ${slots.data.length} slots returned`);
    const blocked = slots.data.filter(s => s.is_blocked);
    info(`Blocked slots: ${blocked.length > 0 ? blocked.map(s => `${s.day_of_week} ${s.slot_time}`).join(', ') : 'none'}`);
  } else {
    fail('Slot configuration read failed', JSON.stringify(slots.data));
  }
}

// ═══════════════════════════════════════════════════════════════════
//  CLEANUP — Delete test data
// ═══════════════════════════════════════════════════════════════════
async function cleanup() {
  section('CLEANUP · Removing Test Data');

  if (testBookingId) {
    const r = await sb(`/bookings?id=eq.${testBookingId}`, 'DELETE');
    r.ok ? pass(`Booking deleted`) : info(`Booking delete skipped (${r.status})`);
  }
  if (testCustomerId) {
    const r = await sb(`/customers?id=eq.${testCustomerId}`, 'DELETE');
    r.ok ? pass(`Customer deleted`) : info(`Customer delete skipped (${r.status})`);
  }
  if (testProviderId) {
    const r = await sb(`/providers?id=eq.${testProviderId}`, 'DELETE');
    r.ok ? pass(`Test provider deleted`) : info(`Provider delete skipped (${r.status})`);
  }
  // Delete all Reject Test providers from this run
  const rejDel = await sb(`/providers?provider_name=like.Reject Test ${RUN_ID}*`, 'DELETE');
  if (rejDel.ok) pass('Reject test provider cleaned up');
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN RUNNER
// ═══════════════════════════════════════════════════════════════════
async function main() {
  console.log(`\n${BOLD}${CYAN}╔══════════════════════════════════════════╗`);
  console.log(`║   HEALTH METRO — FULL FLOW TEST SUITE    ║`);
  console.log(`╚══════════════════════════════════════════╝${RESET}`);
  console.log(`  Run ID: ${RUN_ID}  |  ${new Date().toLocaleString('en-IN')}\n`);

  try {
    const f1 = await testProviderSubmission();
    const f2 = f1 ? await testAdminApproval()        : false;
    const f3 = f2 ? await testCustomerRegistration() : false;
    await testAdminReads();
    await testRejectionFlow();
    await testSlotConfiguration();
  } finally {
    await cleanup();
  }

  const total = passed + failed;
  console.log(`\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`  ${BOLD}Results: ${GREEN}${passed} passed${RESET}  ${failed > 0 ? RED : ''}${BOLD}${failed} failed${RESET}  of ${total} checks`);
  console.log(`${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
