'use client';

import { StatusBadge } from '@/components/StatusBadge';
import { UserPlus, Phone, MapPin } from 'lucide-react';

// Agents are not in the DB yet — show empty state with Add Agent CTA
export default function AgentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-semibold">0 active · 0 inactive</p>
        <button className="flex items-center gap-2 bg-[#027473] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-[#015a59] transition-colors">
          <UserPlus className="w-4 h-4" /> Add Agent
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-7 h-7 text-slate-400" />
        </div>
        <p className="font-black text-[#1A2020] text-lg">No agents yet</p>
        <p className="text-sm text-slate-400 font-medium mt-1">Add your first field agent to start assigning collections.</p>
        <button className="mt-6 flex items-center gap-2 bg-[#027473] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#015a59] transition-colors mx-auto">
          <UserPlus className="w-4 h-4" /> Add First Agent
        </button>
      </div>
    </div>
  );
}
