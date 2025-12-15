'use client';

import { useEffect, useRef } from 'react';
import { useBusinessPlan } from '@/providers/business-plan-provider';
import { SectionKey } from '@/lib/api';

interface UseHydrateSectionReturn {
  /** Whether the section is currently being hydrated */
  isHydrating: boolean;
  /** Whether hydration has completed (data loaded or no data to load) */
  isHydrated: boolean;
}

/**
 * Hook to hydrate a Zustand store with data from the server
 *
 * @param sectionKey - The section key to hydrate from
 * @param hydrateStore - Function to hydrate the store with server data
 * @returns Hydration state
 */
export function useHydrateSection<T>(
  sectionKey: SectionKey,
  hydrateStore: (data: Partial<T>) => void
): UseHydrateSectionReturn {
  const { sections, isLoading } = useBusinessPlan();
  const hasHydrated = useRef(false);

  useEffect(() => {
    // Don't hydrate while still loading or if already hydrated
    if (isLoading || hasHydrated.current) return;

    const section = sections[sectionKey];

    if (section?.data) {
      // Hydrate store with server data
      hydrateStore(section.data as Partial<T>);
    }

    // Mark as hydrated (even if no data - prevents re-hydration)
    hasHydrated.current = true;
  }, [isLoading, sections, sectionKey, hydrateStore]);

  return {
    isHydrating: isLoading && !hasHydrated.current,
    isHydrated: hasHydrated.current || !isLoading,
  };
}

/**
 * Resets the hydration flag for a section
 * Call this if you need to re-hydrate (e.g., after refetching plan)
 */
export function createHydrationResetter() {
  let resetCallback: (() => void) | null = null;

  return {
    setResetCallback: (callback: () => void) => {
      resetCallback = callback;
    },
    reset: () => {
      resetCallback?.();
    },
  };
}
