"use client";

import { cn } from "@/lib/utils";

interface WorkbookInputProps {
  label: string;
  placeholder?: string;
  prefix?: string;
  type?: "text" | "number";
  className?: string;
}

export function WorkbookInput({
  label,
  placeholder,
  prefix,
  type = "text",
  className,
}: WorkbookInputProps) {
  return (
    <div className={cn("group mb-8", className)}>
      <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900 transition-colors group-focus-within:text-blue-700">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="mr-2 font-serif text-lg text-slate-500">
            {prefix}
          </span>
        )}
        <input
          type={type}
          className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300 focus:border-slate-900"
          placeholder={placeholder}
        />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-slate-900 transition-all duration-500 ease-out group-focus-within:w-full" />
      </div>
    </div>
  );
}
