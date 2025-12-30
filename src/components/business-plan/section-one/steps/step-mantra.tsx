"use client";

import { useState } from "react";
import { Star, Sparkles, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { WorkbookTextarea, MantraWallpaper, StepContainer, StepHeader, UpNextFooter } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";
import { useSectionOneStore } from "@/stores/section-one-store";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

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
    <StepContainer>
      <StepHeader
        part="Part 1G"
        title="Mantra & Accountability"
        highlightWord="Mantra"
        subtitle="Choose one powerful word to guide your year. This mantra will serve as your north star when challenges arise."
        icon={Star}
      />

      <DarrylTip
        tip="Your mantra isn't just a word—it's a decision you make every morning. When doubt creeps in, let your word remind you who you chose to become."
        className="mb-10"
      />

      {/* Mantra Card - Ambient gradient background */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-10 text-center text-white shadow-2xl">
        {/* Ambient gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5" />

        <Star className="absolute left-0 top-0 -ml-6 -mt-6 h-32 w-32 text-white opacity-5" />
        <Star className="absolute bottom-0 right-0 -mb-6 -mr-6 h-24 w-24 text-white opacity-5" />

        <h3 className="relative z-10 mb-8 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
          My {CURRENT_PLAN_YEAR} Word or Mantra
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

      {/* Mantra Wallpaper Preview & Download */}
      {mantra && <MantraWallpaper mantra={mantra} />}

      {/* Accountability Questions */}
      <section className="mt-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Users className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Accountability and Tracking</h2>
            <p className="text-sm text-slate-500">Stay on course with support</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={1}
            label="How will you hold yourself accountable for your goals and intentions?"
            fieldName="accountabilityMethod"
            placeholder="I will check in with myself every Sunday evening to review my progress..."
          />
          <WorkbookTextarea
            number={2}
            label="Is there a person or people that you can partner with to stay accountable?"
            fieldName="accountabilityPartner"
            placeholder="My accountability partner is Sarah from my office. We meet every Monday to review our weekly goals..."
          />
          <WorkbookTextarea
            number={3}
            label="What tools or methods will you use to track your progress throughout the year?"
            fieldName="progressTrackingTools"
            placeholder="I'll use my CRM for pipeline tracking, a spreadsheet for GCI, and the POWER AGENT® weekly planning sheet..."
          />
        </div>
      </section>

      <UpNextFooter text="Celebration and reflection" />
    </StepContainer>
  );
}
