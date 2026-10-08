import { Router } from 'express';
import { exploreController } from './explore.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.get('/explore', authMiddleware, exploreController.getExploreContent);

export default router;
