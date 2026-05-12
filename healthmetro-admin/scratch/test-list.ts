import { createAdminClient } from '../utils/supabase/admin';

async function test() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('providers').select('id, status, client_id');
  console.log(data);
}

test();
