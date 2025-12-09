"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PercentageInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  helpText?: string;
  className?: string;
}

export function PercentageInput({
  label,
  value,
  onChange,
  placeholder = "0",
  helpText,
  className,
}: PercentageInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value !== null ? String(value) : ""
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);

      if (newValue === "" || newValue === "-") {
        onChange(null);
        return;
      }

      const parsed = parseFloat(newValue);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    },
    [onChange]
  );

  const handleBlur = useCallback(() => {
    if (value !== null) {
      setDisplayValue(String(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  return (
    <div className={cn("group", className)}>
      <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900 transition-colors group-focus-within:text-blue-700">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300 focus:border-slate-900"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span className="ml-2 font-serif text-lg text-slate-500">%</span>
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-slate-900 transition-all duration-500 ease-out group-focus-within:w-full" />
      </div>
      {helpText && (
        <p className="mt-2 text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
}
