"use client";

import { Star } from "lucide-react";
import { WorkbookTextarea } from "../ui";

export function StepMantra() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 7 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Mantra & Accountability
        </h2>
        <p className="text-slate-500">
          One word to guide your year.
        </p>
      </div>

      {/* Mantra Card - Dark background */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-[#0F172A] p-10 text-center text-white shadow-2xl">
        <Star className="absolute -ml-12 -mt-12 left-0 top-0 h-64 w-64 animate-pulse text-white opacity-5" />
        <h3 className="relative z-10 mb-8 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
          My 2026 Word or Mantra
        </h3>
        <input
          type="text"
          className="relative z-10 w-full border-b-2 border-slate-700 bg-transparent pb-4 text-center text-4xl font-black uppercase tracking-tight text-white outline-none transition-colors placeholder:text-slate-800 focus:border-blue-500 md:text-6xl"
          placeholder="UNSTOPPABLE"
        />
      </div>

      {/* Accountability Questions */}
      <div className="space-y-4">
        <WorkbookTextarea
          label="How will you track your progress throughout the year?"
          placeholder="Weekly reviews, journaling, spreadsheets, apps, accountability partner check-ins..."
          rows={3}
        />
        <WorkbookTextarea
          label="Who will hold you accountable?"
          placeholder="Business partner, coach, mentor, mastermind group, spouse..."
          rows={3}
        />
        <WorkbookTextarea
          label="How often will you review and adjust your goals?"
          placeholder="Weekly, monthly, quarterly? What will your review process look like?"
          rows={3}
        />
      </div>
    </div>
  );
}
