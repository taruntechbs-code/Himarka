import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ClayButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ClayButtonSize = 'sm' | 'md' | 'lg';

interface ClayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ClayButtonVariant;
  size?: ClayButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export const ClayButton: React.FC<ClayButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  style,
  disabled,
  ...props
}) => {
  const variantClass = `clay-btn-${variant}`;
  
  const sizeStyles: React.CSSProperties = {
    sm: { height: '44px', minHeight: '44px', padding: '0 1.25rem', fontSize: '0.875rem' },
    md: { height: '56px', minHeight: '44px', padding: '0 1.75rem', fontSize: '1rem' },
    lg: { height: '64px', minHeight: '44px', padding: '0 2.25rem', fontSize: '1.125rem' },
  }[size];

  return (
    <button
      className={`clay-btn ${variantClass} ${className}`}
      disabled={disabled}
      style={{
        ...sizeStyles,
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
