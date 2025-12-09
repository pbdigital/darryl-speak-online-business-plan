"use client";

import { cn } from "@/lib/utils";
import type { GoalItem } from "@/types/business-plan";

interface GoalTableProps {
  goals: GoalItem[];
  category: "familyGoals" | "financialGoals" | "personalGoals" | "businessGoals";
  onUpdate: (
    index: number,
    field: "name" | "amount",
    value: string | number | null
  ) => void;
  title: string;
  className?: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function GoalTable({
  goals,
  onUpdate,
  title,
  className,
}: GoalTableProps) {
  const handleNameChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate(index, "name", e.target.value);
  };

  const handleAmountChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "") {
      onUpdate(index, "amount", null);
      return;
    }
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      onUpdate(index, "amount", parsed);
    }
  };

  const subtotal = goals.reduce(
    (sum, goal) => sum + (goal.amount || 0),
    0
  );

  return (
    <div className={cn("", className)}>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
        {title}
      </h3>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0F172A] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Goal
              </th>
              <th className="w-32 px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                Money Needed
              </th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-slate-100 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-4 py-2">
                  <input
                    type="text"
                    className="w-full rounded border border-transparent bg-transparent px-2 py-1.5 text-sm font-medium text-slate-800 outline-none transition-all hover:border-slate-200 focus:border-slate-400 focus:bg-white"
                    placeholder={`Goal ${index + 1}`}
                    value={goal.name}
                    onChange={(e) => handleNameChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end">
                    <span className="mr-1 text-slate-400">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-20 rounded border border-transparent bg-transparent px-2 py-1.5 text-right text-sm font-medium text-slate-800 outline-none transition-all hover:border-slate-200 focus:border-slate-400 focus:bg-white"
                      placeholder="0"
                      value={goal.amount !== null ? goal.amount : ""}
                      onChange={(e) => handleAmountChange(index, e)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#e8f4f8]">
              <td className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
                Subtotal
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-[#0F172A]">
                {formatCurrency(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
