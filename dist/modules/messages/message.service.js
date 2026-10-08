"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = exports.MessageService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class MessageService {
    async getConversations(userId) {
        const memberships = await database_1.prisma.conversationMember.findMany({
            where: { userId },
            include: {
                conversation: {
                    include: {
                        members: {
                            where: { userId: { not: userId } },
                            include: { user: { select: { id: true, username: true, profilePhoto: true } } }
                        },
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { conversation: { updatedAt: 'desc' } }
        });
        return memberships.map(m => m.conversation);
    }
    async getConversationMessages(userId, conversationId, cursor, limit = 20) {
        // Verify membership
        const member = await database_1.prisma.conversationMember.findUnique({
            where: { conversationId_userId: { conversationId, userId } }
        });
        if (!member)
            throw new CustomError_1.CustomError('Unauthorized', 403);
        const messages = await database_1.prisma.message.findMany({
            where: { conversationId, deletedAt: null },
            take: limit + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, username: true, profilePhoto: true } },
                attachments: true,
                reactions: true,
                reads: true
            }
        });
        let hasNextPage = false;
        let nextCursor = null;
        if (messages.length > limit) {
            hasNextPage = true;
            const nextItem = messages.pop();
            nextCursor = nextItem?.id;
        }
        return {
            items: messages,
            pagination: { nextCursor, hasMore: hasNextPage }
        };
    }
    async sendMessage(userId, conversationId, data) {
        const { type, text, attachments } = data;
        const member = await database_1.prisma.conversationMember.findUnique({
            where: { conversationId_userId: { conversationId, userId } }
        });
        if (!member)
            throw new CustomError_1.CustomError('Unauthorized', 403);
        const message = await database_1.prisma.message.create({
            data: {
                conversationId,
                senderId: userId,
                type: type || 'TEXT',
                text,
                ...(attachments && attachments.length > 0 && {
                    attachments: {
                        create: attachments.map((a) => ({ url: a.url, mimeType: a.mimeType }))
                    }
                })
            },
            include: { attachments: true }
        });
        await database_1.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });
        // We will emit real-time events later via socket
        return message;
    }
    async createDirectConversation(userId, targetUserId) {
        if (userId === targetUserId)
            throw new CustomError_1.CustomError('Cannot chat with yourself', 400);
        // Check if conversation already exists
        const existing = await database_1.prisma.conversation.findFirst({
            where: {
                isGroup: false,
                members: {
                    every: {
                        userId: { in: [userId, targetUserId] }
                    }
                }
            },
            include: { members: true }
        });
        // Check strict length (2 members)
        if (existing && existing.members.length === 2) {
            return existing;
        }
        // Create new
        return database_1.prisma.conversation.create({
            data: {
                isGroup: false,
                members: {
                    create: [{ userId }, { userId: targetUserId }]
                }
            },
            include: { members: true }
        });
    }
}
exports.MessageService = MessageService;
exports.messageService = new MessageService();
