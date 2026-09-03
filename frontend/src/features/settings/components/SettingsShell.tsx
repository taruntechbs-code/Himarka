import React from 'react';
import { config } from '@/app/config';

export const SettingsShell: React.FC = () => {
  return (
    <div id="settings-shell" className="himarka-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>System Configuration & Preferences</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Operational controls, language localization, and client API endpoint parameters.
      </p>
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
        <p><strong>Configured API Host:</strong> <code>{config.apiBaseUrl}</code></p>
        <p style={{ marginTop: '0.5rem' }}><strong>Environment:</strong> <code>{config.appEnv}</code></p>
      </div>
    </div>
  );
};
