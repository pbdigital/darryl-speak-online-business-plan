"use client";

import { useSectionFiveStore } from "@/stores/section-five-store";
import { WorkbookInput, WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/section-three/ui/darryl-tip";
import { SignatureField } from "../ui/signature-field";
import { FileSignature } from "lucide-react";

export function StepCommitmentContract() {
  const commitmentContract = useSectionFiveStore(
    (state) => state.data.commitmentContract
  );
  const updateCommitmentField = useSectionFiveStore(
    (state) => state.updateCommitmentField
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Special styling for final step */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 5G
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Your Commitment Contract
        </h2>
        <p className="text-slate-600">
          This is where strategy becomes commitment. By signing this contract with
          an accountability partner, you&apos;re making a promise—not just to yourself,
          but to someone who will hold you to it.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="Choose an accountability partner who won't let you off the hook. This isn't about having a cheerleader—it's about having someone who will ask the hard questions and keep you honest when the year gets tough."
        className="mb-8"
      />

      {/* Contract Card */}
      <div className="mb-8 overflow-hidden rounded-2xl border-2 border-[#0F172A] bg-white shadow-xl">
        {/* Contract Header */}
        <div className="bg-[#0F172A] p-6 text-center text-white">
          <FileSignature className="mx-auto mb-3 h-10 w-10" />
          <h3 className="text-xl font-bold">2026 Commitment Contract</h3>
          <p className="text-sm text-slate-300">
            A binding agreement between you and your accountability partner
          </p>
        </div>

        {/* Contract Body */}
        <div className="p-6 md:p-8">
          {/* Contract Statement */}
          <div className="mb-8 text-center">
            <p className="text-lg leading-relaxed text-slate-700">
              I, <span className="mx-2 border-b-2 border-slate-300 px-4 font-bold text-[#0F172A]">{commitmentContract.agentName || "_____________"}</span>,
              commit to closing{" "}
              <span className="mx-2 border-b-2 border-slate-300 px-4 font-bold text-[#0F172A]">
                {commitmentContract.transactionGoal !== null ? commitmentContract.transactionGoal : "____"}
              </span>{" "}
              transactions in 2026.
            </p>
          </div>

          {/* Form Fields */}
          <div className="mb-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <WorkbookInput
                label="Your Name"
                placeholder="Enter your full name"
                value={commitmentContract.agentName}
                onChange={(val) => updateCommitmentField("agentName", String(val || ""))}
              />
              <WorkbookInput
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

            <WorkbookInput
              label="Accountability Partner"
              placeholder="Enter your accountability partner's name"
              value={commitmentContract.accountabilityPartnerName}
              onChange={(val) =>
                updateCommitmentField("accountabilityPartnerName", String(val || ""))
              }
            />

            <WorkbookTextarea
              label="If I Obtain My Goal, I Will Reward Myself With:"
              placeholder="Describe the reward you'll give yourself for achieving your goal..."
              rows={3}
              value={commitmentContract.rewardIfAchieved}
              onChange={(val) =>
                updateCommitmentField("rewardIfAchieved", String(val || ""))
              }
            />

            <WorkbookTextarea
              label="If I Fail to Obtain My Goal, I Will Be Subject To:"
              placeholder="Describe the consequence if you don't achieve your goal..."
              rows={3}
              value={commitmentContract.consequenceIfFailed}
              onChange={(val) =>
                updateCommitmentField("consequenceIfFailed", String(val || ""))
              }
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

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Final Step: Review your accountability system →
        </p>
      </div>
    </div>
  );
}
