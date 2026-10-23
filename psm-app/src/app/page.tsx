'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle, TripWithFinance, DestinationCustomer } from '@/types';
import { DataService, formatRupiah } from '@/lib/data-service';
import { exportTripsToExcel } from '@/lib/excel-export';
import { Navbar } from '@/components/Navbar';
import { DashboardStats } from '@/components/DashboardStats';
import { CreateTripModal } from '@/components/CreateTripModal';
import { SuratJalanPrint } from '@/components/SuratJalanPrint';
import { VehicleManagerModal } from '@/components/VehicleManagerModal';
import { DestinationManagerModal } from '@/components/DestinationManagerModal';
import { ExportExcelModal } from '@/components/ExportExcelModal';
import { LoginPage, AuthUser, UserRole } from '@/components/LoginPage';
import { FleetLeaderboard } from '@/components/FleetLeaderboard';
import {
  Search,
  Printer,
  Edit3,
  Trash2,
  FileSpreadsheet,
  PlusCircle,
  Truck,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  LogOut,
  Shield,
  User,
  Building2,
  Trophy,
} from 'lucide-react';

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [destinations, setDestinations] = useState<DestinationCustomer[]>([]);
  const [trips, setTrips] = useState<TripWithFinance[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Active Tab (super_admin sees all 3, admin only trips)
  const [activeTab, setActiveTab] = useState<'trips' | 'margins' | 'fleet'>('trips');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripWithFinance | null>(null);
  const [printingTrip, setPrintingTrip] = useState<TripWithFinance | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Load Initial Data after login
  useEffect(() => {
    if (!currentUser) return;
    async function initData() {
      setLoading(true);
      try {
        const [vehs, trps, dests] = await Promise.all([
          DataService.getVehicles(),
          DataService.getTrips(),
          DataService.getDestinations(),
        ]);
        setVehicles(vehs);
        setTrips(trps);
        setDestinations(dests);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, [currentUser]);

  // Filtered Trips
  const filteredTrips = trips.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.trip_number.toLowerCase().includes(q) ||
      t.plate_number.toLowerCase().includes(q) ||
      t.driver_name.toLowerCase().includes(q) ||
      t.ship_to.toLowerCase().includes(q) ||
      t.port_point_area.toLowerCase().includes(q) ||
      t.seal_number.toLowerCase().includes(q) ||
      t.quantity_display.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesVehicle = vehicleFilter === 'all' || t.plate_number === vehicleFilter;

    return matchesSearch && matchesStatus && matchesVehicle;
  });

  // Handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTrips([]);
    setVehicles([]);
    setActiveTab('trips');
  };

  const handleOpenCreate = () => {
    setEditingTrip(null);
    setIsCreateModalOpen(true);
  };

  const handleEditTrip = (trip: TripWithFinance) => {
    setEditingTrip(trip);
    setIsCreateModalOpen(true);
  };

  const handleDeleteTrip = async (id: string, tripNumber: string) => {
    if (confirm(`Yakin ingin menghapus Surat Jalan ${tripNumber}?`)) {
      await DataService.deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleTripSaved = (savedTrip: TripWithFinance) => {
    setTrips((prev) => {
      const idx = prev.findIndex((t) => t.id === savedTrip.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = savedTrip;
        return next;
      }
      return [savedTrip, ...prev];
    });
    setEditingTrip(null);
    setIsCreateModalOpen(false);
  };

  const handleExportExcel = () => {
    setIsExportModalOpen(true);
  };

  // Show login page if not authenticated
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${printingTrip ? 'print:bg-white print:text-black print:min-h-0' : ''}`}>
      
      {/* 1. Navbar */}
      <div className="no-print print:hidden">
        <Navbar
          onOpenCreateModal={handleOpenCreate}
          onOpenVehicleModal={() => setIsVehicleModalOpen(true)}
          onOpenDestinationModal={() => setIsDestinationModalOpen(true)}
          vehiclesCount={vehicles.length}
          destinationsCount={destinations.length}
          onExportExcel={handleExportExcel}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      </div>

      {/* 2. Main Content Container */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 ${printingTrip ? 'no-print print:hidden' : ''}`}>
        
        {/* KPI Dashboard Cards - Admin only sees ritase, Super Admin sees all */}
        <DashboardStats trips={trips} userRole={currentUser.role} />

        {/* 3. Control Header: Tabs & Filters */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 shadow-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            
            {/* View Tabs - Admin only sees Daftar Surat Jalan */}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('trips')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                  activeTab === 'trips'
                    ? 'bg-[#881337] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Daftar Surat Jalan ({trips.length})</span>
              </button>

              {/* Only Super Admin can access Margin & Fleet tabs */}
              {isSuperAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab('margins')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      activeTab === 'margins'
                        ? 'bg-[#881337] text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Kalkulator &amp; Laba Margin</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('fleet')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                      activeTab === 'fleet'
                        ? 'bg-[#881337] text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Leaderboard &amp; Performa Armada</span>
                  </button>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDestinationModalOpen(true)}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-sm"
                title="Kelola Master PT / UD Tujuan Pengiriman & Alamat Bongkar"
              >
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>PT Tujuan ({destinations.length})</span>
              </button>

              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/60 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                title="Download Rekap Surat Jalan ke Excel (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Download Rekap Excel</span>
              </button>
            </div>

          </div>

          {/* Search & Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No. SJ, Nopol, Supir, Tujuan (Ship To), Port Point..."
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-rose-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Semua Armada Truk</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plate_number}>
                    {v.plate_number} ({v.default_driver_name})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="in_transit">Sedang Jalan (In Transit)</option>
                <option value="completed">Selesai (Completed)</option>
                <option value="draft">Draft (Rencana)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: DAFTAR SURAT JALAN OPERASIONAL                    */}
        {/* ========================================================= */}
        {activeTab === 'trips' && (
          <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Daftar Surat Jalan BBM &amp; Muatan
                </h3>
                <p className="text-xs text-slate-400">
                  Total {filteredTrips.length} surat jalan ditemukan
                </p>
              </div>

              <button
                onClick={handleOpenCreate}
                className="bg-[#881337] hover:bg-[#9f1239] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Buat Surat Jalan</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">No. Surat Jalan</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Armada &amp; Supir</th>
                    <th className="py-3 px-4">Tujuan (Ship To) &amp; Lokasi</th>
                    <th className="py-3 px-4">No. Segel</th>
                    <th className="py-3 px-4">Muatan (Manual)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Dokumen</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        Tidak ada data surat jalan yang cocok dengan filter pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-slate-800/40 transition">
                        
                        {/* No. SJ */}
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                          {trip.trip_number}
                        </td>

                        {/* Tanggal */}
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          {trip.trip_date}
                        </td>

                        {/* Nopol & Supir */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white font-mono">
                            {trip.plate_number}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Supir: <span className="text-amber-200 font-semibold">{trip.driver_name}</span>
                          </div>
                        </td>

                        {/* Ship To & Port Point */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-white truncate uppercase">
                            {trip.ship_to}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {trip.port_point_area}
                          </div>
                        </td>

                        {/* Seal Number */}
                        <td className="py-3.5 px-4 font-mono text-slate-300 font-semibold">
                          {trip.seal_number}
                        </td>

                        {/* Muatan Quantity & Goods Type */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-amber-300">
                            {trip.quantity_display}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {trip.goods_type}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {trip.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              <CheckCircle className="w-3 h-3" />
                              Selesai
                            </span>
                          ) : trip.status === 'in_transit' ? (
                            <span className="inline-flex items-center gap-1 bg-blue-950 text-blue-300 border border-blue-800 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              <Truck className="w-3 h-3" />
                              Sedang Jalan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              <Clock className="w-3 h-3" />
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Aksi */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Tombol Cetak */}
                            <button
                              onClick={() => setPrintingTrip(trip)}
                              className="bg-amber-500/90 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1.5 rounded flex items-center gap-1 transition shadow cursor-pointer text-xs"
                              title="Cetak Surat Jalan Fisik 1:1"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak 1:1</span>
                            </button>

                            {/* Edit & Delete - both roles can edit, only super_admin can delete */}
                            <button
                              onClick={() => handleEditTrip(trip)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition cursor-pointer"
                              title="Edit Surat Jalan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {isSuperAdmin && (
                              <button
                                onClick={() => handleDeleteTrip(trip.id, trip.trip_number)}
                                className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded transition cursor-pointer"
                                title="Hapus Surat Jalan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ANALISIS MARGIN & BIAYA (SUPER ADMIN ONLY)        */}
        {/* ========================================================= */}
        {activeTab === 'margins' && isSuperAdmin && (
          <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">
                  Rekapitulasi Keuangan &amp; Margin Laba Per Perjalanan
                </h3>
                <p className="text-xs text-slate-400">
                  Pendapatan - (Uang Jalan + Biaya Lain-lain)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Surat Jalan</th>
                    <th className="py-3 px-4">Nopol / Supir</th>
                    <th className="py-3 px-4 text-right">Pendapatan Kotor</th>
                    <th className="py-3 px-4 text-right">Uang Supir</th>
                    <th className="py-3 px-4 text-right">Biaya Lain-lain</th>
                    <th className="py-3 px-4 text-right">Total Biaya</th>
                    <th className="py-3 px-4 text-right">Laba Bersih</th>
                    <th className="py-3 px-4 text-center">Margin %</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredTrips.map((trip) => {
                    const fin = trip.finance;
                    const isHealthy = (fin?.margin_percentage || 0) >= 25;
                    const isWarning = (fin?.margin_percentage || 0) >= 10 && !isHealthy;

                    return (
                      <tr key={trip.id} className="hover:bg-slate-800/40 transition">
                        
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                          <div>{trip.trip_number}</div>
                          <div className="text-[10px] text-slate-500 font-sans">{trip.trip_date}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white font-mono">{trip.plate_number}</span>
                          <span className="text-[11px] text-slate-400 block">{trip.driver_name}</span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-emerald-300">
                          {formatRupiah(fin?.gross_revenue || 0)}
                        </td>

                        <td className="py-3.5 px-4 text-right text-slate-300">
                          {formatRupiah(fin?.driver_allowance || 0)}
                        </td>

                        <td className="py-3.5 px-4 text-right text-slate-300">
                          {formatRupiah(fin?.other_costs || 0)}
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold text-rose-400">
                          {formatRupiah(fin?.total_operational_cost || 0)}
                        </td>

                        <td className={`py-3.5 px-4 text-right font-black text-sm ${(fin?.net_margin || 0) >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                          {formatRupiah(fin?.net_margin || 0)}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black ${
                            isHealthy
                              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                              : isWarning
                              ? 'bg-amber-950 border border-amber-500/50 text-amber-300'
                              : 'bg-rose-950 border border-rose-500/50 text-rose-300'
                          }`}>
                            {fin?.margin_percentage || 0}%
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: LEADERBOARD & PERFORMA ARMADA (SUPER ADMIN ONLY)  */}
        {/* ========================================================= */}
        {activeTab === 'fleet' && isSuperAdmin && (
          <FleetLeaderboard
            vehicles={vehicles}
            trips={trips}
            onViewTrip={(trip) => setPrintingTrip(trip)}
          />
        )}

      </main>

      {/* 4. Footer */}
      <footer className="no-print print:hidden bg-[#380412] border-t border-rose-900/60 text-slate-300 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded shadow-sm shrink-0">
              <img
                src="/logopsm.png"
                alt="Logo PT. PSM"
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-white block">PT. PUTRA SAIJAAN MANDIRI</span>
              <span className="text-[11px] text-rose-300">
                Jl. Nelayan RT 02 No 11 Kotabaru Pulau Laut Sigam Kal-Sel • 0518 23136
              </span>
            </div>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            <span>Sistem Surat Jalan Armada &amp; Perhitungan Margin Operasional</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      
      {/* Create / Edit Trip Modal */}
      {isCreateModalOpen && (
        <CreateTripModal
          vehicles={vehicles}
          destinations={destinations}
          existingTrips={trips}
          editingTrip={editingTrip}
          userRole={currentUser.role}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingTrip(null);
          }}
          onSaved={handleTripSaved}
        />
      )}

      {/* 1:1 Physical Print Preview Modal */}
      {printingTrip && (
        <SuratJalanPrint
          trip={printingTrip}
          onClose={() => setPrintingTrip(null)}
        />
      )}

      {/* Vehicle Manager Modal - Available for Both Roles */}
      {isVehicleModalOpen && (
        <VehicleManagerModal
          vehicles={vehicles}
          onClose={() => setIsVehicleModalOpen(false)}
          onVehiclesUpdated={(updated) => setVehicles(updated)}
        />
      )}

      {/* Destination Manager Modal - Both Roles */}
      {isDestinationModalOpen && (
        <DestinationManagerModal
          destinations={destinations}
          onClose={() => setIsDestinationModalOpen(false)}
          onDestinationsUpdated={(updated) => setDestinations(updated)}
        />
      )}

      {/* Export Excel Modal with 3, 7, 30 days & custom filter */}
      {isExportModalOpen && (
        <ExportExcelModal
          trips={trips}
          userRole={currentUser.role}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

    </div>
  );
}
