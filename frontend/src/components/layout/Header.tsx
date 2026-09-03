import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n/i18n';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <header
      id="app-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck color="var(--color-primary)" size={24} />
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            {t('app.title')}
          </h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
            {t('app.phase')} &bull; {t('app.region')}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <select
          id="language-select"
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};
