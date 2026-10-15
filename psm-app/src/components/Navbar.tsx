'use client';

import React from 'react';
import { PSMLogo } from './PSMLogo';
import { PlusCircle, FileSpreadsheet, Truck, Database, Shield, UserCheck } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface NavbarProps {
  currentRole: 'admin' | 'finance' | 'viewer';
  onRoleChange: (role: 'admin' | 'finance' | 'viewer') => void;
  onOpenCreateModal: () => void;
  onOpenVehicleModal: () => void;
  onOpenSupabaseModal: () => void;
  onExportExcel: () => void;
}

export function Navbar({
  currentRole,
  onRoleChange,
  onOpenCreateModal,
  onOpenVehicleModal,
  onOpenSupabaseModal,
  onExportExcel,
}: NavbarProps) {
  return (
    <header className="app-header bg-gradient-to-r from-[#380412] via-[#780d28] to-[#500718] text-white border-b border-rose-900/60 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Company Identity */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-full shadow-md border border-rose-300/40">
              <PSMLogo size={46} light={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg md:text-xl tracking-wider text-white font-serif uppercase">
                  PT. PUTRA SAIJAAN MANDIRI
                </h1>
                <span className="hidden sm:inline-block bg-amber-400/90 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded tracking-wider">
                  KOTABARU
                </span>
              </div>
              <p className="text-xs text-rose-200 font-medium">
                Sistem Surat Jalan Armada BBM & Kalkulator Margin Operasional
              </p>
            </div>
          </div>

          {/* Right Control Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role Switcher */}
            <div className="hidden md:flex items-center bg-black/30 border border-rose-900/50 rounded-lg p-1 text-xs">
              <span className="px-2 text-rose-300 font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Role:
              </span>
              <button
                type="button"
                onClick={() => onRoleChange('admin')}
                className={`px-2.5 py-1 rounded transition font-semibold cursor-pointer ${currentRole === 'admin' ? 'bg-[#9f1239] text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                Admin Ops
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('finance')}
                className={`px-2.5 py-1 rounded transition font-semibold cursor-pointer ${currentRole === 'finance' ? 'bg-[#9f1239] text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                Owner / Finance
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('viewer')}
                className={`px-2.5 py-1 rounded transition font-semibold cursor-pointer ${currentRole === 'viewer' ? 'bg-[#9f1239] text-white shadow' : 'text-slate-300 hover:text-white'}`}
              >
                Viewer
              </button>
            </div>

            {/* Supabase Status Pill */}
            <button
              onClick={onOpenSupabaseModal}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/90'
                  : 'bg-amber-950/80 border-amber-500/50 text-amber-300 hover:bg-amber-900/90'
              }`}
              title="Konfigurasi Database Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">
                {isSupabaseConfigured ? 'Supabase Live' : 'Database Setup'}
              </span>
            </button>

            {/* Master Armada Button */}
            <button
              onClick={onOpenVehicleModal}
              className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-rose-900/60 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Armada (6)</span>
            </button>

            {/* Export Excel Button */}
            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-md cursor-pointer"
              title="Export Rekap Surat Jalan ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            {/* Buat Surat Jalan Button */}
            {currentRole !== 'viewer' && (
              <button
                onClick={onOpenCreateModal}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2 rounded-lg text-xs sm:text-sm shadow-lg shadow-amber-900/30 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>+ Surat Jalan</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
