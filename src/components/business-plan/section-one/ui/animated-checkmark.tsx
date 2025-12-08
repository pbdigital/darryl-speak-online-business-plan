"use client";

import { cn } from "@/lib/utils";

interface AnimatedCheckmarkProps {
  className?: string;
  size?: number;
}

export function AnimatedCheckmark({
  className,
  size = 16,
}: AnimatedCheckmarkProps) {
  return (
    <svg
      className={cn("text-emerald-500", className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M5 13l4 4L19 7"
        className="animate-draw-check"
        style={{
          strokeDasharray: 24,
          strokeDashoffset: 24,
        }}
      />
    </svg>
  );
}
