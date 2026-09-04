import React, { ReactNode, CSSProperties } from 'react';

export type ClayCardVariant = 'default' | 'static' | 'deep' | 'metric' | 'feature' | 'interactive' | 'warning' | 'success';

interface ClayCardProps {
  children: ReactNode;
  variant?: ClayCardVariant;
  className?: string;
  style?: CSSProperties;
  id?: string;
  onClick?: () => void;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
}

export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  variant = 'default',
  className = '',
  style,
  id,
  onClick,
  tabIndex,
  role,
  'aria-label': ariaLabel,
}) => {
  let baseClass = 'clay-card';
  if (variant === 'static') baseClass = 'clay-card-static';
  else if (variant === 'deep') baseClass = 'clay-card-deep';

  const variantStyles: CSSProperties = {};
  if (variant === 'warning') {
    variantStyles.border = '2px solid rgba(245, 158, 11, 0.4)';
  } else if (variant === 'success') {
    variantStyles.border = '2px solid rgba(16, 185, 129, 0.4)';
  }

  const isClickable = Boolean(onClick);

  return (
    <div
      id={id}
      role={role || (isClickable ? 'button' : undefined)}
      tabIndex={tabIndex ?? (isClickable ? 0 : undefined)}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`${baseClass} ${className}`}
      style={{
        cursor: isClickable ? 'pointer' : undefined,
        ...variantStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
