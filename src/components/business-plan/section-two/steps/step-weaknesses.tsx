"use client";

import { AlertTriangle } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
  WeaknessCard,
} from "@/components/business-plan/ui";

const weaknessPlaceholders = [
  "Inconsistent follow-up with leads",
  "Difficulty saying no to clients",
  "Procrastination on prospecting",
  "Weak listing presentation skills",
  "Poor time management",
  "Uncomfortable with cold calling",
  "Limited technology skills",
  "Trouble delegating tasks",
];

export function StepWeaknesses() {
  const weaknesses = useSectionTwoStore((state) => state.data.weaknesses);
  const updateWeakness = useSectionTwoStore((state) => state.updateWeakness);
  const updateWeaknessAction = useSectionTwoStore(
    (state) => state.updateWeaknessAction
  );

  return (
    <StepContainer>
      <StepHeader
        part="Part 2B"
        title="Your Weaknesses"
        highlightWord="Weaknesses"
        subtitle="Identify areas for improvement and decide whether to accept, delegate, or work on them. Honest self-assessment is key to growth."
        icon={AlertTriangle}
      />

      <DarrylTip
        tip="Admitting weakness takes courage, but it's where real growth begins. You don't have to fix everything—sometimes the smartest move is to delegate or accept and work around it."
        className="mb-8"
      />

      {/* Weakness Cards */}
      <div className="mb-10 space-y-6">
        {weaknesses.map((item, index) => (
          <WeaknessCard
            key={index}
            number={index + 1}
            weaknessValue={item.weakness}
            actionValue={item.action}
            onWeaknessChange={(value) => updateWeakness(index, value)}
            onActionChange={(action) => updateWeaknessAction(index, action)}
            placeholder={weaknessPlaceholders[index]}
          />
        ))}
      </div>

      <UpNextFooter text="Discover your opportunities" />
    </StepContainer>
  );
}
