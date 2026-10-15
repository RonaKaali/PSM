'use client';

import React from 'react';
import { TripWithFinance } from '@/types';
import { formatRupiah } from '@/lib/data-service';
import { Truck, DollarSign, Fuel, TrendingUp, Percent } from 'lucide-react';

interface DashboardStatsProps {
  trips: TripWithFinance[];
  userRole: 'admin' | 'finance' | 'viewer';
}

export function DashboardStats({ trips, userRole }: DashboardStatsProps) {
  // Aggregate calculations
  const totalTrips = trips.length;
  const completedTrips = trips.filter((t) => t.status === 'completed').length;
  const inTransitTrips = trips.filter((t) => t.status === 'in_transit').length;

  const totalGrossRevenue = trips.reduce((acc, t) => acc + (t.finance?.gross_revenue || 0), 0);
  const totalFuelCost = trips.reduce((acc, t) => acc + (t.finance?.fuel_cost || 0), 0);
  const totalOperatingCost = trips.reduce((acc, t) => acc + (t.finance?.total_operational_cost || 0), 0);
  const totalNetMargin = trips.reduce((acc, t) => acc + (t.finance?.net_margin || 0), 0);
  
  const avgMarginPercentage =
    totalGrossRevenue > 0 ? (totalNetMargin / totalGrossRevenue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      
      {/* 1. Total Ritase */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 shadow-md flex items-center gap-4">
        <div className="p-3 bg-[#4c0519] border border-rose-800/60 rounded-xl text-amber-400">
          <Truck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Ritase
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalTrips}</span>
            <span className="text-[11px] text-amber-400 font-bold">
              ({inTransitTrips} Jalan, {completedTrips} Sampai)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Omset (Gross Revenue) */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 shadow-md flex items-center gap-4">
        <div className="p-3 bg-blue-950/80 border border-blue-800/60 rounded-xl text-blue-400">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Omset Tagihan
          </span>
          <span className="text-lg sm:text-xl font-black text-white">
            {formatRupiah(totalGrossRevenue)}
          </span>
        </div>
      </div>

      {/* 3. Total Biaya Solar & Operasional */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 shadow-md flex items-center gap-4">
        <div className="p-3 bg-amber-950/80 border border-amber-800/60 rounded-xl text-amber-400">
          <Fuel className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Biaya Operasional
          </span>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-black text-rose-300">
              {formatRupiah(totalOperatingCost)}
            </span>
            <span className="text-[10px] text-slate-400">
              Solar: {formatRupiah(totalFuelCost)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Total Laba Bersih (Net Margin) */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 shadow-md flex items-center gap-4">
        <div className="p-3 bg-emerald-950/80 border border-emerald-800/60 rounded-xl text-emerald-400">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Total Laba Bersih
          </span>
          <span className={`text-lg sm:text-xl font-black ${totalNetMargin >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
            {formatRupiah(totalNetMargin)}
          </span>
        </div>
      </div>

      {/* 5. Rata-rata Margin % */}
      <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 shadow-md flex items-center gap-4">
        <div className="p-3 bg-purple-950/80 border border-purple-800/60 rounded-xl text-purple-400">
          <Percent className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Rata-rata Margin
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${avgMarginPercentage >= 25 ? 'text-emerald-400' : avgMarginPercentage >= 10 ? 'text-amber-400' : 'text-rose-500'}`}>
              {Math.round(avgMarginPercentage * 10) / 10}%
            </span>
            <span className="text-[10px] text-slate-400">Perjalanan</span>
          </div>
        </div>
      </div>

    </div>
  );
}
