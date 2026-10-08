"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("./comment.controller");
const auth_1 = require("../../common/middleware/auth");
const validate_1 = require("../../common/middleware/validate");
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)();
// Post comment routes
router.post('/posts/:postId/comments', auth_1.authMiddleware, (0, validate_1.validate)(comment_validation_1.createCommentSchema), comment_controller_1.commentController.createComment);
router.get('/posts/:postId/comments', comment_controller_1.commentController.getComments);
// Comment specific routes
router.patch('/comments/:commentId', auth_1.authMiddleware, comment_controller_1.commentController.updateComment);
router.delete('/comments/:commentId', auth_1.authMiddleware, comment_controller_1.commentController.deleteComment);
router.post('/comments/:commentId/like', auth_1.authMiddleware, comment_controller_1.commentController.likeComment);
router.delete('/comments/:commentId/like', auth_1.authMiddleware, comment_controller_1.commentController.unlikeComment);
exports.default = router;
