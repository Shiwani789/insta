import { Server, Socket } from 'socket.io';
import { prisma } from '../config/database';

export const setupChatSocket = (io: Server, socket: Socket, userId: string) => {
  socket.on('join_conversation', async ({ conversationId }) => {
    // Verify membership
    const member = await prisma.conversationMember.findUnique({
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
