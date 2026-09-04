import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Internationalization Hardcoded String Audit', () => {
  const componentPaths = [
    'src/components/layout/Header.tsx',
    'src/components/layout/AppLayout.tsx',
    'src/components/feedback/ErrorBoundary.tsx',
    'src/features/dashboard/components/DashboardShell.tsx',
    'src/features/storage/components/StorageShell.tsx',
    'src/features/energy/components/EnergyShell.tsx',
    'src/features/telemetry/components/TelemetryShell.tsx',
    'src/features/devices/components/DevicesShell.tsx',
    'src/features/alerts/components/AlertsShell.tsx',
    'src/features/produce/components/ProduceShell.tsx',
    'src/features/settings/components/SettingsShell.tsx',
  ];

  const forbiddenStrings = [
    '>CHAMBER TEMP<',
    '>CHAMBER RH<',
    '>DOOR STATUS<',
    '>SEALED<',
    '>Magnetic Gasket<',
    '>Storage Conditions Optimal<',
    '>Solar Power Profile (Watts)<',
    '>Battery State of Charge Buffer (%)<',
    '>Connected Sensor Peripherals<',
    '>FIRMWARE VERSION<',
    '>NETWORK IP & MODE<',
    '>COOLING RELAY STATE<',
    '>CLOCK SKEW GUARD<',
    '>Live Stream Active<',
    '>Model Architecture<',
    '>Registry Status<',
    '>Awaiting Weights File<',
    '>CAMERA OFFLINE<',
    '>WAITING FOR EDGE HARDWARE STREAM<',
    '>AWAITING PHYSICAL MEASUREMENT<',
    '>ACTIVE BATCH<',
    '>DEMO MODE (Recommended for Reviewers)<',
    '>LIVE BACKEND HARDWARE<',
  ];

  componentPaths.forEach((relPath) => {
    const fullPath = path.resolve(__dirname, '../../..', relPath);

    it(`file ${relPath} should not contain raw hardcoded user-facing English strings`, () => {
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Component file not found: ${fullPath}`);
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const violations: string[] = [];

      for (const pattern of forbiddenStrings) {
        if (content.includes(pattern)) {
          violations.push(pattern);
        }
      }

      expect(
        violations,
        `Found forbidden hardcoded strings in ${relPath}: ${violations.join(', ')}`
      ).toHaveLength(0);
    });
  });
});
