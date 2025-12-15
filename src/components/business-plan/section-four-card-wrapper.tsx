"use client";

import { useState, useEffect } from "react";
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
  // Track if component has mounted to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const storeProgress = useSectionFourStore((state) => state.getProgress());

  // Use default values until mounted to ensure consistent server/client rendering
  const progress = mounted ? storeProgress : 0;

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
