import { createAdminClient } from '../utils/supabase/admin';

async function test() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('providers')
    .select('id, client_id, sequence, type_code, state_code');
  
  if (error) {
    console.error(error);
    return;
  }
  
  console.table(data);
}

test();
