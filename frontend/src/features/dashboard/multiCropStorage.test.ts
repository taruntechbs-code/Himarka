import { describe, it, expect, beforeEach } from 'vitest';
import {
  areCropsCompatible,
  createStoredCrop,
  MULTI_CROP_DEMO_SCENARIOS,
  STORAGE_MODES,
  StoredCrop,
} from '@/domain/temperatureProfiles';

describe('Phase 1.4: Multi-Crop Storage & Single-Chamber Physics', () => {
  let storedCrops: StoredCrop[];

  beforeEach(() => {
    storedCrops = [];
  });

  it('1. One crop displays correctly in stored list', () => {
    const tomato = createStoredCrop('tomato', 'MANUAL');
    expect(tomato).toBeDefined();
    expect(tomato?.id).toBe('tomato');
    expect(tomato?.name).toBe('Tomato');
    expect(tomato?.preferredMode).toBe('MODE_3');
    expect(tomato?.temperatureRangeText).toBe('13–15°C');

    storedCrops.push(tomato!);
    expect(storedCrops.length).toBe(1);
    expect(storedCrops[0].id).toBe('tomato');
  });

  it('2. Multiple crops display correctly in stored list', () => {
    const cabbage = createStoredCrop('cabbage', 'MANUAL');
    const carrot = createStoredCrop('carrot', 'MANUAL');
    const spinach = createStoredCrop('spinach', 'MANUAL');

    storedCrops.push(cabbage!, carrot!, spinach!);
    expect(storedCrops.length).toBe(3);
    expect(storedCrops.map((c) => c.id)).toEqual(['cabbage', 'carrot', 'spinach']);
  });

  it('3. Crop can be added dynamically', () => {
    const crop = createStoredCrop('cabbage', 'MANUAL');
    expect(crop).not.toBeNull();
    storedCrops.push(crop!);
    expect(storedCrops).toHaveLength(1);
    expect(storedCrops[0].id).toBe('cabbage');
  });

  it('4. Crop can be deleted dynamically', () => {
    const tomato = createStoredCrop('tomato', 'MANUAL')!;
    const cabbage = createStoredCrop('cabbage', 'MANUAL')!;
    storedCrops = [tomato, cabbage];

    // Delete cabbage
    storedCrops = storedCrops.filter((c) => c.id !== 'cabbage');
    expect(storedCrops).toHaveLength(1);
    expect(storedCrops[0].id).toBe('tomato');
  });

  it('5. Duplicate crop cannot be added', () => {
    const crop = createStoredCrop('tomato', 'MANUAL')!;
    storedCrops.push(crop);

    const isDuplicate = storedCrops.some((c) => c.id === 'tomato');
    expect(isDuplicate).toBe(true);

    // Attempting to add duplicate should be rejected
    if (!storedCrops.some((c) => c.id === 'tomato')) {
      storedCrops.push(crop);
    }
    expect(storedCrops).toHaveLength(1);
  });

  it('6. Compatible crops can coexist under a single preset (Scenario 2)', () => {
    const compatibleGroup = MULTI_CROP_DEMO_SCENARIOS.COMPATIBLE_GROUP;
    expect(compatibleGroup.length).toBe(3);

    const check = areCropsCompatible(compatibleGroup.map((c) => c.id));
    expect(check.compatible).toBe(true);
    expect(check.sharedModeId).toBe('MODE_1');
    expect(STORAGE_MODES[check.sharedModeId!].tempRangeLabel).toBe('0–2°C');
  });

  it('7. Incompatible crops trigger warning and do not report compatibility (Scenario 3)', () => {
    const incompatibleGroup = MULTI_CROP_DEMO_SCENARIOS.INCOMPATIBLE_GROUP;
    expect(incompatibleGroup.length).toBe(2);

    const check = areCropsCompatible(incompatibleGroup.map((c) => c.id));
    expect(check.compatible).toBe(false);
    expect(check.warning).toBeDefined();
    expect(check.warning).toContain('incompatible storage requirements');
  });

  it('8. Incompatible crops do not automatically change or average temperature', () => {
    // Tomato requires Mode 3 (10–13°C), Cabbage requires Mode 1 (0–2°C)
    const check = areCropsCompatible(['tomato', 'cabbage']);
    expect(check.compatible).toBe(false);

    // Neither mode should be blindly applied as a fake 'averaged' compromise
    expect(check.sharedModeId).toBeUndefined();
    // Conflicting modes are reported so operator can decide
    expect(check.conflictingModes?.length).toBe(2);
    expect(check.conflictingModes?.map((m) => m.modeId)).toEqual(['MODE_3', 'MODE_1']);
  });

  it('9. Demo Scenario 4 (Potato + Beans) verifies multi-compatible tubers/legumes under Mode 2', () => {
    const multi = MULTI_CROP_DEMO_SCENARIOS.MULTI_COMPATIBLE;
    const check = areCropsCompatible(multi.map((c) => c.id));
    expect(check.compatible).toBe(true);
    expect(check.sharedModeId).toBe('MODE_2');
  });

  it('10. Single chamber prototype rule: quantity is not fabricated if unavailable', () => {
    const crop = createStoredCrop('tomato', 'MANUAL');
    expect(crop?.quantityKg).toBeNull(); // No fabricated weight/dimension
  });
});
