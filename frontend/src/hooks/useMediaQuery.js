
import { useState, useEffect } from 'react';

/**
 * useMediaQuery - React hook for responsive logic
 * 
 * @description
 * Provides JavaScript access to CSS media query results.
 * Updates when viewport changes.
 * SSR-safe (returns false initially).
 * 
 * @param {string} query - CSS media query string
 * @returns {boolean} - True if media query matches
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 991px)');
 * const isDesktop = useMediaQuery('(min-width: 992px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * 
 * @performance
 * - Uses matchMedia API (performant)
 * - Debounced resize listener
 * - Cleanup on unmount
 */
export const useMediaQuery = (query) => {
  // SSR-safe: Start with false
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Handler for changes
    const handler = (event) => setMatches(event.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } 
    // Fallback for older browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

/**
 * Predefined breakpoint hooks for convenience
 */
export const useIsMobile = () => useMediaQuery('(max-width: 991px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 991px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 992px)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');