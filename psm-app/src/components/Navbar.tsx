'use client';

import React from 'react';
import { PlusCircle, FileSpreadsheet, Truck, LogOut, Shield, User, Building2 } from 'lucide-react';
import { AuthUser } from './LoginPage';

interface NavbarProps {
  onOpenCreateModal: () => void;
  onOpenVehicleModal?: () => void;
  onOpenDestinationModal?: () => void;
  vehiclesCount?: number;
  destinationsCount?: number;
  onExportExcel: () => void;
  currentUser: AuthUser;
  onLogout: () => void;
}

export function Navbar({
  onOpenCreateModal,
  onOpenVehicleModal,
  onOpenDestinationModal,
  vehiclesCount = 6,
  destinationsCount = 12,
  onExportExcel,
  currentUser,
  onLogout,
}: NavbarProps) {
  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <header className="app-header bg-linear-to-r from-[#380412] via-[#780d28] to-[#500718] text-white border-b border-rose-900/60 shadow-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Company Identity */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-lg shadow-md border border-rose-300/40 shrink-0">
              <img
                src="/logopsm.png"
                alt="Logo PT. PSM"
                className="h-11 w-auto object-contain"
              />
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
                Sistem Surat Jalan Armada &amp; Perhitungan Margin Operasional
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* User Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/30 border border-rose-900/50 rounded-lg px-3 py-1.5">
              {isSuperAdmin ? (
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <User className="w-3.5 h-3.5 text-slate-300" />
              )}
              <span className={`text-xs font-bold ${isSuperAdmin ? 'text-amber-300' : 'text-slate-200'}`}>
                {currentUser.username}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                isSuperAdmin
                  ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                  : 'bg-slate-700 text-slate-300'
              }`}>
                {isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN'}
              </span>
            </div>

            {/* Master Armada Button - Available for Both Roles */}
            {onOpenVehicleModal && (
              <button
                onClick={onOpenVehicleModal}
                className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-rose-900/60 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                title="Kelola Master Armada Kendaraan & Supir"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Armada ({vehiclesCount})</span>
              </button>
            )}

            {/* Master PT Tujuan Button - Available for Both Roles */}
            {onOpenDestinationModal && (
              <button
                onClick={onOpenDestinationModal}
                className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-rose-900/60 text-slate-200 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
                title="Kelola Master PT / UD Tujuan Pengiriman & Alamat Bongkar"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">PT Tujuan ({destinationsCount})</span>
              </button>
            )}

            {/* Export Excel - Super Admin & Admin */}
            <button
              onClick={onExportExcel}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-md cursor-pointer"
              title="Export Rekap Surat Jalan ke Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span className="hidden sm:inline">Export Excel</span>
            </button>

            {/* Buat Surat Jalan Button - Both Roles */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-4 py-2 rounded-lg text-xs sm:text-sm shadow-lg shadow-amber-900/30 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ Surat Jalan</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-rose-300 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
