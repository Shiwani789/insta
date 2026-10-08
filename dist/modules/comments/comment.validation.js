"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentSchema = void 0;
const zod_1 = require("zod");
exports.createCommentSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1, 'Comment cannot be empty').max(500, 'Comment too long'),
        parentCommentId: zod_1.z.string().uuid().optional(),
    })
});
