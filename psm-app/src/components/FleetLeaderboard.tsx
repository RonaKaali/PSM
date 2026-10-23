'use client';

import React, { useState, useMemo } from 'react';
import { Vehicle, TripWithFinance } from '@/types';
import { formatRupiah, getVehicleCapacity } from '@/lib/data-service';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Truck,
  TrendingUp,
  DollarSign,
  Flame,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface FleetLeaderboardProps {
  vehicles: Vehicle[];
  trips: TripWithFinance[];
  onViewTrip?: (trip: TripWithFinance) => void;
}

type SortCriteria = 'profit' | 'trips' | 'revenue' | 'margin';
type ViewMode = 'cards' | 'table';

export function FleetLeaderboard({ vehicles, trips, onViewTrip }: FleetLeaderboardProps) {
  const [sortBy, setSortBy] = useState<SortCriteria>('profit');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchPlate, setSearchPlate] = useState('');
  const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);

  // 1. Hitung total seluruh laba bersih armada untuk persentase kontribusi
  const totalCompanyNetProfit = useMemo(() => {
    return trips.reduce((acc, t) => acc + (t.finance?.net_margin || 0), 0);
  }, [trips]);

  const totalCompanyRevenue = useMemo(() => {
    return trips.reduce((acc, t) => acc + (t.finance?.gross_revenue || 0), 0);
  }, [trips]);

  // 2. Olah data statistik performa untuk setiap armada
  const fleetStats = useMemo(() => {
    return vehicles.map((v) => {
      const vehTrips = trips.filter(
        (t) =>
          t.plate_number.toUpperCase().replace(/\s+/g, '') ===
          v.plate_number.toUpperCase().replace(/\s+/g, '')
      );

      const tripsCount = vehTrips.length;
      const completedTrips = vehTrips.filter((t) => t.status === 'completed').length;
      const inTransitTrips = vehTrips.filter((t) => t.status === 'in_transit').length;
      const totalRevenue = vehTrips.reduce((acc, t) => acc + (t.finance?.gross_revenue || 0), 0);
      const totalCost = vehTrips.reduce((acc, t) => acc + (t.finance?.total_operational_cost || 0), 0);
      const netMargin = vehTrips.reduce((acc, t) => acc + (t.finance?.net_margin || 0), 0);
      const avgMarginPct = totalRevenue > 0 ? (netMargin / totalRevenue) * 100 : 0;
      const profitContributionPct =
        totalCompanyNetProfit > 0 && netMargin > 0
          ? (netMargin / totalCompanyNetProfit) * 100
          : 0;

      // Unique destinations
      const uniqueDestinations = Array.from(
        new Set(vehTrips.map((t) => t.ship_to).filter(Boolean))
      );

      return {
        vehicle: v,
        tripsCount,
        completedTrips,
        inTransitTrips,
        totalRevenue,
        totalCost,
        netMargin,
        avgMarginPct,
        profitContributionPct,
        uniqueDestinations,
        vehTrips,
      };
    });
  }, [vehicles, trips, totalCompanyNetProfit]);

  // 3. Highlight 3 Kategori Juara Utama
  const topProfitVehicle = useMemo(() => {
    if (fleetStats.length === 0) return null;
    return [...fleetStats].sort((a, b) => b.netMargin - a.netMargin)[0];
  }, [fleetStats]);

  const topTripsVehicle = useMemo(() => {
    if (fleetStats.length === 0) return null;
    return [...fleetStats].sort((a, b) => b.tripsCount - a.tripsCount)[0];
  }, [fleetStats]);

  const topMarginVehicle = useMemo(() => {
    if (fleetStats.length === 0) return null;
    const withTrips = fleetStats.filter((f) => f.tripsCount > 0);
    if (withTrips.length === 0) return null;
    return [...withTrips].sort((a, b) => b.avgMarginPct - a.avgMarginPct)[0];
  }, [fleetStats]);

  // 4. Pengurutan Klasemen berdasarkan kriteria aktif
  const sortedFleet = useMemo(() => {
    const list = [...fleetStats];
    switch (sortBy) {
      case 'profit':
        list.sort((a, b) => b.netMargin - a.netMargin);
        break;
      case 'trips':
        list.sort((a, b) => b.tripsCount - a.tripsCount);
        break;
      case 'revenue':
        list.sort((a, b) => b.totalRevenue - a.totalRevenue);
        break;
      case 'margin':
        list.sort((a, b) => b.avgMarginPct - a.avgMarginPct);
        break;
    }
    if (!searchPlate.trim()) return list;
    const q = searchPlate.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.vehicle.plate_number.toLowerCase().includes(q) ||
        item.vehicle.default_driver_name.toLowerCase().includes(q)
    );
  }, [fleetStats, sortBy, searchPlate]);

  const toggleExpand = (id: string) => {
    setExpandedVehicleId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================= */}
      {/* 1. HEADER & HIGHLIGHT CHAMPIONS BANNER                    */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-[#300512] to-slate-950 border border-rose-900/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-rose-900/40">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-2 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>LEADERBOARD &amp; KLASEMEN ARMADA TRUK</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Peringkat Armada PT. Putra Saijaan Mandiri</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Evaluasi komprehensif siapa armada yang paling banyak beroperasi (ritase jalan), menghasilkan omset tertinggi, dan menyumbang laba bersih terbesar bagi perusahaan.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-rose-800/40 px-4 py-3 rounded-xl flex items-center gap-6 shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Total Armada Aktif</span>
              <span className="text-lg font-black text-amber-400 font-mono">{vehicles.length} Truk Tangki</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">Total Laba Armada</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{formatRupiah(totalCompanyNetProfit)}</span>
            </div>
          </div>
        </div>

        {/* 3 TOP CHAMPIONS PODIUM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          
          {/* Champion 1: PALING BANYAK UNTUNG */}
          <div className="bg-gradient-to-b from-amber-950/60 via-slate-900/90 to-slate-950 border-2 border-amber-500/60 rounded-xl p-4 shadow-lg shadow-amber-500/10 relative group hover:border-amber-400 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                <Crown className="w-3.5 h-3.5" />
                Paling Banyak Untung
              </span>
              <span className="text-xs font-black text-amber-400">#1 PROFIT</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-black text-amber-300 font-mono tracking-wide">
                {topProfitVehicle ? topProfitVehicle.vehicle.plate_number : '-'}
              </div>
              <div className="text-xs text-slate-300 font-semibold">
                Supir: <span className="text-white font-bold">{topProfitVehicle?.vehicle.default_driver_name}</span>
                <span className="text-slate-400 text-[11px] ml-1">({getVehicleCapacity(topProfitVehicle?.vehicle)})</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Laba Bersih</span>
                <span className="text-base font-black text-emerald-400">
                  {topProfitVehicle ? formatRupiah(topProfitVehicle.netMargin) : 'Rp 0'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Ritase</span>
                <span className="text-sm font-bold text-white">
                  {topProfitVehicle?.tripsCount || 0} Rit
                </span>
              </div>
            </div>
          </div>

          {/* Champion 2: PALING BANYAK JALAN / RITASE */}
          <div className="bg-gradient-to-b from-blue-950/50 via-slate-900/90 to-slate-950 border-2 border-blue-500/50 rounded-xl p-4 shadow-lg shadow-blue-500/10 relative group hover:border-blue-400 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                <Flame className="w-3.5 h-3.5" />
                Paling Banyak Jalan
              </span>
              <span className="text-xs font-black text-blue-400">#1 RITASE</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-black text-blue-300 font-mono tracking-wide">
                {topTripsVehicle ? topTripsVehicle.vehicle.plate_number : '-'}
              </div>
              <div className="text-xs text-slate-300 font-semibold">
                Supir: <span className="text-white font-bold">{topTripsVehicle?.vehicle.default_driver_name}</span>
                <span className="text-slate-400 text-[11px] ml-1">({getVehicleCapacity(topTripsVehicle?.vehicle)})</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Ritase Jalan</span>
                <span className="text-base font-black text-white">
                  {topTripsVehicle?.tripsCount || 0} Perjalanan
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Laba Dihasilkan</span>
                <span className="text-sm font-bold text-emerald-400">
                  {topTripsVehicle ? formatRupiah(topTripsVehicle.netMargin) : 'Rp 0'}
                </span>
              </div>
            </div>
          </div>

          {/* Champion 3: PALING EFISIEN / MARGIN TERTINGGI */}
          <div className="bg-gradient-to-b from-emerald-950/50 via-slate-900/90 to-slate-950 border-2 border-emerald-500/50 rounded-xl p-4 shadow-lg shadow-emerald-500/10 relative group hover:border-emerald-400 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                <Award className="w-3.5 h-3.5" />
                Margin Tertinggi
              </span>
              <span className="text-xs font-black text-emerald-400">#1 EFISIENSI</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-black text-emerald-300 font-mono tracking-wide">
                {topMarginVehicle ? topMarginVehicle.vehicle.plate_number : '-'}
              </div>
              <div className="text-xs text-slate-300 font-semibold">
                Supir: <span className="text-white font-bold">{topMarginVehicle?.vehicle.default_driver_name}</span>
                <span className="text-slate-400 text-[11px] ml-1">({getVehicleCapacity(topMarginVehicle?.vehicle)})</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Rata-rata Margin</span>
                <span className="text-base font-black text-amber-400">
                  {topMarginVehicle ? `${Math.round(topMarginVehicle.avgMarginPct * 10) / 10}%` : '0%'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Laba</span>
                <span className="text-sm font-bold text-emerald-400">
                  {topMarginVehicle ? formatRupiah(topMarginVehicle.netMargin) : 'Rp 0'}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE CONTROLS BAR (SORT & VIEW TOGGLE)          */}
      {/* ========================================================= */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Sort criteria tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-rose-400" />
            Urutkan:
          </span>

          <button
            onClick={() => setSortBy('profit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition shrink-0 cursor-pointer ${
              sortBy === 'profit'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Paling Banyak Untung</span>
          </button>

          <button
            onClick={() => setSortBy('trips')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition shrink-0 cursor-pointer ${
              sortBy === 'trips'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Paling Banyak Jalan</span>
          </button>

          <button
            onClick={() => setSortBy('revenue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition shrink-0 cursor-pointer ${
              sortBy === 'revenue'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Omset Terbesar</span>
          </button>

          <button
            onClick={() => setSortBy('margin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition shrink-0 cursor-pointer ${
              sortBy === 'margin'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Margin % Tertinggi</span>
          </button>
        </div>

        {/* Search & View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              placeholder="Cari nopol / supir..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#881337] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Kartu Peringkat
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#881337] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tabel Klasemen
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. LEADERBOARD DISPLAY                                    */}
      {/* ========================================================= */}
      {viewMode === 'cards' ? (
        /* GRID KARTU PERINGKAT KLASEMEN */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedFleet.map((item, index) => {
            const rank = index + 1;
            const isTop1 = rank === 1;
            const isTop2 = rank === 2;
            const isTop3 = rank === 3;
            const isExpanded = expandedVehicleId === item.vehicle.id;

            // Border & Glow styling per rank
            let cardBorder = 'border-slate-800 hover:border-slate-700';
            let rankBadgeBg = 'bg-slate-800 text-slate-300 border-slate-700';
            let rankTitle = `#${rank}`;
            let medalIcon = null;

            if (isTop1) {
              cardBorder = 'border-2 border-amber-400/90 shadow-xl shadow-amber-500/15 bg-gradient-to-b from-amber-950/30 to-slate-950';
              rankBadgeBg = 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black border-amber-300 shadow-md';
              rankTitle = 'JUARA 1';
              medalIcon = <Crown className="w-4 h-4 text-slate-950" />;
            } else if (isTop2) {
              cardBorder = 'border-2 border-slate-300/80 shadow-lg shadow-slate-300/10 bg-gradient-to-b from-slate-800/30 to-slate-950';
              rankBadgeBg = 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-950 font-black border-slate-100 shadow-md';
              rankTitle = 'JUARA 2';
              medalIcon = <Medal className="w-4 h-4 text-slate-950" />;
            } else if (isTop3) {
              cardBorder = 'border-2 border-amber-700/80 shadow-lg shadow-amber-700/10 bg-gradient-to-b from-amber-950/20 to-slate-950';
              rankBadgeBg = 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black border-amber-500 shadow-md';
              rankTitle = 'JUARA 3';
              medalIcon = <Award className="w-4 h-4 text-white" />;
            }

            return (
              <div
                key={item.vehicle.id}
                className={`bg-slate-950 rounded-2xl p-5 border transition relative flex flex-col justify-between ${cardBorder}`}
              >
                {/* Header Kartu: Medali Peringkat & Info Armada */}
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${rankBadgeBg}`}
                      >
                        {medalIcon}
                        <span>{rankTitle}</span>
                      </div>

                      {item.netMargin === topProfitVehicle?.netMargin && item.netMargin > 0 && (
                        <span className="bg-amber-950/90 border border-amber-500 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                          👑 Top Laba
                        </span>
                      )}
                      {item.tripsCount === topTripsVehicle?.tripsCount && item.tripsCount > 0 && (
                        <span className="bg-blue-950/90 border border-blue-500 text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                          🔥 Teraktif
                        </span>
                      )}
                    </div>

                    <span className="bg-[#4c0519] border border-rose-800 text-rose-200 text-[10px] font-bold px-2 py-0.5 rounded">
                      {getVehicleCapacity(item.vehicle)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-xl font-black text-amber-300 font-mono tracking-wide">
                      {item.vehicle.plate_number}
                    </div>
                    <div className="text-xs text-slate-300 font-semibold flex items-center justify-between mt-0.5">
                      <span>Supir: <strong className="text-white">{item.vehicle.default_driver_name}</strong></span>
                      <span className="text-[11px] text-slate-400">
                        {item.uniqueDestinations.length} Tujuan Berbeda
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Kontribusi Laba terhadap Total Profit Perusahaan */}
                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 mb-4">
                    <div className="flex justify-between items-center text-[11px] mb-1.5 font-medium">
                      <span className="text-slate-400">Kontribusi Profit Perusahaan:</span>
                      <span className="font-black text-emerald-400 font-mono">
                        {Math.round(item.profitContributionPct * 10) / 10}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, item.profitContributionPct))}%` }}
                      />
                    </div>
                  </div>

                  {/* Rincian Metrik Performa */}
                  <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-400" />
                        Total Ritase Jalan:
                      </span>
                      <span className="font-bold text-white font-mono">
                        {item.tripsCount} Perjalanan
                        {item.inTransitTrips > 0 && (
                          <span className="text-[10px] text-amber-400 ml-1">({item.inTransitTrips} OTW)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        Total Omset Tagihan:
                      </span>
                      <span className="font-bold text-emerald-300 font-mono">
                        {formatRupiah(item.totalRevenue)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        Total Biaya Operasional:
                      </span>
                      <span className="font-bold text-rose-300 font-mono">
                        {formatRupiah(item.totalCost)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-800/80 pt-2 text-sm bg-slate-900/40 -mx-2 px-2 py-1 rounded-md">
                      <span className="font-bold text-slate-200">Total Laba Bersih:</span>
                      <span className="font-black text-emerald-400 text-base font-mono">
                        {formatRupiah(item.netMargin)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[11px] text-slate-400">Rata-rata Margin Efisiensi:</span>
                      <span className="font-extrabold text-amber-400 text-xs">
                        {Math.round(item.avgMarginPct * 10) / 10}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Kartu: Riwayat Surat Jalan Accordion */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => toggleExpand(item.vehicle.id)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-400 hover:text-amber-300 py-1 transition cursor-pointer"
                  >
                    <span>Riwayat {item.vehTrips.length} Surat Jalan</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Dropdown Riwayat Surat Jalan */}
                  {isExpanded && (
                    <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {item.vehTrips.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic py-2 text-center">
                          Belum ada catatan surat jalan untuk armada ini.
                        </p>
                      ) : (
                        item.vehTrips.map((trip) => (
                          <div
                            key={trip.id}
                            className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2 text-[11px] hover:border-amber-500/40 transition"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-amber-300">
                                {trip.trip_number}
                              </span>
                              <span className="text-slate-400 text-[10px]">
                                {trip.trip_date}
                              </span>
                            </div>
                            <div className="text-white truncate font-medium mt-0.5">
                              {trip.ship_to}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800">
                              <span>Laba: <strong className="text-emerald-400">{formatRupiah(trip.finance?.net_margin || 0)}</strong></span>
                              <span
                                className={`px-1.5 py-0.5 rounded font-bold ${
                                  trip.status === 'completed'
                                    ? 'bg-emerald-950 text-emerald-400'
                                    : 'bg-amber-950 text-amber-400'
                                }`}
                              >
                                {trip.status === 'completed' ? 'Sampai' : 'Jalan'}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABEL KLASEMEN EKSEKUTIF LENGKAP */
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-[#3b0816] border-b border-rose-900/70 text-slate-300 uppercase tracking-wider font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4 text-center">Peringkat</th>
                  <th className="py-3 px-4">Armada &amp; Supir</th>
                  <th className="py-3 px-4">Kapasitas</th>
                  <th className="py-3 px-4 text-center">Total Ritase</th>
                  <th className="py-3 px-4 text-right">Total Omset</th>
                  <th className="py-3 px-4 text-right">Biaya Jalan</th>
                  <th className="py-3 px-4 text-right">Laba Bersih</th>
                  <th className="py-3 px-4 text-center">Margin %</th>
                  <th className="py-3 px-4 text-center">Kontribusi</th>
                  <th className="py-3 px-4 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 font-medium">
                {sortedFleet.map((item, index) => {
                  const rank = index + 1;
                  return (
                    <tr
                      key={item.vehicle.id}
                      className={`hover:bg-slate-800/40 transition ${
                        rank === 1 ? 'bg-amber-950/20' : rank === 2 ? 'bg-slate-800/20' : ''
                      }`}
                    >
                      {/* Peringkat */}
                      <td className="py-3.5 px-4 text-center">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center gap-1 bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full text-xs shadow">
                            <Crown className="w-3.5 h-3.5" />
                            #1
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center gap-1 bg-slate-300 text-slate-950 font-black px-2 py-0.5 rounded-full text-xs shadow">
                            <Medal className="w-3.5 h-3.5" />
                            #2
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center gap-1 bg-amber-700 text-white font-black px-2 py-0.5 rounded-full text-xs shadow">
                            <Award className="w-3.5 h-3.5" />
                            #3
                          </span>
                        ) : (
                          <span className="font-bold text-slate-400 font-mono">#{rank}</span>
                        )}
                      </td>

                      {/* Armada & Supir */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-amber-300 font-mono text-sm">
                          {item.vehicle.plate_number}
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Supir: <span className="font-semibold text-white">{item.vehicle.default_driver_name}</span>
                        </div>
                      </td>

                      {/* Kapasitas */}
                      <td className="py-3.5 px-4">
                        <span className="bg-[#4c0519] border border-rose-800 text-rose-200 text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap">
                          {getVehicleCapacity(item.vehicle)}
                        </span>
                      </td>

                      {/* Total Ritase */}
                      <td className="py-3.5 px-4 text-center font-bold text-white">
                        <div className="font-mono text-sm">{item.tripsCount} Rit</div>
                        <div className="text-[10px] text-slate-400">
                          {item.completedTrips} Sampai • {item.inTransitTrips} Jalan
                        </div>
                      </td>

                      {/* Total Omset */}
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-300 font-mono">
                        {formatRupiah(item.totalRevenue)}
                      </td>

                      {/* Biaya Jalan */}
                      <td className="py-3.5 px-4 text-right font-bold text-rose-300 font-mono">
                        {formatRupiah(item.totalCost)}
                      </td>

                      {/* Laba Bersih */}
                      <td className="py-3.5 px-4 text-right font-black text-emerald-400 font-mono text-sm">
                        {formatRupiah(item.netMargin)}
                      </td>

                      {/* Margin % */}
                      <td className="py-3.5 px-4 text-center font-extrabold text-amber-400 font-mono">
                        {Math.round(item.avgMarginPct * 10) / 10}%
                      </td>

                      {/* Kontribusi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-mono font-bold text-emerald-400 text-xs">
                          {Math.round(item.profitContributionPct * 10) / 10}%
                        </div>
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full mx-auto mt-1 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(0, item.profitContributionPct))}%` }}
                          />
                        </div>
                      </td>

                      {/* Predikat */}
                      <td className="py-3.5 px-4 text-center">
                        {rank === 1 ? (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-500 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🏆 Pemimpin Klasemen
                          </span>
                        ) : item.tripsCount === topTripsVehicle?.tripsCount && item.tripsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 bg-blue-500/20 border border-blue-500 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🔥 Ritase Terbanyak
                          </span>
                        ) : item.avgMarginPct >= 60 ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ⚡ Sangat Efisien
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Armada Aktif
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
