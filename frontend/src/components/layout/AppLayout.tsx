import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { ErrorBoundary } from '../feedback/ErrorBoundary';
import { IntroPortal } from '../intro/IntroPortal';
import { useTelemetry } from '@/services/telemetry/TelemetryContext';
import { useTranslation } from 'react-i18next';
import { Info, Snowflake, Sun, ShieldCheck } from 'lucide-react';

import {
  shouldShowIntro,
  markIntroCompleted,
  resetIntroLifecycleState,
  initializeDocumentScrollForIntro,
} from '../intro/introLifecycle';

export const resetIntroSessionForTesting = (isCompleted: boolean = false) => {
  resetIntroLifecycleState(isCompleted);
};

export const AppLayout: React.FC = () => {
  const { t } = useTranslation();
  const { mode } = useTelemetry();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Ensure browser scroll restoration is set to manual and reset scroll to top on document load/reload
  useEffect(() => {
    initializeDocumentScrollForIntro();
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    if (mql.matches) {
      markIntroCompleted();
      setIntroActive(false);
      setIntroProgress(1);
    }
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        markIntroCompleted();
        setIntroActive(false);
        setIntroProgress(1);
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Intro is active only on initial fresh document load / reload when motion is not reduced
  const [introActive, setIntroActive] = useState(() => shouldShowIntro(prefersReducedMotion));
  const [introProgress, setIntroProgress] = useState(introActive ? 0 : 1);

  const handleIntroComplete = React.useCallback(() => {
    markIntroCompleted();
    setIntroActive(false);
    setIntroProgress(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  const handleProgressChange = React.useCallback((progress: number) => {
    setIntroProgress(progress);
    if (progress >= 0.99) {
      handleIntroComplete();
    }
  }, [handleIntroComplete]);

  // App shell visibility: completely invisible when closed (progress === 0),
  // then smoothly fades in as panels open. Once intro is unmounted, strictly 1.
  const appShellOpacity = introActive ? Math.min(1, Math.max(0, (introProgress - 0.05) / 0.8)) : 1;

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* Scroll-Driven Portal Opening Intro (Active ONLY during initial fresh page load until completed) */}
      {introActive && (
        <>
          <IntroPortal
            scrollThreshold={750}
            onProgressChange={handleProgressChange}
            onComplete={handleIntroComplete}
          />
          {/* Intro Scroll Track: consumes the 750px scroll distance during intro only */}
          <div
            id="intro-scroll-track"
            style={{
              height: '750px',
              width: '100%',
              pointerEvents: 'none',
              visibility: 'hidden',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Application Layer: Coordinates with Intro to Prevent Visual Leakage */}
      <div
        id="application-shell"
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          opacity: appShellOpacity,
          pointerEvents: introActive && introProgress < 0.85 ? 'none' : 'auto',
          transition: 'opacity 120ms ease-out',
        }}
      >
        {/* Ambient Floating Clay Blobs Background */}
        <div className="clay-ambient-container" aria-hidden="true">
          <div className="clay-blob clay-blob-violet clay-float" />
          <div className="clay-blob clay-blob-pink clay-float-delayed" />
          <div className="clay-blob clay-blob-sky clay-float-slow" />
          <div className="clay-blob clay-blob-emerald clay-breathe" />
        </div>

        {/* Compact Sticky Single-Row Header */}
        <Header />

        {/* Mode Notification Banner (Compact, Unobtrusive) */}
        {mode === 'DEMO' && (
          <div
            id="demo-mode-indicator"
            style={{
              maxWidth: '1360px',
              margin: '0 auto 1rem auto',
              padding: '0 1rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 251, 235, 0.95)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-button)',
                padding: '0.45rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-clay-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={15} color="#D97706" />
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: '0.74rem',
                    letterSpacing: '0.04em',
                    color: '#92400E',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('mode.demoActive', 'Demonstration Mode Active')}
                </span>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 600 }}>
                {t('mode.demoNoticeDesc', 'Realistic Simulated Telemetry • Switch to Live Backend anytime at top right')}
              </span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main
          id="main-content"
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '1360px',
            margin: '0 auto',
            padding: '0 1rem 2.5rem 1rem',
            position: 'relative',
            zIndex: 1,
            boxSizing: 'border-box',
          }}
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>

        {/* Tactile Clay Footer */}
        <footer
          id="app-footer"
          style={{
            maxWidth: '1360px',
            width: '100%',
            margin: '0 auto',
            padding: '1.5rem 1rem',
            position: 'relative',
            zIndex: 1,
            borderTop: '1px solid rgba(160, 150, 180, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7C3AED, #DB2777)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 900,
              }}
            >
              H
            </div>
            <div>
              <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', fontSize: '0.86rem' }}>
                HIMARKA {t('app.platform', 'Platform')}
              </span>
              <p style={{ fontSize: '0.72rem', color: 'var(--clay-text-secondary)', margin: 0 }}>
                {t('app.footerDesc', 'Solar-Powered Smart Mini Cold Storage System for Fresh Vegetables')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--clay-text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Snowflake size={14} color="#7C3AED" /> {t('app.footerChamber', 'Active Thermal Chamber')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sun size={14} color="#F59E0B" /> {t('app.footerSolar', '100% Photovoltaic Loop')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} color="#10B981" /> {t('app.footerPreserved', 'NER Preserved')}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
