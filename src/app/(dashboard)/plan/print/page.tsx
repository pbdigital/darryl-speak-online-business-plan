import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { PrintablePlan } from '@/components/business-plan/print/printable-plan';

export const metadata: Metadata = {
  title: `My ${CURRENT_PLAN_YEAR} Business Plan`,
};

export default async function PrintPlanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.email || '';

  return <PrintablePlan year={CURRENT_PLAN_YEAR} userName={displayName} />;
}
