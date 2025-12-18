"use client";

import { Phone } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
} from "@/components/business-plan/ui";
import { ActivityCard } from "../ui/activity-card";
import type { ProspectingActivity } from "@/types/business-plan";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepProspectingMix() {
  const prospectingActivities = useSectionFiveStore(
    (state) => state.data.prospectingActivities
  );
  const updateProspectingActivityField = useSectionFiveStore(
    (state) => state.updateProspectingActivityField
  );

  return (
    <StepContainer>
      <StepHeader
        part="Part 5D"
        title="Your Prospecting Mix"
        highlightWord="Prospecting"
        subtitle="Prospecting is proactive outreach—you're going to them. Define 3 prospecting activities you'll commit to this year."
        icon={Phone}
      />

      <DarrylTip
        tip="The best prospecting plan is one you'll actually do. Pick activities that match your personality and schedule. Consistency beats intensity—30 minutes daily outperforms 4-hour marathon sessions that you dread."
        className="mb-8"
      />

      {/* Prospecting Ideas */}
      <div className="mb-8 rounded-2xl border-2 border-slate-100 bg-[#e8f4f8]/30 p-6">
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
          My {CURRENT_PLAN_YEAR} Prospecting Plan
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

      <UpNextFooter text="Plan your marketing mix" />
    </StepContainer>
  );
}
