import { Router } from 'express';
import { searchController } from './search.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.get('/search', authMiddleware, searchController.search);

export default router;
