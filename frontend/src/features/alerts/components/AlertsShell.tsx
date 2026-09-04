import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { ClayCard } from '@/components/clay/ClayCard';
import { ClayBadge } from '@/components/clay/ClayBadge';
import { ClaySection } from '@/components/clay/ClaySection';
import { ClayButton } from '@/components/clay/ClayButton';

export const AlertsShell: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { alerts, mode } = useTelemetry();

  return (
    <div id="alerts-shell" style={{ width: '100%' }}>
      <ClaySection
        title={t('alerts.title')}
        subtitle={t('alerts.subtitle')}
        badge={
          mode === 'DEMO' ? (
            <ClayBadge color="amber">{t('alerts.simulatedAuditLog', 'SIMULATED AUDIT LOG')}</ClayBadge>
          ) : (
            <ClayBadge color="emerald">{t('alerts.liveMonitoring', 'LIVE MONITORING')}</ClayBadge>
          )
        }
      >
        {/* Status Summary Banner */}
        <ClayCard variant="deep" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-orb)',
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  boxShadow: 'var(--shadow-clay-orb)',
                }}
              >
                <ShieldCheck size={30} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>
                  {t('alerts.normal')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)' }}>
                  {t('alerts.noActive')}
                </p>
              </div>
            </div>

            <ClayBadge color="emerald" pulse>
              {t('status.safetyActive', 'SAFETY ACTIVE')}
            </ClayBadge>
          </div>
        </ClayCard>

        {/* Alerts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {alerts.map((alert) => {
            const isWarning = alert.severity === 'WARNING';
            const isCritical = alert.severity === 'CRITICAL';
            const badgeColor = isCritical ? 'crimson' : isWarning ? 'amber' : 'emerald';
            const Icon = isWarning ? AlertTriangle : isCritical ? AlertTriangle : Info;

            const localizedTitle =
              alert.alert_type === 'PRESERVATION_STATUS_OPTIMAL'
                ? t('alerts.storageConditionsOptimal', alert.title)
                : alert.alert_type === 'DOOR_ACCESS_NOTICE'
                ? t('alerts.loadingAccessVerified', alert.title)
                : alert.title;

            const localizedMessage =
              alert.alert_type === 'PRESERVATION_STATUS_OPTIMAL'
                ? t('alerts.storageConditionsOptimalMsg', alert.message)
                : alert.alert_type === 'DOOR_ACCESS_NOTICE'
                ? t('alerts.loadingAccessVerifiedMsg', alert.message)
                : alert.message;

            return (
              <ClayCard
                key={alert.id}
                variant={isWarning ? 'warning' : 'default'}
                style={{ padding: '1.75rem' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-orb)',
                        backgroundColor: isWarning ? '#FFFBEB' : '#ECFDF5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isWarning ? '#F59E0B' : '#10B981',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{localizedTitle}</h4>
                        <ClayBadge color={badgeColor}>{t(`status.${alert.severity.toLowerCase()}`, alert.severity)}</ClayBadge>
                        {alert.is_resolved && (
                          <ClayBadge color="emerald">{t('status.resolved', 'RESOLVED')}</ClayBadge>
                        )}
                      </div>

                      <p style={{ fontSize: '0.92rem', color: 'var(--clay-text-secondary)', marginBottom: '0.6rem', lineHeight: 1.5 }}>
                        {localizedMessage}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--clay-text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={14} />
                          <span>{t('alerts.loggedAt', { time: new Date(alert.created_at).toLocaleTimeString(i18n.language || 'en', { hour: '2-digit', minute: '2-digit' }) })}</span>
                        </span>
                        <span>{t('alerts.unit', 'Unit')}: {alert.storage_unit_id}</span>
                        {alert.device_id && <span>{t('alerts.device', 'Device')}: {alert.device_id}</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    {alert.is_resolved ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          color: 'var(--clay-success)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        <CheckCircle2 size={16} /> {t('alerts.acknowledged', 'Acknowledged')}
                      </span>
                    ) : (
                      <ClayButton variant="secondary" size="sm">
                        {t('alerts.acknowledge', 'Acknowledge')}
                      </ClayButton>
                    )}
                  </div>
                </div>
              </ClayCard>
            );
          })}
        </div>
      </ClaySection>
    </div>
  );
};
