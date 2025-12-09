"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  className?: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const parseCurrency = (value: string): number | null => {
  const cleaned = value.replace(/[^0-9.-]/g, "");
  if (cleaned === "" || cleaned === "-") return null;
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "0",
  className,
}: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(
    value !== null ? String(value) : ""
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setDisplayValue(value !== null ? String(value) : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsed = parseCurrency(displayValue);
    onChange(parsed);
    setDisplayValue(parsed !== null ? String(parsed) : "");
  }, [displayValue, onChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);
      const parsed = parseCurrency(newValue);
      onChange(parsed);
    },
    [onChange]
  );

  const formattedValue =
    !isFocused && value !== null ? formatCurrency(value) : displayValue;

  return (
    <div className={cn("group", className)}>
      <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900 transition-colors group-focus-within:text-blue-700">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="mr-2 font-serif text-lg text-slate-500">$</span>
        <input
          type="text"
          inputMode="numeric"
          className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300 focus:border-slate-900"
          placeholder={placeholder}
          value={formattedValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-slate-900 transition-all duration-500 ease-out group-focus-within:w-full" />
      </div>
    </div>
  );
}
