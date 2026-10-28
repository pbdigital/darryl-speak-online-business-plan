"use client";

import { useSyncExternalStore } from "react";
import { useSectionProgress } from "@/hooks/use-section-progress";

const noopSubscribe = () => () => {};

/** "N of 5" from the user's real progress, since sections can be done in any order. */
export function SectionsCompleteCount() {
  // Store values differ between server and browser, so show them after mount.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { completedSections, totalSections } = useSectionProgress();
  return (
    <>
      {mounted ? completedSections : "-"} of {totalSections}
    </>
  );
}
