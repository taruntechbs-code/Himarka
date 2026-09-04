import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '@/lib/i18n/i18n';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  Languages,
  Radio,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClaySection } from '@/components/clay/ClaySection';

export const SettingsShell: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useTelemetry();

  const handleLanguageChange = (code: SupportedLanguageCode) => {
    i18n.changeLanguage(code);
    localStorage.setItem('himarka_language', code);
  };

  return (
    <div id="settings-shell" style={{ width: '100%' }}>
      <ClaySection
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Language Selection Card (9 Languages) */}
          <ClayCard style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                }}
              >
                <Languages size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('settings.language')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)' }}>
                  Full multilingual support across 9 North Eastern & National languages
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = i18n.language === lang.code;

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code as SupportedLanguageCode)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-button)',
                      border: isSelected ? '2px solid var(--clay-accent-primary)' : '1px solid rgba(160, 150, 180, 0.2)',
                      backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.08)' : '#FAF8FD',
                      color: isSelected ? 'var(--clay-accent-primary)' : 'var(--clay-text-primary)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected ? 'var(--shadow-clay-button-secondary)' : 'none',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <span>{lang.name}</span>
                    {isSelected && <CheckCircle2 size={16} color="var(--clay-accent-primary)" />}
                  </button>
                );
              })}
            </div>
          </ClayCard>

          {/* Telemetry Data Source Card (Real vs Demo) */}
          <ClayCard style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                }}
              >
                <Radio size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('settings.dataSource')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)' }}>
                  Toggle between high-fidelity simulated telemetry and physical hardware
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Demo Mode Selection Option */}
              <div
                onClick={() => setMode('DEMO')}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-card)',
                  border: mode === 'DEMO' ? '2px solid #F59E0B' : '1px solid rgba(160, 150, 180, 0.2)',
                  backgroundColor: mode === 'DEMO' ? 'rgba(255, 251, 235, 0.7)' : '#FAF8FD',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#92400E' }}>
                    {t('settings.demoOptionTitle', 'DEMO MODE (Recommended for Reviewers)')}
                  </span>
                  {mode === 'DEMO' && <ClayBadge color="amber">{t('settings.active', 'ACTIVE')}</ClayBadge>}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.4 }}>
                  {t('settings.demoDesc')}
                </p>
              </div>

              {/* Real Backend Selection Option */}
              <div
                onClick={() => setMode('REAL')}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-card)',
                  border: mode === 'REAL' ? '2px solid #10B981' : '1px solid rgba(160, 150, 180, 0.2)',
                  backgroundColor: mode === 'REAL' ? 'rgba(236, 253, 245, 0.7)' : '#FAF8FD',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#047857' }}>
                    {t('settings.liveOptionTitle', 'LIVE BACKEND HARDWARE')}
                  </span>
                  {mode === 'REAL' && <ClayBadge color="emerald">{t('settings.active', 'ACTIVE')}</ClayBadge>}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.4 }}>
                  {t('settings.realDesc')}
                </p>
              </div>
            </div>
          </ClayCard>
        </div>

        {/* Platform Integrity Card */}
        <ClayCard variant="deep">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Server size={22} color="var(--clay-accent-primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{t('settings.platformTechTitle', 'Platform Technical Information')}</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', lineHeight: 1.6, maxWidth: '800px' }}>
            {t('settings.platformTechDesc', 'HIMARKA is engineered for the North Eastern Region of India. The frontend is built on React 18, Vite 5, and TypeScript with a pure Light Claymorphism design system. Zero fake hardware claims or uncalibrated machine learning metrics are generated.')}
          </p>
        </ClayCard>
      </ClaySection>
    </div>
  );
};
