"use client";

import { ShieldCheck, Target } from "lucide-react";
import { WorkbookTextarea } from "../ui";

export function StepGoalsIntentions() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 5 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Goals & Obstacles
        </h2>
        <p className="text-slate-500">
          What do you want, and what&apos;s in the way?
        </p>
      </div>

      <WorkbookTextarea
        label="Top Goals for 2026"
        placeholder="Personal, professional, health, relationships, financial..."
        rows={5}
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* Obstacles Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
            <ShieldCheck size={16} /> Obstacles
          </h4>
          <textarea
            className="w-full resize-none bg-transparent text-slate-600 outline-none placeholder:text-slate-300"
            rows={6}
            placeholder="What specific challenges might hold you back? Market conditions, limiting beliefs, lack of resources, time constraints..."
          />
        </div>

        {/* Strategies Card */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8 shadow-sm transition-shadow hover:shadow-md">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-900">
            <Target size={16} /> Strategies
          </h4>
          <textarea
            className="w-full resize-none bg-transparent text-slate-600 outline-none placeholder:text-blue-200"
            rows={6}
            placeholder="What are the specific actions to overcome them? Training, accountability, systems, support..."
          />
        </div>
      </div>

      <div className="mt-12">
        <WorkbookTextarea
          label="What intentions do you want to set for the new year?"
          placeholder="How do you want to feel? What experiences do you want to have? How do you want to show up?"
          rows={4}
        />
      </div>
    </div>
  );
}
