import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardShell } from '@/features/dashboard/components/DashboardShell';
import { TelemetryShell } from '@/features/telemetry/components/TelemetryShell';
import { StorageShell } from '@/features/storage/components/StorageShell';
import { ProduceShell } from '@/features/produce/components/ProduceShell';
import { DevicesShell } from '@/features/devices/components/DevicesShell';
import { EnergyShell } from '@/features/energy/components/EnergyShell';
import { AlertsShell } from '@/features/alerts/components/AlertsShell';
import { SettingsShell } from '@/features/settings/components/SettingsShell';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardShell /> },
      { path: 'telemetry', element: <TelemetryShell /> },
      { path: 'storage', element: <StorageShell /> },
      { path: 'produce', element: <ProduceShell /> },
      { path: 'devices', element: <DevicesShell /> },
      { path: 'energy', element: <EnergyShell /> },
      { path: 'alerts', element: <AlertsShell /> },
      { path: 'settings', element: <SettingsShell /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
