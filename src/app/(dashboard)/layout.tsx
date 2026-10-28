import { BusinessPlanProvider } from '@/providers/business-plan-provider';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { PlanLockGate } from '@/components/plan-lock';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let locked = false;
  let firstName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('locked_at, first_name')
      .eq('id', user.id)
      .maybeSingle();
    locked = !!profile?.locked_at;
    firstName = profile?.first_name ?? null;
  }

  return (
    <BusinessPlanProvider year={CURRENT_PLAN_YEAR}>
      <PlanLockGate locked={locked} email={user?.email ?? ''} firstName={firstName}>
        {children}
      </PlanLockGate>
    </BusinessPlanProvider>
  );
}
