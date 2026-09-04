import { describe, it, expect } from 'vitest';
import {
  getVegetableProfile,
  getModeForVegetable,
  areCropsCompatible,
  validateVegetableMode,
  getTemperatureStatus,
  getRecommendedTemperature,
} from './temperatureProfiles';

describe('HIMARKA Vegetable Temperature Profiles & Modes (Section 44 Requirements)', () => {
  // 1. Tomato → Mode 3
  it('maps Tomato to Mode 3 (10–13°C preset, 13–15°C vegetable range)', () => {
    const profile = getVegetableProfile('tomato');
    expect(profile).toBeDefined();
    expect(profile?.preferredMode).toBe('MODE_3');
    expect(profile?.minTemperature).toBe(13.0);
    expect(profile?.maxTemperature).toBe(15.0);

    const mode = getModeForVegetable('tomato');
    expect(mode?.id).toBe('MODE_3');
    expect(mode?.minTemp).toBe(10.0);
    expect(mode?.maxTemp).toBe(13.0);
  });

  // 2. Cabbage → Mode 1
  it('maps Cabbage to Mode 1 (0–2°C preset, 0–1°C vegetable range)', () => {
    const profile = getVegetableProfile('cabbage');
    expect(profile).toBeDefined();
    expect(profile?.preferredMode).toBe('MODE_1');
    expect(profile?.minTemperature).toBe(0.0);
    expect(profile?.maxTemperature).toBe(1.0);

    const mode = getModeForVegetable('cabbage');
    expect(mode?.id).toBe('MODE_1');
    expect(mode?.minTemp).toBe(0.0);
    expect(mode?.maxTemp).toBe(2.0);
  });

  // 3. Potato → Mode 2
  it('maps Potato to Mode 2 (5–7°C preset, 4–7°C vegetable range)', () => {
    const profile = getVegetableProfile('potato');
    expect(profile).toBeDefined();
    expect(profile?.preferredMode).toBe('MODE_2');
    expect(profile?.minTemperature).toBe(4.0);
    expect(profile?.maxTemperature).toBe(7.0);

    const mode = getModeForVegetable('potato');
    expect(mode?.id).toBe('MODE_2');
    expect(mode?.minTemp).toBe(5.0);
    expect(mode?.maxTemp).toBe(7.0);
  });

  // 4. Green Chilli → Mode 2
  it('maps Green Chilli to Mode 2 (5–7°C preset, 0–5°C vegetable range)', () => {
    const profile = getVegetableProfile('green_chilli');
    expect(profile).toBeDefined();
    expect(profile?.preferredMode).toBe('MODE_2');

    const mode = getModeForVegetable('green_chilli');
    expect(mode?.id).toBe('MODE_2');
  });

  // 5. Ginger → Mode 3
  it('maps Ginger to Mode 3 (10–13°C preset, 13–15°C vegetable range)', () => {
    const profile = getVegetableProfile('ginger');
    expect(profile).toBeDefined();
    expect(profile?.preferredMode).toBe('MODE_3');
    expect(profile?.minTemperature).toBe(13.0);
    expect(profile?.maxTemperature).toBe(15.0);

    const mode = getModeForVegetable('ginger');
    expect(mode?.id).toBe('MODE_3');
  });

  // 6. Spinach → Mode 1
  it('maps Spinach to Mode 1 (0–2°C preset, 0°C vegetable range)', () => {
    const profile = getVegetableProfile('spinach');
    expect(profile).toBeDefined();
    expect(profile?.preferredMode).toBe('MODE_1');
    expect(profile?.minTemperature).toBe(0.0);
    expect(profile?.maxTemperature).toBe(0.0);

    const mode = getModeForVegetable('spinach');
    expect(mode?.id).toBe('MODE_1');
  });

  // 7. Capsicum → Mode 3
  it('maps Capsicum to Mode 3 (10–13°C preset, 7–10°C vegetable range)', () => {
    const profile = getVegetableProfile('capsicum');
    expect(profile).toBeDefined();
    expect(profile?.preferredMode).toBe('MODE_3');

    const mode = getModeForVegetable('capsicum');
    expect(mode?.id).toBe('MODE_3');
  });

  // 8. Mixed Tomato + Cabbage → incompatible warning
  it('flags mixed Tomato (Mode 3) + Cabbage (Mode 1) as incompatible with clear warning', () => {
    const compatibility = areCropsCompatible(['tomato', 'cabbage']);
    expect(compatibility.compatible).toBe(false);
    expect(compatibility.warning).toContain('incompatible storage requirements');
    expect(compatibility.conflictingModes).toHaveLength(2);

    const validation = validateVegetableMode('tomato', 'MODE_1');
    expect(validation.isCompatible).toBe(false);
    expect(validation.recommendedModeId).toBe('MODE_3');
  });

  // 9. Unknown vegetable → manual selection required
  it('handles unknown vegetables safely with manual selection fallback', () => {
    const profile = getVegetableProfile('unknown_fruit');
    expect(profile).toBeUndefined();

    const recommendation = getRecommendedTemperature('unknown_fruit');
    expect(recommendation.min).toBeNull();
    expect(recommendation.text).toContain('Unknown Crop — Select Manually');
  });

  // 10. Garlic → marked as requiring verified source temperature
  it('marks Garlic as requiring verified source temperature due to "0–C" typo', () => {
    const profile = getVegetableProfile('garlic');
    expect(profile).toBeDefined();
    expect(profile?.requiresVerification).toBe(true);
    expect(profile?.verificationNote).toContain('0–C');
    expect(profile?.minTemperature).toBeNull();

    const rec = getRecommendedTemperature('garlic');
    expect(rec.requiresVerification).toBe(true);
  });

  // 11. Temperature status: below target, within target, above target
  it('calculates temperature status accurately with hysteresis', () => {
    // Target: 10.0 to 13.0°C (Mode 3)
    expect(getTemperatureStatus(8.5, 10.0, 13.0)).toBe('TOO_COLD');
    expect(getTemperatureStatus(11.2, 10.0, 13.0)).toBe('WITHIN_TARGET');
    expect(getTemperatureStatus(12.8, 10.0, 13.0)).toBe('WITHIN_TARGET');
    expect(getTemperatureStatus(14.5, 10.0, 13.0)).toBe('TOO_WARM');
  });
});
