'use client';

import React, { useState } from 'react';
import { DestinationCustomer } from '@/types';
import { DataService } from '@/lib/data-service';
import { X, Building2, Plus, MapPin, Trash2, Check } from 'lucide-react';

interface DestinationManagerModalProps {
  destinations: DestinationCustomer[];
  onClose: () => void;
  onDestinationsUpdated: (destinations: DestinationCustomer[]) => void;
}

export function DestinationManagerModal({
  destinations,
  onClose,
  onDestinationsUpdated,
}: DestinationManagerModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert('Nama PT/UD dan Alamat Tujuan wajib diisi!');
      return;
    }

    try {
      setIsSubmitting(true);
      await DataService.addDestination({
        name: name.trim().toUpperCase(),
        address: address.trim().toUpperCase(),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        is_active: true,
      });

      const updated = await DataService.getDestinations();
      onDestinationsUpdated(updated);
      setIsAdding(false);
      setName('');
      setAddress('');
      setPhone('');
      setNotes('');
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan data tujuan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, destName: string) => {
    if (!confirm(`Hapus tujuan "${destName}"?`)) return;
    try {
      await DataService.deleteDestination(id);
      const updated = await DataService.getDestinations();
      onDestinationsUpdated(updated);
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus tujuan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-rose-900/50 text-slate-100 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-linear-to-r from-[#4c0519] via-[#881337] to-[#700c1e] px-6 py-4 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Master PT / UD Tujuan &amp; Alamat
              </h3>
              <p className="text-xs text-rose-200">
                PT. Putra Saijaan Mandiri • Database Rekanan &amp; Titik Bongkar ({destinations.length} Lokasi)
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
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Pilihan PT/UD ini otomatis muncul di form surat jalan agar alamat langsung terisi:
            </p>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-1.5 bg-[#881337] hover:bg-[#9f1239] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah PT Tujuan</span>
              </button>
            )}
          </div>

          {/* Form Tambah */}
          {isAdding && (
            <form onSubmit={handleAdd} className="bg-slate-800/90 border border-rose-900/60 rounded-xl p-4 space-y-3">
              <span className="text-xs font-bold text-amber-400 block uppercase">
                Input Data PT / UD Tujuan Baru
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Nama PT / UD / Klien *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: UD. MAKMUR JAYA atau PT. KALIMANTAN ENERGI"
                    required
                    autoFocus
                    className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded px-3 py-1.5 text-sm text-white font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Alamat / Titik Bongkar Spesifik (Port Point Area) *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: SITE SMM, BUHUT, KALTENG atau KM. 71 PENGARON KAB. BANJAR"
                    required
                    className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    No. Telepon / Kontak (Opsional)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 0812-xxxx-xxxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Wajib bawa segel cadangan"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-700/60">
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
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Data</span>
                </button>
              </div>
            </form>
          )}

          {/* List Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden max-h-105 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-4">Nama PT / UD Rekanan</th>
                  <th className="py-2.5 px-4">Alamat Bongkar (Port Point Area)</th>
                  <th className="py-2.5 px-3 w-16 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {destinations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      Belum ada data PT Tujuan tersimpan.
                    </td>
                  </tr>
                ) : (
                  destinations.map((d, idx) => (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-amber-300 block">
                          {d.name}
                        </span>
                        {d.phone && (
                          <span className="text-[10px] text-slate-400">
                            Telp: {d.phone}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-start gap-1.5 text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{d.address}</span>
                        </div>
                        {d.notes && (
                          <span className="text-[10px] text-slate-400 italic block mt-0.5 pl-5">
                            {d.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition cursor-pointer"
                          title="Hapus data ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Total terdaftar: <strong className="text-slate-300">{destinations.length} PT / UD</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
