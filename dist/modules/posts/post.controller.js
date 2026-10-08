"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = exports.PostController = void 0;
const post_service_1 = require("./post.service");
class PostController {
    async createPost(req, res, next) {
        try {
            const post = await post_service_1.postService.createPost(req.user.id, req.body);
            res.status(201).json({ success: true, message: 'Post created successfully', data: post });
        }
        catch (error) {
            next(error);
        }
    }
    async getPostById(req, res, next) {
        try {
            const post = await post_service_1.postService.getPostById(req.params.id, req.user?.id);
            res.status(200).json({ success: true, data: post });
        }
        catch (error) {
            next(error);
        }
    }
    async deletePost(req, res, next) {
        try {
            await post_service_1.postService.deletePost(req.params.id, req.user.id);
            res.status(200).json({ success: true, message: 'Post deleted successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PostController = PostController;
exports.postController = new PostController();
