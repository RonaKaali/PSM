# Design Document: Surat Jalan & Margin Calculator — PT. Putra Saijaan Mandiri

## 1. Executive Summary & Context
- **Organization**: PT. Putra Saijaan Mandiri (Kotabaru, Kalimantan Selatan).
  - Alamat: Jl. Nelayan RT 02 No 11 Kotabaru Pulau Laut Sigam Kotabaru Kal-Sel
  - Kontak: Telp 0518 23136 | Email: putrasaijaanmandiri@ymail.com
- **Core Business**: Transportir BBM (BioSolar B35/B50, Solar Industri) & General Cargo fleet operator.
- **Problem**: Need an integrated, modern web application to generate official Surat Jalan (BBM & Cargo), calculate trip margins and net profit in real time, print 1:1 physical standard surat jalan documents, and export financial recaps to Excel.

## 2. Tech Stack & Architecture
- **Framework**: Next.js 14 (App Router) + TypeScript.
- **Styling**: Tailwind CSS with custom brand theme:
  - Deep Navy Blue / Teal: `#0e3d43`
  - Accent Gold / Amber: `#F59E0B`
  - Clean Background: Slate / Zinc neutral palette
- **Database & Auth**: Supabase PostgreSQL with RLS.
  - Development note: Configured with graceful fallback/mock data capability so the application is immediately testable and interactive prior to inserting live `.env.local` Supabase keys.
- **Print System**: Native Browser `@media print` CSS engine precisely styled to match 1:1 the physical printed paper of PT. Putra Saijaan Mandiri.
- **Excel Export**: SheetJS (`xlsx`) for client-side and server-side table data export.
- **Icons & UI**: Lucide React icons, Tailwind CSS components.

## 3. Master Data & Operational Specifications
### 3.1 Armada & Supir (Default Pairing)
The fleet selection is streamlined to plate number & driver name pairing:
1. `DA 8485 TG` — Driver: `EKO`
2. `DA 8530 GO` — Driver: `HARLEY`
3. `DA 8247 BV` — Driver: `UMAR`
4. `DA 8537 TG` — Driver: `RAFI'I`
5. `DA 8101 ZR` — Driver: `RONI` *(sesuai dokumen fisik)*
6. `DA 8278 JL` — Driver: `ROBY`

*Catatan penting*:
- Kapasitas muatan (Quantity) diisi secara **manual** per perjalanan (misal: `5000 L`, `10000 L`, atau ukuran lainnya).
- Tipe/Jenis muatan (Types of Goods) diisi secara **manual** per perjalanan (misal: `BIOSOLAR(B50)`, `SOLAR INDUSTRI`, `CPO`, dll).

### 3.2 Alur Format Nomor Surat Jalan
Format: `[No Urut]/PSM/[Bulan Romawi]/KTB/[Tahun]`
Contoh: `042/PSM/X/KTB/2026`

## 4. Database Schema (Supabase PostgreSQL)

```sql
-- 1. Master Armada Kendaraan
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  plate_number text not null unique,
  default_driver_name text not null,
  vehicle_type text default 'Truk Tangki BBM',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Surat Jalan (Trips)
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  trip_number text not null unique,
  trip_date date not null default current_date,
  vehicle_id uuid references vehicles(id) on delete set null,
  plate_number text not null,
  driver_name text not null,
  driver_phone text,
  
  -- Metadata Pengiriman (Sesuai Fisik PT. PSM)
  sold_to text,
  ship_to text not null,
  port_point_area text not null,
  seal_number text not null,
  loading_location text not null,
  quantity_display text not null, -- cth: "5000 L" (manual)
  goods_type text not null,        -- cth: "BIOSOLAR(B50)" (manual)
  charging_time text default 'S/D',
  cargo_condition text default 'BAIK DAN CUKUP',
  notes text,
  
  status text not null default 'draft' check (status in ('draft', 'in_transit', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Finansial & Kalkulator Margin
create table if not exists trip_finances (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade unique,
  
  -- Pendapatan
  revenue_type text not null default 'flat_rate' check (revenue_type in ('flat_rate', 'per_unit')),
  unit_rate decimal(15,2) default 0,
  gross_revenue decimal(15,2) not null default 0,
  
  -- Biaya Operasional
  fuel_cost decimal(15,2) not null default 0,
  driver_allowance decimal(15,2) not null default 0,
  ferry_toll_cost decimal(15,2) not null default 0,
  retribution_seal_cost decimal(15,2) not null default 0,
  other_costs decimal(15,2) not null default 0,
  other_costs_notes text,
  
  -- Hasil Perhitungan
  total_operational_cost decimal(15,2) not null default 0,
  net_margin decimal(15,2) not null default 0,
  margin_percentage decimal(5,2) not null default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

## 5. Alur Kalkulasi Margin (Real-Time Logic)
- **Gross Revenue**:
  - Jika `flat_rate`: Diisi langsung total borongan (misal: Rp 7.500.000).
  - Jika `per_unit`: `unit_rate` × `quantity_numeric` (misal: Rp 1.500 × 5.000 = Rp 7.500.000).
- **Total Operational Cost**:
  - `fuel_cost` + `driver_allowance` + `ferry_toll_cost` + `retribution_seal_cost` + `other_costs`
- **Net Margin**:
  - `gross_revenue - total_operational_cost`
- **Margin Percentage**:
  - `(net_margin / gross_revenue) * 100`
- **Profitability Status**:
  - $\ge 25\%$: Hijau (Sangat Menguntungkan)
  - $10\% - 24.9\%$: Kuning (Waspada / Margin Tipis)
  - $< 10\%$: Merah (Rugi / Tidak Sehat)

## 6. Format Cetak Surat Jalan (1:1 Replica)
Tata letak cetak dokumen mengadopsi format fisik asli:
1. **Header**: Logo PT. PSM + Identitas lengkap PT. Putra Saijaan Mandiri Kotabaru.
2. **Title**: `SURAT JALAN BBM` dan nomor surat jalan.
3. **Table Grid**:
   - `SOLD TO`
   - `SHIP TO`
   - `PORT POIN AREA`
   - `SEAL NUMBER`
   - `LOADING`
   - `DELIVERY BY`
   - `DRIVER`
4. **Tabel Rincian Muatan**:
   - QUANTITY | TYPES OF GOODS | CHARGING TIME | INFORMATION
5. **Catatan**:
   - Catatan : Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran
   - Kotak "Barang yang sudah diterima tidak dapat ditukar / dikembalikan"
6. **Blok Tanda Tangan**:
   - Kiri: Yang Mengirim (`TRANSPORTIR`)
   - Tengah: TTD Yang Menerima (`RECEIVING VESEL`)
   - Kanan: `Kotabaru, [Tanggal]` — Yang Menyerahkan (`SUPPLIER`) + Stempel PT. PSM

## 7. Antarmuka Pengguna & Fitur Aplikasi
- **Dashboard**:
  - KPI Cards: Total Ritase Bulan Ini, Total Omset (Gross Revenue), Total Pengeluaran Solar & Operasional, Total Laba Bersih, Rata-rata Margin %.
  - Grafik tren omset vs biaya bulanan.
  - Quick Action: Tombol "Buat Surat Jalan Baru".
- **Daftar Surat Jalan**:
  - Tabel interaktif dengan filter tanggal, pencarian nopol / supir / ship to, dan status (Draft, Jalan, Selesai).
  - Aksi: Detail, Edit, Cetak Surat Jalan (PDF), Hapus.
- **Form Input Surat Jalan & Live Margin Calculator**:
  - Kolom kiri: Formulir data surat jalan & rute pengiriman.
  - Kolom kanan: Panel kalkulator margin langsung. Setiap kali nilai solar/uang jalan diinput, laba bersih dan margin % langsung berubah secara instan.
- **Modal Cetak Dokumen**:
  - Tampilan cetak preview bersih format A4 persis dokumen fisik.
- **Export Data Excel**:
  - Unduh file `.xlsx` berisi seluruh data operasional dan keuangan.
- **Master Kendaraan**:
  - Manajemen armada 6 kendaraan bawaan + supir, serta opsi tambah kendaraan baru.
