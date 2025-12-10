"use client";

import { useState } from "react";
import { Star, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { WorkbookTextarea } from "../ui";
import { useSectionOneStore } from "@/stores/section-one-store";

const MANTRA_SUGGESTIONS = [
  "RELENTLESS",
  "CONSISTENT",
  "UNSTOPPABLE",
  "FEARLESS",
  "FOCUSED",
  "ABUNDANT",
  "RESILIENT",
  "INTENTIONAL",
];

export function StepMantra() {
  // Get mantra from store
  const mantra = useSectionOneStore((state) => state.data.mantra);
  const updateField = useSectionOneStore((state) => state.updateField);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const setMantra = (value: string) => {
    updateField("mantra", value);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setMantra(suggestion);
    setShowSuggestions(false);
  };

  const nextSuggestion = () => {
    setSuggestionIndex((prev) => (prev + 1) % MANTRA_SUGGESTIONS.length);
  };

  const prevSuggestion = () => {
    setSuggestionIndex(
      (prev) => (prev - 1 + MANTRA_SUGGESTIONS.length) % MANTRA_SUGGESTIONS.length
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 1G
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Mantra & Accountability
        </h2>
        <p className="text-slate-600">
          Choose one powerful word to guide your year. This mantra will serve as
          your north star when challenges arise.
        </p>
      </div>

      {/* Mantra Card - Ambient gradient background */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-10 text-center text-white shadow-2xl">
        {/* Ambient gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />

        <Star className="absolute left-0 top-0 -ml-6 -mt-6 h-32 w-32 text-white opacity-5" />
        <Star className="absolute bottom-0 right-0 -mb-6 -mr-6 h-24 w-24 text-white opacity-5" />

        <h3 className="relative z-10 mb-8 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
          My 2026 Word or Mantra
        </h3>

        <input
          type="text"
          value={mantra}
          onChange={(e) => setMantra(e.target.value.toUpperCase())}
          className="relative z-10 w-full border-b-2 border-slate-600 bg-transparent pb-4 text-center text-4xl font-black uppercase tracking-tight text-white outline-none transition-all duration-300 placeholder:text-slate-700 focus:border-blue-400 md:text-6xl"
          placeholder="UNSTOPPABLE"
        />

        {/* Inspiration Toggle */}
        <button
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="relative z-10 mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
        >
          <Sparkles className="h-3 w-3" />
          {showSuggestions ? "Hide suggestions" : "Need inspiration?"}
        </button>

        {/* Suggestions Carousel */}
        {showSuggestions && (
          <div className="relative z-10 mt-6 animate-fade-in-up">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevSuggestion}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex gap-2">
                {[0, 1, 2].map((offset) => {
                  const index =
                    (suggestionIndex + offset) % MANTRA_SUGGESTIONS.length;
                  const suggestion = MANTRA_SUGGESTIONS[index];
                  const isCenter = offset === 1;

                  return (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        isCenter
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                      }`}
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={nextSuggestion}
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mantra Preview Card */}
      {mantra && (
        <div className="mb-12 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Your 2026 Mantra
          </div>
          <div className="flex aspect-[3/1] items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <span className="text-3xl font-black uppercase tracking-wider text-white md:text-4xl">
              {mantra}
            </span>
          </div>
          <p className="mt-3 text-center text-xs text-slate-400">
            Screenshot this as your phone wallpaper reminder
          </p>
        </div>
      )}

      {/* Accountability Questions */}
      <h3 className="mb-8 text-lg font-bold text-slate-900">
        Accountability and Tracking
      </h3>
      <div className="space-y-2">
        <WorkbookTextarea
          label="How will you hold yourself accountable for your goals and intentions?"
          fieldName="accountabilityMethod"
          placeholder="I will check in with myself every Sunday evening to review my progress..."
          rows={3}
        />
        <WorkbookTextarea
          label="Is there a person or people that you can partner with to stay accountable?"
          fieldName="accountabilityPartner"
          placeholder="My accountability partner is Sarah from my office. We meet every Monday to review our weekly goals..."
          rows={3}
        />
        <WorkbookTextarea
          label="What tools or methods will you use to track your progress throughout the year?"
          fieldName="progressTrackingTools"
          placeholder="I'll use my CRM for pipeline tracking, a spreadsheet for GCI, and the Power Agent weekly planning sheet..."
          rows={3}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Celebration and reflection →
        </p>
      </div>
    </div>
  );
}
