import { createAdminClient } from '../src/utils/supabase/admin';

async function main() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('providers')
    .select('id, client_id, provider_name, status')
    .limit(5);

  if (error) {
    console.error('Error fetching providers:', error);
    return;
  }
  console.log('Providers in database:', data);
}

main().catch(console.error);
