'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle, TripWithFinance, DestinationCustomer } from '@/types';
import { calculateFinance, formatRupiah, DataService, getVehicleCapacity } from '@/lib/data-service';
import { X, Calculator, Truck, FileText, CheckCircle2, AlertTriangle, Flame, ShieldAlert, ArrowRight, Building2 } from 'lucide-react';

interface CreateTripModalProps {
  vehicles: Vehicle[];
  destinations?: DestinationCustomer[];
  existingTrips: TripWithFinance[];
  editingTrip?: TripWithFinance | null;
  userRole?: 'super_admin' | 'admin';
  onClose: () => void;
  onSaved: (trip: TripWithFinance) => void;
}

interface CurrencyInputProps {
  value: number;
  onChange: (val: number) => void;
  className?: string;
  placeholder?: string;
  size?: 'normal' | 'large';
}

function CurrencyInput({
  value,
  onChange,
  className = '',
  placeholder = '0',
  size = 'normal',
}: CurrencyInputProps) {
  const formatVal = (v: number) => (v ? v.toLocaleString('id-ID') : '');
  const [text, setText] = useState<string>(formatVal(value));

  useEffect(() => {
    setText(formatVal(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (!rawDigits) {
      setText('');
      onChange(0);
      return;
    }
    const num = parseInt(rawDigits, 10);
    setText(num.toLocaleString('id-ID'));
    onChange(num);
  };

  const isLarge = size === 'large';

  return (
    <div className="relative">
      <span
        className={`absolute left-3 text-slate-400 font-bold select-none ${
          isLarge ? 'top-2.5 text-sm' : 'top-1.5 text-xs'
        }`}
      >
        Rp
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={text}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-md text-white font-bold focus:outline-none transition ${
          isLarge ? 'pl-10 pr-3 py-2 text-base text-amber-300' : 'pl-9 pr-3 py-1.5 text-sm'
        } ${className}`}
      />
    </div>
  );
}

export function CreateTripModal({
  vehicles,
  destinations = [],
  existingTrips,
  editingTrip,
  userRole = 'super_admin',
  onClose,
  onSaved,
}: CreateTripModalProps) {
  const isSuperAdmin = userRole === 'super_admin';
  // Destination Customers
  const [destinationsList, setDestinationsList] = useState<DestinationCustomer[]>(destinations);
  const [selectedDestId, setSelectedDestId] = useState<string>('');

  useEffect(() => {
    if (destinations && destinations.length > 0) {
      setDestinationsList(destinations);
    } else {
      DataService.getDestinations().then(setDestinationsList);
    }
  }, [destinations]);

  const handleDestinationSelect = (destId: string) => {
    setSelectedDestId(destId);
    if (!destId) return;
    const found = destinationsList.find((d) => d.id === destId);
    if (found) {
      setShipTo(found.name);
      setPortPointArea(found.address);
      if (!soldTo) {
        setSoldTo(found.name);
      }
    }
  };

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
  const [quantityDisplay, setQuantityDisplay] = useState('5.000 L');
  const [goodsType, setGoodsType] = useState('BIOSOLAR(B50)');
  const [chargingTime, setChargingTime] = useState('S/D');
  const [cargoCondition, setCargoCondition] = useState('BAIK DAN CUKUP');
  const [notes, setNotes] = useState('Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran');
  const [status, setStatus] = useState<'draft' | 'in_transit' | 'completed'>('in_transit');

  // Margin Calculator State
  const [revenueType, setRevenueType] = useState<'flat_rate' | 'per_unit'>('flat_rate');
  const [grossRevenue, setGrossRevenue] = useState<number>(7500000);
  const [unitRate, setUnitRate] = useState<number>(1500);

  // Cost items — hanya 2 jenis biaya
  const [driverAllowance, setDriverAllowance] = useState<number>(1500000);
  const [otherCosts, setOtherCosts] = useState<number>(50000);
  const [otherCostsNotes, setOtherCostsNotes] = useState<string>('');

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize fields on open
  useEffect(() => {
    if (editingTrip) {
      setTripNumber(editingTrip.trip_number || '');
      setTripDate(editingTrip.trip_date || new Date().toISOString().split('T')[0]);
      
      // Auto-match vehicle
      let vId = editingTrip.vehicle_id || '';
      if (!vId && editingTrip.plate_number) {
        const foundVeh = vehicles.find(
          (v) => v.plate_number.replace(/\s+/g, '') === editingTrip.plate_number.replace(/\s+/g, '')
        );
        if (foundVeh) vId = foundVeh.id;
      }
      setSelectedVehicleId(vId);

      setPlateNumber(editingTrip.plate_number || '');
      setDriverName(editingTrip.driver_name || '');
      setDriverPhone(editingTrip.driver_phone || '');
      setSoldTo(editingTrip.sold_to || '');
      setShipTo(editingTrip.ship_to || '');
      setPortPointArea(editingTrip.port_point_area || '');
      setSealNumber(editingTrip.seal_number || '');
      const normLoc = (editingTrip.loading_location || '').toUpperCase().includes('GLOBAL') ? 'GLOBAL' : 'SADP';
      setLoadingLocation(normLoc);
      setDeliveryBy(editingTrip.delivery_by || 'PT. PUTRA SAIJAAN MANDIRI');
      setQuantityDisplay(editingTrip.quantity_display || '5.000 L');
      setGoodsType(editingTrip.goods_type || 'BIOSOLAR(B50)');
      setChargingTime(editingTrip.charging_time || 'S/D');
      setCargoCondition(editingTrip.cargo_condition || 'BAIK DAN CUKUP');
      setNotes(editingTrip.notes || '');
      setStatus((editingTrip.status as any) || 'in_transit');

      // Auto-match destination dropdown
      const destMatch = destinationsList.find(
        (d) => d.name.trim().toUpperCase() === (editingTrip.ship_to || '').trim().toUpperCase()
      );
      setSelectedDestId(destMatch ? destMatch.id : '');

      // Finances (Safe fallback)
      const fin = editingTrip.finance;
      setRevenueType(fin?.revenue_type || 'flat_rate');
      setGrossRevenue(fin?.gross_revenue ?? 7500000);
      setUnitRate(fin?.unit_rate ?? 0);
      setDriverAllowance(fin?.driver_allowance ?? 1500000);
      setOtherCosts(fin?.other_costs ?? 50000);
      setOtherCostsNotes(fin?.other_costs_notes || '');
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
        setQuantityDisplay(getVehicleCapacity(defaultVeh));
      }
    }
  }, [editingTrip, destinationsList]);

  // Handle vehicle selection change: updates Plate, Driver, and auto-adjusts Quantity to Vehicle Capacity
  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    const found = vehicles.find((v) => v.id === vehicleId);
    if (found) {
      setPlateNumber(found.plate_number);
      setDriverName(found.default_driver_name);
      if (found.default_driver_phone) {
        setDriverPhone(found.default_driver_phone);
      }
      // Otomatis menyesuaikan QUANTITY / JUMLAH MUATAN sesuai armada yang dipilih (5000 L / 10.000 L)
      const capacity = getVehicleCapacity(found);
      setQuantityDisplay(capacity);
    }
  };

  // Real-time Margin calculation
  const finCalc = calculateFinance(
    revenueType,
    grossRevenue,
    unitRate,
    quantityDisplay,
    driverAllowance,
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

      const financeData = (!isSuperAdmin && editingTrip?.finance)
        ? {
            revenue_type: editingTrip.finance.revenue_type,
            unit_rate: editingTrip.finance.unit_rate || 0,
            gross_revenue: editingTrip.finance.gross_revenue,
            driver_allowance: editingTrip.finance.driver_allowance,
            other_costs: editingTrip.finance.other_costs,
            other_costs_notes: editingTrip.finance.other_costs_notes,
            total_operational_cost: editingTrip.finance.total_operational_cost,
            net_margin: editingTrip.finance.net_margin,
            margin_percentage: editingTrip.finance.margin_percentage,
          }
        : {
            revenue_type: revenueType,
            unit_rate: revenueType === 'per_unit' ? unitRate : 0,
            gross_revenue: finCalc.calculatedRevenue,
            driver_allowance: driverAllowance,
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
      <div className={`bg-slate-900 border border-rose-900/40 text-slate-100 rounded-xl shadow-2xl w-full ${isSuperAdmin ? 'max-w-6xl' : 'max-w-3xl'} max-h-[92vh] flex flex-col overflow-hidden`}>
        
        {/* Header Modal - Merah Hati theme */}
        <div className="bg-linear-to-r from-[#4c0519] via-[#881337] to-[#700c1e] px-6 py-4 flex items-center justify-between border-b border-rose-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {isSuperAdmin
                  ? (editingTrip ? 'Edit Surat Jalan & Perhitungan Margin' : 'Buat Surat Jalan & Hitung Margin Real-Time')
                  : (editingTrip ? 'Edit Surat Jalan BBM' : 'Buat Surat Jalan BBM Baru')}
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

        {/* Modal Form with Scrollable Content and Sticky Footer */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          
          {/* Scrollable Form Body: 2 Columns for Super Admin, 1 Column for Admin */}
          <div className={`flex-1 overflow-y-auto p-6 ${isSuperAdmin ? 'grid grid-cols-1 lg:grid-cols-12 gap-6' : 'flex flex-col space-y-5'}`}>
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: INFORMASI SURAT JALAN & RUTE               */}
          {/* ======================================================= */}
          <div className={`${isSuperAdmin ? 'lg:col-span-7' : 'w-full'} space-y-5`}>
            
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
                    {vehicles.map((v) => {
                      const cap = getVehicleCapacity(v);
                      return (
                        <option key={v.id} value={v.id}>
                          {v.plate_number} — Supir: {v.default_driver_name} (Kapasitas {cap})
                        </option>
                      );
                    })}
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
                    placeholder="Contoh: 5.000 L atau 10.000 L"
                    required
                    className="w-full bg-slate-900 border border-amber-500/50 focus:border-amber-400 rounded-md px-3 py-2 text-sm text-amber-300 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Ketik manual sesuai kapasitas aktual (cth: 5.000 L, 10.000 L, 25 Ton)
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
                  <select
                    value={loadingLocation}
                    onChange={(e) => setLoadingLocation(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white font-bold cursor-pointer focus:border-rose-500 focus:outline-none"
                  >
                    <option value="SADP">SADP</option>
                    <option value="GLOBAL">GLOBAL</option>
                  </select>
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

              {/* Quick Select PT / UD Tujuan (Auto-fill) */}
              <div className="bg-slate-950/80 border border-amber-500/50 rounded-lg p-3 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    PILIH PT / UD TUJUAN (AUTO-FILL ALAMAT)
                  </label>
                  <span className="text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded font-semibold border border-amber-500/30">
                    Otomatis Isi Alamat
                  </span>
                </div>
                <select
                  value={selectedDestId}
                  onChange={(e) => handleDestinationSelect(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/60 focus:border-amber-400 rounded-md px-3 py-2 text-sm text-white font-bold cursor-pointer focus:outline-none"
                >
                  <option value="">-- Pilih PT / UD Tujuan Terdaftar ({destinationsList.length}) --</option>
                  {destinationsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.address}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Pilih dari daftar rekanan di atas agar nama PT dan alamat bongkar di bawah terisi otomatis.
                </p>
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
          {/* RIGHT COLUMN: LIVE MARGIN CALCULATOR (Super Admin Only) */}
          {/* ======================================================= */}
          {isSuperAdmin && (
            <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-linear-to-b from-slate-800 to-slate-900 border border-rose-900/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
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
                    <CurrencyInput
                      value={grossRevenue}
                      onChange={setGrossRevenue}
                      size="large"
                      placeholder="0"
                      className="border-rose-900/60 focus:border-rose-500"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Tarif per Liter/Ton (Rp)
                      </label>
                      <CurrencyInput
                        value={unitRate}
                        onChange={setUnitRate}
                        placeholder="0"
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

              {/* 2. Biaya Operasional (Hanya 2 item) */}
              <div className="space-y-3 mb-5 border-t border-slate-700/60 pt-4">
                <span className="text-xs font-bold text-slate-300 block uppercase">
                  Rincian Biaya Operasional Jalan
                </span>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>1. Uang Jalan / Saku Supir</span>
                    <span className="text-slate-400">Honor Pengemudi</span>
                  </div>
                  <CurrencyInput
                    value={driverAllowance}
                    onChange={setDriverAllowance}
                    placeholder="0"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>2. Biaya Lain-lain</span>
                    <span className="text-slate-400">Bongkar/Kawal/dsb</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <CurrencyInput
                      value={otherCosts}
                      onChange={setOtherCosts}
                      placeholder="0"
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
                      <span>MARGIN SEHAT (Sangat Menguntungkan)</span>
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

          </div>
          )}

          </div>

          {/* Sticky Modal Footer for Both Roles */}
          <div className="px-6 py-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              {editingTrip ? (
                <span>Mode: <strong className="text-amber-400 font-mono">Edit Surat Jalan ({editingTrip.trip_number})</strong></span>
              ) : (
                <span className="text-emerald-400 font-medium">● Buat Dokumen Surat Jalan Baru</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-linear-to-r from-[#881337] to-[#be123c] hover:from-[#9f1239] hover:to-[#e11d48] text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-950/40 flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <span>
                      {editingTrip
                        ? 'Simpan Perubahan Surat Jalan'
                        : isSuperAdmin
                        ? 'Simpan Surat Jalan & Margin'
                        : 'Simpan Surat Jalan'}
                    </span>
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
