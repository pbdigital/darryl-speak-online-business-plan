"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Check, Clock, Circle } from "lucide-react";

type SectionStatus = "not_started" | "in_progress" | "completed";

interface SectionCardProps {
  sectionNumber: number;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  status?: SectionStatus;
  progress?: number;
  className?: string;
}

const statusConfig = {
  not_started: {
    label: "Not Started",
    icon: Circle,
    chipClass: "bg-muted text-muted-foreground",
    buttonText: "Start Section",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    chipClass: "bg-amber-100 text-amber-700",
    buttonText: "Continue",
  },
  completed: {
    label: "Completed",
    icon: Check,
    chipClass: "bg-emerald-100 text-emerald-700",
    buttonText: "Review",
  },
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
}: SectionCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        "hover:shadow-lg hover:border-primary/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
    >
      {/* Section Header */}
      <div className="bg-primary px-5 py-4 text-primary-foreground">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Section {sectionNumber}
          </span>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
              config.chipClass
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </div>
        </div>
        <h3 className="mt-2 text-lg font-bold leading-tight">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-sm font-medium text-white/80">{subtitle}</p>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm text-muted-foreground">{description}</p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* CTA Button */}
        <div
          className={cn(
            "mt-4 flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors",
            "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
          )}
        >
          {config.buttonText}
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
