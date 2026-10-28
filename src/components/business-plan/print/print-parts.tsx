import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Building blocks for the printable plan. Laid out for paper first: plain
 * white, navy accents, nothing that only works on screen.
 */

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export const formatCurrency = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : currencyFormatter.format(value);

export const formatNumber = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : numberFormatter.format(value);

/** Formats a saved YYYY-MM-DD date for paper, leaving anything else as typed. */
export const formatDate = (value: string | null | undefined) => {
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export const hasText = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.trim() !== "";

/** Ruled lines standing in for an unanswered question, so the paper copy can be filled by hand. */
export function BlankLines({ count = 2 }: { count?: number }) {
  return (
    <div aria-label="Not answered yet">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-6 border-b border-dotted border-slate-300" />
      ))}
    </div>
  );
}

export function PlanSection({
  number,
  title,
  subtitle,
  children,
}: {
  number: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section>
      <header className="mb-8 flex items-end gap-5 border-b-2 border-[#1a2744] pb-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1a2744] font-serif text-2xl font-bold text-white">
          {number}
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Section {number}
          </p>
          <h2 className="font-serif text-2xl font-bold leading-tight text-[#1a2744]">
            {title} <span className="font-normal text-slate-500">{subtitle}</span>
          </h2>
        </div>
      </header>
      <div className="space-y-8">{children}</div>
    </section>
  );
}

/** A titled group of answers inside a section. */
export function Group({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="mb-3 break-after-avoid text-xs font-bold uppercase tracking-[0.15em] text-[#1a2744]">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/** One question and the user's answer, or ruled lines when it's blank. */
export function Answer({
  label,
  value,
  lines = 2,
}: {
  label: string;
  value: string | null | undefined;
  lines?: number;
}) {
  return (
    <div className="break-inside-avoid">
      <p className="mb-1 text-[13px] font-semibold text-slate-600">{label}</p>
      {hasText(value) ? (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-900">{value}</p>
      ) : (
        <BlankLines count={lines} />
      )}
    </div>
  );
}

/** A bulleted list of the filled entries, or ruled lines when there are none. */
export function AnswerList({ label, items }: { label?: string; items: string[] }) {
  const filled = items.filter(hasText);
  return (
    <div className="break-inside-avoid">
      {label && <p className="mb-1 text-[13px] font-semibold text-slate-600">{label}</p>}
      {filled.length > 0 ? (
        <ul className="space-y-1.5">
          {filled.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-900">
              <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1a2744]" />
              <span className="whitespace-pre-wrap">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <BlankLines count={3} />
      )}
    </div>
  );
}

/** A labelled number in a bordered box. */
export function Stat({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "break-inside-avoid rounded-xl border px-4 py-3",
        emphasis ? "border-[#1a2744] bg-[#1a2744] text-white" : "border-slate-200 bg-white"
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-wider",
          emphasis ? "text-slate-300" : "text-slate-500"
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-serif text-xl font-bold tabular-nums",
          emphasis ? "text-white" : "text-slate-900"
        )}
      >
        {value || " "}
      </p>
    </div>
  );
}

/** Label and value on one line, for figures in a ledger. */
export function Row({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-slate-100 py-1.5 text-[14px]",
        strong && "border-slate-300 font-bold text-[#1a2744]"
      )}
    >
      <span className={strong ? "" : "text-slate-600"}>{label}</span>
      <span className="tabular-nums text-slate-900">{value || "—"}</span>
    </div>
  );
}

/** A card for one entry in a list of similar entries (a goal, a client, an activity). */
export function EntryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="break-inside-avoid rounded-xl border border-slate-200 p-5">
      <h4 className="mb-3 font-serif text-lg font-bold text-[#1a2744]">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/** A signature line with a printed name or blank, and a date. */
export function SignatureLine({
  label,
  name,
  date,
}: {
  label: string;
  name?: string;
  date?: string;
}) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-6 break-inside-avoid">
      <div>
        <div className="flex h-10 items-end border-b border-slate-900 pb-1 font-serif text-lg italic text-slate-900">
          {hasText(name) ? name : ""}
        </div>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      </div>
      <div>
        <div className="flex h-10 items-end border-b border-slate-900 pb-1 text-[15px] text-slate-900">
          {formatDate(date)}
        </div>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Date</p>
      </div>
    </div>
  );
}
