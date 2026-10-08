"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = exports.MessageController = void 0;
const message_service_1 = require("./message.service");
class MessageController {
    async getConversations(req, res, next) {
        try {
            const convos = await message_service_1.messageService.getConversations(req.user.id);
            res.status(200).json({ success: true, data: convos });
        }
        catch (error) {
            next(error);
        }
    }
    async getConversationMessages(req, res, next) {
        try {
            const { cursor, limit } = req.query;
            const msgs = await message_service_1.messageService.getConversationMessages(req.user.id, req.params.conversationId, cursor, limit ? parseInt(limit, 10) : 20);
            res.status(200).json({ success: true, data: msgs });
        }
        catch (error) {
            next(error);
        }
    }
    async sendMessage(req, res, next) {
        try {
            const msg = await message_service_1.messageService.sendMessage(req.user.id, req.params.conversationId, req.body);
            res.status(201).json({ success: true, data: msg });
        }
        catch (error) {
            next(error);
        }
    }
    async createDirectConversation(req, res, next) {
        try {
            const { targetUserId } = req.body;
            const convo = await message_service_1.messageService.createDirectConversation(req.user.id, targetUserId);
            res.status(201).json({ success: true, data: convo });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MessageController = MessageController;
exports.messageController = new MessageController();
