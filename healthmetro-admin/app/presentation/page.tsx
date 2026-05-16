'use client';

import { 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  QrCode, 
  Lock, 
  Zap, 
  ChevronRight,
  Fingerprint,
  Smartphone,
  CheckCircle2,
  BookOpen,
  MousePointer2,
  Activity,
  Layers,
  Cpu,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PresentationPage() {
  const steps = [
    {
      title: 'Provider Onboarding',
      icon: <UserPlus className="w-6 h-6" />,
      description: 'Healthcare providers scan the main QR to access the registration engine.',
      tag: '01'
    },
    {
      title: 'Document Audit',
      icon: <ShieldCheck className="w-6 h-6" />,
      description: 'Admin team verifies licenses and banking details in the command center.',
      tag: '02'
    },
    {
      title: 'Secure Signing',
      icon: <Fingerprint className="w-6 h-6" />,
      description: 'System signs the referral with a unique HMAC-SHA256 security token.',
      tag: '03'
    },
    {
      title: 'QR Distribution',
      icon: <QrCode className="w-6 h-6" />,
      description: 'Custom PNG QR is generated and deployed to global storage.',
      tag: '04'
    },
    {
      title: 'Smart Booking',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Patients scan to access pre-mapped slots for their specific provider.',
      tag: '05'
    }
  ];

  const apps = [
    {
      title: 'WhatsApp Engine',
      desc: 'Automated patient & provider notification system.',
      url: '/presentation/whatsapp',
      icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
      accent: 'border-teal-500/20',
      isInternal: true
    },
    {
      title: 'Marketing Hub',
      desc: 'Consumer-facing landing page for patients.',
      url: 'https://healthmetro-lannding.vercel.app',
      icon: <Zap className="w-6 h-6 text-[#d97234]" />,
      accent: 'border-[#d97234]/20'
    },
    {
      title: 'Admin OS',
      desc: 'Internal logistics & approval dashboard.',
      url: 'https://healthmetro-admin.vercel.app',
      icon: <Lock className="w-6 h-6 text-slate-400" />,
      accent: 'border-slate-200'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-100 font-sans overflow-x-hidden">
      {/* Organic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-50 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-orange-50 blur-[100px] rounded-full opacity-40" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
              <Image src="/logo.png" alt="Health Metro Logo" fill className="object-contain" />
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block" />
            <span className="font-black text-lg tracking-tighter hidden md:block group-hover:text-teal-600 transition-colors">HEALTH METRO</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all border border-slate-200 uppercase tracking-widest text-slate-600">
              Admin Login
            </Link>
            <a href="https://github.com/Rythamo8055/Health-Metro-Mono" target="_blank" className="p-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-100 transition-all">
              <Cpu className="w-5 h-5" />
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-32 px-6">
        {/* HERO SECTION */}
        <section className="max-w-6xl mx-auto text-center mb-40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-[0.3em] mb-12"
          >
            <ShieldCheck className="w-4 h-4" />
            Infrastructure Blueprint v2.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8 text-slate-900"
          >
            The Future of <br />
            <span className="text-teal-600">Connected Health</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Deploying a secure, automated ecosystem for Oncoveryx®. A unified framework for military-grade security and seamless patient logistics.
          </motion.p>
        </section>

        {/* VISUAL FLOW */}
        <section className="max-w-7xl mx-auto mb-52">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black mb-4 tracking-tighter uppercase">Operational Pipeline</h2>
            <div className="w-16 h-1 bg-teal-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group bg-slate-50/50 border border-slate-100 p-8 rounded-[2.5rem] hover:bg-white transition-all duration-500 hover:shadow-xl hover:shadow-slate-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 text-teal-600 border border-slate-100 shadow-sm">
                  {step.icon}
                </div>
                <span className="text-[10px] font-black text-teal-700 tracking-[0.4em] mb-3 uppercase opacity-50">{step.tag}</span>
                <h3 className="font-bold text-lg mb-3 text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ECOSYSTEM ENDPOINTS */}
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black tracking-tighter mb-4 uppercase">Connected Ecosystem</h2>
            <p className="text-slate-400 font-medium">Unified medical database integration.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {apps.map((app, i) => (
              <Link 
                key={i} 
                href={app.url} 
                className={`group bg-white border border-slate-100 p-10 rounded-[3rem] hover:shadow-2xl hover:shadow-slate-100 transition-all text-center relative overflow-hidden`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  {app.icon}
                </div>
                <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-teal-600 transition-colors">{app.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{app.desc}</p>
                <div className="inline-flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                  Access Platform <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-20 bg-slate-50/50 mt-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Healthmetro® Infrastructure 2026</div>
        </div>
      </footer>
    </div>
  );
}
