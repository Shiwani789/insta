import { Router } from 'express';
import { followController } from './follow.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/users/:id/follow', followController.follow);
router.delete('/users/:id/follow', followController.unfollow);
router.post('/follow-requests/:id/accept', followController.acceptRequest);
router.post('/follow-requests/:id/reject', followController.rejectRequest);

export default router;
