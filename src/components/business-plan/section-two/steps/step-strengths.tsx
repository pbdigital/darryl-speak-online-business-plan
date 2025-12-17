"use client";

import { Zap } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
  SwotCard,
} from "@/components/business-plan/ui";

const strengthPlaceholders = [
  { left: "Strong negotiation skills", right: "Use in listing presentations and buyer negotiations" },
  { left: "Deep local market knowledge", right: "Position as the neighborhood expert in marketing" },
  { left: "Excellent follow-up systems", right: "Convert more leads through consistent communication" },
  { left: "Strong referral network", right: "Ask for introductions after every closing" },
  { left: "Social media presence", right: "Generate leads through consistent content creation" },
  { left: "First-time buyer expertise", right: "Partner with lenders for buyer seminars" },
  { left: "Responsive communication", right: "Highlight quick response times in listing pitches" },
  { left: "Professional photography skills", right: "Offer as added value to win more listings" },
];

export function StepStrengths() {
  const strengths = useSectionTwoStore((state) => state.data.strengths);
  const updateStrength = useSectionTwoStore((state) => state.updateStrength);

  return (
    <StepContainer>
      <StepHeader
        part="Part 2A"
        title="Your Strengths"
        highlightWord="Strengths"
        subtitle="What do you do well? Identify your core strengths and how you can leverage them for success in your real estate business."
        icon={Zap}
      />

      <DarrylTip
        tip="Know your superpowers and use them intentionally. The best agents don't try to be good at everything—they become exceptional at what they naturally do well."
        className="mb-8"
      />

      {/* Strengths Cards */}
      <div className="mb-10 space-y-6">
        {strengths.map((item, index) => (
          <SwotCard
            key={index}
            number={index + 1}
            primaryLabel="Strength"
            secondaryLabel="Where can this strength be put to use?"
            primaryValue={item.strength}
            secondaryValue={item.useCase}
            onPrimaryChange={(value) => updateStrength(index, "strength", value)}
            onSecondaryChange={(value) => updateStrength(index, "useCase", value)}
            primaryPlaceholder={strengthPlaceholders[index]?.left}
            secondaryPlaceholder={strengthPlaceholders[index]?.right}
          />
        ))}
      </div>

      <UpNextFooter text="Identify your weaknesses" />
    </StepContainer>
  );
}
