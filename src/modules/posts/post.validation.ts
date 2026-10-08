import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    caption: z.string().optional(),
    location: z.string().optional(),
    media: z.array(z.object({
      url: z.string().url(),
      mimeType: z.string(),
      size: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      duration: z.number().optional(),
    })).min(1, 'At least one media item is required'),
    hashtags: z.array(z.string()).optional(),
  })
});
