import { Router } from 'express';
import { likeController } from './like.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.post('/posts/:postId/like', authMiddleware, likeController.likePost);
router.delete('/posts/:postId/like', authMiddleware, likeController.unlikePost);
router.get('/posts/:postId/likes', likeController.getPostLikes);

export default router;
