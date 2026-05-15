'use client';

import React, { useRef, useState } from 'react';
import { Upload, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadFieldProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File | null) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FileUploadField({
  label,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  onFileSelect,
  error,
  hint = 'PDF, JPG, PNG — max 10 MB',
  required,
}: FileUploadFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sizeError, setSizeError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > maxSizeMB * 1024 * 1024) {
      setSizeError(`File exceeds ${maxSizeMB} MB`);
      return;
    }
    setSizeError('');
    setFile(f);
    onFileSelect?.(f);
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setSizeError('');
    onFileSelect?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = error || sizeError;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-[12px] font-black tracking-widest text-slate-400 uppercase">
          {label}{required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {displayError && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] text-red-500 font-bold">
            {displayError}
          </motion.p>
        )}
      </div>

      <div
        onClick={() => !file && inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        className={`border-2 border-dashed rounded-2xl px-5 py-4 transition-all ${
          file
            ? 'border-[#027473]/30 bg-teal-50/30 cursor-default'
            : displayError
            ? 'border-red-200 bg-red-50/20 cursor-pointer'
            : 'border-slate-200 bg-slate-50/50 cursor-pointer hover:border-[#d97234]/40 hover:bg-orange-50/20'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl shrink-0">
                <Upload className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Click or drag to upload</p>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">{hint}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#027473] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#027473] truncate">{file.name}</p>
                <p className="text-[12px] text-slate-400 font-medium">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button type="button" onClick={reset} className="p-1 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
