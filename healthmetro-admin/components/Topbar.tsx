'use client';

import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/providers': 'Provider Management',
  '/bookings': 'Bookings',
  '/agents': 'Agent Management',
  '/slots': 'Slot Configuration',
};

export function Topbar({ pendingCount }: { pendingCount?: number }) {
  const pathname = usePathname();
  const title = Object.entries(PAGE_TITLES).find(([k]) => k === pathname)?.[1] ?? 'Admin';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-[#1A2020]">{title}</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Metro Admin</p>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 w-56">
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <input
          placeholder="Search providers, bookings..."
          className="text-sm bg-transparent outline-none flex-1 placeholder:text-slate-300 font-medium"
        />
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors">
        <Bell className="w-5 h-5 text-slate-400" />
        {(pendingCount ?? 0) > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#d97234] rounded-full text-white text-[9px] font-bold flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 bg-[#027473] rounded-xl flex items-center justify-center">
        <span className="text-white text-xs font-bold">AD</span>
      </div>
    </header>
  );
}
