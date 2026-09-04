import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import {
  TelemetryRecord,
  EnergyRecord,
  StorageUnit,
  Device,
  Alert,
  ProduceBatch,
} from '@/types/domain';
import {
  DEMO_CURRENT_TELEMETRY,
  DEMO_CURRENT_ENERGY,
  DEMO_STORAGE_UNIT,
  DEMO_DEVICE,
  DEMO_PRODUCE_BATCHES,
  DEMO_ALERTS,
  generateDemoHistory,
} from './demoFixtures';
import {
  StorageModeId,
  getVegetableProfile,
  getModeForVegetable,
  areCropsCompatible,
} from '@/domain/temperatureProfiles';

export type TelemetryMode = 'DEMO' | 'REAL';

export type DetectionStatus =
  | 'IDLE'
  | 'SCANNING'
  | 'DETECTED'
  | 'LOW_CONFIDENCE'
  | 'MULTIPLE_DETECTED'
  | 'UNAVAILABLE';

export type DemoDetectionScenario =
  | 'TOMATO_HIGH'
  | 'CABBAGE_HIGH'
  | 'TOMATO_LOW'
  | 'MIXED_INCOMPATIBLE'
  | 'UNAVAILABLE'
  | 'RESET';

export interface DetectionState {
  status: DetectionStatus;
  detectedCrops: string[];
  confidences: Record<string, number>;
  source: 'DEMO' | 'REAL';
  isCompatible: boolean;
  recommendedMode?: StorageModeId;
  targetRangeText?: string;
  warning?: string;
}

export interface TelemetryHistoryPoint {
  timestamp: string;
  timeLabel: string;
  temperature_c: number;
  humidity_percent: number;
  gas_ppm: number;
  solar_power_w: number;
  battery_percent: number;
}

interface TelemetryContextValue {
  mode: TelemetryMode;
  setMode: (mode: TelemetryMode) => void;
  telemetry: TelemetryRecord;
  energy: EnergyRecord;
  storageUnit: StorageUnit;
  device: Device;
  history: TelemetryHistoryPoint[];
  produceBatches: ProduceBatch[];
  alerts: Alert[];
  isLoading: boolean;
  isBackendConnected: boolean;
  backendError?: string;
  lastUpdated: string;
  refreshData: () => void;

  // HIMARKA Phase 1.3: Vegetable-Specific Mode & Prototype Alignment
  activeCrop: string;
  activeMode: StorageModeId;
  isModeAdjusting: boolean;
  modeAdjustmentMessage?: string;
  setActiveCropAndMode: (cropId: string, modeId?: StorageModeId) => void;
  setActiveModeOnly: (modeId: StorageModeId) => void;

  // Automatic Detection Pipeline
  detectionState: DetectionState;
  simulateDemoDetection: (scenario: DemoDetectionScenario) => void;
  confirmDetection: () => void;
  resetDetection: () => void;
}

const TelemetryContext = createContext<TelemetryContextValue | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default to DEMO mode for reliable prototype/presentation, but enable seamless REAL mode toggle
  const [mode, setMode] = useState<TelemetryMode>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('himarka_telemetry_mode');
      return (saved === 'REAL' ? 'REAL' : 'DEMO') as TelemetryMode;
    }
    return 'DEMO';
  });

  // HIMARKA Phase 1.3: Vegetable-specific temperature storage mode
  const [activeCrop, setActiveCrop] = useState<string>(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('himarka_active_crop') || 'tomato';
    }
    return 'tomato';
  });

  const [activeMode, setActiveMode] = useState<StorageModeId>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('himarka_active_mode');
      if (saved === 'MODE_1' || saved === 'MODE_2' || saved === 'MODE_3') {
        return saved;
      }
    }
    return 'MODE_3';
  });

  const [isModeAdjusting, setIsModeAdjusting] = useState<boolean>(false);
  const [modeAdjustmentMessage, setModeAdjustmentMessage] = useState<string | undefined>(undefined);

  // Automatic Detection Pipeline State
  const [detectionState, setDetectionState] = useState<DetectionState>({
    status: 'IDLE',
    detectedCrops: [],
    confidences: {},
    source: 'DEMO',
    isCompatible: true,
  });

  const handleSetMode = (newMode: TelemetryMode) => {
    setMode(newMode);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('himarka_telemetry_mode', newMode);
    }
  };

  const setActiveCropAndMode = (cropId: string, modeId?: StorageModeId) => {
    const targetMode: StorageModeId = modeId || getModeForVegetable(cropId)?.id || 'MODE_3';
    setActiveCrop(cropId);
    setActiveMode(targetMode);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('himarka_active_crop', cropId);
      localStorage.setItem('himarka_active_mode', targetMode);
    }

    // Indicate cooling system intent adjustment without claiming instant physical temperature shift
    setIsModeAdjusting(true);
    setModeAdjustmentMessage('Mode change requested. Cooling system will adjust toward the selected range.');
    setTimeout(() => {
      setIsModeAdjusting(false);
      setModeAdjustmentMessage(undefined);
    }, 4500);
  };

  const setActiveModeOnly = (modeId: StorageModeId) => {
    setActiveMode(modeId);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('himarka_active_mode', modeId);
    }
    setIsModeAdjusting(true);
    setModeAdjustmentMessage('Mode change requested. Cooling system will adjust toward the selected range.');
    setTimeout(() => {
      setIsModeAdjusting(false);
      setModeAdjustmentMessage(undefined);
    }, 4500);
  };

  // Detection simulator strictly labeled as DEMO per Section 13, 28, 29
  const simulateDemoDetection = (scenario: DemoDetectionScenario) => {
    switch (scenario) {
      case 'TOMATO_HIGH': {
        const profile = getVegetableProfile('tomato');
        setDetectionState({
          status: 'DETECTED',
          detectedCrops: ['tomato'],
          confidences: { tomato: 0.92 },
          source: 'DEMO',
          isCompatible: true,
          recommendedMode: 'MODE_3',
          targetRangeText: profile?.temperatureRangeText || '13–15°C',
        });
        break;
      }
      case 'CABBAGE_HIGH': {
        const profile = getVegetableProfile('cabbage');
        setDetectionState({
          status: 'DETECTED',
          detectedCrops: ['cabbage'],
          confidences: { cabbage: 0.95 },
          source: 'DEMO',
          isCompatible: true,
          recommendedMode: 'MODE_1',
          targetRangeText: profile?.temperatureRangeText || '0–1°C',
        });
        break;
      }
      case 'TOMATO_LOW': {
        const profile = getVegetableProfile('tomato');
        setDetectionState({
          status: 'LOW_CONFIDENCE',
          detectedCrops: ['tomato'],
          confidences: { tomato: 0.54 },
          source: 'DEMO',
          isCompatible: true,
          recommendedMode: 'MODE_3',
          targetRangeText: profile?.temperatureRangeText || '13–15°C',
          warning: 'Detection confidence is low (54%). Please confirm the crop manually.',
        });
        break;
      }
      case 'MIXED_INCOMPATIBLE': {
        const compatibility = areCropsCompatible(['tomato', 'cabbage']);
        setDetectionState({
          status: 'MULTIPLE_DETECTED',
          detectedCrops: ['tomato', 'cabbage'],
          confidences: { tomato: 0.88, cabbage: 0.84 },
          source: 'DEMO',
          isCompatible: compatibility.compatible,
          warning: compatibility.warning || 'These crops require different storage conditions.',
        });
        break;
      }
      case 'UNAVAILABLE': {
        setDetectionState({
          status: 'UNAVAILABLE',
          detectedCrops: [],
          confidences: {},
          source: 'REAL',
          isCompatible: true,
          warning: 'Edge camera or YOLO model offline. Please select crop manually.',
        });
        break;
      }
      case 'RESET': {
        setDetectionState({
          status: 'IDLE',
          detectedCrops: [],
          confidences: {},
          source: 'DEMO',
          isCompatible: true,
        });
        break;
      }
    }
  };

  const confirmDetection = () => {
    if (detectionState.detectedCrops.length > 0 && detectionState.isCompatible) {
      const primaryCrop = detectionState.detectedCrops[0];
      const recMode: StorageModeId = detectionState.recommendedMode || getModeForVegetable(primaryCrop)?.id || 'MODE_3';
      setActiveCropAndMode(primaryCrop, recMode);
      setDetectionState((prev) => ({
        ...prev,
        status: 'IDLE',
        detectedCrops: [],
        warning: undefined,
      }));
    }
  };

  const resetDetection = () => {
    setDetectionState({
      status: 'IDLE',
      detectedCrops: [],
      confidences: {},
      source: 'DEMO',
      isCompatible: true,
    });
  };

  // Real backend query for system health and latest telemetry
  const {
    data: realTelemetryData,
    error: realTelemError,
    isLoading: realTelemLoading,
    refetch: refetchTelemetry,
  } = useQuery({
    queryKey: ['real-telemetry-latest'],
    queryFn: async () => {
      const response = await apiClient.get<TelemetryRecord>(
        `${API_ENDPOINTS.TELEMETRY_LATEST}?device_id=ESP32-HIMARKA-01`
      );
      return response;
    },
    enabled: mode === 'REAL',
    refetchInterval: mode === 'REAL' ? 5000 : false,
    retry: 1,
  });

  const {
    data: realEnergyData,
    refetch: refetchEnergy,
  } = useQuery({
    queryKey: ['real-energy-latest'],
    queryFn: async () => {
      const response = await apiClient.get<EnergyRecord>(
        `${API_ENDPOINTS.ENERGY_LATEST}?storage_unit_id=himarka-unit-01`
      );
      return response;
    },
    enabled: mode === 'REAL',
    refetchInterval: mode === 'REAL' ? 10000 : false,
    retry: 1,
  });

  const demoHistory = useMemo(() => generateDemoHistory(), []);

  // Compute active data based on mode
  const activeTelemetry: TelemetryRecord = useMemo(() => {
    if (mode === 'REAL' && realTelemetryData) {
      return realTelemetryData;
    }
    return DEMO_CURRENT_TELEMETRY;
  }, [mode, realTelemetryData]);

  const activeEnergy: EnergyRecord = useMemo(() => {
    if (mode === 'REAL' && realEnergyData) {
      return realEnergyData;
    }
    return DEMO_CURRENT_ENERGY;
  }, [mode, realEnergyData]);

  const isBackendConnected = Boolean(mode === 'REAL' && !realTelemError && realTelemetryData);
  const backendError = realTelemError ? (realTelemError as Error).message : undefined;

  const refreshData = () => {
    if (mode === 'REAL') {
      refetchTelemetry();
      refetchEnergy();
    }
  };

  const value: TelemetryContextValue = {
    mode,
    setMode: handleSetMode,
    telemetry: activeTelemetry,
    energy: activeEnergy,
    storageUnit: DEMO_STORAGE_UNIT,
    device: DEMO_DEVICE,
    history: demoHistory,
    produceBatches: DEMO_PRODUCE_BATCHES,
    alerts: DEMO_ALERTS,
    isLoading: mode === 'REAL' && realTelemLoading,
    isBackendConnected,
    backendError,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    refreshData,

    // Phase 1.3 Vegetable Modes & Crop
    activeCrop,
    activeMode,
    isModeAdjusting,
    modeAdjustmentMessage,
    setActiveCropAndMode,
    setActiveModeOnly,

    // Automatic Detection Pipeline
    detectionState,
    simulateDemoDetection,
    confirmDetection,
    resetDetection,
  };

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>;
};

export const useTelemetry = (): TelemetryContextValue => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
