import React, { useState, useEffect, useCallback } from 'react';

interface IntroPortalProps {
  scrollThreshold?: number;
  onProgressChange?: (progress: number) => void;
}

export const IntroPortal: React.FC<IntroPortalProps> = ({
  scrollThreshold = 750,
  onProgressChange,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleScroll = useCallback(() => {
    if (prefersReducedMotion) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const progress = Math.min(1, Math.max(0, scrollY / scrollThreshold));
    setScrollProgress(progress);
    onProgressChange?.(progress);
  }, [scrollThreshold, prefersReducedMotion, onProgressChange]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, prefersReducedMotion]);

  // Keyboard accessibility: Allow ArrowDown, PageDown, Space to scroll intro track
  useEffect(() => {
    if (prefersReducedMotion) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollY = window.scrollY || 0;
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (scrollY < scrollThreshold) {
          e.preventDefault();
          const step = e.key === ' ' || e.key === 'PageDown' ? 300 : 120;
          window.scrollBy({ top: step, behavior: 'smooth' });
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (scrollY > 0 && scrollY <= scrollThreshold + 50) {
          e.preventDefault();
          const step = e.key === 'PageUp' ? 300 : 120;
          window.scrollBy({ top: -step, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prefersReducedMotion, scrollThreshold]);

  // Immediate bypass if reduced motion is requested
  if (prefersReducedMotion) {
    return null;
  }

  // Animation values
  const leftTranslate = -scrollProgress * 100; // in %
  const rightTranslate = scrollProgress * 100; // in %
  const wordSeparation = scrollProgress * 28; // in px
  const centerScale = 1 + scrollProgress * 0.12; // controlled scale: 1.0 -> 1.12
  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.8);
  const isFullyOpen = scrollProgress >= 0.99;

  return (
    <div
      id="himarka-portal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 1000,
        overflow: 'hidden',
        pointerEvents: 'none',
        visibility: isFullyOpen ? 'hidden' : 'visible',
        isolation: 'isolate',
      }}
      aria-hidden={isFullyOpen}
      aria-label="HIMARKA Portal Introduction"
    >
      {/* Left Clay Door Panel (Solid 50.1vw, meeting at center) */}
      <div
        id="portal-left-panel"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50.1vw',
          height: '100dvh',
          backgroundColor: '#F4F1FA',
          boxShadow: '20px 0 50px rgba(160, 150, 180, 0.25)',
          borderRight: '2px solid rgba(255, 255, 255, 0.95)',
          transform: `translate3d(${leftTranslate}%, 0, 0)`,
          willChange: 'transform',
          zIndex: 1002,
        }}
      />

      {/* Right Clay Door Panel (Solid 50.1vw, meeting at center) */}
      <div
        id="portal-right-panel"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50.1vw',
          height: '100dvh',
          backgroundColor: '#F4F1FA',
          boxShadow: '-20px 0 50px rgba(160, 150, 180, 0.25)',
          borderLeft: '2px solid rgba(255, 255, 255, 0.95)',
          transform: `translate3d(${rightTranslate}%, 0, 0)`,
          willChange: 'transform',
          zIndex: 1002,
        }}
      />

      {/* Center HIMARKA Wordmark — ONLY semantic and visible content */}
      <div
        id="portal-wordmark-container"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1005,
          opacity: contentOpacity,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      >
        <h1
          id="portal-wordmark"
          style={{
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${centerScale})`,
            willChange: 'transform',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {/* HIM */}
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(3.8rem, 11vw, 8.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#332F3A',
              transform: `translate3d(-${wordSeparation}px, 0, 0)`,
              willChange: 'transform',
              textShadow: '0 10px 40px rgba(160, 150, 180, 0.35)',
            }}
          >
            HIM
          </span>

          {/* ARKA */}
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(3.8rem, 11vw, 8.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: '#7C3AED',
              transform: `translate3d(${wordSeparation}px, 0, 0)`,
              willChange: 'transform',
              textShadow: '0 10px 40px rgba(124, 58, 237, 0.4)',
            }}
          >
            ARKA
          </span>
        </h1>
      </div>
    </div>
  );
};
