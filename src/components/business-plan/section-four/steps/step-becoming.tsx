"use client";

import { useSectionFourStore } from "@/stores/section-four-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepBecoming() {
  const whoINeedToBecome = useSectionFourStore((state) => state.data.whoINeedToBecome);
  const updateWhoINeedToBecome = useSectionFourStore((state) => state.updateWhoINeedToBecome);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 4G
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Who Do You Need to Become?
        </h2>
        <p className="text-slate-600">
          Use this moment to free write about what kind of habits, skills, and
          beliefs you need to have to reach your idea of success. Do you need to
          wake up earlier? Eat better? Overcome a fear? Partner with someone?
          Change brokerages? Invest in a new tool? Roleplay more often? Be specific
          about who you need to become to achieve your goals.
        </p>
      </div>

      {/* DarrylTip - After intro */}
      <DarrylTip
        tip="Your results in 2026 will be a reflection of who you become. Focus on identity, not just outcomes. When you change who you are, your actions—and results—follow."
        className="mb-8"
      />

      {/* Becoming Textarea */}
      <div className="space-y-2">
        <WorkbookTextarea
          label="Who I Need to Become"
          placeholder="To achieve my 2026 goals, I need to become someone who... (be specific about the habits, skills, beliefs, and changes you need to make)"
          rows={10}
          value={whoINeedToBecome}
          onChange={updateWhoINeedToBecome}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Review your mindset system and complete Section 4 →
        </p>
      </div>
    </div>
  );
}
