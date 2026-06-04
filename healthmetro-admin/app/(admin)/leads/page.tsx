import { createAdminClient } from '@/utils/supabase/admin';
import { LeadsClient, Lead } from './LeadsClient';

export const revalidate = 0;

export default async function LeadsPage() {
  const supabase = createAdminClient();

  // Fetch appointment requests/leads from the database
  const { data: leadsData, error } = await supabase
    .from('appointment_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    // Render a fallback error message or empty state if SQL table is not run yet
    return (
      <div className="max-w-7xl mx-auto p-8 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-red-600 mb-2">Database Setup Required</h3>
        <p className="text-sm text-slate-500 mb-4">
          The table <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">appointment_requests</code> does not exist or cannot be reached.
        </p>
        <p className="text-xs text-slate-400">
          Please run the SQL schema in the Supabase Editor using the file <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">landing-page/supabase-landing-leads.sql</code>.
        </p>
      </div>
    );
  }

  const initialLeads: Lead[] = (leadsData || []).map((l: any) => ({
    id: l.id,
    full_name: l.full_name,
    mobile: l.mobile,
    service_needed: l.service_needed || 'other',
    status: l.status || 'pending',
    created_at: l.created_at,
  }));

  return <LeadsClient initialLeads={initialLeads} />;
}
