"use client";

import { WorkbookTextarea } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepReflectionQuestions() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 1B
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          New Year&apos;s Reflection & Intention-Setting
        </h2>
        <p className="text-slate-600">
          This is a wonderful way to set meaningful goals and align your
          aspirations with your values. Take your time and fill this out,
          leading with the heart. Stay centered and grounded in that heart
          space, with your true self, while answering these questions.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Remember that the key to a successful reflection and intention-setting
          process is <strong>honesty</strong>, <strong>self-compassion</strong>,
          and the <strong>willingness to adapt</strong> as circumstances change
          throughout the year.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="The most successful agents I know treat reflection like a business meeting—scheduled, intentional, and honest. Your past holds the blueprint for your future success."
        className="mb-8"
      />

      {/* Looking Back Section */}
      <div className="mb-8">
        <h3 className="mb-2 text-lg font-bold text-slate-900">Looking Back</h3>
        <p className="mb-6 text-sm italic text-slate-500">
          Use these questions as a guide to create a meaningful plan for the year ahead.
        </p>
      </div>

      <div className="space-y-2">
        <WorkbookTextarea
          label="What were your most significant achievements and milestones in the past year?"
          fieldName="significantAchievements"
          placeholder="I'm most proud of closing my biggest deal ever in Q3. I also finally hired an assistant which freed up 10 hours a week..."
          rows={4}
        />
        <WorkbookTextarea
          label="What challenges did you face, and how did you overcome them?"
          fieldName="challengesAndOvercoming"
          placeholder="The market slowdown in spring was tough. I overcame it by doubling down on my sphere and hosting three client appreciation events..."
          rows={4}
        />
        <WorkbookTextarea
          label="What did you learn about yourself in the past year?"
          fieldName="learnedAboutSelf"
          placeholder="I learned that I work best in the mornings and should schedule my prospecting calls before 11am. I also discovered..."
          rows={4}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Gratitude reflection →
        </p>
      </div>
    </div>
  );
}
