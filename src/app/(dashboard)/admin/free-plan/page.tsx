import { getFreePlanReport } from '@/lib/api/admin-users-server';
import { FreePlanReportView } from '@/components/admin/free-plan-report';
import type { FreePlanReport } from '@/types/admin';

export default async function AdminFreePlanPage() {
  let report: FreePlanReport | null = null;

  try {
    report = await getFreePlanReport();
  } catch (error) {
    console.error('Error fetching free plan report:', error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Free Plan</h1>
        <p className="text-gray-600 mt-1">
          Agents who signed up for the free business plan, how far they got and
          who became a POWER AGENT®
        </p>
      </div>

      {report ? (
        <FreePlanReportView report={report} />
      ) : (
        <p className="text-sm text-red-600">The free plan report could not be loaded.</p>
      )}
    </div>
  );
}
