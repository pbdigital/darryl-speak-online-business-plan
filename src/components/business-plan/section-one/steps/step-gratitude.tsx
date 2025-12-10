"use client";

import { WorkbookTextarea } from "../ui";

export function StepGratitude() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 1C
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Gratitude
        </h2>
        <p className="text-slate-600">
          Appreciation opens the door to abundance. Reflecting on what you&apos;re
          grateful for helps you recognize the good in your life and business.
        </p>
      </div>

      <div className="space-y-2">
        <WorkbookTextarea
          label="What are you most grateful for from the past year?"
          fieldName="gratefulFor"
          placeholder="I'm grateful for the opportunity to help 12 families find their dream homes this year..."
          rows={3}
        />
        <WorkbookTextarea
          label="Who are the people you are most grateful for, and why?"
          fieldName="gratefulPeople"
          placeholder="My mentor Jane who pushed me to take on that challenging listing. My spouse for supporting my crazy hours..."
          rows={3}
        />
        <WorkbookTextarea
          label="What moments or experiences brought you the most joy?"
          fieldName="joyfulMoments"
          placeholder="Handing the keys to the Martinez family and seeing their kids run to their new rooms..."
          rows={3}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Self-reflection and values →
        </p>
      </div>
    </div>
  );
}
