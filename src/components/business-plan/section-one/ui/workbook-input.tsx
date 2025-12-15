"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  useSectionOneStore,
  type SectionOneData,
} from "@/stores/section-one-store";

interface WorkbookInputProps {
  label: string;
  fieldName?: keyof SectionOneData;
  placeholder?: string;
  prefix?: string;
  type?: "text" | "number" | "date";
  className?: string;
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
  defaultToToday?: boolean;
}

export function WorkbookInput({
  label,
  fieldName,
  placeholder,
  prefix,
  type = "text",
  className,
  value: controlledValue,
  onChange,
  defaultToToday = false,
}: WorkbookInputProps) {
  // Get store value if fieldName is provided
  const storeValue = useSectionOneStore((state) =>
    fieldName ? state.data[fieldName] : null
  );
  const updateField = useSectionOneStore((state) => state.updateField);

  // Use store value if fieldName provided, otherwise use controlled value
  const value = fieldName ? storeValue : controlledValue;

  // Prefill with today's date if defaultToToday is true and value is empty
  useEffect(() => {
    if (defaultToToday && type === "date" && !value && fieldName) {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      updateField(fieldName, today as SectionOneData[typeof fieldName]);
    }
  }, [defaultToToday, type, value, fieldName, updateField]);
  const displayValue = value === null || value === undefined ? "" : String(value);
  const hasContent = displayValue.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (type === "number") {
      const numValue = inputValue === "" ? null : parseFloat(inputValue);
      if (fieldName) {
        updateField(fieldName, numValue as SectionOneData[typeof fieldName]);
      } else if (onChange) {
        onChange(numValue);
      }
    } else {
      if (fieldName) {
        updateField(fieldName, inputValue as SectionOneData[typeof fieldName]);
      } else if (onChange) {
        onChange(inputValue);
      }
    }
  };

  return (
    <div className={cn("group mb-8", className)}>
      <label
        className={cn(
          "mb-2 block text-sm font-bold uppercase tracking-wide transition-colors",
          hasContent
            ? "text-emerald-700"
            : "text-slate-900 group-focus-within:text-blue-700"
        )}
      >
        {label}
        {hasContent && (
          <svg
            className="ml-2 inline h-3 w-3 text-emerald-500"
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
            hasContent ? "border-emerald-400" : "border-slate-200 focus:border-slate-900"
          )}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
        />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-slate-900 transition-all duration-500 ease-out group-focus-within:w-full" />
      </div>
    </div>
  );
}
