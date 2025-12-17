"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StepHeaderProps {
  part: string;
  title: string;
  highlightWord?: string;
  subtitle: string;
  icon?: LucideIcon;
  className?: string;
}

export function StepHeader({
  part,
  title,
  highlightWord,
  subtitle,
  icon: Icon,
  className,
}: StepHeaderProps) {
  // If highlightWord is provided, split title to add the underline effect
  const renderTitle = () => {
    if (!highlightWord) {
      return <span>{title}</span>;
    }

    const parts = title.split(highlightWord);
    if (parts.length === 1) {
      return <span>{title}</span>;
    }

    return (
      <>
        {parts[0]}
        <span className="relative">
          <span className="relative z-10">{highlightWord}</span>
          <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[#e8f4f8]" />
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <header className={cn("relative mb-10", className)}>
      {/* Decorative icon - hidden on mobile */}
      {Icon && (
        <div className="absolute -right-4 top-0 hidden opacity-10 md:right-0 md:block">
          <Icon className="h-32 w-32 text-[#1a2744]" strokeWidth={1} />
        </div>
      )}

      {/* Part badge */}
      <div className="relative z-10 mb-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          {part}
        </span>
      </div>

      {/* Title */}
      <h1 className="relative z-10 mb-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
        {renderTitle()}
      </h1>

      {/* Subtitle */}
      <p className="relative z-10 max-w-lg text-lg text-slate-600">
        {subtitle}
      </p>
    </header>
  );
}
