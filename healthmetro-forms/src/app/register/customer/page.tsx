'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, ChevronRight, ShieldX, CheckCircle2, Clock, Home, Building2 } from 'lucide-react';
import Image from 'next/image';
import { InputField } from '@/components/shared/InputField';
import { SelectField } from '@/components/shared/SelectField';
import { LocationButton } from '@/components/shared/LocationButton';
import { useReferral } from '@/hooks/useReferral';
import { getStateOptions, getCityOptions } from '@/lib/locationData';

// ─── Schema (Doc 3) ────────────────────────────────────────────────────────
const schema = z.object({
  // Basic Info
  full_name: z.string().min(2, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  age: z.string().regex(/^([0-9]|[1-9][0-9]|1[0-1][0-9]|120)$/, 'Age must be between 0 and 120'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, '10-digit mobile starting with 6–9'),
  email: z.string().email('Enter valid email').optional().or(z.literal('')),
  // Address
  address: z.string().min(5, 'Address required'),
  state_code: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pin_code: z.string().regex(/^\d{6}$/, '6-digit PIN required'),
  // Collection mode
  collection_type: z.enum(['provider', 'home'], { message: 'Please select collection type' }),
  // Home-only fields
  home_address: z.string().optional(),
  maps_link: z.string().url('Enter a valid Google Maps URL').optional().or(z.literal('')),
  // Appointment
  appointment_date: z.string().min(1, 'Please select a date'),
  time_slot: z.string().min(1, 'Please select a time slot'),
  // Declaration
  consent_accurate: z.boolean().refine(v => v, { message: 'Required' }),
  consent_collection: z.boolean().refine(v => v, { message: 'Required' }),
  consent_communication: z.boolean().refine(v => v, { message: 'Required' }),
  consent_availability: z.boolean().refine(v => v, { message: 'Required' }),
  customer_signature: z.string().min(2, 'Your name is required'),
  signature_date: z.string().min(1, 'Date is required'),
}).superRefine((data, ctx) => {
  if (data.collection_type === 'home' && !data.home_address) {
    ctx.addIssue({ code: 'custom', path: ['home_address'], message: 'Home address is required for home collection' });
  }
});

type FormData = z.infer<typeof schema>;

const TIME_SLOTS = [
  { value: '07:00 AM – 09:00 AM', label: '07:00 AM – 09:00 AM' },
  { value: '09:00 AM – 11:00 AM', label: '09:00 AM – 11:00 AM' },
  { value: '11:00 AM – 01:00 PM', label: '11:00 AM – 01:00 PM' },
  { value: '04:00 PM – 06:00 PM', label: '04:00 PM – 06:00 PM' },
];

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const STEPS = [
  { id: 'personal', title: 'Personal Details', description: 'Tell us about yourself.', fields: ['full_name', 'gender', 'age', 'mobile', 'email'] as (keyof FormData)[] },
  { id: 'address', title: 'Address Details', description: 'Where are you located?', fields: ['address', 'state_code', 'city', 'pin_code'] as (keyof FormData)[] },
  { id: 'collection', title: 'Sample Collection', description: 'How would you like your sample collected?', fields: ['collection_type'] as (keyof FormData)[] },
  { id: 'appointment', title: 'Book Appointment', description: 'Pick your preferred slot.', fields: ['appointment_date', 'time_slot'] as (keyof FormData)[] },
  { id: 'declaration', title: 'Consent & Declaration', description: 'Review and confirm.', fields: ['consent_accurate', 'consent_collection', 'consent_communication', 'consent_availability', 'customer_signature', 'signature_date'] as (keyof FormData)[] },
];

// ── Blocked screen when client_id is missing/invalid ──────────────────────
function BlockedScreen() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFA] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-white p-10 rounded-[40px] shadow-xl text-center space-y-6 border border-slate-100"
      >
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1A2020]">Invalid Access</h1>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            This registration link is invalid or expired. Please scan the QR code provided by your healthcare provider.
          </p>
        </div>
        <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 text-left">
          <p className="text-[11px] text-[#d97234] font-bold leading-relaxed">
            Customer registration requires a valid Client ID from a registered provider.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function CustomerFormInner() {
  const { clientId, token, referralSource } = useReferral();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);

  const { register, handleSubmit, trigger, control, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { collection_type: undefined, consent_accurate: false, consent_collection: false, consent_communication: false, consent_availability: false },
    mode: 'onBlur',
  });

  // Verify Token on Mount
  useEffect(() => {
    async function checkToken() {
      if (!clientId || !token) {
        setIsValidToken(false);
        setIsVerifying(false);
        return;
      }
      
      try {
        const { verifyRegistrationToken } = await import('@/app/actions/customer');
        const valid = await verifyRegistrationToken(clientId, token);
        setIsValidToken(valid);
      } catch (err) {
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    }
    checkToken();
  }, [clientId, token]);

  const watchedState = watch('state_code');
  const collectionType = watch('collection_type');
  const appointmentDate = watch('appointment_date');

  useEffect(() => {
    if (watchedState) { setCityOptions(getCityOptions(watchedState)); setValue('city', ''); }
  }, [watchedState, setValue]);

  useEffect(() => {
    if (appointmentDate) {
      const dayIndex = new Date(appointmentDate).getDay(); // 0 is Sun
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayOfWeek = days[dayIndex];
      
      import('@/app/actions/customer').then(({ getBlockedSlots }) => {
        getBlockedSlots(dayOfWeek).then(setBlockedSlots);
      });
    } else {
      setBlockedSlots([]);
    }
  }, [appointmentDate]);

  const availableSlots = TIME_SLOTS.filter(s => !blockedSlots.includes(s.value));

  // Block access if no valid client_id or token
  if (isVerifying) return <div className="h-screen bg-[#F8FAFA]" />;
  if (!clientId || !isValidToken) return <BlockedScreen />;

  const handleNext = async () => {
    const valid = await trigger(STEPS[step].fields);
    if (valid) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new window.FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('clientId', clientId || '');
      formData.append('referralSource', referralSource || '');
      if (gpsCoords) formData.append('gpsCoords', JSON.stringify(gpsCoords));

      const { submitCustomerRegistration } = await import('@/app/actions/customer');
      const result = await submitCustomerRegistration(formData);

      if (!result.success) {
        // Handle specific slot conflict error
        if (result.error.includes('SLOT_CONFLICT')) {
          alert('This time slot is already booked. Please go back and select a different time slot.');
          setStep(3); // Send them back to appointment step
          return;
        }
        throw new Error(result.error);
      }

      setCustomerId(result.customer_id);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFA] p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-2xl shadow-teal-900/5 text-center space-y-6 border border-slate-100"
        >
          <div className="w-16 h-16 bg-[#027473] rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1A2020]">Booking Confirmed!</h1>
            <p className="text-slate-500 text-sm mt-2">Your appointment has been scheduled successfully.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-left space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Customer ID</p>
            <p className="text-xl font-mono font-bold text-[#027473]">{customerId}</p>
            <p className="text-[11px] text-slate-400 font-medium">Save this ID for tracking your booking and reports.</p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-orange-50/60 rounded-2xl border border-orange-100 text-left">
            <Clock className="w-4 h-4 text-[#d97234] mt-0.5 shrink-0" />
            <p className="text-[11px] text-[#d97234] font-bold leading-relaxed">
              You will receive your appointment confirmation and phlebotomist details via SMS/Email.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white font-sans text-[#1A2020]">

      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Health Metro" width={110} height={28} className="object-contain" />
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <span className="text-[8px] font-bold tracking-widest text-[#d97234] uppercase">Book Test</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-6 bg-[#d97234]' : i < step ? 'w-2 bg-[#027473]' : 'w-2 bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* Left panel */}
      <div className="hidden lg:flex w-[38%] bg-white p-12 flex-col justify-between border-r border-slate-100">
        <div className="space-y-10">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Image src="/logo.png" alt="Health Metro" width={160} height={40} className="object-contain" priority />
              <div className="h-6 w-px bg-slate-200" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#d97234] uppercase">Book a Test</span>
            </div>

            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 p-2">
                <Image src="/icons/hm-move.png" alt="HM MOVE" width={80} height={80} className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-[#d97234] uppercase">HM MOVE</span>
                <span className="text-xs font-bold text-slate-400">Verified Service</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.05] tracking-tight">
              Your health,<br />
              <span className="text-[#d97234] italic font-serif font-medium">at your doorstep.</span>
            </h1>
            <p className="text-slate-500 leading-relaxed">
              Book a blood test in minutes. We collect at your provider's clinic or right at your home.
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Referred by Provider</p>
            <p className="text-sm font-bold text-[#1A2020] font-mono">{clientId}</p>
          </div>
        </div>
        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className={`flex items-center gap-3 transition-all ${i === step ? 'opacity-100' : i < step ? 'opacity-60' : 'opacity-30'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < step ? 'bg-[#027473] text-white' : i === step ? 'bg-[#d97234] text-white' : 'bg-slate-100 text-slate-400'}`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <p className="text-xs font-bold">{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 h-full overflow-y-auto bg-[#F8FAFA] flex flex-col p-6 lg:p-12 pb-32 lg:pb-12">
        <div className="w-full max-w-xl mx-auto space-y-8 h-full flex flex-col justify-center">

          <div className="hidden lg:flex items-center justify-between">
            {step > 0
              ? <button type="button" onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 hover:text-[#d97234] group">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK
                </button>
              : <div />}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[#d97234]' : i < step ? 'w-4 bg-[#027473]' : 'w-4 bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <div className="space-y-1 text-center lg:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#d97234]">Step {step + 1} of {STEPS.length}</p>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">{STEPS[step].title}</h2>
            <p className="text-slate-500 text-sm">{STEPS[step].description}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="space-y-5">

                {/* Step 0: Personal Details */}
                {step === 0 && (
                  <>
                    <InputField label="FULL NAME" placeholder="Your full name" error={errors.full_name?.message} {...register('full_name')} />
                    <div className="grid grid-cols-2 gap-4">
                      <Controller name="gender" control={control} render={({ field }) => (
                        <SelectField label="GENDER" options={GENDER_OPTIONS} value={field.value} onChange={field.onChange} error={errors.gender?.message} searchable={false} />
                      )} />
                      <InputField label="AGE" placeholder="e.g. 32" maxLength={3} error={errors.age?.message} {...register('age')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="MOBILE NUMBER" placeholder="10-digit mobile" maxLength={10} error={errors.mobile?.message} {...register('mobile')} />
                      <InputField label="EMAIL (OPTIONAL)" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
                    </div>
                  </>
                )}

                {/* Step 1: Address */}
                {step === 1 && (
                  <>
                    <InputField label="FULL ADDRESS" placeholder="House no, Street, Area" error={errors.address?.message} {...register('address')} />
                    <div className="grid grid-cols-2 gap-4">
                      <Controller name="state_code" control={control} render={({ field }) => (
                        <SelectField label="STATE" placeholder="Select state" options={getStateOptions()} value={field.value} onChange={field.onChange} error={errors.state_code?.message} />
                      )} />
                      <Controller name="city" control={control} render={({ field }) => (
                        <SelectField label="CITY" placeholder={watchedState ? 'Select city' : 'Select state first'} options={cityOptions} value={field.value} onChange={field.onChange} error={errors.city?.message} disabled={!watchedState} />
                      )} />
                    </div>
                    <InputField label="PIN CODE" placeholder="6-digit PIN" maxLength={6} error={errors.pin_code?.message} {...register('pin_code')} />
                  </>
                )}

                {/* Step 2: Collection Mode */}
                {step === 2 && (
                  <div className="space-y-4">
                    {[
                      { value: 'provider' as const, icon: Building2, title: 'Collected by Healthcare Provider', desc: 'Sample collected at the clinic, hospital, or pharmacy. No home visit needed.' },
                      { value: 'home' as const, icon: Home, title: 'Home Collection', desc: 'A trained phlebotomist visits your home. GPS location required.' },
                    ].map(({ value, icon: Icon, title, desc }) => (
                      <label key={value} className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${collectionType === value ? 'border-[#d97234] bg-orange-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <input type="radio" value={value} {...register('collection_type')} className="mt-1 accent-[#d97234] w-4 h-4 shrink-0" />
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${collectionType === value ? 'bg-[#d97234]/10' : 'bg-slate-100'}`}>
                            <Icon className={`w-4 h-4 ${collectionType === value ? 'text-[#d97234]' : 'text-slate-400'}`} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-[#1A2020]">{title}</p>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{desc}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                    {errors.collection_type && <p className="text-[11px] text-red-500 font-bold">{errors.collection_type.message}</p>}

                    {/* Home collection extras */}
                    <AnimatePresence>
                      {collectionType === 'home' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden pt-2">
                          <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                            <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-3">Home Collection Details</p>
                            <div className="space-y-4">
                              <InputField label="HOME ADDRESS" placeholder="Full home address for phlebotomist" error={errors.home_address?.message} {...register('home_address')} />
                              <LocationButton onCapture={(lat, lng) => setGpsCoords({ lat, lng })} />
                              <InputField label="GOOGLE MAPS LINK (OPTIONAL)" placeholder="https://maps.google.com/..." error={errors.maps_link?.message} {...register('maps_link')} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Step 3: Appointment */}
                {step === 3 && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">APPOINTMENT DATE</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('appointment_date')}
                        className={`w-full bg-white lg:bg-slate-50 border ${errors.appointment_date ? 'border-red-200' : 'border-slate-100'} rounded-2xl px-5 py-4 text-base outline-none font-semibold shadow-sm`}
                      />
                      {errors.appointment_date && <p className="text-[10px] text-red-500 font-bold">{errors.appointment_date.message}</p>}
                    </div>
                    <Controller name="time_slot" control={control} render={({ field }) => (
                      <SelectField label="TIME SLOT" placeholder={availableSlots.length > 0 ? "Select preferred time" : "No slots available this day"} options={availableSlots} value={field.value} onChange={field.onChange} error={errors.time_slot?.message} searchable={false} disabled={availableSlots.length === 0} />
                    )} />
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        ⚠️ Slots are subject to availability. Fasting tests (7–9 AM) are recommended for best results.
                      </p>
                    </div>
                  </>
                )}

                {/* Step 4: Declaration */}
                {step === 4 && (
                  <div className="space-y-4">
                    {[
                      { name: 'consent_accurate' as const, label: 'I confirm that all information provided is correct.' },
                      { name: 'consent_collection' as const, label: 'I consent to blood sample collection as part of this service.' },
                      { name: 'consent_communication' as const, label: 'I agree to receive communication regarding my booking and reports.' },
                      { name: 'consent_availability' as const, label: 'I understand that services depend on slot availability.' },
                    ].map(({ name, label }) => (
                      <label key={name} className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${watch(name) ? 'border-[#027473]/30 bg-teal-50/30' : errors[name] ? 'border-red-200 bg-red-50/20' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <input type="checkbox" {...register(name)} className="mt-0.5 w-4 h-4 accent-[#027473] shrink-0" />
                        <span className="text-sm text-slate-600 font-medium leading-relaxed">{label}</span>
                      </label>
                    ))}
                    {(errors.consent_accurate || errors.consent_collection || errors.consent_communication || errors.consent_availability) && (
                      <p className="text-[11px] text-red-500 font-bold">Please check all consent boxes to proceed</p>
                    )}
                    <InputField label="CUSTOMER NAME (SIGNATURE)" placeholder="Your full name" error={errors.customer_signature?.message} {...register('customer_signature')} />
                    <div className="space-y-2">
                      <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">DATE</label>
                      <input type="date" {...register('signature_date')} className={`w-full bg-white lg:bg-slate-50 border ${errors.signature_date ? 'border-red-200' : 'border-slate-100'} rounded-2xl px-5 py-4 text-base outline-none font-semibold shadow-sm`} />
                      {errors.signature_date && <p className="text-[10px] text-red-500 font-bold">{errors.signature_date.message}</p>}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 lg:static lg:p-0 lg:border-none lg:bg-transparent lg:mt-8 space-y-3">
              <div className="flex gap-4">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} className="lg:hidden flex-1 bg-slate-50 text-slate-400 py-5 rounded-2xl font-bold border border-slate-100 active:scale-95">
                    BACK
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={handleNext} className="flex-[2] bg-[#d97234] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#c0652d] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#d97234]/10 active:scale-[0.98]">
                    CONTINUE <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button type="submit" className="flex-[2] bg-[#027473] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#015a59] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-teal-900/10 active:scale-[0.98]">
                    CONFIRM BOOKING <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#F8FAFA]" />}>
      <CustomerFormInner />
    </Suspense>
  );
}
