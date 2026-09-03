import React from 'react';

export const AlertsShell: React.FC = () => {
  return (
    <div id="alerts-shell" className="himarka-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Alerts & Anomaly Response Boundary</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Realtime critical notification handling for temperature excursions, gas/air-quality spikes, and solar power dropouts.
      </p>
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
        <strong>Active API Contracts:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
          <li>GET /api/v1/alerts</li>
          <li>POST /api/v1/alerts</li>
          <li>POST /api/v1/alerts/:id/resolve</li>
        </ul>
      </div>
    </div>
  );
};
