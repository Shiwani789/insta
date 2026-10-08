import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().max(150).optional(),
    website: z.string().url().optional().or(z.literal('')),
    gender: z.string().optional(),
    dateOfBirth: z.string().datetime().optional(),
  })
});
