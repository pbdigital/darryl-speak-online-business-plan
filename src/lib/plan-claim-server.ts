import 'server-only';
import { createServiceClient } from '@/lib/keap/service-client';

export type PlanClaimPageStatus = 'ok' | 'has_plan' | 'not_member';

/**
 * Whether this user can bring a free plan over: 'ok' for a POWER AGENT
 * account with no plan data, 'has_plan' when it already has some,
 * 'not_member' otherwise. Reads as not_member if the check fails, so the
 * prompt simply doesn't show.
 */
export async function getPlanClaimStatus(userId: string): Promise<PlanClaimPageStatus> {
  try {
    const { data, error } = await createServiceClient().rpc('plan_claim_status', {
      p_member: userId,
    });
    if (error) throw error;
    return data === 'ok' || data === 'has_plan' ? data : 'not_member';
  } catch (err) {
    console.error('[claim-plan] Status check failed:', err instanceof Error ? err.message : err);
    return 'not_member';
  }
}
