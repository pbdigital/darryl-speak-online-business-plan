"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface SignatureFieldProps {
  label: string;
  signatureValue: string;
  dateValue: string;
  onSignatureChange: (value: string) => void;
  onDateChange: (value: string) => void;
  className?: string;
}

export function SignatureField({
  label,
  signatureValue,
  dateValue,
  onSignatureChange,
  onDateChange,
  className,
}: SignatureFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasSignature = signatureValue.trim().length > 0;
  const hasDate = dateValue.trim().length > 0;
  const isComplete = hasSignature && hasDate;

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6 transition-all",
        isComplete
          ? "border-emerald-200 bg-emerald-50/50"
          : isFocused
            ? "border-blue-300 bg-blue-50/30"
            : "border-slate-200 bg-white",
        className
      )}
    >
      {/* Header with completion indicator */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">{label}</h4>
        {isComplete && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Signature Input */}
        <div className="group">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Signature
          </label>
          <div className="relative">
            <input
              type="text"
              value={signatureValue}
              onChange={(e) => onSignatureChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your name"
              className={cn(
                "w-full border-b-2 bg-transparent py-2 font-serif text-lg italic text-slate-800 outline-none transition-all placeholder:font-sans placeholder:not-italic placeholder:text-slate-300",
                hasSignature ? "border-emerald-400" : "border-slate-200 focus:border-slate-900"
              )}
            />
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-slate-900 transition-all duration-500 ease-out group-focus-within:w-full" />
          </div>
        </div>

        {/* Date Input */}
        <div className="group">
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
            Date
          </label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full border-b-2 bg-transparent py-2 text-slate-800 outline-none transition-all",
              hasDate ? "border-emerald-400" : "border-slate-200 focus:border-slate-900"
            )}
          />
        </div>
      </div>
    </div>
  );
}
