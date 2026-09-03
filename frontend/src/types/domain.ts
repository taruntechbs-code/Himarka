/**
 * HIMARKA Frontend Domain Data Contracts
 * Explicit TypeScript definitions aligned with backend Pydantic schemas.
 */

export interface StorageUnit {
  id: string;
  name: string;
  location_village: string;
  location_state: string;
  capacity_kg: number;
  target_temp_min: number;
  target_temp_max: number;
  target_humidity_min: number;
  target_humidity_max: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  device_id: string;
  storage_unit_id?: string;
  hardware_type: string;
  firmware_version: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'DEGRADED';
  last_seen_at?: string;
  ip_address?: string;
  is_active: boolean;
  created_at: string;
}

export interface TelemetryRecord {
  id: string;
  device_id: string;
  storage_unit_id?: string;
  timestamp: string;
  received_at: string;
  temperature_c: number;
  humidity_percent: number;
  gas_ppm?: number;
  solar_voltage?: number;
  battery_voltage?: number;
  battery_percent?: number;
  cooling_active: boolean;
  door_open: boolean;
}

export interface ProduceBatch {
  id: string;
  storage_unit_id: string;
  farmer_identifier?: string;
  produce_type: string;
  quantity_kg: number;
  harvested_at?: string;
  stored_at: string;
  expected_shelf_life_days?: number;
  status: 'STORED' | 'PARTIALLY_REMOVED' | 'DISCHARGED' | 'SPOILED';
  notes?: string;
  created_at: string;
}

export interface Alert {
  id: string;
  storage_unit_id: string;
  device_id?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  alert_type: string;
  title: string;
  message: string;
  is_resolved: boolean;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export interface EnergyRecord {
  id: string;
  storage_unit_id: string;
  timestamp: string;
  solar_power_w: number;
  solar_voltage_v?: number;
  solar_current_a?: number;
  battery_voltage_v?: number;
  battery_soc_percent?: number;
  cooling_power_w: number;
  auxiliary_power_w: number;
  grid_fallback_w: number;
}

export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  app_name: string;
  app_version: string;
  environment: string;
  timestamp: string;
  components: {
    api_server: { status: string; message: string };
    database: { status: string; message: string };
    firebase: { status: string; message: string };
    ai_services: {
      gemini: { status: string; message: string };
      local_ml: { status: string; message: string };
    };
  };
}

export interface APIEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface APIErrorEnvelope {
  error: {
    code: string;
    message: string;
    request_id?: string;
    details?: Record<string, unknown>;
  };
}
