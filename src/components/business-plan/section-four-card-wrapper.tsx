"use client";

import { SectionCard } from "@/components/business-plan";
import { useSectionFourStore } from "@/stores/section-four-store";

interface SectionFourCardWrapperProps {
  sectionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  dimmed?: boolean;
}

export function SectionFourCardWrapper({
  sectionNumber,
  title,
  subtitle,
  description,
  href,
  dimmed,
}: SectionFourCardWrapperProps) {
  const progress = useSectionFourStore((state) => state.getProgress());

  const status =
    progress === 0
      ? "not_started"
      : progress === 100
        ? "completed"
        : "in_progress";

  return (
    <SectionCard
      sectionNumber={sectionNumber}
      title={title}
      subtitle={subtitle}
      description={description}
      href={href}
      status={status}
      progress={progress}
      dimmed={dimmed}
    />
  );
}
