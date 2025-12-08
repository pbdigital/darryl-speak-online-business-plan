"use client";

import { CheckCircle2, PartyPopper } from "lucide-react";
import { WorkbookTextarea, WorkbookInput } from "../ui";

export function StepComplete() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 8 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Celebration & Commitment
        </h2>
        <p className="text-slate-500">
          You&apos;ve done the work. Now seal it with intention.
        </p>
      </div>

      {/* Celebration Card */}
      <div className="mb-12 rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8 shadow-lg">
        <h3 className="mb-6 flex items-center gap-2 border-b border-purple-200 pb-4 text-sm font-bold uppercase tracking-wider text-purple-900">
          <PartyPopper size={18} /> Celebration & Reflection
        </h3>
        <div className="space-y-4">
          <WorkbookTextarea
            label="How will you celebrate milestones along the way?"
            placeholder="Rewards, treats, experiences, recognition..."
            rows={3}
          />
          <WorkbookTextarea
            label="How will you celebrate completing this business plan?"
            placeholder="Take yourself out, share with a friend, post about it..."
            rows={3}
          />
          <WorkbookTextarea
            label="What words of encouragement would you give to your future self?"
            placeholder="Write a message to yourself for when times get tough..."
            rows={3}
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="mb-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
        <div className="mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <div>
            <h3 className="font-bold text-emerald-900">Section Complete!</h3>
            <p className="text-sm text-emerald-700">
              You&apos;ve finished the Annual Reflection & Intention Setting section.
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-emerald-800">
          Your reflections and intentions have been recorded. Remember, this is a
          living document - feel free to revisit and update it throughout the
          year as your goals and circumstances evolve.
        </p>
      </div>

      {/* Signature Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-900">
          Your Commitment
        </h3>
        <p className="mb-8 text-slate-600">
          By signing below, I commit to honoring these reflections and working
          toward the intentions I&apos;ve set for 2026.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <WorkbookInput label="Signature" placeholder="Your name" />
          <WorkbookInput
            label="Date"
            placeholder="MM/DD/YYYY"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}
