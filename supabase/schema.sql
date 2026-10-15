-- ==============================================================================
-- SKEMA DATABASE SUPABASE: PT. PUTRA SAIJAAN MANDIRI (KOTABARU, KALSEL)
-- Aplikasi: Surat Jalan & Margin Calculator
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- 2. Drop existing tables if needed (Safe migration)
drop table if exists trip_finances cascade;
drop table if exists trips cascade;
drop table if exists vehicles cascade;

-- 3. Tabel: vehicles (Master Armada Kendaraan & Supir Default)
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  plate_number text not null unique,       -- Nomor Polisi (contoh: DA 8101 ZR)
  default_driver_name text not null,       -- Supir bawaan nopol (contoh: RONI)
  default_driver_phone text,               -- Nomor kontak supir
  vehicle_type text default 'Truk Tangki BBM', -- Tipe armada
  is_active boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Tabel: trips (Surat Jalan BBM / Cargo Sesuai Dokumen Fisik PT. PSM)
create table trips (
  id uuid primary key default gen_random_uuid(),
  trip_number text not null unique,        -- Format: 042/PSM/X/KTB/2026
  trip_date date not null default current_date,
  
  -- Armada & Supir
  vehicle_id uuid references vehicles(id) on delete set null,
  plate_number text not null,              -- Snapshot nopol (cth: DA 8101 ZR)
  driver_name text not null,               -- Supir yang bertugas (cth: RONI)
  driver_phone text,
  
  -- Metadata Dokumen Fisik PT. PSM
  sold_to text default '',                 -- SOLD TO (Klien/Perusahaan Pembeli)
  ship_to text not null,                   -- SHIP TO (cth: PT. SURYA JAYA MATARAM)
  port_point_area text not null,           -- PORT POIN AREA (cth: DEKAT BAWAHAN SELAN...)
  seal_number text not null,               -- SEAL NUMBER (cth: 050491/050492)
  loading_location text not null,          -- LOADING (Depot Muat, cth: SADP)
  delivery_by text default 'PT. PUTRA SAIJAAN MANDIRI',
  
  -- Rincian Muatan (Input Manual per jalan sesuai instruksi)
  quantity_display text not null,          -- QUANTITY (cth: 5000 L)
  goods_type text not null,                -- TYPES OF GOODS (cth: BIOSOLAR(B50))
  charging_time text default 'S/D',        -- CHARGING TIME (cth: S/D)
  cargo_condition text default 'BAIK DAN CUKUP', -- INFORMATION
  notes text default 'Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran',
  
  -- Status Operasional
  status text not null default 'draft' check (status in ('draft', 'in_transit', 'completed', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Tabel: trip_finances (Kalkulasi Pendapatan, Biaya, Margin Laba Bersih)
create table trip_finances (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade unique,
  
  -- Pendapatan (Revenue)
  revenue_type text not null default 'flat_rate' check (revenue_type in ('flat_rate', 'per_unit')),
  unit_rate decimal(15,2) default 0,       -- Tarif per satuan (bila per_unit, cth: Rp 1.500/L)
  gross_revenue decimal(15,2) not null default 0, -- Pendapatan kotor tagihan ke klien
  
  -- Biaya Operasional Perjalanan (Operational Costs)
  fuel_cost decimal(15,2) not null default 0,         -- Biaya Solar / BBM
  driver_allowance decimal(15,2) not null default 0,  -- Uang Jalan / Saku Supir
  ferry_toll_cost decimal(15,2) not null default 0,   -- Penyeberangan Ferry / Tol / Parkir
  retribution_seal_cost decimal(15,2) not null default 0, -- Biaya Segel Tangki & Retribusi
  other_costs decimal(15,2) not null default 0,       -- Biaya Lain-lain (Bongkar/Kawal dsb)
  other_costs_notes text,
  
  -- Hasil Perhitungan Otomatis
  total_operational_cost decimal(15,2) not null default 0,
  net_margin decimal(15,2) not null default 0,
  margin_percentage decimal(5,2) not null default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Trigger untuk otomatis menghitung Total Biaya, Laba Bersih, & Margin %
create or replace function calculate_trip_margin()
returns trigger as $$
begin
  -- Total Biaya Operasional
  new.total_operational_cost := coalesce(new.fuel_cost, 0) + 
                                coalesce(new.driver_allowance, 0) + 
                                coalesce(new.ferry_toll_cost, 0) + 
                                coalesce(new.retribution_seal_cost, 0) + 
                                coalesce(new.other_costs, 0);
  
  -- Laba Bersih (Net Margin)
  new.net_margin := coalesce(new.gross_revenue, 0) - new.total_operational_cost;
  
  -- Persentase Margin
  if coalesce(new.gross_revenue, 0) > 0 then
    new.margin_percentage := round(((new.net_margin / new.gross_revenue) * 100)::numeric, 2);
  else
    new.margin_percentage := 0;
  end if;
  
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger trg_calc_trip_margin
before insert or update on trip_finances
for each row
execute function calculate_trip_margin();

-- 7. Seed Data: 6 Armada & Supir Bawaan PT. Putra Saijaan Mandiri
insert into vehicles (plate_number, default_driver_name, vehicle_type, notes)
values
  ('DA 8485 TG', 'EKO', 'Truk Tangki BBM', 'Armada 10 KL'),
  ('DA 8530 GO', 'HARLEY', 'Truk Tangki BBM', 'Armada 10 KL'),
  ('DA 8247 BV', 'UMAR', 'Truk Tangki BBM', 'Armada 10 KL'),
  ('DA 8537 TG', 'RAFI''I', 'Truk Tangki BBM', 'Armada 5 KL'),
  ('DA 8101 ZR', 'RONI', 'Truk Tangki BBM', 'Armada 5 KL (Sesuai Contoh Dokumen Fisik)'),
  ('DA 8278 JL', 'ROBY', 'Truk Tangki BBM', 'Armada 5 KL')
on conflict (plate_number) do update set
  default_driver_name = excluded.default_driver_name,
  vehicle_type = excluded.vehicle_type;

-- 8. Seed Sample Trip Sesuai Dokumen Fisik Nyata (DA 8101 ZR / RONI)
do $$
declare
  v_vehicle_id uuid;
  v_trip_id uuid;
begin
  select id into v_vehicle_id from vehicles where plate_number = 'DA 8101 ZR' limit 1;
  
  insert into trips (
    trip_number, trip_date, vehicle_id, plate_number, driver_name,
    sold_to, ship_to, port_point_area, seal_number, loading_location,
    quantity_display, goods_type, charging_time, cargo_condition, status
  ) values (
    '001/PSM/X/KTB/2026', '2026-10-06', v_vehicle_id, 'DA 8101 ZR', 'RONI',
    '', 'PT. SURYA JAYA MATARAM', 'DEKAT BAWAHAN SELAN.KEC.MATRAMAN.KAB.BANJAR/KALSEL',
    '050491/050492', 'SADP', '5000 L', 'BIOSOLAR(B50)', 'S/D', 'BAIK DAN CUKUP', 'completed'
  ) returning id into v_trip_id;
  
  insert into trip_finances (
    trip_id, revenue_type, gross_revenue, fuel_cost, driver_allowance,
    ferry_toll_cost, retribution_seal_cost, other_costs, other_costs_notes
  ) values (
    v_trip_id, 'flat_rate', 7500000, 2200000, 1500000, 450000, 100000, 50000, 'Parkir dan retribusi daerah'
  );
end $$;

-- 9. Row Level Security (RLS)
alter table vehicles enable row level security;
alter table trips enable row level security;
alter table trip_finances enable row level security;

-- Policies for public or authenticated internal staff
create policy "Allow all read access for internal app" on vehicles for all using (true);
create policy "Allow all read access for internal app trips" on trips for all using (true);
create policy "Allow all read access for internal app finances" on trip_finances for all using (true);
