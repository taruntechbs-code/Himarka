import React, { ReactNode } from 'react';
import { ClayIconOrb, OrbColor } from './ClayIconOrb';
import { ClayCard } from './ClayCard';
import { ClayBadge, ClayBadgeColor } from './ClayBadge';

interface ClayMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  iconColor?: OrbColor;
  statusText?: string;
  statusColor?: ClayBadgeColor;
  supportingText?: string;
  trendText?: string;
  trendPositive?: boolean;
  className?: string;
  id?: string;
}

export const ClayMetric: React.FC<ClayMetricProps> = ({
  label,
  value,
  unit,
  icon,
  iconColor = 'violet',
  statusText,
  statusColor = 'emerald',
  supportingText,
  trendText,
  trendPositive,
  className = '',
  id,
}) => {
  return (
    <ClayCard id={id} className={`clay-metric-card ${className}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        {icon && <ClayIconOrb icon={icon} color={iconColor} size={48} />}
        {statusText && (
          <ClayBadge color={statusColor} pulse={statusColor === 'emerald'}>
            {statusText}
          </ClayBadge>
        )}
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--clay-text-secondary)',
            display: 'block',
            marginBottom: '0.4rem',
          }}
        >
          {label}
        </span>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.5rem',
              fontWeight: 900,
              color: 'var(--clay-text-primary)',
              lineHeight: 1.1,
            }}
          >
            {value}
          </span>
          {unit && (
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--clay-text-secondary)',
              }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>

      {(supportingText || trendText) && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(160, 150, 180, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
          }}
        >
          {supportingText && (
            <span style={{ color: 'var(--clay-text-secondary)', fontSize: '0.82rem' }}>
              {supportingText}
            </span>
          )}
          {trendText && (
            <span
              style={{
                fontWeight: 600,
                color: trendPositive ? 'var(--clay-success)' : 'var(--clay-warning)',
                fontSize: '0.82rem',
              }}
            >
              {trendText}
            </span>
          )}
        </div>
      )}
    </ClayCard>
  );
};
