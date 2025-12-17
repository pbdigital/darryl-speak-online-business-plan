"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface DarrylTipProps {
  tip: string;
  className?: string;
}

export function DarrylTip({ tip, className }: DarrylTipProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#1a2744] p-5",
        className
      )}
    >
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2d3e5f]/50 to-transparent" />

      <div className="relative flex gap-4">
        {/* Darryl's photo */}
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/20">
          <Image
            src="/darryl.png"
            alt="Darryl Davis"
            fill
            className="object-cover"
          />
        </div>

        {/* Tip content */}
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-white/60">Pro Tip</p>
          <p className="text-[15px] leading-relaxed text-white/90">{tip}</p>
        </div>
      </div>
    </div>
  );
}
