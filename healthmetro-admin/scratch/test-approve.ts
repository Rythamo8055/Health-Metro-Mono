import { approveProvider } from '../app/actions/admin';
import { createAdminClient } from '../utils/supabase/admin';

async function test() {
  const supabase = createAdminClient();
  
  // Specifically target a provider in AP / Individual Doctor to avoid collision
  const { data: provider, error } = await supabase
    .from('providers')
    .select('*')
    .eq('id', '3cfb0660-b053-4fe3-b7ec-d8ac98ad9963')
    .single();
  
  if (error || !provider) {
    console.error('Target provider not found');
    return;
  }
  
  console.log('Testing approval for:', provider.provider_name, `(${provider.id})`);
  const start = Date.now();
  
  try {
    const res = await approveProvider(provider.id, provider.state_code || 'AP', provider.provider_type);
    
    if (res.success) {
      console.log('\n✅ SUCCESS!');
      console.log('Generated Client ID:', res.clientId);
      console.log('QR URL:', res.qrUrl);
      console.log(`Time taken: ${Date.now() - start}ms`);
    } else {
      console.error('\n❌ FAILED:', res.error);
    }
  } catch (err: any) {
    if (err.message?.includes('static generation store missing')) {
      console.log('\n✅ SUCCESS (DB Updated)!');
      console.log('Note: revalidatePath ignored in CLI environment.');
      
      const { data: updated } = await supabase
        .from('providers')
        .select('status, client_id')
        .eq('id', provider.id)
        .single();
        
      console.log('Verified Status:', updated?.status);
      console.log('Verified Client ID:', updated?.client_id);
    } else {
      console.error('\n❌ CRITICAL ERROR:', err.message);
    }
  }
}

test();
