import { MOCK_PROVIDERS } from '@/data/providers';
import { MOCK_BOOKINGS, MOCK_AGENTS } from '@/data/bookings';
import { StatusBadge } from '@/components/StatusBadge';
import { Users, CalendarCheck, Clock, UserCog, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

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

export default function DashboardPage() {
  const pending = MOCK_PROVIDERS.filter(p => p.status === 'pending');
  const approved = MOCK_PROVIDERS.filter(p => p.status === 'approved');
  const todayBookings = MOCK_BOOKINGS.filter(b => b.slot_date === new Date().toISOString().split('T')[0]);
  const activeAgents = MOCK_AGENTS.filter(a => a.status === 'active');
  const unpaidBookings = MOCK_BOOKINGS.filter(b => b.payment_status === 'pending');

  const recentProviders = [...MOCK_PROVIDERS].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()).slice(0, 5);
  const recentBookings = [...MOCK_BOOKINGS].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Approvals" value={pending.length} sub={`${approved.length} approved total`} icon={Clock} color="bg-amber-500" />
        <StatCard label="Active Providers" value={approved.length} sub="Approved & live" icon={Users} color="bg-[#027473]" />
        <StatCard label="Today's Bookings" value={todayBookings.length} sub={`${MOCK_BOOKINGS.length} total bookings`} icon={CalendarCheck} color="bg-[#d97234]" />
        <StatCard label="Active Agents" value={activeAgents.length} sub={`${unpaidBookings.length} awaiting payment`} icon={UserCog} color="bg-indigo-500" />
      </div>

      {/* Alert — pending providers */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <p className="text-sm font-semibold text-amber-800">
            <span className="font-black">{pending.length} provider applications</span> are waiting for your review.
          </p>
          <Link href="/providers?tab=pending" className="ml-auto text-xs font-black text-amber-700 underline underline-offset-2 hover:text-amber-900">
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
            {recentProviders.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-slate-500">{p.provider_type.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A2020] truncate">{p.provider_name}</p>
                  <p className="text-[11px] text-slate-400">{p.city}, {p.state_code} · {p.provider_type}</p>
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
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1A2020] truncate">{b.customer_name}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{b.customer_id}</p>
                  <p className="text-[11px] text-slate-400">{b.slot_date} · {b.slot_time}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
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
          { label: 'Home Collections Today', value: MOCK_BOOKINGS.filter(b => b.collection_type === 'home').length, icon: Activity },
          { label: 'Unpaid Bookings', value: unpaidBookings.length, icon: TrendingUp },
          { label: 'Reports Ready', value: MOCK_BOOKINGS.filter(b => b.status === 'reported').length, icon: CalendarCheck },
          { label: 'Total Agents', value: MOCK_AGENTS.length, icon: UserCog },
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
