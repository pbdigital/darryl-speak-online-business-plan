"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface PremiumInputProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  prefix?: string;
  type?: "text" | "number" | "date";
  className?: string;
  defaultToToday?: boolean;
  /** Optional question number to display as a badge */
  number?: number;
}

export function PremiumInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  type = "text",
  className,
  defaultToToday = false,
  number,
}: PremiumInputProps) {
  // Prefill with today's date if defaultToToday is true and value is empty
  useEffect(() => {
    if (defaultToToday && type === "date" && !value) {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      onChange(today);
    }
  }, [defaultToToday, type, value, onChange]);

  const displayValue = value === null || value === undefined ? "" : String(value);
  const hasContent = displayValue.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (type === "number") {
      const numValue = inputValue === "" ? null : parseFloat(inputValue);
      onChange(numValue);
    } else {
      onChange(inputValue);
    }
  };

  return (
    <div className={cn("group relative mb-8", className)}>
      {/* Question number badge - transforms to checkmark when complete */}
      {number !== undefined && (
        <div
          className={cn(
            "absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300",
            hasContent
              ? "bg-slate-700 text-white"
              : "bg-slate-200 text-slate-600 group-focus-within:bg-[#1a2744] group-focus-within:text-white"
          )}
        >
          {hasContent ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            number
          )}
        </div>
      )}

      <label
        className={cn(
          "mb-2 block text-sm font-bold uppercase tracking-wide transition-colors",
          hasContent
            ? "text-slate-700"
            : "text-slate-900 group-focus-within:text-[#1a2744]"
        )}
      >
        {label}
        {hasContent && (
          <svg
            className="ml-2 inline h-3 w-3 text-slate-500"
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
      <div className="relative flex items-center">
        {prefix && (
          <span className="mr-2 font-serif text-lg text-slate-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          className={cn(
            "w-full border-b-2 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300",
            hasContent ? "border-slate-400" : "border-slate-200 focus:border-[#1a2744]"
          )}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
        />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#1a2744] transition-all duration-500 ease-out group-focus-within:w-full" />
      </div>
    </div>
  );
}
