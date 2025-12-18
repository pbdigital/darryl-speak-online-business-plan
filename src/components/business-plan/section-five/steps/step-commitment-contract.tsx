"use client";

import { FileSignature } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumInput,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";
import { SignatureField } from "../ui/signature-field";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepCommitmentContract() {
  const commitmentContract = useSectionFiveStore(
    (state) => state.data.commitmentContract
  );
  const updateCommitmentField = useSectionFiveStore(
    (state) => state.updateCommitmentField
  );

  return (
    <StepContainer>
      <StepHeader
        part="Part 5G"
        title="Commitment Contract"
        highlightWord="Commitment"
        subtitle="This is where strategy becomes commitment. By signing with an accountability partner, you're making a promise—not just to yourself."
        icon={FileSignature}
      />

      <DarrylTip
        tip="Choose an accountability partner who won't let you off the hook. This isn't about having a cheerleader—it's about having someone who will ask the hard questions and keep you honest when the year gets tough."
        className="mb-8"
      />

      {/* Contract Card */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-[#1a2744] bg-white shadow-xl">
        {/* Contract Header */}
        <div className="bg-[#1a2744] p-6 text-center text-white">
          <FileSignature className="mx-auto mb-3 h-10 w-10" />
          <h3 className="text-xl font-bold">{CURRENT_PLAN_YEAR} Commitment Contract</h3>
          <p className="text-sm text-slate-300">
            A binding agreement between you and your accountability partner
          </p>
        </div>

        {/* Contract Body */}
        <div className="p-6 md:p-8">
          {/* Contract Statement */}
          <div className="mb-8 text-center">
            <p className="text-lg leading-relaxed text-slate-700">
              I, <span className="mx-2 border-b-2 border-slate-300 px-4 font-bold text-[#1a2744]">{commitmentContract.agentName || "_____________"}</span>,
              commit to closing{" "}
              <span className="mx-2 border-b-2 border-slate-300 px-4 font-bold text-[#1a2744]">
                {commitmentContract.transactionGoal !== null ? commitmentContract.transactionGoal : "____"}
              </span>{" "}
              transactions in {CURRENT_PLAN_YEAR}.
            </p>
          </div>

          {/* Form Fields */}
          <div className="mb-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <PremiumInput
                label="Your Name"
                placeholder="Enter your full name"
                value={commitmentContract.agentName}
                onChange={(val) => updateCommitmentField("agentName", String(val || ""))}
              />
              <PremiumInput
                label="Transaction Goal"
                placeholder="e.g., 24"
                type="number"
                value={commitmentContract.transactionGoal !== null ? String(commitmentContract.transactionGoal) : ""}
                onChange={(val) => {
                  const numVal = val ? Number(val) : null;
                  updateCommitmentField("transactionGoal", numVal);
                }}
              />
            </div>

            <PremiumInput
              label="Accountability Partner"
              placeholder="Enter your accountability partner's name"
              value={commitmentContract.accountabilityPartnerName}
              onChange={(val) =>
                updateCommitmentField("accountabilityPartnerName", String(val || ""))
              }
            />

            <PremiumTextarea
              label="If I Obtain My Goal, I Will Reward Myself With:"
              placeholder="Describe the reward you'll give yourself for achieving your goal..."
              value={commitmentContract.rewardIfAchieved}
              onChange={(val) =>
                updateCommitmentField("rewardIfAchieved", val)
              }
              minHeight={80}
              maxHeight={200}
            />

            <PremiumTextarea
              label="If I Fail to Obtain My Goal, I Will Be Subject To:"
              placeholder="Describe the consequence if you don't achieve your goal..."
              value={commitmentContract.consequenceIfFailed}
              onChange={(val) =>
                updateCommitmentField("consequenceIfFailed", val)
              }
              minHeight={80}
              maxHeight={200}
            />
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Signatures
            </h4>
            <SignatureField
              label="Agent Signature"
              signatureValue={commitmentContract.agentName}
              dateValue={commitmentContract.agentSignatureDate}
              onSignatureChange={(val) => updateCommitmentField("agentName", val)}
              onDateChange={(val) => updateCommitmentField("agentSignatureDate", val)}
            />
            <SignatureField
              label="Accountability Partner Signature"
              signatureValue={commitmentContract.accountabilityPartnerName}
              dateValue={commitmentContract.partnerSignatureDate}
              onSignatureChange={(val) =>
                updateCommitmentField("accountabilityPartnerName", val)
              }
              onDateChange={(val) => updateCommitmentField("partnerSignatureDate", val)}
            />
          </div>
        </div>
      </div>

      <UpNextFooter text="Review your accountability system" />
    </StepContainer>
  );
}
