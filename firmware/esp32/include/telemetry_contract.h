/**
 * HIMARKA ESP32 Firmware Telemetry Contract
 * Strictly mirrors the backend Pydantic TelemetryIngestPayload and TypeScript TelemetryRecord.
 */

#ifndef HIMARKA_TELEMETRY_CONTRACT_H
#define HIMARKA_TELEMETRY_CONTRACT_H

#include <stdint.h>

struct HimarkaTelemetryPayload {
    char device_id[64];
    char timestamp_iso8601[32]; // e.g. "2026-09-03T21:00:00Z"
    
    // Environmental
    float temperature_c;
    float humidity_percent;
    float gas_ppm;
    
    // Power & Storage Status
    float solar_voltage;
    float battery_voltage;
    float battery_percent;
    bool cooling_active;
    bool door_open;
};

#endif // HIMARKA_TELEMETRY_CONTRACT_H
