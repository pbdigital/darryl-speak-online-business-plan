"use client";

import { cn } from "@/lib/utils";

interface UpNextFooterProps {
  text: string;
  className?: string;
}

export function UpNextFooter({ text, className }: UpNextFooterProps) {
  return (
    <footer
      className={cn(
        "mt-12 rounded-2xl bg-gradient-to-r from-[#e8f4f8] to-white p-6 text-center",
        className
      )}
    >
      <p className="text-sm font-medium text-slate-500">Up Next</p>
      <p className="text-lg font-semibold text-[#1a2744]">{text} →</p>
    </footer>
  );
}
