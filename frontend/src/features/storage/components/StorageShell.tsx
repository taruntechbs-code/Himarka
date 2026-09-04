import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  Thermometer,
  Droplets,
  DoorClosed,
  Box,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClaySection } from '@/components/clay/ClaySection';
import { PROTOTYPE_CONFIG } from '@/config/prototypeConfig';
import {
  STORAGE_MODES,
  StorageModeId,
  getVegetablesForMode,
} from '@/domain/temperatureProfiles';

export const StorageShell: React.FC = () => {
  const { t } = useTranslation();
  const {
    storageUnit,
    telemetry,
    produceBatches,
    mode,
    activeMode,
    activeCrop,
    setActiveModeOnly,
    setActiveCropAndMode,
    isModeAdjusting,
    modeAdjustmentMessage,
  } = useTelemetry();

  const totalStoredKg = produceBatches.reduce((acc, b) => acc + b.quantity_kg, 0);

  const modeKeys: StorageModeId[] = ['MODE_1', 'MODE_2', 'MODE_3'];

  return (
    <div id="storage-shell" style={{ width: '100%' }}>
      {/* Mode Adjustment Notification */}
      {isModeAdjusting && (
        <div
          id="storage-adjusting-notice"
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-card)',
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: 'var(--shadow-clay-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <RotateCcw size={20} color="#2563EB" className="animate-spin" />
            <span style={{ fontSize: '0.95rem', color: '#1E40AF', fontWeight: 700 }}>
              {modeAdjustmentMessage || 'Mode change requested. Cooling system will adjust toward the selected range.'}
            </span>
          </div>
          <ClayBadge color="sky">ADJUSTING TARGET</ClayBadge>
        </div>
      )}

      <ClaySection
        title={t('storage.title', 'HIMARKA Prototype Storage Box')}
        subtitle={t('storage.subtitle', 'Compact insulated chamber prototype for decentralized, small-batch solar cold preservation')}
        badge={
          mode === 'DEMO' ? (
            <ClayBadge color="amber">PROTOTYPE DEMO</ClayBadge>
          ) : (
            <ClayBadge color="emerald">ACTIVE HARDWARE</ClayBadge>
          )
        }
      >
        {/* 1. Storage Unit Hero Card: Physical Prototype Aligned */}
        <ClayCard variant="deep" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <ClayBadge color="violet">UNIT #{storageUnit.id}</ClayBadge>
                <ClayBadge color="emerald">SOLAR COOLING ENGAGED</ClayBadge>
                <ClayBadge color="amber">PROTOTYPE CHAMBER</ClayBadge>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  marginBottom: '0.4rem',
                  color: 'var(--clay-text-primary)',
                }}
              >
                {storageUnit.name}
              </h3>

              <p
                style={{
                  color: 'var(--clay-text-secondary)',
                  fontSize: '0.92rem',
                  marginBottom: '1.5rem',
                  lineHeight: 1.4,
                }}
              >
                Compact farm-level insulated prototype &bull; Solar-powered direct DC cooling &bull; Decentralized cold chain preservation
              </p>

              {/* Prototype Capacity Section (Field-Tested Prototype Specifications) */}
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-medium)',
                  boxShadow: 'var(--shadow-clay-card)',
                  border: '1px solid rgba(160, 150, 180, 0.2)',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                    {t('storage.capacity', 'Storage Capacity')}: <span style={{ color: 'var(--clay-accent-primary)' }}>{PROTOTYPE_CONFIG.estimatedCapacityKg ? `${PROTOTYPE_CONFIG.estimatedCapacityKg} kg` : 'To be calibrated'}</span>
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--clay-text-secondary)', fontWeight: 700 }}>
                    {totalStoredKg.toFixed(1)} kg Small-Batch Stored
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '14px',
                    backgroundColor: '#F0EDF5',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-clay-recessed)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '35%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #A78BFA 0%, #7C3AED 100%)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', display: 'block', marginTop: '0.45rem' }}>
                  * Physical capacity to be calibrated with official measurements from internal hackathon hardware prototype.
                </span>
              </div>
            </div>

            {/* Quick Chamber Telemetry Pills */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FAF8FD',
                  borderRadius: 'var(--radius-medium)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-clay-card)',
                  textAlign: 'center',
                }}
              >
                <Thermometer size={24} color="#7C3AED" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Chamber Temp
                </span>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
                  {telemetry.temperature_c.toFixed(1)}°C
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--clay-success)', fontWeight: 600 }}>
                  Active Preset: {STORAGE_MODES[activeMode].name}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#FAF8FD',
                  borderRadius: 'var(--radius-medium)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-clay-card)',
                  textAlign: 'center',
                }}
              >
                <Droplets size={24} color="#0EA5E9" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Chamber RH
                </span>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: '0.2rem 0' }}>
                  {Math.round(telemetry.humidity_percent)}%
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--clay-success)', fontWeight: 600 }}>
                  High Humidity
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#FAF8FD',
                  borderRadius: 'var(--radius-medium)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-clay-card)',
                  textAlign: 'center',
                }}
              >
                <DoorClosed size={24} color="#10B981" style={{ margin: '0 auto 0.4rem auto' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Door Status
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.4rem 0' }}>
                  {telemetry.door_open ? 'OPEN' : 'SEALED'}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--clay-success)', fontWeight: 600 }}>
                  Magnetic Gasket
                </span>
              </div>
            </div>
          </div>
        </ClayCard>

        {/* 2. Centralized Configurable Box Dimensions (Section 2 & 5) */}
        <ClayCard style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--clay-text-primary)', margin: '0 0 0.2rem 0' }}>
                <Box size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.4rem', color: 'var(--clay-accent-primary)' }} />
                {t('storage.dimensionsTitle', 'Physical Prototype Dimensions & Specifications')}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
                Centralized configuration model &bull; Zero fabricated numbers per scientific prototype standards
              </p>
            </div>
            <ClayBadge color="amber">AWAITING PHYSICAL MEASUREMENT</ClayBadge>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ padding: '1rem', backgroundColor: '#FAF8FD', borderRadius: 'var(--radius-medium)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                Internal Length
              </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--clay-text-primary)' }}>
                {PROTOTYPE_CONFIG.internalLengthMm ? `${PROTOTYPE_CONFIG.internalLengthMm} mm` : 'Configurable'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#B45309', display: 'block', marginTop: '0.2rem' }}>
                To be measured
              </span>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#FAF8FD', borderRadius: 'var(--radius-medium)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                Internal Width
              </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--clay-text-primary)' }}>
                {PROTOTYPE_CONFIG.internalWidthMm ? `${PROTOTYPE_CONFIG.internalWidthMm} mm` : 'Configurable'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#B45309', display: 'block', marginTop: '0.2rem' }}>
                To be measured
              </span>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#FAF8FD', borderRadius: 'var(--radius-medium)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                Internal Height
              </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--clay-text-primary)' }}>
                {PROTOTYPE_CONFIG.internalHeightMm ? `${PROTOTYPE_CONFIG.internalHeightMm} mm` : 'Configurable'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#B45309', display: 'block', marginTop: '0.2rem' }}>
                To be measured
              </span>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#FAF8FD', borderRadius: 'var(--radius-medium)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                Usable Volume
              </span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--clay-text-primary)' }}>
                {PROTOTYPE_CONFIG.usableVolumeLiters ? `${PROTOTYPE_CONFIG.usableVolumeLiters} L` : 'To be calibrated'}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#B45309', display: 'block', marginTop: '0.2rem' }}>
                Hackathon prototype
              </span>
            </div>
          </div>
        </ClayCard>

        {/* 3. PRESET STORAGE MODES (Sections 6, 7, 8, 19) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--clay-text-primary)',
                marginBottom: '0.3rem',
              }}
            >
              <Layers size={22} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem', color: 'var(--clay-accent-primary)' }} />
              {t('storage.modesTitle', 'Vegetable-Specific Storage Operating Modes')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
              {t('storage.modesSubtitle', 'HIMARKA regulates cooling based on crop biology. Select an operating preset mode below:')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {modeKeys.map((modeId) => {
              const sm = STORAGE_MODES[modeId];
              const isActive = activeMode === modeId;
              const crops = getVegetablesForMode(modeId);

              return (
                <ClayCard
                  key={modeId}
                  id={`mode-card-${modeId}`}
                  variant={isActive ? 'deep' : 'default'}
                  style={{
                    padding: '1.75rem',
                    border: isActive ? '2.5px solid var(--clay-accent-primary)' : '1px solid rgba(160, 150, 180, 0.2)',
                    backgroundColor: isActive ? '#FFFFFF' : '#FAF8FD',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--clay-text-secondary)',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          display: 'block',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {sm.name}
                      </span>
                      <h4
                        style={{
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: 'var(--clay-text-primary)',
                          margin: 0,
                        }}
                      >
                        {sm.title}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          color: 'var(--clay-accent-primary)',
                          display: 'block',
                        }}
                      >
                        {sm.tempRangeLabel}
                      </span>
                      {isActive && (
                        <ClayBadge color="emerald" icon={<CheckCircle2 size={13} />}>
                          ACTIVE MODE
                        </ClayBadge>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--clay-text-secondary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                    {sm.description}
                  </p>

                  {/* Suitable vegetables list */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clay-text-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                      Suitable Produce ({crops.length} crops):
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {crops.map((c) => {
                        const isGarlic = c.id === 'garlic';
                        const isCurrentActive = activeCrop === c.id;
                        return (
                          <span
                            key={c.id}
                            id={`crop-badge-${c.id}`}
                            onClick={() => setActiveCropAndMode(c.id, modeId)}
                            style={{
                              fontSize: '0.78rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: isCurrentActive ? 'var(--clay-accent-primary)' : isGarlic ? '#FEF3C7' : '#FFFFFF',
                              color: isCurrentActive ? '#FFFFFF' : isGarlic ? '#92400E' : 'var(--clay-text-primary)',
                              fontWeight: 700,
                              boxShadow: 'var(--shadow-clay-subtle)',
                              cursor: 'pointer',
                              border: isGarlic ? '1px dashed #F59E0B' : '1px solid rgba(160, 150, 180, 0.2)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                            title={isGarlic ? 'Source specifies 0–C (Typo in reference, verification required)' : `${c.name} (${c.temperatureRangeText})`}
                          >
                            {c.name}
                            {isGarlic && <AlertTriangle size={11} color="#D97706" />}
                          </span>
                        );
                      })}
                    </div>

                    {modeId === 'MODE_1' && (
                      <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.75rem', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-input)', fontSize: '0.75rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                        <span><strong>Garlic:</strong> Source specifies "0–C" (Typo). Marked as <em>Requires Verification</em> per scientific protocol.</span>
                      </div>
                    )}
                  </div>

                  {/* Mode Selection Button */}
                  <button
                    type="button"
                    id={`activate-mode-btn-${modeId}`}
                    disabled={isActive}
                    onClick={() => setActiveModeOnly(modeId)}
                    className={`clay-btn ${isActive ? 'clay-btn-secondary' : 'clay-btn-primary'}`}
                    style={{
                      width: '100%',
                      height: '42px',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      opacity: isActive ? 0.8 : 1,
                    }}
                  >
                    {isActive ? '✓ Currently Active Mode' : `Set Mode: ${sm.name} (${sm.tempRangeLabel})`}
                  </button>
                </ClayCard>
              );
            })}
          </div>
        </div>

        {/* 4. Detailed Stored Produce Batches */}
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.5rem',
            fontWeight: 800,
            marginBottom: '1.25rem',
          }}
        >
          Active Produce Batches in Storage
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {produceBatches.map((batch) => (
            <ClayCard key={batch.id} style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{batch.produce_type}</h4>
                    <ClayBadge color="emerald">ACTIVE BATCH</ClayBadge>
                  </div>
                  <p style={{ color: 'var(--clay-text-secondary)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                    Batch ID: {batch.id} &bull; Origin: {batch.farmer_identifier}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-primary)' }}>
                    {batch.notes}
                  </p>
                </div>

                <div style={{ textAlign: 'right', minWidth: '140px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Batch Mass
                  </span>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-text-primary)' }}>
                    {batch.quantity_kg} <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>kg</span>
                  </span>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--clay-accent-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                    Small-Batch Prototype Crate
                  </span>
                </div>
              </div>
            </ClayCard>
          ))}
        </div>
      </ClaySection>
    </div>
  );
};
