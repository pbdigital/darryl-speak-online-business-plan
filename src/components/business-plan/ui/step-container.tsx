"use client";

import { cn } from "@/lib/utils";

interface StepContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function StepContainer({ children, className }: StepContainerProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 min-h-screen bg-gradient-to-b from-[#e8f4f8]/30 via-white to-white pb-8 duration-500",
        className
      )}
    >
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">
        {children}
      </div>
    </div>
  );
}
