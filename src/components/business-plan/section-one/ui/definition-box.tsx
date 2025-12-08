"use client";

import { cn } from "@/lib/utils";

interface DefinitionBoxProps {
  title: string;
  content: string;
  className?: string;
}

export function DefinitionBox({ title, content, className }: DefinitionBoxProps) {
  return (
    <div
      className={cn(
        "mb-6 border-l-2 border-slate-200 pl-6 transition-colors duration-300 hover:border-slate-900",
        className
      )}
    >
      <h4 className="mb-2 text-sm font-extrabold uppercase tracking-wider text-slate-900">
        {title}
      </h4>
      <p className="leading-relaxed text-slate-600">{content}</p>
    </div>
  );
}
