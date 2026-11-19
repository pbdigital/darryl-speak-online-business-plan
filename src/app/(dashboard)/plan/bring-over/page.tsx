import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getPlanClaimStatus } from '@/lib/plan-claim-server';
import { HAS_PLAN_MESSAGE, NOT_MEMBER_MESSAGE } from '@/lib/plan-claim';
import { BringPlanOverForm } from '@/components/plan-claim/bring-plan-over-form';

export default async function BringOverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const status = await getPlanClaimStatus(user.id);

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#F8FAFC] px-4 py-12 sm:py-20">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {status === 'ok' ? (
          <BringPlanOverForm />
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-slate-900">Bring over your free plan</h1>
            <p className="text-base leading-relaxed text-slate-600">
              {status === 'has_plan' ? HAS_PLAN_MESSAGE : NOT_MEMBER_MESSAGE}
            </p>
          </div>
        )}
        <Link
          href="/plan"
          className="block text-center text-sm text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          Back to my plan
        </Link>
      </div>
    </div>
  );
}
