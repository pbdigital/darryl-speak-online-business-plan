"use client";

import { useSectionFourStore } from "@/stores/section-four-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepSupport() {
  const supportSystem = useSectionFourStore((state) => state.data.supportSystem);
  const updateSupportSystemItem = useSectionFourStore((state) => state.updateSupportSystemItem);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 4F
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Create a Support Environment
        </h2>
        <p className="text-slate-600">
          List the people, tools, and resources you can lean on—your POWER AGENT®
          community, coaching, accountability partners, Digital Darryl™, and peers.
          You don&apos;t have to do this business alone.
        </p>
      </div>

      {/* DarrylTip - After intro */}
      <DarrylTip
        tip="The lone wolf mentality is a myth in real estate. The most successful agents have a strong support network. Surround yourself with people who believe in your vision."
        className="mb-8"
      />

      {/* Support System Textareas */}
      <div className="space-y-2">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
          My Support System
        </h3>
        {supportSystem.map((item, index) => (
          <WorkbookTextarea
            key={index}
            label={`Support ${index + 1}`}
            placeholder="I can rely on... (e.g., my coach, my spouse, my accountability partner, the POWER AGENT® community, my mentor...)"
            rows={2}
            value={item}
            onChange={(value) => updateSupportSystemItem(index, value)}
          />
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Who do you need to become? →
        </p>
      </div>
    </div>
  );
}
