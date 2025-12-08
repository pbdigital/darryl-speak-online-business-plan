"use client";

import { LineChart } from "lucide-react";
import { WorkbookInput } from "../ui";

export function StepProductionNumbers() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-12 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 1 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Last Year in Review
        </h2>
        <p className="text-slate-500">
          Understanding the past helps you tackle the future.
        </p>
      </div>

      <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-lg md:p-12">
        {/* Decorative background for the card */}
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
    </div>
  );
}
