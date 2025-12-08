"use client";

import { WorkbookTextarea } from "../ui";

export function StepGoalsIntentions() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 5 of 9
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Goals & Obstacles
        </h2>
        <p className="text-slate-500">
          What do you want, and what&apos;s in the way?
        </p>
      </div>

      {/* Goals and Intentions Section */}
      <div className="mb-12 space-y-4">
        <WorkbookTextarea
          label="What are your top goals or intentions for the coming year? (Personal, professional, health, relationships?)"
          placeholder="Be specific about what you want to achieve..."
          rows={4}
        />
        <WorkbookTextarea
          label="Why are these goals important to you?"
          placeholder="Connect your goals to your deeper motivations and values..."
          rows={3}
        />
        <WorkbookTextarea
          label="How do you plan to work towards achieving these goals?"
          placeholder="What systems, habits, or strategies will you put in place?"
          rows={3}
        />
        <WorkbookTextarea
          label="What are 1-3 steps you can take right away to work towards these goals?"
          placeholder="Immediate actions you can take this week..."
          rows={3}
        />
      </div>

      {/* Obstacles and Strategies Section */}
      <h3 className="mb-6 text-lg font-bold text-slate-900">Obstacles & Strategies</h3>
      <div className="space-y-4">
        <WorkbookTextarea
          label="What potential obstacles or challenges do you foresee in achieving your goals?"
          placeholder="Market conditions, limiting beliefs, lack of resources, time constraints..."
          rows={4}
        />
        <WorkbookTextarea
          label="What strategies or actions can you take to overcome these obstacles?"
          placeholder="Training, accountability, systems, support..."
          rows={4}
        />
      </div>
    </div>
  );
}
