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
import type { FreePlanFunnel, FreePlanReport, FreePlanUser } from '@/types/admin';

const STAGES: { key: keyof FreePlanFunnel; label: string }[] = [
  { key: 'signed_up', label: 'Signed up' },
  { key: 'started', label: 'Started a section' },
  { key: 'finished_section_3', label: 'Finished Section 3' },
  { key: 'finished_plan', label: 'Finished the plan' },
  { key: 'printed', label: 'Printed' },
  { key: 'locked', label: 'Locked' },
  { key: 'became_member', label: 'Became POWER AGENT®' },
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

function csvCell(value: string | number): string {
  const text = String(value);
  // Quote everything; a leading = + - @ is prefixed so spreadsheets don't run it.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

function downloadCsv(users: FreePlanUser[]) {
  const header = ['Email', 'Name', 'Signed up', 'Sections done', 'Printed', 'Locked', 'Joined', 'Last active'];
  const rows = users.map((user) => [
    user.email ?? '',
    fullName(user),
    user.signed_up_at.slice(0, 10),
    user.sections_done,
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
                <TableHead>Sections Done</TableHead>
                <TableHead>Printed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No free plan sign-ups yet
                  </TableCell>
                </TableRow>
              ) : (
                report.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>{fullName(user) || '-'}</TableCell>
                    <TableCell>{formatDate(user.signed_up_at)}</TableCell>
                    <TableCell>{user.sections_done} of 5</TableCell>
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
