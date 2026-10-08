"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatSocket = void 0;
const database_1 = require("../config/database");
const setupChatSocket = (io, socket, userId) => {
    socket.on('join_conversation', async ({ conversationId }) => {
        // Verify membership
        const member = await database_1.prisma.conversationMember.findUnique({
            where: { conversationId_userId: { conversationId, userId } }
        });
        if (member) {
            socket.join(`conversation:${conversationId}`);
        }
    });
    socket.on('leave_conversation', ({ conversationId }) => {
        socket.leave(`conversation:${conversationId}`);
    });
    socket.on('typing_start', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('typing_start', { conversationId, userId });
    });
    socket.on('typing_stop', ({ conversationId }) => {
        socket.to(`conversation:${conversationId}`).emit('typing_stop', { conversationId, userId });
    });
};
exports.setupChatSocket = setupChatSocket;
