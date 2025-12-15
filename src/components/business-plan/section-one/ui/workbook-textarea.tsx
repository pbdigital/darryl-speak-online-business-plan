"use client";

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
  /** Minimum height in pixels (default: 96, ~4 rows) */
  minHeight?: number;
  /** Maximum height in pixels before scrolling (default: 300) */
  maxHeight?: number;
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
  minHeight = 96,
  maxHeight = 300,
}: WorkbookTextareaProps) {
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
          ref={ref}
          className={cn(
            "w-full rounded-r-xl border-l-4 bg-slate-50/50 p-6 leading-relaxed text-slate-700 outline-none",
            "hover:bg-slate-50",
            "focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-blue-100",
            hasContent
              ? "border-emerald-400 shadow-sm"
              : "border-slate-200 shadow-sm focus:border-slate-400"
          )}
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
