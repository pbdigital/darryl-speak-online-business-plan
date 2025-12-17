"use client";

import { Users } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";

export function StepSupport() {
  const supportSystem = useSectionFourStore((state) => state.data.supportSystem);
  const updateSupportSystemItem = useSectionFourStore((state) => state.updateSupportSystemItem);

  return (
    <StepContainer>
      <StepHeader
        part="Part 4F"
        title="Support Environment"
        highlightWord="Support"
        subtitle="List the people, tools, and resources you can lean on—your POWER AGENT® community, coaching, accountability partners, and peers."
        icon={Users}
      />

      <DarrylTip
        tip="The lone wolf mentality is a myth in real estate. The most successful agents have a strong support network. Surround yourself with people who believe in your vision."
        className="mb-8"
      />

      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          My Support System
        </h3>
        {supportSystem.map((item, index) => (
          <PremiumTextarea
            key={index}
            number={index + 1}
            label={`Support ${index + 1}`}
            placeholder="I can rely on... (e.g., my coach, my spouse, my accountability partner, the POWER AGENT® community, my mentor...)"
            value={item}
            onChange={(value) => updateSupportSystemItem(index, value)}
            minHeight={80}
            maxHeight={200}
          />
        ))}
      </div>

      <UpNextFooter text="Who do you need to become?" />
    </StepContainer>
  );
}
