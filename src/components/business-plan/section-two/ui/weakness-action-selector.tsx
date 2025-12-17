"use client";

import { cn } from "@/lib/utils";
import type { WeaknessAction } from "@/stores/section-two-store";

interface WeaknessActionSelectorProps {
  value: WeaknessAction;
  onChange: (action: WeaknessAction) => void;
  disabled?: boolean;
}

const actions: { value: WeaknessAction; label: string; description: string }[] =
  [
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

export function WeaknessActionSelector({
  value,
  onChange,
  disabled = false,
}: WeaknessActionSelectorProps) {
  const handleClick = (action: WeaknessAction) => {
    if (disabled) return;
    // Toggle off if clicking the same value
    onChange(value === action ? null : action);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Action
        {value && (
          <svg
            className="ml-1.5 inline h-3 w-3 text-slate-500"
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
      <div className="flex gap-1.5">
        {actions.map((action) => {
          const isSelected = value === action.value;
          return (
            <button
              key={action.value}
              type="button"
              onClick={() => handleClick(action.value)}
              disabled={disabled}
              title={action.description}
              className={cn(
                "flex-1 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-slate-300",
                isSelected
                  ? "bg-[#1E293B] text-white shadow-md"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
