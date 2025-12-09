"use client";

import { SectionCard } from "@/components/business-plan";
import { useBusinessPlanStore } from "@/stores/business-plan-store";

interface SectionThreeCardWrapperProps {
  sectionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

export function SectionThreeCardWrapper(props: SectionThreeCardWrapperProps) {
  const progress = useBusinessPlanStore((state) => state.getProgress());

  // Determine status based on progress
  const status =
    progress === 0
      ? "not_started"
      : progress === 100
        ? "completed"
        : "in_progress";

  return <SectionCard {...props} status={status} progress={progress} />;
}
