"use client";

import { BookOpen } from "lucide-react";
import { WorkbookTextarea, StepContainer, StepHeader, UpNextFooter } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepReflectionQuestions() {
  return (
    <StepContainer>
      <StepHeader
        part="Part 1B"
        title="Reflection & Intention"
        highlightWord="Intention"
        subtitle="Set meaningful goals aligned with your values. Lead with the heart and stay centered with your true self."
        icon={BookOpen}
      />

      <DarrylTip
        tip="The most successful agents I know treat reflection like a business meeting—scheduled, intentional, and honest. Your past holds the blueprint for your future success."
        className="mb-10"
      />

      {/* Looking Back Section */}
      <section className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <BookOpen className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Looking Back</h2>
            <p className="text-sm text-slate-500">Reflect on your journey</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={1}
            label="What were your most significant achievements and milestones in the past year?"
            fieldName="significantAchievements"
            placeholder="I'm most proud of closing my biggest deal ever in Q3. I also finally hired an assistant which freed up 10 hours a week..."
          />
          <WorkbookTextarea
            number={2}
            label="What challenges did you face, and how did you overcome them?"
            fieldName="challengesAndOvercoming"
            placeholder="The market slowdown in spring was tough. I overcame it by doubling down on my sphere and hosting three client appreciation events..."
          />
          <WorkbookTextarea
            number={3}
            label="What did you learn about yourself in the past year?"
            fieldName="learnedAboutSelf"
            placeholder="I learned that I work best in the mornings and should schedule my prospecting calls before 11am. I also discovered..."
          />
        </div>
      </section>

      <UpNextFooter text="Gratitude reflection" />
    </StepContainer>
  );
}
