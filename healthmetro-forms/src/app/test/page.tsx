'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DoctorPortal from '@/components/test/DoctorPortal';
import PatientForm from '@/components/test/PatientForm';
import { motion, AnimatePresence } from 'framer-motion';

function TestPageInner() {
  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'doctor';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Test Switcher (Only visible in dev/test) */}
      <div className="fixed top-24 right-6 z-[100] bg-white/80 backdrop-blur-md border border-slate-200 p-1.5 rounded-full shadow-2xl flex gap-1 pointer-events-auto">
        <button 
          onClick={() => window.location.href = '/test?view=doctor'}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            view === 'doctor' ? 'bg-[#027473] text-white shadow-lg' : 'text-slate-400 hover:text-[#027473]'
          }`}
        >
          Portal
        </button>
        <button 
          onClick={() => window.location.href = '/test?view=patient'}
          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            view === 'patient' ? 'bg-[#d97234] text-white shadow-lg' : 'text-slate-400 hover:text-[#d97234]'
          }`}
        >
          Form
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {view === 'doctor' ? <DoctorPortal /> : <PatientForm />}
        </motion.div>
      </AnimatePresence>

      {/* Instructions Overlay (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-[100] max-w-[240px] bg-black/90 text-white p-4 rounded-2xl text-[10px] font-medium leading-relaxed shadow-2xl pointer-events-none">
        <p className="opacity-60 font-black uppercase tracking-[0.2em] mb-2 text-[#d97234]">Developer Guide</p>
        {view === 'doctor' ? (
          <p>This is the **Doctor Portal**. Copy the link or scan the QR to test the patient flow with your ID.</p>
        ) : (
          <p>This is the **Patient Form**. Notice the ID in the URL is captured and logged to the console on submission.</p>
        )}
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">Loading Test Suite...</div>}>
      <TestPageInner />
    </Suspense>
  );
}
