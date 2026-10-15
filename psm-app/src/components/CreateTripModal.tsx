'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle, TripWithFinance } from '@/types';
import { calculateFinance, formatRupiah, DataService } from '@/lib/data-service';
import { X, Calculator, Truck, FileText, CheckCircle2, AlertTriangle, Flame, ShieldAlert, ArrowRight } from 'lucide-react';

interface CreateTripModalProps {
  vehicles: Vehicle[];
  existingTrips: TripWithFinance[];
  editingTrip?: TripWithFinance | null;
  onClose: () => void;
  onSaved: (trip: TripWithFinance) => void;
}

export function CreateTripModal({
  vehicles,
  existingTrips,
  editingTrip,
  onClose,
  onSaved,
}: CreateTripModalProps) {
  // Trip Details State
  const [tripNumber, setTripNumber] = useState('');
  const [tripDate, setTripDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  
  // Physical document metadata
  const [soldTo, setSoldTo] = useState('');
  const [shipTo, setShipTo] = useState('');
  const [portPointArea, setPortPointArea] = useState('');
  const [sealNumber, setSealNumber] = useState('');
  const [loadingLocation, setLoadingLocation] = useState('SADP');
  const [deliveryBy, setDeliveryBy] = useState('PT. PUTRA SAIJAAN MANDIRI');
  
  // Manual Cargo Fields (As requested by user: manual input)
  const [quantityDisplay, setQuantityDisplay] = useState('5000 L');
  const [goodsType, setGoodsType] = useState('BIOSOLAR(B50)');
  const [chargingTime, setChargingTime] = useState('S/D');
  const [cargoCondition, setCargoCondition] = useState('BAIK DAN CUKUP');
  const [notes, setNotes] = useState('Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran');
  const [status, setStatus] = useState<'draft' | 'in_transit' | 'completed'>('in_transit');

  // Margin Calculator State
  const [revenueType, setRevenueType] = useState<'flat_rate' | 'per_unit'>('flat_rate');
  const [grossRevenue, setGrossRevenue] = useState<number>(7500000);
  const [unitRate, setUnitRate] = useState<number>(1500);

  // Cost items
  const [fuelCost, setFuelCost] = useState<number>(2200000);
  const [driverAllowance, setDriverAllowance] = useState<number>(1500000);
  const [ferryTollCost, setFerryTollCost] = useState<number>(450000);
  const [retributionSealCost, setRetributionSealCost] = useState<number>(100000);
  const [otherCosts, setOtherCosts] = useState<number>(50000);
  const [otherCostsNotes, setOtherCostsNotes] = useState<string>('Retribusi jembatan timbang');

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize fields on open
  useEffect(() => {
    if (editingTrip) {
      setTripNumber(editingTrip.trip_number);
      setTripDate(editingTrip.trip_date);
      setSelectedVehicleId(editingTrip.vehicle_id || '');
      setPlateNumber(editingTrip.plate_number);
      setDriverName(editingTrip.driver_name);
      setDriverPhone(editingTrip.driver_phone || '');
      setSoldTo(editingTrip.sold_to || '');
      setShipTo(editingTrip.ship_to);
      setPortPointArea(editingTrip.port_point_area);
      setSealNumber(editingTrip.seal_number);
      setLoadingLocation(editingTrip.loading_location);
      setDeliveryBy(editingTrip.delivery_by);
      setQuantityDisplay(editingTrip.quantity_display);
      setGoodsType(editingTrip.goods_type);
      setChargingTime(editingTrip.charging_time || 'S/D');
      setCargoCondition(editingTrip.cargo_condition || 'BAIK DAN CUKUP');
      setNotes(editingTrip.notes || '');
      setStatus(editingTrip.status as any);

      // Finances
      const fin = editingTrip.finance;
      setRevenueType(fin.revenue_type);
      setGrossRevenue(fin.gross_revenue);
      setUnitRate(fin.unit_rate || 0);
      setFuelCost(fin.fuel_cost);
      setDriverAllowance(fin.driver_allowance);
      setFerryTollCost(fin.ferry_toll_cost);
      setRetributionSealCost(fin.retribution_seal_cost);
      setOtherCosts(fin.other_costs);
      setOtherCostsNotes(fin.other_costs_notes || '');
    } else {
      // Auto-generate next trip number
      const nextNum = DataService.generateNextTripNumber(existingTrips);
      setTripNumber(nextNum);

      // Default select DA 8101 ZR / RONI if available, or first vehicle
      const defaultVeh = vehicles.find((v) => v.plate_number === 'DA 8101 ZR') || vehicles[0];
      if (defaultVeh) {
        setSelectedVehicleId(defaultVeh.id);
        setPlateNumber(defaultVeh.plate_number);
        setDriverName(defaultVeh.default_driver_name);
      }
    }
  }, [editingTrip, existingTrips, vehicles]);

  // Handle vehicle selection change: ONLY updates Plate Number and Driver Name!
  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const found = vehicles.find((v) => v.id === vehicleId);
    if (found) {
      setPlateNumber(found.plate_number);
      setDriverName(found.default_driver_name);
      if (found.default_driver_phone) {
        setDriverPhone(found.default_driver_phone);
      }
      // Note: Quantity & Cargo type remain fully manual as instructed
    }
  };

  // Real-time Margin calculation
  const finCalc = calculateFinance(
    revenueType,
    grossRevenue,
    unitRate,
    quantityDisplay,
    fuelCost,
    driverAllowance,
    ferryTollCost,
    retributionSealCost,
    otherCosts
  );

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber || !driverName || !shipTo || !portPointArea || !sealNumber || !quantityDisplay) {
      alert('Mohon lengkapi Nopol, Supir, Ship To, Port Point Area, Seal Number, dan Quantity Muatan!');
      return;
    }

    setIsSubmitting(true);
    try {
      const tripData = {
        trip_number: tripNumber,
        trip_date: tripDate,
        vehicle_id: selectedVehicleId || undefined,
        plate_number: plateNumber,
        driver_name: driverName,
        driver_phone: driverPhone,
        sold_to: soldTo,
        ship_to: shipTo,
        port_point_area: portPointArea,
        seal_number: sealNumber,
        loading_location: loadingLocation,
        delivery_by: deliveryBy,
        quantity_display: quantityDisplay,
        goods_type: goodsType,
        charging_time: chargingTime,
        cargo_condition: cargoCondition,
        notes: notes,
        status: status,
      };

      const financeData = {
        revenue_type: revenueType,
        unit_rate: revenueType === 'per_unit' ? unitRate : 0,
        gross_revenue: finCalc.calculatedRevenue,
        fuel_cost: fuelCost,
        driver_allowance: driverAllowance,
        ferry_toll_cost: ferryTollCost,
        retribution_seal_cost: retributionSealCost,
        other_costs: otherCosts,
        other_costs_notes: otherCostsNotes,
        total_operational_cost: finCalc.totalCost,
        net_margin: finCalc.netMargin,
        margin_percentage: finCalc.marginPercentage,
      };

      let result: TripWithFinance | null = null;
      if (editingTrip) {
        result = await DataService.updateTrip(editingTrip.id, tripData, financeData);
      } else {
        result = await DataService.createTrip(tripData, financeData);
      }

      if (result) {
        onSaved(result);
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan surat jalan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-900/40 text-slate-100 rounded-xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Modal - Merah Hati theme */}
        <div className="bg-gradient-to-r from-[#4c0519] via-[#881337] to-[#700c1e] px-6 py-4 flex items-center justify-between border-b border-rose-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {editingTrip ? 'Edit Surat Jalan & Perhitungan Margin' : 'Buat Surat Jalan & Hitung Margin Real-Time'}
              </h2>
              <p className="text-xs text-rose-200">
                PT. Putra Saijaan Mandiri • Armada Tangki BBM & Cargo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-black/30 border border-amber-400/30 text-amber-300 text-xs font-mono px-3 py-1 rounded-full font-bold">
              {tripNumber}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns (Left: Trip Details, Right: Live Margin Calculator) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: INFORMASI SURAT JALAN & RUTE (7 Cols)      */}
          {/* ======================================================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Box 1: Armada & Supir */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-sm">
                <Truck className="w-4 h-4" />
                <span>PILIH ARMADA & SUPIR (OTOMATIS BERPASANGAN)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pilih Kendaraan
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => handleVehicleChange(e.target.value)}
                    className="w-full bg-slate-900 border border-rose-900/50 focus:border-rose-500 rounded-md px-3 py-2 text-sm text-white focus:outline-none"
                  >
                    <option value="">-- Pilih Armada --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.plate_number} — Supir: {v.default_driver_name} ({v.notes || v.vehicle_type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor Surat Jalan
                  </label>
                  <input
                    type="text"
                    value={tripNumber}
                    onChange={(e) => setTripNumber(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nopol Terpilih
                  </label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    required
                    placeholder="Contoh: DA 8101 ZR"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Supir (Bisa disesuaikan jika bertukar)
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                    placeholder="Contoh: RONI"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Rincian Muatan (MANUAL PENGISIAN SESUAI PERMINTAAN USER) */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-amber-400 font-bold text-sm">
                  RINCIAN MUATAN (MANUAL INPUT)
                </span>
                <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                  Diisi bebas per-jalan
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    QUANTITY / JUMLAH MUATAN *
                  </label>
                  <input
                    type="text"
                    value={quantityDisplay}
                    onChange={(e) => setQuantityDisplay(e.target.value)}
                    placeholder="Contoh: 5000 L atau 10000 L"
                    required
                    className="w-full bg-slate-900 border border-amber-500/50 focus:border-amber-400 rounded-md px-3 py-2 text-sm text-amber-300 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Ketik manual sesuai kapasitas aktual (cth: 5000 L, 10000 L, 25 Ton)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    TYPES OF GOODS / JENIS BARANG *
                  </label>
                  <input
                    type="text"
                    value={goodsType}
                    onChange={(e) => setGoodsType(e.target.value)}
                    placeholder="Contoh: BIOSOLAR(B50)"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-semibold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Contoh: BIOSOLAR(B50), SOLAR INDUSTRI, CPO
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CHARGING TIME
                  </label>
                  <input
                    type="text"
                    value={chargingTime}
                    onChange={(e) => setChargingTime(e.target.value)}
                    placeholder="S/D atau 08:30 WITA"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    INFORMATION / KONDISI
                  </label>
                  <input
                    type="text"
                    value={cargoCondition}
                    onChange={(e) => setCargoCondition(e.target.value)}
                    placeholder="BAIK DAN CUKUP"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {/* Box 3: Detail Tujuan & Pengiriman (Sesuai Kertas Fisik) */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4 space-y-3">
              <span className="text-amber-400 font-bold text-sm block">
                METADATA SURAT JALAN (SESUAI DOKUMEN FISIK)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tanggal Surat Jalan
                  </label>
                  <input
                    type="date"
                    value={tripDate}
                    onChange={(e) => setTripDate(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SEAL NUMBER (Nomor Segel Tangki) *
                  </label>
                  <input
                    type="text"
                    value={sealNumber}
                    onChange={(e) => setSealNumber(e.target.value)}
                    placeholder="Contoh: 050491/050492"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    LOADING (Depot / Lokasi Muat) *
                  </label>
                  <input
                    type="text"
                    value={loadingLocation}
                    onChange={(e) => setLoadingLocation(e.target.value)}
                    placeholder="Contoh: SADP atau Depot Kotabaru"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SOLD TO (Klien / Pembeli)
                  </label>
                  <input
                    type="text"
                    value={soldTo}
                    onChange={(e) => setSoldTo(e.target.value)}
                    placeholder="Boleh dikosongkan bila borongan langsung"
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  SHIP TO (Tujuan Konsumen / Proyek) *
                </label>
                <input
                  type="text"
                  value={shipTo}
                  onChange={(e) => setShipTo(e.target.value)}
                  placeholder="Contoh: PT. SURYA JAYA MATARAM"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  PORT POIN AREA (Alamat Titik Bongkar Spesifik) *
                </label>
                <input
                  type="text"
                  value={portPointArea}
                  onChange={(e) => setPortPointArea(e.target.value)}
                  placeholder="Contoh: DEKAT BAWAHAN SELAN.KEC.MATRAMAN.KAB.BANJAR/KALSEL"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Status Perjalanan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  >
                    <option value="draft">Draft (Rencana)</option>
                    <option value="in_transit">Sedang Jalan (In Transit)</option>
                    <option value="completed">Selesai (Completed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Transportir
                  </label>
                  <input
                    type="text"
                    value={deliveryBy}
                    onChange={(e) => setDeliveryBy(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: LIVE MARGIN CALCULATOR (5 Cols)           */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-rose-900/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-rose-300 font-bold border-b border-rose-900/40 pb-3">
                <Calculator className="w-5 h-5 text-amber-400" />
                <span className="text-sm tracking-wide text-white">LIVE MARGIN & PROFIT CALCULATOR</span>
              </div>

              {/* 1. Pendapatan (Revenue) */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase">
                    Pendapatan (Ongkos Angkut)
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRevenueType('flat_rate')}
                      className={`px-2 py-0.5 rounded transition ${revenueType === 'flat_rate' ? 'bg-[#881337] text-white font-bold' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Borongan/Flat
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevenueType('per_unit')}
                      className={`px-2 py-0.5 rounded transition ${revenueType === 'per_unit' ? 'bg-[#881337] text-white font-bold' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Tarif / Liter
                    </button>
                  </div>
                </div>

                {revenueType === 'flat_rate' ? (
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      Total Borongan (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 text-sm font-semibold">Rp</span>
                      <input
                        type="number"
                        value={grossRevenue || ''}
                        onChange={(e) => setGrossRevenue(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-rose-900/60 focus:border-rose-500 rounded-md pl-10 pr-3 py-2 text-base text-amber-300 font-bold"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Tarif per Liter/Ton (Rp)
                      </label>
                      <input
                        type="number"
                        value={unitRate || ''}
                        onChange={(e) => setUnitRate(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Total Otomatis (Rp)
                      </label>
                      <div className="bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-sm text-amber-300 font-bold truncate">
                        {formatRupiah(finCalc.calculatedRevenue)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Biaya Operasional (Operational Costs) */}
              <div className="space-y-3 mb-5 border-t border-slate-700/60 pt-4">
                <span className="text-xs font-bold text-slate-300 block uppercase">
                  Rincian Biaya Operasional Jalan
                </span>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>1. Biaya BBM / Solar</span>
                    <span className="text-slate-400">Solar Truk Tangki</span>
                  </div>
                  <input
                    type="number"
                    value={fuelCost || ''}
                    onChange={(e) => setFuelCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white font-semibold"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>2. Uang Jalan / Saku Supir</span>
                    <span className="text-slate-400">Honor Pengemudi</span>
                  </div>
                  <input
                    type="number"
                    value={driverAllowance || ''}
                    onChange={(e) => setDriverAllowance(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white font-semibold"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>3. Tiket Ferry & Tol</span>
                    <span className="text-slate-400">Penyeberangan Batulicin/Tol</span>
                  </div>
                  <input
                    type="number"
                    value={ferryTollCost || ''}
                    onChange={(e) => setFerryTollCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white font-semibold"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>4. Segel & Retribusi</span>
                    <span className="text-slate-400">Segel Tangki & Timbangan</span>
                  </div>
                  <input
                    type="number"
                    value={retributionSealCost || ''}
                    onChange={(e) => setRetributionSealCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white font-semibold"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>5. Biaya Lain-lain</span>
                    <span className="text-slate-400">Bongkar/Kawal dsb</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={otherCosts || ''}
                      onChange={(e) => setOtherCosts(Number(e.target.value))}
                      placeholder="Rp"
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white font-semibold"
                    />
                    <input
                      type="text"
                      value={otherCostsNotes}
                      onChange={(e) => setOtherCostsNotes(e.target.value)}
                      placeholder="Keterangan..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* 3. HASIL LIVE REAL-TIME CALCULATION */}
              <div className="bg-slate-950 rounded-xl p-4 border border-rose-900/60 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Biaya Operasional:</span>
                  <span className="font-semibold text-rose-300">{formatRupiah(finCalc.totalCost)}</span>
                </div>

                <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Laba Bersih (Net Margin):</span>
                    <span className={`text-xl font-black ${finCalc.netMargin >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                      {formatRupiah(finCalc.netMargin)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Persentase Margin:</span>
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`text-xl font-black ${finCalc.marginPercentage >= 25 ? 'text-emerald-400' : finCalc.marginPercentage >= 10 ? 'text-amber-400' : 'text-rose-500'}`}>
                        {finCalc.marginPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Health Status Indicator Badge */}
                <div className="pt-2">
                  {finCalc.marginPercentage >= 25 ? (
                    <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>MARGIn SEHAT (Sangat Menguntungkan)</span>
                    </div>
                  ) : finCalc.marginPercentage >= 10 ? (
                    <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>MARGIN CUKUP / TIPIS (Perlu Efisiensi Solar)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/50 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>MARGIN KRITIS / RUGI (Biaya melebihi omset)</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Tombol Aksi Simpan */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-lg text-sm transition"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-gradient-to-r from-[#881337] to-[#be123c] hover:from-[#9f1239] hover:to-[#e11d48] text-white font-bold py-3 rounded-lg text-sm shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <span>Simpan Surat Jalan & Margin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
