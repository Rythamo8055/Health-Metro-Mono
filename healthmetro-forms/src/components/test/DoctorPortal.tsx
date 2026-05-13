'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Download, 
  Copy, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  UserCircle,
  LayoutDashboard
} from 'lucide-react';

export default function DoctorPortal() {
  const [doctorId, setDoctorId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Generate or fetch Doctor ID
    const savedId = localStorage.getItem('test_doctor_id');
    if (savedId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDoctorId(savedId);
    } else {
      const newId = `DR-${uuidv4().slice(0, 8).toUpperCase()}`;
      localStorage.setItem('test_doctor_id', newId);
      setDoctorId(newId);
    }
    setBaseUrl(window.location.origin);
  }, []);

  const patientFormUrl = `${baseUrl}/test?view=patient&ref=${doctorId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(patientFormUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetId = () => {
    const newId = `DR-${uuidv4().slice(0, 8).toUpperCase()}`;
    localStorage.setItem('test_doctor_id', newId);
    setDoctorId(newId);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFA] font-sans p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#027473]">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Partner Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold text-[#1A2020]">Welcome, Dr. Partner</h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-slate-400" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</p>
              <p className="text-sm font-bold text-[#027473]">Verified Professional</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* QR Code Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-xl shadow-teal-900/5 space-y-8 text-center"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#1A2020]">Clinic QR Code</h2>
              <p className="text-sm text-slate-400">Place this QR on your consulting table for patients to scan.</p>
            </div>

            <div className="relative group inline-block p-6 bg-white rounded-[24px] border-2 border-dashed border-slate-100 group-hover:border-[#027473] transition-colors">
              <QRCodeSVG 
                value={patientFormUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 transition-opacity rounded-[24px]">
                <button className="p-3 bg-[#027473] text-white rounded-full shadow-lg">
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-[#1A2020] rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
              >
                {copied ? 'COPIED!' : <><Copy className="w-4 h-4" /> COPY LINK</>}
              </button>
              <button 
                onClick={() => window.open(patientFormUrl, '_blank')}
                className="flex items-center gap-2 px-6 py-3 bg-[#027473] text-white rounded-xl font-bold text-sm hover:bg-[#015a59] transition-all active:scale-95 shadow-lg shadow-teal-900/10"
              >
                <ExternalLink className="w-4 h-4" /> TEST SCAN
              </button>
            </div>
          </motion.div>

          {/* Settings & Stats */}
          <div className="space-y-8">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-teal-900/5 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#1A2020]">Referral Settings</h3>
                <button 
                  onClick={resetId}
                  className="p-2 text-slate-400 hover:text-[#d97234] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your UUID</p>
                    <p className="text-lg font-mono font-bold text-[#1A2020]">{doctorId}</p>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-[#027473]" />
                </div>

                <div className="p-6 bg-[#027473]/5 rounded-2xl border border-[#027473]/10">
                  <p className="text-sm text-[#027473] font-medium leading-relaxed">
                    This ID is automatically appended to your patient registration forms to track referral source and clinic metrics.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#d97234] rounded-[32px] p-8 text-white space-y-6 shadow-xl shadow-orange-900/10"
            >
              <h3 className="font-bold text-white/80 uppercase text-[10px] tracking-[0.2em]">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-xs font-medium text-white/60 mt-1">Total Scans</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-xs font-medium text-white/60 mt-1">Submissions</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
