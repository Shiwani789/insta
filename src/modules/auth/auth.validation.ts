import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores and dots"),
    // The Flutter signup form sends its email-or-phone field as `email`.
    email: z.string().trim().min(1).refine(
      (value) => z.email().safeParse(value).success || /^\+?[0-9]{8,15}$/.test(value),
      'Enter a valid email address or phone number',
    ),
    fullName: z.string().trim().min(1).optional(),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"),
  })
});

export const loginSchema = z.object({
  body: z.object({
    usernameOrEmail: z.string().min(1),
    password: z.string().min(1),
  })
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  })
});
