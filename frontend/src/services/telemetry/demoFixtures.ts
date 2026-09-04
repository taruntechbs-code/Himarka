/**
 * DEMO TELEMETRY FIXTURES
 * Realistic simulated data for Phase 1 visual demonstration.
 * Clearly identified as SIMULATED / DEMO DATA to maintain scientific integrity.
 */

import { TelemetryRecord, EnergyRecord, StorageUnit, Device, Alert, ProduceBatch } from '@/types/domain';

export const DEMO_STORAGE_UNIT: StorageUnit = {
  id: 'himarka-proto-01',
  name: 'HIMARKA Prototype Storage Box',
  location_village: 'Mawphlang',
  location_state: 'Meghalaya',
  capacity_kg: null, // Configurable: to be calibrated on physical prototype
  is_prototype: true,
  target_temp_min: 10.0,
  target_temp_max: 13.0,
  target_humidity_min: 85.0,
  target_humidity_max: 95.0,
  is_active: true,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_DEVICE: Device = {
  id: 'dev-esp32-01',
  device_id: 'ESP32-HIMARKA-01',
  storage_unit_id: 'himarka-unit-01',
  hardware_type: 'ESP32-WROOM-32D + SHT31 + MQ-135',
  firmware_version: 'v1.0.4',
  status: 'ONLINE',
  last_seen_at: new Date().toISOString(),
  ip_address: '192.168.4.1',
  is_active: true,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const DEMO_CURRENT_TELEMETRY: TelemetryRecord = {
  id: 'telem-sim-latest',
  device_id: 'ESP32-HIMARKA-01',
  storage_unit_id: 'himarka-unit-01',
  timestamp: new Date().toISOString(),
  received_at: new Date().toISOString(),
  temperature_c: 2.6,
  humidity_percent: 89.0,
  gas_ppm: 209,
  solar_voltage: 19.4,
  battery_voltage: 26.8,
  battery_percent: 94.0,
  cooling_active: true,
  door_open: false,
};

export const DEMO_CURRENT_ENERGY: EnergyRecord = {
  id: 'energy-sim-latest',
  storage_unit_id: 'himarka-unit-01',
  timestamp: new Date().toISOString(),
  solar_power_w: 50.0,
  solar_voltage_v: 19.4,
  solar_current_a: 2.58,
  battery_voltage_v: 26.8,
  battery_soc_percent: 94.0,
  cooling_power_w: 38.5,
  auxiliary_power_w: 4.2,
  grid_fallback_w: 0.0,
};

// 24-hour realistic history sampled every hour
export const generateDemoHistory = (): Array<{
  timestamp: string;
  timeLabel: string;
  temperature_c: number;
  humidity_percent: number;
  gas_ppm: number;
  solar_power_w: number;
  battery_percent: number;
}> => {
  const points = [];
  const now = Date.now();
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now - i * 3600000);
    const hour = time.getHours();
    
    // Solar pattern: peak around 12:00 PM, zero at night
    const isDaylight = hour >= 6 && hour <= 18;
    const solarFactor = isDaylight ? Math.sin(((hour - 6) / 12) * Math.PI) : 0;
    const solar_power_w = Math.round(solarFactor * 65 + (Math.sin(i) * 3));

    // Temperature stays safely around 2.2°C to 3.1°C
    const tempOffset = Math.sin(i * 0.5) * 0.4;
    const temperature_c = Number((2.6 + tempOffset).toFixed(1));

    // Humidity stays around 87% to 92%
    const humidity_percent = Math.round(89 + Math.cos(i * 0.4) * 2.5);

    // Gas ppm (MQ-135 raw baseline air quality)
    const gas_ppm = Math.round(205 + Math.sin(i * 0.3) * 12);

    // Battery drains slightly at night, charges in daylight
    const battery_percent = Math.min(100, Math.max(82, Math.round(92 + (solarFactor * 8) - (isDaylight ? 0 : (24 - hour) * 0.5))));

    points.push({
      timestamp: time.toISOString(),
      timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature_c,
      humidity_percent,
      gas_ppm,
      solar_power_w: Math.max(0, solar_power_w),
      battery_percent,
    });
  }

  return points;
};

export const DEMO_PRODUCE_BATCHES: ProduceBatch[] = [
  {
    id: 'batch-01',
    storage_unit_id: 'himarka-proto-01',
    farmer_identifier: 'Farmer Community Cluster #3',
    produce_type: 'Tomato (Bilahi)',
    quantity_kg: 4.5,
    harvested_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    stored_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    expected_shelf_life_days: 14,
    status: 'STORED',
    notes: 'Preserved at 12.4°C (Mode 3: 10–13°C). Clean surface condition.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'batch-02',
    storage_unit_id: 'himarka-proto-01',
    farmer_identifier: 'Farmer Community Cluster #1',
    produce_type: 'Ginger (Ada)',
    quantity_kg: 2.5,
    harvested_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    stored_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    expected_shelf_life_days: 28,
    status: 'STORED',
    notes: 'Chilling-sensitive produce stored in Mode 3 range.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'batch-03',
    storage_unit_id: 'himarka-proto-01',
    farmer_identifier: 'Farmer Self-Help Group (SHG)',
    produce_type: 'Capsicum / Bell Pepper',
    quantity_kg: 3.0,
    harvested_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    stored_at: new Date().toISOString(),
    expected_shelf_life_days: 21,
    status: 'STORED',
    notes: 'Fresh harvest compatible with Mode 3 chilling-sensitive preset.',
    created_at: new Date().toISOString(),
  },
];

export const DEMO_ALERTS: Alert[] = [
  {
    id: 'alert-01',
    storage_unit_id: 'himarka-unit-01',
    device_id: 'ESP32-HIMARKA-01',
    severity: 'INFO',
    alert_type: 'PRESERVATION_STATUS_OPTIMAL',
    title: 'Storage Conditions Optimal',
    message: 'Chamber temperature stable at 2.6°C and humidity at 89%. Solar battery buffer at 94%.',
    is_resolved: false,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'alert-02',
    storage_unit_id: 'himarka-unit-01',
    device_id: 'ESP32-HIMARKA-01',
    severity: 'WARNING',
    alert_type: 'DOOR_ACCESS_NOTICE',
    title: 'Loading Access Verified',
    message: 'Chamber door opened for produce inspection (1 min 15s). Closed securely; temperature normalized within 4 minutes.',
    is_resolved: true,
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    resolved_at: new Date(Date.now() - 176 * 60000).toISOString(),
  },
];
