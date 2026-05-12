import { submitCustomerRegistration } from '../src/app/actions/customer';

async function test() {
  const formData = new FormData();
  const testData = {
    full_name: 'Test Customer',
    gender: 'Male',
    age: '30',
    mobile: '9876543213', // Different mobile
    email: 'test@example.com',
    address: '123 Test St',
    state_code: 'AP',
    city: 'Vijayawada',
    pin_code: '520001',
    collection_type: 'provider',
    appointment_date: '2026-06-03', // Different date
    time_slot: '11:00 AM – 01:00 PM', // Different slot
    consent_accurate: true,
    consent_collection: true,
    consent_communication: true,
    consent_availability: true,
    customer_signature: 'Test Signature',
    signature_date: '2026-05-12'
  };

  formData.append('data', JSON.stringify(testData));
  formData.append('clientId', 'CLI-AP-2026-DOC-000001'); // AP Doctor
  formData.append('referralSource', 'QR_SCAN');

  console.log('Attempting registration for AP Doctor (should be -000002 or higher)...');
  const res = await submitCustomerRegistration(formData);
  console.log('Result:', res);
}

test();
