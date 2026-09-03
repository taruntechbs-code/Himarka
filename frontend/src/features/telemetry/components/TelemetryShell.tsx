import React from 'react';

export const TelemetryShell: React.FC = () => {
  return (
    <div id="telemetry-shell" className="himarka-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Telemetry Subsystem Boundary</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Handles ingestion, historical downsampling, and realtime streaming of temperature, humidity, gas ppm, and cooling relay states.
      </p>
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
        <strong>Active API Contracts:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
          <li>POST /api/v1/telemetry/ingest</li>
          <li>GET /api/v1/telemetry/latest?device_id=...</li>
          <li>GET /api/v1/telemetry/history?device_id=...</li>
        </ul>
      </div>
    </div>
  );
};
