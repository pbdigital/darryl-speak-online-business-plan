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
        "flex items-start gap-4 rounded-xl bg-[#0F172A] p-4",
        className
      )}
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/20">
        <Image
          src="/darryl.png"
          alt="Darryl Davis"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-white">Pro Tip:</span> {tip}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-500">— Darryl Davis</p>
      </div>
    </div>
  );
}
