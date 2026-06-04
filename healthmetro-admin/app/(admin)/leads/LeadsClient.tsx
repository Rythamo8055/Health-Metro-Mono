'use client';

import { useState, useTransition } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { Search, Phone, Calendar, Check, X, ShieldAlert } from 'lucide-react';
import { updateLeadStatus } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export interface Lead {
  id: string;
  full_name: string;
  mobile: string;
  service_needed: string;
  status: string;
  created_at: string;
}

const STATUS_TABS = ['all', 'pending', 'contacted', 'confirmed', 'cancelled'] as const;
type StatusTab = typeof STATUS_TABS[number];

export function LeadsClient({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusTab, setStatusTab] = useState<StatusTab>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    startTransition(async () => {
      const res = await updateLeadStatus(leadId, newStatus);
      if (res.success) {
        router.refresh();
      } else {
        alert('Failed to update status: ' + res.error);
      }
      setUpdatingId(null);
    });
  };

  const filtered = initialLeads.filter(l => {
    const matchStatus = statusTab === 'all' || l.status === statusTab;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.full_name.toLowerCase().includes(q) ||
      l.mobile.toLowerCase().includes(q) ||
      l.service_needed.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1A2020]">Appointment Leads</h1>
          <p className="text-sm text-slate-500">Manage appointment requests and leads from the landing page.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_TABS.map(t => (
            <button
              key={t}
              onClick={() => setStatusTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                statusTab === t
                  ? 'bg-[#0B1020] text-white shadow-sm shadow-[#0B1020]/15'
                  : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'
              }`}
            >
              {t === 'all' ? 'All Leads' : t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm md:w-80">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="text-sm outline-none font-medium placeholder:text-slate-300 w-full"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">
        {filtered.length} Request{filtered.length !== 1 ? 's' : ''} Found
      </p>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['Customer / Client', 'Service Requested', 'Created At', 'Current Status', 'Quick Actions'].map(h => (
                <th
                  key={h}
                  className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ShieldAlert className="w-8 h-8 mb-2 opacity-50" />
                    <p className="font-semibold text-sm">No appointment requests found</p>
                    <p className="text-xs text-slate-400/80 mt-0.5">Leads submitted via the landing page form will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(l => {
                const date = new Date(l.created_at);
                const formattedDate = date.toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });
                const formattedTime = date.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Customer */}
                    <td className="px-6 py-5">
                      <p className="font-bold text-[#1A2020] text-sm">{l.full_name}</p>
                      <a
                        href={`tel:${l.mobile}`}
                        className="text-xs font-semibold text-[#027473] hover:underline flex items-center gap-1 mt-1"
                      >
                        <Phone className="w-3 h-3" />
                        {l.mobile}
                      </a>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg text-xs font-bold capitalize">
                        {l.service_needed.replace('-', ' ')}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <div>
                          <p className="text-xs font-bold text-[#1A2020]">{formattedDate}</p>
                          <p className="text-[10px] text-slate-400">{formattedTime}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={l.status} />
                        <select
                          disabled={updatingId === l.id}
                          value={l.status}
                          onChange={e => handleStatusChange(l.id, e.target.value)}
                          className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-[#027473] bg-white cursor-pointer disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5">
                        {l.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(l.id, 'contacted')}
                            disabled={updatingId === l.id}
                            title="Mark as Contacted"
                            className="p-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
                          >
                            <Phone className="w-4 h-4" />
                          </button>
                        )}
                        {l.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(l.id, 'confirmed')}
                            disabled={updatingId === l.id}
                            title="Confirm Appointment"
                            className="p-1.5 bg-teal-50 border border-teal-100 text-teal-600 hover:bg-teal-100 rounded-lg transition"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {l.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange(l.id, 'cancelled')}
                            disabled={updatingId === l.id}
                            title="Cancel Request"
                            className="p-1.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-lg transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
