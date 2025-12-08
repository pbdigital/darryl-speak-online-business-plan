"use client";

import { Smile } from "lucide-react";
import { WorkbookInput, WorkbookTextarea } from "../ui";

export function StepGratitude() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 3 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Gratitude & Looking Back
        </h2>
        <p className="text-slate-500">
          Appreciation opens the door to abundance.
        </p>
      </div>

      {/* Gratitude Card - Yellow accent */}
      <div className="mb-12 rounded-3xl border border-yellow-200 bg-[#FFFBEB] p-8 shadow-[0_10px_40px_-10px_rgba(251,191,36,0.3)]">
        <h3 className="mb-8 flex items-center gap-2 border-b border-yellow-200 pb-4 text-sm font-bold uppercase tracking-wider text-yellow-900">
          <Smile size={18} /> Gratitude Practice
        </h3>
        <div className="space-y-6">
          <WorkbookInput
            label="What are you most grateful for from the past year?"
            placeholder="Experiences, wins, growth..."
          />
          <WorkbookInput
            label="Who are the people you are most grateful for?"
            placeholder="Family, mentors, clients, colleagues..."
          />
          <WorkbookInput
            label="What moments brought you the most joy?"
            placeholder="Small or big moments that made you smile..."
          />
        </div>
      </div>

      {/* Looking Back Questions */}
      <div className="space-y-2">
        <WorkbookTextarea
          label="What key moments or milestones defined your year?"
          placeholder="Major events, turning points, memorable achievements..."
          rows={3}
        />
        <WorkbookTextarea
          label="What lessons did the past year teach you?"
          placeholder="Insights about yourself, your business, or life..."
          rows={3}
        />
        <WorkbookTextarea
          label="How have you changed or evolved over the past year?"
          placeholder="Personal growth, new perspectives, shifted priorities..."
          rows={3}
        />
      </div>
    </div>
  );
}
