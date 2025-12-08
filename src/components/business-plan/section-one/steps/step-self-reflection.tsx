"use client";

import { WorkbookTextarea } from "../ui";

export function StepSelfReflection() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 4 of 9
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Self-Reflection &amp; Values
        </h2>
        <p className="text-slate-500">
          Know yourself to grow yourself.
        </p>
      </div>

      {/* Self-Reflection Section */}
      <div className="mb-12">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Self-Reflection</h3>
        <div className="space-y-2">
          <WorkbookTextarea
            label="What aspects of your life do you feel most fulfilled in, and why?"
            placeholder="Areas where you feel satisfied and successful..."
            rows={3}
          />
          <WorkbookTextarea
            label="What aspects of your life do you feel the least satisfied with, and why?"
            placeholder="Areas that need attention or improvement..."
            rows={3}
          />
          <WorkbookTextarea
            label="How would you describe your overall well-being? Emotionally, mentally, and physically?"
            placeholder="Take an honest inventory of your current state..."
            rows={3}
          />
        </div>
      </div>

      {/* Values and Priorities Section */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Values and Priorities</h3>
        <div className="space-y-2">
          <WorkbookTextarea
            label="What are your core values, and how did you align with them in the past year?"
            placeholder="Integrity, family, excellence, growth, service..."
            rows={3}
          />
          <WorkbookTextarea
            label="Are there any values or priorities you want to shift or focus on in the coming year?"
            placeholder="What matters most to you moving forward?"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
