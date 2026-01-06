"use client";

import { useState } from "react";
import Image from "next/image";
import { TrendingUp, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useSectionOneStore,
  type SectionOneData,
} from "@/stores/section-one-store";
import { useAutoResize } from "@/hooks/use-auto-resize";

// ============================================================================
// Premium Number Input Component
// ============================================================================
interface PremiumNumberInputProps {
  label: string;
  fieldName: keyof SectionOneData;
  prefix?: string;
  placeholder?: string;
}

function PremiumNumberInput({
  label,
  fieldName,
  prefix,
  placeholder = "0",
}: PremiumNumberInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const value = useSectionOneStore((state) => state.data[fieldName]);
  const updateField = useSectionOneStore((state) => state.updateField);

  const displayValue = value === null || value === undefined ? "" : String(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value === "" ? null : parseFloat(e.target.value);
    updateField(fieldName, numValue as SectionOneData[typeof fieldName]);
  };

  return (
    <div className="group">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300",
          isFocused
            ? "border-[#1a2744] shadow-lg shadow-[#1a2744]/10"
            : "border-slate-100 hover:border-slate-200"
        )}
      >
        <div className="flex items-center px-4 py-4">
          {prefix && (
            <span className="mr-1 text-2xl font-light text-slate-400">
              {prefix}
            </span>
          )}
          <input
            type="number"
            className="w-full bg-transparent text-2xl font-semibold text-slate-800 outline-none placeholder:text-slate-300"
            placeholder={placeholder}
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {/* Bottom accent line - only shows on focus */}
        <div
          className={cn(
            "h-1 w-full transition-all duration-300",
            isFocused ? "bg-[#1a2744]" : "bg-transparent"
          )}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Premium Reflection Textarea Component
// ============================================================================
interface PremiumReflectionProps {
  number: number;
  question: string;
  fieldName: keyof SectionOneData;
  placeholder: string;
}

function PremiumReflection({
  number,
  question,
  fieldName,
  placeholder,
}: PremiumReflectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { ref } = useAutoResize({ minHeight: 120, maxHeight: 300 });

  const value = useSectionOneStore((state) => state.data[fieldName] as string) || "";
  const updateField = useSectionOneStore((state) => state.updateField);

  const hasContent = value.trim().length > 0;
  const wordCount = hasContent ? value.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div
      className={cn(
        "group relative rounded-3xl border-2 bg-white p-6 transition-all duration-300",
        isFocused
          ? "border-[#1a2744] shadow-xl shadow-[#1a2744]/5"
          : "border-slate-100 hover:border-slate-200 hover:shadow-md"
      )}
    >
      {/* Question number badge - transforms to checkmark when complete */}
      <div
        className={cn(
          "absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300",
          hasContent
            ? "bg-slate-700 text-white"
            : isFocused
              ? "bg-[#1a2744] text-white"
              : "bg-slate-200 text-slate-600"
        )}
      >
        {hasContent ? (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>

      {/* Question */}
      <label className="mb-4 block text-lg font-semibold leading-snug text-slate-800">
        {question}
      </label>

      {/* Textarea */}
      <textarea
        ref={ref}
        className="w-full resize-none bg-transparent text-base leading-relaxed text-slate-700 outline-none placeholder:text-slate-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => updateField(fieldName, e.target.value as SectionOneData[typeof fieldName])}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {/* Word count */}
      <div
        className={cn(
          "mt-2 text-xs transition-all duration-300",
          hasContent ? "text-slate-400" : "text-transparent"
        )}
      >
        {wordCount} {wordCount === 1 ? "word" : "words"}
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================
export function StepProductionNumbers() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 min-h-screen bg-gradient-to-b from-[#e8f4f8]/30 via-white to-white duration-500">
      <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-12">

        {/* ================================================================ */}
        {/* Hero Header */}
        {/* ================================================================ */}
        <header className="relative mb-10">
          {/* Decorative illustration - clipboard icon matching PDF style */}
          <div className="absolute -right-4 top-0 hidden opacity-10 md:right-0 md:block">
            <ClipboardList className="h-32 w-32 text-[#1a2744]" strokeWidth={1} />
          </div>

          {/* Part badge */}
          <div className="relative z-10 mb-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Part 1A
            </span>
          </div>

          {/* Title */}
          <h1 className="relative z-10 mb-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Past 12 Months in{" "}
            <span className="relative">
              <span className="relative z-10">Review</span>
              <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[#e8f4f8]" />
            </span>
          </h1>

          {/* Subtitle */}
          <p className="relative z-10 max-w-lg text-lg text-slate-600">
            Understanding the past helps you tackle the future more effectively.
            Take time to honestly assess what worked and what didn&apos;t.
          </p>
        </header>

        {/* ================================================================ */}
        {/* Darryl's Pro Tip - Integrated elegantly */}
        {/* ================================================================ */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-[#1a2744] p-5">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d3e5f]/50 to-transparent" />

          <div className="relative flex gap-4">
            {/* Darryl's photo */}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/20">
              <Image
                src="/darryl.png"
                alt="Darryl Davis"
                fill
                className="object-cover"
              />
            </div>

            {/* Tip content */}
            <div className="flex-1">
              <p className="mb-1 text-sm font-medium text-white/60">Pro Tip</p>
              <p className="text-[15px] leading-relaxed text-white/90">
                Numbers don&apos;t lie, but they don&apos;t tell the whole story either.
                Use these figures as a compass, not a verdict. Every top producer started somewhere.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* Production Numbers Section */}
        {/* ================================================================ */}
        <section className="mb-12">
          {/* Section header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <TrendingUp className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Production Numbers</h2>
              <p className="text-sm text-slate-500">Your performance by the numbers</p>
            </div>
          </div>

          {/* Number inputs grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PremiumNumberInput
              label="Listings Taken"
              fieldName="listingsTaken"
            />
            <PremiumNumberInput
              label="Seller Sides Closed"
              fieldName="sellerSidesClosed"
            />
            <PremiumNumberInput
              label="Buyer Sides Closed"
              fieldName="buyerSidesClosed"
            />
            <PremiumNumberInput
              label="Renter Transactions"
              fieldName="renterTransactions"
            />
          </div>

          {/* GCI - Full width, highlighted */}
          <div className="mt-6">
            <PremiumNumberInput
              label="Gross Closed Commissions"
              fieldName="grossClosedCommissions"
              prefix="$"
              placeholder="0.00"
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Reflection Questions Section */}
        {/* ================================================================ */}
        <section>
          {/* Section header */}
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Reflection Questions
            </h2>
            <p className="text-slate-600">
              Take a moment to reflect honestly on your performance over the past 12 months.
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <PremiumReflection
              number={1}
              question="Did you achieve your goals over the past 12 months? Why or why not?"
              fieldName="didAchieveGoals"
              placeholder="I hit 80% of my transaction goal. I fell short because I didn't prospect consistently in Q2..."
            />
            <PremiumReflection
              number={2}
              question="What were your biggest struggles?"
              fieldName="biggestStruggles"
              placeholder="Inventory was tight all spring. I also struggled with time management and let admin tasks pile up..."
            />
            <PremiumReflection
              number={3}
              question="What was your biggest accomplishment?"
              fieldName="biggestAccomplishment"
              placeholder="I closed my first million-dollar listing! Also built a referral system that brought in 5 new clients..."
            />
            <PremiumReflection
              number={4}
              question="How did you prospect over the past 12 months?"
              fieldName="prospectingMethods"
              placeholder="Mostly sphere calls and open houses. I tried door knocking in Q3 but wasn't consistent..."
            />
            <PremiumReflection
              number={5}
              question="What went well that you want to continue?"
              fieldName="wantToContinue"
              placeholder="My Monday morning sphere calls. Also my client appreciation events - they generated 3 referrals..."
            />
          </div>
        </section>

        {/* ================================================================ */}
        {/* Up Next Teaser */}
        {/* ================================================================ */}
        <footer className="mt-12 rounded-2xl bg-gradient-to-r from-[#e8f4f8] to-white p-6 text-center">
          <p className="text-sm font-medium text-slate-500">Up Next</p>
          <p className="text-lg font-semibold text-[#1a2744]">
            New Year&apos;s Reflection & Intention Setting →
          </p>
        </footer>
      </div>
    </div>
  );
}
