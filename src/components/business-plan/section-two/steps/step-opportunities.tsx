"use client";

import { Lightbulb } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
  SwotCard,
} from "@/components/business-plan/ui";

const opportunityPlaceholders = [
  { left: "Growing first-time buyer market", right: "Create targeted content, partner with lenders for seminars" },
  { left: "New development in my area", right: "Connect with builders, become the go-to agent for the project" },
  { left: "Expired listings in target neighborhood", right: "Send personalized outreach with fresh marketing plan" },
  { left: "Local business networking events", right: "Attend monthly chamber meetings, offer home buyer workshops" },
  { left: "Rising demand for investment properties", right: "Build relationships with local investors, learn ROI analysis" },
  { left: "Underserved luxury market segment", right: "Upgrade marketing materials, get certified in luxury homes" },
  { left: "Relocation companies seeking partners", right: "Reach out to HR departments, join relocation networks" },
  { left: "Social media video content trending", right: "Start weekly market update videos, showcase listings" },
];

export function StepOpportunities() {
  const opportunities = useSectionTwoStore((state) => state.data.opportunities);
  const updateOpportunity = useSectionTwoStore(
    (state) => state.updateOpportunity
  );

  return (
    <StepContainer>
      <StepHeader
        part="Part 2C"
        title="Your Opportunities"
        highlightWord="Opportunities"
        subtitle="What external possibilities exist for growth? Identify chances to expand and improve your business in the market."
        icon={Lightbulb}
      />

      <DarrylTip
        tip="Opportunities are everywhere, but they favor the prepared. Keep your eyes open, your skills sharp, and be ready to act when the right one appears."
        className="mb-8"
      />

      {/* Opportunities Cards */}
      <div className="mb-10 space-y-6">
        {opportunities.map((item, index) => (
          <SwotCard
            key={index}
            number={index + 1}
            primaryLabel="Business Possibility"
            secondaryLabel="Action steps to take"
            primaryValue={item.possibility}
            secondaryValue={item.actionSteps}
            onPrimaryChange={(value) =>
              updateOpportunity(index, "possibility", value)
            }
            onSecondaryChange={(value) =>
              updateOpportunity(index, "actionSteps", value)
            }
            primaryPlaceholder={opportunityPlaceholders[index]?.left}
            secondaryPlaceholder={opportunityPlaceholders[index]?.right}
          />
        ))}
      </div>

      <UpNextFooter text="Anticipate potential threats" />
    </StepContainer>
  );
}
