"use client";

import { Flame } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";

export function StepMotivation() {
  const whatMotivatesMe = useSectionFourStore((state) => state.data.whatMotivatesMe);
  const updateWhatMotivatesMe = useSectionFourStore((state) => state.updateWhatMotivatesMe);

  return (
    <StepContainer>
      <StepHeader
        part="Part 4E"
        title="Motivation Triggers"
        highlightWord="Motivation"
        subtitle="What reignites your fire when you hit a lull? Capture the things that reset your momentum when motivation dips."
        icon={Flame}
      />

      <DarrylTip
        tip="Motivation isn't something you wait for—it's something you create. Have a 'motivation toolkit' ready for the tough days. Know exactly what will get you back in action."
        className="mb-8"
      />

      <div className="space-y-6">
        <PremiumTextarea
          number={1}
          label="What Motivates Me"
          placeholder="When I feel unmotivated, I can... (e.g., listen to my power playlist, review my vision board, call my accountability partner, watch an inspiring video, remember why I started...)"
          value={whatMotivatesMe}
          onChange={updateWhatMotivatesMe}
          minHeight={150}
          maxHeight={400}
        />
      </div>

      <UpNextFooter text="Create your support environment" />
    </StepContainer>
  );
}
