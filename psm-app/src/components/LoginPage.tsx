'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, ShieldCheck, User, Truck, MapPin, Sparkles, Fuel } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

      {/* Background Decorative Lighting & Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-rose-900/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#881337]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Dual-Column Container */}
      <div className="w-full max-w-5xl bg-slate-900/90 border border-rose-900/40 rounded-3xl shadow-2xl shadow-rose-950/40 overflow-hidden relative z-10 grid grid-cols-1 lg:grid-cols-12 backdrop-blur-md">

        {/* ========================================================= */}
        {/* LEFT COLUMN: HERO PHOTO VISUAL SHOWCASE (fotopsm1.jpeg)   */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[360px] lg:min-h-[620px] bg-slate-950 overflow-hidden flex flex-col justify-between p-6 sm:p-8">

          {/* Background Truck Photo */}
          <div className="absolute inset-0 z-0">
            <img
              src="/fotopsm1.jpeg"
              alt="Armada Truk Tangki BBM PT. Putra Saijaan Mandiri"
              className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/60 hidden lg:block" />
          </div>

          {/* Top Badge on Photo */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>Armada Tangki BBM PSM</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-rose-950/80 backdrop-blur-md border border-rose-700/50 text-rose-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>Kotabaru, Kalsel</span>
            </div>
          </div>

          {/* Bottom Caption & Fleet Operations Info */}
          <div className="relative z-10 mt-auto pt-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Operasional Lapangan 24/7
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight font-serif">
              Transportasi &amp; Distribusi BBM Industri
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Pengiriman terpadu armada tangki <strong className="text-amber-300">DA 8485 TG</strong> &amp; armada PSM ke seluruh pelabuhan, customer, dan site operasional di Kalimantan Selatan.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
              <div className="bg-slate-950/70 backdrop-blur-sm p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Kapasitas Armada</span>
                <span className="font-bold text-amber-300">5.000 L &amp; 10.000 L</span>
              </div>
              <div className="bg-slate-950/70 backdrop-blur-sm p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Standar Angkutan</span>
                <span className="font-bold text-emerald-300">BBM &amp; Bio Solar (B50)</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LOGIN FORM & COMPANY AUTHENTICATION         */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-slate-900/95">

          <div>
            {/* Header Brand */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-xl shadow-rose-950/40 p-1.5 border border-rose-200/30 shrink-0 flex items-center justify-center">
                <img
                  src="/logopsm.png"
                  alt="Logo PT. PSM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase block">
                  PORTAL RESMI OPERASIONAL
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide font-serif">
                  PT. PUTRA SAIJAAN MANDIRI
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sistem Surat Jalan Armada &amp; Perhitungan Margin Operasional
                </p>
              </div>
            </div>

            {/* Login Card Header */}
            <div className="bg-gradient-to-r from-[#380412] via-[#630b22] to-[#380412] border border-rose-900/60 px-5 py-3.5 rounded-xl flex items-center gap-3 mb-6 shadow-sm">
              <div className="p-2 bg-white/10 rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-white text-sm">Masuk ke Portal Internal</h2>
                <p className="text-[11px] text-rose-200">
                  Akses khusus manajemen &amp; staf operasional PT. PSM
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-rose-950/70 border border-rose-700 text-rose-200 rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                  <span className="text-rose-400 text-base">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
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
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-rose-500 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password akun"
                    required
                    className="w-full bg-slate-950 border border-slate-700/80 focus:border-rose-500 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#be123c] hover:from-[#9f1239] hover:via-[#be123c] hover:to-[#e11d48] disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 transition cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 PT. Putra Saijaan Mandiri</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              Sistem Surat Jalan Armada Kotabaru
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
