import { z } from 'zod';

const mediaSchema = z.object({
  // Uploads currently return /uploads/... paths, so allow relative URLs too.
  url: z.string().min(1),
  mimeType: z.string().default('image/jpeg'),
  size: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
});

export const createPostSchema = z.object({
  body: z.preprocess((value) => {
    if (!value || typeof value !== 'object') return value;
    const body = value as Record<string, unknown>;
    if (Array.isArray(body.media) || !Array.isArray(body.mediaUrls)) return value;

    return {
      ...body,
      media: body.mediaUrls.map((url) => ({
        url,
        mimeType: typeof url === 'string' && /\.png(?:\?|$)/i.test(url)
          ? 'image/png'
          : typeof url === 'string' && /\.webp(?:\?|$)/i.test(url)
            ? 'image/webp'
            : 'image/jpeg',
      })),
    };
  }, z.object({
    caption: z.string().optional(),
    location: z.string().optional(),
    media: z.array(mediaSchema).min(1, 'At least one media item is required'),
    mediaUrls: z.array(z.string().min(1)).optional(),
    hashtags: z.array(z.string()).optional(),
  }))
});
