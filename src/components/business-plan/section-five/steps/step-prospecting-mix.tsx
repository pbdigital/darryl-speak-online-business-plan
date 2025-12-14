"use client";

import { useSectionFiveStore } from "@/stores/section-five-store";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";
import { ActivityCard } from "../ui/activity-card";
import type { ProspectingActivity } from "@/types/business-plan";

export function StepProspectingMix() {
  const prospectingActivities = useSectionFiveStore(
    (state) => state.data.prospectingActivities
  );
  const updateProspectingActivityField = useSectionFiveStore(
    (state) => state.updateProspectingActivityField
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 5D
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Your Prospecting Mix
        </h2>
        <p className="text-slate-600">
          Prospecting is proactive outreach—you&apos;re going to them. Define 3
          prospecting activities you&apos;ll commit to this year, including the who,
          what, when, and how of each approach.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="The best prospecting plan is one you'll actually do. Pick activities that match your personality and schedule. Consistency beats intensity—30 minutes daily outperforms 4-hour marathon sessions that you dread."
        className="mb-8"
      />

      {/* Prospecting Ideas */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
          Active Prospecting Ideas
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Cold calling FSBOs/Expireds",
            "Geographic/Circle Prospecting",
            "Door knocking",
            "Calling sphere of influence",
            "Calling past clients",
            "Open houses",
            "Networking events",
            "Social media outreach",
            "Community involvement",
            "Referral requests",
          ].map((idea) => (
            <span
              key={idea}
              className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 shadow-sm"
            >
              {idea}
            </span>
          ))}
        </div>
      </div>

      {/* Prospecting Activities */}
      <div className="mb-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          My 2026 Prospecting Plan
        </h3>
        {prospectingActivities.map((activity, index) => (
          <ActivityCard
            key={`prospecting-${index}`}
            type="prospecting"
            index={index}
            activity={activity.activity}
            how={activity.how}
            who={activity.who}
            when={activity.when}
            farmArea={activity.farmArea}
            cost={activity.cost}
            followUpPlan={activity.followUpPlan}
            onFieldChange={(field, value) =>
              updateProspectingActivityField(
                index,
                field as keyof ProspectingActivity,
                value
              )
            }
          />
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Plan your marketing mix →
        </p>
      </div>
    </div>
  );
}
