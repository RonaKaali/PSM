'use client';

import React, { useState } from 'react';
import { Vehicle } from '@/types';
import { DataService, getVehicleCapacity } from '@/lib/data-service';
import { X, Truck, Plus, Check, Edit3, Trash2, Save } from 'lucide-react';

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
  // Tambah state
  const [isAdding, setIsAdding] = useState(false);
  const [newPlate, setNewPlate] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newType, setNewType] = useState('Truk Tangki BBM');
  const [newNotes, setNewNotes] = useState('Kapasitas 10.000 L');
  const [newPhone, setNewPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPlate, setEditPlate] = useState('');
  const [editDriver, setEditDriver] = useState('');
  const [editType, setEditType] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const handleStartEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setEditPlate(v.plate_number);
    setEditDriver(v.default_driver_name);
    setEditType(v.vehicle_type || 'Truk Tangki BBM');
    setEditNotes(v.notes || '');
    setEditPhone(v.default_driver_phone || '');
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editPlate.trim() || !editDriver.trim()) {
      alert('Nomor Polisi dan Nama Supir wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      await DataService.updateVehicle(id, {
        plate_number: editPlate.trim().toUpperCase(),
        default_driver_name: editDriver.trim().toUpperCase(),
        vehicle_type: editType.trim() || 'Truk Tangki BBM',
        notes: editNotes.trim(),
        default_driver_phone: editPhone.trim(),
      });

      const updated = await DataService.getVehicles();
      onVehiclesUpdated(updated);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Gagal memperbarui data armada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (v: Vehicle) => {
    const confirmMsg = `Yakin ingin menghapus armada ${v.plate_number} (Supir: ${v.default_driver_name})?`;
    if (!confirm(confirmMsg)) return;

    try {
      setIsSubmitting(true);
      await DataService.deleteVehicle(v.id);
      const updated = await DataService.getVehicles();
      onVehiclesUpdated(updated);
      if (editingId === v.id) setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus armada');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim() || !newDriver.trim()) {
      alert('Nopol dan Nama Supir wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      await DataService.addVehicle({
        plate_number: newPlate.trim().toUpperCase(),
        default_driver_name: newDriver.trim().toUpperCase(),
        vehicle_type: newType.trim() || 'Truk Tangki BBM',
        notes: newNotes.trim(),
        default_driver_phone: newPhone.trim(),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-900/50 text-slate-100 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#4c0519] via-[#881337] to-[#700c1e] px-6 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Truck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Master Armada Kendaraan &amp; Supir
              </h3>
              <p className="text-xs text-rose-200">
                PT. Putra Saijaan Mandiri • {vehicles.length} Unit Armada Terdaftar
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
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Kelola nomor polisi, nama supir default, dan tipe armada untuk pembuatan surat jalan:
            </p>
            {!isAdding && (
              <button
                onClick={() => {
                  setIsAdding(true);
                  setEditingId(null);
                }}
                className="flex items-center gap-1.5 bg-[#881337] hover:bg-[#9f1239] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer"
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
                    autoFocus
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Nama Supir Bawaan *</label>
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
                  <label className="text-[11px] text-slate-300 block mb-1">Keterangan / Kapasitas Tangki</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Contoh: Kapasitas 10.000 L atau 5.000 L"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-semibold text-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded text-xs font-bold text-white cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Armada'}
                </button>
              </div>
            </form>
          )}

          {/* Tabel Kendaraan */}
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 text-center">No</th>
                    <th className="py-2.5 px-3">Nomor Polisi</th>
                    <th className="py-2.5 px-3">Supir Default</th>
                    <th className="py-2.5 px-3">Tipe Armada</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {vehicles.map((v, idx) => {
                    const isEditing = editingId === v.id;

                    if (isEditing) {
                      return (
                        <tr key={v.id} className="bg-slate-800/80 border-l-4 border-amber-400">
                          <td className="py-3 px-3 text-slate-400 text-center font-bold">{idx + 1}</td>
                          
                          {/* Edit Nopol */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editPlate}
                              onChange={(e) => setEditPlate(e.target.value)}
                              className="w-full bg-slate-950 border border-amber-500/80 rounded px-2 py-1 text-xs text-amber-300 font-mono font-bold uppercase"
                              placeholder="Nopol"
                            />
                          </td>

                          {/* Edit Supir */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editDriver}
                              onChange={(e) => setEditDriver(e.target.value)}
                              className="w-full bg-slate-950 border border-amber-500/80 rounded px-2 py-1 text-xs text-white font-bold uppercase"
                              placeholder="Nama Supir"
                              autoFocus
                            />
                          </td>

                          {/* Edit Tipe / Kapasitas */}
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                              placeholder="Kapasitas (cth: Kapasitas 10.000 L)"
                            />
                          </td>

                          {/* Status */}
                          <td className="py-2 px-3">
                            <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                              Sedang Diedit
                            </span>
                          </td>

                          {/* Aksi Simpan / Batal */}
                          <td className="py-2 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleSaveEdit(v.id)}
                                disabled={isSubmitting}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded flex items-center gap-1 transition text-xs cursor-pointer shadow"
                                title="Simpan Perubahan"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan</span>
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isSubmitting}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded transition text-xs cursor-pointer"
                                title="Batal"
                              >
                                Batal
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={v.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3 text-slate-400 text-center">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-amber-300 font-mono text-sm">
                          {v.plate_number}
                        </td>
                        <td className="py-3 px-3 font-bold text-white">
                          {v.default_driver_name}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          Truk Tangki BBM ({getVehicleCapacity(v)})
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[11px] font-bold">
                            <Check className="w-3 h-3" />
                            Aktif
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleStartEdit(v)}
                              className="p-1.5 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 rounded transition cursor-pointer"
                              title="Edit Nopol / Ganti Nama Supir"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v)}
                              className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded transition cursor-pointer"
                              title="Hapus Armada"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
