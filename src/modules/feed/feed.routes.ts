import { Router } from 'express';
import { feedController } from './feed.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.get('/feed', authMiddleware, feedController.getFeed);

export default router;
