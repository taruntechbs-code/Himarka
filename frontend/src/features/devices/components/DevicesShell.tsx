import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClaySection } from '@/components/clay/ClaySection';

export const DevicesShell: React.FC = () => {
  const { t } = useTranslation();
  const { device, telemetry, mode, lastUpdated } = useTelemetry();

  return (
    <div id="devices-shell" style={{ width: '100%' }}>
      <ClaySection
        title={t('devices.title')}
        subtitle={t('devices.subtitle')}
        badge={
          mode === 'DEMO' ? (
            <ClayBadge color="amber">{t('devices.simulatedDevice', 'SIMULATED DEVICE')}</ClayBadge>
          ) : (
            <ClayBadge color="emerald">{t('devices.physicalHardware', 'PHYSICAL HARDWARE')}</ClayBadge>
          )
        }
      >
        {/* Primary Edge Node Card */}
        <ClayCard variant="deep" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <span className="clay-badge clay-badge-violet">
                  {t('devices.masterIotController', 'MASTER IOT CONTROLLER')}
                </span>
                <ClayBadge color="emerald" pulse>
                  {t(`status.${device.status.toLowerCase()}`, device.status)}
                </ClayBadge>
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                {device.device_id}
              </h3>
              <p style={{ color: 'var(--clay-text-secondary)', fontSize: '0.9rem' }}>
                {device.hardware_type} &bull; Target Unit: {device.storage_unit_id}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                {t('devices.dataFreshness', 'Data Freshness')}
              </span>
              <p style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-success)' }}>
                {t('devices.liveStreamActive', 'Live Stream Active')}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)' }}>
                {t('devices.heartbeatLabel', 'Heartbeat')}: {lastUpdated}
              </span>
            </div>
          </div>

          {/* Node Spec Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              padding: '1.5rem',
              backgroundColor: '#FAF8FD',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-clay-recessed)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                {t('devices.firmwareVersion', 'Firmware Version')}
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.2rem' }}>
                {device.firmware_version}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                {t('devices.networkMode', 'Network IP & Mode')}
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.2rem' }}>
                {device.ip_address} (WiFi AP/STA)
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                {t('devices.coolingRelayState', 'Cooling Relay State')}
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: telemetry.cooling_active ? 'var(--clay-success)' : 'var(--clay-warning)', marginTop: '0.2rem' }}>
                {telemetry.cooling_active ? t('status.pinHigh', 'PIN HIGH (ENGAGED)') : t('status.pinLow', 'PIN LOW (OFF)')}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                {t('devices.clockSkewGuard', 'Clock Skew Guard')}
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.2rem' }}>
                {t('status.clockValidated', '±1.2s Validated')}
              </p>
            </div>
          </div>
        </ClayCard>

        {/* Connected Hardware Sensors Suite */}
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          {t('devices.connectedPeripherals', 'Connected Sensor Peripherals')}
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <ClayCard style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--clay-success)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>SHT31 (I2C)</h4>
              </div>
              <ClayBadge color="emerald">{t('status.online', 'ONLINE')}</ClayBadge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)' }}>
              {t('devices.sht31Desc', 'I2C Bus Address 0x44 • High Accuracy ±0.2°C / ±2% RH')}
            </p>
          </ClayCard>

          <ClayCard style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--clay-success)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>MQ-135 (ADC Pin 34)</h4>
              </div>
              <ClayBadge color="emerald">{t('status.online', 'ONLINE')}</ClayBadge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)' }}>
              {t('devices.mq135Desc', 'Analog Input Pin 34 • Volatile Organic Compounds & Spoilage Gases')}
            </p>
          </ClayCard>

          <ClayCard style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="var(--clay-warning)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>OV2640 Camera</h4>
              </div>
              <ClayBadge color="amber">{t('status.standby', 'STANDBY')}</ClayBadge>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)' }}>
              {t('devices.ov2640Desc', 'SPI / DVP Interface • 2MP Sensor for Chamber Crop Monitoring')}
            </p>
          </ClayCard>
        </div>
      </ClaySection>
    </div>
  );
};
