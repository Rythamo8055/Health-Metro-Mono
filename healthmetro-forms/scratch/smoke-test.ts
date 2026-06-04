import { submitProviderRegistration } from '../src/app/actions/provider';
import { submitCustomerRegistration } from '../src/app/actions/customer';
import { createClient } from '../src/utils/supabase/client';
import { createAdminClient } from '../src/utils/supabase/admin';

async function runTests() {
  console.log('🚀 Starting Supabase Connection & RLS Tests...\n');

  // 1. Test RLS (Security Check)
  console.log('--- TEST 1: RLS Security Check ---');
  const anonClient = createClient();
  const { data: anonData, error: anonError } = await anonClient.from('providers').select('*');
  
  if (anonError) {
    console.log('✅ RLS Working: Anon client blocked from reading providers (or error returned).');
  } else if (anonData && anonData.length === 0) {
    console.log('✅ RLS Working: Anon client sees 0 rows due to RLS policies.');
  } else {
    console.log('❌ RLS FAILURE: Anon client can see data! Check RLS policies.');
  }

  const adminClient = createAdminClient();
  const { data: adminData, error: adminError } = await adminClient.from('states').select('count');
  if (!adminError) {
    console.log('✅ Admin Client: Successfully connected and read states table.\n');
  } else {
    console.log('❌ Admin Client: Failed to connect or read states table:', adminError.message, '\n');
  }

  // 2. Test Provider Registration (Write Test)
  console.log('--- TEST 2: Provider Registration (Write) ---');
  const providerFormData = new FormData();
  const mockProviderData = {
    provider_type: 'Hospital',
    provider_name: 'Test Health Metro Hospital',
    registration_number: 'REG123456',
    address: '123 Medical Street, Chennai',
    state_code: 'TN',
    pin_code: '600001',
    contact_name: 'Dr. Test Admin',
    designation: 'Director',
    mobile: '9876543210',
    email: 'test@hospital.com',
    account_holder_name: 'Test Hospital',
    bank_name: 'HDFC',
    account_no: '123456789',
    ifsc_code: 'HDFC000123'
  };
  providerFormData.append('data', JSON.stringify(mockProviderData));
  
  // Note: Skipping file uploads in this basic script test as mock Files are tricky in node
  const providerResult = await submitProviderRegistration(providerFormData);
  if (providerResult.success) {
    console.log('✅ Provider Insert Successful! ID:', providerResult.provider.id);
  } else {
    console.log('❌ Provider Insert Failed:', providerResult.error);
  }

  // 3. Test Customer Registration (Complex Write + ID Gen Test)
  console.log('\n--- TEST 3: Customer Registration (ID Gen + Transaction) ---');
  // We need a real client_id for this. Since we just inserted one, but it doesn't have a client_id yet
  // (client_id is usually generated on approval), let's manually give our test provider a client_id first.
  
  const { data: testProvider } = await adminClient
    .from('providers')
    .update({ client_id: 'CLI-TN-2026-HOS-999999', sequence: 999999 })
    .eq('provider_name', 'Test Health Metro Hospital')
    .select()
    .single();

  if (testProvider) {
    const customerFormData = new FormData();
    const mockCustomerData = {
      full_name: 'John Doe Test',
      gender: 'Male',
      age: '30',
      mobile: '9998887776',
      address: 'Test Address',
      state_code: 'TN',
      pin_code: '600001',
      collection_type: 'home',
      home_address: 'Home address test',
      appointment_date: '2026-06-01',
      time_slot: '10:00 AM - 11:00 AM',
      consent_accurate: true,
      consent_collection: true
    };
    customerFormData.append('data', JSON.stringify(mockCustomerData));
    customerFormData.append('clientId', 'CLI-TN-2026-HOS-999999');
    customerFormData.append('referralSource', 'QR_SCAN');

    const customerResult = await submitCustomerRegistration(customerFormData);
    if (customerResult.success) {
      console.log('✅ Customer & Booking Insert Successful!');
      console.log('Generated Customer ID:', customerResult.customer_id);
      console.log('Booking Status:', customerResult.booking.status);
    } else {
      console.log('❌ Customer Registration Failed:', customerResult.error);
    }
  }

  console.log('\n--- TESTS COMPLETED ---');
}

runTests().catch(console.error);
