import { corsHeaders } from './cors.ts';

/**
 * Standard API response envelope
 * All Edge Functions return responses in this format
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  view: string;
  data: T | null;
  errors: Array<{ field?: string; message: string }>;
  meta: { timestamp: string };
}

/**
 * Create a successful JSON response
 */
export function success<T>(
  data: T,
  status = 200,
  view = 'unknown'
): Response {
  const body: ApiResponse<T> = {
    success: true,
    view,
    data,
    errors: [],
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
  status = 400,
  view = 'unknown'
): Response {
  const body: ApiResponse = {
    success: false,
    view,
    data: null,
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
export function unauthorized(
  message = 'Unauthorized',
  view = 'unknown'
): Response {
  return error([{ message }], 401, view);
}

/**
 * Create a forbidden error response
 */
export function forbidden(
  message = 'Forbidden',
  view = 'unknown'
): Response {
  return error([{ message }], 403, view);
}

/**
 * Create a not found error response
 */
export function notFound(message = 'Not found', view = 'unknown'): Response {
  return error([{ message }], 404, view);
}

/**
 * Create a method not allowed error response
 */
export function methodNotAllowed(view = 'unknown'): Response {
  return error([{ message: 'Method not allowed' }], 405, view);
}

/**
 * Create a conflict error response (e.g., duplicate entry)
 */
export function conflict(
  message: string,
  field?: string,
  view = 'unknown'
): Response {
  return error([{ field, message }], 409, view);
}

/**
 * Create a server error response
 */
export function serverError(
  message = 'Internal server error',
  view = 'unknown'
): Response {
  return error([{ message }], 500, view);
}
