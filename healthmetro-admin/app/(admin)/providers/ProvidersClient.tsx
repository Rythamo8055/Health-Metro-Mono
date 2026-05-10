'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/StatusBadge';
import { CheckCircle2, XCircle, Eye, Search, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { approveProvider, rejectProvider } from '@/app/actions/admin';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';

export interface Provider {
  id: string;
  provider_name: string;
  provider_type: string;
  email: string;
  mobile: string;
  city: string;
  state_code: string;
  client_id?: string;
  qr_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
  contact_name: string;
}

const TABS = ['all', 'pending', 'approved', 'rejected'] as const;
type Tab = typeof TABS[number];

function ApprovalModal({ provider, onClose, onAction }: {
  provider: Provider;
  onClose: () => void;
  onAction: (id: string, action: 'approved' | 'rejected', reason?: string) => void;
}) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [mode, setMode] = useState<'view' | 'reject' | 'qr'>('view');
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: 'approved' | 'rejected') => {
    setLoading(true);
    if (action === 'approved') {
      const result = await approveProvider(provider.id, provider.state_code || 'TN', provider.provider_type);
      if (result.success) {
        setMode('qr');
      }
    } else {
      await rejectProvider(provider.id, rejectionReason);
    }
    onAction(provider.id, action, rejectionReason);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="bg-[#0B1020] p-6 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{provider.provider_type}</p>
            <h2 className="text-xl font-black text-white mt-1">{provider.provider_name}</h2>
            <p className="text-sm text-white/50 mt-1">{provider.city || 'Unknown City'}, {provider.state_code}</p>
          </div>
          <StatusBadge status={provider.status} />
        </div>

        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {mode === 'qr' && provider.client_id ? (
            <QRCodeDisplay clientId={provider.client_id} />
          ) : (
            <>
              {[
                { label: 'Contact Person', value: provider.contact_name },
                { label: 'Mobile', value: provider.mobile },
                { label: 'Email', value: provider.email },
                { label: 'Submitted', value: new Date(provider.submitted_at).toLocaleString('en-IN') },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-400 font-semibold">{label}</span>
                  <span className="font-bold text-[#1A2020]">{value}</span>
                </div>
              ))}

              {provider.client_id && (
                <div className="flex items-center justify-between p-3 bg-teal-50 rounded-xl border border-teal-100">
                  <div>
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Client ID</p>
                    <p className="font-mono font-bold text-teal-700 mt-1">{provider.client_id}</p>
                  </div>
                  <button 
                    onClick={() => setMode('qr')}
                    className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              )}

              {provider.rejection_reason && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Rejection Reason</p>
                  <p className="text-sm text-red-700 font-medium mt-1">{provider.rejection_reason}</p>
                </div>
              )}

              {mode === 'reject' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rejection Reason *</label>
                  <textarea
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    placeholder="Explain why this application is rejected..."
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none font-medium"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 pt-0 flex gap-3">
          {mode === 'qr' ? (
            <button onClick={() => setMode('view')} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              Back to Details
            </button>
          ) : (
            <>
              <button onClick={onClose} disabled={loading} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50">
                Close
              </button>
              {provider.status === 'pending' && (
                <>
                  {mode === 'view' ? (
                    <>
                      <button
                        onClick={() => setMode('reject')}
                        disabled={loading}
                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        onClick={() => handleAction('approved')}
                        disabled={loading}
                        className="flex-1 bg-[#027473] text-white py-3 rounded-xl font-bold hover:bg-[#015a59] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" /> {loading ? 'Approving...' : 'Approve'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => rejectionReason && handleAction('rejected')}
                      disabled={!rejectionReason || loading}
                      className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-colors disabled:opacity-40"
                    >
                      {loading ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ProvidersClient({ initialProviders }: { initialProviders: Provider[] }) {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [providers, setProviders] = useState(initialProviders);
  const [selected, setSelected] = useState<Provider | null>(null);

  const handleAction = (id: string, action: 'approved' | 'rejected', reason?: string) => {
    // We update local state optimistically, the server action already updated the DB
    setProviders(prev => prev.map(p => p.id === id
      ? { ...p, status: action, reviewed_at: new Date().toISOString(), rejection_reason: reason ?? undefined }
      : p
    ));
    setSelected(null);
  };

  const filtered = providers.filter(p => {
    const matchTab = tab === 'all' || p.status === tab;
    const q = search.toLowerCase();
    const matchSearch = !q || p.provider_name.toLowerCase().includes(q) || (p.email && p.email.toLowerCase().includes(q));
    return matchTab && matchSearch;
  });

  const counts = { all: providers.length, pending: providers.filter(p => p.status === 'pending').length, approved: providers.filter(p => p.status === 'approved').length, rejected: providers.filter(p => p.status === 'rejected').length };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all capitalize flex items-center gap-2 ${
              tab === t ? 'bg-[#027473] text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-200'
            }`}
          >
            {t}
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${tab === t ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {counts[t]}
            </span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search providers..." className="text-sm outline-none font-medium placeholder:text-slate-300 w-48" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['Provider', 'Type', 'Location', 'Client ID', 'Submitted', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400 font-medium">No providers found</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-bold text-[#1A2020]">{p.provider_name}</p>
                  <p className="text-[11px] text-slate-400">{p.email}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-semibold text-slate-500">{p.provider_type}</span>
                </td>
                <td className="px-5 py-4 text-slate-500 text-xs font-semibold">{p.city || 'N/A'}, {p.state_code}</td>
                <td className="px-5 py-4">
                  {p.client_id
                    ? <span className="font-mono text-xs font-bold text-[#027473] bg-teal-50 px-2 py-1 rounded-lg">{p.client_id}</span>
                    : <span className="text-slate-300 text-xs">–</span>
                  }
                </td>
                <td className="px-5 py-4 text-xs text-slate-400 font-medium">{new Date(p.submitted_at).toLocaleDateString('en-IN')}</td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4">
                  <button onClick={() => setSelected(p)} className="flex items-center gap-1.5 text-xs font-bold text-[#027473] hover:underline">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selected && <ApprovalModal provider={selected} onClose={() => setSelected(null)} onAction={handleAction} />}
      </AnimatePresence>
    </div>
  );
}
