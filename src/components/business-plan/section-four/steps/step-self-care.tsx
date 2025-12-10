"use client";

import { useSectionFourStore } from "@/stores/section-four-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/section-three/ui/darryl-tip";

export function StepSelfCare() {
  const selfCareCommitments = useSectionFourStore((state) => state.data.selfCareCommitments);
  const updateSelfCareCommitment = useSectionFourStore((state) => state.updateSelfCareCommitment);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 4D
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Self-Care Practices & Commitments
        </h2>
        <p className="text-slate-600">
          Write down the practices that replenish you physically, mentally, and
          emotionally. Commit to the ones you&apos;ll maintain weekly. This may
          include movement, meditation, hobbies, rest, therapy, time with family,
          hydration—anything that fuels and restores you.
        </p>
      </div>

      {/* DarrylTip - After intro */}
      <DarrylTip
        tip="You can't pour from an empty cup. The most successful agents I know prioritize their health and well-being—not as a luxury, but as a business necessity."
        className="mb-8"
      />

      {/* Self-Care Textareas */}
      <div className="space-y-2">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
          My Self-Care Commitments
        </h3>
        {selfCareCommitments.map((commitment, index) => (
          <WorkbookTextarea
            key={index}
            label={`Commitment ${index + 1}`}
            placeholder="I commit to... (e.g., exercising 3x per week, drinking 8 glasses of water daily, reading for 20 minutes...)"
            rows={2}
            value={commitment}
            onChange={(value) => updateSelfCareCommitment(index, value)}
          />
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Define your motivation triggers →
        </p>
      </div>
    </div>
  );
}
