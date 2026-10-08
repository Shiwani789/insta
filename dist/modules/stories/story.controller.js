"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyController = exports.StoryController = void 0;
const story_service_1 = require("./story.service");
const mobile_response_1 = require("../../common/utils/mobile-response");
class StoryController {
    async createStory(req, res, next) {
        try {
            const story = await story_service_1.storyService.createStory(req.user.id, req.body);
            res.status(201).json({ success: true, data: (0, mobile_response_1.mobileStory)(story, `${req.protocol}://${req.get('host')}`) });
        }
        catch (error) {
            next(error);
        }
    }
    async getStories(req, res, next) {
        try {
            const stories = await story_service_1.storyService.getStories(req.user.id);
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            res.status(200).json({ success: true, data: stories.map((story) => (0, mobile_response_1.mobileStory)(story, baseUrl)) });
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
