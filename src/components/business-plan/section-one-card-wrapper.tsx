"use client";

import { useState, useEffect } from "react";
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
  // Track if component has mounted to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const storeProgress = useSectionOneStore((state) => state.getProgress());

  // Use default values until mounted to ensure consistent server/client rendering
  const progress = mounted ? storeProgress : 0;

  // Determine status based on progress
  const status =
    progress === 0
      ? "not_started"
      : progress === 100
        ? "completed"
        : "in_progress";

  return <SectionCard {...props} status={status} progress={progress} />;
}
