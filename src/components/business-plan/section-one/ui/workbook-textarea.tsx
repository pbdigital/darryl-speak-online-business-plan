"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface WorkbookTextareaProps {
  label: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  showWordCount?: boolean;
}

export function WorkbookTextarea({
  label,
  placeholder,
  rows = 3,
  className,
  value: controlledValue,
  onChange,
  showWordCount = true,
}: WorkbookTextareaProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue ?? internalValue;
  const hasContent = value.trim().length > 0;
  const wordCount = hasContent
    ? value.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <div className={cn("group mb-12", className)}>
      <label
        className={cn(
          "mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors duration-300",
          hasContent
            ? "text-emerald-700"
            : "text-slate-900 group-focus-within:text-blue-700"
        )}
      >
        {label}
        {hasContent && (
          <svg
            className="h-4 w-4 text-emerald-500"
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
      <div className="relative">
        <textarea
          className={cn(
            "w-full resize-none rounded-r-xl border-l-4 bg-slate-50/50 p-6 leading-relaxed text-slate-700 outline-none transition-all duration-300",
            "hover:bg-slate-50",
            "focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-blue-100",
            hasContent
              ? "border-emerald-400 shadow-sm"
              : "border-slate-200 shadow-sm focus:border-slate-400"
          )}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </div>
      {showWordCount && (
        <div
          className={cn(
            "mt-2 text-xs transition-opacity duration-300",
            hasContent ? "text-slate-400" : "text-transparent"
          )}
        >
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </div>
      )}
    </div>
  );
}
