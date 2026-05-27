import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://heeacfhzkrcfkcesoqmk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlZWFjZmh6a3JjZmtjZXNvcW1rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODI4NjUyNCwiZXhwIjoyMDkzODYyNTI0fQ.rt6IRgf4C9IOSIEpQUb_80aUnfAr3hrTeQlFnAGuLB4';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function listProviders() {
  console.log('🔍 Fetching all providers from DB...');
  const { data, error } = await supabase
    .from('providers')
    .select('id, provider_name, mobile, pan_number, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching providers:', error);
    return;
  }

  console.log(`Found ${data.length} providers in database:`);
  console.log(JSON.stringify(data, null, 2));
}

listProviders();
