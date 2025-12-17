"use client";

import { Heart } from "lucide-react";
import { WorkbookTextarea, StepContainer, StepHeader, UpNextFooter } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepGratitude() {
  return (
    <StepContainer>
      <StepHeader
        part="Part 1C"
        title="Gratitude"
        highlightWord="Gratitude"
        subtitle="Appreciation opens the door to abundance. Reflect on what you're grateful for in your life and business."
        icon={Heart}
      />

      <DarrylTip
        tip="Gratitude is the secret weapon of top performers. When you appreciate what you have, you attract more of what you want. Start every morning by naming three things you're grateful for."
        className="mb-10"
      />

      <div className="space-y-6">
        <WorkbookTextarea
          number={1}
          label="What are you most grateful for from the past year?"
          fieldName="gratefulFor"
          placeholder="I'm grateful for the opportunity to help 12 families find their dream homes this year..."
        />
        <WorkbookTextarea
          number={2}
          label="Who are the people you are most grateful for, and why?"
          fieldName="gratefulPeople"
          placeholder="My mentor Jane who pushed me to take on that challenging listing. My spouse for supporting my crazy hours..."
        />
        <WorkbookTextarea
          number={3}
          label="What moments or experiences brought you the most joy?"
          fieldName="joyfulMoments"
          placeholder="Handing the keys to the Martinez family and seeing their kids run to their new rooms..."
        />
      </div>

      <UpNextFooter text="Self-reflection and values" />
    </StepContainer>
  );
}
