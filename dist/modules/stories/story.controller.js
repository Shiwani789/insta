"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyController = exports.StoryController = void 0;
const story_service_1 = require("./story.service");
class StoryController {
    async createStory(req, res, next) {
        try {
            const story = await story_service_1.storyService.createStory(req.user.id, req.body);
            res.status(201).json({ success: true, data: story });
        }
        catch (error) {
            next(error);
        }
    }
    async getStories(req, res, next) {
        try {
            const stories = await story_service_1.storyService.getStories(req.user.id);
            res.status(200).json({ success: true, data: stories });
        }
        catch (error) {
            next(error);
        }
    }
    async viewStory(req, res, next) {
        try {
            const result = await story_service_1.storyService.viewStory(req.user.id, req.params.id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async reactToStory(req, res, next) {
        try {
            const { type } = req.body;
            const result = await story_service_1.storyService.reactToStory(req.user.id, req.params.id, type);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteStory(req, res, next) {
        try {
            const result = await story_service_1.storyService.deleteStory(req.user.id, req.params.id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StoryController = StoryController;
exports.storyController = new StoryController();
