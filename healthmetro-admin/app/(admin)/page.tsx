import { createAdminClient } from '@/utils/supabase/admin';
import { StatusBadge } from '@/components/StatusBadge';
import { Users, CalendarCheck, Clock, UserCog, TrendingUp, Activity, Home } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Always fresh data

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-[#1A2020]">{value}</p>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split('T')[0];

  // Fetch all stats in parallel
  const [
    { data: providers },
    { data: bookings },
    { data: recentBookingsRaw },
  ] = await Promise.all([
    supabase.from('providers').select('id, provider_name, provider_type, address, state_code, status, created_at').order('created_at', { ascending: false }),
    supabase.from('bookings').select('id, slot_date, slot_time, status, payment_status, created_at, activation_status, customers(collection_type)'),
    supabase.from('bookings').select(`
      id, slot_date, slot_time, status, payment_status, created_at,
      customers (full_name, customer_id),
      providers (provider_name)
    `).order('created_at', { ascending: false }).limit(6),
  ]);

  // Compute stats from real data
  const pendingProviders = (providers || []).filter(p => p.status === 'pending');
  const approvedProviders = (providers || []).filter(p => p.status === 'approved');
  const todayBookings = (bookings || []).filter(b => b.slot_date === today);
  const totalBookings = bookings?.length || 0;
  const unpaidBookings = (bookings || []).filter(b => b.payment_status === 'PENDING' || b.payment_status === 'pending');
  const homeCollections = (bookings || []).filter(b => (b.customers as any)?.collection_type === 'home');
  const reportedBookings = (bookings || []).filter(b => b.status === 'reported' || b.status === 'collected');

  const recentProviders = (providers || []).slice(0, 5);
  const recentBookings = recentBookingsRaw || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Approvals" value={pendingProviders.length} sub={`${approvedProviders.length} approved total`} icon={Clock} color="bg-amber-500" />
        <StatCard label="Active Providers" value={approvedProviders.length} sub="Approved & live" icon={Users} color="bg-[#027473]" />
        <StatCard label="Today's Bookings" value={todayBookings.length} sub={`${totalBookings} total bookings`} icon={CalendarCheck} color="bg-[#d97234]" />
        <StatCard label="Unpaid Bookings" value={unpaidBookings.length} sub="Awaiting payment" icon={UserCog} color="bg-indigo-500" />
      </div>

      {/* Pending providers alert */}
      {pendingProviders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <p className="text-sm font-semibold text-amber-800">
            <span className="font-black">{pendingProviders.length} provider application{pendingProviders.length > 1 ? 's' : ''}</span> are waiting for your review.
          </p>
          <Link href="/providers" className="ml-auto text-xs font-black text-amber-700 underline underline-offset-2 hover:text-amber-900">
            REVIEW NOW →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Provider Submissions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <p className="font-black text-[#1A2020]">Recent Provider Submissions</p>
              <p className="text-xs text-slate-400 font-medium">Newest first</p>
            </div>
            <Link href="/providers" className="text-[11px] font-black text-[#027473] hover:underline">VIEW ALL</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentProviders.length === 0 ? (
              <div className="px-5 py-10 text-center text-slate-400 text-sm font-medium">No provider submissions yet</div>
            ) : recentProviders.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-slate-500">{(p.provider_type || '??').slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A2020] truncate">{p.provider_name}</p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {p.address ? p.address.split(',')[0] : '—'}, {p.state_code} · {p.provider_type}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <p className="font-black text-[#1A2020]">Recent Bookings</p>
              <p className="text-xs text-slate-400 font-medium">Latest customer registrations</p>
            </div>
            <Link href="/bookings" className="text-[11px] font-black text-[#027473] hover:underline">VIEW ALL</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentBookings.length === 0 ? (
              <div className="px-5 py-10 text-center text-slate-400 text-sm font-medium">No bookings yet</div>
            ) : recentBookings.map((b: any) => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A2020] truncate">{b.customers?.full_name || 'Unknown'}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{b.customers?.customer_id || '—'}</p>
                  <p className="text-[11px] text-slate-400">{b.slot_date} · {b.slot_time}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={b.status} />
                  <StatusBadge status={b.payment_status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Home Collections Today', value: homeCollections.filter(b => b.slot_date === today).length, icon: Home },
          { label: 'Unpaid Bookings', value: unpaidBookings.length, icon: TrendingUp },
          { label: 'Reports Ready', value: reportedBookings.length, icon: CalendarCheck },
          { label: 'Total Providers', value: (providers || []).length, icon: Activity },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-center">
            <p className="text-3xl font-black text-[#1A2020]">{m.value}</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
