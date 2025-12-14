"use client";

import { useSectionFiveStore } from "@/stores/section-five-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepResources() {
  const currentResources = useSectionFiveStore((state) => state.data.currentResources);
  const neededResources = useSectionFiveStore((state) => state.data.neededResources);
  const updateCurrentResource = useSectionFiveStore((state) => state.updateCurrentResource);
  const updateNeededResource = useSectionFiveStore((state) => state.updateNeededResource);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 5B
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Exploring Your Resources
        </h2>
        <p className="text-slate-600">
          Before chasing new tools and systems, take inventory of what you already
          have. Then identify the gaps—what resources would accelerate your progress
          if you acquired them this year?
        </p>
      </div>

      {/* DarrylTip */}
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
            <WorkbookTextarea
              key={`current-${index}`}
              label={`Resource ${index + 1}`}
              placeholder="e.g., CRM with 500 contacts, Canva Pro subscription, Weekly team meeting access..."
              rows={2}
              value={resource}
              onChange={(val) => updateCurrentResource(index, String(val || ""))}
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
            <WorkbookTextarea
              key={`needed-${index}`}
              label={`Resource ${index + 1}`}
              placeholder="e.g., Video editing software for social media, Transaction coordinator, Lead generation system..."
              rows={2}
              value={resource}
              onChange={(val) => updateNeededResource(index, String(val || ""))}
            />
          ))}
        </div>
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Define your ideal client profiles →
        </p>
      </div>
    </div>
  );
}
