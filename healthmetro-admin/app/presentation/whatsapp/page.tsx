'use client';

import { 
  MessageSquare, 
  Check, 
  X, 
  ArrowRight,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WhatsAppPresentation() {
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
        
        {/* Simplified Header */}
        <section className="mb-20">
          <Link href="/presentation" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-12 text-xs font-bold uppercase tracking-widest">
            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Ecosystem
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            WhatsApp Strategy
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            A simple breakdown of how we automate patient notifications.
          </p>
        </section>

        {/* 1. COMPARISON TABLE */}
        <section className="mb-24">
          <h2 className="text-xl font-black mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            Direct Comparison
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
        <section className="mb-24 grid md:grid-cols-2 gap-12">
          
          {/* COST BAR CHART */}
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Cost per 1,000 Bookings (INR)
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
            <p className="mt-8 text-[10px] text-slate-400 leading-relaxed italic">
              *Meta Direct is approximately 3.4x more cost-effective at scale.
            </p>
          </div>

          {/* FREE TIER PIE CHART (Custom CSS) */}
          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2 self-start">
              <PieChartIcon className="w-4 h-4" /> Monthly Free Tier
            </h3>
            
            <div className="relative w-40 h-40 mb-8">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-[12px] border-teal-500" />
              {/* Inner hole */}
              <div className="absolute inset-4 bg-slate-50 rounded-full flex items-center justify-center">
                <div>
                  <div className="text-2xl font-black text-teal-600">1,000</div>
                  <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Free Chats</div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Meta offers <strong>1,000 free conversations</strong> every month. For Healthmetro®, this means your first 1,000 customers cost <strong>₹0</strong>.
            </p>
          </div>
        </section>

        {/* 3. THE "NO APP" WARNING */}
        <section className="p-10 bg-orange-50 rounded-[2rem] border border-orange-100 mb-24">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight">The "No-App" Constraint</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                To use your number <span className="text-slate-900 font-bold">7382033333</span> with Meta Direct, you must disconnect it from your personal WhatsApp app. It will function purely as an automated business endpoint.
              </p>
            </div>
          </div>
        </section>

        {/* Closing */}
        <div className="text-center py-12 border-t border-slate-50">
          <h4 className="font-black text-slate-900 mb-8">Ready to move forward?</h4>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold transition-all hover:bg-teal-700 shadow-lg shadow-teal-100">
              Start Meta Setup
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
              Stay on Twilio
            </button>
          </div>
        </div>

      </main>

      <footer className="py-12 bg-slate-50 text-center border-t border-slate-100">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Healthmetro® Final Strategy Review</span>
      </footer>
    </div>
  );
}
