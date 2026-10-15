'use client';

import React, { useState } from 'react';
import { X, Database, CheckCircle, Copy, Key, Server, Terminal, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface SupabaseConfigModalProps {
  onClose: () => void;
}

export function SupabaseConfigModal({ onClose }: SupabaseConfigModalProps) {
  const [copied, setCopied] = useState(false);

  const sqlPath = 'supabase/schema.sql';
  const dbPass = 'ySHlGHPyNSxUBj04';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-900/50 text-slate-100 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#4c0519] via-[#881337] to-[#700c1e] px-6 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">
                Koneksi Database Supabase
              </h3>
              <p className="text-xs text-rose-200">
                PT. Putra Saijaan Mandiri • PostgreSQL & RLS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs sm:text-sm">
          
          {/* Current Status */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            isSupabaseConfigured
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
          }`}>
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">
                Status Koneksi: {isSupabaseConfigured ? 'Terhubung ke Live Supabase' : 'Mode Demo & Local Storage Aktif'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">
                {isSupabaseConfigured
                  ? 'Aplikasi membaca dan menulis data langsung ke server PostgreSQL Supabase.'
                  : 'Aplikasi saat ini berjalan 100% normal dengan penyimpanan lokal browser dan data awal 6 armada bawaan.'}
              </p>
            </div>
          </div>

          {/* Database Info Received */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Password Database yang Tersimpan:
            </span>
            <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-amber-300 font-bold">
              <span>{dbPass}</span>
              <button
                onClick={() => copyToClipboard(dbPass)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Step by Step Guide to Activate Live Supabase */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-400" />
              Langkah Menghubungkan Supabase:
            </span>

            <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs">
              <li>
                Buka dashboard proyek Anda di{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 underline font-semibold inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
              <li>
                Masuk ke menu <strong>SQL Editor</strong>, lalu salin dan jalankan seluruh isi file:{' '}
                <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  {sqlPath}
                </code>{' '}
                (sudah tersedia lengkap di folder proyek).
              </li>
              <li>
                Buka menu <strong>Project Settings → API</strong> di Supabase, lalu masukkan URL dan Anon Key ke file{' '}
                <code className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  .env.local
                </code>
                :
              </li>
            </ol>

            <div className="bg-slate-900 p-3 rounded-lg font-mono text-[11px] text-slate-300 border border-slate-800 overflow-x-auto">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...</div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="bg-[#881337] hover:bg-[#9f1239] text-white px-6 py-2 rounded-lg text-xs font-bold transition"
            >
              Tutup & Lanjutkan Aplikasi
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
