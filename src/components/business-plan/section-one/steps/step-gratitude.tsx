"use client";

import { WorkbookTextarea } from "../ui";

export function StepGratitude() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 3 of 9
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Gratitude
        </h2>
        <p className="text-slate-500">
          Appreciation opens the door to abundance.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Gratitude</h3>
      </div>

      <div className="space-y-2">
        <WorkbookTextarea
          label="What are you most grateful for from the past year?"
          placeholder="Experiences, opportunities, growth, wins..."
          rows={3}
        />
        <WorkbookTextarea
          label="Who are the people you are most grateful for, and why?"
          placeholder="Family, mentors, clients, colleagues, friends..."
          rows={3}
        />
        <WorkbookTextarea
          label="What moments or experiences brought you the most joy?"
          placeholder="Big or small moments that made you smile..."
          rows={3}
        />
      </div>
    </div>
  );
}
