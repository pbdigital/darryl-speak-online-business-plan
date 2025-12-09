"use client";

import { SectionCard } from "@/components/business-plan";
import { useSectionOneStore } from "@/stores/section-one-store";

interface SectionOneCardWrapperProps {
  sectionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

export function SectionOneCardWrapper(props: SectionOneCardWrapperProps) {
  const progress = useSectionOneStore((state) => state.getProgress());

  // Determine status based on progress
  const status =
    progress === 0
      ? "not_started"
      : progress === 100
        ? "completed"
        : "in_progress";

  return <SectionCard {...props} status={status} progress={progress} />;
}
