import React from 'react';

export const DevicesShell: React.FC = () => {
  return (
    <div id="devices-shell" className="himarka-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Device Management & Edge Fleet Boundary</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Monitors hardware fleet (ESP32 controllers, sensors, camera modules) across distributed decentralized installations.
      </p>
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
        <strong>Active API Contracts:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
          <li>GET /api/v1/devices</li>
          <li>POST /api/v1/devices</li>
          <li>POST /api/v1/devices/heartbeat</li>
        </ul>
      </div>
    </div>
  );
};
