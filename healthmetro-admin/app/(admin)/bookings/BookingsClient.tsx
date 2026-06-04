'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Home, Building2 } from 'lucide-react';

export interface Booking {
  id: string;
  customer_name: string;
  mobile: string;
  customer_id: string;
  provider_name: string;
  collection_type: string;
  slot_date: string;
  slot_time: string;
  status: string;
  payment_status: string;
  agent_name?: string;
}

const STATUS_TABS = ['all', 'booked', 'assigned', 'on_route', 'collected', 'reported', 'cancelled'] as const;
type StatusTab = typeof STATUS_TABS[number];

export function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  const [search, setSearch] = useState('');
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'home' | 'provider'>('all');
  const [bookings] = useState(initialBookings);

  const filtered = bookings.filter(b => {
    const matchStatus = statusTab === 'all' || b.status === statusTab;
    const matchCollection = collectionFilter === 'all' || b.collection_type === collectionFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.customer_name.toLowerCase().includes(q) || b.customer_id.toLowerCase().includes(q) || b.provider_name.toLowerCase().includes(q);
    return matchStatus && matchCollection && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex bg-white border border-slate-100 rounded-xl overflow-hidden">
          {([['all', 'All'], ['home', 'Home'], ['provider', 'Provider']] as const).map(([val, lbl]) => (
            <button key={val} onClick={() => setCollectionFilter(val)}
              className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 ${collectionFilter === val ? 'bg-[#d97234] text-white' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {val === 'home' && <Home className="w-3 h-3" />}
              {val === 'provider' && <Building2 className="w-3 h-3" />}
              {lbl}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setStatusTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${statusTab === t ? 'bg-[#0B1020] text-white' : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..." className="text-sm outline-none font-medium placeholder:text-slate-300 w-44" />
        </div>
      </div>

      <p className="text-xs text-slate-400 font-semibold">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['Customer', 'Customer ID', 'Provider', 'Collection', 'Slot', 'Status', 'Payment', 'Agent'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400 font-medium">No bookings found</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#1A2020]">{b.customer_name}</p>
                  <p className="text-[11px] text-slate-400">{b.mobile}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-[#027473] font-bold">{b.customer_id}</span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs font-semibold text-slate-600 truncate max-w-[140px]">{b.provider_name}</p>
                </td>
                <td className="px-5 py-4"><StatusBadge status={b.collection_type} /></td>
                <td className="px-5 py-4">
                  <p className="text-xs font-bold text-[#1A2020]">{b.slot_date}</p>
                  <p className="text-[10px] text-slate-400">{b.slot_time}</p>
                </td>
                <td className="px-5 py-4"><StatusBadge status={b.status} /></td>
                <td className="px-5 py-4"><StatusBadge status={b.payment_status} /></td>
                <td className="px-5 py-4">
                  {b.agent_name
                    ? <span className="text-xs font-semibold text-slate-600">{b.agent_name}</span>
                    : <span className="text-[11px] text-slate-300">Unassigned</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
