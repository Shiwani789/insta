import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../common/utils/jwt';
import { prisma } from '../config/database';
import { setupChatSocket } from './chat.socket';
import { setupPresenceSocket } from './presence.socket';

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id, isActive: true, isBlocked: false }
      });

      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.user.id;
    
    // Join personal room for user-specific events (e.g. notifications)
    socket.join(`user:${userId}`);

    // Setup module-specific sockets
    setupPresenceSocket(io, socket, userId);
    setupChatSocket(io, socket, userId);

    socket.on('disconnect', () => {
      // Disconnect handling is in presence socket primarily
    });
  });
};
