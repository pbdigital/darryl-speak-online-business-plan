"use client";

import { Heart } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";

export function StepSelfCare() {
  const selfCareCommitments = useSectionFourStore((state) => state.data.selfCareCommitments);
  const updateSelfCareCommitment = useSectionFourStore((state) => state.updateSelfCareCommitment);

  return (
    <StepContainer>
      <StepHeader
        part="Part 4D"
        title="Self-Care Commitments"
        highlightWord="Self-Care"
        subtitle="Write down the practices that replenish you physically, mentally, and emotionally. Commit to the ones you'll maintain weekly."
        icon={Heart}
      />

      <DarrylTip
        tip="You can't pour from an empty cup. The most successful agents I know prioritize their health and well-being—not as a luxury, but as a business necessity."
        className="mb-8"
      />

      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          My Self-Care Commitments
        </h3>
        {selfCareCommitments.map((commitment, index) => (
          <PremiumTextarea
            key={index}
            number={index + 1}
            label={`Commitment ${index + 1}`}
            placeholder="I commit to... (e.g., exercising 3x per week, drinking 8 glasses of water daily, reading for 20 minutes...)"
            value={commitment}
            onChange={(value) => updateSelfCareCommitment(index, value)}
            minHeight={80}
            maxHeight={200}
          />
        ))}
      </div>

      <UpNextFooter text="Define your motivation triggers" />
    </StepContainer>
  );
}
