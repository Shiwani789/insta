import { Router } from 'express';
import { commentController } from './comment.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { createCommentSchema } from './comment.validation';

const router = Router();

// Post comment routes
router.post('/posts/:postId/comments', authMiddleware, validate(createCommentSchema), commentController.createComment);
router.get('/posts/:postId/comments', commentController.getComments);

// Comment specific routes
router.patch('/comments/:commentId', authMiddleware, commentController.updateComment);
router.delete('/comments/:commentId', authMiddleware, commentController.deleteComment);
router.post('/comments/:commentId/like', authMiddleware, commentController.likeComment);
router.delete('/comments/:commentId/like', authMiddleware, commentController.unlikeComment);

export default router;
