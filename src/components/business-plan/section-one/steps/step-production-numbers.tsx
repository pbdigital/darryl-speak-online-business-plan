"use client";

import { LineChart } from "lucide-react";
import { WorkbookInput, WorkbookTextarea } from "../ui";

export function StepProductionNumbers() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-12 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 1 of 9
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Last Year in Review
        </h2>
        <p className="mx-auto max-w-xl text-slate-500">
          Understanding the past helps you tackle the future more effectively.
          Take time to honestly assess what worked and what didn&apos;t.
        </p>
      </div>

      {/* Production Numbers Card */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-lg md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-slate-50" />

        <div className="relative z-10">
          <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-4">
            <LineChart className="text-slate-900" size={24} />
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">
              Production Numbers
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
            <WorkbookInput label="Listings Taken" placeholder="#" type="number" />
            <WorkbookInput
              label="Seller Sides Closed"
              placeholder="#"
              type="number"
            />
            <WorkbookInput
              label="Buyer Sides Closed"
              placeholder="#"
              type="number"
            />
            <WorkbookInput
              label="Renter Transactions"
              placeholder="#"
              type="number"
            />
          </div>
          <div className="mt-4 border-t border-slate-50 pt-4">
            <WorkbookInput
              label="Gross Closed Commissions"
              placeholder="0.00"
              prefix="$"
              type="number"
            />
          </div>
        </div>
      </div>

      {/* Reflection Questions */}
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          Reflection Questions
        </h3>
        <p className="mb-8 text-sm text-slate-500">
          Take a moment to reflect honestly on your performance last year.
        </p>
      </div>

      <div className="space-y-2">
        <WorkbookTextarea
          label="Did you achieve your goals last year? Why or why not?"
          placeholder="Be specific about what worked and what didn't..."
          rows={3}
        />
        <WorkbookTextarea
          label="What were your biggest struggles?"
          placeholder="Market conditions? Mindset? Inventory? Time management?"
          rows={3}
        />
        <WorkbookTextarea
          label="What was your biggest accomplishment?"
          placeholder="Don't be shy—celebrate your wins!"
          rows={3}
        />
        <WorkbookTextarea
          label="How did you prospect last year?"
          placeholder="What methods did you use? What was most effective?"
          rows={3}
        />
        <WorkbookTextarea
          label="What went well that you want to continue?"
          placeholder="Strategies, habits, or approaches worth keeping..."
          rows={3}
        />
      </div>
    </div>
  );
}
