import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    if (line.trim().startsWith('#') || !line.includes('=')) return;
    const [k, ...v] = line.split('=');
    process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
  });
}

// Mock global.window since customer.ts might require it or run in Node env
global.window = {};

import { submitCustomerRegistration } from '../src/app/actions/customer.ts';

async function testSubmit() {
  console.log('--- Calling submitCustomerRegistration directly via CLI ---');
  
  // Construct FormData
  const formData = new FormData();
  
  const mockData = {
    full_name: 'CLI Action Tester',
    gender: 'Male',
    age: '30',
    mobile: '9632148521',
    email: 'clitest@healthmetro.in',
    address: '123 Test Street, Hyderabad',
    state_code: 'TS',
    city: 'Hyderabad',
    pin_code: '500001',
    collection_type: 'provider',
    appointment_date: '2026-05-28',
    time_slot: '07:00 AM – 09:00 AM',
    consent_accurate: true,
    consent_collection: true,
    consent_communication: true,
    consent_availability: true,
    customer_signature: 'CLI Action Tester',
    signature_date: '2026-05-18'
  };
  
  formData.append('data', JSON.stringify(mockData));
  formData.append('clientId', 'CLI-LD-2026-HOS-000001');
  formData.append('referralSource', 'qr');
  
  const result = await submitCustomerRegistration(formData);
  console.log('Result:', result);
}

testSubmit().catch(err => {
  console.error('Fatal execution error:', err);
});
