"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, DollarSign, Target } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  format: "currency" | "number";
  variant?: "primary" | "success" | "info";
  icon?: "trending" | "dollar" | "target";
  className?: string;
}

const formatValue = (value: number, format: "currency" | "number"): string => {
  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

const IconComponent = {
  trending: TrendingUp,
  dollar: DollarSign,
  target: Target,
};

export function SummaryCard({
  title,
  value,
  format,
  variant = "primary",
  icon,
  className,
}: SummaryCardProps) {
  const Icon = icon ? IconComponent[icon] : null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl p-6 transition-all",
        variant === "primary" && "bg-[#0F172A] text-white",
        variant === "success" && "bg-emerald-600 text-white",
        variant === "info" && "bg-[#e8f4f8] text-[#0F172A]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "mb-2 text-xs font-bold uppercase tracking-wider",
              variant === "info" ? "text-slate-600" : "text-white/70"
            )}
          >
            {title}
          </p>
          <p className="text-3xl font-extrabold tracking-tight">
            {formatValue(value, format)}
          </p>
        </div>
        {Icon && (
          <div
            className={cn(
              "rounded-full p-3",
              variant === "info" ? "bg-[#0F172A]/10" : "bg-white/10"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                variant === "info" ? "text-[#0F172A]" : "text-white"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
