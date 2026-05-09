'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, ...props }, ref) => {
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
          suppressHydrationWarning
          className={`w-full bg-white lg:bg-slate-50 border ${
            error ? 'border-red-200 focus:ring-red-500/5 focus:border-red-500' : 'border-slate-100 focus:ring-[#d97234]/5 focus:border-[#d97234]'
          } rounded-2xl px-5 py-4 text-base outline-none transition-all placeholder:text-slate-300 font-semibold shadow-sm lg:shadow-none`}
          {...props}
        />
      </div>
    );
  }
);

InputField.displayName = 'InputField';
