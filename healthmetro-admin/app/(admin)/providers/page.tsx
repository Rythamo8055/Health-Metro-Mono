import { createAdminClient } from '@/utils/supabase/admin';
import { ProvidersClient, Provider } from './ProvidersClient';

export const revalidate = 0; // Disable caching

export default async function ProvidersPage() {
  const supabase = createAdminClient();

  // Fetch providers joined with cities
  const { data: providersData, error } = await supabase
    .from('providers')
    .select('*, cities(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching providers:', error);
    return <div>Error loading providers. Please check server logs.</div>;
  }

  // Map database fields to the UI Provider interface
  const initialProviders: Provider[] = (providersData || []).map((p: any) => ({
    id: p.id,
    provider_name: p.provider_name,
    provider_type: p.provider_type,
    email: p.email || '',
    mobile: p.mobile || '',
    city: p.cities?.name || p.address?.split(',')[0] || '',
    state_code: p.state_code || '',
    client_id: p.client_id || undefined,
    status: p.status as 'pending' | 'approved' | 'rejected',
    submitted_at: p.created_at,
    reviewed_at: p.reviewed_at,
    rejection_reason: p.rejection_reason,
    contact_name: p.contact_name || '',
  }));

  return <ProvidersClient initialProviders={initialProviders} />;
}
