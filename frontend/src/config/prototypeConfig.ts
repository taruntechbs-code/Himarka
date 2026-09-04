/**
 * HIMARKA Physical Prototype Configuration
 * 
 * Defines physical prototype parameters for the internal hackathon storage box.
 * Dimensions and capacities remain explicitly marked as CONFIGURABLE / PENDING CALIBRATION
 * until actual physical measurements from the prototype assembly are measured and entered.
 * 
 * Strict Guideline: Do NOT invent or fabricate physical dimensions.
 */

export interface PrototypeDimensionConfig {
  internalLengthMm: number | null;
  internalWidthMm: number | null;
  internalHeightMm: number | null;
  externalLengthMm: number | null;
  externalWidthMm: number | null;
  externalHeightMm: number | null;
  usableVolumeLiters: number | null;
  estimatedCapacityKg: number | null;
  calibrationStatus: 'PENDING_PHYSICAL_MEASUREMENT' | 'CALIBRATED';
  boxType: string;
  coolingSubsystem: string;
  notes: string;
}

export const PROTOTYPE_CONFIG: PrototypeDimensionConfig = {
  // Dimensions to be measured and populated once physical prototype assembly is measured
  internalLengthMm: null,
  internalWidthMm: null,
  internalHeightMm: null,
  externalLengthMm: null,
  externalWidthMm: null,
  externalHeightMm: null,
  usableVolumeLiters: null,
  estimatedCapacityKg: null,
  calibrationStatus: 'PENDING_PHYSICAL_MEASUREMENT',
  boxType: 'Compact Farm-Level Insulated Mini Storage Box',
  coolingSubsystem: 'Solar-Powered Thermoelectric / DC Refrigeration Loop',
  notes: 'Prototype dimensions and usable capacity to be calibrated from physical measurements. No unverified commercial capacity assumptions are made.',
};
