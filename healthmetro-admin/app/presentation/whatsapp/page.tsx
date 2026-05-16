'use client';

import { 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  LayoutGrid,
  TrendingUp,
  Cpu,
  SmartphoneIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WhatsAppPresentation() {
  const twilioFeatures = [
    { title: 'Setup Time', value: 'Instant', icon: <Zap className="w-5 h-5 text-teal-400" /> },
    { title: 'Opt-in', value: 'Mandatory', icon: <AlertCircle className="w-5 h-5 text-orange-400" /> },
    { title: 'Branding', value: 'Twilio Profile', icon: <LayoutGrid className="w-5 h-5 text-slate-400" /> },
    { title: 'Cost', value: 'Free Trial', icon: <TrendingUp className="w-5 h-5 text-teal-400" /> }
  ];

  const metaFeatures = [
    { title: 'Setup Time', value: 'Moderate', icon: <Cpu className="w-5 h-5 text-[#d97234]" /> },
    { title: 'Opt-in', value: 'None', icon: <CheckCircle2 className="w-5 h-5 text-teal-400" /> },
    { title: 'Branding', value: 'Healthmetro®', icon: <ShieldCheck className="w-5 h-5 text-teal-400" /> },
    { title: 'Cost', value: '1,000 Free/mo', icon: <TrendingUp className="w-5 h-5 text-[#d97234]" /> }
  ];

  return (
    <div className="min-h-screen bg-[#0B1A1A] text-white selection:bg-[#d97234]/30 font-sans overflow-x-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#027473]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d97234]/5 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Link href="/presentation" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 text-sm uppercase tracking-widest font-black">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Ecosystem
        </Link>

        {/* Hero Section */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d97234]/10 border border-[#d97234]/20 text-[#d97234] text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <MessageSquare className="w-4 h-4" />
            Communication Layer v1.0
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8"
          >
            WhatsApp <br />
            <span className="text-[#027473]">Automation</span>
          </motion.h1>
          <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
            Comparing the two strategic pathways for Healthmetro® patient and provider notifications.
          </p>
        </section>

        {/* Comparison Section */}
        <section className="grid md:grid-cols-2 gap-8 mb-40">
          {/* TWILIO CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/2 border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group hover:border-white/10 transition-all"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Zap className="w-40 h-40" />
            </div>
            <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-teal-400">
                <Zap className="w-6 h-6" />
              </div>
              Twilio Sandbox
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-12">
              {twilioFeatures.map((f, i) => (
                <div key={i} className="p-6 bg-white/2 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    {f.icon}
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.title}</span>
                  </div>
                  <div className="text-lg font-bold">{f.value}</div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-orange-500/5 rounded-3xl border border-orange-500/10 text-orange-400">
              <div className="flex items-start gap-4 text-sm font-medium leading-relaxed">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <span>Requires each recipient to send <strong>"join room-twelve"</strong> before receiving messages. Best for testing.</span>
              </div>
            </div>
          </motion.div>

          {/* META DIRECT CARD */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/2 border border-[#d97234]/20 rounded-[3rem] p-12 relative overflow-hidden group hover:border-[#d97234]/40 transition-all shadow-2xl shadow-[#d97234]/5"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <ShieldCheck className="w-40 h-40" />
            </div>
            <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#d97234]/10 rounded-2xl flex items-center justify-center border border-[#d97234]/20 text-[#d97234]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              Meta Cloud API
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-12">
              {metaFeatures.map((f, i) => (
                <div key={i} className="p-6 bg-white/2 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    {f.icon}
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{f.title}</span>
                  </div>
                  <div className="text-lg font-bold">{f.value}</div>
                </div>
              ))}
            </div>
            <div className="p-8 bg-[#d97234]/10 rounded-3xl border border-[#d97234]/20 text-white">
              <div className="flex items-start gap-4 text-sm font-medium leading-relaxed">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-[#d97234]" />
                <span>Sends directly to any number without opt-in. Includes 1,000 free conversations monthly. <strong>Recommended for Scale.</strong></span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* The "Normal Number" Trade-off */}
        <section className="bg-gradient-to-br from-[#027473]/10 to-transparent border border-white/5 p-12 md:p-20 rounded-[4rem] mb-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-teal-400 mx-auto mb-10 border border-white/10 shadow-xl">
              <SmartphoneIcon className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">The "Normal Number" Trade-off</h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
              Using a clean number like <span className="text-white font-black tracking-widest">7382033333</span> with Meta Direct offers professional branding, but comes with one specific constraint:
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="p-10 bg-[#0B1A1A] rounded-[2.5rem] border border-white/5">
                <h4 className="text-[#d97234] font-black uppercase tracking-widest text-xs mb-4">Cloud Operation</h4>
                <p className="text-sm leading-relaxed text-slate-300">Once connected to the API, the number becomes "Cloud-Only". It cannot be used on the regular WhatsApp mobile app for personal chats.</p>
              </div>
              <div className="p-10 bg-[#0B1A1A] rounded-[2.5rem] border border-white/5">
                <h4 className="text-teal-400 font-black uppercase tracking-widest text-xs mb-4">Business Identity</h4>
                <p className="text-sm leading-relaxed text-slate-300">The number functions as an official <strong>Healthmetro® Endpoint</strong>. Patients see your name and logo, not a random individual.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Action */}
        <div className="text-center">
          <p className="text-slate-500 font-bold mb-8 uppercase tracking-[0.3em] text-xs">Ready to transition?</p>
          <div className="flex justify-center gap-6">
            <button className="px-10 py-5 bg-[#d97234] hover:bg-[#b55a24] text-white rounded-2xl font-black transition-all shadow-2xl shadow-[#d97234]/20 uppercase tracking-widest text-sm">
              Deploy Meta Cloud
            </button>
            <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-all border border-white/10 uppercase tracking-widest text-sm">
              Keep Twilio Testing
            </button>
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Healthmetro® Communication Blueprint 2026</div>
      </footer>
    </div>
  );
}
