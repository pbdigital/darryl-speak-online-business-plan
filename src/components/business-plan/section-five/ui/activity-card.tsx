"use client";

import { PremiumInput, PremiumTextarea } from "@/components/business-plan/ui";
import { CurrencyInput } from "@/components/business-plan/section-three/ui/currency-input";
import { cn } from "@/lib/utils";

interface ProspectingActivityCardProps {
  type: "prospecting";
  index: number;
  activity: string;
  how: string;
  who: string;
  when: string;
  farmArea: string;
  cost: number | null;
  followUpPlan: string;
  onFieldChange: (
    field: "activity" | "how" | "who" | "when" | "farmArea" | "cost" | "followUpPlan",
    value: string | number | null
  ) => void;
  className?: string;
}

interface MarketingActivityCardProps {
  type: "marketing";
  index: number;
  activity: string;
  how: string;
  who: string;
  when: string;
  farmArea: string;
  cost: number | null;
  onFieldChange: (
    field: "activity" | "how" | "who" | "when" | "farmArea" | "cost",
    value: string | number | null
  ) => void;
  className?: string;
}

type ActivityCardProps = ProspectingActivityCardProps | MarketingActivityCardProps;

export function ActivityCard(props: ActivityCardProps) {
  const { type, index, activity, how, who, when, farmArea, cost, onFieldChange, className } =
    props;
  const followUpPlan = type === "prospecting" ? props.followUpPlan : undefined;

  const activityNumber = index + 1;
  const labels =
    type === "prospecting"
      ? {
          how: "How? (Method/Tool)",
          who: "Who? (Target Audience)",
          when: "When? (Schedule)",
        }
      : {
          how: "How? (Platform/Method)",
          who: "Who? (Target Audience)",
          when: "When? (Timeline)",
        };

  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Card Header */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744] text-sm font-bold text-white">
          {activityNumber}
        </span>
        <h4 className="text-lg font-bold text-slate-900">
          {type === "prospecting" ? "Prospecting" : "Marketing"} Activity {activityNumber}
        </h4>
      </div>

      {/* Fields Grid */}
      <div className="space-y-5">
        <PremiumInput
          label="Activity"
          placeholder={
            type === "prospecting"
              ? "e.g., Cold calling FSBOs"
              : "e.g., Facebook advertising"
          }
          value={activity}
          onChange={(val) => onFieldChange("activity", String(val || ""))}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <PremiumInput
            label={labels.how}
            placeholder={type === "prospecting" ? "e.g., RedX Dialer" : "e.g., Meta Ads Manager"}
            value={how}
            onChange={(val) => onFieldChange("how", String(val || ""))}
          />
          <PremiumInput
            label={labels.who}
            placeholder="e.g., First-time homebuyers"
            value={who}
            onChange={(val) => onFieldChange("who", String(val || ""))}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <PremiumInput
            label={labels.when}
            placeholder={
              type === "prospecting" ? "e.g., Mon-Fri 9-11am" : "e.g., Q1-Q2 campaign"
            }
            value={when}
            onChange={(val) => onFieldChange("when", String(val || ""))}
          />
          <PremiumInput
            label="Farm Area?"
            placeholder="e.g., Downtown Heights"
            value={farmArea}
            onChange={(val) => onFieldChange("farmArea", String(val || ""))}
          />
        </div>

        <CurrencyInput
          label="Cost?"
          placeholder="0"
          value={cost}
          onChange={(val) => onFieldChange("cost", val)}
        />

        {type === "prospecting" && followUpPlan !== undefined && (
          <PremiumTextarea
            label="Follow-Up Plan"
            placeholder="Describe your follow-up strategy..."
            value={followUpPlan}
            onChange={(val) =>
              (onFieldChange as ProspectingActivityCardProps["onFieldChange"])(
                "followUpPlan",
                val
              )
            }
            minHeight={80}
            maxHeight={200}
          />
        )}
      </div>
    </div>
  );
}
