"use client";

import { Shield } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepBoundaries() {
  const boundaries = useSectionFourStore((state) => state.data.boundaries);
  const updateBoundary = useSectionFourStore((state) => state.updateBoundary);

  return (
    <StepContainer>
      <StepHeader
        part="Part 4C"
        title="Your Boundaries"
        highlightWord="Boundaries"
        subtitle="Boundaries protect your energy and prevent overwhelm. Clarify where you need stronger limits—phone time, client expectations, work hours, or saying 'no' more often."
        icon={Shield}
      />

      <DarrylTip
        tip="Boundaries aren't walls—they're guardrails. They don't limit your success; they protect it. The agents who burn out are the ones who never set limits."
        className="mb-8"
      />

      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          My {CURRENT_PLAN_YEAR} Boundaries
        </h3>
        {boundaries.map((boundary, index) => (
          <PremiumTextarea
            key={index}
            number={index + 1}
            label={`Boundary ${index + 1}`}
            placeholder="I will... (e.g., not answer work calls after 7pm, take Sundays off, limit social media to 30 minutes...)"
            value={boundary}
            onChange={(value) => updateBoundary(index, value)}
            minHeight={80}
            maxHeight={200}
          />
        ))}
      </div>

      <UpNextFooter text="List your self-care practices" />
    </StepContainer>
  );
}
