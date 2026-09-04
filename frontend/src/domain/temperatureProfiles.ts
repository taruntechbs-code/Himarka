/**
 * HIMARKA Vegetable Temperature Profiles & Preset Storage Modes
 * 
 * Centralized source of truth for crop-specific temperature profiles,
 * preset storage modes (Modes 1, 2, 3), and multi-crop compatibility checks.
 * 
 * Scientific Integrity Rules:
 * - Garlic is explicitly flagged as REQUIRES_VERIFICATION due to "0–C" typo in source.
 * - Single source of truth: UI components must never duplicate these values.
 */

export type StorageModeId = 'MODE_1' | 'MODE_2' | 'MODE_3';

export interface StorageMode {
  id: StorageModeId;
  name: string;
  nameKey: string;
  title: string;
  titleKey: string;
  minTemp: number;
  maxTemp: number;
  tempRangeLabel: string;
  description: string;
  descriptionKey: string;
  suitableCrops: string[];
}

export interface VegetableProfile {
  id: string;
  name: string;
  nameKey: string;
  aliases: string[];
  minTemperature: number | null;
  maxTemperature: number | null;
  temperatureRangeText: string;
  preferredMode: StorageModeId;
  chillingSensitivity: 'HIGH' | 'MODERATE' | 'LOW';
  requiresVerification?: boolean;
  verificationNote?: string;
}

export const STORAGE_MODES: Record<StorageModeId, StorageMode> = {
  MODE_1: {
    id: 'MODE_1',
    name: 'Mode 1',
    nameKey: 'modes.mode1.name',
    title: 'Near-freezing storage',
    titleKey: 'modes.mode1.title',
    minTemp: 0.0,
    maxTemp: 2.0,
    tempRangeLabel: '0–2°C',
    description: 'Cold-tolerant leafy greens and root vegetables preserving freshness without freezing damage.',
    descriptionKey: 'modes.mode1.desc',
    suitableCrops: [
      'cabbage',
      'cauliflower',
      'broccoli',
      'carrot',
      'beetroot',
      'radish',
      'green_peas',
      'spinach',
      'lettuce',
      'mustard_greens',
      'celery',
      'spring_onion',
      'onion_dry',
      'garlic',
    ],
  },
  MODE_2: {
    id: 'MODE_2',
    name: 'Mode 2',
    nameKey: 'modes.mode2.name',
    title: 'Cool storage',
    titleKey: 'modes.mode2.title',
    minTemp: 5.0,
    maxTemp: 7.0,
    tempRangeLabel: '5–7°C',
    description: 'Moderate cooling preventing premature sprouting and chilling injury in tubers and legumes.',
    descriptionKey: 'modes.mode2.desc',
    suitableCrops: ['potato', 'french_beans', 'green_chilli'],
  },
  MODE_3: {
    id: 'MODE_3',
    name: 'Mode 3',
    nameKey: 'modes.mode3.name',
    title: 'Chilling-sensitive produce',
    titleKey: 'modes.mode3.title',
    minTemp: 10.0,
    maxTemp: 13.0,
    tempRangeLabel: '10–13°C',
    description: 'Mild cooling preventing surface pitting, discoloration, and loss of flavor in tropical & subtropical crops.',
    descriptionKey: 'modes.mode3.desc',
    suitableCrops: [
      'tomato',
      'brinjal',
      'cucumber',
      'okra',
      'capsicum',
      'ginger',
      'turmeric',
    ],
  },
};

export const VEGETABLE_PROFILES: Record<string, VegetableProfile> = {
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    nameKey: 'crops.tomato',
    aliases: ['tamatar', 'bilahi', 'kamakhya'],
    minTemperature: 13.0,
    maxTemperature: 15.0,
    temperatureRangeText: '13–15°C',
    preferredMode: 'MODE_3',
    chillingSensitivity: 'HIGH',
  },
  cabbage: {
    id: 'cabbage',
    name: 'Cabbage',
    nameKey: 'crops.cabbage',
    aliases: ['bandhakobi', 'patagobhi', 'bandha'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  cauliflower: {
    id: 'cauliflower',
    name: 'Cauliflower',
    nameKey: 'crops.cauliflower',
    aliases: ['phulkobi', 'phulgobhi'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  broccoli: {
    id: 'broccoli',
    name: 'Broccoli',
    nameKey: 'crops.broccoli',
    aliases: ['green cauliflower'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  carrot: {
    id: 'carrot',
    name: 'Carrot',
    nameKey: 'crops.carrot',
    aliases: ['gajar'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  radish: {
    id: 'radish',
    name: 'Radish',
    nameKey: 'crops.radish',
    aliases: ['mula', 'mooli'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  beetroot: {
    id: 'beetroot',
    name: 'Beetroot',
    nameKey: 'crops.beetroot',
    aliases: ['chukandar', 'beet'],
    minTemperature: 0.0,
    maxTemperature: 0.0,
    temperatureRangeText: '0°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  green_peas: {
    id: 'green_peas',
    name: 'Green Peas',
    nameKey: 'crops.green_peas',
    aliases: ['matar', 'motor'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  french_beans: {
    id: 'french_beans',
    name: 'French Beans',
    nameKey: 'crops.french_beans',
    aliases: ['beans', 'french bean'],
    minTemperature: 4.0,
    maxTemperature: 7.0,
    temperatureRangeText: '4–7°C',
    preferredMode: 'MODE_2',
    chillingSensitivity: 'MODERATE',
  },
  capsicum: {
    id: 'capsicum',
    name: 'Capsicum / Bell Pepper',
    nameKey: 'crops.capsicum',
    aliases: ['shimla mirch', 'bell pepper'],
    minTemperature: 7.0,
    maxTemperature: 10.0,
    temperatureRangeText: '7–10°C',
    preferredMode: 'MODE_3',
    chillingSensitivity: 'HIGH',
  },
  green_chilli: {
    id: 'green_chilli',
    name: 'Green Chilli',
    nameKey: 'crops.green_chilli',
    aliases: ['hari mirch', 'jolokia'],
    minTemperature: 0.0,
    maxTemperature: 5.0,
    temperatureRangeText: '0–5°C',
    preferredMode: 'MODE_2',
    chillingSensitivity: 'MODERATE',
  },
  brinjal: {
    id: 'brinjal',
    name: 'Brinjal / Eggplant',
    nameKey: 'crops.brinjal',
    aliases: ['baingan', 'bengena', 'aubergine'],
    minTemperature: 10.0,
    maxTemperature: 12.0,
    temperatureRangeText: '10–12°C',
    preferredMode: 'MODE_3',
    chillingSensitivity: 'HIGH',
  },
  okra: {
    id: 'okra',
    name: 'Okra',
    nameKey: 'crops.okra',
    aliases: ['bhindi', 'ladyfinger'],
    minTemperature: 7.0,
    maxTemperature: 10.0,
    temperatureRangeText: '7–10°C',
    preferredMode: 'MODE_3',
    chillingSensitivity: 'HIGH',
  },
  cucumber: {
    id: 'cucumber',
    name: 'Cucumber',
    nameKey: 'crops.cucumber',
    aliases: ['kheera', 'tiyoh'],
    minTemperature: 10.0,
    maxTemperature: 13.0,
    temperatureRangeText: '10–13°C',
    preferredMode: 'MODE_3',
    chillingSensitivity: 'HIGH',
  },
  spinach: {
    id: 'spinach',
    name: 'Spinach',
    nameKey: 'crops.spinach',
    aliases: ['palak', 'paleng'],
    minTemperature: 0.0,
    maxTemperature: 0.0,
    temperatureRangeText: '0°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  lettuce: {
    id: 'lettuce',
    name: 'Lettuce',
    nameKey: 'crops.lettuce',
    aliases: ['salad patta'],
    minTemperature: 0.0,
    maxTemperature: 0.0,
    temperatureRangeText: '0°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  mustard_greens: {
    id: 'mustard_greens',
    name: 'Mustard Greens',
    nameKey: 'crops.mustard_greens',
    aliases: ['sarson saag', 'lai xaak'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  celery: {
    id: 'celery',
    name: 'Celery',
    nameKey: 'crops.celery',
    aliases: ['ajwain patta'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  spring_onion: {
    id: 'spring_onion',
    name: 'Spring Onion',
    nameKey: 'crops.spring_onion',
    aliases: ['green onion', 'pyaz patta'],
    minTemperature: 0.0,
    maxTemperature: 1.0,
    temperatureRangeText: '0–1°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  onion_dry: {
    id: 'onion_dry',
    name: 'Onion (dry)',
    nameKey: 'crops.onion_dry',
    aliases: ['pyaz', 'piyaj'],
    minTemperature: 0.0,
    maxTemperature: 2.0,
    temperatureRangeText: '0–2°C',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
  },
  garlic: {
    id: 'garlic',
    name: 'Garlic',
    nameKey: 'crops.garlic',
    aliases: ['lahsun', 'nohor'],
    minTemperature: null, // Explicitly null due to source typo "0–C"
    maxTemperature: null,
    temperatureRangeText: 'Requires Verification (Source Typo "0–C")',
    preferredMode: 'MODE_1',
    chillingSensitivity: 'LOW',
    requiresVerification: true,
    verificationNote: 'Source reference contains malformed value "0–C". Awaiting verified temperature before active control.',
  },
  potato: {
    id: 'potato',
    name: 'Potato',
    nameKey: 'crops.potato',
    aliases: ['aaloo', 'alu'],
    minTemperature: 4.0,
    maxTemperature: 7.0,
    temperatureRangeText: '4–7°C',
    preferredMode: 'MODE_2',
    chillingSensitivity: 'MODERATE',
  },
  ginger: {
    id: 'ginger',
    name: 'Ginger',
    nameKey: 'crops.ginger',
    aliases: ['adrak', 'ada'],
    minTemperature: 13.0,
    maxTemperature: 15.0,
    temperatureRangeText: '13–15°C',
    preferredMode: 'MODE_3',
    chillingSensitivity: 'HIGH',
  },
  turmeric: {
    id: 'turmeric',
    name: 'Turmeric',
    nameKey: 'crops.turmeric',
    aliases: ['haldi', 'halodhi'],
    minTemperature: 13.0,
    maxTemperature: 15.0,
    temperatureRangeText: '13–15°C',
    preferredMode: 'MODE_3',
    chillingSensitivity: 'HIGH',
  },
};

/**
 * Lookup a vegetable profile by ID or alias
 */
export function getVegetableProfile(cropIdOrAlias: string): VegetableProfile | undefined {
  if (!cropIdOrAlias) return undefined;
  const normalized = cropIdOrAlias.toLowerCase().trim().replace(/[\s-]+/g, '_');
  
  if (VEGETABLE_PROFILES[normalized]) {
    return VEGETABLE_PROFILES[normalized];
  }

  // Search by alias
  const aliasMatch = Object.values(VEGETABLE_PROFILES).find((v) =>
    v.aliases.some((a) => a.toLowerCase() === cropIdOrAlias.toLowerCase().trim()) ||
    v.name.toLowerCase() === cropIdOrAlias.toLowerCase().trim()
  );

  return aliasMatch;
}

/**
 * Get the preset storage mode for a vegetable
 */
export function getModeForVegetable(cropId: string): StorageMode | undefined {
  const profile = getVegetableProfile(cropId);
  if (!profile) return undefined;
  return STORAGE_MODES[profile.preferredMode];
}

/**
 * Get all vegetables belonging to a preset mode
 */
export function getVegetablesForMode(modeId: StorageModeId): VegetableProfile[] {
  return Object.values(VEGETABLE_PROFILES).filter((v) => v.preferredMode === modeId);
}

/**
 * Get recommended temperature range and metadata for a crop
 */
export function getRecommendedTemperature(cropId: string) {
  const profile = getVegetableProfile(cropId);
  if (!profile) {
    return {
      min: null,
      max: null,
      text: 'Unknown Crop — Select Manually',
      requiresVerification: false,
    };
  }

  return {
    min: profile.minTemperature,
    max: profile.maxTemperature,
    text: profile.temperatureRangeText,
    requiresVerification: Boolean(profile.requiresVerification),
    verificationNote: profile.verificationNote,
  };
}

/**
 * Validate whether a vegetable is compatible with a given storage mode
 */
export function validateVegetableMode(cropId: string, modeId: StorageModeId): {
  isCompatible: boolean;
  recommendedModeId: StorageModeId;
  warning?: string;
} {
  const profile = getVegetableProfile(cropId);
  if (!profile) {
    return {
      isCompatible: false,
      recommendedModeId: 'MODE_1',
      warning: 'Unrecognized vegetable crop. Please select manually.',
    };
  }

  const isCompatible = profile.preferredMode === modeId;
  return {
    isCompatible,
    recommendedModeId: profile.preferredMode,
    warning: isCompatible
      ? undefined
      : `${profile.name} prefers ${STORAGE_MODES[profile.preferredMode].name} (${STORAGE_MODES[profile.preferredMode].tempRangeLabel}) to avoid quality degradation.`,
  };
}

/**
 * Check if a list of crops can share the same preset storage mode
 */
export function areCropsCompatible(cropIds: string[]): {
  compatible: boolean;
  sharedModeId?: StorageModeId;
  conflictingModes?: { cropId: string; cropName: string; modeId: StorageModeId }[];
  warning?: string;
} {
  if (!cropIds || cropIds.length <= 1) {
    const singleProfile = cropIds[0] ? getVegetableProfile(cropIds[0]) : undefined;
    return {
      compatible: true,
      sharedModeId: singleProfile ? singleProfile.preferredMode : undefined,
    };
  }

  const modeAssignments = cropIds.map((id) => {
    const profile = getVegetableProfile(id);
    return {
      cropId: id,
      cropName: profile ? profile.name : id,
      modeId: profile ? profile.preferredMode : ('MODE_1' as StorageModeId),
    };
  });

  const uniqueModes = Array.from(new Set(modeAssignments.map((m) => m.modeId)));

  if (uniqueModes.length === 1) {
    return {
      compatible: true,
      sharedModeId: uniqueModes[0],
    };
  }

  const conflictsSummary = modeAssignments
    .map((m) => `${m.cropName} (${STORAGE_MODES[m.modeId].name}: ${STORAGE_MODES[m.modeId].tempRangeLabel})`)
    .join(', ');

  return {
    compatible: false,
    conflictingModes: modeAssignments,
    warning: `Multiple crops detected with incompatible storage requirements: ${conflictsSummary}. Mixing them in the same chamber preset is not recommended.`,
  };
}

/**
 * Calculate temperature compliance status relative to target range
 */
export function getTemperatureStatus(
  currentTemp: number,
  targetMin: number,
  targetMax: number,
  hysteresis = 0.3
): 'TOO_COLD' | 'WITHIN_TARGET' | 'TOO_WARM' {
  if (currentTemp < targetMin - hysteresis) {
    return 'TOO_COLD';
  }
  if (currentTemp > targetMax + hysteresis) {
    return 'TOO_WARM';
  }
  return 'WITHIN_TARGET';
}
