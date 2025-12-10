"use client";

import { useSectionFourStore } from "@/stores/section-four-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/section-three/ui/darryl-tip";

export function StepRoutines() {
  const morningRoutine = useSectionFourStore((state) => state.data.morningRoutine);
  const eveningRoutine = useSectionFourStore((state) => state.data.eveningRoutine);
  const updateMorningRoutine = useSectionFourStore((state) => state.updateMorningRoutine);
  const updateEveningRoutine = useSectionFourStore((state) => state.updateEveningRoutine);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 4B
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Define Your Grounding Rituals
        </h2>
        <p className="text-slate-600">
          Identify your morning and evening routines. What starts your day with
          clarity? What closes your day with calm? List simple, repeatable actions
          such as journaling, stretching, gratitude, or reviewing your schedule.
        </p>
      </div>

      {/* DarrylTip - After intro */}
      <DarrylTip
        tip="Your morning routine sets the tone for the entire day. Start with intention, not reaction. Don't check your phone first thing—check in with yourself first."
        className="mb-8"
      />

      {/* Routine Textareas */}
      <div className="space-y-2">
        <WorkbookTextarea
          label="Morning Routine"
          placeholder="When I wake up, I will... (e.g., meditate for 10 minutes, review my affirmations, exercise, plan my day...)"
          rows={6}
          value={morningRoutine}
          onChange={updateMorningRoutine}
        />

        <WorkbookTextarea
          label="Evening Routine"
          placeholder="Before bed, I will... (e.g., review my wins for the day, prepare for tomorrow, journal, disconnect from screens...)"
          rows={6}
          value={eveningRoutine}
          onChange={updateEveningRoutine}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Identify your boundaries →
        </p>
      </div>
    </div>
  );
}
