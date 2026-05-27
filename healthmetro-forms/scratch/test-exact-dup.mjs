import { submitB2BRegistration } from '../src/app/actions/b2b.ts';

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZWFjZmh6a3JjZmtjZXNvcW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODI4NjUyNCwiZXhwIjoyMDkzODYyNTI0fQ.rt6IRgf4C9IOSIEpQUb_80aUnfAr3hrTeQlFnAGuLB4';

async function testDuplicate() {
  const duplicateData = {
    provider_type: 'Clinic',
    contact_name: 'XYZ',
    address: '404 Automated Test Boulevard',
    state_code: 'TS',
    pin_code: '500081',
    designation: 'QA Lead',
    mobile: '9948463318', // User's mobile
    email: 'test@partner.in',
    pan_number: 'ABCHJ1267K' // User's PAN
  };

  console.log('🧪 Calling submitB2BRegistration with duplicate mobile + PAN...');
  const result = await submitB2BRegistration(duplicateData);
  console.log('Result:', JSON.stringify(result, null, 2));
}

testDuplicate();
