"use client";

import { useSectionFourStore } from "@/stores/section-four-store";
import { WorkbookInput } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepAffirmations() {
  const affirmations = useSectionFourStore((state) => state.data.affirmations);
  const updateAffirmation = useSectionFourStore((state) => state.updateAffirmation);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 4A
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Review Motivating Affirmations
        </h2>
        <p className="text-slate-600">
          Choose 3-5 affirmations that reinforce who you are becoming in 2026.
          These should be statements that help you stay focused, confident, and
          rooted in possibility—especially on tough days. Write them in the
          present tense, as if they&apos;re already true.
        </p>
        <p className="mt-2 text-sm italic text-slate-500">
          Find 15 Powerful Affirmations for Real Estate Agents in the Motivational
          Tab in the POWER AGENT® Classroom!
        </p>
      </div>

      {/* DarrylTip - After intro */}
      <DarrylTip
        tip="Your affirmations work best when you read them aloud each morning. Start your day by speaking your success into existence."
        className="mb-8"
      />

      {/* Affirmation Inputs */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          My 2026 Affirmations
        </h3>
        {affirmations.map((affirmation, index) => (
          <WorkbookInput
            key={index}
            label={`Affirmation ${index + 1}`}
            placeholder="I am..."
            value={affirmation}
            onChange={(value) => updateAffirmation(index, String(value || ""))}
            className="mb-4"
          />
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Define your grounding rituals →
        </p>
      </div>
    </div>
  );
}
