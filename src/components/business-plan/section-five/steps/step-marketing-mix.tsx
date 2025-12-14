"use client";

import { useSectionFiveStore } from "@/stores/section-five-store";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";
import { ActivityCard } from "../ui/activity-card";
import type { MarketingActivity } from "@/types/business-plan";

export function StepMarketingMix() {
  const marketingActivities = useSectionFiveStore(
    (state) => state.data.marketingActivities
  );
  const updateMarketingActivityField = useSectionFiveStore(
    (state) => state.updateMarketingActivityField
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 5E
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Your Marketing Mix
        </h2>
        <p className="text-slate-600">
          Marketing is about attraction—they come to you. Define 3 marketing
          activities you&apos;ll implement this year to build visibility, credibility,
          and lead flow.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="Marketing builds long-term equity. While prospecting creates immediate conversations, marketing creates a pipeline of people who already trust you before they reach out. The best agents do both."
        className="mb-8"
      />

      {/* Marketing Ideas */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
          Marketing Ideas
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Facebook/Instagram advertising",
            "YouTube video content",
            "IDX/Broker lead generation",
            "Mega open houses",
            "Door hangers/postcards",
            "Buyer/seller education events",
            "Email newsletters",
            "Community sponsorships",
            "Local magazine ads",
            "Billboard/signage",
            "Podcast appearances",
            "Blog/SEO content",
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

      {/* Marketing Activities */}
      <div className="mb-8 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900">
          My 2026 Marketing Plan
        </h3>
        {marketingActivities.map((activity, index) => (
          <ActivityCard
            key={`marketing-${index}`}
            type="marketing"
            index={index}
            activity={activity.activity}
            how={activity.how}
            who={activity.who}
            when={activity.when}
            farmArea={activity.farmArea}
            cost={activity.cost}
            onFieldChange={(field, value) =>
              updateMarketingActivityField(
                index,
                field as keyof MarketingActivity,
                value
              )
            }
          />
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Plan your quarterly marketing calendar →
        </p>
      </div>
    </div>
  );
}
