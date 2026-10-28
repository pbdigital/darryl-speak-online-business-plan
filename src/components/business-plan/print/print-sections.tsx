import type { SectionOneData } from "@/stores/section-one-store";
import type { SectionTwoData } from "@/stores/section-two-store";
import type {
  AccountabilitySection,
  CalculatedMetrics,
  IncomePlanningSection,
  MindsetSection,
} from "@/types/business-plan";
import {
  Answer,
  AnswerList,
  BlankLines,
  EntryCard,
  Group,
  PlanSection,
  Row,
  SignatureLine,
  Stat,
  formatCurrency,
  formatNumber,
  hasText,
} from "./print-parts";

/* Section 1: Annual Reflection & Intention Setting */

export function ReflectionPrint({ data }: { data: SectionOneData }) {
  const goals = (data.goals ?? []).filter((goal) => hasText(goal.title));

  return (
    <PlanSection number={1} title="Annual Reflection" subtitle="& Intention Setting">
      <Group title="The past 12 months in numbers">
        <div className="grid grid-cols-5 gap-3">
          <Stat label="Listings taken" value={formatNumber(data.listingsTaken)} />
          <Stat label="Seller sides" value={formatNumber(data.sellerSidesClosed)} />
          <Stat label="Buyer sides" value={formatNumber(data.buyerSidesClosed)} />
          <Stat label="Rentals" value={formatNumber(data.renterTransactions)} />
          <Stat label="Gross commissions" value={formatCurrency(data.grossClosedCommissions)} />
        </div>
      </Group>

      <Group title="Looking at the past 12 months">
        <Answer label="Did you achieve your goals over the past 12 months? Why or why not?" value={data.didAchieveGoals} />
        <Answer label="What were your biggest struggles?" value={data.biggestStruggles} />
        <Answer label="What was your biggest accomplishment?" value={data.biggestAccomplishment} />
        <Answer label="How did you prospect over the past 12 months?" value={data.prospectingMethods} />
        <Answer label="What went well that you want to continue?" value={data.wantToContinue} />
      </Group>

      <Group title="Looking back">
        <Answer label="What were your most significant achievements and milestones in the past year?" value={data.significantAchievements} />
        <Answer label="What challenges did you face, and how did you overcome them?" value={data.challengesAndOvercoming} />
        <Answer label="What did you learn about yourself in the past year?" value={data.learnedAboutSelf} />
      </Group>

      <Group title="Gratitude">
        <Answer label="What are you most grateful for from the past 12 months?" value={data.gratefulFor} />
        <Answer label="Who are the people you are most grateful for, and why?" value={data.gratefulPeople} />
        <Answer label="What moments or experiences brought you the most joy?" value={data.joyfulMoments} />
      </Group>

      <Group title="Self-reflection & values">
        <Answer label="What aspects of your life do you feel most fulfilled in, and why?" value={data.mostFulfilled} />
        <Answer label="What aspects of your life do you feel the least satisfied with, and why?" value={data.leastSatisfied} />
        <Answer label="How would you describe your overall well-being? Emotionally, mentally, and physically?" value={data.overallWellbeing} />
        <Answer label="What are your core values, and how did you align with them over the past 12 months?" value={data.coreValuesAlignment} />
        <Answer label="Are there any values or priorities you want to shift or focus on in the next 12 months?" value={data.valuePrioritiesShift} />
      </Group>

      <Group title="Goals & intentions">
        {goals.length > 0 ? (
          goals.map((goal, i) => (
            <EntryCard key={goal.id || i} title={`Goal ${i + 1}: ${goal.title}`}>
              <Answer label="Why is this goal important to you?" value={goal.whyImportant} />
              <Answer label="How do you plan to achieve this?" value={goal.howToAchieve} />
              <AnswerList label="Immediate steps" items={goal.immediateSteps ?? []} />
              <Answer label="What obstacles might get in your way?" value={goal.obstacles} />
              <Answer label="What strategies will you use to overcome them?" value={goal.strategies} />
            </EntryCard>
          ))
        ) : (
          <BlankLines count={4} />
        )}
      </Group>

      <Group title="Self-care & growth">
        <Answer label="What self-care practices or habits do you want to prioritize in the next 12 months?" value={data.selfCarePriorities} />
        <Answer label="How will you nurture your mental, emotional, and physical well-being?" value={data.nurturingWellbeing} />
        <Answer label="What are some methods that contribute to your self-care that you enjoy?" value={data.selfCareMethods} />
        <Answer label="What skills or knowledge do you want to acquire or improve upon in the next 12 months?" value={data.skillsToImprove} />
        <Answer label="How will you commit to continuous learning and personal growth?" value={data.learningCommitment} />
        <Answer label="In what ways do you want to give back or contribute to your community or causes you care about?" value={data.giveBackCommunity} />
        <Answer label="How can you make a positive impact on others?" value={data.positiveImpact} />
      </Group>

      <Group title="Mantra & accountability">
        <div className="break-inside-avoid rounded-xl border-2 border-[#1a2744] px-6 py-5 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">My word for the year</p>
          <p className="mt-1 font-serif text-3xl font-bold uppercase tracking-wide text-[#1a2744]">
            {hasText(data.mantra) ? data.mantra : " "}
          </p>
        </div>
        <Answer label="How will you hold yourself accountable for your goals and intentions?" value={data.accountabilityMethod} />
        <Answer label="Is there a person or people that you can partner with to stay accountable?" value={data.accountabilityPartner} />
        <Answer label="What tools or methods will you use to track your progress throughout the year?" value={data.progressTrackingTools} />
      </Group>

      <Group title="Celebration & reflection">
        <Answer label="What milestones or achievements will you celebrate along the way?" value={data.celebrationMilestones} />
        <Answer label="How often will you pause to reflect on your progress and adjust your goals if needed?" value={data.reflectionFrequency} />
        <Answer label="What else would you like to reflect on, improve upon, stop, start or continue this coming year?" value={data.improvementsAndChanges} />
        <Answer label="What is really important to you right now and moving into the new year?" value={data.coreImportance} />
      </Group>

      <Group title="My commitment">
        <Answer label="How will you celebrate milestones along the way?" value={data.celebrationMethod} />
        <Answer label="What words of encouragement would you give to your future self?" value={data.encouragementMessage} />
        <SignatureLine label="Signature" name={data.signature} date={data.completionDate} />
      </Group>
    </PlanSection>
  );
}

/* Section 2: SWOT Analysis */

const WEAKNESS_ACTIONS = { accept: "Accept", delegate: "Delegate", improve: "Improve" } as const;

function SwotQuadrant({
  letter,
  title,
  entries,
}: {
  letter: string;
  title: string;
  entries: { main: string; detail: string; detailLabel: string }[];
}) {
  return (
    <div className="break-inside-avoid rounded-xl border border-slate-200 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a2744] font-serif text-lg font-bold text-white">
          {letter}
        </span>
        <h3 className="font-serif text-lg font-bold text-[#1a2744]">{title}</h3>
      </div>
      {entries.length > 0 ? (
        <ol className="space-y-3">
          {entries.map((entry, i) => (
            <li key={i} className="text-[14px] leading-snug">
              <p className="font-semibold text-slate-900">
                {i + 1}. {entry.main}
              </p>
              {hasText(entry.detail) && (
                <p className="mt-0.5 pl-4 text-slate-600">
                  <span className="font-semibold">{entry.detailLabel}:</span> {entry.detail}
                </p>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <BlankLines count={4} />
      )}
    </div>
  );
}

export function SwotPrint({ data }: { data: SectionTwoData }) {
  return (
    <PlanSection number={2} title="SWOT" subtitle="Analysis">
      <div className="grid grid-cols-2 gap-4">
        <SwotQuadrant
          letter="S"
          title="Strengths"
          entries={(data.strengths ?? [])
            .filter((s) => hasText(s.strength))
            .map((s) => ({ main: s.strength, detail: s.useCase, detailLabel: "Put it to use" }))}
        />
        <SwotQuadrant
          letter="W"
          title="Weaknesses"
          entries={(data.weaknesses ?? [])
            .filter((w) => hasText(w.weakness))
            .map((w) => ({
              main: w.weakness,
              detail: w.action ? WEAKNESS_ACTIONS[w.action] : "",
              detailLabel: "Plan",
            }))}
        />
        <SwotQuadrant
          letter="O"
          title="Opportunities"
          entries={(data.opportunities ?? [])
            .filter((o) => hasText(o.possibility))
            .map((o) => ({ main: o.possibility, detail: o.actionSteps, detailLabel: "Action steps" }))}
        />
        <SwotQuadrant
          letter="T"
          title="Threats"
          entries={(data.threats ?? [])
            .filter((t) => hasText(t.threat))
            .map((t) => ({ main: t.threat, detail: t.actionSteps, detailLabel: "Action steps" }))}
        />
      </div>
    </PlanSection>
  );
}

/* Section 3: Vision, Goals & Income Planning */

const MANIFEST_CATEGORIES = [
  { key: "familyGoals", label: "Family" },
  { key: "financialGoals", label: "Financial" },
  { key: "personalGoals", label: "Personal" },
  { key: "businessGoals", label: "Business" },
] as const;

export function IncomePlanningPrint({
  data,
  calculated,
}: {
  data: IncomePlanningSection;
  calculated: CalculatedMetrics;
}) {
  const hasCap = (data.brokerCapAmount ?? 0) > 0;
  const gciGoal = hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded;
  const personal = data.personalExpenses.filter((e) => e.amount !== null);
  const business = data.businessExpenses.filter((e) => e.amount !== null);
  const percent = (value: number | null) => (value === null ? "" : `${formatNumber(value)}%`);

  return (
    <PlanSection number={3} title="Vision, Goals" subtitle="& Income Planning">
      <Group title="My numbers for the year">
        <div className="grid grid-cols-2 gap-3">
          <Stat emphasis label="Gross commission income needed" value={formatCurrency(gciGoal)} />
          <Stat emphasis label="Transactions to close" value={formatNumber(calculated.totalTransactionsNeeded)} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Reach-outs a day" value={calculated.dailyReachOuts.toFixed(1)} />
          <Stat label="Conversations a day" value={calculated.dailyConversations.toFixed(1)} />
          <Stat label="Appointments a day" value={calculated.dailyAppointments.toFixed(2)} />
        </div>
      </Group>

      <div className="grid grid-cols-2 gap-8">
        <Group title="Monthly personal expenses">
          <div>
            {personal.length > 0 ? (
              personal.map((e, i) => <Row key={i} label={e.name} value={formatCurrency(e.amount)} />)
            ) : (
              <BlankLines count={3} />
            )}
            <Row strong label="Monthly total" value={formatCurrency(calculated.monthlyPersonalTotal)} />
          </div>
        </Group>
        <Group title="Monthly business expenses">
          <div>
            {business.length > 0 ? (
              business.map((e, i) => <Row key={i} label={e.name} value={formatCurrency(e.amount)} />)
            ) : (
              <BlankLines count={3} />
            )}
            <Row strong label="Monthly total" value={formatCurrency(calculated.monthlyBusinessTotal)} />
          </div>
        </Group>
      </div>

      <Group title="My manifest list">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {MANIFEST_CATEGORIES.map(({ key, label }) => {
            const goals = data[key].filter((g) => hasText(g.name) || g.amount !== null);
            return (
              <div key={key} className="break-inside-avoid">
                <p className="mb-1 text-[13px] font-semibold text-slate-600">{label}</p>
                {goals.length > 0 ? (
                  goals.map((g, i) => <Row key={i} label={g.name || "—"} value={formatCurrency(g.amount)} />)
                ) : (
                  <BlankLines count={2} />
                )}
              </div>
            );
          })}
        </div>
        <Row strong label="Manifest list total" value={formatCurrency(calculated.manifestGoalsTotal)} />
      </Group>

      <div className="grid grid-cols-2 gap-8">
        <Group title="From take-home to commission">
          <div className="break-inside-avoid">
            <Row label="Annual expenses" value={formatCurrency(calculated.annualExpenses)} />
            <Row label="Manifest list" value={formatCurrency(calculated.manifestGoalsTotal)} />
            <Row strong label="Take-home income needed" value={formatCurrency(calculated.targetTakeHomeIncome)} />
            <Row label="Estimated tax rate" value={percent(data.estimatedTaxRate)} />
            <Row strong label="Income needed before tax" value={formatCurrency(calculated.annualTaxableIncomeNeeded)} />
            <Row label="Broker split" value={percent(data.brokerSplitPercentage)} />
            {hasCap && <Row label="Broker cap" value={formatCurrency(data.brokerCapAmount)} />}
            <Row strong label="Gross commission income needed" value={formatCurrency(gciGoal)} />
          </div>
        </Group>
        <Group title="From commission to daily activity">
          <div className="break-inside-avoid">
            <Row label="Average sales price" value={formatCurrency(data.averageSalesPrice)} />
            <Row
              label="Average commission rate"
              value={data.averageCommissionRate === null ? "" : `${formatNumber(data.averageCommissionRate * 100)}%`}
            />
            <Row label="Average commission per sale" value={formatCurrency(calculated.averageCommissionPerTransaction)} />
            <Row strong label="Transactions needed" value={formatNumber(calculated.totalTransactionsNeeded)} />
            <Row label="Appointments needed" value={formatNumber(calculated.appointmentsNeeded)} />
            <Row label="Conversations needed" value={formatNumber(calculated.conversationsNeeded)} />
            <Row label="Reach-outs needed" value={formatNumber(calculated.reachOutsNeeded)} />
            <Row
              label="Working days"
              value={`${formatNumber(calculated.workingDays)} (${formatNumber(data.workDaysPerWeek)} days a week, ${formatNumber(data.weeksOff ?? 0)} weeks off)`}
            />
          </div>
        </Group>
      </div>

      <Group title="My income commitment">
        <Answer label="Reaching this goal means..." value={data.reachingGoalMeans} lines={3} />
        <Answer label="Failing to reach this goal means..." value={data.failingGoalMeans} lines={3} />
      </Group>
    </PlanSection>
  );
}

/* Section 4: Mindset, Self-Care & Motivation */

export function MindsetPrint({ data }: { data: MindsetSection }) {
  return (
    <PlanSection number={4} title="Mindset, Self-Care" subtitle="& Motivation">
      <Group title="Motivating affirmations">
        <AnswerList items={data.affirmations ?? []} />
      </Group>
      <Group title="Grounding rituals">
        <div className="grid grid-cols-2 gap-8">
          <Answer label="Morning routine" value={data.morningRoutine} lines={3} />
          <Answer label="Evening routine" value={data.eveningRoutine} lines={3} />
        </div>
      </Group>
      <div className="grid grid-cols-2 gap-8">
        <Group title="My boundaries">
          <AnswerList items={data.boundaries ?? []} />
        </Group>
        <Group title="Self-care commitments">
          <AnswerList items={data.selfCareCommitments ?? []} />
        </Group>
      </div>
      <Group title="Motivation triggers">
        <Answer label="What motivates me" value={data.whatMotivatesMe} lines={3} />
      </Group>
      <Group title="My support environment">
        <AnswerList items={data.supportSystem ?? []} />
      </Group>
      <Group title="Who I need to become">
        <Answer label="Who I need to become" value={data.whoINeedToBecome} lines={3} />
      </Group>
    </PlanSection>
  );
}

/* Section 5: Accountability & Progress Tracking */

export function AccountabilityPrint({ data, year }: { data: AccountabilitySection; year: number }) {
  const projects = (data.projectMatrix?.projectNames ?? [])
    .map((name, i) => ({ name, tasks: (data.projectMatrix.tasks?.[i] ?? []).filter(hasText) }))
    .filter((p) => hasText(p.name));
  const clients = (data.idealClients ?? []).filter((c) => hasText(c.name));
  const prospecting = (data.prospectingActivities ?? []).filter((a) => hasText(a.activity));
  const marketing = (data.marketingActivities ?? []).filter((a) => hasText(a.activity));
  const qm = data.quarterlyMarketing;
  const contract = data.commitmentContract;

  return (
    <PlanSection number={5} title="Accountability" subtitle="& Progress Tracking">
      <Group title="Project matrix">
        {projects.length > 0 ? (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: `repeat(${projects.length}, minmax(0, 1fr))` }}
          >
            {projects.map((project, i) => (
              <div key={i} className="break-inside-avoid rounded-xl border border-slate-200">
                <p className="rounded-t-xl bg-[#1a2744] px-3 py-2 text-[13px] font-bold text-white">
                  {project.name}
                </p>
                <ol className="space-y-1 px-3 py-2 text-[13px] text-slate-900">
                  {project.tasks.map((task, t) => (
                    <li key={t}>
                      {t + 1}. {task}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ) : (
          <BlankLines count={4} />
        )}
      </Group>

      <div className="grid grid-cols-2 gap-8">
        <Group title="Resources I have">
          <AnswerList items={data.currentResources ?? []} />
        </Group>
        <Group title="Resources I need">
          <AnswerList items={data.neededResources ?? []} />
        </Group>
      </div>

      <Group title="My ideal clients">
        {clients.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {clients.map((client, i) => (
              <EntryCard key={i} title={client.name}>
                <Answer label="Who are they?" value={client.whoAreThey} />
                <Answer label="What motivates them?" value={client.whatMotivatesThem} />
                <Answer label="Where are they?" value={client.whereAreThey} />
                <Answer label="How can I get in front of them?" value={client.howToReachThem} />
              </EntryCard>
            ))}
          </div>
        ) : (
          <BlankLines count={4} />
        )}
      </Group>

      <Group title="Prospecting mix">
        {prospecting.length > 0 ? (
          prospecting.map((a, i) => (
            <EntryCard key={i} title={a.activity}>
              <ActivityDetails activity={a} />
              <Answer label="Follow-up plan" value={a.followUpPlan} lines={1} />
            </EntryCard>
          ))
        ) : (
          <BlankLines count={4} />
        )}
      </Group>

      <Group title="Marketing mix">
        {marketing.length > 0 ? (
          marketing.map((a, i) => (
            <EntryCard key={i} title={a.activity}>
              <ActivityDetails activity={a} />
            </EntryCard>
          ))
        ) : (
          <BlankLines count={4} />
        )}
      </Group>

      <Group title="Quarterly marketing strategies">
        <div className="grid grid-cols-4 gap-3">
          {([1, 2, 3, 4] as const).map((q) => (
            <div key={q} className="break-inside-avoid rounded-xl border border-slate-200 p-3">
              <p className="mb-2 font-serif text-lg font-bold text-[#1a2744]">Q{q}</p>
              <AnswerList items={qm ? [qm[`q${q}Strategy1`], qm[`q${q}Strategy2`]] : []} />
            </div>
          ))}
        </div>
      </Group>

      <div className="break-inside-avoid rounded-2xl border-2 border-[#1a2744] p-8">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          {year} Commitment Contract
        </p>
        <p className="mx-auto mt-4 max-w-xl text-center font-serif text-xl leading-relaxed text-slate-900">
          I, <span className="font-bold text-[#1a2744] underline decoration-slate-300 underline-offset-4">{hasText(contract?.agentName) ? contract.agentName : " ".repeat(24)}</span>,
          commit to closing{" "}
          <span className="font-bold text-[#1a2744] underline decoration-slate-300 underline-offset-4">
            {contract?.transactionGoal ?? " ".repeat(6)}
          </span>{" "}
          transactions in {year}.
        </p>
        <div className="mt-6 space-y-4">
          <Answer label="If I reach my goal, I will reward myself with:" value={contract?.rewardIfAchieved} />
          <Answer label="If I don't reach my goal, I will be subject to:" value={contract?.consequenceIfFailed} />
        </div>
        <div className="mt-8 space-y-6">
          <SignatureLine label="Agent signature" name={contract?.agentName} date={contract?.agentSignatureDate} />
          <SignatureLine
            label="Accountability partner signature"
            name={contract?.accountabilityPartnerName}
            date={contract?.partnerSignatureDate}
          />
        </div>
      </div>
    </PlanSection>
  );
}

function ActivityDetails({
  activity,
}: {
  activity: { how: string; who: string; when: string; farmArea: string; cost: number | null };
}) {
  const details = [
    { label: "How", value: activity.how },
    { label: "Who", value: activity.who },
    { label: "When", value: activity.when },
    { label: "Farm area", value: activity.farmArea },
    { label: "Cost", value: formatCurrency(activity.cost) },
  ].filter((d) => hasText(d.value));

  if (details.length === 0) return null;

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14px]">
      {details.map((d) => (
        <div key={d.label} className="contents">
          <dt className="font-semibold text-slate-600">{d.label}</dt>
          <dd className="whitespace-pre-wrap text-slate-900">{d.value}</dd>
        </div>
      ))}
    </dl>
  );
}
