import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  agreeToTerms: z.literal(true, 'You must agree to the terms'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type EmailFormValues = z.infer<typeof emailSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// User-friendly error messages mapping
export const authErrorMessages: Record<string, string> = {
  'Invalid login credentials': 'Incorrect email or password. Please try again.',
  'User already registered': 'An account with this email already exists. Try logging in instead.',
  'Email not confirmed': 'Please check your email to confirm your account.',
  'Password should be at least 6 characters': 'Password must be at least 6 characters.',
  'User not found': 'No account found with this email address.',
  default: 'Something went wrong. Please try again.',
};

export function getAuthErrorMessage(error: string): string {
  return authErrorMessages[error] || authErrorMessages.default;
}
