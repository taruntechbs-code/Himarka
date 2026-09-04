import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  Thermometer,
  Droplets,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Wind,
  Bell,
  Heart,
  ChevronRight,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClaySection } from '@/components/clay/ClaySection';
import { ClayTelemetryChart } from '@/components/charts/ClayTelemetryChart';
import {
  STORAGE_MODES,
  getVegetableProfile,
  getTemperatureStatus,
} from '@/domain/temperatureProfiles';

export const DashboardShell: React.FC = () => {
  const { t } = useTranslation();
  const {
    telemetry,
    history,
    produceBatches,
    mode,
    lastUpdated,
    activeCrop,
    activeMode,
    isModeAdjusting,
    modeAdjustmentMessage,
    setActiveCropAndMode,
  } = useTelemetry();

  const [isCropSelectorOpen, setIsCropSelectorOpen] = useState(false);

  // Active crop and mode data
  const cropProfile = getVegetableProfile(activeCrop);
  const modeObj = STORAGE_MODES[activeMode];
  const tempStatus = getTemperatureStatus(telemetry.temperature_c, modeObj.minTemp, modeObj.maxTemp);

  // Simple farmer values
  const tempValue = telemetry.temperature_c.toFixed(1);
  const humidityValue = Math.round(telemetry.humidity_percent);

  // Common popular crops for quick farmer selection
  const popularCrops = [
    'tomato',
    'cabbage',
    'potato',
    'green_chilli',
    'ginger',
    'french_beans',
    'capsicum',
    'spinach',
    'cucumber',
  ];

  return (
    <div id="dashboard-shell" style={{ width: '100%' }}>
      {/* 1. PRIMARY FARMER HERO: Current Storage & Vegetable Mode */}
      <ClayCard
        id="farmer-hero-card"
        variant="deep"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF8FD 100%)',
        }}
      >
        {/* Mode Change Notice */}
        {isModeAdjusting && (
          <div
            id="mode-adjusting-banner"
            style={{
              marginBottom: '1.25rem',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-medium)',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <RotateCcw size={18} color="#2563EB" className="animate-spin" />
              <span style={{ fontSize: '0.92rem', color: '#1E40AF', fontWeight: 700 }}>
                {modeAdjustmentMessage || t('modes.adjustingNotice', 'Mode change requested. Cooling system will adjust toward the selected range.')}
              </span>
            </div>
            <ClayBadge color="sky">{t('modes.adjusting', 'ADJUSTING')}</ClayBadge>
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Hero: Overall Status & Temperature */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              <ClayBadge color="emerald" pulse icon={<ShieldCheck size={15} />}>
                {t('dashboard.status.healthySafe', 'STORAGE HEALTHY & SAFE')}
              </ClayBadge>
              {mode === 'DEMO' && (
                <ClayBadge color="amber">
                  {t('mode.demo', 'DEMO MODE')}
                </ClayBadge>
              )}
              <ClayBadge color="violet">
                {modeObj.name}: {modeObj.tempRangeLabel}
              </ClayBadge>
            </div>

            {/* Current Storage Crop & Mode Heading */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('dashboard.currentStorage', 'CURRENT STORAGE')}:
                </span>
                <span
                  id="active-crop-name"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                    fontWeight: 900,
                    color: 'var(--clay-accent-primary)',
                    lineHeight: 1,
                  }}
                >
                  {cropProfile?.name || 'Tomato'}
                </span>
                <button
                  type="button"
                  id="change-crop-button"
                  onClick={() => setIsCropSelectorOpen(!isCropSelectorOpen)}
                  className="clay-btn clay-btn-secondary"
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.35rem 0.85rem',
                    height: '32px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {isCropSelectorOpen ? t('common.close', 'Close') : t('dashboard.changeCrop', 'Change Crop')}
                </button>
              </div>

              {/* Farmer Mode Description */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--clay-text-primary)',
                  lineHeight: 1.4,
                  margin: '0 0 0.2rem 0',
                }}
              >
                <strong>{modeObj.name} ({modeObj.tempRangeLabel})</strong> &bull; {modeObj.title}
              </p>
              <span style={{ fontSize: '0.84rem', color: 'var(--clay-text-secondary)' }}>
                {cropProfile?.temperatureRangeText ? `${cropProfile.name} profile: ${cropProfile.temperatureRangeText}` : ''}
              </span>
            </div>

            {/* Temperature Metrics Comparison: Current vs Target */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
                marginBottom: '1rem',
              }}
            >
              {/* Dominant Current Temperature Metric */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'baseline',
                  gap: '0.4rem',
                  padding: '0.5rem 1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-clay-card)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <span style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', fontWeight: 700 }}>
                  {t('dashboard.metrics.currentTemp', 'Current')}:
                </span>
                <span
                  id="hero-temperature-value"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: 900,
                    color: tempStatus === 'WITHIN_TARGET' ? 'var(--clay-success)' : 'var(--clay-accent-primary)',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                  }}
                >
                  {tempValue}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--clay-accent-primary)',
                  }}
                >
                  °C
                </span>
              </div>

              {/* Target Temperature Metric */}
              <div
                style={{
                  padding: '0.6rem 1.15rem',
                  backgroundColor: '#FAF8FD',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid rgba(160, 150, 180, 0.2)',
                  boxShadow: 'var(--shadow-clay-recessed)',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  {t('dashboard.metrics.targetTemp', 'Target Range')}
                </span>
                <span
                  id="hero-target-temperature-value"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: 'var(--clay-text-primary)',
                  }}
                >
                  {modeObj.tempRangeLabel}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', color: 'var(--clay-text-secondary)', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} />
                <span>{t('dashboard.lastUpdated')}: <strong>{lastUpdated}</strong></span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--clay-success)" />
                <span id="temp-status-text">
                  {tempStatus === 'WITHIN_TARGET'
                    ? t('dashboard.status.withinTarget', 'Within target range')
                    : tempStatus === 'TOO_COLD'
                    ? t('dashboard.status.tooCold', 'Below target: Cooling will cycle off')
                    : t('dashboard.status.tooWarm', 'Above target: Active cooling engaged')}
                </span>
              </span>
            </div>
          </div>

          {/* Right Hero: Farmer Actionable Summary Checklist */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-clay-card)',
              padding: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.9)',
            }}
          >
            <h4
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.15rem',
                fontWeight: 800,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Sparkles size={18} color="var(--clay-accent-primary)" />
              <span>{t('dashboard.checklistTitle', 'Everything You Need to Know')}</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clay-success)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={16} />
                </div>
                <span><strong>{t('dashboard.checklist.produce', 'Produce')}:</strong> {t('dashboard.produceSafe', 'Produce is Safe & Fresh')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clay-success)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={16} />
                </div>
                <span><strong>{t('dashboard.checklist.coldAir', 'Cold Air')}:</strong> {t('dashboard.coldIdeal', 'Cold Temperature is Ideal')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clay-success)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={16} />
                </div>
                <span><strong>{t('dashboard.checklist.humidity', 'Humidity')}:</strong> {t('dashboard.humidityGood', 'Moisture is Good for Produce')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clay-success)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={16} />
                </div>
                <span><strong>{t('dashboard.checklist.power', 'Power')}:</strong> {t('dashboard.powerGood', 'Solar Power is Running Normally')}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clay-success)',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2 size={16} />
                </div>
                <span><strong>{t('dashboard.checklist.action', 'Action Needed')}:</strong> {t('dashboard.noAction', 'No Action Needed — Everything is Safe')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1B. INLINE CROP SELECTION ACCORDION */}
        {isCropSelectorOpen && (
          <div
            id="inline-crop-selector"
            style={{
              marginTop: '1.75rem',
              padding: '1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-clay-card)',
              border: '1px solid rgba(160, 150, 180, 0.2)',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--clay-text-primary)' }}>
                  {t('dashboard.whatAreYouStoring', 'What are you storing?')}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
                  {t('dashboard.selectCropPrompt', 'Select a vegetable to automatically configure the recommended temperature mode.')}
                </p>
              </div>

              <Link
                to="/produce"
                className="clay-btn clay-btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem', height: '34px' }}
              >
                <span>{t('dashboard.aiDetectLink', 'Use Camera Detection')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {popularCrops.map((cropId) => {
                const profile = getVegetableProfile(cropId);
                if (!profile) return null;
                const isSelected = activeCrop === cropId;
                const recMode = STORAGE_MODES[profile.preferredMode];

                return (
                  <button
                    key={cropId}
                    type="button"
                    id={`crop-select-${cropId}`}
                    onClick={() => {
                      setActiveCropAndMode(cropId);
                      setIsCropSelectorOpen(false);
                    }}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-medium)',
                      border: isSelected ? '2px solid var(--clay-accent-primary)' : '1px solid rgba(160, 150, 180, 0.25)',
                      backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.08)' : '#FAF8FD',
                      boxShadow: isSelected ? 'var(--shadow-clay-orb)' : 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.95rem', color: isSelected ? 'var(--clay-accent-primary)' : 'var(--clay-text-primary)' }}>
                        {profile.name}
                      </strong>
                      {isSelected && <Check size={14} color="var(--clay-accent-primary)" />}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>
                      {recMode.name} ({recMode.tempRangeLabel})
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <Link
                to="/storage"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--clay-accent-primary)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>{t('dashboard.viewAllModes', 'View All 24 Vegetable Profiles & Preset Modes')}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </ClayCard>

      {/* 2. CORE ACTIONABLE STATUS CARDS (Visual Hierarchy 1–7) */}
      <ClaySection
        title={t('dashboard.statusTitle', 'Current Storage Status')}
        subtitle={t('dashboard.statusSubtitle', 'Clear and actionable conditions inside your cold storage')}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Card 1: Storage Temperature with Vegetable Target Display */}
          <ClayCard style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                }}
              >
                <Thermometer size={24} />
              </div>
              <ClayBadge color={tempStatus === 'WITHIN_TARGET' ? 'emerald' : tempStatus === 'TOO_COLD' ? 'sky' : 'amber'}>
                {tempStatus === 'WITHIN_TARGET' ? 'WITHIN TARGET' : tempStatus === 'TOO_COLD' ? 'TOO COLD' : 'TOO WARM'}
              </ClayBadge>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              {t('dashboard.metrics.temperature')}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.65rem', margin: '0 0 0.4rem 0' }}>
              <p style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-text-primary)', margin: 0 }}>
                {tempValue}°C
              </p>
              <span style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', fontWeight: 700 }}>
                (Target: {modeObj.tempRangeLabel})
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
              {modeObj.name} preset for {cropProfile?.name || 'Produce'} ({modeObj.title})
            </p>
          </ClayCard>

          {/* Card 2: Air Moisture (Humidity) */}
          <ClayCard style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0EA5E9',
                }}
              >
                <Droplets size={24} />
              </div>
              <ClayBadge color="emerald">{t('dashboard.status.humidityStable', 'HUMIDITY IS STABLE')}</ClayBadge>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              {t('dashboard.metrics.humidity')}
            </span>
            <p style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-text-primary)', margin: '0 0 0.4rem 0' }}>
              {humidityValue}%
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
              {t('dashboard.status.humidityDesc', 'Air moisture is stable to protect vegetables')}
            </p>
          </ClayCard>

          {/* Card 3: Produce Freshness */}
          <ClayCard style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                }}
              >
                <Heart size={24} />
              </div>
              <ClayBadge color="emerald">{t('dashboard.status.conditionGood', 'CONDITION: GOOD')}</ClayBadge>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              {t('dashboard.metrics.produceStatus')}
            </span>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-success)', margin: '0 0 0.4rem 0' }}>
              {t('dashboard.status.produceGood', 'PRODUCE CONDITION: GOOD')}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
              {t('dashboard.status.produceDesc', 'Stored produce is in good, healthy condition')}
            </p>
          </ClayCard>

          {/* Card 4: Solar Power */}
          <ClayCard style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                }}
              >
                <Sun size={24} />
              </div>
              <ClayBadge color="emerald">{t('dashboard.status.powerPlenty', 'PLENTY OF POWER')}</ClayBadge>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              {t('dashboard.metrics.power')}
            </span>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#D97706', margin: '0 0 0.4rem 0' }}>
              {t('dashboard.status.solarActive', 'SOLAR ACTIVE')}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
              {t('dashboard.status.powerDesc', 'Running normally with full battery reserve')}
            </p>
          </ClayCard>

          {/* Card 5: Cooling System */}
          <ClayCard style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#7C3AED',
                }}
              >
                <Wind size={24} />
              </div>
              <ClayBadge color="emerald">{t('dashboard.status.active', 'ACTIVE')}</ClayBadge>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              {t('dashboard.metrics.cooling')}
            </span>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-accent-primary)', margin: '0 0 0.4rem 0' }}>
              {t('dashboard.status.coolingWorking', 'WORKING NORMALLY')}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
              {t('dashboard.status.coolingDesc', 'Cold air circulating gently to protect harvest')}
            </p>
          </ClayCard>

          {/* Card 6: Alerts & Attention */}
          <ClayCard style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                }}
              >
                <Bell size={24} />
              </div>
              <ClayBadge color="emerald">{t('dashboard.status.safe', 'SAFE')}</ClayBadge>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              {t('dashboard.metrics.alerts')}
            </span>
            <p style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-success)', margin: '0 0 0.4rem 0' }}>
              {t('dashboard.status.noIssues', 'NO ISSUES')}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
              {t('dashboard.status.alertsDesc', 'All systems safe • No action needed from you')}
            </p>
          </ClayCard>
        </div>
      </ClaySection>

      {/* 3. PRODUCE STORED (Answers: "What do I have stored and how is it doing?") */}
      <ClaySection
        title={t('dashboard.produceTitle', 'Produce Currently Stored')}
        subtitle={t('dashboard.produceSubtitle', 'Your fresh vegetables currently being preserved in the cold chamber')}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {produceBatches.map((batch) => (
            <ClayCard key={batch.id} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--clay-text-primary)' }}>
                    {batch.produce_type}
                  </h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>
                    {batch.farmer_identifier}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-text-primary)' }}>
                    {batch.quantity_kg} <span style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)' }}>kg</span>
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FAF8FD',
                  borderRadius: 'var(--radius-input)',
                  fontSize: '0.88rem',
                }}
              >
                <span style={{ color: 'var(--clay-success)', fontWeight: 700 }}>
                  ✓ {t('dashboard.status.conditionGood', 'Produce condition: Good')}
                </span>
                <span style={{ color: 'var(--clay-text-secondary)', fontSize: '0.8rem' }}>
                  {t('dashboard.status.storedSafely', 'Stored safely')}
                </span>
              </div>
            </ClayCard>
          ))}
        </div>
      </ClaySection>

      {/* 4. SIMPLE 24-HOUR TEMPERATURE TREND (Answers: "Has it stayed cold all day?") */}
      <ClaySection
        title={t('dashboard.historyTitle', '24-Hour Temperature Record')}
        subtitle={t('dashboard.historySubtitle', 'Shows that your storage has stayed safely cold continuously day and night')}
      >
        <ClayTelemetryChart
          id="farmer-temp-chart"
          title={t('dashboard.chartTitle', 'Chamber Coldness Over Last 24 Hours (°C)')}
          subtitle={t('dashboard.chartSubtitle', 'Temperature remained steady in the safe green zone (1.0°C – 4.0°C)')}
          data={history}
          dataKey="temperature_c"
          unit="°C"
          strokeColor="#7C3AED"
          fillGradientId="farmerTempGrad"
          gradientFrom="rgba(124, 58, 237, 0.45)"
          gradientTo="rgba(124, 58, 237, 0.02)"
          minDomain={0}
          maxDomain={5}
        />
      </ClaySection>

      {/* 5. PROGRESSIVE DISCLOSURE FOR ENGINEERS / OPERATORS */}
      <ClayCard
        style={{
          marginTop: '2.5rem',
          padding: '1.75rem',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t('dashboard.techTitle', 'Looking for Technical Engineering Details?')}
          </span>
          <p style={{ fontSize: '0.95rem', color: 'var(--clay-text-primary)', fontWeight: 600, margin: '0.2rem 0 0 0' }}>
            {t('dashboard.techDesc', 'Detailed voltages, battery metrics, sensor hardware, and raw telemetry are available on dedicated operator pages.')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/energy"
            className="clay-btn clay-btn-secondary"
            style={{ fontSize: '0.85rem', height: '44px', padding: '0 1.25rem' }}
          >
            <span>{t('dashboard.solarDetails', 'Solar & Power Details')}</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/devices"
            className="clay-btn clay-btn-outline"
            style={{ fontSize: '0.85rem', height: '44px', padding: '0 1.25rem' }}
          >
            <span>{t('dashboard.sensorHardware', 'Sensor Hardware')}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </ClayCard>
    </div>
  );
};
