'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, CalendarCheck, UserCog,
  Clock, ChevronLeft, LogOut, Activity,
} from 'lucide-react';

const NAV = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/providers', icon: Users, label: 'Providers' },
  { href: '/bookings', icon: CalendarCheck, label: 'Bookings' },
  { href: '/agents', icon: UserCog, label: 'Agents' },
  { href: '/slots', icon: Clock, label: 'Slot Config' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="h-screen bg-[#0B1020] flex flex-col shrink-0 overflow-hidden z-40 sticky top-0"
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/5">
        <div className="w-8 h-8 bg-[#027473] rounded-xl flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
              <p className="text-white font-black text-sm whitespace-nowrap">Health Metro</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">Admin Console</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`ml-auto p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors ${collapsed ? 'rotate-180' : ''}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                active
                  ? 'bg-[#027473] text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-sm font-semibold whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Active indicator */}
              {active && <div className="absolute right-0 w-1 h-6 bg-[#d97234] rounded-l-full" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-white/5">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all">
          <LogOut className="w-4 h-4 shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-semibold whitespace-nowrap">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
