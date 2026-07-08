import { z } from 'zod';

/** Single source of truth for profile form validation and its bounds. */

export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 80;
export const MIN_AGE_YEARS = 13;
export const HEIGHT_MIN_CM = 100;
export const HEIGHT_MAX_CM = 250;
export const WEIGHT_MIN_KG = 20;
export const WEIGHT_MAX_KG = 300;

/** Most recent birth date that still satisfies the minimum age. */
export function latestAllowedDateOfBirth(reference: Date = new Date()): Date {
  return new Date(
    reference.getFullYear() - MIN_AGE_YEARS,
    reference.getMonth(),
    reference.getDate(),
  );
}

/** Oldest selectable birth date offered by the picker. */
export function earliestAllowedDateOfBirth(reference: Date = new Date()): Date {
  return new Date(reference.getFullYear() - 120, reference.getMonth(), reference.getDate());
}

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(FULL_NAME_MIN_LENGTH, `Enter at least ${FULL_NAME_MIN_LENGTH} characters`)
    .max(FULL_NAME_MAX_LENGTH, `Keep it under ${FULL_NAME_MAX_LENGTH} characters`),
  dateOfBirth: z
    .date('Select your date of birth')
    .refine(
      date => date <= latestAllowedDateOfBirth(),
      `You must be at least ${MIN_AGE_YEARS} years old`,
    ),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], 'Select an option'),
  heightCm: z
    .string()
    .min(1, 'Enter your height')
    .regex(/^\d+$/, 'Whole numbers only')
    .refine(value => {
      const height = Number(value);
      return height >= HEIGHT_MIN_CM && height <= HEIGHT_MAX_CM;
    }, `Height must be between ${HEIGHT_MIN_CM} and ${HEIGHT_MAX_CM} cm`),
  weightKg: z
    .string()
    .min(1, 'Enter your weight')
    .regex(/^\d{1,3}(\.\d{1,2})?$/, 'Use a number like 82.5')
    .refine(value => {
      const weight = Number(value);
      return weight >= WEIGHT_MIN_KG && weight <= WEIGHT_MAX_KG;
    }, `Weight must be between ${WEIGHT_MIN_KG} and ${WEIGHT_MAX_KG} kg`),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
