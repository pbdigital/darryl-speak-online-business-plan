"use client";

import { WorkbookTextarea } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepCelebration() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 1H
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Celebration & Reflection
        </h2>
        <p className="text-slate-600">
          Acknowledge your progress and stay aligned with what matters most.
          Planning how you&apos;ll celebrate keeps you motivated throughout the year.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="Celebrate your wins, big and small. The agents who burn out are the ones who never pause to acknowledge progress. Joy is fuel for the journey ahead."
        className="mb-8"
      />

      <div className="space-y-2">
        <WorkbookTextarea
          label="What milestones or achievements will you celebrate along the way?"
          fieldName="celebrationMilestones"
          placeholder="Every 5 transactions, take my family to dinner. At $100k GCI, book that Hawaii trip..."
          rows={3}
        />
        <WorkbookTextarea
          label="How often will you pause to reflect on your progress and adjust your goals if needed?"
          fieldName="reflectionFrequency"
          placeholder="Weekly review every Sunday. Monthly deep dive on the first. Quarterly planning retreat..."
          rows={3}
        />
        <WorkbookTextarea
          label="What else would you like to reflect on, improve upon, stop, start or continue this coming year?"
          fieldName="improvementsAndChanges"
          placeholder="STOP: checking email first thing. START: morning routine before work. CONTINUE: Monday prospecting blocks..."
          rows={4}
        />
        <WorkbookTextarea
          label="What is really important to you right now and moving into the new year?"
          fieldName="coreImportance"
          placeholder="Being present for my kids while building a business that supports our dreams. Finding balance..."
          rows={4}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Review and complete Section 1 →
        </p>
      </div>
    </div>
  );
}
