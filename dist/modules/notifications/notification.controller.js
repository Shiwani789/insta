"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
class NotificationController {
    async getNotifications(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const data = await notification_service_1.notificationService.getNotifications(req.user.id, cursor, limit ? parseInt(limit, 10) : 20);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            await notification_service_1.notificationService.markAsRead(req.user.id, req.params.id);
            res.status(200).json({ success: true, message: 'Notification marked as read' });
        }
        catch (error) {
            next(error);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            await notification_service_1.notificationService.markAllAsRead(req.user.id);
            res.status(200).json({ success: true, message: 'All notifications marked as read' });
        }
        catch (error) {
            next(error);
        }
    }
    async getUnreadCount(req, res, next) {
        try {
            const data = await notification_service_1.notificationService.getUnreadCount(req.user.id);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificationController = NotificationController;
exports.notificationController = new NotificationController();
