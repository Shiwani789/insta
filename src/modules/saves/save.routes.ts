import { Router } from 'express';
import { saveController } from './save.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/posts/:postId/save', saveController.savePost);
router.delete('/posts/:postId/save', saveController.unsavePost);
router.get('/users/me/saved', saveController.getSavedPosts);

export default router;
