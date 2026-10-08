"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = require("zod");
const mediaSchema = zod_1.z.object({
    // Uploads currently return /uploads/... paths, so allow relative URLs too.
    url: zod_1.z.string().min(1),
    mimeType: zod_1.z.string().default('image/jpeg'),
    size: zod_1.z.number().optional(),
    width: zod_1.z.number().optional(),
    height: zod_1.z.number().optional(),
    duration: zod_1.z.number().optional(),
});
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.preprocess((value) => {
        if (!value || typeof value !== 'object')
            return value;
        const body = value;
        if (Array.isArray(body.media) || !Array.isArray(body.mediaUrls))
            return value;
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
    }, zod_1.z.object({
        caption: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        media: zod_1.z.array(mediaSchema).min(1, 'At least one media item is required'),
        mediaUrls: zod_1.z.array(zod_1.z.string().min(1)).optional(),
        hashtags: zod_1.z.array(zod_1.z.string()).optional(),
    }))
});
