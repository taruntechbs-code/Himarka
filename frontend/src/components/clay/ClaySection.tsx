import React, { ReactNode } from 'react';

interface ClaySectionProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
}

export const ClaySection: React.FC<ClaySectionProps> = ({
  title,
  subtitle,
  badge,
  actions,
  children,
  id,
  className = '',
}) => {
  return (
    <section id={id} className={`clay-section ${className}`} style={{ marginBottom: '2.5rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
              {title}
            </h2>
            {badge}
          </div>
          {subtitle && (
            <p style={{ color: 'var(--clay-text-secondary)', fontSize: '0.95rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>
      {children}
    </section>
  );
};
