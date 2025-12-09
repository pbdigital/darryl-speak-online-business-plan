"use client";

import { cn } from "@/lib/utils";

interface SwotRowProps {
  index: number;
  leftLabel: string;
  rightLabel: string;
  leftValue: string;
  rightValue: string;
  onLeftChange: (value: string) => void;
  onRightChange: (value: string) => void;
  leftPlaceholder?: string;
  rightPlaceholder?: string;
}

export function SwotRow({
  index,
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
  leftPlaceholder = "",
  rightPlaceholder = "",
}: SwotRowProps) {
  const hasLeftContent = leftValue.trim().length > 0;
  const hasRightContent = rightValue.trim().length > 0;
  const isComplete = hasLeftContent && hasRightContent;

  return (
    <div
      className={cn(
        "group relative border-b border-slate-100 py-6 transition-colors last:border-b-0",
        "hover:bg-slate-50/50"
      )}
    >
      <div className="flex gap-4 md:gap-6">
        {/* Row Number Indicator */}
        <div
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
            isComplete
              ? "bg-emerald-100 text-emerald-700"
              : hasLeftContent
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-500"
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
            index + 1
          )}
        </div>

        {/* Input Fields */}
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:gap-6">
          {/* Left Field - Text Input */}
          <div className="flex-1">
            <label
              className={cn(
                "mb-2 block text-xs font-bold uppercase tracking-wide transition-colors",
                hasLeftContent ? "text-emerald-700" : "text-slate-500"
              )}
            >
              {leftLabel}
              {hasLeftContent && (
                <svg
                  className="ml-1.5 inline h-3 w-3 text-emerald-500"
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
              value={leftValue}
              onChange={(e) => onLeftChange(e.target.value)}
              placeholder={leftPlaceholder}
              className={cn(
                "w-full border-b-2 bg-transparent py-2 text-base font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300",
                hasLeftContent
                  ? "border-emerald-400"
                  : "border-slate-200 focus:border-slate-900"
              )}
            />
          </div>

          {/* Right Field - Textarea */}
          <div className="flex-1 md:flex-[1.5]">
            <label
              className={cn(
                "mb-2 block text-xs font-bold uppercase tracking-wide transition-colors",
                hasRightContent ? "text-emerald-700" : "text-slate-500"
              )}
            >
              {rightLabel}
              {hasRightContent && (
                <svg
                  className="ml-1.5 inline h-3 w-3 text-emerald-500"
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
              value={rightValue}
              onChange={(e) => onRightChange(e.target.value)}
              placeholder={rightPlaceholder}
              rows={2}
              className={cn(
                "w-full resize-none rounded-lg border bg-slate-50/50 p-3 text-sm leading-relaxed text-slate-700 outline-none transition-all duration-300",
                "hover:bg-slate-50",
                "focus:bg-white focus:ring-2 focus:ring-blue-100",
                hasRightContent
                  ? "border-emerald-300 shadow-sm"
                  : "border-slate-200 focus:border-slate-300"
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
