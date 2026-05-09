'use client';

import { useState } from 'react';
import { MOCK_AGENTS } from '@/data/bookings';
import { StatusBadge } from '@/components/StatusBadge';
import { UserPlus, Phone, MapPin } from 'lucide-react';

export default function AgentsPage() {
  const [agents, setAgents] = useState(MOCK_AGENTS);

  const toggleStatus = (id: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-semibold">{agents.filter(a => a.status === 'active').length} active · {agents.filter(a => a.status === 'inactive').length} inactive</p>
        <button className="flex items-center gap-2 bg-[#027473] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#015a59] transition-colors">
          <UserPlus className="w-4 h-4" /> Add Agent
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <div key={agent.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0B1020] rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-sm">{agent.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="font-black text-[#1A2020]">{agent.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />{agent.zone}</p>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile</p>
                <p className="font-semibold text-sm flex items-center gap-1 mt-1"><Phone className="w-3 h-3 text-slate-400" />{agent.mobile}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Jobs</p>
                <p className="text-2xl font-black text-[#027473]">{agent.active_bookings}</p>
              </div>
            </div>
            <button onClick={() => toggleStatus(agent.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all border ${agent.status === 'active' ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-teal-200 text-[#027473] hover:bg-teal-50'}`}>
              {agent.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
