"use client";

import { Sparkles } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepAffirmations() {
  const affirmations = useSectionFourStore((state) => state.data.affirmations);
  const updateAffirmation = useSectionFourStore((state) => state.updateAffirmation);

  return (
    <StepContainer>
      <StepHeader
        part="Part 4A"
        title="Motivating Affirmations"
        highlightWord="Affirmations"
        subtitle={`Choose 3-5 affirmations that reinforce who you are becoming in ${CURRENT_PLAN_YEAR}. Write them in the present tense, as if they're already true.`}
        icon={Sparkles}
      />

      <DarrylTip
        tip="Your affirmations work best when you read them aloud each morning. Start your day by speaking your success into existence."
        className="mb-8"
      />

      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          My {CURRENT_PLAN_YEAR} Affirmations
        </h3>
        {affirmations.map((affirmation, index) => (
          <PremiumTextarea
            key={index}
            number={index + 1}
            label={`Affirmation ${index + 1}`}
            placeholder="I am..."
            value={affirmation}
            onChange={(value) => updateAffirmation(index, value)}
            minHeight={80}
            showWordCount={false}
          />
        ))}
      </div>

      <UpNextFooter text="Define your grounding rituals" />
    </StepContainer>
  );
}
