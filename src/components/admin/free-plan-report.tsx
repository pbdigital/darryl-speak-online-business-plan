'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { COUNTDOWN_DAYS, freeDaysLeft } from '@/lib/free-access';
import type {
  FreePlanFunnel,
  FreePlanReport,
  FreePlanSectionKey,
  FreePlanUser,
} from '@/types/admin';

const STAGES: { key: keyof FreePlanFunnel; label: string }[] = [
  { key: 'signed_up', label: 'Signed up' },
  { key: 'started', label: 'Started a section' },
  { key: 'finished_section_3', label: 'Finished Section 3' },
  { key: 'finished_plan', label: 'Finished the plan' },
  { key: 'printed', label: 'Printed' },
  { key: 'locked', label: 'Locked' },
  { key: 'became_member', label: 'Became POWER AGENT®' },
];

const SECTIONS: { key: FreePlanSectionKey; label: string }[] = [
  { key: 'reflection', label: '1. Reflection' },
  { key: 'swot', label: '2. SWOT' },
  { key: 'income-planning', label: '3. Income planning' },
  { key: 'mindset', label: '4. Mindset' },
  { key: 'accountability', label: '5. Accountability' },
];

const PERIODS = [
  { key: 'all', label: 'All time' },
  { key: 'last_30_days', label: 'Last 30 days' },
  { key: 'last_7_days', label: 'Last 7 days' },
] as const;

type PeriodKey = (typeof PERIODS)[number]['key'];

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '-';

const fullName = (user: FreePlanUser) =>
  `${user.first_name || ''} ${user.last_name || ''}`.trim();

/** Days of free access left, or null when it no longer applies. */
function daysLeft(user: FreePlanUser, now: Date): number | null {
  if (user.joined || user.locked) return null;
  return freeDaysLeft(user.signed_up_at, now);
}

function daysLeftLabel(user: FreePlanUser, now: Date): string {
  if (user.joined) return '-';
  if (user.locked) return 'Ended';
  const left = daysLeft(user, now) ?? 0;
  if (left === 0) return 'Ended';
  return left === 1 ? 'Last day' : `${left} days`;
}

function csvCell(value: string | number): string {
  const text = String(value);
  // Quote everything; a leading = + - @ is prefixed so spreadsheets don't run it.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

function SectionDots({ sections }: { sections: FreePlanSectionKey[] }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {SECTIONS.map((section, index) => (
        <span
          key={section.key}
          title={section.label}
          className={
            sections.includes(section.key)
              ? 'flex h-5 w-5 items-center justify-center rounded-full bg-[#28afb0] text-[10px] font-semibold text-white'
              : 'flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-400'
          }
        >
          {index + 1}
        </span>
      ))}
    </div>
  );
}

function downloadCsv(users: FreePlanUser[]) {
  const now = new Date();
  const header = [
    'Email',
    'Name',
    'Signed up',
    'Free days left',
    'Sections done',
    ...SECTIONS.map((section) => `Section ${section.label}`),
    'Printed',
    'Locked',
    'Joined',
    'Last active',
  ];
  const rows = users.map((user) => [
    user.email ?? '',
    fullName(user),
    user.signed_up_at.slice(0, 10),
    daysLeftLabel(user, now),
    user.sections_done,
    ...SECTIONS.map((section) =>
      user.sections ? (user.sections.includes(section.key) ? 'Yes' : 'No') : ''
    ),
    user.printed ? 'Yes' : 'No',
    user.locked ? 'Yes' : 'No',
    user.joined ? 'Yes' : 'No',
    user.last_sign_in_at?.slice(0, 10) ?? '',
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `free-plan-users-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function FreePlanReportView({ report }: { report: FreePlanReport }) {
  const [period, setPeriod] = useState<PeriodKey>('all');
  const funnel = report.funnel[period];
  const sectionCounts = report.section_counts?.[period];
  // Fixed for this render so every row and the CSV agree.
  const [now] = useState(() => new Date());
  const inLastWeek = report.users.filter((user) => {
    const left = daysLeft(user, now);
    return left !== null && left >= 1 && left <= COUNTDOWN_DAYS;
  }).length;
  const stillFree = report.users.filter((user) => (daysLeft(user, now) ?? 0) > 0).length;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {PERIODS.map((p) => (
            <Button
              key={p.key}
              size="sm"
              variant={period === p.key ? 'default' : 'outline'}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Counts are for agents who signed up in the period, and show how far they have got since.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {STAGES.map((stage) => (
            <div key={stage.key} className="rounded-lg border bg-white p-4">
              <p className="text-sm text-gray-600">{stage.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{funnel[stage.key]}</p>
              {stage.key !== 'signed_up' && funnel.signed_up > 0 && (
                <p className="text-xs text-gray-500">
                  {Math.round((funnel[stage.key] / funnel.signed_up) * 100)}% of sign-ups
                </p>
              )}
            </div>
          ))}
        </div>

        {sectionCounts && (
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm font-medium text-gray-900">Sections finished</p>
            <p className="text-xs text-gray-500">
              How many finished each section, so you can see where people stop.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {SECTIONS.map((section) => (
                <div key={section.key}>
                  <p className="text-sm text-gray-600">{section.label}</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {sectionCounts[section.key]}
                  </p>
                  {funnel.signed_up > 0 && (
                    <p className="text-xs text-gray-500">
                      {Math.round((sectionCounts[section.key] / funnel.signed_up) * 100)}% of
                      sign-ups
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">Still in their free 30 days</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stillFree}</p>
          <p className="text-xs text-gray-500">Right now, whenever they signed up</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <p className="text-sm text-gray-600">In their last {COUNTDOWN_DAYS} days</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{inLastWeek}</p>
          <p className="text-xs text-gray-500">These agents see the daily countdown pop-up</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{report.users.length} free plan users</p>
          <Button
            variant="outline"
            onClick={() => downloadCsv(report.users)}
            disabled={report.users.length === 0}
          >
            Export CSV
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Signed Up</TableHead>
                <TableHead>Free Days Left</TableHead>
                <TableHead>Sections Done</TableHead>
                <TableHead>Printed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No free plan sign-ups yet
                  </TableCell>
                </TableRow>
              ) : (
                report.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>{fullName(user) || '-'}</TableCell>
                    <TableCell>{formatDate(user.signed_up_at)}</TableCell>
                    <TableCell>{daysLeftLabel(user, now)}</TableCell>
                    <TableCell>
                      {user.sections ? (
                        <div className="flex items-center gap-2">
                          <SectionDots sections={user.sections} />
                          <span className="sr-only">{user.sections_done} of 5</span>
                        </div>
                      ) : (
                        `${user.sections_done} of 5`
                      )}
                    </TableCell>
                    <TableCell>{user.printed ? 'Yes' : '-'}</TableCell>
                    <TableCell>
                      {user.joined ? (
                        <Badge className="bg-green-100 text-green-800">Joined</Badge>
                      ) : user.locked ? (
                        <Badge className="bg-amber-100 text-amber-800">Locked</Badge>
                      ) : (
                        <Badge variant="outline">Free</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
