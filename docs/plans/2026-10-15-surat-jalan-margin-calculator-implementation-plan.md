# Implementation Plan: Surat Jalan & Margin Calculator — PT. Putra Saijaan Mandiri

## Overview
Web application internal untuk mencatat surat jalan armada truk tangki/BBM PT. Putra Saijaan Mandiri, menghitung margin/laba per perjalanan secara real-time, cetak dokumen fisik surat jalan 1:1 sesuai format kertas asli, dan ekspor data rekapitulasi ke Excel.

---

## Phase 1: Environment & Project Scaffolding
- [ ] Initialize Next.js 14 App Router with TypeScript and Tailwind CSS.
- [ ] Install dependencies:
  - `lucide-react` (icons)
  - `xlsx` (SheetJS for Excel export)
  - `@supabase/supabase-js` (Supabase database integration)
  - `clsx`, `tailwind-merge`
- [ ] Configure Tailwind theme with brand colors:
  - Navy Teal: `#0e3d43`
  - Accent Gold/Amber: `#F59E0B`
  - Slate accents & crisp typography

## Phase 2: Database Schema & Data Layer
- [ ] Create `supabase/schema.sql` with tables:
  - `vehicles` (pre-seeded with 6 fleet units: DA 8485 TG, DA 8530 GO, DA 8247 BV, DA 8537 TG, DA 8101 ZR, DA 8278 JL)
  - `trips` (surat jalan fields matching physical document)
  - `trip_finances` (revenue, fuel, driver allowance, ferry, seal, net margin)
  - Row Level Security (RLS) policies
- [ ] Implement robust Data Layer with Supabase client and graceful local storage / in-memory fallback so the application runs immediately without breaking before Supabase keys are provided.

## Phase 3: Brand Assets & Component Architecture
- [ ] Create high-resolution SVG logo for **PT. Putra Saijaan Mandiri** (incorporating the stylized red/dark PSM spiral icon from the physical document).
- [ ] Build global Layout with Navbar & Header (Company name, Kotabaru address, phone, email, navigation tabs).
- [ ] Build reusable UI components (Badges, Buttons, Cards, Inputs, Modals, Stat Cards).

## Phase 4: Surat Jalan Creation & Live Real-Time Margin Calculator
- [ ] Build Create Surat Jalan Form:
  - Vehicle dropdown (Plate Number & Default Driver pairing: e.g., `DA 8101 ZR / RONI`).
  - Manual Cargo input: Quantity (e.g. `5000 L`), Types of Goods (e.g. `BIOSOLAR(B50)`), Charging Time (`S/D`), Information (`BAIK DAN CUKUP`).
  - Shipping fields: Sold To, Ship To, Port Point Area, Seal Number, Loading Location.
- [ ] Build Live Margin Calculator Panel:
  - Revenue input (Borongan flat rate or Tarif per Liter/Ton).
  - Cost inputs: Solar/BBM, Uang Supir, Penyeberangan Ferry/Tol, Segel & Retribusi, Biaya Lain-lain.
  - Real-time reactivity: calculates Total Biaya, Laba Bersih, and Margin % instantly with color-coded health indicators.

## Phase 5: 1:1 Physical Document Print View
- [ ] Implement exact 1:1 print component matching the physical paper from PT. PSM:
  - Header: Logo PT. PSM + Company identity lines + double border line.
  - Title: `SURAT JALAN BBM` + Nomor `/PSM/[Bulan]/KTB/2026`.
  - Identity Box: Sold To, Ship To, Port Point Area, Seal Number, Loading, Delivery By, Driver.
  - Cargo table: Quantity, Types of Goods, Charging Time, Information.
  - Notes: "Catatan : Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran" + box "Barang yang sudah diterima tidak dapat ditukar / dikembalikan".
  - Signatures: Transportir (Yang Mengirim), Receiving Vessel (TTD Yang Menerima), Supplier PT. PSM (Yang Menyerahkan) with stamp & date.
- [ ] Add `@media print` CSS for clean, border-perfect physical printer output without navigation bars or browser UI artifacts.

## Phase 6: Operational Dashboard & Financial Analytics
- [ ] Build KPI summary cards (Total Ritase, Gross Revenue, Total Biaya Solar/Operasional, Laba Bersih, Rata-rata Margin %).
- [ ] Build Trip List with search, filtering (by vehicle, driver, date range, status), and quick action buttons.
- [ ] Build Master Armada management view.

## Phase 7: Excel Export Functionality
- [ ] Implement Excel generator using SheetJS:
  - Formatted columns with trip metadata, route, volume, revenue, each cost item, net margin, and margin %.
  - One-click download: `Rekap_Surat_Jalan_PT_PSM_[Periode].xlsx`.

## Phase 8: Testing, Verification & Walkthrough
- [ ] Test trip creation with DA 8101 ZR / RONI (5000 L BioSolar) matching the sample paper.
- [ ] Verify instant margin calculation accuracy.
- [ ] Verify print layout on screen and print media.
- [ ] Verify Excel export output.
