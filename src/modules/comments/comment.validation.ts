import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment too long'),
    parentCommentId: z.string().uuid().optional(),
  })
});
