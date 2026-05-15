'use client';

import { useState, useEffect } from 'react';
import { Download, Loader2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function QRCodeDisplay({ clientId }: { clientId: string }) {
  const [qrData, setQrData] = useState<{ imageUrl: string; registrationUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQR() {
      setLoading(true);
      try {
        const { data, error: dbError } = await supabase
          .from('qr_codes')
          .select('qr_url, qr_image_path')
          .eq('client_id', clientId)
          .single();

        if (dbError) throw dbError;

        // Get public URL from storage
        const { data: { publicUrl } } = supabase.storage
          .from('qrcodes')
          .getPublicUrl(data.qr_image_path);

        setQrData({
          imageUrl: publicUrl,
          registrationUrl: data.qr_url
        });
      } catch (err: any) {
        console.error('Error fetching QR:', err);
        setError('QR Code not found. It might not have been generated yet.');
      } finally {
        setLoading(false);
      }
    }

    if (clientId) fetchQR();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <Loader2 className="w-8 h-8 text-[#027473] animate-spin mb-2" />
        <p className="text-[12px] font-bold text-slate-400">Loading QR Code...</p>
      </div>
    );
  }

  if (error || !qrData) {
    return (
      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
        <p className="text-[12px] font-bold text-orange-600">{error || 'No QR code available'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
        <div className="relative w-48 h-48 bg-slate-50 rounded-xl overflow-hidden mb-4 border border-slate-50">
          <Image 
            src={qrData.imageUrl} 
            alt="Customer Registration QR" 
            fill 
            className="object-contain p-2"
          />
        </div>
        
        <div className="w-full space-y-2">
          <a 
            href={qrData.registrationUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[12px] font-bold border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Test Link
          </a>
          <a 
            href={qrData.imageUrl} 
            download={`${clientId}-QR.png`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#027473] text-white rounded-xl text-[12px] font-bold hover:bg-[#015a59] transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download QR
          </a>
        </div>
      </div>
      
      <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
        <p className="text-[12px] font-black text-teal-600 uppercase tracking-widest">Target URL</p>
        <p className="text-[12px] text-teal-700 font-mono break-all mt-1">{qrData.registrationUrl}</p>
      </div>
    </div>
  );
}
