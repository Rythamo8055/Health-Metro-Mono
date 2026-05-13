'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2,
  Stethoscope,
  User,
  Phone,
  MessageSquare,
  ChevronRight,
  AlertCircle,
  QrCode
} from 'lucide-react';
import Image from 'next/image';

const patientSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  mobile: z.string().regex(/^\+91\s\d{10}$/, 'Enter a valid 10-digit mobile number after +91'),
  concern: z.string().min(10, 'Please describe your concern in at least 10 characters'),
  referralId: z.string().optional(),
});

type PatientData = z.infer<typeof patientSchema>;

function PatientFormInner() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const refId = searchParams.get('ref') || 'DIRECT_VISIT';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PatientData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      mobile: '+91 ',
      referralId: refId,
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const onSubmit = (data: PatientData) => {
    console.log('--- FORM SUBMISSION ---');
    console.log('Patient Data:', data);
    console.log('Attributed to Doctor UUID:', refId);
    console.log('-----------------------');
    setIsSubmitted(true);
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  if (isSubmitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFA] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[32px] shadow-2xl shadow-teal-900/5 text-center space-y-8 border border-slate-100"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.1 }}
            className="w-20 h-20 bg-[#027473] rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-[#1A2020]">Form Submitted</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your details have been shared with the clinic. A medical coordinator will contact you shortly.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attribution ID</p>
            <p className="text-xs font-mono font-bold text-[#027473]">{refId}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-[#d97234] text-white py-4 rounded-2xl font-bold hover:bg-[#c0652d] transition-all active:scale-95"
          >
            New Submission
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFA] flex flex-col font-sans">
      {/* Premium Header */}
      <header className="bg-white border-b border-slate-100 p-6 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#027473] rounded-xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1A2020] leading-none">Health Metro</h2>
            <p className="text-[10px] font-bold text-[#d97234] uppercase tracking-wider mt-1">Patient Portal</p>
          </div>
        </div>
        
        {/* Referral Indicator */}
        <div className="px-3 py-1.5 bg-teal-50 rounded-lg border border-teal-100 flex items-center gap-2">
          <QrCode className="w-3 h-3 text-[#027473]" />
          <span className="text-[10px] font-bold text-[#027473] uppercase tracking-tight">
            Ref: {refId.slice(0, 8)}...
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-24 lg:pb-6">
        <div className="w-full max-w-lg space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-[#1A2020]">Patient Intake</h1>
            <p className="text-slate-500 text-sm">Please provide your details for the clinical consultation.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field 
              label="FULL NAME" 
              icon={<User className="w-4 h-4" />}
              placeholder="Enter your name" 
              error={errors.name?.message}
              {...register('name')}
            />

            <Field 
              label="MOBILE NUMBER" 
              icon={<Phone className="w-4 h-4" />}
              placeholder="+91" 
              error={errors.mobile?.message}
              {...register('mobile')}
              onChange={(e) => {
                const val = e.target.value;
                if (!val.startsWith('+91 ')) {
                  setValue('mobile', '+91 ');
                } else {
                  setValue('mobile', val);
                }
              }}
            />

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" />
                  CHIEF CONCERN
                </label>
                {errors.concern && (
                  <p className="text-[9px] text-red-500 font-bold">{errors.concern.message}</p>
                )}
              </div>
              <textarea 
                placeholder="Describe your health concern..."
                {...register('concern')}
                className="w-full h-32 bg-white border border-slate-100 rounded-2xl px-5 py-4 text-base outline-none transition-all focus:border-[#027473] focus:ring-4 focus:ring-teal-500/5 resize-none font-medium"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#027473] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#015a59] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-teal-900/10 active:scale-[0.98]"
            >
              SUBMIT FORM
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </main>

      <footer className="p-6 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Secured by Health Metro Clinical Systems
        </p>
      </footer>
    </div>
  );
}

export default function PatientForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <PatientFormInner />
    </Suspense>
  );
}

const Field = React.forwardRef<HTMLInputElement, { 
  label: string; 
  placeholder: string; 
  icon?: React.ReactNode;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>>(({ label, placeholder, icon, error, ...props }, ref) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-2">
          {icon}
          {label}
        </label>
        {error && (
          <motion.p 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[10px] text-red-500 font-bold flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </div>
      <input 
        ref={ref}
        type="text"
        placeholder={placeholder}
        {...props}
        className={`w-full bg-white border ${error ? 'border-red-200' : 'border-slate-100'} rounded-2xl px-5 py-4 text-base outline-none transition-all focus:border-[#027473] focus:ring-4 focus:ring-teal-500/5 font-semibold`}
      />
    </div>
  );
});

Field.displayName = 'Field';
