"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeController = exports.LikeController = void 0;
const like_service_1 = require("./like.service");
class LikeController {
    async likePost(req, res, next) {
        try {
            const result = await like_service_1.likeService.likePost(req.user.id, req.params.postId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async unlikePost(req, res, next) {
        try {
            const result = await like_service_1.likeService.unlikePost(req.user.id, req.params.postId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async getPostLikes(req, res, next) {
        try {
            const result = await like_service_1.likeService.getPostLikes(req.params.postId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LikeController = LikeController;
exports.likeController = new LikeController();
