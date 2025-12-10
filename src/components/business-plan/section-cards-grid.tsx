"use client";

import { SectionCard } from "@/components/business-plan";
import { useSectionOneStore } from "@/stores/section-one-store";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { useSectionFourStore } from "@/stores/section-four-store";
import { useSectionFiveStore } from "@/stores/section-five-store";
import { Users } from "lucide-react";

interface SectionData {
  sectionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

interface SectionCardsGridProps {
  sections: SectionData[];
}

type SectionStatus = "not_started" | "in_progress" | "completed";

export function SectionCardsGrid({ sections }: SectionCardsGridProps) {
  // Get progress from all section stores
  const section1Progress = useSectionOneStore((state) => state.getProgress());
  const section2Progress = useSectionTwoStore((state) => state.getProgress());
  const section3Progress = useBusinessPlanStore((state) => state.getProgress());
  const section4Progress = useSectionFourStore((state) => state.getProgress());
  const section5Progress = useSectionFiveStore((state) => state.getProgress());

  // Calculate status for each section
  const getStatus = (progress: number): SectionStatus => {
    if (progress === 0) return "not_started";
    if (progress === 100) return "completed";
    return "in_progress";
  };

  // Build progress map for all sections
  const sectionProgressMap: Record<number, { status: SectionStatus; progress: number }> = {
    1: { status: getStatus(section1Progress), progress: section1Progress },
    2: { status: getStatus(section2Progress), progress: section2Progress },
    3: { status: getStatus(section3Progress), progress: section3Progress },
    4: { status: getStatus(section4Progress), progress: section4Progress },
    5: { status: getStatus(section5Progress), progress: section5Progress },
  };

  // Find the current active section (first non-completed section)
  const currentSectionNumber = (() => {
    for (let i = 1; i <= 5; i++) {
      if (sectionProgressMap[i].status !== "completed") {
        return i;
      }
    }
    return 5; // All completed, last section is "current"
  })();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => {
        const progressData = sectionProgressMap[section.sectionNumber];
        const isDimmed = section.sectionNumber > currentSectionNumber;

        return (
          <SectionCard
            key={section.sectionNumber}
            {...section}
            status={progressData?.status}
            progress={progressData?.progress}
            dimmed={isDimmed}
          />
        );
      })}

      {/* Digital Coach Card - matches the navy hero aesthetic */}
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-[#0F172A] p-8 text-white">
        {/* Corner decoration to match section cards */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-bl-[100px] bg-white/5" />

        <div className="relative z-10">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Users className="h-6 w-6 text-white/80" />
          </div>

          <h3 className="text-2xl font-bold">Digital Coach</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Stuck on your SWOT analysis? Need help calculating GCI? Ask your AI assistant.
          </p>
        </div>

        <div className="relative z-10 mt-6 w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 text-center text-sm font-medium text-slate-400">
          Coming Soon
        </div>
      </div>
    </div>
  );
}
