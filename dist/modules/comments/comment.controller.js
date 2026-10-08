"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentController = exports.CommentController = void 0;
const comment_service_1 = require("./comment.service");
class CommentController {
    async createComment(req, res, next) {
        try {
            const { text, parentCommentId } = req.body;
            const result = await comment_service_1.commentService.createComment(req.user.id, req.params.postId, text, parentCommentId);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async getComments(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const result = await comment_service_1.commentService.getComments(req.params.postId, cursor, limit ? parseInt(limit, 10) : 20);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async updateComment(req, res, next) {
        try {
            const result = await comment_service_1.commentService.updateComment(req.user.id, req.params.commentId, req.body.text);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteComment(req, res, next) {
        try {
            await comment_service_1.commentService.deleteComment(req.user.id, req.params.commentId);
            res.status(200).json({ success: true, message: 'Comment deleted' });
        }
        catch (error) {
            next(error);
        }
    }
    async likeComment(req, res, next) {
        try {
            const result = await comment_service_1.commentService.likeComment(req.user.id, req.params.commentId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async unlikeComment(req, res, next) {
        try {
            const result = await comment_service_1.commentService.unlikeComment(req.user.id, req.params.commentId);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CommentController = CommentController;
exports.commentController = new CommentController();
