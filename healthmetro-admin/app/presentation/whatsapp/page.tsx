'use client';

import { 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Info,
  DollarSign,
  TrendingUp,
  XCircle,
  Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WhatsAppPresentation() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-teal-100 overflow-x-hidden">
      {/* Subtle organic background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-orange-50 blur-[100px] rounded-full opacity-40" />
      </div>

      <main className="relative z-10 pt-16 pb-32 px-6 max-w-5xl mx-auto">
        {/* Navigation / Home Link */}
        <Link href="/presentation" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 transition-colors mb-20 text-xs font-bold uppercase tracking-widest">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Dashboard
        </Link>

        {/* SECTION 1: What is this about? (F-Pattern Start) */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-teal-600 mb-6"
          >
            <Stethoscope className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Healthmetro® Admin OS</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-tight"
          >
            The Logistics <br />
            of <span className="text-teal-600">Care.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl leading-relaxed"
          >
            Healthmetro® is a high-performance logistics engine designed for Oncoveryx®. It manages everything from provider onboarding to patient registration, ensuring every blood collection is tracked, verified, and secure.
          </motion.p>
        </section>

        {/* SECTION 2: Why WhatsApp? */}
        <section className="mb-40">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black mb-6 tracking-tight">Why WhatsApp Integration?</h2>
            <p className="text-slate-500 leading-relaxed mb-10">
              In healthcare, speed and reliability save lives. Manual coordination is slow and prone to error. By integrating WhatsApp, Healthmetro® creates an <strong>instant feedback loop</strong>.
            </p>
            
            <div className="space-y-6">
              {[
                { title: 'Automated Confirmations', desc: 'Patients receive an instant ID and collection details the moment they book.' },
                { title: 'Provider Alerts', desc: 'Healthcare centers are notified immediately of new registrations through their QR links.' },
                { title: 'Operational Efficiency', desc: 'Reduces staff workload by eliminating the need for manual call-back confirmations.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-teal-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: The Options (F-Pattern Comparison) */}
        <div className="space-y-40">
          
          {/* OPTION A: TWILIO */}
          <section className="relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-4">
                <Zap className="w-4 h-4" /> Option A: Twilio Sandbox
              </div>
              <h2 className="text-4xl font-black mb-8 tracking-tight">Speed & Testing.</h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-bold text-sm uppercase text-slate-400 mb-4 tracking-widest">What we can do</h4>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    Twilio is perfect for our current development phase. It allows us to verify that our message triggers, database logging, and templates are working exactly as planned.
                  </p>
                  <ul className="space-y-3 text-sm font-medium text-slate-600">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Instant deployment</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Reliable delivery tracking</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-500" /> Professional SDK support</li>
                  </ul>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                    <DollarSign className="w-5 h-5" />
                    <span>Cost Analysis</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">
                    <strong>Trial:</strong> Free ($15.00 credit provided).
                  </p>
                  <p className="text-sm text-slate-500">
                    <strong>Worth:</strong> High value for testing logic without the hassle of business verification.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* OPTION B: META DIRECT */}
          <section className="relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-widest mb-4">
                <ShieldCheck className="w-4 h-4" /> Option B: Meta Cloud API
              </div>
              <h2 className="text-4xl font-black mb-8 tracking-tight">Scale & Authority.</h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="font-bold text-sm uppercase text-slate-400 mb-4 tracking-widest">What it costs</h4>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    Meta offers the most aggressive pricing for scale.
                  </p>
                  <div className="p-6 bg-teal-50 rounded-3xl border border-teal-100 text-teal-800 mb-6">
                    <div className="text-2xl font-black">1,000 FREE</div>
                    <div className="text-xs uppercase font-bold tracking-widest opacity-70">Conversations per month</div>
                  </div>
                  <p className="text-sm text-slate-500">
                    After the free tier, utility messages in India cost approximately <strong>₹0.35</strong> per conversation.
                  </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
                    <XCircle className="w-5 h-5" />
                    <span>What we CAN'T do</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    If we use a number like <span className="font-black text-slate-900">7382033333</span> for this API:
                  </p>
                  <ul className="mt-4 space-y-3 text-sm font-medium text-slate-600">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                      <span>Cannot use the regular WhatsApp App on your phone.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                      <span>Cannot receive personal calls/chats on that number.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Final Conclusion */}
        <section className="mt-40 pt-20 border-t border-slate-100 text-center">
          <p className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-[10px]">Strategic Conclusion</p>
          <h3 className="text-2xl font-black mb-8">Ready to automate Healthmetro®?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black transition-all hover:bg-teal-600 shadow-xl shadow-slate-200">
              Go Live with Meta
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black transition-all hover:bg-slate-50">
              Continue Sandbox
            </button>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-slate-50 border-t border-slate-100 text-center">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Healthmetro® Systems Documentation 2026</div>
      </footer>
    </div>
  );
}
