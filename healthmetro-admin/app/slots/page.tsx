export default function SlotsPage() {
  const slots = ['07:00 AM – 09:00 AM', '09:00 AM – 11:00 AM', '11:00 AM – 01:00 PM', '04:00 PM – 06:00 PM'];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
              {slots.map(slot => (
                <tr key={slot} className="hover:bg-slate-50/50">
                  <td className="px-5 py-4 font-semibold text-[#1A2020]">{slot}</td>
                  {days.map(d => (
                    <td key={d} className="px-3 py-4 text-center">
                      <div className="w-6 h-6 mx-auto rounded-lg bg-[#027473]/10 border border-[#027473]/20 cursor-pointer hover:bg-[#027473]/20 transition-colors" title="Click to block" />
                    </td>
                  ))}
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
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-amber-800">⚠️ Slot blocking will be fully functional after Supabase is connected.</p>
        <p className="text-xs text-amber-600 mt-1">Currently showing the configuration UI. DB integration pending.</p>
      </div>
    </div>
  );
}
