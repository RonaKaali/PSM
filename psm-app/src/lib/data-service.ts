import { Vehicle, Trip, TripFinance, TripWithFinance, DestinationCustomer } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

export const INITIAL_DESTINATIONS: DestinationCustomer[] = [
  { id: 'dest-001', name: 'UD. NABIL', address: 'SAMBA, KALTENG' },
  { id: 'dest-002', name: 'UD. SEPTI', address: 'SAMBA, KALTENG' },
  { id: 'dest-003', name: 'UD. BERKAT SAUDARA', address: 'UNGGANG, KALTENG' },
  { id: 'dest-004', name: 'UD. ARIF', address: 'TIMPAH, KALTENG' },
  { id: 'dest-005', name: 'PT. BALENGKONG MINERAL RESOURCES', address: 'SITE SMM, BUHUT, KALTENG' },
  { id: 'dest-006', name: 'UD. CRISTA', address: 'KURUN, GUNUNG MAS, KALTENG' },
  { id: 'dest-007', name: 'UD. AS', address: 'KASONGAN, KALTENG' },
  { id: 'dest-008', name: 'CV. SAHABAT BARITO RAYA', address: 'PALANGKARAYA, KALTENG' },
  { id: 'dest-009', name: 'UD. DEWA PUTRA MANDIRI / LAAS', address: 'TUMBANG OLONG, KALTENG' },
  { id: 'dest-010', name: 'PT. REKAMITRA INDO TAMBANG PERKASA', address: 'KM. 71 PENGARON, KAB. BANJAR, KAL-SEL' },
  { id: 'dest-011', name: 'UD. 3 DINGSANAK', address: 'TIMPAH, KALTENG' },
  { id: 'dest-012', name: 'UD. YULI', address: 'DHAIANTAMBOK, KALTENG' },
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-1',
    plate_number: 'DA 8485 TG',
    default_driver_name: 'EKO',
    vehicle_type: 'Truk Tangki BBM 10.000 L',
    is_active: true,
    notes: 'Kapasitas 10.000 L',
  },
  {
    id: 'veh-2',
    plate_number: 'DA 8530 GO',
    default_driver_name: 'HARLEY',
    vehicle_type: 'Truk Tangki BBM 10.000 L',
    is_active: true,
    notes: 'Kapasitas 10.000 L',
  },
  {
    id: 'veh-3',
    plate_number: 'DA 8247 BV',
    default_driver_name: 'UMAR',
    vehicle_type: 'Truk Tangki BBM 10.000 L',
    is_active: true,
    notes: 'Kapasitas 10.000 L',
  },
  {
    id: 'veh-4',
    plate_number: 'DA 8537 TG',
    default_driver_name: "RAFI'I",
    vehicle_type: 'Truk Tangki BBM 5000 L',
    is_active: true,
    notes: 'Kapasitas 5000 L',
  },
  {
    id: 'veh-5',
    plate_number: 'DA 8101 ZR',
    default_driver_name: 'RONI',
    vehicle_type: 'Truk Tangki BBM 5000 L',
    is_active: true,
    notes: 'Kapasitas 5000 L',
  },
  {
    id: 'veh-6',
    plate_number: 'DA 8278 JL',
    default_driver_name: 'ROBY',
    vehicle_type: 'Truk Tangki BBM 5000 L',
    is_active: true,
    notes: 'Kapasitas 5000 L',
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
      driver_allowance: 1500000,
      other_costs: 50000,
      other_costs_notes: 'Retribusi jembatan timbang',
      total_operational_cost: 1550000,
      net_margin: 5950000,
      margin_percentage: 79.33,
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
    loading_location: 'GLOBAL',
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
      driver_allowance: 2500000,
      other_costs: 100000,
      other_costs_notes: 'Biaya kawalan jalur tambang',
      total_operational_cost: 2600000,
      net_margin: 11400000,
      margin_percentage: 81.43,
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
    loading_location: 'SADP',
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
      driver_allowance: 2300000,
      other_costs: 50000,
      other_costs_notes: 'Biaya segel lab & gate pass',
      total_operational_cost: 2350000,
      net_margin: 10150000,
      margin_percentage: 81.2,
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
  driverAllowance: number,
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
    (driverAllowance || 0) +
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
  VEHICLES: 'psm_vehicles_v2',
  TRIPS: 'psm_trips_v1',
  DESTINATIONS: 'psm_destinations_v1',
};

function getLocalDestinations(): DestinationCustomer[] {
  if (typeof window === 'undefined') return INITIAL_DESTINATIONS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(INITIAL_DESTINATIONS));
      return INITIAL_DESTINATIONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_DESTINATIONS;
  }
}

function setLocalDestinations(destinations: DestinationCustomer[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinations));
}

export function getVehicleCapacity(vehicle?: Partial<Vehicle> | null): string {
  if (!vehicle) return '5000 L';
  const text = `${vehicle.plate_number || ''} ${vehicle.notes || ''} ${vehicle.vehicle_type || ''}`.toUpperCase();
  // 10.000 L: DA 8485 TG, DA 8530 GO, DA 8247 BV
  if (text.includes('8485') || text.includes('8530') || text.includes('8247') || text.includes('10')) {
    return '10.000 L';
  }
  // 5000 L: DA 8537 TG, DA 8101 ZR, DA 8278 JL
  return '5000 L';
}

export function normalizeVehicle(v: Vehicle): Vehicle {
  const cap = getVehicleCapacity(v);
  return {
    ...v,
    vehicle_type: `Truk Tangki BBM ${cap}`,
    notes: `Kapasitas ${cap}`,
  };
}

function getLocalVehicles(): Vehicle[] {
  if (typeof window === 'undefined') return INITIAL_VEHICLES.map(normalizeVehicle);
  try {
    let data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    // Migration from v1 if exists
    if (!data) {
      const v1Data = localStorage.getItem('psm_vehicles_v1');
      if (v1Data) {
        localStorage.removeItem('psm_vehicles_v1');
      }
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
      return INITIAL_VEHICLES.map(normalizeVehicle);
    }
    const parsed: Vehicle[] = JSON.parse(data);
    return parsed.map(normalizeVehicle);
  } catch {
    return INITIAL_VEHICLES.map(normalizeVehicle);
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
        if (!error && data && data.length > 0) {
          return data.map(normalizeVehicle);
        }
      } catch (e) {
        console.warn('Supabase fetch failed, fallback to local', e);
      }
    }
    return getLocalVehicles().map(normalizeVehicle);
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
        const cleanTrip: Record<string, any> = { ...tripData };
        if (cleanTrip.vehicle_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanTrip.vehicle_id)) {
          delete cleanTrip.vehicle_id;
        }
        const { data: tripResult, error: tripErr } = await supabase
          .from('trips')
          .insert([cleanTrip])
          .select()
          .single();

        if (!tripErr && tripResult) {
          const { data: finResult, error: finErr } = await supabase
            .from('trip_finances')
            .insert([{ ...financeData, trip_id: tripResult.id }])
            .select()
            .single();

          const finalTrip: TripWithFinance = {
            ...tripResult,
            finance: (!finErr && finResult) ? finResult : {
              id: 'fin-' + Date.now(),
              trip_id: tripResult.id,
              ...financeData,
            },
          };

          const current = getLocalTrips();
          setLocalTrips([finalTrip, ...current.filter((t) => t.id !== finalTrip.id)]);
          return finalTrip;
        }
      } catch (e) {
        console.warn('Supabase insert failed, fallback to local', e);
      }
    }

    const current = getLocalTrips();
    const updated = [fullTrip, ...current.filter((t) => t.id !== fullTrip.id)];
    setLocalTrips(updated);
    return fullTrip;
  },

  async updateTrip(
    id: string,
    tripData: Partial<Trip>,
    financeData: Partial<TripFinance>
  ): Promise<TripWithFinance> {
    // 1. Update in Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const cleanTrip: Record<string, any> = { ...tripData };
        if (cleanTrip.vehicle_id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanTrip.vehicle_id)) {
          delete cleanTrip.vehicle_id;
        }
        await supabase.from('trips').update(cleanTrip).eq('id', id);
        if (financeData && Object.keys(financeData).length > 0) {
          await supabase.from('trip_finances').update(financeData).eq('trip_id', id);
        }
      } catch (e) {
        console.warn('Supabase update failed, fallback to local', e);
      }
    }

    // 2. Update in Local Storage (Always ensure local state is updated)
    const current = getLocalTrips();
    const index = current.findIndex((t) => t.id === id);
    let updatedTrip: TripWithFinance;

    if (index !== -1) {
      updatedTrip = {
        ...current[index],
        ...tripData,
        finance: {
          ...current[index].finance,
          ...financeData,
        },
      };
      current[index] = updatedTrip;
    } else {
      updatedTrip = {
        id,
        created_at: new Date().toISOString(),
        ...tripData,
        finance: {
          id: 'fin-' + Date.now(),
          trip_id: id,
          ...financeData,
        } as any,
      } as TripWithFinance;
      current.unshift(updatedTrip);
    }

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

  async getDestinations(): Promise<DestinationCustomer[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase destinations fetch failed, fallback to local', e);
      }
    }
    return getLocalDestinations();
  },

  async addDestination(item: Omit<DestinationCustomer, 'id'>): Promise<DestinationCustomer> {
    const newDest: DestinationCustomer = {
      ...item,
      id: 'dest-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .insert([item])
          .select()
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase destinations insert failed, fallback to local', e);
      }
    }

    const current = getLocalDestinations();
    const updated = [...current, newDest];
    setLocalDestinations(updated);
    return newDest;
  },

  async deleteDestination(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('destinations').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase destination delete failed', e);
      }
    }
    const current = getLocalDestinations();
    const filtered = current.filter((d) => d.id !== id);
    setLocalDestinations(filtered);
    return true;
  },
};
