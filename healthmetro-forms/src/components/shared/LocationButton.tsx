'use client';

import React, { useState } from 'react';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationButtonProps {
  onCapture?: (lat: number, lng: number) => void;
  error?: string;
}

export function LocationButton({ onCapture, error }: LocationButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = useState('');

  const capture = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = +pos.coords.latitude.toFixed(6);
        const lng = +pos.coords.longitude.toFixed(6);
        setCoords({ lat, lng });
        setStatus('done');
        onCapture?.(lat, lng);
      },
      err => {
        setStatus('error');
        setGeoError(err.message ?? 'Unable to retrieve location.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black tracking-widest text-slate-400 uppercase block">
        GPS Location
      </label>

      <button
        type="button"
        onClick={capture}
        disabled={status === 'loading'}
        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all font-semibold text-sm ${
          status === 'done'
            ? 'border-[#027473]/30 bg-teal-50/30 text-[#027473]'
            : status === 'error'
            ? 'border-red-200 bg-red-50/30 text-red-500'
            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-[#027473]/30 hover:bg-teal-50/20'
        }`}
      >
        {status === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#027473]" />
        ) : status === 'done' ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : (
          <MapPin className="w-4 h-4" />
        )}

        <span className="flex-1 text-left">
          {status === 'idle' && 'Share My Location'}
          {status === 'loading' && 'Detecting location...'}
          {status === 'done' && coords && `${coords.lat}, ${coords.lng}`}
          {status === 'error' && 'Failed — tap to retry'}
        </span>
      </button>

      {(error || geoError) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-red-500 font-bold px-1"
        >
          {error || geoError}
        </motion.p>
      )}
    </div>
  );
}
