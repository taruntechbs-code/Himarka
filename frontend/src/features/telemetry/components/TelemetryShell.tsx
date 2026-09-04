import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  Thermometer,
  Wind,
  Sun,
  BatteryCharging,
} from 'lucide-react';
import { ClaySection } from '@/components/clay/ClaySection';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClayButton } from '@/components/clay/ClayButton';
import { ClayTelemetryChart } from '@/components/charts/ClayTelemetryChart';

export const TelemetryShell: React.FC = () => {
  const { t } = useTranslation();
  const { history, mode } = useTelemetry();
  const [selectedRange, setSelectedRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');

  // Filter history based on selected range
  const filteredHistory = React.useMemo(() => {
    if (selectedRange === '1h') return history.slice(-6);
    if (selectedRange === '6h') return history.slice(-12);
    return history;
  }, [history, selectedRange]);

  return (
    <div id="telemetry-shell" style={{ width: '100%' }}>
      <ClaySection
        title={t('telemetry.title')}
        subtitle={t('telemetry.subtitle')}
        badge={
          mode === 'DEMO' ? (
            <ClayBadge color="amber">SIMULATED HISTORICAL DATA</ClayBadge>
          ) : (
            <ClayBadge color="emerald">LIVE INGESTION</ClayBadge>
          )
        }
        actions={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#FFFFFF',
              padding: '0.35rem',
              borderRadius: 'var(--radius-button)',
              boxShadow: 'var(--shadow-clay-card)',
            }}
          >
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <ClayButton
                key={r}
                variant={selectedRange === r ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedRange(r)}
                style={{
                  height: '38px',
                  minHeight: '38px',
                  padding: '0 0.9rem',
                  fontSize: '0.8rem',
                }}
              >
                {t(`telemetry.ranges.${r}`)}
              </ClayButton>
            ))}
          </div>
        }
      >
        {/* Quick Diagnostic Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-medium)',
              boxShadow: 'var(--shadow-clay-card)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
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
              <Thermometer size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Temp Range (24h)
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                2.2°C &bull; 3.0°C
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-medium)',
              boxShadow: 'var(--shadow-clay-card)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-orb)',
                background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
              }}
            >
              <Wind size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Air Quality Avg
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                208 ppm
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-medium)',
              boxShadow: 'var(--shadow-clay-card)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
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
              <Sun size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Peak Solar (24h)
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                68 Watts
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-medium)',
              boxShadow: 'var(--shadow-clay-card)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-orb)',
                background: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#DB2777',
              }}
            >
              <BatteryCharging size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Min Battery SoC
              </span>
              <p style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                84%
              </p>
            </div>
          </div>
        </div>

        {/* 4 Clay Telemetry Time-Series Charts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Chart 1: Temperature */}
          <ClayTelemetryChart
            id="analytics-chart-temp"
            title="Chamber Temperature History (°C)"
            subtitle="Internal cold chamber temperature record sampled across period"
            data={filteredHistory}
            dataKey="temperature_c"
            unit="°C"
            strokeColor="#7C3AED"
            fillGradientId="analyticsTempGrad"
            gradientFrom="rgba(124, 58, 237, 0.45)"
            gradientTo="rgba(124, 58, 237, 0.02)"
            minDomain={0}
            maxDomain={5}
          />

          {/* Chart 2: Gas ppm */}
          <ClayTelemetryChart
            id="analytics-chart-gas"
            title="Air Quality & Volatiles (MQ-135 ppm)"
            subtitle="Raw gas resistance reading indicating air freshness and ventilation"
            data={filteredHistory}
            dataKey="gas_ppm"
            unit=" ppm"
            strokeColor="#10B981"
            fillGradientId="analyticsGasGrad"
            gradientFrom="rgba(16, 185, 129, 0.45)"
            gradientTo="rgba(16, 185, 129, 0.02)"
            minDomain={150}
            maxDomain={280}
          />

          {/* Chart 3: Solar Power Generation */}
          <ClayTelemetryChart
            id="analytics-chart-solar"
            title="Photovoltaic Solar Power (Watts)"
            subtitle="Solar panel generation tracking daylight cycles"
            data={filteredHistory}
            dataKey="solar_power_w"
            unit=" W"
            strokeColor="#F59E0B"
            fillGradientId="analyticsSolarGrad"
            gradientFrom="rgba(245, 158, 11, 0.45)"
            gradientTo="rgba(245, 158, 11, 0.02)"
            minDomain={0}
            maxDomain={80}
          />

          {/* Chart 4: Battery SoC */}
          <ClayTelemetryChart
            id="analytics-chart-battery"
            title="Lithium Battery State of Charge (%)"
            subtitle="Battery pack energy storage buffer level"
            data={filteredHistory}
            dataKey="battery_percent"
            unit="%"
            strokeColor="#DB2777"
            fillGradientId="analyticsBatteryGrad"
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
