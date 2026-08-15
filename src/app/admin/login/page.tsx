'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, KeyRound, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@kalakritiarts.in');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then((r) => r.json());

      if (res.success) {
        router.push('/admin/dashboard');
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-stone-900 border border-amber-900/40 rounded-2xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-700/50 flex items-center justify-center text-amber-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-amber-100">KalaKriti Arts Studio</h1>
          <p className="text-xs text-stone-400">Store Owner Back-Office Login</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-400 mb-1">Owner Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-600"
              />
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-stone-400 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2.5 text-stone-100 focus:outline-none focus:border-amber-600"
              />
              <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-lg text-[11px] text-amber-300">
            <strong>Default Demo Credentials:</strong><br />
            Email: <code className="text-amber-100">admin@kalakritiarts.in</code><br />
            Password: <code className="text-amber-100">admin123</code>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-700 hover:bg-amber-600 text-amber-50 py-3 rounded-xl font-medium text-xs shadow-lg transition"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In To Dashboard'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-stone-400 hover:text-amber-300 underline">
            ← Back to Customer Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
