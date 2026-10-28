/**
 * Admin Users API client
 * Locks and unlocks a user's plan via the admin-users Edge Function
 */
import { apiRequest, ApiResponse } from './client';

interface SetPlanLockResponse {
  userId: string;
  locked: boolean;
}

export async function setUserPlanLock(
  userId: string,
  locked: boolean
): Promise<ApiResponse<SetPlanLockResponse>> {
  return apiRequest<SetPlanLockResponse>('/admin-users', {
    method: 'POST',
    body: JSON.stringify({ userId, action: locked ? 'lock' : 'unlock' }),
  });
}
