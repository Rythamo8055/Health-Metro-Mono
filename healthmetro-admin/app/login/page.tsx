'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('password', password);

    const result = await login(formData);

    if (result.success) {
      router.push('/');
      router.refresh();
    } else {
      setError(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-[family-name:var(--font-inter)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="w-14 h-14 bg-[#027473]/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-7 h-7 text-[#027473]" />
          </div>
          
          <h1 className="text-2xl font-black text-[#1A2020] tracking-tight mb-2">
            Admin Portal
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Enter your secure password to access the Health Metro dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[#1A2020] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#027473]/20 focus:border-[#027473] transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#027473] hover:bg-[#015A59] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
