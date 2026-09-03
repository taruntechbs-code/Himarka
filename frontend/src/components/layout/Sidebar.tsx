import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Activity,
  Box,
  Carrot,
  Cpu,
  SunMedium,
  Bell,
  Settings as SettingsIcon,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, id: 'nav-dashboard' },
  { path: '/telemetry', labelKey: 'nav.telemetry', icon: Activity, id: 'nav-telemetry' },
  { path: '/storage', labelKey: 'nav.storage', icon: Box, id: 'nav-storage' },
  { path: '/produce', labelKey: 'nav.produce', icon: Carrot, id: 'nav-produce' },
  { path: '/devices', labelKey: 'nav.devices', icon: Cpu, id: 'nav-devices' },
  { path: '/energy', labelKey: 'nav.energy', icon: SunMedium, id: 'nav-energy' },
  { path: '/alerts', labelKey: 'nav.alerts', icon: Bell, id: 'nav-alerts' },
  { path: '/settings', labelKey: 'nav.settings', icon: SettingsIcon, id: 'nav-settings' },
];

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <aside
      id="app-sidebar"
      style={{
        width: '240px',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0.75rem',
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              id={item.id}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive ? '#fff' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'rgba(13, 148, 136, 0.2)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                transition: 'var(--transition-fast)',
              })}
            >
              <Icon size={18} />
              <span>{t(item.labelKey)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
