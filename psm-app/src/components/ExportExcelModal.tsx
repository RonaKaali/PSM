'use client';

import React, { useState, useMemo } from 'react';
import { TripWithFinance, UserRole } from '@/types';
import { exportTripsToExcel } from '@/lib/excel-export';
import { formatRupiah } from '@/lib/data-service';
import { X, FileSpreadsheet, Download, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface ExportExcelModalProps {
  trips: TripWithFinance[];
  userRole?: UserRole;
  onClose: () => void;
}

type PeriodOption = '3_days' | '7_days' | '30_days' | 'all' | 'custom';

export function ExportExcelModal({ trips, userRole = 'super_admin', onClose }: ExportExcelModalProps) {
  const isSuperAdmin = userRole === 'super_admin';
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('7_days');
  const [customStartDate, setCustomStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Calculate filtered trips based on chosen period
  const { filteredTrips, periodLabel } = useMemo(() => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    if (selectedPeriod === 'all') {
      return {
        filteredTrips: trips,
        periodLabel: 'Semua_Data',
      };
    }

    if (selectedPeriod === 'custom') {
      const start = new Date(customStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customEndDate);
      end.setHours(23, 59, 59, 999);

      const res = trips.filter((t) => {
        const tDate = new Date(t.trip_date);
        return tDate >= start && tDate <= end;
      });
      return {
        filteredTrips: res,
        periodLabel: `Custom_${customStartDate}_sd_${customEndDate}`,
      };
    }

    let days = 7;
    let label = '7_Hari';
    if (selectedPeriod === '3_days') {
      days = 3;
      label = '3_Hari';
    } else if (selectedPeriod === '30_days') {
      days = 30;
      label = '30_Hari';
    }

    const pastDate = new Date();
    pastDate.setDate(now.getDate() - (days - 1));
    pastDate.setHours(0, 0, 0, 0);

    const res = trips.filter((t) => {
      const tDate = new Date(t.trip_date);
      return tDate >= pastDate && tDate <= now;
    });

    return {
      filteredTrips: res,
      periodLabel: label,
    };
  }, [trips, selectedPeriod, customStartDate, customEndDate]);

  // Aggregate metrics
  const totalRevenue = filteredTrips.reduce((acc, t) => acc + (t.finance?.gross_revenue || 0), 0);
  const totalCost = filteredTrips.reduce((acc, t) => acc + (t.finance?.total_operational_cost || 0), 0);
  const totalNetMargin = filteredTrips.reduce((acc, t) => acc + (t.finance?.net_margin || 0), 0);

  const handleExport = () => {
    if (filteredTrips.length === 0) {
      alert('Tidak ada data surat jalan pada periode yang dipilih.');
      return;
    }
    exportTripsToExcel(filteredTrips, periodLabel, userRole);
    onClose();
  };

  // Helper count for options preview
  const getCountForDays = (days: number) => {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    const past = new Date();
    past.setDate(now.getDate() - (days - 1));
    past.setHours(0, 0, 0, 0);
    return trips.filter((t) => {
      const td = new Date(t.trip_date);
      return td >= past && td <= now;
    }).length;
  };

  const count3Days = useMemo(() => getCountForDays(3), [trips]);
  const count7Days = useMemo(() => getCountForDays(7), [trips]);
  const count30Days = useMemo(() => getCountForDays(30), [trips]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-emerald-800/60 text-slate-100 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-950 via-emerald-900 to-[#064e3b] px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Export Rekap Surat Jalan ke Excel
              </h3>
              <p className="text-xs text-emerald-200">
                PT. Putra Saijaan Mandiri • Pilih Rentang Periode Data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Pilih Periode Rekap:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 3 Hari */}
              <button
                type="button"
                onClick={() => setSelectedPeriod('3_days')}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedPeriod === '3_days'
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-white">3 Hari Terakhir</span>
                  {selectedPeriod === '3_days' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-emerald-400">{count3Days}</span> Dokumen SJ
                </div>
              </button>

              {/* Option 7 Hari */}
              <button
                type="button"
                onClick={() => setSelectedPeriod('7_days')}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedPeriod === '7_days'
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-white">7 Hari Terakhir</span>
                  {selectedPeriod === '7_days' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-emerald-400">{count7Days}</span> Dokumen SJ
                </div>
              </button>

              {/* Option 30 Hari */}
              <button
                type="button"
                onClick={() => setSelectedPeriod('30_days')}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedPeriod === '30_days'
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-white">30 Hari Terakhir</span>
                  {selectedPeriod === '30_days' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-emerald-400">{count30Days}</span> Dokumen SJ
                </div>
              </button>
            </div>

            {/* Additional options: Semua Data / Custom */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <button
                type="button"
                onClick={() => setSelectedPeriod('all')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedPeriod === 'all'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>Semua Data ({trips.length} SJ)</span>
                {selectedPeriod === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPeriod('custom')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedPeriod === 'custom'
                    ? 'bg-emerald-950/80 border-emerald-500 text-white'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Pilih Tanggal Bebas
                </span>
                {selectedPeriod === 'custom' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>

            {/* Custom Date Inputs if selected */}
            {selectedPeriod === 'custom' && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Mulai Tanggal</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ringkasan Data yang akan di-export */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 uppercase">
                Ringkasan Rekap Terpilih
              </span>
              <span className="text-xs font-black text-amber-400">
                {filteredTrips.length} Surat Jalan
              </span>
            </div>

            {filteredTrips.length === 0 ? (
              <div className="flex items-center gap-2 text-rose-400 text-xs py-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Tidak ada data surat jalan pada rentang waktu ini.</span>
              </div>
            ) : isSuperAdmin ? (
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Total Omset</span>
                  <span className="text-xs font-black text-emerald-400">
                    {formatRupiah(totalRevenue)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Biaya Operasional</span>
                  <span className="text-xs font-black text-rose-400">
                    {formatRupiah(totalCost)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Laba Bersih</span>
                  <span className="text-xs font-black text-amber-300">
                    {formatRupiah(totalNetMargin)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Total Dokumen</span>
                  <span className="text-xs font-black text-emerald-400">
                    {filteredTrips.length} SJ
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Dalam Perjalanan</span>
                  <span className="text-xs font-black text-amber-400">
                    {filteredTrips.filter((t) => t.status === 'in_transit').length} Rit
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block">Selesai / Terkirim</span>
                  <span className="text-xs font-black text-sky-400">
                    {filteredTrips.filter((t) => t.status === 'completed').length} Rit
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={filteredTrips.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-black rounded-xl transition shadow-lg shadow-emerald-950/50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Excel ({filteredTrips.length})</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
