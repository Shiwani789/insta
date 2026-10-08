import { Router } from 'express';
import { messageController } from './message.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/conversations', messageController.getConversations);
router.post('/conversations', messageController.createDirectConversation);
router.get('/conversations/:conversationId/messages', messageController.getConversationMessages);
router.post('/conversations/:conversationId/messages', messageController.sendMessage);

export default router;
