import { z } from 'zod';

/** Single source of truth for auth form validation — never duplicated in screens. */

export const PASSWORD_MIN_LENGTH = 8;
export const OTP_LENGTH = 6;

export const signupSchema = z
  .object({
    email: z.email('Enter a valid email address'),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `At least ${PASSWORD_MIN_LENGTH} characters`)
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[0-9]/, 'Include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Include at least one special character'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine(values => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

/**
 * Login validates presence only — password rules are enforced at signup,
 * and leaking which rule failed would help nobody but an attacker.
 */
export const loginSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const otpSchema = z
  .string()
  .regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), `Enter the ${OTP_LENGTH}-digit code`);
