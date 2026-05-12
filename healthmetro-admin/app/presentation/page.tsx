'use client';

import { 
  ExternalLink, 
  ArrowRight, 
  Activity,
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
  Download
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PresentationPage() {
  const steps = [
    {
      title: 'Provider Onboarding',
      icon: <UserPlus className="w-6 h-6" />,
      description: 'Healthcare providers scan the main QR to access the unified registration form.',
      tag: 'Step 1'
    },
    {
      title: 'Admin Verification',
      icon: <ShieldCheck className="w-6 h-6" />,
      description: 'Oncoveryx staff reviews license documents and bank details in the secure dashboard.',
      tag: 'Step 2'
    },
    {
      title: 'Secure Generation',
      icon: <Fingerprint className="w-6 h-6" />,
      description: 'System generates unique Client ID and cryptographically signed HMAC token.',
      tag: 'Step 3'
    },
    {
      title: 'Automated QR',
      icon: <QrCode className="w-6 h-6" />,
      description: 'Unique Customer QR is generated and stored in Supabase qrcodes bucket.',
      tag: 'Step 4'
    },
    {
      title: 'Customer Booking',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Patients scan the provider-specific QR to access auto-mapped test booking forms.',
      tag: 'Step 5'
    }
  ];

  const apps = [
    {
      title: 'Marketing Hub',
      desc: 'High-conversion landing page for patients and partners.',
      url: 'https://healthmetro-lannding.vercel.app',
      icon: <Globe className="w-5 h-5" />,
      theme: 'from-[#027473] to-[#014d4c]'
    },
    {
      title: 'Forms Engine',
      desc: 'Dynamic, secure registration system for all users.',
      url: 'https://healthmetro-forms.vercel.app',
      icon: <Zap className="w-5 h-5" />,
      theme: 'from-[#d97234] to-[#b55a24]'
    },
    {
      title: 'Admin OS',
      desc: 'Command center for approvals and slot management.',
      url: 'https://healthmetro-admin.vercel.app',
      icon: <Lock className="w-5 h-5" />,
      theme: 'from-slate-700 to-slate-900'
    }
  ];

  const instructions = [
    {
      title: 'Generate Provider QR',
      action: 'Click "Approve" in Provider Table',
      result: 'Client ID & QR appear instantly'
    },
    {
      title: 'Download & Share',
      action: 'Click QR Icon -> Download Button',
      result: 'Save high-res PNG for printing'
    },
    {
      title: 'Validate Booking',
      action: 'Scan QR or click "Test Link"',
      result: 'Form pre-fills the correct Provider'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFA] text-[#1A2020] selection:bg-[#027473]/10 font-sans">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#027473]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d97234]/5 blur-[100px] rounded-full" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image src="/logo.png" alt="Health Metro Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter leading-none">HEALTH METRO</span>
              <span className="text-[10px] font-bold text-[#d97234] uppercase tracking-[0.2em] mt-1 italic">Connecting Health Globally</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-[#027473] uppercase tracking-widest transition-colors">
              Admin Login
            </Link>
            <a href="https://github.com/Rythamo8055/Health-Metro-Mono" target="_blank" className="px-5 py-2 bg-[#027473] hover:bg-[#015a59] text-white rounded-full text-xs font-bold shadow-lg shadow-[#027473]/20 transition-all">
              GitHub Repo
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-32 px-6">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d97234]/10 border border-[#d97234]/20 text-[#d97234] text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <ShieldCheck className="w-4 h-4" />
            Official Branding System
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-8 text-[#1A2020]"
          >
            The Ecosystem of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#027473] to-[#d97234]">Integrated Care</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            A high-security, automated platform bridging the gap between healthcare providers and patients through intelligent QR infrastructure.
          </motion.p>
        </div>

        {/* Visual Operational Flow */}
        <div className="max-w-7xl mx-auto mb-40">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-[#027473]" />
              Operational Flow
            </h2>
            <div className="h-px flex-1 bg-slate-200 mx-8 hidden md:block" />
            <span className="text-[10px] font-black text-[#d97234] uppercase tracking-widest bg-[#d97234]/5 px-3 py-1 rounded-full border border-[#d97234]/10">End-to-End Automation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-[#027473]/5 transition-all group border-b-4 border-b-[#027473]/10 hover:border-b-[#027473]"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#027473]/5 flex items-center justify-center mb-6 text-[#027473] group-hover:scale-110 transition-transform group-hover:bg-[#027473] group-hover:text-white">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-[#1A2020]">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {step.description}
                </p>
                <div className="mt-4 text-[10px] font-black text-[#d97234] uppercase tracking-wider">{step.tag}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* User Manual Section */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-40">
          <div className="bg-[#027473] text-white p-12 rounded-[3rem] shadow-2xl shadow-[#027473]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full" />
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
              <BookOpen className="w-8 h-8" />
              User Manual
            </h2>
            <div className="space-y-8">
              {instructions.map((ins, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black flex-shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{ins.title}</h4>
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-1 font-medium">
                      <MousePointer2 className="w-3.5 h-3.5" /> {ins.action}
                    </div>
                    <div className="flex items-center gap-2 text-[#d97234] text-xs font-black uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Result: {ins.result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-black/10 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Internal Security Protocol</p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-white/90 underline decoration-[#d97234]">HealthMetro@2026</code>
                <Lock className="w-4 h-4 text-[#d97234]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-12 pl-4">
            <div>
              <h2 className="text-4xl font-black tracking-tight leading-tight text-[#1A2020]">
                Security <br />
                <span className="text-[#d97234]">Infrastructure</span>
              </h2>
              <p className="text-slate-500 mt-4 font-medium leading-relaxed max-w-md">
                We use a combination of HMAC-SHA256 signatures and Supabase Row Level Security to ensure that healthcare data and client IDs are tamper-proof.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                { title: 'HMAC Authentication', desc: 'Prevents URL manipulation by signing parameters with a server secret.', icon: <Fingerprint className="w-5 h-5 text-[#027473]" /> },
                { title: 'Admin Verification', desc: 'Approval flow requires document audit before QR generation.', icon: <ShieldCheck className="w-5 h-5 text-[#d97234]" /> },
                { title: 'Public Storage', desc: 'QR images are served via secure CDN with read-only public access.', icon: <Database className="w-5 h-5 text-blue-500" /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h5 className="font-bold text-[#1A2020]">{item.title}</h5>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Endpoints */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-[#1A2020] mb-4">The Integrated Stack</h2>
            <p className="text-slate-500 font-medium">Three specialized applications working in perfect sync.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {apps.map((app, i) => (
              <a 
                key={i} 
                href={app.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.theme} flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-[#027473]/10 group-hover:scale-110 transition-transform`}>
                  {app.icon}
                </div>
                
                <h3 className="text-2xl font-black mb-3 tracking-tight text-[#1A2020]">{app.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{app.desc}</p>
                
                <div className="inline-flex items-center gap-2 text-[10px] font-black text-[#027473] bg-[#027473]/5 px-4 py-2 rounded-full uppercase tracking-widest group-hover:bg-[#027473] group-hover:text-white transition-all">
                  Visit Live <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="relative w-16 h-16">
            <Image src="/logo.png" alt="Health Metro Logo" fill className="object-contain" />
          </div>
          <div className="text-center">
            <p className="font-black text-xl tracking-tighter text-[#1A2020]">HEALTH METRO</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 italic">Connecting Health Globally</p>
          </div>
          <div className="flex items-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
            <span className="hover:text-[#027473] transition-colors cursor-pointer">Security Standards</span>
            <span className="hover:text-[#d97234] transition-colors cursor-pointer">API Reference</span>
            <span className="hover:text-[#027473] transition-colors cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
