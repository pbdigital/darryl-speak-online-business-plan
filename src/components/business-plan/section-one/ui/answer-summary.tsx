"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSectionOneStore, SectionOneData } from "@/stores/section-one-store";
import { cn } from "@/lib/utils";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

interface SummaryField {
  label: string;
  fieldName: keyof SectionOneData;
}

interface SummarySection {
  title: string;
  fields: SummaryField[];
}

const SUMMARY_SECTIONS: SummarySection[] = [
  {
    title: "Production & Last Year",
    fields: [
      { label: "Listings Taken", fieldName: "listingsTaken" },
      { label: "Seller Sides Closed", fieldName: "sellerSidesClosed" },
      { label: "Buyer Sides Closed", fieldName: "buyerSidesClosed" },
      { label: "Gross Closed Commissions", fieldName: "grossClosedCommissions" },
      { label: "Biggest Accomplishment", fieldName: "biggestAccomplishment" },
      { label: "What Went Well", fieldName: "wantToContinue" },
    ],
  },
  {
    title: "Reflection & Learning",
    fields: [
      { label: "Significant Achievements", fieldName: "significantAchievements" },
      { label: "Challenges Overcome", fieldName: "challengesAndOvercoming" },
      { label: "Learned About Self", fieldName: "learnedAboutSelf" },
    ],
  },
  {
    title: "Gratitude & Values",
    fields: [
      { label: "Grateful For", fieldName: "gratefulFor" },
      { label: "Core Values Alignment", fieldName: "coreValuesAlignment" },
    ],
  },
  {
    title: "Goals & Intentions",
    fields: [
      { label: "Top Goals", fieldName: "topGoalsIntentions" },
      { label: "Why Goals Matter", fieldName: "goalsImportance" },
      { label: "Strategies", fieldName: "goalStrategies" },
      { label: "Immediate Steps", fieldName: "immediateSteps" },
    ],
  },
  {
    title: "Self-Care & Growth",
    fields: [
      { label: "Self-Care Priorities", fieldName: "selfCarePriorities" },
      { label: "Skills to Improve", fieldName: "skillsToImprove" },
      { label: "Giving Back", fieldName: "giveBackCommunity" },
    ],
  },
  {
    title: "Mantra & Accountability",
    fields: [
      { label: `${CURRENT_PLAN_YEAR} Mantra`, fieldName: "mantra" },
      { label: "Accountability Method", fieldName: "accountabilityMethod" },
      { label: "Accountability Partner", fieldName: "accountabilityPartner" },
    ],
  },
];

export function AnswerSummary() {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = useSectionOneStore((state) => state.data);

  // Filter to only show sections with filled answers
  const filledSections = SUMMARY_SECTIONS.map((section) => ({
    ...section,
    fields: section.fields.filter((f) => {
      const value = data[f.fieldName];
      return value !== null && value !== undefined && value !== "";
    }),
  })).filter((section) => section.fields.length > 0);

  // Don't render if no answers
  if (filledSections.length === 0) return null;

  const totalAnswers = filledSections.reduce(
    (acc, section) => acc + section.fields.length,
    0
  );

  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-slate-100/50"
      >
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Review Your Answers
          </span>
          <span className="ml-2 text-xs text-slate-400">
            ({totalAnswers} answered)
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-6 border-t border-slate-100 p-6">
          {filledSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </h4>
              <div className="space-y-3">
                {section.fields.map((field) => {
                  const value = data[field.fieldName];
                  const displayValue =
                    typeof value === "number"
                      ? field.fieldName === "grossClosedCommissions"
                        ? `$${value.toLocaleString()}`
                        : value.toString()
                      : String(value);

                  return (
                    <div
                      key={field.fieldName}
                      className="border-l-2 border-slate-200 pl-4"
                    >
                      <div className="text-xs text-slate-400">{field.label}</div>
                      <div className="line-clamp-2 text-sm text-slate-700">
                        {displayValue}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
