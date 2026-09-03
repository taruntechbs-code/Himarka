import React from 'react';

export const EnergyShell: React.FC = () => {
  return (
    <div id="energy-shell" className="himarka-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Solar Generation & Battery Subsystem</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Solar PV generation tracking, battery state-of-charge (SoC), and cooling compressor power consumption optimization.
      </p>
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
        <strong>Active API Contracts:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
          <li>POST /api/v1/energy</li>
          <li>GET /api/v1/energy/latest?storage_unit_id=...</li>
        </ul>
      </div>
    </div>
  );
};
