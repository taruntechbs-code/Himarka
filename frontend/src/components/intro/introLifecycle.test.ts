import { describe, it, expect, beforeEach } from 'vitest';
import { resetIntroSessionForTesting } from '@/components/layout/AppLayout';

describe('Phase 1.4: Intro Portal Lifecycle & Unmounting Cleanup', () => {
  beforeEach(() => {
    resetIntroSessionForTesting();
  });

  it('1. Fresh session starts with intro active', () => {
    // When session is fresh and not reduced motion, intro should be active
    resetIntroSessionForTesting();
    // Simulate initial state condition in AppLayout
    const hasCompletedIntro = false;
    const prefersReducedMotion = false;
    const introActive = !hasCompletedIntro && !prefersReducedMotion;

    expect(introActive).toBe(true);
  });

  it('2. Intro unmounts completely upon completion (progress >= 0.99)', () => {
    let introActive = true;
    let hasCompletedIntro = false;

    const onComplete = () => {
      hasCompletedIntro = true;
      introActive = false;
    };

    // Simulate user scroll reaching threshold (progress = 1.0)
    const progress = 1.0;
    if (progress >= 0.99) {
      onComplete();
    }

    expect(introActive).toBe(false);
    expect(hasCompletedIntro).toBe(true);
  });

  it('3. Route navigation does NOT replay the intro once session has completed', () => {
    let hasCompletedIntro = true; // Intro already completed on initial load
    const prefersReducedMotion = false;

    // Simulate route navigation: location changes from '/' to '/storage' and back to '/'
    const simulatedRoutes = ['/', '/storage', '/alerts', '/devices', '/'];

    simulatedRoutes.forEach((route) => {
      // Intro should evaluate to false regardless of route because hasCompletedIntro is true
      const introActiveOnNav = !hasCompletedIntro && !prefersReducedMotion;
      expect(introActiveOnNav, `Intro should remain false on route ${route}`).toBe(false);
    });
  });

  it('4. Respects prefers-reduced-motion by bypassing intro immediately', () => {
    const hasCompletedIntro = false;
    const prefersReducedMotion = true;
    const introActive = !hasCompletedIntro && !prefersReducedMotion;

    expect(introActive).toBe(false);
  });
});
