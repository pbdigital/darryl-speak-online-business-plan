"use client";

import { useSectionFourStore } from "@/stores/section-four-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/section-three/ui/darryl-tip";

export function StepMotivation() {
  const whatMotivatesMe = useSectionFourStore((state) => state.data.whatMotivatesMe);
  const updateWhatMotivatesMe = useSectionFourStore((state) => state.updateWhatMotivatesMe);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 4E
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Define Your Motivation Triggers
        </h2>
        <p className="text-slate-600">
          What reignites your fire when you hit a lull? Inspiration doesn&apos;t
          have to be dramatic—it can come from music, mentors, movement, your
          goals, or your &quot;why.&quot; Capture the things that reset your
          momentum when motivation dips.
        </p>
      </div>

      {/* DarrylTip - After intro */}
      <DarrylTip
        tip="Motivation isn't something you wait for—it's something you create. Have a 'motivation toolkit' ready for the tough days. Know exactly what will get you back in action."
        className="mb-8"
      />

      {/* Motivation Textarea */}
      <div className="space-y-2">
        <WorkbookTextarea
          label="What Motivates Me"
          placeholder="When I feel unmotivated, I can... (e.g., listen to my power playlist, review my vision board, call my accountability partner, watch an inspiring video, remember why I started...)"
          rows={8}
          value={whatMotivatesMe}
          onChange={updateWhatMotivatesMe}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Create your support environment →
        </p>
      </div>
    </div>
  );
}
