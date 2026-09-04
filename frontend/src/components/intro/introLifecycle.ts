/**
 * HIMARKA Intro Portal Lifecycle Manager
 * Phase 1.4.1: Browser Document Load vs SPA Route Navigation Lifecycle
 *
 * Core Principle:
 * 1. BROWSER DOCUMENT LOAD / RELOAD (fresh visit, F5, Ctrl+R, reload button, direct URL):
 *    -> Recreates the JavaScript runtime or reloads the document.
 *    -> INTRO MUST PLAY on every document load/reload.
 *    -> Browser automatic scroll restoration is explicitly set to 'manual' and scroll is clamped to (0, 0).
 * 2. SPA ROUTE NAVIGATION (React Router route changes via links/code):
 *    -> The document is NOT reloaded.
 *    -> AppLayout remains continuously mounted.
 *    -> INTRO MUST NOT REPLAY when moving between routes.
 */

export type DocumentNavigationType = 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'spa' | 'unknown';

// In-memory document session flag.
// Resets to false whenever the browser reloads or opens a new document.
// Stays true across all client-side React Router navigation.
let hasCompletedIntroInDocument = false;

/**
 * Inspects the Web Performance Navigation API to determine the document navigation type.
 */
export function detectDocumentNavigationType(): DocumentNavigationType {
  const perf =
    typeof window !== 'undefined' && window.performance
      ? window.performance
      : typeof performance !== 'undefined'
        ? performance
        : null;

  if (!perf) {
    return 'unknown';
  }
  try {
    const navEntries = perf.getEntriesByType?.('navigation');
    if (navEntries && navEntries.length > 0) {
      const navTiming = navEntries[0] as PerformanceNavigationTiming;
      if (navTiming && navTiming.type) {
        return navTiming.type as DocumentNavigationType;
      }
    }
    // Fallback for older browsers
    const legacyNav = (perf as any)?.navigation;
    if (legacyNav) {
      if (legacyNav.type === 1) return 'reload';
      if (legacyNav.type === 2) return 'back_forward';
      if (legacyNav.type === 0) return 'navigate';
    }
  } catch {
    // Graceful fallback
  }
  return 'unknown';
}

/**
 * Enforces manual scroll restoration and scrolls window to (0, 0).
 * This prevents the browser from automatically restoring the scroll position on reload,
 * which would otherwise bypass the 750px intro track.
 */
export function initializeDocumentScrollForIntro(): void {
  const win =
    typeof window !== 'undefined'
      ? window
      : typeof globalThis !== 'undefined' && (globalThis as any).window
        ? (globalThis as any).window
        : null;

  if (!win) return;
  try {
    if (win.history && 'scrollRestoration' in win.history) {
      win.history.scrollRestoration = 'manual';
    }
    if (typeof win.scrollTo === 'function') {
      win.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  } catch {
    // Graceful fallback in environments without window.scrollTo
  }
}

/**
 * Determines whether the intro portal should be active.
 * Active if:
 * - Reduced motion is not requested
 * - Intro has not yet completed in this document lifecycle
 */
export function shouldShowIntro(prefersReducedMotion: boolean = false): boolean {
  if (prefersReducedMotion) return false;
  return !hasCompletedIntroInDocument;
}

/**
 * Marks the intro as completed for the current document session.
 * Once completed, SPA route navigation will never replay the intro.
 */
export function markIntroCompleted(): void {
  hasCompletedIntroInDocument = true;
  if (typeof window !== 'undefined') {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      // ignore
    }
  }
}

/**
 * Resets the lifecycle state (used for testing and simulated new document loads).
 */
export function resetIntroLifecycleState(isCompleted: boolean = false): void {
  hasCompletedIntroInDocument = isCompleted;
}

export function isIntroCompletedInDocument(): boolean {
  return hasCompletedIntroInDocument;
}
