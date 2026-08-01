"use client";

import { useState, useCallback } from 'react';

/**
 * Custom hook to handle copying text to clipboard with temporary success toast state.
 */
export function useCopyToClipboard(resetDelayMs = 3000) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback((text: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => {
        setCopiedText(null);
      }, resetDelayMs);
    }
  }, [resetDelayMs]);

  return { copiedText, copy, isCopied: Boolean(copiedText) };
}
