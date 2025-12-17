"use client";

import { Compass, User } from "lucide-react";
import { WorkbookTextarea, StepContainer, StepHeader, UpNextFooter } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepSelfReflection() {
  return (
    <StepContainer>
      <StepHeader
        part="Part 1D"
        title="Self-Reflection & Values"
        highlightWord="Values"
        subtitle="Know yourself to grow yourself. Understanding your fulfillment and values helps you make aligned decisions."
        icon={Compass}
      />

      <DarrylTip
        tip="Your values are your compass in tough decisions. When you know what matters most, saying 'no' to the wrong opportunities becomes easy—and saying 'yes' to the right ones becomes powerful."
        className="mb-10"
      />

      {/* Self-Reflection Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <User className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Self-Reflection</h2>
            <p className="text-sm text-slate-500">Understand your fulfillment</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={1}
            label="What aspects of your life do you feel most fulfilled in, and why?"
            fieldName="mostFulfilled"
            placeholder="I feel most fulfilled in my client relationships. Helping families find their perfect home gives me real purpose..."
          />
          <WorkbookTextarea
            number={2}
            label="What aspects of your life do you feel the least satisfied with, and why?"
            fieldName="leastSatisfied"
            placeholder="My work-life balance needs attention. I've been missing family dinners and my health has suffered..."
          />
          <WorkbookTextarea
            number={3}
            label="How would you describe your overall well-being? Emotionally, mentally, and physically?"
            fieldName="overallWellbeing"
            placeholder="Emotionally I'm good - I love my work. Mentally I'm a bit burned out. Physically I need to get back to the gym..."
          />
        </div>
      </section>

      {/* Values and Priorities Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Compass className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Values and Priorities</h2>
            <p className="text-sm text-slate-500">Define what matters most</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={4}
            label="What are your core values, and how did you align with them in the past year?"
            fieldName="coreValuesAlignment"
            placeholder="My core values are integrity and family. This year I aligned with them by always being honest with clients, even when it cost me a deal..."
          />
          <WorkbookTextarea
            number={5}
            label="Are there any values or priorities you want to shift or focus on in the coming year?"
            fieldName="valuePrioritiesShift"
            placeholder="I want to prioritize my health more. I've been neglecting exercise and it's affecting my energy levels..."
          />
        </div>
      </section>

      <UpNextFooter text="Goals and obstacles" />
    </StepContainer>
  );
}
