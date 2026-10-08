import { Router } from 'express';
import { postController } from './post.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { createPostSchema } from './post.validation';

const router = Router();

router.post('/', authMiddleware, validate(createPostSchema), postController.createPost);
router.get('/:id', postController.getPostById);
router.delete('/:id', authMiddleware, postController.deletePost);

export default router;
