/**
 * Admin Team API client
 * Handles admin team management operations via Edge Functions
 */
import { apiRequest, ApiResponse } from './client';
import { AdminTeamMember } from '@/types/admin';

interface GrantAdminResponse {
  granted: boolean;
  userId: string;
  userName: string;
}

interface RevokeAdminResponse {
  revoked: boolean;
  userId: string;
  userName: string;
  selfRevoked: boolean;
}

/**
 * List all admin users
 */
export async function listAdmins(): Promise<ApiResponse<AdminTeamMember[]>> {
  return apiRequest<AdminTeamMember[]>('/admin-team', {
    method: 'GET',
  });
}

/**
 * Grant admin access to a user
 */
export async function grantAdmin(
  userId: string
): Promise<ApiResponse<GrantAdminResponse>> {
  return apiRequest<GrantAdminResponse>('/admin-team', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

/**
 * Revoke admin access from a user
 */
export async function revokeAdmin(
  userId: string
): Promise<ApiResponse<RevokeAdminResponse>> {
  return apiRequest<RevokeAdminResponse>(`/admin-team?id=${userId}`, {
    method: 'DELETE',
  });
}
