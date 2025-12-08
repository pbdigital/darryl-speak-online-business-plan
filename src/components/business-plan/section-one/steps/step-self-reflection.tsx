"use client";

import { WorkbookTextarea } from "../ui";

export function StepSelfReflection() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 4 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Self-Reflection & Values
        </h2>
        <p className="text-slate-500">
          Know yourself to grow yourself.
        </p>
      </div>

      {/* Self-Reflection Card */}
      <div className="mb-12 rounded-2xl border border-slate-200 bg-slate-50 p-8">
        <h3 className="mb-8 border-b border-slate-200 pb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
          Self-Reflection
        </h3>
        <div className="space-y-2">
          <WorkbookTextarea
            label="What do you appreciate most about yourself?"
            placeholder="Your strengths, qualities, unique traits..."
            rows={3}
          />
          <WorkbookTextarea
            label="What parts of yourself do you want to work on?"
            placeholder="Areas for growth, habits to change, skills to develop..."
            rows={3}
          />
          <WorkbookTextarea
            label="How do you handle stress and adversity?"
            placeholder="Your coping mechanisms, what works, what doesn't..."
            rows={3}
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-2">
        <WorkbookTextarea
          label="What are your core values?"
          placeholder="Integrity, Family, Excellence, Growth, Service..."
          rows={3}
        />
        <WorkbookTextarea
          label="Are there any values you want to shift focus to in 2026?"
          placeholder="I want to focus more on... I want to prioritize..."
          rows={3}
        />
      </div>
    </div>
  );
}
