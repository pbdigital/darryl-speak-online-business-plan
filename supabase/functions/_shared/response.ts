import { corsHeaders } from './cors.ts';

/**
 * Standard API response envelope
 * All Edge Functions return responses in this format
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
  meta: { timestamp: string };
}

/**
 * Create a successful JSON response
 */
export function success<T>(data: T, status = 200): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    meta: { timestamp: new Date().toISOString() },
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

/**
 * Create an error JSON response
 */
export function error(
  errors: Array<{ field?: string; message: string }>,
  status = 400
): Response {
  const body: ApiResponse = {
    success: false,
    errors,
    meta: { timestamp: new Date().toISOString() },
  };

  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

/**
 * Create an unauthorized error response
 */
export function unauthorized(message = 'Unauthorized'): Response {
  return error([{ message }], 401);
}

/**
 * Create a not found error response
 */
export function notFound(message = 'Not found'): Response {
  return error([{ message }], 404);
}

/**
 * Create a method not allowed error response
 */
export function methodNotAllowed(): Response {
  return error([{ message: 'Method not allowed' }], 405);
}

/**
 * Create a conflict error response (e.g., duplicate entry)
 */
export function conflict(message: string, field?: string): Response {
  return error([{ field, message }], 409);
}

/**
 * Create a server error response
 */
export function serverError(message = 'Internal server error'): Response {
  return error([{ message }], 500);
}
