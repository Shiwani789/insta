"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        bio: zod_1.z.string().max(150).optional(),
        website: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
        gender: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.string().datetime().optional(),
    })
});
