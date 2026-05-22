'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  required?: boolean;
}

export const SelectField = React.forwardRef<HTMLDivElement, SelectFieldProps>(
  ({ label, placeholder = 'Select...', options, value, onChange, error, disabled, searchable = true }, ref) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);

    const selectId = React.useId();
    const triggerId = `${selectId}-trigger`;
    const listboxId = `${selectId}-listbox`;
    const errorId = `${selectId}-error`;

    const selected = options.find(o => o.value === value);

    const filtered = searchable
      ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
      : options;

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
          setSearch('');
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keep focusedIndex in bounds when options filter changes
    useEffect(() => {
      setFocusedIndex(-1);
    }, [search]);

    // Auto-scroll active keyboard-focused item into view
    useEffect(() => {
      if (open && focusedIndex >= 0) {
        const activeEl = document.getElementById(`${selectId}-opt-${focusedIndex}`);
        if (activeEl && listboxRef.current) {
          const container = listboxRef.current;
          const elementTop = activeEl.offsetTop;
          const elementBottom = elementTop + activeEl.offsetHeight;
          const containerTop = container.scrollTop;
          const containerBottom = containerTop + container.clientHeight;

          if (elementTop < containerTop) {
            container.scrollTop = elementTop;
          } else if (elementBottom > containerBottom) {
            container.scrollTop = elementBottom - container.clientHeight;
          }
        }
      }
    }, [focusedIndex, open, selectId]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      const isInput = e.target instanceof HTMLInputElement;

      if (!open) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setOpen(true);
          const initialIndex = filtered.findIndex(o => o.value === value);
          setFocusedIndex(initialIndex >= 0 ? initialIndex : 0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (filtered.length ? (prev + 1) % filtered.length : -1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (filtered.length ? (prev - 1 + filtered.length) % filtered.length : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filtered.length) {
            onChange?.(filtered[focusedIndex].value);
            setOpen(false);
            setSearch('');
            // Focus trigger button back
            const triggerBtn = document.getElementById(triggerId);
            triggerBtn?.focus();
          }
          break;
        case ' ':
          if (isInput) return; // Allow space key inside search input field
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filtered.length) {
            onChange?.(filtered[focusedIndex].value);
            setOpen(false);
            setSearch('');
            const triggerBtn = document.getElementById(triggerId);
            triggerBtn?.focus();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          setSearch('');
          const triggerBtn = document.getElementById(triggerId);
          triggerBtn?.focus();
          break;
        case 'Tab':
          setOpen(false);
          setSearch('');
          break;
        default:
          break;
      }
    };

    return (
      <div ref={ref} className="space-y-2" onKeyDown={handleKeyDown}>
        <div className="flex justify-between items-end">
          <label 
            htmlFor={triggerId} 
            className="text-[9px] font-black tracking-widest text-slate-400 uppercase"
          >
            {label}
          </label>
          {error && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] text-red-500 font-bold"
            >
              {error}
            </motion.p>
          )}
        </div>

        <div ref={containerRef} className="relative">
          <button
            id={triggerId}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listboxId : undefined}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            disabled={disabled}
            onClick={() => { if (!disabled) { setOpen(o => !o); setSearch(''); } }}
            className={`w-full bg-white lg:bg-slate-50 border ${
              error ? 'border-red-200 focus:ring-red-500/5' : 'border-slate-100 focus:ring-[#d97234]/5'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} rounded-2xl px-4 lg:px-5 py-3.5 lg:py-4 text-sm lg:text-base outline-none transition-all shadow-sm lg:shadow-none flex items-center justify-between text-left`}
          >
            <span className={`block truncate ${selected ? 'font-semibold text-[#1A2020]' : 'text-slate-300 font-semibold'}`}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-900/5 overflow-hidden"
              >
                {searchable && (
                  <div className="p-2 border-b border-slate-50">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                      <Search className="w-3.5 h-3.5 text-slate-300" />
                      <input
                        autoFocus
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="text-sm bg-transparent outline-none flex-1 placeholder:text-slate-300 font-medium"
                      />
                    </div>
                  </div>
                )}
                <div 
                  ref={listboxRef}
                  id={listboxId}
                  role="listbox"
                  aria-label={label}
                  className="max-h-60 lg:max-h-52 overflow-y-auto py-1 overscroll-contain touch-auto" 
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  {filtered.length === 0 ? (
                    <p className="text-center text-slate-400 text-xs py-4 font-medium">No results</p>
                  ) : (
                    filtered.map((opt, index) => (
                      <button
                        key={opt.value}
                        id={`${selectId}-opt-${index}`}
                        type="button"
                        role="option"
                        aria-selected={opt.value === value}
                        onClick={() => { onChange?.(opt.value); setOpen(false); setSearch(''); }}
                        className={`w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:bg-slate-50 ${
                          opt.value === value ? 'text-[#d97234] bg-orange-50/50' : 'text-[#1A2020]'
                        } ${index === focusedIndex ? 'bg-slate-100 text-[#027473] outline-none font-bold' : ''}`}
                      >
                        {opt.label}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
