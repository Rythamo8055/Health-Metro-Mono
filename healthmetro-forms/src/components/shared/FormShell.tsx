'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Lock, Globe2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FormShellProps {
  children: React.ReactNode;
  imageSrc: string;
  title: string;
  subtitle: string;
  tagline: string;
  isSubmitted?: boolean;
  submissionTitle?: string;
  submissionDesc?: string;
  referralId?: string;
}

export default function FormShell({
  children,
  imageSrc,
  title,
  subtitle,
  tagline,
  isSubmitted,
  submissionTitle = "Submission Received",
  submissionDesc = "Our team will process your registration shortly.",
  referralId
}: FormShellProps) {

  if (isSubmitted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFA] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl shadow-teal-900/5 text-center space-y-8 border border-slate-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-[#027473] rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-[#1A2020]">{submissionTitle}</h1>
            <p className="text-slate-500 text-lg leading-relaxed">{submissionDesc}</p>
          </div>
          {referralId && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Clinic Reference</p>
              <p className="text-xs font-mono font-bold text-[#027473]">{referralId}</p>
            </div>
          )}
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-[#d97234] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#c0652d] transition-all shadow-xl shadow-orange-900/10"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white font-sans text-[#1A2020]">
      
      {/* Left Column: Custom Clinical Branding */}
      <div className="hidden lg:flex w-[40%] bg-white p-12 flex-col justify-between border-r border-slate-100 relative">
        <div className="space-y-12 relative z-10">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo.png" 
              alt="Health Metro" 
              width={160} 
              height={40} 
              className="object-contain"
              priority
            />
            <div className="h-6 w-px bg-slate-200" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#d97234] uppercase">
              {tagline}
            </span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
              {title} <br />
              <span className="text-[#d97234] italic font-serif font-medium">{subtitle}</span>
            </h1>
          </div>
        </div>

        {/* This is the Dynamic Image */}
        <div className="relative flex-1 flex items-center justify-center py-12 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full max-h-[450px]"
          >
            <Image 
              src={imageSrc} 
              alt="Clinical Visual" 
              fill
              className="object-contain opacity-90"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <Lock className="w-5 h-5 text-[#027473]" />
            </div>
            <div>
              <p className="font-bold text-sm">Encrypted</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AES-256</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[#027473]" />
            </div>
            <div>
              <p className="font-bold text-sm">Verified</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Area */}
      <div className="flex-1 h-full overflow-y-auto bg-[#F8FAFA] flex flex-col p-6 lg:p-12 relative">
        <div className="w-full max-w-xl mx-auto h-full flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
