'use client';

import { 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  BarChart3, 
  Database, 
  Globe, 
  QrCode, 
  Lock, 
  Zap, 
  Server,
  ChevronRight,
  Fingerprint,
  Smartphone,
  CheckCircle2,
  BookOpen,
  MousePointer2,
  Download,
  Activity,
  Layers,
  Cpu
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
      title: 'Marketing Hub',
      desc: 'Consumer-facing landing page for patients.',
      url: 'https://healthmetro-lannding.vercel.app',
      icon: <Globe className="w-6 h-6" />,
      accent: 'border-teal-500/20'
    },
    {
      title: 'Forms Engine',
      desc: 'Dynamic multi-tenant registration system.',
      url: 'https://healthmetro-forms.vercel.app',
      icon: <Zap className="w-6 h-6 text-[#d97234]" />,
      accent: 'border-[#d97234]/20'
    },
    {
      title: 'Admin OS',
      desc: 'Internal logistics & approval dashboard.',
      url: 'https://healthmetro-admin.vercel.app',
      icon: <Lock className="w-6 h-6" />,
      accent: 'border-white/10'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1A1A] text-white selection:bg-[#d97234]/30 font-sans overflow-x-hidden">
      {/* Immersive Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#027473]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d97234]/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Glass Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1A1A]/70 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-500">
              <Image src="/logo.png" alt="Health Metro Logo" fill className="object-contain" />
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <span className="font-black text-xl tracking-tighter hidden md:block group-hover:text-[#d97234] transition-colors">HEALTH METRO</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all border border-white/10 uppercase tracking-widest">
              Admin Login
            </Link>
            <a href="https://github.com/Rythamo8055/Health-Metro-Mono" target="_blank" className="p-2.5 bg-[#d97234] hover:bg-[#b55a24] text-white rounded-xl shadow-lg shadow-[#d97234]/20 transition-all">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d97234]/10 border border-[#d97234]/20 text-[#d97234] text-[10px] font-black uppercase tracking-[0.3em] mb-12"
          >
            <ShieldCheck className="w-4 h-4" />
            Verified Infrastructure v2.0
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-12 relative inline-block"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-[#027473] to-[#d97234] blur-2xl opacity-20" />
            <div className="relative w-48 h-24 md:w-80 md:h-40 mx-auto">
              <Image src="/logo.png" alt="Health Metro Logo" fill className="object-contain" priority />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8"
          >
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#027473] via-[#d97234] to-[#027473] bg-[length:200%_auto] animate-gradient">Connected Health</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Deploying a secure, automated ecosystem for Oncoveryx®. A two-level QR framework designed for military-grade security and seamless patient logistics.
          </motion.p>
        </section>

        {/* VISUAL FLOW: THE STAR OF THE SHOW */}
        <section className="max-w-7xl mx-auto mb-52">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 tracking-tighter">OPERATIONAL PIPELINE</h2>
            <div className="w-24 h-1.5 bg-[#d97234] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Animated Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#027473]/30 to-transparent -translate-y-12" />
            
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="bg-[#0B1A1A] border border-white/5 p-10 rounded-[3rem] hover:bg-white/[0.04] transition-all duration-500 hover:border-[#027473]/30 h-full flex flex-col items-center text-center shadow-2xl shadow-black/40">
                  <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-[#027473]/20 to-emerald-900/20 flex items-center justify-center mb-8 text-[#027473] group-hover:scale-110 group-hover:text-[#d97234] transition-all duration-500 border border-white/5">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-black text-[#d97234] tracking-[0.4em] mb-4 uppercase">{step.tag}</span>
                  <h3 className="font-bold text-xl mb-4 text-white group-hover:text-emerald-400 transition-colors">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-[40%] -right-8 items-center justify-center text-white/5">
                    <ChevronRight className="w-12 h-12" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECURITY & INSTRUCTIONS DUAL SECTION */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 mb-52">
          {/* USER MANUAL / INSTRUCTIONS */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#027473] to-[#d97234] rounded-[4rem] blur opacity-10 group-hover:opacity-20 transition duration-500" />
            <div className="relative bg-[#0B1A1A] border border-white/5 p-12 md:p-16 rounded-[4rem] shadow-3xl overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                <BookOpen className="w-40 h-40" />
              </div>
              
              <h2 className="text-4xl font-black mb-12 flex items-center gap-6">
                <div className="w-12 h-12 bg-[#027473] rounded-2xl flex items-center justify-center">
                  <MousePointer2 className="w-6 h-6 text-white" />
                </div>
                User Manual
              </h2>
              
              <div className="space-y-10">
                {[
                  { q: 'How to create a QR?', a: 'Approve any provider in the Admin Dashboard. The system instantly triggers the generation engine.' },
                  { q: 'How to share it?', a: 'Click the QR icon in the table. Use the Download button to save a high-res PNG for the provider.' },
                  { q: 'How to verify bookings?', a: 'Scan the QR yourself. It will auto-map you to the provider on the booking form.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-2xl font-black text-[#d97234]/30 italic leading-none">{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-[#027473] uppercase tracking-tighter">{item.q}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-[#d97234] uppercase tracking-widest">Admin Operating Key</span>
                  <Lock className="w-4 h-4 text-[#d97234]" />
                </div>
                <code className="text-xl font-mono text-white tracking-widest">HealthMetro@2026</code>
              </div>
            </div>
          </div>

          {/* SECURITY SPECS */}
          <div className="flex flex-col justify-center py-10">
            <div className="inline-flex items-center gap-2 mb-8 text-[#027473]">
              <Layers className="w-6 h-6" />
              <span className="text-xs font-black uppercase tracking-[0.4em]">Core Integrity Layer</span>
            </div>
            
            <h2 className="text-5xl font-black tracking-tight leading-none mb-12">
              Cryptographic <br />
              <span className="text-[#d97234]">Protection</span>
            </h2>
            
            <div className="grid gap-8">
              {[
                { title: 'HMAC Signing', desc: 'Every booking link is cryptographically signed with SHA-256 to prevent parameter manipulation.', icon: <Fingerprint className="w-6 h-6" /> },
                { title: 'Service Role Security', desc: 'Storage operations are restricted to internal server-side actions, invisible to the public.', icon: <Database className="w-6 h-6" /> },
                { title: 'RLS Policies', desc: 'Supabase Row Level Security ensures only authenticated admins can manage provider data.', icon: <Activity className="w-6 h-6" /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-8 bg-white/2 rounded-3xl border border-white/5 hover:border-[#027473]/30 transition-all group">
                  <div className="mt-1 text-[#027473] group-hover:text-[#d97234] transition-colors">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SYSTEM ENDPOINTS */}
        <section className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase">Connected Ecosystem</h2>
            <p className="text-slate-500 font-medium">Three platforms, one unified medical database.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {apps.map((app, i) => (
              <a 
                key={i} 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group bg-[#0B1A1A] border ${app.accent} p-12 rounded-[4rem] hover:bg-white/[0.04] transition-all text-center relative overflow-hidden`}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#027473] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mx-auto mb-10 group-hover:scale-110 transition-transform border border-white/5 shadow-2xl">
                  {app.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-[#d97234] transition-colors">{app.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">{app.desc}</p>
                <div className="inline-flex items-center gap-3 text-xs font-black text-[#027473] uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                  Launch Deployment <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-32 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-10">
            <Image src="/logo.png" alt="Health Metro Logo" fill className="object-contain" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter mb-4">HEALTH METRO</h2>
          <p className="text-[#d97234] text-xs font-black uppercase tracking-[0.5em] italic mb-16">Connecting Health Globally</p>
          
          <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-[#d97234] pb-1">Vercel Production</span>
            <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-[#d97234] pb-1">Supabase Infrastructure</span>
            <span className="hover:text-white transition-colors cursor-pointer border-b border-transparent hover:border-[#d97234] pb-1">Oncoveryx Security Audit</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}
