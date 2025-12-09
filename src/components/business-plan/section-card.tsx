"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";

type SectionStatus = "not_started" | "in_progress" | "completed";

interface SectionCardProps {
  sectionNumber: number;
  title: string;
  subtitle?: string;
  description: string;
  href: string;
  status?: SectionStatus;
  progress?: number;
  className?: string;
  /** Whether this card should be dimmed (for upcoming sections) */
  dimmed?: boolean;
}

// Section-specific icons
const sectionIcons: Record<number, React.ReactNode> = {
  1: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  2: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  3: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  ),
  4: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
    </svg>
  ),
  5: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

const statusLabels: Record<SectionStatus, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

export function SectionCard({
  sectionNumber,
  title,
  subtitle,
  description,
  href,
  status = "not_started",
  progress = 0,
  className,
  dimmed = false,
}: SectionCardProps) {
  const isCompleted = status === "completed";
  const isInProgress = status === "in_progress";
  const displayIcon = sectionIcons[sectionNumber];

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300",
        "hover:border-slate-900/10 hover:shadow-2xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
        dimmed && "opacity-60 hover:opacity-100",
        className
      )}
    >
      {/* Corner decoration - green when completed, navy on hover otherwise */}
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-bl-[100px] transition-colors duration-300",
          isCompleted
            ? "bg-emerald-500 group-hover:bg-emerald-600"
            : "bg-slate-50 group-hover:bg-[#0F172A]"
        )}
      />

      {/* Icon in corner - checkmark when completed */}
      <div
        className={cn(
          "absolute right-5 top-5 transition-colors duration-300",
          isCompleted
            ? "h-7 w-7 text-white"
            : "h-6 w-6 text-slate-300 group-hover:text-white"
        )}
      >
        {isCompleted ? <Check className="h-full w-full" strokeWidth={3} /> : displayIcon}
      </div>

      {/* Section label */}
      <div className="mb-4">
        <span className="text-xs font-black uppercase tracking-widest text-slate-300">
          Section {sectionNumber}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-900">
        {title}
        {subtitle && (
          <span className="font-normal text-slate-500"> {subtitle}</span>
        )}
      </h3>

      {/* Description */}
      <p className="mb-8 mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {/* Progress section */}
      <div className="mt-auto w-full">
        <div className="mb-2 flex items-end justify-between">
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wide",
              isCompleted ? "text-emerald-600" : "text-slate-900"
            )}
          >
            {statusLabels[status]}
          </span>
          <span className="text-xs font-medium text-slate-400">{progress}%</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              isCompleted ? "bg-emerald-500" : "bg-[#0F172A]"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center text-sm font-bold uppercase tracking-wide text-slate-900 transition-transform group-hover:translate-x-1">
          {isCompleted
            ? "Review Section"
            : isInProgress
            ? "Continue"
            : "Start Section"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
