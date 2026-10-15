'use client';

import React, { useState } from 'react';
import { Vehicle } from '@/types';
import { DataService } from '@/lib/data-service';
import { X, Truck, Plus, Check, Shield } from 'lucide-react';

interface VehicleManagerModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  onVehiclesUpdated: (vehicles: Vehicle[]) => void;
}

export function VehicleManagerModal({
  vehicles,
  onClose,
  onVehiclesUpdated,
}: VehicleManagerModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newType, setNewType] = useState('Truk Tangki BBM');
  const [newNotes, setNewNotes] = useState('Armada 10 KL');
  const [newPhone, setNewPhone] = useState('');

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate || !newDriver) {
      alert('Nopol dan Nama Supir wajib diisi!');
      return;
    }

    try {
      const created = await DataService.addVehicle({
        plate_number: newPlate.toUpperCase(),
        default_driver_name: newDriver.toUpperCase(),
        vehicle_type: newType,
        notes: newNotes,
        default_driver_phone: newPhone,
        is_active: true,
      });

      const updated = await DataService.getVehicles();
      onVehiclesUpdated(updated);
      setIsAdding(false);
      setNewPlate('');
      setNewDriver('');
      setNewPhone('');
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan armada');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-900/50 text-slate-100 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#4c0519] via-[#881337] to-[#700c1e] px-6 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">
                Master Armada Kendaraan & Supir
              </h3>
              <p className="text-xs text-rose-200">
                PT. Putra Saijaan Mandiri • 6 Unit Kendaraan Bawaan
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
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Daftar nopol dan nama supir yang akan muncul di dropdown saat membuat surat jalan:
            </p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 bg-[#881337] hover:bg-[#9f1239] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Armada</span>
              </button>
            )}
          </div>

          {/* Form Tambah Armada */}
          {isAdding && (
            <form onSubmit={handleAddVehicle} className="bg-slate-800/90 border border-rose-900/60 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-amber-400 block uppercase">
                Input Armada Baru
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Nomor Polisi (Nopol) *</label>
                  <input
                    type="text"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    placeholder="Contoh: DA 8999 XX"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Supir Bawaan *</label>
                  <input
                    type="text"
                    value={newDriver}
                    onChange={(e) => setNewDriver(e.target.value)}
                    placeholder="Contoh: BUDI"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Tipe Kendaraan</label>
                  <input
                    type="text"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Keterangan / Tipe Tangki</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Contoh: Armada 10 KL atau 5 KL"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-semibold text-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold text-white"
                >
                  Simpan Armada
                </button>
              </div>
            </form>
          )}

          {/* Tabel Kendaraan */}
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">No</th>
                  <th className="py-2.5 px-4">Nomor Polisi</th>
                  <th className="py-2.5 px-4">Supir Default</th>
                  <th className="py-2.5 px-4">Tipe Armada</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {vehicles.map((v, idx) => (
                  <tr key={v.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-amber-300 font-mono text-sm">
                      {v.plate_number}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {v.default_driver_name}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {v.vehicle_type} ({v.notes || '-'})
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold">
                        <Check className="w-3 h-3" />
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
