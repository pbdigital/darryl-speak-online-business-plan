"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useSectionOneStore,
  type SectionOneData,
} from "@/stores/section-one-store";
import { useAutoResize } from "@/hooks/use-auto-resize";

interface WorkbookTextareaProps {
  label: string;
  fieldName?: keyof SectionOneData;
  placeholder?: string;
  /** @deprecated No longer used - textarea auto-resizes based on content */
  rows?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  showWordCount?: boolean;
  /** Minimum height in pixels (default: 120) */
  minHeight?: number;
  /** Maximum height in pixels before scrolling (default: 300) */
  maxHeight?: number;
  /** Optional question number to display as a badge */
  number?: number;
}

export function WorkbookTextarea({
  label,
  fieldName,
  placeholder,
  rows: _rows, // Deprecated, kept for backward compatibility
  className,
  value: controlledValue,
  onChange,
  showWordCount = true,
  minHeight = 120,
  maxHeight = 300,
  number,
}: WorkbookTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize hook
  const { ref } = useAutoResize({ minHeight, maxHeight });

  // Get store value if fieldName is provided
  const storeValue = useSectionOneStore((state) =>
    fieldName ? (state.data[fieldName] as string) : ""
  );
  const updateField = useSectionOneStore((state) => state.updateField);

  // Use store value if fieldName provided, otherwise use controlled/uncontrolled pattern
  const value = fieldName ? storeValue : (controlledValue ?? "");
  const hasContent = value.trim().length > 0;
  const wordCount = hasContent
    ? value.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (fieldName) {
      updateField(fieldName, newValue);
    } else if (onChange) {
      onChange(newValue);
    }
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
      {/* Question number badge - transforms to checkmark when complete */}
      {number !== undefined && (
        <div
          className={cn(
            "absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300",
            hasContent
              ? "bg-slate-700 text-white"
              : isFocused
                ? "bg-[#1a2744] text-white"
                : "bg-slate-200 text-slate-600"
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

      {/* Question label */}
      <label className="mb-4 block text-lg font-semibold leading-snug text-slate-800">
        {label}
      </label>

      {/* Textarea */}
      <textarea
        ref={ref}
        className="w-full resize-none bg-transparent text-base leading-relaxed text-slate-700 outline-none placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Word count */}
      {showWordCount && (
        <div
          className={cn(
            "mt-2 text-xs transition-all duration-300",
            hasContent ? "text-slate-400" : "text-transparent"
          )}
        >
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </div>
      )}
    </div>
  );
}
