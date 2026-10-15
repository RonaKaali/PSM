export interface Vehicle {
  id: string;
  plate_number: string;
  default_driver_name: string;
  default_driver_phone?: string;
  vehicle_type: string;
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Trip {
  id: string;
  trip_number: string;
  trip_date: string;
  vehicle_id?: string;
  plate_number: string;
  driver_name: string;
  driver_phone?: string;
  sold_to: string;
  ship_to: string;
  port_point_area: string;
  seal_number: string;
  loading_location: string;
  delivery_by: string;
  quantity_display: string;
  goods_type: string;
  charging_time: string;
  cargo_condition: string;
  notes?: string;
  status: 'draft' | 'in_transit' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface TripFinance {
  id: string;
  trip_id: string;
  revenue_type: 'flat_rate' | 'per_unit';
  unit_rate: number;
  gross_revenue: number;
  fuel_cost: number;
  driver_allowance: number;
  ferry_toll_cost: number;
  retribution_seal_cost: number;
  other_costs: number;
  other_costs_notes?: string;
  total_operational_cost: number;
  net_margin: number;
  margin_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface TripWithFinance extends Trip {
  finance: TripFinance;
}
