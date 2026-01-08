'use client';

import { useEffect, useRef } from 'react';
import { useBusinessPlan } from '@/providers/business-plan-provider';
import { useSectionOneStore, SectionOneData } from '@/stores/section-one-store';
import { useSectionTwoStore, SectionTwoData } from '@/stores/section-two-store';
import { useBusinessPlanStore } from '@/stores/business-plan-store';
import { useSectionFourStore } from '@/stores/section-four-store';
import { useSectionFiveStore } from '@/stores/section-five-store';
import type { IncomePlanningSection, MindsetSection, AccountabilitySection } from '@/types/business-plan';

/**
 * Hook to hydrate all section stores from server data.
 * Use this on the dashboard to ensure stores have correct data
 * before reading progress values.
 *
 * @returns Whether hydration is complete
 */
export function useHydrateAllStores(): { isHydrated: boolean } {
  const { sections, isLoading } = useBusinessPlan();
  const hasHydrated = useRef(false);

  // Get hydrate functions from each store
  const hydrateSection1 = useSectionOneStore((state) => state.hydrate);
  const hydrateSection2 = useSectionTwoStore((state) => state.hydrate);
  const hydrateSection3 = useBusinessPlanStore((state) => state.hydrate);
  const hydrateSection4 = useSectionFourStore((state) => state.hydrate);
  const hydrateSection5 = useSectionFiveStore((state) => state.hydrate);

  useEffect(() => {
    // Don't hydrate while still loading or if already hydrated
    if (isLoading || hasHydrated.current) return;

    // Hydrate each store with its corresponding section data
    if (sections.reflection?.data) {
      hydrateSection1(sections.reflection.data as Partial<SectionOneData>);
    }

    if (sections.swot?.data) {
      hydrateSection2(sections.swot.data as Partial<SectionTwoData>);
    }

    if (sections['income-planning']?.data) {
      hydrateSection3(sections['income-planning'].data as Partial<IncomePlanningSection>);
    }

    if (sections.mindset?.data) {
      hydrateSection4(sections.mindset.data as Partial<MindsetSection>);
    }

    if (sections.accountability?.data) {
      hydrateSection5(sections.accountability.data as Partial<AccountabilitySection>);
    }

    // Mark as hydrated to prevent re-hydration
    hasHydrated.current = true;
  }, [
    isLoading,
    sections,
    hydrateSection1,
    hydrateSection2,
    hydrateSection3,
    hydrateSection4,
    hydrateSection5,
  ]);

  return {
    isHydrated: hasHydrated.current || !isLoading,
  };
}
