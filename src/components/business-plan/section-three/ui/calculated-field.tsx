"use client";

import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatedFieldProps {
  label: string;
  value: number;
  format: "currency" | "number" | "decimal";
  highlight?: boolean;
  helpText?: string;
  className?: string;
}

const formatValue = (value: number, format: "currency" | "number" | "decimal"): string => {
  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "number":
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    case "decimal":
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(value);
    default:
      return String(value);
  }
};

export function CalculatedField({
  label,
  value,
  format,
  highlight = false,
  helpText,
  className,
}: CalculatedFieldProps) {
  return (
    <div className={cn("", className)}>
      <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-600">
        <Calculator className="h-3.5 w-3.5" />
        {label}
      </label>
      <div
        className={cn(
          "flex items-center rounded-lg px-4 py-3 transition-colors",
          highlight
            ? "bg-[#0F172A] text-white"
            : "bg-[#e8f4f8] text-slate-800"
        )}
      >
        <span
          className={cn(
            "text-lg font-bold",
            highlight ? "text-white" : "text-[#0F172A]"
          )}
        >
          {formatValue(value, format)}
        </span>
      </div>
      {helpText && (
        <p className="mt-2 text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
}
