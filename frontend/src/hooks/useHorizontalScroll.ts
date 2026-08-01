"use client";

import { useRef, useCallback } from 'react';

/**
 * Custom hook to manage horizontal scroll containers via button controls.
 */
export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>(step = 320) {
  const containerRef = useRef<T>(null);

  const scrollLeft = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -step, behavior: 'smooth' });
    }
  }, [step]);

  const scrollRight = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
    }
  }, [step]);

  return { containerRef, scrollLeft, scrollRight };
}
