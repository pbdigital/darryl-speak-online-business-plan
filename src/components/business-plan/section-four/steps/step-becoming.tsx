"use client";

import { Target } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepBecoming() {
  const whoINeedToBecome = useSectionFourStore((state) => state.data.whoINeedToBecome);
  const updateWhoINeedToBecome = useSectionFourStore((state) => state.updateWhoINeedToBecome);

  return (
    <StepContainer>
      <StepHeader
        part="Part 4G"
        title="Who You Need to Become"
        highlightWord="Become"
        subtitle="Free write about what kind of habits, skills, and beliefs you need to reach your idea of success. Be specific about who you need to become."
        icon={Target}
      />

      <DarrylTip
        tip={`Your results in ${CURRENT_PLAN_YEAR} will be a reflection of who you become. Focus on identity, not just outcomes. When you change who you are, your actions—and results—follow.`}
        className="mb-8"
      />

      <div className="space-y-6">
        <PremiumTextarea
          number={1}
          label="Who I Need to Become"
          placeholder={`To achieve my ${CURRENT_PLAN_YEAR} goals, I need to become someone who... (be specific about the habits, skills, beliefs, and changes you need to make)`}
          value={whoINeedToBecome}
          onChange={updateWhoINeedToBecome}
          minHeight={200}
          maxHeight={500}
        />
      </div>

      <UpNextFooter text="Review and complete Section 4" />
    </StepContainer>
  );
}
