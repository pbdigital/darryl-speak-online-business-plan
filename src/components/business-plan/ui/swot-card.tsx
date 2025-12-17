"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SwotCardProps {
  number: number;
  /** Label for the primary field (e.g., "Strength", "Weakness") */
  primaryLabel: string;
  /** Label for the secondary field (e.g., "Where can this be put to use?") */
  secondaryLabel: string;
  /** Value of the primary field */
  primaryValue: string;
  /** Value of the secondary field */
  secondaryValue: string;
  /** Callback when primary field changes */
  onPrimaryChange: (value: string) => void;
  /** Callback when secondary field changes */
  onSecondaryChange: (value: string) => void;
  /** Placeholder for primary field */
  primaryPlaceholder?: string;
  /** Placeholder for secondary field */
  secondaryPlaceholder?: string;
  className?: string;
}

export function SwotCard({
  number,
  primaryLabel,
  secondaryLabel,
  primaryValue,
  secondaryValue,
  onPrimaryChange,
  onSecondaryChange,
  primaryPlaceholder,
  secondaryPlaceholder,
  className,
}: SwotCardProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasPrimaryContent = primaryValue.trim().length > 0;
  const hasSecondaryContent = secondaryValue.trim().length > 0;
  const isComplete = hasPrimaryContent && hasSecondaryContent;

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

      {/* Primary field */}
      <div className="mb-6">
        <label
          className={cn(
            "mb-2 block text-xs font-bold uppercase tracking-wide transition-colors",
            hasPrimaryContent ? "text-slate-700" : "text-slate-500"
          )}
        >
          {primaryLabel}
          {hasPrimaryContent && (
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
          value={primaryValue}
          onChange={(e) => onPrimaryChange(e.target.value)}
          placeholder={primaryPlaceholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full border-b-2 bg-transparent py-2 text-lg font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300",
            hasPrimaryContent
              ? "border-slate-300"
              : "border-slate-200 focus:border-[#1a2744]"
          )}
        />
      </div>

      {/* Secondary field */}
      <div>
        <label
          className={cn(
            "mb-2 block text-xs font-bold uppercase tracking-wide transition-colors",
            hasSecondaryContent ? "text-slate-700" : "text-slate-500"
          )}
        >
          {secondaryLabel}
          {hasSecondaryContent && (
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
        <textarea
          value={secondaryValue}
          onChange={(e) => onSecondaryChange(e.target.value)}
          placeholder={secondaryPlaceholder}
          rows={2}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "w-full resize-none rounded-xl border-2 bg-slate-50/50 p-3 text-base leading-relaxed text-slate-700 outline-none transition-all duration-300",
            "hover:bg-slate-50",
            "focus:border-[#1a2744] focus:bg-white",
            hasSecondaryContent ? "border-slate-200" : "border-slate-100"
          )}
        />
      </div>
    </div>
  );
}
