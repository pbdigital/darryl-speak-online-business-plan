"use client";

import { useSectionFiveStore } from "@/stores/section-five-store";
import { WorkbookInput, WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";
import type { IdealClientProfile } from "@/types/business-plan";

export function StepIdealClient() {
  const idealClients = useSectionFiveStore((state) => state.data.idealClients);
  const updateIdealClientField = useSectionFiveStore((state) => state.updateIdealClientField);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 5C
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Defining Your Ideal Client
        </h2>
        <p className="text-slate-600">
          Not all clients are created equal. By defining who you serve best, you can
          focus your marketing, tailor your messaging, and attract people who value
          what you offer. Create two distinct ideal client profiles.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="Give your ideal clients real names—it makes them feel like actual people, not abstract concepts. When you write marketing content, you'll be speaking directly to 'Sarah' or 'Mike,' not 'first-time homebuyers.'"
        className="mb-8"
      />

      {/* Ideal Client Profiles */}
      <div className="space-y-10">
        {idealClients.map((client, index) => (
          <div
            key={`client-${index}`}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {/* Profile Header */}
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F172A] text-lg font-bold text-white">
                {index + 1}
              </span>
              <h4 className="text-lg font-bold text-slate-900">
                Ideal Client Profile {index + 1}
              </h4>
            </div>

            <div className="space-y-5">
              <WorkbookInput
                label="Name Your Ideal Client"
                placeholder="e.g., 'Sarah the First-Time Buyer' or 'Mike the Downsizer'"
                value={client.name}
                onChange={(val) =>
                  updateIdealClientField(index, "name", String(val || ""))
                }
              />

              <WorkbookTextarea
                label="Who Are They?"
                placeholder="Describe their demographics, lifestyle, family situation, income level, career..."
                rows={3}
                value={client.whoAreThey}
                onChange={(val) =>
                  updateIdealClientField(index, "whoAreThey", String(val || ""))
                }
              />

              <WorkbookTextarea
                label="What Motivates Them?"
                placeholder="What are their desires, pain points, fears, and goals? Why are they buying/selling?"
                rows={3}
                value={client.whatMotivatesThem}
                onChange={(val) =>
                  updateIdealClientField(index, "whatMotivatesThem" as keyof IdealClientProfile, String(val || ""))
                }
              />

              <WorkbookTextarea
                label="Where Are They?"
                placeholder="Where do they spend time? Online platforms, local hangouts, community groups, media they consume..."
                rows={3}
                value={client.whereAreThey}
                onChange={(val) =>
                  updateIdealClientField(index, "whereAreThey", String(val || ""))
                }
              />

              <WorkbookTextarea
                label="How Can I Get in Front of Them?"
                placeholder="What channels, tactics, or strategies would help you reach and connect with this person?"
                rows={3}
                value={client.howToReachThem}
                onChange={(val) =>
                  updateIdealClientField(index, "howToReachThem", String(val || ""))
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Plan your prospecting mix →
        </p>
      </div>
    </div>
  );
}
