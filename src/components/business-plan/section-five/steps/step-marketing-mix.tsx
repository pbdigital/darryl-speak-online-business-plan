"use client";

import { Megaphone } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
} from "@/components/business-plan/ui";
import { ActivityCard } from "../ui/activity-card";
import type { MarketingActivity } from "@/types/business-plan";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepMarketingMix() {
  const marketingActivities = useSectionFiveStore(
    (state) => state.data.marketingActivities
  );
  const updateMarketingActivityField = useSectionFiveStore(
    (state) => state.updateMarketingActivityField
  );

  return (
    <StepContainer>
      <StepHeader
        part="Part 5E"
        title="Your Marketing Mix"
        highlightWord="Marketing"
        subtitle="Marketing is about attraction—they come to you. Define 3 marketing activities to build visibility, credibility, and lead flow."
        icon={Megaphone}
      />

      <DarrylTip
        tip="Marketing builds long-term equity. While prospecting creates immediate conversations, marketing creates a pipeline of people who already trust you before they reach out. The best agents do both."
        className="mb-8"
      />

      {/* Marketing Ideas */}
      <div className="mb-8 rounded-2xl border-2 border-slate-100 bg-[#e8f4f8]/30 p-6">
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
          My {CURRENT_PLAN_YEAR} Marketing Plan
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

      <UpNextFooter text="Plan your quarterly marketing calendar" />
    </StepContainer>
  );
}
