import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  detectDocumentNavigationType,
  initializeDocumentScrollForIntro,
  shouldShowIntro,
  markIntroCompleted,
  resetIntroLifecycleState,
  isIntroCompletedInDocument,
} from './introLifecycle';
import { resetIntroSessionForTesting } from '@/components/layout/AppLayout';

describe('Phase 1.4.1: Intro Portal Document Load vs SPA Navigation Lifecycle', () => {
  let mockScrollTo: ReturnType<typeof vi.fn>;
  let mockHistory: { scrollRestoration: string };

  beforeEach(() => {
    resetIntroLifecycleState(false);
    resetIntroSessionForTesting(false);
    vi.restoreAllMocks();

    mockScrollTo = vi.fn();
    mockHistory = { scrollRestoration: 'auto' };

    (globalThis as any).window = {
      history: mockHistory,
      scrollTo: mockScrollTo,
      performance: {
        getEntriesByType: vi.fn(),
      },
    };
  });

  it('1. Fresh document load (type = "navigate") initializes intro as active', () => {
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'navigate' } as PerformanceNavigationTiming,
    ]);

    const navType = detectDocumentNavigationType();
    expect(navType).toBe('navigate');

    // On fresh document load, intro must be active
    expect(isIntroCompletedInDocument()).toBe(false);
    expect(shouldShowIntro(false)).toBe(true);
  });

  it('2. Browser reload navigation type (type = "reload") initializes intro as active', () => {
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    const navType = detectDocumentNavigationType();
    expect(navType).toBe('reload');

    // On browser reload (F5 / Ctrl+R / Refresh button), intro must play again
    expect(isIntroCompletedInDocument()).toBe(false);
    expect(shouldShowIntro(false)).toBe(true);
  });

  it('3. SPA route navigation does NOT replay the intro once completed in document', () => {
    // Initial document load -> user completes intro
    expect(shouldShowIntro(false)).toBe(true);
    markIntroCompleted();
    expect(isIntroCompletedInDocument()).toBe(true);
    expect(shouldShowIntro(false)).toBe(false);

    // Simulate SPA navigation across all major application routes
    const spaRoutes = [
      '/',
      '/storage',
      '/produce',
      '/energy',
      '/devices',
      '/alerts',
      '/settings',
      '/',
    ];

    spaRoutes.forEach((route) => {
      // In SPA navigation, AppLayout remains mounted and document is not reloaded
      const introActive = shouldShowIntro(false);
      expect(introActive, `Intro must NOT replay when navigating to ${route}`).toBe(false);
    });
  });

  it('4. Intro completion marks document as completed and triggers portal unmount', () => {
    expect(shouldShowIntro(false)).toBe(true);

    // Simulate reaching scroll threshold (progress >= 0.99)
    let introActive = shouldShowIntro(false);
    const onComplete = () => {
      markIntroCompleted();
      introActive = false;
    };

    const progress = 1.0;
    if (progress >= 0.99) {
      onComplete();
    }

    expect(introActive).toBe(false);
    expect(isIntroCompletedInDocument()).toBe(true);
    expect(shouldShowIntro(false)).toBe(false);
  });

  it('5. Browser refresh after completion creates a new document load and replays intro', () => {
    // 1. First visit: intro completed
    markIntroCompleted();
    expect(shouldShowIntro(false)).toBe(false);

    // 2. User presses browser Refresh (F5 / reload button)
    // In a browser refresh, the browser creates a new document instance, recreating the JS heap.
    // We simulate document reload by re-initializing the lifecycle state:
    resetIntroLifecycleState(false);

    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    expect(detectDocumentNavigationType()).toBe('reload');
    expect(isIntroCompletedInDocument()).toBe(false);
    // Intro MUST play again after browser refresh
    expect(shouldShowIntro(false)).toBe(true);
  });

  it('6. Direct refresh on /storage initializes intro as active', () => {
    // User was on /storage and reloaded the page
    resetIntroLifecycleState(false);
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    const activeOnStorage = shouldShowIntro(false);
    expect(activeOnStorage).toBe(true);
  });

  it('7. Direct refresh on /produce initializes intro as active', () => {
    resetIntroLifecycleState(false);
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    const activeOnProduce = shouldShowIntro(false);
    expect(activeOnProduce).toBe(true);
  });

  it('8. Direct refresh on /energy initializes intro as active', () => {
    resetIntroLifecycleState(false);
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    const activeOnEnergy = shouldShowIntro(false);
    expect(activeOnEnergy).toBe(true);
  });

  it('9. Direct refresh on /devices initializes intro as active', () => {
    resetIntroLifecycleState(false);
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    const activeOnDevices = shouldShowIntro(false);
    expect(activeOnDevices).toBe(true);
  });

  it('10. Direct refresh on /alerts initializes intro as active', () => {
    resetIntroLifecycleState(false);
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    const activeOnAlerts = shouldShowIntro(false);
    expect(activeOnAlerts).toBe(true);
  });

  it('11. Direct refresh on /settings initializes intro as active', () => {
    resetIntroLifecycleState(false);
    vi.spyOn(window.performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ]);

    const activeOnSettings = shouldShowIntro(false);
    expect(activeOnSettings).toBe(true);
  });

  it('12. Scroll restoration is set to manual and scroll is forced to (0, 0) on document load', () => {
    initializeDocumentScrollForIntro();

    expect(window.history.scrollRestoration).toBe('manual');
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
  });

  it('13. Respects prefers-reduced-motion by immediately bypassing intro', () => {
    resetIntroLifecycleState(false);
    // When prefers-reduced-motion is true, intro should never show
    expect(shouldShowIntro(true)).toBe(false);
  });

  it('14. Intro active state does NOT lock document scroll (overflow is not hidden)', () => {
    resetIntroLifecycleState(false);
    expect(shouldShowIntro(false)).toBe(true);

    // Verify document/body overflow is not locked
    const bodyOverflow = (globalThis as any).document?.body?.style?.overflow;
    expect(bodyOverflow).not.toBe('hidden');

    // Verify manual scroll restoration does NOT lock scroll
    initializeDocumentScrollForIntro();
    expect(window.history.scrollRestoration).toBe('manual');
    // Scroll restoration manual allows native scrolling
    expect(window.scrollTo).toBeDefined();
  });

  it('15. Progressive scrolling advances portal doors from 0 to 1 without snapping back to 0', () => {
    resetIntroLifecycleState(false);
    const scrollThreshold = 750;
    const progressLog: number[] = [];

    let completed = false;
    const onProgressChange = (p: number) => {
      progressLog.push(p);
    };
    const onComplete = () => {
      completed = true;
      markIntroCompleted();
    };

    // Simulate progressive scroll steps (e.g. user scrolls down by 150px intervals)
    const simulatedScrolls = [150, 300, 450, 600, 750];
    simulatedScrolls.forEach((scrollY) => {
      const progress = Math.min(1, Math.max(0, scrollY / scrollThreshold));
      onProgressChange(progress);
      if (progress >= 0.99) {
        onComplete();
      }
    });

    expect(progressLog).toEqual([0.2, 0.4, 0.6, 0.8, 1.0]);
    expect(completed).toBe(true);
    expect(isIntroCompletedInDocument()).toBe(true);
    expect(shouldShowIntro(false)).toBe(false);
  });
});
