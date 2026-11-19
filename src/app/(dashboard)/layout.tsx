import { BusinessPlanProvider } from '@/providers/business-plan-provider';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { freeAccessStart } from '@/lib/free-access-server';
import { FreeAccessCountdown, PlanLockGate } from '@/components/plan-lock';

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
  let lastName: string | null = null;
  let freeSignedUpAt: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('locked_at, first_name, last_name, account_type, created_at')
      .eq('id', user.id)
      .maybeSingle();
    locked = !!profile?.locked_at;
    firstName = profile?.first_name ?? null;
    lastName = profile?.last_name ?? null;
    if (profile?.account_type === 'free' && !locked) {
      freeSignedUpAt = await freeAccessStart(supabase, user.id, profile.created_at);
    }
  }

  return (
    <BusinessPlanProvider year={CURRENT_PLAN_YEAR}>
      <PlanLockGate
        locked={locked}
        email={user?.email ?? ''}
        firstName={firstName}
        lastName={lastName}
      >
        {children}
      </PlanLockGate>
      {user && freeSignedUpAt && (
        <FreeAccessCountdown
          userId={user.id}
          signedUpAt={freeSignedUpAt}
          person={{ email: user.email, firstName, lastName }}
        />
      )}
    </BusinessPlanProvider>
  );
}
