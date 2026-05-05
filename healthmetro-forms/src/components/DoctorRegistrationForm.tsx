'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2,
  ShieldCheck,
  Globe2,
  Lock,
  ArrowLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import Image from 'next/image';

const STEPS = [
  { id: 'personal', title: 'Personal Details', description: 'Your professional identity.' },
  { id: 'clinic', title: 'Clinic Information', description: 'Where you consult patients.' },
  { id: 'bank', title: 'Bank Details', description: 'Secure payout configuration.' },
];

export default function DoctorRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '+91 ',
    email: '',
    pan: '',
    clinicAddress: '',
    city: '',
    pincode: '',
    bankName: '',
    accountName: '',
    accountNo: '',
    ifsc: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!mounted) return <div className="h-screen w-full bg-white" />;

  if (isSubmitted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
              className="w-24 h-24 bg-[#d97234] rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1A2020]">Registration Submitted</h1>
            <p className="text-slate-500 text-lg">
              Our medical compliance team will verify your credentials within 24 hours.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-left">
            <ShieldCheck className="w-6 h-6 text-[#027473]" />
            <p className="text-sm text-slate-600 font-medium">
              Protected by bank-grade AES-256 encryption and HIPAA compliance.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-[#d97234] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#c0652d] transition-all active:scale-95 shadow-lg shadow-[#d97234]/10"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white font-sans text-[#1A2020]">
      
      {/* Mobile Sticky Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Health Metro" 
            width={120} 
            height={30} 
            className="object-contain"
          />
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <span className="text-[8px] font-bold tracking-widest text-[#d97234] uppercase">
            Partner
          </span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentStep ? 'w-6 bg-[#d97234]' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Left Column: Clinical Branding (Desktop) */}
      <div className="hidden lg:flex w-[40%] bg-white p-12 flex-col justify-between border-r border-slate-100 relative">
        <div className="space-y-12 relative z-10">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo.png" 
              alt="Health Metro" 
              width={180} 
              height={45} 
              className="object-contain"
              priority
            />
            <div className="h-6 w-px bg-slate-200" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#d97234] uppercase">
              Partner Network
            </span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
              Clinical excellence, <br />
              <span className="text-[#d97234] italic font-serif font-medium">digitally mastered.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-md leading-relaxed">
              Join 5,000+ verified medical professionals delivering world-class care through Health Metro.
            </p>
          </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center py-12 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-full max-h-[400px]"
          >
            <Image 
              src="/medical-technical.png" 
              alt="Clinical Visual" 
              fill
              className="object-contain opacity-80"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-8 relative z-10">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <Lock className="w-5 h-5 text-[#027473]" />
            </div>
            <div>
              <p className="font-bold text-sm">Clinical Data</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AES-256</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <Globe2 className="w-5 h-5 text-[#027473]" />
            </div>
            <div>
              <p className="font-bold text-sm">Compliance</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">HIPAA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Mobile-first Precision Wizard */}
      <div className="flex-1 h-full overflow-y-auto lg:overflow-hidden bg-[#F8FAFA] flex flex-col p-6 lg:p-12 relative pb-32 lg:pb-12">
        <div className="w-full max-w-xl mx-auto space-y-8 lg:space-y-12 h-full flex flex-col justify-center">
          
          {/* Header Area (Desktop) */}
          <div className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between">
              {currentStep > 0 ? (
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 hover:text-[#d97234] transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  BACK
                </button>
              ) : <div />}
              <div className="flex gap-1.5">
                {STEPS.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      idx === currentStep ? 'w-8 bg-[#d97234]' : 'w-4 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d97234]">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">{STEPS[currentStep].title}</h2>
            <p className="text-slate-500 text-sm lg:text-base">{STEPS[currentStep].description}</p>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 min-h-[380px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6 lg:space-y-8"
              >
                {currentStep === 0 && (
                  <div className="grid grid-cols-1 gap-6 lg:gap-8">
                    <Field 
                      label="FULL LEGAL NAME" 
                      placeholder="Dr. Aditya Sharma" 
                      value={formData.name} 
                      onChange={(v) => updateField('name', v)} 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      <Field 
                        label="MOBILE" 
                        placeholder="+91" 
                        value={formData.mobile} 
                        onChange={(v) => updateField('mobile', v)} 
                      />
                      <Field 
                        label="EMAIL ADDRESS" 
                        placeholder="doctor@healthmetro.in" 
                        value={formData.email} 
                        onChange={(v) => updateField('email', v)} 
                      />
                    </div>
                    <Field 
                      label="PAN NUMBER" 
                      placeholder="ABCDE1234F" 
                      value={formData.pan} 
                      onChange={(v) => updateField('pan', v)} 
                    />
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="grid grid-cols-1 gap-6 lg:gap-8">
                    <Field 
                      label="CLINIC ADDRESS" 
                      placeholder="Enter full clinical address" 
                      value={formData.clinicAddress} 
                      onChange={(v) => updateField('clinicAddress', v)} 
                    />
                    <div className="grid grid-cols-2 gap-6 lg:gap-8">
                      <Field 
                        label="CITY" 
                        placeholder="Mumbai" 
                        value={formData.city} 
                        onChange={(v) => updateField('city', v)} 
                      />
                      <Field 
                        label="PINCODE" 
                        placeholder="400001" 
                        value={formData.pincode} 
                        onChange={(v) => updateField('pincode', v)} 
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="grid grid-cols-1 gap-6 lg:gap-8">
                    <Field 
                      label="BANK NAME" 
                      placeholder="e.g. HDFC Bank" 
                      value={formData.bankName} 
                      onChange={(v) => updateField('bankName', v)} 
                    />
                    <Field 
                      label="ACCOUNT NAME" 
                      placeholder="As per bank records" 
                      value={formData.accountName} 
                      onChange={(v) => updateField('accountName', v)} 
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      <Field 
                        label="ACCOUNT NUMBER" 
                        placeholder="0000 0000 0000" 
                        value={formData.accountNo} 
                        onChange={(v) => updateField('accountNo', v)} 
                      />
                      <Field 
                        label="IFSC CODE" 
                        placeholder="HDFC0001234" 
                        value={formData.ifsc} 
                        onChange={(v) => updateField('ifsc', v)} 
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Fixed CTA Area for Mobile & Desktop */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 lg:static lg:p-0 lg:border-none lg:bg-transparent space-y-4">
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button 
                  onClick={handleBack}
                  className="lg:hidden flex-1 bg-slate-50 text-slate-400 py-5 rounded-2xl font-bold flex items-center justify-center transition-all active:scale-95 border border-slate-100"
                >
                  BACK
                </button>
              )}
              <button 
                onClick={handleNext}
                className="flex-[2] bg-[#d97234] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#c0652d] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#d97234]/10 active:scale-[0.98]"
              >
                {currentStep === STEPS.length - 1 ? 'COMPLETE' : 'CONTINUE'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden lg:block">
              Secured by 256-bit SSL encryption
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange }: { 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
        {label}
      </label>
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white lg:bg-slate-50 border border-slate-100 lg:border-slate-100 rounded-2xl px-5 py-4 text-base focus:ring-4 focus:ring-[#d97234]/5 focus:border-[#d97234] outline-none transition-all placeholder:text-slate-300 font-semibold shadow-sm lg:shadow-none"
      />
    </div>
  );
}
