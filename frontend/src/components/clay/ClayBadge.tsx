import React, { ReactNode } from 'react';

export type ClayBadgeColor = 'emerald' | 'amber' | 'crimson' | 'violet' | 'sky';

interface ClayBadgeProps {
  children: ReactNode;
  color?: ClayBadgeColor;
  icon?: ReactNode;
  className?: string;
  pulse?: boolean;
}

export const ClayBadge: React.FC<ClayBadgeProps> = ({
  children,
  color = 'violet',
  icon,
  className = '',
  pulse = false,
}) => {
  return (
    <span className={`clay-badge clay-badge-${color} ${className}`}>
      {pulse && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'inline-block',
            animation: 'pulseDot 2s infinite ease-in-out',
          }}
        />
      )}
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
