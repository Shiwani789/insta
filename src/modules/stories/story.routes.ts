import { Router } from 'express';
import { storyController } from './story.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { z } from 'zod';
import { validate } from '../../common/middleware/validate';

const router = Router();

router.use(authMiddleware);

const createStorySchema = z.object({
  body: z.object({
    mediaUrl: z.string().min(1),
    mediaType: z.string().default('image/jpeg'),
    caption: z.string().optional()
  })
});

const reactStorySchema = z.object({
  body: z.object({
    type: z.string().min(1)
  })
});

router.post('/', validate(createStorySchema), storyController.createStory);
router.get('/', storyController.getStories);
router.post('/:id/view', storyController.viewStory);
router.post('/:id/react', validate(reactStorySchema), storyController.reactToStory);
router.delete('/:id', storyController.deleteStory);

export default router;
