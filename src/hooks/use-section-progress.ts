"use client";

import { useSectionOneStore } from "@/stores/section-one-store";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { useSectionFourStore } from "@/stores/section-four-store";
import { useSectionFiveStore } from "@/stores/section-five-store";

interface SectionProgressResult {
  completedSections: number;
  totalSections: number;
  progressPercentage: number;
  sectionProgress: number[];
}

/**
 * Aggregates progress from all 5 business plan section stores.
 * Returns the count of completed sections (progress === 100) and overall progress percentage.
 *
 * Note: Consuming components should handle SSR hydration by checking a `mounted` state
 * before displaying values to avoid hydration mismatches.
 */
export function useSectionProgress(): SectionProgressResult {
  const section1Progress = useSectionOneStore((state) => state.getProgress());
  const section2Progress = useSectionTwoStore((state) => state.getProgress());
  const section3Progress = useBusinessPlanStore((state) => state.getProgress());
  const section4Progress = useSectionFourStore((state) => state.getProgress());
  const section5Progress = useSectionFiveStore((state) => state.getProgress());

  const sectionProgress = [
    section1Progress,
    section2Progress,
    section3Progress,
    section4Progress,
    section5Progress,
  ];

  const totalSections = 5;
  const completedSections = sectionProgress.filter((progress) => progress === 100).length;
  const progressPercentage = Math.round((completedSections / totalSections) * 100);

  return {
    completedSections,
    totalSections,
    progressPercentage,
    sectionProgress,
  };
}
