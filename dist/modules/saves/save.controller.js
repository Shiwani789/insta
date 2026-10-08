"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveController = exports.SaveController = void 0;
const save_service_1 = require("./save.service");
class SaveController {
    async savePost(req, res, next) {
        try {
            const result = await save_service_1.saveService.savePost(req.user.id, req.params.postId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async unsavePost(req, res, next) {
        try {
            const result = await save_service_1.saveService.unsavePost(req.user.id, req.params.postId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async getSavedPosts(req, res, next) {
        try {
            const result = await save_service_1.saveService.getSavedPosts(req.user.id);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SaveController = SaveController;
exports.saveController = new SaveController();
