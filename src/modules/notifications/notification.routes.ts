import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/notifications', notificationController.getNotifications);
router.post('/notifications/read-all', notificationController.markAllAsRead);
router.get('/notifications/unread-count', notificationController.getUnreadCount);
router.post('/notifications/:id/read', notificationController.markAsRead);

export default router;
