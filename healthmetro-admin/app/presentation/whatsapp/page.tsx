'use client';

import { 
  MessageSquare, 
  Check, 
  X, 
  ArrowRight,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart2,
  AlertTriangle,
  Play,
  Loader2,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function WhatsAppPresentation() {
  const [loading, setLoading] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const sandboxNumbers = [
    { number: '+919985508027', label: 'Primary Admin' },
    { number: '+918341875017', label: 'Operations Lead' }
  ];

  const triggerTest = async (to: string) => {
    setLoading(to);
    setStatus(null);
    try {
      const res = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          message: `🟢 Healthmetro® Live Test\n\nThis message was triggered directly from the Healthmetro® Admin Presentation.\n\n✅ Connection: ACTIVE\n✅ Template: VERIFIED`
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', message: `Message sent to ${to}!` });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error' });
    } finally {
      setLoading(null);
    }
  };

  const comparisonData = [
    { feature: 'Customer Opt-in', twilio: 'Required ("join...")', meta: 'None (Direct)', winner: 'meta' },
    { feature: 'Branding', twilio: 'Shared Twilio Logo', meta: 'Healthmetro® Logo', winner: 'meta' },
    { feature: 'Setup Speed', twilio: 'Instant', meta: '1-2 Days (Verification)', winner: 'twilio' },
    { feature: 'Free Tier', twilio: '$15 Credit', meta: '1,000 Free/Mo', winner: 'meta' },
    { feature: 'Cost per 1k msgs', twilio: '₹800 - ₹1,200', meta: '₹350 - ₹400', winner: 'meta' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-teal-100 overflow-x-hidden">
      <main className="max-w-4xl mx-auto pt-16 pb-32 px-6">
        
        {/* Header */}
        <section className="mb-20">
          <Link href="/presentation" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            WhatsApp Strategy
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Live automation testing and ROI analysis.
          </p>
        </section>

        {/* ⚡ LIVE TRIGGER SECTION */}
        <section className="mb-24 p-10 bg-teal-50/50 border border-teal-100 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 fill-current" />
              </div>
              Live Test Trigger
            </h2>
            <div className="px-3 py-1 bg-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-200">
              Sandbox Active
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {sandboxNumbers.map((sb, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-teal-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">{sb.label}</div>
                    <div className="font-bold text-slate-900">{sb.number}</div>
                  </div>
                </div>
                <button 
                  onClick={() => triggerTest(sb.number)}
                  disabled={!!loading}
                  className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-100 transition-all disabled:opacity-50"
                >
                  {loading === sb.number ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>

          {status && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl text-xs font-bold flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
            >
              {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              {status.message}
            </motion.div>
          )}
        </section>

        {/* 1. COMPARISON TABLE */}
        <section className="mb-24">
          <h2 className="text-xl font-black mb-8 flex items-center gap-2 text-slate-400">
            Strategy Breakdown
          </h2>
          <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400">Feature</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400">Twilio Sandbox</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-slate-400">Meta Direct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 font-bold text-sm text-slate-600">{row.feature}</td>
                    <td className={`p-5 text-sm ${row.winner === 'twilio' ? 'text-teal-600 font-bold' : 'text-slate-500'}`}>{row.twilio}</td>
                    <td className={`p-5 text-sm ${row.winner === 'meta' ? 'text-teal-600 font-bold' : 'text-slate-500'}`}>{row.meta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. VISUAL CHARTS */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 text-slate-900">
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Cost per 1k Bookings
            </h3>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Twilio</span>
                  <span>₹1,200</span>
                </div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }}
                    className="h-full bg-slate-400"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2 text-teal-600">
                  <span>Meta Direct</span>
                  <span>₹350</span>
                </div>
                <div className="h-4 bg-teal-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} whileInView={{ width: '30%' }} viewport={{ once: true }}
                    className="h-full bg-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2 self-start text-slate-900">
              <PieChartIcon className="w-4 h-4" /> Monthly Free Tier
            </h3>
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full border-[10px] border-teal-500" />
              <div className="absolute inset-2 bg-slate-50 rounded-full flex items-center justify-center">
                <div className="text-xl font-black text-teal-600">1k</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-bold">
              1,000 Free Conversations / Month
            </p>
          </div>
        </section>

        {/* 3. WARNING */}
        <section className="p-8 bg-orange-50 rounded-[2rem] border border-orange-100 mb-24">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 shrink-0" />
            <div>
              <h3 className="text-sm font-black text-slate-900 mb-1 tracking-tight">Cloud Number Limitation</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Switching to Meta Cloud with <span className="text-slate-900 font-bold">7382033333</span> will disable your personal WhatsApp app access. The number will be reserved exclusively for Healthmetro® automation.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 bg-slate-50 text-center border-t border-slate-100">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Healthmetro® Final Strategy Review</span>
      </footer>
    </div>
  );
}
