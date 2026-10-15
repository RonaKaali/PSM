import { Vehicle, Trip, TripFinance, TripWithFinance } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    plate_number: 'DA 8485 TG',
    default_driver_name: 'EKO',
    vehicle_type: 'Truk Tangki BBM 10 KL',
    is_active: true,
    notes: 'Kapasitas 10 KL',
  },
  {
    id: 'veh-2',
    plate_number: 'DA 8530 GO',
    default_driver_name: 'HARLEY',
    vehicle_type: 'Truk Tangki BBM 10 KL',
    is_active: true,
    notes: 'Kapasitas 10 KL',
  },
  {
    id: 'veh-3',
    plate_number: 'DA 8247 BV',
    default_driver_name: 'UMAR',
    vehicle_type: 'Truk Tangki BBM 10 KL',
    is_active: true,
    notes: 'Kapasitas 10 KL',
  },
  {
    id: 'veh-4',
    plate_number: 'DA 8537 TG',
    default_driver_name: "RAFI'I",
    vehicle_type: 'Truk Tangki BBM 5 KL',
    is_active: true,
    notes: 'Kapasitas 5 KL',
  },
  {
    id: 'veh-5',
    plate_number: 'DA 8101 ZR',
    default_driver_name: 'RONI',
    vehicle_type: 'Truk Tangki BBM 5 KL',
    is_active: true,
    notes: 'Kapasitas 5 KL (Dokumen Fisik)',
  },
  {
    id: 'veh-6',
    plate_number: 'DA 8278 JL',
    default_driver_name: 'ROBY',
    vehicle_type: 'Truk Tangki BBM 5 KL',
    is_active: true,
    notes: 'Kapasitas 5 KL',
  },
];

export const INITIAL_TRIPS: TripWithFinance[] = [
  {
    id: 'trip-doc-001',
    trip_number: '042/PSM/X/KTB/2026',
    trip_date: '2026-10-06',
    vehicle_id: 'veh-5',
    plate_number: 'DA 8101 ZR',
    driver_name: 'RONI',
    driver_phone: '081254889912',
    sold_to: '',
    ship_to: 'PT. SURYA JAYA MATARAM',
    port_point_area: 'DEKAT BAWAHAN SELAN.KEC.MATRAMAN.KAB.BANJAR/KALSEL',
    seal_number: '050491/050492',
    loading_location: 'SADP',
    delivery_by: 'PT. PUTRA SAIJAAN MANDIRI / DA 8101 ZR',
    quantity_display: '5000 L',
    goods_type: 'BIOSOLAR(B50)',
    charging_time: 'S/D',
    cargo_condition: 'BAIK DAN CUKUP',
    notes: 'Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran',
    status: 'completed',
    created_at: '2026-10-06T08:00:00Z',
    finance: {
      id: 'fin-001',
      trip_id: 'trip-doc-001',
      revenue_type: 'flat_rate',
      unit_rate: 0,
      gross_revenue: 7500000,
      fuel_cost: 2200000,
      driver_allowance: 1500000,
      ferry_toll_cost: 450000,
      retribution_seal_cost: 100000,
      other_costs: 50000,
      other_costs_notes: 'Retribusi jembatan timbang & pelabuhan',
      total_operational_cost: 4300000,
      net_margin: 3200000,
      margin_percentage: 42.67,
    },
  },
  {
    id: 'trip-doc-002',
    trip_number: '043/PSM/X/KTB/2026',
    trip_date: '2026-10-08',
    vehicle_id: 'veh-1',
    plate_number: 'DA 8485 TG',
    driver_name: 'EKO',
    driver_phone: '081349887723',
    sold_to: 'PT. BORNEO COAL MINING',
    ship_to: 'SITE ASAM-ASAM TANAH LAUT',
    port_point_area: 'WORKSHOP TAMBANG AREA BLOK B',
    seal_number: '050510/050511',
    loading_location: 'DEPOT PERTAMINA KOTABARU',
    delivery_by: 'PT. PUTRA SAIJAAN MANDIRI / DA 8485 TG',
    quantity_display: '10000 L',
    goods_type: 'BIOSOLAR(B50)',
    charging_time: '09:00 WITA',
    cargo_condition: 'BAIK DAN CUKUP',
    notes: 'Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran',
    status: 'completed',
    created_at: '2026-10-08T09:00:00Z',
    finance: {
      id: 'fin-002',
      trip_id: 'trip-doc-002',
      revenue_type: 'per_unit',
      unit_rate: 1400,
      gross_revenue: 14000000,
      fuel_cost: 3800000,
      driver_allowance: 2500000,
      ferry_toll_cost: 650000,
      retribution_seal_cost: 150000,
      other_costs: 100000,
      other_costs_notes: 'Biaya kawalan jalur tambang',
      total_operational_cost: 7200000,
      net_margin: 6800000,
      margin_percentage: 48.57,
    },
  },
  {
    id: 'trip-doc-003',
    trip_number: '044/PSM/X/KTB/2026',
    trip_date: '2026-10-14',
    vehicle_id: 'veh-2',
    plate_number: 'DA 8530 GO',
    driver_name: 'HARLEY',
    driver_phone: '085248110099',
    sold_to: 'CV. SAHABAT JAYA MAKMUR',
    ship_to: 'PT. BUMI JAYA PALM OIL',
    port_point_area: 'PABRIK KELAPA SAWIT SEBAMBAN',
    seal_number: '050525/050526',
    loading_location: 'SADP KOTABARU',
    delivery_by: 'PT. PUTRA SAIJAAN MANDIRI / DA 8530 GO',
    quantity_display: '10000 L',
    goods_type: 'BIOSOLAR(B50)',
    charging_time: '14:30 WITA',
    cargo_condition: 'BAIK DAN CUKUP',
    notes: 'Harap diperiksa minyak dan ukurannya sebelum melakukan pembongkaran',
    status: 'in_transit',
    created_at: '2026-10-14T14:30:00Z',
    finance: {
      id: 'fin-003',
      trip_id: 'trip-doc-003',
      revenue_type: 'flat_rate',
      unit_rate: 0,
      gross_revenue: 12500000,
      fuel_cost: 3600000,
      driver_allowance: 2300000,
      ferry_toll_cost: 650000,
      retribution_seal_cost: 150000,
      other_costs: 50000,
      other_costs_notes: 'Biaya segel lab & gate pass',
      total_operational_cost: 6750000,
      net_margin: 5750000,
      margin_percentage: 46.0,
    },
  },
];

// Helper to convert Month to Roman Numeral
export function getRomanMonth(date: Date = new Date()): string {
  const months = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return months[date.getMonth()];
}

// Format Currency
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

// Calculate Finances Helper
export function calculateFinance(
  revenueType: 'flat_rate' | 'per_unit',
  grossRevenue: number,
  unitRate: number,
  quantityStr: string,
  fuelCost: number,
  driverAllowance: number,
  ferryTollCost: number,
  retributionSealCost: number,
  otherCosts: number
): {
  calculatedRevenue: number;
  totalCost: number;
  netMargin: number;
  marginPercentage: number;
} {
  let calculatedRevenue = grossRevenue;

  if (revenueType === 'per_unit') {
    const qtyMatch = quantityStr.replace(/[^0-9.]/g, '');
    const qty = parseFloat(qtyMatch) || 0;
    calculatedRevenue = unitRate * qty;
  }

  const totalCost =
    (fuelCost || 0) +
    (driverAllowance || 0) +
    (ferryTollCost || 0) +
    (retributionSealCost || 0) +
    (otherCosts || 0);

  const netMargin = calculatedRevenue - totalCost;
  const marginPercentage =
    calculatedRevenue > 0 ? (netMargin / calculatedRevenue) * 100 : 0;

  return {
    calculatedRevenue,
    totalCost,
    netMargin,
    marginPercentage: Math.round(marginPercentage * 100) / 100,
  };
}

// Local Storage Manager
const STORAGE_KEYS = {
  VEHICLES: 'psm_vehicles_v1',
  TRIPS: 'psm_trips_v1',
};

function getLocalVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return INITIAL_VEHICLES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_VEHICLES;
  }
}

function setLocalVehicles(vehicles: Vehicle[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
}

function getLocalTrips(): TripWithFinance[] {
  if (typeof window === 'undefined') return INITIAL_TRIPS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS));
      return INITIAL_TRIPS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_TRIPS;
  }
}

function setLocalTrips(trips: TripWithFinance[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
}

// Unified Service Layer
export const DataService = {
  async getVehicles(): Promise<Vehicle[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('plate_number', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch failed, fallback to local', e);
      }
    }
    return getLocalVehicles();
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: 'veh-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .insert([vehicle])
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase insert failed, fallback to local', e);
      }
    }

    const current = getLocalVehicles();
    const updated = [...current, newVehicle];
    setLocalVehicles(updated);
    return newVehicle;
  },

  async getTrips(): Promise<TripWithFinance[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*, finance:trip_finances(*)')
          .order('trip_date', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((t) => ({
            ...t,
            finance: Array.isArray(t.finance) ? t.finance[0] : t.finance,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch failed, fallback to local', e);
      }
    }
    return getLocalTrips();
  },

  async createTrip(
    tripData: Omit<Trip, 'id'>,
    financeData: Omit<TripFinance, 'id' | 'trip_id'>
  ): Promise<TripWithFinance> {
    const tripId = 'trip-' + Date.now();
    const finId = 'fin-' + Date.now();

    const fullTrip: TripWithFinance = {
      ...tripData,
      id: tripId,
      created_at: new Date().toISOString(),
      finance: {
        ...financeData,
        id: finId,
        trip_id: tripId,
        created_at: new Date().toISOString(),
      },
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: tripResult, error: tripErr } = await supabase
          .from('trips')
          .insert([tripData])
          .select()
          .single();

        if (!tripErr && tripResult) {
          const { data: finResult, error: finErr } = await supabase
            .from('trip_finances')
            .insert([{ ...financeData, trip_id: tripResult.id }])
            .select()
            .single();

          if (!finErr && finResult) {
            return { ...tripResult, finance: finResult };
          }
        }
      } catch (e) {
        console.warn('Supabase insert failed, fallback to local', e);
      }
    }

    const current = getLocalTrips();
    const updated = [fullTrip, ...current];
    setLocalTrips(updated);
    return fullTrip;
  },

  async updateTrip(
    id: string,
    tripData: Partial<Trip>,
    financeData: Partial<TripFinance>
  ): Promise<TripWithFinance | null> {
    const current = getLocalTrips();
    const index = current.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const updatedTrip: TripWithFinance = {
      ...current[index],
      ...tripData,
      finance: {
        ...current[index].finance,
        ...financeData,
      },
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('trips').update(tripData).eq('id', id);
        await supabase.from('trip_finances').update(financeData).eq('trip_id', id);
      } catch (e) {
        console.warn('Supabase update failed, fallback to local', e);
      }
    }

    current[index] = updatedTrip;
    setLocalTrips(current);
    return updatedTrip;
  },

  async deleteTrip(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('trips').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete failed', e);
      }
    }
    const current = getLocalTrips();
    const filtered = current.filter((t) => t.id !== id);
    setLocalTrips(filtered);
    return true;
  },

  generateNextTripNumber(currentTrips: TripWithFinance[]): string {
    const now = new Date();
    const year = now.getFullYear();
    const romanMonth = getRomanMonth(now);

    const yearTrips = currentTrips.filter((t) => t.trip_number?.includes(`/${year}`));
    const nextSeq = String(yearTrips.length + 1).padStart(3, '0');

    return `${nextSeq}/PSM/${romanMonth}/KTB/${year}`;
  },
};
