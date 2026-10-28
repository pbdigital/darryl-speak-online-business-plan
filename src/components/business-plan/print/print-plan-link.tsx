import Link from "next/link";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

/** Link to the whole-plan view at /plan/print, where the plan can be printed or saved as PDF. */
export function PrintPlanLink({
  variant = "link",
  className,
}: {
  variant?: "link" | "button";
  className?: string;
}) {
  return (
    <Link
      href="/plan/print"
      className={cn(
        "inline-flex items-center gap-2",
        variant === "button"
          ? "rounded-full border-2 border-[#1a2744] bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#1a2744] transition-colors hover:bg-[#e8f4f8]"
          : "text-sm font-semibold text-[#1a2744] underline-offset-4 hover:underline",
        className
      )}
    >
      <Printer className="h-4 w-4" />
      View and print your whole plan
    </Link>
  );
}
