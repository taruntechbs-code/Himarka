import React, { ReactNode } from 'react';

export type OrbColor = 'violet' | 'pink' | 'sky' | 'emerald' | 'amber' | 'crimson';

interface ClayIconOrbProps {
  icon: ReactNode;
  color?: OrbColor;
  size?: number;
  className?: string;
}

export const ClayIconOrb: React.FC<ClayIconOrbProps> = ({
  icon,
  color = 'violet',
  size = 52,
  className = '',
}) => {
  const colorMap: Record<OrbColor, { bg: string; color: string; border: string }> = {
    violet: {
      bg: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
      color: '#7C3AED',
      border: 'rgba(124, 58, 237, 0.2)',
    },
    pink: {
      bg: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
      color: '#DB2777',
      border: 'rgba(219, 39, 119, 0.2)',
    },
    sky: {
      bg: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
      color: '#0EA5E9',
      border: 'rgba(14, 165, 233, 0.2)',
    },
    emerald: {
      bg: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      color: '#10B981',
      border: 'rgba(16, 185, 129, 0.2)',
    },
    amber: {
      bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      color: '#F59E0B',
      border: 'rgba(245, 158, 11, 0.2)',
    },
    crimson: {
      bg: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
      color: '#EF4444',
      border: 'rgba(239, 68, 68, 0.2)',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`clay-orb ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: scheme.bg,
        color: scheme.color,
        border: `1.5px solid ${scheme.border}`,
      }}
    >
      {icon}
    </div>
  );
};
