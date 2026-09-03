import { TelemetryRecord } from '@/types/domain';

export type TelemetryListener = (telemetry: TelemetryRecord) => void;

export interface RealtimeService {
  subscribeToDevice(deviceId: string, onUpdate: TelemetryListener): () => void;
  subscribeToStorageAlerts(storageUnitId: string, onAlert: (alert: unknown) => void): () => void;
}

class RealtimeTelemetryService implements RealtimeService {
  private listeners: Map<string, Set<TelemetryListener>> = new Map();

  subscribeToDevice(deviceId: string, onUpdate: TelemetryListener): () => void {
    if (!this.listeners.has(deviceId)) {
      this.listeners.set(deviceId, new Set());
    }
    this.listeners.get(deviceId)!.add(onUpdate);

    // Return unsubscriber function
    return () => {
      const set = this.listeners.get(deviceId);
      if (set) {
        set.delete(onUpdate);
        if (set.size === 0) {
          this.listeners.delete(deviceId);
        }
      }
    };
  }

  subscribeToStorageAlerts(_storageUnitId: string, _onAlert: (alert: unknown) => void): () => void {
    // Abstraction for future SSE / WebSocket / Firebase RTDB stream
    return () => {};
  }
}

export const realtimeService = new RealtimeTelemetryService();
