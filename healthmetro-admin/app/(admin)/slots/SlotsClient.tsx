'use client';

import { useState } from 'react';
import { toggleSlotStatus } from '@/app/actions/slots';

export interface SlotConfig {
  id: string;
  day_of_week: string;
  slot_time: string;
  is_blocked: boolean;
}

export function SlotsClient({ initialSlots }: { initialSlots: SlotConfig[] }) {
  const [slots, setSlots] = useState<SlotConfig[]>(initialSlots);
  const [loading, setLoading] = useState<string | null>(null);

  const times = ['07:00 AM – 09:00 AM', '09:00 AM – 11:00 AM', '11:00 AM – 01:00 PM', '04:00 PM – 06:00 PM'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleToggle = async (day: string, time: string, currentBlocked: boolean) => {
    const slotId = `${day}-${time}`;
    setLoading(slotId);
    
    // Optimistic update
    setSlots(prev => prev.map(s => 
      s.day_of_week === day && s.slot_time === time 
        ? { ...s, is_blocked: !currentBlocked } 
        : s
    ));

    const result = await toggleSlotStatus(day, time, !currentBlocked);
    
    if (!result.success) {
      // Revert if failed
      setSlots(prev => prev.map(s => 
        s.day_of_week === day && s.slot_time === time 
          ? { ...s, is_blocked: currentBlocked } 
          : s
      ));
      alert('Failed to update slot status.');
    }
    
    setLoading(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <p className="font-black text-[#1A2020]">Weekly Slot Configuration</p>
        <p className="text-xs text-slate-400 mt-1">Toggle slots to enable or block them. Applies globally.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Slot</th>
              {days.map(d => (
                <th key={d} className="text-center px-3 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {times.map(time => (
              <tr key={time} className="hover:bg-slate-50/50">
                <td className="px-5 py-4 font-semibold text-[#1A2020] whitespace-nowrap">{time}</td>
                {days.map(day => {
                  const slotConfig = slots.find(s => s.day_of_week === day && s.slot_time === time);
                  const isBlocked = slotConfig?.is_blocked ?? false;
                  const isUpdating = loading === `${day}-${time}`;

                  return (
                    <td key={day} className="px-3 py-4 text-center">
                      <button 
                        onClick={() => handleToggle(day, time, isBlocked)}
                        disabled={isUpdating || !slotConfig}
                        className={`w-6 h-6 mx-auto rounded-lg border transition-colors ${
                          isBlocked 
                            ? 'bg-red-100 border-red-200 hover:bg-red-200' 
                            : 'bg-[#027473]/10 border-[#027473]/20 hover:bg-[#027473]/20'
                        } ${isUpdating || !slotConfig ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} 
                        title={isBlocked ? "Unblock slot" : "Block slot"} 
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-[#027473]/10 border border-[#027473]/20" /> Available</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-100 border border-red-200" /> Blocked</div>
      </div>
    </div>
  );
}
