'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft, ChevronRight, Lock, Globe2,
  ClipboardCheck, Clock, CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { InputField } from './shared/InputField';
import { SelectField } from './shared/SelectField';
import { FileUploadField } from './shared/FileUploadField';
import { getStateOptions, getCityOptions } from '@/lib/locationData';

// ─── Schema (Doc 1) ────────────────────────────────────────────────────────
const schema = z.object({
  provider_type: z.string().min(1, 'Please select a provider type'),
  provider_name: z.string().min(2, 'Provider name is required'),
  registration_number: z.string().min(5, 'Minimum 5 characters required'),
  gst_number: z.string().optional(),

  address: z.string().min(10, 'Please enter a complete address'),
  state_code: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pin_code: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code'),
  contact_name: z.string().min(2, 'Contact person name required'),
  designation: z.string().min(2, 'Designation is required'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, '10-digit number starting with 6–9'),
  email: z.string().email('Enter a valid email address'),

  // Bank (optional)
  account_holder_name: z.string().optional(),
  bank_name: z.string().optional(),
  account_no: z.string().optional(),
  ifsc_code: z.string().optional(),

  // Declaration (Doc 1 §3.7)
  confirm_accurate: z.boolean().refine(v => v === true, { message: 'This confirmation is required' }),
  agree_verification: z.boolean().refine(v => v === true, { message: 'Please agree to continue' }),
  accept_process: z.boolean().refine(v => v === true, { message: 'Please acknowledge this to proceed' }),
  signatory_name: z.string().min(2, 'Authorized signatory name required'),
  declaration_date: z.string().min(1, 'Date is required'),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  {
    id: 'provider', title: 'Provider Information', description: 'Tell us about your practice.',
    fields: ['provider_type', 'provider_name', 'registration_number'] as (keyof FormData)[],
  },
  {
    id: 'location', title: 'Location & Contact', description: 'Where and how to reach you.',
    fields: ['address', 'state_code', 'city', 'pin_code', 'contact_name', 'designation', 'mobile', 'email'] as (keyof FormData)[],
  },
  {
    id: 'documents', title: 'Documents & Banking', description: 'Verification and payout setup.',
    fields: [] as (keyof FormData)[],
  },
  {
    id: 'declaration', title: 'Declaration', description: 'Review and confirm your application.',
    fields: ['confirm_accurate', 'agree_verification', 'accept_process', 'signatory_name', 'declaration_date'] as (keyof FormData)[],
  },
];

const PROVIDER_TYPES = [
  { value: 'Hospital', label: 'Hospital' },
  { value: 'Clinic', label: 'Clinic' },
  { value: 'Individual Doctor', label: 'Individual Doctor' },
  { value: 'Pharmacy', label: 'Pharmacy' },
  { value: 'Diagnostic Center', label: 'Diagnostic Center' },
  { value: 'Other', label: 'Other' },
];

interface Props {
  preselectedType?: string;
  tagline?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  iconSrc?: string;
}

export default function ProviderRegistrationForm({
  preselectedType,
  tagline = 'Partner Network',
  heroTitle = 'Clinical excellence,',
  heroSubtitle = 'digitally mastered.',
  iconSrc,
}: Props) {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);

  // File state (Doc 1 §3.5)
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [chequeFile, setChequeFile] = useState<File | null>(null);
  const [docError, setDocError] = useState('');

  const { register, handleSubmit, trigger, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      provider_type: preselectedType ?? '',
      confirm_accurate: false,
      agree_verification: false,
      accept_process: false,
    },
    mode: 'onBlur',
  });

  useEffect(() => { setMounted(true); }, []);

  const watchedState = watch('state_code');
  useEffect(() => {
    if (watchedState) {
      setCityOptions(getCityOptions(watchedState));
      setValue('city', '');
    }
  }, [watchedState, setValue]);

  const handleNext = async () => {
    // Step 2: validate doc uploads
    if (step === 2) {
      if (!licenseFile || !idProofFile) {
        setDocError('Both Registration Certificate and ID Proof are required');
        return;
      }
      setDocError('');
      setStep(s => s + 1);
      return;
    }

    const valid = await trigger(STEPS[step].fields);
    if (valid) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new window.FormData();
      formData.append('data', JSON.stringify(data));
      if (licenseFile) formData.append('licenseFile', licenseFile);
      if (idProofFile) formData.append('idProofFile', idProofFile);
      if (chequeFile) formData.append('chequeFile', chequeFile);

      const { submitProviderRegistration } = await import('@/app/actions/provider');
      const result = await submitProviderRegistration(formData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (!mounted) return <div className="h-screen w-full bg-white" />;

  // ── Submitted State ──
  if (submitted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFA] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-teal-900/5 text-center space-y-8 border border-slate-100"
        >
          <div className="space-y-3">
            <div className="w-16 h-16 bg-[#027473] rounded-2xl flex items-center justify-center mx-auto">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A2020]">Application Submitted!</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your registration is under review. Our team will verify your details and documents.
            </p>
          </div>
          <div className="p-5 bg-orange-50/60 rounded-2xl border border-orange-100 flex items-start gap-4 text-left">
            <Clock className="w-5 h-5 text-[#d97234] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#d97234]">Client ID Pending</p>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                Your unique Client ID (<span className="font-mono font-bold">CLI-XX-2026-XXX-XXXXXX</span>) will be generated after admin approval and sent to your registered email and mobile.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-slate-100 text-[#1A2020] py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            BACK TO HOME
          </button>
        </motion.div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen lg:h-screen w-full lg:overflow-hidden flex flex-col lg:flex-row bg-white font-sans text-[#1A2020]">

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Health Metro" width={120} height={30} className="object-contain" />
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <span className="text-[8px] font-bold tracking-widest text-[#d97234] uppercase">{tagline}</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-[#d97234]' : i < step ? 'w-2 bg-[#027473]' : 'w-2 bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex w-[40%] bg-white p-12 flex-col justify-between border-r border-slate-100">
        <div className="space-y-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Health Metro" width={180} height={45} className="object-contain" priority />
              <div className="h-6 w-px bg-slate-200" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#d97234] uppercase">{tagline}</span>
            </div>

            {iconSrc && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 p-2">
                  <Image src={iconSrc} alt={tagline} width={80} height={80} className="object-contain" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-[#d97234] uppercase">{tagline}</span>
                  <span className="text-xs font-bold text-slate-400">Verified Provider</span>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight">
              {heroTitle}<br />
              <span className="text-[#d97234] italic font-serif font-medium">{heroSubtitle}</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-md leading-relaxed">
              Join verified healthcare providers delivering world-class care through Health Metro.
            </p>
          </div>
        </div>

        {/* Step progress sidebar */}
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-3 transition-all duration-300 ${i === step ? 'opacity-100' : i < step ? 'opacity-60' : 'opacity-30'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${i < step ? 'bg-[#027473] text-white' : i === step ? 'bg-[#d97234] text-white' : 'bg-slate-100 text-slate-400'}`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <div>
                <p className="text-xs font-bold text-[#1A2020]">{s.title}</p>
                <p className="text-[10px] text-slate-400">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-50 rounded-xl"><Lock className="w-5 h-5 text-[#027473]" /></div>
            <div><p className="font-bold text-sm">Secure Data</p><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">AES-256</p></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-50 rounded-xl"><Globe2 className="w-5 h-5 text-[#027473]" /></div>
            <div><p className="font-bold text-sm">Compliance</p><p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">HIPAA</p></div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-[#F8FAFA] flex flex-col p-6 lg:p-12 pb-32 lg:pb-12 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="w-full max-w-xl mx-auto space-y-8 h-full flex flex-col justify-center">

          {/* Desktop back + dots */}
          <div className="hidden lg:flex items-center justify-between">
            {step > 0
              ? <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 hover:text-[#d97234] transition-colors group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK
                </button>
              : <div />}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[#d97234]' : i < step ? 'w-4 bg-[#027473]' : 'w-4 bg-slate-200'}`} />
              ))}
            </div>
          </div>

          {/* Step heading */}
          <div className="space-y-2 text-center lg:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d97234]">Step {step + 1} of {STEPS.length}</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">{STEPS[step].title}</h2>
            <p className="text-slate-500 text-sm">{STEPS[step].description}</p>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                {/* ── Step 0: Provider Information ── */}
                {step === 0 && (
                  <>
                    <Controller
                      name="provider_type"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label="PROVIDER TYPE"
                          placeholder="Select provider type"
                          options={PROVIDER_TYPES}
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.provider_type?.message}
                          disabled={!!preselectedType}
                        />
                      )}
                    />
                    <InputField
                      label="PROVIDER / PRACTICE NAME"
                      placeholder="e.g. Apollo Clinic, Dr. Rajan's Hospital"
                      error={errors.provider_name?.message}
                      {...register('provider_name')}
                    />
                    <InputField
                      label="REGISTRATION / LICENSE NUMBER"
                      placeholder="e.g. MCI-12345 or DL-XXXX-XXXX"
                      error={errors.registration_number?.message}
                      {...register('registration_number')}
                    />
                    <InputField
                      label="GST NUMBER (OPTIONAL)"
                      placeholder="e.g. 29ABCDE1234F1Z5"
                      error={errors.gst_number?.message}
                      {...register('gst_number')}
                    />
                  </>
                )}

                {/* ── Step 1: Location & Contact ── */}
                {step === 1 && (
                  <>
                    <InputField
                      label="FULL ADDRESS"
                      placeholder="Building, Street, Area"
                      error={errors.address?.message}
                      {...register('address')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        name="state_code"
                        control={control}
                        render={({ field }) => (
                          <SelectField
                            label="STATE"
                            placeholder="Select state"
                            options={getStateOptions()}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.state_code?.message}
                          />
                        )}
                      />
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <SelectField
                            label="CITY"
                            placeholder={watchedState ? 'Select city' : 'Select state first'}
                            options={cityOptions}
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.city?.message}
                            disabled={!watchedState}
                          />
                        )}
                      />
                    </div>
                    <InputField
                      label="PIN CODE"
                      placeholder="6-digit PIN"
                      error={errors.pin_code?.message}
                      maxLength={6}
                      {...register('pin_code')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="CONTACT PERSON NAME"
                        placeholder="Authorized person"
                        error={errors.contact_name?.message}
                        {...register('contact_name')}
                      />
                      <InputField
                        label="DESIGNATION"
                        placeholder="e.g. Director, Manager"
                        error={errors.designation?.message}
                        {...register('designation')}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="MOBILE NUMBER"
                        placeholder="10-digit mobile"
                        error={errors.mobile?.message}
                        maxLength={10}
                        {...register('mobile')}
                      />
                      <InputField
                        label="EMAIL ADDRESS"
                        placeholder="contact@clinic.in"
                        error={errors.email?.message}
                        {...register('email')}
                      />
                    </div>
                  </>
                )}

                {/* ── Step 2: Documents & Banking ── */}
                {step === 2 && (
                  <>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Required Documents</p>
                    </div>
                    <FileUploadField
                      label="REGISTRATION / LICENSE CERTIFICATE *"
                      hint="PDF, JPG, PNG — max 10 MB"
                      onFileSelect={setLicenseFile}
                      required
                      error={!licenseFile && docError ? 'Required' : undefined}
                    />
                    <FileUploadField
                      label="AUTHORIZED PERSON ID PROOF *"
                      hint="Aadhaar, PAN, Passport — max 10 MB"
                      onFileSelect={setIdProofFile}
                      required
                      error={!idProofFile && docError ? 'Required' : undefined}
                    />
                    {docError && (
                      <p className="text-[11px] text-red-500 font-bold">{docError}</p>
                    )}

                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">Bank Details (Optional)</p>
                      <p className="text-[11px] text-slate-400">Required for referral payouts. Can be added later.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="ACCOUNT HOLDER NAME" placeholder="As per bank records" {...register('account_holder_name')} />
                        <InputField label="BANK NAME" placeholder="e.g. HDFC Bank" {...register('bank_name')} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="ACCOUNT NUMBER" placeholder="9–18 digits" {...register('account_no')} />
                        <InputField label="IFSC CODE" placeholder="e.g. HDFC0001234" {...register('ifsc_code')} />
                      </div>
                      <FileUploadField
                        label="CANCELLED CHEQUE (OPTIONAL)"
                        hint="PDF, JPG, PNG — max 10 MB"
                        onFileSelect={setChequeFile}
                      />
                    </div>
                  </>
                )}

                {/* ── Step 3: Declaration ── */}
                {step === 3 && (
                  <div className="space-y-5">
                    {[
                      { name: 'confirm_accurate' as const, label: 'I confirm that all information provided is accurate and complete to the best of my knowledge.' },
                      { name: 'agree_verification' as const, label: 'I agree to undergo the verification process required for onboarding on Health Metro.' },
                      { name: 'accept_process' as const, label: 'I understand that my Client ID will be issued only after successful admin approval.' },
                    ].map(({ name, label }) => (
                      <label key={name} className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${watch(name) ? 'border-[#027473]/30 bg-teal-50/30' : errors[name] ? 'border-red-200 bg-red-50/20' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <input type="checkbox" {...register(name)} className="mt-0.5 w-4 h-4 accent-[#027473] shrink-0" />
                        <span className="text-sm text-slate-600 font-medium leading-relaxed">{label}</span>
                      </label>
                    ))}
                    {(errors.confirm_accurate || errors.agree_verification || errors.accept_process) && (
                      <p className="text-[11px] text-red-500 font-bold">Please check all declarations to proceed</p>
                    )}
                    <InputField
                      label="AUTHORIZED SIGNATORY NAME"
                      placeholder="Full name as signature"
                      error={errors.signatory_name?.message}
                      {...register('signatory_name')}
                    />
                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">DATE</label>
                      <input
                        type="date"
                        min={today}
                        max={today}
                        {...register('declaration_date')}
                        className={`w-full bg-white lg:bg-slate-50 border ${errors.declaration_date ? 'border-red-200' : 'border-slate-100'} rounded-2xl px-5 py-4 text-base outline-none transition-all font-semibold shadow-sm`}
                      />
                      {errors.declaration_date && <p className="text-[10px] text-red-500 font-bold">{errors.declaration_date.message}</p>}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 lg:static lg:p-0 lg:border-none lg:bg-transparent lg:mt-8 space-y-3">
              <div className="flex gap-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    className="lg:hidden flex-1 bg-slate-50 text-slate-400 py-5 rounded-2xl font-bold border border-slate-100 active:scale-95 transition-all"
                  >
                    BACK
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] bg-[#d97234] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#c0652d] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#d97234]/10 active:scale-[0.98]"
                  >
                    CONTINUE <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex-[2] bg-[#027473] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#015a59] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-teal-900/10 active:scale-[0.98]"
                  >
                    SUBMIT APPLICATION <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden lg:block">
                Secured by 256-bit SSL encryption
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
