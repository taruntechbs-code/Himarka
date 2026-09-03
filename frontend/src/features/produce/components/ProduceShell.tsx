import React from 'react';

export const ProduceShell: React.FC = () => {
  return (
    <div id="produce-shell" className="himarka-card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Produce & Crop Preservation Boundary</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Tracks agricultural produce batches (King Chilli, Ginger, Tomato, Cabbage) with scientific shelf-life predictions.
      </p>
      <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
        <strong>Active API Contracts:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--color-text-dim)' }}>
          <li>POST /api/v1/produce/batches</li>
          <li>GET /api/v1/produce/batches/storage/:storage_unit_id</li>
          <li>POST /api/v1/ai/spoilage-risk</li>
        </ul>
      </div>
    </div>
  );
};
