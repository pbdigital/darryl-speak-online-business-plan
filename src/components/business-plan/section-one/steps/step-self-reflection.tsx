"use client";

import { WorkbookTextarea } from "../ui";

export function StepSelfReflection() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 1D
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Self-Reflection & Values
        </h2>
        <p className="text-slate-600">
          Know yourself to grow yourself. Understanding your fulfillment and
          values helps you make aligned decisions.
        </p>
      </div>

      {/* Self-Reflection Section */}
      <div className="mb-12">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Self-Reflection</h3>
        <div className="space-y-2">
          <WorkbookTextarea
            label="What aspects of your life do you feel most fulfilled in, and why?"
            fieldName="mostFulfilled"
            placeholder="I feel most fulfilled in my client relationships. Helping families find their perfect home gives me real purpose..."
            rows={3}
          />
          <WorkbookTextarea
            label="What aspects of your life do you feel the least satisfied with, and why?"
            fieldName="leastSatisfied"
            placeholder="My work-life balance needs attention. I've been missing family dinners and my health has suffered..."
            rows={3}
          />
          <WorkbookTextarea
            label="How would you describe your overall well-being? Emotionally, mentally, and physically?"
            fieldName="overallWellbeing"
            placeholder="Emotionally I'm good - I love my work. Mentally I'm a bit burned out. Physically I need to get back to the gym..."
            rows={3}
          />
        </div>
      </div>

      {/* Values and Priorities Section */}
      <div>
        <h3 className="mb-8 text-lg font-bold text-slate-900">Values and Priorities</h3>
        <div className="space-y-2">
          <WorkbookTextarea
            label="What are your core values, and how did you align with them in the past year?"
            fieldName="coreValuesAlignment"
            placeholder="My core values are integrity and family. This year I aligned with them by always being honest with clients, even when it cost me a deal..."
            rows={3}
          />
          <WorkbookTextarea
            label="Are there any values or priorities you want to shift or focus on in the coming year?"
            fieldName="valuePrioritiesShift"
            placeholder="I want to prioritize my health more. I've been neglecting exercise and it's affecting my energy levels..."
            rows={3}
          />
        </div>
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Goals and obstacles →
        </p>
      </div>
    </div>
  );
}
