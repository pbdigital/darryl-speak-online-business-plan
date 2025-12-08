"use client";

import { cn } from "@/lib/utils";

interface WorkbookTextareaProps {
  label: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function WorkbookTextarea({
  label,
  placeholder,
  rows = 3,
  className,
}: WorkbookTextareaProps) {
  return (
    <div className={cn("group mb-10", className)}>
      <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-slate-900 transition-colors group-focus-within:text-blue-700">
        {label}
      </label>
      <div className="relative">
        <textarea
          className="w-full resize-none rounded-r-xl border-l-4 border-slate-200 bg-slate-50/50 p-6 leading-relaxed text-slate-700 shadow-sm outline-none transition-all duration-300 hover:bg-slate-50 focus:border-slate-900 focus:bg-white focus:shadow-md"
          rows={rows}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
