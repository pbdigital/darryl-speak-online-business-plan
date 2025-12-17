"use client";

import { Zap } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotRow } from "../ui";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
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

  const filledCount = strengths.filter((s) => s.strength.trim()).length;

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

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-slate-50 px-6 py-4">
        <span className="text-sm font-medium text-slate-700">
          {filledCount} of 8 strengths identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#1a2744] transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Strengths Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-lg">
        <div className="p-6 md:p-8">
          {strengths.map((item, index) => (
            <SwotRow
              key={index}
              index={index}
              leftLabel="Strength"
              rightLabel="Where Can Your Strength Be Put To Use"
              leftValue={item.strength}
              rightValue={item.useCase}
              onLeftChange={(value) => updateStrength(index, "strength", value)}
              onRightChange={(value) => updateStrength(index, "useCase", value)}
              leftPlaceholder={strengthPlaceholders[index]?.left}
              rightPlaceholder={strengthPlaceholders[index]?.right}
            />
          ))}
        </div>
      </div>

      <UpNextFooter text="Identify your weaknesses" />
    </StepContainer>
  );
}
