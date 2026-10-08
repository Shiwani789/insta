"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const database_1 = require("../../config/database");
class NotificationService {
    async getNotifications(userId, cursor, limit = 20) {
        const notifications = await database_1.prisma.notification.findMany({
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
    async markAsRead(userId, notificationId) {
        return database_1.prisma.notification.updateMany({
            where: { id: notificationId, recipientId: userId },
            data: { isRead: true }
        });
    }
    async markAllAsRead(userId) {
        return database_1.prisma.notification.updateMany({
            where: { recipientId: userId, isRead: false },
            data: { isRead: true }
        });
    }
    async getUnreadCount(userId) {
        const count = await database_1.prisma.notification.count({
            where: { recipientId: userId, isRead: false }
        });
        return { count };
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
