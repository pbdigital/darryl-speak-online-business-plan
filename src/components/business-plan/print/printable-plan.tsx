"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusinessPlan } from "@/providers/business-plan-provider";
import { useHydrateAllStores } from "@/hooks/use-hydrate-all-stores";
import { useSectionProgress } from "@/hooks/use-section-progress";
import { useSectionOneStore } from "@/stores/section-one-store";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { useSectionFourStore } from "@/stores/section-four-store";
import { useSectionFiveStore } from "@/stores/section-five-store";
import { sendPlanEvent } from "@/lib/keap/track";
import {
  AccountabilityPrint,
  IncomePlanningPrint,
  MindsetPrint,
  ReflectionPrint,
  SwotPrint,
} from "./print-sections";
import { formatCurrency, formatNumber, hasText } from "./print-parts";
import { PlanQrCode } from "./plan-qr-code";

const SECTION_TITLES = [
  "Annual Reflection & Intention Setting",
  "SWOT Analysis",
  "Vision, Goals & Income Planning",
  "Mindset, Self-Care & Motivation",
  "Accountability & Progress Tracking",
];

const FREE_PLAN_URL = (() => {
  const url = new URL(process.env.NEXT_PUBLIC_FREE_PLAN_URL || "https://www.myplanforsuccess.com");
  url.searchParams.set("utm_source", "printed-plan");
  url.searchParams.set("utm_medium", "print");
  return url;
})();

// Room kept free at the bottom of every printed page for the fixed footer.
const FOOTER_SPACE = "h-[0.85in]";

interface PrintablePlanProps {
  year: number;
  userName: string;
}

/**
 * The whole plan on one page, laid out for paper. Read-only, so it works for
 * locked plans too. Printing (from the button or the browser menu) records
 * the `printed` event.
 */
export function PrintablePlan({ year, userName }: PrintablePlanProps) {
  const { isLoading, error } = useBusinessPlan();
  useHydrateAllStores();

  const reflection = useSectionOneStore((state) => state.data);
  const swot = useSectionTwoStore((state) => state.data);
  const incomePlanning = useBusinessPlanStore((state) => state.incomePlanning);
  const calculated = useBusinessPlanStore((state) => state.calculated);
  const mindset = useSectionFourStore((state) => state.data);
  const accountability = useSectionFiveStore((state) => state.data);
  const { sectionProgress, completedSections } = useSectionProgress();

  // Record one `printed` event per visit, however the print was started.
  const printRecorded = useRef(false);
  useEffect(() => {
    const onBeforePrint = () => {
      if (printRecorded.current) return;
      printRecorded.current = true;
      sendPlanEvent("printed");
    };
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, []);

  const hasCap = (incomePlanning.brokerCapAmount ?? 0) > 0;
  const gciGoal = hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded;

  return (
    <div className="min-h-screen bg-slate-100 [print-color-adjust:exact] print:bg-white">
      <style>{`
        @page { size: letter; margin: 0.6in 0.6in 0.4in; }
        @media print { html, body { background: #fff !important; } }
      `}</style>

      {/* Toolbar, never printed */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[8.5in] items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to my plan
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-700 disabled:opacity-50"
          >
            <Printer className="h-4 w-4" />
            Print or save as PDF
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-[8.5in] px-4 py-10 print:max-w-none print:p-0">
        <div className="rounded-sm bg-white px-[0.6in] py-[0.6in] shadow-xl print:rounded-none print:p-0 print:shadow-none">
          {isLoading ? (
            <p className="py-24 text-center text-slate-500">Getting your plan ready...</p>
          ) : error ? (
            <p className="py-24 text-center text-slate-500">
              We couldn&apos;t load your plan. Please refresh the page to try again.
            </p>
          ) : (
            <>
              <Sheet first>
                <header className="border-b-4 border-[#1a2744] pb-10 pt-6">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                    The Ultimate Real Estate Business Plan
                  </p>
                  <h1 className="mt-4 font-serif text-7xl font-bold leading-none text-[#1a2744]">{year}</h1>
                  <p className="mt-6 font-serif text-2xl text-slate-900">{userName}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Printed{" "}
                    {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </header>

                <div className="mt-10 grid grid-cols-3 gap-3">
                  <CoverFigure label="Commission income goal" value={gciGoal > 0 ? formatCurrency(gciGoal) : ""} />
                  <CoverFigure
                    label="Transactions to close"
                    value={calculated.totalTransactionsNeeded > 0 ? formatNumber(calculated.totalTransactionsNeeded) : ""}
                  />
                  <CoverFigure label="My word for the year" value={hasText(reflection.mantra) ? reflection.mantra : ""} />
                </div>

                <div className="mt-12">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    In this plan ({completedSections} of 5 sections complete)
                  </p>
                  <ol className="divide-y divide-slate-200 border-y border-slate-200">
                    {SECTION_TITLES.map((title, i) => (
                      <li key={title} className="flex items-center justify-between py-3">
                        <span className="font-serif text-lg text-slate-900">
                          <span className="mr-3 font-bold text-[#1a2744]">{i + 1}</span>
                          {title}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-semibold uppercase tracking-wider",
                            sectionProgress[i] === 100 ? "text-[#1a2744]" : "text-slate-400"
                          )}
                        >
                          {sectionProgress[i] === 100 ? "Complete" : `${sectionProgress[i]}% done`}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </Sheet>

              <Sheet>
                <ReflectionPrint data={reflection} />
              </Sheet>
              <Sheet>
                <SwotPrint data={swot} />
              </Sheet>
              <Sheet>
                <IncomePlanningPrint data={incomePlanning} calculated={calculated} />
              </Sheet>
              <Sheet>
                <MindsetPrint data={mindset} />
              </Sheet>
              <Sheet>
                <AccountabilityPrint data={accountability} year={year} />
              </Sheet>

              {/* On screen the footer closes the document; in print it repeats on every page. */}
              <PlanFooter year={year} className="mt-16 print:hidden" />
              <PlanFooter year={year} className="fixed inset-x-0 bottom-0 hidden bg-white print:flex" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * One printed part of the plan, starting on a new page. The table's footer
 * group repeats on every printed page, keeping the content clear of the
 * fixed footer.
 */
function Sheet({ first = false, children }: { first?: boolean; children: ReactNode }) {
  return (
    <div className={first ? undefined : "mt-16 print:mt-0 print:break-before-page"}>
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="p-0 align-top">{children}</td>
          </tr>
        </tbody>
        <tfoot className="hidden print:table-footer-group">
          <tr>
            <td className="p-0">
              <div className={FOOTER_SPACE} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function CoverFigure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 truncate font-serif text-2xl font-bold text-[#1a2744]">{value || " "}</p>
    </div>
  );
}

function PlanFooter({ year, className }: { year: number; className?: string }) {
  const host = FREE_PLAN_URL.hostname.replace(/^www\./, "");

  return (
    <footer className={cn("flex items-center justify-between gap-6 border-t border-slate-200 pt-3", className)}>
      <p className="text-[11px] leading-snug text-slate-500">
        Built with Darryl Davis&apos;s free {year} Business Plan,{" "}
        <span className="font-semibold text-[#1a2744]">{host}</span>
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <p className="text-right text-[10px] leading-tight text-slate-400">
          Scan to make
          <br />
          your own plan
        </p>
        <PlanQrCode value={FREE_PLAN_URL.toString()} className="h-[0.6in] w-[0.6in]" />
      </div>
    </footer>
  );
}
