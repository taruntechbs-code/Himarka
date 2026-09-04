import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  SunMedium,
  BatteryCharging,
  Zap,
  Cpu,
} from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClayMetric } from '@/components/clay/ClayMetric';
import { ClaySection } from '@/components/clay/ClaySection';
import { ClayTelemetryChart } from '@/components/charts/ClayTelemetryChart';

export const EnergyShell: React.FC = () => {
  const { t } = useTranslation();
  const { energy, history, mode } = useTelemetry();

  const solarW = Math.round(energy.solar_power_w ?? 50);
  const batterySoc = Math.round(energy.battery_soc_percent ?? 94);
  const coolingW = Number((energy.cooling_power_w ?? 38.5).toFixed(1));
  const auxW = Number((energy.auxiliary_power_w ?? 4.2).toFixed(1));
  const gridW = Number((energy.grid_fallback_w ?? 0).toFixed(1));
  const solarV = Number((energy.solar_voltage_v ?? 19.4).toFixed(1));
  const batteryV = Number((energy.battery_voltage_v ?? 26.8).toFixed(1));

  return (
    <div id="energy-shell" style={{ width: '100%' }}>
      <ClaySection
        title={t('energy.title')}
        subtitle={t('energy.subtitle')}
        badge={
          mode === 'DEMO' ? (
            <ClayBadge color="amber">{t('energy.simulatedEnergyLoop', 'SIMULATED ENERGY LOOP')}</ClayBadge>
          ) : (
            <ClayBadge color="emerald">{t('energy.livePowerBus', 'LIVE POWER BUS')}</ClayBadge>
          )
        }
      >
        {/* Power Flow Hero Card */}
        <ClayCard variant="deep" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="clay-badge clay-badge-emerald" style={{ marginBottom: '0.4rem' }}>
                {t('energy.pvMicrogrid', 'PHOTOVOLTAIC MICROGRID')}
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                {t('energy.gridStatus')}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {t('energy.netEnergyBalance', 'Net Energy Balance')}
              </span>
              <p style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--clay-success)' }}>
                +{(solarW - (coolingW + auxW)).toFixed(1)} W {t('energy.surplus', 'Surplus')}
              </p>
            </div>
          </div>

          {/* Flow Diagram / Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              padding: '1.5rem',
              backgroundColor: '#FAF8FD',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-clay-recessed)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {t('energy.solarGeneration', 'Solar Generation')}
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#F59E0B', margin: '0.2rem 0' }}>
                {solarW} W
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)' }}>
                {t('energy.bus', 'Bus')}: {solarV} V
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {t('energy.batteryBuffer', 'Battery Storage Buffer')}
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#DB2777', margin: '0.2rem 0' }}>
                {batterySoc}%
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)' }}>
                {t('energy.terminal', 'Terminal')}: {batteryV} V
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {t('energy.coolingCompressorDraw', 'Cooling Compressor Draw')}
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#7C3AED', margin: '0.2rem 0' }}>
                {coolingW} W
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)' }}>
                {t('energy.brushlessDcDrive', 'Brushless DC Drive')}
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {t('energy.gridFallback', 'Grid Fallback Draw')}
              </span>
              <p style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#10B981', margin: '0.2rem 0' }}>
                {gridW} W
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)' }}>
                {t('energy.zeroDependency', 'Zero Dependency')}
              </span>
            </div>
          </div>
        </ClayCard>

        {/* 4 Energy Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <ClayMetric
            label={t('energy.batteryCapacity')}
            value={batterySoc}
            unit="%"
            icon={<BatteryCharging size={24} />}
            iconColor="pink"
            statusText={t('status.healthy', 'HEALTHY')}
            statusColor="emerald"
            supportingText={`${t('energy.terminal', 'Terminal')}: ${batteryV} V`}
          />

          <ClayMetric
            label={t('energy.generation')}
            value={solarW}
            unit="W"
            icon={<SunMedium size={24} />}
            iconColor="amber"
            statusText={t('status.active', 'ACTIVE')}
            statusColor="emerald"
            supportingText={`${t('energy.bus', 'Bus')}: ${solarV} V`}
          />

          <ClayMetric
            label={t('energy.coolingConsumption')}
            value={coolingW}
            unit="W"
            icon={<Zap size={24} />}
            iconColor="violet"
            statusText={t('status.running', 'RUNNING')}
            statusColor="emerald"
            supportingText={t('energy.thermalInverter', 'Thermal Inverter Active')}
          />

          <ClayMetric
            label={t('energy.auxiliaryConsumption')}
            value={auxW}
            unit="W"
            icon={<Cpu size={24} />}
            iconColor="sky"
            statusText={t('status.online', 'ONLINE')}
            statusColor="emerald"
            supportingText={t('energy.microcontroller', 'Microcontroller Core')}
          />
        </div>

        {/* Energy Generation & Storage Trend */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <ClayTelemetryChart
            title={t('energy.solarPowerProfile', 'Solar Power Profile (Watts)')}
            subtitle={t('energy.solarPowerProfileDesc', 'Photovoltaic power generation over daytime irradiance')}
            data={history}
            dataKey="solar_power_w"
            unit=" W"
            strokeColor="#F59E0B"
            fillGradientId="energySolarGrad"
            gradientFrom="rgba(245, 158, 11, 0.45)"
            gradientTo="rgba(245, 158, 11, 0.02)"
            minDomain={0}
            maxDomain={80}
          />

          <ClayTelemetryChart
            title={t('energy.batterySocBuffer', 'Battery State of Charge Buffer (%)')}
            subtitle={t('energy.batterySocBufferDesc', 'Continuous battery SOC tracking diurnal storage')}
            data={history}
            dataKey="battery_percent"
            unit="%"
            strokeColor="#DB2777"
            fillGradientId="energyBatteryGrad"
            gradientFrom="rgba(219, 39, 119, 0.45)"
            gradientTo="rgba(219, 39, 119, 0.02)"
            minDomain={70}
            maxDomain={100}
          />
        </div>
      </ClaySection>
    </div>
  );
};
