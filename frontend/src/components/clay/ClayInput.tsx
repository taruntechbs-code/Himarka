import React, { InputHTMLAttributes, ReactNode } from 'react';

interface ClayInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const ClayInput: React.FC<ClayInputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--clay-text-secondary)',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '1.25rem',
              color: 'var(--clay-text-muted)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`clay-input ${className}`}
          style={{
            paddingLeft: icon ? '3.25rem' : '1.25rem',
            borderColor: error ? 'var(--clay-danger)' : undefined,
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ color: 'var(--clay-danger)', fontSize: '0.8rem', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};
