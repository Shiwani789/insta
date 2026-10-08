import { Router } from 'express';
import { reelController } from './reel.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

const createReelSchema = z.object({
  body: z.object({
    mediaUrl: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
    duration: z.number().optional(),
    caption: z.string().optional()
  })
});

router.post('/', validate(createReelSchema), reelController.createReel);
router.get('/feed', reelController.getReelFeed);
router.get('/:id', reelController.getReelById);
router.delete('/:id', reelController.deleteReel);
router.post('/:id/like', reelController.likeReel);
router.delete('/:id/like', reelController.unlikeReel);

export default router;
