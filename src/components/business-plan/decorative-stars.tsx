"use client";

import { cn } from "@/lib/utils";

interface DecorativeStarsProps {
  className?: string;
  variant?: "light" | "dark";
}

export function DecorativeStars({ className, variant = "light" }: DecorativeStarsProps) {
  const strokeColor = variant === "light" ? "stroke-white/30" : "stroke-primary/20";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {/* Top left star */}
      <svg
        className={cn("absolute -left-4 -top-4 h-24 w-24", strokeColor)}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 10 L53 40 L80 50 L53 60 L50 90 L47 60 L20 50 L47 40 Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Top right sparkle */}
      <svg
        className={cn("absolute -right-2 top-8 h-16 w-16", strokeColor)}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 20 L52 45 L75 50 L52 55 L50 80 L48 55 L25 50 L48 45 Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom right star */}
      <svg
        className={cn("absolute -bottom-6 -right-6 h-32 w-32", strokeColor)}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 15 L54 42 L78 50 L54 58 L50 85 L46 58 L22 50 L46 42 Z"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Small sparkle bottom left */}
      <svg
        className={cn("absolute bottom-12 left-8 h-8 w-8", strokeColor)}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 25 L52 45 L70 50 L52 55 L50 75 L48 55 L30 50 L48 45 Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
