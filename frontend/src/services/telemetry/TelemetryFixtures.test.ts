import { describe, it, expect } from 'vitest';
import {
  DEMO_CURRENT_TELEMETRY,
  DEMO_CURRENT_ENERGY,
  DEMO_STORAGE_UNIT,
  generateDemoHistory,
} from './demoFixtures';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/i18n';

describe('HIMARKA Telemetry Fixtures & Architecture', () => {
  it('supplies realistic demo temperature and humidity within safe preservation range', () => {
    expect(DEMO_CURRENT_TELEMETRY.temperature_c).toBe(2.6);
    expect(DEMO_CURRENT_TELEMETRY.humidity_percent).toBe(89.0);
    expect(DEMO_CURRENT_TELEMETRY.cooling_active).toBe(true);
    expect(DEMO_CURRENT_TELEMETRY.gas_ppm).toBe(209);
  });

  it('supplies realistic solar energy parameters without fabricated claims', () => {
    expect(DEMO_CURRENT_ENERGY.solar_power_w).toBe(50.0);
    expect(DEMO_CURRENT_ENERGY.battery_soc_percent).toBe(94.0);
    expect(DEMO_CURRENT_ENERGY.grid_fallback_w).toBe(0.0);
  });

  it('generates 24-hour continuous history matching solar daylight curves', () => {
    const history = generateDemoHistory();
    expect(history.length).toBe(25);
    // Values must be within plausible physical bounds
    history.forEach((point) => {
      expect(point.temperature_c).toBeGreaterThanOrEqual(1.0);
      expect(point.temperature_c).toBeLessThanOrEqual(4.5);
      expect(point.humidity_percent).toBeGreaterThanOrEqual(80);
      expect(point.humidity_percent).toBeLessThanOrEqual(98);
      expect(point.solar_power_w).toBeGreaterThanOrEqual(0);
    });
  });

  it('supports all 9 North Eastern & National languages as required', () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(9);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('as');
    expect(codes).toContain('bn');
    expect(codes).toContain('hi');
    expect(codes).toContain('ne');
    expect(codes).toContain('mni');
    expect(codes).toContain('brx');
    expect(codes).toContain('lus');
    expect(codes).toContain('kha');
  });

  it('defines prototype storage unit targets properly', () => {
    expect(DEMO_STORAGE_UNIT.name).toBe('HIMARKA Prototype Storage Box');
    expect(DEMO_STORAGE_UNIT.is_prototype).toBe(true);
    expect(DEMO_STORAGE_UNIT.capacity_kg).toBeNull();
    expect(DEMO_STORAGE_UNIT.target_temp_min).toBe(10.0);
    expect(DEMO_STORAGE_UNIT.target_temp_max).toBe(13.0);
    expect(DEMO_STORAGE_UNIT.target_humidity_min).toBe(85.0);
    expect(DEMO_STORAGE_UNIT.target_humidity_max).toBe(95.0);
  });
});
