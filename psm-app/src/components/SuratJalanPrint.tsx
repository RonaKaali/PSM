'use client';

import React from 'react';
import { TripWithFinance } from '@/types';
import { PSMLogo } from './PSMLogo';
import { Printer, X, Download } from 'lucide-react';

interface SuratJalanPrintProps {
  trip: TripWithFinance;
  onClose: () => void;
}

export function SuratJalanPrint({ trip, onClose }: SuratJalanPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  // Format date: e.g. "06 OKTOBER 2026"
  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = [
        'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
        'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
      ];
      const day = String(d.getDate()).padStart(2, '0');
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateStr.toUpperCase();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 md:p-6 overflow-y-auto no-print">
      {/* Container wrapper */}
      <div className="relative bg-white text-black w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden my-auto border border-slate-300">
        
        {/* Modal Action Header (Hidden during actual print) */}
        <div className="no-print bg-[#4c0519] text-white px-6 py-3.5 flex items-center justify-between border-b border-rose-900">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400 text-black font-bold px-2 py-0.5 rounded text-xs">
              FORMAT FISIK 1:1
            </span>
            <span className="font-semibold text-sm">
              Preview Cetak Surat Jalan: {trip.trip_number}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-md shadow transition cursor-pointer text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-rose-900/60 rounded-md transition text-slate-300 hover:text-white cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PRINTABLE PHYSICAL SURAT JALAN (EXACT 1:1 REPLICA)             */}
        {/* ============================================================== */}
        <div className="printable-document p-8 md:p-12 bg-white text-black font-sans leading-tight">
          
          {/* 1. KOP SURAT RESMI */}
          <div className="flex items-start gap-5 pb-3">
            <div className="flex flex-col items-center shrink-0">
              <img
                src="/logopsm.png"
                alt="Logo PT. PSM"
                className="h-16 w-auto object-contain"
              />
              <span className="text-[7.5px] font-bold text-black tracking-tight mt-0.5">PUTRA SAIJAAN MANDIRI</span>
            </div>

            <div className="flex-1 pt-1">
              <h1 className="text-xl md:text-2xl font-black tracking-wide text-black uppercase font-serif">
                PT. PUTRA SAIJAAN MANDIRI
              </h1>
              <p className="text-[12px] md:text-[13px] text-black font-medium mt-0.5">
                Jl. Nelayan RT 02 No 11 Kotabaru Pulau Laut Sigam Kotabaru Kal-Sel
              </p>
              <p className="text-[12px] md:text-[13px] text-black font-medium mt-0.5">
                Telp : 0518 23136 Email : <span className="underline">putrasaijaanmandiri@ymail.com</span>
              </p>
            </div>
          </div>

          {/* Garis Ganda Pemisah Kop Surat */}
          <div className="border-b-[2.5px] border-black mb-[2px]"></div>
          <div className="border-b-[1px] border-black mb-5"></div>

          {/* 2. JUDUL DOKUMEN & NOMOR */}
          <div className="text-center mb-5">
            <h2 className="text-base md:text-lg font-black tracking-wider uppercase underline">
              SURAT JALAN BBM
            </h2>
            <p className="text-xs md:text-sm font-bold mt-1 text-slate-800">
              Nomor : {trip.trip_number}
            </p>
          </div>

          {/* 3. TABEL IDENTITAS PENGIRIMAN (GRID BORDER HITAM TEGAS) */}
          <div className="border border-black mb-5">
            <div className="grid grid-cols-[160px_1fr] border-b border-black py-1.5 px-3">
              <span className="font-bold text-[12px] md:text-[13px] tracking-wide">SOLD TO</span>
              <span className="text-[12px] md:text-[13px] font-semibold uppercase">: {trip.sold_to || '-'}</span>
            </div>

            <div className="grid grid-cols-[160px_1fr] border-b border-black py-1.5 px-3">
              <span className="font-bold text-[12px] md:text-[13px] tracking-wide">SHIP TO</span>
              <span className="text-[12px] md:text-[13px] font-bold uppercase">: {trip.ship_to}</span>
            </div>

            <div className="grid grid-cols-[160px_1fr] border-b border-black py-1.5 px-3">
              <span className="font-bold text-[12px] md:text-[13px] tracking-wide">PORT POIN AREA</span>
              <span className="text-[12px] md:text-[13px] font-semibold uppercase">: {trip.port_point_area}</span>
            </div>

            <div className="grid grid-cols-[160px_1fr] border-b border-black py-1.5 px-3">
              <span className="font-bold text-[12px] md:text-[13px] tracking-wide">SEAL NUMBER</span>
              <span className="text-[12px] md:text-[13px] font-bold uppercase">: {trip.seal_number}</span>
            </div>

            <div className="grid grid-cols-[160px_1fr] border-b border-black py-1.5 px-3">
              <span className="font-bold text-[12px] md:text-[13px] tracking-wide">LOADING</span>
              <span className="text-[12px] md:text-[13px] font-bold uppercase">: {trip.loading_location}</span>
            </div>

            <div className="grid grid-cols-[160px_1fr] border-b border-black py-1.5 px-3">
              <span className="font-bold text-[12px] md:text-[13px] tracking-wide">DELIVERY BY</span>
              <span className="text-[12px] md:text-[13px] font-bold uppercase">
                : {trip.delivery_by || 'PT. PUTRA SAIJAAN MANDIRI'} / {trip.plate_number}
              </span>
            </div>

            <div className="grid grid-cols-[160px_1fr] py-1.5 px-3">
              <span className="font-bold text-[12px] md:text-[13px] tracking-wide">DRIVER</span>
              <span className="text-[12px] md:text-[13px] font-bold uppercase">: {trip.driver_name}</span>
            </div>
          </div>

          {/* 4. TABEL RINCIAN MUATAN (CARGO TABLE) */}
          <div className="border border-black mb-4">
            <table className="w-full text-center border-collapse text-[12px] md:text-[13px]">
              <thead>
                <tr className="border-b border-black font-bold uppercase bg-slate-50 print:bg-transparent">
                  <th className="border-r border-black py-2 px-3 w-[25%]">QUANTITY</th>
                  <th className="border-r border-black py-2 px-3 w-[30%]">TYPES OF GOODS</th>
                  <th className="border-r border-black py-2 px-3 w-[20%]">CHARGING TIME</th>
                  <th className="py-2 px-3 w-[25%]">INFORMATION</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold uppercase h-14">
                  <td className="border-r border-black py-3 px-3 align-middle text-sm">{trip.quantity_display}</td>
                  <td className="border-r border-black py-3 px-3 align-middle">{trip.goods_type}</td>
                  <td className="border-r border-black py-3 px-3 align-middle">{trip.charging_time || 'S/D'}</td>
                  <td className="py-3 px-3 align-middle">{trip.cargo_condition || 'BAIK DAN CUKUP'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. CATATAN KAKI RESMI */}
          <div className="mb-6 space-y-2">
            <p className="text-[11px] md:text-[12px] font-bold italic">
              Catatan : {trip.notes || 'Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran'}
            </p>

            <div className="inline-block border border-black px-4 py-1">
              <p className="text-[11px] md:text-[12px] font-black uppercase tracking-tight">
                Barang yang sudah diterima tidak dapat ditukar / dikembalikan
              </p>
            </div>
          </div>

          {/* 6. BLOK TANDA TANGAN 3 PIHAK */}
          <div className="pt-2">
            {/* Tanggal Banjarmasin di atas kolom Yang Menyerahkan */}
            <div className="flex justify-end mb-2">
              <div className="w-[33%] text-center">
                <span className="text-[12px] md:text-[13px] font-bold">
                  Banjarmasin, {formatDateIndo(trip.trip_date)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 text-center text-[12px] md:text-[13px]">
              {/* Kolom 1: Yang Mengirim */}
              <div className="flex flex-col justify-between h-40">
                <span className="font-bold">Yang Mengirim</span>
                <div className="flex flex-col items-center">
                  <div className="w-3/4 border-b border-black mb-1"></div>
                  <span className="font-bold uppercase tracking-wider">TRANSPORTIR</span>
                </div>
              </div>

              {/* Kolom 2: Yang Menerima */}
              <div className="flex flex-col justify-between h-40">
                <div>
                  <span className="font-bold block">TTD</span>
                  <span className="font-bold block">Yang Menerima</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-3/4 border-b border-black mb-1"></div>
                  <span className="font-bold uppercase tracking-wider">RECEIVING VESEL</span>
                </div>
              </div>

              {/* Kolom 3: Yang Menyerahkan (PT. PSM Supplier) */}
              <div className="flex flex-col justify-between h-40">
                <span className="font-bold">Yang Menyerahkan</span>
                
                {/* Visual Stamp PT. PSM */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-14 opacity-85">
                    <img
                      src="/logopsm.png"
                      alt="Stamp PT. PSM"
                      className="h-14 w-auto object-contain"
                    />
                  </div>
                  <div className="w-3/4 border-b border-black mb-1"></div>
                  <span className="font-bold uppercase tracking-wider">SUPPLIER</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
