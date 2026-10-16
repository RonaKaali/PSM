'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, ShieldCheck, User } from 'lucide-react';

export type UserRole = 'super_admin' | 'admin';

export interface AuthUser {
  username: string;
  role: UserRole;
  displayName: string;
}

// Simple hardcoded credentials (internal use only)
const USERS: { username: string; password: string; role: UserRole; displayName: string }[] = [
  {
    username: 'sarlane',
    password: 'ewako',
    role: 'super_admin',
    displayName: 'Super Admin',
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    displayName: 'Admin Operasional',
  },
];

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const found = USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (found) {
      onLogin({
        username: found.username,
        role: found.role,
        displayName: found.displayName,
      });
    } else {
      setError('Username atau password salah. Hubungi Super Admin.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#881337]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-950/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Company Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl shadow-rose-950/30 mb-4 p-2 border border-rose-200/20">
            <img
              src="/logopsm.png"
              alt="Logo PT. PSM"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider uppercase font-serif">
            PT. PUTRA SAIJAAN MANDIRI
          </h1>
          <p className="text-sm text-rose-300 mt-1 font-medium">
            Sistem Surat Jalan Armada &amp; Perhitungan Margin Operasional
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Kotabaru, Kalimantan Selatan
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-rose-900/40 rounded-2xl shadow-2xl shadow-rose-950/30 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#380412] via-[#780d28] to-[#500718] px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Masuk ke Sistem</h2>
              <p className="text-xs text-rose-200">Khusus karyawan & manajemen PT. PSM</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Alert */}
            {error && (
              <div className="bg-rose-950/60 border border-rose-700/60 text-rose-300 rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2">
                <span className="text-rose-400 text-lg">⚠</span>
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#881337] to-[#be123c] hover:from-[#9f1239] hover:to-[#e11d48] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-6">
          © 2026 PT. Putra Saijaan Mandiri — Internal Use Only
        </p>
      </div>
    </div>
  );
}
