"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const story_controller_1 = require("./story.controller");
const auth_1 = require("../../common/middleware/auth");
const zod_1 = require("zod");
const validate_1 = require("../../common/middleware/validate");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
const createStorySchema = zod_1.z.object({
    body: zod_1.z.object({
        mediaUrl: zod_1.z.string().min(1),
        mediaType: zod_1.z.string().default('image/jpeg'),
        caption: zod_1.z.string().optional()
    })
});
const reactStorySchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.string().min(1)
    })
});
router.post('/', (0, validate_1.validate)(createStorySchema), story_controller_1.storyController.createStory);
router.get('/', story_controller_1.storyController.getStories);
router.post('/:id/view', story_controller_1.storyController.viewStory);
router.post('/:id/react', (0, validate_1.validate)(reactStorySchema), story_controller_1.storyController.reactToStory);
router.delete('/:id', story_controller_1.storyController.deleteStory);
exports.default = router;
