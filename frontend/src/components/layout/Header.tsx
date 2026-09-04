import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Activity,
  Box,
  Carrot,
  SunMedium,
  Bell,
  Cpu,
  Settings as SettingsIcon,
  Menu,
  X,
  Radio,
  Languages,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@/lib/i18n/i18n';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';

// Concise navigation items for single-row desktop layout
const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.dashboard', defaultLabel: 'Dashboard', icon: LayoutDashboard, id: 'nav-dashboard' },
  { path: '/telemetry', labelKey: 'nav.telemetry', defaultLabel: 'Environment', icon: Activity, id: 'nav-telemetry' },
  { path: '/storage', labelKey: 'nav.storage', defaultLabel: 'Storage', icon: Box, id: 'nav-storage' },
  { path: '/produce', labelKey: 'nav.produce', defaultLabel: 'AI & Produce', icon: Carrot, id: 'nav-produce' },
  { path: '/energy', labelKey: 'nav.energy', defaultLabel: 'Energy', icon: SunMedium, id: 'nav-energy' },
  { path: '/devices', labelKey: 'nav.devices', defaultLabel: 'Devices', icon: Cpu, id: 'nav-devices' },
  { path: '/alerts', labelKey: 'nav.alerts', defaultLabel: 'Alerts', icon: Bell, id: 'nav-alerts' },
  { path: '/settings', labelKey: 'nav.settings', defaultLabel: 'Settings', icon: SettingsIcon, id: 'nav-settings' },
];

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTelemetry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLanguageChange = (langCode: SupportedLanguageCode) => {
    i18n.changeLanguage(langCode);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('himarka_language', langCode);
    }
  };

  return (
    <header
      id="app-header"
      style={{
        position: 'sticky',
        top: '0.75rem',
        zIndex: 50,
        margin: '0 auto 1.25rem auto',
        maxWidth: '1360px',
        padding: '0 1rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          height: '72px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--shadow-clay-card)',
          border: '1.5px solid rgba(255, 255, 255, 0.9)',
          padding: '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          gap: '1rem',
          boxSizing: 'border-box',
        }}
      >
        {/* LEFT: Compact Brand */}
        <NavLink
          to="/"
          id="brand-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
              boxShadow: 'var(--shadow-clay-orb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.1rem',
              fontFamily: 'var(--font-heading)',
              flexShrink: 0,
            }}
          >
            H
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: 'var(--clay-text-primary)',
              }}
            >
              HIM<span style={{ color: 'var(--clay-accent-primary)' }}>ARKA</span>
            </span>
          </div>
        </NavLink>

        {/* CENTER: Compact Single-Row Desktop Navigation Links */}
        <nav
          id="desktop-navigation"
          aria-label="Primary Navigation"
          className="desktop-nav-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            flexWrap: 'nowrap',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                id={item.id}
                to={item.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-button)',
                  fontSize: '0.84rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  color: isActive ? '#FFFFFF' : 'var(--clay-text-secondary)',
                  background: isActive
                    ? 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)'
                    : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-clay-button)' : 'none',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.08)';
                    e.currentTarget.style.color = 'var(--clay-accent-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--clay-text-secondary)';
                  }
                }}
              >
                <Icon size={15} />
                <span>{t(item.labelKey, item.defaultLabel)}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* RIGHT: Compact Controls (Mode Toggle & Language) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexShrink: 0,
          }}
        >
          {/* Mode Pill Toggle */}
          <button
            id="telemetry-mode-toggle"
            type="button"
            onClick={() => setMode(mode === 'DEMO' ? 'REAL' : 'DEMO')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              height: '36px',
              padding: '0 0.75rem',
              borderRadius: 'var(--radius-button)',
              border: mode === 'DEMO' ? '1.5px solid #F59E0B' : '1.5px solid #10B981',
              backgroundColor: mode === 'DEMO' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              color: mode === 'DEMO' ? '#B45309' : '#047857',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.74rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-clay-button-secondary)',
              transition: 'all var(--transition-fast)',
            }}
            title="Switch between Demo Telemetry and Live Backend Hardware"
          >
            <Radio size={13} />
            <span>{mode === 'DEMO' ? 'DEMO' : 'LIVE'}</span>
          </button>

          {/* 9-Language Selector */}
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.65rem',
                pointerEvents: 'none',
                color: 'var(--clay-accent-primary)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Languages size={14} />
            </span>
            <select
              id="language-select"
              aria-label="Select Language"
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguageCode)}
              style={{
                height: '36px',
                backgroundColor: '#FAF8FD',
                color: 'var(--clay-text-primary)',
                border: '1.5px solid rgba(160, 150, 180, 0.3)',
                padding: '0 0.65rem 0 1.85rem',
                borderRadius: 'var(--radius-button)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-clay-recessed)',
              }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-nav-toggle"
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-orb)',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-clay-orb)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--clay-text-primary)',
              flexShrink: 0,
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          style={{
            marginTop: '0.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-card)',
            boxShadow: 'var(--shadow-clay-card)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            border: '1px solid rgba(255, 255, 255, 0.9)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-button)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  color: isActive ? '#FFFFFF' : 'var(--clay-text-primary)',
                  backgroundColor: isActive ? 'var(--clay-accent-primary)' : 'rgba(160, 150, 180, 0.08)',
                  minHeight: '44px',
                }}
              >
                <Icon size={18} />
                <span>{t(item.labelKey, item.defaultLabel)}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* Responsive Breakpoint Styles */}
      <style>{`
        @media (max-width: 1080px) {
          .desktop-nav-container {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
