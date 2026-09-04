import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ClayCard } from '../clay/ClayCard';
import { TelemetryHistoryPoint } from '@/services/telemetry/TelemetryContext';

interface ClayTelemetryChartProps {
  title: string;
  subtitle?: string;
  data: TelemetryHistoryPoint[];
  dataKey: keyof TelemetryHistoryPoint;
  unit: string;
  strokeColor?: string;
  fillGradientId: string;
  gradientFrom?: string;
  gradientTo?: string;
  minDomain?: number | 'auto';
  maxDomain?: number | 'auto';
  id?: string;
}

export const ClayTelemetryChart: React.FC<ClayTelemetryChartProps> = ({
  title,
  subtitle,
  data,
  dataKey,
  unit,
  strokeColor = '#7C3AED',
  fillGradientId,
  gradientFrom = 'rgba(124, 58, 237, 0.4)',
  gradientTo = 'rgba(124, 58, 237, 0.01)',
  minDomain = 'auto',
  maxDomain = 'auto',
  id,
}) => {
  return (
    <ClayCard id={id} className="clay-chart-container" style={{ padding: '1.75rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: 'var(--clay-text-primary)',
            marginBottom: '0.2rem',
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          width: '100%',
          height: '240px',
          backgroundColor: '#FAF8FD',
          borderRadius: 'var(--radius-medium)',
          boxShadow: 'var(--shadow-clay-recessed)',
          padding: '1rem 0.5rem 0.5rem 0',
          boxSizing: 'border-box',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientFrom} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientTo} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 150, 180, 0.15)" vertical={false} />
            <XAxis
              dataKey="timeLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#635F69', fontSize: 11, fontFamily: 'var(--font-body)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              domain={[minDomain, maxDomain]}
              tick={{ fill: '#635F69', fontSize: 11, fontFamily: 'var(--font-body)' }}
              tickFormatter={(v) => `${v}${unit}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-button)',
                        boxShadow: 'var(--shadow-clay-card)',
                        padding: '0.6rem 0.9rem',
                        border: '1px solid rgba(255, 255, 255, 0.9)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', color: '#635F69', display: 'block' }}>
                        Time: {label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginTop: '0.2rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            color: strokeColor,
                          }}
                        >
                          {payload[0].value}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#635F69' }}>
                          {unit}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={strokeColor}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${fillGradientId})`}
              dot={false}
              activeDot={{ r: 6, fill: strokeColor, stroke: '#FFFFFF', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ClayCard>
  );
};
