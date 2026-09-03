import React from 'react';

export const StorageShell: React.FC = () => {
  return (
    <div id="storage-shell" className="himarka-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Storage Unit Boundary</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Multi-unit cold storage facility management supporting village-level deployment clusters across North Eastern India.
      </p>
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
        <strong>Active API Contracts:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
          <li>GET /api/v1/storage</li>
          <li>POST /api/v1/storage</li>
          <li>GET /api/v1/storage/:id</li>
        </ul>
      </div>
    </div>
  );
};
