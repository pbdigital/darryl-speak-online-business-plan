"use client";

import { Sunrise } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";

export function StepRoutines() {
  const morningRoutine = useSectionFourStore((state) => state.data.morningRoutine);
  const eveningRoutine = useSectionFourStore((state) => state.data.eveningRoutine);
  const updateMorningRoutine = useSectionFourStore((state) => state.updateMorningRoutine);
  const updateEveningRoutine = useSectionFourStore((state) => state.updateEveningRoutine);

  return (
    <StepContainer>
      <StepHeader
        part="Part 4B"
        title="Grounding Rituals"
        highlightWord="Rituals"
        subtitle="Identify your morning and evening routines. What starts your day with clarity? What closes your day with calm?"
        icon={Sunrise}
      />

      <DarrylTip
        tip="Your morning routine sets the tone for the entire day. Start with intention, not reaction. Don't check your phone first thing—check in with yourself first."
        className="mb-8"
      />

      <div className="space-y-6">
        <PremiumTextarea
          number={1}
          label="Morning Routine"
          placeholder="When I wake up, I will... (e.g., meditate for 10 minutes, review my affirmations, exercise, plan my day...)"
          value={morningRoutine}
          onChange={updateMorningRoutine}
        />

        <PremiumTextarea
          number={2}
          label="Evening Routine"
          placeholder="Before bed, I will... (e.g., review my wins for the day, prepare for tomorrow, journal, disconnect from screens...)"
          value={eveningRoutine}
          onChange={updateEveningRoutine}
        />
      </div>

      <UpNextFooter text="Identify your boundaries" />
    </StepContainer>
  );
}
