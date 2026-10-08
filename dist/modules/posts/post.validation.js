"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        caption: zod_1.z.string().optional(),
        location: zod_1.z.string().optional(),
        media: zod_1.z.array(zod_1.z.object({
            url: zod_1.z.string().url(),
            mimeType: zod_1.z.string(),
            size: zod_1.z.number().optional(),
            width: zod_1.z.number().optional(),
            height: zod_1.z.number().optional(),
            duration: zod_1.z.number().optional(),
        })).min(1, 'At least one media item is required'),
        hashtags: zod_1.z.array(zod_1.z.string()).optional(),
    })
});
