"use client";

import { UserCircle } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumInput,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";
import type { IdealClientProfile } from "@/types/business-plan";

export function StepIdealClient() {
  const idealClients = useSectionFiveStore((state) => state.data.idealClients);
  const updateIdealClientField = useSectionFiveStore((state) => state.updateIdealClientField);

  return (
    <StepContainer>
      <StepHeader
        part="Part 5C"
        title="Defining Your Ideal Client"
        highlightWord="Ideal Client"
        subtitle="By defining who you serve best, you can focus your marketing, tailor your messaging, and attract people who value what you offer."
        icon={UserCircle}
      />

      <DarrylTip
        tip="Give your ideal clients real names—it makes them feel like actual people, not abstract concepts. When you write marketing content, you'll be speaking directly to 'Sarah' or 'Mike,' not 'first-time homebuyers.'"
        className="mb-8"
      />

      {/* Ideal Client Profiles */}
      <div className="space-y-10">
        {idealClients.map((client, index) => (
          <div
            key={`client-${index}`}
            className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm"
          >
            {/* Profile Header */}
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a2744] text-lg font-bold text-white">
                {index + 1}
              </span>
              <h4 className="text-lg font-bold text-slate-900">
                Ideal Client Profile {index + 1}
              </h4>
            </div>

            <div className="space-y-5">
              <PremiumInput
                label="Name Your Ideal Client"
                placeholder="e.g., 'Sarah the First-Time Buyer' or 'Mike the Downsizer'"
                value={client.name}
                onChange={(val) =>
                  updateIdealClientField(index, "name", String(val || ""))
                }
              />

              <PremiumTextarea
                label="Who Are They?"
                placeholder="Describe their demographics, lifestyle, family situation, income level, career..."
                value={client.whoAreThey}
                onChange={(val) =>
                  updateIdealClientField(index, "whoAreThey", val)
                }
                minHeight={80}
                maxHeight={200}
              />

              <PremiumTextarea
                label="What Motivates Them?"
                placeholder="What are their desires, pain points, fears, and goals? Why are they buying/selling?"
                value={client.whatMotivatesThem}
                onChange={(val) =>
                  updateIdealClientField(index, "whatMotivatesThem" as keyof IdealClientProfile, val)
                }
                minHeight={80}
                maxHeight={200}
              />

              <PremiumTextarea
                label="Where Are They?"
                placeholder="Where do they spend time? Online platforms, local hangouts, community groups, media they consume..."
                value={client.whereAreThey}
                onChange={(val) =>
                  updateIdealClientField(index, "whereAreThey", val)
                }
                minHeight={80}
                maxHeight={200}
              />

              <PremiumTextarea
                label="How Can I Get in Front of Them?"
                placeholder="What channels, tactics, or strategies would help you reach and connect with this person?"
                value={client.howToReachThem}
                onChange={(val) =>
                  updateIdealClientField(index, "howToReachThem", val)
                }
                minHeight={80}
                maxHeight={200}
              />
            </div>
          </div>
        ))}
      </div>

      <UpNextFooter text="Plan your prospecting mix" />
    </StepContainer>
  );
}
