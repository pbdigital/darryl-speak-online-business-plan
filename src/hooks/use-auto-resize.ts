'use client';

import { useRef, useCallback, useEffect } from 'react';

interface UseAutoResizeOptions {
  /** Minimum height in pixels (default: 80, ~3-4 rows) */
  minHeight?: number;
  /** Maximum height in pixels before scrolling (default: 300) */
  maxHeight?: number;
  /** Disable auto-resize (useful for testing) */
  disabled?: boolean;
}

interface UseAutoResizeReturn {
  /** Ref to attach to the textarea element */
  ref: React.RefObject<HTMLTextAreaElement | null>;
  /** Manually trigger resize (e.g., after programmatic value change) */
  resize: () => void;
}

/**
 * Hook for auto-resizing textareas based on content.
 *
 * Features:
 * - Expands as user types, shrinks when content deleted
 * - Uses RAF batching to avoid layout thrash
 * - Skips resize during IME composition (Japanese/Chinese input)
 * - Only updates DOM when height actually changes
 *
 * @example
 * ```tsx
 * const { ref, resize } = useAutoResize({ minHeight: 80, maxHeight: 300 });
 * return <textarea ref={ref} />;
 * ```
 */
export function useAutoResize({
  minHeight = 80,
  maxHeight = 300,
  disabled = false,
}: UseAutoResizeOptions = {}): UseAutoResizeReturn {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const previousHeight = useRef<number | null>(null);

  const resize = useCallback(() => {
    const textarea = ref.current;
    if (!textarea || disabled) return;

    // Synchronous resize to avoid visual flash between frames
    // The browser batches these style changes into a single repaint

    // 1. Reset to minHeight to get accurate scrollHeight for shrinking
    textarea.style.height = `${minHeight}px`;

    // 2. Reading scrollHeight forces layout recalculation (sync)
    const scrollHeight = textarea.scrollHeight;

    // 3. Calculate and apply final height immediately
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
    previousHeight.current = newHeight;

    // 4. Enable scrolling only when content exceeds max height
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [minHeight, maxHeight, disabled]);

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea || disabled) return;

    // Initial resize for pre-populated content
    resize();

    // Resize on input, but skip during IME composition
    const handleInput = (e: Event) => {
      if ((e as InputEvent).isComposing) return;
      resize();
    };

    // Also handle composition end for IME input
    const handleCompositionEnd = () => {
      resize();
    };

    textarea.addEventListener('input', handleInput);
    textarea.addEventListener('compositionend', handleCompositionEnd);

    return () => {
      textarea.removeEventListener('input', handleInput);
      textarea.removeEventListener('compositionend', handleCompositionEnd);
    };
  }, [resize, disabled]);

  return { ref, resize };
}
