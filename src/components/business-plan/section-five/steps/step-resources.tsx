"use client";

import { Package } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";

export function StepResources() {
  const currentResources = useSectionFiveStore((state) => state.data.currentResources);
  const neededResources = useSectionFiveStore((state) => state.data.neededResources);
  const updateCurrentResource = useSectionFiveStore((state) => state.updateCurrentResource);
  const updateNeededResource = useSectionFiveStore((state) => state.updateNeededResource);

  return (
    <StepContainer>
      <StepHeader
        part="Part 5B"
        title="Exploring Your Resources"
        highlightWord="Resources"
        subtitle="Take inventory of what you already have, then identify the gaps—what resources would accelerate your progress this year?"
        icon={Package}
      />

      <DarrylTip
        tip="Most agents underutilize what they already have. Before buying another tool, ask: 'Am I using what I have to its full potential?' Often the resource you need is already in your toolbox—you just haven't opened it yet."
        className="mb-8"
      />

      {/* Current Resources */}
      <div className="mb-10">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
          Current Resources (What You Have)
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          List the tools, systems, relationships, and assets you already have access to.
          Think about technology, training, mentors, databases, marketing materials, etc.
        </p>
        <div className="space-y-4">
          {currentResources.map((resource, index) => (
            <PremiumTextarea
              key={`current-${index}`}
              number={index + 1}
              label={`Resource ${index + 1}`}
              placeholder="e.g., CRM with 500 contacts, Canva Pro subscription, Weekly team meeting access..."
              value={resource}
              onChange={(val) => updateCurrentResource(index, val)}
              minHeight={80}
              maxHeight={200}
            />
          ))}
        </div>
      </div>

      {/* Needed Resources */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
          Needed Resources (What You Need to Acquire)
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          Identify the tools, skills, or connections that would help you achieve your
          goals faster. Be specific about what you need and why.
        </p>
        <div className="space-y-4">
          {neededResources.map((resource, index) => (
            <PremiumTextarea
              key={`needed-${index}`}
              number={index + 1}
              label={`Resource ${index + 1}`}
              placeholder="e.g., Video editing software for social media, Transaction coordinator, Lead generation system..."
              value={resource}
              onChange={(val) => updateNeededResource(index, val)}
              minHeight={80}
              maxHeight={200}
            />
          ))}
        </div>
      </div>

      <UpNextFooter text="Define your ideal client profiles" />
    </StepContainer>
  );
}
