import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient('https://heeacfhzkrcfkcesoqmk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZWFjZmh6a3JjZmtjZXNvcW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODI4NjUyNCwiZXhwIjoyMDkzODYyNTI0fQ.rt6IRgf4C9IOSIEpQUb_80aUnfAr3hrTeQlFnAGuLB4');

const SECRET_KEY = 'health-metro-default-secret-2026';

async function runTests() {
  console.log('🚀 Starting Health Metro Automated CLI Tests...\n');
  
  let passed = 0;
  let failed = 0;

  // TEST 1: Check Database QR URL
  console.log('▶️ TEST 1: Checking Admin QR Code Generation Data...');
  try {
    const { data, error } = await supabase.from('qr_codes').select('qr_url').eq('client_id', 'CLI-AP-2026-HOS-000002').single();
    if (error) throw error;
    if (data.qr_url.includes('localhost:3001') || data.qr_url.includes('forms.healthmetro.in')) {
      console.log('   ✅ PASS: QR URL correctly points to localhost or production custom domain.');
      passed++;
    } else {
      console.log('   ❌ FAIL: QR URL does not point to a valid domain! Found: ' + data.qr_url);
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAIL:', err.message);
    failed++;
  }

  // TEST 2: Validate Token verification logic
  console.log('\n▶️ TEST 2: Checking Cryptographic Token Verification...');
  try {
    const clientId = 'CLI-AP-2026-HOS-000002';
    const providedToken = '480a190863074175';
    const expectedToken = crypto.createHmac('sha256', SECRET_KEY).update(clientId).digest('hex').slice(0, 16);
    
    if (providedToken === expectedToken) {
      console.log('   ✅ PASS: Token matches securely generated backend hash.');
      passed++;
    } else {
      console.log(`   ❌ FAIL: Token mismatch. Expected ${expectedToken}, got ${providedToken}`);
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAIL:', err.message);
    failed++;
  }

  // TEST 3: Check Forms Server Route Availabilities
  console.log('\n▶️ TEST 3: Checking Forms Server Routes (Next.js)...');
  try {
    const b2bResponse = await fetch('http://localhost:3001/register/b2b');
    if (b2bResponse.ok) {
      console.log('   ✅ PASS: /register/b2b form is up and responding (200 OK)');
      passed++;
    } else {
      console.log('   ❌ FAIL: /register/b2b returned ' + b2bResponse.status);
      failed++;
    }
    
    const customerResponse = await fetch('http://localhost:3001/register/customer?client_id=CLI-AP-2026-HOS-000002&token=480a190863074175&src=qr');
    if (customerResponse.ok) {
      console.log('   ✅ PASS: /register/customer form is up and responding (200 OK)');
      passed++;
    } else {
      console.log('   ❌ FAIL: /register/customer returned ' + customerResponse.status);
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAIL: Could not reach localhost:3001. Is the dev server running?', err.message);
    failed++;
  }
  
  // TEST 4: Check Admin Server Route Availabilities
  console.log('\n▶️ TEST 4: Checking Admin Server Routes (Next.js)...');
  try {
    const adminResponse = await fetch('http://localhost:3002/providers');
    if (adminResponse.ok) {
      console.log('   ✅ PASS: /providers admin page is up and responding (200 OK)');
      passed++;
    } else {
      console.log('   ❌ FAIL: /providers returned ' + adminResponse.status);
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAIL: Could not reach localhost:3002. Is the dev server running?', err.message);
    failed++;
  }

  console.log('\n========================================');
  console.log(`🏁 TEST RUN COMPLETE: ${passed} Passed, ${failed} Failed`);
  console.log('========================================');
}

runTests();
