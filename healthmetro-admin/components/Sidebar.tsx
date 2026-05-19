'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, CalendarCheck, UserCog,
  Clock, ChevronLeft, LogOut, Activity, PhoneCall
} from 'lucide-react';

const NAV = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/providers', icon: Users, label: 'Providers' },
  { href: '/bookings', icon: CalendarCheck, label: 'Bookings' },
  { href: '/leads', icon: PhoneCall, label: 'Leads' },
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
      <div className="h-20 flex items-center gap-3 px-4 border-b border-white/5">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-start w-full overflow-hidden">
              <Image src="/logo.png" alt="Health Metro" width={130} height={34} className="object-contain brightness-0 invert opacity-90" priority />
              <p className="text-[9px] font-black tracking-[0.25em] text-[#d97234] uppercase mt-2">Admin Console</p>
            </motion.div>
          ) : (
            <motion.div key="mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-8 h-8 bg-[#027473] rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-black text-xs">HM</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`ml-auto p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors ${collapsed ? 'hidden' : ''}`}
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
