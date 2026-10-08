import { Router } from 'express';
import { userController } from './user.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { upload } from '../../common/middleware/upload';

const router = Router();

router.get('/me', authMiddleware, userController.getMyProfile);
router.patch('/profile', authMiddleware, userController.updateProfile);

router.post('/profile-image', authMiddleware, upload.array('photo', 1), userController.updateProfilePhoto);
router.delete('/profile-image', authMiddleware, userController.deleteProfilePhoto);

router.get('/:username', userController.getProfile);
router.get('/:userId/posts', userController.getUserPosts);
router.get('/:userId/reels', userController.getUserReels);

export default router;
