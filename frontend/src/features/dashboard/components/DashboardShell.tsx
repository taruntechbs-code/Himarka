import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Server, Database, Cloud, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DashboardShell: React.FC = () => {
  const { data: health, isLoading, error } = useQuery({
    queryKey: ['system-health'],
    queryFn: dashboardApi.getSystemHealth,
    refetchInterval: 15000,
  });

  if (isLoading) {
    return <LoadingSpinner label="Validating subsystem connections..." />;
  }

  return (
    <div id="dashboard-shell" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Platform Architecture Foundation
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Phase 0 core boundary verification. Live telemetry, ML inference, and final editorial design will activate in subsequent phases.
        </p>
      </div>

      {error ? (
        <div
          id="api-connection-error"
          className="himarka-card"
          style={{ borderColor: 'var(--color-danger)', marginBottom: '1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle color="var(--color-danger)" size={20} />
            <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>
              Backend API Server Unreachable
            </span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Please ensure the FastAPI service is running at <code>http://localhost:8000</code>.
          </p>
        </div>
      ) : (
        <div
          id="api-connection-success"
          className="himarka-card"
          style={{ marginBottom: '1.5rem', borderColor: 'var(--color-primary)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 color="var(--color-success)" size={22} />
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>System Core Online</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                  Environment: {health?.environment} &bull; v{health?.app_version}
                </span>
              </div>
            </div>
            <span className={`badge ${health?.status === 'HEALTHY' ? 'badge-healthy' : 'badge-warning'}`}>
              {health?.status}
            </span>
          </div>
        </div>
      )}

      {/* Subsystem Health Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="himarka-card" id="card-api-server">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Server size={18} color="var(--color-primary)" />
            <h4 style={{ fontSize: '0.95rem' }}>FastAPI Layer</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Status: <strong>{health?.components.api_server.status || 'Checking...'}</strong>
          </p>
        </div>

        <div className="himarka-card" id="card-database">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Database size={18} color="var(--color-info)" />
            <h4 style={{ fontSize: '0.95rem' }}>Database (SQLAlchemy)</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Status: <strong>{health?.components.database.status || 'Checking...'}</strong>
          </p>
        </div>

        <div className="himarka-card" id="card-firebase">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Cloud size={18} color="var(--color-solar)" />
            <h4 style={{ fontSize: '0.95rem' }}>Firebase Adapter</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Status: <strong>{health?.components.firebase.status || 'NOT_CONFIGURED'}</strong>
          </p>
        </div>

        <div className="himarka-card" id="card-ai">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Cpu size={18} color="#a855f7" />
            <h4 style={{ fontSize: '0.95rem' }}>AI / Intelligence</h4>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Status: <strong>{health?.components.ai_services.gemini.status || 'Awaiting Key'}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
