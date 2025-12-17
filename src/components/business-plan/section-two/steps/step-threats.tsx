"use client";

import { ShieldAlert } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
  SwotCard,
} from "@/components/business-plan/ui";

const threatPlaceholders = [
  { left: "Rising interest rates", right: "Educate buyers on rate locks, focus on pre-approvals" },
  { left: "Increased competition from discount brokers", right: "Emphasize full-service value, track record, and expertise" },
  { left: "Market slowdown or recession fears", right: "Diversify with rentals, build cash reserves, stay visible" },
  { left: "Low inventory in my target area", right: "Prospect FSBOs and expireds, expand geographic reach" },
  { left: "New agent from big team entering my farm", right: "Double down on relationships, increase touchpoints" },
  { left: "Technology disruption (iBuyers, AI)", right: "Adopt new tools early, emphasize human expertise" },
  { left: "Burnout from overwork", right: "Set boundaries, schedule time off, delegate admin tasks" },
  { left: "Economic uncertainty affecting buyers", right: "Focus on motivated sellers, investors, and must-move clients" },
];

export function StepThreats() {
  const threats = useSectionTwoStore((state) => state.data.threats);
  const updateThreat = useSectionTwoStore((state) => state.updateThreat);

  return (
    <StepContainer>
      <StepHeader
        part="Part 2D"
        title="Potential Threats"
        highlightWord="Threats"
        subtitle="What could hold you back? Anticipate challenges and plan your response to stay ahead of potential obstacles."
        icon={ShieldAlert}
      />

      <DarrylTip
        tip="The agents who thrive in any market are the ones who saw challenges coming and had a plan. Don't fear threats—prepare for them."
        className="mb-8"
      />

      {/* Threats Cards */}
      <div className="mb-10 space-y-6">
        {threats.map((item, index) => (
          <SwotCard
            key={index}
            number={index + 1}
            primaryLabel="Possible Threat"
            secondaryLabel="Action steps to take"
            primaryValue={item.threat}
            secondaryValue={item.actionSteps}
            onPrimaryChange={(value) => updateThreat(index, "threat", value)}
            onSecondaryChange={(value) =>
              updateThreat(index, "actionSteps", value)
            }
            primaryPlaceholder={threatPlaceholders[index]?.left}
            secondaryPlaceholder={threatPlaceholders[index]?.right}
          />
        ))}
      </div>

      <UpNextFooter text="Review and complete your SWOT analysis" />
    </StepContainer>
  );
}
