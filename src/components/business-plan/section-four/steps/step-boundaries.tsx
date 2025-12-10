"use client";

import { useSectionFourStore } from "@/stores/section-four-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/section-three/ui/darryl-tip";

export function StepBoundaries() {
  const boundaries = useSectionFourStore((state) => state.data.boundaries);
  const updateBoundary = useSectionFourStore((state) => state.updateBoundary);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 4C
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Identify Your Boundaries
        </h2>
        <p className="text-slate-600">
          Boundaries protect your energy and prevent overwhelm and burnout.
          Clarify where you need stronger limits—phone time, client expectations,
          work hours, or saying &quot;no&quot; more often. Strong boundaries allow
          you to serve clients better.
        </p>
      </div>

      {/* DarrylTip - After intro */}
      <DarrylTip
        tip="Boundaries aren't walls—they're guardrails. They don't limit your success; they protect it. The agents who burn out are the ones who never set limits."
        className="mb-8"
      />

      {/* Boundaries Textareas */}
      <div className="space-y-2">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
          My 2026 Boundaries
        </h3>
        {boundaries.map((boundary, index) => (
          <WorkbookTextarea
            key={index}
            label={`Boundary ${index + 1}`}
            placeholder="I will... (e.g., not answer work calls after 7pm, take Sundays off, limit social media to 30 minutes...)"
            rows={2}
            value={boundary}
            onChange={(value) => updateBoundary(index, value)}
          />
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: List your self-care practices →
        </p>
      </div>
    </div>
  );
}
