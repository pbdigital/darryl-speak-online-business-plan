"use client";

import { WorkbookTextarea } from "../ui";

export function StepCelebration() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 8 of 9
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Celebration & Reflection
        </h2>
        <p className="text-slate-500">
          Acknowledge your progress and stay aligned with what matters most.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Celebration and Reflection</h3>
      </div>

      <div className="space-y-2">
        <WorkbookTextarea
          label="What milestones or achievements will you celebrate along the way?"
          placeholder="Quarterly goals, first listing, income milestones, personal wins..."
          rows={3}
        />
        <WorkbookTextarea
          label="How often will you pause to reflect on your progress and adjust your goals if needed?"
          placeholder="Weekly, monthly, quarterly? What will trigger a review?"
          rows={3}
        />
        <WorkbookTextarea
          label="What else would you like to reflect on, improve upon, stop, start or continue this coming year?"
          placeholder="Habits to break, new practices to start, things to let go of..."
          rows={4}
        />
        <WorkbookTextarea
          label="What is really important to you right now and moving into the new year?"
          placeholder="Your core focus, what matters most, your non-negotiables..."
          rows={4}
        />
      </div>
    </div>
  );
}
