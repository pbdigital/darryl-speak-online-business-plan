"use client";

import { WorkbookTextarea } from "../ui";

export function StepReflectionQuestions() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-12 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 2 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Reflection Questions
        </h2>
        <p className="text-slate-500">
          Dig deep. Honesty is your best tool here.
        </p>
      </div>

      <div className="space-y-2">
        <WorkbookTextarea
          label="Did you achieve your goals last year? Why or why not?"
          placeholder="Be specific about what worked and what didn't..."
          rows={4}
        />
        <WorkbookTextarea
          label="What were your biggest struggles?"
          placeholder="Market conditions? Mindset? Inventory? Time management?"
          rows={4}
        />
        <WorkbookTextarea
          label="What was your biggest accomplishment?"
          placeholder="Don't be shy, brag a little! What are you most proud of?"
          rows={4}
        />
        <WorkbookTextarea
          label="How did you prospect last year?"
          placeholder="What methods did you use? What was most effective?"
          rows={4}
        />
        <WorkbookTextarea
          label="What went well that you want to continue?"
          placeholder="Strategies, habits, or approaches worth keeping..."
          rows={4}
        />
      </div>
    </div>
  );
}
