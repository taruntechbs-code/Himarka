import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  AlertCircle,
  Scan,
  Info,
  CheckCircle2,
  AlertTriangle,
  Check,
  RotateCcw,
  Sparkles,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClaySection } from '@/components/clay/ClaySection';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  STORAGE_MODES,
  VEGETABLE_PROFILES,
  StorageModeId,
  getVegetableProfile,
} from '@/domain/temperatureProfiles';

export const ProduceShell: React.FC = () => {
  const { t } = useTranslation();
  const {
    activeCrop,
    setActiveCropAndMode,
    detectionState,
    simulateDemoDetection,
    confirmDetection,
    resetDetection,
  } = useTelemetry();

  const [selectedFilterMode, setSelectedFilterMode] = useState<StorageModeId | 'ALL'>('ALL');

  const vegetableList = Object.values(VEGETABLE_PROFILES);
  const filteredVegetables = selectedFilterMode === 'ALL'
    ? vegetableList
    : vegetableList.filter((v) => v.preferredMode === selectedFilterMode);

  return (
    <div id="produce-shell" style={{ width: '100%' }}>
      <ClaySection
        title={t('ai.title', 'Produce Intelligence & Crop Detection')}
        subtitle={t('ai.subtitle', 'Automatic vegetable classification, temperature mode recommendation, and produce profile browser')}
        badge={<ClayBadge color="violet">EDGE INTELLIGENCE</ClayBadge>}
      >
        {/* 1. AUTOMATIC VEGETABLE DETECTION PIPELINE (Sections 11–15, 20–22, 28–29) */}
        <ClayCard variant="deep" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <span className="clay-badge clay-badge-emerald">
                  YOLOv8 + OPENCV PIPELINE
                </span>
                <ClayBadge color={detectionState.source === 'DEMO' ? 'amber' : 'emerald'}>
                  {detectionState.source === 'DEMO' ? 'DETECTION SOURCE: DEMO' : 'DETECTION SOURCE: LIVE HARDWARE'}
                </ClayBadge>
                {detectionState.status !== 'IDLE' && (
                  <ClayBadge color="violet">
                    STATUS: {detectionState.status}
                  </ClayBadge>
                )}
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--clay-text-primary)', margin: '0 0 0.3rem 0' }}>
                {t('ai.detectionTitle', 'Automatic Vegetable Detection')}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
                ESP32-CAM &bull; Frame Capture &bull; Edge Inference &bull; Crop Profile Lookup &bull; Farmer Confirmation
              </p>
            </div>

            <a
              href="#manual-crop-browser"
              className="clay-btn clay-btn-secondary"
              style={{ fontSize: '0.82rem', height: '36px', padding: '0 1rem' }}
            >
              <span>{t('ai.manualFallback', 'Select Crop Manually')}</span>
              <ArrowDown size={14} />
            </a>
          </div>

          {/* Interactive Pipeline State Renderer */}
          <div
            id="detection-state-container"
            style={{
              padding: '1.5rem',
              backgroundColor: '#FAF8FD',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-clay-card)',
              border: '1px solid rgba(160, 150, 180, 0.2)',
              marginBottom: '1.75rem',
            }}
          >
            {/* Case A: IDLE / WAITING */}
            {detectionState.status === 'IDLE' && (
              <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'var(--shadow-clay-orb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--clay-accent-primary)',
                    margin: '0 auto 1rem auto',
                  }}
                >
                  <Scan size={32} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.4rem' }}>
                  Camera Ready — Waiting for Produce
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--clay-text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                  Place harvested vegetables in front of the cold box inspection camera. The system will classify the produce and recommend the validated storage mode.
                </p>
              </div>
            )}

            {/* Case B: DETECTED (High Confidence) */}
            {detectionState.status === 'DETECTED' && detectionState.detectedCrops.length > 0 && (
              <div id="detection-result-box" style={{ animation: 'fadeIn 0.25s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                      <ClayBadge color="emerald" icon={<CheckCircle2 size={13} />}>
                        CROP IDENTIFIED
                      </ClayBadge>
                      <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700 }}>
                        Confidence: {Math.round((detectionState.confidences[detectionState.detectedCrops[0]] || 0.9) * 100)}%
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--clay-accent-primary)', margin: 0 }}>
                      {getVegetableProfile(detectionState.detectedCrops[0])?.name || detectionState.detectedCrops[0]} Detected
                    </h4>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                      Recommended Storage Mode
                    </span>
                    <strong style={{ fontSize: '1.4rem', color: 'var(--clay-text-primary)' }}>
                      {detectionState.recommendedMode ? STORAGE_MODES[detectionState.recommendedMode].name : 'Mode 3'} ({detectionState.recommendedMode ? STORAGE_MODES[detectionState.recommendedMode].tempRangeLabel : '10–13°C'})
                    </strong>
                  </div>
                </div>

                {/* Storage Recommendation Details */}
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-medium)',
                    boxShadow: 'var(--shadow-clay-subtle)',
                    marginBottom: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Vegetable Temperature Profile
                    </span>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clay-text-primary)', margin: '0.2rem 0' }}>
                      {detectionState.targetRangeText || '13–15°C'}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)' }}>
                      Crop biology baseline
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Chamber Preset Mode
                    </span>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clay-accent-primary)', margin: '0.2rem 0' }}>
                      {detectionState.recommendedMode ? STORAGE_MODES[detectionState.recommendedMode].title : 'Chilling-sensitive produce'}
                    </p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)' }}>
                      Validated controller bounds
                    </span>
                  </div>
                </div>

                {/* Farmer Confirmation Action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    id="confirm-detection-button"
                    onClick={confirmDetection}
                    className="clay-btn clay-btn-primary"
                    style={{ height: '46px', padding: '0 1.75rem', fontSize: '0.95rem', fontWeight: 800 }}
                  >
                    <Check size={18} />
                    <span>Confirm Storage Mode ({detectionState.recommendedMode ? STORAGE_MODES[detectionState.recommendedMode].name : 'Mode 3'})</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetDetection}
                    className="clay-btn clay-btn-secondary"
                    style={{ height: '46px', padding: '0 1.25rem', fontSize: '0.85rem' }}
                  >
                    <RotateCcw size={15} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case C: LOW CONFIDENCE (< 60%) */}
            {detectionState.status === 'LOW_CONFIDENCE' && (
              <div id="low-confidence-box" style={{ animation: 'fadeIn 0.25s ease' }}>
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#FEF3C7',
                    borderRadius: 'var(--radius-medium)',
                    border: '1px solid #FDE68A',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                  }}
                >
                  <AlertTriangle size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#92400E', margin: '0 0 0.3rem 0' }}>
                      Detection Confidence is Low ({Math.round((detectionState.confidences[detectionState.detectedCrops[0]] || 0.54) * 100)}%)
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#B45309', margin: 0, lineHeight: 1.45 }}>
                      The optical model is uncertain about the detected produce. To protect your produce from cold injury or spoilage, manual confirmation is strictly required.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={confirmDetection}
                    className="clay-btn clay-btn-secondary"
                    style={{ height: '42px', fontSize: '0.88rem' }}
                  >
                    <span>Confirm as {getVegetableProfile(detectionState.detectedCrops[0])?.name || 'Tomato'}</span>
                  </button>
                  <a
                    href="#manual-crop-browser"
                    className="clay-btn clay-btn-primary"
                    style={{ height: '42px', fontSize: '0.88rem' }}
                  >
                    <span>Select Crop Manually</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetDetection}
                    className="clay-btn clay-btn-outline"
                    style={{ height: '42px', fontSize: '0.88rem' }}
                  >
                    <span>Rescan</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case D: MULTIPLE INCOMPATIBLE CROPS DETECTED */}
            {detectionState.status === 'MULTIPLE_DETECTED' && (
              <div id="multiple-incompatible-box" style={{ animation: 'fadeIn 0.25s ease' }}>
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#FEE2E2',
                    borderRadius: 'var(--radius-medium)',
                    border: '1px solid #FECACA',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                  }}
                >
                  <AlertCircle size={24} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#991B1B', margin: '0 0 0.3rem 0' }}>
                      Multiple Crops Detected with Conflicting Temperature Requirements!
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: '#B91C1C', margin: 0, lineHeight: 1.5 }}>
                      {detectionState.warning || 'These crops require different storage conditions. Mixing them in the same temperature preset is not recommended.'}
                    </p>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--clay-text-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Select which produce group you want to regulate the chamber for:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  {detectionState.detectedCrops.map((cropId) => {
                    const prof = getVegetableProfile(cropId);
                    if (!prof) return null;
                    const sm = STORAGE_MODES[prof.preferredMode];

                    return (
                      <div
                        key={cropId}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#FFFFFF',
                          borderRadius: 'var(--radius-medium)',
                          boxShadow: 'var(--shadow-clay-subtle)',
                          border: '1px solid rgba(160, 150, 180, 0.25)',
                        }}
                      >
                        <strong style={{ fontSize: '1.1rem', color: 'var(--clay-text-primary)', display: 'block' }}>
                          {prof.name}
                        </strong>
                        <span style={{ fontSize: '0.82rem', color: 'var(--clay-accent-primary)', fontWeight: 700 }}>
                          Requires {sm.name} ({sm.tempRangeLabel})
                        </span>
                        <div style={{ marginTop: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCropAndMode(cropId, prof.preferredMode);
                              resetDetection();
                            }}
                            className="clay-btn clay-btn-secondary"
                            style={{ width: '100%', height: '36px', fontSize: '0.8rem' }}
                          >
                            Set Chamber to {prof.name}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={resetDetection}
                  className="clay-btn clay-btn-outline"
                  style={{ height: '38px', fontSize: '0.82rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Clear and Rescan</span>
                </button>
              </div>
            )}

            {/* Case E: UNAVAILABLE */}
            {detectionState.status === 'UNAVAILABLE' && (
              <div id="detection-unavailable-box">
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: '#FEF3C7',
                    borderRadius: 'var(--radius-medium)',
                    border: '1px solid #FDE68A',
                    marginBottom: '1rem',
                  }}
                >
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#92400E', margin: '0 0 0.3rem 0' }}>
                    Camera Unavailable / AI Detection Not Configured
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#B45309', margin: 0 }}>
                    {detectionState.warning || 'Edge camera or ML inference service is not online. Please use manual crop selection below.'}
                  </p>
                </div>

                <a
                  href="#manual-crop-browser"
                  className="clay-btn clay-btn-primary"
                  style={{ height: '42px', fontSize: '0.88rem' }}
                >
                  <span>Select Crop Manually</span>
                </a>
              </div>
            )}

            {/* Interactive Demo Test Controller (Strictly labeled as DEMO per Sections 13, 28, 29) */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px dashed rgba(160, 150, 180, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.3rem', color: '#F59E0B' }} />
                  Demo Verification Scenarios (Clearly labeled simulated sources)
                </span>
                <ClayBadge color="amber">EVALUATION TOOLBAR</ClayBadge>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  id="test-demo-tomato-high"
                  onClick={() => simulateDemoDetection('TOMATO_HIGH')}
                  className="clay-btn clay-btn-secondary"
                  style={{ fontSize: '0.75rem', height: '32px', padding: '0 0.75rem' }}
                >
                  Tomato (92% → Mode 3)
                </button>

                <button
                  type="button"
                  id="test-demo-cabbage-high"
                  onClick={() => simulateDemoDetection('CABBAGE_HIGH')}
                  className="clay-btn clay-btn-secondary"
                  style={{ fontSize: '0.75rem', height: '32px', padding: '0 0.75rem' }}
                >
                  Cabbage (95% → Mode 1)
                </button>

                <button
                  type="button"
                  id="test-demo-tomato-low"
                  onClick={() => simulateDemoDetection('TOMATO_LOW')}
                  className="clay-btn clay-btn-secondary"
                  style={{ fontSize: '0.75rem', height: '32px', padding: '0 0.75rem' }}
                >
                  Low Confidence (54%)
                </button>

                <button
                  type="button"
                  id="test-demo-mixed-incompatible"
                  onClick={() => simulateDemoDetection('MIXED_INCOMPATIBLE')}
                  className="clay-btn clay-btn-secondary"
                  style={{ fontSize: '0.75rem', height: '32px', padding: '0 0.75rem' }}
                >
                  Incompatible Mixed (Tomato + Cabbage)
                </button>

                <button
                  type="button"
                  id="test-demo-unavailable"
                  onClick={() => simulateDemoDetection('UNAVAILABLE')}
                  className="clay-btn clay-btn-outline"
                  style={{ fontSize: '0.75rem', height: '32px', padding: '0 0.75rem' }}
                >
                  Camera Offline
                </button>

                <button
                  type="button"
                  onClick={() => simulateDemoDetection('RESET')}
                  className="clay-btn clay-btn-outline"
                  style={{ fontSize: '0.75rem', height: '32px', padding: '0 0.75rem' }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </ClayCard>

        {/* 2. SUB-SYSTEM SEPARATION: AI PREDICTION (Strictly NOT CONFIGURED) */}
        <div style={{ marginBottom: '2.5rem' }}>
          <ClayCard
            style={{
              padding: '2rem',
              border: '2px dashed rgba(245, 158, 11, 0.5)',
              backgroundColor: 'rgba(255, 251, 235, 0.4)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span className="clay-badge clay-badge-amber">
                    ML MODEL CHECKPOINT
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      color: '#B45309',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {t('ai.notConfigured', 'NOT CONFIGURED')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{t('ai.predictionTitle', 'AI Spoilage & Shelf-life Prediction')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)' }}>
                  {t('ai.predictionSubtitle', 'Predictive shelf-life degradation modeling')}
                </p>
              </div>
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
                <AlertCircle size={24} />
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-medium)',
                boxShadow: 'var(--shadow-clay-card)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Info size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#92400E', marginBottom: '0.3rem' }}>
                    Trained Machine Learning Model Awaiting Checkpoint Deployment
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    In compliance with the Phase 0/1 zero-fabrication standard, shelf-life prediction is not faked. Physical preservation operates strictly on validated temperature profiles (Mode 1, Mode 2, Mode 3).
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.82rem' }}>
              <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-input)' }}>
                <span style={{ color: 'var(--clay-text-secondary)', fontWeight: 700, display: 'block' }}>
                  Model Architecture
                </span>
                <span style={{ fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  MobileNetV3-Small (Edge)
                </span>
              </div>
              <div style={{ padding: '0.85rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-input)' }}>
                <span style={{ color: 'var(--clay-text-secondary)', fontWeight: 700, display: 'block' }}>
                  Registry Status
                </span>
                <span style={{ fontWeight: 800, color: '#D97706' }}>
                  Awaiting Weights File
                </span>
              </div>
            </div>
          </ClayCard>
        </div>

        {/* 3. OPTICAL HARDWARE STREAM (ESP32-CAM / OV2640) */}
        <ClayCard variant="deep" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <span className="clay-badge clay-badge-violet">
                  HARDWARE STREAM INTERFACE
                </span>
                <ClayBadge color="amber">CAMERA OFFLINE</ClayBadge>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t('ai.visionTitle', 'ESP32-CAM / OV2640 Stream')}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--clay-text-secondary)' }}>
                Direct optical telemetry from cold chamber ESP32-CAM OV2640 module
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--clay-text-secondary)', fontWeight: 600 }}>
                Resolution: 1600×1200 (UXGA max) &bull; Frame: MJPEG Stream
              </span>
            </div>
          </div>

          <div
            id="camera-stream-canvas"
            style={{
              width: '100%',
              minHeight: '260px',
              backgroundColor: '#FAF8FD',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-clay-recessed)',
              border: '2px dashed rgba(160, 150, 180, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: 'var(--shadow-clay-orb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--clay-accent-primary)',
                marginBottom: '1rem',
              }}
            >
              <Camera size={36} />
            </div>

            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, color: 'var(--clay-text-primary)', marginBottom: '0.3rem' }}>
              {t('ai.cameraOffline', 'CAMERA OFFLINE')}
            </h4>

            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 800, color: '#B45309', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
              {t('ai.waitingForDevice', 'WAITING FOR EDGE HARDWARE STREAM')}
            </p>

            <p style={{ maxWidth: '500px', fontSize: '0.82rem', color: 'var(--clay-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              The optical stream requires active connection to an ESP32-CAM module on the local subnet. Authentic placeholder shown in compliance with zero-fabrication standards.
            </p>
          </div>
        </ClayCard>

        {/* 4. SCIENTIFIC 24-VEGETABLE BROWSER & MANUAL SELECTOR (Section 6, 7, 10, 43, 49) */}
        <div id="manual-crop-browser" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--clay-text-primary)', margin: '0 0 0.3rem 0' }}>
                <Layers size={22} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.4rem', color: 'var(--clay-accent-primary)' }} />
                Vegetable Temperature Profile Browser (24 Crops)
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
                Validated crop storage baselines. Click any vegetable to configure its recommended operating mode:
              </p>
            </div>

            {/* Mode Filter Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSelectedFilterMode('ALL')}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: selectedFilterMode === 'ALL' ? '2px solid var(--clay-accent-primary)' : '1px solid rgba(160, 150, 180, 0.25)',
                  backgroundColor: selectedFilterMode === 'ALL' ? 'var(--clay-accent-primary)' : '#FFFFFF',
                  color: selectedFilterMode === 'ALL' ? '#FFFFFF' : 'var(--clay-text-primary)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                All (24)
              </button>
              {(['MODE_1', 'MODE_2', 'MODE_3'] as StorageModeId[]).map((mId) => (
                <button
                  key={mId}
                  type="button"
                  onClick={() => setSelectedFilterMode(mId)}
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedFilterMode === mId ? '2px solid var(--clay-accent-primary)' : '1px solid rgba(160, 150, 180, 0.25)',
                    backgroundColor: selectedFilterMode === mId ? 'var(--clay-accent-primary)' : '#FFFFFF',
                    color: selectedFilterMode === mId ? '#FFFFFF' : 'var(--clay-text-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {STORAGE_MODES[mId].name} ({STORAGE_MODES[mId].tempRangeLabel})
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Vegetable Profile Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {filteredVegetables.map((crop) => {
              const isSelected = activeCrop === crop.id;
              const modeInfo = STORAGE_MODES[crop.preferredMode];
              const isGarlic = crop.id === 'garlic';

              return (
                <ClayCard
                  key={crop.id}
                  id={`crop-card-${crop.id}`}
                  style={{
                    padding: '1.25rem',
                    border: isSelected ? '2px solid var(--clay-accent-primary)' : isGarlic ? '1px dashed #F59E0B' : '1px solid rgba(160, 150, 180, 0.2)',
                    backgroundColor: isSelected ? '#FFFFFF' : isGarlic ? '#FFFDF5' : '#FAF8FD',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--clay-text-primary)', margin: 0 }}>
                        {crop.name}
                      </h4>
                      <ClayBadge color={crop.preferredMode === 'MODE_1' ? 'sky' : crop.preferredMode === 'MODE_2' ? 'amber' : 'violet'}>
                        {modeInfo.name}
                      </ClayBadge>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontStyle: 'italic', marginBottom: '0.6rem' }}>
                      {crop.aliases.join(', ')}
                    </p>

                    <div style={{ padding: '0.6rem 0.75rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-input)', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                        Vegetable Range
                      </span>
                      <strong style={{ fontSize: '1rem', color: isGarlic ? '#B45309' : 'var(--clay-text-primary)' }}>
                        {crop.temperatureRangeText}
                      </strong>
                    </div>

                    {isGarlic && (
                      <div style={{ padding: '0.5rem', backgroundColor: '#FEF3C7', borderRadius: 'var(--radius-input)', fontSize: '0.72rem', color: '#92400E', marginBottom: '0.75rem' }}>
                        <AlertTriangle size={12} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.2rem' }} />
                        Source value "0–C" requires verification before setting dedicated target.
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    id={`select-crop-btn-${crop.id}`}
                    onClick={() => setActiveCropAndMode(crop.id, crop.preferredMode)}
                    className={`clay-btn ${isSelected ? 'clay-btn-secondary' : 'clay-btn-outline'}`}
                    style={{ width: '100%', height: '36px', fontSize: '0.82rem', fontWeight: 800 }}
                  >
                    {isSelected ? '✓ Currently Selected' : `Select ${crop.name} (${modeInfo.name})`}
                  </button>
                </ClayCard>
              );
            })}
          </div>
        </div>
      </ClaySection>
    </div>
  );
};
