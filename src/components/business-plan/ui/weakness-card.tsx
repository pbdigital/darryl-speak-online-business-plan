"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type WeaknessAction = "accept" | "delegate" | "improve" | null;

interface WeaknessCardProps {
  number: number;
  /** Value of the weakness field */
  weaknessValue: string;
  /** Selected action */
  actionValue: WeaknessAction;
  /** Callback when weakness field changes */
  onWeaknessChange: (value: string) => void;
  /** Callback when action changes */
  onActionChange: (action: WeaknessAction) => void;
  /** Placeholder for weakness field */
  placeholder?: string;
  className?: string;
}

const actions: { value: WeaknessAction; label: string; description: string }[] = [
  {
    value: "accept",
    label: "Accept",
    description: "Acknowledge and work around it",
  },
  {
    value: "delegate",
    label: "Delegate",
    description: "Assign to someone else",
  },
  {
    value: "improve",
    label: "Improve",
    description: "Work on getting better",
  },
];

export function WeaknessCard({
  number,
  weaknessValue,
  actionValue,
  onWeaknessChange,
  onActionChange,
  placeholder,
  className,
}: WeaknessCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasWeaknessContent = weaknessValue.trim().length > 0;
  const hasAction = actionValue !== null;
  const isComplete = hasWeaknessContent && hasAction;

  const handleActionClick = (action: WeaknessAction) => {
    // Toggle off if clicking the same value
    onActionChange(actionValue === action ? null : action);
  };

  return (
    <div
      className={cn(
        "group relative rounded-3xl border-2 bg-white p-6 transition-all duration-300",
        isFocused
          ? "border-[#1a2744] shadow-xl shadow-[#1a2744]/5"
          : "border-slate-100 hover:border-slate-200 hover:shadow-md",
        className
      )}
    >
      {/* Number badge */}
      <div
        className={cn(
          "absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300",
          isComplete
            ? "bg-slate-700 text-white"
            : isFocused
              ? "bg-[#1a2744] text-white"
              : "bg-slate-200 text-slate-600"
        )}
      >
        {isComplete ? (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          number
        )}
      </div>

      {/* Weakness field */}
      <div className="mb-6">
        <label
          className={cn(
            "mb-2 block text-xs font-bold uppercase tracking-wide transition-colors",
            hasWeaknessContent ? "text-slate-700" : "text-slate-500"
          )}
        >
          Weakness
          {hasWeaknessContent && (
            <svg
              className="ml-1.5 inline h-3 w-3 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </label>
        <input
          type="text"
          value={weaknessValue}
          onChange={(e) => onWeaknessChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full border-b-2 bg-transparent py-2 text-lg font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300",
            hasWeaknessContent
              ? "border-slate-300"
              : "border-slate-200 focus:border-[#1a2744]"
          )}
        />
      </div>

      {/* Action buttons */}
      <div>
        <label
          className={cn(
            "mb-3 block text-xs font-bold uppercase tracking-wide transition-colors",
            hasAction ? "text-slate-700" : "text-slate-500"
          )}
        >
          How will you address it?
          {hasAction && (
            <svg
              className="ml-1.5 inline h-3 w-3 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {actions.map((action) => {
            const isSelected = actionValue === action.value;
            return (
              <button
                key={action.value}
                type="button"
                onClick={() => handleActionClick(action.value)}
                className={cn(
                  "flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#1a2744]/20",
                  isSelected
                    ? "bg-[#1a2744] text-white shadow-lg"
                    : "border-2 border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                <span className="block">{action.label}</span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs font-normal",
                    isSelected ? "text-slate-300" : "text-slate-400"
                  )}
                >
                  {action.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
