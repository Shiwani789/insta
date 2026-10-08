"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reel_controller_1 = require("./reel.controller");
const auth_1 = require("../../common/middleware/auth");
const validate_1 = require("../../common/middleware/validate");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
const createReelSchema = zod_1.z.object({
    body: zod_1.z.object({
        mediaUrl: zod_1.z.string().url(),
        thumbnailUrl: zod_1.z.string().url().optional(),
        duration: zod_1.z.number().optional(),
        caption: zod_1.z.string().optional()
    })
});
router.post('/', (0, validate_1.validate)(createReelSchema), reel_controller_1.reelController.createReel);
router.get('/feed', reel_controller_1.reelController.getReelFeed);
router.get('/:id', reel_controller_1.reelController.getReelById);
router.delete('/:id', reel_controller_1.reelController.deleteReel);
router.post('/:id/like', reel_controller_1.reelController.likeReel);
router.delete('/:id/like', reel_controller_1.reelController.unlikeReel);
exports.default = router;
