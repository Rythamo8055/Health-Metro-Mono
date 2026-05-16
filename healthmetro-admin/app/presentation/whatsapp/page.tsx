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
  Smartphone,
  Info,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  FileText
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
          message: `🟢 Healthmetro®\n\nDear Test User,\n\nYour blood sample collection appointment has been confirmed successfully. ✅\n\n🆔 ID: CUST-TEST-001\n🏥 Provider: Healthmetro Lab\n📅 Date: 16/05/2026\n⏰ Time: 03:00 PM\n\nThank you for choosing Healthmetro®.`
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

  const templates = [
    {
      name: 'healthmetro_customer_confirmation',
      recipient: 'Customer',
      text: `🟢 Healthmetro®\n\nDear {{customer_name}},\n\nThank you for registering with Healthmetro®.\n\nYour blood sample collection appointment has been confirmed successfully. ✅\n\n🆔 Customer ID: {{customer_id}}\n🏥 Provider: {{provider_name}}\n📅 Date: {{appointment_date}}\n⏰ Time: {{time_slot}}\n🩸 Collection Type: {{collection_type}}\n\nOur team will assist you during your scheduled appointment.`
    },
    {
      name: 'healthmetro_provider_registration_alert',
      recipient: 'Healthcare Provider',
      text: `🟢 Healthmetro®\n\nDear {{provider_name}},\n\nA new customer has successfully registered for blood sample collection through your Healthmetro® QR registration link.\n\nCustomer Details:\n👤 {{customer_name}}\n🆔 {{customer_id}}\n📅 {{appointment_date}}\n⏰ {{time_slot}}\n🩸 {{collection_type}}`
    }
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
            Strategic breakdown of automated patient & provider communications.
          </p>
        </section>

        {/* 📋 PROS & CONS SECTION */}
        <section className="mb-24 grid md:grid-cols-2 gap-8">
          {/* TWILIO */}
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-orange-600">
              <Zap className="w-5 h-5" /> Twilio (Current)
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-600 mb-3">
                  <ThumbsUp className="w-3.5 h-3.5" /> Advantages
                </div>
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2 text-xs">🚀 <span className="mt-0.5 text-slate-400">Instant setup (no business verification required to start)</span></li>
                  <li className="flex items-start gap-2 text-xs">🛠️ <span className="mt-0.5 text-slate-400">Developer-friendly sandbox for live testing</span></li>
                  <li className="flex items-start gap-2 text-xs">💬 <span className="mt-0.5 text-slate-400">Allows free-form testing messages</span></li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 mb-3">
                  <ThumbsDown className="w-3.5 h-3.5" /> Disadvantages
                </div>
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2 text-xs">💰 <span className="mt-0.5 text-slate-400">High per-message cost at volume</span></li>
                  <li className="flex items-start gap-2 text-xs">🏷️ <span className="mt-0.5 text-slate-400">Sandbox messages carry "Twilio" branding</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* META DIRECT */}
          <div className="p-8 bg-teal-50/30 rounded-[2.5rem] border border-teal-100">
            <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-teal-700">
              <ShieldCheck className="w-5 h-5" /> Meta Cloud API
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-600 mb-3">
                  <ThumbsUp className="w-3.5 h-3.5" /> Advantages
                </div>
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2 text-xs">💎 <span className="mt-0.5 text-slate-400">100% Branded (Healthmetro® Name & Logo)</span></li>
                  <li className="flex items-start gap-2 text-xs">📉 <span className="mt-0.5 text-slate-400">Lowest cost per message (Utility rates)</span></li>
                  <li className="flex items-start gap-2 text-xs">🎁 <span className="mt-0.5 text-slate-400">1,000 Free Conversations every month</span></li>
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 mb-3">
                  <ThumbsDown className="w-3.5 h-3.5" /> Disadvantages
                </div>
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2 text-xs">🛑 <span className="mt-0.5 text-slate-400">Mandatory "Cloud-Only" number restriction</span></li>
                  <li className="flex items-start gap-2 text-xs">⚖️ <span className="mt-0.5 text-slate-400">Requires strict Business Verification & Approval</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 🛡️ META CONTENT WALL */}
        <section className="mb-24 p-10 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Lock className="w-40 h-40" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-widest mb-6">
              <AlertTriangle className="w-4 h-4" /> The Meta Content Wall
            </div>
            <h2 className="text-3xl font-black mb-6 tracking-tight">You can't just share "anything".</h2>
            <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8">
              Unlike Twilio Sandbox, Meta Direct enforces a strict **Template Approval System**. If you want to initiate a message to a customer, you must use a pre-approved template.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-xs font-bold text-teal-400 mb-1">APPROVED ✅</div>
                <div className="text-[10px] text-slate-500">Service updates, OTPs, Appointment alerts.</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-xs font-bold text-red-400 mb-1">BLOCKED ❌</div>
                <div className="text-[10px] text-slate-500">Unsolicited marketing, spam, non-approved text.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ⚡ LIVE TRIGGER SECTION */}
        <section className="mb-24 p-10 bg-teal-50/50 border border-teal-100 rounded-[2.5rem]">
          <h2 className="text-xl font-black mb-8 flex items-center gap-2">
            <Play className="w-5 h-5 text-teal-600" /> Live Sandbox Test
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sandboxNumbers.map((sb, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{sb.label}</div>
                  <div className="font-bold text-slate-900">{sb.number}</div>
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
            <div className={`mt-6 p-4 rounded-xl text-xs font-bold flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              <CheckCircle2 className="w-4 h-4" /> {status.message}
            </div>
          )}
        </section>

        {/* 📝 TEMPLATE PREVIEW (MATCHING 10.AUTOMATIONS.MD) */}
        <section className="mb-24">
          <h2 className="text-xl font-black mb-8 flex items-center gap-2 text-slate-400">
            <FileText className="w-5 h-5" /> Automation Templates
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {templates.map((tpl, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em]">{tpl.recipient}</div>
                  <div className="text-[10px] font-mono text-slate-400">{tpl.name}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs font-mono text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {tpl.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 📈 DATA ANALYSIS */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 text-slate-900">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Price Advantage (Meta)
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-2"><span>Twilio Cost (1k Bookings)</span><span>₹1,200</span></div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-slate-400 w-full" /></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-2 text-teal-600"><span>Meta Cost (1k Bookings)</span><span>₹350</span></div>
                <div className="h-2 bg-teal-100 rounded-full overflow-hidden"><div className="h-full bg-teal-500 w-[30%]" /></div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-6"><div className="absolute inset-0 rounded-full border-[8px] border-teal-500" /><div className="absolute inset-2 bg-slate-50 rounded-full flex items-center justify-center font-black text-teal-600">1k</div></div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">Free Monthly Conversations</p>
          </div>
        </section>

      </main>

      <footer className="py-12 bg-slate-50 text-center border-t border-slate-100">
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Healthmetro® Final Strategy Review</span>
      </footer>
    </div>
  );
}
