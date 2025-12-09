"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionCoverProps {
  number: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  progress?: number;
  className?: string;
}

export function SectionCover({
  number,
  title,
  subtitle,
  icon: Icon,
  progress = 0,
  className,
}: SectionCoverProps) {
  return (
    <div
      className={cn(
        "group relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8 text-white shadow-xl md:p-12",
        className
      )}
    >
      {/* Abstract Background Decoration */}
      <div className="pointer-events-none absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 p-12 opacity-10 transition-transform duration-1000 group-hover:scale-105">
        <Icon size={400} strokeWidth={0.5} />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-4">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-300">
            Section {number}
          </span>
          {progress > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium tracking-wide text-slate-400">
              <Clock size={12} /> {progress}% Completed
            </span>
          )}
        </div>
        <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
