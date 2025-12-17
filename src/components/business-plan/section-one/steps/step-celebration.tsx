"use client";

import { PartyPopper } from "lucide-react";
import { WorkbookTextarea, StepContainer, StepHeader, UpNextFooter } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepCelebration() {
  return (
    <StepContainer>
      <StepHeader
        part="Part 1H"
        title="Celebration & Reflection"
        highlightWord="Celebration"
        subtitle="Acknowledge your progress and stay aligned with what matters most. Planning how you'll celebrate keeps you motivated."
        icon={PartyPopper}
      />

      <DarrylTip
        tip="Celebrate your wins, big and small. The agents who burn out are the ones who never pause to acknowledge progress. Joy is fuel for the journey ahead."
        className="mb-10"
      />

      <div className="space-y-6">
        <WorkbookTextarea
          number={1}
          label="What milestones or achievements will you celebrate along the way?"
          fieldName="celebrationMilestones"
          placeholder="Every 5 transactions, take my family to dinner. At $100k GCI, book that Hawaii trip..."
        />
        <WorkbookTextarea
          number={2}
          label="How often will you pause to reflect on your progress and adjust your goals if needed?"
          fieldName="reflectionFrequency"
          placeholder="Weekly review every Sunday. Monthly deep dive on the first. Quarterly planning retreat..."
        />
        <WorkbookTextarea
          number={3}
          label="What else would you like to reflect on, improve upon, stop, start or continue this coming year?"
          fieldName="improvementsAndChanges"
          placeholder="STOP: checking email first thing. START: morning routine before work. CONTINUE: Monday prospecting blocks..."
        />
        <WorkbookTextarea
          number={4}
          label="What is really important to you right now and moving into the new year?"
          fieldName="coreImportance"
          placeholder="Being present for my kids while building a business that supports our dreams. Finding balance..."
        />
      </div>

      <UpNextFooter text="Review and complete Section 1" />
    </StepContainer>
  );
}
