import { prisma } from '../../config/database';

export class NotificationService {
  async getNotifications(userId: string, cursor?: string, limit = 20) {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, username: true, profilePhoto: true } }
      }
    });

    let hasNextPage = false;
    let nextCursor = null;

    if (notifications.length > limit) {
      hasNextPage = true;
      const nextItem = notifications.pop();
      nextCursor = nextItem?.id;
    }

    return {
      items: notifications,
      pagination: { nextCursor, hasMore: hasNextPage }
    };
  }

  async markAsRead(userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true }
    });
  }

  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { recipientId: userId, isRead: false }
    });
    return { count };
  }
}

export const notificationService = new NotificationService();
