"use client";

import { SectionCard } from "@/components/business-plan";
import { useSectionTwoStore } from "@/stores/section-two-store";

interface SectionTwoCardWrapperProps {
  sectionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

export function SectionTwoCardWrapper(props: SectionTwoCardWrapperProps) {
  const progress = useSectionTwoStore((state) => state.getProgress());

  // Determine status based on progress
  const status =
    progress === 0
      ? "not_started"
      : progress === 100
        ? "completed"
        : "in_progress";

  return <SectionCard {...props} status={status} progress={progress} />;
}
