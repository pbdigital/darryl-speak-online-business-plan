"use client";

import { cn } from "@/lib/utils";
import type { ExpenseItem } from "@/types/business-plan";

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onUpdate: (index: number, amount: number | null) => void;
  totalLabel?: string;
  total: number;
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

export function ExpenseTable({
  expenses,
  onUpdate,
  totalLabel = "Monthly Total",
  total,
  className,
}: ExpenseTableProps) {
  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === "") {
      onUpdate(index, null);
      return;
    }
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      onUpdate(index, parsed);
    }
  };

  return (
    <div className={cn("", className)}>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0F172A] text-white">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Expense
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                Monthly Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-slate-100 transition-colors",
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                )}
              >
                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                  {expense.name}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end">
                    <span className="mr-1 text-slate-400">$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="w-24 rounded border border-transparent bg-transparent px-2 py-1.5 text-right text-sm font-medium text-slate-800 outline-none transition-all hover:border-slate-200 focus:border-slate-400 focus:bg-white"
                      placeholder="0"
                      value={expense.amount !== null ? expense.amount : ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#e8f4f8]">
              <td className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-[#0F172A]">
                {totalLabel}
              </td>
              <td className="px-4 py-4 text-right text-lg font-bold text-[#0F172A]">
                {formatCurrency(total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
